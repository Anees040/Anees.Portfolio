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
  const backY = useTransform(() => y.get() * -4 + scrollOffset.get());
  const frontX = useTransform(x, [-1, 1], [-7, 7]);
  const frontY = useTransform(y, [-1, 1], [-4, 4]);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const eligible = window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine) and (min-width: 64rem)");
    const tokens = readMotionTokens();
    let bounds: DOMRect | undefined;
    let visible = true;
    const allowed = () => eligible.matches && visible && !document.hidden;
    const reset = () => { x.jump(0); y.jump(0); scrollOffset.jump(0); bounds = undefined; };
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
    const unsubscribe = scrollYProgress.on("change", progress => {
      bounds = undefined;
      scrollOffset.set(allowed() ? Math.min(1, Math.max(0, progress)) * 16 : 0);
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) reset(); });
    observer.observe(element);
    eligible.addEventListener("change", reset);
    document.addEventListener("visibilitychange", reset);
    window.addEventListener("resize", reset);
    element.addEventListener("pointerenter", enter);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => {
      unsubscribe(); observer.disconnect(); reset();
      eligible.removeEventListener("change", reset);
      document.removeEventListener("visibilitychange", reset);
      window.removeEventListener("resize", reset);
      element.removeEventListener("pointerenter", enter);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    };
  }, [scrollOffset, scrollYProgress, x, y]);

  return <div ref={root} className="pointer-scene">
    <motion.div className="scene-depth-background" style={{ x: backX, y: backY }}>{background}</motion.div>
    <motion.div className="scene-depth-foreground" style={{ x: frontX, y: frontY }}>{foreground}</motion.div>
    {children}
  </div>;
}
