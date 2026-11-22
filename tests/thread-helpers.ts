import { expect, type Page } from "@playwright/test";
import { journeyChapters } from "../lib/profile-content";

export const threadIds = journeyChapters.map(chapter => `trail-${chapter.id}`);
export const threadProgress = [0.06, 0.28, 0.50, 0.72, 0.94] as const;
export const threadHolds = [[0, 0.12], [0.22, 0.34], [0.44, 0.56], [0.66, 0.78], [0.88, 1]] as const;
export const threadScene = (page: Page) => page.locator('[data-scroll-scene="follow-the-thread"]');

export async function loadThread(page: Page, width = 1440, height = 900, hash = "") {
  await page.addInitScript(() => { Object.defineProperty(navigator, "maxTouchPoints", { value: 0 }); });
  await page.setViewportSize({ width, height });
  await page.goto(`/${hash}`, { waitUntil: "networkidle" });
  await expect(threadScene(page)).toHaveAttribute("data-scene-mode", /^(pinned|static)$/, { timeout: 10000 });
  await expect(page.locator('[data-scroll-scene][data-scene-mode="pending"]')).toHaveCount(0);
}

export async function seekThread(page: Page, progress: number) {
  await expect(threadScene(page)).toHaveAttribute("data-scene-mode", "pinned");
  await threadScene(page).evaluate((element, progress) => {
    const scene = element as HTMLElement;
    const start = Number(scene.dataset.sceneStart), end = Number(scene.dataset.sceneEnd);
    scrollTo({ top: start + (end - start) * progress, behavior: "instant" });
  }, progress);
  if (progress >= 0 && progress <= 1) await expect.poll(async () => Number(await threadScene(page).getAttribute("data-thread-progress"))).toBeCloseTo(progress, 3);
}

export async function chooseThread(page: Page, index: number) {
  const link = page.getByRole("navigation", { name: "Journey chapters" }).locator("a").nth(index);
  await link.focus(); await link.press("Enter");
  await expect(page).toHaveURL(new RegExp(`#${threadIds[index]}$`));
  await expect(page.locator(`#${threadIds[index]}`)).toBeFocused();
  await expect(link).toHaveAttribute("aria-current", "step");
  await expect(threadScene(page)).toHaveAttribute("data-thread-chapter", threadIds[index]);
}

export async function expectStackedThread(page: Page) {
  const scene = threadScene(page);
  await expect(scene).toHaveAttribute("data-scene-mode", /^(static|failed)$/);
  await expect(scene).toHaveAttribute("data-thread-layout", "stacked");
  const panels = scene.locator("[data-thread-panel]");
  await expect(panels).toHaveCount(5);
  expect(await panels.evaluateAll(elements => elements.every(element => !element.hasAttribute("aria-hidden") && !element.querySelector("[inert]")))).toBe(true);
  const positions = await panels.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().top));
  expect(positions.every((top, index) => !index || top > positions[index - 1])).toBe(true);
  await expect(scene.locator("[data-thread-filament]")).toHaveCSS("stroke-dashoffset", "0px");
  await expect(scene.locator(".pin-spacer")).toHaveCount(0);
}
