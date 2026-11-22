"use client";

import { useEffect, useRef } from "react";
import { AMBIENT_BUDGET, HeroAmbientRenderer, ambientStars } from "@/lib/hero-ambient";

const fallback = ambientStars(82);

export function HeroAmbient() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current!, hero = element.closest<HTMLElement>("#home")!;
    const motionControl = hero.querySelector<HTMLInputElement>("[data-ambient-control]");
    const surface = document.createElement("canvas");
    surface.className = "cosmos-ambient-canvas"; surface.setAttribute("aria-hidden", "true");
    element.appendChild(surface);
    const preference = matchMedia("(prefers-reduced-motion: no-preference) and (forced-colors: none)");
    const low = navigator.hardwareConcurrency <= 4 || navigator.maxTouchPoints > 0;
    let visible = false, disposed = false, frame = 0, last = 0, renderer: HeroAmbientRenderer | undefined;
    const allowed = () => visible && !document.hidden && preference.matches && !disposed && navigator.hardwareConcurrency > 2 && motionControl?.checked !== false;
    const report = () => { if (renderer) element.dataset.ambientMetrics = JSON.stringify({ ...renderer.metrics, bufferBytes: surface.width * surface.height * 4, fps: low ? 24 : AMBIENT_BUDGET.fps }); };
    const stop = () => {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      element.dataset.ambientState = "paused"; hero.dataset.cosmosMotion = "paused";
      report();
    };
    const tick = (time: number) => {
      frame = 0;
      if (!allowed() || !renderer) {
        stop();
        if (!preference.matches) delete element.dataset.ambientReady;
        return;
      }
      const interval = 1000 / (low ? 24 : AMBIENT_BUDGET.fps);
      if (!last || time - last >= interval - 1) {
        renderer.draw(last ? (time - last) / 1000 : 0); last = time;
        if (renderer.metrics.frames % 30 === 0) report();
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      if (!allowed() || !renderer) { stop(); return; }
      element.dataset.ambientState = "running"; hero.dataset.cosmosMotion = "active";
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      stop();
      if (!preference.matches || navigator.hardwareConcurrency <= 2) {
        delete element.dataset.ambientReady; surface.width = 0; surface.height = 0; renderer = undefined;
        return;
      }
      const width = hero.clientWidth, height = hero.clientHeight;
      if (!width || !height) return;
      const scale = Math.min(1, (low ? 960 : AMBIENT_BUDGET.width) / width, (low ? 640 : AMBIENT_BUDGET.height) / height);
      surface.width = Math.round(width * scale); surface.height = Math.round(height * scale);
      try {
        const context = surface.getContext("2d");
        if (!context) return;
        context.setTransform(scale, 0, 0, scale, 0, 0);
        const styles = getComputedStyle(element);
        renderer = new HeroAmbientRenderer(context, width, height, ["--color-bg-surface", "--color-detail", "--color-art-solid"].map(token => styles.getPropertyValue(token).trim()), low);
        renderer.draw(0); element.dataset.ambientReady = "true"; report(); sync();
      } catch { renderer = undefined; delete element.dataset.ambientReady; }
    };
    const change = resize;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio >= .08; sync(); }, { threshold: [0, .08] });
    const size = new ResizeObserver(resize);
    observer.observe(hero); size.observe(hero);
    preference.addEventListener("change", change); document.addEventListener("visibilitychange", sync);
    motionControl?.addEventListener("change", sync);
    return () => {
      disposed = true; stop(); observer.disconnect(); size.disconnect();
      preference.removeEventListener("change", change); document.removeEventListener("visibilitychange", sync);
      motionControl?.removeEventListener("change", sync);
      delete element.dataset.ambientReady; renderer = undefined;
      surface.width = 0; surface.height = 0;
      surface.remove();
    };
  }, []);

  return <div ref={root} className="cosmos-field" data-ambient-state="static" aria-hidden="true">
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="cosmos-static-field">
      {fallback.map((star, index) => <circle key={index} cx={star.x * 1600} cy={star.y * 1000} r={star.radius} className={star.color < 3 ? "cosmos-linen-points" : star.color === 3 ? "cosmos-gold-points" : "cosmos-clay-points"} />)}
    </svg>
  </div>;
}
