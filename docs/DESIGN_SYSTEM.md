# Copper Atelier design system

The portfolio remains warm, editorial, and precise. `app/tokens.css` is the implementation authority. Components consume role tokens rather than raw brand literals. Phase 2 extends the existing identity through composition and interaction; the eight primitives and three typefaces are unchanged.

**Current implementation, 2026-11-15:** The Phase 2 completion defects are fixed, the bounded horizontal project journey and approved character artwork are integrated, and 42 production browser tests pass. The [delivery report](PHASE2_DELIVERY.md) records current evidence and limits. The original [completion audit](PHASE2_COMPLETION_AUDIT.md) remains historical evidence with a resolution addendum.

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
