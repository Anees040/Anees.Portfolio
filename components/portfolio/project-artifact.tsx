import Image from "next/image";
import type { CaseStudy } from "@/lib/case-studies";

export function ProjectArtifact({ study }: { study: CaseStudy }) {
  const images = study.screenshots.slice(0, 2);
  return <figure className={`folio-artifact folio-artifact-${study.slug}`}>
    {images.length ? <div className="folio-screens">{images.map((image, index) => <Image key={image.src} src={image.src} width={image.width} height={image.height} alt={image.alt} sizes="(max-width: 767px) 42vw, (max-width: 1023px) 32vw, 250px" className={index ? "folio-screen-secondary" : "folio-screen-primary"} />)}</div> : <div className="folio-concept">
      <svg viewBox="0 0 600 420" fill="none" aria-hidden="true"><path className="folio-court-ground" d="M75 330 240 80 545 140 375 390Z" /><g className="folio-court-lines"><path data-thread-draw pathLength="1" d="M98 316 247 102 518 155 365 367ZM173 209l269 55M320 117 230 342" /><path data-thread-draw pathLength="1" d="m132 268 75-110 50 10-75 111ZM411 201l49 10-73 109-50-10Z" /><ellipse cx="302" cy="237" rx="48" ry="25" transform="rotate(-33 302 237)" /></g><path data-thread-draw pathLength="1" className="folio-court-thread" d="M44 372C163 393 169 314 243 292S384 166 558 67" /><circle className="folio-court-point" cx="243" cy="292" r="6" /><circle className="folio-court-point" cx="454" cy="117" r="6" /></svg>
      <div className="folio-connections"><span>Player</span><span>Venue &amp; time</span><span>Match</span></div>
    </div>}
    <figcaption>{images.length ? `${study.name} · Application screens` : "SportLynk · Conceptual product connections · In development"}</figcaption>
  </figure>;
}
