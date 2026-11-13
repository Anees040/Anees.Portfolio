<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Copper Atelier: approved portfolio foundation

Read `PRODUCT.md`, `docs/DESIGN_SYSTEM.md`, `docs/PROJECT_STATUS.md`, and `docs/CONTENT_SOURCES.md` before changing this project. The user's master implementation prompt fixes the direction; do not propose a new brand or reuse old portfolio repositories.

### Phase boundary

- Phase 1 is complete. The owner explicitly authorized Phase 2 on 2026-11-12: character architecture, hero choreography, interactive workspace, advanced motion, navigation and project-preview polish.
- Stop after Phase 2 verification and report. Phase 3 and later require explicit approval.
- Do not deploy, publish, build the AI service, or author detailed case studies. The owner deferred character generation and will supply artwork; the reference photograph must not be published.
- Never delete existing user files without permission. The initial files are preserved in the local, ignored `docs/workspace-snapshot/phase-1-start/` directory.
- Do not import the pre-existing `components/Aurora.tsx`, `components/ui/button.tsx`, old utility styling, or starter SVG assets into the new portfolio. They remain preserved but unused.

### Stack and structure

- Next.js App Router, TypeScript strict mode, Tailwind CSS 4, CSS variables, Motion for React, Lucide React, and `next/font`.
- Read installed Next.js documentation under `node_modules/next/dist/docs/` for the APIs being changed; do not assume an older Next version.
- New portfolio components live in `components/portfolio/`; content lives in `lib/portfolio-content.ts`.
- Keep content and layout server-rendered. Client boundaries belong to navigation state and motion wrappers. Pass server-rendered children into motion wrappers.
- `app/tokens.css` is the token authority; `app/portfolio.css` holds the shared styling. Tailwind's theme maps semantic roles to the same variables.
- Motion remains the default. Add no unnecessary dependencies, Lenis or particles. GSAP or genuine Three.js/R3F is permitted only if a documented Phase 2 evaluation justifies it.
- Evaluate React Bits through the connected registry; install only if its performance, accessibility and visual behavior fit. Selected advanced effects are now authorized in Phase 2.

### Brand rules

- Preserve all eight exact primitives: Alabaster `#F4F0E8`, Graphite `#252421`, Copper `#A85D3F`, Antique Gold `#C29A55`, Dusty Clay `#D7B9A5`, Espresso `#302B27`, Linen `#E7E0D5`, Mushroom `#746D64`.
- Accessible derived variants are `#A2573A` for small copper text/button fill and `#716A61` for supporting text. Their measured contrast and lightness-only derivation are documented. Never change the approved primitives to hide a failing contrast pair.
- Use semantic color tokens in components. No new brand colors without a documented purpose. Real application screenshots may retain their product colors.
- Instrument Serif normal/italic for display; DM Sans for body and UI; IBM Plex Mono for actual technology metadata. Use optimized fonts and fluid `clamp()` sizes.
- Editorial whitespace, restrained accent, original MA monogram, precise flat geometric artwork. No neon, rainbow/blue/purple/green gradients, glow, particles, custom cursor, or random stock imagery.

### Content truth

- Public GitHub: `https://github.com/Anees040`. Consult FitPilot, sukoon, EduVerse only as relevant factual sources; never consult old portfolio repositories.
- SportLynk is a private project in development. No production launch, tech stack, users, customers, downloads, or metrics have been independently verified.
- Email: `muhammadanees0511@gmail.com`, explicitly approved for public use.
- Keep planned and built functionality distinct. Do not infer employment, certificates, degree completion, dates, impact metrics, or personal contribution details.
- The owner supplied a private reference photograph, then deferred generation. Use the nonfigurative fallback until supplied character artwork is integrated. Enable independent facial/pose states only when matching assets exist.
- Ask Anees is currently a planned-feature note with direct email fallback. Future AI must use verified content and a server-side API; never expose secrets in browser code.

### Accessibility and motion

- Semantic landmarks and descending heading structure; one h1. Use links for navigation, native controls for actions, and visible keyboard focus.
- The mobile menu is a native disclosure, works without JavaScript, closes on Escape with focus restoration, and focuses anchor destinations when enhanced.
- No important content may rely on hover, animation, or client hydration to appear.
- Respect reduced motion in Motion and CSS, including preference changes during an animation. Gate hover motion to fine hover-capable pointers.
- Shared easing: `cubic-bezier(0.23, 1, 0.32, 1)`. Hero/media 600ms; hero stagger 80ms; press 150ms, release 100ms. Read these CSS tokens in Motion rather than defining another system.
- Prefer transform/opacity. Phase 2 allows bounded pointer depth and scroll-linked artwork; never distort a face. No unnecessary continuous loops, layout-triggering effects or magnetic controls. Stop transient motion when hidden; reduced-motion changes must settle it immediately.
- Verify 320, 375, 390, 414, 768, 1024, 1280, 1440, 1920px; doubled text size; keyboard navigation; no-JS; and reduced motion.

### Required checks

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e` (production build first; uses local Chrome and port 3100)
- Inspect screenshots, not only automated assertions. Update the build log and project status with actual results and limits. Never claim an unperformed browser/device check.

### Phase 2 integration guidance

- Workspace notes use native nonmodal HTML popovers; preserve Escape, focus restoration, no-JS behavior and touch labels. Lamp state is a native checkbox, not a decorative-only toggle.
- Register owner-supplied aligned character frames in `lib/character-assets.ts`; use `public/images/character/README.md` for export guidance. No invented facial state or automatic rig.
- Current Phase 2 motion/component guidance is in `docs/DESIGN_SYSTEM.md`; root `DESIGN.md` and `.impeccable/design.json` preserve the Phase 1 extraction. Consult `docs/PHASE2_REVIEW.md` before claiming browser or device coverage.
