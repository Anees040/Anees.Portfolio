"use client";

import { ArrowUpRight, MessageCircle, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/lib/portfolio-content";
import { Monogram } from "./monogram";
import { ScrollProgress } from "./scroll-experience";

export function SiteHeader() {
  const [active, setActive] = useState("");
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const sections = [{ href: "#home" }, ...navigation].map(({ href }) => document.querySelector<HTMLElement>(href)).filter((element): element is HTMLElement => !!element);
    let frame = 0;
    const updateActive = () => {
      frame = 0;
      const readingLine = Math.min(innerHeight * 0.3, 240);
      let current = "";
      for (const section of sections) if (section.getBoundingClientRect().top <= readingLine) current = `#${section.id}`;
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = "#contact";
      setActive(previous => previous === current ? previous : current);
    };
    const trackSection = () => { if (!frame) frame = requestAnimationFrame(updateActive); };
    trackSection();
    window.addEventListener("scroll", trackSection, { passive: true });
    window.addEventListener("resize", trackSection);
    const closeOutside = (event: PointerEvent) => {
      if (menu.current?.open && !menu.current.contains(event.target as Node)) menu.current.open = false;
    };
    const closeAtDesktop = () => {
      if (menu.current && getComputedStyle(menu.current).display === "none") menu.current.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    window.addEventListener("resize", closeAtDesktop);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", trackSection);
      window.removeEventListener("resize", trackSection);
      document.removeEventListener("pointerdown", closeOutside);
      window.removeEventListener("resize", closeAtDesktop);
    };
  }, []);

  function followAnchor(href: string) {
    if (menu.current) menu.current.open = false;
    setActive(href);
    document.querySelector<HTMLElement>(href)?.focus({ preventScroll: true });
  }

  return (
    <header className="site-header">
      <ScrollProgress />
      <div className="site-shell header-inner">
        <a className="wordmark" href="#home" aria-label="Anees — home" onClick={() => setActive("")}><Monogram /><span translate="no">Anees<span className="wordmark-dot">.</span></span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(({ label, href }) => <a key={href} href={href} aria-current={active === href ? "location" : undefined} onClick={() => setActive(href)}>{label}</a>)}
        </nav>
        <a className="ask-link" href="#contact"><MessageCircle size={16} strokeWidth={1.6} aria-hidden="true" /><span>Let’s talk</span></a>
        <details ref={menu} className="mobile-menu" onKeyDown={(event) => {
          if (event.key === "Escape" && menu.current?.open) { menu.current.open = false; menu.current.querySelector("summary")?.focus(); }
        }} onBlur={(event) => {
          if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node) && menu.current) menu.current.open = false;
        }}>
          <summary><span>Menu</span><Plus className="menu-open-icon" size={18} aria-hidden="true" /><Minus className="menu-close-icon" size={18} aria-hidden="true" /></summary>
          <nav className="menu-panel" aria-label="Mobile navigation">
            {navigation.map(({ label, href }) => <a key={href} href={href} aria-current={active === href ? "location" : undefined} onClick={() => followAnchor(href)}>{label}<ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" /></a>)}
            <a className="mobile-ask" href="#playground" onClick={() => followAnchor("#playground")}>Concurrency Lab <ArrowUpRight size={20} aria-hidden="true" /></a>
          </nav>
        </details>
      </div>
    </header>
  );
}
