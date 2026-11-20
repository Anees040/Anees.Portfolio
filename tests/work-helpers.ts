import { expect, type Page } from "@playwright/test";

export const workIds = ["sportlynk", "fitpilot", "sukoon", "eduverse"] as const;
export const workProgress = [0.08, 0.36, 0.64, 0.92] as const;
export const workScene = (page: Page) => page.locator('[data-scroll-scene="selected-work"]');

export async function loadWork(page: Page, width = 1440, height = 900, hash = "") {
  await page.addInitScript(() => { Object.defineProperty(navigator, "maxTouchPoints", { value: 0 }); });
  await page.setViewportSize({ width, height });
  await page.goto(`/${hash}`, { waitUntil: "networkidle" });
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", /^(pinned|static)$/, { timeout: 10000 });
}

export async function chooseWork(page: Page, slug: string) {
  await page.locator(`[data-work-project-navigation] a[href="#${slug}"]`).click();
  await expect(page.locator(`#${slug}`)).toBeFocused();
  await expect(workScene(page)).toHaveAttribute("data-work-project", slug);
  await expect(page.locator(`#${slug} [data-work-case-link]`)).toBeVisible();
}

export async function seekWork(page: Page, progress: number) {
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", "pinned");
  await workScene(page).evaluate((element, progress) => {
    const scene = element as HTMLElement;
    const start = Number(scene.dataset.sceneStart), end = Number(scene.dataset.sceneEnd);
    scrollTo({ top: start + (end - start) * progress, behavior: "instant" });
  }, progress);
  if (progress >= 0 && progress <= 1) await expect.poll(async () => Number(await workScene(page).getAttribute("data-work-progress"))).toBeCloseTo(progress, 2);
}

export async function expectStackedWork(page: Page) {
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", "static");
  await expect(workScene(page)).toHaveAttribute("data-work-layout", "stacked");
  const panels = page.locator("[data-work-panel]");
  expect(await panels.evaluateAll(elements => elements.every(element => !element.hasAttribute("aria-hidden") && !element.querySelector("[inert]")))).toBe(true);
  const positions = await panels.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().top));
  expect(positions.every((top, index) => !index || top > positions[index - 1])).toBe(true);
}
