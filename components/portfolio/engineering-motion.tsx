"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useRef, type ReactNode } from "react";
import { readMotionTokens, watchMotionInterruption } from "@/lib/motion-system";

export function EngineeringMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP((_context, contextSafe) => {
    if (!scope.current || !contextSafe) return;
    const element = scope.current;
    gsap.registerPlugin(CustomEase);
    const workbook = element.querySelector<HTMLElement>(".engineering-workbook")!;
    let animation: gsap.core.Timeline | undefined;
    let targets: Element[] = [];
    let keyboard = false;
    const measure = () => {
      const answer = element.querySelector<HTMLElement>(".engineering-area[open] .engineering-answer");
      workbook.style.setProperty("--engineering-answer-height", `${answer && getComputedStyle(answer).position === "absolute" ? answer.scrollHeight : 0}px`);
    };
    const settle = contextSafe(() => {
      animation?.kill(); animation = undefined;
      if (targets.length) gsap.set(targets, { clearProps: "transform,opacity,strokeDashoffset" });
      targets = [];
    });
    const draw = contextSafe((event: Event) => {
      if (!(event.target instanceof HTMLDetailsElement) || !event.target.hasAttribute("data-engineering-topic")) return;
      settle();
      measure();
      if (!event.target.open || keyboard || document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const paths = Array.from(event.target.querySelectorAll<SVGPathElement>("[data-engineering-wire]"));
      const nodes = Array.from(event.target.querySelectorAll<HTMLElement>("[data-engineering-node]"));
      targets = [...paths, ...nodes];
      const tokens = readMotionTokens();
      animation = gsap.timeline({ defaults: { ease: CustomEase.create("", tokens.ease.join(",")) }, onComplete: settle });
      animation.fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: tokens.entrance, stagger: tokens.stagger }, 0);
      animation.fromTo(nodes, { y: 12, opacity: .65 }, { y: 0, opacity: 1, duration: tokens.interface, stagger: tokens.stagger }, 0);
    });
    const pointer = () => { keyboard = false; };
    const key = () => { keyboard = true; };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) settle(); });
    const size = new ResizeObserver(measure);
    element.querySelectorAll(".engineering-answer").forEach(answer => size.observe(answer));
    measure();
    observer.observe(element);
    const unsubscribe = watchMotionInterruption(settle);
    element.addEventListener("toggle", draw, true);
    element.addEventListener("pointerdown", pointer);
    element.addEventListener("keydown", key);
    return () => { settle(); observer.disconnect(); size.disconnect(); workbook.style.removeProperty("--engineering-answer-height"); unsubscribe(); element.removeEventListener("toggle", draw, true); element.removeEventListener("pointerdown", pointer); element.removeEventListener("keydown", key); };
  }, { scope, dependencies: [], revertOnUpdate: true });
  return <div ref={scope}>{children}</div>;
}
