import { ArrowDownRight } from "lucide-react";
import { characterAssets } from "@/lib/character-assets";
import { ImageAtomizer } from "./image-atomizer";
import { CharacterFallback } from "./character-fallback";
import { PointerScene } from "./pointer-scene";

export function CharacterScene() {
  return <figure className="character-scene">
    <div className="character-scene-top"><span>Ideas take shape.</span><span className="scene-edition">Move your pointer to explore</span></div>
    <PointerScene background={<div className="hero-scene-backdrop" aria-hidden="true">
      <svg className="hero-orbit" viewBox="0 0 180 180" fill="none"><circle cx="90" cy="90" r="72" /><circle className="hero-orbit-disc" cx="90" cy="90" r="51" /><path d="M18 90h144M90 18v144" /><circle className="hero-orbit-point" cx="153" cy="55" r="5" /></svg>
      <span className="hero-scene-rule" /><span className="hero-scene-notation">Form follows thought.</span>
    </div>} foreground={characterAssets ? <ImageAtomizer frame={characterAssets.idle} /> : <CharacterFallback />}>
      <a className="scene-project-slip" href="#sportlynk"><span className="status-dot" aria-hidden="true" /><span>On the workbench<strong>SportLynk</strong></span><ArrowDownRight size={19} aria-hidden="true" /></a>
    </PointerScene>
    <figcaption className="character-scene-caption"><span>A little <em>character.</em></span><a href="#workspace">Step inside <ArrowDownRight size={18} aria-hidden="true" /></a></figcaption>
  </figure>;
}
