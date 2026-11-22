import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { engineeringAreas } from "@/lib/profile-content";
import { EngineeringDiagram } from "./engineering-diagram";
import { EngineeringMotion } from "./engineering-motion";
import { TechnicalSkills } from "./technical-skills";

export function Engineering() {
  return <section id="engineering" tabIndex={-1} className="engineering-section" aria-labelledby="engineering-heading"><div className="site-shell">
    <div className="engineering-heading"><h2 id="engineering-heading">The interface is<br /><em>only the beginning.</em></h2><p>Select a thread. Follow it into the work.<br />The interesting decisions often live underneath.</p></div>
    <EngineeringMotion><div className="engineering-workbook">{engineeringAreas.map((area, index) => <details key={area.id} name="engineering-area" open={index === 0} className="engineering-area" data-engineering-topic={area.id}>
      <summary><span>{area.name}</span><Plus size={22} strokeWidth={1.2} aria-hidden="true" /></summary>
      <div className="engineering-answer"><h3>{area.question}</h3><EngineeringDiagram topic={area.id} /><div className="engineering-flow" aria-label="Conceptual responsibility flow">{area.flow.map((step, i) => <span key={step}>{step}{i < area.flow.length - 1 && <ArrowRight size={18} aria-hidden="true" />}</span>)}</div><p>{area.body}</p><div className="engineering-projects">{area.projects.map(project => <Link href={`/work/${project.slug}`} key={project.slug}>{project.name}<ArrowUpRight size={17} aria-hidden="true" /></Link>)}{area.id === "problem" && <a href="#playground">Try the lab<ArrowUpRight size={17} aria-hidden="true" /></a>}</div></div>
    </details>)}</div></EngineeringMotion>
    <TechnicalSkills />
  </div></section>;
}
