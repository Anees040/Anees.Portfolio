import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/portfolio-content";
import { CharacterScene } from "./character-scene";
import { HeroEntrance } from "./motion";
import { HeroAmbient } from "./hero-ambient";
import "./hero-cosmos.module.css";

export function Hero() {
  return (
    <section id="home" className="hero immersive-hero copper-cosmos" aria-labelledby="hero-heading" tabIndex={-1} data-cosmos-motion="still">
      <HeroAmbient />
      <div className="site-shell">
      <HeroEntrance>
        <div className="hero-copy">
          <p data-entrance="0" className="hero-greeting">Muhammad Anees <span>Software developer</span></p>
          <h1 id="hero-heading"><span data-entrance="1" className="hero-line">Thoughtful </span><span data-entrance="2" className="hero-line">software. </span><span data-entrance="3" className="hero-line"><em>A human</em> </span><span data-entrance="4" className="hero-line"><em>perspective.</em></span></h1>
          <p data-entrance="5" className="hero-introduction">{profile.introduction}</p>
          <div data-entrance="6" className="hero-actions"><a className="button button-primary" href="#work">Explore my work <ArrowUpRight size={18} strokeWidth={1.6} aria-hidden="true" /></a><a className="button button-text" href="#about">Get to know me <ArrowRight size={18} strokeWidth={1.6} aria-hidden="true" /></a></div>
          <a data-entrance="7" className="current-project" href="#sportlynk"><span className="status-dot" aria-hidden="true" /><span>Currently building <strong>SportLynk</strong></span><ArrowRight size={15} aria-hidden="true" /></a>
        </div>
        <div className="hero-artwork"><CharacterScene /></div>
      </HeroEntrance>
      <div className="hero-footnote"><p>Muhammad Anees <span aria-hidden="true">/</span> A developer’s work, from the inside out.</p><a href="#workspace" aria-label="Scroll to the interactive workshop"><span>Explore the workspace</span><ArrowDown size={16} strokeWidth={1.5} aria-hidden="true" /></a></div>
      </div>
    </section>
  );
}
