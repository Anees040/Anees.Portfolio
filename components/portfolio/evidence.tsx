import { ArrowUpRight, GitBranch } from "lucide-react";
import { projects } from "@/lib/portfolio-content";

export function Evidence() {
  return <section className="evidence-section section-space" aria-labelledby="evidence-heading"><div className="site-shell"><div className="section-heading-row"><h2 id="evidence-heading">The work is<br /><em>open to inspection.</em></h2><p>Public repositories. Real source.<br />A closer look is welcome.</p></div><div className="evidence-repositories">{projects.map(project => <a href={project.repository} key={project.slug}><GitBranch size={22} strokeWidth={1.4} aria-hidden="true" /><div><h3>{project.name}</h3><p>{project.status}</p><span>{project.slug === "fitpilot" ? "Domain engines & offline synchronization" : project.slug === "sukoon" ? "Native scheduling & local prayer support" : "Role-based learning & course workflows"}</span></div><ArrowUpRight size={25} strokeWidth={1.2} aria-hidden="true" /></a>)}</div><p className="evidence-date">Repository source reviewed 16 November 2026. Status describes the project evidence, not production adoption.</p></div></section>;
}
