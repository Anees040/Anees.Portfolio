"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  const instructions = useId();

  useEffect(() => {
    const element = root.current;
    const image = element?.querySelector("img");
    const stage = element?.querySelector<HTMLElement>(".character-frame");
    if (!element || !image || !stage || failed) return;
    const eligible = matchMedia("(prefers-reduced-motion: no-preference) and (forced-colors: none)");
    let canvas: HTMLCanvasElement | undefined;
    let worker: Worker | undefined;
    let engine: ParticleEngine | undefined;
    let frameId = 0, last = 0, generation = 0, sequence = 0;
    let visible = true, disposed = false, workerFailed = false, resizePending = false, initializing = false, ready = false;
    let interaction: "none" | "hover" | "touch" | "replay" = "none";
    let pointerId: number | undefined;
    let pointerX = -1000, pointerY = -1000;
    let touchStarted = 0;
    let releaseTimer: ReturnType<typeof setTimeout> | undefined;
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    let width = 0, height = 0;
    const allowed = () => eligible.matches && visible && !document.hidden && !disposed;
    const rest = () => { element.dataset.particleState = "resting"; element.dataset.particlePhase = "assembled"; };
    const metrics = (values: ParticleMetrics) => {
      element.dataset.particleMetrics = JSON.stringify({ ...values, mode: worker ? "worker" : "main", width, height, dpr: window.devicePixelRatio });
    };
    const settled = (values: ParticleMetrics) => {
      metrics(values); element.dataset.particleSimulation = "settled";
      if (interaction === "hover" || interaction === "touch") element.dataset.particlePhase = "holding";
      else if (values.reassembled) { interaction = "none"; element.dataset.particleInteraction = "none"; rest(); }
    };
    const stop = () => {
      cancelAnimationFrame(frameId); frameId = 0; sequence++; clearTimeout(releaseTimer);
      interaction = "none"; pointerId = undefined; pointerX = -1000; pointerY = -1000;
      element.dataset.particleInteraction = "none"; element.dataset.particleSimulation = "paused";
      worker?.postMessage({ type: "pause" }); rest();
    };
    const disposeEngine = () => {
      generation++; stop(); clearTimeout(watchdog); worker?.terminate(); worker = undefined;
      engine = undefined; canvas?.remove(); canvas = undefined; ready = false; initializing = false;
    };
    function tick(time: number) {
      frameId = 0;
      if (!allowed() || !engine) return rest();
      const done = engine.step(last ? time - last : 16.667); last = time;
      if (done) settled(engine.metrics);
      else frameId = requestAnimationFrame(tick);
    }
    const start = () => {
      if (!allowed() || !ready) return;
      element.dataset.particleState = "active";
      element.dataset.particleInteraction = interaction;
      element.dataset.particleSimulation = "running";
      element.dataset.particlePhase = interaction === "none" || interaction === "replay" ? "reassembling" : "dispersing";
      if (engine && !frameId) { last = 0; frameId = requestAnimationFrame(tick); }
    };
    const sendPointer = () => {
      if (!ready) return;
      sequence++;
      worker?.postMessage({ type: "pointer", x: pointerX * width, y: pointerY * height, sequence });
      engine?.pointer(pointerX * width, pointerY * height); start();
    };
    async function initialize(resume?: { x: number; y: number }) {
      if (initializing || !allowed() || !image?.complete || !image.naturalWidth || !stage || !element) return;
      const bounds = stage.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      resizePending = false;
      disposeEngine();
      if (resume && stage.matches(":hover")) { interaction = "hover"; pointerX = resume.x; pointerY = resume.y; }
      initializing = true;
      const run = generation;
      const low = navigator.hardwareConcurrency <= 4 || matchMedia("(pointer: coarse)").matches;
      const scale = Math.min(Math.max(1, Math.min(2, window.devicePixelRatio)), (low ? 300 : 420) / bounds.width, 630 / bounds.height);
      width = Math.max(1, Math.round(bounds.width * scale)); height = Math.max(1, Math.round(bounds.height * scale));
      const sample = document.createElement("canvas"); sample.width = width; sample.height = height;
      const context = sample.getContext("2d", { willReadFrequently: true });
      if (!context) { initializing = false; return; }
      const fit = Math.min(width / image.naturalWidth, height / image.naturalHeight);
      const iw = image.naturalWidth * fit, ih = image.naturalHeight * fit;
      let source: ParticleSource;
      try {
        context.drawImage(image, (width - iw) / 2, 0, iw, ih);
        source = { width, height, pixels: context.getImageData(0, 0, width, height).data, gap: low ? 4 : 3 };
      } catch { initializing = false; return; }
      canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
      canvas.className = "particle-canvas"; canvas.setAttribute("aria-hidden", "true"); stage.appendChild(canvas);
      if (!low && !workerFailed && navigator.hardwareConcurrency > 4 && "transferControlToOffscreen" in canvas && typeof Worker !== "undefined") {
        try {
          worker = new Worker(new URL("../../lib/particle-worker.ts", import.meta.url), { type: "module" });
          const fallback = () => {
            if (disposed || run !== generation) return;
            const resume = interaction === "hover" ? { x: pointerX, y: pointerY } : undefined;
            workerFailed = true;
            disposeEngine();
            setAvailable(false);
            void initialize(resume);
          };
          worker.onerror = fallback;
          worker.onmessage = (event: MessageEvent<{ type: string; metrics: ParticleMetrics; sequence?: number }>) => {
            if (run !== generation || disposed) return;
            if (event.data.type === "ready") {
              clearTimeout(watchdog); ready = true; initializing = false; metrics(event.data.metrics);
              element.dataset.particleSimulation = "settled"; setAvailable(true);
              if (!allowed()) stop(); else if (interaction !== "none") sendPointer();
            }
            if (event.data.type === "settled" && event.data.sequence === sequence && allowed()) settled(event.data.metrics);
            if (event.data.type === "failed") fallback();
          };
          watchdog = setTimeout(fallback, 2500);
          const offscreen = canvas.transferControlToOffscreen();
          worker.postMessage({ type: "init", canvas: offscreen, source }, [offscreen, source.pixels.buffer]);
          element.dataset.particleMode = "worker";
          return;
        } catch { workerFailed = true; disposeEngine(); return initialize(); }
      }
      const { ParticleEngine } = await import("@/lib/particle-engine");
      if (disposed || run !== generation || !canvas) return;
      const target = canvas.getContext("2d");
      if (!target) { initializing = false; return; }
      engine = new ParticleEngine(target, source); engine.step(16.667);
      ready = true; initializing = false; metrics(engine.metrics);
      element.dataset.particleMode = "main"; element.dataset.particleSimulation = "settled"; setAvailable(true);
      if (interaction !== "none") sendPointer();
    }
    replay.current = () => {
      if (!allowed()) return;
      if (!worker && !engine) { void initialize(); return; }
      clearTimeout(releaseTimer); interaction = "replay"; pointerId = undefined;
      sequence++; worker?.postMessage({ type: "scatter", sequence }); engine?.scatter(); start();
    };
    const pointer = (event: PointerEvent) => {
      if (!allowed() || !canvas || (event.pointerType !== "mouse" && event.pointerId !== pointerId)) return;
      if (event.pointerType === "mouse") interaction = "hover";
      const rect = canvas.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width;
      pointerY = (event.clientY - rect.top) / rect.height;
      sendPointer();
    };
    const leave = () => {
      if (!allowed()) return stop();
      clearTimeout(releaseTimer); interaction = "none"; pointerId = undefined; pointerX = -1000; pointerY = -1000; sendPointer();
    };
    const enter = (event: PointerEvent) => { if (event.pointerType === "mouse") pointer(event); };
    const exit = (event: PointerEvent) => { if (event.pointerType === "mouse" || event.pointerId === pointerId) leave(); };
    const down = (event: PointerEvent) => {
      if (!allowed() || event.pointerType === "mouse" || !event.isPrimary || pointerId !== undefined) return;
      clearTimeout(releaseTimer); interaction = "touch"; pointerId = event.pointerId; touchStarted = performance.now(); pointer(event);
    };
    const up = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = undefined;
      const remaining = Math.max(0, 220 - (performance.now() - touchStarted));
      releaseTimer = setTimeout(leave, remaining);
    };
    const cancel = (event: PointerEvent) => { if (event.pointerId === pointerId) leave(); };
    const preference = () => { disposeEngine(); setAvailable(false); if (allowed()) void initialize(); };
    const visibility = () => {
      if (document.hidden) stop();
      else void initialize();
    };
    const load = () => { if (!canvas) void initialize(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) stop(); else if (!canvas || resizePending || element.dataset.particleSimulation === "paused") void initialize();
    }); observer.observe(element);
    let priorWidth = 0, priorHeight = 0;
    const resize = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      if (Math.abs(w - priorWidth) < 2 && Math.abs(h - priorHeight) < 2) return;
      priorWidth = w; priorHeight = h; resizePending = true; void initialize();
    }); resize.observe(stage);
    stage.addEventListener("pointerenter", enter); stage.addEventListener("pointermove", pointer, { passive: true }); stage.addEventListener("pointerleave", exit);
    stage.addEventListener("pointerdown", down, { passive: true }); stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", cancel);
    image.addEventListener("load", load); eligible.addEventListener("change", preference);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true; disposeEngine(); observer.disconnect(); resize.disconnect();
      stage.removeEventListener("pointerenter", enter); stage.removeEventListener("pointermove", pointer); stage.removeEventListener("pointerleave", exit);
      stage.removeEventListener("pointerdown", down); stage.removeEventListener("pointerup", up); stage.removeEventListener("pointercancel", cancel);
      image.removeEventListener("load", load); eligible.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility); replay.current = () => {};
    };
  }, [failed]);

  return <div ref={root} className="image-atomizer" data-particle-state="resting" data-particle-interaction="none" data-particle-phase="assembled" data-particle-simulation="paused">
    {failed ? <CharacterFallback /> : <div className="character-animation" data-character-scene="hero"><div className="character-frame"><CharacterPortrait frame={frame} eager onError={() => setFailed(true)} /></div></div>}
    <span id={instructions} className="visually-hidden">Move over the portrait, or touch and drag sideways, to move its image particles. Vertical swipes scroll the page. Use Reassemble portrait for a keyboard replay.</span>
    {available && !failed && <button className="portrait-replay" aria-describedby={instructions} onClick={() => replay.current()} type="button"><RotateCcw size={15} aria-hidden="true" /> Reassemble portrait</button>}
  </div>;
}
