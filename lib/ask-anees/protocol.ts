// Safe to import in the browser. No configuration, documents or vectors here.
export const QUESTION_LIMIT = 1200;
export const HISTORY_LIMIT = 6;
export const BODY_LIMIT = 16_384;
export const REQUEST_TIMEOUT = 45_000;
export type ChatMessage = { role: "user" | "assistant"; content: string };
export type ChatInput = { question: string; history: ChatMessage[] };
export type Source = { id: string; title: string; href: string };
export type ChatEvent =
  | { type: "start" }
  | { type: "delta"; text: string }
  | { type: "sources"; sources: Source[] }
  | { type: "complete" }
  | { type: "error"; code: string; message: string };

export function parseChatInput(value: unknown): ChatInput {
  if (!value || typeof value !== "object") throw new Error("Enter a question about Anees’s portfolio.");
  const input = value as Record<string, unknown>;
  if (typeof input.question !== "string") throw new Error("Enter a question about Anees’s portfolio.");
  const question = input.question.normalize("NFKC").trim();
  if (!question || question.length > QUESTION_LIMIT) throw new Error(`Keep your question between 1 and ${QUESTION_LIMIT} characters.`);
  const history = input.history ?? [];
  if (!Array.isArray(history) || history.length > HISTORY_LIMIT) throw new Error("The recent conversation is too long. Clear it and try again.");
  let length = 0;
  const messages = history.map((item): ChatMessage => {
    if (!item || typeof item !== "object" || !["user", "assistant"].includes(item.role) || typeof item.content !== "string" || !item.content.trim() || item.content.length > 2400) throw new Error("Invalid conversation history.");
    length += item.content.length;
    return { role: item.role, content: item.content.trim() };
  });
  if (length > 8000) throw new Error("The recent conversation is too long. Clear it and try again.");
  return { question, history: messages };
}

export async function readBoundedJson(request: Request, maxBytes = BODY_LIMIT, signal = request.signal): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new Error("Use a JSON request.");
  if (Number(request.headers.get("content-length")) > maxBytes) throw new Error("Request too large.");
  if (!request.body) throw new Error("Empty request.");
  const reader = request.body.getReader();
  const abort = () => { void reader.cancel().catch(() => {}); };
  signal.addEventListener("abort", abort, { once: true });
  const decoder = new TextDecoder();
  let bytes = 0, text = "";
  try {
    while (true) {
      if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
      const next = await reader.read();
      if (next.done) break;
      bytes += next.value.byteLength;
      if (bytes > maxBytes) { await reader.cancel(); throw new Error("Request too large."); }
      text += decoder.decode(next.value, { stream: true });
    }
    if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
    return JSON.parse(text + decoder.decode());
  } finally { signal.removeEventListener("abort", abort); reader.releaseLock(); }
}

export function encodeEvent(event: ChatEvent): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

// Incremental SSE parser handles UTF-8, CRLF and frames split at any network byte.
export async function* readSSE(stream: ReadableStream<Uint8Array>, signal?: AbortSignal): AsyncGenerator<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let pending = "", data: string[] = [], ended = false;
  const abort = () => { void reader.cancel().catch(() => {}); };
  signal?.addEventListener("abort", abort, { once: true });
  try {
    while (true) {
      if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
      const next = await reader.read();
      pending += next.done ? decoder.decode() : decoder.decode(next.value, { stream: true });
      if (pending.length > 65_536) throw new Error("Stream frame too large.");
      let newline: number;
      while ((newline = pending.indexOf("\n")) >= 0) {
        const line = pending.slice(0, newline).replace(/\r$/, "");
        pending = pending.slice(newline + 1);
        if (!line) { if (data.length) { yield data.join("\n"); data = []; } }
        else if (line.startsWith("data:")) data.push(line.slice(5).replace(/^ /, ""));
      }
      if (next.done) { ended = true; break; }
    }
    if (pending.startsWith("data:")) data.push(pending.slice(5).replace(/^ /, ""));
    if (data.length) yield data.join("\n");
  } finally {
    signal?.removeEventListener("abort", abort);
    if (!ended) await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
