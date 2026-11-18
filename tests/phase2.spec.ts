import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";

const captures = ".qa/phase3-finish/baseline";

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    await Promise.all(document.getAnimations().filter(animation => animation.effect?.getTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {})));
  });
}

test("atelier native project and view controls work with keyboard and retain focus", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  const studio = page.locator(".digital-atelier");
  const project = studio.getByRole("radio", { name: "FitPilot" });
  await project.focus(); await page.keyboard.press("Space");
  await expect(project).toBeChecked(); await expect(project).toBeFocused();
  await expect(studio.getByRole("heading", { name: "FitPilot." })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(studio.getByRole("radio", { name: "Sukoon" })).toBeChecked();
  const notes = studio.getByRole("radio", { name: "Engineering Notes" });
  await notes.focus(); await page.keyboard.press("Space");
  await expect(notes).toBeChecked(); await expect(notes).toBeFocused();
  await expect(studio.getByRole("article", { name: "Sukoon engineering notes" })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(studio.getByRole("radio", { name: "Build Log" })).toBeChecked();
  await expect(studio.getByRole("article", { name: "Sukoon build log" })).toContainText("documented snapshot");
  await studio.getByRole("radio", { name: "Projects", exact: true }).check();
  const scan = await new AxeBuilder({ page }).include("#workspace").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(scan.violations.map(violation => ({ id: violation.id, targets: violation.nodes.map(node => node.target) }))).toEqual([]);
  await mkdir(captures, { recursive: true });
  await studio.screenshot({ path: `${captures}/atelier-keyboard.png` });
  await studio.getByRole("link", { name: "Explore Sukoon" }).click();
  await expect(page).toHaveURL(/\/work\/sukoon$/);
});

test("hero depth, progress, active section and project motion respond without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error" || message.type() === "warning") errors.push(message.text()); });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  const foreground = page.locator(".scene-depth-foreground");
  const original = await foreground.evaluate(el => getComputedStyle(el).transform);
  const scene = (await page.locator(".pointer-scene").boundingBox())!;
  await page.mouse.move(scene.x + scene.width * 0.85, scene.y + scene.height * 0.35);
  await expect.poll(() => foreground.evaluate(el => getComputedStyle(el).transform)).not.toBe(original);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(foreground).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.mouse.move(10, 500);
  const progress = page.locator(".scroll-progress");
  const start = await progress.evaluate(el => getComputedStyle(el).transform);
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect.poll(() => progress.evaluate(el => getComputedStyle(el).transform)).not.toBe(start);
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Engineering", exact: true }).click();
  await expect(page.locator("#engineering")).toBeFocused();
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Engineering", exact: true })).toHaveAttribute("aria-current", "location");
  const card = page.locator(".project-card-link").first();
  await page.locator('.journey-navigation a[href="#fitpilot"]').click();
  await card.scrollIntoViewIfNeeded();
  await settle(page);
  const shot = card.locator(".project-screenshot");
  const before = await shot.evaluate(el => getComputedStyle(el).transform);
  await card.hover();
  await expect.poll(() => shot.evaluate(el => getComputedStyle(el).transform)).not.toBe(before);
  await settle(page);
  await page.locator(".journey-viewport").screenshot({ path: `${captures}/project-hover.png` });
  await card.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(card).toBeFocused();
  await page.screenshot({ path: `${captures}/project-focus.png` });
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768]) {
  test(`atelier touch project and view selection at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: true, isMobile: width < 768 });
    const page = await context.newPage(); await page.goto("http://127.0.0.1:3100", { waitUntil: "networkidle" });
    const studio = page.locator(".digital-atelier");
    await studio.getByRole("radio", { name: "FitPilot" }).tap();
    await expect(studio.getByRole("heading", { name: "FitPilot." })).toBeVisible();
    await studio.getByRole("radio", { name: "Engineering Notes" }).tap();
    const note = studio.getByRole("article", { name: "FitPilot engineering notes" });
    await expect(note).toBeVisible(); await expect(note).toContainText("neutral");
    await studio.getByRole("radio", { name: "Build Log" }).tap();
    await expect(studio.getByRole("article", { name: "FitPilot build log" })).toBeVisible();
    await studio.getByRole("radio", { name: "SportLynk" }).tap();
    await expect(studio.getByRole("article", { name: "SportLynk build log" })).toContainText("no claimed production release");
    await studio.getByRole("radio", { name: "Projects", exact: true }).tap();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await studio.screenshot({ path: `${captures}/atelier-touch-${width}.png` }); await context.close();
  });
}

test("atelier projects, notes and build record work without JavaScript or WebGL", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const page = await context.newPage(); await page.goto("http://127.0.0.1:3100");
  const studio = page.locator(".digital-atelier");
  await studio.getByRole("radio", { name: "FitPilot" }).check();
  await expect(studio.getByRole("heading", { name: "FitPilot." })).toBeVisible();
  await studio.getByRole("radio", { name: "Engineering Notes" }).check();
  await expect(studio.getByRole("article", { name: "FitPilot engineering notes" })).toContainText("neutral");
  await studio.getByRole("radio", { name: "Build Log" }).check();
  await expect(studio.getByRole("article", { name: "FitPilot build log" })).toContainText("Next documented direction");
  await studio.getByRole("radio", { name: "Projects", exact: true }).check();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".hero-artwork .character-portrait")).toBeVisible();
  await studio.getByRole("link", { name: "Explore FitPilot" }).click();
  await expect(page).toHaveURL(/\/work\/fitpilot$/); await context.close();
});

test("reduced motion preserves atelier views, enlarged text and no spatial transitions", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 }); await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  const studio = page.locator(".digital-atelier");
  await studio.getByRole("radio", { name: "Engineering Notes" }).check();
  const note = studio.getByRole("article", { name: "SportLynk engineering notes" });
  await expect(note).toHaveCSS("animation-name", "none");
  await expect(page.locator(".scene-depth-foreground")).toHaveCSS("transform", "none");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await note.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  await studio.screenshot({ path: `${captures}/atelier-reduced-text-200.png` });
  await studio.getByRole("radio", { name: "Projects", exact: true }).check();
  await expect(studio.getByRole("heading", { name: "SportLynk." })).toBeVisible();
});

test("record local production loading measurements", async ({ page }) => {
  await page.addInitScript(() => {
    const measurement = window as Window & { phase2Metrics?: { cls: number; lcp: number } };
    measurement.phase2Metrics = { cls: 0, lcp: 0 };
    new PerformanceObserver(list => {
      for (const item of list.getEntries()) {
        const entry = item as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!entry.hadRecentInput) measurement.phase2Metrics!.cls += entry.value ?? 0;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver(list => { measurement.phase2Metrics!.lcp = list.getEntries().at(-1)?.startTime ?? 0; }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  const metrics = await page.evaluate(() => ({
    ...(window as Window & { phase2Metrics?: { cls: number; lcp: number } }).phase2Metrics,
    scripts: performance.getEntriesByType("resource").filter(r => (r as PerformanceResourceTiming).initiatorType === "script").reduce((sum, r) => sum + (r as PerformanceResourceTiming).transferSize, 0),
    resources: performance.getEntriesByType("resource").map(r => ({ name: r.name, size: (r as PerformanceResourceTiming).transferSize })),
  }));
  await writeFile(`${captures}/performance.json`, JSON.stringify(metrics, null, 2));
  expect(metrics.cls ?? 1).toBeLessThan(0.1);
  await expect(page.locator('.hero-artwork .character-portrait')).toBeVisible();
  await expect(page.locator('.character-portrait')).toHaveCount(1);
});
