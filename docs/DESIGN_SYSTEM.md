# Muhammad Anees — Portfolio design system

## Phase 3R-3 About / Selected Work contract — 20 November 2026

This is a professional personal developer portfolio. The eight exact primitives, accessible derived roles, optimized Instrument Serif / DM Sans / IBM Plex Mono fonts and `app/tokens.css` authority are unchanged. Copper is an accent, not a studio identity. Current About/Work styling lives in the scoped `components/portfolio/about-work.module.css`; no broad token/global-style redesign is introduced. The earlier contracts below are historical wherever superseded here.

### About

- Immediately after Hero, with the heading **About**, a spacious Linen surface, oversized quiet name typography, restrained geometry and a biography/fact notebook sourced from `profileContent` and `profile`.
- The approved 480×480 working illustration is a static, partially transparent asset on a light surface. Its existing desk, laptop, mug and plant are not overlaid with fabricated props or animation. No contact-sheet frames, new face, private photograph or opaque checkerboard original are used.
- One measured opposing image/text entrance uses the shared timing/easing tokens and a maximum 24px translation. It does not pin, loop or control scrolling. Touch, reduced motion and failed-image states keep a complete static composition; live reduced-motion changes settle the entrance.
- Text-relative container rules preserve actual doubled body/control sizing and recompose the notebook instead of hiding or clipping biography, facts or actions.

### One project inspector

- Four real server-rendered project articles retain `#sportlynk`, `#fitpilot`, `#sukoon` and `#eduverse`. `#work` identifies the section and `#workspace` identifies its native navigation/perspective controls. About retains `#about`.
- Native project anchor links and Projects / Engineering Notes / Build Log radio controls operate on the same project. Notes expose existing decisions, constraints and source links; Build Log is a documented snapshot, not a fabricated chronological history. All perspectives work without JavaScript.
- SportLynk retains original conceptual court artwork and its private, in-development Final Year Project status, without an invented stack or screenshot. FitPilot uses Today / Log / Plan; Sukoon uses Home / Permissions / Tracker; EduVerse uses Student Course / Teacher / Admin. Genuine screens retain their product colours and aspect ratios. Existing Flutter/native integration, local/sync and Firebase Realtime Database context comes from the unchanged case-study data.
- The old separate workspace gallery is no longer mounted. Its useful inspection content is integrated; the reusable conceptual `SportLynkPreview` remains available to the unchanged case-study route.

### Shared finite choreography and accessibility

- `ProjectJourney` owns one stable `SceneBoundary` factory named `selected-work`; the old Motion scroll subscription is removed. Only the scoped GSAP timeline interface writes Work transforms. No direct ScrollTrigger import, second provider, global observer, wheel/touch interception or new smooth-scroll engine is introduced.
- Actual stage, complete deck, navigation and CTA elements determine fit. The pin distance is bounded to **2.7 available viewport heights**. Four reading holds occupy normalized progress `0–.16`, `.28–.44`, `.56–.72`, `.84–1`; real project anchors map to `.08`, `.36`, `.64`, `.92`. Background planes and authentic screens move at different rates, titles cross local clipping boundaries, and copy/screen labels retain contrast during transitions. Background overscan is staged-only, not empty static spacing.
- Eligible fine-pointer desktop fits pin; measured 1024×600 and 1280×720 fall back, while 1440×900 fits. Mobile, touch-capable desktop, no-JS, enlarged-text and reduced-motion modes keep complete stacked chapters. Live preference changes retain the selected real content, focus and reading position. Inactive staged contents are inert/aria-hidden, with no hidden focusable controls or duplicate project panels.
- Native anchors, direct hashes, browser history and deterministic reverse progress remain authoritative. Registration cleanup removes owned timeline, listeners and measurement observer, including Next.js cached-route hiding. Two regression-backed runtime guards prevent completed static scenes remaining pending and hashes resolving before upstream readiness; the shared contract/provider/boundary are unchanged.
- Homepage order is Hero → About → Selected Work → existing Engineering → Follow the Thread → Always Building → Evidence → Contact. No downstream section is redesigned. Header section tracking follows this actual DOM order.

Verification is assertion-only: lint/typecheck/build pass, **198/198** fixture-enabled browser cases and **36/36** fixture-disabled About/Work cases pass. No screenshots, videos, traces, new review boards or visual approval were produced. Actual coverage limits and file changes are in [PHASE3_DELIVERY.md](PHASE3_DELIVERY.md).

## Phase 3 finalization contract — 18 November 2026

This contract supersedes the earlier desk, static-touch portrait and simple trail descriptions below; those remain historical. The eight exact primitives, accessible derivatives, optimized fonts and `app/tokens.css` authority are unchanged. Root `DESIGN.md` and `.impeccable/design.json` remain the preserved Phase 1 extraction by repository instruction. Current verification and limits: [PHASE3_FINALIZATION.md](PHASE3_FINALIZATION.md).

- **Portrait:** initially assembled semantic image; image-derived particles on mouse entry, touch tap/slide or keyboard replay. Representation, interaction, simulation and return state are independent. A settled displaced canvas stays visible with no scheduled frames while interaction remains active. Only actual target reassembly restores the image. Touch uses lower sampling density and `pan-y`; vertical scrolling, gesture cancellation, preference changes, hidden/offscreen and renderer failures retain usable fallbacks. The subtle mobile instruction is visible, not hover-only.
- **Digital Atelier:** one editorial engineering folio, not an illustrated desk or dashboard. Four native project selectors and Projects / Engineering Notes / Build Log selectors meaningfully update a dominant project surface and contextual evidence. Genuine screens are distinguished from SportLynk conceptual geometry; the log is a documented snapshot, not a fabricated chronology. Native radios and server-rendered panels remain functional without JavaScript. Text-relative container rules deliberately recompose the folio on small or enlarged-text screens. Original desk components/art remain preserved but unmounted.
- **Follow the Thread:** five truthful, date-free chapters in a continuous copper engineering archive. A bounded desktop sticky environment uses measured native scroll progress for path, active chapter and layered artifact transitions; reversing scroll reverses the same state. Real chapter anchors seek the physical chapter and retain focus/hash navigation. Mobile, short-height, enlarged-text, no-JS and reduced-motion modes show a complete inline journey with chapter artifacts and connecting thread. No wheel interception or horizontal scroll forcing.
- **Contact finale:** a serif closing statement, selectable public email, explicit mailto, enhancement-only clipboard control with actual success/error feedback, verified professional destinations, request-time year, original signature and native back-to-top navigation. No fake form or operational AI claim.
- **Shared feedback:** semantic color roles, copper focus-visible rings, restrained checked/pressed treatments and shared timing/easing tokens. Important content never depends on hover, hydration or an animation finishing. Reduced-motion changes settle the canvas and remove choreography immediately.

Finalization verification: lint/typecheck/production build0; complete production Chrome suite **102 passed in5.9 minutes**. All nine widths, full-route doubled root text and real desktop/emulated-mobile recordings are reviewed. A fresh independent review's enlarged-heading/notes findings are resolved: text-relative narrow display sizing plus reclaimed folio measure keeps real words/punctuation whole without reducing body/control enlargement; note headings carry hierarchy without eyebrows. Independent scoring returns ship for those fixes, not device/accessibility certification. Detailed current evidence and limits remain in `PHASE3_FINALIZATION.md`; older checks below are historical.

## Phase 3 finish verification — 17 November 2026

The expanded experience contract below is retained. A fresh read-only visual/content review of the owner-specified code-led implementation returns **ship**, with no material fixes; scope and limitations are in `PHASE3_DESIGN_REVIEW.md`. All nine widths and all five routes pass current regression coverage, including 200% root text. The 85-case production suite retains all 42 Phase 2 cases. Current screenshots, recording and measured limits are in `PHASE3_DELIVERY.md`.

Case-study implementation links now preserve the exact source revision behind each engineering observation; live project destinations remain separate. No additional visual system, dependency or motion engine was introduced in the final continuation. Missing personal assets remain conditional, never visible filler.

The portfolio remains warm, editorial, and precise. `app/tokens.css` is the implementation authority. Components consume role tokens rather than raw brand literals. Phase 3 expands the existing identity through scale, alternating material surfaces and evidence-led interactions; the eight primitives and three typefaces are unchanged.

**Current implementation, 2026-11-16:** The Phase 3 immersive portfolio includes an image-derived particle portrait, deeper workshop, four source-grounded case studies, engineering workbook, Build Trail and local Concurrency Lab. Current checks and captures are recorded in [PHASE3_DELIVERY.md](PHASE3_DELIVERY.md). The Phase 2 delivery and completion audit remain historical evidence; the implementation details below are retained and expanded by the Phase 3 contract at the end of this document.

## Color primitives

| Primitive | Exact value | Purpose |
| --- | --- | --- |
| Alabaster | `#F4F0E8` | Page background and inverse text |
| Graphite | `#252421` | Primary text and hero scene wall |
| Copper | `#A85D3F` | Original artwork and brand accent |
| Antique Gold | `#C29A55` | Geometric highlights and dark-surface focus |
| Dusty Clay | `#D7B9A5` | Warm artwork and inverse supporting text |
| Espresso | `#302B27` | Dark surfaces, scene inset and ink |
| Linen | `#E7E0D5` | Workspace paper and subtle surfaces |
| Mushroom | `#746D64` | Structural rules and original neutral |

## Readability and tonal balance

All eight primitives remain unchanged. Copper/Alabaster measures **4.29:1** and Mushroom/Alabaster **4.49:1**, below 4.5:1 for normal text. Two role-specific derivatives lower OKLab lightness while retaining a/b, then convert to sRGB:

- `--color-copper-readable: #A2573A`: **4.66:1** against Alabaster, for small accent text, primary button fill and the notebook cover.
- `--color-mushroom-readable: #716A61`: **4.69:1** against Alabaster, for supporting text.

| Rendered role pair | Measured ratio |
| --- | --- |
| Graphite / Alabaster | 13.66:1 |
| Accessible Mushroom / Alabaster | 4.69:1 |
| Alabaster / accessible Copper | 4.66:1 |
| Espresso / Linen | 10.68:1 |
| Espresso / Dusty Clay | 7.58:1 |
| Alabaster / Espresso | 12.31:1 |
| Dusty Clay / Espresso | 7.58:1 |
| Antique Gold / Espresso | 5.36:1 |

Ratios use WCAG sRGB relative luminance. Browser axe scans also check rendered states. Decorative construction lines are not text colors.

Phase 2 gives the hero a Graphite field, separating it from the Alabaster page. Linen and Espresso define the workbench, with restrained Copper/Gold accents. No complementary hue was necessary. New semantic aliases are `--color-scene-wall`, `--color-scene-inset`, `--color-scene-paper`, `--color-scene-ink` and `--color-scene-rule`; all resolve to existing primitives. `--color-overlay-scrim` is Graphite at 16% opacity. The existing 10% black screenshot-edge outline remains. Product screenshots retain their authentic application colors.

## Typography

- **Instrument Serif**, 400 normal/italic: hero, section headings and illustrated notebook title.
- **DM Sans**, variable: body and controls, normally 16px equivalent with 1.65 line height; compact UI uses 14px equivalent.
- **IBM Plex Mono**, 400: actual technology metadata.
- Optimized through `next/font/google`, self-hosted at runtime.
- Display `clamp(3.15rem, 5.6vw, 5.25rem)`; section headings `clamp(2.75rem, 4.4vw, 4rem)`; subheadings `clamp(2rem, 3vw, 2.8rem)`.
- Headings balance; body text wraps naturally. Essential content is never truncated. The hero has four semantic line spans; enlargement can reflow their contents.
- Content captions are at least 12px equivalent. Smaller inscriptions belong only to nonessential decorative art.

## Layout and surfaces

Content max width is 80rem. Desktop gutters grow to 5rem; mobile uses 24px, or 18px at the narrowest breakpoint. The spacing scale is 4, 8, 12, 16, 24, 32, 48, 64, 96 and 128px equivalents. Section spacing scales from 64 to 112px.

The asymmetric hero keeps its introduction, headline, supporting copy, actions, current-project link and technology summary. The architectural character scene occupies the trailing column; below 768px it follows the copy. The new workspace sits between hero and selected work.

The workbench preserves lamp, laptop, notebook, project plaque and bug. Objects and labels now reserve independent grid space instead of sharing absolute coordinates. A container query measured in rem reflows the composition when text grows, without changing the user's chosen text size. The approved character has its own reserved space above the objects. All controls remain available, including at 200% text from 768–1440px.

Navigation uses a content-relative container query at 70rem as well as its narrow-viewport rules, switching to a native disclosure when enlarged labels need more room. Ask Anees remains reachable inside the disclosure. Sticky-header clearance protects anchor destinations. Selected Work presents SportLynk, FitPilot, Sukoon and EduVerse as four editorial scenes. About, Engineering and Journey remain introductory; Contact closes on Espresso.

`ProjectJourney` enhances the stacked server layout only for a fine hover-capable pointer at least 1024px wide, a content width of at least 60rem and available viewport height of at least 38rem. It additionally measures the tallest scene, navigation and exit note; if they cannot fit, it keeps the stacked layout. Enlarged text, touch, reduced motion, short viewports and RTL use the accessible stacked presentation. Container queries also stack scene media/copy when text needs room.

The horizontal track follows native vertical scroll through a sticky container. Travel matches the actual distance between first and last scene; scroll distance is at most three times 90% of the available viewport height. No wheel or touch event is intercepted, no document scroll is locked and no spring delays scroll position. Four numbered anchors, an active underline and a section progress line show location. Arrow keys/Home/End work on the project navigation; focusing an offscreen project reveals it. Direct hashes resolve correctly. An explicit Continue to About link complements normal vertical exit. The header line remains document progress.

Flat tonal fields, fine rules and controlled overlap provide depth. No decorative shadows, blur or gradients. Controls use a 4px radius; media and notes use 12px. The hero panel stays rectangular.

## Components and interaction

| Component | Responsibility |
| --- | --- |
| `SiteHeader` | Native responsive navigation, active location, animated underline, progress line and anchor focus |
| `Hero` / `HeroEntrance` | Server-rendered content with a brief staggered entrance |
| `CharacterScene` | Architectural hero composition, project slip and workspace entry |
| `PointerScene` | Bounded planar foreground/background movement and artwork scroll offset |
| `CharacterFallback` | Original nonfigurative arch and MA study |
| `CharacterPortrait` | Responsive optimized image slot with supplied dimensions and alt text |
| `CharacterAnimation` | Supplied whole-pose selection, bounded frame adapter, visibility/preference settling and failure fallback |
| `WorkspaceScene` | Server-rendered workspace objects, native lamp checkbox and project link |
| `WorkspacePopover` | Reusable native nonmodal note with close button and useful destination |
| `ScrollExperience` / `ScrollProgress` | Once-per-section reveals, anchor focus and document progress |
| `SelectedWork` | Real screenshots, factual content, project hover/focus response |
| `ProjectJourney` | Measured desktop horizontal track, native scroll, project anchors and stacked fallback |
| `WorkspaceInteraction` | Native note toggle events select the registered workspace pose |
| `TextLink` | Shared underlined anchor and arrow with at least a 44px target |
| `About` / `Contact` | Existing personal introduction, interests and direct contact |

`AtelierStudy` is preserved but no longer used by the hero.

Workspace laptop, notebook and bug open real HTML popovers. Only one auto popover stays open; Escape/outside interaction closes it. The close button receives focus and closing returns focus to the invoker. These are nonmodal notes, not focus-trapping dialogs. Lamp state is conveyed by the checkbox, illumination and explicit on/off text. The project plaque navigates to SportLynk. Mobile labels expose the interaction without hover.

Character configuration lives in `lib/character-assets.ts`. The owner approved the primary illustration and sheet. Hero uses the transparent 800×1200 WebP derivative; workspace uses 480×480 standing and seated/laptop illustrations. Rest / At work controls and native note events select actual whole poses. No interpolated typing or facial rig is claimed. Missing states resolve to idle; absent/invalid assets and image failures show the original architectural fallback. `CharacterPortrait` uses optimized Next image props and supports optional mobile art direction through `<picture>`. A bounded sequence adapter supports 1–12 actual frames, minimum 80ms per frame and maximum four seconds total. Independent blink/head/greeting/expression/typing frames are still needed; no arbitrary face distortion or automatic loop is used. Export conventions and exact filenames are in `public/images/character/README.md`.

## Motion language

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Shared entrance and feedback |
| `--duration-entrance` | 600ms | Hero, media and section reveals |
| `--duration-stagger` | 80ms | Hero semantic groups |
| `--duration-feedback` | 150ms | Press feedback |
| `--duration-release` | 100ms | Release feedback |
| `--duration-interface` | 240ms | Notes, lamp and interface transitions |
| `--duration-reduced` | 160ms | Reduced opacity reveals |
| Spring stiffness / damping / mass | 130 / 24 / 0.8 | Pointer settling |

Motion reads CSS tokens through `lib/motion-system.ts`. The unit-aware parser preserves seconds and converts milliseconds to seconds; legacy unitless values mean milliseconds. Native production animation timings are verified as 600ms and 160ms. Shared frames use 14px vertical movement for text, 16px for sections and 12px plus scale 0.985→1 and a small inset clip reveal for media. No important content has a hidden CSS base state. Reveal completion clears inline styles after Motion's queued render. Interruption uses cancellation rather than committing a partial animation state.

Navigation begins with a 240ms opacity entrance. Hero greeting and four semantic headline lines lead at 80ms intervals; support text, CTAs and current-project link follow. Artwork begins with the second headline group at 160ms. The last group finishes at 1.16 seconds. Controls remain usable throughout. A fine-pointer geometric orbit settles once over 1.5 seconds; the shared provider finishes it on hidden-tab or preference interruption. It never loops.

Fine, hover-capable desktop pointers at 64rem and wider get foreground movement of at most 7px horizontally/4px vertically and background counter-movement of 5px/4px. Scroll adds at most 16px to the background. Motion values update transforms without per-frame React state or face distortion. Bounds are measured on entry and invalidated on scroll/resize. Offscreen, hidden-tab and preference changes reset the motion.

IntersectionObserver triggers section/media reveals once. Related content groups use a capped 80ms stagger across workspace, selected work, About, Engineering, Journey and Contact. `useScroll`/motion values drive document and project progress without per-frame React state. The shared project indicator uses a scoped `layoutId`. Native CSS smooth scrolling is preference-gated. Project hover independently lifts the outer media 3px and moves its screenshot 7px at scale 1.035; a separate reveal wrapper owns entrance transforms. Arrows move 2px. SportLynk's court scales 1.025; ball and seam move together in one SVG group. Notes use opacity/10px translation with discrete display/overlay transitions and `@starting-style`; unsupported features retain native open/close behavior. These are nonmodal notes, not newly introduced modal workflows.

Reduced motion removes pointer depth, spatial reveals, smooth scrolling, horizontal pinning and geometry movement. Explicit character selection remains immediate; sequence timers stop. `MotionConfig`, CSS queries and live listeners preserve actions and settle in-progress effects, including a real running 600ms entrance. Pointer layers reset offscreen/hidden; the finite CSS orbit shares interruption handling. Switching a visible horizontal section to stacked keeps the current scene in view. No unnecessary continuous animation or WebGL render loop runs.

## Technical decisions and verification

No new dependency was installed. React Bits TiltedCard was evaluated and rejected because glare, flip and gyroscope machinery did not fit this composition. Motion and native CSS cover the interactions. Genuine Three.js/R3F was evaluated and not selected; these are explicitly planar SVG/CSS scenes. No WebGL fallback is needed because the scene has no WebGL dependency.

Fresh production Chrome verification passes all nine required widths, doubled text at 768/1024/1280/1440px, native controls, keyboard, touch emulation, no-JS, reduced motion and project scroll/exit. All 24 existing test cases are preserved, adapted to the intentional horizontal layout and approved artwork; 18 new cases bring the total to 42 passing. See `PHASE2_DELIVERY.md` for current results and captures. Physical devices, physical trackpad, Safari, Firefox and screen-reader sessions remain untested.

Root `DESIGN.md` and `.impeccable/design.json` retain the Phase 1 extraction of the incumbent system. Their primitives, type, spacing and surface rules were compared with Phase 2; their historical component/motion descriptions do not describe the new interactions. This document and the CSS tokens are the current implementation reference.

## Phase 3 experience contract

### Composition and pacing

The homepage reads as an atelier visit: Graphite portrait opening → Linen workbench → Alabaster selected work → Graphite engineering workbook → Alabaster Build Trail → Linen engineering experiment → personal introduction → repository evidence → Espresso contact conclusion. Dark scenes own inverse text and Gold focus; paper popovers keep their light-surface focus role even inside a night scene. Copper is reserved for paths, action states, markers and material details rather than a background wash.

The `--type-masthead` token is `clamp(3.5rem, 7.8vw, 6.5rem)` for the authored hero composition. Existing display/body/mono roles remain. Product screenshots retain their actual colors inside project-specific editorial treatments; FitPilot, Sukoon and EduVerse do not become identical cards. SportLynk remains an original geometric concept scene, explicitly labeled as such.

`--color-bg-deep` aliases Graphite and `--color-ink-on-tint` aliases Espresso. No new hue is introduced. Workshop lamp off uses the Espresso inverse surface, not reduced opacity on a light scene. The real whole-pose artwork stays undistorted; no blink, walking rig or generated likeness is implied.

### Authored motion

| Experience | Narrative / interaction | Fallback and lifecycle |
| --- | --- | --- |
| Hero particle portrait | Actual approved portrait colors assemble into its silhouette; pointer proximity disperses pixels; keyboard replay restarts assembly | Actual image beneath the canvas; static mobile/touch/reduced-motion/forced-color/no-JS path; loops stop at rest, hidden or offscreen |
| Workshop | Whole-pose character responds to genuine object state; lamp changes material lighting; laptop, notebook and bug expose useful notes and links | Native checkbox and nonmodal popovers; Escape/focus restoration; clear touch labels; no-JS actions |
| Selected Work | Retained native-scroll four-scene horizontal journey with project-specific compositions and detail links | Stacked at mobile, enlarged text, inadequate space, touch or reduced motion; no wheel interception |
| Engineering workbook | One native disclosure at a time connects a development question, a three-step diagram and actual projects | All labels and evidence remain server-rendered; focused clipped reveal only when motion is permitted |
| Build Trail | Motion `useScroll` draws an SVG copper path and moves a geometric marker; measured chapter emphasis reverses with scroll | Unpinned stacked chapters and complete static path on narrow/reduced layouts; optional dates never invented |
| Concurrency Lab | Explicit event advancement, acting-request tracks and accepted/rejected reservation states expose a race and a simplified check/claim boundary | Local deterministic model; no continuous game loop, backend, touch interception or dependency on animation |
| Case-study diagrams/gallery | Native inspectable architecture layers and genuine screenshot enlargement; source links explain the model | Static server content and native nonmodal popovers; conceptual labels when evidence is unavailable |

Existing token durations, interruption cleanup, coordinated hero entrance, project lift/image zoom and focus/navigation behavior remain. Spatial effects never carry exclusive information. Native scrolling and live preference changes are preserved; GSAP, Lenis, paid motion source and 3D engines were not added.

### Content-resilient layout

All five routes use intrinsic grid minimums, reserved image dimensions and wrapping controls. A `55rem` container query stacks architecture stations based on actual text-relative available space; technology names may wrap at the narrowest doubled-text width. Trail artifacts wrap as links and cannot impose a wider minimum. The notebook cover caps its rem-based width to its native control. Hidden desktop tooltips leave the layout; touch/content-relative layouts keep labels visible. Final responsive and accessibility evidence belongs to the Phase 3 delivery, not an inferred guarantee from these rules.

At less than `20rem` content-relative space, laptop media becomes content-sized rather than forcing its ratio and architecture summary identity/icon move above the full-width title. Contact uses a single reading column before its circular action below `38rem` container space, preserving headline punctuation without shrinking supporting copy. Case chapters explicitly label concept-only studies; next-project titles carry the directional link without a redundant eyebrow.

### Typed content and truth

`lib/case-studies.ts` contains identity/status, optional role, audience, problem, goals, implementation, features, images, technology, architecture, decisions, challenges, outcomes, takeaways, links and next steps. Empty sections do not render. `lib/profile-content.ts` stores the profile, evidence-linked engineering areas and date-optional journey chapters. Source-based diagrams are simplified responsibility maps, not certified production architectures. SportLynk's map and the educational lab are expressly conceptual. No placeholder photograph, resume link, fabricated metrics or AI chat is displayed.

Root `DESIGN.md` and its sidecar remain the preserved historical extraction, not a claim that their Phase 1 component descriptions cover Phase 3. This is an expansion of Copper Atelier's approved identity, not an unsolicited tooling migration or brand replacement.
