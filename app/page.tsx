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

export default function Home() {
  return (
    <ScrollSceneProvider><ScrollExperience>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <SelectedWork />
        <Engineering />
        <BuildTrail />
        <Playground />
        <Evidence />
        {process.env.PORTFOLIO_SCENE_FIXTURE === "1" ? <ScrollSceneFixture /> : null}
      </main>
      <Contact />
    </ScrollExperience></ScrollSceneProvider>
  );
}
