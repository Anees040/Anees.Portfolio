import type { gsap as Gsap } from "gsap";
import type { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";
import type { SceneFitRequirements, SceneMeasurements, ScenePlayback, SceneSnapshot, ScrollScene, ScrollSceneCoordinator } from "./scroll-scene-contract";

export function normalizeProgress(progress: number): number {
  return Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
}

export function progressToScroll(progress: number, start: number, end: number): number {
  return start + normalizeProgress(progress) * Math.max(0, end - start);
}

export function sceneFits(measurements: Readonly<SceneMeasurements>, requirements: SceneFitRequirements = {}): boolean {
  return !measurements.reducedMotion && measurements.finePointer && !measurements.touch
    && measurements.viewportWidth >= (requirements.minimumWidth ?? 1024)
    && measurements.availableHeight >= measurements.rootTextSize * (requirements.minimumHeightRem ?? 46)
    && measurements.stageWidth >= measurements.rootTextSize * (requirements.minimumStageWidthRem ?? 40)
    && measurements.contentWidth <= measurements.stageWidth && measurements.imageWidth <= measurements.stageWidth
    && Math.max(measurements.stageHeight, measurements.contentHeight + measurements.navigationHeight + measurements.ctaHeight, measurements.imageHeight) <= measurements.availableHeight;
}

export class SceneRegistry {
  private scenes = new Map<string, ScrollScene>();

  register(scene: ScrollScene): () => void {
    if (this.scenes.has(scene.id)) throw new Error(`Scroll scene already registered: ${scene.id}`);
    for (const existing of this.scenes.values()) if (existing.root === scene.root) throw new Error(`Scroll scene scope already owned: ${existing.id}`);
    if (!scene.id || !scene.root.contains(scene.stage)) throw new Error("A scene needs a unique id and a stage inside its scope");
    const anchorIds = new Set<string>();
    for (const anchor of scene.anchors) {
      if (anchorIds.has(anchor.id) || !anchor.id || anchor.progress !== normalizeProgress(anchor.progress)) throw new Error(`Invalid scene anchor: ${anchor.id}`);
      anchorIds.add(anchor.id);
      for (const existing of this.scenes.values()) if (existing.anchors.some(candidate => candidate.id === anchor.id)) throw new Error(`Scene anchor already owned: ${anchor.id}`);
    }
    this.scenes.set(scene.id, scene);
    let removed = false;
    return () => {
      if (removed) return;
      removed = true;
      if (this.scenes.get(scene.id) === scene) this.scenes.delete(scene.id);
    };
  }

  values(): readonly ScrollScene[] { return Array.from(this.scenes.values()); }
}

export class RefreshQueue {
  private pending: number | undefined;
  private reasons = new Set<string>();
  private disposed = false;

  constructor(private schedule: (callback: () => void) => number, private cancel: (handle: number) => void, private refresh: (reasons: readonly string[]) => void) {}

  request(reason: string) {
    if (this.disposed) return;
    this.reasons.add(reason);
    if (this.pending !== undefined) return;
    this.pending = this.schedule(() => {
      this.pending = undefined;
      const reasons = Array.from(this.reasons);
      this.reasons.clear();
      this.refresh(reasons);
    });
  }

  dispose() {
    this.disposed = true;
    if (this.pending !== undefined) this.cancel(this.pending);
    this.pending = undefined;
    this.reasons.clear();
  }
}

export async function waitForSceneReadiness(scene: ScrollScene, signal: AbortSignal, fonts: Promise<unknown>, timeout = 5000): Promise<number> {
  if (signal.aborted) return 1;
  const controller = new AbortController();
  const combined = AbortSignal.any([signal, controller.signal]);
  const abort = new Promise<never>((_, reject) => {
    if (combined.aborted) reject(combined.reason);
    else combined.addEventListener("abort", () => reject(combined.reason), { once: true });
  });
  const timer = setTimeout(() => controller.abort(new Error("Scene readiness timed out")), timeout);
  try {
    const images = scene.scroll === "flow" ? [] : Array.from(scene.root.querySelectorAll("img"), image => new Promise<void>((resolve, reject) => {
      const cleanup = () => { image.removeEventListener("load", load); image.removeEventListener("error", error); combined.removeEventListener("abort", error); };
      const decoded = () => { cleanup(); resolve(); };
      const error = () => { cleanup(); reject(new Error("Scene image unavailable")); };
      const load = () => {
        if (typeof image.decode === "function") image.decode().then(decoded, error);
        else decoded();
      };
      image.addEventListener("load", load, { once: true });
      image.addEventListener("error", error, { once: true });
      combined.addEventListener("abort", error, { once: true });
      if (image.complete) { if (image.naturalWidth) load(); else error(); }
    }));
    const tasks = [fonts, ...images];
    if (scene.ready) tasks.push(Promise.resolve().then(() => scene.ready!(combined)));
    const results = await Promise.race([Promise.allSettled(tasks), abort]);
    return results.filter(result => result.status === "rejected").length;
  } catch {
    return 1;
  } finally {
    clearTimeout(timer);
    controller.abort();
  }
}

interface SceneRecord {
  scene: ScrollScene;
  snapshot: SceneSnapshot;
  abort: AbortController;
  ready: boolean;
  measurements?: SceneMeasurements;
  context?: gsap.Context;
  timeline?: gsap.core.Timeline;
  trigger?: Trigger;
  playback?: ScenePlayback;
  styles?: Map<HTMLElement, string | null>;
}

export async function createScrollSceneRuntime(root: HTMLElement, signal?: AbortSignal): Promise<ScrollSceneCoordinator & { dispose(): void }> {
  const [{ gsap }, { ScrollTrigger }, { useGSAP }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("@gsap/react")]);
  if (signal?.aborted || !root.isConnected) throw new Error("Scroll scope was unmounted during initialization");
  gsap.registerPlugin(useGSAP);
  return startScrollSceneRuntime(root, gsap, ScrollTrigger);
}

function startScrollSceneRuntime(root: HTMLElement, gsap: typeof Gsap, ScrollTrigger: typeof Trigger): ScrollSceneCoordinator & { dispose(): void } {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ autoRefreshEvents: "none" });
  const registry = new SceneRegistry();
  const records = new Map<string, SceneRecord>();
  const media = gsap.matchMedia();
  const sizes = new WeakMap<Element, { width: number; height: number }>();
  let reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let finePointer = false;
  let disposed = false;
  let refreshing = false;
  let refreshes = 0;
  let lastReasons: readonly string[] = [];
  let pendingHash = location.hash;
  let sceneFocus: HTMLElement | undefined;
  let interruptedReading: { target: HTMLElement; top: number } | undefined;
  let pageTrigger: Trigger | undefined;
  const progress = root.querySelector<HTMLElement>("[data-scroll-progress]");
  const fonts = document.fonts?.ready ?? Promise.resolve();

  const report = () => {
    if (disposed) return;
    root.dataset.scrollRuntime = "ready";
    root.dataset.scrollScenes = String(records.size);
    root.dataset.scrollTriggers = String(ScrollTrigger.getAll().filter(trigger => trigger.vars.id?.startsWith("scene:")).length);
    root.dataset.scrollRefreshes = String(refreshes);
  };

  const settle = (record: SceneRecord) => {
    for (const action of [() => record.playback?.settle?.(), () => record.trigger?.kill(true), () => record.context?.revert(), () => record.playback?.dispose?.(), () => record.scene.staticFallback()]) {
      try { action(); } catch { record.snapshot.readinessFailures++; }
    }
    for (const [element, style] of record.styles ?? []) {
      if (style === null) element.removeAttribute("style");
      else element.setAttribute("style", style);
    }
    record.styles = undefined;
    record.trigger = undefined;
    record.context = undefined;
    record.timeline = undefined;
    record.playback = undefined;
    record.snapshot.triggers = 0;
    delete record.scene.root.dataset.sceneStart;
    delete record.scene.root.dataset.sceneEnd;
  };

  const measure = (scene: ScrollScene): SceneMeasurements => {
    const rootTextSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const headerHeight = root.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
    const clearance = headerHeight + rootTextSize;
    const height = (element?: HTMLElement) => element ? Math.max(element.offsetHeight, element.scrollHeight) : 0;
    return {
      viewportWidth: innerWidth, viewportHeight: innerHeight, headerHeight, clearance,
      availableHeight: Math.max(0, innerHeight - clearance - rootTextSize), rootTextSize,
      stageWidth: scene.stage.clientWidth, stageHeight: height(scene.stage),
      contentHeight: scene.content?.reduce((total, element) => total + height(element), 0) ?? Math.max(0, height(scene.stage) - height(scene.navigation) - height(scene.cta)),
      contentWidth: scene.stage.scrollWidth,
      navigationHeight: height(scene.navigation), ctaHeight: height(scene.cta),
      imageHeight: Math.max(0, ...Array.from(scene.stage.querySelectorAll("img"), image => image.offsetHeight)),
      imageWidth: Math.max(0, ...Array.from(scene.stage.querySelectorAll("img"), image => image.offsetWidth)),
      finePointer, touch: navigator.maxTouchPoints > 0, reducedMotion,
    };
  };

  const update = (record: SceneRecord, progress: number) => {
    record.snapshot.progress = normalizeProgress(progress);
    if (!record.snapshot.visible || document.hidden) return;
    try {
      record.timeline?.progress(record.snapshot.progress, true);
      record.playback?.progress?.(record.snapshot.progress);
    } catch {
      record.snapshot.readinessFailures++;
      settle(record);
      record.snapshot.mode = "failed";
      record.scene.root.dataset.sceneMode = "failed";
      queue.request("scene-error");
    }
  };

  const findAnchor = (scene: ScrollScene, id: string): HTMLElement | null => scene.root.id === id ? scene.root : scene.root.querySelector<HTMLElement>(`#${CSS.escape(id)}`);

  const resolveHash = () => {
    if (!pendingHash) return;
    if (Array.from(records.values()).some(record => !record.ready)) return;
    let id: string;
    try { id = decodeURIComponent(pendingHash.slice(1)); } catch { pendingHash = ""; return; }
    for (const record of records.values()) {
      const anchor = record.scene.anchors.find(candidate => candidate.id === id);
      const target = findAnchor(record.scene, id);
      if (!anchor || !target) continue;
      if (!record.ready) return;
      const pinned = record.snapshot.mode === "pinned";
      const top = record.trigger && pinned ? progressToScroll(anchor.progress, record.trigger.start, record.trigger.end) : scrollY + target.getBoundingClientRect().top - measure(record.scene).clearance;
      if (!target.hasAttribute("tabindex") && !target.matches("a,button,input,select,textarea,summary")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      window.scrollTo({ top, behavior: "instant" });
      if (record.trigger && pinned) update(record, anchor.progress);
      pendingHash = "";
      return;
    }
    pendingHash = "";
  };

  const refresh = (reasons: readonly string[]) => {
    if (disposed || refreshing || document.hidden) return;
    refreshing = true;
    lastReasons = reasons;
    const ordered = Array.from(records.values()).sort((first, second) => first.scene.root.compareDocumentPosition(second.scene.root) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    const measurements = ordered.map(record => measure(record.scene));
    const active = document.activeElement;
    const focused = active instanceof HTMLElement && active !== document.body ? active : sceneFocus;
    const interruption = interruptedReading;
    let readingTarget: HTMLElement | undefined;
    let readingTop = 0;
    interruptedReading = undefined;
    let changed = false;
    for (let index = 0; index < ordered.length; index++) {
      const record = ordered[index], dimensions = measurements[index];
      let fits = false;
      let flow = record.scene.scroll === "flow";
      if (record.scene.scroll === "adaptive") flow = !sceneFits(dimensions) || !(record.scene.fits?.(dimensions) ?? true);
      try { fits = record.ready && !record.snapshot.readinessFailures
        && (flow ? !dimensions.reducedMotion && matchMedia("(forced-colors: none)").matches : sceneFits(dimensions))
        && (flow && record.scene.scroll === "adaptive" ? true : record.scene.fits?.(dimensions) ?? true); }
      catch { record.snapshot.readinessFailures++; }
      const previous = record.measurements;
      const unchanged = previous && (Object.keys(dimensions) as (keyof SceneMeasurements)[]).every(key => key === "stageHeight" ? Math.abs(dimensions.stageHeight - previous.stageHeight) <= 1 : dimensions[key] === previous[key]);
      const expectedMode = !record.ready ? "pending" : record.snapshot.readinessFailures ? "failed" : fits ? flow ? "scrolling" : "pinned" : "static";
      if (unchanged && record.snapshot.mode === expectedMode) continue;
      record.measurements = dimensions;
      if (!record.trigger && !fits) {
        record.snapshot.mode = record.ready ? record.snapshot.readinessFailures ? "failed" : "static" : "pending";
        record.scene.root.dataset.sceneMode = record.snapshot.mode;
        continue;
      }
      if (!readingTarget && interruption && record.scene.root.contains(interruption.target)) {
        readingTarget = interruption.target;
        readingTop = interruption.top;
      }
      if (!readingTarget) {
        const focused = document.activeElement;
        const candidate = focused instanceof HTMLElement && record.scene.root.contains(focused) ? focused : record.scene.anchors.map(anchor => findAnchor(record.scene, anchor.id)).find(element => element && element.getBoundingClientRect().top >= dimensions.headerHeight && element.getBoundingClientRect().top < innerHeight);
        if (candidate && candidate.getBoundingClientRect().top >= dimensions.headerHeight && candidate.getBoundingClientRect().top < innerHeight) { readingTarget = candidate; readingTop = candidate.getBoundingClientRect().top; }
      }
      settle(record);
      changed = true;
      record.snapshot.mode = record.ready ? record.snapshot.readinessFailures ? "failed" : "static" : "pending";
      if (fits) {
        try {
          const distance = record.scene.distance(dimensions);
          if (!flow && (!Number.isFinite(distance) || distance <= 0 || distance > dimensions.viewportHeight * Math.max(1, record.scene.anchors.length))) throw new Error("Scene pin distance must be finite and content-bounded");
          record.context = gsap.context(() => {}, record.scene.root);
          record.styles = new Map();
          record.context.add(() => {
            const timeline = gsap.timeline({ paused: true, defaults: { ease: "none" } });
            record.timeline = timeline;
            record.playback = record.scene.setup({ scope: record.scene.root, measurements: dimensions, pinned: !flow, timeline: {
              fromTo(target, from, to, start, duration) {
                if (!record.scene.root.contains(target)) throw new Error("Scene timeline target outside its scope");
                if (!record.styles!.has(target)) record.styles!.set(target, target.getAttribute("style"));
                timeline.fromTo(target, from, { ...to, duration, immediateRender: false, lazy: false, ease: "none" }, start);
              },
            } }) || undefined;
            record.trigger = ScrollTrigger.create({
              id: `scene:${record.scene.id}`, trigger: record.scene.root, pin: flow ? false : record.scene.stage,
              start: () => flow ? "top bottom" : `top top+=${dimensions.clearance}`,
              end: () => flow ? "bottom top" : `+=${distance}`,
              invalidateOnRefresh: true,
              onUpdate: trigger => update(record, trigger.progress),
            });
          });
          record.snapshot.mode = flow ? "scrolling" : "pinned";
          record.snapshot.triggers = 1;
          record.playback?.visibility?.(record.snapshot.visible && !document.hidden);
        } catch {
          settle(record);
          record.snapshot.mode = "failed";
          record.snapshot.readinessFailures++;
        }
      }
      record.scene.root.dataset.sceneMode = record.snapshot.mode;
    }
    ScrollTrigger.sort();
    if (pendingHash) ScrollTrigger.clearScrollMemory(history.scrollRestoration);
    ScrollTrigger.refresh();
    refreshes++;
    for (const record of ordered) {
      if (record.trigger) {
        record.scene.root.dataset.sceneStart = String(record.trigger.start);
        record.scene.root.dataset.sceneEnd = String(record.trigger.end);
        update(record, record.trigger.progress);
      } else {
        delete record.scene.root.dataset.sceneStart;
        delete record.scene.root.dataset.sceneEnd;
      }
    }
    if (readingTarget?.isConnected && !pendingHash) window.scrollTo({ top: scrollY + readingTarget.getBoundingClientRect().top - readingTop, behavior: "instant" });
    if (focused?.isConnected && root.contains(focused)) focused.focus({ preventScroll: true });
    resolveHash();
    refreshing = false;
    report();
    if (changed && !reasons.includes("stabilize")) queue.request("stabilize");
  };

  const queue = new RefreshQueue(callback => window.requestAnimationFrame(callback), handle => window.cancelAnimationFrame(handle), refresh);
  const resize = new ResizeObserver(entries => {
    let dirty = false;
    for (const { target } of entries) {
      const element = target as HTMLElement;
      const next = { width: element.offsetWidth, height: element.scrollHeight };
      const previous = sizes.get(element);
      if (!previous || next.width !== previous.width || Math.abs(next.height - previous.height) > 1) { sizes.set(element, next); dirty = true; }
    }
    if (dirty && !refreshing) queue.request("container");
  });
  const visibility = new IntersectionObserver(entries => {
    for (const entry of entries) for (const record of records.values()) if (record.scene.root === entry.target) {
      record.snapshot.visible = entry.isIntersecting;
      record.playback?.visibility?.(entry.isIntersecting && !document.hidden);
      if (entry.isIntersecting && record.trigger) update(record, record.trigger.progress);
    }
  });
  const captureReading = () => {
    const active = document.activeElement;
    let target = active instanceof HTMLElement && Array.from(records.values()).some(record => record.scene.root.contains(active)) ? active : sceneFocus;
    if (!target) for (const record of records.values()) {
      if (!record.snapshot.visible) continue;
      target = record.scene.anchors.map(anchor => findAnchor(record.scene, anchor.id)).find((element): element is HTMLElement => !!element && element.getBoundingClientRect().top >= 0 && element.getBoundingClientRect().top < innerHeight);
      if (target) break;
      const top = record.scene.stage.getBoundingClientRect().top;
      if (top >= 0 && top < innerHeight) { target = record.scene.stage; break; }
    }
    if (target?.isConnected && root.contains(target)) {
      const top = target.getBoundingClientRect().top;
      if (top >= 0 && top < innerHeight) interruptedReading = { target, top };
    }
  };
  const focus = (event: FocusEvent) => {
    const target = event.target;
    sceneFocus = target instanceof HTMLElement && Array.from(records.values()).some(record => record.scene.root.contains(target)) ? target : undefined;
  };
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  let rootFontSize = getComputedStyle(document.documentElement).fontSize;
  const textSize = new MutationObserver(() => {
    const next = getComputedStyle(document.documentElement).fontSize;
    if (next !== rootFontSize) { rootFontSize = next; queue.request("root-text"); }
  });
  const viewport = () => { captureReading(); queue.request("viewport"); };
  const disclosure = () => queue.request("disclosure");
  const documentVisibility = () => {
    for (const record of records.values()) record.playback?.visibility?.(record.snapshot.visible && !document.hidden);
    if (!document.hidden) queue.request("visible");
  };
  const hash = () => { pendingHash = location.hash; interruptedReading = undefined; queue.request("hash"); };
  const navigate = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || !(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!link || link.target || link.hasAttribute("download")) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
    let id: string;
    try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
    if (!Array.from(records.values()).some(record => record.scene.anchors.some(anchor => anchor.id === id))) return;
    event.preventDefault();
    if (location.hash !== url.hash) history.pushState(null, "", url.hash);
    pendingHash = url.hash;
    interruptedReading = undefined;
    queue.request("anchor");
  };
  const runtime: ScrollSceneCoordinator & { dispose(): void } = {
    register(scene) {
      if (disposed) throw new Error("Scroll runtime disposed");
      const unregister = registry.register(scene);
      const record: SceneRecord = { scene, snapshot: { id: scene.id, mode: "pending", progress: 0, visible: false, triggers: 0, readinessFailures: 0 }, abort: new AbortController(), ready: false };
      records.set(scene.id, record);
      try { scene.staticFallback(); } catch { record.snapshot.readinessFailures++; }
      scene.root.dataset.sceneMode = "pending";
      visibility.observe(scene.root);
      for (const element of new Set([scene.stage, ...(scene.content ?? []), scene.navigation, scene.cta].filter((element): element is HTMLElement => !!element))) resize.observe(element);
      waitForSceneReadiness(scene, record.abort.signal, fonts).then(failures => {
        if (disposed || record.abort.signal.aborted) return;
        record.ready = true;
        record.snapshot.readinessFailures = failures;
        if (scene.anchors.some(anchor => location.hash === `#${anchor.id}`)) pendingHash = location.hash;
        queue.request("ready");
      });
      queue.request("register");
      let removed = false;
      return () => {
        if (removed) return;
        removed = true;
        record.abort.abort();
        visibility.unobserve(scene.root);
        for (const element of new Set([scene.stage, ...(scene.content ?? []), scene.navigation, scene.cta].filter((element): element is HTMLElement => !!element))) resize.unobserve(element);
        settle(record);
        scene.root.dataset.sceneMode = "static";
        records.delete(scene.id);
        unregister();
        queue.request("remove");
        report();
      };
    },
    requestRefresh: reason => queue.request(reason),
    inspect: () => ({ scenes: Array.from(records.values(), record => ({ ...record.snapshot })), refreshes, reasons: [...lastReasons] }),
    dispose() {
      if (disposed) return;
      disposed = true;
      queue.dispose();
      for (const record of records.values()) { record.abort.abort(); settle(record); record.scene.root.dataset.sceneMode = "static"; }
      records.clear();
      media.revert();
      resize.disconnect();
      textSize.disconnect();
      visibility.disconnect();
      pageTrigger?.kill();
      progress?.style.removeProperty("transform");
      window.removeEventListener("resize", viewport);
      window.removeEventListener("orientationchange", viewport);
      window.removeEventListener("hashchange", hash);
      window.removeEventListener("popstate", hash);
      document.removeEventListener("visibilitychange", documentVisibility);
      document.removeEventListener("focusin", focus);
      preference.removeEventListener("change", captureReading);
      root.removeEventListener("toggle", disclosure, true);
      root.removeEventListener("click", navigate);
      ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize" });
      delete root.dataset.scrollRuntime;
      delete root.dataset.scrollScenes;
      delete root.dataset.scrollTriggers;
      delete root.dataset.scrollRefreshes;
    },
  };
  try {
    window.addEventListener("resize", viewport);
    window.addEventListener("orientationchange", viewport);
    window.addEventListener("hashchange", hash);
    window.addEventListener("popstate", hash);
    document.addEventListener("visibilitychange", documentVisibility);
    document.addEventListener("focusin", focus);
    preference.addEventListener("change", captureReading);
    root.addEventListener("toggle", disclosure, true);
    root.addEventListener("click", navigate);
    textSize.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });
    const header = root.querySelector<HTMLElement>(".site-header");
    if (header) resize.observe(header);
    if (progress) pageTrigger = ScrollTrigger.create({ id: "portfolio:page-progress", start: 0, end: () => ScrollTrigger.maxScroll(window) || 1, onUpdate: trigger => { if (!reducedMotion && !document.hidden) progress.style.transform = `scaleX(${trigger.progress})`; } });

    media.add({ all: "all", motion: "(prefers-reduced-motion: no-preference)", pointer: "(min-width: 1024px) and (hover: hover) and (pointer: fine)" }, context => {
      reducedMotion = !context.conditions!.motion;
      if (reducedMotion) progress?.style.removeProperty("transform");
      finePointer = !!context.conditions!.pointer;
      queue.request("preference");
    }, root);
    fonts.then(() => queue.request("fonts"), () => queue.request("font-error"));

  } catch (error) { runtime.dispose(); throw error; }
  return runtime;
}
