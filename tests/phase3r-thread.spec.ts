import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { journeyChapters } from "../lib/profile-content";
import { chooseThread, expectStackedThread, loadThread, seekThread, threadHolds, threadIds, threadProgress, threadScene } from "./thread-helpers";
import { chooseWork, seekWork, workScene } from "./work-helpers";

test.use({ screenshot: "off", video: "off", trace: "off" });

test("five truthful chapters, genuine artifacts and native anchors render once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await loadThread(page);
  const scene = threadScene(page); await expectStackedThread(page);
  for (const [index, chapter] of journeyChapters.entries()) {
    const panel = scene.locator(`#${threadIds[index]}`);
    await expect(panel.getByRole("heading", { level: 3 })).toHaveText(chapter.title);
    await expect(panel).toContainText(chapter.body); await expect(panel).toContainText(chapter.artifact);
    await expect(panel.getByRole("link", { name: chapter.link, exact: true })).toHaveAttribute("href", chapter.href);
    await expect(scene.locator(`[data-thread-artifact][data-sheet="${index}"]`)).toHaveCount(1);
    await expect(scene.locator(`[data-thread-navigation] a[href="#${threadIds[index]}"]`)).toHaveCount(1);
  }
  await expect(scene.locator("[data-thread-route]")).toHaveCount(1);
  await expect(scene.locator("[data-thread-artifact] img")).toHaveCount(3);
  await expect(scene.locator('[data-thread-panel][data-thread-index="3"]')).toContainText("Conceptual product connections, not a product screen");
  await expect(scene).toContainText("Firebase Realtime Database");
  const source = await readFile("components/portfolio/trail-motion.tsx", "utf8");
  expect(source).not.toMatch(/from ["']motion\/react|from ["']gsap|ScrollTrigger\.create|addEventListener\(["'](?:wheel|touchmove)/);
  expect(source).toContain('id="follow-the-thread"');
});

test("one finite scene drives the continuous filament, cursor, markers and navigation", async ({ page }) => {
  await loadThread(page); const scene = threadScene(page);
  await expect(scene).toHaveAttribute("data-scene-mode", "pinned");
  const geometry = await scene.evaluate(element => {
    const scene = element as HTMLElement;
    return { distance: Number(scene.dataset.sceneEnd) - Number(scene.dataset.sceneStart), available: innerHeight - document.querySelector<HTMLElement>(".site-header")!.offsetHeight - 2 * parseFloat(getComputedStyle(document.documentElement).fontSize) };
  });
  expect(geometry.distance / geometry.available).toBeCloseTo(2.8, 2);
  for (let index = 0; index < 5; index++) {
    await seekThread(page, threadProgress[index]);
    await expect(scene).toHaveAttribute("data-thread-chapter", threadIds[index]);
    await expect(scene.locator("[data-thread-marker-current='true']")).toHaveCount(1);
    await expect(scene.locator(`[data-thread-marker="${index}"]`)).toHaveAttribute("data-thread-marker-current", "true");
    await expect(scene.locator("[data-thread-navigation] a[aria-current='step']")).toHaveCount(1);
    await expect(scene.locator("[data-thread-navigation] a").nth(index)).toHaveAttribute("aria-current", "step");
    const pixels = await scene.evaluate(element => {
      const scene = element as HTMLElement;
      const progress = (scrollY - Number(scene.dataset.sceneStart)) / (Number(scene.dataset.sceneEnd) - Number(scene.dataset.sceneStart));
      const path = element.querySelector<SVGPathElement>("[data-thread-route]")!, cursor = element.querySelector<SVGCircleElement>("[data-thread-cursor]")!;
      const expected = path.getPointAtLength(path.getTotalLength() * progress);
      return { progress, offset: Number.parseFloat(getComputedStyle(element.querySelector("[data-thread-filament]")!).strokeDashoffset), error: Math.hypot(cursor.cx.baseVal.value - expected.x, cursor.cy.baseVal.value - expected.y), events: getComputedStyle(element.querySelector("svg")!).pointerEvents };
    });
    expect(pixels.offset).toBeCloseTo(1 - pixels.progress, 3); expect(pixels.error).toBeLessThan(0.5); expect(pixels.events).toBe("none");
  }
});

test("reading holds keep title, story and artifact steady; every transition reverses exactly", async ({ page }) => {
  await loadThread(page); const scene = threadScene(page);
  for (const [index, hold] of threadHolds.entries()) {
    const panel = scene.locator(`#${threadIds[index]}`), targets = panel.locator("[data-thread-copy], [data-thread-artifact], [data-thread-annotation]");
    await seekThread(page, hold[0] + 0.015);
    const held = await targets.evaluateAll(elements => elements.map(element => ({ transform: getComputedStyle(element).transform, opacity: getComputedStyle(element).opacity })));
    await seekThread(page, hold[1] - 0.015);
    expect(await targets.evaluateAll(elements => elements.map(element => ({ transform: getComputedStyle(element).transform, opacity: getComputedStyle(element).opacity })))).toEqual(held);
    expect(held.every(value => value.opacity === "1")).toBe(true); await expect(scene).toHaveAttribute("data-thread-hold", "true");
    const title = (await panel.getByRole("heading").boundingBox())!;
    expect(title.y).toBeGreaterThanOrEqual(96); expect(title.y + title.height).toBeLessThanOrEqual(900);
  }
  const snapshots = new Map<number, string[]>();
  for (const progress of [0.15, 0.19, 0.37, 0.41, 0.59, 0.63, 0.81, 0.85, 1, 0.85, 0.81, 0.63, 0.59, 0.41, 0.37, 0.19, 0.15]) {
    await seekThread(page, progress);
    const state = await scene.locator("[data-thread-plane], [data-thread-copy], [data-thread-artifact]").evaluateAll(elements => elements.map(element => getComputedStyle(element).transform + "/" + getComputedStyle(element).opacity + "/" + getComputedStyle(element).visibility));
    if (snapshots.has(progress)) expect(state).toEqual(snapshots.get(progress)); else snapshots.set(progress, state);
  }
});

for (const [index, id] of threadIds.entries()) {
  test(`direct #${id} resolves progress and focuses its real semantic destination`, async ({ page }) => {
    await loadThread(page, 1440, 900, `#${id}`);
    await expect(page.locator(`#${id}`)).toBeFocused();
    await expect(threadScene(page)).toHaveAttribute("data-thread-chapter", id);
    await expect.poll(async () => Number(await threadScene(page).getAttribute("data-thread-progress"))).toBeCloseTo(threadProgress[index], 3);
    await expect(page.locator(`#${id} h3`)).toBeInViewport();
    const error = await threadScene(page).evaluate((element, progress) => Math.abs(scrollY - (Number((element as HTMLElement).dataset.sceneStart) + (Number((element as HTMLElement).dataset.sceneEnd) - Number((element as HTMLElement).dataset.sceneStart)) * progress)), threadProgress[index]);
    expect(error).toBeLessThan(2);
  });
}

test("chapter links, back/forward and keyboard focus resolve the same progress", async ({ page }) => {
  await loadThread(page); await chooseThread(page, 0); await chooseThread(page, 3); await chooseThread(page, 1);
  await page.goBack(); await expect(page.locator("#trail-current")).toBeFocused();
  await expect.poll(async () => Number(await threadScene(page).getAttribute("data-thread-progress"))).toBeCloseTo(0.72, 3);
  await page.goForward(); await expect(page.locator("#trail-everyday")).toBeFocused();
  await expect.poll(async () => Number(await threadScene(page).getAttribute("data-thread-progress"))).toBeCloseTo(0.28, 3);
  await page.locator("#trail-everyday").getByRole("link", { name: "Explore Sukoon", exact: true }).focus();
  await seekThread(page, 0.72); await expect(page.locator("#trail-current")).toBeFocused();
  expect(await threadScene(page).locator("[data-thread-panel][aria-hidden='true'] [data-thread-content]").evaluateAll(elements => elements.every(element => (element as HTMLElement).inert))).toBe(true);
});

test("native wheel scrolling and the final release leave Always Building unobstructed", async ({ page }) => {
  await loadThread(page); await seekThread(page, 0.5); const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 160); await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 50);
  await seekThread(page, 1.2); await expect(threadScene(page).locator("[data-thread-stage]")).not.toHaveCSS("position", "fixed");
  await expect(threadScene(page)).toHaveAttribute("data-thread-chapter", "trail-next");
  await threadScene(page).getByRole("link", { name: "Continue to Always Building" }).click();
  await expect(page).toHaveURL(/#playground$/); await expect(page.locator("#playground")).toBeFocused();
  await expect(page.locator("#playground h2")).toBeInViewport();
});

for (const [width, height] of [[320, 844], [375, 844], [390, 844], [414, 844], [768, 1000], [1024, 600], [1280, 720]]) {
  test(`full vertical story at ${width}x${height} has no pin spacer or clipped content`, async ({ page }) => {
    await loadThread(page, width, height); await expectStackedThread(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    for (const id of threadIds) { await page.locator(`#${id}`).scrollIntoViewIfNeeded(); await expect(page.locator(`#${id} [data-thread-artifact]`)).toBeVisible(); await expect(page.locator(`#${id} h3`)).toBeVisible(); }
  });
}

test("live reduced motion retains unfocused current reading and restores complete artifacts", async ({ page }) => {
  await loadThread(page); await seekThread(page, 0.72);
  const chapter = page.locator("#trail-current"), top = (await chapter.boundingBox())!.y;
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" }); await expectStackedThread(page);
  expect(Math.abs((await chapter.boundingBox())!.y - top)).toBeLessThan(4);
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
  for (const target of await threadScene(page).locator("[data-thread-copy], [data-thread-artifact], [data-thread-annotation]").all()) { await expect(target).toHaveCSS("transform", "none"); await expect(target).toHaveCSS("opacity", "1"); }
});

test("enlarged text stacks every chapter and retains focused reading", async ({ page }) => {
  await loadThread(page); await chooseThread(page, 2); const target = page.locator("#trail-underneath");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await expectStackedThread(page); await expect(target).toBeFocused();
  await expect(target.locator("h3")).toBeInViewport();
  const heading = (await target.locator("h3").boundingBox())!, clearance = await page.locator(".site-header").evaluate(element => element.getBoundingClientRect().bottom);
  expect(heading.y).toBeGreaterThanOrEqual(clearance);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test("touch scrolling stays native and touch-capable desktop never pins", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage(); await page.goto("http://127.0.0.1:3100/#journey", { waitUntil: "networkidle" }); await expectStackedThread(page);
  const box = (await page.locator("#trail-foundation").boundingBox())!, x = box.x + box.width / 2, y = Math.min(700, box.y + 180), before = await page.evaluate(() => scrollY);
  const session = await context.newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let step = 1; step <= 5; step++) { await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - step * 30 }] }); await page.waitForTimeout(30); }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 40); await context.close();
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: true }); const desktopPage = await desktop.newPage();
  await desktopPage.goto("http://127.0.0.1:3100/"); await expectStackedThread(desktopPage); await desktop.close();
});

test("route cleanup and repeated mounts keep one Thread registration and scoped observer", async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as Window & { threadObservers?: number }; state.threadObservers = 0;
    const Original = ResizeObserver;
    window.ResizeObserver = class extends Original {
      ownsThread = false;
      observe(element: Element, options?: ResizeObserverOptions) { if (element.hasAttribute("data-thread-content") && !this.ownsThread) { this.ownsThread = true; state.threadObservers!++; } super.observe(element, options); }
      disconnect() { if (this.ownsThread) { state.threadObservers!--; this.ownsThread = false; } super.disconnect(); }
    };
  });
  await loadThread(page); const expected = process.env.PORTFOLIO_SCENE_FIXTURE === "1" ? "3" : "2";
  for (let cycle = 0; cycle < 2; cycle++) {
    await expect(page.locator('[data-scroll-runtime="ready"]')).toHaveAttribute("data-scroll-scenes", expected);
    expect(await page.evaluate(() => (window as Window & { threadObservers?: number }).threadObservers)).toBe(1);
    await chooseThread(page, 3); await page.locator("#trail-current").getByRole("link", { name: "Inside SportLynk" }).click();
    await expect(page).toHaveURL(/\/work\/sportlynk$/); await expect(page.locator('[data-scroll-runtime="ready"]')).toHaveAttribute("data-scroll-scenes", "0");
    await expect.poll(() => page.evaluate(() => (window as Window & { threadObservers?: number }).threadObservers)).toBe(0);
    await page.goBack(); await expect(threadScene(page)).toHaveAttribute("data-scene-mode", "pinned");
    await expect(page.locator('[data-scroll-scene="follow-the-thread"]')).toHaveCount(1);
  }
});

test("Thread progression never rebuilds or changes the Selected Work scene", async ({ page }) => {
  await loadThread(page); await chooseWork(page, "fitpilot"); await seekWork(page, 0.36);
  const workBounds = await workScene(page).evaluate(element => [(element as HTMLElement).dataset.sceneStart, (element as HTMLElement).dataset.sceneEnd]);
  const runtime = page.locator('[data-scroll-runtime="ready"]'); await page.waitForTimeout(100); const refreshes = await runtime.getAttribute("data-scroll-refreshes");
  for (const progress of [0.06, 0.5, 0.94, 0.5, 0.06]) await seekThread(page, progress);
  expect(await runtime.getAttribute("data-scroll-refreshes")).toBe(refreshes);
  expect(await workScene(page).evaluate(element => [(element as HTMLElement).dataset.sceneStart, (element as HTMLElement).dataset.sceneEnd])).toEqual(workBounds);
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", "pinned");
});

test("failed artifact keeps all native chapters and adjacent Work usable", async ({ page }) => {
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      return this.closest("[data-thread-artifact]") ? Promise.reject(new Error("Thread artifact could not decode")) : decode.call(this);
    };
  });
  await page.addInitScript(() => { Object.defineProperty(navigator, "maxTouchPoints", { value: 0 }); });
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto("/", { waitUntil: "networkidle" });
  await expect(threadScene(page)).toHaveAttribute("data-scene-mode", "failed"); await expectStackedThread(page);
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", "pinned");
  for (const chapter of journeyChapters) await expect(threadScene(page)).toContainText(chapter.body);
  await chooseThread(page, 4); await expect(page.locator("#trail-next h3")).toBeInViewport();
});

test("no-JS has a complete single vertical filament, all paragraphs, artifacts and native links", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } }); const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/#journey", { waitUntil: "networkidle" });
  await expect(threadScene(page).locator("[data-thread-route]")).toHaveCount(1);
  await expect(threadScene(page).locator("[data-thread-filament]")).toHaveCSS("stroke-dashoffset", "0px");
  for (const [index, chapter] of journeyChapters.entries()) {
    await page.getByRole("navigation", { name: "Journey chapters" }).locator("a").nth(index).click();
    await expect(page).toHaveURL(new RegExp(`#${threadIds[index]}$`)); await expect(page.locator(`#${threadIds[index]}`)).toContainText(chapter.body);
    await expect(page.locator(`#${threadIds[index]} [data-thread-artifact]`)).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true); await context.close();
});

test("hidden-tab pause freezes visual writes and resumes at absolute native progress", async ({ page }) => {
  await loadThread(page); await seekThread(page, 0.28); const scene = threadScene(page);
  const before = await scene.locator("[data-thread-filament]").getAttribute("style");
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { value: true, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await scene.evaluate(element => { const scene = element as HTMLElement; scrollTo({ top: Number(scene.dataset.sceneStart) + (Number(scene.dataset.sceneEnd) - Number(scene.dataset.sceneStart)) * 0.72, behavior: "instant" }); });
  await page.waitForTimeout(120); expect(await scene.locator("[data-thread-filament]").getAttribute("style")).toBe(before);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { value: false, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect.poll(async () => Number(await scene.getAttribute("data-thread-progress"))).toBeCloseTo(0.72, 3);
  await expect(scene).toHaveAttribute("data-thread-chapter", "trail-current");
});

test("forced colours and a low-core capability retain the complete reading sequence", async ({ page }) => {
  await loadThread(page); await chooseThread(page, 2);
  await page.emulateMedia({ forcedColors: "active" }); await expectStackedThread(page);
  await expect(page.locator("#trail-underneath")).toBeFocused();
  for (const id of threadIds) await expect(page.locator(`#${id} [data-thread-copy]`)).toHaveCSS("opacity", "1");
  await page.emulateMedia({ forcedColors: "none" });
  await page.addInitScript(() => { Object.defineProperty(navigator, "hardwareConcurrency", { value: 2 }); });
  await page.reload({ waitUntil: "networkidle" }); await expectStackedThread(page);
});

for (const width of [390, 1440]) {
  test(`Thread names, structure and contrast remain accessible at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" }); await loadThread(page, width, 1000);
    const scan = await new AxeBuilder({ page }).include("#journey").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(scan.violations.map(violation => ({ id: violation.id, targets: violation.nodes.map(node => node.target) }))).toEqual([]);
  });
}
