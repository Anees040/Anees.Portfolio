import { expect, test, type Page } from "@playwright/test";
import type { SceneMeasurements, ScrollScene } from "../lib/scroll-scene-contract";
import { normalizeProgress, progressToScroll, RefreshQueue, SceneRegistry, sceneFits, waitForSceneReadiness } from "../lib/scroll-scene-runtime";
import { chooseWork, workScene } from "./work-helpers";

const measurements: SceneMeasurements = {
  viewportWidth: 1440, viewportHeight: 900, headerHeight: 80, clearance: 96,
  availableHeight: 788, rootTextSize: 16, stageWidth: 1100, stageHeight: 500,
  contentHeight: 300, contentWidth: 1100, navigationHeight: 48, ctaHeight: 40, imageHeight: 160, imageWidth: 100,
  finePointer: true, touch: false, reducedMotion: false,
};

function mockScene(id = "test"): ScrollScene {
  const root = { contains: () => true, querySelectorAll: () => [] } as unknown as HTMLElement;
  return { id, root, stage: root, anchors: [{ id: `${id}-start`, progress: 0 }, { id: `${id}-end`, progress: 1 }], distance: () => 600, setup: () => {}, staticFallback: () => {} };
}

test("registry rejects duplicates, validates ownership and disposes idempotently", () => {
  const registry = new SceneRegistry(), scene = mockScene();
  const remove = registry.register(scene);
  expect(() => registry.register(scene)).toThrow("already registered");
  expect(() => registry.register({ ...scene, id: "same-scope", anchors: [] })).toThrow("scope already owned");
  expect(() => registry.register({ ...mockScene("other"), anchors: scene.anchors })).toThrow("already owned");
  expect(registry.values()).toEqual([scene]);
  remove(); remove();
  expect(registry.values()).toEqual([]);
  expect(() => registry.register({ ...scene, anchors: [{ id: "invalid", progress: 2 }] })).toThrow("Invalid scene anchor");
});

test("Strict Mode lifecycle sequence cannot retain or remove a later registration", () => {
  const registry = new SceneRegistry(), scene = mockScene();
  const firstCleanup = registry.register(scene);
  firstCleanup();
  const secondCleanup = registry.register(scene);
  firstCleanup();
  expect(registry.values()).toHaveLength(1);
  secondCleanup();
  expect(registry.values()).toHaveLength(0);
});

for (const [width, height, eligible] of [[1024, 600, false], [1280, 720, false], [1440, 900, true], [390, 844, false]] as const) {
  test(`actual fit at ${width}x${height} is ${eligible ? "pinned" : "stacked"}`, () => {
    expect(sceneFits({ ...measurements, viewportWidth: width, viewportHeight: height, availableHeight: height - 112, stageWidth: width - 100, contentWidth: width - 100 })).toBe(eligible);
  });
}

test("fit rejects enlarged text, expanded content, large images, touch and reduced motion", () => {
  for (const changes of [{ rootTextSize: 32 }, { contentHeight: 800 }, { imageHeight: 900 }, { stageHeight: 820 }, { navigationHeight: 480 }, { ctaHeight: 480 }, { touch: true }, { finePointer: false }, { reducedMotion: true }]) expect(sceneFits({ ...measurements, ...changes })).toBe(false);
});

test("absolute progress is bounded, deterministic and reverses without accumulated state", () => {
  expect([-1, 0, 0.5, 1, 2, NaN, Infinity].map(normalizeProgress)).toEqual([0, 0, 0.5, 1, 1, 0, 0]);
  expect([0, 0.5, 1, 0.5, 0].map(progress => progressToScroll(progress, 100, 500))).toEqual([100, 300, 500, 300, 100]);
  expect(progressToScroll(0.5, 100, 50)).toBe(100);
});

test("refresh requests coalesce; pending work is cancelled at disposal", () => {
  const callbacks = new Map<number, () => void>();
  let nextId = 0;
  const calls: (readonly string[])[] = [];
  const queue = new RefreshQueue(callback => { callbacks.set(++nextId, callback); return nextId; }, handle => { callbacks.delete(handle); }, reasons => calls.push(reasons));
  for (let index = 0; index < 50; index++) { queue.request("resize"); queue.request("image"); }
  expect(callbacks.size).toBe(1);
  callbacks.get(1)!(); callbacks.clear();
  expect(calls).toEqual([["resize", "image"]]);
  queue.request("remove"); queue.dispose(); queue.request("after-disposal");
  expect(callbacks.size).toBe(0);
  expect(calls).toHaveLength(1);
});

test("font and scene readiness succeeds; rejected and timed-out readiness remains usable", async () => {
  const scene = mockScene(), signal = new AbortController().signal;
  expect(await waitForSceneReadiness({ ...scene, ready: async () => {} }, signal, Promise.resolve())).toBe(0);
  expect(await waitForSceneReadiness({ ...scene, ready: async () => { throw new Error("failed"); } }, signal, Promise.resolve())).toBe(1);
  expect(await waitForSceneReadiness(scene, signal, Promise.reject(new Error("font failure")))).toBe(1);
  expect(await waitForSceneReadiness(scene, signal, new Promise(() => {}), 10)).toBe(1);
  const controller = new AbortController(); controller.abort();
  let setupCalled = false;
  expect(await waitForSceneReadiness({ ...scene, ready: async () => { setupCalled = true; } }, controller.signal, Promise.resolve())).toBe(1);
  expect(setupCalled).toBe(false);
});

test("image load, decode failure and image error all settle readiness", async () => {
  const scene = mockScene();
  const image = Object.assign(new EventTarget(), { complete: false, naturalWidth: 0 });
  const root = { ...scene.root, querySelectorAll: () => [image] } as unknown as HTMLElement;
  const success = waitForSceneReadiness({ ...scene, root }, new AbortController().signal, Promise.resolve());
  image.naturalWidth = 100; image.dispatchEvent(new Event("load"));
  expect(await success).toBe(0);
  const failure = waitForSceneReadiness({ ...scene, root }, new AbortController().signal, Promise.resolve());
  image.dispatchEvent(new Event("error"));
  expect(await failure).toBe(1);
  const brokenDecode = Object.assign(new EventTarget(), { complete: true, naturalWidth: 100, decode: () => Promise.reject(new Error("decode failed")) });
  const decodeRoot = { ...scene.root, querySelectorAll: () => [brokenDecode] } as unknown as HTMLElement;
  expect(await waitForSceneReadiness({ ...scene, root: decodeRoot }, new AbortController().signal, Promise.resolve())).toBe(1);
});

const thread = (page: Page) => page.locator('[data-scroll-scene="follow-the-thread"]');
const reference = (page: Page) => page.locator('[data-scroll-scene="motion-reference"]');
const runtime = (page: Page) => page.locator('.scroll-scene-provider[data-scroll-runtime="ready"]');

async function loadReference(page: Page, hash = "") {
  await page.addInitScript(() => { Object.defineProperty(navigator, "maxTouchPoints", { value: 0 }); });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`/${hash}`);
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "pinned", { timeout: 10000 });
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", "pinned", { timeout: 10000 });
  await expect(thread(page)).toHaveAttribute("data-scene-mode", "pinned");
  await expect(runtime(page)).toHaveAttribute("data-scroll-scenes", "3");
  await expect(runtime(page)).toHaveAttribute("data-scroll-triggers", "3");
}

async function seek(page: Page, progress: number) {
  await reference(page).evaluate((element, progress) => {
    const start = Number((element as HTMLElement).dataset.sceneStart), end = Number((element as HTMLElement).dataset.sceneEnd);
    scrollTo({ top: start + (end - start) * progress, behavior: "instant" });
  }, progress);
  if (progress >= 0 && progress <= 1) await expect.poll(async () => Number(await reference(page).getAttribute("data-reference-progress"))).toBeCloseTo(progress, 2);
}

test.describe("build-gated reference fixture", () => {
test.skip(process.env.PORTFOLIO_SCENE_FIXTURE !== "1", "Build and serve with PORTFOLIO_SCENE_FIXTURE=1 to exercise the isolated reference.");

test("unchanged static geometry still completes delayed scene readiness", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const fonts = document.fonts.ready;
    const delayed = new Promise<void>(resolve => {
      (window as Window & { releaseSceneFonts?: () => void }).releaseSceneFonts = () => { void fonts.then(() => resolve()); };
    });
    Object.defineProperty(document.fonts, "ready", { value: delayed });
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "pending");
  await expect.poll(() => page.evaluate(() => document.fonts.status)).toBe("loaded");
  const dimensions = await page.locator(".scroll-reference-stage").boundingBox();
  await page.evaluate(() => (window as Window & { releaseSceneFonts?: () => void }).releaseSceneFonts!());
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "static");
  await expect(page.locator('[data-scroll-scene="selected-work"]')).toHaveAttribute("data-scene-mode", "static");
  expect(await page.locator(".scroll-reference-stage").boundingBox()).toEqual(dimensions);
  await expect(runtime(page)).toHaveAttribute("data-scroll-triggers", "0");
});

test("reference pins once, coordinates distinct layers, reverses deterministically and releases", async ({ page }) => {
  await loadReference(page);
  await seek(page, 0.5);
  await expect(page.locator(".scroll-reference-stage")).toHaveCSS("position", "fixed");
  const transforms = () => page.locator(".scroll-reference-plane, .scroll-reference-foreground, .scroll-reference-meter span").evaluateAll(elements => elements.map(element => getComputedStyle(element).transform));
  const middle = await transforms();
  expect(middle[0]).not.toBe(middle[1]);
  await seek(page, 1); await seek(page, 0.5);
  expect(await transforms()).toEqual(middle);
  await seek(page, 1.2);
  await expect(page.locator(".scroll-reference-stage")).not.toHaveCSS("position", "fixed");
  await expect(page.locator(".scroll-reference-after")).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
});

test("late upstream project readiness cannot invalidate a direct downstream chapter hash", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "maxTouchPoints", { value: 0 });
    const state = window as Window & { releaseWorkImages?: () => void };
    const delayed = new Promise<void>(resolve => { state.releaseWorkImages = resolve; });
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      return this.closest('[data-scroll-scene="selected-work"]') ? delayed.then(() => decode.call(this)) : decode.call(this);
    };
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#motion-reference-middle", { waitUntil: "networkidle" });
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "pinned");
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", "pending");
  await page.evaluate(() => (window as Window & { releaseWorkImages?: () => void }).releaseWorkImages!());
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", "pinned");
  await expect(runtime(page)).toHaveAttribute("data-scroll-triggers", "3");
  await expect(page.locator("#motion-reference-middle")).toBeFocused();
  await expect.poll(async () => Number(await reference(page).getAttribute("data-reference-progress"))).toBeCloseTo(0.5, 2);
  const error = await reference(page).evaluate(element => {
    const scene = element as HTMLElement;
    return Math.abs(scrollY - (Number(scene.dataset.sceneStart) + Number(scene.dataset.sceneEnd)) / 2);
  });
  expect(error).toBeLessThan(1);
});

test("scene disposal, remount and repeated preference changes leave exactly one trigger set", async ({ page }) => {
  await loadReference(page);
  const toggle = page.getByLabel("Enable reference enhancement");
  for (let index = 0; index < 3; index++) {
    await toggle.uncheck();
    await expect(runtime(page)).toHaveAttribute("data-scroll-scenes", "2");
    await expect(runtime(page)).toHaveAttribute("data-scroll-triggers", "2");
    await expect(workScene(page)).toHaveAttribute("data-scene-mode", "pinned");
    await expect(page.locator(".pin-spacer")).toHaveCount(2);
    await toggle.check();
    await expect(reference(page)).toHaveAttribute("data-scene-mode", "pinned");
    await expect(runtime(page)).toHaveAttribute("data-scroll-triggers", "3");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "static");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "pinned");
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
});

test("live reduced motion keeps focus and the reading position in a complete static scene", async ({ page }) => {
  await loadReference(page, "#motion-reference-middle");
  const target = page.locator("#motion-reference-middle");
  await expect(target).toBeFocused();
  const before = (await target.boundingBox())!.y;
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "static");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(target).toBeFocused();
  expect(Math.abs((await target.boundingBox())!.y - before)).toBeLessThan(3);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(100);
  await expect(page.locator(".scroll-reference-foreground")).toHaveCSS("transform", "none");
});

for (const [width, height] of [[1024, 600], [1280, 720], [390, 844]]) {
  test(`reference falls back at ${width}x${height} and keeps real hash targets`, async ({ page }) => {
    await page.addInitScript(() => { Object.defineProperty(navigator, "maxTouchPoints", { value: 0 }); });
    await page.setViewportSize({ width, height });
    await page.goto("/#motion-reference-middle");
    await expect(reference(page)).toHaveAttribute("data-scene-mode", "static");
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator("#motion-reference-middle")).toBeFocused();
    await expect(page.locator("#motion-reference-middle")).toBeInViewport();
  });
}

test("reduced motion preserves unfocused reading without assigning new focus", async ({ page }) => {
  await loadReference(page); await seek(page, 0.5);
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); });
  const target = reference(page).locator("#motion-reference-start");
  const before = (await target.boundingBox())!.y;
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "static");
  expect(Math.abs((await target.boundingBox())!.y - before)).toBeLessThan(3);
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
});

test("resize, enlarged text and disclosure changes rebuild only when geometry requires it", async ({ page }) => {
  await loadReference(page, "#motion-reference-middle");
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "static");
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "pinned");
  await page.locator(".scroll-reference-stage summary").click();
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "static");
  await page.locator(".scroll-reference-stage summary").click();
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "pinned");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "static");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("refresh bursts coalesce and observers do not create a pin-spacer loop", async ({ page }) => {
  await loadReference(page);
  await page.waitForTimeout(300);
  const count = async () => Number(await runtime(page).getAttribute("data-scroll-refreshes"));
  const initial = await count();
  await page.evaluate(() => { for (let index = 0; index < 50; index++) window.dispatchEvent(new Event("resize")); });
  await expect.poll(count).toBeGreaterThan(initial);
  await page.waitForTimeout(400);
  const settled = await count();
  expect(settled - initial).toBeLessThanOrEqual(2);
  await page.waitForTimeout(500);
  expect(await count()).toBe(settled);
});

test("native chapter links, direct hashes and browser back/forward resolve progress and focus", async ({ page }) => {
  await loadReference(page, "#motion-reference-middle");
  await expect(page.locator("#motion-reference-middle")).toBeFocused();
  await expect.poll(async () => Number(await reference(page).getAttribute("data-reference-progress"))).toBeCloseTo(0.5, 2);
  await page.getByRole("link", { name: "Chapter 3", exact: true }).click();
  await expect(page).toHaveURL(/#motion-reference-end$/);
  await expect(page.locator("#motion-reference-end")).toBeFocused();
  await page.goBack();
  await expect(page.locator("#motion-reference-middle")).toBeFocused();
  await expect.poll(async () => Number(await reference(page).getAttribute("data-reference-progress"))).toBeCloseTo(0.5, 2);
  await page.goForward();
  await expect(page.locator("#motion-reference-end")).toBeFocused();
});

test("scroll progress does not schedule refreshes or rebuild a pinned timeline", async ({ page }) => {
  await loadReference(page); await seek(page, 0.3); await page.waitForTimeout(300);
  const initial = await runtime(page).getAttribute("data-scroll-refreshes");
  await seek(page, 0.8); await seek(page, 0.3); await page.waitForTimeout(300);
  expect(await runtime(page).getAttribute("data-scroll-refreshes")).toBe(initial);
});

test("scene anchors resolve inside their owned scope, never a hidden duplicate", async ({ page }) => {
  await loadReference(page);
  await page.evaluate(() => {
    const duplicate = document.createElement("div");
    duplicate.id = "motion-reference-middle";
    duplicate.hidden = true;
    duplicate.dataset.duplicate = "true";
    document.body.prepend(duplicate);
  });
  await page.getByRole("link", { name: "Chapter 2", exact: true }).click();
  await expect(reference(page).locator("#motion-reference-middle")).toBeFocused();
  await expect(page.locator('[data-duplicate="true"]')).toHaveCount(1);
  await expect(page.locator('[data-duplicate="true"]')).not.toBeFocused();
});

test("hidden scenes stop visual writes and resume at absolute progress", async ({ page }) => {
  await loadReference(page); await seek(page, 0.3);
  const transform = await page.locator(".scroll-reference-foreground").evaluate(element => getComputedStyle(element).transform);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await reference(page).evaluate(element => { scrollTo({ top: Number((element as HTMLElement).dataset.sceneEnd), behavior: "instant" }); });
  await page.waitForTimeout(100);
  expect(await page.locator(".scroll-reference-foreground").evaluate(element => getComputedStyle(element).transform)).toBe(transform);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: false }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect.poll(async () => Number(await reference(page).getAttribute("data-reference-progress"))).toBe(1);
});

test("route exit cleans the runtime; re-entry registers all three scenes exactly once", async ({ page }) => {
  await loadReference(page);
  await chooseWork(page, "fitpilot");
  await page.locator("#fitpilot [data-work-case-link]").click();
  await expect(page).toHaveURL(/\/work\/fitpilot$/);
  await expect(runtime(page)).toHaveAttribute("data-scroll-scenes", "0");
  await expect(runtime(page)).toHaveAttribute("data-scroll-triggers", "0");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.getByRole("link", { name: "All work", exact: true }).click();
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "pinned");
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", "pinned");
  await expect(runtime(page)).toHaveAttribute("data-scroll-scenes", "3");
  await expect(runtime(page)).toHaveAttribute("data-scroll-triggers", "3");
});

test("touch-capable desktop uses the complete static layout", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: true });
  try {
    const page = await context.newPage(); await page.goto("http://127.0.0.1:3100/#motion-reference-middle");
    await expect(reference(page)).toHaveAttribute("data-scene-mode", "static");
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator("#motion-reference-middle")).toBeFocused();
  } finally { await context.close(); }
});

test("late fonts delay pinning; readiness completion resolves the real hash destination", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "maxTouchPoints", { value: 0 });
    const state = window as Window & { releaseScrollFonts?: () => void };
    Object.defineProperty(document.fonts, "ready", { value: new Promise<void>(resolve => { state.releaseScrollFonts = resolve; }) });
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#motion-reference-middle");
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "pending");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.evaluate(() => { (window as Window & { releaseScrollFonts?: () => void }).releaseScrollFonts!(); });
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "pinned");
  await expect(page.locator("#motion-reference-middle")).toBeFocused();
});

test("failed scene setup cleans only its owned animations and retains static content", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "maxTouchPoints", { value: 0 });
    const state = window as Window & { releaseScrollFonts?: () => void };
    Object.defineProperty(document.fonts, "ready", { value: new Promise<void>(resolve => { state.releaseScrollFonts = resolve; }) });
  });
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto("/");
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "pending");
  await page.locator(".scroll-reference-plane").evaluate(element => element.remove());
  await page.evaluate(() => { (window as Window & { releaseScrollFonts?: () => void }).releaseScrollFonts!(); });
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "failed");
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", "pinned");
  await expect(runtime(page)).toHaveAttribute("data-scroll-triggers", "2");
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
  await expect(reference(page).locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".scroll-reference-chapters article")).toHaveCount(3);
  await expect(page.locator(".scroll-reference-foreground")).toHaveCSS("transform", "none");
});

test("disposal cancels pending readiness; a late completion cannot restore an old registration", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "maxTouchPoints", { value: 0 });
    const state = window as Window & { releaseScrollFonts?: () => void };
    Object.defineProperty(document.fonts, "ready", { value: new Promise<void>(resolve => { state.releaseScrollFonts = resolve; }) });
  });
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto("/");
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "pending");
  const toggle = page.getByLabel("Enable reference enhancement");
  await toggle.uncheck();
  await page.evaluate(() => { (window as Window & { releaseScrollFonts?: () => void }).releaseScrollFonts!(); });
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", "pinned");
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "static");
  await expect(runtime(page)).toHaveAttribute("data-scroll-scenes", "2");
  await expect(runtime(page)).toHaveAttribute("data-scroll-triggers", "2");
  await toggle.check();
  await expect(reference(page)).toHaveAttribute("data-scene-mode", "pinned");
  await expect(runtime(page)).toHaveAttribute("data-scroll-triggers", "3");
});

test("without JavaScript the fixture has readable chapters, working anchors and disclosures", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage(); await page.goto("http://127.0.0.1:3100/#motion-reference-middle");
    await expect(reference(page)).toHaveAttribute("data-scene-mode", "static");
    await expect(page.locator("#motion-reference-middle")).toBeInViewport();
    await page.getByRole("link", { name: "Chapter 3", exact: true }).click();
    await expect(page).toHaveURL(/#motion-reference-end$/);
    await page.locator(".scroll-reference-stage summary").click();
    await expect(page.locator(".scroll-reference-expanded")).toBeVisible();
  } finally { await context.close(); }
});

});

test("all public routes identify Muhammad Anees, not an invented studio", async ({ page }) => {
  const forbidden = /Copper Atelier|Anees.?s? Digital Atelier|Digital Atelier|Copper Studio/i;
  for (const path of ["/", "/work/sportlynk", "/work/fitpilot", "/work/sukoon", "/work/eduverse"]) {
    await page.goto(path);
    expect(await page.title()).not.toMatch(forbidden);
    expect(await page.locator("body").innerText()).not.toMatch(forbidden);
    expect(await page.locator("meta").evaluateAll(elements => elements.map(element => element.getAttribute("content")).join(" "))).not.toMatch(forbidden);
    expect(await page.locator("[aria-label]").evaluateAll(elements => elements.map(element => element.getAttribute("aria-label")).join(" "))).not.toMatch(forbidden);
  }
});
