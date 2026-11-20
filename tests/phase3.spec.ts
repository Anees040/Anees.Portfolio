import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";

const output = ".qa/phase3-finish";
const slugs = ["sportlynk", "fitpilot", "sukoon", "eduverse"];
test.beforeAll(async () => { if (process.env.CAPTURE_VISUALS === "1") await mkdir(output, { recursive: true }); });

async function home(page: Page) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
}

for (const mode of ["worker", "main", "worker-failure"] as const) {
  test(`portrait ${mode} assembles, replays by keyboard, reacts and stops`, async ({ page }) => {
    await page.addInitScript((mode) => {
      Object.defineProperty(navigator, "hardwareConcurrency", { value: 8 });
      if (mode === "main") Object.defineProperty(window, "Worker", { value: undefined });
      if (mode === "worker-failure") Object.defineProperty(window, "Worker", { value: class { constructor() { throw new Error("Unavailable worker"); } } });
    }, mode);
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await home(page);
    const portrait = page.locator(".image-atomizer");
    await expect(portrait).toHaveAttribute("data-particle-mode", mode === "worker" ? "worker" : "main");
    await expect(portrait).toHaveAttribute("data-particle-metrics", /particles/, { timeout: 10000 });
    await expect(portrait).toHaveAttribute("data-particle-formation-complete", "true", { timeout: 10000 });
    await expect(portrait).toHaveAttribute("data-particle-state", "resting");
    const first = await portrait.getAttribute("data-particle-metrics");
    const metrics = JSON.parse(first!);
    expect(metrics.particles).toBeGreaterThan(1000);
    expect(metrics.particles).toBeLessThan(30000);
    expect(metrics.frames).toBeGreaterThan(20);
    expect(metrics.initialMeanDisplacement).toBeGreaterThan(metrics.portraitWidth * 0.25);
    expect(metrics.formationMs).toBeGreaterThan(0);
    expect(metrics.forming).toBe(false);
    expect(metrics.settled).toBe(true);
    expect(metrics.maxDisplacement).toBe(0);
    expect(metrics.meanDisplacement).toBe(0);
    expect(metrics.reassembled).toBe(true);
    await expect(portrait).toHaveAttribute("data-particle-formation-count", "1");
    await page.waitForTimeout(300);
    expect(await portrait.getAttribute("data-particle-metrics")).toBe(first);
    const replay = page.getByRole("button", { name: "Reassemble portrait" });
    await replay.focus();
    await page.keyboard.press("Enter");
    await expect(portrait).toHaveAttribute("data-particle-state", "active");
    await expect(page.locator(".particle-canvas")).toHaveCSS("opacity", "1");
    await expect(page.locator(".hero-artwork .character-portrait")).toHaveCSS("opacity", "0");
    await expect(portrait).toHaveAttribute("data-particle-state", "resting", { timeout: 10000 });
    await expect(portrait).toHaveAttribute("data-particle-formation-count", "2");
    const replayed = JSON.parse((await portrait.getAttribute("data-particle-metrics"))!);
    expect(replayed.frames).toBeGreaterThan(metrics.frames);
    expect(replayed.maxDisplacement).toBe(0);
    expect(replayed.reassembled).toBe(true);
    const box = (await page.locator(".particle-canvas").boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.3);
    await expect(portrait).toHaveAttribute("data-particle-state", "active");
    await page.mouse.move(5, 5);
    await expect(portrait).toHaveAttribute("data-particle-state", "resting", { timeout: 10000 });
    if (process.env.CAPTURE_VISUALS === "1") await writeFile(`${output}/particle-${mode}.json`, JSON.stringify({ initial: metrics, interaction: JSON.parse((await portrait.getAttribute("data-particle-metrics"))!) }, null, 2));
    expect(errors).toEqual([]);
  });
}

test("portrait settles when hidden/offscreen and remeasures after an offscreen resize", async ({ page }) => {
  await home(page);
  const portrait = page.locator(".image-atomizer");
  await expect(page.getByRole("button", { name: "Reassemble portrait" })).toBeVisible();
  await page.getByRole("button", { name: "Reassemble portrait" }).click();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(portrait).toHaveAttribute("data-particle-state", "resting");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.getByRole("button", { name: "Reassemble portrait" }).click();
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(portrait).toHaveAttribute("data-particle-state", "resting");
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect(portrait).toHaveAttribute("data-particle-state", "resting", { timeout: 10000 });
  await expect(page.locator(".particle-canvas")).toHaveCount(1);
});

test("live reduced motion removes the particle renderer and immediately restores the image", async ({ page }) => {
  await home(page);
  const replay = page.getByRole("button", { name: "Reassemble portrait" });
  await replay.click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".particle-canvas")).toHaveCount(0);
  await expect(page.locator(".hero-artwork .character-portrait")).toHaveCSS("opacity", "1");
  await expect(replay).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".particle-canvas")).toHaveCount(1);
});

test("a worker failure in a hidden tab recovers on return", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { value: 8 });
    Object.defineProperty(window, "Worker", { value: class {
      onerror: (() => void) | null = null;
      private timer = setTimeout(() => this.onerror?.(), 700);
      postMessage() {}
      terminate() { clearTimeout(this.timer); }
    } });
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".particle-canvas")).toHaveCount(1);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(".particle-canvas")).toHaveCount(0);
  await expect(page.locator(".hero-artwork .character-portrait")).toHaveCSS("opacity", "1");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(".image-atomizer")).toHaveAttribute("data-particle-mode", "main");
  await expect(page.locator(".image-atomizer")).toHaveAttribute("data-particle-metrics", /particles/, { timeout: 10000 });
  await expect(page.getByRole("button", { name: "Reassemble portrait" })).toBeVisible();
});

test("touch and low-core devices use interactive lower-density portrait paths", async ({ browser, page }) => {
  const context = await browser.newContext({ viewport: { width: 768, height: 1000 }, hasTouch: true });
  const touch = await context.newPage();
  await touch.goto("http://127.0.0.1:3100", { waitUntil: "networkidle" });
  await expect(touch.locator(".particle-canvas")).toHaveCount(1);
  await expect(touch.locator(".image-atomizer")).toHaveAttribute("data-particle-mode", "main");
  await expect(touch.locator(".hero-artwork .character-portrait")).toBeVisible();
  await context.close();
  await page.addInitScript(() => Object.defineProperty(navigator, "hardwareConcurrency", { value: 4 }));
  await home(page);
  const portrait = page.locator(".image-atomizer");
  await expect(portrait).toHaveAttribute("data-particle-metrics", /particles/, { timeout: 10000 });
  const metrics = JSON.parse((await portrait.getAttribute("data-particle-metrics"))!);
  expect(metrics.mode).toBe("main");
  expect(metrics.width).toBeLessThanOrEqual(300);
  expect(metrics.particles).toBeLessThan(7000);
});

for (const mode of ["unprotected", "protected"] as const) {
  test(`concurrency lab ${mode} shows the complete request sequence and resets`, async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const lab = page.locator(".concurrency-lab");
    await lab.getByRole("button", { name: mode === "protected" ? "Protected reservation" : "Unprotected booking", exact: true }).click();
    await lab.getByRole("button", { name: "Start scenario" }).focus();
    await page.keyboard.press("Enter");
    await expect(lab.locator(".lab-event-log li")).toHaveCount(1);
    for (let event = 2; event <= 4; event++) {
      await lab.getByRole("button", { name: "Next event" }).click();
      await expect(lab).toHaveAttribute("data-lab-step", String(event));
      await expect(lab.locator(".lab-event-log li")).toHaveCount(event);
    }
    await expect(lab.locator(".lab-reservations > span")).toHaveCount(mode === "protected" ? 1 : 2);
    await expect(lab.getByRole("status")).toHaveText(mode === "protected" ? "One reservation. One clear rejection." : "Conflict: two accepted reservations.");
    await expect(lab.getByRole("button", { name: "Next event" })).toBeDisabled();
    if (process.env.CAPTURE_VISUALS === "1") await lab.screenshot({ path: `${output}/lab-${mode}.png` });
    const scan = await new AxeBuilder({ page }).include("#playground").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(scan.violations).toEqual([]);
    await lab.getByRole("button", { name: "Reset", exact: true }).click();
    await expect(lab).toHaveAttribute("data-lab-step", "0");
    await expect(lab.locator(".lab-event-log li")).toHaveCount(0);
    await expect(lab.getByRole("status")).toHaveText("One slot available.");
  });
}

test("engineering native chapters work by keyboard and connect to project evidence", async ({ page }) => {
  await page.goto("/");
  const chapters = page.locator(".engineering-area");
  for (let i = 0; i < 6; i++) {
    const chapter = chapters.nth(i);
    if (!await chapter.getAttribute("open").then(v => v !== null)) {
      await chapter.locator("summary").focus();
      await page.keyboard.press("Enter");
    }
    await expect(page.locator(".engineering-area[open]")).toHaveCount(1);
    await expect(chapter.locator(".engineering-answer")).toBeVisible();
    await expect(chapter.locator('.engineering-projects a[href^="/work/"]').first()).toBeVisible();
  }
});

test("build trail follows reversible scroll and live reduced motion settles the path", async ({ page }) => {
  await home(page);
  const trail = page.locator(".trail-layout");
  const range = await trail.evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, height: el.clientHeight }));
  const progress: number[] = [];
  for (const fraction of [0.15, 0.65, 0.35]) {
    await page.evaluate(({ top, height, fraction }) => scrollTo({ top: top + height * fraction - innerHeight / 2, behavior: "instant" }), { ...range, fraction });
    await expect(trail).toHaveAttribute("data-trail-motion", "active");
    const expected = await trail.evaluate((element, fraction) => {
      const bounds = element.getBoundingClientRect();
      const chapters = Array.from(element.querySelectorAll<HTMLElement>(".trail-chapters > li"));
      const starts = chapters.map(chapter => chapter.getBoundingClientRect().top - bounds.top);
      const position = element.clientHeight * fraction;
      let chapter = 0;
      for (let index = 1; index < starts.length; index++) if (position >= starts[index]) chapter = index;
      const next = Math.min(chapter + 1, starts.length - 1);
      const within = next === chapter ? 0 : (position - starts[chapter]) / (starts[next] - starts[chapter]);
      return (chapter + within) / (starts.length - 1);
    }, fraction);
    await expect.poll(async () => Number(await trail.getAttribute("data-trail-progress"))).toBeCloseTo(expected, 2);
    progress.push(Number(await trail.getAttribute("data-trail-progress")));
  }
  expect(progress[1]).toBeGreaterThan(progress[0]);
  expect(progress[2]).toBeLessThan(progress[1]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(trail).toHaveAttribute("data-trail-motion", "static");
  await expect(trail).toHaveAttribute("data-trail-progress", "1.000");
  await expect(page.locator(".trail-copper")).toHaveCSS("stroke-dashoffset", "0px");
});

for (const width of [320, 375, 390, 414, 768, 1024, 1280, 1440, 1920]) {
  test(`all four case studies retain content and fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const slug of slugs) {
      const response = await page.goto(`/work/${slug}`, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("#implementation")).toBeVisible();
      await expect(page.locator("#outcome")).toBeVisible();
      await expect(page.locator(".next-project a").first()).toHaveAttribute("href", /^\/work\//);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const clipped = await page.locator("h1,h2,h3,p,summary").evaluateAll(els => els.filter(el => el.checkVisibility()).filter(el => el.scrollWidth > el.clientWidth + 1 || el.getBoundingClientRect().right > innerWidth + 1 || el.getBoundingClientRect().left < -1).map(el => el.textContent));
      expect(clipped).toEqual([]);
      if (width === 390 || width === 1440) {
        for (const img of await page.locator(".gallery-image-trigger img").all()) {
          await img.scrollIntoViewIfNeeded();
          await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
        }
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        if (process.env.CAPTURE_VISUALS === "1") await page.screenshot({ path: `${output}/case-${slug}-${width}.png`, fullPage: true });
        const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
        expect(scan.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target), summary: v.nodes[0]?.failureSummary }))).toEqual([]);
      }
    }
  });
}

test("case galleries enlarge genuine images, close with Escape, and restore focus", async ({ page }) => {
  for (const slug of slugs.slice(1)) {
    await page.goto(`/work/${slug}`);
    const trigger = page.locator(".gallery-image-trigger").first();
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.locator(".gallery-popover:popover-open");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Close screenshot" })).toBeFocused();
    await expect.poll(() => dialog.locator("img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    for (const layer of await page.locator(".architecture-station summary").all()) {
      if (!await layer.evaluate(el => el.parentElement!.hasAttribute("open"))) await layer.click();
      await expect(page.locator(".architecture-station details[open]")).toHaveCount(1);
    }
  }
});

test("case studies and new native disclosures remain useful without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100");
  await page.locator(".engineering-area").nth(1).locator("summary").click();
  await expect(page.locator(".engineering-area").nth(1).locator(".engineering-answer")).toBeVisible();
  await page.locator(".lab-reading summary").click();
  await expect(page.locator(".lab-reading")).toContainText("A reads available");
  await expect(page.getByRole("button", { name: "Start scenario" })).toBeDisabled();
  for (const slug of slugs) {
    await page.goto(`http://127.0.0.1:3100/work/${slug}`);
    await expect(page.locator("h1")).toBeVisible();
    await page.locator(".architecture-station summary").nth(1).click();
    await expect(page.locator(".architecture-station").nth(1).locator(".architecture-detail")).toBeVisible();
    if (slug !== "sportlynk") {
      await page.locator(".gallery-image-trigger").first().click();
      await expect(page.locator(".gallery-popover:popover-open")).toBeVisible();
      await page.keyboard.press("Escape");
    }
  }
  await context.close();
});

test("new sections and case studies remain usable with doubled text", async ({ page }) => {
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/", "/work/fitpilot", "/work/sportlynk"]) {
      await page.goto(route, { waitUntil: "networkidle" });
      await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const clipped = await page.locator("h1,h2,h3,p,summary,button").evaluateAll(els => els.filter(el => el.checkVisibility()).filter(el => {
        if (el.tagName !== "BUTTON") return el.scrollWidth > el.clientWidth + 1;
        // Measure content, excluding the workshop's intentionally offset focus outline.
        const bounds = el.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(el);
        const content = range.getBoundingClientRect();
        return content.width > 0 && (content.left < bounds.left - 1 || content.right > bounds.right + 1);
      }).map(el => ({ className: el.className, text: el.textContent })));
      expect(clipped).toEqual([]);
    }
  }
});

test("unknown case study route returns a real 404", async ({ page }) => {
  const response = await page.goto("/work/not-a-project");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("This page could not be found.")).toBeVisible();
});
