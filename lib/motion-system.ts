export function readMotionTokens() {
  const style = getComputedStyle(document.documentElement);
  const seconds = (name: string) => parseFloat(style.getPropertyValue(name)) / 1000;
  return {
    ease: style.getPropertyValue("--ease-out").match(/[\d.]+/g)!.map(Number) as [number, number, number, number],
    entrance: seconds("--duration-entrance"),
    stagger: seconds("--duration-stagger"),
    interface: seconds("--duration-interface"),
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
  media: { opacity: [0.55, 1], transform: ["translateY(12px) scale(0.985)", "translateY(0px) scale(1)"] },
  reduced: { opacity: [0.7, 1] },
};

export function clearRevealStyles(element: HTMLElement) {
  element.style.removeProperty("transform");
  element.style.removeProperty("opacity");
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
