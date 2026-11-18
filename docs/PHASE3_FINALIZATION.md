# Copper Atelier — Phase 3 finalization

Implementation began 17 November 2026 and continued on 18 November (Asia/Karachi). This report supersedes the earlier four-experience descriptions, not the preserved historical evidence. No deployment, publication, commit, push, AI backend, new rendering library or generated character is part of this assignment.

## Exit gate

**Phase 3 is ready for a separately authorized Phase 4 within the documented approved-content and local-Chrome verification limits.** The four experiences are implemented, lint/typecheck/build exit zero, the complete production suite exits zero with **102 passed in 5.9 minutes**, all nine widths and real interaction recordings have been rendered and inspected, and the fresh independent visual review's two material fixes are resolved. No required implementation or known failing regression remains. No deployment, publication, commit, push or Phase 4 work occurred.

The previous report's “ship” verdict did not establish that the active-pointer equilibrium bug or mobile portrait interaction worked. This gate uses fresh implementation tests and captures, not that earlier approval. Physical-device/other-browser/screen-reader testing, private project evidence and optional personal assets remain explicitly unperformed or unavailable, not claimed complete.

## Starting state and safeguards

- Branch `master`; clean working tree at entry. Git reported a permission warning reading the user's global ignore configuration. No uncommitted user files needed merging; no reset, clean, branch change or user-file deletion occurred.
- Baseline lint, strict type checking and production build exited zero. Every one of the 85 browser cases reported passing. The Windows runner then hung in owned-web-server teardown; only the identified task-owned preview/test processes were terminated. Its eventual process result was `-1`, not a clean script success.
- Baseline logs, four rendered section captures and reference evidence remain under `.qa/phase3-finalization/`. Existing illustration originals, public screenshots, unused legacy components and previous QA directories are preserved.
- Read the product, source/evidence records, current/historical design and delivery documents, character guidance, applicable skill guidance and installed Next 16.4.6 server/client, image and request-time documentation. Cache Components and the unknown-case-study proxy are retained.

## Reference study

Opened the live Elliott portfolio and the “Walking Through My Career” article in headless Chrome. Network access initially failed inside the sandbox; approved access succeeded. Saved the live page/article text, full-page captures and four real scroll-position captures. The article explains a scroll-driven pinned world, scroll-synchronized sprite progression, layered scene occlusion, reversible sequencing and clean unpinning. The live contact offers explicit choices and a visible email address.

The transfer is behavioral, not visual or source reuse: a bounded continuous archive, chapter-associated artifacts, a copper path controlled by native scroll, direct wayfinding and clear contact actions. No globe, buildings, character, branding, animation source or external reference code was copied.

## What was wrong

| Experience | Verified root cause | Correction |
| --- | --- | --- |
| Atomizer | Eligibility combined width, hover and fine-pointer conditions; pointer handling rejected every non-mouse event. Both main and worker settlement restored the original image, even when the pointer still occupied the repulsion field. Global average velocity and a 4.5-second timeout were not proof of target reassembly. | Capability/preference eligibility, actual touch gestures, independent representation/contact/simulation/phase state, displacement-aware settlement and sequence-tagged worker results. |
| Follow the Thread | An SVG map changed its line and marker while the chapter list stayed essentially independent. Stations were not direct chapter controls; mobile hid the map. | One continuous editorial archive: scene sheets, verified project artifacts, a measured copper route, native chapter anchors, synchronized selected state, reversible scroll and a complete inline reading adaptation. |
| Workbench | The physical-desk metaphor made unrelated objects, whole character poses and floating notes the navigation. This was working software in the wrong visual direction. | Replace the mounted desk with an evidence-led engineering folio, native project/view selectors and an integrated work surface. |
| Contact | The circular action and planned-assistant block diluted the direct email destination; no copy action existed. | A focused editorial close, explicit mailto and copy actions, verified GitHub, honest clipboard feedback, brand signature and native back-to-top. |

## Atomizer architecture

`ImageAtomizer` is the lifecycle adapter; `ParticleEngine` owns image-derived positions/colors and physics; `particle-worker.ts` uses the same engine off the main thread when supported.

- `data-particle-state` controls image/canvas representation: `resting` or `active`.
- `data-particle-interaction` records the current hover, touch, replay or no-interaction mode.
- `data-particle-simulation` distinguishes running, settled and paused computation.
- `data-particle-phase` distinguishes assembled, dispersing, holding and reassembling.
- An equilibrium result while hovered/touched stops the RAF loop but leaves the displaced canvas visible. Pointer motion restarts it; leaving removes the field and restarts target return. Only a genuine reassembled result restores the static portrait.
- Worker pointer/replay commands carry a monotonically increasing sequence. An obsolete worker settlement cannot settle a newer gesture. Worker readiness draws an assembled portrait rather than playing an unsolicited intro. Runtime failure reconstructs a fresh main-thread canvas and resumes a still-active hover field.
- Springs use bounded timesteps and damping. Settlement requires maximum velocity below threshold for ten frames; return also requires every particle within 0.25 sample pixels of its target. The remaining subpixel error is finalized exactly before reporting reassembled. There is no elapsed-time substitute for reassembly.
- Replay gives bounded velocity impulses instead of jumping particle coordinates. Proximity remains radial and limited to 15% of sampled width. The rest of the portrait retains its targets and recognizable silhouette.
- Six position/target/velocity arrays, packed source colors, one ImageData output and precomputed soft circular color stamps are reused. No sampling or particle-object allocation happens per animation frame. The stamps soften square block edges without blur, masks or a fake duplicate portrait.

### Desktop

Starts with the real assembled image. Entry activates the sampled portrait and a moving radial field. Stationary equilibrium remains visible without further frames. Exit returns targets smoothly, followed by the original image. Keyboard replay uses the native button and the same renderer.

### Mobile

Touch devices get a real lower-density main-thread engine. Tap creates a brief response; horizontal touch-and-drag moves the field. The field lasts at most the remaining portion of a 220ms minimum tap response before target return. Pointer cancellation ends it immediately. `touch-action: pan-y` preserves native vertical scrolling; no portrait handler calls `preventDefault()` or captures the pointer.

A regression exposed a subtle secondary bug: browsers synthesize touch `pointerleave` after release. Treating that as a mouse exit canceled the short pulse before it could draw. Leave handling now distinguishes contact type and the released pointer ID. A fresh-tap test verifies nonzero actual particle displacement, not merely a toggled attribute.

### Fallbacks and sizing

Reduced motion and forced colors remove the decorative renderer and replay. The semantic portrait survives without JS/canvas. A failed approved image uses the architectural fallback. Four-or-fewer-core and coarse-pointer devices cap sampling at width 300/gap 4; other capable scenes cap width 420/gap 3, height 630. DPR participates in sampling within those limits; the CSS canvas preserves the measured stage ratio. Resize invalidates the source; hidden/offscreen work pauses, shows the image and reinitializes safely on return. Image sampling/context failure stays static. Worker construction, readiness timeout and runtime errors recover to main-thread rendering.

## Follow the Thread

Five existing date-free themes remain authoritative: foundation, everyday projects, underneath the interface, SportLynk and further direction. These are thematic academic/personal chapters, not a newly invented chronology.

The desktop scene is an engineering archive on Linen: fine copper route, chapter number/category, layered actual FitPilot/Sukoon/EduVerse screens, a source-responsibility view, an explicitly conceptual SportLynk product connection and two typographic studies. Artifact captions distinguish actual screens from concepts. The scene and chapter controls are sticky only with sufficient physical and text-relative viewport room; five chapters occupy a bounded approximately 3.25 viewport-height reading range. No wheel or touch interception exists.

Motion `useScroll` provides native progress. Measured chapter offsets calibrate each route segment. Late-segment sheet opacity/translation follows scroll directly, not a slideshow timer. Upward scrolling reverses the route, marker, sheet interpolation and chapter emphasis. Selected chapter links seek the real chapter, focus its semantic target, update the URL and derive their `aria-current="step"` from actual progress. Controls stay available in the desktop sticky passage and release with the archive at its end.

Narrow, short and enlarged-text layouts become a complete vertical journey: visible copper connection, actual artifacts, readable text and tap-select links. Reduced motion immediately removes spatial pinning and shows this same reading version. Server-rendered chapter content and native links work without hydration; the duplicated desktop visual is decorative, not a second reading order.

## Anees’s Digital Atelier

The existing section ID remains `workspace` to preserve navigation. The mounted character, lamp, furniture, laptop, bug and detached popovers are gone. Their original implementation files/assets remain preserved and unused.

An integrated project index selects SportLynk, FitPilot, Sukoon or EduVerse. The main presentation changes its name, purpose, status, real media, verified technologies, contextual decision and full case-study destination. SportLynk contains a clearly labeled conceptual product connection, no invented product screenshot or stack. Unapproved personal-contribution claims are omitted.

Two native radio groups select the project and one of three server-rendered views through CSS `:has`, so selection also works without JS:

- **Projects:** dominant project presentation, authentic paired screens or the explicitly conceptual artifact.
- **Engineering Notes:** an integrated decision/constraint reading spread with immutable implementation evidence where available. FitPilot retains the genuine neutral-day/StreakEngine lesson; SportLynk notes remain product questions plus a separate educational example.
- **Build Log:** real documented current state and existing next steps, explicitly a snapshot rather than an invented sequence of commits or dates.

Native arrow-key selection, Space, pointer and touch work; checked/focus states are visible on the associated labels. A brief shared-token transition communicates selection. Live reduced motion disables it. Text-relative container rules—not just fixed viewport breakpoints—recompose the project index/work surface at doubled text; this fixes actual enlarged-text overflow reproduced by regression tests.

The complete suite also exposed a 320px/200%-text journey defect that the narrower focused set did not cover: the fixed two-column artifact annotations and anonymous flex text retained their intrinsic minimum widths. The final adaptation reclaims chapter width, stacks source-responsibility imagery/annotations, and permits actual word wrapping inside an explicit text element. The copper connection and every artifact remain present; overflow is not hidden to evade this assertion. A separate inherited decorative orbit intentionally extended beyond its background; clipping only that aria-hidden background contains it without clipping the portrait, focus or content.

## Contact finale

“Have something worth building?” closes with Instrument Serif, restrained copper detailing and useful focus copy. The real address is visible, selectable and linked to `mailto:muhammadanees0511@gmail.com`; “Write to Anees” is an explicit email-client action. Copy Email appears only when enhanced, confirms an actual clipboard write and gives a selection/mailto recovery if access fails. Pending copy is disabled; feedback is polite, and timers clean up on unmount.

Only configured verified GitHub, LinkedIn and resume destinations can render; currently only GitHub exists. No contact submission service was found, so there is no fake form or false sent state. The inactive Ask Anees block is removed from the footer; the AI service remains out of scope. A request-time server component supplies the current year with installed Next `connection()` inside Suspense. Footer navigation and back-to-top use real anchors and the existing reduced-motion/focus behavior.

## Regression and accessibility policy

All 85 existing test cases remain represented. Tests for the explicitly rejected desk and absent assistant were migrated to equivalent native-control, touch, keyboard, focus, evidence, no-JS, enlarged-text and fallback coverage on their replacements. Tests for all unrelated completed sections remain intact. No test was skipped or deleted to hide a failure.

New coverage includes held equilibrium in both renderers with real displacement and draw-stop assertions; mobile tap/drag/release/cancel/native scroll; forced colors; runtime worker failure; missing canvas; DPR/resize; chapter selection, reverse and release; all four project/views; clipboard success/failure and final accessibility scans. The fresh visual review adds a seventeenth regression requiring actual rendered project-name/closing-word/punctuation ranges to remain whole at doubled text. Short state transitions are captured with a real MutationObserver so busy-machine round trips cannot miss a completed reassembly; the assertions still require an active canvas during actual return.

One h1, semantic headings/regions, native selectors and navigation, visible focus, useful image alt text, decorative aria-hidden canvas/desktop archive, no focus trap, no hover-only information and live preference fallbacks are retained. Chrome axe scans are regression evidence, not exhaustive WCAG or screen-reader certification. Doubled root text is not identical to browser zoom.

### Important source changes

| File | Change |
| --- | --- |
| `components/portfolio/image-atomizer.tsx` | Independent representation/interaction/simulation/return lifecycle, touch gestures, stale-worker protection and recovery |
| `lib/particle-engine.ts`, `lib/particle-worker.ts` | Actual radial displacement, spring/quiet return criteria, reusable softer stamps, sequence-tagged settlement and measurable equilibrium |
| `components/portfolio/character-scene.tsx` | Truthful touch/desktop interaction hint; approved hero identity retained |
| `components/portfolio/build-trail.tsx`, `trail-motion.tsx`, `trail-artifact.tsx` | Server narrative/anchors, measured reversible sticky environment and meaningful chapter artifacts |
| `components/portfolio/workspace-scene.tsx`, `workspace-interaction.tsx`, `project-artifact.tsx` | Professional folio, native project/view selectors, real screens/concept labeling, evidence-linked notes and documented snapshot |
| `components/portfolio/contact.tsx`, `copy-email.tsx` | Editorial finale, verified links, clipboard success/failure and request-time year |
| `app/portfolio.css` | Scoped folio/thread/footer composition, mobile/enlarged-text adaptations, touch/focus/selected states; token authority unchanged |
| `tests/phase3-finalization.spec.ts` | Seventeen added regression cases, including mandatory held equilibrium in both renderers and unbroken enlarged editorial words |
| Existing Phase 2/3 and portfolio test files | Preserve or migrate all prior cases to meaningful replacement behavior; unrelated coverage remains intact |
| Product/source/character guidance and Phase 3 documents | Correct current asset use, interaction contract, actual verification, evidence and limits |

Former workspace interaction/popover/character files and original illustrations were not deleted. No shipping screenshot/portrait raster was replaced; source provenance remains intact.

## Verification, measurements and rendered evidence

Lint, strict typecheck and production build exit zero on the current source. The 42-case focused production suite passes in 5.0 minutes. Three enlarged-text/RTL regressions passed in 19.3 seconds after the intrinsic-layout correction. After the independent review's heading/notes fixes, four focused enlarged-word/overflow/RTL cases pass in **21.5 seconds**. **The complete final production browser suite exits zero: 102 passed in 5.9 minutes**, with no failed or skipped cases: 85 prior retained/equivalent cases plus 17 new regressions. The Windows preview is started separately so Playwright reuses it instead of hanging in owned-server teardown.

| Executed check | Actual final result | Preserved output |
| --- | --- | --- |
| `npm run lint` | Exit 0 | `.qa/phase3-finalization/final-lint.txt` |
| `npm run typecheck` | Exit 0 | `.qa/phase3-finalization/final-typecheck.txt` |
| `npm run build` | Exit 0; homepage and four case routes generated, Cache Components/proxy retained | `.qa/phase3-finalization/final-build.txt` |
| `npm run test:e2e` | Exit 0; 102 passed, 5.9 minutes | `.qa/phase3-finalization/final-browser.txt` |
| Focused lifecycle/Atelier/Phase 2 run | Exit 0; 42 passed, 5.0 minutes | `final-focused-browser.txt` |
| Enlarged-text/RTL regression | Exit 0; 3 passed, 19.3 seconds | `final-text-regression.txt` |
| Review-fix regression | Exit 0; 4 passed, 21.5 seconds | `final-review-regression.txt` |
| Screenshot/recording capture, playback verification and local measurements | All exited 0 | Capture/video/performance output and JSON evidence |

The first complete implementation run (100 cases) produced 68 passes / 32 failures in 21.4 minutes. After corrections, the next 101-case run produced 98 passes / 3 failures in 6.4 minutes; intrinsic journey/decoration overflow was fixed and all 101 passed in 6.1 minutes before visual review. The initial narrow containment attempt failed three focused cases; the review's first size-only attempt failed the new whole-name assertion before side-padding correction. Their outputs and earlier failure traces remain preserved; these are resolved intermediate failures, not omitted results. The final additional heading regression raises the suite to 102, all green. CLI color-environment and global Git-ignore/font-cache permission warnings are not browser console failures and do not convert a nonzero run into a claimed success.

### Rendered inspection

Captured and opened current rendered review sheets at **320, 375, 390, 414, 768, 1024, 1280, 1440 and 1920px**, plus full-size particle movement/equilibrium/mobile, project/notes/log, chapter entry/middle/final, desktop/mobile contact and enlarged-text states. No horizontal page overflow was observed at the nine normal widths. Native sticky behavior is inspected through actual entry/middle/final/reverse/direct/release viewport frames; a tall section capture freezes the sticky scene at one scroll position and is not a simultaneous composition of every chapter.

Chrome **157.0.8103.79** reports **zero page/console errors or HTTP failures** in the final normal-surface/interaction capture. Full-page and individual-surface captures, copied/failure feedback, keyboard focus, all project selections, mobile modes and reduced-motion reading are in the gallery. Doubled-root-text captures at 320/768/1440 supplement full-route automated coverage.

Both final real-interaction recordings decode and play in Chrome: desktop **29.73 seconds at 1440×1000**; emulated mobile **9.79 seconds at 390×844**. Playback advances normally and nine frames per recording were decoded and opened as review sheets; no video error is reported. They show actual portrait interaction, project/view selection, chapter navigation and contact—not a fake animation or static scroll-only demonstration. The back-to-top screenshot was refreshed after actual `scrollY` settlement rather than a fixed time during the upward scroll; the parent opened the settled home capture. A transient lazy image load can appear in a recording frame; settled screenshot/test evidence verifies the genuine media loaded.

The post-capture design detector ran once and exited zero: **80 advisory-only historical ramp findings** (71 font sizes, 9 radii), **zero non-advisory findings**. The detector compares against the explicitly preserved Phase 1 `DESIGN.md`; current responsive sizes and compositions are governed by `docs/DESIGN_SYSTEM.md`. This is acknowledged pre-existing authority drift, not permission to rewrite the historical root documents or replace approved brand roles.

A fresh read-only independent finish reviewer inspected all nine width sheets and detailed particle/project/thread/contact/doubled-text captures. Its first verdict was **fix**, not silently reported as approval: keep project/closing words whole at enlarged text and remove above-heading note eyebrows. The final text-relative display sizing and reclaimed folio measure preserve enlarged body/control text; note distinction remains in semantic section names without visible eyebrows. Refreshed 320px/200% and notes captures were independently scored **resolved / resolved, disposition: ship**, with no material regressions visible in refreshed 320/1440 sheets. This verdict covers the reviewed visual fixes, not test certification or unperformed physical devices. The first review and final scoring are preserved in `finish-review.txt` and `finish-review-verdict.txt`; no inherited conversation or prior “ship” result was used. The parent also opened all 115 decoded capture files as eight labeled validity sheets and inspected full-size key states; thumbnails alone did not establish craft.

### Local performance observations

Six fresh Chrome contexts used a warmed local production server, three 1440px runs and three 390px runs, with no CPU/network throttling. Final desktop LCP observations: **524 / 296 / 256ms**; mobile: **260 / 324 / 300ms**. CLS was **0 in all six**. Recorded main-document script transfer was **216,924 bytes desktop / 218,497 bytes mobile**, excluding separately loaded worker resources. Long-task counts were **3/1/1 desktop and 1/2/1 mobile**. These are local loading observations, not field Web Vitals or a bundle-size/FPS/Lighthouse certification.

| Renderer probe | Particles | Mean update / draw CPU time | Max observed update+draw | Wall time to held equilibrium | Held metrics unchanged while stationary |
| --- | ---: | --- | --- | --- | --- |
| Main | 11,953 | 0.799 / 1.183ms | 11.7ms | 779ms | Yes |
| Worker | 11,953 | 0.907 / 1.177ms | 12.5ms | 800ms | Yes |
| Emulated low-core | 3,446 | 0.292 / 0.659ms | 8.7ms | 733ms | Yes |

Each probe reaches a visibly displaced held state and then verified target reassembly (94 total frames main/worker; 88 low-core). All three stop advancing metrics during the stationary hold. Worker timing is not claimed to outperform the main renderer: this run does not show that. These timings exclude full browser compositing and have no controlled before/after comparison; no measured improvement percentage or universal frame-rate claim is made.

Evidence is local and ignored by Git:

- `.qa/phase3-finalization/review.html`: rendered screenshot and real-interaction recording gallery.
- `screenshots/`: all nine widths, individual surfaces, project/view states, particle phases, chapter states, focus and contact feedback.
- `recordings/desktop-interactions.webm` and `mobile-interactions.webm`: actual CDP frames encoded using the existing browser MediaRecorder; no ffmpeg installation or new tooling dependency. Playwright's video binary was absent, so the existing repository recording technique was reused.
- `interaction-evidence.json`: viewport/interaction state and console/network observations.
- `performance.json`: fresh-context local loading observations and main/worker/low-core particle measurements.
- `recording-verification.json`: actual Chrome playback/time advancement and decoded frames.
- Baseline, intermediate/final command output and failure traces remain available; corrected failures are not erased.

## Limits and Phase 4 handoff

No physical phone, tablet, trackpad, Safari, Firefox or real screen-reader session is claimed. Local Chrome touch emulation demonstrates browser gesture behavior, not every mobile browser. Local performance is unthrottled and not field performance or an FPS/Lighthouse score.

Approved original transparent portrait edges would improve the inherited checkerboard-removal derivative. SportLynk implementation/screens/stack, personal contributions and dated history remain subject to owner approval. Public photo, resume and LinkedIn are absent, not placeholders. No new asset or AI backend is necessary for these four delivered experiences. Phase 4 is not started; its scope remains a separate owner decision.
