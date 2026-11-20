import { expect, test, type Page } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { profileContent } from "../lib/profile-content";

test.use({ screenshot: "off", video: "off", trace: "off" });
const photograph = "/assets/profile/photo.png";
const illustration = "/assets/character/anees-working-illustration.png";

async function load(page: Page, width = 1440, height = 900, reducedMotion: "reduce" | "no-preference" = "reduce") {
  await page.addInitScript(() => { Object.defineProperty(navigator, "maxTouchPoints", { value: 0 }); });
  await page.setViewportSize({ width, height }); await page.emulateMedia({ reducedMotion });
  await page.goto("/", { waitUntil: "networkidle" });
}
async function expectOriginal(page: Page) {
  const portrait = page.locator("#home .character-portrait");
  await expect(page.locator('img[src="/assets/profile/photo.png"]')).toHaveCount(1);
  await expect(page.locator("#about [data-about-image]")).toHaveCount(0);
  await expect(portrait).toHaveAttribute("src", photograph);
  await expect(portrait).toHaveAttribute("alt", "Photograph of Muhammad Anees.");
  await expect(portrait).toHaveAttribute("width", "1268"); await expect(portrait).toHaveAttribute("height", "1240");
  await expect.poll(() => portrait.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth === 1268 && image.naturalHeight === 1240)).toBe(true);
  await expect(portrait).toHaveCSS("object-fit", "contain"); await expect(portrait).toHaveCSS("filter", "none");
  expect(await portrait.evaluate((image: HTMLImageElement) => new URL(image.currentSrc).pathname)).toBe(photograph);
}
async function expectFacts(page: Page) {
  const about = page.locator("#about");
  for (const fact of [profileContent.introduction, profileContent.philosophy, profileContent.education.description, profileContent.education.institution, ...profileContent.interests, profileContent.building, profileContent.learning, profileContent.direction]) await expect(about).toContainText(fact);
  await expect(about.locator("dl > div")).toHaveCount(5);
  await expect(about.locator('a[href$=".pdf"], a[href*="linkedin.com"]')).toHaveCount(0);
}

test("shipping PNGs preserve the exact owner-supplied bytes, measured dimensions and alpha format", async ({ request }) => {
  for (const asset of [
    { src: photograph, hash: "919ee923ea6841660582aa8eb87cfc5f04b4bcd9b92d7341455d494e6e9a33e3", width: 1268, height: 1240, colorType: 2 },
    { src: illustration, hash: "df7b85d050b1d893a953483e47c98df3d9a12eac1a968e8c0b817f5245306d67", width: 1402, height: 1122, colorType: 6 },
  ]) {
    const original = await readFile('public' + asset.src);
    expect(createHash("sha256").update(original).digest("hex")).toBe(asset.hash);
    expect(original.readUInt32BE(16)).toBe(asset.width); expect(original.readUInt32BE(20)).toBe(asset.height); expect(original[25]).toBe(asset.colorType);
    const response = await request.get(asset.src);
    expect(response.status()).toBe(200); expect(response.headers()["content-type"]).toContain("image/png"); expect(await response.body()).toEqual(original);
  }
  expect(profileContent.photograph).toMatchObject({ src: photograph, width: 1268, height: 1240 });
});

test("Hero alone owns the original identity portrait, with an integrated elliptical stage and no matte", async ({ page }) => {
  await load(page); await expectOriginal(page);
  const image = page.locator("#home .character-portrait");
  await expect(image).toHaveCSS("opacity", "1");
  expect(await image.evaluate(element => getComputedStyle(element).clipPath.startsWith("ellipse("))).toBe(true);
  expect(await page.locator("#home .character-frame").evaluate(element => getComputedStyle(element, "::before").content)).toBe("none");
  await expect(page.locator('#home img[src*="anees-idle"], #about img[src*="workspace-working"], #about img[src*="character-primary"]')).toHaveCount(0);
  await expectFacts(page);
});

test("one supporting scene keeps real transparency and proportions without redundant captions or fabricated parts", async ({ page }) => {
  await load(page);
  const image = page.locator("#about [data-about-working] img"); await image.scrollIntoViewIfNeeded();
  await expect(page.locator('img[src="/assets/character/anees-working-illustration.png"]')).toHaveCount(1);
  await expect.poll(() => image.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth === 1402 && image.naturalHeight === 1122)).toBe(true);
  const alpha = await image.evaluate((image: HTMLImageElement) => {
    const canvas = document.createElement("canvas"); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d")!; context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0; for (let offset = 3; offset < pixels.length; offset += 4) if (pixels[offset] === 0) transparent++;
    const bounds = image.getBoundingClientRect(); return { transparent, ratio: bounds.width / bounds.height };
  });
  expect(alpha.transparent).toBe(760856); expect(alpha.ratio).toBeCloseTo(1402 / 1122, 2);
  await expect(page.locator("#about")).toHaveCSS("background-color", "rgb(231, 224, 213)");
  await expect(page.locator("#about figure figcaption, #about figure a, #about figure button, #about figure [tabindex]")).toHaveCount(0);
  expect(await page.locator("#about [data-about-working]").evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
});

for (const width of [320, 375, 390, 414, 768, 1024, 1280, 1440, 1920]) {
  test('portrait, biography, facts and single working scene fit ' + width + 'px and enlarged text', async ({ page }) => {
    await load(page, width); await expectOriginal(page); await expectFacts(page);
    const check = async () => {
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      for (const target of await page.locator("#about [data-about-copy], #about [data-about-facts], #about [data-about-working]").all()) {
        const bounds = (await target.boundingBox())!; expect(bounds.x).toBeGreaterThanOrEqual(-1); expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
      }
      const portrait = (await page.locator("#home img").boundingBox())!;
      expect(portrait.width).toBeLessThanOrEqual(468.1); expect(portrait.width / portrait.height).toBeCloseTo(1268 / 1240, 2);
    };
    await check(); await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; }); await check();
    const positions = await page.locator("#about [data-about-copy], #about [data-about-facts], #about [data-about-working]").evaluateAll(elements => elements.map(element => element.getBoundingClientRect()));
    expect(positions[0].right <= positions[1].left + 1 || positions[0].bottom <= positions[1].top + 1).toBe(true);
  });
}

for (const viewport of [{ width: 1024, height: 600 }, { width: 1280, height: 720 }]) {
  test('About stays complete and static on a short ' + viewport.width + 'px screen', async ({ page }) => {
    await load(page, viewport.width, viewport.height, "no-preference"); await page.locator("#about").scrollIntoViewIfNeeded();
    for (const target of await page.locator("#about [data-about-copy], #about [data-about-facts], #about [data-about-working]").all()) {
      await expect(target).toHaveCSS("transform", "none"); await expect(target).toHaveCSS("opacity", "1"); expect(await target.evaluate(element => element.getAnimations().length)).toBe(0);
    }
    await expectFacts(page);
  });
}

test("static photograph and particle source have the same ellipse, scale, offset and exact reassembly", async ({ page }) => {
  await load(page, 1440, 900, "no-preference");
  const atomizer = page.locator("#home .image-atomizer");
  await expect(atomizer).toHaveAttribute("data-particle-formation-complete", "true"); await expect(atomizer).toHaveAttribute("data-particle-reassembled", "true");
  const fit = await atomizer.evaluate(element => {
    const image = element.querySelector<HTMLImageElement>("img")!, frame = element.querySelector(".character-frame")!.getBoundingClientRect(), bounds = image.getBoundingClientRect();
    const metrics = JSON.parse((element as HTMLElement).dataset.particleMetrics!);
    return { displayWidth: bounds.width, samplerWidth: metrics.portraitWidth / metrics.width * frame.width, left: bounds.left - frame.left, expectedLeft: frame.width * 0.11, top: bounds.top - frame.top, expectedTop: frame.height * 0.06, particles: metrics.particles, bytes: metrics.bufferBytes };
  });
  expect(fit.displayWidth).toBeLessThanOrEqual(468.1); expect(Math.abs(fit.displayWidth - fit.samplerWidth)).toBeLessThan(1);
  expect(Math.abs(fit.left - fit.expectedLeft)).toBeLessThan(1); expect(Math.abs(fit.top - fit.expectedTop)).toBeLessThan(1);
  expect(fit.particles).toBeLessThanOrEqual(32000); expect(fit.bytes).toBeLessThanOrEqual(8 * 1024 * 1024);
});

test("keyboard replay remains functional and About links retain their tab order without motion", async ({ page }) => {
  await load(page, 1440, 900, "no-preference");
  const atomizer = page.locator("#home .image-atomizer"); await expect(atomizer).toHaveAttribute("data-particle-formation-complete", "true");
  const count = Number(await atomizer.getAttribute("data-particle-formation-count")), replay = atomizer.getByRole("button", { name: "Reassemble portrait" });
  await replay.focus(); await replay.press("Enter"); await expect.poll(async () => Number(await atomizer.getAttribute("data-particle-formation-count"))).toBe(count + 1);
  await expect(atomizer).toHaveAttribute("data-particle-reassembled", "true"); await expectOriginal(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const github = page.locator("#about").getByRole("link", { name: "Follow the work on GitHub" }); await github.focus(); await github.press("Tab");
  await expect(page.locator("#about").getByRole("link", { name: "Get in touch" })).toBeFocused();
});

test("working artwork stays still while copy enters and motion preferences change", async ({ page }) => {
  await load(page, 1440, 900, "no-preference"); await page.locator("#about").scrollIntoViewIfNeeded();
  const working = page.locator("#about [data-about-working]");
  expect(await working.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  await page.emulateMedia({ reducedMotion: "reduce" }); await expect(working).toHaveCSS("transform", "none"); await expect(working).toHaveCSS("opacity", "1"); await expectFacts(page);
});

test("unavailable working artwork cannot remove the Hero portrait, biography or facts", async ({ page }) => {
  await page.route("**/assets/character/anees-working-illustration.png", route => route.abort()); await load(page); await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(page.locator('#about [data-about-working-failed="true"]')).toBeVisible(); await expect(page.locator("#about [data-about-working]")).toBeHidden(); await expectOriginal(page); await expectFacts(page);
});

test.describe("touch-capable desktop", () => {
  test.use({ hasTouch: true, viewport: { width: 1440, height: 900 } });
  test("one identity portrait and one static working scene remain distinct", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" }); expect(await page.evaluate(() => navigator.maxTouchPoints > 0)).toBe(true);
    await page.locator("#about").scrollIntoViewIfNeeded();
    for (const target of await page.locator("#about [data-about-copy], #about [data-about-facts], #about [data-about-working]").all()) await expect(target).toHaveCSS("transform", "none");
    await expectOriginal(page); await expectFacts(page);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  test("the single photograph, working illustration, biography and five facts remain available", async ({ page }) => {
    await page.goto("/#about", { waitUntil: "networkidle" }); await expectOriginal(page); await expectFacts(page);
    const working = page.locator("#about [data-about-working] img"); await working.scrollIntoViewIfNeeded();
    await expect.poll(() => working.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth === 1402)).toBe(true);
    await expect(page.locator("#about").getByRole("link", { name: "Get in touch" })).toHaveAttribute("href", "mailto:muhammadanees0511@gmail.com");
  });
});
