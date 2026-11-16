import { ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/portfolio-content";
import { TextLink } from "./text-link";

export function About() {
  return (
    <section id="about" className="about-section site-shell section-space" aria-labelledby="about-heading" tabIndex={-1}>
      <div className="about-heading" data-reveal><h2 id="about-heading">Curious by nature.<br /><em>Thoughtful by design.</em></h2></div>
      <div className="about-body" data-reveal data-reveal-group><p className="about-lead">I’m Anees, a Software Engineering student who likes turning everyday problems into software that makes sense.</p><p>My interests live where mobile development, backend engineering, and product design meet. From a quieter prayer routine to a more connected learning experience, I’m drawn to building things with a practical purpose.</p><TextLink href={profile.github}>Get to know my work</TextLink></div>
      <div id="engineering" className="engineering-intro" tabIndex={-1} data-reveal data-reveal-group>
        <h3>From the interface<br />to the <em>underlying logic.</em></h3>
        <dl className="engineering-list"><div><dt>Mobile experiences</dt><dd>Flutter, Dart, and native Android integration with Kotlin.</dd></div><div><dt>Data & backend</dt><dd>Exploring connected products with Firebase, Supabase, and local persistence.</dd></div><div><dt>Product thinking</dt><dd>Clear workflows, considered interactions, and useful everyday tools.</dd></div></dl>
      </div>
      <div id="journey" className="journey-intro" tabIndex={-1} data-reveal data-reveal-group><span className="journey-symbol" aria-hidden="true"><ArrowUpRight size={24} strokeWidth={1.3} /></span><div><h3>Learning. Building. Going a little deeper.</h3><p>Studying Software Engineering at COMSATS University Islamabad.<br className="desktop-break" /> Putting that learning into practice, one project at a time.</p></div><span className="journey-label">The journey continues</span></div>
    </section>
  );
}
