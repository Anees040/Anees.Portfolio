# Muhammad Anees — Copper Atelier

Phase 2 of Muhammad Anees's Copper Atelier portfolio: coordinated hero motion, character asset architecture and an interactive developer workspace. Built with Next.js App Router, TypeScript, Tailwind CSS 4, Motion for React, Lucide, and the approved Instrument Serif / DM Sans / IBM Plex Mono typography.

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

A first build needs access to Google Fonts. next/font then serves optimized fonts locally to visitors. No API keys or environment variables are needed for Phase 2.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Browser checks use installed Google Chrome. If Chrome is unavailable, install it or switch the Playwright channel after installing a compatible browser. Tests start a production server on port 3100 if needed. Phase 2 screenshots are saved under `.impeccable/review/phase-2/`; the interactive test report is in `playwright-report/`.

## Project map

- `app/`: route, layout, shared CSS, and design tokens.
- `components/portfolio/`: new portfolio components; content remains server-rendered around small interactive boundaries.
- `lib/portfolio-content.ts`: typed personal and project content.
- `public/projects/`: authentic screenshots from Anees's software repositories.
- `docs/DESIGN_SYSTEM.md`: approved design and measured contrast.
- `DESIGN.md` and `.impeccable/design.json`: extracted visual system and machine-readable design documentation.
- `docs/CONTENT_SOURCES.md`: factual sources and asset provenance.
- `docs/BUILD_LOG.md`: implementation and verification record.
- `docs/PROJECT_STATUS.md`: phase gates and limitations.
- `docs/PHASE1_REVIEW.md`: historical foundation report.
- `docs/PHASE2_REVIEW.md`: current implementation, checks, review and screenshot links.
- `lib/character-assets.ts` and `public/images/character/README.md`: owner-supplied artwork contract.
- `AGENTS.md`: durable instructions for future development.

Phase 2 interaction work is implemented and production-tested. Character generation was deferred by the owner; the architectural MA fallback remains until supplied artwork is integrated. Phase 3 requires explicit approval. Detailed case studies and Ask Anees AI are deferred. Nothing has been deployed.

Existing unused starter components/assets remain preserved. The initial versions of changed files are saved locally in the ignored `docs/workspace-snapshot/phase-1-start/` directory.
