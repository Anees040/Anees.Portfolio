# Copper Atelier design system

The portfolio remains warm, editorial, and precise. `app/tokens.css` is the implementation authority. Components consume role tokens rather than raw brand literals. Phase 2 extends the existing identity through composition and interaction; the eight primitives and three typefaces are unchanged.

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

The desktop workspace is a front elevation: lamp, laptop, notebook, project plaque and a small bug. At narrower widths its objects reflow into an intrinsic grid with persistent labels and large tap targets. The stage has an explicit full width to avoid aspect-ratio/minimum-height overflow. Object heights grow with text. The 768px composition retains the desk with clear labels.

Navigation becomes a native disclosure below 1024px. Sticky-header clearance protects anchor destinations. Selected work retains one large SportLynk feature and three public-project previews; mobile is a single-column sequence. About, Engineering and Journey remain introductory. Contact closes on Espresso.

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
| `CharacterAnimation` | Explicit selection of registered illustration frames only |
| `WorkspaceScene` | Server-rendered workspace objects, native lamp checkbox and project link |
| `WorkspacePopover` | Reusable native nonmodal note with close button and useful destination |
| `ScrollExperience` / `ScrollProgress` | Once-per-section reveals, anchor focus and document progress |
| `SelectedWork` | Real screenshots, factual content, project hover/focus response |
| `TextLink` | Shared underlined anchor and arrow with at least a 44px target |
| `About` / `Contact` | Existing personal introduction, interests and direct contact |

`AtelierStudy` is preserved but no longer used by the hero.

Workspace laptop, notebook and bug open real HTML popovers. Only one auto popover stays open; Escape/outside interaction closes it. The close button receives focus and closing returns focus to the invoker. These are nonmodal notes, not focus-trapping dialogs. Lamp state is conveyed by the checkbox, illumination and explicit on/off text. The project plaque navigates to SportLynk. Mobile labels expose the interaction without hover.

Character configuration lives in `lib/character-assets.ts`. The owner deferred generation; `characterAssets` is null. The fallback is intentional. Idle, blink, head, greeting, working and expression are asset slots, not a synthetic rig. Register only real aligned frames; missing states resolve to idle. A different mobile crop or a layered/rigged asset requires an adapter and visual testing when delivered.

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

Motion reads the CSS tokens through `lib/motion-system.ts`. Shared reveal frames use 14px vertical movement for text, 16px for sections and 12px plus scale 0.985 to 1 for media. No important content has a hidden CSS base state.

Navigation begins with a small opacity change. Hero greeting and headline lines lead, followed by copy/actions/current project and artwork. The final artwork starts at 560ms and settles at about 1.16s; controls remain usable throughout. A desktop SVG orbital detail settles once over 1.5s with 10px translation and 12-degree rotation. It does not loop.

Fine, hover-capable desktop pointers at 64rem and wider get foreground movement of at most 7px horizontally/4px vertically and background counter-movement of 5px/4px. Scroll adds at most 16px to the background. Motion values update transforms without per-frame React state or face distortion. Bounds are measured on entry and invalidated on scroll/resize. Offscreen, hidden-tab and preference changes reset the motion.

IntersectionObserver triggers section/media reveals once. Document progress uses Motion `useScroll` and scaleX. Native CSS smooth scrolling is preference-gated. Project hover lifts media 3px, moves screenshots 7px with scale 1.035, and offsets arrows 2px. SportLynk's labeled court receives scale 1.025 and a 6px/-4px ball movement. Notes use opacity/10px translation with discrete display/overlay transitions and `@starting-style`. Unsupported transition features degrade to native open/close behavior.

Reduced motion removes pointer depth, large spatial reveals, smooth scrolling and geometry movement; opacity or immediate state changes preserve every action. `MotionConfig`, CSS media queries and direct live preference listeners work together. Interrupted imperative animations stop and clear inline transforms/opacity; hiding the tab also settles them. No unnecessary continuous animation or WebGL render loop runs.

## Technical decisions and verification

No new dependency was installed. React Bits TiltedCard was evaluated and rejected because glare, flip and gyroscope machinery did not fit this composition. Motion and native CSS cover the interactions. Genuine Three.js/R3F was evaluated and not selected; these are explicitly planar SVG/CSS scenes. No WebGL fallback is needed because the scene has no WebGL dependency.

Chrome production verification passed at 320, 375, 390, 414, 768, 1024, 1280, 1440 and 1920px, including open states, keyboard, touch emulation, no-JS, doubled text and initial/live reduced motion. See `PHASE2_REVIEW.md` for evidence and limits. Physical devices, Safari, Firefox and screen-reader sessions were not tested.

Root `DESIGN.md` and `.impeccable/design.json` retain the Phase 1 extraction of the incumbent system. Their primitives, type, spacing and surface rules were compared with Phase 2; their historical component/motion descriptions do not describe the new interactions. This document and the CSS tokens are the current implementation reference.
