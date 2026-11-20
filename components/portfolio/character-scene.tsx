import { ArrowDownRight } from "lucide-react";
import { profileContent } from "@/lib/profile-content";
import { ImageAtomizer } from "./image-atomizer";
import { CharacterFallback } from "./character-fallback";
import { PointerScene } from "./pointer-scene";
import "./hero-cosmos.module.css";

export function CharacterScene() {
  const photograph = profileContent.photograph;
  return <figure className={`character-scene cosmos-scene${photograph ? " cosmos-photo" : ""}`}>
    <PointerScene background={<div className="cosmos-construction" aria-hidden="true">
      <svg className="hero-orbit" viewBox="0 0 600 560" fill="none" preserveAspectRatio="xMidYMid meet"><ellipse cx="300" cy="260" rx="275" ry="226" transform="rotate(-14 300 260)" /><path d="M58 380C-8 190 128 12 329 22C503 31 598 184 550 352" /><path className="cosmos-datum" d="M52 510H550M509 496V524" /></svg>
    </div>} foreground={photograph ? <ImageAtomizer frame={{ ...photograph, unoptimized: true }} /> : <CharacterFallback />}>
    </PointerScene>
    <figcaption className="cosmos-caption" data-entrance="2"><p><span className="cosmos-static-hint">Ideas take shape.</span><span className="cosmos-mouse-hint">Move your pointer. See ideas take shape.</span><span className="cosmos-touch-hint">Tap or slide sideways. Swipe up to explore.</span></p><a href="#workspace">Step inside <ArrowDownRight size={18} aria-hidden="true" /></a></figcaption>
  </figure>;
}
