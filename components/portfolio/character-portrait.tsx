import Image from "next/image";
import type { CharacterFrame } from "@/lib/character-assets";

export function CharacterPortrait({ frame }: { frame: CharacterFrame }) {
  return <Image className="character-portrait" src={frame.src} alt={frame.alt} width={frame.width} height={frame.height} sizes="(max-width: 767px) 80vw, (max-width: 1023px) 36vw, 400px" loading="eager" />;
}
