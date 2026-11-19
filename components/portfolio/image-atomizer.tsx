"use client";

import { useEffect, useId, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { CharacterFrame } from "@/lib/character-assets";
import type { ParticleEngine, ParticleMetrics, ParticleSource } from "@/lib/particle-engine";
import type { ParticleMessage, ParticleReply } from "@/lib/particle-worker";
import { CharacterPortrait } from "./character-portrait";
import { CharacterFallback } from "./character-fallback";
import "./hero-cosmos.module.css";

export function ImageAtomizer({ frame }: { frame: CharacterFrame }) {
  const root = useRef<HTMLDivElement>(null);
  const replay = useRef<() => void>(() => {});
  const initial = useRef({ begun: false, complete: false, count: 0 });
  const [failed, setFailed] = useState(false);
  const [available, setAvailable] = useState(false);
  const instructions = useId();

  useEffect(() => {
    const element = root.current;
    const image = element?.querySelector("img");
    const stage = element?.querySelector<HTMLElement>(".character-frame");
    const hero = element?.closest<HTMLElement>("#home");
    if (!element || !image || !stage || failed) return;
    const eligible = matchMedia("(prefers-reduced-motion: no-preference) and (forced-colors: none)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let canvas: HTMLCanvasElement | undefined, worker: Worker | undefined, engine: ParticleEngine | undefined;
    let frameId = 0, revealId = 0, last = 0, generation = 0, sequence = 0;
    let visible = false, disposed = false, workerFailed = false, initializing = false, ready = false, dirty = true, formationActive = false;
    let interaction: "none" | "hover" | "touch" | "replay" = "none";
    let pointerId: number | undefined, pointerX = -1000, pointerY = -1000, touchX = 0, touchY = 0, touchStarted = 0;
    let releaseTimer: ReturnType<typeof setTimeout> | undefined, watchdog: ReturnType<typeof setTimeout> | undefined;
    let width = 0, height = 0, gap = 2, portraitWidth = 0;
    let resumePointer: { x: number; y: number } | undefined;
    const allowed = () => eligible.matches && visible && !document.hidden && !disposed;
    const phase = (value: string) => { element.dataset.particlePhase = value; };
    const ambient = (active: boolean) => { if (hero) hero.dataset.cosmosMotion = !visible || document.hidden || disposed ? "paused" : active && navigator.hardwareConcurrency > 4 && fine.matches ? "active" : "still"; };
    const representation = (active: boolean) => { element.dataset.particleState = active ? "active" : "resting"; element.dataset.particleRepresentation = active ? "canvas" : "image"; };
    const metrics = (values: ParticleMetrics) => {
      element.dataset.particleMetrics = JSON.stringify({ ...values, mode: worker ? "worker" : "main", width, height, gap, portraitWidth, dpr: window.devicePixelRatio, cores: navigator.hardwareConcurrency });
      element.dataset.particleReassembled = String(values.reassembled);
      element.dataset.particleSettled = String(values.settled);
    };
    const armWatchdog = () => { clearTimeout(watchdog); watchdog = setTimeout(recover, 2500); };
    const post = (message: ParticleMessage) => { worker?.postMessage(message); };
    const settled = (values: ParticleMetrics) => {
      clearTimeout(watchdog); metrics(values); element.dataset.particleSimulation = "settled"; ambient(false);
      if (values.reassembled) {
        formationActive = false;
        initial.current.complete = true; element.dataset.particleFormationComplete = "true";
        interaction = "none"; element.dataset.particleInteraction = "none"; phase("assembled"); representation(false);
      } else if (interaction === "hover" || interaction === "touch") { phase("holding"); representation(true); }
    };
    const pause = () => {
      cancelAnimationFrame(frameId); cancelAnimationFrame(revealId); frameId = 0; revealId = 0; last = 0;
      clearTimeout(releaseTimer); clearTimeout(watchdog); sequence++;
      interaction = "none"; pointerId = undefined; pointerX = -1000; pointerY = -1000;
      formationActive = false;
      post({ type: "pause", sequence }); engine?.assemble();
      if (engine) metrics(engine.snapshot());
      if (initial.current.begun) initial.current.complete = true;
      element.dataset.particleFormationComplete = String(initial.current.complete);
      element.dataset.particleInteraction = "none"; element.dataset.particleSimulation = "paused";
      representation(false); phase("paused"); ambient(false);
    };
    const disposeEngine = () => {
      generation++; pause(); worker?.terminate(); worker = undefined; engine = undefined;
      canvas?.remove(); canvas = undefined; ready = false; initializing = false;
      element.dataset.particleFirstFrame = "false";
    };
    function recover() {
      if (disposed || !worker) return;
      resumePointer = interaction === "hover" ? { x: pointerX, y: pointerY } : undefined;
      workerFailed = true; disposeEngine(); dirty = true;
      element!.dataset.particleRecovery = "main-thread";
      if (allowed()) void initialize();
    }
    function tick(time: number) {
      frameId = 0;
      if (!allowed() || !engine) return;
      try {
        const done = engine.step(last ? time - last : 16.667); last = time;
        if (done) settled(engine.snapshot());
        else { if (engine.metrics.frames % 6 === 0) metrics(engine.snapshot()); frameId = requestAnimationFrame(tick); }
      } catch { disposeEngine(); phase("failed"); setAvailable(false); }
    }
    const start = (nextPhase: string) => {
      if (!allowed() || !ready) return;
      representation(true); phase(nextPhase); ambient(true);
      element.dataset.particleInteraction = interaction; element.dataset.particleSimulation = "running";
      if (worker) armWatchdog();
      if (engine && !frameId) { last = 0; frameId = requestAnimationFrame(tick); }
    };
    const sendPointer = () => {
      if (!ready) return;
      sequence++; post({ type: "pointer", x: pointerX * width, y: pointerY * height, sequence });
      engine?.pointer(pointerX * width, pointerY * height);
      start(interaction === "none" ? "reassembling" : "dispersing");
    };
    const prepared = (values: ParticleMetrics, forming: boolean) => {
      clearTimeout(watchdog); ready = true; initializing = false; metrics(values); setAvailable(true);
      element.dataset.particleFirstFrame = "true"; element.dataset.particleSampled = "true";
      if (!allowed()) { pause(); return; }
      phase(forming ? "prepared" : "assembled");
      formationActive = forming;
      if (!forming) {
        settled(values);
        if (resumePointer && stage!.matches(":hover") && fine.matches) {
          interaction = "hover"; pointerX = resumePointer.x; pointerY = resumePointer.y; sendPointer();
        }
        resumePointer = undefined; return;
      }
      revealId = requestAnimationFrame(() => {
        revealId = 0;
        if (!allowed() || !ready) return;
        initial.current.begun = true; initial.current.count++;
        element.dataset.particleFormationCount = String(initial.current.count);
        element.dataset.particleFormationBegun = "true";
        representation(true); phase("forming"); ambient(true);
        revealId = requestAnimationFrame(() => {
          revealId = 0; sequence++; post({ type: "play", sequence }); start("forming");
        });
      });
    };
    async function initialize() {
      if (initializing || !allowed()) return;
      if (ready && !dirty) { representation(false); phase("assembled"); element!.dataset.particleSimulation = "settled"; return; }
      initializing = true;
      try { await image!.decode(); } catch { if (!disposed && image!.complete && !image!.naturalWidth) setFailed(true); initializing = false; return; }
      if (!allowed()) { initializing = false; return; }
      element!.dataset.particleDecoded = "true";
      const bounds = stage!.getBoundingClientRect();
      if (!bounds.width || !bounds.height) { initializing = false; return; }
      disposeEngine(); initializing = true; dirty = false; phase("loading");
      const run = generation;
      const low = navigator.hardwareConcurrency <= 4 || !fine.matches;
      const scale = Math.min(Math.max(1, Math.min(2, window.devicePixelRatio)), (low ? 300 : 480) / bounds.width, (low ? 450 : 700) / bounds.height);
      width = Math.max(1, Math.round(bounds.width * scale)); height = Math.max(1, Math.round(bounds.height * scale)); gap = low ? 3 : 2;
      const sample = document.createElement("canvas"); sample.width = width; sample.height = height;
      const context = sample.getContext("2d", { willReadFrequently: true });
      if (!context) { initializing = false; phase("failed"); return; }
      const fit = Math.min(width * 0.78 / image!.naturalWidth, height * 0.88 / image!.naturalHeight);
      portraitWidth = image!.naturalWidth * fit;
      const portraitHeight = image!.naturalHeight * fit;
      let source: ParticleSource;
      try {
        context.drawImage(image!, (width - portraitWidth) / 2, height * 0.06, portraitWidth, portraitHeight);
        const token = getComputedStyle(element!).getPropertyValue("--duration-entrance").trim();
        const formationDuration = parseFloat(token) * (token.endsWith("ms") || !token.endsWith("s") ? 1 : 1000);
        source = { width, height, pixels: context.getImageData(0, 0, width, height).data, gap, portraitWidth, footprint: 3, formationDuration: formationDuration || 600 };
      } catch { initializing = false; phase("failed"); return; }
      canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
      canvas.className = "particle-canvas"; canvas.setAttribute("aria-hidden", "true"); stage!.appendChild(canvas);
      const forming = !initial.current.begun && !initial.current.complete;
      if (!low && !workerFailed && "transferControlToOffscreen" in canvas && typeof Worker !== "undefined") {
        try {
          worker = new Worker(new URL("../../lib/particle-worker.ts", import.meta.url), { type: "module" });
          worker.onerror = () => { if (run === generation) recover(); };
          worker.onmessage = (event: MessageEvent<ParticleReply>) => {
            if (run !== generation || disposed || event.data.generation !== run) return;
            const { type, metrics: values, sequence: replySequence } = event.data;
            if (type === "failed") { recover(); return; }
            if (!values) return;
            if (type === "paused") { if (replySequence === sequence) metrics(values); return; }
            if (type === "ready") prepared(values, forming);
            else if (replySequence === sequence && allowed()) {
              if (type === "settled") settled(values);
              else { metrics(values); armWatchdog(); }
            }
          };
          armWatchdog(); const offscreen = canvas.transferControlToOffscreen();
          worker.postMessage({ type: "init", canvas: offscreen, source, forming, generation: run } satisfies ParticleMessage, [offscreen, source.pixels.buffer]);
          element!.dataset.particleMode = "worker"; return;
        } catch { workerFailed = true; disposeEngine(); dirty = true; return initialize(); }
      }
      const { ParticleEngine } = await import("@/lib/particle-engine");
      if (disposed || run !== generation || !canvas) return;
      try {
        const target = canvas.getContext("2d");
        if (!target) throw new Error("Portrait canvas unavailable");
        engine = new ParticleEngine(target, source);
        if (forming) engine.form();
        engine.draw(); element!.dataset.particleMode = "main"; prepared(engine.metrics, forming);
      } catch { disposeEngine(); phase("failed"); setAvailable(false); }
    }
    replay.current = () => {
      if (!allowed() || !ready) return;
      clearTimeout(releaseTimer); interaction = "replay"; pointerId = undefined; pointerX = -1000; pointerY = -1000;
      initial.current.count++; element.dataset.particleFormationCount = String(initial.current.count);
      formationActive = true;
      sequence++; post({ type: "form", sequence });
      if (engine) { engine.form(); engine.draw(); metrics(engine.snapshot()); }
      start("forming");
    };
    const pointer = (event: PointerEvent) => {
      if (!allowed() || !ready || formationActive || !initial.current.complete || (event.pointerType !== "mouse" && event.pointerId !== pointerId)) return;
      if (event.pointerType === "mouse") { if (!fine.matches) return; interaction = "hover"; }
      if (event.pointerType !== "mouse" && Math.abs(event.clientY - touchY) > 12 && Math.abs(event.clientY - touchY) > Math.abs(event.clientX - touchX) * 1.2) { leave(); return; }
      const rect = stage!.getBoundingClientRect(); pointerX = (event.clientX - rect.left) / rect.width; pointerY = (event.clientY - rect.top) / rect.height;
      sendPointer();
    };
    function leave() {
      clearTimeout(releaseTimer);
      interaction = "none"; pointerId = undefined; pointerX = -1000; pointerY = -1000;
      if (allowed() && ready && initial.current.complete) sendPointer(); else if (!allowed()) pause();
    }
    const enter = (event: PointerEvent) => { if (event.pointerType === "mouse") pointer(event); };
    const exit = (event: PointerEvent) => { if (event.pointerType === "mouse" && interaction === "hover" || event.pointerId === pointerId) leave(); };
    const down = (event: PointerEvent) => {
      if (!allowed() || !ready || formationActive || !initial.current.complete || event.pointerType === "mouse" || !event.isPrimary || pointerId !== undefined) return;
      clearTimeout(releaseTimer); interaction = "touch"; pointerId = event.pointerId;
      touchStarted = performance.now(); touchX = event.clientX; touchY = event.clientY; pointer(event);
    };
    const up = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = undefined; releaseTimer = setTimeout(leave, Math.max(0, 220 - (performance.now() - touchStarted)));
    };
    const cancel = (event: PointerEvent) => { if (event.pointerId === pointerId) leave(); };
    const preference = () => { disposeEngine(); dirty = true; phase("fallback"); setAvailable(false); if (allowed()) void initialize(); };
    const visibility = () => { if (document.hidden) { if (!ready) { disposeEngine(); dirty = true; } else pause(); } else if (allowed()) void initialize(); };
    const load = () => { dirty = true; if (allowed()) void initialize(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting; element.dataset.particleVisible = String(visible);
      if (!visible) pause(); else if (allowed()) void initialize();
    }); observer.observe(element);
    let priorWidth = 0, priorHeight = 0;
    const resize = new ResizeObserver(([entry]) => {
      const { width: nextWidth, height: nextHeight } = entry.contentRect;
      if (Math.abs(nextWidth - priorWidth) < 2 && Math.abs(nextHeight - priorHeight) < 2) return;
      priorWidth = nextWidth; priorHeight = nextHeight; dirty = true;
      if (allowed()) void initialize();
    }); resize.observe(stage);
    stage.addEventListener("pointerenter", enter); stage.addEventListener("pointermove", pointer, { passive: true }); stage.addEventListener("pointerleave", exit);
    stage.addEventListener("pointerdown", down, { passive: true }); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", cancel);
    image.addEventListener("load", load); eligible.addEventListener("change", preference); document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true; disposeEngine(); observer.disconnect(); resize.disconnect();
      stage.removeEventListener("pointerenter", enter); stage.removeEventListener("pointermove", pointer); stage.removeEventListener("pointerleave", exit);
      stage.removeEventListener("pointerdown", down); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", cancel);
      image.removeEventListener("load", load); eligible.removeEventListener("change", preference); document.removeEventListener("visibilitychange", visibility); replay.current = () => {};
    };
  }, [failed]);

  return <div ref={root} className="image-atomizer cosmos-atomizer" data-particle-state="resting" data-particle-interaction="none" data-particle-phase="fallback" data-particle-simulation="paused" data-particle-representation="image">
    {failed ? <CharacterFallback /> : <div className="character-animation" data-character-scene="hero"><div className="character-frame"><CharacterPortrait frame={frame} eager onError={() => setFailed(true)} /></div></div>}
    <span id={instructions} className="visually-hidden">Move over the portrait, or touch and drag sideways, to move its image particles. Vertical swipes scroll the page. Use Reassemble portrait to replay the formation with your keyboard.</span>
    {available && !failed && <button className="portrait-replay" aria-describedby={instructions} onClick={() => replay.current()} type="button"><RotateCcw size={15} aria-hidden="true" /> Reassemble portrait</button>}
  </div>;
}
