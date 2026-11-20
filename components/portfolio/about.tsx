import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/portfolio-content";
import { profileContent } from "@/lib/profile-content";
import { AboutMotion } from "./about-motion";
import styles from "./about-work.module.css";

export function About() {
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
              <div className={styles.aboutActions}>
                <a className="text-link" href={profile.github}><span>Follow the work on GitHub</span><ArrowUpRight size={18} aria-hidden="true" /></a>
                <a className="text-link" href={`mailto:${profile.email}`}><span>Get in touch</span><ArrowUpRight size={18} aria-hidden="true" /></a>
                {profileContent.resume && <a className="text-link" href={profileContent.resume.href}><span>{profileContent.resume.label}</span><ArrowUpRight size={18} aria-hidden="true" /></a>}
                {profileContent.linkedin && <a className="text-link" href={profileContent.linkedin}><span>LinkedIn</span><ArrowUpRight size={18} aria-hidden="true" /></a>}
              </div>
            </div>
            <div className={styles.factNotebook} data-about-facts>
              <h3>At a glance</h3>
              <dl>
                  <div><dt>Education</dt><dd>{profileContent.education.description}<br />{profileContent.education.institution}{profileContent.education.dates && <span>{profileContent.education.dates}</span>}</dd></div>
                  <div><dt>Development interests</dt><dd>{profileContent.interests.join(" · ")}</dd></div>
                  <div><dt>Currently building</dt><dd>{profileContent.building}</dd></div>
                  <div><dt>Currently exploring</dt><dd>{profileContent.learning}</dd></div>
                  <div><dt>Professional direction</dt><dd>{profileContent.direction}</dd></div>
              </dl>
            </div>
            <figure className={styles.aboutIllustration} data-about-working>
              <Image src="/assets/character/anees-working-illustration.png" width={1402} height={1122} alt="Illustration of Muhammad Anees working at a laptop." unoptimized />
            </figure>
          </div>
          <div className={styles.aboutNext}><span>Ideas, made into software.</span><a className="text-link" href="#work"><span>Selected Work</span><ArrowDown size={18} aria-hidden="true" /></a></div>
        </div>
      </AboutMotion>
    </section>
  );
}
