import { frame } from "motion";

// CSS time tokens accept s or ms. Legacy unitless tokens mean milliseconds.
export function parseCssTime(value: string): number {
  const match = value.trim().match(/^(\d*\.?\d+)\s*(ms|s)?$/i);
  if (!match) throw new Error(`Invalid CSS time: ${value}`);
  return Number(match[1]) / (match[2]?.toLowerCase() === "s" ? 1 : 1000);
}

export function readMotionTokens() {
  const style = getComputedStyle(document.documentElement);
  const seconds = (name: string) => parseCssTime(style.getPropertyValue(name));
  return {
    ease: style.getPropertyValue("--ease-out").match(/[\d.]+/g)!.map(Number) as [number, number, number, number],
    entrance: seconds("--duration-entrance"),
    stagger: seconds("--duration-stagger"),
    interface: seconds("--duration-interface"),
    feedback: seconds("--duration-feedback"),
    release: seconds("--duration-release"),
    reduced: seconds("--duration-reduced"),
    spring: {
      type: "spring" as const,
      stiffness: Number(style.getPropertyValue("--spring-stiffness")),
      damping: Number(style.getPropertyValue("--spring-damping")),
      mass: Number(style.getPropertyValue("--spring-mass")),
    },
  };
}

export const revealFrames = {
  text: { opacity: [0.35, 1], transform: ["translateY(14px)", "translateY(0px)"] },
  section: { opacity: [0.65, 1], transform: ["translateY(16px)", "translateY(0px)"] },
  media: { opacity: [0.55, 1], clipPath: ["inset(0 0 8% 0)", "inset(0 0 0% 0)"], transform: ["translateY(12px) scale(0.985)", "translateY(0px) scale(1)"] },
  reduced: { opacity: [0.7, 1] },
};

export function clearRevealStyles(element: HTMLElement) {
  const clear = () => {
    element.style.removeProperty("transform");
    element.style.removeProperty("opacity");
    element.style.removeProperty("clip-path");
  };
  clear();
  // Hybrid animations can queue a MotionValue render after their native finish.
  frame.postRender(clear);
}

export function watchMotionInterruption(settle: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onVisibility = () => { if (document.hidden) settle(); };
  preference.addEventListener("change", settle);
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    preference.removeEventListener("change", settle);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
