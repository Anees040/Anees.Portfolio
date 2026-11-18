# Muhammad Anees — Copper Atelier

Phase 3 of Muhammad Anees's Copper Atelier: interactive image-derived portrait, professional Digital Atelier, four evidence-led case studies, engineering workbook, scroll-driven Follow the Thread, local Concurrency Lab and editorial contact finale. Next.js 16.4.6 App Router, TypeScript, Tailwind CSS 4, Motion, Lucide and approved Instrument Serif / DM Sans / IBM Plex Mono typography.

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

A first build needs Google Fonts access/cache. next/font then serves fonts locally. No API keys/environment variables are needed. Ask Anees backend and deployment are excluded.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Browser checks use installed Google Chrome and a production build on port 3100. This Windows continuation uses a separately started preview with Playwright's existing reuse setting to avoid an observed automatic-teardown stall. Current captures/recordings/measurements: `.qa/phase3-finalization/`; browser report: `playwright-report/`.

## Project map

- `app/`: route, layout, shared CSS, and design tokens.
- `components/portfolio/`: new portfolio components; content remains server-rendered around small interactive boundaries.
- `lib/portfolio-content.ts`: typed personal and project content.
- `lib/case-studies.ts`: source-reviewed stories; `app/work/[slug]/page.tsx` generates four routes.
- `lib/profile-content.ts`: profile, engineering evidence and date-optional chapters.
- `lib/particle-engine.ts`, `lib/particle-worker.ts`: original bounded renderer, conditional on eligible scenes.
- `lib/concurrency-lab.ts`: simplified deterministic teaching model, not a project backend.
- `public/projects/`: authentic screenshots from Anees's software repositories.
- `docs/DESIGN_SYSTEM.md`: approved design and measured contrast.
- `DESIGN.md` and `.impeccable/design.json`: extracted visual system and machine-readable design documentation.
- `docs/CONTENT_SOURCES.md`: factual sources and asset provenance.
- `docs/BUILD_LOG.md`: implementation and verification record.
- `docs/PROJECT_STATUS.md`: phase gates and limitations.
- `docs/PHASE1_REVIEW.md`: historical foundation report.
- `docs/PHASE2_REVIEW.md`: historical initial implementation review.
- `docs/PHASE2_DELIVERY.md`: historical Phase 2 report.
- `docs/PHASE3_DELIVERY.md`: current implementation, checks, measurements, captures and limits.
- `docs/PHASE3_FINALIZATION.md`: current four-experience finalization, root causes, complete results and Phase 4 handoff.
- `docs/PERSONAL_CONTENT_NEEDED.md`: owner inputs/placement.
- `docs/THIRD_PARTY_NOTICES.md`: licensing research/non-reuse.
- `lib/character-assets.ts` and `public/images/character/README.md`: owner-supplied artwork contract.
- `AGENTS.md`: durable instructions for future development.

Finalization lint/typecheck/build pass and **102 production Chrome tests pass in5.9 minutes**: all85 prior cases retained/equivalent plus17 particle-equilibrium/touch, project/view, chapter navigation, clipboard and enlarged-heading regressions. The previous delivery/review remain historical; current results and the independent visual-fix verdict are in `docs/PHASE3_FINALIZATION.md`. All nine widths/all five routes cover 200% root text. Current screenshots/real recordings: `.qa/phase3-finalization/review.html`. Phase3 is ready for separately authorized Phase4 within documented limits. Chrome emulation is not real-device/accessibility certification.

SportLynk is private/in development; its case explains approved product direction without invented stack, screens or backend completion. Other studies use genuine repositories/screenshots. Public photo/resume/LinkedIn and detailed dated history are not registered; clean optional fields are ready. Independent facial/typing/walking needs aligned artwork. No AI backend, copied reference code or publication.

Existing unused starter components/assets remain preserved. The initial versions of changed files are saved locally in the ignored `docs/workspace-snapshot/phase-1-start/` directory.
