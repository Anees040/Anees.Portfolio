import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function open(page: Page) {
  if (await page.locator(".ask-link").isVisible()) await page.locator(".ask-link").click();
  else { await page.locator(".mobile-menu summary").click(); await page.locator(".menu-panel").getByRole("link", { name: "Ask Anees" }).click(); }
  await expect(page.getByRole("dialog", { name: "Ask Anees" })).toBeVisible();
}
async function mock(page: Page, slow = false, fail = false) {
  await page.route("**/api/ask-anees", route => route.request().method() === "GET" ? route.fulfill({ json: { available: true, message: "Answers use curated public portfolio knowledge." } }) : route.continue());
  await page.addInitScript(({ slow, fail }) => {
    const original = window.fetch;
    window.fetch = async (url, init) => {
      if (String(url) !== "/api/ask-anees" || init?.method !== "POST") return original(url, init);
      if (fail) return new Response(JSON.stringify({ code: "daily_quota", message: "Ask Anees has reached its free daily AI allowance. Please return after 00:00 UTC." }), { status: 429, headers: { "Content-Type": "application/json" } });
      const encoder = new TextEncoder();
      let timer: ReturnType<typeof setTimeout>;
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          const send = (event: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
          send({ type: "start" }); send({ type: "delta", text: "SportLynk is a team Final Year Project. " });
          timer = setTimeout(() => {
            send({ type: "delta", text: "It is in development and not launched. " + "Long-answer-wrapping-example".repeat(70) });
            send({ type: "sources", sources: [{ id: "sportlynk", title: "SportLynk case study", href: "/work/sportlynk" }, { id: "invented", title: "Unsafe", href: "https://invented.example" }] }); send({ type: "complete" }); controller.close();
          }, slow ? 60_000 : 500);
        },
        cancel() { clearTimeout(timer); (window as unknown as { askCancelled: boolean }).askCancelled = true; },
      });
      return new Response(stream, { headers: { "Content-Type": "text/event-stream" } });
    };
  }, { slow, fail });
}

test("unconfigured chat stays truthful, focused and accessible", async ({ page }) => {
  await page.goto("/"); await open(page);
  await expect(page.locator("#ask-anees-question")).toBeFocused();
  await expect(page.getByRole("dialog")).toContainText("awaiting setup");
  await expect(page.getByRole("button", { name: "Send question" })).toBeDisabled();
  await expect(page.getByRole("dialog").getByRole("link", { name: "Email Anees" })).toHaveAttribute("href", "mailto:muhammadanees0511@gmail.com");
  expect((await new AxeBuilder({ page }).include("#ask-anees").analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).toBeHidden(); await expect(page.locator(".ask-link")).toBeFocused();
});

test("progressive tokens, registered citations, follow-up and clear controls", async ({ page }) => {
  await mock(page); await page.goto("/"); await open(page);
  await page.locator("#ask-anees-question").fill("Tell me about SportLynk."); await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByRole("region", { name: "Conversation" })).toContainText("team Final Year Project");
  await expect(page.getByRole("button", { name: "Stop generation" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Answer sources" }).getByRole("link")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "SportLynk case study" })).toHaveAttribute("href", "/work/sportlynk");
  await page.getByRole("button", { name: "Explore an engineering decision" }).click(); await expect(page.locator("#ask-anees-question")).toHaveValue("Which engineering decisions shaped that project?");
  await page.getByRole("button", { name: "Clear conversation" }).click(); await expect(page.getByRole("region", { name: "Conversation" })).toContainText("Start with the work.");
});

test("Stop and closing cancel active streams and permit another question", async ({ page }) => {
  await mock(page, true); await page.goto("/"); await open(page);
  await page.locator("#ask-anees-question").fill("Tell me about SportLynk."); await page.getByRole("button", { name: "Send question" }).click();
  await page.getByRole("button", { name: "Stop generation" }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { askCancelled: boolean }).askCancelled)).toBe(true);
  await expect(page.getByRole("region", { name: "Conversation" })).toContainText("Partial answer");
  await page.locator("#ask-anees-question").fill("What is FitPilot?"); await page.getByRole("button", { name: "Send question" }).click();
  await page.getByRole("button", { name: "Close Ask Anees" }).click(); await expect(page.getByRole("dialog")).toBeHidden();
});

test("free quota error offers a clear retry without fabricated answers", async ({ page }) => {
  await mock(page, false, true); await page.goto("/"); await open(page);
  await page.locator("#ask-anees-question").fill("Who is Anees?"); await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("free daily AI allowance"); await expect(page.getByRole("button", { name: "Retry question" })).toBeVisible();
  await page.getByRole("button", { name: "Retry question" }).click(); await expect(page.getByRole("dialog").getByRole("alert")).toContainText("00:00 UTC");
});

for (const width of [320, 375, 390, 414, 768, 1024, 1280, 1440, 1920]) test(`drawer layout and sources at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 }); await mock(page); await page.goto("/"); await open(page);
  await page.locator("#ask-anees-question").fill("Tell me about SportLynk."); await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByRole("navigation", { name: "Answer sources" })).toBeVisible();
  expect(await page.getByRole("dialog").evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
  await expect(page.locator("#ask-anees-question")).toBeInViewport(); await expect(page.getByRole("button", { name: "Close Ask Anees" })).toBeInViewport();
});

test("mobile enlarged text, reduced motion, keyboard focus and viewport shrink", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 }); await page.emulateMedia({ reducedMotion: "reduce" }); await mock(page); await page.goto("/"); await open(page);
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(await page.getByRole("dialog").evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
  await page.setViewportSize({ width: 320, height: 500 }); await expect(page.locator("#ask-anees-question")).toBeInViewport();
  await page.getByRole("button", { name: "Close Ask Anees" }).click(); await expect(page.locator(".mobile-menu summary")).toBeFocused();
});

test("without JavaScript the header retains direct contact navigation", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage(); await page.goto("/");
  await page.locator(".ask-link").click(); await expect(page).toHaveURL(/#contact$/); await expect(page.locator("#ask-anees")).toBeHidden(); await context.close();
});
