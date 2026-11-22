# Personal content still needed

Phase 6 update, 23 November 2026: approved current information is organized in 13 editable files under `knowledge/ask-anees/`. Fuller biography, academic results/dates/coursework, actual internship tasks, project/team contribution details, verified certificates, resume and LinkedIn remain owner inputs. Approve each addition for public use, replace obsolete unavailable-status sentences, run `npm run ask-anees:index`, then redeploy the Worker. Availability shortcuts derive from the indexed documents so newly verified details can be incorporated without changing the assistant architecture. See `ASK_ANEES_SETUP.md`.

Phase 5 update, 22 November 2026: the user will provide internship and individual team-task details later. Existing approved case-study roles are reused without expanding responsibilities. No final approved CV, LinkedIn URL, education dates/results or credentials are registered. `#certificates` now has the expressly requested compact empty state. Add an approved record to `credentials` in `lib/profile-content.ts` and its real image/document under `public`; the renderer already supports issuer, issue/optional expiry date, optional ID/description and verification URL. No sample cards ship.

Current visual correction: Hero alone renders the confirmed original public photograph. About renders one static working illustration plus unchanged biography/facts; its repeated identity image and redundant labels are removed. Independently authored workspace/hand/head/lamp layers and approved game atlas remain separate art tasks. Exact shared-canvas requirements are in `phase3r/ASSET_INVENTORY.md`. The earlier two-portrait note below is historical.

Updated on 20 November 2026. The owner supplied and explicitly approved a public identity photograph and a separate static working illustration. Hero and About use the unchanged photograph registered in `profileContent.photograph`; About's labeled supporting illustration is not a second identity photograph. The older private reference remains unpublished. Resume, LinkedIn, dates, personal contribution details and private SportLynk implementation evidence still require owner input.

Phase 3 continues without these items. Nothing below is represented by public lorem ipsum, a fake link, an empty case-study section or an invented claim. Current profile data is in `lib/profile-content.ts`; project stories are in `lib/case-studies.ts`.

## Profile and contact

| Owner input | What to provide | Placement and data field |
| --- | --- | --- |
| Full education details | Exact degree/program name, campus, current status and dates; say whether any qualification is completed | About → Education; `profileContent.education`. Only student identity and COMSATS University Islamabad appear now. |
| Resume | A finished public PDF, accurate dates and the filename to publish | About/contact resume action via `profileContent.resume`. No nonexistent download is linked. |
| LinkedIn | Exact public profile URL | About/contact professional links via `profileContent.linkedin`. No guessed handle is used. |
| Personal introduction and interests | Preferred wording, personal interests you actually want public, and any location/availability you approve | About introduction and profile details; `introduction`, `interests`, `philosophy`, `direction`. Existing copy stays grounded in the supplied student/project context. |
| Current learning | Specific topics, courses or experiments, with evidence if you want completion claims | About → Currently exploring, Engineering workbook and evidence notes; `learning` and `engineeringAreas`. AI is currently represented as exploration, not expertise. |
| Career goals | Types of work or opportunities sought; any availability statement you approve | About → Where I'm heading and Contact invitation; `direction`. No employment history is inferred. |
| Internships/work | Organization, actual role, dates, responsibilities and any evidence you may publish | A verified About/Journey expansion. Until supplied, the Build Trail remains academic/personal chapters, not work experience. |
| Certifications, competitions and achievements | Exact title, issuer/event, date, result and verification URL | `#certificates` supports approved credentials; its current empty state is intentional. Awards and other achievements stay omitted until verified. |

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

Current identity and working artwork inputs are resolved. The newly supplied photograph and supporting PNG remain whole, static assets; independent face, finger or body motion is not authorized. The following older aligned-frame guidance is retained for legacy assets, not a requirement for this refinement.

No new artwork is required for the shipped hero portrait and two whole workspace poses. For independent facial/typing/greeting animation, supply genuinely aligned transparent frames following `public/images/character/README.md`: matching 800×1200 hero or 480×480 workspace canvases, fixed face scale/anchor/crop, consistent light and camera, accurate alpha and explicit approval. No fake blink, skeleton rig, generated likeness or walk cycle is substituted.

For cleaner hero edges, an original transparent export of the approved primary illustration would improve the checkerboard-removal derivative. Preserve both approved originals when adding it.
