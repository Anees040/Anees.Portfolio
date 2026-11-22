import type { CSSProperties } from "react";
import type { ProjectSlug } from "@/lib/case-studies";
import { ScrollLayers } from "./scroll-layers";

const diagrams = {
  sportlynk: {
    caption: "Conceptual booking lifecycle · Design concerns for the team’s work in progress",
    explanation: "A request, a payment response and a reservation are different states. This conceptual sequence shows the responsibilities I want to keep connected, including cancellation and check-in. It is not an implemented backend diagram.",
    nodes: [ ["Request", "Player + venue + time", 12, 30], ["Coordinate", "Owner & payment state", 50, 30], ["Confirm", "One accepted reservation", 88, 30], ["Cancel / release", "Lifecycle concern", 30, 78], ["Check in", "Attendance state", 76, 78] ],
    paths: ["M110 115H450", "M450 115H790", "M450 115V225H270V290", "M790 115V290H680"],
  },
  fitpilot: {
    caption: "Implemented responsibility flow · Calculation and local storage stay separate",
    explanation: "The food-to-plan calculation uses explicit domain inputs. Local records and the durable queue support disconnected use; synchronization maps identities and sends pending changes before pulling remote data.",
    nodes: [ ["Food input", "Search · manual · capture", 12, 30], ["Domain engines", "Range · burn plan · day state", 50, 30], ["Local records", "SQLite", 88, 30], ["Durable queue", "Pending writes & retry", 68, 78], ["Cloud sync", "Supabase · push then pull", 27, 78] ],
    paths: ["M110 115H450", "M450 115H790", "M790 115V225H610V290", "M610 290H245"],
  },
  sukoon: {
    caption: "Implemented platform boundary · Flutter configures; Android schedules and restores",
    explanation: "A versioned schedule crosses the MethodChannel boundary. Android persists and executes timed actions without depending on an open Flutter screen. Permissions and restoring the previous interruption filter belong to the same workflow.",
    nodes: [ ["Preferences", "Location & prayer settings", 15, 26], ["Schedule", "Versioned payload", 50, 26], ["Native storage", "MethodChannel → Android", 85, 26], ["Alarm / receiver", "Timed interruption change", 76, 76], ["Restore", "Previous interruption state", 27, 76] ],
    paths: ["M135 100H450", "M450 100H765", "M765 100V210H685V285", "M685 285H245"],
  },
  eduverse: {
    caption: "Implemented data relationships · Shared identities across role-specific views",
    explanation: "Teacher and global course records refer to the same course identity. Quizzes link to a course; attempts link a student, quiz and course. Separate writes to teacher and global views create a consistency responsibility.",
    nodes: [ ["Teacher", "Creates & manages", 14, 26], ["Course ID", "Teacher + global records", 50, 26], ["Student", "Enrollment & learning", 86, 26], ["Quiz", "Course-linked assessment", 30, 77], ["Attempt", "Student + quiz + course", 74, 77] ],
    paths: ["M125 100H450", "M450 100H775", "M450 100V210H270V290", "M775 100V290H665", "M270 290H665"],
  },
} as const;

export function CaseDiagram({ slug }: { slug: ProjectSlug }) {
  const diagram = diagrams[slug];
  return <figure className={`case-system-map map-${slug}`}>
    <ScrollLayers>
      <div className="case-map-canvas">
        <svg viewBox="0 0 900 380" fill="none" preserveAspectRatio="none" aria-hidden="true">{diagram.paths.map(path => <path key={path} d={path} data-case-draw pathLength="1" />)}</svg>
        {diagram.nodes.map(([label, detail, x, y]) => <div className="case-map-node" data-case-node key={label} style={{ "--node-x": `${x}%`, "--node-y": `${y}%` } as CSSProperties}><strong>{label}</strong><span>{detail}</span></div>)}
      </div>
    </ScrollLayers>
    <figcaption>{diagram.caption}</figcaption><p>{diagram.explanation}</p>
  </figure>;
}
