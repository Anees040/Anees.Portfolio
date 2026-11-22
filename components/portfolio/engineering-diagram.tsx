import type { CSSProperties } from "react";
import styles from "./engineering-diagram.module.css";

const diagrams = {
  mobile: { caption: "Sukoon · A schedule that outlives the Flutter screen", nodes: [["Flutter UI", "Location & preferences", 15, 50], ["Schedule", "Versioned MethodChannel payload", 50, 50], ["Android", "Alarms, receivers & restoration", 85, 50]], paths: ["M90 110H300", "M300 110H510", "M510 150V190H300V150"] },
  data: { caption: "FitPilot · Local writes meet an explicit sync boundary", nodes: [["Local change", "SQLite record & durable queue", 15, 50], ["Sync contract", "UTC time & identity mapping", 50, 50], ["Remote record", "Supabase · push, then pull", 85, 50]], paths: ["M90 110H300", "M300 110H510", "M510 150V190H90V150"] },
  product: { caption: "FitPilot · Missing data is a neutral state", nodes: [["No food log", "An ordinary untracked day", 15, 50], ["Product rule", "No data means neutral", 50, 50], ["Day state", "No false failure", 85, 50]], paths: ["M90 110H300", "M300 110H510"] },
  architecture: { caption: "FitPilot · Burn planning stays separate from screens and storage", nodes: [["Explicit inputs", "Surplus, weight & activities", 15, 50], ["Dart engine", "Calculation without UI or storage", 50, 50], ["Result", "Estimated activity options", 85, 50]], paths: ["M90 110H300", "M300 110H510"] },
  problem: { caption: "Concurrency Lab · A simplified educational model, separate from SportLynk", nodes: [["Request A", "Sees the slot available", 20, 20], ["Request B", "Sees the same slot", 80, 20], ["Atomic claim", "Check and reserve together", 50, 51], ["A accepted", "One reservation", 20, 84], ["B declined", "The slot is taken", 80, 84]], paths: ["M120 44V112H300", "M480 44V112H300", "M300 112V185H120", "M300 112V185H480"] },
  ai: { caption: "FitPilot · Label capture keeps correction before saving", nodes: [["Label image", "A food-entry input", 15, 50], ["Recognition", "On-device text extraction", 50, 50], ["User review", "Correct, validate, then save", 85, 50]], paths: ["M90 110H300", "M300 110H510", "M510 150V190H90V150"] },
} as const;

export function EngineeringDiagram({ topic }: { topic: keyof typeof diagrams }) {
  const diagram = diagrams[topic];
  return <figure className={`${styles.diagram} ${topic === "problem" ? styles.branching : ""}`} data-engineering-diagram aria-label={diagram.caption}>
    <div className={styles.canvas}>
      <svg viewBox="0 0 600 220" preserveAspectRatio="none" fill="none" aria-hidden="true">{diagram.paths.map(path => <path key={path} d={path} pathLength="1" data-engineering-wire />)}</svg>
      {diagram.nodes.map(([title, detail, x, y]) => <div className={styles.node} data-engineering-node key={title} style={{ "--diagram-x": `${x}%`, "--diagram-y": `${y}%` } as CSSProperties}><strong>{title}</strong><span>{detail}</span></div>)}
    </div>
    <figcaption>{diagram.caption}</figcaption>
  </figure>;
}
