"use client";

import { MotionConfig, useAnimate } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { clearRevealStyles, readMotionTokens, revealFrames, watchMotionInterruption } from "@/lib/motion-system";

export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => watchMotionInterruption(() => {
    document.querySelectorAll(".hero-orbit, .site-header").forEach(element => {
      element.getAnimations().forEach(animation => animation.finish());
    });
  }), []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function HeroEntrance({ children }: { children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  useEffect(() => {
    const tokens = readMotionTokens();
    const elements = scope.current.querySelectorAll<HTMLElement>("[data-entrance]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controls = Array.from(elements, (element, index) => animate(element, reduced ? revealFrames.reduced : element.classList.contains("hero-artwork") ? revealFrames.media : revealFrames.text, {
      duration: reduced ? tokens.reduced : tokens.entrance,
      delay: reduced ? 0 : Number(element.dataset.entrance || index) * tokens.stagger,
      ease: tokens.ease,
    }));
    controls.forEach((control, index) => { control.then(() => clearRevealStyles(elements[index])); });
    const settle = () => {
      controls.forEach(control => control.cancel());
      elements.forEach(clearRevealStyles);
    };
    const unsubscribe = watchMotionInterruption(settle);
    return () => { unsubscribe(); settle(); };
  }, [animate, scope]);
  return <div ref={scope} className="hero-grid">{children}</div>;
}

export function MediaReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  useEffect(() => {
    const element = scope.current;
    if (!element) return;
    let stopAnimation: (() => void) | undefined;
    const settle = () => { stopAnimation?.(); clearRevealStyles(element); };
    const unsubscribe = watchMotionInterruption(settle);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const tokens = readMotionTokens();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const controls = animate(element, reduced ? revealFrames.reduced : revealFrames.media, { duration: reduced ? tokens.reduced : tokens.entrance, ease: tokens.ease });
      stopAnimation = () => controls.cancel();
      controls.then(() => clearRevealStyles(element));
    }, { threshold: 0.15 });
    observer.observe(element);
    return () => { observer.disconnect(); unsubscribe(); settle(); };
  }, [animate, scope]);
  return <div ref={scope} className="media-reveal"><div className={className}>{children}</div></div>;
}
