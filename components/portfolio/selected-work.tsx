import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { profile, projects } from "@/lib/portfolio-content";
import { TextLink } from "./text-link";
import { MediaReveal } from "./motion";
import { ProjectJourney } from "./project-journey";

export function SportLynkPreview() {
  return (
    <div className="sportlynk-preview" role="img" aria-label="Conceptual sports-court drawing for SportLynk; not an application screenshot.">
      <div className="sportlynk-preview-top"><span translate="no">SportLynk<ArrowUpRight className="sportlynk-mark" size={22} aria-hidden="true" /></span><span>Play. Connect. Compete.</span></div>
      <div className="court-drawing" aria-hidden="true"><svg viewBox="0 0 600 340" fill="none"><path d="M68 45h464v250H68zM91 45v250M509 45v250M68 82h464M68 258h464M300 45v250M182 82v176M418 82v176M182 170h236" /><circle cx="300" cy="170" r="53" /><g className="court-ball-motion"><circle className="court-ball" cx="405" cy="114" r="13" /><path className="court-ball-seam" d="m395 107 20 14m-15-19c8 12 7 17-3 23" /></g></svg></div>
      <div className="sportlynk-preview-bottom"><span>More room for the game.</span><span>Concept illustration</span></div>
    </div>
  );
}

export function SelectedWork() {
  return (
    <section id="work" className="work-section section-space" aria-labelledby="work-heading" tabIndex={-1}>
      <div className="site-shell">
        <div className="section-heading-row" data-reveal><div><h2 id="work-heading">Selected <em>work.</em></h2><p>Practical problems. Considered solutions. A few things I’m building.</p></div><TextLink href={profile.github}>Explore GitHub</TextLink></div>
        <ProjectJourney>
        <article id="sportlynk" className="featured-project project-scene" aria-labelledby="sportlynk-heading" tabIndex={-1}>
          <MediaReveal className="featured-media"><SportLynkPreview /></MediaReveal>
          <div className="featured-project-copy" data-reveal>
            <div className="project-status"><span className="status-dot" aria-hidden="true" />In development</div>
            <h3 id="sportlynk-heading" translate="no">SportLynk</h3>
            <p className="featured-statement">Less organizing.<br /><em>More playing.</em></p>
            <p>A sports venue booking and competitive matchmaking platform, built around a simple idea: make it easier to get people into the game.</p>
            <ul className="project-tags" aria-label="SportLynk product focus"><li>Venue booking</li><li>Matchmaking</li></ul>
            <div className="private-project-note"><LockKeyhole size={14} strokeWidth={1.6} aria-hidden="true" /><span>Private repository · Work in progress</span></div>
            <p className="project-status-note">Flagship Final Year Project</p>
            <Link className="text-link" href="/work/sportlynk"><span>Inside SportLynk</span><ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </article>
        <div className="project-grid">
          {projects.map((project) => (
            <article id={project.slug} className={`project-card project-scene project-${project.slug}`} aria-labelledby={`${project.slug}-heading`} tabIndex={-1} key={project.slug}>
              <Link className="project-card-link" href={`/work/${project.slug}`} aria-label={`Read the ${project.name} case study`}>
                <MediaReveal className="project-media">
                  <div className="project-media-label" aria-hidden="true"><span>{project.name}</span><ArrowUpRight size={18} strokeWidth={1.6} /></div>
                  <span className="project-visual-word" aria-hidden="true">{project.slug === "fitpilot" ? "Move." : project.slug === "sukoon" ? "Pause." : "Grow."}</span>
                  <div className="project-screen"><Image src={project.image} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight} sizes="(max-width: 767px) 180px, 230px" className="project-screenshot" /></div>
                  <span className="project-media-caption">From the application</span>
                </MediaReveal>
                <div className="project-card-heading"><h3 id={`${project.slug}-heading`} translate="no">{project.name}</h3><span className="project-repository-icon"><ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" /></span></div>
                <p className="project-category">{project.category}</p>
              </Link>
              <div className="project-detail" data-reveal data-reveal-group>
              <p className="project-description">{project.description}</p>
              <p className="project-engineering-thread">{project.slug === "fitpilot" ? "Inside the build: offline records, a sync queue, and a day-state engine." : project.slug === "sukoon" ? "Inside the build: a versioned schedule crossing from Flutter into Android." : "Inside the build: one course identity across student, teacher and admin workflows."}</p>
              <ul className="project-tech" aria-label={`${project.name} technologies`}>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
              <p className="project-status-note">{project.status}</p>
              <p className="project-status-detail">{project.statusDetail}</p>
              <Link className="text-link" href={`/work/${project.slug}`}><span>Inside {project.name}</span><ArrowUpRight size={18} aria-hidden="true" /></Link>
              </div>
            </article>
          ))}
        </div>
        </ProjectJourney>
      </div>
    </section>
  );
}
