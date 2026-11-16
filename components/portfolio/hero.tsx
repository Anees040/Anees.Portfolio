import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/portfolio-content";
import { CharacterScene } from "./character-scene";
import { HeroEntrance } from "./motion";

export function Hero() {
  return (
    <section id="home" className="hero site-shell" aria-labelledby="hero-heading" tabIndex={-1}>
      <HeroEntrance>
        <div className="hero-copy">
          <p data-entrance="0" className="hero-greeting">Hi, I’m Muhammad Anees.</p>
          <h1 id="hero-heading"><span data-entrance="1" className="hero-line">I build thoughtful </span><span data-entrance="2" className="hero-line">software for </span><span data-entrance="3" className="hero-line"><em>real-world</em> </span><span data-entrance="4" className="hero-line">problems.</span></h1>
          <p data-entrance="5" className="hero-introduction">{profile.introduction}</p>
          <div data-entrance="6" className="hero-actions"><a className="button button-primary" href="#work">Explore my work <ArrowUpRight size={18} strokeWidth={1.6} aria-hidden="true" /></a><a className="button button-text" href="#about">Get to know me <ArrowRight size={18} strokeWidth={1.6} aria-hidden="true" /></a></div>
          <a data-entrance="7" className="current-project" href="#sportlynk"><span className="status-dot" aria-hidden="true" /><span>Currently building <strong>SportLynk</strong></span><ArrowRight size={15} aria-hidden="true" /></a>
        </div>
        <div data-entrance="2" className="hero-artwork"><CharacterScene /></div>
      </HeroEntrance>
      <div className="hero-footnote"><p>Flutter & Dart <span aria-hidden="true">/</span> Firebase & Supabase <span aria-hidden="true">/</span> Native Android</p><a href="#work" aria-label="Scroll to selected work"><span>Scroll to explore</span><ArrowDown size={16} strokeWidth={1.5} aria-hidden="true" /></a></div>
    </section>
  );
}
