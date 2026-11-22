"use client";

import { useCallback, useEffect, useId, useRef, type ReactNode } from "react";
import type { SceneMeasurements, ScrollScene } from "@/lib/scroll-scene-contract";
import { normalizeProgress, sceneFits } from "@/lib/scroll-scene-runtime";
import { SceneBoundary } from "./scene-boundary";
import { useScrollSceneCoordinator } from "./scroll-scene-provider";
import styles from "./thread-scene.module.css";
import { SectionLettering } from "./section-lettering";

const filamentPath = "M70 30C1180 40 1130 140 630 150S10 170 170 270S1160 300 1010 390S100 430 240 510S710 580 1120 570";
const staticPath = "M16 0V600";
const holds = [
  { start: 0, end: 0.12, anchor: 0.06 },
  { start: 0.22, end: 0.34, anchor: 0.28 },
  { start: 0.44, end: 0.56, anchor: 0.50 },
  { start: 0.66, end: 0.78, anchor: 0.72 },
  { start: 0.88, end: 1, anchor: 0.94 },
] as const;

function threadScene(root: HTMLElement, retainCleanup: (cleanup: () => void) => void, requestRefresh: () => void): Omit<ScrollScene, "id" | "root"> {
  const stage = root.querySelector<HTMLElement>("[data-thread-stage]")!;
  const deck = root.querySelector<HTMLElement>("[data-thread-deck]")!;
  const navigation = root.querySelector<HTMLElement>("[data-thread-navigation]")!;
  const cta = root.querySelector<HTMLElement>("[data-thread-cta]")!;
  const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-thread-panel]"));
  const contents = panels.map(panel => panel.querySelector<HTMLElement>("[data-thread-content]")!);
  const links = Array.from(navigation.querySelectorAll<HTMLAnchorElement>("a"));
  const route = root.querySelector<SVGPathElement>("[data-thread-route]")!;
  const pathwork = route.closest("svg")!;
  const filament = root.querySelector<SVGUseElement>("[data-thread-filament]")!;
  const cursor = root.querySelector<SVGCircleElement>("[data-thread-cursor]")!;
  const signal = root.querySelector<SVGUseElement>("[data-thread-signal]")!;
  const activeFilament = root.querySelector<SVGUseElement>("[data-thread-active-line]")!;
  const tether = root.querySelector<SVGPathElement>("[data-thread-tether]")!;
  const travellingTitle = root.querySelector<HTMLElement>("[data-thread-title]")!;
  const markers = Array.from(root.querySelectorAll<SVGCircleElement>("[data-thread-marker]"));
  const readout = root.querySelector<HTMLElement>("[data-thread-readout]")!;
  const chapterAnchors = panels.map((panel, index) => ({ id: panel.id, progress: holds[index].anchor }));
  let active = Math.max(0, panels.findIndex(panel => "#" + panel.id === location.hash));
  const readingAnchors = [...chapterAnchors];
  let reservedHeight = 0, routeLength = 0, previousWidth = 0;
  let disposed = false, assetsReady = false;
  let observer: ResizeObserver | undefined;
  let capability: MediaQueryList | undefined;

  const select = (index: number, progress?: number) => {
    const staged = root.dataset.threadLayout === "staged";
    const focused = document.activeElement;
    const moveFocus = staged && index !== active && focused instanceof HTMLElement && contents[active].contains(focused);
    const chapterState = staged ? String(index + 1) : "static";
    const changed = active !== index || root.dataset.trailChapter !== chapterState;
    active = index;
    // The coordinator preserves the current real chapter when an unfocused scene stacks.
    if (readingAnchors[0].id !== panels[index].id) readingAnchors.splice(0, readingAnchors.length, chapterAnchors[index], ...chapterAnchors.filter((_, position) => position !== index));
    if (root.dataset.threadChapter !== panels[index].id) root.dataset.threadChapter = panels[index].id;
    if (root.dataset.trailChapter !== chapterState) root.dataset.trailChapter = chapterState;
    if (changed) readout.textContent = "Chapter " + String(index + 1).padStart(2, "0") + " / 05";
    for (let position = 0; position < panels.length; position++) {
      const current = position === index;
      let visible = current || !staged;
      if (staged && progress !== undefined) {
        for (let transition = 0; transition < holds.length - 1; transition++) {
          if (progress >= holds[transition].end && progress <= holds[transition + 1].start
            && (position === transition || position === transition + 1)) visible = true;
        }
      }
      if (panels[position].dataset.threadCurrent !== String(current)) panels[position].dataset.threadCurrent = String(current);
      if (panels[position].dataset.threadVisible !== String(visible)) panels[position].dataset.threadVisible = String(visible);
      if (staged && current) { if (panels[position].dataset.trailCurrent !== "true") panels[position].dataset.trailCurrent = "true"; }
      else delete panels[position].dataset.trailCurrent;
      if (contents[position].inert !== (staged && !current)) contents[position].inert = staged && !current;
      if (staged && !current) { if (!panels[position].hasAttribute("aria-hidden")) panels[position].setAttribute("aria-hidden", "true"); }
      else panels[position].removeAttribute("aria-hidden");
      if (current) { if (!links[position].hasAttribute("aria-current")) links[position].setAttribute("aria-current", "step"); }
      else links[position].removeAttribute("aria-current");
      const markerCurrent = String(staged && current), markerComplete = String(progress !== undefined && progress >= holds[position].anchor);
      if (markers[position].dataset.threadMarkerCurrent !== markerCurrent) markers[position].dataset.threadMarkerCurrent = markerCurrent;
      if (markers[position].dataset.threadMarkerComplete !== markerComplete) markers[position].dataset.threadMarkerComplete = markerComplete;
      markers[position].dataset.threadMarkerReady = String(progress !== undefined && progress < holds[position].anchor && progress > holds[position].anchor - .09);
      markers[position].setAttribute("r", String(staged && current ? 10 : 6));
    }
    if (moveFocus) panels[index].focus({ preventScroll: true });
  };

  const restore = () => {
    travellingTitle.style.removeProperty("--wordmark-progress");
    root.dataset.threadLayout = "stacked";
    root.dataset.trailMotion = "static";
    root.dataset.trailProgress = "1.000";
    delete root.dataset.threadProgress;
    delete root.dataset.threadHold;
    root.style.removeProperty("--thread-panel-height");
    route.setAttribute("d", staticPath);
    pathwork.setAttribute("viewBox", "0 0 32 600");
    filament.style.strokeDashoffset = "0";
    signal.style.removeProperty("stroke-dasharray");
    signal.style.removeProperty("stroke-dashoffset");
    activeFilament.style.removeProperty("stroke-dasharray");
    activeFilament.style.removeProperty("stroke-dashoffset");
    tether.style.removeProperty("stroke-dashoffset");
    for (const panel of panels) panel.style.removeProperty("--thread-energy");
    for (const path of root.querySelectorAll<SVGPathElement>("[data-thread-draw]")) path.style.removeProperty("stroke-dashoffset");
    for (const layer of root.querySelectorAll<HTMLElement>("[data-thread-layer]")) { layer.style.removeProperty("transform"); layer.style.removeProperty("clip-path"); layer.style.removeProperty("opacity"); }
    select(active);
  };

  const prepare = () => {
    if (disposed || !assetsReady) return;
    const oldLayout = root.dataset.threadLayout;
    const oldHeight = reservedHeight;
    root.dataset.threadMeasuring = "true";
    const rootTextSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const headerHeight = root.closest(".scroll-scene-provider")?.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
    const clearance = headerHeight + rootTextSize;
    const height = (element: HTMLElement) => Math.max(element.offsetHeight, element.scrollHeight);
    const images = Array.from(stage.querySelectorAll("img"));
    const measurements: SceneMeasurements = {
      viewportWidth: innerWidth, viewportHeight: innerHeight, headerHeight, clearance,
      availableHeight: Math.max(0, innerHeight - clearance - rootTextSize), rootTextSize,
      stageWidth: stage.clientWidth, stageHeight: height(stage),
      contentWidth: stage.scrollWidth, contentHeight: height(deck),
      navigationHeight: height(navigation), ctaHeight: height(cta),
      imageHeight: Math.max(0, ...images.map(image => image.offsetHeight)),
      imageWidth: Math.max(0, ...images.map(image => image.offsetWidth)),
      finePointer: matchMedia("(hover: hover) and (pointer: fine)").matches,
      touch: navigator.maxTouchPoints > 0,
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
    reservedHeight = measurements.contentHeight;
    delete root.dataset.threadMeasuring;
    const candidate = sceneFits(measurements) && rootTextSize <= 20
      && navigator.hardwareConcurrency > 2 && document.documentElement.dir !== "rtl"
      && matchMedia("(forced-colors: none)").matches && root.dataset.sceneMode !== "failed";
    root.dataset.threadLayout = candidate ? "staged" : "stacked";
    root.dataset.trailMotion = candidate ? "active" : "static";
    if (candidate) root.style.setProperty("--thread-panel-height", String(reservedHeight) + "px");
    else root.style.removeProperty("--thread-panel-height");
    select(active);
    const neededHeight = Math.ceil(Math.max(measurements.stageHeight,
      measurements.contentHeight + measurements.navigationHeight + measurements.ctaHeight,
      rootTextSize * 46) + clearance + rootTextSize);
    const query = "(min-width: 1024px) and (min-height: " + neededHeight + "px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)";
    if (capability?.media !== query) {
      capability?.removeEventListener("change", prepare);
      capability = matchMedia(query);
      capability.addEventListener("change", prepare);
    }
    if (oldLayout !== root.dataset.threadLayout || Math.abs(oldHeight - reservedHeight) > 1 || previousWidth !== measurements.stageWidth) {
      previousWidth = measurements.stageWidth;
      requestRefresh();
    }
  };

  const focus = (event: FocusEvent) => {
    const panel = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-thread-panel]") : null;
    const index = panel ? panels.indexOf(panel) : -1;
    if (index >= 0 && index !== active) select(index);
  };
  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    observer?.disconnect();
    capability?.removeEventListener("change", prepare);
    root.removeEventListener("focusin", focus);
    delete root.dataset.threadMeasuring;
    restore();
  };

  return {
    stage, scroll: "adaptive", content: [deck], navigation, cta,
    anchors: readingAnchors,
    async ready(signal) {
      if (signal.aborted || disposed) return;
      retainCleanup(cleanup);
      signal.addEventListener("abort", cleanup, { once: true });
      root.addEventListener("focusin", focus);
      await document.fonts.ready;
      if (signal.aborted || disposed) return;
      const images = await Promise.allSettled(Array.from(stage.querySelectorAll("img"), image => image.decode()));
      if (signal.aborted || disposed) return;
      if (images.some(result => result.status === "rejected")) {
        signal.removeEventListener("abort", cleanup);
        restore();
        return;
      }
      assetsReady = true;
      prepare();
      observer = new ResizeObserver(prepare);
      contents.forEach(content => observer!.observe(content));
      signal.removeEventListener("abort", cleanup);
    },
    fits: () => root.dataset.threadLayout === "staged" && !disposed,
    distance: measurements => measurements.availableHeight * 2.8,
    setup({ timeline, measurements, pinned }) {
      if (!pinned) {
        restore();
        const pathHeight = deck.offsetHeight;
        pathwork.setAttribute("viewBox", `0 0 32 ${pathHeight}`);
        route.setAttribute("d", `M16 0V${pathHeight}`);
        const anchorProgress = panels.map(panel => (panel.offsetTop + panel.offsetHeight * 0.3) / deck.offsetHeight);
        const drawings = panels.map(panel => Array.from(panel.querySelectorAll<SVGPathElement>("[data-thread-draw]")));
        const layers = panels.map(panel => Array.from(panel.querySelectorAll<HTMLElement>("[data-thread-layer]")));
        routeLength = route.getTotalLength();
        markers.forEach((marker, index) => { marker.setAttribute("cx", "16"); marker.setAttribute("cy", String(anchorProgress[index] * pathHeight)); });
        cursor.setAttribute("cx", "16");
        return {
          progress(value) {
            const progress = normalizeProgress(value);
            const arrival = Math.max(.01, (measurements.viewportHeight * .8 - measurements.headerHeight) / (stage.offsetHeight + measurements.viewportHeight));
            travellingTitle.style.setProperty("--wordmark-progress", String(normalizeProgress(progress / arrival)));
            root.dataset.threadProgress = progress.toFixed(4);
            root.dataset.trailProgress = progress.toFixed(4);
            filament.style.strokeDashoffset = String(1 - progress);
            signal.style.strokeDasharray = ".045 1";
            signal.style.strokeDashoffset = String(.045 - progress);
            cursor.setAttribute("cy", String(progress * pathHeight));
            let chapter = 0;
            for (let index = 0; index < panels.length; index++) {
              const local = normalizeProgress((progress - anchorProgress[index] + .14) / .18);
              panels[index].style.setProperty("--thread-energy", String(local));
              markers[index].dataset.threadMarkerComplete = String(progress >= anchorProgress[index]);
              drawings[index].forEach((path, position) => { path.style.strokeDashoffset = String(1 - normalizeProgress(local * 1.7 - position * .13)); });
              layers[index].forEach((layer, position) => { layer.style.transform = `translate3d(0,${(1 - local) * (position % 2 ? 50 : 85)}px,0)`; });
              if (progress >= anchorProgress[index] - .06) chapter = index;
            }
            select(chapter);
            markers.forEach((marker, index) => { marker.dataset.threadMarkerComplete = String(progress >= anchorProgress[index]); marker.dataset.threadMarkerCurrent = String(index === chapter); marker.setAttribute("r", String(index === chapter ? 10 : 6)); });
            activeFilament.style.strokeDasharray = String(Math.max(0, progress - (anchorProgress[chapter] - .14))) + " 1";
            activeFilament.style.strokeDashoffset = String(-Math.max(0, anchorProgress[chapter] - .14));
          }, settle() { travellingTitle.style.removeProperty("--wordmark-progress"); restore(); },
        };
      }
      root.dataset.threadLayout = "staged";
      root.dataset.trailMotion = "active";
      root.style.setProperty("--thread-panel-height", String(reservedHeight) + "px");
      select(active);
      route.setAttribute("d", filamentPath);
      pathwork.setAttribute("viewBox", "0 0 1200 600");
      routeLength = route.getTotalLength();
      // The title reaches its measured composition during the opening hold.
      markers.forEach((marker, index) => {
        const point = route.getPointAtLength(routeLength * holds[index].anchor);
        marker.setAttribute("cx", String(point.x)); marker.setAttribute("cy", String(point.y));
      });
      const deckBounds = deck.getBoundingClientRect();
      const chapterLinks = panels.map((panel, index) => {
        const copyBounds = panel.querySelector<HTMLElement>("[data-thread-copy]")!.getBoundingClientRect();
        const marker = route.getPointAtLength(routeLength * holds[index].anchor);
        const x = Math.max(16, (copyBounds.left - deckBounds.left - 12) * 1200 / deckBounds.width);
        const y = Math.max(16, (copyBounds.top - deckBounds.top + 14) * 600 / deckBounds.height);
        return `M${marker.x} ${marker.y}C${marker.x} ${y} ${x + 50} ${y} ${x} ${y}`;
      });
      let connectedChapter = -1;
      for (let index = 0; index < panels.length; index++) {
        const plane = panels[index].querySelector<HTMLElement>("[data-thread-plane]")!;
        const copy = panels[index].querySelector<HTMLElement>("[data-thread-copy]")!;
        const artifact = panels[index].querySelector<HTMLElement>("[data-thread-artifact]")!;
        const annotation = panels[index].querySelector<HTMLElement>("[data-thread-annotation]")!;
        if (index > 0) {
          const start = holds[index - 1].end, duration = holds[index].start - start;
          timeline.fromTo(plane, { x: index === 1 ? 36 : 0, yPercent: index === 3 ? 95 : 0, opacity: index === 3 ? 1 : 0 }, { x: 0, yPercent: 0, opacity: 1 }, start, duration);
          const entrance = index === 1 ? { x: 120, y: 0, scale: 1, opacity: .5, clipPath: "inset(0 100% 0 0)" }
            : index === 2 ? { x: 0, y: 0, scale: 1, opacity: .45, clipPath: "inset(0 0 0 0)" }
            : index === 3 ? { x: 0, y: 80, scale: .92, opacity: 1, clipPath: "inset(0 0 40% 0)" }
            : { x: -70, y: 0, scale: 1, opacity: .35, clipPath: "inset(0 0 0 0)" };
          timeline.fromTo(artifact, entrance, { x: 0, y: 0, scale: 1, opacity: 1, clipPath: "inset(0 0 0 0)" }, start, duration);
          timeline.fromTo(copy, { x: 20, opacity: 0 }, { x: 0, opacity: 1 }, start + duration / 2, duration / 2);
          timeline.fromTo(annotation, { y: 10, opacity: 0 }, { y: 0, opacity: 1 }, start + duration / 2, duration / 2);
        }
        if (index < panels.length - 1) {
          const start = holds[index].end, duration = holds[index + 1].start - start;
          timeline.fromTo(plane, { x: 0, yPercent: 0, opacity: 1 }, { x: -18, yPercent: -6, opacity: 0 }, start, duration);
          timeline.fromTo(artifact, { x: 0, y: 0, scale: 1, opacity: 1 }, { x: index === 1 ? -120 : 0, y: index === 3 ? -65 : 0, scale: index === 3 ? .94 : 1, opacity: 0 }, start, duration);
          timeline.fromTo(copy, { x: 0, opacity: 1 }, { x: -16, opacity: 0 }, start, duration / 2);
          timeline.fromTo(annotation, { y: 0, opacity: 1 }, { y: -8, opacity: 0 }, start, duration / 2);
        }
      }
      timeline.fromTo(root.querySelector<HTMLElement>("[data-thread-meter]")!, { xPercent: -100 }, { xPercent: 0 }, 0, 1);
      const drawings = panels.map(panel => Array.from(panel.querySelectorAll<SVGPathElement>("[data-thread-draw]")));
      const layers = panels.map(panel => Array.from(panel.querySelectorAll<HTMLElement>("[data-thread-layer]")));
      return {
        progress(value) {
          travellingTitle.style.setProperty("--wordmark-progress", String(normalizeProgress(value / .12)));
          const progress = normalizeProgress(value);
          let chapter = 0;
          for (let index = 0; index < holds.length - 1; index++) {
            if (progress >= (holds[index].end + holds[index + 1].start) / 2) chapter = index + 1;
          }
          const holding = progress >= holds[chapter].start && progress <= holds[chapter].end;
          root.dataset.threadProgress = progress.toFixed(4);
          root.dataset.trailProgress = progress.toFixed(4);
          root.dataset.threadHold = String(holding);
          filament.style.strokeDashoffset = String(1 - progress);
          signal.style.strokeDasharray = ".045 1";
          signal.style.strokeDashoffset = String(.045 - progress);
          for (let index = 0; index < panels.length; index++) {
            const local = normalizeProgress(index === 0 ? progress / .09 : (progress - holds[index].start + .07) / .14);
            panels[index].style.setProperty("--thread-energy", String(local));
            drawings[index].forEach((path, position) => { path.style.strokeDashoffset = String(1 - normalizeProgress(local * 1.8 - position * .12)); });
            layers[index].forEach((layer, position) => {
              const staggered = normalizeProgress(local * 1.4 - position * .1);
              const distance = 1 - staggered;
              layer.style.transform = index === 1 ? `translate3d(${distance * (position % 2 ? -55 : 75)}px,${distance * (position % 2 ? -24 : 36)}px,0)`
                : index === 2 ? `translate3d(${distance * (position % 2 ? 24 : -24)}px,0,0)`
                : index === 4 ? `translate3d(0,${distance * (position === 1 ? -26 : 26)}px,0)`
                : `translate3d(${distance * 24}px,0,0)`;
              layer.style.clipPath = index === 0 || index === 1 ? `inset(0 0 ${distance * 100}% 0)` : "none";
            });
          }
          const point = route.getPointAtLength(routeLength * progress);
          cursor.setAttribute("cx", String(point.x)); cursor.setAttribute("cy", String(point.y));
          select(chapter, progress);
          if (connectedChapter !== chapter) { tether.setAttribute("d", chapterLinks[chapter]); connectedChapter = chapter; }
          tether.style.strokeDashoffset = String(1 - normalizeProgress((progress - holds[chapter].start) / (holds[chapter].anchor - holds[chapter].start)));
          activeFilament.style.strokeDasharray = String(Math.max(0, progress - holds[chapter].start)) + " 1";
          activeFilament.style.strokeDashoffset = String(-holds[chapter].start);
        },
        settle: restore,
      };
    },
    staticFallback: restore,
  };
}

export function TrailMotion({ children }: { children: ReactNode }) {
  const cleanup = useRef<(() => void) | undefined>(undefined);
  const coordinator = useScrollSceneCoordinator();
  const lineId = useId();
  const createScene = useCallback((root: HTMLElement) => threadScene(root, dispose => {
    cleanup.current?.();
    cleanup.current = dispose;
  }, () => coordinator.requestRefresh("thread-content")), [coordinator]);
  useEffect(() => () => cleanup.current?.(), []);
  return <SceneBoundary id="follow-the-thread" createScene={createScene} className={"trail-layout " + styles.boundary}>
    <div className={styles.stage} data-thread-stage>
      <SectionLettering title="FOLLOW THE THREAD" thread />
      <div className={styles.filament} aria-hidden="true">
        <svg className="thread-pathwork" viewBox="0 0 32 600" preserveAspectRatio="none" fill="none">
          <defs><path id={lineId} d={staticPath} pathLength="1" data-thread-route /></defs>
          <use href={"#" + lineId} className={styles.track} />
          <use href={"#" + lineId} className={"trail-copper " + styles.filamentProgress} data-thread-filament />
          <use href={"#" + lineId} className={styles.activeFilament} data-thread-active-line />
          <use href={"#" + lineId} className={styles.signal} data-thread-signal />
          <path className={styles.tether} pathLength="1" data-thread-tether />
          {holds.map((hold, index) => <circle key={hold.anchor} cx="16" cy="0" r="6" className={styles.station} data-thread-marker={index} />)}
          <circle cx="16" cy="0" r="4" className={styles.cursor} data-thread-cursor />
        </svg>
      </div>
      {children}
      <div className={styles.meter} aria-hidden="true"><span data-thread-meter /></div>
    </div>
  </SceneBoundary>;
}
