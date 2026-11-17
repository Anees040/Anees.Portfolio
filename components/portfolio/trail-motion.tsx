"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useScroll } from "motion/react";
const path = "M80 65 C330 65 350 150 200 195 S30 305 205 335 S375 420 200 470 S45 540 260 575";

export function TrailMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const marker = useRef<SVGCircleElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start center", "end center"] });
  useEffect(() => {
    const element = root.current!, route = line.current!, dot = marker.current!;
    const chapters = Array.from(element.querySelectorAll<HTMLElement>(".trail-chapters > li"));
    const chapterStarts = new Float32Array(chapters.length);
    const length = route.getTotalLength();
    const preference = matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let visible = true;
    let activeChapter = -2;
    const measure = () => {
      const height = Math.max(1, element.clientHeight);
      chapters.forEach((item, index) => { chapterStarts[index] = item.offsetTop / height; });
    };
    const update = () => {
      const enabled = preference.matches && !document.hidden;
      element.dataset.trailMotion = enabled ? "active" : "static";
      const progress = enabled ? Math.min(1, Math.max(0, scrollYProgress.get())) : 1;
      route.style.strokeDasharray = `${length}`;
      route.style.strokeDashoffset = `${length * (1 - progress)}`;
      const point = route.getPointAtLength(length * progress);
      dot.setAttribute("cx", String(point.x)); dot.setAttribute("cy", String(point.y));
      element.dataset.trailProgress = progress.toFixed(3);
      let chapter = enabled ? 0 : -1;
      if (enabled) {
        for (let index = 1; index < chapters.length; index++) {
          if (progress >= chapterStarts[index]) chapter = index;
        }
      }
      if (chapter !== activeChapter) {
        activeChapter = chapter;
        element.dataset.trailChapter = chapter < 0 ? "static" : String(chapter + 1);
        chapters.forEach((item, index) => {
          if (index === chapter) item.dataset.trailCurrent = "true";
          else delete item.dataset.trailCurrent;
        });
      }
    };
    const resize = new ResizeObserver(() => { measure(); update(); });
    resize.observe(element);
    measure();
    const unsubscribe = scrollYProgress.on("change", () => { if (visible) update(); });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) update(); }); observer.observe(element);
    preference.addEventListener("change", update); document.addEventListener("visibilitychange", update); update();
    return () => { observer.disconnect(); resize.disconnect(); unsubscribe(); preference.removeEventListener("change", update); document.removeEventListener("visibilitychange", update); };
  }, [scrollYProgress]);
  return <div ref={root} className="trail-layout" data-trail-motion="static"><div className="trail-map" aria-hidden="true"><svg viewBox="0 0 400 640" fill="none"><defs><pattern id="trail-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" className="trail-grid" /></pattern></defs><rect width="400" height="640" fill="url(#trail-grid)" /><path d={path} className="trail-base" /><path ref={line} d={path} className="trail-copper" /><circle ref={marker} cx="260" cy="575" r="9" className="trail-marker" /><g className="trail-map-labels"><text x="49" y="42">THE FOUNDATION</text><text x="175" y="170">EVERYDAY PRODUCTS</text><text x="72" y="308">UNDER THE SURFACE</text><text x="177" y="448">SPORTLYNK</text><text x="230" y="617">NEXT</text></g><g className="trail-stations"><circle cx="80" cy="65" r="4" /><circle cx="200" cy="195" r="4" /><circle cx="205" cy="335" r="4" /><circle cx="200" cy="470" r="4" /><circle cx="260" cy="575" r="4" /></g></svg><span>Follow the thread.</span></div>{children}</div>;
}
