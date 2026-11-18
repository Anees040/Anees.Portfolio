import Image from "next/image";
import { caseStudies } from "@/lib/case-studies";
import { ProjectArtifact } from "./project-artifact";

export function TrailArtifact({ chapter }: { chapter: number }) {
  if (chapter === 3) return <ProjectArtifact study={caseStudies[0]} />;
  if (chapter === 1) return <figure className="thread-routines"><div>{[caseStudies[1], caseStudies[2]].map(study => <div key={study.slug}><Image src={study.screenshots[0].src} width={study.screenshots[0].width} height={study.screenshots[0].height} alt={study.screenshots[0].alt} sizes="(max-width: 767px) 36vw, 200px" /><span>{study.name}</span></div>)}</div><figcaption>Two routines. Different constraints.<br />Screens from the public repositories.</figcaption></figure>;
  if (chapter === 2) return <figure className="thread-system"><Image src={caseStudies[3].screenshots[0].src} width={caseStudies[3].screenshots[0].width} height={caseStudies[3].screenshots[0].height} alt={caseStudies[3].screenshots[0].alt} sizes="(max-width: 767px) 42vw, 220px" /><div><span>Flutter interface</span><span>Course records</span><span>Firebase</span></div><figcaption>EduVerse · Simplified source responsibilities.<br />Authentic repository screenshot.</figcaption></figure>;
  return <figure className={`thread-type-study ${chapter === 4 ? "thread-direction" : "thread-foundation"}`}><div>{(chapter === 4 ? ["Mobile.", "Data.", "Product."] : ["A need.", "A model.", "A working idea."]).map((word, index) => <span key={word}><small aria-hidden="true">0{index + 1}</small><span className="thread-study-word">{word}</span></span>)}</div><figcaption>{chapter === 4 ? "A developing practice, connected." : "Software Engineering · From an idea to an application."}</figcaption></figure>;
}
