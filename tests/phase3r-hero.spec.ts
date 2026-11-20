import { expect, test, type Page } from "@playwright/test";
import { ParticleEngine, type ParticleSource } from "../lib/particle-engine";

type ParticleArrays = { x: Float32Array; y: Float32Array; tx: Float32Array; ty: Float32Array; colors: Uint32Array; buffer: ImageData; count: number };
function fixture(overrides: Partial<ParticleSource> = {}) {
  const width = 120, height = 180, pixels = new Uint8ClampedArray(width * height * 4);
  for (let row = 20; row < 160; row++) for (let column = 20; column < 100; column++) {
    const offset = (row * width + column) * 4;
    pixels.set([column + 80, row, 63, column === 20 ? 128 : 255], offset);
  }
  const source: ParticleSource = { width, height, pixels, gap: 2, portraitWidth: 80, ...overrides };
  const context = {
    createImageData: (width: number, height: number) => ({ width, height, data: new Uint8ClampedArray(width * height * 4) }),
    putImageData: () => {},
  } as unknown as CanvasRenderingContext2D;
  const engine = new ParticleEngine(context, source);
  return { engine, source, arrays: engine as unknown as ParticleArrays };
}
function finish(engine: ParticleEngine) { for (let frame = 0; frame < 180; frame++) if (engine.step(16.667)) return; throw new Error("Particle simulation did not settle"); }

test("sampling preserves source RGBA, alpha and exact pixel targets", () => {
  const { arrays, source, engine } = fixture();
  expect(engine.metrics.particles).toBe(2800);
  engine.draw(); expect(arrays.buffer.data).toEqual(source.pixels);
  const packed = new Uint32Array(source.pixels.buffer);
  for (let index = 0; index < arrays.count; index++) {
    const offset = arrays.ty[index] * source.width + arrays.tx[index];
    expect(source.pixels[offset * 4 + 3]).toBeGreaterThan(0);
    expect(arrays.colors[index]).toBe(packed[offset]);
    expect(arrays.x[index]).toBe(arrays.tx[index]);
  }
});

test("initial cloud is seeded, bounded and converges to the exact portrait without buffer allocation", () => {
  const first = fixture(), second = fixture();
  const buffer = first.arrays.buffer;
  first.engine.form(42); second.engine.form(42);
  expect(first.arrays.x).toEqual(second.arrays.x);
  expect(first.engine.metrics.initialMeanDisplacement).toBeGreaterThan(80 * 0.35);
  expect(first.engine.metrics.maxDisplacement).toBeLessThanOrEqual(80 * 0.7 + 0.01);
  first.engine.draw();
  expect(first.engine.metrics.reassembled).toBe(false);
  const initial = first.engine.metrics.meanDisplacement;
  for (let frame = 0; frame < 15; frame++) first.engine.step(16.667);
  expect(first.engine.metrics.meanDisplacement).toBeLessThan(initial * 0.1);
  finish(first.engine);
  expect(first.engine.metrics.reassembled).toBe(true);
  expect(first.arrays.x).toEqual(first.arrays.tx);
  expect(first.arrays.y).toEqual(first.arrays.ty);
  expect(first.arrays.buffer).toBe(buffer);
  expect(first.engine.metrics.formationMs).toBeLessThan(1000);
});

test("pointer force is local, stationary equilibrium holds displacement and exit returns exactly", () => {
  const { engine, arrays } = fixture();
  engine.pointer(60, 54); finish(engine);
  expect(engine.metrics.settled).toBe(true);
  expect(engine.metrics.reassembled).toBe(false);
  expect(engine.metrics.maxDisplacement).toBeGreaterThan(4);
  let changed = 0;
  for (let index = 0; index < arrays.count; index++) {
    const distance2 = (arrays.tx[index] - 60) ** 2 + (arrays.ty[index] - 54) ** 2;
    const moved = Math.abs(arrays.x[index] - arrays.tx[index]) + Math.abs(arrays.y[index] - arrays.ty[index]);
    if (distance2 >= (80 * 0.26) ** 2) expect(moved).toBe(0);
    if (moved > 1) changed++;
  }
  expect(changed).toBeGreaterThan(100);
  expect(changed).toBeLessThan(arrays.count * 0.2);
  engine.pointer(-1000, -1000); finish(engine);
  expect(engine.metrics.reassembled).toBe(true);
  expect(arrays.x).toEqual(arrays.tx);
});

test("scatter is distinct from cloud formation and returns to targets", () => {
  const { engine } = fixture();
  engine.scatter(); engine.step(16.667);
  expect(engine.metrics.forming).toBe(false);
  expect(engine.metrics.maxDisplacement).toBeGreaterThan(1);
  finish(engine); expect(engine.metrics.reassembled).toBe(true);
});

test("the wider curved field affects substantially more source pixels while retaining the center and a bounded portrait", () => {
  const narrow = fixture({ radiusRatio: 0.13 }), wide = fixture();
  narrow.engine.pointer(60, 54); wide.engine.pointer(60, 54); finish(narrow.engine); finish(wide.engine);
  expect(wide.engine.metrics.affectedParticles).toBeGreaterThan(narrow.engine.metrics.affectedParticles * 3.5);
  expect(wide.engine.metrics.maxDisplacement).toBeGreaterThan(narrow.engine.metrics.maxDisplacement * 1.8);
  expect(wide.engine.metrics.maxDisplacement).toBeLessThan(wide.engine.metrics.interactionRadius * 0.5);
  const center = Array.from(wide.arrays.tx).findIndex((value, index) => value === 60 && wide.arrays.ty[index] === 54);
  expect(wide.arrays.x[center]).toBe(60); expect(wide.arrays.y[center]).toBe(54);
  const curved = Array.from(wide.arrays.tx).findIndex((value, index) => value === 70 && wide.arrays.ty[index] === 54);
  expect(wide.arrays.y[curved]).toBeGreaterThan(54);
  wide.engine.pointer(-1000, -1000); finish(wide.engine);
  expect(wide.arrays.x).toEqual(wide.arrays.tx); expect(wide.arrays.y).toEqual(wide.arrays.ty);
  expect(wide.arrays.buffer.data).toEqual(wide.source.pixels);
});

for (const gap of [2, 3, 4]) {
  test(`density ${gap} keeps the same interaction radius, exact return and bounded memory`, () => {
    const { engine, arrays, source } = fixture({ gap });
    const buffer = arrays.buffer;
    engine.pointer(60, 54); finish(engine);
    expect(engine.metrics.interactionRadius).toBeCloseTo(20.8);
    expect(engine.metrics.particles).toBeLessThanOrEqual(32000); expect(engine.metrics.bufferBytes).toBeLessThanOrEqual(8 * 1024 * 1024);
    engine.pointer(-1000, -1000); finish(engine);
    expect(arrays.x).toEqual(arrays.tx); expect(arrays.y).toEqual(arrays.ty); expect(arrays.buffer).toBe(buffer);
    // Gap 3/4 can omit a partial edge tile; sampled colors and full covered tiles remain exact.
    const packed = new Uint32Array(source.pixels.buffer);
    for (let index = 0; index < arrays.count; index++) expect(arrays.colors[index]).toBe(packed[arrays.ty[index] * source.width + arrays.tx[index]]);
  });
}

test("a dense source is rejected before exceeding the particle allocation budget", () => {
  const pixels = new Uint8ClampedArray(120 * 280 * 4).fill(255);
  expect(() => fixture({ width: 120, height: 280, pixels, gap: 1 })).toThrow("Portrait exceeds particle memory budget");
});

async function stable(page: Page) {
  const portrait = page.locator(".image-atomizer");
  await expect(portrait).toHaveAttribute("data-particle-formation-complete", "true", { timeout: 15000 });
  await expect(portrait).toHaveAttribute("data-particle-state", "resting");
  return portrait;
}
async function values(page: Page) { return JSON.parse((await page.locator(".image-atomizer").getAttribute("data-particle-metrics"))!); }

test("first canvas handoff has decoded source, sampled targets and a valid dispersed frame", async ({ page }) => {
  await page.addInitScript(() => {
    const target = window as Window & { heroHandoffs?: { valid: boolean; opacity: number; phase?: string }[] };
    target.heroHandoffs = [];
    new MutationObserver(() => {
      const element = document.querySelector<HTMLElement>(".image-atomizer");
      if (!element || element.dataset.particleState !== "active") return;
      const canvas = element.querySelector("canvas"), image = element.querySelector("img");
      target.heroHandoffs!.push({ valid: element.dataset.particleFirstFrame === "true" && element.dataset.particleDecoded === "true" && element.dataset.particleSampled === "true", opacity: Number(canvas && getComputedStyle(canvas).opacity) + Number(image && getComputedStyle(image).opacity), phase: element.dataset.particlePhase });
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ["data-particle-state", "data-particle-phase"] });
  });
  await page.goto("/"); await stable(page);
  const handoffs = await page.evaluate(() => (window as Window & { heroHandoffs?: { valid: boolean; opacity: number; phase?: string }[] }).heroHandoffs!);
  expect(handoffs.some(value => value.phase === "forming")).toBe(true);
  expect(handoffs.every(value => value.valid && value.opacity === 1)).toBe(true);
});

test("route exit terminates its worker; return and remount keep one canvas", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { value: 8 });
    const target = window as Window & { heroWorkers?: { created: number; terminated: number } };
    target.heroWorkers = { created: 0, terminated: 0 };
    const OriginalWorker = Worker;
    window.Worker = class extends OriginalWorker {
      constructor(url: string | URL, options?: WorkerOptions) { super(url, options); target.heroWorkers!.created++; }
      terminate() { target.heroWorkers!.terminated++; super.terminate(); }
    };
  });
  await page.goto("/"); await stable(page);
  await page.locator('a[href="/work/fitpilot"]').first().evaluate(anchor => (anchor as HTMLAnchorElement).click());
  await expect(page).toHaveURL(/\/work\/fitpilot/);
  expect(await page.evaluate(() => (window as Window & { heroWorkers?: { terminated: number } }).heroWorkers!.terminated)).toBe(1);
  await page.goBack(); await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" })); const portrait = await stable(page);
  await expect(portrait).toHaveAttribute("data-particle-formation-count", "1");
  await expect(page.locator(".particle-canvas")).toHaveCount(1);
  await page.reload(); await stable(page);
  await expect(portrait).toHaveAttribute("data-particle-formation-count", "1");
});

for (const mode of ["worker", "main", "constructor-failure", "watchdog", "crash"] as const) {
  test(`hero ${mode}: real cloud, formation, holding, reassembly and keyboard replay`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript((mode) => {
      Object.defineProperty(navigator, "hardwareConcurrency", { value: 8 });
      if (mode === "main") Object.defineProperty(window, "Worker", { value: undefined });
      if (mode === "constructor-failure") Object.defineProperty(window, "Worker", { value: class { constructor() { throw new Error("Test worker failure"); } } });
      if (mode === "watchdog") Object.defineProperty(window, "Worker", { value: class { postMessage() {} terminate() {} } });
      if (mode === "crash") {
        const OriginalWorker = window.Worker;
        window.Worker = class extends OriginalWorker {
          constructor(url: string | URL, options?: WorkerOptions) {
            super(url, options);
            setTimeout(() => this.dispatchEvent(new ErrorEvent("error")), 1600);
          }
        };
      }
    }, mode);
    const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
    await page.goto("/");
    const portrait = await stable(page);
    await expect(portrait).toHaveAttribute("data-particle-mode", mode === "worker" || mode === "crash" ? "worker" : "main");
    const formed = await values(page);
    expect(formed.initialMeanDisplacement).toBeGreaterThan(formed.portraitWidth * 0.25);
    expect(formed.particles).toBeGreaterThan(15000);
    expect(formed.frames).toBeGreaterThan(20);
    expect(formed.reassembled).toBe(true);
    if (mode === "crash") await expect(portrait).toHaveAttribute("data-particle-mode", "main", { timeout: 10000 });
    const canvas = page.locator(".particle-canvas"), bounds = (await canvas.boundingBox())!;
    await page.mouse.move(bounds.x + bounds.width * 0.5, bounds.y + bounds.height * 0.27);
    await expect(portrait).toHaveAttribute("data-particle-phase", "holding", { timeout: 10000 });
    const held = await values(page);
    expect(held.maxDisplacement).toBeGreaterThan(20);
    expect(held.reassembled).toBe(false);
    await expect(canvas).toHaveCSS("opacity", "1");
    const sleeping = await portrait.getAttribute("data-particle-metrics");
    await page.waitForTimeout(300); expect(await portrait.getAttribute("data-particle-metrics")).toBe(sleeping);
    await page.mouse.move(10, 10); await stable(page);
    const replay = page.getByRole("button", { name: "Reassemble portrait" });
    await replay.focus(); await page.keyboard.press("Enter");
    await expect(portrait).toHaveAttribute("data-particle-phase", "forming");
    await expect(canvas).toHaveCSS("opacity", "1");
    await stable(page);
    await expect(canvas).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}

test("scroll re-entry, resize and hidden-tab pause never replay formation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto("/");
  const portrait = await stable(page);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(portrait).toHaveAttribute("data-particle-simulation", "paused");
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect(portrait).toHaveAttribute("data-particle-phase", "assembled");
  await expect(portrait).toHaveAttribute("data-particle-formation-count", "1");
  await page.getByRole("button", { name: "Reassemble portrait" }).click();
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { value: true, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect(portrait).toHaveAttribute("data-particle-state", "resting");
  await expect(portrait).toHaveAttribute("data-particle-reassembled", "true");
  const metrics = await portrait.getAttribute("data-particle-metrics"); await page.waitForTimeout(200);
  expect(await portrait.getAttribute("data-particle-metrics")).toBe(metrics);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { value: false, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect(page.locator(".particle-canvas")).toHaveCount(1);
});

for (const preference of ["reduce", "forced"] as const) {
  test(`${preference} motion/accessibility fallback and live changes`, async ({ page }) => {
    await page.emulateMedia(preference === "reduce" ? { reducedMotion: "reduce" } : { forcedColors: "active" });
    await page.goto("/"); await expect(page.locator(".particle-canvas")).toHaveCount(0);
    await expect(page.locator(".hero-artwork img")).toHaveCSS("opacity", "1");
    await expect(page.getByRole("link", { name: "Explore my work" })).toBeVisible();
    await page.emulateMedia({ reducedMotion: "no-preference", forcedColors: "none" });
    await stable(page); await page.getByRole("button", { name: "Reassemble portrait" }).click();
    await page.emulateMedia(preference === "reduce" ? { reducedMotion: "reduce" } : { forcedColors: "active" });
    await expect(page.locator(".particle-canvas")).toHaveCount(0);
    await expect(page.locator(".hero-artwork img")).toHaveCSS("opacity", "1");
    await expect(page.getByRole("button", { name: "Reassemble portrait" })).toHaveCount(0);
  });
}

for (const failure of ["image", "context"] as const) {
  test(`${failure} failure retains an accessible hero and usable links`, async ({ page }) => {
    if (failure === "image") await page.route("**/assets/profile/photo.png", route => route.abort());
    else await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext; });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore my work" })).toBeVisible();
    await expect(page.locator(".particle-canvas")).toHaveCount(0);
    if (failure === "image") await expect(page.locator(".hero-artwork .character-fallback")).toBeVisible();
    else await expect(page.locator(".hero-artwork img")).toHaveCSS("opacity", "1");
  });
}

test("mobile genuine touch, tap, cancellation and native vertical scrolling", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const page = await context.newPage(); await page.goto("http://127.0.0.1:3100/");
  await page.locator(".character-frame").scrollIntoViewIfNeeded(); const portrait = await stable(page);
  const box = (await page.locator(".character-frame").boundingBox())!, horizontal = box.x + box.width * 0.5, vertical = box.y + box.height * 0.3;
  const session = await context.newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: horizontal, y: vertical }] });
  await expect(portrait).toHaveAttribute("data-particle-interaction", "touch");
  await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: horizontal + 25, y: vertical }] });
  await expect(portrait).toHaveAttribute("data-particle-state", "active");
  await expect.poll(async () => (await values(page)).maxDisplacement).toBeGreaterThan(3);
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await stable(page);
  await page.touchscreen.tap(horizontal, vertical); await stable(page);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: horizontal, y: vertical }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchCancel", touchPoints: [] }); await stable(page);
  const before = await page.evaluate(() => scrollY);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: horizontal, y: vertical + 50 }] });
  for (let step = 1; step <= 6; step++) { await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: horizontal, y: vertical + 50 - step * 25 }] }); await page.waitForTimeout(30); }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 50);
  expect((await values(page)).particles).toBeLessThan(7000);
  await expect(page.getByRole("button", { name: "Reassemble portrait" })).toBeVisible(); await context.close();
});

for (const [width, height] of [[320,844], [375,844], [390,844], [414,844], [768,1000], [1024,600], [1280,720], [1440,900], [1920,1080]]) {
  test(`Copper Cosmos fits ${width}×${height} and doubled text`, async ({ page }) => {
    await page.setViewportSize({ width, height }); await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const check = async () => {
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      const copy = (await page.locator(".hero-copy").boundingBox())!, art = (await page.locator(".hero-artwork").boundingBox())!;
      expect(copy.x + copy.width <= art.x + 1 || copy.y + copy.height <= art.y + 1).toBe(true);
      const brokenWords = await page.locator("h1").evaluate(heading => {
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT), broken: string[] = [];
        let node: Node | null;
        while ((node = walker.nextNode())) {
          for (const match of (node.textContent ?? "").matchAll(/\S+/g)) {
            const range = document.createRange(); range.setStart(node, match.index); range.setEnd(node, match.index + match[0].length);
            if (range.getClientRects().length > 1) broken.push(match[0]);
          }
        }
        return broken;
      });
      expect(brokenWords).toEqual([]);
    };
    await check();
    if (width >= 1024 && height <= 720) {
      for (const name of ["Explore my work", "Get to know me"]) {
        const bounds = (await page.getByRole("link", { name }).boundingBox())!;
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(height);
      }
      const status = (await page.locator(".current-project > span").nth(1).boundingBox())!;
      expect(status.y + status.height).toBeLessThanOrEqual(height);
    }
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; }); await check();
  });
}

test("no-JS hero retains its approved image, introduction and both actions", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage(); await page.goto("http://127.0.0.1:3100/");
  await expect(page.locator(".hero-artwork img")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore my work" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Get to know me" })).toBeVisible(); await context.close();
});
