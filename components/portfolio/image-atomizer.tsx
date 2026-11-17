"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { CharacterFrame } from "@/lib/character-assets";
import type { ParticleEngine, ParticleMetrics, ParticleSource } from "@/lib/particle-engine";
import { CharacterPortrait } from "./character-portrait";
import { CharacterFallback } from "./character-fallback";

export function ImageAtomizer({ frame }: { frame: CharacterFrame }) {
  const root = useRef<HTMLDivElement>(null);
  const replay = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const element = root.current;
    const image = element?.querySelector("img");
    const stage = element?.querySelector<HTMLElement>(".character-frame");
    if (!element || !image || !stage || failed) return;
    const eligible = matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)");
    let canvas: HTMLCanvasElement | undefined;
    let worker: Worker | undefined;
    let engine: ParticleEngine | undefined;
    let frameId = 0, last = 0, generation = 0;
    let visible = true, disposed = false, workerFailed = false, resizePending = false;
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    let width = 0, height = 0;
    const allowed = () => eligible.matches && visible && !document.hidden && !disposed;
    const rest = () => { element.dataset.particleState = "resting"; };
    const metrics = (values: ParticleMetrics) => {
      element.dataset.particleMetrics = JSON.stringify({ ...values, mode: worker ? "worker" : "main", width, height });
    };
    const stop = () => { cancelAnimationFrame(frameId); frameId = 0; worker?.postMessage({ type: "pause" }); rest(); };
    const disposeEngine = () => {
      generation++; stop(); clearTimeout(watchdog); worker?.terminate(); worker = undefined;
      engine = undefined; canvas?.remove(); canvas = undefined;
    };
    function tick(time: number) {
      frameId = 0;
      if (!allowed() || !engine) return rest();
      const done = engine.step(last ? time - last : 16.667); last = time;
      if (done) { metrics(engine.metrics); rest(); }
      else frameId = requestAnimationFrame(tick);
    }
    const start = () => {
      if (!allowed()) return;
      element.dataset.particleState = "active";
      if (engine && !frameId) { last = 0; frameId = requestAnimationFrame(tick); }
    };
    async function initialize() {
      if (!allowed() || !image?.complete || !image.naturalWidth || !stage || !element) return;
      const bounds = stage.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      resizePending = false;
      disposeEngine();
      const run = generation;
      const low = navigator.hardwareConcurrency <= 4;
      const scale = Math.min(1, (low ? 300 : 420) / bounds.width, 630 / bounds.height);
      width = Math.max(1, Math.round(bounds.width * scale)); height = Math.max(1, Math.round(bounds.height * scale));
      const sample = document.createElement("canvas"); sample.width = width; sample.height = height;
      const context = sample.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      const fit = Math.min(width / image.naturalWidth, height / image.naturalHeight);
      const iw = image.naturalWidth * fit, ih = image.naturalHeight * fit;
      let source: ParticleSource;
      try {
        context.drawImage(image, (width - iw) / 2, 0, iw, ih);
        source = { width, height, pixels: context.getImageData(0, 0, width, height).data, gap: low ? 4 : 3 };
      } catch { return; }
      canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
      canvas.className = "particle-canvas"; canvas.setAttribute("aria-hidden", "true"); stage.appendChild(canvas);
      if (!workerFailed && navigator.hardwareConcurrency > 4 && "transferControlToOffscreen" in canvas && typeof Worker !== "undefined") {
        try {
          worker = new Worker(new URL("../../lib/particle-worker.ts", import.meta.url), { type: "module" });
          const fallback = () => {
            if (disposed || run !== generation) return;
            workerFailed = true;
            disposeEngine();
            setAvailable(false);
            void initialize();
          };
          worker.onerror = fallback;
          worker.onmessage = (event: MessageEvent<{ type: string; metrics: ParticleMetrics }>) => {
            if (run !== generation || disposed) return;
            if (event.data.type === "ready") { clearTimeout(watchdog); if (allowed()) start(); else stop(); setAvailable(true); }
            if (event.data.type === "settled") { metrics(event.data.metrics); rest(); }
            if (event.data.type === "failed") fallback();
          };
          watchdog = setTimeout(fallback, 2500);
          const offscreen = canvas.transferControlToOffscreen();
          worker.postMessage({ type: "init", canvas: offscreen, source }, [offscreen, source.pixels.buffer]);
          element.dataset.particleMode = "worker";
          return;
        } catch { workerFailed = true; return initialize(); }
      }
      const { ParticleEngine } = await import("@/lib/particle-engine");
      if (disposed || run !== generation || !canvas) return;
      const target = canvas.getContext("2d");
      if (!target) return;
      engine = new ParticleEngine(target, source); engine.step(16.667);
      element.dataset.particleMode = "main"; setAvailable(true); start();
    }
    replay.current = () => {
      if (!allowed()) return;
      if (!worker && !engine) { void initialize(); return; }
      worker?.postMessage({ type: "scatter" }); engine?.scatter(); start();
    };
    const pointer = (event: PointerEvent) => {
      if (!allowed() || event.pointerType !== "mouse" || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * width;
      const y = (event.clientY - rect.top) / rect.height * height;
      worker?.postMessage({ type: "pointer", x, y }); engine?.pointer(x, y); start();
    };
    const leave = () => {
      if (!allowed()) return stop();
      worker?.postMessage({ type: "pointer", x: -1000, y: -1000 }); engine?.pointer(-1000, -1000); start();
    };
    const preference = () => { disposeEngine(); setAvailable(false); if (allowed()) void initialize(); };
    const visibility = () => {
      if (document.hidden) stop();
      else if (!canvas || resizePending) void initialize();
    };
    const load = () => { if (!canvas) void initialize(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) stop(); else if (!canvas || resizePending) void initialize();
    }); observer.observe(element);
    let priorWidth = 0, priorHeight = 0;
    const resize = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      if (Math.abs(w - priorWidth) < 2 && Math.abs(h - priorHeight) < 2) return;
      priorWidth = w; priorHeight = h; resizePending = true; void initialize();
    }); resize.observe(stage);
    stage.addEventListener("pointermove", pointer, { passive: true }); stage.addEventListener("pointerleave", leave);
    image.addEventListener("load", load); eligible.addEventListener("change", preference);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true; disposeEngine(); observer.disconnect(); resize.disconnect();
      stage.removeEventListener("pointermove", pointer); stage.removeEventListener("pointerleave", leave);
      image.removeEventListener("load", load); eligible.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility); replay.current = () => {};
    };
  }, [failed]);

  return <div ref={root} className="image-atomizer" data-particle-state="resting">
    {failed ? <CharacterFallback /> : <div className="character-animation" data-character-scene="hero"><div className="character-frame"><CharacterPortrait frame={frame} eager onError={() => setFailed(true)} /></div></div>}
    {available && !failed && <button className="portrait-replay" onClick={() => replay.current()} type="button"><RotateCcw size={15} aria-hidden="true" /> Reassemble portrait</button>}
  </div>;
}
