"use client";

import { animate, motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { readMotionTokens } from "@/lib/motion-system";

export function PointerScene({ background, foreground, children }: {
  background: ReactNode;
  foreground: ReactNode;
  children?: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scrollOffset = useMotionValue(0);
  const backX = useTransform(x, [-1, 1], [5, -5]);
  const backY = useTransform(() => y.get() * -4 + scrollOffset.get() * 56);
  const frontX = useTransform(x, [-1, 1], [-7, 7]);
  const frontY = useTransform(() => y.get() * 4 - scrollOffset.get() * 32);
  const frontScale = useTransform(scrollOffset, [0, 1], [1, 0.95]);
  const frontOpacity = useTransform(scrollOffset, [0, 1], [1, 0.7]);
  const { scrollY } = useScroll();

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const hero = element.closest<HTMLElement>("#home");
    const field = hero?.querySelector<HTMLElement>(".cosmos-field");
    const eligible = window.matchMedia("(prefers-reduced-motion: no-preference) and (forced-colors: none) and (hover: hover) and (pointer: fine) and (min-width: 64rem)");
    const tokens = readMotionTokens();
    let bounds: DOMRect | undefined;
    let visible = true;
    let heroStart = 0, heroHeight = 1;
    const allowed = () => eligible.matches && navigator.maxTouchPoints === 0 && visible && !document.hidden;
    const reset = () => {
      x.jump(0); y.jump(0); scrollOffset.jump(0); bounds = undefined;
      field?.style.removeProperty("transform"); field?.style.removeProperty("opacity");
      if (hero) delete hero.dataset.heroProgress;
    };
    const syncScroll = () => {
      bounds = undefined;
      if (!allowed()) return;
      const progress = Math.min(1, Math.max(0, (scrollY.get() - heroStart) / heroHeight));
      scrollOffset.set(progress);
      if (field) { field.style.transform = `translate3d(0,${-72 * progress}px,0) scale(${1 - progress * 0.06})`; field.style.opacity = String(1 - progress * 0.85); }
      if (hero) hero.dataset.heroProgress = progress.toFixed(4);
    };
    const measure = () => {
      reset();
      if (hero) { heroStart = hero.getBoundingClientRect().top + scrollY.get() - (document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0); heroHeight = hero.offsetHeight; }
      syncScroll();
    };
    const enter = () => { if (allowed()) bounds = element.getBoundingClientRect(); };
    const move = (event: PointerEvent) => {
      if (!allowed() || event.pointerType !== "mouse") return;
      bounds ??= element.getBoundingClientRect();
      animate(x, Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)), tokens.spring);
      animate(y, Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)), tokens.spring);
    };
    const leave = () => {
      if (!allowed()) return reset();
      animate(x, 0, tokens.spring);
      animate(y, 0, tokens.spring);
      bounds = undefined;
    };
    const unsubscribe = scrollY.on("change", syncScroll);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) reset(); else measure(); });
    observer.observe(hero ?? element);
    const resize = new ResizeObserver(measure); resize.observe(hero ?? element);
    const visibility = () => { if (document.hidden) reset(); else measure(); };
    eligible.addEventListener("change", measure);
    document.addEventListener("visibilitychange", visibility);
    element.addEventListener("pointerenter", enter);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => {
      unsubscribe(); observer.disconnect(); resize.disconnect(); reset();
      eligible.removeEventListener("change", measure);
      document.removeEventListener("visibilitychange", visibility);
      element.removeEventListener("pointerenter", enter);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    };
  }, [scrollOffset, scrollY, x, y]);

  return <div ref={root} className="pointer-scene">
    <motion.div className="scene-depth-background" style={{ x: backX, y: backY }}>{background}</motion.div>
    <motion.div className="scene-depth-foreground" style={{ x: frontX, y: frontY, scale: frontScale, opacity: frontOpacity }}>{foreground}</motion.div>
    {children}
  </div>;
}
