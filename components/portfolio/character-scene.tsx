import { ArrowDownRight } from "lucide-react";
import { characterAssets } from "@/lib/character-assets";
import { ImageAtomizer } from "./image-atomizer";
import { CharacterFallback } from "./character-fallback";
import { PointerScene } from "./pointer-scene";
import "./hero-cosmos.module.css";

export function CharacterScene() {
  return <figure className="character-scene cosmos-scene">
    <PointerScene background={<div className="cosmos-construction" aria-hidden="true">
      <svg className="hero-orbit" viewBox="0 0 600 720" fill="none" preserveAspectRatio="xMidYMid meet"><path d="M112 535C-2 388 96 192 275 178C438 165 581 293 565 456" /><path d="M58 498C-21 310 157 104 353 131C522 154 614 324 546 512" /><path className="cosmos-datum" d="M52 631H550M509 617V645" /></svg>
    </div>} foreground={characterAssets ? <ImageAtomizer frame={characterAssets.idle} /> : <CharacterFallback />}>
    </PointerScene>
    <figcaption className="cosmos-caption" data-entrance="2"><p><span className="cosmos-static-hint">Ideas take shape.</span><span className="cosmos-mouse-hint">Move your pointer. See ideas take shape.</span><span className="cosmos-touch-hint">Tap or slide sideways. Swipe up to explore.</span></p><a href="#workspace">Step inside <ArrowDownRight size={18} aria-hidden="true" /></a></figcaption>
  </figure>;
}
