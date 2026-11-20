# Phase 3R-0 — reference research and current-state audit

## Current visual correction — 20 November 2026

The local workspace at `a105cbc` includes uncommitted Hero/About media changes absent from that remote commit. Inspection identified an Alabaster rectangular matte/8px outline in Hero and two separate About figures in `about.tsx`, with duplicated identity/captions. The owner confirms `photo.png` is the only original photograph; its measured size is 1268×1240. Preserved Elliott homepage/atomizer/starfield source and the performance article were reviewed for cloud formation, sampled colours, layered composition, slow depth and finite comet/lifecycle behavior. No source, artwork, blue ring, copy, metrics or service is transplanted. The standalone live comet-article request failed in the sandbox and again after network access (closed connection); the preserved starfield's comet implementation supplies the available technical reference.

This correction uses the original photograph inside a matched ellipse, a broader curved 26% source-colour field, a bounded warm ambient canvas, coordinated native Hero depth and one editorial About story. The supplied desk PNG has no independent anatomical/object layers; it stays static. Current assertion results and limits are recorded in `../PHASE3_DELIVERY.md`; no new screenshot/recording/visual approval is claimed. Historical current-state descriptions below predate the installed GSAP foundation and this correction.

18 November 2026. Research/blueprint only. No production source, dependency, token, navigation or deployed site is changed. Start at [DESIGN_STORYBOARD.md](DESIGN_STORYBOARD.md), then review the local board in `.qa/phase3r/blueprint/index.html`. Phase 3R-1 requires a separate owner authorization.

## Evidence and method

The current local source is revision `9e89e6c11a8ddf5d5db4176c5712c4a0037bb4c0`. Read PRODUCT, the current design-system contract, project status, content sources, installed Next.js 16.4.6 guides for Server/Client Components, fonts and images, production components, styles, content, tests and prior visual evidence. The existing production build was served at `http://127.0.0.1:3100`; fresh Chrome captures, rather than old ZIPs, establish the incumbent appearance.

Reference source was acquired at fixed revisions. The local manifest records URLs, byte counts, SHA-256 hashes, acquisition time and failed requests; 99 source files were hash-verified again during this assignment. Binaries belonging to Elliott were not incorporated into the board or portfolio. Actual code and sprite JSON were studied, not just READMEs. HTML snapshots of all five supplied articles and the live homepage are present. The broken line in the supplied game article URL was normalized to `full-stack-engineer/`.

| Reference | Fixed revision | Local source root |
| --- | --- | --- |
| image-atomizer-js | `91e4d78c11eac397ab72457378bf3006d9084d60` | `.qa/phase3r/references/image-atomizer-js/` |
| elliottprogrammer.com | `5497ef04a6470c796fd006b3f01b631fad261c41` | `.qa/phase3r/references/elliottprogrammer.com/` |
| level-up-game | `5228bd87fed4205115368354d90ef615a2e78d8a` | `.qa/phase3r/references/level-up-game/` |
| ask-elliott-ai | `df9a683e9481e1b0358117d24be172796ae4619b` | `.qa/phase3r/references/ask-elliott-ai/` |

Remote repositories: `https://github.com/elliottprogrammer/image-atomizer-js`, `https://github.com/elliottprogrammer/elliottprogrammer.com`, `https://github.com/elliottprogrammer/level-up-game`, `https://github.com/elliottprogrammer/ask-elliott-ai`. These are study sources, not permission to redistribute them.

## A. Standalone Image Atomizer: what the code actually does

Read `README.md` and `image-atomizer.js`, especially constructor/event setup, `Particle.move`, `swapList`, `nextFrame`, `drawParticles`, `getPixelFromImageData`, `init` and `resize`.

1. A hidden source canvas draws the image at its intrinsic size. `getImageData` supplies RGBA pixels. Sampling advances by **particleGap + 1**, not particleGap + particleSize, and excludes only alpha zero pixels.
2. Each retained pixel has a centered canvas target and its sampled RGBA value, unless monochrome is requested. Sampling order is shuffled. Active/recycled particle linked lists reuse objects.
3. New particle positions are randomized across the canvas with initial velocities. Assigning their gravity targets causes the initial cloud to assemble into the image. Surplus particles get a short TTL and recycle. This is materially different from simply fading a complete portrait into view.
4. Mouse coordinates are translated from viewport into canvas coordinates. Inverse-square distance applies repulsion capped by mouseForce. It is not a modern configurable bounded-radius brush.
5. Attraction uses distance, angle and trigonometric components; velocity damping and target attraction reassemble the image. Very small force snaps position near the target. `restless` adds random jitter near rest; false avoids it, but the original rendering loop still continues.
6. Touch start/move tracks the first contact; end releases it. It is a reference for coordinate translation, not a complete pointer-capture, multi-touch or native-scroll accessibility contract.
7. `particleGap` changes sampling density; `particleSize` changes stamped square dimensions; `mouseForce` scales inverse-square repulsion; `restless` adds jitter. They are not interchangeable controls.
8. Container dimensions initialize canvas dimensions. The source image itself is not automatically an intelligently responsive portrait crop. Every 25 frames the loop checks dimensions and calls resize/reinitialization. The source has suspicious swapped width/height variable assignments here; do not transplant that contract.
9. Each draw allocates a fresh full-canvas ImageData, loops particles and square stamps, writes four channels, then calls `putImageData`. `nextFrame` combines a 15ms timeout with requestAnimationFrame. There is no React lifecycle, live reduced-motion policy or portfolio-grade disposal contract.
10. Improve allocations, hot-loop math, memory locality and scheduling before multiplying particle counts. Sampling must be based on actual rendered size, not source megapixels.

The header says `@license MIT`; the revision tree contains only README and JS, **not the full MIT grant/copyright text**. The article describes MIT. No code is copied here; clarify the grant before incorporating a literal copy.

## B. Complete Elliott portfolio: a different, later implementation

### Hero and performance

`main.js:199` onward chooses responsive portrait source variants, configures the atomizer and coordinates starfield bounds; `main.js:229` configures gap 0, size 2, timeScale 0.5, restless false, **enableOffscreenWorker false**, and performance logging false. Canvas click calls init. A ScrollTrigger pauses atomizer and starfield after the hero leaves and resumes on return. Therefore worker support in the library is not evidence that the inspected homepage enables it.

`image-atomizer.js` and `atomizer-worker.js` implement the later struct-of-arrays engine: reusable ImageData, Float32 position/velocity/target/TTL arrays, Uint32 packed colors, dense activeCount and swap-with-last removal; separate flags/function references retain optional dynamic colors. New sampling advances by **particleGap + particleSize**. Squared distances and direct vector attraction replace most trigonometry, damping is calculated per frame, a cached Uint32 view clears/writes the buffer, and worker messages handle initialization, pointer, resize, play/pause and destruction. Endianness checks matter for packed RGBA.

The [performance article](https://blog.elliottprogrammer.com/4-performance-optimizations-that-made-my-canvas-particle-animation-butter-smooth/) reports successive average work costs: baseline roughly 3.57–3.99ms; reusable buffer/math 1.02–1.35ms; packed writes 0.85–1.18ms; typed arrays 0.75–1.01ms; worker 0.72–0.89ms. Those are the author's saved logs, not Anees benchmarks. `1000 / average work time` is a theoretical processing rate, **not actual displayed FPS**, refresh-rate stability, input latency or compositor cost. Our future evaluation must record rAF intervals, p95/max costs and simultaneous-scene load too.

`starfield.js` is considerably more than dots: cached nebula/comet artwork, star depth/rotation and its own animation lifecycle. Its colored gradients, additive glow and comet cache conflict with Copper Atelier. Learn the two-layer composition and shared visibility ownership, not the visual treatment or implementation.

### About

`main.js:308` onward separates moving background typography, copy entry and image entry. About scene timelines and `image-frame-cycler-v2.js` independently schedule visible-frame swaps, forward/reverse sequences, holds and pauses. Eye/hand/fan image sequences, head/arm rotation, coffee/bug discovery interactions and IntersectionObserver visibility control make the illustration a scene, not one reveal. Inspect `index.html` layered scene containers and `styles.css` placement rules alongside the cycler; rotation is applied to independently drawn parts, not an invented facial rig.

Lesson: author a distinct environment and distribute movement between real layers; don't repeatedly move every text block by 16px. Anees has **no matching eye/hand sequences**, so this behavior is not currently asset-ready.

### Projects and other narrative sections

The source is an employment/open-source/impact narrative, not Anees's four-project case-study template. It combines two-column hierarchy, repository/metric evidence, animated background words, staggered content and a separate contribution-history slider. The slider is timed `scrollLeft` motion with repeat/yoyo; its year triggers pin locally in a horizontal scroller. **Do not call that the same thing as a scroll-scrubbed four-project showcase.** Static project destinations and section-specific visual treatment are useful lessons; Elliott's numbers, employers and author claims are not reusable content.

### Career

`main.js:1424` pins `#experience-wrapper`, start top/top, explicit `+=2000` end and scrubbed timeline. The circular environment rotates -140 degrees while a 14-frame, 1848×252 walking strip advances through stepped background positions. `index.html:741` onward separates rear globe/buildings, walking sprite and front building fragments. These foreground occlusions are central to its storytelling quality. Native reverse scroll reverses timeline position; release is controlled by the finite end/pin spacer. `styles.css:1853` establishes concentric rotating layers. The article explains bespoke globe/buildings; sprite metadata confirms actual walk frames. Our original journey must not reproduce this world.

The reference globally connects Lenis to GSAP ticker/ScrollTrigger and uses normalizeScroll. This is evidence of its setup, **not a requirement or recommendation** for our native-scroll Next.js site.

## C. Level Up: a real but deliberately small game

Read README, main, full game classes, style, index and both sprite JSON files. `main.js` creates LevelUpGame on DOMContentLoaded. The game owns asset loading, frame scheduling, scaled coordinates, collection state, floating text and controls. Buttons permit the **next** platform, not arbitrary jumps. Idle loops; jump is nonlooping; position advances during a specified jump-frame window, then remains on the new level and switches to idle. Collectible collision uses a distance/radius check near the character; it is **not a general gravity/platform collision solver**. Floating text rises/fades and is removed on completion. Start/play/pause/reset own the rAF loop; the integrated portfolio adds offscreen pause/resume.

Canvas scales from base dimensions and the CSS scene aspect ratio; labels/control overlays are aligned in percentage coordinates. The metadata contains 270 idle frames at 6972×6929 and **58** jump frames at 3320×3198. The source still has a `jumpTotalFrames = 56` field; the article's total 328 agrees with 270+58, not with assuming that field is the atlas count. The complete portfolio additionally has a 506-frame celebration atlas at 9628×9594. These decode sizes are far beyond an appropriate baseline for our mobile scene.

Lesson: progression can be playable with a finite state machine and real buttons; don't pretend a transition or static sprite is a game. Our proposed game uses engineering observations linked to real project evidence, not proficiency scores, orbs/glow or borrowed sprites. Art readiness is an explicit Phase 3R-5 gate.

## D. Ask Elliott AI: retrieval, not fine-tuning

Read README/package, `src/main.ts`, `src/server/chunk-files.mjs`, `query-vector-store.ts`, `dev-server.ts`, plus the portfolio's `functions/elliott-ai.js` and `elliott-ai/query-vector-store.mjs`.

| Stage | Actual implementation | Future Ask Anees lesson |
| --- | --- | --- |
| Preparation | Markdown career documents loaded from server/documents | Only approved public project/profile documents; no private photograph, secrets or fabricated role claims |
| Chunking | Recursive splitter, token-aware tiktoken length, 400 tokens / 80 overlap, paragraph→line→sentence→word separators | Preserve headings, source IDs, approval/version metadata and consistent tokenizer |
| Embedding/storage | text-embedding-3-small, 1536 dimensions, batches of 90; Supabase documents upsert | Server/offline ingestion only; stable IDs/content hashes; migrations/deletions and idempotent reindexing |
| Semantic retrieval | Query embedding then match_documents RPC | Audit schema/index/RLS/privileges; the reference depends on externally configured RPC, not a proven migration bundle |
| Keywords | Stopword-filtered top terms; metadata keyword_text `ilike` OR filters; constant score 0.25 | This is simple lexical fallback, not BM25 or Postgres full-text ranking |
| Hybrid | Dedupe by source/chunk, keep larger score, sort descending; request 10 semantic + 8 keyword, return at most 12 | Scores are not calibrated; evaluate reciprocal-rank fusion against a labeled query set |
| Context | Source-labelled excerpts, 2000-token content budget, stops on first over-budget chunk | Budget headers/system/question/output too; do not discard all later smaller useful excerpts |
| Answer | Concise factual prompt, context-only intent and direct contact when uncertain; streamed model output | Prompt is not a grounding guarantee: refusals, citations, contradictions and prompt injection need tests |
| SSE | POST fetch stream; JSON data events token/metadata/done/error; incremental decoder/frontend transcript | Handle split records, AbortController, bounded input/history, errors/retry, accessible announcements and scroll intent |
| Environment | Vite + Express development server at default 8888; server env for OpenAI and Supabase secret; Netlify function lazy-imports query code | Our future API is a Node Next Route Handler, not a copied Netlify adapter; rate limit, timeouts, deployment streaming checks |

The portfolio function validates method/JSON/question and returns a ReadableStream with SSE headers. That is inspected source, not an executed external AI or verified Netlify deployment. The chat uses supplied prompts and native submit behavior; no model was queried during research. Exact future model/API choice is intentionally deferred to current official documentation and explicit budget approval in Phase 4.

The standalone frontend calls hard-coded `http://localhost:8888/elliott-ai`, updates the assistant bubble through textContent and scrolls to the bottom on each token. Its parser buffers split SSE records, but visibly handles token/error rather than rendering source metadata; it is not already a citation-rich, abortable production chat. These are important frontend differences to address independently, not copy.

## Current portfolio: classify it honestly

Next.js 16.4.6 App Router, React 19.3, strict TypeScript, Tailwind 4.3.3, Motion 14.12.0 and Lucide. Base UI/shadcn utilities remain dependencies but are not the expressive scene system. No GSAP, @gsap/react or Lenis is installed. `app/page.tsx` composes server sections within small client wrappers; `app/layout.tsx` self-hosts Instrument Serif/DM Sans/IBM Plex Mono through next/font. Cache Components and the narrow unknown-case-slug proxy must remain.

| Surface/source | Present behavior | Classification / deficiency |
| --- | --- | --- |
| Hero, motion.tsx | Coordinated visible-default text/artwork entrance | One-time stagger; not pixel-cloud formation |
| image-atomizer.tsx; particle-engine/worker | Sampled RGBA, typed arrays, packed reusable buffer, pointer/touch repulsion, return-to-target, replay, worker fallback, idle sleep | **Real custom simulation**, not fake dots. Constructor begins at targets; scatter sets modest random velocity, not a dispersed initial cloud. Visual story starts completed |
| pointer-scene.tsx | Bounded planar pointer depth and 16px scroll offset | Genuine continuous mapping but restrained; not an authored environment transition |
| Digital Atelier/workspace-scene | Native project/view radios and CSS-selected server panels with brief selection motion | Useful functional archive, **not an animated studio or game**; duplicates Selected Work visually |
| selected-work/project-journey | Desktop conditional sticky horizontal Motion track; native-scroll mapping and project-nav controls; stacked fallback | Genuine scroll-scrubbed transition, not universally active: width, available height, pointer, text and fit gates. Panels repeat one composition; backgrounds don't tell distinct stories |
| Engineering Workbook | Native disclosures, simple line diagram and brief open animation | Useful interaction; diagrams have no source-led multi-step narrative |
| Concurrency Lab | Local educational reducer/state, manual steps and animated request/event feedback | **Functional local demonstration**, not SportLynk implementation; preserve it rather than relabel it a mini-game |
| Build Trail / Follow the Thread | Motion scroll subscription, drawn path + moving dot, conditional sticky artifact with late crossfade and 12px shift | Genuine reversible scroll-linked archive. Same paper-plane composition persists; thematic learning sequence, not verified career chronology |
| About | Server biography, profile facts and static MA composition | Primarily static; approved character absent here; no layered studio |
| Evidence/contact/footer | Real GitHub/email/copy actions, static sign-off and local UI transitions | Working destinations; no authored final handoff from thread |
| Four case routes | Source-grounded server narratives, actual screenshots, native architecture disclosures/popovers and reveals | Valuable evidence to preserve; visual polish should not rewrite truth or gate reading |

The existing engine already implements the major buffer/typed-array performance ideas in the later article. The priority is **choreography, silhouette fidelity, composition and scene pacing**, not declaring those optimizations missing or blindly substituting the standalone library.

## Vetted priorities and preservation

1. Hero: make the formation legible, localized repulsion stronger and portrait/background scale deliberate. Preserve the current static fallback, sampled colors, touch scroll and lifecycle. Existing max working surface is approximately 420×630 (300px-wide low tier), gaps 3/4, radius 15% of simulation width; change only against actual visual/performance evidence.
2. Remove homepage repetition: move personal studio next to introduction; fold Digital Atelier's useful views into the cinematic project inspection, rather than shipping two near-identical four-project blocks.
3. Replace the trail's mostly unchanged rectangular folio with a six-station copper-thread landscape. Preserve stable `#journey` and legacy chapter destinations and all source links. Do not invent chronological dates.
4. Differentiate engineering and project transitions: expose actual boundary/record decisions, not more fade-up wrappers.
5. Add an explicitly playable, isolated experience only when original aligned art is approved. Preserve the Concurrency Lab and its static reading alternative separately.

Preserve all exact brand primitives/accessible derivatives, fonts, original MA, approved assets/originals, truthful data and four study routes, semantic reading order, disclosure/popover affordances, responsive menu behavior, direct contact, existing regression equivalence and live reduced-motion/hidden/offscreen fallbacks.

## Visual evidence and limits

Fresh baseline measurements are in `.qa/phase3r/evidence/current/capture-results.json`: **320, 375, 390, 414, 768, 1024, 1280, 1440, 1920 × 900 CSS pixels**, DPR 1, all with zero horizontal overflow and no collected homepage pageerrors. Additional current section/case captures and the asset contact sheet are alongside them. Supplemental review records height-sensitive modes, pointer/replay progression, no-JS, doubled-root-text and reduced motion separately. These are local Chrome browser checks, not physical-device, Safari/Firefox, real screen-reader, field-performance or verified animation-FPS coverage.

Historical project status reports 102 passing production tests and 42 focused retained/equivalent Phase 2 cases. That is historical evidence, **not a newly run suite** in 3R-0. This research does not assert new lint/typecheck/build/e2e success. Acceptance for each implementation phase explicitly requires those checks plus rendered visual review. Current source hashes are verified at final handoff; research evidence/blueprint files alone are written.
