# 3R-0 visual review and research status

18 November 2026. **Blueprint complete for owner review; implementation not authorized.** This is the 3R-0 research/build record, not a replacement for historical Phase 3 delivery status. All production files and the existing design system remain unchanged.

## Executed evidence

| Check | Actual result / evidence |
| --- | --- |
| Current local site | Existing production build served on 127.0.0.1:3100; fresh actual-source audit and rendered captures |
| Nine physical CSS viewport widths | 320, 375, 390, 414, 768, 1024, 1280, 1440, 1920; height 900; DPR 1; baseline and board document widths equal viewports |
| Baseline capture manifest | `.qa/phase3r/evidence/current/capture-results.json`; **29 recorded screenshots**, zero collected homepage pageerrors; four case-study routes captured at 1440×900 |
| Additional height gates | At 1024×600 and 1280×720: Work stacked, Thread static. At 1440×900: Work horizontal, Thread active. At 390×900: stacked/static. These are measured modes, not breakpoint assumptions |
| Baseline fallback captures | No-JS, initial reduced-motion preference and doubled root text at 390×900 and 1440×900; zero measured horizontal overflow. These are not fresh whole-suite, browser-zoom, live-preference or screen-reader certifications |
| Portrait interaction | Fresh pointer/replay screenshots show real displaced image pixels and reassembly; worker dataset snapshots retained. Worker metrics are cumulative/published state, not a live per-frame display-FPS measure |
| Board captures | **73 screenshots**: nine full boards, 40 composition crops at 320/390/1440/1920 and 24 start/middle scene crops at 390/1440. No collected board pageerrors; all board images load; one h1 |
| Board no-JS | 390×900 reading/layout check, zero horizontal overflow and images loaded; default complete storyboard still remains. Enhanced beat switching is a review convenience |
| Supplemental manifest | `.qa/phase3r/evidence/blueprint/review-results.json`: 91 screenshot entries = 73 board + 18 current-site supplement; measured image dimensions, Chrome 157.0.8103.79 and final HTML/CSS/JS/font hashes |
| Boundary | SHA-256 comparison of **120 protected source/config/asset/test/existing-doc files: zero changed**; Git status shows only new docs/phase3r; .qa is already ignored |
| Reference integrity | 99 cached reference source files verified against fixed-revision manifest; four repositories + supplied article HTML studied. GSAP standard-licence response was a verification interstitial, not licence text |
| Fresh production validation | **Not rerun:** lint/typecheck/build/full e2e. This is a nonproduction research/board assignment using the existing build. Historical 102-test result remains labelled historical. `git diff --check` executes successfully; it does not validate untracked documentation or browser craft |

The manifests, not the number of all PNGs in an evidence directory, identify this run. Earlier captures are preserved, not deleted or passed off as fresh. Composition screenshots crop actual scene bounds: e.g. a 1920px viewport may contain a 1440px-wide board scene. Both actual viewport and crop dimensions are recorded separately.

## Images actually inspected

- Current Digital Atelier and active Thread desktop screenshots: confirmed the useful controls/source artifacts and repeated paper-stage presentation; no claim that the existing scroll mapping is fake.
- Current 1440px hero static/pointer screenshots: face/silhouette visible; interaction displaces genuine colored pixels. Main deficiency is lack of an initial dispersed formation and an authored supporting environment, not an absent engine.
- Asset contact sheet and opaque primary original: confirmed baked checker pixels, approved identity/poses, genuine application screens and absent aligned motion atlas.
- Final board desktop/mobile seven-scene contact sheets: `.qa/phase3r/evidence/blueprint/review-sheet-1440.png` and `review-sheet-390.png`.
- Nine-width first-view contact sheets for baseline and board: `.qa/phase3r/evidence/current/nine-width-review.png` and `.qa/phase3r/evidence/blueprint/nine-width-review.png`. These are broad layout comparisons, not proof every paragraph is legible at thumbnail size.
- Detailed hero start/middle/end, studio mobile and contact at 320px: sampled cloud positions clearly differ, studio does not fabricate facial motion, and smallest-width email/heading remain contained. Detailed seven-scene crops and all four project crops remain available for owner inspection.

## Review dispositions

| Scene | Blueprint judgment | Open implementation/owner gate |
| --- | --- | --- |
| Copper Cosmos | Full dark composition and real sampled-pixel formation stills communicate a distinct formation beat; background points are subordinate | Owner approves formation feel; clean same-art matte; actual simulation timings/quality to be measured later |
| Personal Studio | Approved working pose + moving-type idea is more personal than static monogram; light field accommodates current alpha | Cleaner export; optional aligned parts; useful native notes and mobile order must survive implementation |
| Selected Work | Large actual screen triptychs, four backgrounds and clear purpose/status are an inspectable hierarchy | The board is stacked stills, not a verified cinematic pin. Owner-specific contribution evidence and full mobile screenshot reading/popovers remain gates |
| Engineering | Explicit source boundaries, static nodes and progressive-highlight states avoid a made-up backend | Implement bounded step animation; preserve real workbook/Lab interactions and source caveats |
| Thread | Original loom/filament/foreground guide vocabulary, six named thematic stations and different representative chapter text | Static full landscape only previews the choreography; finite pin/read holds/reverse/focus/release require runtime verification |
| Always Building | Original build-task progression is understandable; missing-frame rail honestly exposes the blocker | **Not playable.** Approve/create aligned game art before 3R-5; no fake sprite substitute |
| Contact | Existing MA path, stable readable headline/email/GitHub close the journey without a loop | Implement one-time seam/signature choreography and preserve native copy/email behavior |

One review correction made the sampled end still a filled portrait rather than leaving the sparse assembly-dot treatment as the resting identity. Another uses the exact existing MA path for the finale instead of a merely similar geometric mark. Final board hashes were checked after recapture. The director notes deliberately remain outside compositions: this is a review board, not a screenshot of a claimed finished site.

## Limits and decision

No fresh physical phone/tablet, Safari/Firefox, touch-gameplay, real screen-reader, Lighthouse/field-performance, live reduced-motion interruption or production suite run is claimed. No new sprite, portrait, private screenshot, service, paid API call, package, worktree, commit, deployment or global stylesheet change occurs. The board has no animation physics/game implementation and therefore cannot prove frame pacing, collision correctness or ScrollTrigger cleanup.

**Disposition: ready for owner direction review, not approved for production.** Review hero formation and art scale, studio export, Work hierarchy, thematic loom chapter order, game concept/asset commission, and the conditional GSAP licence/dependency gate. Do not start 3R-1 until separately authorized.
