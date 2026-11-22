import type { Source } from "./protocol.ts";

// Every citation is registered here, never supplied by the model or visitor.
export const sources: Record<string, Source> = {
  profile: { id: "profile", title: "About Anees", href: "/#about" },
  education: { id: "education", title: "Education", href: "/#about" },
  skills: { id: "skills", title: "Skills", href: "/#engineering" },
  experience: { id: "experience", title: "Development journey", href: "/#journey" },
  sportlynk: { id: "sportlynk", title: "SportLynk case study", href: "/work/sportlynk" },
  fitpilot: { id: "fitpilot", title: "FitPilot case study", href: "/work/fitpilot" },
  sukoon: { id: "sukoon", title: "Sukoon case study", href: "/work/sukoon" },
  eduverse: { id: "eduverse", title: "EduVerse case study", href: "/work/eduverse" },
  engineering: { id: "engineering", title: "Engineering", href: "/#engineering" },
  certificates: { id: "certificates", title: "Certificates & credentials", href: "/#certificates" },
  goals: { id: "goals", title: "Current direction", href: "/#contact" },
  contact: { id: "contact", title: "Contact Anees", href: "/#contact" },
  portfolio: { id: "portfolio", title: "Build Circuit & Concurrency Lab", href: "/#building" },
};

export const approvedDocuments = [
  { file: "profile.md", sourceId: "profile" },
  { file: "education.md", sourceId: "education" },
  { file: "skills.md", sourceId: "skills" },
  { file: "experience.md", sourceId: "experience" },
  { file: "sportlynk.md", sourceId: "sportlynk", projectSlug: "sportlynk" },
  { file: "fitpilot.md", sourceId: "fitpilot", projectSlug: "fitpilot" },
  { file: "sukoon.md", sourceId: "sukoon", projectSlug: "sukoon" },
  { file: "eduverse.md", sourceId: "eduverse", projectSlug: "eduverse" },
  { file: "engineering-decisions.md", sourceId: "engineering" },
  { file: "certificates.md", sourceId: "certificates" },
  { file: "professional-goals.md", sourceId: "goals" },
  { file: "contact.md", sourceId: "contact" },
  { file: "portfolio.md", sourceId: "portfolio" },
] as const;
