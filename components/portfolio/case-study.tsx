import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { caseStudies, type CaseStudy, type StoryPoint } from "@/lib/case-studies";
import { projects, profile } from "@/lib/portfolio-content";
import { Monogram } from "./monogram";
import { SportLynkPreview } from "./selected-work";
import { ArchitectureExplorer } from "./architecture-explorer";
import { ProjectGallery } from "./project-gallery";
import { ScrollExperience, ScrollProgress } from "./scroll-experience";
import { MediaReveal } from "./motion";
import { ScrollSceneProvider } from "./scroll-scene-provider";

function StoryPoints({ points, className = "" }: { points: StoryPoint[]; className?: string }) {
  return <div className={`story-points ${className}`}>{points.map(point => <article key={point.title}><h3>{point.title}</h3><p>{point.body}</p>{point.evidence && <a className="text-link" href={point.evidence.href}><span>{point.evidence.label}</span><ArrowUpRight size={16} aria-hidden="true" /></a>}</article>)}</div>;
}

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const preview = projects.find(project => project.slug === study.slug);
  const next = caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length];
  const conceptLed = study.architecture.conceptual;
  return <ScrollSceneProvider><ScrollExperience>
    <a className="skip-link" href="#case-main">Skip to content</a>
    <header className="site-header case-header"><ScrollProgress /><div className="site-shell header-inner"><Link className="wordmark" href="/" aria-label="Muhammad Anees — home"><Monogram /><span>Muhammad Anees</span></Link><Link className="text-link" href={`/#${study.slug}`}><ArrowLeft size={18} aria-hidden="true" /><span>All work</span></Link><a href={`mailto:${profile.email}`} className="case-contact">Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></a></div></header>
    <main id="case-main" tabIndex={-1} className={`case-study case-${study.slug}`}>
      <section className="case-hero site-shell" aria-labelledby="case-title">
        <div className="case-title-row"><h1 id="case-title">{study.name}<span>.</span></h1><div><p>{study.category}</p><p className="case-status">{study.status}</p></div></div>
        <div className="case-hero-composition"><div><p className="case-statement">{study.headline}</p><p className="case-summary">{study.summary}</p><p className="case-status-detail">{study.statusDetail}</p>{study.links.map(link => <a className="text-link" href={link.href} key={link.href}><span>{link.label}</span><ArrowUpRight size={18} aria-hidden="true" /></a>)}</div><MediaReveal className="case-hero-visual">{preview ? <><span className="case-visual-type" aria-hidden="true">{study.slug === "fitpilot" ? "Eat. Move.\nRepeat." : study.slug === "sukoon" ? "Room\nto reflect." : "Keep\nlearning."}</span><Image src={preview.image} width={preview.imageWidth} height={preview.imageHeight} alt={preview.imageAlt} sizes="(max-width: 767px) 200px, 260px" priority /></> : <SportLynkPreview />}</MediaReveal></div>
        <nav className="case-contents" aria-label="Case study chapters"><a href="#overview">The problem</a><a href="#implementation">{conceptLed ? "The concept" : "The build"}</a>{study.screenshots.length > 0 && <a href="#gallery">The screens</a>}<a href="#architecture">{conceptLed ? "The product map" : "The system"}</a><a href="#decisions">{conceptLed ? "The questions" : "The decisions"}</a><a href="#outcome">Where it stands</a></nav>
      </section>
      <section id="overview" tabIndex={-1} className="case-section site-shell" aria-labelledby="problem-heading"><div className="case-section-title"><h2 id="problem-heading">Start with<br /><em>the problem.</em></h2><p>{study.audience}</p>{study.role && <p>{study.role}</p>}</div><div className="case-prose"><p className="case-lead">{study.problem}</p><h3>The goals</h3><ul className="case-goals">{study.goals.map(goal => <li key={goal}>{goal}</li>)}</ul></div></section>
      <section id="implementation" tabIndex={-1} className="case-build" aria-labelledby="build-heading"><div className="site-shell"><div className="case-section-title"><h2 id="build-heading">{conceptLed ? "From need" : "From intention"}<br /><em>{conceptLed ? "to product direction." : "to implementation."}</em></h2><p>{study.implementation}</p></div><StoryPoints points={study.features} className="feature-stories" />{study.technologies.length > 0 && <ul className="case-technologies" aria-label="Verified technologies">{study.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul>}</div></section>
      {study.screenshots.length > 0 && <section id="gallery" tabIndex={-1} className="case-gallery-section site-shell" aria-labelledby="gallery-heading"><div className="section-heading-row"><h2 id="gallery-heading">Inside the<br /><em>experience.</em></h2><p>Actual application screenshots from the public repository.<br />Select a screen to inspect it.</p></div><ProjectGallery images={study.screenshots} slug={study.slug} /></section>}
      <section id="architecture" tabIndex={-1} className="case-architecture" aria-labelledby="architecture-heading"><div className="site-shell"><h2 id="architecture-heading">{study.architecture.title}</h2><ArchitectureExplorer architecture={study.architecture} id={study.slug} /></div></section>
      <section id="decisions" tabIndex={-1} className="case-section site-shell" aria-labelledby="decisions-heading"><div className="case-section-title"><h2 id="decisions-heading">{conceptLed ? "The questions" : "The choices"}<br /><em>{conceptLed ? "to explore." : "underneath."}</em></h2><p>{conceptLed ? "Product relationships and engineering questions to explore—not observations from a verified implementation." : "What the implementation makes explicit—and where the trade-offs live."}</p></div><StoryPoints points={[...study.decisions, ...study.challenges]} /></section>
      <section id="outcome" tabIndex={-1} className="case-outcome site-shell" aria-labelledby="outcome-heading"><h2 id="outcome-heading">Where it <em>stands.</em></h2><p className="case-lead">{study.outcomes}</p>{study.lessons.length > 0 && <><h3 className="takeaway-heading">Engineering takeaways</h3><StoryPoints points={study.lessons} /></>}<details className="next-steps"><summary>Next steps for the project</summary><ul className="case-goals">{study.nextSteps.map(step => <li key={step}>{step}</li>)}</ul></details></section>
      <aside className="case-evidence-note site-shell">This study combines owner-approved context with a source review on 16 November 2026. Technical takeaways are observations from the code, not a claim of individual authorship of every feature or a production audit.</aside>
    </main>
    <footer className="next-project"><div className="site-shell"><Link href={`/work/${next.slug}`} aria-label={`Next project: ${next.name}`}><span>{next.name}<em>.</em></span><ArrowUpRight size={60} strokeWidth={1} aria-hidden="true" /></Link><div className="next-project-bottom"><Link href="/#work">Back to selected work</Link><a href={`mailto:${profile.email}`}>Talk about the work <ArrowUpRight size={16} aria-hidden="true" /></a></div></div></footer>
  </ScrollExperience></ScrollSceneProvider>;
}
