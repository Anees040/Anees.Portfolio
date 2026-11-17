import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { journeyChapters } from "@/lib/profile-content";
import { projects } from "@/lib/portfolio-content";
import { TrailMotion } from "./trail-motion";

export function BuildTrail() {
  return <section id="journey" tabIndex={-1} className="build-trail section-space" aria-labelledby="trail-heading"><div className="site-shell">
    <div className="section-heading-row"><h2 id="trail-heading">From learning<br /><em>to building.</em></h2><p>The build trail: chapters of a developing practice.<br />Academic learning and personal projects, connected.</p></div>
    <TrailMotion><ol className="trail-chapters">{journeyChapters.map((chapter, index) => <li id={`trail-${chapter.id}`} tabIndex={-1} key={chapter.id}>
      <span className="trail-chapter-number" aria-hidden="true">0{index + 1}</span><article><h3>{chapter.title}</h3><p className="trail-label">{chapter.label}{chapter.period && <span className="trail-period"> · {chapter.period}</span>}</p><p>{chapter.body}</p>{chapter.projects && <div className="trail-project-artifacts">{chapter.projects.map(slug => {
        const project = projects.find(item => item.slug === slug);
        if (!project) return null;
        return <Link href={`/work/${slug}`} key={slug} className="trail-project-artifact"><Image src={project.image} width={project.imageWidth} height={project.imageHeight} alt="" sizes="80px" /><span>{project.name}<ArrowUpRight size={15} aria-hidden="true" /></span></Link>;
      })}</div>}<p className="trail-artifact">{chapter.artifact}</p><a className="text-link" href={chapter.href}><span>{chapter.link}</span><ArrowUpRight size={17} aria-hidden="true" /></a></article>
    </li>)}</ol></TrailMotion>
  </div></section>;
}
