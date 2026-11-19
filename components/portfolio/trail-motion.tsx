"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useScroll } from "motion/react";

const path = "M52 74 C180 15 530 45 542 166 S42 195 52 292 S542 306 542 410 S315 585 72 522";

export function TrailMotion({ children, scene }: { children: ReactNode; scene: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const marker = useRef<SVGCircleElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start center", "end center"] });
  useEffect(() => {
    const element = root.current!, route = line.current!, dot = marker.current!;
    const chapters = Array.from(element.querySelectorAll<HTMLElement>(".trail-chapters > li"));
    const links = Array.from(element.querySelectorAll<HTMLAnchorElement>(".thread-navigation a"));
    const sheets = Array.from(element.querySelectorAll<HTMLElement>(".thread-scene-sheet"));
    const starts = new Float32Array(chapters.length);
    const length = route.getTotalLength();
    const preference = matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let visible = true, height = 1, activeChapter = -2;
    let spatial = false;
    const measure = () => {
      spatial = preference.matches && innerHeight >= parseFloat(getComputedStyle(document.documentElement).fontSize) * 46;
      element.dataset.trailMotion = spatial ? "active" : "static";
      const bounds = element.getBoundingClientRect();
      height = Math.max(1, bounds.height);
      for (let index = 0; index < chapters.length; index++) starts[index] = chapters[index].getBoundingClientRect().top - bounds.top;
    };
    const update = () => {
      if (!visible || document.hidden) return;
      const position = scrollYProgress.get() * height;
      let chapter = 0;
      for (let index = 1; index < chapters.length; index++) if (position >= starts[index]) chapter = index;
      const next = Math.min(chapter + 1, chapters.length - 1);
      const within = next === chapter ? 1 : Math.min(1, Math.max(0, (position - starts[chapter]) / Math.max(1, starts[next] - starts[chapter])));
      const progress = spatial ? (chapter + (next === chapter ? 0 : within)) / (chapters.length - 1) : 1;
      route.style.strokeDasharray = String(length); route.style.strokeDashoffset = String(length * (1 - progress));
      const point = route.getPointAtLength(length * progress);
      dot.setAttribute("cx", String(point.x)); dot.setAttribute("cy", String(point.y));
      element.dataset.trailProgress = progress.toFixed(3);
      const transition = Math.max(0, (within - 0.78) / 0.22);
      for (let index = 0; index < sheets.length; index++) {
        const opacity = index === chapter ? (next === chapter ? 1 : 1 - transition) : index === next ? transition : 0;
        sheets[index].style.opacity = String(opacity);
        sheets[index].style.visibility = opacity > 0 ? "visible" : "hidden";
        sheets[index].style.transform = `translateY(${index === chapter ? -transition * 12 : (1 - transition) * 12}px)`;
      }
      if (chapter !== activeChapter || element.dataset.trailChapter !== (spatial ? String(chapter + 1) : "static")) {
        activeChapter = chapter;
        element.dataset.trailChapter = spatial ? String(chapter + 1) : "static";
        for (let index = 0; index < chapters.length; index++) {
          if (index === chapter && spatial) chapters[index].dataset.trailCurrent = "true";
          else delete chapters[index].dataset.trailCurrent;
          if (index === chapter) links[index].setAttribute("aria-current", "step");
          else links[index].removeAttribute("aria-current");
        }
      }
    };
    const refresh = () => { measure(); update(); };
    const navigate = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = (event.target as Element).closest<HTMLAnchorElement>(".thread-navigation a");
      const index = target ? links.indexOf(target) : -1;
      if (index < 0) return;
      event.preventDefault();
      const destination = chapters[index];
      const top = scrollY + (spatial ? destination.querySelector("article")!.getBoundingClientRect().top - innerHeight * 0.35 : destination.getBoundingClientRect().top - parseFloat(getComputedStyle(element).getPropertyValue("--header-height")) - 32);
      history.pushState(null, "", target!.hash);
      destination.focus({ preventScroll: true });
      scrollTo({ top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    };
    const resize = new ResizeObserver(refresh); resize.observe(element);
    const unsubscribe = scrollYProgress.on("change", update);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) refresh(); }); observer.observe(element);
    preference.addEventListener("change", refresh); window.addEventListener("resize", refresh);
    document.addEventListener("visibilitychange", update); element.addEventListener("click", navigate);
    refresh();
    return () => { observer.disconnect(); resize.disconnect(); unsubscribe(); preference.removeEventListener("change", refresh); window.removeEventListener("resize", refresh); document.removeEventListener("visibilitychange", update); element.removeEventListener("click", navigate); };
  }, [scrollYProgress]);
  return <div ref={root} className="trail-layout thread-layout" data-trail-motion="static"><div className="trail-map thread-scene" aria-hidden="true"><svg className="thread-pathwork" viewBox="0 0 600 600" fill="none"><path d={path} className="trail-base" /><path ref={line} d={path} className="trail-copper" /><circle ref={marker} cx="72" cy="522" r="7" className="trail-marker" /></svg><div className="thread-scene-sheets">{scene}</div><div className="thread-scene-signature"><span>Muhammad Anees</span><span>Learning → building</span></div></div>{children}</div>;
}
