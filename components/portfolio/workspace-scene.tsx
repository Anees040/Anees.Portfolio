import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { CaseStudy } from "@/lib/case-studies";
import styles from "./about-work.module.css";

export function WorkspaceScene({ study, children }: { study: CaseStudy; children: ReactNode }) {
  const notes = [study.decisions[0], study.challenges[0]].filter(Boolean);

  return <div className={styles.perspectives}>
    <section className={styles.projectPresentation} data-work-view="projects" aria-label={`${study.name} project presentation`}>{children}</section>
    <section className={styles.engineeringNotes} data-work-view="notes" aria-label={`${study.name} engineering notes`}>
      <p className={styles.evidenceBoundary}>{study.architecture.conceptual ? "The product relationships and engineering questions I’m working through with my team." : "My engineering choices, and the reliability concerns underneath the experience."}</p>
      <div className={styles.notePages}>{notes.map((note, index) => <section key={note.title} aria-label={index ? "Engineering constraint" : "Engineering decision"}>
        <h4>{note.title}</h4><p>{note.body}</p>
        {note.evidence && <a href={note.evidence.href} className="text-link"><span>{note.evidence.label}</span><ArrowUpRight size={16} aria-hidden="true" /></a>}
      </section>)}</div>
      <Link className="text-link" href={`/work/${study.slug}#decisions`}><span>Open the complete study</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
    </section>
    <section className={styles.buildLog} data-work-view="log" aria-label={`${study.name} build log`}>
      <p className={styles.evidenceBoundary}>Where the project stands, and what I want to work on next.</p>
      <section><h4>{study.status}</h4><p>{study.outcomes}</p></section>
      <section><h4>My next direction</h4><ul>{study.nextSteps.map(step => <li key={step}>{step}</li>)}</ul></section>
      <p className={styles.recordSource}>{study.architecture.conceptual ? "SportLynk is still in development. These next steps describe our direction." : "The next steps describe future work, alongside the current build."}</p>
      <Link className="text-link" href={`/work/${study.slug}#outcome`}><span>Read the project record</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
    </section>
  </div>;
}
