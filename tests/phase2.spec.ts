import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";

const captures = ".impeccable/review/phase-2";

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    await Promise.all(document.getAnimations().filter(animation => animation.effect?.getTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {})));
  });
}

test("workspace native objects work with keyboard and retain focus", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("#workspace").scrollIntoViewIfNeeded();
  const laptop = page.getByRole("button", { name: "Open laptop: what I’m building" });
  await laptop.focus();
  await page.keyboard.press("Enter");
  const note = page.getByRole("dialog", { name: "On the workbench: SportLynk" });
  await expect(note).toBeVisible();
  await expect(note.getByRole("button", { name: "Close note" })).toBeFocused();
  await expect(note).toContainText("private repository");
  await settle(page);
  await mkdir(captures, { recursive: true });
  await page.screenshot({ path: `${captures}/workspace-laptop.png` });
  await page.keyboard.press("Escape");
  await expect(note).not.toBeVisible();
  await expect(laptop).toBeFocused();

  const notebook = page.getByRole("button", { name: "Open notebook: an engineering thought" });
  await notebook.click();
  const engineering = page.getByRole("dialog", { name: "Start with the everyday problem." });
  await expect(engineering).toBeVisible();
  await expect(laptop).toHaveAttribute("popoverTarget", "workspace-laptop");
  await expect(note).not.toBeVisible();
  await engineering.getByRole("link", { name: "My engineering interests" }).click();
  await expect(engineering).not.toBeVisible();
  await expect(page.locator("#engineering")).toBeFocused();

  await page.locator("#workspace").scrollIntoViewIfNeeded();
  const lamp = page.getByRole("checkbox", { name: "Desk lamp" });
  await expect(lamp).toBeChecked();
  await lamp.focus();
  await page.keyboard.press("Space");
  await expect(lamp).not.toBeChecked();
  await expect(page.locator(".lamp-label-off")).toBeVisible();
  await expect(page.locator(".workspace-light")).toHaveCSS("opacity", "0");
  await settle(page);
  await page.screenshot({ path: `${captures}/workspace-lamp-off.png` });
  await page.keyboard.press("Space");
  await expect(lamp).toBeChecked();
  await expect(page.locator(".workspace-light")).toHaveCSS("opacity", "0.07");

  await page.getByRole("button", { name: "Inspect the hidden software bug" }).click();
  const bug = page.getByRole("dialog", { name: "You found the edge case." });
  await expect(bug).toBeVisible();
  await expect(bug).toContainText("safely contained");
  const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(scan.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target), detail: v.nodes[0]?.failureSummary }))).toEqual([]);
  await settle(page);
  await page.screenshot({ path: `${captures}/workspace-bug.png` });
  await page.keyboard.press("Escape");
  await page.locator(".workspace-intro h2").click();
  await settle(page);
  await page.locator(".workspace-stage").screenshot({ path: `${captures}/workspace-desktop.png` });
  await page.getByRole("link", { name: "Explore SportLynk project", exact: true }).click();
  await expect(page).toHaveURL(/#sportlynk$/);
  await expect(page.locator("#sportlynk")).toBeFocused();
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
  await card.scrollIntoViewIfNeeded();
  await settle(page);
  const shot = card.locator(".project-screenshot");
  const before = await shot.evaluate(el => getComputedStyle(el).transform);
  await card.hover();
  await expect.poll(() => shot.evaluate(el => getComputedStyle(el).transform)).not.toBe(before);
  await settle(page);
  await page.locator(".project-grid").screenshot({ path: `${captures}/project-hover.png` });
  await card.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(card).toBeFocused();
  await page.screenshot({ path: `${captures}/project-focus.png` });
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768]) {
  test(`workspace touch and open panel at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: true, isMobile: width < 768 });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3100", { waitUntil: "networkidle" });
    await page.locator("#workspace").scrollIntoViewIfNeeded();
    await settle(page);
    await page.locator(".workspace-stage").screenshot({ path: `${captures}/workspace-${width}.png` });
    await page.getByRole("button", { name: "Open notebook: an engineering thought" }).tap();
    const note = page.getByRole("dialog", { name: "Start with the everyday problem." });
    await expect(note).toBeVisible();
    const bounds = (await note.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(901);
    await settle(page);
    await page.screenshot({ path: `${captures}/workspace-note-${width}.png` });
    await note.getByRole("button", { name: "Close note" }).tap();
    await expect(note).not.toBeVisible();
    await page.locator('label[for="desk-light"]').tap();
    await expect(page.getByRole("checkbox", { name: "Desk lamp" })).not.toBeChecked();
    await page.getByRole("button", { name: "Inspect the hidden software bug" }).tap();
    await expect(page.getByRole("dialog", { name: "You found the edge case." })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await context.close();
  });
}

test("workspace stays usable without JavaScript or WebGL", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100");
  await page.getByRole("button", { name: "Open laptop: what I’m building" }).click();
  await expect(page.getByRole("dialog", { name: "On the workbench: SportLynk" })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.locator('label[for="desk-light"]').click();
  await expect(page.getByRole("checkbox", { name: "Desk lamp" })).not.toBeChecked();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".character-fallback")).toBeVisible();
  await page.getByRole("link", { name: "Explore SportLynk project", exact: true }).click();
  await expect(page).toHaveURL(/#sportlynk$/);
  await context.close();
});

test("reduced motion preserves workspace, enlarged text and no spatial transitions", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("#workspace").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Open notebook: an engineering thought" }).click();
  const note = page.getByRole("dialog", { name: "Start with the everyday problem." });
  await expect(note).toHaveCSS("transform", "none");
  await expect(page.locator(".scene-depth-foreground")).toHaveCSS("transform", "none");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await note.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  await page.screenshot({ path: `${captures}/reduced-motion-text-200.png` });
  await page.keyboard.press("Escape");
  await page.locator("#workspace").scrollIntoViewIfNeeded();
  await page.locator(".workspace-stage").screenshot({ path: `${captures}/workspace-text-200.png`, style: ".site-header { visibility: hidden; }" });
  const overflow = await page.locator(".object-label, .laptop-screen-content, .notebook-cover").evaluateAll(elements => elements.filter(el => el.scrollWidth > el.clientWidth + 1).map(el => el.className));
  expect(overflow).toEqual([]);
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
  await expect(page.locator(".character-fallback")).toBeVisible();
  await expect(page.locator('img[src*="character"]')).toHaveCount(0);
});
