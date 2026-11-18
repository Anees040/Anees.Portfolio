import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { caseStudies } from "@/lib/case-studies";
import { WorkspaceInteraction } from "./workspace-interaction";
import { ProjectArtifact } from "./project-artifact";

export function WorkspaceScene() {
  return <section id="workspace" className="workspace-section section-space" aria-labelledby="workspace-heading" tabIndex={-1}>
    <div className="site-shell">
      <div className="workspace-intro"><h2 id="workspace-heading">Anees’s<br /><em>Digital Atelier.</em></h2><div><p>A closer look at the work: the product, the decisions beneath it, and what comes next.</p><p className="atelier-invitation">Choose a project. Open a different perspective.</p></div></div>
      <WorkspaceInteraction>
        <fieldset className="atelier-project-index"><legend className="visually-hidden">Choose an atelier project</legend>{caseStudies.map((study, index) => <label key={study.slug} className="atelier-project-choice"><input type="radio" name="atelier-project" value={study.slug} defaultChecked={index === 0} /><span><span className="atelier-index-number" aria-hidden="true">0{index + 1}</span>{study.name}<ArrowUpRight size={16} aria-hidden="true" /></span></label>)}</fieldset>
        <div className="atelier-view-bar"><span className="atelier-view-prompt">The work, in focus</span><fieldset className="atelier-view-index"><legend className="visually-hidden">Choose an atelier view</legend>{[{ id: "projects", name: "Projects" }, { id: "notes", name: "Engineering Notes" }, { id: "log", name: "Build Log" }].map((view, index) => <label key={view.id}><input type="radio" name="atelier-view" value={view.id} defaultChecked={index === 0} /><span>{view.name}</span></label>)}</fieldset></div>
        <div className="atelier-work-surface">{caseStudies.map(study => <div className="atelier-project-panel" data-project={study.slug} key={study.slug}>
          <article className="atelier-project-view" data-view="projects" aria-label={`${study.name} project presentation`}>
            <div className="atelier-project-copy"><h3>{study.name}<em>.</em></h3><p className="atelier-project-purpose">{study.headline}</p><p>{study.summary}</p><Link className="text-link atelier-study-link" href={`/work/${study.slug}`}><span>Explore {study.name}</span><ArrowUpRight size={18} aria-hidden="true" /></Link><dl className="atelier-metadata"><div><dt>Current state</dt><dd>{study.status}</dd></div>{study.technologies.length > 0 && <div><dt>Technologies</dt><dd className="atelier-technologies">{study.technologies.join(" / ")}</dd></div>}</dl></div>
            <ProjectArtifact study={study} />
            <div className="atelier-context"><p>{study.statusDetail}</p><p>{study.decisions[0]?.title}</p></div>
          </article>
          <article className="atelier-notes-view" data-view="notes" aria-label={`${study.name} engineering notes`}><div className="atelier-note-title"><h3>Inside<br /><em>{study.name}.</em></h3><p>{study.architecture.conceptual ? "Product questions and a separate educational experiment. Not private implementation evidence." : "Engineering observations from the reviewed public source. Not a personal contribution audit."}</p><Link className="text-link" href={`/work/${study.slug}#decisions`}><span>Open the complete study</span><ArrowUpRight size={17} aria-hidden="true" /></Link></div><div className="atelier-notes">{[study.slug === "fitpilot" ? study.features[2] : study.decisions[0], study.challenges[0]].filter(Boolean).map((note, index) => <section key={note.title} aria-label={index ? "Engineering constraint" : "Engineering decision"}><h4>{note.title}</h4><p>{note.body}</p>{note.evidence && <a href={note.evidence.href} className="text-link"><span>{note.evidence.label}</span><ArrowUpRight size={16} aria-hidden="true" /></a>}</section>)}</div></article>
          <article className="atelier-log-view" data-view="log" aria-label={`${study.name} build log`}><div className="atelier-note-title"><h3>The build,<br /><em>as it stands.</em></h3><p>{study.name} · A documented snapshot, not a reconstructed commit history.</p><Link className="text-link" href={`/work/${study.slug}#outcome`}><span>Read the project record</span><ArrowUpRight size={17} aria-hidden="true" /></Link></div><div className="atelier-build-record"><section><h4>{study.status}</h4><p>{study.outcomes}</p></section><section><h4>Next documented direction</h4><ul>{study.nextSteps.map(step => <li key={step}>{step}</li>)}</ul></section><p className="atelier-record-source">Based on the portfolio’s evidence-linked case study. Roadmap items are not presented as completed work.</p></div></article>
        </div>)}</div>
      </WorkspaceInteraction>
    </div>
  </section>;
}
