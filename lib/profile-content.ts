import type { ProjectSlug, StoryImage } from "./case-studies";

export type ProfileContent = {
  introduction: string; education: { institution: string; description: string; dates?: string };
  interests: string[]; philosophy: string; learning: string; building: string; direction: string;
  photograph?: StoryImage; resume?: { href: string; label: string }; linkedin?: string;
};
export const profileContent: ProfileContent = {
  introduction: "I’m Muhammad Anees, a Software Engineering student interested in the space between a useful idea and the software that makes it work.",
  education: { institution: "COMSATS University Islamabad", description: "Studying Software Engineering" },
  interests: ["Mobile development", "Backend engineering", "Product design"],
  philosophy: "My projects begin with everyday needs: a quieter prayer routine, a more useful fitness plan, a connected learning experience, or a game that is easier to organize.",
  learning: "Exploring the connections between mobile interfaces, local data, backend services and applied AI tools.",
  building: "SportLynk, my flagship Final Year Project, focused on sports venue booking and competitive matchmaking.",
  direction: "Building practical digital products and going deeper into the engineering behind them.",
  photograph: { src: "/assets/profile/photo.png", width: 1268, height: 1240, alt: "Photograph of Muhammad Anees.", caption: "Muhammad Anees, software developer and student." },
};
export const engineeringAreas = [
  { id: "mobile", name: "Mobile engineering", question: "What happens after the screen closes?", body: "A useful mobile feature has a life beyond its widget tree. Sukoon connects Flutter configuration to Kotlin alarms and receivers; FitPilot keeps local records for disconnected use.", flow: ["Interface", "Device state", "Daily routine"], projects: [{ name: "Sukoon", slug: "sukoon" }, { name: "FitPilot", slug: "fitpilot" }] },
  { id: "data", name: "Backend & data", question: "What happens when copies disagree?", body: "FitPilot’s SQLite-to-Supabase sync path makes retries, identity mapping and UTC timestamps explicit. EduVerse connects course records across roles. These are concrete examples of connected application work.", flow: ["Local change", "Sync contract", "Remote record"], projects: [{ name: "FitPilot", slug: "fitpilot" }, { name: "EduVerse", slug: "eduverse" }] },
  { id: "product", name: "Product thinking", question: "What should an empty day mean?", body: "FitPilot treats a day without a log as neutral. Sukoon keeps the core prayer experience offline. Product decisions like these change the data model as much as the interface.", flow: ["Everyday need", "Product rule", "Useful behavior"], projects: [{ name: "FitPilot", slug: "fitpilot" }, { name: "Sukoon", slug: "sukoon" }] },
  { id: "architecture", name: "Application architecture", question: "Where should this responsibility live?", body: "Pure Dart engines in FitPilot handle calculations. Sukoon gives timed system behavior to Android. Different problems need different boundaries; one framework does not own every layer.", flow: ["Clear input", "Focused logic", "Explicit boundary"], projects: [{ name: "FitPilot", slug: "fitpilot" }, { name: "Sukoon", slug: "sukoon" }] },
  { id: "problem", name: "Problem solving", question: "What if both requests arrive together?", body: "The Concurrency Lab below isolates a general booking race. It is an original educational demonstration of shared state, separate from SportLynk’s private backend.", flow: ["Assumption", "Counterexample", "Better model"], projects: [{ name: "SportLynk", slug: "sportlynk" }] },
  { id: "ai", name: "Applied AI & automation", question: "What can the integration actually support?", body: "FitPilot and EduVerse contain AI-related capture, coaching or study-tool integrations. This is an area of learning and exploration. Repository integration does not establish model quality or production reliability.", flow: ["User input", "Model integration", "User review"], projects: [{ name: "FitPilot", slug: "fitpilot" }, { name: "EduVerse", slug: "eduverse" }] },
] as const;
export type JourneyChapter = {
  id: string;
  title: string;
  label: string;
  body: string;
  artifact: string;
  href: string;
  link: string;
  period?: string;
  projects?: ProjectSlug[];
};

export const journeyChapters: JourneyChapter[] = [
  { id: "foundation", title: "Build the foundation.", label: "Software Engineering", body: "Studying Software Engineering at COMSATS University Islamabad. Turning academic learning into applications gives the theory somewhere to go.", artifact: "Ideas → models → code", href: "#about", link: "Meet the person behind the work" },
  { id: "everyday", title: "Make the everyday useful.", label: "Personal projects", body: "FitPilot and Sukoon explore familiar routines: food, movement and daily prayer. Each brings a different kind of real-world constraint into the build.", artifact: "FitPilot + Sukoon", href: "/work/sukoon", link: "Explore Sukoon", projects: ["fitpilot", "sukoon"] },
  { id: "underneath", title: "Go beneath the interface.", label: "Mobile, backend & data", body: "Local persistence, native Android scheduling and connected course records are different threads of the same learning: understanding what the screen depends on.", artifact: "Flutter / Kotlin / Firebase / Supabase", href: "#engineering", link: "Inspect the engineering", projects: ["eduverse"] },
  { id: "current", title: "Connect the whole product.", label: "Current focus", body: "SportLynk is my flagship Final Year Project. Venue booking and competitive matchmaking bring the focus to the complete experience of organizing a game.", artifact: "SportLynk · In development", href: "/work/sportlynk", link: "Inside SportLynk" },
  { id: "next", title: "Keep going deeper.", label: "Direction", body: "Continue building practical software, exploring applied AI and automation, and understanding the decisions that make an application useful.", artifact: "Learning remains part of the work", href: "#contact", link: "Start a conversation" },
];
