import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { caseStudies, type CaseStudy, type StoryPoint } from "@/lib/case-studies";
import { projects, profile } from "@/lib/portfolio-content";
import { Monogram } from "./monogram";
import { SportLynkPreview } from "./selected-work";
import { ArchitectureExplorer } from "./architecture-explorer";
import { CaseDiagram } from "./case-diagram";
import { ProjectGallery } from "./project-gallery";
import { ScrollLayers } from "./scroll-layers";
import { ScrollExperience, ScrollProgress } from "./scroll-experience";
import { ScrollSceneProvider } from "./scroll-scene-provider";
import "./case-story.css";

function StoryPoints({ points, className = "" }: { points: StoryPoint[]; className?: string }) {
  return <div className={"story-points " + className}>{points.map(point => <article key={point.title}><h3>{point.title}</h3><p>{point.body}</p>{point.evidence && <a className="text-link" href={point.evidence.href}><span>{point.evidence.label}</span><ArrowUpRight size={16} aria-hidden="true" /></a>}</article>)}</div>;
}

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const preview = projects.find(project => project.slug === study.slug);
  const next = caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length];
  const conceptLed = study.architecture.conceptual;
  const secondary = study.screenshots[study.slug === "sukoon" ? 2 : study.slug === "eduverse" ? 1 : 1];
  return <ScrollSceneProvider><ScrollExperience>
    <a className="skip-link" href="#case-main">Skip to content</a>
    <header className="site-header case-header"><ScrollProgress /><div className="site-shell header-inner"><Link className="wordmark" href="/" aria-label="Muhammad Anees — home"><Monogram /><span>Muhammad Anees</span></Link><Link className="text-link" href={"/#" + study.slug}><ArrowLeft size={18} aria-hidden="true" /><span>All work</span></Link><a href={"mailto:" + profile.email} className="case-contact">Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></a></div></header>
    <main id="case-main" tabIndex={-1} className={"case-study case-" + study.slug}>
      <section className="case-hero site-shell" aria-labelledby="case-title">
        <div className="case-title-row"><h1 id="case-title">{study.name}<span>.</span></h1><div><p>{study.category}</p><p className="case-status">{study.status}</p></div></div>
        <div className="case-hero-composition">
          <div className="case-opening-copy"><p className="case-statement">{study.headline}</p><p className="case-summary">{study.summary}</p><p className="case-status-detail">{study.statusDetail}</p>{study.links.map(link => <a className="text-link" href={link.href} key={link.href}><span>{link.label}</span><ArrowUpRight size={18} aria-hidden="true" /></a>)}</div>
          <ScrollLayers className="case-hero-visual"><div className="case-opening-art">
            {preview ? <>
              <span className="case-visual-type" aria-hidden="true">{study.slug === "fitpilot" ? "Eat. Move.\nRepeat." : study.slug === "sukoon" ? "Room\nto reflect." : "One course.\nThree roles."}</span>
              <div className="case-hero-screen case-screen-primary" data-case-layer><Image src={preview.image} width={preview.imageWidth} height={preview.imageHeight} alt={preview.imageAlt} sizes="(max-width: 767px) 62vw, (max-width: 1279px) 26vw, 340px" priority /></div>
              {secondary && <div className="case-hero-screen case-screen-secondary" data-case-layer><Image src={secondary.src} width={secondary.width} height={secondary.height} alt={secondary.alt} sizes="(max-width: 767px) 46vw, 240px" /></div>}
            </> : <div data-case-layer><SportLynkPreview /></div>}
          </div></ScrollLayers>
        </div>
        <nav className="case-contents" aria-label="Case study chapters"><a href="#overview">Why I built it</a><a href="#implementation">{conceptLed ? "The product direction" : "The build"}</a><a href="#experience">The journey</a>{study.screenshots.length > 0 && <a href="#gallery">The screens</a>}<a href="#architecture">The system</a><a href="#decisions">The decisions</a><a href="#challenges">The challenges</a><a href="#outcome">What I learned</a></nav>
      </section>
      <section id="overview" tabIndex={-1} className="case-section site-shell" aria-labelledby="problem-heading">
        <div className="case-section-title"><h2 id="problem-heading">Start with<br /><em>the problem.</em></h2><p>{study.audience}</p></div>
        <div className="case-prose"><p className="case-lead">{study.motivation}</p><p>{study.problem}</p><h3>What I wanted to achieve</h3><ul className="case-goals">{study.goals.map(goal => <li key={goal}>{goal}</li>)}</ul><div className="case-role"><h3>{study.slug === "sportlynk" ? "My role in the team" : "My role"}</h3><p>{study.role}</p></div></div>
      </section>
      <section id="implementation" tabIndex={-1} className="case-build" aria-labelledby="build-heading"><div className="site-shell">
        <div className="case-section-title"><h2 id="build-heading">From intention<br /><em>{conceptLed ? "to a shared direction." : "to implementation."}</em></h2><p>{study.implementation}</p></div>
        <StoryPoints points={study.features} className="feature-stories" />
        {study.technologies.length > 0 && <ul className="case-technologies" aria-label="Project technologies">{study.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul>}
      </div></section>
      <section id="experience" tabIndex={-1} className="case-experience site-shell" aria-labelledby="experience-heading"><h2 id="experience-heading">{study.journey.title}</h2><ol className="case-journey">{study.journey.steps.map((step, index) => <li key={step.title}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol></section>
      {study.screenshots.length > 0 && <section id="gallery" tabIndex={-1} className="case-gallery-section site-shell" aria-labelledby="gallery-heading"><div className="section-heading-row"><h2 id="gallery-heading">Inside the<br /><em>experience.</em></h2><p>{study.slug === "fitpilot" ? "Food, a practical activity plan and a wider routine." : study.slug === "sukoon" ? "Permission, reflection and direction." : "The learner, the teacher and the administrator."}<br />Genuine application screens. Select one to inspect.</p></div><ProjectGallery images={study.screenshots} slug={study.slug} /></section>}
      <section id="architecture" tabIndex={-1} className="case-architecture" aria-labelledby="architecture-heading"><div className="site-shell"><h2 id="architecture-heading">{study.architecture.title}</h2><CaseDiagram slug={study.slug} /><ArchitectureExplorer architecture={study.architecture} id={study.slug} /></div></section>
      <section id="decisions" tabIndex={-1} className="case-section site-shell" aria-labelledby="decisions-heading"><div className="case-section-title"><h2 id="decisions-heading">The choices<br /><em>underneath.</em></h2><p>{conceptLed ? "How I’m thinking about our initial scope and the relationships between workflows." : "The trade-offs behind the experience, from product rules to data boundaries."}</p></div><StoryPoints points={study.decisions} /></section>
      <section id="challenges" tabIndex={-1} className="case-challenges" aria-labelledby="challenges-heading"><div className="site-shell"><h2 id="challenges-heading">Where it gets <em>interesting.</em></h2><StoryPoints points={study.challenges} /></div></section>
      <section id="outcome" tabIndex={-1} className="case-outcome site-shell" aria-labelledby="outcome-heading"><h2 id="outcome-heading">Where it <em>stands.</em></h2><p className="case-lead">{study.outcomes}</p><h3 className="takeaway-heading">What I’m taking forward</h3><StoryPoints points={study.lessons} /><details className="next-steps" open><summary>My next direction</summary><ul className="case-goals">{study.nextSteps.map(step => <li key={step}>{step}</li>)}</ul></details></section>
    </main>
    <footer className="next-project"><div className="site-shell"><Link href={"/work/" + next.slug} aria-label={"Next project: " + next.name}><span>{next.name}<em>.</em></span><ArrowUpRight size={60} strokeWidth={1} aria-hidden="true" /></Link><div className="next-project-bottom"><Link href="/#work">Back to selected work</Link><a href={"mailto:" + profile.email}>Talk about the work <ArrowUpRight size={16} aria-hidden="true" /></a></div></div></footer>
  </ScrollExperience></ScrollSceneProvider>;
}
