"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAnimate } from "motion/react";
import { characterAssetErrors, characterFrames, type CharacterAssets, type CharacterState, resolveCharacterFrame } from "@/lib/character-assets";
import { clearRevealStyles, readMotionTokens, revealFrames, watchMotionInterruption } from "@/lib/motion-system";
import { CharacterPortrait } from "./character-portrait";
import { CharacterFallback } from "./character-fallback";

const labels: Record<Exclude<CharacterState, "idle">, string> = {
  blink: "Blink", head: "Look around", greeting: "Say hello", working: "At work", expression: "Another expression",
};

export function CharacterAnimation({ assets, scene = "hero" }: { assets: CharacterAssets; scene?: "hero" | "workspace" }) {
  const [pose, setPose] = useState<{ state: CharacterState; index: number }>({ state: "idle", index: 0 });
  const [failed, setFailed] = useState(false);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stop = useRef<() => void>(() => {});
  const visible = useRef(true);
  const states = Object.keys(assets.states ?? {}) as Exclude<CharacterState, "idle">[];

  const clear = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; }, []);
  const choose = useCallback((state: CharacterState) => {
    clear();
    const supported = state === "idle" || assets.states?.[state] ? state : "idle";
    setPose({ state: supported, index: 0 });
    const sequence = supported === "idle" ? undefined : assets.states?.[supported];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden || !visible.current || !sequence || !("frames" in sequence)) return;
    sequence.frames.slice(1).forEach((_, index) => timers.current.push(setTimeout(() => setPose({ state: supported, index: index + 1 }), sequence.frameDurationMs * (index + 1))));
    if (sequence.returnToIdle !== false) timers.current.push(setTimeout(() => setPose({ state: "idle", index: 0 }), sequence.frames.length * sequence.frameDurationMs));
  }, [assets, clear]);

  useEffect(() => {
    const element = scope.current;
    const settle = () => { clear(); stop.current(); if (element) clearRevealStyles(element); setPose({ state: "idle", index: 0 }); };
    const receive = (event: Event) => {
      const detail = (event as CustomEvent<{ state: CharacterState; scene?: string }>).detail;
      if (!detail || (detail.scene && detail.scene !== scene) || document.hidden || !visible.current) return;
      choose(detail.state);
    };
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; if (!entry.isIntersecting) settle(); });
    if (element) observer.observe(element);
    const unsubscribe = watchMotionInterruption(settle);
    document.addEventListener("atelier:character", receive);
    return () => { clear(); stop.current(); observer.disconnect(); unsubscribe(); document.removeEventListener("atelier:character", receive); };
  }, [choose, clear, scene, scope]);

  const frame = resolveCharacterFrame(assets, pose.state, pose.index);
  if (failed || characterAssetErrors(assets).length) return <CharacterFallback />;
  return <div className="character-animation" data-character-state={pose.state} data-character-scene={scene}>
    <div ref={scope} className="character-frame">
      <CharacterPortrait frame={frame} eager={scene === "hero"} onError={() => { clear(); setFailed(true); }} onLoad={() => {
        stop.current();
        if (characterFrames(assets, pose.state).length > 1 || !scope.current || document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const tokens = readMotionTokens();
        const control = animate(scope.current, revealFrames.reduced, { duration: tokens.reduced, ease: tokens.ease });
        stop.current = () => control.cancel();
        control.then(() => { if (scope.current) clearRevealStyles(scope.current); });
      }} />
    </div>
    {states.length > 0 && <div className="character-state-controls" role="group" aria-label="Character poses">
      <button type="button" aria-pressed={pose.state === "idle"} onClick={() => choose("idle")}>Rest</button>
      {states.map(next => <button key={next} type="button" aria-pressed={pose.state === next} onClick={() => choose(next)}>{labels[next]}</button>)}
    </div>}
  </div>;
}
