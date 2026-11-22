import { ConcurrencyLab } from "./concurrency-lab";
import { BuildCircuit } from "./build-circuit";

export function Playground() {
  return <section id="playground" tabIndex={-1} className="playground-section section-space" aria-labelledby="playground-heading"><div className="site-shell"><div className="section-heading-row"><h2 id="playground-heading">One slot.<br /><em>Two requests.</em></h2><div><p>The Concurrency Lab</p><p>A small experiment in a surprisingly big problem.<br />What happens when everyone gets there first?</p></div></div>
    <p className="lab-disclaimer">Simplified interactive demonstration. Runs entirely in this page; it is not connected to SportLynk or a live booking system.</p><ConcurrencyLab />
    <details className="lab-reading"><summary>Read the experiment and its limits</summary><div><p><strong>Unprotected:</strong> A reads available → B reads available → A accepts → B accepts. Both reservations rely on an earlier check.</p><p><strong>Protected:</strong> both may read available, but each final reservation checks and claims as one controlled operation. A accepts; B finds the slot taken.</p><p>This deterministic model illustrates an atomic boundary. It does not implement a real database lock, network latency, retries, cancellation or distributed transactions. A production system needs server-enforced constraints and its own verified design.</p></div></details>
    <section id="build-circuit" tabIndex={-1} aria-labelledby="circuit-heading" className="build-circuit-section"><BuildCircuit /></section>
  </div></section>;
}
