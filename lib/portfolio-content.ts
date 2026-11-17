export type Project = {
  slug: "fitpilot" | "sukoon" | "eduverse";
  name: string;
  category: string;
  description: string;
  technologies: readonly string[];
  status: string;
  statusDetail: string;
  repository: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
};

export const profile = {
  name: "Muhammad Anees",
  email: "muhammadanees0511@gmail.com",
  github: "https://github.com/Anees040",
  introduction: "I’m a Software Engineering student and software developer interested in building practical digital products through mobile development, backend engineering and thoughtful product design.",
} as const;

export const navigation = [
  { label: "Work", href: "#work" },
  { label: "Engineering", href: "#engineering" },
  { label: "Journey", href: "#journey" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const workspaceNotes = {
  laptop: {
    title: "On the workbench: SportLynk",
    body: "My flagship Final Year Project: a sports venue booking and competitive matchmaking platform. Currently in development, with a private repository. Open the study to explore the product direction.",
    link: "Explore the project", href: "/work/sportlynk",
  },
  notebook: {
    title: "Start with the everyday problem.",
    body: "In FitPilot, a day without a food log is a neutral state. That small product choice reaches all the way into the streak engine. Naming the states carefully is part of designing the experience.",
    link: "My engineering interests", href: "#engineering",
  },
  bug: {
    title: "You found the edge case.",
    body: "This one is safely contained. But what if two players both reserve the last available slot? Checking availability is not the same as claiming it. Try that edge case in the Concurrency Lab.",
    link: "Investigate the booking race", href: "#playground",
  },
} as const;

// Evidence and status caveats are maintained in docs/CONTENT_SOURCES.md.
export const projects: readonly Project[] = [
  {
    slug: "fitpilot", name: "FitPilot", category: "Fitness & everyday health",
    description: "Making the connection between what you eat and how you move a little clearer. Food logging, personal burn plans, and workout guidance.",
    technologies: ["Flutter", "Riverpod", "Supabase"], status: "Core features built",
    statusDetail: "The public README documents the current build; a production release is not verified.",
    repository: "https://github.com/Anees040/FitPilot", image: "/projects/fitpilot-today.jpg", imageWidth: 1080, imageHeight: 2460,
    imageAlt: "FitPilot’s Today screen showing food logging, a calorie range, and activity planning.",
  },
  {
    slug: "sukoon", name: "Sukoon", category: "A quieter daily routine",
    description: "A private, offline prayer companion for Pakistan. Prayer times, automatic silent mode, prayer tracking, and Qibla direction in one place.",
    technologies: ["Flutter", "Dart", "Kotlin"], status: "Completed project",
    statusDetail: "Completed personal project; the repository also notes ongoing verification and hardening.",
    repository: "https://github.com/Anees040/sukoon", image: "/projects/sukoon-home.jpeg", imageWidth: 702, imageHeight: 1600,
    imageAlt: "Sukoon’s home screen with the next prayer, daily prayer times, and automatic silent-mode controls.",
  },
  {
    slug: "eduverse", name: "EduVerse", category: "Learning, connected",
    description: "Bringing students, teachers, and administrators into a shared learning platform, with courses, assessments, and progress tracking.",
    technologies: ["Flutter", "Firebase", "Dart"], status: "Core features built",
    statusDetail: "The repository documents implemented learning workflows and a separate roadmap; a production release is not verified.",
    repository: "https://github.com/Anees040/EduVerse", image: "/projects/eduverse-home.png", imageWidth: 390, imageHeight: 865,
    imageAlt: "EduVerse’s student dashboard with course discovery, learning activity, and enrolled courses.",
  },
];
