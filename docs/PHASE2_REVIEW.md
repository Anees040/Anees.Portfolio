# Phase 2 implementation and verification

Date: 2026-11-13. Portfolio: Muhammad Anees, Copper Atelier.

Phase 2 interaction work is implemented and production-tested. Character generation was explicitly deferred by the owner, who will supply artwork. The delivered character architecture uses an intentional nonfigurative fallback. Phase 3 has not started and nothing has been deployed.

## 1. What changed

The existing editorial page and factual content remain. The hero now reveals its greeting, headline lines, description, actions, current-project indicator and artwork in a coordinated sequence. Its dark architectural composition contains the MA fallback, separate responsive depth layers, a project slip and an entry into the workspace.

The original workbench adds useful exploration: laptop/current-project note, notebook/engineering thought, lamp/lighting state, hidden bug/feedback and project plaque/SportLynk destination. Native controls provide keyboard and touch equivalents. Section reveals, active navigation, a scroll-progress line and project-card feedback make the rest of the page consistent with the hero.

Tonal refinement uses the existing Graphite, Espresso and Linen roles to anchor the scene, with Copper and Gold used sparingly. The eight approved primitives and typography are unchanged.

## 2. New components and integration files

| New component | File | Purpose |
| --- | --- | --- |
| CharacterScene | `components/portfolio/character-scene.tsx` | Hero composition, project slip and workspace entry |
| CharacterFallback | `components/portfolio/character-fallback.tsx` | Original nonfigurative MA arch |
| CharacterPortrait | `components/portfolio/character-portrait.tsx` | Responsive next/image slot |
| CharacterAnimation | `components/portfolio/character-animation.tsx` | Explicit registered-pose selection |
| PointerScene | `components/portfolio/pointer-scene.tsx` | Bounded planar depth using Motion values |
| WorkspaceScene | `components/portfolio/workspace-scene.tsx` | Native interactive workspace |
| WorkspacePopover | `components/portfolio/workspace-popover.tsx` | Reusable nonmodal note |
| ScrollExperience | `components/portfolio/scroll-experience.tsx` | Section reveals and anchor focus |
| ScrollProgress | `components/portfolio/scroll-experience.tsx` | Document progress line |

New integration files: `lib/motion-system.ts`, `lib/character-assets.ts`, `public/images/character/README.md` and `tests/phase2.spec.ts`. Character desktop/mobile directories are prepared; no portrait raster is shipped.

Existing `HeroEntrance`, `MotionProvider`, `MediaReveal`, Hero, SiteHeader, SelectedWork, About and Contact were extended, alongside the page, tokens, stylesheet and factual content module. The earlier `AtelierStudy` remains preserved but unused. Phase 1 screenshots remain intact; tests now capture Phase 2 into its own directory.

## 3. Libraries

**No new runtime or development library was installed for Phase 2.** The project already had Next.js 16.4.6, React 19.3, Motion 14.12, Tailwind 4.3.3, TypeScript, Lucide, Playwright and axe.

React Bits `TiltedCard-TS-CSS` source was evaluated through the connected registry. Its glare, flip and gyroscope features added complexity without improving this restrained scene; no registry code was installed. No GSAP, R3F, Three.js, paid Motion feature or particle library was added.

## 4. Actual animation techniques

- Motion `useAnimate` uses shared CSS timing/easing for semantic hero groups and intersection-triggered text/media/section reveals.
- Hero movement is 14px; section movement is 16px; media uses 12px and scale 0.985 to 1. Normal duration is 600ms, with 80ms hero stagger. Final hero artwork settles at about 1.16 seconds. Content and links are available from the server render.
- Navigation has a 240ms opacity entrance. A desktop SVG orbital detail settles once over 1.5 seconds; there are no ambient loops.
- Pointer motion uses Motion values and springs (130 stiffness, 24 damping, 0.8 mass). Foreground travel is bounded at 7px/4px, with background counter-movement and up to 16px scroll travel. No face warping or per-frame React state.
- `IntersectionObserver` triggers once-per-section reveals. `useScroll` drives a scaleX progress line. Native smooth anchor scrolling respects motion preference.
- Eligible-pointer card feedback includes 3px media lift, 7px screenshot translation, 1.035 zoom, border/background changes and a 2px arrow offset. SportLynk receives a subtle court scale and ball shift.
- Native popovers use opacity, 10px movement, `@starting-style` and discrete display/overlay transitions. Lamp feedback changes opacity and switch position; bug feedback uses a small translation/rotation.
- Reduced motion removes spatial effects. Live preference and visibility listeners stop imperative animations and clear their inline styles. Pointer layers reset when offscreen, hidden, resized or preference-disabled.
- Character pose changes will swap actual supplied aligned frames on explicit input. No fabricated blink, head turn, interpolation or rig is claimed.

## 5. 3D evaluation

Genuine 3D was evaluated and **not implemented**. Front-elevation SVG/CSS geometry supports the desired interactions without a WebGL renderer, lighting pipeline or expensive asset load. The supplied photograph is not a rig; no appropriate 3D character asset exists.

The result is explicitly a planar illustrated scene with small depth cues. It has no WebGL dependency and remains visible with JavaScript disabled. A WebGL context-loss/fallback test is therefore not applicable; the no-JS check confirms native workspace actions, the character fallback and zero canvas elements.

## 6. Interaction verification

| Interaction | Result and evidence |
| --- | --- |
| Laptop | Enter opens current SportLynk note; close receives focus; Escape closes and restores invoker focus |
| Notebook | Opens engineering thought; anchor closes note and focuses Engineering |
| Lamp | Space and touch toggle checked state, visible on/off label and scene illumination |
| Bug | Opens programming-themed feedback; close/Escape and touch work |
| Project plaque | Navigates to and focuses SportLynk |
| Desktop hero | Mouse changes foreground transform; reduced motion immediately resets it |
| Navigation | Active location, anchor clearance/focus, native mobile disclosure and Escape behavior pass |
| Progress | Transform changes with document scroll |
| Project cards | Screenshot transform changes on hover; keyboard focus is visible |
| No JavaScript | Content, native menu, laptop note, lamp, project destination and fallback remain usable |
| Runtime | No page errors or console warnings/errors captured in the interaction check |

Native popovers are nonmodal. They close through the close button, Escape or outside interaction, and do not trap focus. No AI conversation or mini-game was simulated.

## 7. Artwork still needed

The owner will supply an approved original character illustration. A transparent idle export around 1000–1200px high, preferably under 200KB, is a useful starting point. Register its path, dimensions and accurate alt text in `lib/character-assets.ts`.

Optional blink, head, greeting, working and expression frames must share crop, alignment, proportions and lighting. Only real registered states get controls; unavailable states resolve to idle. A different mobile crop or layered/rigged artwork needs its own adapter and verification after delivery.

The reference photograph is not published. No identity illustration or fake facial animation was generated. The future frame renderer is prepared in code but cannot be visually certified without the owner's assets.

## 8. Responsive and accessibility results

Production Chrome checks passed at **320, 375, 390, 414, 768, 1024, 1280, 1440 and 1920px**, with no horizontal document overflow. All full-page captures were visually inspected. Desktop retains the complete composition; tablet keeps clear object labels; mobile reflows the scene with visible controls.

Touch was emulated at 320, 390 and 768px. Open notes fit within the viewport and their actions work. Doubled text, including an open note, remains readable without content overflow. RTL received a smoke check.

Axe WCAG 2/2.1/2.2 A/AA scans passed at desktop/mobile, with the mobile menu open and with a workspace note open. Keyboard tests cover skip navigation, native disclosure, Enter/Space/Escape, focus restoration and anchor destinations.

These are Chrome automation and screenshot results. Physical mobile/tablet devices, Safari, Firefox and a screen-reader session were not tested. Native popover compatibility should be checked in those browsers during release hardening.

## 9. Reduced motion

Initial reduced motion and changing the preference during active animation pass. Pointer layers return to their resting position; spatial reveals and smooth scrolling stop; notes, lamp, menu and project destinations remain usable. Doubled-text behavior was also checked with reduced motion enabled.

A test exposed an intermittent interruption problem with relying only on a React reduced-motion dependency. Direct live media-query listeners now stop the active imperative controls and clear inline styles immediately. The final consolidated run passes the preference-change regression check.

## 10. Performance and corrections

Latest local production observation from [performance.json](../.impeccable/review/phase-2/performance.json):

| Measure | Observation |
| --- | --- |
| CLS | 0 |
| LCP | 236ms |
| Transferred script bytes | 198,916 |
| Phase 1 historical script bytes | 164,213 |
| Difference | +34,703 bytes, about 34.7KB |

Measurements are unthrottled localhost observations, not Lighthouse scores, field Core Web Vitals or a like-for-like performance benchmark. The extra script load supports scroll and pointer behavior; no heavy scene library or image sequence was introduced. No production-loading regression was observed locally, but slow-network/low-end-device profiling remains unperformed.

Content remains server-rendered around focused client boundaries. Pointer motion is event-driven; continuous render loops were avoided. Geometric art adds no raster download. Supplied project screenshots still use optimized images.

Issues corrected during verification: tablet stage overflow caused by aspect ratio/minimum height; notebook contrast on mobile; desk legs crossing tablet labels; enlarged-text object sizing; live reduced-motion interruption. A screenshot-only sticky-header overlap and an overly broad decorative-overflow assertion were corrected in test capture/measurement code.

## 11. Quality checks and review

| Check | Final result |
| --- | --- |
| `npm run lint` | Pass, no errors or warnings |
| `npm run typecheck` | Pass |
| `npm run build` | Pass; production route statically prerendered |
| `npm run test:e2e` | **24 passed in 1.1 minutes** |
| Screenshot inspection | All 26 captures inspected, covering nine widths and hero/workspace/project/open-note/enlarged-text states |
| Independent Impeccable finish review | **ship**, no material fixes requested |

The independent reviewer returned all five contract sections and disposition **ship** after reviewing source and 26 valid captures. No material fixes were requested. Its full findings and limits are in [PHASE2_DESIGN_REVIEW.md](PHASE2_DESIGN_REVIEW.md). Runtime results were supplied to the reviewer, not independently observed by it.

The production build and browser suite ran after the live preference fix. Explicit lint and typecheck were rerun afterward and pass. Subsequent edits to this report and project documentation do not alter the application.

Root `DESIGN.md` and `.impeccable/design.json` were compared against the incumbent color/type/layout system and preserved as Phase 1 extraction records. Their old motion/component narrative is historical. Current Phase 2 behavior is documented in `DESIGN_SYSTEM.md`, with the CSS tokens as authority. No new visual-world exercise or unrelated design-record rewrite was performed.

## 12. Phase 3 boundary

Phase 3 requires explicit approval. Remaining project work includes deeper source/contribution verification, real SportLynk evidence supplied by the owner, detailed project narratives and case-study routes. No employment, metrics, launch, screenshots or technical claims should be inferred.

Full career/education content, the GitHub contribution dashboard and the genuine Ask Anees retrieval/API system remain later work. No deployment was performed.

## Screenshots

- [Finished desktop hero](../.impeccable/review/phase-2/desktop-hero.png)
- [Mobile hero](../.impeccable/review/phase-2/mobile-hero.png)
- [Desktop workspace](../.impeccable/review/phase-2/workspace-desktop.png)
- [Mobile workspace](../.impeccable/review/phase-2/workspace-390.png)
- [Tablet workspace](../.impeccable/review/phase-2/workspace-768.png)
- [Laptop note](../.impeccable/review/phase-2/workspace-laptop.png)
- [Lamp off](../.impeccable/review/phase-2/workspace-lamp-off.png)
- [Bug feedback](../.impeccable/review/phase-2/workspace-bug.png)
- [Project hover](../.impeccable/review/phase-2/project-hover.png)
- [Project keyboard focus](../.impeccable/review/phase-2/project-focus.png)
- [Full desktop page](../.impeccable/review/phase-2/desktop.png)
- [Full mobile page](../.impeccable/review/phase-2/mobile.png)
