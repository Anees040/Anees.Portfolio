# Implementation architecture and decision record

## Focused Hero/About correction — 20 November 2026

One session, no agents/worktrees, preserving incoming local changes at `a105cbc` (remote `master` matched by `git ls-remote`). Contract v1, provider, registration, refresh ownership, project pin and downstream routes are unchanged. Hero's existing `PointerScene` Motion subscription maps absolute native scroll to coordinated field/foreground/orbit transforms; no added ScrollTrigger or pin. About remains server content through its existing local entrance adapter.

`ImageAtomizer` retains decoded-image sampling, capability tiers and static/worker/main lifecycle. CSS and sampling now share an ellipse. The engine counts nontransparent samples first and allocates exact typed-array capacity, enforcing 32,000 particles / 8 MiB engine storage / 480×700 surface. The retained worker accepts the same source/force model without protocol changes. Radius, density and stamp footprint are separate; curved dilation preserves the center and exact target return.

`components/portfolio/hero-ambient.tsx` owns one canvas renderer/rAF plus scoped size, Hero visibility, preference/hidden cleanup. `lib/hero-ambient.ts` contains deterministic stars and original finite comet rendering. It does not own portrait input, sampling, scroll, a shared runtime or React frame state. Static SVG is server-rendered. <=2 cores, context failure, no-JS, reduced motion and forced colours retain static presentation. The two renderers coordinate around Hero visibility/preferences while keeping their responsibilities distinct.

The next Thread migration is planned, not started: consume the existing boundary/absolute-progress contract, remove its old Motion subscription only in approved 3R-4, and preserve five real chapter IDs. The roadmap records distance/holds/static alternatives; modular workspace/game art is a separate gate.

## Phase 3R-2 implemented foundation — 19 November 2026

This section supersedes the historical proposal below. The owner authorized GSAP and the shared foundation, not About/Work/Thread redesigns, the game or AI. Public identity is **Muhammad Anees's personal developer portfolio**; the approved palette and fonts remain unchanged. No other workstream or agent was started.

### Baseline and ownership

Verified workspace `D:\anees-portfolio`, branch `master`, origin `https://github.com/Anees040/Anees.Portfolio.git`, reviewed commit `71bc5f87a4af52b4536e91b25dced0b435e37b3b`. The local 3R-1 hero/particle changes and its untracked CSS/test were already present. They are preserved; the only added hero edit removes public studio wording. The research README still describes 3R-1 as not started, so it is historical, not the current implementation baseline.

During the owner's resumes, the repository advanced to `a737bf8` (the hero/foundation changes) and `d6dcf1e32e2abdd26e58b061f96062f40c56d53c` (pinning-stabilization documentation). These commits were observed, not issued by this agent. Their checked-in implementation matches the verified working files; no reset, branch switch, commit, push or deployment command was performed by this agent.

GSAP owns the new narrative runtime and page progress indicator. Existing Work/Thread implementations retain their Motion ownership until their explicitly approved migration; the foundation does not attach GSAP to their animated elements. Local Motion interactions and the independent portrait simulation remain intact. Reveal discovery excludes registered GSAP scene scopes. The old global CSS smooth-scroll rule is removed: ScrollTrigger otherwise cached it and restored an inline smooth state across reduced-motion changes, interrupting native anchors. No smooth-scroll system, wheel/touch takeover, Lenis, ScrollSmoother, Three.js or second Motion package is added.

### Contract v1 and lifecycle

- `lib/scroll-scene-contract.ts`: typed scene identity/scope/stage, readiness with cancellation, actual fit predicate, finite distance, real anchor mappings, timeline setup, optional absolute-progress/visibility/settle/dispose callbacks, and mandatory static fallback. The timeline port exposes only scoped numeric transform/opacity tracks, not the GSAP global API.
- `lib/scroll-scene-runtime.ts`: unique registration and anchor ownership, pure fit/progress helpers, bounded readiness, scoped contexts, one owned trigger per pinned scene, one page-progress trigger, one ResizeObserver/IntersectionObserver pair, matchMedia, coalesced refreshes, focus/history integration and idempotent teardown. `inspect()` and bounded DOM counters expose current registration/trigger/refresh state without logging continuously.
- `components/portfolio/scroll-scene-provider.tsx`: one active browser lifecycle owner using `useGSAP`, `contextSafe`, a stable registration bridge, cancellation during imports and owned disposal. Home and case-study server content use the same adapter; navigation disposes the old route runtime before creating the new one. Case studies have only page progress, not narrative scene triggers. Content and data are not moved into client state.
- `components/portfolio/scene-boundary.tsx`: scoped `useGSAP` registration and cleanup. A stable client-side factory creates the scene; server-rendered children pass through this adapter. Toggling/unmounting removes only that registration and its context/trigger.

Registration returns an idempotent disposer. Duplicate identifiers, DOM scopes or shared anchors are rejected before setup. Each setup has a separate context assigned before animation creation so a thrown setup can still revert its partial work. Owned target styles are restored exactly after context cleanup. No `killAll`, global animation clear or per-frame React state is used. Async readiness cannot revive an aborted registration. Initialization failure leaves server content intact and tears down coordinator resources. Next/React may retain inactive route DOM in Activity; its effects dispose the old runtime, and only the current scope has `data-scroll-runtime="ready"`.

### Fit, readiness and refresh

Fit reads viewport width/height, measured header clearance, root text size, stage/content/image width and height, navigation/CTA height, fine-hover capability, touch capability and live reduced motion. Defaults require at least 1024px width, 46rem available height and 40rem stage width **as well as actual content fit**. A custom predicate may tighten this gate, never bypass it. At 1024×600 and 1280×720 the reference stacks; a 1440×900 non-touch fine-pointer viewport fits. Enlarged text, expanded content and touch-capable desktops may also stack. Stage-height comparisons and observer notifications tolerate the one-pixel rounding introduced when ScrollTrigger changes a natural-height stage to a fixed pin; genuine fit changes are still evaluated. This prevents pin entry/release from scheduling geometry rebuilds or restoring stale scroll positions.

Fonts, image load/decode/error and scene-specific readiness settle before pinning. The 5-second bound makes stalled readiness a static failed state, not an unusable page. A failed resource does not hide content. Registration/removal, container changes, fonts, disclosures, resize/orientation and preference/visibility changes mark layout dirty. One rAF pass reads measurements first, rebuilds only changed configurations in DOM order, refreshes positions and allows one additional stabilization pass. ScrollTrigger's automatic resize/load refresh events are disabled while this coordinator owns them; disposal restores its normal event policy. Observers watch actual stage/content/header geometry, not the generated pin spacer.

### Progress, focus and interruption

The paused timeline seeks absolute normalized progress with linear scroll displacement. Scoped tracks render synchronously; reversing to the same progress restores the same state. Start/end functions use coordinator-measured clearance and finite content-bounded distances, with `invalidateOnRefresh`.

Scene anchors keep real DOM IDs and native `href`s. Enhanced chapter navigation resolves `start + progress × (end - start)`, focuses the real target and uses instant native scrolling. Stacked mode resolves the real target offset with measured header clearance. Initial hashes, hashchange, popstate and back/forward are coordinated after readiness. Temporary GSAP pin DOM moves preserve useful focus and reading position; no hidden duplicate content is focused. Existing `#workspace`, `#work`, `#about`, project IDs and case-study routes remain untouched.

Live reduced motion removes eligible pins and reverts owned tracks to complete static content, without scrolling to the top. Visibility changes pause visual writes and resume at current absolute progress, not accumulated displacement. Scope disposal removes observers, event handlers, contexts, triggers and scheduled refresh work.

### Reference fixture and worker instructions

The small geometric reference is exported from the boundary file, not a new route/component file. It has introductory normal flow, one finite pin, independently moving background/foreground/meter tracks, three always-readable real chapters, native chapter links, a height-changing disclosure, pin release and a registration toggle. It is absent from an ordinary build and requires **both build and serving** with the server-only flag:

```powershell
$env:PORTFOLIO_SCENE_FIXTURE = '1'
npm.cmd run build
npm.cmd run start -- --hostname 127.0.0.1 --port 3100
```

In another terminal, set `$env:PORTFOLIO_SCENE_FIXTURE = '1'`, then run `npm.cmd run test:e2e -- --reporter=list --trace=off`. Pure contract and public-branding tests always run; the 19 browser-fixture tests are explicitly skipped without this flag because an ordinary public build intentionally contains no fixture. The existing Playwright configuration is unchanged and reuses that local production server. Running with an explicitly started server also avoids the observed Windows webServer teardown stall. For manual inspection use `http://127.0.0.1:3100/#motion-reference-middle`. Stop the server, unset the flag and rebuild normally before a public build. No deployment is authorized.

**3R-3 / 3R-4 consumption rules:** create a small client scene adapter in the approved worker scope; pass real server children into `SceneBoundary`; keep its `createScene` factory stable; provide stage/content/navigation/CTA measurement elements, real IDs/progress mappings, bounded distance and mandatory static fallback. Add timeline tracks only through the scoped port. Put local Motion effects on separately owned DOM wrappers. Remove the replaced scene's old Motion scroll subscription in the same migration. Do not create a provider, global scroll listener, observer/refresh manager or preference observer, and do not import ScrollTrigger directly in workers. Use the returned registration cleanup via the boundary, honor the readiness AbortSignal and use `inspect()` for diagnostics. Changes to contract v1 belong to the coordinator and require explicit approval before worker integration.

### Dependency and verification limits

**Phase file ledger:** created `lib/scroll-scene-contract.ts`, `lib/scroll-scene-runtime.ts`, `components/portfolio/scroll-scene-provider.tsx`, `components/portfolio/scene-boundary.tsx` and `tests/scroll-scenes.spec.ts`. No separate fixture file, route, image or QA directory was added.

Modified integration/dependencies: `app/page.tsx`, `components/portfolio/scroll-experience.tsx`, `app/portfolio.css`, `package.json` and `package-lock.json`. Modified public identity: `app/layout.tsx`, `app/work/[slug]/page.tsx`, `components/portfolio/atelier-study.tsx`, `components/portfolio/case-study.tsx` (also the shared lifecycle adapter), `components/portfolio/character-fallback.tsx`, `components/portfolio/contact.tsx`, `components/portfolio/hero.tsx` (public copy only), `components/portfolio/trail-motion.tsx` (signature only) and `components/portfolio/workspace-scene.tsx` (heading/accessible labels only). Footer wrapping accommodates the longer personal name at doubled text size; its palette/type system is unchanged.

Modified capture policy only, without changing assertions: `tests/portfolio.spec.ts`, `tests/phase2.spec.ts`, `tests/phase2-completion.spec.ts` and `tests/phase3.spec.ts`. Updated existing documentation only: this architecture/handoff, `LICENCE_AND_ATTRIBUTION.md` and `../THIRD_PARTY_NOTICES.md`. Next development mode also regenerated its enabled feedback block in root `AGENTS.md`; that generated owner instruction is preserved and was included in the externally observed commit. The pre-existing 3R-1 character/atomizer/particle-engine/worker modifications, hero CSS and hero test remain owner work, not new foundation edits.

Exact dependencies: `gsap@3.15.1` and `@gsap/react@2.1.2`; existing Motion `14.12.0`, React/React DOM `19.3.0` and Next `16.4.6` are unchanged. See `LICENCE_AND_ATTRIBUTION.md` and `../THIRD_PARTY_NOTICES.md` for package notices and the unresolved full-terms retrieval limitation. Do not describe GSAP or this React package as MIT.

Baseline lint/typecheck/build passed. The baseline suite completed all 129 case bodies: 124 passed and five legacy portrait assertions failed (initial one-frame assumptions and a fresh-tap displacement assertion changed by local 3R-1). Its Windows server teardown stalled and was interrupted. No portrait implementation or legacy assertion was changed to conceal those failures.

**Final verification, 19 November 2026:**

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed with the fixture flag, then passed again with the flag absent for the ordinary public build.
- `PORTFOLIO_SCENE_FIXTURE=1 npm run test:e2e -- --reporter=list --trace=off`: **155 passed, five failed, 160 total**, completed in 13.8 minutes against the production fixture build. All **31 foundation cases** and the existing Phase 2 coverage passed. The five failures are exactly the baseline portrait cases: `phase3-finalization.spec.ts:84`, `phase3-hardening.spec.ts:70`, and the worker/main/worker-failure cases at `phase3.spec.ts:15`. They expect zero initial displacement or a single initial draw/frame, which conflicts with the already-present 3R-1 cloud formation. The new 3R-1 hero suite passed. The previously observed intermittent worker-recovery failure did not recur in this final run.
- Development `next dev` (App Router default Strict Mode), same 31 foundation cases: **31 passed**, including mount/disposal/remount, live preferences, route re-entry and exactly one active owned trigger. Production and development both use the same frozen contract.
- Ordinary production smoke assertions: one active provider, no fixture or registered narrative scene, corrected personal title, no hydration/page errors, and readable no-JS About content; passed. An initial inline smoke command used a shell-corrupted Unicode expected title; rerunning with an escaped expected character passed without a source change.
- `git diff --check` and the reviewed-baseline-to-current-commit diff check: passed. No screenshot inspection, physical-device, additional-browser or assistive-technology session is claimed; the owner retains manual visual verification.

The implementation and focused foundation checks are complete, but **full phase acceptance is not green** while the five baseline tests and independent complete-licence verification remain unresolved. Installation also reported ten moderate npm advisories; no unrelated audit fix or dependency upgrade was attempted. Phase 3R-3/3R-4 remain awaiting owner approval.

Artifact incident: the first baseline attempt ran briefly after a shell patch failure and legacy capture hooks emitted three PNGs and two timing JSONs to the pre-existing `.qa/phase3-finish/baseline` paths. It was interrupted immediately after discovery. Capture/mkdir/report writes in the four legacy specs now require `CAPTURE_VISUALS=1`; subsequent checks use list reporting and tracing off. No new QA directory, video, review gallery or visual pipeline is added; existing user evidence is not deleted. This incident is disclosed rather than claiming no captures occurred.

## Historical proposal

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
