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
  { label: "About", href: "#about" },
  { label: "Engineering", href: "#engineering" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
] as const;

export const workspaceNotes = {
  laptop: {
    title: "On the workbench: SportLynk",
    body: "A sports venue booking and competitive matchmaking platform. Currently in development, with a private repository.",
    link: "Explore the project", href: "#sportlynk",
  },
  notebook: {
    title: "Start with the everyday problem.",
    body: "A useful engineering question: what is the smallest interaction that makes someone’s day easier? Follow that thread, then work back to the data and the logic.",
    link: "My engineering interests", href: "#engineering",
  },
  bug: {
    title: "You found the edge case.",
    body: "The smallest bugs have a talent for finding the least obvious places. This one is safely contained. Thanks for looking a little closer.",
    link: "Back to the work", href: "#work",
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
