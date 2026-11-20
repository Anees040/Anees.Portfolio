import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/portfolio-content";
import { profileContent } from "@/lib/profile-content";
import { resolveCharacterFrame, workspaceCharacterAssets } from "@/lib/character-assets";
import { AboutMotion } from "./about-motion";
import styles from "./about-work.module.css";

export function About() {
  const working = workspaceCharacterAssets ? resolveCharacterFrame(workspaceCharacterAssets, "working", 0) : null;
  const image = profileContent.photograph ?? working;

  return (
    <section id="about" className={styles.about} aria-labelledby="about-heading" tabIndex={-1}>
      <div className={styles.aboutBackdrop} aria-hidden="true"><span>Anees</span></div>
      <AboutMotion>
        <div className="site-shell">
          <header className={styles.aboutHeading}>
            <h2 id="about-heading">About</h2>
            <p>The person behind the projects.</p>
          </header>
          <div className={styles.aboutLayout}>
            {image && <figure className={styles.aboutIllustration} data-about-image>
              <Image
                src={image === working && working?.revision ? `${image.src}?v=${working.revision}` : image.src}
                width={image.width}
                height={image.height}
                alt={image.alt}
                sizes="(max-width: 767px) 85vw, (max-width: 1023px) 460px, 42vw"
              />
              <figcaption>{profile.name}<span>{image === working ? "Working illustration" : "Software developer & student"}</span></figcaption>
            </figure>}
            <div className={styles.aboutCopy} data-about-copy>
              <p className={styles.aboutLead}>{profileContent.introduction}</p>
              <p className={styles.aboutPhilosophy}>{profileContent.philosophy}</p>
              <div className={styles.factNotebook}>
                <h3>At a glance</h3>
                <dl>
                  <div><dt>Education</dt><dd>{profileContent.education.description}<br />{profileContent.education.institution}{profileContent.education.dates && <span>{profileContent.education.dates}</span>}</dd></div>
                  <div><dt>Development interests</dt><dd>{profileContent.interests.join(" · ")}</dd></div>
                  <div><dt>Currently building</dt><dd>{profileContent.building}</dd></div>
                  <div><dt>Currently exploring</dt><dd>{profileContent.learning}</dd></div>
                  <div><dt>Professional direction</dt><dd>{profileContent.direction}</dd></div>
                </dl>
              </div>
              <div className={styles.aboutActions}>
                <a className="text-link" href={profile.github}><span>Follow the work on GitHub</span><ArrowUpRight size={18} aria-hidden="true" /></a>
                <a className="text-link" href={`mailto:${profile.email}`}><span>Get in touch</span><ArrowUpRight size={18} aria-hidden="true" /></a>
                {profileContent.resume && <a className="text-link" href={profileContent.resume.href}><span>{profileContent.resume.label}</span><ArrowUpRight size={18} aria-hidden="true" /></a>}
                {profileContent.linkedin && <a className="text-link" href={profileContent.linkedin}><span>LinkedIn</span><ArrowUpRight size={18} aria-hidden="true" /></a>}
              </div>
            </div>
          </div>
          <div className={styles.aboutNext}><span>Ideas, made into software.</span><a className="text-link" href="#work"><span>Selected Work</span><ArrowDown size={18} aria-hidden="true" /></a></div>
        </div>
      </AboutMotion>
    </section>
  );
}
