export type ProjectSlug = "sportlynk" | "fitpilot" | "sukoon" | "eduverse";
export type StoryImage = { src: string; width: number; height: number; alt: string; caption: string };
export type StoryPoint = { title: string; body: string; evidence?: { label: string; href: string } };
export type ArchitectureNode = StoryPoint & { technology: string };
export type CaseStudy = {
  slug: ProjectSlug; name: string; category: string; status: string; statusDetail: string;
  headline: string; summary: string; role?: string; audience: string; problem: string;
  goals: string[]; implementation: string; features: StoryPoint[]; screenshots: StoryImage[];
  technologies: string[]; architecture: { title: string; conceptual: boolean; description: string; nodes: ArchitectureNode[] };
  decisions: StoryPoint[]; challenges: StoryPoint[]; outcomes: string; lessons: StoryPoint[];
  links: { label: string; href: string }[]; nextSteps: string[];
};
const sourceRevisions = {
  FitPilot: "aa5ea1d3e40ddcc507870befd7fbfb5cffc43153",
  sukoon: "e8156556f0fdc2f3bb2e87bef541a6e625ad09ce",
  EduVerse: "24cd6c0edd31308854c1618529c5e25b91209949",
} as const;
const repo = (name: keyof typeof sourceRevisions, path: string) => ({ label: "Read the implementation", href: `https://github.com/Anees040/${name}/blob/${sourceRevisions[name]}/${path}` });
const shot = (name: string, width: number, height: number, alt: string, caption: string): StoryImage => ({ src: `/projects/stories/${name}.webp`, width, height, alt, caption });

export const caseStudies: CaseStudy[] = [
  {
    slug: "sportlynk", name: "SportLynk", category: "Sports booking & matchmaking", status: "In development",
    statusDetail: "Flagship Final Year Project · Private repository · Not a production-launched product",
    headline: "Less organizing. More playing.",
    summary: "A sports venue booking and competitive matchmaking project, built around the connection between finding a place to play and finding people to play with.",
    role: "Final Year Project", audience: "People looking for sports venues and competitive matches.",
    problem: "Getting a game together involves more than choosing a sport. A place, a time and a group of people have to line up. SportLynk brings venue booking and competitive matchmaking into one product direction.",
    goals: ["Make venue booking a clear part of organizing a game.", "Connect the search for a venue with the search for a match.", "Keep the product centered on getting people into play."],
    implementation: "SportLynk is currently being developed as my flagship Final Year Project. The product focus is confirmed; the private implementation, stack and detailed feature completion are not documented in this public study. The diagrams here explain the product concept.",
    features: [
      { title: "A place to play", body: "Venue booking is one of the project's two central workflows. The product concept starts with someone looking for a sports venue and a suitable time. This is a product goal, not a claim about a released booking flow." },
      { title: "People to play with", body: "Competitive matchmaking is the second focus. It extends the idea beyond a venue listing toward the people and competition that make a game happen. Matching rules and implementation details remain private." },
      { title: "The interesting edge case", body: "A final available slot is a useful way to think about shared state: two visitors may see availability at the same moment. The Concurrency Lab explores that general engineering problem as a separate educational demonstration.", evidence: { label: "Open the Concurrency Lab", href: "/#playground" } },
    ],
    screenshots: [], technologies: [],
    architecture: { title: "The product, in three connections.", conceptual: true, description: "Conceptual product map. These are user relationships, not verified services, database tables or an implemented architecture.", nodes: [
      { title: "Player", technology: "Product concept", body: "The person trying to arrange a sports session: a place, a time and other players." },
      { title: "Venue & time", technology: "Booking focus", body: "The venue-booking side of the product. Availability and reservation details require further approved documentation." },
      { title: "Match", technology: "Matchmaking focus", body: "The competitive-matchmaking side. This map does not imply a live recommendation or ranking system." },
    ] },
    decisions: [{ title: "Keep the two problems connected", body: "Venue booking and matchmaking share the same intended outcome: getting people into a game. This study presents them together while leaving the private technical implementation unclaimed." }],
    challenges: [{ title: "Availability is shared state", body: "In a booking system, seeing an available slot and reserving it are different operations. The standalone lab demonstrates why the boundary matters. It is not evidence that SportLynk uses a particular locking or transaction strategy." }],
    outcomes: "An active Final Year Project with a defined booking and matchmaking focus. There is no claimed production release, user count, revenue or measured impact. The private repository is not exposed here.",
    lessons: [], links: [{ label: "Discuss SportLynk", href: "mailto:muhammadanees0511@gmail.com?subject=SportLynk%20project" }],
    nextSteps: ["Continue developing the venue-booking and matchmaking experience.", "Add approved workflow screenshots and implementation evidence to this study when available."],
  },
  {
    slug: "fitpilot", name: "FitPilot", category: "Fitness & everyday health", status: "Core features built",
    statusDetail: "Public source and screenshots · Production release not independently verified",
    headline: "Make the next step feel possible.",
    summary: "A Flutter fitness application that connects food logging, estimated energy ranges, personal burn plans and workout guidance—without treating an unlogged day as a failure.",
    audience: "People who want occasional food guidance and a practical workout plan, without tracking every moment of their day.",
    problem: "The repository describes three frustrations: understanding a meal's energy estimate, knowing what to do in the gym and finding a plan that fits. Its response is episodic use: show up when the tool is useful, with no-log days treated as neutral.",
    goals: ["Represent estimates as ranges instead of false precision.", "Turn a logged surplus into concrete activity options.", "Keep useful local workflows available without a connection."],
    implementation: "The reviewed source separates Flutter screens, Riverpod application providers, pure Dart domain engines and a data layer. Local SQLite records support offline use; a queue coordinates push and pull with Supabase. The public repository also includes food capture and coaching features, which are not runtime-certified by this study.",
    features: [
      { title: "From a meal to a choice", body: "Food logging supports catalog search and manual entry. The application documents barcode lookup and label capture as additional entry routes. Estimates retain a range, while known label or barcode values can be represented precisely.", evidence: repo("FitPilot", "README.md") },
      { title: "A plan built from explicit inputs", body: "BurnPlanner receives the energy surplus, body weight and exercise candidates. It calculates activity options, filters preferences, removes duplicates and includes a walking option when the candidate data supports it. Longer options can be split into sessions.", evidence: repo("FitPilot", "lib/domain/engines/burn_planner.dart") },
      { title: "A neutral day is a real state", body: "StreakEngine takes day history and the current time as inputs. It distinguishes no-data days, resolved days and an unresolved surplus within a grace period. Supplying time explicitly makes deadline behavior inspectable without relying on a running UI clock.", evidence: repo("FitPilot", "lib/domain/engines/streak_engine.dart") },
    ],
    screenshots: [
      shot("fitpilot-log", 600, 1367, "FitPilot food logging screen with catalog entries and search.", "Find the food; keep the estimate visible."),
      shot("fitpilot-plan", 600, 1367, "FitPilot activity plan with exercise options and estimated minutes.", "Translate a surplus into activity options."),
      shot("fitpilot-programs", 600, 1367, "FitPilot workout programs screen.", "Build a routine around a training goal."),
    ],
    technologies: ["Flutter", "Dart", "Riverpod", "SQLite", "Supabase"],
    architecture: { title: "Local first. Connected when possible.", conceptual: false, description: "Simplified map of the reviewed code paths. Select a layer to see its responsibility; this is not a complete deployment diagram.", nodes: [
      { title: "Screens & providers", technology: "Flutter / Riverpod", body: "Feature screens connect to application providers. Domain engines calculate plans and day states independently of the rendering layer.", evidence: repo("FitPilot", "lib/application/providers/burn_provider.dart") },
      { title: "Local records & queue", technology: "SQLite / Dart", body: "A durable sync queue holds work to send. A shared table registry maps local records to remote tables, including singleton profile identities.", evidence: repo("FitPilot", "lib/data/sync/sync_tables.dart") },
      { title: "Push, then pull", technology: "Supabase", body: "SyncService sends queued changes, then pulls remote data. It shares an active sync operation and applies bounded exponential retry backoff to queued work.", evidence: repo("FitPilot", "lib/data/sync/sync_service.dart") },
    ] },
    decisions: [
      { title: "Keep calculation separate from storage", body: "BurnPlanner and StreakEngine import domain entities rather than UI or database packages. Their inputs expose the business rules directly; a screen can change without rewriting those calculations.", evidence: repo("FitPilot", "lib/domain/engines/burn_planner.dart") },
      { title: "Name the synchronization contract", body: "Local singleton IDs and cloud account IDs are different. A central registry and conversion functions make that difference explicit, rather than assuming every local row can be copied unchanged.", evidence: repo("FitPilot", "lib/data/sync/sync_service.dart") },
    ],
    challenges: [
      { title: "One timestamp, two interpretations", body: "The sync code documents a local-time/UTC ambiguity that could make local edits appear newer in last-write-wins comparisons. The reviewed implementation normalizes timestamps to UTC before crossing the remote boundary.", evidence: repo("FitPilot", "lib/data/sync/sync_service.dart") },
      { title: "Offline convenience adds reconciliation work", body: "Local records make disconnected use possible. The trade-off is a second responsibility: retrying pending writes, translating record identities and deciding how remote changes re-enter local state. The repository has dedicated sync and merge modules for that work." },
    ],
    outcomes: "The public repository contains the core food, planning and progress workflows, screenshots and domain/sync test suites. Those project tests were inspected as source, not executed for this portfolio. No clinical accuracy, production usage or quantified impact is claimed.",
    lessons: [{ title: "Model uncertainty in the product", body: "A range can communicate an estimate more honestly than an exact-looking number. The same care belongs in the logic: no data and unsuccessful activity are different states." }, { title: "Make time an input", body: "Passing the current time into a domain engine makes midnight boundaries and grace periods easier to inspect and test." }],
    links: [{ label: "Explore FitPilot on GitHub", href: "https://github.com/Anees040/FitPilot" }],
    nextSteps: ["Continue verification across offline, account-merge and boundary-time scenarios.", "Validate device-dependent capture and coaching workflows before making release claims."],
  },
  {
    slug: "sukoon", name: "Sukoon", category: "A quieter daily routine", status: "Completed project",
    statusDetail: "Owner-confirmed completed project · Repository retains verification and hardening notes",
    headline: "A little less interruption.",
    summary: "An offline prayer companion for Pakistan, bringing prayer times, automatic silent mode, tracking and Qibla support into one Android application.",
    audience: "Pakistani Muslims who want private, locally available daily prayer support.",
    problem: "A daily prayer companion has to be useful away from a stable connection. Silent mode also involves a promise: changing the phone's interruption state should not accidentally leave it changed after the prayer window ends.",
    goals: ["Calculate prayer times locally for Pakistani cities.", "Keep scheduled behavior working beyond the Flutter screen lifecycle.", "Give people control over permissions, language and silent-mode settings."],
    implementation: "Flutter handles the interface, local data and prayer-domain logic. Kotlin handles Android alarms, interruption filters and receivers. A versioned schedule is synchronized over a MethodChannel, allowing the native side to act when the Flutter engine is not running.",
    features: [
      { title: "The day, available offline", body: "Prayer-time calculation uses Adhan with Pakistan-focused city data. The README documents Karachi calculation and Hanafi Asr defaults. The user can configure the location and daily behavior without a core backend dependency.", evidence: repo("sukoon", "lib/prayer/prayer_service.dart") },
      { title: "A schedule that outlives a screen", body: "ScheduleSync builds prayer instants and reminder payloads, then passes them to Android. The versioned payload carries settings and shared notification strings separately from individual events.", evidence: repo("sukoon", "lib/native/schedule_sync.dart") },
      { title: "Reflection, without a public feed", body: "The application includes local prayer tracking, streak and heatmap views, Qaza planning and Qibla support. English and Urdu interfaces address the intended audience directly. These are personal workflows, not a claimed social network.", evidence: repo("sukoon", "README.md") },
    ],
    screenshots: [
      shot("sukoon-permissions", 600, 1368, "Sukoon permission screen explaining Android permissions.", "Permissions are part of the workflow."),
      shot("sukoon-tracker", 600, 1368, "Sukoon prayer tracker with daily tracking and a calendar.", "Keep a private record of the day."),
      shot("sukoon-qibla", 600, 1368, "Sukoon Qibla direction screen with a compass.", "Direction, alongside the daily routine."),
    ],
    technologies: ["Flutter", "Dart", "Kotlin", "MethodChannel", "Android alarms"],
    architecture: { title: "Across the platform boundary.", conceptual: false, description: "Simplified source-based schedule flow. Android owns the timed system behavior; Flutter owns configuration and the user experience.", nodes: [
      { title: "Calculate & configure", technology: "Flutter / Dart", body: "Prayer services and preferences produce the schedule and the user's silent-mode and reminder configuration.", evidence: repo("sukoon", "lib/prayer/schedule_payload.dart") },
      { title: "Synchronize the schedule", technology: "MethodChannel", body: "ScheduleSync sends the versioned data contract. Native receivers can read the persisted schedule without relying on an open Flutter screen.", evidence: repo("sukoon", "lib/native/schedule_sync.dart") },
      { title: "Schedule & restore", technology: "Android / Kotlin", body: "Android alarm, DND and receiver code manages timed actions. Device permissions and lifecycle events remain important verification boundaries.", evidence: { label: "Explore the Android source", href: `https://github.com/Anees040/sukoon/tree/${sourceRevisions.sukoon}/android` } },
    ] },
    decisions: [
      { title: "Use the platform for platform work", body: "A UI timer cannot be the sole owner of scheduled phone behavior. Moving alarms and DND handling into Kotlin gives the native runtime responsibility for that work, while the Flutter layer communicates intent." },
      { title: "Version the boundary", body: "The schedule payload is explicitly versioned. Shared labels stay outside per-event objects, keeping the transport understandable as the schedule and notification features grow.", evidence: repo("sukoon", "lib/prayer/schedule_payload.dart") },
    ],
    challenges: [{ title: "Permission granted is not the whole story", body: "Exact alarms, DND access, reboot, timezone changes and device-specific behavior all affect a scheduled experience. The repository separates verification waves and release guidance instead of treating a working screen as proof of all background behavior.", evidence: repo("sukoon", "docs/VERIFY_PLAN.md") }],
    outcomes: "Sukoon is a completed personal project according to the owner. Its public repository includes source, genuine Android screenshots and ongoing verification/hardening documentation. Completion here does not imply a verified store release or a guarantee across every Android device.",
    lessons: [{ title: "Restoring state deserves its own design", body: "Any feature that temporarily changes a system setting needs a clear exit behavior. The temporary action and the restoration are one workflow." }, { title: "Offline is a product decision", body: "Local prayer calculation and private records let the core experience stay useful without requiring a backend account." }],
    links: [{ label: "Explore Sukoon on GitHub", href: "https://github.com/Anees040/sukoon" }],
    nextSteps: ["Continue the repository's documented device verification and hardening.", "Keep permission, reboot and timezone behavior visible in release testing."],
  },
  {
    slug: "eduverse", name: "EduVerse", category: "Learning, connected", status: "Core features built",
    statusDetail: "Public implementation and screenshots · Roadmap features remain separate",
    headline: "One course. Different perspectives.",
    summary: "A Flutter and Firebase learning platform that connects student coursework, teacher content and administrative workflows around shared academic records.",
    audience: "Students taking courses, teachers creating learning material and administrators managing the platform.",
    problem: "A learning platform is more than a course catalog. A teacher's changes need to reach the student experience, assessments need to attach to a course, and administrators need a broader view. EduVerse explores those connected workflows in one application.",
    goals: ["Give each role a relevant entry point.", "Connect content, quizzes and assignment progress to courses.", "Keep shared data and role-specific interfaces understandable."],
    implementation: "The source includes role-based Flutter screens and service classes backed by Firebase Realtime Database. CourseService manages course metadata; QuizService manages quiz creation and attempts. Separate teacher and admin modules address publishing, management and support. The repository also contains AI study-tool integrations, without a production-service claim here.",
    features: [
      { title: "Start from the learner", body: "Student screens bring course discovery, enrolled courses, video progress, assignments and quizzes together. The genuine gallery shows the dashboard and course detail surface, rather than a recreated marketing mockup.", evidence: repo("EduVerse", "README.md") },
      { title: "Give the teacher a different workspace", body: "CourseService creates course metadata under the teacher's records and in the global course collection. QuizService creates draft quizzes and links them back to their course. These are explicit relationships in the code, not just different dashboard labels.", evidence: repo("EduVerse", "lib/services/course_service.dart") },
      { title: "Follow the assessment record", body: "Quiz data includes time limits, attempt limits and publication settings. Attempt records relate a student, quiz and course with answers and completion information. The public implementation makes those concepts inspectable.", evidence: repo("EduVerse", "lib/services/quiz_service.dart") },
    ],
    screenshots: [
      shot("eduverse-course", 395, 869, "EduVerse student course detail showing a course overview.", "Student: understand the course."),
      shot("eduverse-teacher", 395, 869, "EduVerse teacher dashboard with teaching tools.", "Teacher: manage the learning material."),
      shot("eduverse-admin", 385, 865, "EduVerse administrative dashboard with platform summaries.", "Administrator: inspect the wider platform."),
    ],
    technologies: ["Flutter", "Dart", "Firebase Auth", "Realtime Database"],
    architecture: { title: "Three roles. Shared records.", conceptual: false, description: "Simplified map of source responsibilities. It describes code organization, not a security certification or production deployment.", nodes: [
      { title: "Role-specific screens", technology: "Flutter", body: "Students, teachers and administrators have separate screens and workflows while referring to the same course identities.", evidence: { label: "Explore the screens", href: `https://github.com/Anees040/EduVerse/tree/${sourceRevisions.EduVerse}/lib` } },
      { title: "Feature services", technology: "Dart", body: "CourseService and QuizService contain the data operations behind publishing, course metadata and assessment workflows.", evidence: repo("EduVerse", "lib/services/quiz_service.dart") },
      { title: "Shared data", technology: "Firebase Realtime Database", body: "Courses, teacher-course references, quizzes and attempts live in related database paths. The repository also supplies database rules; no comprehensive rules audit was performed for this study.", evidence: repo("EduVerse", "database.rules.json") },
    ] },
    decisions: [{ title: "Keep data operations in named services", body: "Course and quiz operations have dedicated service classes rather than living entirely in screen callbacks. The benefit is a visible place to inspect data shapes and side effects." }, { title: "Role-specific views, shared identifiers", body: "A course is referenced from teacher and student workflows. Reusing its identity connects those experiences; duplicating records in different paths also creates a consistency responsibility." }],
    challenges: [{ title: "Duplicated views need consistent writes", body: "Course creation writes teacher and global course records separately. That makes both views available, but partial failure between writes is an engineering consideration. This study does not describe the sequence as an atomic transaction.", evidence: repo("EduVerse", "lib/services/course_service.dart") }, { title: "A roadmap is not a release", body: "The README lists future work separately, including study rooms and push notifications. In-app notification records and future push delivery should not be presented as the same capability.", evidence: repo("EduVerse", "README.md") }],
    outcomes: "The public source and screenshots support the core learning and role-based workflows described here. Deployment, real usage, certificate validity and production payment processing have not been independently verified. Numbers inside screenshots are application content, not portfolio impact metrics.",
    lessons: [{ title: "Follow the data across roles", body: "A useful way to evaluate a multi-role application is to follow one course from creation to student participation and administration. The seams often matter more than any individual dashboard." }, { title: "Name the consistency trade-off", body: "Keeping records in multiple query-friendly paths makes reads convenient. It also means changes must stay synchronized, including when an operation fails partway through." }],
    links: [{ label: "Explore EduVerse on GitHub", href: "https://github.com/Anees040/EduVerse" }],
    nextSteps: ["Treat study rooms and push notifications as roadmap work.", "Verify cross-role data consistency and deployment behavior before making production claims."],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find(study => study.slug === slug);
