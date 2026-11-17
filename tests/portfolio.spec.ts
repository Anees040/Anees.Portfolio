import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const widths = [320, 375, 390, 414, 768, 1024, 1280, 1440, 1920];
const captureDir = ".qa/phase3-finish/baseline";

for (const width of widths) {
  test(`homepage at ${width}px has readable content and no horizontal overflow`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Thoughtful software. A human perspective.");
    await expect(page.getByRole("link", { name: "Explore my work", exact: true })).toBeVisible();
    for (const image of await page.locator(".project-screenshot").all()) {
      // Every scene must be reachable through its real project navigation.
      const id = await image.evaluate(el => el.closest("article")!.id);
      await page.locator(`.journey-navigation a[href="#${id}"]`).click();
      await image.scrollIntoViewIfNeeded();
      await expect(image).toBeVisible();
      await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const offscreenText = await page.locator("main h1, main h2, main h3, main p, .contact-email").evaluateAll((elements) => elements.filter((element) => {
      // Inactive desktop scenes intentionally sit inside a clipped horizontal track.
      if (element.closest('[data-journey-mode="horizontal"] .project-scene')) return element.scrollWidth > element.clientWidth + 1;
      const bounds = element.getBoundingClientRect();
      return bounds.left < -1 || bounds.right > innerWidth + 1 || element.scrollWidth > element.clientWidth + 1;
    }).map((el) => el.textContent));
    expect(offscreenText).toEqual([]);
    expect(errors).toEqual([]);
    await mkdir(captureDir, { recursive: true });
    if (width === 1440 || width === 390) {
      const name = width === 1440 ? "desktop" : "mobile";
      await page.screenshot({ path: `${captureDir}/${name}.png`, fullPage: true });
      await page.screenshot({ path: `${captureDir}/${name}-hero.png` });
    } else {
      await page.screenshot({ path: `${captureDir}/width-${width}.png`, fullPage: true });
    }
  });
}

test("mobile disclosure works by keyboard, returns focus, and follows section links", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.locator(".mobile-menu > summary");
  await trigger.focus();
  await page.keyboard.press("Enter");
  const nav = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(nav).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(nav.getByRole("link", { name: "Work", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(nav).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  for (const element of await page.locator("[data-entrance]").all()) {
    await expect(element).toHaveCSS("opacity", "1");
  }
  await page.evaluate(async () => {
    await Promise.all(document.getAnimations().map(animation => animation.finished));
  });
  await page.screenshot({ path: `${captureDir}/mobile-menu.png` });
  await nav.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(nav).not.toBeVisible();
  await expect(page.locator("#about")).toBeFocused();
  await expect.poll(() => page.locator("#about").evaluate(el => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(72);
});

test("skip link, real destinations, and honest planned assistant", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const missingTargets = await page.locator('a[href^="#"]').evaluateAll(elements => elements.map(el => el.getAttribute("href")!).filter(href => !document.getElementById(href.slice(1))));
  expect(missingTargets).toEqual([]);
  await expect(page.locator(".contact-email")).toHaveAttribute("href", "mailto:muhammadanees0511@gmail.com");
  await expect(page.locator(".project-card-link")).toHaveCount(3);
  await expect(page.locator("#ask-anees")).toContainText("Ask Anees AI is a planned feature");
  await expect(page.locator("#sportlynk")).toContainText("Private repository");
  await expect(page.locator('input:not([type="checkbox"]), textarea')).toHaveCount(0);
});

for (const width of [390, 1440]) {
  test(`accessibility scan at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target), summary: v.nodes[0]?.failureSummary }))).toEqual([]);
    if (width === 390) {
      await page.locator(".mobile-menu > summary").click();
      const menuResults = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(menuResults.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
    }
  });
}

test("reduced motion removes transform animation, and content works without JavaScript", async ({ browser, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  const transforms = await page.locator("[data-entrance]").evaluateAll(elements => elements.map(el => getComputedStyle(el).transform));
  expect(transforms.every(value => value === "none")).toBe(true);
  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noScript.newPage();
  await staticPage.goto("http://127.0.0.1:3100");
  await expect(staticPage.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await staticPage.locator(".hero-copy").evaluate(el => getComputedStyle(el).opacity)).toBe("1");
  await staticPage.locator(".mobile-menu > summary").click();
  await expect(staticPage.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await staticPage.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Contact", exact: true }).click();
  await expect(staticPage).toHaveURL(/#contact$/);
  await noScript.close();
});

test("text expansion and RTL retain the reading layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator(".contact-email")).toBeVisible();
  await page.setViewportSize({ width: 320, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { document.documentElement.style.fontSize = ""; document.documentElement.dir = "rtl"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator(".mobile-menu > summary").click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
});

test("changing motion preference during entrance leaves content settled", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.locator("[data-entrance]").evaluateAll(elements => elements.every(el => getComputedStyle(el).transform === "none"))).toBe(true);
  await expect(page.getByRole("link", { name: "Explore my work", exact: true })).toBeVisible();
});
