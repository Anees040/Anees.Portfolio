import { ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/portfolio-content";
import { profileContent } from "@/lib/profile-content";
import { Monogram } from "./monogram";
import Image from "next/image";

export function About() {
  return (
    <section id="about" className="about-section about-expanded site-shell section-space" aria-labelledby="about-heading" tabIndex={-1}>
      <div className="about-heading"><h2 id="about-heading">Anees,<br /><em>beyond the screen.</em></h2><div className="about-personal-mark">{profileContent.photograph ? <Image src={profileContent.photograph.src} width={profileContent.photograph.width} height={profileContent.photograph.height} alt={profileContent.photograph.alt} sizes="(max-width: 767px) 80vw, 400px" /> : <><Monogram /><p>Muhammad<br /><em>Anees.</em></p><span>Software developer & student</span></>}</div></div>
      <div className="about-body"><p className="about-lead">{profileContent.introduction}</p><p>{profileContent.philosophy}</p><dl className="profile-details"><div><dt>Education</dt><dd>{profileContent.education.description}<br />{profileContent.education.institution}{profileContent.education.dates && <span>{profileContent.education.dates}</span>}</dd></div><div><dt>Development interests</dt><dd>{profileContent.interests.join(" · ")}</dd></div><div><dt>Currently building</dt><dd>{profileContent.building}</dd></div><div><dt>Currently exploring</dt><dd>{profileContent.learning}</dd></div><div><dt>Where I’m heading</dt><dd>{profileContent.direction}</dd></div></dl><a className="text-link" href={profile.github}><span>Follow the work on GitHub</span><ArrowUpRight size={18} aria-hidden="true" /></a>{profileContent.resume && <a className="text-link" href={profileContent.resume.href}><span>{profileContent.resume.label}</span><ArrowUpRight size={18} aria-hidden="true" /></a>}{profileContent.linkedin && <a className="text-link" href={profileContent.linkedin}><span>LinkedIn</span><ArrowUpRight size={18} aria-hidden="true" /></a>}</div>
    </section>
  );
}
