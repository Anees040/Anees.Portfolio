# Copper Atelier — Phase 3 delivery

Implemented 16–17 November 2026; final verification on 17 November (Asia/Karachi). This continues the interrupted chat's uncommitted implementation rather than replacing it. Nothing is deployed, published or committed.

## Overall status

**The Phase 3 experience is implemented and production-verified within the available approved content and artwork.** The homepage is a longer atelier narrative with a signature particle portrait, functional workbench, individual project compositions, evidence-linked engineering, reversible learning trail, one reservation experiment, fuller profile/evidence and deliberate contact conclusion. Four case-study routes are functional. SportLynk's technical story remains explicitly conceptual until its private implementation evidence is approved. Missing personal history and a public photograph are not fabricated.

Current local review: [screenshots and recording gallery](../.qa/phase3-finish/review.html). Content inputs: [PERSONAL_CONTENT_NEEDED.md](PERSONAL_CONTENT_NEEDED.md). Starting-state audit: [PHASE3_CURRENT_AUDIT.md](PHASE3_CURRENT_AUDIT.md). Historical Phase 2 reports remain preserved.

## Experience and interactions

| Passage | Delivered experience |
| --- | --- |
| Immersive hero | Oversized Instrument Serif statement, Muhammad Anees/developer identification, broad Graphite portrait composition, actual image-derived assembly, pointer response, keyboard replay, work/About actions, SportLynk focus and workshop invitation |
| Interactive workshop | Native lamp changes the scene to Espresso; laptop opens current-project context; notebook connects a genuine FitPilot day-state decision to engineering; bug links to the booking edge case; project plaque navigates; supplied Rest/At work poses change honestly |
| Selected work | Retained native-scroll four-scene horizontal journey with larger SportLynk court concept and individual editorial FitPilot/Sukoon/EduVerse treatments, real previews, statuses and full-study links |
| Project stories | Problem/user/goals, implementation-specific feature stories, genuine galleries where available, inspectable architecture maps, choices/trade-offs, truthful outcomes, source-based takeaways and next-project navigation |
| Engineering workbook | Six native disclosures: mobile, backend/data, product thinking, architecture, problem solving and applied AI/automation. Each asks a concrete question, illustrates a relationship and links project evidence; no proficiency percentages |
| Build Trail | Original copper SVG path, geometric marker, measured active chapter, linked project artifacts and reversible native scroll. Five academic/personal-development themes with optional verified periods rather than an invented career chronology |
| Concurrency Lab | Switch approach, start, advance four events, inspect acting requests and accepted/rejected states, reset and compare. Unprotected accepts both stale reads; protected illustrates one final check/claim boundary |
| About/evidence/contact | Structured student introduction, education/interests/building/learning/direction; MA identity panel until a public photo is approved; dated source-linked repositories; strong email/GitHub contact, optional resume/LinkedIn fields and return-to-top |

Ask Anees is an honest planned-feature explanation with email fallback—not a fake chatbot, RAG service or backend form. No employment, awards, certifications, contribution graph, users, revenue, downloads or testimonials were invented.

## Particle engine

`components/portfolio/image-atomizer.tsx` adapts the approved `/images/character/desktop/anees-idle.webp` to the original reusable `lib/particle-engine.ts`; `lib/particle-worker.ts` owns the optional worker protocol.

- Samples actual portrait RGB/alpha, ignoring near-transparent pixels. A finite spring-like simulation assembles/scatters toward image targets; no unrelated starfield is rendered.
- Six Float32 structure-of-arrays buffers hold positions/targets/velocities; packed Uint32 colors/output and one ImageData allocation are reused. Squared proximity tests avoid square roots outside the pointer radius. Image sampling occurs at initialization/resize, not per frame.
- Normal sampling is bounded to width 420 / height 630, gap 3 (at most 29,400 candidates). Four-or-fewer-core devices use width 300, gap 4. Actual 1440px Chrome scene: **11,953 particles at 420×508**.
- OffscreenCanvas/Worker is attempted only for eligible fine-pointer desktop scenes with more than four reported cores. Worker/context/animation support is checked; initialization errors and the watchdog recover to main-thread Canvas 2D.
- Generation guards protect asynchronous initialization. ResizeObserver invalidates dimensions; hidden/offscreen work pauses. One loop stops at rest or the 4.5-second safety bound. Replay/pointer events restart necessary work.
- Actual image remains below the decorative `aria-hidden` canvas and is restored at rest. Mobile/touch, reduced motion, forced colors and no-JS use static imagery. Image failure uses the architectural fallback. Pointer listeners never cancel touch/scroll.
- Keyboard replay is a native button. Live preference changes dispose the renderer and immediately restore the image.

### Actual measurements

Chrome **157.0.8103.79**, 1440×1000, devicePixelRatio 1, hardwareConcurrency 8. Re-measured on 17 November 2026: three fresh contexts per path, warmed production server, no CPU/network throttling or simultaneous capture/test browser. [Raw report](../.qa/phase3-finish/particle-benchmark.json).

| Renderer | Initial simulation steps | Total update compute | Total draw compute | Maximum single-step compute, sample range |
| --- | --- | --- | --- | --- |
| Worker | 59 each | 29.1–34.6ms | 87.9–124.6ms | 8.4–20.0ms |
| Forced main thread | 59 each | 31.3–32.7ms | 95.8–99.7ms | 8.7–10.2ms |
| Simulated worker-init failure → main | 59 each | 28.5–29.8ms | 76.9–94.1ms | 6.3–12.0ms |

These are compute totals and CPU-side draw submissions, **not FPS, display frame times or Lighthouse scores**. Replay/proximity cumulative metrics are also recorded. Worker compute was not faster in this sample; its benefit is isolating repeated simulation/draw work from the page main thread, not an asserted speedup. Universal device benefit has not been established.

Regression tests count actual main-thread `putImageData` calls stopping at rest, hidden state and viewport exit—not only unchanged metric attributes. Worker replay/proximity, lower density, hidden failure recovery, offscreen resize, live reduced motion and image failure also pass their tested cases. Separate suite samples are `particle-worker.json`, `particle-main.json` and `particle-worker-failure.json`; values vary with test/capture workload.

## Case studies and source boundaries

| Route | Content / boundary |
| --- | --- |
| `/work/sportlynk` | Private flagship FYP, booking/matchmaking problem, approved product direction, conceptual player/venue/match map, shared-state questions and next steps. **No product screenshots, verified stack, completed backend strategy or release claimed.** Chapter labels/introduction explicitly distinguish concept from implementation |
| `/work/fitpilot` | Food logging/burn planning/day-state workflows, SQLite/Supabase synchronization, pure Dart engines, identity/retry/UTC trade-offs, three real screens and source-linked map |
| `/work/sukoon` | Offline prayer, native scheduling/DND, versioned Flutter/Android boundary, permission/restoration trade-offs and three real screens. Owner-confirmed completed personal project, not verified store release |
| `/work/eduverse` | Student/teacher/admin workflows, course/quiz/attempt records, Firebase **Realtime Database**, separate-write consistency trade-offs and three real screens. Study rooms/push delivery remain roadmap |

Seventeen selected files matched revision-pinned upstream bytes. Revisions, files and image origins: [CONTENT_SOURCES.md](CONTENT_SOURCES.md). Public-project tests were read, **not executed for this portfolio**. Takeaways are labeled code observations; personal contribution, first-person challenges, learning dates and outcomes need owner input.

The template omits unavailable gallery/technology/takeaway sections. Diagrams are simplified source responsibilities or explicitly conceptual relationships—not certified deployment architecture. Nine new screenshots are resized/compressed originals with XMP sources and provenance sidecars. Fifteen-raster scan: zero missing origins. Decoded RGBA hashes verify 12 sidecar-covered images retain identical dimensions/pixels. Original character sources and private photos are untouched.

Unknown `/work/:slug` returns HTTP 404 through a narrow installed-Next-compatible proxy before streaming. Next 16.4.6 docs were consulted for async params/static generation, metadata, images, server/client boundaries and proxy; no incompatible `dynamicParams` setting was added with Cache Components.

## Trail and playground

The five themes are foundation, everyday personal products, interface/data exploration, SportLynk and further learning. Stable IDs, optional periods, project associations and links are typed in `lib/profile-content.ts`. Motion `useScroll` updates path/marker without per-frame React state; ResizeObserver measures chapter starts. Upward scroll reverses it; narrow/reduced layouts provide static stacked reading. The marker is geometry, not a falsely rigged walking portrait. Dates/employment stay absent until verified.

`lib/concurrency-lab.ts` is a deterministic teaching model. It illustrates stale reads and one controlled final claim; it **does not** implement real database locks, networks, retries, cancellation or distributed transactions, and is not connected to SportLynk. Native step controls, explicit player/result text, polite announcements, reset and a no-JS written explanation preserve meaning without animation. No continuous game loop or unrelated games were added.

## Responsive and accessibility

Production Chrome covers **320, 375, 390, 414, 768, 1024, 1280, 1440 and 1920px**. Every width also covers **200% root text on all five routes**: no page overflow, retained intrinsic heading/paragraph/summary/control text and vertical laptop-screen containment. Mobile is naturally stacked; desktop project pinning requires sufficient viewport/text-relative space. Root-text enlargement is not identical to browser zoom or real assistive-technology testing.

Visual inspection exposed a narrow laptop overflowing its aspect-ratio screen despite the first broad suite passing. A stronger regression reproduced it; the final small-space fallback removes its ratio constraint rather than hiding text. Architecture headers reflow label/index/icon without crushing technology names. Notebook width and trail links are also intrinsic fixes. The contact headline gets a full-width reading column before its action on narrow/text-relative layouts, preventing orphaned punctuation.

Keyboard/menu/anchor focus, Escape/focus restoration for native notes/galleries, lamp checkbox, touch emulation, no-JS reading/links/disclosures, RTL smoke, image fallback and initial/live reduced motion are tested. Axe checks for homepage, open menu/notes, both night-workshop widths, lab and all case routes use WCAG 2 A/AA, 2.1 AA and 2.2 AA tags. Their passing scope does not imply exhaustive WCAG certification or a real screen-reader session.

Reduced motion restores the image, removes canvas/replay/spatial pinning, completes the SVG path, clears active trail emphasis and removes request/spatial CSS transitions while preserving immediate controls. Existing duration parsing, entrance cleanup, native navigation, project lift/zoom and stacked/no-JS fallbacks remain. No wheel interception, scroll trapping, body lock, custom cursor or smooth-scroll dependency was introduced.

## Loading observations

[Six fresh-context local observations](../.qa/phase3-finish/performance.json), warmed production server, no CPU/network throttling, initial viewport, Chrome 157.0.8103.79 / devicePixelRatio 1 / 8 reported cores. Re-measured on 17 November 2026; not field or low-power-device performance.

| Width | LCP across three runs | CLS across three runs | Main-document script transfer |
| --- | --- | --- | --- |
| 1440px | 532 / 324 / 304ms | 0 / 0 / 0 | 216,828 bytes each |
| 390px | 304 / 336 / 324ms | 0 / 0 / 0 | 216,828 bytes each |

Script transfer excludes worker-context resources and is not full bundle/page weight. Main-thread long tasks ranged **50–235ms**; no jank-free load claim is made. Desktop initialized a worker portrait; mobile no particle renderer. Engine code is conditional, images reserve dimensions, loops stop offscreen/hidden/rest. Real-network/device profiling remains outside this local sample.

## Verification record

Lint, typecheck and production Next.js 16.4.6 build pass. The 17 November continuation first reproduced the incoming **83-case pass in 5.1 minutes**, then secured every case-study file/directory evidence link to its reviewed revision and added two source-boundary regressions. The final complete production suite passes **85 cases in 7.6 minutes**, retaining all **42 Phase 2 cases** plus **43 expansion cases**, including concept labels, narrow contact and immutable evidence/no-JS checks. No baseline test was deleted or weakened to make the suite pass.

| Required check | Final result |
| --- | --- |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass; homepage and four generated work routes; Cache Components/Partial Prefetching retained |
| `npm run test:e2e` | 85 passed, production Chrome, one worker, 7.6 minutes |
| `git diff --check` | Pass; non-failing line-ending notices only |

The incoming run's notebook failure/hung Windows preview teardown is in the audit, not described as a success. Final tests use a separately owned production server and the existing reuse setting, allowing clean completion. Launcher NO_COLOR/FORCE_COLOR and Git CRLF conversion notices are environment notices, not application failures. `git diff --check` passes. Static detector: zero primary findings, 71 advisory type/radius comparisons against preserved Phase 1 extraction; this is not proof of visual quality.

## Independent review

Latest continuation detector result: `[]` in `.qa/phase3-finish/detector-final.json`; the earlier advisory-only result above is historical. Artifact integrity check passes: 71 gallery destinations, 50 decodable linked PNGs, no missing files or captured page errors, matching WebM byte count and successful decoded playback. Report: `.qa/phase3-finish/handoff-verification.json`. This scan supplements actual visual inspection, not replaces it.

The earlier review requested concept-led SportLynk labels, documentation, narrow contact and removal of a redundant case-exit eyebrow; those fixes remain. The previously pending handoff is now closed: a fresh read-only finish reviewer opened twelve current captures and representative source, returning **ship**, with no material application/content fixes. Its bounded verdict and unreviewed areas are recorded in [PHASE3_DESIGN_REVIEW.md](PHASE3_DESIGN_REVIEW.md). Runtime evidence is supplied to the reviewer, not claimed as independently rerun. The builder corrected two clipped lab captures to settled full-widget 1440×1400 views; no application source change was required for that capture correction.

## Review artifacts

- [Local gallery](../.qa/phase3-finish/review.html): complete desktop/mobile homepage, all four full case routes at 1440/390, nine width sheets, full-size sections and interaction states.
- [Actual recording](../.qa/phase3-finish/phase3-demo.webm): **49.516 seconds, 1440×1000, 6,082,317 bytes**, 630 captured CDP frames encoded by Chrome MediaRecorder. Newly recorded on 17 November; covers hero assembly/proximity, workspace, selected work, genuine case/gallery/architecture, engineering, forward/reverse trail, both lab approaches and contact. Metadata: [recording.json](../.qa/phase3-finish/recording.json).
- [Decoded frames](../.qa/phase3-finish/recording-frames.png), [playback verification](../.qa/phase3-finish/recording-verification.json): actual WebM decoded in Chrome, no video error, time advances; 21 sought frames inspected. Encoder configuration/capture count is not site FPS.
- [Capture results](../.qa/phase3-finish/capture-results.json), [detail results](../.qa/phase3-finish/detail-capture-results.json), [source verification](../.qa/phase3-finish/sources/verification.json), [raster hashes](../.qa/phase3-finish/raster-provenance-check.json) and local Playwright HTML report support the record.

Still captures were opened and inspected, including full-size regions—not only long-page thumbnails. Desktop full-page disables pinning through reduced motion to show every project; the recording demonstrates normal desktop motion. Physical-device, Safari/Firefox or screen-reader approval is not implied.

## Components and files

| Area | Paths |
| --- | --- |
| Routes/shell | `app/page.tsx`, `app/work/[slug]/page.tsx`, `proxy.ts` |
| Styles/tokens | `app/portfolio.css`, `app/tokens.css` |
| Portrait | `components/portfolio/image-atomizer.tsx`, `lib/particle-engine.ts`, `lib/particle-worker.ts` |
| Case stories | `components/portfolio/case-study.tsx`, `architecture-explorer.tsx`, `project-gallery.tsx`; `lib/case-studies.ts` |
| New homepage passages | `components/portfolio/engineering.tsx`, `build-trail.tsx`, `trail-motion.tsx`, `playground.tsx`, `concurrency-lab.tsx`, `evidence.tsx`; `lib/profile-content.ts`, `lib/concurrency-lab.ts` |
| Improved incumbent | `hero.tsx`, `character-scene.tsx`, `workspace-scene.tsx`, `selected-work.tsx`, `project-journey.tsx`, `about.tsx`, `contact.tsx`, `site-header.tsx`, `motion.tsx` under `components/portfolio/`; `lib/portfolio-content.ts` |
| Assets | Nine `public/projects/stories/*.webp` original-derived screens/origin sidecars; three character-origin sidecars; `public/images/character/README.md`. Source images unchanged |
| Tests | New `tests/phase3.spec.ts`, `phase3-hardening.spec.ts`, `source-evidence.spec.ts`; retained `portfolio.spec.ts`, `phase2.spec.ts`, `phase2-completion.spec.ts` |
| Documentation | `AGENTS.md`, `PRODUCT.md`, `README.md`, status/build/design/source records, direction/audit, this delivery, personal inputs and third-party notices |

No dependencies added. Motion remains primary; no paid source, GSAP, Lenis, 3D engine, copied reference source, backend form or AI service. [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) records licensing research/non-reuse.

## Remaining limits

- SportLynk needs approved screenshots, stack/completion checklist, architecture, contribution and decisions before its technical story expands beyond concept.
- Public-project contribution/motivation/lessons/outcomes, full dated education/career history, achievements and availability need owner confirmation.
- No approved public photo, resume or LinkedIn is registered. Their models/layouts are ready; no private reference or fake link is exposed.
- Independent facial/greeting/typing/walking needs aligned artwork. Only approved portrait/whole poses are used; original transparent portrait export could improve hair edges.
- Physical devices/trackpads, Safari, Firefox, real screen readers and realistic network/CPU performance were not tested. Chrome viewport/touch/root-text emulation cannot certify them.
- Worker isolation is recoverable/capability-gated, not proven universally faster. Local load long tasks are disclosed.
- Root `DESIGN.md` / `.impeccable/design.json` remain historical Phase 1 extraction. Current Phase 3 behavior is in `docs/DESIGN_SYSTEM.md`; no unsolicited tooling migration.
- Email requires a visitor mail app; no contact backend. Ask Anees AI and deployment are explicitly excluded.

Incoming work remains recoverable at `docs/workspace-snapshot/phase-3-resume-20261116-211641/` and the new `docs/workspace-snapshot/phase-3-final-20261117/` copy of all 69 incoming modified/untracked paths. Earlier review artifacts are preserved in `.qa/phase3-before-final-20261117/`; the final gallery holds current captures and measurements. No reset, new branch, commit, user-file deletion or publication occurred.
