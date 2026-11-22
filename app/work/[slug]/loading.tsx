import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Monogram } from "@/components/portfolio/monogram";
import { profile } from "@/lib/portfolio-content";

export default function Loading() {
  return <>
    <a className="skip-link" href="#case-main">Skip to content</a>
    <header className="site-header case-header"><div className="site-shell header-inner">
      <Link className="wordmark" href="/" aria-label="Muhammad Anees — home"><Monogram /><span>Muhammad Anees</span></Link>
      <Link className="text-link" href="/#work"><ArrowLeft size={18} aria-hidden="true" /><span>All work</span></Link>
      <a href={`mailto:${profile.email}`} className="case-contact">Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></a>
    </div></header>
    <main id="case-main" tabIndex={-1} className="case-study">
      <section className="case-hero site-shell" aria-labelledby="case-loading-heading">
        <div className="case-title-row"><h1 id="case-loading-heading">Project study<span>.</span></h1></div>
        <p className="case-summary" role="status">Opening the project study…</p>
      </section>
    </main>
  </>;
}
