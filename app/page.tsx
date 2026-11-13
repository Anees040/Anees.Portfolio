import { About } from "@/components/portfolio/about";
import { Contact } from "@/components/portfolio/contact";
import { Hero } from "@/components/portfolio/hero";
import { SelectedWork } from "@/components/portfolio/selected-work";
import { SiteHeader } from "@/components/portfolio/site-header";
import { WorkspaceScene } from "@/components/portfolio/workspace-scene";
import { ScrollExperience } from "@/components/portfolio/scroll-experience";

export default function Home() {
  return (
    <ScrollExperience>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <WorkspaceScene />
        <SelectedWork />
        <About />
      </main>
      <Contact />
    </ScrollExperience>
  );
}
