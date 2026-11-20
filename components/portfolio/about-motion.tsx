"use client";

import { useAnimate } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { clearRevealStyles, readMotionTokens, watchMotionInterruption } from "@/lib/motion-system";

export function AboutMotion({ children }: { children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [imageUnavailable, setImageUnavailable] = useState(false);

  useEffect(() => {
    const element = scope.current;
    const image = element.querySelector<HTMLImageElement>("[data-about-image] img");
    const targets = Array.from(element.querySelectorAll<HTMLElement>("[data-about-image], [data-about-copy]"));
    const capability = matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const controls: { cancel(): void }[] = [];
    const settle = () => {
      controls.forEach(control => control.cancel());
      targets.forEach(clearRevealStyles);
    };
    const unavailable = () => setImageUnavailable(true);
    image?.addEventListener("error", unavailable);
    if (image?.complete && !image.naturalWidth) unavailable();
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (!capability.matches || navigator.maxTouchPoints > 0 || document.hidden) return;
      const tokens = readMotionTokens();
      targets.forEach((target, index) => {
        const horizontal = target.hasAttribute("data-about-image") ? -24 : 24;
        const control = animate(target, { transform: [`translateX(${horizontal}px)`, "translateX(0px)"], opacity: [0.92, 1] }, { duration: tokens.entrance, delay: index * tokens.stagger, ease: tokens.ease });
        controls.push(control);
        control.then(() => clearRevealStyles(target));
      });
    }, { threshold: 0.18 });
    observer.observe(element);
    capability.addEventListener("change", settle);
    const unsubscribe = watchMotionInterruption(settle);
    return () => {
      observer.disconnect();
      capability.removeEventListener("change", settle);
      image?.removeEventListener("error", unavailable);
      unsubscribe();
      settle();
    };
  }, [animate, scope]);

  return <div ref={scope} data-about-image-failed={imageUnavailable || undefined}>{children}</div>;
}
