import { Monogram } from "./monogram";

export function CharacterFallback() {
  return <div className="character-fallback" role="img" aria-label="An architectural Copper Atelier monogram study, awaiting Anees’s illustrated character.">
    <svg viewBox="0 0 360 390" fill="none" aria-hidden="true">
      <path className="character-arch-outline" d="M56 370V156a124 124 0 0 1 248 0v214" />
      <path className="character-arch" d="M75 370V163a105 105 0 0 1 210 0v207h-46V163a59 59 0 0 0-118 0v207z" />
      <path className="character-arch-rule" d="M63 370V160a117 117 0 0 1 234 0v210" />
      <path className="character-plinth" d="M36 367h288v15H36z" />
    </svg>
    <div className="character-monogram" aria-hidden="true"><Monogram /><span>Muhammad<br />Anees</span></div>
  </div>;
}
