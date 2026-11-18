import { ArrowUpRight } from "lucide-react";
import { journeyChapters } from "@/lib/profile-content";
import Link from "next/link";
import { projects } from "@/lib/portfolio-content";
import { TrailMotion } from "./trail-motion";
import { TrailArtifact } from "./trail-artifact";

export function BuildTrail() {
  return <section id="journey" tabIndex={-1} className="build-trail section-space thread-section" aria-labelledby="trail-heading"><div className="site-shell">
    <div className="section-heading-row"><h2 id="trail-heading">Follow<br /><em>the Thread.</em></h2><p>From learning to building: five connected chapters of a developing practice. A thematic journey, not an employment timeline.</p></div>
    <TrailMotion scene={<>{journeyChapters.map((chapter, index) => <div className="thread-scene-sheet" data-sheet={index} key={chapter.id}><div className="thread-sheet-caption"><span>Chapter 0{index + 1} / 05</span><span>{chapter.label}</span></div><TrailArtifact chapter={index} /></div>)}</>}>
      <nav className="thread-navigation" aria-label="Journey chapters">{journeyChapters.map((chapter, index) => <a href={`#trail-${chapter.id}`} key={chapter.id} aria-label={`Chapter ${index + 1}: ${chapter.title}`}><span aria-hidden="true">0{index + 1}</span><span>{["Foundation", "Everyday", "Underneath", "SportLynk", "Direction"][index]}</span></a>)}</nav>
      <ol className="trail-chapters">{journeyChapters.map((chapter, index) => <li id={`trail-${chapter.id}`} tabIndex={-1} key={chapter.id}>
        <span className="trail-chapter-number" aria-hidden="true">0{index + 1}</span><article><h3>{chapter.title}</h3><p className="trail-label">{chapter.label}{chapter.period && <span className="trail-period"> · {chapter.period}</span>}</p><p>{chapter.body}</p><div className="trail-reading-artifact"><TrailArtifact chapter={index} /></div>{chapter.projects && <div className="trail-project-artifacts">{chapter.projects.map(slug => <Link key={slug} className="trail-project-artifact" href={`/work/${slug}`}><span>{projects.find(project => project.slug === slug)?.name}<ArrowUpRight size={15} aria-hidden="true" /></span></Link>)}</div>}<p className="trail-artifact">{chapter.artifact}</p><a className="text-link" href={chapter.href}><span>{chapter.link}</span><ArrowUpRight size={17} aria-hidden="true" /></a></article>
      </li>)}</ol>
    </TrailMotion>
    <div className="thread-end"><span>The thread continues.</span><a className="text-link" href="#playground"><span>Put a question to the test</span><ArrowUpRight size={18} aria-hidden="true" /></a></div>
  </div></section>;
}
