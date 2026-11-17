import { test, expect } from "@playwright/test";
import { caseStudies } from "../lib/case-studies";

const revisions = {
  fitpilot: { repository: "FitPilot", revision: "aa5ea1d3e40ddcc507870befd7fbfb5cffc43153" },
  sukoon: { repository: "sukoon", revision: "e8156556f0fdc2f3bb2e87bef541a6e625ad09ce" },
  eduverse: { repository: "EduVerse", revision: "24cd6c0edd31308854c1618529c5e25b91209949" },
};

test("case-study implementation evidence stays pinned to the reviewed source", () => {
  for (const study of caseStudies) {
    const points = [...study.features, ...study.architecture.nodes, ...study.decisions, ...study.challenges, ...study.lessons];
    const links = points.flatMap(point => point.evidence ? [point.evidence.href] : []);
    if (study.slug === "sportlynk") {
      expect(links.every(href => href.startsWith("/#"))).toBe(true);
      continue;
    }
    const source = revisions[study.slug];
    expect(links.length).toBeGreaterThan(0);
    for (const href of links) {
      expect(href).toMatch(new RegExp(`^https://github\\.com/Anees040/${source.repository}/(blob|tree)/${source.revision}/.+`));
    }
  }
});

test("server-rendered case studies expose immutable evidence links without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const [slug, source] of Object.entries(revisions)) {
    await page.goto(`http://127.0.0.1:3100/work/${slug}`);
    const links = await page.locator('#case-main a[href*="/blob/"], #case-main a[href*="/tree/"]').evaluateAll(elements => elements.map(element => element.getAttribute("href")));
    expect(links.length).toBeGreaterThan(0);
    for (const href of links) expect(href).toMatch(new RegExp(`/${source.repository}/(blob|tree)/${source.revision}/`));
  }
  await context.close();
});
