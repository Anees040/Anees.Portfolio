"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState, type ReactNode } from "react";
import type { ScrollScene } from "@/lib/scroll-scene-contract";
import { useScrollSceneCoordinator } from "./scroll-scene-provider";

export function SceneBoundary({ id, createScene, children, className = "", enabled = true }: {
  id: string;
  createScene(root: HTMLElement): Omit<ScrollScene, "id" | "root">;
  children: ReactNode;
  className?: string;
  enabled?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const coordinator = useScrollSceneCoordinator();
  useGSAP(() => {
    if (!root.current || !enabled) return;
    const element = root.current;
    try { return coordinator.register({ ...createScene(element), id, root: element }); }
    catch { element.dataset.sceneMode = "failed"; }
  }, { scope: root, dependencies: [coordinator, createScene, enabled, id], revertOnUpdate: true });
  return <div ref={root} className={className} data-scroll-scene={id} data-scene-mode="static">{children}</div>;
}

const referenceAnchors = [
  { id: "motion-reference-start", progress: 0 },
  { id: "motion-reference-middle", progress: 0.5 },
  { id: "motion-reference-end", progress: 1 },
] as const;

function referenceScene(root: HTMLElement): Omit<ScrollScene, "id" | "root"> {
  const stage = root.querySelector<HTMLElement>(".scroll-reference-stage")!;
  return {
    stage,
    content: Array.from(root.querySelectorAll<HTMLElement>(".scroll-reference-chapters article")),
    navigation: root.querySelector<HTMLElement>(".scroll-reference-navigation")!,
    anchors: referenceAnchors,
    distance: measurements => measurements.availableHeight * 1.5,
    setup({ timeline, measurements }) {
      timeline.fromTo(root.querySelector<HTMLElement>(".scroll-reference-plane")!, { yPercent: 12, opacity: 0.35 }, { yPercent: -12, opacity: 1 }, 0, 1);
      timeline.fromTo(root.querySelector<HTMLElement>(".scroll-reference-foreground")!, { x: 0, rotation: 0 }, { x: measurements.stageWidth * 0.12, rotation: 45 }, 0, 1);
      timeline.fromTo(root.querySelector<HTMLElement>(".scroll-reference-meter span")!, { scale: 0.15 }, { scale: 1 }, 0, 1);
      return { progress: progress => { root.dataset.referenceProgress = progress.toFixed(4); } };
    },
    staticFallback() { delete root.dataset.referenceProgress; },
  };
}

export function ScrollSceneFixture() {
  const [enabled, setEnabled] = useState(true);
  return <section id="scroll-reference" className="scroll-reference site-shell" aria-labelledby="scroll-reference-heading">
    <h2 id="scroll-reference-heading">Shared motion reference</h2>
    <p>A build-gated engineering fixture, not a portfolio chapter. Native scrolling drives a finite geometric sequence; every chapter remains readable.</p>
    <label className="scroll-reference-control"><input type="checkbox" checked={enabled} onChange={event => setEnabled(event.target.checked)} /> Enable reference enhancement</label>
    <SceneBoundary id="motion-reference" createScene={referenceScene} className="scroll-reference-boundary" enabled={enabled}>
      <div className="scroll-reference-stage">
        <nav className="scroll-reference-navigation" aria-label="Motion reference chapters">{referenceAnchors.map((anchor, index) => <a href={`#${anchor.id}`} key={anchor.id}>Chapter {index + 1}</a>)}</nav>
        <div className="scroll-reference-art" aria-hidden="true"><div className="scroll-reference-plane" /><div className="scroll-reference-foreground" /><div className="scroll-reference-meter"><span /></div></div>
        <div className="scroll-reference-chapters">
          <article id="motion-reference-start" tabIndex={-1}><h3>Establish</h3><p>The background plane and foreground shape start from absolute zero progress.</p></article>
          <article id="motion-reference-middle" tabIndex={-1}><h3>Coordinate</h3><p>The foreground travels independently while the background and meter share the same timeline.</p></article>
          <article id="motion-reference-end" tabIndex={-1}><h3>Release</h3><p>Reverse scrolling restores the same state. The pin ends and normal page reading continues.</p></article>
        </div>
        <details><summary>Expand the reference content</summary><div className="scroll-reference-expanded">
          <p>Readiness includes font settlement, image decoding and scene-specific preparation. Failed resources leave the static reading layout usable.</p>
          <p>Each scene owns its DOM scope and one finite timeline. Registration returns an idempotent disposer; another scene cannot claim the same identifier or anchor.</p>
          <p>Pinning depends on available height, actual stage dimensions and root text size. Width alone never makes a scene eligible.</p>
          <p>Expanded disclosures participate in measurement. If this complete stage no longer fits, normal flow returns instead of clipping the disclosure.</p>
          <p>Every visual state follows absolute progress. Reverse scrolling, direct links and browser history resolve the same state without accumulating displacement.</p>
          <p>Live reduced motion removes the pin while retaining real content, useful focus and the current reading position. Native browser scrolling stays authoritative.</p>
        </div></details>
      </div>
    </SceneBoundary>
    <p className="scroll-reference-after">End of the reference. Continue to the existing contact section, or <a href="#motion-reference-middle">return to Chapter 2</a>.</p>
  </section>;
}
