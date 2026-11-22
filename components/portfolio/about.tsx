import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/portfolio-content";
import { profileContent } from "@/lib/profile-content";
import { aboutCharacterAssets } from "@/lib/character-assets";
import { AboutMotion } from "./about-motion";
import styles from "./about-work.module.css";

export function About() {
  const artwork = aboutCharacterAssets?.idle;
  return (
    <section id="about" className={styles.about} aria-labelledby="about-heading" tabIndex={-1}>
      <AboutMotion>
        <div className="site-shell">
          <header className={styles.aboutHeading}>
            <h2 id="about-heading">About</h2>
            <p>The person behind the projects.</p>
          </header>
          <div className={styles.aboutLayout}>
            <div className={styles.aboutCopy} data-about-copy>
              <p className={styles.aboutLead}>{profileContent.introduction}</p>
              <p className={styles.aboutPhilosophy}>{profileContent.philosophy}</p>
              <p className={styles.aboutPhilosophy}>{profileContent.practice}</p>
              <div className={styles.aboutActions}>
                <a className="text-link" href={profile.github}><span>Follow the work on GitHub</span><ArrowUpRight size={18} aria-hidden="true" /></a>
                <a className="text-link" href={`mailto:${profile.email}`}><span>Get in touch</span><ArrowUpRight size={18} aria-hidden="true" /></a>
                <a className="text-link" href="#skills"><span>Explore my technical skills</span><ArrowUpRight size={18} aria-hidden="true" /></a>
                {profileContent.resume && <a className="text-link" href={profileContent.resume.href} download><span>{profileContent.resume.label}</span><ArrowUpRight size={18} aria-hidden="true" /></a>}
                {profileContent.linkedin && <a className="text-link" href={profileContent.linkedin}><span>LinkedIn</span><ArrowUpRight size={18} aria-hidden="true" /></a>}
              </div>
            </div>
            <div className={styles.factNotebook} data-about-facts>
              <h3>At a glance</h3>
              <dl>
                  <div id="education" tabIndex={-1}><dt>Education</dt><dd>{profileContent.education.description}<br />{profileContent.education.institution}{profileContent.education.dates && <span>{profileContent.education.dates}</span>}</dd></div>
                  <div><dt>Development interests</dt><dd>{profileContent.interests.join(" · ")}</dd></div>
                  <div><dt>Currently building</dt><dd>{profileContent.building}</dd></div>
                  <div><dt>Currently exploring</dt><dd>{profileContent.learning}</dd></div>
                  <div><dt>Professional direction</dt><dd>{profileContent.direction}</dd></div>
              </dl>
            </div>
            {artwork && <figure className={styles.aboutIllustration} data-about-working>
              <Image src={artwork.src} width={artwork.width} height={artwork.height} alt={artwork.alt} unoptimized={artwork.unoptimized} />
              <figcaption><a className="text-link" href="#build-circuit"><span>Try an experiment from my workbench</span><ArrowUpRight size={17} aria-hidden="true" /></a></figcaption>
            </figure>}
          </div>
          <div className={styles.aboutNext}><span>Ideas, made into software.</span><a className="text-link" href="#work"><span>Selected Work</span><ArrowDown size={18} aria-hidden="true" /></a></div>
        </div>
      </AboutMotion>
    </section>
  );
}
