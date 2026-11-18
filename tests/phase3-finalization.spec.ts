import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

async function observeParticleTransitions(page: Page) {
  await page.locator(".image-atomizer").evaluate(element => {
    const target = window as Window & { particleTransitions?: { state?: string; phase?: string }[] };
    target.particleTransitions = [];
    new MutationObserver(() => {
      const portrait = element as HTMLElement;
      target.particleTransitions!.push({ state: portrait.dataset.particleState, phase: portrait.dataset.particlePhase });
    }).observe(element, { attributes: true, attributeFilter: ["data-particle-state", "data-particle-phase"] });
  });
}

for (const mode of ["main", "worker"] as const) {
  test(`atomizer ${mode}: equilibrium holds real displaced pixels without drawing, then reassembles`, async ({ page }) => {
    await page.addInitScript(mode => {
      Object.defineProperty(navigator, "hardwareConcurrency", { value: 8 });
      if (mode === "main") Object.defineProperty(window, "Worker", { value: undefined });
      const target = window as Window & { particleDrawCount?: number }; target.particleDrawCount = 0;
      const draw = CanvasRenderingContext2D.prototype.putImageData;
      CanvasRenderingContext2D.prototype.putImageData = function (image: ImageData, originX: number, originY: number, ...dirty: number[]) { target.particleDrawCount!++; return Reflect.apply(draw, this, [image, originX, originY, ...dirty]); };
    }, mode);
    await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto("/", { waitUntil: "networkidle" });
    const portrait = page.locator(".image-atomizer");
    await expect(portrait).toHaveAttribute("data-particle-state", "resting");
    await expect(portrait).toHaveAttribute("data-particle-mode", mode);
    await observeParticleTransitions(page);
    const stage = page.locator(".image-atomizer .character-frame");
    const box = (await stage.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.3);
    await expect(portrait).toHaveAttribute("data-particle-phase", "holding", { timeout: 15000 });
    await expect(portrait).toHaveAttribute("data-particle-state", "active");
    await expect(page.locator(".particle-canvas")).toHaveCSS("opacity", "1");
    const metrics = JSON.parse((await portrait.getAttribute("data-particle-metrics"))!);
    expect(metrics.maxDisplacement).toBeGreaterThan(4); expect(metrics.meanDisplacement).toBeGreaterThan(0.1); expect(metrics.reassembled).toBe(false);
    const readDraws = () => page.evaluate(() => (window as Window & { particleDrawCount?: number }).particleDrawCount ?? 0);
    const draws = await readDraws(); await page.waitForTimeout(500);
    expect(await portrait.getAttribute("data-particle-metrics")).toBe(JSON.stringify(metrics));
    if (mode === "main") { expect(draws).toBeGreaterThan(20); expect(await readDraws()).toBe(draws); }
    await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.45);
    await expect(portrait).toHaveAttribute("data-particle-simulation", "running");
    await page.waitForTimeout(150); await page.mouse.move(4, 4);
    await expect.poll(() => page.evaluate(() => (window as Window & { particleTransitions?: { state?: string; phase?: string }[] }).particleTransitions!.some(state => state.phase === "reassembling" && state.state === "active"))).toBe(true);
    await expect(portrait).toHaveAttribute("data-particle-state", "resting", { timeout: 15000 });
    const assembled = JSON.parse((await portrait.getAttribute("data-particle-metrics"))!);
    expect(assembled.reassembled).toBe(true); expect(assembled.maxDisplacement).toBe(0);
    await expect(page.locator(".particle-canvas")).toHaveCSS("opacity", "0");
  });
}

test("touch portrait supports tap, horizontal drag, release, cancellation and native vertical scroll", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await context.newPage(); await page.goto("http://127.0.0.1:3100", { waitUntil: "networkidle" });
  const portrait = page.locator(".image-atomizer"); const stage = page.locator(".image-atomizer .character-frame");
  await expect(portrait).toHaveAttribute("data-particle-mode", "main");
  await expect(stage).toHaveCSS("touch-action", "pan-y");
  await observeParticleTransitions(page);
  await stage.scrollIntoViewIfNeeded(); const box = (await stage.boundingBox())!;
  const session = await context.newCDPSession(page);
  const horizontal = box.x + box.width * 0.5, vertical = box.y + box.height * 0.3;
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: horizontal, y: vertical }] });
  await expect(portrait).toHaveAttribute("data-particle-interaction", "touch");
  await page.waitForTimeout(350);
  await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: horizontal + 40, y: vertical }] });
  await page.waitForTimeout(250);
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(portrait).toHaveAttribute("data-particle-state", "resting", { timeout: 15000 });
  await page.touchscreen.tap(horizontal, vertical);
  await expect.poll(() => page.evaluate(() => (window as Window & { particleTransitions?: { state?: string; phase?: string }[] }).particleTransitions!.filter(state => state.phase === "dispersing" && state.state === "active").length)).toBeGreaterThan(1);
  await expect(portrait).toHaveAttribute("data-particle-state", "resting", { timeout: 15000 });
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: horizontal, y: vertical }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchCancel", touchPoints: [] });
  await expect(portrait).toHaveAttribute("data-particle-state", "resting", { timeout: 15000 });
  const before = await page.evaluate(() => scrollY);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: horizontal, y: vertical + 80 }] });
  for (let step = 1; step <= 5; step++) { await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: horizontal, y: vertical + 80 - step * 30 }] }); await page.waitForTimeout(40); }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 30);
  await context.close();
});

test("a fresh mobile tap moves actual particles before smooth reassembly", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage(); await page.goto("http://127.0.0.1:3100", { waitUntil: "networkidle" });
  const stage = page.locator(".image-atomizer .character-frame"); await stage.scrollIntoViewIfNeeded();
  const portrait = page.locator(".image-atomizer");
  await expect(portrait).toHaveAttribute("data-particle-metrics", /particles/);
  expect(JSON.parse((await portrait.getAttribute("data-particle-metrics"))!).peakDisplacement).toBe(0);
  await observeParticleTransitions(page);
  const bounds = (await stage.boundingBox())!; await page.touchscreen.tap(bounds.x + bounds.width * .5, bounds.y + bounds.height * .3);
  await expect.poll(() => page.evaluate(() => (window as Window & { particleTransitions?: { state?: string; phase?: string }[] }).particleTransitions!.some(state => state.phase === "dispersing" && state.state === "active"))).toBe(true);
  await expect(portrait).toHaveAttribute("data-particle-state", "resting", { timeout: 15000 });
  const metrics = JSON.parse((await portrait.getAttribute("data-particle-metrics"))!);
  expect(metrics.peakDisplacement).toBeGreaterThan(1); expect(metrics.frames).toBeGreaterThan(10); expect(metrics.reassembled).toBe(true);
  await context.close();
});

test("forced colors retains the semantic portrait and removes the decorative renderer", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" }); await page.goto("/");
  await expect(page.locator(".particle-canvas")).toHaveCount(0);
  await expect(page.locator(".hero-artwork .character-portrait")).toBeVisible();
  await expect(page.getByRole("button", { name: "Reassemble portrait" })).toHaveCount(0);
});

test("a runtime worker error restores the main renderer and the active hover field", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { value: 8 });
    const OriginalWorker = window.Worker;
    window.Worker = class extends OriginalWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        super(url, options);
        (window as Window & { portfolioWorker?: Worker }).portfolioWorker = this;
      }
    };
  });
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto("/", { waitUntil: "networkidle" });
  const portrait = page.locator(".image-atomizer");
  await expect(portrait).toHaveAttribute("data-particle-mode", "worker");
  const bounds = (await page.locator(".image-atomizer .character-frame").boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width * .5, bounds.y + bounds.height * .3);
  await expect(portrait).toHaveAttribute("data-particle-state", "active");
  await page.evaluate(() => (window as Window & { portfolioWorker?: Worker }).portfolioWorker!.dispatchEvent(new Event("error")));
  await expect(portrait).toHaveAttribute("data-particle-mode", "main");
  await expect(portrait).toHaveAttribute("data-particle-phase", "holding", { timeout: 15000 });
  await expect(portrait).toHaveAttribute("data-particle-state", "active");
  await expect(page.locator(".particle-canvas")).toHaveCount(1);
  await page.mouse.move(3, 3); await expect(portrait).toHaveAttribute("data-particle-state", "resting", { timeout: 15000 });
});

test("canvas capability failure preserves the original image and useful hero", async ({ page }) => {
  await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator(".particle-canvas")).toHaveCount(0);
  await expect(page.locator(".hero-artwork .character-portrait")).toHaveCSS("opacity", "1");
  await expect(page.getByRole("link", { name: "Explore my work", exact: true })).toBeVisible();
});

test("DPR two and resize keep one lower-density, proportionate canvas", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 2 });
  const page = await context.newPage(); await page.goto("http://127.0.0.1:3100", { waitUntil: "networkidle" });
  const portrait = page.locator(".image-atomizer");
  await expect(portrait).toHaveAttribute("data-particle-metrics", /particles/);
  const before = JSON.parse((await portrait.getAttribute("data-particle-metrics"))!);
  expect(before.dpr).toBe(2); expect(before.width).toBeLessThanOrEqual(300);
  await page.setViewportSize({ width: 768, height: 1000 });
  await page.locator(".image-atomizer .character-frame").scrollIntoViewIfNeeded();
  await expect(page.locator(".particle-canvas")).toHaveCount(1);
  await expect.poll(async () => {
    const metrics = JSON.parse((await portrait.getAttribute("data-particle-metrics"))!);
    const bounds = (await page.locator(".image-atomizer .character-frame").boundingBox())!;
    return Math.abs(metrics.width / metrics.height - bounds.width / bounds.height);
  }).toBeLessThan(0.02);
  await expect(portrait).toHaveAttribute("data-particle-state", "resting"); await context.close();
});

test("thread chapters seek, synchronize, reverse, expose correct links and release the sticky archive", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto("/", { waitUntil: "networkidle" });
  const trail = page.locator(".trail-layout");
  let previous = "";
  for (const index of [0, 2, 4, 1]) {
    const link = page.getByRole("navigation", { name: "Journey chapters" }).locator("a").nth(index);
    await link.focus(); await page.keyboard.press("Enter");
    await expect(link).toHaveAttribute("aria-current", "step");
    await expect(trail).toHaveAttribute("data-trail-chapter", String(index + 1));
    await expect(page.locator(".trail-chapters > li").nth(index)).toBeFocused();
    const progress = (await trail.getAttribute("data-trail-progress"))!;
    expect(progress).not.toBe(previous); previous = progress;
    await expect(trail.locator(`.thread-scene-sheet[data-sheet="${index}"]`)).toHaveCSS("visibility", "visible");
  }
  await page.locator("#playground").scrollIntoViewIfNeeded();
  expect((await page.locator(".thread-scene").boundingBox())!.y).toBeLessThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(trail).toHaveAttribute("data-trail-motion", "static");
  await expect(page.locator(".trail-reading-artifact").first()).toBeVisible();
});

for (const slug of ["sportlynk", "fitpilot", "sukoon", "eduverse"]) {
  test(`atelier ${slug} changes project, authentic artifact, notes and documented build record`, async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" }); const studio = page.locator(".digital-atelier");
    await studio.locator(`input[name="atelier-project"][value="${slug}"]`).check();
    await expect(studio).toHaveAttribute("data-atelier-project", slug);
    const project = studio.locator(`[data-project="${slug}"]`);
    await expect(project.locator('[data-view="projects"]')).toBeVisible();
    await expect(project.locator(".atelier-study-link")).toHaveAttribute("href", `/work/${slug}`);
    if (slug === "sportlynk") { await expect(project.locator(".folio-artifact")).toContainText("Conceptual"); await expect(project.locator(".folio-artifact img")).toHaveCount(0); }
    else for (const image of await project.locator(".folio-artifact img").all()) { await image.scrollIntoViewIfNeeded(); await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true); }
    await studio.getByRole("radio", { name: "Engineering Notes" }).check();
    await expect(project.locator('[data-view="notes"]')).toBeVisible(); await expect(project.locator(".atelier-notes section")).toHaveCount(2);
    await expect(project.locator('.atelier-notes-view .atelier-note-title .text-link')).toHaveAttribute("href", `/work/${slug}#decisions`);
    await studio.getByRole("radio", { name: "Build Log" }).check();
    await expect(project.locator('[data-view="log"]')).toContainText("not a reconstructed commit history");
    await expect(project.locator(".atelier-build-record li").first()).toBeVisible();
    await project.locator('.atelier-log-view .text-link').click();
    await expect(page).toHaveURL(new RegExp(`/work/${slug}#outcome$`));
    await expect(page.locator("#outcome")).toBeInViewport();
  });
}

for (const failure of [false, true]) {
  test(`contact clipboard ${failure ? "failure is honest" : "success is confirmed"}, destinations and top navigation work`, async ({ page }) => {
    await page.addInitScript(failure => Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { if (failure) throw new Error("Denied"); (window as Window & { copiedEmail?: string }).copiedEmail = text; } } }), failure);
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Copy email", exact: true }).focus(); await page.keyboard.press("Enter");
    const status = page.locator("#email-copy-status");
    await expect(status).toContainText(failure ? "Copy unavailable" : "Copied. Ready");
    if (!failure) expect(await page.evaluate(() => (window as Window & { copiedEmail?: string }).copiedEmail)).toBe("muhammadanees0511@gmail.com");
    await expect(page.getByRole("link", { name: "Write to Anees" })).toHaveAttribute("href", "mailto:muhammadanees0511@gmail.com");
    await expect(page.getByRole("link", { name: "Explore my GitHub" })).toHaveAttribute("href", "https://github.com/Anees040");
    await expect(page.locator("#contact form")).toHaveCount(0); await expect(page.locator("#ask-anees")).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: "reduce" }); await page.getByRole("link", { name: "Back to top", exact: true }).click();
    await expect(page.locator("#home")).toBeFocused(); await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(10);
  });
}

test("enlarged editorial headings keep project names and closing punctuation whole", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    const lines = await page.evaluate(() => {
      const project = document.querySelector('.atelier-project-panel[data-project="sportlynk"] h3')!;
      const contact = document.querySelector("#contact-heading")!;
      const measurements = [
        { node: project.firstChild!, start: 0, end: "SportLynk".length },
        { node: contact.firstChild!, start: 5, end: "Have something".length },
        { node: contact.querySelector("em")!.firstChild!, start: 0, end: "building?".length },
      ];
      return measurements.map(({ node, start, end }) => {
        const range = document.createRange(); range.setStart(node, start); range.setEnd(node, end);
        return range.getClientRects().length;
      });
    });
    expect(lines).toEqual([1, 1, 1]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator(".atelier-note-index")).toHaveCount(0);
  }
});

test("finalized surfaces retain names, focus, contrast and accessible structure", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/", { waitUntil: "networkidle" });
  const scan = await new AxeBuilder({ page }).include("#workspace").include("#journey").include("#contact").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(scan.violations.map(violation => ({ id: violation.id, targets: violation.nodes.map(node => node.target) }))).toEqual([]);
});
