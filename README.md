# Muhammad Anees — Personal Developer Portfolio

Phase 3R-3 brings About directly after the hero and consolidates Selected Work into one four-project inspection experience. The original particle portrait, evidence-led case studies, Engineering Workbook, Follow the Thread, local Concurrency Lab and contact remain. Next.js 16.4.6 App Router, TypeScript, Tailwind CSS 4, Motion, the shared GSAP foundation, Lucide and approved typography support this personal portfolio. Phase 3R-4 is not started; manual visual review belongs to the owner.

## Run locally

```sh
npm install
npm run dev
```

For a production preview:

```sh
npm run build
npm run start -- --port 3100
```

A first build needs Google Fonts access/cache. next/font then serves fonts locally. No API keys are needed. The assertion fixture below uses an optional build/server flag; use the same value in both environments. Ordinary previews omit it or set it to `0`. Ask Anees backend and deployment are excluded.

## Checks

```powershell
$env:PORTFOLIO_SCENE_FIXTURE = "1"
$env:CAPTURE_VISUALS = "0"
npm run lint
npm run typecheck
npm run build
npm run start -- --hostname 127.0.0.1 --port 3100
```

In a second PowerShell terminal, run the full assertion-only suite:

```powershell
$env:PORTFOLIO_SCENE_FIXTURE = "1"
$env:CAPTURE_VISUALS = "0"
npm run test:e2e -- --reporter=list --trace=off --output=.phase3r-assertion-results
```

Browser checks use installed Google Chrome and the production build on port 3100. The fixture flag must match at build, server startup and test invocation; otherwise the reference cases are absent or hydration can mismatch. The separately started server avoids an observed Windows owned-server teardown stall. Screenshots, video and traces stay disabled. Assertion output is disposable; preserve existing historical QA evidence. Rebuild without the fixture for the ordinary portfolio preview.

## Project map

- `app/`: route, layout, shared CSS, and design tokens.
- `components/portfolio/`: new portfolio components; content remains server-rendered around small interactive boundaries.
- `lib/portfolio-content.ts`: typed personal and project content.
- `lib/case-studies.ts`: source-reviewed stories; `app/work/[slug]/page.tsx` generates four routes.
- `lib/profile-content.ts`: profile, engineering evidence and date-optional chapters.
- `lib/particle-engine.ts`, `lib/particle-worker.ts`: original bounded renderer, conditional on eligible scenes.
- `lib/concurrency-lab.ts`: simplified deterministic teaching model, not a project backend.
- `lib/scroll-scene-contract.ts`, `lib/scroll-scene-runtime.ts`: shared fit, readiness, refresh, progress and native hash coordination.
- `components/portfolio/project-journey.tsx`: the finite Work scene registered through SceneBoundary; no independent Motion scroll subscription.
- `components/portfolio/about-work.module.css`: scoped About/Work styling, including text-relative stacked layouts.
- `public/projects/`: authentic screenshots from Anees's software repositories.
- `docs/DESIGN_SYSTEM.md`: approved design and measured contrast.
- `DESIGN.md` and `.impeccable/design.json`: extracted visual system and machine-readable design documentation.
- `docs/CONTENT_SOURCES.md`: factual sources and asset provenance.
- `docs/BUILD_LOG.md`: implementation and verification record.
- `docs/PROJECT_STATUS.md`: phase gates and limitations.
- `docs/PHASE1_REVIEW.md`: historical foundation report.
- `docs/PHASE2_REVIEW.md`: historical initial implementation review.
- `docs/PHASE2_DELIVERY.md`: historical Phase 2 report.
- `docs/PHASE3_DELIVERY.md`: current verification and coverage limits, with earlier delivery evidence retained as history.
- `docs/PHASE3_FINALIZATION.md`: historical four-experience finalization; not visual approval of the subsequent redesign.
- `docs/PERSONAL_CONTENT_NEEDED.md`: owner inputs/placement.
- `docs/THIRD_PARTY_NOTICES.md`: licensing research/non-reuse.
- `lib/character-assets.ts` and `public/images/character/README.md`: owner-supplied artwork contract.
- `AGENTS.md`: durable instructions for future development.

Current closeout and implementation results are recorded in `docs/BUILD_LOG.md`, `docs/PROJECT_STATUS.md` and `docs/PHASE3_DELIVERY.md`. The retained suites cover all nine widths, all five routes, doubled root text, native controls, hash/history navigation, reduced motion, touch emulation and no-JS content. Existing captures and review verdicts are historical, not approval of the new About/Work composition. Chrome emulation is not physical-device or screen-reader certification. No visual captures are generated for this assignment.

SportLynk is private/in development; its case explains approved product direction without invented stack, screens or backend completion. Other studies use genuine repositories/screenshots. Public photo/resume/LinkedIn and detailed dated history are not registered; clean optional fields are ready. Independent facial/typing/walking needs aligned artwork. No AI backend, copied reference code or publication.

Existing unused starter components/assets remain preserved. The initial versions of changed files are saved locally in the ignored `docs/workspace-snapshot/phase-1-start/` directory.
