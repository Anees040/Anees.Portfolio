import { ArrowUp, ArrowUpRight, MessageCircle } from "lucide-react";
import { profile } from "@/lib/portfolio-content";
import { profileContent } from "@/lib/profile-content";
import { Monogram } from "./monogram";
import { TextLink } from "./text-link";

export function Contact() {
  return (
    <footer id="contact" className="contact-section" aria-labelledby="contact-heading" tabIndex={-1}>
      <div className="site-shell">
        <div className="contact-main" data-reveal data-reveal-group><div><h2 id="contact-heading">Good things start<br />with a <em>conversation.</em></h2><p>A project, an opportunity, or a shared curiosity.<br />I’d be glad to hear from you.</p></div><a className="contact-orbit" href={`mailto:${profile.email}`} aria-label="Say hello to Anees by email"><ArrowUpRight size={44} strokeWidth={1.2} aria-hidden="true" /><span>Say hello</span></a></div>
        <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={23} strokeWidth={1.5} aria-hidden="true" /></a>
        <div id="ask-anees" className="ask-preview" tabIndex={-1}><div className="ask-preview-title"><MessageCircle size={22} strokeWidth={1.5} aria-hidden="true" /><h3>Ask me about the work.</h3></div><p>Ask Anees AI is a planned feature. Today, the conversation starts with an email to me.</p><TextLink href={`mailto:${profile.email}?subject=A%20question%20for%20Anees`}>Send a question</TextLink></div>
        <div className="footer-bottom"><a className="footer-brand" href="#home" aria-label="Anees — back to home"><Monogram /><span>Anees.</span></a><p>Thoughtfully built, always evolving.</p><div className="footer-links"><a href={profile.github}>GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>{profileContent.linkedin && <a href={profileContent.linkedin}>LinkedIn <ArrowUpRight size={14} aria-hidden="true" /></a>}{profileContent.resume && <a href={profileContent.resume.href} download>{profileContent.resume.label}<ArrowUpRight size={14} aria-hidden="true" /></a>}<a href="#home">Back to top <ArrowUp size={14} aria-hidden="true" /></a></div></div>
      </div>
    </footer>
  );
}
