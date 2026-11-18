import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/portfolio-content";
import { profileContent } from "@/lib/profile-content";
import { Monogram } from "./monogram";
import { CopyEmail } from "./copy-email";

async function CurrentYear() {
  await connection();
  return <span>{new Date().getFullYear()}</span>;
}

export function Contact() {
  const [address, domain] = profile.email.split("@");
  return <footer id="contact" className="contact-section contact-finale" aria-labelledby="contact-heading" tabIndex={-1}>
    <div className="site-shell">
      <div className="contact-main"><div><h2 id="contact-heading">Have something<br />worth <em>building?</em></h2><p>A project, an opportunity, or a question about the work.<br />Let’s start with a conversation.</p></div><div className="contact-current"><span>Where the thread leads</span><p>{profileContent.direction}</p><Link href="/work/sportlynk">Currently building SportLynk <ArrowUpRight size={16} aria-hidden="true" /></Link></div></div>
      <div className="contact-address-row"><div className="contact-address"><a className="contact-email" href={`mailto:${profile.email}`}>{address}@<wbr />{domain}<ArrowUpRight size={23} strokeWidth={1.5} aria-hidden="true" /></a><div className="contact-actions"><a className="contact-write" href={`mailto:${profile.email}`}>Write to Anees <ArrowUpRight size={20} aria-hidden="true" /></a><CopyEmail email={profile.email} /></div></div><div className="contact-professional"><a href={profile.github}>Explore my GitHub <ArrowUpRight size={18} aria-hidden="true" /></a>{profileContent.linkedin && <a href={profileContent.linkedin}>LinkedIn <ArrowUpRight size={18} aria-hidden="true" /></a>}{profileContent.resume && <a href={profileContent.resume.href} download>{profileContent.resume.label}<ArrowUpRight size={18} aria-hidden="true" /></a>}<span>Real work. Open sources. A developing practice.</span></div></div>
      <div className="footer-bottom"><a className="footer-brand" href="#home" aria-label="Copper Atelier — back to home"><Monogram /><span>Copper Atelier</span></a><p>© <Suspense fallback={null}><CurrentYear /></Suspense> Muhammad Anees</p><nav className="footer-links" aria-label="Footer navigation"><a href="#work">Work</a><a href="#about">About</a><a className="back-to-top" href="#home">Back to top <ArrowUp size={16} aria-hidden="true" /></a></nav></div>
    </div>
  </footer>;
}
