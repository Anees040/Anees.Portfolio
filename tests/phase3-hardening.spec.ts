import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { journeyChapters, profileContent } from "../lib/profile-content";
import { chooseWork, expectStackedWork, loadWork } from "./work-helpers";
import { loadThread, seekThread, threadProgress } from "./thread-helpers";

test("profile and journey support owner content without invented dates or assets", () => {
  expect(new Set(journeyChapters.map(chapter => chapter.id)).size).toBe(journeyChapters.length);
  expect(journeyChapters.every(chapter => chapter.title && chapter.body && chapter.href)).toBe(true);
  if (profileContent.photograph) {
    expect(profileContent.photograph.src).toMatch(/^\//);
    expect(profileContent.photograph.width).toBeGreaterThan(0);
    expect(profileContent.photograph.alt.length).toBeGreaterThan(0);
  }
  if (profileContent.resume) expect(profileContent.resume.href).toMatch(/^\/.*\.pdf$/i);
  if (profileContent.linkedin) expect(profileContent.linkedin).toMatch(/^https:\/\/([\w-]+\.)?linkedin\.com\//);
});

for (const width of [390, 1440]) {
  test(`work native selection keeps focus and contrast at ${width}px`, async ({ page }) => {
    await loadWork(page, width, 1000);
    const studio = page.locator("#work");
    const notes = studio.getByRole("radio", { name: "Engineering Notes" }); await notes.focus(); await page.keyboard.press("Space");
    await expect(notes).toBeChecked(); await expect(notes).toBeFocused();
    const scan = await new AxeBuilder({ page }).include("#work").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(scan.violations.map(violation => ({ id: violation.id, targets: violation.nodes.map(node => node.target) }))).toEqual([]);
    await chooseWork(page, "fitpilot");
    await expect(studio.getByRole("region", { name: "FitPilot engineering notes" })).toContainText("neutral");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await studio.getByRole("radio", { name: "Build Log" }).check();
    await expect(studio.getByRole("region", { name: "FitPilot build log" })).toHaveCSS("animation-name", "none");
  });
}

test("trail highlights the measured chapter, reverses, and clears for reduced motion", async ({ page }) => {
  await loadThread(page, 1440, 1000);
  for (const index of [0, 3, 1]) {
    const chapter = page.locator(".trail-chapters > li").nth(index);
    await seekThread(page, threadProgress[index]);
    await expect(chapter).toHaveAttribute("data-trail-current", "true");
    await expect(page.locator("[data-trail-current='true']")).toHaveCount(1);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-trail-current='true']")).toHaveCount(0);
  await expect(page.locator(".trail-layout")).toHaveAttribute("data-trail-chapter", "static");
  await expect(page.locator(".trail-project-artifact")).toHaveCount(3);
  for (const link of await page.locator(".trail-project-artifact").all()) {
    await expect(link).toHaveAttribute("href", /^\/work\/(fitpilot|sukoon|eduverse)$/);
  }
});

test("lab identifies each acting request and the protected rejection", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  const lab = page.locator(".concurrency-lab");
  await lab.getByRole("button", { name: "Protected reservation", exact: true }).click();
  await expect(lab.locator(".lab-claim-boundary")).toHaveText("Final check + claim together");
  for (let event = 0; event < 4; event++) {
    await lab.getByRole("button", { name: event ? "Next event" : "Start scenario", exact: true }).click();
    await expect(lab.locator(".lab-player[data-current='true'] strong")).toHaveText(event % 2 ? "Player B" : "Player A");
    await expect(lab.locator(".lab-request-lines span[data-current='true']")).toHaveCount(1);
  }
  await expect(lab.locator(".lab-player-outcome")).toHaveText(["Reservation accepted", "Reservation rejected"]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await lab.locator(".lab-request-lines span").evaluateAll(elements => elements.every(element => getComputedStyle(element, "::before").transitionDuration === "0s"))).toBe(true);
  await lab.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(lab.locator(".lab-player-outcome")).toHaveCount(0);
  await expect(lab.locator(".lab-player[data-current='true']")).toHaveCount(0);
});

test("main-thread particle drawing really stops after rest, hidden state, and offscreen exit", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "Worker", { value: undefined });
    const target = window as Window & { particleDrawCount?: number };
    target.particleDrawCount = 0;
    const original = CanvasRenderingContext2D.prototype.putImageData;
    CanvasRenderingContext2D.prototype.putImageData = function (image: ImageData, originX: number, originY: number, ...dirty: number[]) {
      target.particleDrawCount!++;
      return Reflect.apply(original, this, [image, originX, originY, ...dirty]);
    };
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  const portrait = page.locator(".image-atomizer");
  const draws = () => page.evaluate(() => (window as Window & { particleDrawCount?: number }).particleDrawCount ?? 0);
  await expect(portrait).toHaveAttribute("data-particle-metrics", /particles/, { timeout: 10000 });
  await expect(portrait).toHaveAttribute("data-particle-formation-complete", "true", { timeout: 10000 });
  await expect(portrait).toHaveAttribute("data-particle-state", "resting");
  const formed = JSON.parse((await portrait.getAttribute("data-particle-metrics"))!);
  const count = await draws();
  expect(count).toBeGreaterThan(20);
  expect(count).toBe(formed.frames);
  expect(formed.initialMeanDisplacement).toBeGreaterThan(formed.portraitWidth * 0.25);
  expect(formed.reassembled).toBe(true);
  expect(formed.maxDisplacement).toBe(0);
  await page.waitForTimeout(250);
  expect(await draws()).toBe(count);
  await page.getByRole("button", { name: "Reassemble portrait" }).click();
  await expect.poll(draws).toBeGreaterThan(count);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(portrait).toHaveAttribute("data-particle-state", "resting");
  const hidden = await draws();
  await page.waitForTimeout(250);
  expect(await draws()).toBe(hidden);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.getByRole("button", { name: "Reassemble portrait" }).click();
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(portrait).toHaveAttribute("data-particle-state", "resting");
  const offscreen = await draws();
  await page.waitForTimeout(250);
  expect(await draws()).toBe(offscreen);
});

test("case-study chapter labels distinguish concept from verified implementation", async ({ page }) => {
  for (const slug of ["sportlynk", "fitpilot", "sukoon", "eduverse"]) {
    await page.goto(`/work/${slug}`, { waitUntil: "networkidle" });
    const conceptual = slug === "sportlynk";
    await expect(page.locator('.case-contents a[href="#implementation"]')).toHaveText(conceptual ? "The concept" : "The build");
    await expect(page.locator('.case-contents a[href="#architecture"]')).toHaveText(conceptual ? "The product map" : "The system");
    await expect(page.locator("#build-heading")).toContainText(conceptual ? "to product direction." : "to implementation.");
    await expect(page.locator("#decisions .case-section-title > p")).toContainText(conceptual ? "not observations from a verified implementation" : "What the implementation makes explicit");
    await expect(page.locator(".next-project .site-shell > span")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /^Next project:/ })).toHaveAttribute("href", /^\/work\//);
  }
});

test("narrow contact gives the headline room and keeps its final punctuation attached", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  for (const width of [320, 375, 390, 414]) {
    await page.setViewportSize({ width, height: 1000 });
    const heading = page.locator("#contact-heading");
    expect(await heading.evaluate(element => {
      const text = element.querySelector("em")!.firstChild!;
      const range = document.createRange();
      const last = text.textContent!.length - 1;
      range.setStart(text, last); range.setEnd(text, last + 1);
      const punctuation = range.getBoundingClientRect();
      range.setStart(text, last - 1); range.setEnd(text, last);
      return Math.abs(punctuation.top - range.getBoundingClientRect().top) < 1;
    })).toBe(true);
    expect(await page.locator(".contact-main").evaluate(element => {
      const heading = element.querySelector("h2")!.getBoundingClientRect();
      const action = element.querySelector("a")!.getBoundingClientRect();
      return action.top >= heading.bottom;
    })).toBe(true);
  }
});

for (const width of [320, 375, 390, 414, 768, 1024, 1280, 1440, 1920]) {
  test(`all routes preserve intrinsic controls and text at ${width}px with doubled text`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of ["/", "/work/sportlynk", "/work/fitpilot", "/work/sukoon", "/work/eduverse"]) {
      await page.goto(route, { waitUntil: "networkidle" });
      await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
      if (route === "/") {
        await expectStackedWork(page);
        expect(await page.locator("[data-work-panel]").evaluateAll(elements => elements.every(element => element.clientHeight >= element.querySelector<HTMLElement>("[data-work-content]")!.scrollHeight))).toBe(true);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const clipped = await page.locator("h1,h2,h3,p,summary,button").evaluateAll(elements => elements.filter(element => element.checkVisibility()).filter(element => {
        if (element.tagName !== "BUTTON") return element.scrollWidth > element.clientWidth + 1;
        const bounds = element.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(element);
        const content = range.getBoundingClientRect();
        return content.width > 0 && (content.left < bounds.left - 1 || content.right > bounds.right + 1);
      }).map(element => ({ className: element.className, text: element.textContent })));
      expect(clipped).toEqual([]);
    }
  });
}
