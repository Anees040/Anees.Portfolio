import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import type { CaseStudy } from "@/lib/case-studies";

export function ArchitectureExplorer({ architecture, id }: { architecture: CaseStudy["architecture"]; id: string }) {
  return <div className="architecture-explorer">
    <p className="diagram-description">{architecture.description}</p>
    <div className="architecture-flow">
      {architecture.nodes.map((node, index) => <div className="architecture-station" key={node.title}>
        <details name={`architecture-${id}`} open={index === 0}>
          <summary><span className="architecture-index" aria-hidden="true">0{index + 1}</span><span>{node.title}<small>{node.technology}</small></span><Plus size={20} aria-hidden="true" /></summary>
          <div className="architecture-detail"><p>{node.body}</p>{node.evidence && <a className="text-link" href={node.evidence.href}><span>{node.evidence.label}</span><ArrowUpRight size={16} aria-hidden="true" /></a>}</div>
        </details>
        {index < architecture.nodes.length - 1 && <ArrowDown className="architecture-connector" size={24} strokeWidth={1} aria-hidden="true" />}
      </div>)}
    </div>
    <p className="diagram-caption">{architecture.conceptual ? "Conceptual illustration · Product relationships" : "Source-based technical illustration · Select a layer to inspect"}</p>
  </div>;
}
