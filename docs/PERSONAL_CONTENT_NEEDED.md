# Personal content still needed

Reviewed again on 17 November 2026. All corresponding optional content fields/layouts are implemented; these are owner-evidence dependencies, not a reason to delay the usable portfolio. No newly approved public photograph, resume, LinkedIn, aligned animation frames or private SportLynk implementation evidence was found during the continuation. The private reference remains unpublished. Verification is complete within the explicitly documented browser/device limits in `PHASE3_DELIVERY.md`.

Phase 3 continues without these items. Nothing below is represented by public lorem ipsum, a fake link, an empty case-study section or an invented claim. Current profile data is in `lib/profile-content.ts`; project stories are in `lib/case-studies.ts`.

## Profile and contact

| Owner input | What to provide | Placement and data field |
| --- | --- | --- |
| Full education details | Exact degree/program name, campus, current status and dates; say whether any qualification is completed | About → Education; `profileContent.education`. Only student identity and COMSATS University Islamabad appear now. |
| Approved professional photograph | A photograph explicitly approved for public use, with its ownership and preferred crop. Ideally 1200px or more on the long side, with no baked text | About's personal identity panel; `profileContent.photograph` stores local source, dimensions and alt text. The MA monogram remains until supplied. The private character reference is not an approved public headshot. |
| Resume | A finished public PDF, accurate dates and the filename to publish | About/contact resume action via `profileContent.resume`. No nonexistent download is linked. |
| LinkedIn | Exact public profile URL | About/contact professional links via `profileContent.linkedin`. No guessed handle is used. |
| Personal introduction and interests | Preferred wording, personal interests you actually want public, and any location/availability you approve | About introduction and profile details; `introduction`, `interests`, `philosophy`, `direction`. Existing copy stays grounded in the supplied student/project context. |
| Current learning | Specific topics, courses or experiments, with evidence if you want completion claims | About → Currently exploring, Engineering workbook and evidence notes; `learning` and `engineeringAreas`. AI is currently represented as exploration, not expertise. |
| Career goals | Types of work or opportunities sought; any availability statement you approve | About → Where I'm heading and Contact invitation; `direction`. No employment history is inferred. |
| Internships/work | Organization, actual role, dates, responsibilities and any evidence you may publish | A verified About/Journey expansion. Until supplied, the Build Trail remains academic/personal chapters, not work experience. |
| Certifications, competitions and achievements | Exact title, issuer/event, date, result and verification URL | Verified About evidence or journey milestones. These are not currently rendered as an empty section. |

## Journey

`JourneyChapter` supports a stable `id`, title, category label, body, linked project artifacts, destination and optional `period`. Dates are omitted until confirmed. Supply:

- Education start/current dates and any graduation status you want stated.
- The real order and dates of early development, mobile work, first significant projects and current focus.
- A short personal account of what changed in each chapter; repository code alone does not establish your personal learning chronology.
- Any additional genuine milestone and a project, screenshot or document that supports it.

Dates belong beside each chapter's category, not in a fabricated career timeline. The scroll marker is geometric; it is not a walking character.

## Project stories

| Project | Owner input needed | Where it appears |
| --- | --- | --- |
| SportLynk | Approved FYP problem statement; intended users; current implemented-vs-planned checklist; contribution/team scope; stack and architecture evidence; approved screenshots; real challenges, decisions and learning; current assessment status | `/work/sportlynk`: implementation, gallery if supplied, source-based architecture, decisions and outcomes. The current study is deliberately conceptual and has no invented stack or product screens. |
| FitPilot | Your actual role/contribution, motivation in your own words, personally experienced trade-offs/challenges, test/device/release evidence and any genuine outcome | `/work/fitpilot`: optional role, first-person contribution/learning narrative and verified outcomes. Existing engineering takeaways are clearly labeled source observations. |
| Sukoon | Your contribution/role, confirmation of what "completed" means, release/device verification evidence and personal lessons | `/work/sukoon`: status detail, contribution and outcomes. Completed personal project is not equated with a store release. |
| EduVerse | Your contribution/role, intended deployment, implemented/roadmap confirmation, cross-role testing and personal learning | `/work/eduverse`: contribution, challenges and outcomes. Study rooms and push delivery remain roadmap work. |
| Any quantified outcome | Original measurement, method, date, environment and permission to publish | Only the matching outcome/evidence section. No usage, downloads, revenue, accuracy, performance or contribution metrics are inferred. |

Repository screenshots contain their own application numbers; those are not Anees's portfolio impact metrics.

## Additional artwork

No new artwork is required for the shipped hero portrait and two whole workspace poses. For independent facial/typing/greeting animation, supply genuinely aligned transparent frames following `public/images/character/README.md`: matching 800×1200 hero or 480×480 workspace canvases, fixed face scale/anchor/crop, consistent light and camera, accurate alpha and explicit approval. No fake blink, skeleton rig, generated likeness or walk cycle is substituted.

For cleaner hero edges, an original transparent export of the approved primary illustration would improve the checkerboard-removal derivative. Preserve both approved originals when adding it.
