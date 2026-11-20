"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import type { SceneMeasurements, ScrollScene } from "@/lib/scroll-scene-contract";
import { normalizeProgress, sceneFits } from "@/lib/scroll-scene-runtime";
import { SceneBoundary } from "./scene-boundary";
import styles from "./about-work.module.css";

function projectScene(root: HTMLElement, retainCleanup: (cleanup: () => void) => void): Omit<ScrollScene, "id" | "root"> {
  const stage = root.querySelector<HTMLElement>("[data-work-stage]")!;
  const deck = root.querySelector<HTMLElement>("[data-work-deck]")!;
  const navigation = root.querySelector<HTMLElement>("[data-work-navigation]")!;
  const cta = root.querySelector<HTMLElement>("[data-work-cta]")!;
  const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-work-panel]"));
  const contents = panels.map(panel => panel.querySelector<HTMLElement>("[data-work-content]")!);
  const links = Array.from(navigation.querySelectorAll<HTMLAnchorElement>("[data-work-project-navigation] a"));
  let active = Math.max(0, panels.findIndex(panel => `#${panel.id}` === location.hash));
  let reservedHeight = 0;
  let disposed = false;
  let observer: ResizeObserver | undefined;
  let capability: MediaQueryList | undefined;

  const select = (index: number, progress?: number) => {
    const staged = root.dataset.workLayout === "stage";
    const focus = document.activeElement;
    const restoreFocus = staged && index !== active && focus instanceof HTMLElement && panels[active].contains(focus);
    active = index;
    root.dataset.workProject = panels[index].id;
    if (restoreFocus) {
      panels[index].removeAttribute("aria-hidden");
      contents[index].inert = false;
      panels[index].focus({ preventScroll: true });
    }
    for (let panelIndex = 0; panelIndex < panels.length; panelIndex++) {
      const current = panelIndex === index;
      let visible = current || !staged;
      if (staged && progress !== undefined) {
        for (let transition = 0; transition < panels.length - 1; transition++) {
          const start = transition * 0.28 + 0.16;
          if (progress >= start && progress <= start + 0.12 && (panelIndex === transition || panelIndex === transition + 1)) visible = true;
        }
      }
      panels[panelIndex].dataset.workCurrent = String(current);
      panels[panelIndex].dataset.workVisible = String(visible);
      contents[panelIndex].inert = staged && !current;
      if (staged && !current) panels[panelIndex].setAttribute("aria-hidden", "true");
      else panels[panelIndex].removeAttribute("aria-hidden");
      if (current) links[panelIndex].setAttribute("aria-current", "location");
      else links[panelIndex].removeAttribute("aria-current");
    }
  };
  const restore = () => {
    root.dataset.workLayout = "stacked";
    root.style.removeProperty("--work-panel-height");
    delete root.dataset.workProgress;
    select(active);
  };
  const prepare = () => {
    if (disposed) return;
    root.dataset.workMeasuring = "true";
    const rootTextSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const headerHeight = root.closest(".scroll-scene-provider")?.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
    const clearance = headerHeight + rootTextSize;
    const height = (element: HTMLElement) => Math.max(element.offsetHeight, element.scrollHeight);
    const images = stage.querySelectorAll<HTMLImageElement>("img");
    const measurements: SceneMeasurements = {
      viewportWidth: innerWidth, viewportHeight: innerHeight, headerHeight, clearance,
      availableHeight: innerHeight - clearance - rootTextSize, rootTextSize,
      stageWidth: stage.clientWidth, stageHeight: height(stage),
      contentWidth: stage.scrollWidth, contentHeight: height(deck),
      navigationHeight: height(navigation), ctaHeight: height(cta),
      imageHeight: Math.max(0, ...Array.from(images, image => image.offsetHeight)),
      imageWidth: Math.max(0, ...Array.from(images, image => image.offsetWidth)),
      finePointer: matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches,
      touch: navigator.maxTouchPoints > 0, reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
    reservedHeight = measurements.contentHeight;
    delete root.dataset.workMeasuring;
    const candidate = sceneFits(measurements) && document.documentElement.dir !== "rtl" && root.dataset.sceneMode !== "failed";
    root.dataset.workLayout = candidate ? "stage" : "stacked";
    if (candidate) root.style.setProperty("--work-panel-height", `${reservedHeight}px`);
    else root.style.removeProperty("--work-panel-height");
    select(active);
    const minimumHeight = Math.ceil(Math.max(measurements.stageHeight, measurements.contentHeight + measurements.navigationHeight + measurements.ctaHeight, measurements.rootTextSize * 46) + clearance + rootTextSize);
    const query = `(min-width: 1024px) and (min-height: ${minimumHeight}px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`;
    if (capability?.media !== query) {
      capability?.removeEventListener("change", prepare);
      capability = matchMedia(query);
      capability.addEventListener("change", prepare);
    }
  };
  const focus = (event: FocusEvent) => {
    const panel = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-work-panel]") : null;
    const index = panel ? panels.indexOf(panel) : -1;
    if (index >= 0 && index !== active) select(index);
  };

  return {
    stage, content: [deck], navigation, cta,
    anchors: [{ id: "workspace", progress: 0 }, ...panels.map((panel, index) => ({ id: panel.id, progress: 0.08 + index * 0.28 }))],
    async ready(signal) {
      const cleanup = () => {
        disposed = true;
        observer?.disconnect();
        capability?.removeEventListener("change", prepare);
        root.removeEventListener("focusin", focus);
        delete root.dataset.workMeasuring;
        restore();
      };
      retainCleanup(cleanup);
      if (signal.aborted) { cleanup(); return; }
      signal.addEventListener("abort", cleanup, { once: true });
      root.addEventListener("focusin", focus);
      await document.fonts.ready;
      const decoded = await Promise.allSettled(Array.from(stage.querySelectorAll("img"), image => image.decode()));
      if (signal.aborted) return;
      if (decoded.some(result => result.status === "rejected")) { restore(); return; }
      prepare();
      observer = new ResizeObserver(prepare);
      contents.forEach(content => observer!.observe(content));
      signal.removeEventListener("abort", cleanup);
    },
    fits: () => root.dataset.workLayout === "stage",
    distance: measurements => measurements.availableHeight * 2.7,
    setup({ timeline }) {
      root.dataset.workLayout = "stage";
      root.style.setProperty("--work-panel-height", `${reservedHeight}px`);
      select(active);
      for (let index = 0; index < panels.length; index++) {
        const plane = panels[index].querySelector<HTMLElement>("[data-work-plane]")!;
        const screens = panels[index].querySelector<HTMLElement>("[data-work-screens]")!;
        const title = panels[index].querySelector<HTMLElement>("[data-work-title]")!;
        const hold = index * 0.28;
        if (index > 0) {
          const entrance = hold - 0.12;
          timeline.fromTo(plane, { yPercent: 100 }, { yPercent: 0 }, entrance, 0.12);
          timeline.fromTo(screens, { yPercent: 70 }, { yPercent: 0 }, entrance, 0.12);
          timeline.fromTo(title, { xPercent: 110 }, { xPercent: 0 }, entrance + 0.06, 0.06);
        }
        timeline.fromTo(plane, { yPercent: 0 }, { yPercent: -4 }, hold, 0.16);
        if (index < panels.length - 1) {
          timeline.fromTo(plane, { yPercent: -4 }, { yPercent: -8 }, hold + 0.16, 0.12);
          timeline.fromTo(screens, { yPercent: 0 }, { yPercent: -70 }, hold + 0.16, 0.12);
          timeline.fromTo(title, { xPercent: 0 }, { xPercent: -110 }, hold + 0.16, 0.06);
        }
      }
      timeline.fromTo(root.querySelector<HTMLElement>("[data-work-meter]")!, { xPercent: -100 }, { xPercent: 0 }, 0, 1);
      return {
        progress(value) {
          const progress = normalizeProgress(value);
          root.dataset.workProgress = progress.toFixed(4);
          select(Math.min(panels.length - 1, Math.floor((progress + 0.06) / 0.28)), progress);
        },
        settle: restore,
      };
    },
    staticFallback: restore,
  };
}

export function ProjectJourney({ children }: { children: ReactNode }) {
  const cleanup = useRef<(() => void) | undefined>(undefined);
  const createScene = useCallback((root: HTMLElement) => projectScene(root, dispose => {
    cleanup.current?.();
    cleanup.current = dispose;
  }), []);
  useEffect(() => () => cleanup.current?.(), []);
  return <SceneBoundary id="selected-work" createScene={createScene} className={`site-shell ${styles.workBoundary}`}>{children}</SceneBoundary>;
}
