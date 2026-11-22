"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import styles from "./section-travel.module.css";

export function SectionLettering({ title, embedded = false, thread = false }: { title: string; embedded?: boolean; thread?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const clip = container.current, word = clip?.querySelector<HTMLElement>("span");
    if (!clip || !word) return;
    let previous = "", disposed = false;
    const measure = (force = false) => {
      if (disposed || !clip.clientWidth) return;
      const typography = getComputedStyle(word);
      const key = `${clip.clientWidth}:${getComputedStyle(document.documentElement).fontSize}:${typography.fontFamily}:${typography.fontWeight}:${typography.letterSpacing}`;
      if (!force && key === previous) return;
      previous = key;
      // Measure the preferred typography with the actual loaded font. Padding
      // protects serif overhangs; the clip already follows the content gutters.
      word.style.fontSize = "var(--travel-size, clamp(5rem, 17vw, 18rem))";
      const preferred = parseFloat(getComputedStyle(word).fontSize);
      const safeWidth = clip.clientWidth;
      const size = preferred * Math.min(1, safeWidth / Math.max(1, word.offsetWidth));
      word.style.fontSize = `${size}px`;
      word.style.setProperty("--wordmark-rest", `${Math.max(0, (safeWidth - word.offsetWidth) / 2)}px`);
      word.style.setProperty("--wordmark-distance", `${Math.min(safeWidth * .72, word.offsetWidth * .9)}px`);
    };
    const resize = new ResizeObserver(() => measure());
    resize.observe(clip); resize.observe(word); resize.observe(document.documentElement);
    const fonts = () => measure(true);
    void document.fonts.ready.then(() => { if (!disposed) fonts(); });
    document.fonts.addEventListener("loadingdone", fonts);
    window.visualViewport?.addEventListener("resize", fonts);
    measure();
    return () => {
      disposed = true; resize.disconnect();
      document.fonts.removeEventListener("loadingdone", fonts);
      window.visualViewport?.removeEventListener("resize", fonts);
    };
  }, [title]);
  return <div ref={container} className={`${styles.clip} ${embedded ? styles.embeddedClip : ""} ${thread ? styles.threadClip : ""}`} aria-hidden="true"><span className={`${styles.title} ${embedded ? styles.embeddedTitle : ""}`} style={{ "--wordmark-divisor": Math.max(1, title.length * .62) } as CSSProperties} data-travel-title={!thread ? "" : undefined} data-thread-title={thread ? "" : undefined}>{title}</span></div>;
}
