import { expect, test } from "@playwright/test";
import { AMBIENT_BUDGET, HeroAmbientRenderer, ambientStars } from "../lib/hero-ambient";

test.use({ screenshot: "off", video: "off", trace: "off" });

test("ambient stars persist, drift and twinkle; one short comet appears within five active seconds", () => {
  const positions: number[] = [], alphas: number[] = [];
  const context = { globalAlpha: 1, fillStyle: "", clearRect() {}, beginPath() {}, arc(x: number) { positions.push(x); }, fill(this: { globalAlpha: number }) { alphas.push(this.globalAlpha); } } as unknown as CanvasRenderingContext2D;
  const renderer = new HeroAmbientRenderer(context, 1440, 900, ["linen", "gold", "copper"], false);
  expect(ambientStars(20)).toEqual(ambientStars(20));
  renderer.draw(0); const first = positions[0], alpha = alphas[0]; positions.length = 0; alphas.length = 0;
  renderer.draw(1 / 30); expect(positions[0]).toBeGreaterThan(first); expect(alphas[0]).not.toBe(alpha);
  for (let frame = 0; frame < 150; frame++) renderer.draw(1 / 30);
  expect(renderer.metrics.comets).toBe(1); expect(renderer.metrics.stars).toBeLessThanOrEqual(AMBIENT_BUDGET.stars);
  expect(alphas.every(value => value >= 0 && value <= 1)).toBe(true);
  const low = new HeroAmbientRenderer(context, 390, 844, ["linen", "gold", "copper"], true);
  expect(low.metrics.stars).toBeLessThan(renderer.metrics.stars);
});

test("ambient field is pointer-transparent, performance bounded and independent of the settled portrait", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => { Object.defineProperty(navigator, "hardwareConcurrency", { value: 8 }); Object.defineProperty(navigator, "maxTouchPoints", { value: 0 }); });
  await page.goto("/");
  const field = page.locator(".cosmos-field");
  await expect(field).toHaveAttribute("data-ambient-state", "running");
  await expect(field).toHaveCSS("pointer-events", "none"); await expect(field.locator("canvas")).toHaveCSS("pointer-events", "none");
  await expect(page.locator(".image-atomizer")).toHaveAttribute("data-particle-simulation", "settled");
  await expect.poll(async () => JSON.parse((await field.getAttribute("data-ambient-metrics"))!).comets, { timeout: 7000 }).toBe(1);
  const metrics = JSON.parse((await field.getAttribute("data-ambient-metrics"))!);
  expect(metrics.stars).toBeLessThanOrEqual(160); expect(metrics.bufferBytes).toBeLessThanOrEqual(1280 * 900 * 4); expect(metrics.fps).toBe(30);
  await expect(page.getByRole("link", { name: "Explore my work" })).toBeVisible();
});

test("ambient pauses offscreen and hidden, resumes without a time jump, and disposes on navigation", async ({ page }) => {
  await page.goto("/"); const field = page.locator(".cosmos-field");
  await expect(field).toHaveAttribute("data-ambient-state", "running");
  await page.locator("#contact").scrollIntoViewIfNeeded(); await expect(field).toHaveAttribute("data-ambient-state", "paused");
  const paused = await field.getAttribute("data-ambient-metrics"); await page.waitForTimeout(200); expect(await field.getAttribute("data-ambient-metrics")).toBe(paused);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" })); await expect(field).toHaveAttribute("data-ambient-state", "running");
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { value: true, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect(field).toHaveAttribute("data-ambient-state", "paused"); const hidden = JSON.parse((await field.getAttribute("data-ambient-metrics"))!);
  await page.waitForTimeout(200); expect(JSON.parse((await field.getAttribute("data-ambient-metrics"))!).frames).toBe(hidden.frames);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { value: false, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect(field).toHaveAttribute("data-ambient-state", "running");
  await page.getByRole("link", { name: /Inside SportLynk/ }).first().evaluate((link: HTMLAnchorElement) => link.click());
  await expect(page).toHaveURL(/\/work\/sportlynk/);
  for (const old of await field.all()) { await expect(old).toHaveAttribute("data-ambient-state", "paused"); await expect(old.locator("canvas")).toHaveCount(0); }
  await page.goBack(); await expect(page.locator(".cosmos-field[data-ambient-state='running']")).toHaveCount(1); await expect(page.locator(".cosmos-ambient-canvas:visible")).toHaveCount(1);
});

test("Hero depth is reversible native scrolling with no additional pin or ScrollTrigger", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => { Object.defineProperty(navigator, "maxTouchPoints", { value: 0 }); });
  await page.goto("/"); const field = page.locator(".cosmos-field");
  await expect(page.locator("#home")).toHaveAttribute("data-hero-progress", "0.0000");
  await expect(page.locator("[data-scroll-scene='selected-work']")).toHaveAttribute("data-scene-mode", "pinned");
  await expect(page.locator("[data-scroll-scene][data-scene-mode='pending']")).toHaveCount(0);
  const triggers = await page.locator("[data-scroll-runtime='ready']").getAttribute("data-scroll-triggers");
  const seek = async (top: number) => { await page.evaluate(top => scrollTo({ top, behavior: "instant" }), top); await expect.poll(async () => Number(await page.locator("#home").getAttribute("data-hero-progress"))).toBeGreaterThan(0); };
  await seek(200); const forward = await field.getAttribute("style"), portrait = await page.locator(".scene-depth-foreground").first().getAttribute("style");
  expect(Number(await field.evaluate(element => getComputedStyle(element).opacity))).toBeLessThan(0.85);
  await seek(400); await seek(200); await expect(field).toHaveAttribute("style", forward!); await expect(page.locator(".scene-depth-foreground").first()).toHaveAttribute("style", portrait!);
  expect(await page.locator("[data-scroll-runtime='ready']").getAttribute("data-scroll-triggers")).toBe(triggers);
  expect(await page.locator("#home").evaluate(element => element.closest(".pin-spacer") !== null)).toBe(false);
  await page.emulateMedia({ reducedMotion: "reduce" }); await expect(field).toHaveCSS("transform", "none"); await expect(field).toHaveCSS("opacity", "1");
});

for (const preference of ["reduce", "forced"] as const) {
  test(preference + " keeps static stars and settles a running ambient field immediately", async ({ page }) => {
    await page.goto("/"); const field = page.locator(".cosmos-field"); await expect(field).toHaveAttribute("data-ambient-state", "running");
    await page.emulateMedia(preference === "reduce" ? { reducedMotion: "reduce" } : { forcedColors: "active" });
    await expect(field).toHaveAttribute("data-ambient-state", "paused"); await expect(field.locator("canvas")).toBeHidden();
    if (preference === "reduce") await expect(field.locator("svg")).toBeVisible();
    const metrics = await field.getAttribute("data-ambient-metrics"); await page.waitForTimeout(100); expect(await field.getAttribute("data-ambient-metrics")).toBe(metrics);
    await page.emulateMedia({ reducedMotion: "no-preference", forcedColors: "none" }); await expect(field).toHaveAttribute("data-ambient-state", "running");
  });
}

for (const cores of [8, 6, 4]) {
  test(`portrait and ambient capability tier ${cores} cores has a bounded buffer and a large responsive field`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(cores => { Object.defineProperty(navigator, "hardwareConcurrency", { value: cores }); Object.defineProperty(navigator, "maxTouchPoints", { value: 0 }); Object.defineProperty(window, "Worker", { value: undefined }); }, cores);
    await page.goto("/"); const portrait = page.locator(".image-atomizer"); await expect(portrait).toHaveAttribute("data-particle-reassembled", "true");
    const box = (await portrait.locator(".character-frame").boundingBox())!; await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.27);
    await expect(portrait).toHaveAttribute("data-particle-phase", "holding");
    const metrics = JSON.parse((await portrait.getAttribute("data-particle-metrics"))!);
    expect(metrics.width).toBeLessThanOrEqual(700); expect(metrics.width * metrics.height).toBeLessThanOrEqual(480 * 700);
    expect(metrics.particles).toBeLessThanOrEqual(cores === 4 ? 18000 : 32000); expect(metrics.bufferBytes).toBeLessThanOrEqual(8 * 1024 * 1024);
    expect(metrics.interactionRadius / metrics.portraitWidth).toBeCloseTo(0.44); expect(metrics.affectedParticles).toBeGreaterThan(metrics.particles * 0.35);
    console.log("Hero capability measurement", JSON.stringify({ cores, particles: metrics.particles, bytes: metrics.bufferBytes, maxFrameMs: metrics.maxFrameMs, intervalP95Ms: metrics.intervalP95Ms, updateMs: metrics.updateMs / metrics.frames, drawMs: metrics.drawMs / metrics.frames }));
    await page.mouse.move(10, 10); await expect(portrait).toHaveAttribute("data-particle-reassembled", "true");
  });
}

test("no-JS Hero has a complete starfield, single original image and both native actions", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage(); await page.goto("http://127.0.0.1:3100/");
  await expect(page.locator(".cosmos-static-field")).toBeVisible(); expect(await page.locator(".cosmos-static-field circle").count()).toBeGreaterThan(60);
  await expect(page.locator(".cosmos-ambient-canvas")).toBeHidden(); await expect(page.locator("#home img")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore my work" })).toHaveAttribute("href", "#work"); await expect(page.getByRole("link", { name: "Get to know me" })).toHaveAttribute("href", "#about"); await context.close();
});

for (const failure of ["context", "two-core"] as const) {
  test(failure + " ambient fallback retains the full static starfield and usable Hero", async ({ page }) => {
    await page.addInitScript(failure => {
      if (failure === "two-core") Object.defineProperty(navigator, "hardwareConcurrency", { value: 2 });
      else HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;
    }, failure);
    await page.goto("/", { waitUntil: "networkidle" });
    const field = page.locator(".cosmos-field");
    await expect(field).toHaveAttribute("data-ambient-state", "paused"); await expect(field.locator("svg")).toBeVisible(); await expect(field.locator("canvas")).toBeHidden();
    await expect(page.locator("#home img")).toBeVisible(); await expect(page.getByRole("link", { name: "Explore my work" })).toBeVisible();
  });
}
