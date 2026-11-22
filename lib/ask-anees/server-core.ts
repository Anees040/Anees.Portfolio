import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { BODY_LIMIT, encodeEvent, parseChatInput, readBoundedJson, REQUEST_TIMEOUT } from "./protocol.ts";

const COOKIE = "ask_anees_visitor";
const limits = new Map<string, { minute: number; minuteCount: number; day: number; dayCount: number }>();
let globalMinute = 0, globalCount = 0;
const unavailable = "Ask Anees is awaiting setup. You can contact Anees directly in the meantime.";

function configuration() {
  const url = process.env.ASK_ANEES_WORKER_URL;
  const secret = process.env.ASK_ANEES_WORKER_SECRET;
  if (!url || !secret || secret.length < 32) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== "/") return undefined;
    return { url: parsed.origin, secret };
  } catch { return undefined; }
}
function signature(id: string, secret: string) { return createHmac("sha256", secret).update(`ask-anees-visitor-v1:${id}`).digest("hex"); }
function visitor(request: Request, secret: string): string | undefined {
  const cookie = request.headers.get("cookie")?.split(";").map(part => part.trim()).find(part => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!cookie) return undefined;
  const [id, mac] = cookie.split(".");
  if (!/^[a-f0-9-]{36}$/.test(id) || !/^[a-f0-9]{64}$/.test(mac ?? "")) return undefined;
  return timingSafeEqual(Buffer.from(mac, "hex"), Buffer.from(signature(id, secret), "hex")) ? id : undefined;
}
function cookieHeader(id: string, secret: string, request: Request) {
  return `${COOKIE}=${id}.${signature(id, secret)}; Path=/api/ask-anees; HttpOnly; SameSite=Strict; Max-Age=86400${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
}
function allow(id: string): boolean {
  const minute = Math.floor(Date.now() / 60_000), day = Math.floor(Date.now() / 86_400_000);
  if (minute !== globalMinute) { globalMinute = minute; globalCount = 0; }
  if (++globalCount > 60) return false;
  for (const [key, record] of limits) if (record.day < day) limits.delete(key);
  const record = limits.get(id) ?? { minute, minuteCount: 0, day, dayCount: 0 };
  if (!limits.has(id) && limits.size >= 2000) return false;
  if (record.minute !== minute) { record.minute = minute; record.minuteCount = 0; }
  if (record.day !== day) { record.day = day; record.dayCount = 0; }
  limits.set(id, record);
  if (record.minuteCount >= 6 || record.dayCount >= 30) return false;
  record.minuteCount++; record.dayCount++;
  return true;
}

export function chatStatus(request: Request) {
  const config = configuration();
  const id = config ? visitor(request, config.secret) ?? randomUUID() : undefined;
  return Response.json({ available: !!config, message: config ? "Answers use curated public portfolio knowledge." : unavailable }, { headers: { "Cache-Control": "no-store", ...(id && config ? { "Set-Cookie": cookieHeader(id, config.secret, request) } : {}) } });
}

export async function chatProxy(request: Request): Promise<Response> {
  const headers = { "Cache-Control": "no-store" };
  // Identity comes from our signed HttpOnly cookie, never browser IP headers.
  if (request.headers.get("origin") !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") return Response.json({ message: "Please ask from Anees’s portfolio.", code: "origin" }, { status: 403, headers });
  const config = configuration();
  if (!config) return Response.json({ message: unavailable, code: "setup" }, { status: 503, headers });
  const id = visitor(request, config.secret);
  if (!id) return Response.json({ message: "Please reopen Ask Anees to start a session.", code: "session" }, { status: 401, headers });
  if (!allow(id)) return Response.json({ message: "You’ve reached the conversation limit. Please try later or contact Anees directly.", code: "rate_limit" }, { status: 429, headers: { ...headers, "Retry-After": "60" } });
  const controller = new AbortController();
  const abort = () => controller.abort();
  request.signal.addEventListener("abort", abort, { once: true });
  if (request.signal.aborted) abort();
  const timeout = setTimeout(abort, REQUEST_TIMEOUT);
  const cleanup = () => { clearTimeout(timeout); request.signal.removeEventListener("abort", abort); };
  try {
    let input;
    try { input = parseChatInput(await readBoundedJson(request, BODY_LIMIT, controller.signal)); }
    catch { cleanup(); return Response.json({ message: "Please enter a valid portfolio question and keep the conversation short.", code: "invalid_request" }, { status: 400, headers }); }
    const upstream = await fetch(`${config.url}/chat`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.secret}` }, body: JSON.stringify(input), signal: controller.signal, cache: "no-store", redirect: "error" });
    if (!upstream.ok || !upstream.body || !upstream.headers.get("content-type")?.startsWith("text/event-stream")) {
      let message = "Ask Anees is temporarily unavailable. Please try later or contact Anees directly.", code = "unavailable";
      // Only known application errors cross this boundary. Cloudflare HTML/raw errors do not.
      try {
        const failure = await readBoundedJson(new Request("https://response.invalid", { method: "POST", body: upstream.body, headers: { "Content-Type": upstream.headers.get("content-type") ?? "" }, duplex: "half" } as RequestInit), 4096, controller.signal) as { code?: string; message?: string };
        const known = ["daily_quota", "rate_limit", "capacity", "unindexed", "timeout"];
        if (known.includes(failure.code ?? "") && typeof failure.message === "string" && failure.message.length < 500) { code = failure.code!; message = failure.message; }
      } catch { /* Preserve the safe unavailable message. */ }
      cleanup();
      return Response.json({ code, message }, { status: upstream.status === 429 ? 429 : 503, headers });
    }
    const reader = upstream.body.getReader();
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
      async pull(output) {
        try {
          const next = await reader.read();
          if (cancelled) return;
          if (next.done) { cleanup(); reader.releaseLock(); output.close(); }
          else output.enqueue(next.value);
        } catch {
          cleanup();
          if (!cancelled) { output.enqueue(encodeEvent({ type: "error", code: "interrupted", message: "The response was interrupted. Please retry your question." })); output.close(); }
        }
      },
      async cancel() { cancelled = true; controller.abort(); cleanup(); await reader.cancel().catch(() => {}); },
    });
    return new Response(stream, { headers: { ...headers, "Content-Type": "text/event-stream; charset=utf-8", "X-Accel-Buffering": "no", "X-Content-Type-Options": "nosniff" } });
  } catch { cleanup(); return Response.json({ code: "unavailable", message: "Ask Anees is temporarily unavailable. Please try later or contact Anees directly." }, { status: 503, headers }); }
}
