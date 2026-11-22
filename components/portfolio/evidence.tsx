import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile, projects } from "@/lib/portfolio-content";
import { caseStudies } from "@/lib/case-studies";
import { Certificates } from "./certificates";
import styles from "./professional-profile.module.css";

export function Evidence() {
  return <section id="evidence" tabIndex={-1} className="evidence-section section-space" aria-labelledby="evidence-heading"><div className={`site-shell ${styles.evidenceShell}`}><div className="section-heading-row"><h2 id="evidence-heading">The work is<br /><em>open to inspection.</em></h2><p>I build and learn through practical projects.<br />These studies show the work and my role in it.</p></div>
    <div className={styles.proof}>{caseStudies.map(study => {
      const project = projects.find(project => project.slug === study.slug);
      return <article className={styles.proofRow} key={study.slug} data-professional-project={study.slug}>
        <div><h3><Link href={`/work/${study.slug}`}>{study.name}<ArrowUpRight size={20} aria-hidden="true" /></Link></h3><p className={styles.proofStatus}>{study.status}<br />{study.statusDetail}</p></div>
        <p className={styles.proofRole}>{study.role}</p>
        <div className={styles.proofLinks}><Link href={`/work/${study.slug}`} aria-label={`Read the study: ${study.name}`}>Read the study<ArrowUpRight size={16} aria-hidden="true" /></Link>{project && <a href={project.repository} aria-label={`View source: ${project.name} on GitHub`}>View source<ArrowUpRight size={16} aria-hidden="true" /></a>}</div>
      </article>;
    })}</div>
    <div className={styles.proofProfile}><a className="text-link" href={profile.github}><span>Explore my GitHub profile</span><ArrowUpRight size={18} aria-hidden="true" /></a><p>Public repositories and genuine application screens accompany the studies. SportLynk is a team project in development; its public study presents the conceptual product direction.</p></div>
    <p className="evidence-date">Repository source reviewed 16 November 2026. Repository links checked 22 November 2026. Status describes the project evidence, not production adoption.</p>
    <Certificates />
  </div></section>;
}
