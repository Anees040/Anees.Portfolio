# Copper Atelier — Phase 2 delivery

Date: 2026-11-15. **Remaining Phase 2 implementation is complete for the available artwork and ready for owner review.** Independent facial/typing animation remains an explicitly documented asset dependency. Phase 3 has not started. Nothing was deployed.

## Review the result

- Production preview: `http://localhost:3100` while the local preview process is running.
- [Review ZIP with source, report, screenshots and recording](../.qa/phase2-finish/copper-atelier-phase2-review.zip). Extract it and open `review.html`, or upload the bundle to the review chat.
- [Screenshot and video gallery](../.qa/phase2-finish/review.html).
- [Short screen recording](../.qa/phase2-finish/phase2-demo.webm).
- [Desktop hero](../.qa/phase2-finish/desktop-hero.png), [mobile page](../.qa/phase2-finish/mobile-full.png).
- [Workspace](../.qa/phase2-finish/workspace.png), [working pose](../.qa/phase2-finish/workspace-working.png).
- Project scenes: [SportLynk](../.qa/phase2-finish/journey-sportlynk.png), [FitPilot](../.qa/phase2-finish/journey-fitpilot.png), [Sukoon](../.qa/phase2-finish/journey-sukoon.png), [EduVerse](../.qa/phase2-finish/journey-eduverse.png).

Artifacts are local and Git-ignored. The WebM records actual production Chrome frames, encoded with browser MediaRecorder; it has no audio. It demonstrates hero depth, workspace notes/lamp/bug, horizontal scrolling, card feedback and exit to About.

Final capture: 323 frames, 2,094,286-byte WebM, nine viewport contact sheets and no application errors. Chrome playback decoded the 1280×900 recording successfully. Enlarged-text workspace captures hide fixed page chrome only during capture so it does not overlap a stitched element screenshot; separate header captures retain it.

## Completed work and audit resolutions

| Finding | Root cause | Resolution |
| --- | --- | --- |
| A01: notebook activates SportLynk at doubled text | Absolutely positioned controls did not reserve space for enlarged labels | Intrinsic grid and rem-based container reflow give each control its own box. Center clicks and collision checks pass at 768/1024/1280/1440px with 200% text. |
| A01: header overflow | Viewport-only navigation breakpoint ignored actual text size | Content-relative container query switches to the native menu; all destinations remain reachable. |
| A02: 600ms became 0.6ms | Production CSS changed `600ms` to `.6s`; the parser always divided by 1,000 | Explicit `s`/`ms` parsing. Unitless legacy values mean milliseconds. Production native timings verify 600ms and 160ms reduced. |
| A03: horizontal scrolling missing | Ordinary project grid had no scoped track | Four-scene measured sticky journey with native vertical progress, keyboard anchors and stacked fallbacks. |
| A04: absent character | No approved registered image | Owner approved the existing primary illustration and sheet. Hero portrait and workspace whole poses are now registered, optimized and tested. Independent facial frames remain pending. |
| A05: outer card lift blocked | Inline reveal transform overrode CSS hover transform | Separate reveal, outer-media and screenshot layers. Both 3px lift and 1.035 image zoom are asserted independently. |
| A06: orbit ignored interruption | CSS entrance sat outside visibility handling | Shared provider finishes the finite orbit; active Motion reveals cancel and clear after queued rendering. |
| A07: performance evidence incomplete | Earlier passing UI checks were not real-device profiling | Fresh production load observations and explicit hardware/browser limits are recorded below; no unsupported FPS claim. |
| A08: tests missed acceptance failures | Tests checked final visibility rather than timing, collisions and actual scrolling | Preserved all 24 cases; added 18 regression cases, for 42 passing browser tests. |
| A09: ball seam stayed behind | Ball and seam had separate transform ownership | One SVG group moves the complete ball. |

The new regressions also caught and corrected a conditional Motion-value subscription that prevented wheel-driven progress, a queued Motion render restoring an interrupted transform, and an image error arriving before hydration. Versioned image URLs prevent stale optimized cutouts after a source replacement.

## Motion implementation

Motion for React remains the primary library; no dependencies were added. CSS tokens remain the authority: shared cubic-bezier `(0.23, 1, 0.32, 1)`, 600ms entrance, 80ms stagger, 240ms interface, 150ms press, 100ms release and 160ms reduced opacity. Pointer springs use 130 stiffness, 24 damping and 0.8 mass.

Hero greeting, four headline lines, supporting text, CTAs and current-project link form one sequence; artwork starts alongside the headline at 160ms. The final group settles at 1.16 seconds. Navigation remains immediately usable. Section/group and image reveals cover workspace, selected work, About, Engineering, Journey and Contact. Media uses a small inset clip and transform reveal. No paragraph-by-paragraph ambient animation was added.

Pointer foreground travel stays within 7px horizontally/4px vertically; background counter-motion and scroll travel stay bounded. No face warping. Motion values drive pointer and progress without per-frame React state. Project selection updates React only when the active project changes. A scoped shared-layout underline shows project selection. Native nonmodal popovers retain CSS entry/exit and native Escape/focus behavior; no unnecessary modal workflow was introduced.

## Horizontal project journey

SportLynk → FitPilot → Sukoon → EduVerse. Every scene contains verified description, status, visual and working destination. Public projects retain real screenshots and verified technologies; SportLynk explicitly leaves technology details unclaimed.

Desktop enhancement requires a fine hover-capable pointer, at least 1024px viewport width, at least 60rem content width, at least 38rem available height, and enough measured room for the complete scene/navigation/exit note. It pins for at most three times 90% of available viewport height. The track's travel matches actual scene spacing. Native vertical scrolling enters and exits it; no wheel/touch interception, body lock or custom scroll engine exists.

Numbered project links, active underline, progress and Continue to About provide orientation. Links, Arrow keys, Home/End and focus on offscreen project actions reveal the correct scene. Direct hashes work. Touch, enlarged text, short viewports, RTL, reduced motion and no-JS use stacked content. A live preference change keeps the current project visible while removing the pinning.

## Workspace and character

Lamp on/off, laptop note, engineering notebook, bug note and project navigation are preserved. Lighting changes visibly between Linen/light and Alabaster/unlit states, with a 240ms transition. Labels remain visible on touch; focus rings and native controls remain available without JavaScript. The character has reserved grid space independent of object hit areas.

The approved primary PNG had a baked checkerboard. The derivative removes its neutral background; the source file remains untouched. The working pose is isolated from the sheet using existing alpha, without generating new subject pixels. Hero uses the static portrait. Workspace Rest / At work and note events switch between real whole-pose illustrations. This is not animated typing or a rigged face.

`CharacterScene`, `CharacterPortrait`, `CharacterAnimation` and `CharacterFallback` support independent scene registrations, optional mobile `<picture>` sources, explicit state input, bounded real-frame sequences, missing-state fallback, failed-image fallback and reduced-motion/visibility interruption. Registered image dimensions and alpha are verified; no stock character or private reference photograph was inserted.

**Still required for independent motion:** aligned transparent WebP/PNG frames for blink, head movement, greeting, alternate expression and typing. Hero exports use the current 800×1200 canvas; workspace uses 480×480. Optional mobile exports use a consistently aligned 600×800 canvas. Exact filenames and integration examples: [character asset guide](../public/images/character/README.md). The sheet's different camera/pose crops are not falsely treated as aligned facial frames.

## 3D decision

Genuine Three.js/R3F was evaluated and remains unnecessary for this planar composition. Existing geometry, supplied raster illustrations and Motion deliver the interaction without a WebGL renderer or rig. No suitable 3D character asset was supplied. No Three.js, R3F, GSAP, Lenis, particles or paid Motion package was added. Earlier React Bits evaluation remains documented; its glare/flip machinery was not imported. A future rigged 3D character is outside the delivered asset set, not an undisclosed implementation.

## Verification

Production browser: local Google Chrome 157.0.8103.51 via Playwright, port 3100.

| Check | Result |
| --- | --- |
| `npm run lint` | Pass, no diagnostics |
| `npm run typecheck` | Pass |
| `npm run build` | Pass; Next.js 16.4.6, statically prerendered `/` |
| `npm run test:e2e` | 42 passed; 24 preserved cases plus 18 new cases |
| Normal text | 320, 375, 390, 414, 768, 1024, 1280, 1440, 1920px pass overflow/content checks |
| Doubled text | 768, 1024, 1280, 1440px pass header, object collision, center-click and content checks; existing 320/390px tests retained |
| Desktop project sequence | Progress and natural exit pass at 1280, 1440, 1920px; smaller/shorter layouts intentionally stack |
| Keyboard | Skip link, disclosure, project anchors, arrows/Home/End, focus reveal, Enter/Space/Escape and note focus return pass |
| Touch emulation | Workspace at 320/390/768px and stacked project navigation at 390px pass |
| No JavaScript | Content, native menu, laptop note, lamp, project link and approved portrait remain available |
| Reduced motion | Initial/live preference, real running entrance interruption, stacked project fallback and immediate pose selection pass |
| Accessibility scans | Axe WCAG 2/2.1/2.2 A/AA scans pass desktop/mobile, open menu, open note and enhanced horizontal scene |
| Image fallback | Blocked hero image request renders the architectural study, including pre-hydration failure |
| Console/runtime | No application errors in normal interaction/capture checks |

Native browser timing records: [normal](../.qa/phase2-finish/production-timing-normal.json), [reduced](../.qa/phase2-finish/production-timing-reduced.json). [Playwright report](../playwright-report/index.html). Screenshots/contact sheets were inspected; results are not based solely on assertions.

## Performance and limits

The page remains statically rendered with small client boundaries, optimized images/fonts, finite motion and no WebGL runtime. The delivered hero derivative is approximately 102KB before responsive image optimization; workspace assets are smaller and loaded lazily. No large sprite set or continuous timer loop is registered.

Fresh local loading values are in [performance.json](../.impeccable/review/phase-2/performance.json): **CLS 0, LCP 260ms, transferred JavaScript 202,200 bytes**, optimized hero image 37,668 bytes and initially loaded workspace image 6,500 bytes. The script transfer is 3,284 bytes above the original audit observation. These are localhost observations, not field Core Web Vitals, a controlled benchmark, a Lighthouse score or a physical-mobile FPS guarantee. The earlier audit's throttled sweep remains diagnostic historical evidence; no broad animation-library rewrite was justified by it.

Physical phones/tablets, physical trackpad inertia, Safari, Firefox and screen-reader sessions were not performed. Mouse wheel and small wheel deltas were synthesized in Chrome; touch tests are emulation. 200% root text is not an OS text-size or browser-zoom certification. Future aligned sequences and alternate mobile crops require visual verification when supplied. Fine hair edges can improve with a true transparent source export.

## Changed and new files

Application files completed across the stopped session and this continuation:

```text
app/portfolio.css
components/portfolio/about.tsx
components/portfolio/character-animation.tsx
components/portfolio/character-fallback.tsx
components/portfolio/character-portrait.tsx
components/portfolio/contact.tsx
components/portfolio/hero.tsx
components/portfolio/motion.tsx
components/portfolio/project-journey.tsx                 (new)
components/portfolio/scroll-experience.tsx
components/portfolio/selected-work.tsx
components/portfolio/site-header.tsx
components/portfolio/workspace-interaction.tsx           (new)
components/portfolio/workspace-scene.tsx
lib/character-assets.ts
lib/motion-system.ts
next.config.ts                                          (character image revision allowlist)
public/images/character/desktop/anees-idle.webp           (new)
public/images/character/desktop/anees-workspace-idle.webp  (new)
public/images/character/desktop/anees-workspace-working.webp (new)
tests/phase2-completion.spec.ts                          (new)
tests/phase2.spec.ts
tests/portfolio.spec.ts
```

Documentation: `AGENTS.md`, `PRODUCT.md`, `README.md`, `docs/DESIGN_SYSTEM.md`, `docs/BUILD_LOG.md`, `docs/PROJECT_STATUS.md`, `docs/CONTENT_SOURCES.md`, `docs/PHASE2_COMPLETION_AUDIT.md`, this new `docs/PHASE2_DELIVERY.md`, and `public/images/character/README.md`.

Local review scripts/artifacts live under `.qa/phase2-finish/`; browser-suite captures are under `.impeccable/review/phase-2/`. The recoverable incoming tree is saved at `docs/workspace-snapshot/phase-2-resume-20261114-104705/`, including its base commit and working-tree status. Existing unrelated starter files, configuration, skill files and owner artwork originals were preserved. No commit, reset, deployment or publication was performed.

Phase 3 case studies, the full timeline, GitHub dashboard, Ask Anees backend and deployment remain untouched. The implementation is handed back for owner review.
