"use client";

import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { readMotionTokens } from "@/lib/motion-system";

const scenes = ["sportlynk", "fitpilot", "sukoon", "eduverse"];
const names = ["SportLynk", "FitPilot", "Sukoon", "EduVerse"];

export function ProjectJourney({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const select = useRef<(index: number, focus?: boolean) => void>(() => {});
  const [active, setActive] = useState(0);
  const [duration, setDuration] = useState(0);
  const activeIndex = useRef(0);
  const interfaceDuration = useRef(0);
  const indicatorId = useId();
  const enabled = useMotionValue(0);
  const start = useMotionValue(0);
  const distance = useMotionValue(1);
  const travel = useMotionValue(0);
  const { scrollY } = useScroll();
  const progress = useTransform(() => {
    // Read every value on the first render so Motion subscribes before enhancement.
    const position = scrollY.get();
    const origin = start.get();
    const range = distance.get();
    return enabled.get() ? Math.max(0, Math.min(1, (position - origin) / range)) : 0;
  });
  const x = useTransform(() => -progress.get() * travel.get());
  useMotionValueEvent(progress, "change", value => {
    const index = Math.round(value * (scenes.length - 1));
    if (index === activeIndex.current) return;
    activeIndex.current = index;
    setDuration(interfaceDuration.current);
    setActive(index);
  });

  useEffect(() => {
    const element = root.current!;
    const sticky = element.querySelector<HTMLElement>(".journey-sticky")!;
    const viewport = element.querySelector<HTMLElement>(".journey-viewport")!;
    const track = element.querySelector<HTMLElement>(".journey-track")!;
    const nav = element.querySelector<HTMLElement>(".journey-navigation")!;
    const note = element.querySelector<HTMLElement>(".journey-scroll-note")!;
    const articles = scenes.map(id => document.getElementById(id)!);
    interfaceDuration.current = readMotionTokens().interface;
    const preference = matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let disposed = false;
    let previousMode = false;
    const measure = () => {
      frame = 0;
      const header = document.querySelector(".site-header")!.getBoundingClientRect().height;
      const available = innerHeight - header;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const wasInside = previousMode && scrollY.get() >= start.get() && scrollY.get() <= start.get() + distance.get();
      const currentIndex = activeIndex.current;
      let canPin = preference.matches && element.clientWidth >= rem * 60 && available >= rem * 38 && document.documentElement.dir !== "rtl";
      element.dataset.journeyMode = canPin ? "horizontal" : "stacked";
      if (canPin) {
        const contentHeight = Math.max(...articles.map(article => article.scrollHeight));
        const navSpace = nav.offsetHeight + parseFloat(getComputedStyle(nav).marginBottom);
        const noteSpace = note.offsetHeight + parseFloat(getComputedStyle(note).marginTop);
        canPin = contentHeight + navSpace + noteSpace + 40 <= available;
        element.dataset.journeyMode = canPin ? "horizontal" : "stacked";
      }
      if (canPin) {
        const range = Math.min(viewport.clientWidth, available * 0.9) * (scenes.length - 1);
        sticky.style.top = `${header}px`;
        sticky.style.height = `${available}px`;
        element.style.height = `${available + range}px`;
        start.set(element.getBoundingClientRect().top + window.scrollY - header);
        distance.set(range);
        travel.set(articles.at(-1)!.offsetLeft - articles[0].offsetLeft);
        enabled.set(1);
      } else {
        enabled.set(0);
        sticky.style.removeProperty("top");
        sticky.style.removeProperty("height");
        element.style.removeProperty("height");
        if (wasInside) articles[currentIndex].scrollIntoView({ block: "start", behavior: "instant" });
      }
      previousMode = canPin;
    };
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(measure); };
    select.current = (index, focus = true) => {
      if (enabled.get()) {
        window.scrollTo({ top: start.get() + distance.get() * index / (scenes.length - 1), behavior: "instant" });
      } else articles[index].scrollIntoView({ block: "start", behavior: "instant" });
      if (focus) articles[index].focus({ preventScroll: true });
      activeIndex.current = index;
      setDuration(0);
      setActive(index);
    };
    const follow = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const index = scenes.indexOf(anchor?.hash.slice(1) ?? "");
      if (index < 0) return;
      event.preventDefault();
      document.querySelectorAll<HTMLElement>("[popover]:popover-open").forEach(note => note.hidePopover());
      history.pushState(null, "", `#${scenes[index]}`);
      select.current(index);
    };
    const focusScene = (event: FocusEvent) => {
      if (!enabled.get()) return;
      const index = articles.findIndex(article => article.contains(event.target as Node));
      if (index >= 0) select.current(index, false);
    };
    const hashChange = () => {
      const index = scenes.indexOf(location.hash.slice(1));
      if (index >= 0) select.current(index);
    };
    const observer = new ResizeObserver(schedule);
    [element, nav, document.querySelector(".site-header")!, ...articles].forEach(node => observer.observe(node));
    const visibleScenes = new IntersectionObserver(entries => {
      if (enabled.get()) return;
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const index = articles.indexOf(visible.target as HTMLElement);
      activeIndex.current = index;
      setActive(index);
    }, { threshold: [0.25, 0.5, 0.75] });
    articles.forEach(article => visibleScenes.observe(article));
    document.fonts.ready.then(() => { if (!disposed) { measure(); hashChange(); } });
    preference.addEventListener("change", schedule);
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", hashChange);
    document.addEventListener("click", follow, true);
    track.addEventListener("focusin", focusScene);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibleScenes.disconnect();
      preference.removeEventListener("change", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", hashChange);
      document.removeEventListener("click", follow, true);
      track.removeEventListener("focusin", focusScene);
    };
  }, [distance, enabled, progress, scrollY, start, travel]);

  return <div ref={root} className="project-journey" data-journey-mode="stacked" data-active-project={scenes[active]}>
    <div className="journey-sticky">
      <nav className="journey-navigation" aria-label="Selected projects" onKeyDown={event => {
        const index = scenes.indexOf((event.target as HTMLAnchorElement).hash?.slice(1));
        if (index < 0) return;
        const next = event.key === "ArrowRight" ? Math.min(3, index + 1) : event.key === "ArrowLeft" ? Math.max(0, index - 1) : event.key === "Home" ? 0 : event.key === "End" ? 3 : -1;
        if (next < 0) return;
        event.preventDefault();
        select.current(next, false);
        event.currentTarget.querySelectorAll<HTMLAnchorElement>("a")[next].focus({ preventScroll: true });
      }}>
        {scenes.map((id, index) => <a key={id} href={`#${id}`} aria-current={active === index ? "step" : undefined}>
          <span className="journey-number">0{index + 1}</span><span>{names[index]}</span>
          {active === index && <motion.span className="journey-active-line" layoutId={indicatorId} transition={{ duration }} aria-hidden="true" />}
        </a>)}
        <motion.div className="journey-progress" style={{ scaleX: progress }} aria-hidden="true" />
      </nav>
      <div className="journey-viewport"><motion.div className="journey-track" style={{ x }}>{children}</motion.div></div>
      <p className="journey-scroll-note"><span>Scroll through the projects, or choose one above.</span><a href="#about">Continue to About <ArrowUpRight size={14} aria-hidden="true" /></a></p>
    </div>
  </div>;
}
