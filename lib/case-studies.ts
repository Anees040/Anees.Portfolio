export type ProjectSlug = "sportlynk" | "fitpilot" | "sukoon" | "eduverse";
export type StoryImage = { src: string; width: number; height: number; alt: string; caption: string };
export type StoryPoint = { title: string; body: string; evidence?: { label: string; href: string } };
export type ArchitectureNode = StoryPoint & { technology: string };
export type CaseStudy = {
  slug: ProjectSlug; name: string; category: string; status: string; statusDetail: string;
  headline: string; summary: string; role: string; audience: string; problem: string; motivation: string;
  goals: string[]; implementation: string; features: StoryPoint[]; screenshots: StoryImage[];
  technologies: string[]; architecture: { title: string; conceptual: boolean; description: string; nodes: ArchitectureNode[] };
  journey: { title: string; steps: StoryPoint[] };
  decisions: StoryPoint[]; challenges: StoryPoint[]; outcomes: string; lessons: StoryPoint[];
  links: { label: string; href: string }[]; nextSteps: string[];
};
const sourceRevisions = {
  FitPilot: "aa5ea1d3e40ddcc507870befd7fbfb5cffc43153",
  sukoon: "e8156556f0fdc2f3bb2e87bef541a6e625ad09ce",
  EduVerse: "24cd6c0edd31308854c1618529c5e25b91209949",
} as const;
const repo = (name: keyof typeof sourceRevisions, path: string) => ({ label: "Explore the technical detail", href: "https://github.com/Anees040/" + name + "/blob/" + sourceRevisions[name] + "/" + path });
const shot = (name: string, width: number, height: number, alt: string, caption: string): StoryImage => ({ src: "/projects/stories/" + name + ".webp", width, height, alt, caption });

export const caseStudies: CaseStudy[] = [
  {
    slug: "sportlynk", name: "SportLynk", category: "Recreational sport · Pakistan", status: "In development",
    statusDetail: "Flagship Final Year Project · Team project · Not launched",
    headline: "Less organizing. More playing.",
    summary: "I’m working with my team to connect recreational sports venue booking and competitive matchmaking, starting with indoor football and cricket in Pakistan.",
    role: "I’m a member of the SportLynk Final Year Project team. We are developing the experience together; the product direction here represents our shared work.",
    audience: "Our initial audience is recreational players, team captains and indoor football and cricket venue owners in Pakistan.",
    motivation: "I started SportLynk because I wanted to address how arranging recreational sport often depends on scattered WhatsApp conversations, phone calls and manual coordination. With my team, I’m turning that need into a cross-platform product: find a place, organize the people and make the game happen.",
    problem: "Finding a nearby ground is only the first step. A player still has to ask about available slots, confirm the price and coordinate a group. Owners often manage the other side with registers and messages. Opponent searches, team formation, tournaments and rankings can each happen somewhere else. I want those relationships to meet in one understandable experience, without pretending that a booking alone solves the whole problem.",
    goals: ["Start with indoor football and cricket rather than every sport at once.", "Connect venue availability with the people and teams who want to play.", "Make the state of a booking clear to players and ground owners.", "Treat competition, payments and check-in as connected product responsibilities."],
    implementation: "We are still developing SportLynk. Player and owner workflows, team organization and competitive play belong to our product scope. The module descriptions below describe that scope; they do not mean every capability is complete. The product maps are conceptual, and I’m not presenting an unverified technology stack or private backend design.",
    features: [
      { title: "Players, profiles and discovery", body: "I want a player to move from an account and profile to nearby venues with usable availability information. The initial indoor football and cricket focus gives us a concrete set of booking needs. Profiles also connect to team participation and competitive play. Current status: part of the product under development." },
      { title: "The ground owner’s side", body: "An owner needs to manage availability and incoming reservations, rather than answer the same questions across separate conversations. We are working toward a clear management experience that connects the owner’s schedule to what players can request. Current status: product scope under development." },
      { title: "Teams, captains and invitations", body: "A team is a relationship between people, not just a name on a match. Captains, membership and invitations need clear responsibilities, including what happens when someone joins or leaves. These relationships are part of our intended team experience; I’m not claiming every invitation or membership flow is finished." },
      { title: "Matching and competitive rankings", body: "Finding an opponent should connect to the people and teams who actually want to play. Player and team rankings are part of that direction. I’m treating skill logic as an engineering concern: the inputs, eligible results and update rules need to be explainable. No completed ranking algorithm or live matchmaking service is claimed here." },
      { title: "Tournaments and a booking lifecycle", body: "Tournament organization extends the coordination problem across multiple teams and matches. Payments and check-in add another layer to venue booking: a request, a paid reservation and an attended session are different states. These are relevant modules in our development scope, with detailed completion still to be established." },
    ],
    journey: { title: "One game, several connected decisions.", steps: [
      { title: "Find a ground", body: "The intended journey starts with a nearby indoor football or cricket venue and an available time. Availability needs to be useful at the moment a player decides to request it." },
      { title: "Request and coordinate", body: "The player, owner and payment process need a shared understanding of what is pending and what is confirmed. I want a retry or late update to leave an understandable result." },
      { title: "Bring the players together", body: "Teams, captain invitations and an opponent search connect the reservation to an actual game. These are intended relationships, rather than a claim of a released end-to-end journey." },
      { title: "Play and continue", body: "Check-in, match results and future competitive rankings should have a clear relationship to the session. The next game should build on reliable records, rather than another scattered conversation." },
    ] },
    screenshots: [], technologies: [],
    architecture: { title: "A game is a connected system.", conceptual: true, description: "This is my conceptual product map: the player, venue and match meet around a booking. It describes the direction we are developing, rather than a verified backend.", nodes: [
      { title: "Player & team", technology: "Product scope · In development", body: "Accounts, profiles, captains and invitations establish who is participating. Team membership and individual player identity need separate responsibilities." },
      { title: "Venue & booking", technology: "Product scope · In development", body: "Discovery, owner availability, reservations, payment state and check-in establish where and when the session can happen." },
      { title: "Match & competition", technology: "Product scope · In development", body: "Opponent finding, player and team rankings, and tournaments connect individual sessions to competitive play." },
    ] },
    decisions: [
      { title: "Keep the first sports concrete", body: "Starting with indoor football and cricket in Pakistan gives our team a more specific problem to work through. Expanding the sport list too early would multiply availability, team and tournament rules before the initial journeys are dependable." },
      { title: "Connect booking and competition", body: "I see venue booking and matchmaking as related needs. A place to play has little value if the group cannot get together; a match still needs a place and time. Their shared relationships guide the product direction." },
      { title: "Make asynchronous state understandable", body: "An owner decision, payment response or team invitation may arrive after the initiating screen has changed. I want the underlying state to remain authoritative. Real-time transport and asynchronous update details are still implementation questions here, not a claim of a finished service." },
    ],
    challenges: [
      { title: "The last slot, requested twice", body: "Two players can see the same available slot before either request finishes. Checking availability in the interface is insufficient: the final reservation needs a controlled server boundary that prevents conflicting claims. I’m exploring that concern through a separate Concurrency Lab; it is a teaching model, not SportLynk’s backend.", evidence: { label: "Try the Concurrency Lab", href: "/#playground" } },
      { title: "A payment is not the whole booking", body: "The lifecycle needs to account for a pending request, payment coordination, confirmation, cancellation and check-in. Late responses and repeated requests make this harder than a single success screen. These are design concerns for our work in progress; I’m not claiming verified payment handling." },
      { title: "Relationships change over time", body: "Players may change teams, captains may invite new members, and competitive results may affect rankings. I want clear rules for which identity and team a result belongs to. Fair ranking logic needs its own evidence and validation before I can describe it as complete." },
    ],
    outcomes: "SportLynk remains our flagship Final Year Project in development. The initial Pakistan focus, indoor football and cricket audience, and booking and competition direction are established. I’m presenting that direction honestly while our team continues the implementation; there is no production launch or usage claim.",
    lessons: [{ title: "Start from the coordination problem", body: "Thinking through one game makes the connections visible: player identity, owner availability, team relationships and payment state all affect the same outcome. That perspective helps me ask more useful engineering questions than considering each screen in isolation." }],
    links: [{ label: "Talk with me about SportLynk", href: "mailto:muhammadanees0511@gmail.com?subject=SportLynk%20project" }],
    nextSteps: ["Continue the player, owner and competitive workflows with my team.", "Establish and verify booking-state, payment and conflict-prevention behavior.", "Share genuine application screens and module completion as the work becomes ready."],
  },
  {
    slug: "fitpilot", name: "FitPilot", category: "Fitness · Food & activity", status: "Core features built",
    statusDetail: "Personal mobile project · Device and service verification continues",
    headline: "Make the next step feel possible.",
    summary: "I built FitPilot around a simple idea: make everyday food choices and physical activity easier to understand through a practical mobile experience.",
    role: "FitPilot is my solo personal project, bringing product decisions, Flutter development and the local-to-cloud data flow together.",
    audience: "I designed it for people who want useful food guidance and an approachable workout routine without turning every day into a tracking exercise.",
    motivation: "A meal estimate on its own leaves an obvious question: what can I do next? I wanted to connect food exploration to understandable activity options, and give someone in the gym a useful place to find workout and technique guidance. The experience should be helpful when someone chooses to use it, rather than punish them for missing a day.",
    problem: "Food estimates can look more precise than they really are. Workout plans can also ignore the person’s preferences, level or available equipment. My starting point was to make uncertainty visible and turn explicit inputs into practical choices. A day without a food log is simply a day without data; it should not become evidence that someone failed.",
    goals: ["Keep estimated calories as a range.", "Translate a logged surplus into activity choices using explicit inputs.", "Build guidance around goals, training style and experience.", "Keep food records and useful planning available locally."],
    implementation: "I used Flutter and Riverpod for the interface and application state, pure Dart for the calculation engines, and SQLite for local records. A durable queue coordinates synchronization with Supabase. This separation lets the food and day-state rules stay independent of screen rendering, while local use does not depend on every network request succeeding.",
    features: [
      { title: "Food entry with a chance to correct it", body: "The current build includes catalog search, custom food entry, barcode lookup and nutrition-label capture. Search supports portion labels and Urdu aliases. Label recognition gives the user a correction step before saving; an estimated food keeps its calorie range rather than gaining false precision just because it appears on a screen.", evidence: repo("FitPilot", "README.md") },
      { title: "A burn plan with explainable inputs", body: "My planning flow uses energy surplus, body weight and exercise candidates to calculate estimated activity options. The engine filters preferences, removes duplicates and can split longer options into sessions. Walking offers an approachable option when the candidate data supports it. These are activity estimates, not medical prescriptions or guaranteed outcomes.", evidence: repo("FitPilot", "lib/domain/engines/burn_planner.dart") },
      { title: "Workout guidance beyond a calorie total", body: "The current build includes program templates, weekly planning and an exercise library with technique guides. Goals, training style, level and duration shape the planning experience. Equipment scanning and form-check integrations are also present, but their guidance still needs device and service validation; I do not treat an AI response as clinical or safety certification.", evidence: repo("FitPilot", "README.md") },
      { title: "Progress that understands missing data", body: "The day model distinguishes safe, unresolved-surplus and neutral no-log states. A grace period is part of the calculation. That product decision changes the logic underneath: no data and an unsuccessful day cannot be represented by the same state.", evidence: repo("FitPilot", "lib/domain/engines/streak_engine.dart") },
    ],
    journey: { title: "From a food choice to a useful next step.", steps: [
      { title: "Find or capture the food", body: "Search the catalog, enter a custom item or capture a barcode or label. Correction belongs before saving, so a recognition error does not silently become a food record." },
      { title: "Understand the estimate", body: "Portion and calorie information remain visible. Estimated food uses a range; a known label or barcode value can be represented precisely." },
      { title: "Choose an activity", body: "The plan translates the logged surplus into estimated minutes for candidate activities, using weight and exercise data. The user gets options rather than one compulsory workout." },
      { title: "Return when it is useful", body: "Progress reflects recorded days and unresolved surpluses, while unlogged days stay neutral. Programs and technique references support a wider routine beyond this one food-to-activity flow." },
    ] },
    screenshots: [
      shot("fitpilot-log", 600, 1367, "FitPilot food logging screen with catalog entries and search.", "Find the food; keep the estimate visible."),
      shot("fitpilot-plan", 600, 1367, "FitPilot activity plan with exercise options and estimated minutes.", "Translate a surplus into activity options."),
      shot("fitpilot-programs", 600, 1367, "FitPilot workout programs screen.", "Build a routine around a training goal."),
    ],
    technologies: ["Flutter", "Dart", "Riverpod", "SQLite", "Supabase"],
    architecture: { title: "Local first. Connected when possible.", conceptual: false, description: "I keep calculation, local persistence and synchronization separate. This diagram follows the food-to-plan and local-to-cloud responsibilities, rather than every service in the app.", nodes: [
      { title: "Screens & calculation", technology: "Flutter / Riverpod / Dart", body: "The interface connects to application providers. Burn planning and day-state calculations receive domain inputs without depending on the UI or database.", evidence: repo("FitPilot", "lib/application/providers/burn_provider.dart") },
      { title: "Local records & queue", technology: "SQLite", body: "Local records support disconnected use. Pending work lives in a durable queue, while a shared table registry defines how local records map to remote data.", evidence: repo("FitPilot", "lib/data/sync/sync_tables.dart") },
      { title: "Push, then pull", technology: "Supabase", body: "Synchronization sends queued changes before pulling remote data. An active operation is shared, and queued failures use bounded exponential retry backoff.", evidence: repo("FitPilot", "lib/data/sync/sync_service.dart") },
    ] },
    decisions: [
      { title: "Let uncertainty reach the interface", body: "I use a calorie range as part of the domain model, not a disclaimer appended to an exact-looking number. The trade-off is a little more complexity in calculations and display, but the estimate stays honest throughout the experience." },
      { title: "Keep the rules independent of screens", body: "Burn and streak calculations receive their inputs explicitly. This makes it possible to change a screen or storage layer without also rewriting the planning rules.", evidence: repo("FitPilot", "lib/domain/engines/burn_planner.dart") },
      { title: "Choose local usefulness over a network dependency", body: "SQLite makes core records available without a connection. The trade-off is that synchronization becomes a real engineering responsibility: pending writes, retries, identity translation and remote changes all need deliberate handling." },
    ],
    challenges: [
      { title: "Local time versus cloud time", body: "Last-write-wins comparisons become unreliable when timestamps carry different interpretations. The sync boundary normalizes timestamps to UTC so a local edit does not appear newer simply because of timezone conversion.", evidence: repo("FitPilot", "lib/data/sync/sync_service.dart") },
      { title: "A guest record is not a cloud identity", body: "Local singleton identifiers and account-backed identifiers differ. Conversion and table mapping make that boundary explicit. Guest-to-account merging adds another case: a useful local history must be reconciled rather than copied blindly." },
      { title: "Recognition needs a human correction path", body: "Barcode and label capture make entry easier, but external data and recognition can be incomplete or wrong. I keep correction and validation in the experience. Equipment and form guidance need the same care before stronger accuracy claims are justified." },
    ],
    outcomes: "The core food, activity-planning, progress, workout-library and connected data workflows are built. Capture and coaching integrations are part of the current build, with continued device and service verification. FitPilot is a personal fitness project; I make no clinical-validation, guaranteed-result or production-adoption claim.",
    lessons: [
      { title: "No data is its own state", body: "FitPilot taught me to carry a product choice all the way into the domain model. Neutral days are not a visual trick: they change how the streak engine reasons about a history." },
      { title: "Time belongs in the inputs", body: "Passing the current time into the day-state engine makes grace periods and midnight boundaries easier to reason about. Hidden reliance on a running UI clock would make the same rules harder to inspect." },
    ],
    links: [{ label: "Explore FitPilot on GitHub", href: "https://github.com/Anees040/FitPilot" }],
    nextSteps: ["Continue offline, identity-merge and boundary-time verification.", "Validate capture and coaching on devices and against their service dependencies.", "Keep estimates and correction steps clear as the experience grows."],
  },
  {
    slug: "sukoon", name: "Sukoon", category: "Daily prayer · Android", status: "Completed project",
    statusDetail: "Completed personal project · Device hardening continues",
    headline: "A little less interruption.",
    summary: "I built Sukoon as an offline prayer companion for Pakistan, connecting daily prayer times, automatic silent mode, private tracking and Qibla support.",
    role: "My work on Sukoon connects the Flutter experience with the Android scheduling and interruption-state boundary.",
    audience: "I focused on Pakistani Muslims who want daily prayer support that stays useful locally and keeps their tracking private.",
    motivation: "With Sukoon, I wanted the core experience to feel useful and dependable: know the prayer times, reduce interruptions during the prayer window and keep a private record of the day. The important challenge was making that promise hold beyond the screen. A phone should not stay in a changed interruption state just because the interface has closed.",
    problem: "Daily prayer support has to work without a stable connection. Automatic silent mode adds a more demanding responsibility: schedule the change at the right time, then restore the previous state. Permissions, reboot and timezone changes make this a platform problem as much as an interface problem.",
    goals: ["Calculate daily prayer times locally for Pakistani cities.", "Make timed behavior independent of an open Flutter screen.", "Keep permission choices and restoration understandable.", "Support private tracking alongside English and Urdu interfaces."],
    implementation: "I use Flutter for configuration, local records and prayer logic, with Kotlin handling Android alarms, receivers and interruption filters. A versioned schedule crosses a MethodChannel boundary. The native side can persist that schedule and act when the Flutter engine is not running, instead of relying on a screen timer.",
    features: [
      { title: "The day, available offline", body: "Prayer calculation uses Adhan with Pakistan-focused city data, Karachi calculation and Hanafi Asr defaults. Location and preferences shape the daily schedule. Keeping these calculations local lets the core routine work without an account-backed backend.", evidence: repo("sukoon", "lib/prayer/prayer_service.dart") },
      { title: "Automatic quiet, with a way back", body: "Prayer-time silent behavior uses Android’s interruption controls and scheduled native actions. Restoration is part of the same workflow: the temporary change should finish by returning to the previous interruption state. Permission availability affects whether the phone can perform the action." },
      { title: "A schedule that survives the screen", body: "The schedule includes prayer instants, reminder configuration and shared notification strings. I keep settings and shared labels separate from individual events so the versioned transport remains understandable as the routine grows.", evidence: repo("sukoon", "lib/native/schedule_sync.dart") },
      { title: "A private record and a direction", body: "Daily prayer tracking, streak and heatmap views, Qaza estimation and planning, and Qibla support sit beside the timing experience. English and Urdu address the intended audience directly. These are personal local workflows rather than a public activity feed.", evidence: repo("sukoon", "README.md") },
    ],
    journey: { title: "Configure once; let the routine continue.", steps: [
      { title: "Choose location and preferences", body: "The user sets the city and daily behavior. Prayer calculation and local settings define what should happen, while permission explanations make the phone’s requirements visible." },
      { title: "Pass a complete schedule", body: "Flutter prepares prayer instants and reminders, then sends a versioned payload to Android. This is the boundary between configuration and system-owned execution." },
      { title: "Act, then restore", body: "Native alarms and receivers handle the scheduled window. Changing the interruption filter and restoring it belong to one lifecycle, even when the interface is closed." },
      { title: "Reflect on the day", body: "Tracking and Qibla remain available beside the routine. The record is personal, and the core prayer experience does not need a continuous network connection." },
    ] },
    screenshots: [
      shot("sukoon-permissions", 600, 1368, "Sukoon permission screen explaining Android permissions.", "Understand what the phone needs."),
      shot("sukoon-tracker", 600, 1368, "Sukoon prayer tracker with daily tracking and a calendar.", "Keep a private record of the day."),
      shot("sukoon-qibla", 600, 1368, "Sukoon Qibla direction screen with a compass.", "Direction, alongside the daily routine."),
    ],
    technologies: ["Flutter", "Dart", "Kotlin", "MethodChannel", "Android alarms"],
    architecture: { title: "Across the platform boundary.", conceptual: false, description: "Flutter communicates the intended schedule; Android owns the timed system behavior. I treat the versioned transport and the restoration path as first-class parts of that relationship.", nodes: [
      { title: "Calculate & configure", technology: "Flutter / Dart", body: "Prayer services and preferences produce the schedule, silent-mode choices and reminder configuration.", evidence: repo("sukoon", "lib/prayer/schedule_payload.dart") },
      { title: "Send a versioned schedule", technology: "MethodChannel", body: "The native side persists the data contract so receivers can use it without an open Flutter screen.", evidence: repo("sukoon", "lib/native/schedule_sync.dart") },
      { title: "Schedule & restore", technology: "Android / Kotlin", body: "Alarms, interruption filters and receivers own the timed actions. Permissions and lifecycle events affect that work and remain part of device verification." },
    ] },
    decisions: [
      { title: "Give platform work to the platform", body: "I do not make a Flutter timer the sole owner of scheduled phone behavior. Kotlin handles alarms and interruption changes; Flutter communicates intent. The trade-off is a second runtime and a boundary that must stay explicit." },
      { title: "Version the contract", body: "An explicit payload version gives the Flutter and Android sides a defined format to interpret. Shared notification labels stay outside individual event objects, avoiding repeated transport data and keeping changes easier to follow.", evidence: repo("sukoon", "lib/prayer/schedule_payload.dart") },
      { title: "Keep the core routine local", body: "Local calculation and tracking reduce the need for connectivity and account setup. Device responsibilities still remain: offline operation does not remove the need to handle permissions or system lifecycle changes." },
    ],
    challenges: [
      { title: "Permission is part of the experience", body: "Exact alarms and DND access are distinct requirements. A useful setup screen needs to explain them, and the behavior needs to account for permission changes rather than assume one successful grant lasts forever." },
      { title: "A correct schedule can become stale", body: "Reboot, clock and timezone changes affect timed actions. Those cases require device verification beyond seeing the right times in Flutter. I keep that hardening work separate from declaring the project itself complete." },
      { title: "The exit deserves as much attention as the action", body: "Changing an interruption filter is only half the feature. The previous state needs to be preserved and restoration needs a clear owner. Thinking through this exit path changed how I approach temporary system actions." },
    ],
    outcomes: "Sukoon is a completed personal project with genuine Android screens and the local prayer, tracking and native scheduling experience described here. Device hardening continues around permissions, background execution and lifecycle events. Completion does not mean a verified store release or guaranteed behavior on every Android device.",
    lessons: [
      { title: "Design restoration alongside activation", body: "Any temporary system change needs a deliberate return path. In Sukoon, the start and end of the quiet window are one feature, not two unrelated callbacks." },
      { title: "A boundary needs a contract", body: "The interface and native scheduler operate under different lifecycle rules. A versioned schedule makes that relationship easier to reason about than relying on the Flutter screen to remain alive." },
    ],
    links: [{ label: "Explore Sukoon on GitHub", href: "https://github.com/Anees040/sukoon" }],
    nextSteps: ["Continue device hardening for permission, reboot and timezone scenarios.", "Keep native restoration and background behavior in release verification.", "Preserve the useful local core as the experience is refined."],
  },
  {
    slug: "eduverse", name: "EduVerse", category: "Semester project · Learning", status: "Core features built",
    statusDetail: "Academic semester project · Further features remain planned",
    headline: "One course. Different perspectives.",
    summary: "I developed EduVerse as a semester project, connecting student coursework, teacher content and administrative workflows around shared learning records.",
    role: "EduVerse is my semester project. My story here focuses on the role-based experience and the course and assessment relationships I worked through.",
    audience: "I designed the experience around students taking courses, teachers preparing material and administrators overseeing the learning environment.",
    motivation: "I wanted to explore what happens when learning material, participation and assessment are connected. A course catalog is only the beginning: the teacher needs to create and manage the material, the student needs a clear path through it, and an administrator needs a wider view of the same records.",
    problem: "Separate role screens can look complete while their data remains disconnected. A teacher’s course needs to appear in the student experience; a quiz belongs to that course; an attempt belongs to a student and that quiz. My focus was making those relationships understandable across the learning journey.",
    goals: ["Give students, teachers and administrators relevant entry points.", "Connect course material, quizzes, assignments and progress.", "Keep data operations separate from individual screen callbacks.", "Distinguish implemented workflows from future collaboration and notification features."],
    implementation: "I used Flutter with Firebase Authentication and Firebase Realtime Database. Role-specific screens call named services for course, assessment and management operations. Shared course identities connect the different views. The current build also includes study-tool integrations, but this academic project is not presented as a commercial production service.",
    features: [
      { title: "The student’s learning path", body: "Course discovery and enrollment lead into video learning, assignments, quizzes and progress. The dashboard gives a starting point; the course detail screen connects the material and participation to a particular course.", evidence: repo("EduVerse", "README.md") },
      { title: "A teacher’s publishing responsibilities", body: "The teacher has a different workspace for course content and assessment. Course creation writes metadata into teacher-related and global course records. Draft quizzes link back to their course, so an assessment has a clear context.", evidence: repo("EduVerse", "lib/services/course_service.dart") },
      { title: "Assessments with connected identities", body: "Quiz settings include time limits, attempt limits and publication state. Attempts relate the student, quiz and course, with answers and completion information. Those relationships matter more than displaying a result in isolation.", evidence: repo("EduVerse", "lib/services/quiz_service.dart") },
      { title: "An administrative view of the same work", body: "Administrative workflows address users, course oversight, moderation, announcements and support. The wider view serves a different responsibility from the student and teacher interfaces while referring to shared learning records.", evidence: repo("EduVerse", "README.md") },
    ],
    journey: { title: "Follow one course through three roles.", steps: [
      { title: "The teacher creates the context", body: "Course metadata, learning material and draft assessment establish what a student will participate in. Publishing and management belong to the teacher’s workflow." },
      { title: "The student joins and learns", body: "Enrollment connects a learner to the course. Video progress, assignments and quizzes then belong to that relationship rather than an unrelated collection of activities." },
      { title: "The assessment creates a record", body: "A quiz attempt carries the student, quiz and course identities. Limits and publication settings affect the path to completing it." },
      { title: "The administrator sees the wider picture", body: "Management and oversight use their own role-specific flows. Following the same course identity across all three roles makes missing or inconsistent records easier to recognize." },
    ] },
    screenshots: [
      shot("eduverse-course", 395, 869, "EduVerse student course detail showing a course overview.", "Student: understand the course."),
      shot("eduverse-teacher", 395, 869, "EduVerse teacher dashboard with teaching tools.", "Teacher: manage the learning material."),
      shot("eduverse-admin", 385, 865, "EduVerse administrative dashboard with platform summaries.", "Administrator: inspect the wider platform."),
    ],
    technologies: ["Flutter", "Dart", "Firebase Auth", "Realtime Database"],
    architecture: { title: "Three roles. Shared records.", conceptual: false, description: "I follow a course from role-specific Flutter screens through named services into connected Realtime Database records. This is a simplified responsibility map, not a complete security model.", nodes: [
      { title: "Role-specific experience", technology: "Flutter / Firebase Auth", body: "Students, teachers and administrators have distinct workflows while referring to the same course identities." },
      { title: "Course & assessment services", technology: "Dart", body: "Named services handle course metadata, publishing and assessment operations, keeping their data shapes and side effects visible.", evidence: repo("EduVerse", "lib/services/quiz_service.dart") },
      { title: "Connected learning records", technology: "Firebase Realtime Database", body: "Course, teacher references, quizzes and attempts live in related records. Database rules are part of the implementation; this study makes no comprehensive security-audit claim.", evidence: repo("EduVerse", "database.rules.json") },
    ] },
    decisions: [
      { title: "Different roles, one course identity", body: "I give each role a relevant interface without inventing a different course for each view. Shared identifiers connect creation, enrollment and assessment. Multiple query-friendly records still need to stay consistent." },
      { title: "Name the operation behind the screen", body: "Course and quiz operations belong in dedicated services rather than being scattered through screen callbacks. That gives me a clear place to reason about record shapes, side effects and failures." },
      { title: "Keep future features separate", body: "Collaborative study rooms and push delivery remain planned. Existing in-app notification records do not mean FCM push delivery is complete, and a visible certificate or payment interface does not establish commercial processing or external validity." },
    ],
    challenges: [
      { title: "Two views, two writes", body: "Course creation writes teacher-related and global records separately. This supports both views, but an interruption between writes can leave an inconsistency. I do not describe this sequence as atomic; the trade-off needs to stay visible when thinking about reliability.", evidence: repo("EduVerse", "lib/services/course_service.dart") },
      { title: "The record has to survive the role change", body: "A course moving from teacher management to student participation and administration exposes different expectations. I learned to follow the identifiers and relationships across those transitions rather than judge each dashboard on its own." },
      { title: "A semester project has a boundary", body: "The academic build includes connected learning and management workflows. Production deployment, commercial payments and certificate validity need separate verification. Keeping that boundary clear makes the story more useful than treating every visible feature as a released service." },
    ],
    outcomes: "EduVerse has the core course, role-based learning, assessment and management workflows built as my semester project. Collaborative study rooms, push notifications and advanced assessment work remain planned. I’m presenting the implemented experience and its data trade-offs without claiming a commercial launch or production adoption.",
    lessons: [
      { title: "Follow the data across roles", body: "The most useful review path is one course moving through teaching, learning and oversight. It exposes the seams between screens and services that an isolated dashboard can hide." },
      { title: "Convenient reads create write responsibilities", body: "Multiple records can make each role’s queries simpler. They also create synchronization work, especially when an operation fails partway through. That trade-off is part of the design, not a detail to leave until later." },
    ],
    links: [{ label: "Explore EduVerse on GitHub", href: "https://github.com/Anees040/EduVerse" }],
    nextSteps: ["Verify consistency across course creation, participation and assessment.", "Keep study rooms and push delivery labelled as future work.", "Use the cross-role lessons in the next connected application I build."],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find(study => study.slug === slug);
