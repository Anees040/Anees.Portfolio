import { ArrowUpRight } from "lucide-react";
import { journeyChapters } from "@/lib/profile-content";
import Link from "next/link";
import { projects } from "@/lib/portfolio-content";
import { TrailMotion } from "./trail-motion";
import { TrailArtifact } from "./trail-artifact";
import styles from "./thread-scene.module.css";

export function BuildTrail() {
  return <section id="journey" tabIndex={-1} className="build-trail section-space thread-section" aria-labelledby="trail-heading"><div className="site-shell">
    <div className="section-heading-row"><h2 id="trail-heading">Follow<br /><em>the Thread.</em></h2><p>From learning to building: five connected chapters of a developing practice. A thematic journey, not an employment timeline.</p></div>
    <TrailMotion>
      <nav className={`thread-navigation ${styles.navigation}`} data-thread-navigation aria-label="Journey chapters">{journeyChapters.map((chapter, index) => <a href={`#trail-${chapter.id}`} key={chapter.id} aria-label={`Chapter ${index + 1}: ${chapter.title}`}><span aria-hidden="true">0{index + 1}</span><span>{["Foundation", "Everyday", "Underneath", "SportLynk", "Direction"][index]}</span></a>)}</nav>
      <ol className={`trail-chapters ${styles.chapters}`} data-thread-deck>{journeyChapters.map((chapter, index) => <li id={`trail-${chapter.id}`} tabIndex={-1} key={chapter.id} className={styles.chapter} data-thread-panel data-thread-index={index} aria-labelledby={`trail-${chapter.id}-heading`}>
        <div className={styles.plane} data-thread-plane aria-hidden="true" />
        <span className={styles.ordinal} aria-hidden="true">0{index + 1}</span>
        <div className={styles.chapterContent} data-thread-content>
          <article className={styles.copy} data-thread-copy>
            <h3 id={`trail-${chapter.id}-heading`}>{chapter.title}</h3>
            <p className={styles.chapterLabel}>{chapter.label}{chapter.period && <span className="trail-period"> · {chapter.period}</span>}</p>
            <p className={styles.story}>{chapter.body}</p>
            {chapter.projects && <div className={`trail-project-artifacts ${styles.projectLinks}`}>{chapter.projects.map(slug => <Link key={slug} className="trail-project-artifact" href={`/work/${slug}`}><span>{projects.find(project => project.slug === slug)?.name}<ArrowUpRight size={15} aria-hidden="true" /></span></Link>)}</div>}
            <p className={styles.annotation} data-thread-annotation>{chapter.artifact}</p>
            <a className="text-link" href={chapter.href}><span>{chapter.link}</span><ArrowUpRight size={17} aria-hidden="true" /></a>
          </article>
          <div className={`trail-reading-artifact thread-scene-sheet ${styles.artifact}`} data-thread-artifact data-sheet={index}><TrailArtifact chapter={index} /></div>
        </div>
      </li>)}</ol>
      <div className={styles.continue} data-thread-cta><span className={styles.closing}>The thread continues.</span><span className={styles.readout} data-thread-readout aria-hidden="true">Chapter 01 / 05</span><a className="text-link" href="#playground"><span>Continue to Always Building</span><ArrowUpRight size={18} aria-hidden="true" /></a></div>
    </TrailMotion>
  </div></section>;
}
