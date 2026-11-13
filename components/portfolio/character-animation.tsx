"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { type CharacterAssets, type CharacterState, resolveCharacterFrame } from "@/lib/character-assets";
import { CharacterPortrait } from "./character-portrait";

const labels: Record<Exclude<CharacterState, "idle">, string> = {
  blink: "Blink", head: "Look around", greeting: "Say hello", working: "At work", expression: "A little smile",
};

export function CharacterAnimation({ assets }: { assets: CharacterAssets }) {
  const [state, setState] = useState<CharacterState>("idle");
  const reduced = useReducedMotion();
  const frame = resolveCharacterFrame(assets, state);
  const states = Object.keys(assets.states ?? {}) as Exclude<CharacterState, "idle">[];
  return <div className="character-animation" data-character-state={state} data-reduced-motion={reduced || undefined}>
    <CharacterPortrait frame={frame} />
    {states.length > 0 && <div className="character-state-controls" role="group" aria-label="Character poses">
      <button type="button" aria-pressed={state === "idle"} onClick={() => setState("idle")}>Rest</button>
      {states.map(next => <button key={next} type="button" aria-pressed={state === next} onClick={() => setState(next)}>{labels[next]}</button>)}
    </div>}
  </div>;
}
