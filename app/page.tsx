import { About } from "@/components/portfolio/about";
import { Contact } from "@/components/portfolio/contact";
import { Hero } from "@/components/portfolio/hero";
import { SelectedWork } from "@/components/portfolio/selected-work";
import { SiteHeader } from "@/components/portfolio/site-header";
import { ScrollExperience } from "@/components/portfolio/scroll-experience";
import { Engineering } from "@/components/portfolio/engineering";
import { BuildTrail } from "@/components/portfolio/build-trail";
import { Playground } from "@/components/portfolio/playground";
import { Evidence } from "@/components/portfolio/evidence";
import { ScrollSceneProvider } from "@/components/portfolio/scroll-scene-provider";
import { ScrollSceneFixture } from "@/components/portfolio/scene-boundary";
import { SectionTravel } from "@/components/portfolio/section-travel";

export default function Home() {
  return (
    <ScrollSceneProvider><ScrollExperience>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <SectionTravel id="about" title="ABOUT" variant="about"><About /></SectionTravel>
        <SectionTravel id="work" title="SELECTED WORK" variant="work" embedded><SelectedWork /></SectionTravel>
        <SectionTravel id="engineering" title="ENGINEERING" variant="engineering"><Engineering /></SectionTravel>
        <SectionTravel id="journey" title="MY JOURNEY" variant="journey"><BuildTrail /></SectionTravel>
        <SectionTravel id="building" title="ALWAYS BUILDING" variant="building"><Playground /></SectionTravel>
        <SectionTravel id="evidence" title="EVIDENCE" variant="evidence"><Evidence /></SectionTravel>
        {process.env.PORTFOLIO_SCENE_FIXTURE === "1" ? <ScrollSceneFixture /> : null}
      </main>
      <SectionTravel id="contact" title="CONTACT" variant="contact"><Contact /></SectionTravel>
    </ScrollExperience></ScrollSceneProvider>
  );
}
