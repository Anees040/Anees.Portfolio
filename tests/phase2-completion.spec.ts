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
  test(`200% text at ${width}px preserves header, atelier hit areas and project content`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" }); await ready(page, width);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await expect(page.locator(".project-journey")).toHaveAttribute("data-journey-mode", "stacked");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const overflow = await page.locator(".header-inner a, .header-inner summary").evaluateAll(elements => elements.filter(element => element.checkVisibility()).filter(element => { const bounds = element.getBoundingClientRect(); return bounds.left < 0 || bounds.right > innerWidth || element.scrollWidth > element.clientWidth + 1; }).map(element => element.textContent));
    expect(overflow).toEqual([]);
    const studio = page.locator(".digital-atelier");
    for (const name of ["FitPilot", "Sukoon", "EduVerse", "SportLynk"]) {
      const choice = studio.getByRole("radio", { name }); await choice.check(); await expect(choice).toBeChecked();
      await expect(studio.getByRole("heading", { name: `${name}.` })).toBeVisible();
    }
    const note = studio.getByRole("radio", { name: "Engineering Notes" }); await note.focus(); await page.keyboard.press("Space");
    await expect(note).toBeFocused(); await expect(studio.getByRole("article", { name: "SportLynk engineering notes" })).toBeVisible();
    const clipped = await studio.locator("label, h3, h4, p").evaluateAll(elements => elements.filter(element => element.checkVisibility()).filter(element => element.scrollWidth > element.clientWidth + 1).map(element => element.className));
    expect(clipped).toEqual([]);
    const collisions = await studio.locator(".atelier-project-choice").evaluateAll(elements => elements.flatMap((element, index) => elements.slice(index + 1).filter(other => { const first = element.getBoundingClientRect(), second = other.getBoundingClientRect(); return Math.min(first.right, second.right) - Math.max(first.left, second.left) > 1 && Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top) > 1; }).map(other => `${element.textContent} / ${other.textContent}`)));
    expect(collisions).toEqual([]); await studio.screenshot({ path: `${output}/text-200-${width}-atelier.png` });
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

test("approved portrait loads and atelier does not reuse the rejected workspace character", async ({ page }) => {
  await ready(page); const portrait = page.locator(".hero-artwork .character-portrait");
  await expect.poll(() => portrait.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  await expect(page.locator(".hero-artwork .character-state-controls")).toHaveCount(0);
  await expect(page.locator('#workspace [data-character-scene="workspace"]')).toHaveCount(0);
  const studio = page.locator(".digital-atelier"); await studio.getByRole("radio", { name: "Sukoon" }).check();
  const images = studio.locator('[data-project="sukoon"] .folio-screens img');
  for (const image of await images.all()) await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  await studio.getByRole("radio", { name: "Engineering Notes" }).check();
  await expect(studio.getByRole("article", { name: "Sukoon engineering notes" })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await studio.getByRole("radio", { name: "Projects", exact: true }).check();
  await expect(studio.getByRole("article", { name: "Sukoon project presentation" })).toHaveCSS("transform", "none");
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
