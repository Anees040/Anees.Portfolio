"use client";

import { useAnimate } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { clearRevealStyles, readMotionTokens, revealFrames, watchMotionInterruption } from "@/lib/motion-system";

export function ScrollProgress() {
  return <div className="scroll-progress" data-scroll-progress aria-hidden="true" />;
}

export function ScrollExperience({ children }: { children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();

  const revealed = useRef(new WeakSet<Element>());

  useEffect(() => {
    const nodes = scope.current.querySelectorAll<HTMLElement>("[data-reveal]");
    const tokens = readMotionTokens();

    const stops: (() => void)[] = [];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || revealed.current.has(entry.target) || entry.target.closest("[data-scroll-scene]")) continue;
        revealed.current.add(entry.target);
        observer.unobserve(entry.target);
        const element = entry.target as HTMLElement;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const frames = reduced ? revealFrames.reduced : element.dataset.reveal === "media" ? revealFrames.media : revealFrames.section;
        const group = element.hasAttribute("data-reveal-group") ? Array.from(element.children) as HTMLElement[] : [element];
        const controls = group.map((child, index) => {
          const control = animate(child, frames, { duration: reduced ? tokens.reduced : tokens.entrance, delay: reduced ? 0 : Math.min(index, 3) * tokens.stagger, ease: tokens.ease });
          control.then(() => clearRevealStyles(child));
          return control;
        });
        const control = { stop: () => { controls.forEach(item => item.cancel()); group.forEach(clearRevealStyles); } };
        stops.push(() => control.stop());
      }
    }, { threshold: 0.12 });
    nodes.forEach(node => observer.observe(node));
    const settle = () => { stops.forEach(stop => stop()); nodes.forEach(clearRevealStyles); };
    const unsubscribe = watchMotionInterruption(settle);
    return () => { observer.disconnect(); unsubscribe(); settle(); };
  }, [animate, scope]);

  useEffect(() => {
    const followAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const target = document.getElementById(anchor.hash.slice(1));
      if (!target) return;
      document.querySelectorAll<HTMLElement>("[popover]:popover-open").forEach(popover => popover.hidePopover());
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", followAnchor);
    return () => document.removeEventListener("click", followAnchor);
  }, []);

  return <div className="scroll-experience" ref={scope}>{children}</div>;
}
