import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { caseStudies } from "../lib/case-studies";
import { profile } from "../lib/portfolio-content";
import { profileContent } from "../lib/profile-content";
import { chooseWork, expectStackedWork, loadWork, seekWork, workIds, workProgress, workScene } from "./work-helpers";

test.use({ screenshot: "off", video: "off", trace: "off" });

test("About follows the hero with one working scene, truthful notebook and real actions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await loadWork(page);
  const about = page.locator("#about");
  await expect(about.getByRole("heading", { level: 2 })).toHaveText("About");
  await expect(about).toContainText(profileContent.introduction);
  await expect(about).toContainText(profileContent.philosophy);
  for (const content of [profileContent.education.institution, profileContent.education.description, profileContent.building, profileContent.learning, profileContent.direction, ...profileContent.interests]) await expect(about).toContainText(content);
  await expect(about.locator("dl > div")).toHaveCount(5);
  await expect(about.getByRole("link", { name: "Follow the work on GitHub" })).toHaveAttribute("href", profile.github);
  await expect(about.getByRole("link", { name: "Get in touch" })).toHaveAttribute("href", `mailto:${profile.email}`);
  if (!profileContent.resume) await expect(about.locator('a[href$=".pdf"]')).toHaveCount(0);
  if (!profileContent.linkedin) await expect(about.locator('a[href*="linkedin.com"]')).toHaveCount(0);
  await expect(about.locator("[data-about-image], img[src='/assets/profile/photo.png']")).toHaveCount(0);
  const working = about.locator("[data-about-working] img");
  await working.scrollIntoViewIfNeeded();
  await expect(working).toHaveAttribute("src", "/assets/character/anees-working-illustration.png");
  await expect.poll(() => working.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(about.locator("[data-about-working] figcaption")).toHaveCount(0);
  expect(await about.evaluate(element => element.closest("[data-scroll-scene]") === null)).toBe(true);
  expect(await page.locator('main [id="home"], main [id="about"], main [id="work"], main [id="engineering"], main [id="journey"], main [id="playground"], main .evidence-section').evaluateAll(elements => elements.map(element => element.id || "evidence"))).toEqual(["home", "about", "work", "engineering", "journey", "playground", "evidence"]);
  await expect(page.locator("[data-work-inspector]")).toHaveCount(1);
  await expect(page.locator("[data-work-panel]")).toHaveCount(4);
  await expect(page.locator(".digital-atelier, .journey-track")).toHaveCount(0);
});

test("About starts complete, enters once and settles immediately on a live motion preference change", async ({ page }) => {
  await loadWork(page);
  const targets = page.locator("#about [data-about-copy], #about [data-about-facts]");
  await expect(targets).toHaveCount(2);
  for (const target of await targets.all()) await expect(target).toHaveCSS("opacity", "1");
  await page.locator("#about").evaluate(element => scrollTo({ top: scrollY + element.getBoundingClientRect().top - document.querySelector<HTMLElement>(".site-header")!.offsetHeight, behavior: "instant" }));
  await expect.poll(() => targets.evaluateAll(elements => elements.some(element => element.getAnimations().some(animation => animation.playState === "running")))).toBe(true);
  expect(await targets.evaluateAll(elements => elements.flatMap(element => element.getAnimations()).every(animation => animation.effect?.getTiming().iterations === 1))).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const target of await targets.all()) { await expect(target).toHaveCSS("transform", "none"); await expect(target).toHaveCSS("opacity", "1"); }
  await expect.poll(() => targets.evaluateAll(elements => elements.every(element => !element.getAttribute("style")))).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const target of await targets.all()) await expect(target).toHaveCSS("transform", "none");
  expect(await page.locator("#about").evaluate(element => element.closest(".pin-spacer") === null)).toBe(true);
});

test("an unavailable Hero photograph retains About text, actions and its working scene", async ({ page }) => {
  await page.route("**/assets/profile/photo.png", route => route.abort());
  await loadWork(page);
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(page.locator("#home .character-fallback")).toBeVisible();
  await expect(page.locator("#about [data-about-image]")).toHaveCount(0);
  await expect(page.locator("#about [data-about-copy]")).toBeVisible();
  await expect(page.locator("#about [data-about-working]")).toBeVisible();
  await expect(page.locator("#about [data-about-working] figcaption")).toHaveCount(0);
  await expect(page.locator("#about dl > div")).toHaveCount(5);
  await expect(page.locator("#about")).toContainText(profileContent.introduction);
  await expect(page.locator("#about").getByRole("link", { name: "Get in touch" })).toHaveAttribute("href", `mailto:${profile.email}`);
});

for (const study of caseStudies) {
  test(`${study.name} selection keeps its real status, purpose, screens and case-study destination`, async ({ page }) => {
    await loadWork(page);
    await chooseWork(page, study.slug);
    const project = page.locator(`#${study.slug}`);
    await expect(project.getByRole("heading", { level: 3 })).toHaveText(study.name);
    await expect(project).toContainText(study.summary);
    await expect(project).toContainText(study.status);
    await expect(project).toContainText(study.statusDetail);
    await expect(project.locator("[data-work-case-link]")).toHaveAttribute("href", `/work/${study.slug}`);
    for (const technology of study.technologies) await expect(project.locator("dl")).toContainText(technology);
    if (study.slug === "sportlynk") {
      await expect(project).toContainText("Conceptual product connections, not a product screen");
      await expect(project.locator("img")).toHaveCount(0);
      await expect(project.locator("dt").filter({ hasText: "Technologies" })).toHaveCount(0);
    } else {
      const images = project.locator("[data-work-screens] img");
      await expect(images).toHaveCount(3);
      for (const image of await images.all()) {
        await expect.poll(() => image.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
        await expect(image).toHaveCSS("filter", "none");
        expect(await image.evaluate(image => {
          const bounds = image.getBoundingClientRect();
          return Math.abs(bounds.width / bounds.height - Number(image.getAttribute("width")) / Number(image.getAttribute("height")));
        })).toBeLessThan(0.01);
      }
      if (study.slug === "fitpilot") await expect(project.locator("[data-work-screens]")).toContainText("SQLite records and a queue");
      if (study.slug === "sukoon") await expect(project.locator("[data-work-screens]")).toContainText("native Android alarms");
      if (study.slug === "eduverse") {
        await expect(project.locator("[data-work-screens]")).toContainText("Firebase Realtime Database");
        await expect(project.locator("[data-work-screens]")).not.toContainText("Firestore");
      }
    }
  });

  test(`${study.name} native perspectives expose documented decisions, constraints and build snapshot`, async ({ page }) => {
    await loadWork(page);
    await chooseWork(page, study.slug);
    const project = page.locator(`#${study.slug}`);
    await page.locator("#work").getByRole("radio", { name: "Engineering Notes" }).check();
    const notes = project.locator('[data-work-view="notes"]');
    await expect(notes).toBeVisible();
    await expect(notes).toContainText(study.slug === "fitpilot" ? study.features[2].title : study.decisions[0].title);
    await expect(notes).toContainText(study.challenges[0].body);
    await expect(notes.getByRole("link", { name: "Open the complete study" })).toHaveAttribute("href", `/work/${study.slug}#decisions`);
    await expect(project.locator('[data-work-view="projects"]')).toBeHidden();
    await page.locator("#work").getByRole("radio", { name: "Build Log" }).check();
    const log = project.locator('[data-work-view="log"]');
    await expect(log).toBeVisible();
    await expect(log).toContainText("not a reconstructed commit history");
    await expect(log).toContainText(study.outcomes);
    await expect(log.locator("li")).toHaveText(study.nextSteps);
    await expect(log.getByRole("link", { name: "Read the project record" })).toHaveAttribute("href", `/work/${study.slug}#outcome`);
    await page.locator("#work").getByRole("radio", { name: "Projects", exact: true }).check();
    await expect(project.locator('[data-work-view="projects"]')).toBeVisible();
    await expect(workScene(page)).toHaveAttribute("data-work-project", study.slug);
    await expect(page.locator("[data-work-panel]")).toHaveCount(4);
  });
}

test("one measured finite pin has four reading holds, distinct planes and deterministic forward/reverse states", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await loadWork(page);
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", "pinned");
  const distance = await workScene(page).evaluate(element => {
    const scene = element as HTMLElement;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const header = document.querySelector<HTMLElement>(".site-header")!.offsetHeight;
    return (Number(scene.dataset.sceneEnd) - Number(scene.dataset.sceneStart)) / (innerHeight - header - rem * 2);
  });
  expect(distance).toBeGreaterThan(2);
  expect(distance).toBeLessThanOrEqual(2.7 + 0.001);
  const planes = await page.locator("[data-work-plane]").evaluateAll(elements => elements.map(element => getComputedStyle(element).backgroundColor));
  expect(new Set(planes).size).toBe(4);
  for (let index = 0; index < workIds.length; index++) {
    await seekWork(page, workProgress[index]);
    await expect(workScene(page)).toHaveAttribute("data-work-project", workIds[index]);
    await expect(page.locator("[data-work-panel][aria-hidden='true']")).toHaveCount(3);
    await expect(page.locator(`#${workIds[index]} [data-work-case-link]`)).toBeInViewport({ ratio: 1 });
    await expect(page.locator(`[data-work-project-navigation] a[href="#${workIds[index]}"]`)).toHaveAttribute("aria-current", "location");
  }
  const transforms = () => page.locator("[data-work-plane], [data-work-screens], [data-work-title]").evaluateAll(elements => elements.map(element => `${getComputedStyle(element).transform}|${getComputedStyle(element).opacity}`));
  await seekWork(page, 0.2);
  const transition = await transforms();
  const ratio = await page.locator("#fitpilot").evaluate(element => {
    const plane = element.querySelector<HTMLElement>("[data-work-plane]")!, screens = element.querySelector<HTMLElement>("[data-work-screens]")!;
    return (new DOMMatrix(getComputedStyle(screens).transform).m42 / screens.offsetHeight) / (new DOMMatrix(getComputedStyle(plane).transform).m42 / plane.offsetHeight);
  });
  expect(ratio).toBeCloseTo(0.7, 2);
  await seekWork(page, 0.92); await seekWork(page, 0.2);
  expect(await transforms()).toEqual(transition);
  await seekWork(page, 0.36); await seekWork(page, 0.08);
  await expect(workScene(page)).toHaveAttribute("data-work-project", "sportlynk");
  await seekWork(page, 1.2);
  await expect(page.locator("[data-work-stage]")).not.toHaveCSS("position", "fixed");
  await expect(page.locator("#engineering-heading")).toBeInViewport();
  expect(errors).toEqual([]);
});

test("project text and authentic screen labels keep contrast across all three chapter transitions", async ({ page }) => {
  await loadWork(page);
  for (const progress of [0.23, 0.51, 0.79]) {
    await seekWork(page, progress);
    const scan = await new AxeBuilder({ page }).include("#work").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(scan.violations.map(violation => ({ id: violation.id, targets: violation.nodes.map(node => node.target) }))).toEqual([]);
    await expect(page.locator("[data-work-panel][data-work-current='true'] [data-work-screens]")).toHaveCSS("opacity", "1");
  }
});

for (const slug of workIds) {
  test(`direct #${slug} resolves and focuses the real project in the shared scene`, async ({ page }) => {
    await loadWork(page, 1440, 900, `#${slug}`);
    await expect(page.locator(`#${slug}`)).toBeFocused();
    await expect(workScene(page)).toHaveAttribute("data-work-project", slug);
    await expect(page.locator(`#${slug} [data-work-case-link]`)).toBeInViewport({ ratio: 1 });
    await page.reload();
    await expect(page.locator(`#${slug}`)).toBeFocused();
    await expect(workScene(page)).toHaveAttribute("data-work-project", slug);
  });
}

for (const slug of ["work", "workspace"]) {
  test(`legacy #${slug} remains a real usable public destination`, async ({ page }) => {
    await loadWork(page, 1440, 900, `#${slug}`);
    await expect(page.locator(`#${slug}`)).toBeFocused();
    await expect(page.locator(`[data-work-project-navigation] a`).first()).toBeInViewport();
  });
}

test("native project links and browser back/forward restore chapter, progress and focus", async ({ page }) => {
  await loadWork(page);
  await chooseWork(page, "fitpilot");
  await chooseWork(page, "eduverse");
  await page.goBack();
  await expect(page).toHaveURL(/#fitpilot$/);
  await expect(page.locator("#fitpilot")).toBeFocused();
  await expect(workScene(page)).toHaveAttribute("data-work-project", "fitpilot");
  await page.goForward();
  await expect(page).toHaveURL(/#eduverse$/);
  await expect(page.locator("#eduverse")).toBeFocused();
  await expect(workScene(page)).toHaveAttribute("data-work-project", "eduverse");
});

for (const viewport of [{ width: 1024, height: 600, mode: "static" }, { width: 1280, height: 720, mode: "static" }, { width: 1440, height: 900, mode: "pinned" }]) {
  test(`complete scene fit at ${viewport.width}x${viewport.height} selects ${viewport.mode}`, async ({ page }) => {
    await loadWork(page, viewport.width, viewport.height);
    await expect(workScene(page)).toHaveAttribute("data-scene-mode", viewport.mode);
    if (viewport.mode === "static") await expectStackedWork(page);
    for (const slug of workIds) {
      await chooseWork(page, slug);
      await expect(page.locator(`#${slug} h3`)).toBeInViewport();
      if (viewport.mode === "static") await page.locator(`#${slug} [data-work-case-link]`).evaluate(element => element.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }));
      await expect(page.locator(`#${slug} [data-work-case-link]`)).toBeInViewport({ ratio: 1 });
    }
  });
}

for (const width of [320, 390, 768]) {
  test(`stacked mobile work at ${width}px has four complete chapters and native scrolling`, async ({ page }) => {
    await loadWork(page, width, 844);
    await expectStackedWork(page);
    for (const slug of workIds) await chooseWork(page, slug);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && scrollX === 0)).toBe(true);
    const before = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 250);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 100);
  });
}

test("touch-capable desktop never pins or hides project chapters", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: true });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/", { waitUntil: "networkidle" });
  await expectStackedWork(page);
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  for (const target of await page.locator("#about [data-about-copy], #about [data-about-facts]").all()) {
    await expect(target).toHaveCSS("transform", "none");
    expect(await target.evaluate(element => element.getAnimations().length)).toBe(0);
  }
  await page.locator("#work").getByRole("radio", { name: "Engineering Notes" }).check();
  await expect(page.locator('[data-work-view="notes"]')).toHaveCount(4);
  expect(await page.locator('[data-work-view="notes"]').evaluateAll(elements => elements.every(element => element.checkVisibility()))).toBe(true);
  await context.close();
});

test("live reduced motion retains the selected real chapter, reading position and full static content", async ({ page }) => {
  await loadWork(page);
  await chooseWork(page, "sukoon");
  const before = await page.locator("#sukoon").evaluate(element => element.getBoundingClientRect().top);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expectStackedWork(page);
  await expect(page.locator("#sukoon")).toBeFocused();
  await expect.poll(() => page.locator("#sukoon").evaluate((element, baseline) => Math.abs(element.getBoundingClientRect().top - baseline), before)).toBeLessThan(3);
  for (const target of await page.locator("[data-work-plane], [data-work-screens], [data-work-title]").all()) await expect(target).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", "pinned");
  await chooseWork(page, "sukoon");
  await expect(page.locator("[data-scroll-scene='selected-work']")).toHaveCount(1);
});

for (const width of [320, 1440]) {
  test(`doubled root text at ${width}px keeps biography and all project content unclipped`, async ({ page }) => {
    await loadWork(page, width, 1000);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await expectStackedWork(page);
    await expect(page.locator("#fitpilot").locator("p").filter({ hasText: caseStudies[1].summary })).toHaveCSS("font-size", "32px");
    for (const view of ["Projects", "Engineering Notes", "Build Log"]) {
      await page.locator("#work").getByRole("radio", { name: view, exact: true }).check();
      const clipped = await page.locator("#about h2, #about h3, #about p, #about dd, #work h2, #work h3, #work h4, #work p, #work label, #work a").evaluateAll(elements => elements.filter(element => element.checkVisibility() && element.scrollWidth > element.clientWidth + 1).map(element => element.textContent));
      expect(clipped).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}

test("no-JS About and all project anchors, native perspectives and case links remain usable", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/");
  await expect(page.locator("#about")).toContainText(profileContent.education.institution);
  await expect(page.locator("[data-work-panel]")).toHaveCount(4);
  for (const slug of workIds) {
    await page.locator(`[data-work-project-navigation] a[href="#${slug}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${slug}$`));
    await expect(page.locator(`#${slug} h3`)).toBeInViewport();
    await expect(page.locator(`#${slug} [data-work-case-link]`)).toHaveAttribute("href", `/work/${slug}`);
  }
  await page.locator("#work").getByRole("radio", { name: "Engineering Notes" }).check();
  expect(await page.locator('[data-work-view="notes"]').evaluateAll(elements => elements.every(element => element.checkVisibility()))).toBe(true);
  await page.locator("#work").getByRole("radio", { name: "Build Log" }).check();
  for (const project of await page.locator("[data-work-panel]").all()) await expect(project.locator('[data-work-view="log"]')).toContainText("not a reconstructed commit history");
  await page.locator("#work").getByRole("radio", { name: "Projects", exact: true }).check();
  await page.locator("#fitpilot [data-work-case-link]").click();
  await expect(page).toHaveURL(/\/work\/fitpilot$/);
  await context.close();
});

test("keyboard navigation, native radio arrows and tab order never focus hidden content", async ({ page }) => {
  await loadWork(page);
  const nav = page.locator("[data-work-project-navigation]");
  await nav.locator("a").first().focus(); await page.keyboard.press("End");
  await expect(nav.getByRole("link", { name: "EduVerse", exact: true })).toBeFocused();
  await page.keyboard.press("Enter"); await expect(page.locator("#eduverse")).toBeFocused();
  const projects = page.locator("#work").getByRole("radio", { name: "Projects", exact: true });
  await projects.focus(); await page.keyboard.press("ArrowRight");
  await expect(page.locator("#work").getByRole("radio", { name: "Engineering Notes" })).toBeChecked();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#work").getByRole("radio", { name: "Build Log" })).toBeChecked();
  await projects.check();
  await page.locator("#eduverse").focus();
  for (let index = 0; index < 6; index++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement?.closest('[aria-hidden="true"], [inert]') === null)).toBe(true);
    expect(await page.evaluate(() => document.activeElement?.checkVisibility())).toBe(true);
  }
});

test("scene registration and its scoped measurement observer clean up on route exit and remount once", async ({ page }) => {
  await page.addInitScript(() => {
    const target = window as Window & { workObservers?: { active: number; created: number } };
    target.workObservers = { active: 0, created: 0 };
    const OriginalObserver = ResizeObserver;
    window.ResizeObserver = class extends OriginalObserver {
      ownsWork = false;
      observe(element: Element, options?: ResizeObserverOptions) {
        if (element.hasAttribute("data-work-content") && !this.ownsWork) { this.ownsWork = true; target.workObservers!.active++; target.workObservers!.created++; }
        super.observe(element, options);
      }
      disconnect() { if (this.ownsWork) { target.workObservers!.active--; this.ownsWork = false; } super.disconnect(); }
    };
  });
  await loadWork(page);
  const scenes = process.env.PORTFOLIO_SCENE_FIXTURE === "1" ? "2" : "1";
  const homeRuntime = page.locator(".scroll-scene-provider").filter({ has: workScene(page) });
  await expect(homeRuntime).toHaveAttribute("data-scroll-scenes", scenes);
  expect(await page.evaluate(() => (window as Window & { workObservers?: { active: number } }).workObservers!.active)).toBe(1);
  const refreshes = await homeRuntime.getAttribute("data-scroll-refreshes");
  for (const progress of [0.08, 0.36, 0.64, 0.92, 0.36]) await seekWork(page, progress);
  expect(await homeRuntime.getAttribute("data-scroll-refreshes")).toBe(refreshes);
  await chooseWork(page, "fitpilot");
  await page.locator("#fitpilot [data-work-case-link]").click();
  await expect(page).toHaveURL(/\/work\/fitpilot$/);
  await expect(workScene(page)).toBeHidden();
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", "static");
  await expect(homeRuntime).not.toHaveAttribute("data-scroll-runtime", "ready");
  await expect(homeRuntime.locator(".pin-spacer")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => (window as Window & { workObservers?: { active: number } }).workObservers!.active)).toBe(0);
  await page.goBack(); await expect(workScene(page)).toHaveAttribute("data-scene-mode", "pinned");
  await expect(homeRuntime).toHaveAttribute("data-scroll-scenes", scenes);
  await expect(page.locator('.scroll-scene-provider[data-scroll-runtime="ready"]')).toHaveCount(1);
  expect(await page.evaluate(() => (window as Window & { workObservers?: { active: number } }).workObservers!.active)).toBe(1);
  await expect(page.locator("[data-scroll-scene='selected-work']")).toHaveCount(1);
});

test("a failed project image leaves all four complete static chapters and useful links", async ({ page }) => {
  await page.route("**/_next/image?**", route => route.request().url().includes("fitpilot-plan") ? route.abort() : route.continue());
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(workScene(page)).toHaveAttribute("data-scene-mode", "failed", { timeout: 10000 });
  await expect(workScene(page)).toHaveAttribute("data-work-layout", "stacked");
  expect(await page.locator("[data-work-panel]").evaluateAll(elements => elements.every(element => !element.hasAttribute("aria-hidden") && !element.querySelector("[inert]")))).toBe(true);
  for (const slug of workIds) await expect(page.locator(`#${slug} [data-work-case-link]`)).toHaveAttribute("href", `/work/${slug}`);
});

for (const width of [390, 1440]) {
  test(`About and all native work perspectives retain accessible names, focus and contrast at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await loadWork(page, width, 1000);
    for (const view of ["Projects", "Engineering Notes", "Build Log"]) {
      await page.locator("#work").getByRole("radio", { name: view, exact: true }).check();
      const scan = await new AxeBuilder({ page }).include("#about").include("#work").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(scan.violations.map(violation => ({ id: violation.id, targets: violation.nodes.map(node => node.target) }))).toEqual([]);
    }
  });
}
