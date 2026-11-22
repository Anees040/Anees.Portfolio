import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { skillGroups } from "@/lib/profile-content";
import { getCaseStudy } from "@/lib/case-studies";
import styles from "./professional-profile.module.css";

export function TechnicalSkills() {
  return <section id="skills" tabIndex={-1} className={styles.skills} aria-labelledby="skills-heading">
    <div className={styles.skillsHeading}><h3 id="skills-heading">Technologies, put to work.</h3><p>I learn by building. These tools connect to actual project work; applied AI remains an area I’m exploring.</p></div>
    <div className={styles.skillGroups}>{skillGroups.map(group => <article key={group.id}>
      <div className={styles.skillTitle}><h4>{group.name}</h4><span>{group.practice}</span></div>
      <ul className={styles.technologies} aria-label={`${group.name} technologies`}>{group.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul>
      <p>{group.description}</p>
      <div className={styles.skillEvidence} aria-label={`${group.name} project evidence`}>{group.projects.map(slug => <Link href={`/work/${slug}`} key={slug}>{getCaseStudy(slug)!.name}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}</div>
    </article>)}</div>
  </section>;
}
