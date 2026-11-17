import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { parseCssTime } from "../lib/motion-system";
import { characterAssets, workspaceCharacterAssets, characterAssetErrors, resolveCharacterFrame } from "../lib/character-assets";

const output = ".qa/phase3-finish/baseline";
const ids = ["sportlynk", "fitpilot", "sukoon", "eduverse"];
test.beforeAll(async () => { await mkdir(output, { recursive: true }); });

async function ready(page: Page, width = 1440) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

test("CSS durations preserve seconds, milliseconds and the documented unitless convention", () => {
  for (const [input, seconds] of [["600ms", 0.6], ["300ms", 0.3], ["1200ms", 1.2], [".6s", 0.6], ["1.2s", 1.2], ["600", 0.6], ["0", 0], [" 160ms ", 0.16]] as const) expect(parseCssTime(input)).toBe(seconds);
  for (const invalid of ["", "-1s", "fast", "1px", "NaN"]) expect(() => parseCssTime(invalid)).toThrow();
});

type Timing = { target: string; entrance: boolean; duration: number | string; delay: number };
async function recordTimings(page: Page) {
  await page.addInitScript(() => {
    const logs: { target: string; entrance: boolean; duration: number | string; delay: number }[] = [];
    (window as Window & { motionTimings?: typeof logs }).motionTimings = logs;
    const original = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      const animation = original.call(this, frames, options);
      const timing = animation.effect!.getTiming();
      logs.push({ target: this.className.toString(), entrance: this.hasAttribute("data-entrance"), duration: timing.duration as number | string, delay: timing.delay ?? 0 });
      return animation;
    };
  });
}

for (const reduced of [false, true]) {
  test(`production browser uses ${reduced ? "160ms reduced" : "600ms normal"} reveal durations`, async ({ page }) => {
    await recordTimings(page);
    await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
    await ready(page);
    const timings = await page.evaluate(() => (window as Window & { motionTimings?: Timing[] }).motionTimings!);
    const hero = timings.filter(t => t.entrance);
    expect(hero.length).toBeGreaterThanOrEqual(9);
    expect(hero.every(t => Math.abs(Number(t.duration) - (reduced ? 160 : 600)) < 1)).toBe(true);
    if (!reduced) expect(hero.some(t => t.delay === 560)).toBe(true);
    await writeFile(`${output}/production-timing-${reduced ? "reduced" : "normal"}.json`, JSON.stringify(timings, null, 2));
  });
}

test("live reduced motion and visibility changes settle real entrance animations", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector(".hero-actions")?.getAnimations().some(a => a.playState === "running" && Number(a.effect?.getTiming().duration) >= 600));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-actions")).toHaveCSS("transform", "none");
  await expect(page.locator(".hero-actions")).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector(".hero-orbit")?.getAnimations().some(a => a.playState === "running"));
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect.poll(() => page.locator(".hero-orbit").evaluate(el => el.getAnimations().every(a => a.playState === "finished"))).toBe(true);
  await expect(page.locator(".hero-actions")).toHaveCSS("opacity", "1");
});

for (const width of [768, 1024, 1280, 1440]) {
  test(`200% text at ${width}px preserves header, notebook hit area and project content`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await ready(page, width);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await expect(page.locator(".project-journey")).toHaveAttribute("data-journey-mode", "stacked");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const overflow = await page.locator(".header-inner a, .header-inner summary").evaluateAll(elements => elements.filter(el => el.checkVisibility()).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.left < 0 || rect.right > innerWidth || el.scrollWidth > el.clientWidth + 1;
    }).map(el => el.textContent));
    expect(overflow).toEqual([]);
    await page.screenshot({ path: `${output}/text-200-${width}-header.png` });
    const notebook = page.locator(".notebook-object");
    await notebook.scrollIntoViewIfNeeded();
    const collisions = await page.locator(".workspace-lamp, .laptop-object, .notebook-object, .project-object, .workspace-bug").evaluateAll(elements => {
      const failures: string[] = [];
      elements.forEach((a, i) => elements.slice(i + 1).forEach(b => {
        const x = a.getBoundingClientRect(), y = b.getBoundingClientRect();
        if (Math.min(x.right, y.right) - Math.max(x.left, y.left) > 1 && Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top) > 1) failures.push(`${a.className} / ${b.className}`);
      }));
      return failures;
    });
    expect(collisions).toEqual([]);
    const box = (await notebook.boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page.locator("#workspace-notebook")).toBeVisible();
    await expect(page).not.toHaveURL(/#sportlynk$/);
    await page.keyboard.press("Escape");
    await expect(notebook).toBeFocused();
    await page.locator(".workspace-stage").screenshot({ path: `${output}/text-200-${width}-workspace.png` });
    const clipped = await page.locator(".object-label, .notebook-cover, .project-detail, .project-media-label, .character-state-controls").evaluateAll(elements => elements.filter(el => el.scrollWidth > el.clientWidth + 1).map(el => el.className));
    expect(clipped).toEqual([]);
  });
}

test("project media lifts independently of the image zoom and both settle for reduced motion", async ({ page }) => {
  await ready(page);
  await page.locator('.journey-navigation a[href="#fitpilot"]').click();
  const card = page.locator("#fitpilot .project-card-link");
  await page.mouse.move(5, 5);
  await expect(card.locator(".media-reveal")).toHaveCSS("transform", "none");
  await card.hover();
  await expect.poll(() => card.locator(".project-media").evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m42)).toBeLessThan(-2.9);
  await expect.poll(() => card.locator(".project-screenshot").evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m11)).toBeGreaterThan(1.03);
  await page.screenshot({ path: `${output}/project-lift-and-zoom.png` });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(card.locator(".project-media")).toHaveCSS("transform", "none");
  await expect(card.locator(".project-screenshot")).toHaveCSS("transform", "none");
});

for (const width of [1280, 1440, 1920]) {
  test(`horizontal project sequence and natural wheel exit at ${width}px`, async ({ page }) => {
    await ready(page, width);
    await expect(page.locator(".project-journey")).toHaveAttribute("data-journey-mode", "horizontal");
    const range = await page.locator(".project-journey").evaluate(el => {
      const sticky = el.querySelector(".journey-sticky")!;
      return { start: el.getBoundingClientRect().top + scrollY - document.querySelector(".site-header")!.getBoundingClientRect().height, length: el.clientHeight - sticky.clientHeight };
    });
    expect(range.length).toBeLessThan(3000);
    for (let index = 0; index < ids.length; index++) {
      await page.evaluate(({ start, length, index }) => scrollTo({ top: start + length * index / 3, behavior: "instant" }), { ...range, index });
      await expect(page.locator(".project-journey")).toHaveAttribute("data-active-project", ids[index]);
      await expect.poll(() => page.locator(`#${ids[index]}`).evaluate(el => Math.abs(el.getBoundingClientRect().left - document.querySelector(".journey-track")!.parentElement!.getBoundingClientRect().left - 10))).toBeLessThan(2);
      expect(await page.evaluate(() => scrollX === 0 && document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (width === 1440) {
        await page.waitForTimeout(700);
        await page.screenshot({ path: `${output}/journey-${ids[index]}.png` });
      }
    }
    await page.mouse.wheel(0, 800);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(range.start + range.length + 100);
    await expect.poll(() => page.locator(".journey-sticky").evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(0);
  });
}

test("project keyboard links, small wheel deltas, deep links and live stacked fallback work", async ({ page }) => {
  await ready(page);
  const nav = page.locator(".journey-navigation");
  await nav.locator("a").first().focus();
  await page.keyboard.press("End");
  await expect(nav.locator("a").last()).toBeFocused();
  await expect(page.locator(".project-journey")).toHaveAttribute("data-active-project", "eduverse");
  await page.keyboard.press("Home");
  const start = await page.evaluate(() => scrollY);
  for (let i = 0; i < 12; i++) await page.mouse.wheel(0, 25);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(start + 200);
  await page.locator("#sukoon .project-card-link").focus();
  await expect(page.locator(".project-journey")).toHaveAttribute("data-active-project", "sukoon");
  await expect(page.locator("#sukoon .project-card-link")).toBeInViewport();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".project-journey")).toHaveAttribute("data-journey-mode", "stacked");
  await expect(page.locator("#sukoon")).toBeInViewport();
  await expect(page.locator(".journey-track")).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#eduverse", { waitUntil: "networkidle" });
  await expect(page.locator("#eduverse")).toBeFocused();
  await expect(page.locator("#eduverse")).toBeInViewport();
});

test("touch project presentation is stacked, navigable and leaves the page scrollable", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100", { waitUntil: "networkidle" });
  await expect(page.locator(".project-journey")).toHaveAttribute("data-journey-mode", "stacked");
  for (const id of ids) {
    await page.locator(`.journey-navigation a[href="#${id}"]`).tap();
    await expect(page.locator(`#${id}`)).toBeInViewport();
    await expect(page.locator(`#${id}`)).toBeFocused();
  }
  await page.screenshot({ path: `${output}/mobile-project.png` });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("approved character assets are valid and missing states resolve honestly to idle", () => {
  expect(characterAssetErrors(characterAssets!)).toEqual([]);
  expect(characterAssetErrors(workspaceCharacterAssets!)).toEqual([]);
  expect(resolveCharacterFrame(characterAssets!, "blink")).toEqual(characterAssets!.idle);
  expect(resolveCharacterFrame(workspaceCharacterAssets!, "working").src).toContain("workspace-working");
  expect(characterAssetErrors({ idle: { ...characterAssets!.idle, width: 0 } }).length).toBeGreaterThan(0);
});

test("approved portrait loads and workspace changes only between supplied whole poses", async ({ page }) => {
  await ready(page);
  const portrait = page.locator(".hero-artwork .character-portrait");
  await expect.poll(() => portrait.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  await expect(page.locator(".hero-artwork .character-state-controls")).toHaveCount(0);
  const character = page.locator('[data-character-scene="workspace"]');
  await character.scrollIntoViewIfNeeded();
  await character.getByRole("button", { name: "At work", exact: true }).click();
  await expect(character).toHaveAttribute("data-character-state", "working");
  await expect.poll(() => character.locator("img").evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  await character.getByRole("button", { name: "Rest", exact: true }).click();
  await expect(character).toHaveAttribute("data-character-state", "idle");
  await page.locator(".laptop-object").click();
  await expect(character).toHaveAttribute("data-character-state", "working");
  await page.keyboard.press("Escape");
  await expect(character).toHaveAttribute("data-character-state", "idle");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await character.getByRole("button", { name: "At work", exact: true }).click();
  await expect(character.locator(".character-frame")).toHaveCSS("transform", "none");
});

test("failed character image falls back to the architectural study", async ({ page }) => {
  await page.route("**/_next/image?*", route => new URL(route.request().url()).searchParams.get("url")?.includes("/anees-idle.webp") ? route.abort() : route.continue());
  await ready(page);
  await expect(page.locator(".hero-artwork .character-fallback")).toBeVisible();
  await expect(page.locator(".hero-artwork .character-portrait")).toHaveCount(0);
});

test("horizontal scenes retain accessible names, contrast and keyboard focus", async ({ page }) => {
  await ready(page);
  await page.locator('.journey-navigation a[href="#fitpilot"]').click();
  await page.locator("#fitpilot .project-card-link").focus();
  await page.waitForTimeout(700);
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
});
