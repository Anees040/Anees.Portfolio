# Implementation architecture and decision record

## Recommended stack (proposal; no package change)

**One primary narrative scroll system: GSAP + ScrollTrigger, integrated through @gsap/react.** It is justified by the approved redesign's two coordinated finite pins, multi-track background/image/type timelines, responsive scene rebuilding and reversible chapter choreography. Existing Motion remains for local entrance/press/hover UI where already useful; the independent existing particle engine and new game keep their own bounded simulation clocks. No Three.js, R3F, physics dependency or Lenis is required.

This changes the earlier Motion-only implementation direction **only if the owner approves Phase 3R-2 and the licence gate passes**. It does not claim GSAP is technically necessary or that Motion cannot do these effects. Native sticky + Motion useScroll remains a viable no-new-package alternative if dependency/licence approval fails. Decide once before implementation; do not mix two scroll authorities on the same scene.

| Candidate | Assessment |
| --- | --- |
| Motion 14.12 existing | Already supports real native-scroll mappings, transitions and preference handling. Preserve good local wrappers/semantic children. Complex Work/Thread multi-track orchestration can be done here, but current ad hoc callbacks/fit measures are distributed across components |
| GSAP core + ScrollTrigger | Coordinated timelines, finite pin/end, matchMedia, invalidateOnRefresh and refresh lifecycle suit this brief. Requires client-only scoped registration/cleanup and explicit access/reduced-motion behavior; not magic jank prevention |
| @gsap/react | useGSAP/contextSafe scope and cleanup are useful for React Strict Mode/remounts. Hook is lifecycle integration, not an alternative scroll engine |
| Lenis | **Reject for now**: no demonstrated defect in native scrolling, extra ticker/scroll ownership and touch/anchor risks. Do not copy reference normalizeScroll or wheel interception |

Licence status/verification gate is in LICENCE_AND_ATTRIBUTION. Official documentation snapshots are research inputs; no GSAP package has been installed, and no inaccessible standard-licence page is represented as verified terms.

## Server/client structure

Keep `app/page.tsx`, section content, profile and four case-study routes server-rendered. Server sections pass their real children into small client scene adapters. Client adapters import behavior, not the entire content archive. Do not mark the root page/layout as client to make a timeline easy. Preserve Next 16.4.6 Cache Components and `proxy.ts` 404 guard; do not introduce dynamicParams to replace it.

Coordinator future shared files: `lib/scroll-scene-contract.ts` for types, `lib/scroll-scene-runtime.ts` for browser-scoped runtime/fit/refresh, `components/portfolio/scroll-scene-provider.tsx` for one lifecycle owner, and `components/portfolio/scene-boundary.tsx` for local registrations. Names are proposed paths, **not files currently implemented**. Do not reimplement the same observers/token parser in each worker.

Scene contract fields: unique id; DOM scope; readiness promise; fit predicate; setup(progress/visibility); settle; dispose; anchor-to-progress mapping; tested static fallback. Publish immutable contract/mock fixture before parallel workers start. Global integration owns header clearance and chapter/hash resolution; workers never query/mutate unrelated scenes.

## GSAP lifecycle

1. Load/register core, ScrollTrigger and React integration inside the client boundary; feature adapters are dynamically loaded after hydration/readiness, not during server render.
2. Scope useGSAP to a scene ref; setup inside gsap.matchMedia for no-preference and fit-capable viewports. Delayed interactions that create tweens use contextSafe. Use revertOnUpdate for dependencies that truly rebuild geometry, not every progress render.
3. Cleanup owned triggers/timelines, matchMedia, Resize/Intersection observers, resize/media/visibility listeners, pending rAF/idle callbacks and workers. Revert temporary inline properties/spacers. Never call global ScrollTrigger.killAll from one section.
4. React Strict Mode mount→cleanup→mount must leave exactly one registration/ticker per scene. Route navigation/unmount cancels asynchronous imports/image work using generation tokens/disposed flags.
5. Only GSAP writes narrative transform/opacity/path values after a scene migrates; remove that scene's competing Motion useScroll subscription. Keep Motion local properties on separate DOM wrappers or transfer ownership explicitly.

Easing is read from `app/tokens.css` through `readMotionTokens`, with a shared adapter to GSAP's easing function; do not silently use power defaults or invent timing constants. Scrubbed displacement is linear progress. If CustomEase is selected from the verified GSAP package, register the exact existing cubic once; no global token change is needed. Pixel simulation and game physics use delta time, not UI easing.

## Measurement and refresh strategy

- First create stable semantic layout: explicit screenshot/image aspect ratios, font-loaded text, static scene baseline. Await `document.fonts.ready` and relevant image `decode()`/load-or-error; readiness failure must reveal the static scene rather than block the page.
- Coordinator coalesces refresh requests into one next-frame pass after layout settles. Refresh on scene registration/removal, viewport orientation/resize, real container size change, font readiness, relevant image dimensions, disclosure changes that affect height and pin enablement changes. Never refresh on every scroll or every packet/game frame.
- A ResizeObserver callback marks dirty; it does not recursively call refresh while refresh itself mutates the same geometry. Separate measurement reads and DOM writes; compare sizes and permit at most one extra pass for pin-spacer stabilization.
- Use function-based start/end, invalidateOnRefresh and measured header clearance. Pin end derives from stage count, available viewport and actual travel; content fit includes nav/CTA/caption and enlarged text. If it cannot fit, **stack it**. No arbitrary `+=2000` copied from Elliott.
- Preserve relative active chapter during pin→stack changes and link focus. Wait for new geometry, then map the real chapter anchor; do not preserve obsolete spacer-relative scrollY at the expense of location. Native back/forward and repeated direct case/hash navigation are regression requirements.

## Responsive/accessibility contract

Desktop pin requires fine/hover-capable pointer, min 1024px physical viewport, sufficient **text-relative** available height and actual stage width/content fit. Test 1024×600, 1280×720, 1440×900 and doubled root text, not just 1440×900. Short desktop/touch/RTL/reduced motion stack even if width is large. Mobile uses real article order, local image reveals and named touch buttons; no horizontal scroll-jacking or global keyboard capture.

Live reduced-motion matchMedia changes revert the enhancement immediately and expose complete static content. Decorative canvas is aria-hidden; real image has meaningful alt. Text remains DOM, no duplicate accessible split-character copies. Native menu/notes/disclosures/popovers preserve Escape/focus/no-JS. Work/Thread links focus the actual destination; hidden enhanced copies are not tabbable. Contact remains usable regardless of game/scene readiness.

## Canvas and worker responsibilities

Portrait engine is **retained and refined**, not replaced with the unlicensed portfolio or old standalone script. Main thread owns image acquisition/sampling or transferable source buffer, capability decisions, ResizeObserver/pointer coordinates, visible static image, DOM status/Replay and high-level state. Worker owns typed-array simulation and pixel drawing on OffscreenCanvas; it does not query DOM or own scroll. Visibility/preference/sequence messages cannot race an old generation back into running.

One hero controller owns portrait + background activation; background is either cheap finite SVG/DOM point depth or a separately bounded low-density canvas. It is not an unrelated global starfield loop. Reusable image buffers, packed writes, allocation limits and endian-safe fallback remain; decode/sampling are outside the hot loop. Check DPR/work-surface caps before choosing density. Preserve low-core/touch/static/image-failure/worker-failure paths and idle sleeping under stationary interaction.

Provisional targets to validate, not achieved measurements: desktop portrait <=24k particles initially; low-tier <=6k; DPR cap 2 with independently capped working surface; hero combined p95 JS update+draw <=8ms at 60Hz reference hardware, no visible burst >16.7ms; record actual rAF interval distributions and total page responsiveness, not 1000/work-cost as FPS. Lower density/resolution or settle static when sustained work exceeds budget; do not obscure fidelity with high-count translucent dust. Report hardware/browser/viewport and both main/worker clocks.

Game is a separate lazy-loaded local component/engine with explicit Start. At most one rAF; finite-state simulation with clamped elapsed time, pause/resume baseline reset and deterministic collision tests. Modest approved atlas, no 50–90-megapixel sprite decodes; memory budget/profiling precedes final mobile approval. Screen-reader reading path and reduced-motion task controls are independent DOM. No worker is required initially for this tiny game; add only with measured benefit and a separate justification.

## Future Ask Anees AI (Phase 4 only)

No service, API key, embeddings or paid model is created in 3R. Future architecture: approved markdown/typed-content export → versioned token-aware chunks → offline/server embeddings → protected vector/lexical store → hybrid retrieval → evidence-labelled context → server model call → Node Route Handler SSE → accessible chat. Choose schema/index/model/tokenizer using fresh official API documentation when Phase 4 is authorized; no present model/pricing promise.

Proposed future paths: `lib/ask-anees/approved-corpus.ts`, `scripts/ask-anees/ingest.mjs`, server-only retrieval/answer modules, `app/api/ask-anees/route.ts`, isolated chat and grounded-answer tests. Service-role/model keys remain server env, never NEXT_PUBLIC, code/docs/board or client bundle. Add rate limits, max input/context/output, auth/abuse controls where needed, origin checks, timeouts/cancellation, bounded logs, redaction, idempotent chunk IDs, RLS/least privilege and approved corpus deletion/reindex.

Evaluate vector + proper lexical retrieval/rank fusion, citation/source IDs and refusal/contradiction behavior rather than copying the reference's score 0.25 fallback. Prompt injection is untrusted corpus/user data. Test unsupported employment/dates/metrics/SportLynk implementation and direct email fallback. Stream token/metadata/done/error with split-record-safe parsing and AbortController; batch screen-reader announcements, don't announce every token. Validate proxy/platform streaming before deployment authorization; maintaining a planned feature note is the correct present state.
