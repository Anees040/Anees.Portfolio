"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef } from "react";
import type { CharacterFrame } from "@/lib/character-assets";

export function CharacterPortrait({ frame, eager = false, onError, onLoad }: { frame: CharacterFrame; eager?: boolean; onError?: () => void; onLoad?: () => void }) {
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (image.current?.complete && image.current.naturalWidth === 0) onError?.();
  }, [frame.src, frame.revision, onError]);
  const common = { alt: frame.alt, sizes: eager ? "(max-width: 767px) 70vw, (max-width: 1023px) 36vw, 400px" : "240px", loading: eager ? "eager" as const : "lazy" as const, fetchPriority: eager ? "high" as const : "auto" as const };
  const source = (src: string) => frame.revision ? `${src}?v=${encodeURIComponent(frame.revision)}` : src;
  const { props } = getImageProps({ ...common, src: source(frame.src), width: frame.width, height: frame.height });
  const mobile = frame.mobile ? getImageProps({ ...common, ...frame.mobile, src: source(frame.mobile.src) }).props : null;
  return <picture className="character-picture">
    {mobile && <source media="(max-width: 767px)" srcSet={mobile.srcSet} sizes={mobile.sizes} width={mobile.width} height={mobile.height} />}
    {/* getImageProps supplies Next's optimized responsive sources. */}
    <img {...props} ref={image} className="character-portrait" onError={onError} onLoad={onLoad} alt={frame.alt} />
  </picture>;
}
