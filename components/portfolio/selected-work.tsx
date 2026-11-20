import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { caseStudies, type CaseStudy, type StoryImage } from "@/lib/case-studies";
import { profile, projects } from "@/lib/portfolio-content";
import { ProjectArtifact } from "./project-artifact";
import { ProjectJourney } from "./project-journey";
import { WorkspaceInteraction } from "./workspace-interaction";
import { WorkspaceScene } from "./workspace-scene";
import { TextLink } from "./text-link";
import styles from "./about-work.module.css";

export function SportLynkPreview() {
  return (
    <div className="sportlynk-preview" role="img" aria-label="Conceptual sports-court drawing for SportLynk; not an application screenshot.">
      <div className="sportlynk-preview-top"><span translate="no">SportLynk<ArrowUpRight className="sportlynk-mark" size={22} aria-hidden="true" /></span><span>Play. Connect. Compete.</span></div>
      <div className="court-drawing" aria-hidden="true"><svg viewBox="0 0 600 340" fill="none"><path d="M68 45h464v250H68zM91 45v250M509 45v250M68 82h464M68 258h464M300 45v250M182 82v176M418 82v176M182 170h236" /><circle cx="300" cy="170" r="53" /><g className="court-ball-motion"><circle className="court-ball" cx="405" cy="114" r="13" /><path className="court-ball-seam" d="m395 107 20 14m-15-19c8 12 7 17-3 23" /></g></svg></div>
      <div className="sportlynk-preview-bottom"><span>More room for the game.</span><span>Concept illustration</span></div>
    </div>
  );
}

function ProjectScreens({ study }: { study: CaseStudy }) {
  if (study.architecture.conceptual) return <div className={styles.court} data-work-screens><ProjectArtifact study={study} /></div>;
  const project = projects.find(project => project.slug === study.slug)!;
  const home: StoryImage = { src: project.image, width: project.imageWidth, height: project.imageHeight, alt: project.imageAlt, caption: study.slug === "fitpilot" ? "Today" : "Home" };
  const screens = study.slug === "eduverse" ? study.screenshots : [home, ...study.screenshots.slice(0, 2)];
  const labels = study.slug === "fitpilot" ? ["Today", "Log", "Plan"] : study.slug === "sukoon" ? ["Home", "Permissions", "Tracker"] : ["Student · Course", "Teacher", "Admin"];

  return <div className={styles.screenStory} data-work-screens>
    <div className={styles.screenSequence}>{screens.map((screen, index) => <figure key={screen.src}>
      <Image src={screen.src} width={screen.width} height={screen.height} alt={screen.alt} sizes="(max-width: 599px) 70vw, (max-width: 1023px) 28vw, 192px" loading="eager" />
      <figcaption>{labels[index]}</figcaption>
    </figure>)}</div>
    <div className={styles.screenContext}>
      <h4>{study.architecture.title}</h4>
      <p>{study.slug === "fitpilot" ? "Food logging → activity options. SQLite records and a queue connect local use to Supabase sync." : study.slug === "sukoon" ? "Daily configuration → a versioned schedule → native Android alarms and restoration." : "Student, teacher and admin views connect around course identities in Firebase Realtime Database."}</p>
      <span>{study.name} · Repository screenshots</span>
    </div>
  </div>;
}

export function SelectedWork() {
  return <section id="work" className={styles.workSection} aria-labelledby="work-heading" tabIndex={-1}>
    <header className={`site-shell ${styles.workHeading}`}><h2 id="work-heading">Selected <em>Work</em></h2><TextLink href={profile.github}>Explore GitHub</TextLink></header>
    <ProjectJourney>
      <WorkspaceInteraction>
        <div className={styles.workStage} data-work-stage>
          <div id="workspace" className={styles.workNavigation} data-work-navigation tabIndex={-1}>
            <nav aria-label="Selected projects" data-work-project-navigation>{caseStudies.map((study, index) => <a href={`#${study.slug}`} key={study.slug}><span aria-hidden="true">0{index + 1}</span><span>{study.name}</span></a>)}</nav>
            <fieldset className={styles.viewControls}><legend className="visually-hidden">Choose a work perspective</legend>{[{ id: "projects", name: "Projects" }, { id: "notes", name: "Engineering Notes" }, { id: "log", name: "Build Log" }].map((view, index) => <label key={view.id}><input type="radio" name="work-perspective" value={view.id} defaultChecked={index === 0} /><span>{view.name}</span></label>)}</fieldset>
          </div>
          <div className={styles.workDeck} data-work-deck>{caseStudies.map((study, index) => <article id={study.slug} className={styles.projectChapter} data-work-panel data-project={study.slug} aria-labelledby={`${study.slug}-heading`} tabIndex={-1} key={study.slug}>
            <div className={styles.projectPlane} data-work-plane aria-hidden="true" />
            <div className={styles.chapterContent} data-work-content>
              <div className={styles.projectCopy} data-work-copy>
                <div className={styles.projectTitleLine}><span className={styles.projectNumber} aria-label={`Project ${index + 1} of 4`}>0{index + 1}</span><div className={styles.titleClip}><h3 id={`${study.slug}-heading`} data-work-title translate="no">{study.name}</h3></div></div>
                <p className={styles.projectPurpose}>{study.headline}</p>
                <p className={styles.projectSummary}>{study.summary}</p>
                <dl className={styles.projectMetadata}><div><dt>Current state</dt><dd>{study.status}<span className={styles.statusDetail}>{study.statusDetail}</span></dd></div>{study.technologies.length > 0 && <div><dt>Technologies</dt><dd className={styles.technologies}>{study.technologies.join(" / ")}</dd></div>}</dl>
                <Link className={`text-link ${styles.caseLink}`} data-work-case-link href={`/work/${study.slug}`}><span>Explore {study.name}</span><ArrowUpRight size={18} aria-hidden="true" /></Link>
              </div>
              <WorkspaceScene study={study}><ProjectScreens study={study} /></WorkspaceScene>
            </div>
          </article>)}</div>
          <footer className={styles.workFooter} data-work-cta><p>Four projects. Different constraints.</p><a className="text-link" href="#engineering"><span>Into the engineering</span><ArrowDown size={17} aria-hidden="true" /></a><span className={styles.workMeter} aria-hidden="true"><span data-work-meter /></span></footer>
        </div>
      </WorkspaceInteraction>
    </ProjectJourney>
  </section>;
}
