# Third-party research and notices

## Phase 3R-2 incorporated dependencies — 19 November 2026

- GSAP core and ScrollTrigger: `gsap@3.15.1`, https://www.npmjs.com/package/gsap and https://github.com/greensock/GSAP. Package licence: `Standard 'no charge' license: https://gsap.com/standard-license.` Source notice: Copyright 2008–2026 GreenSock. All rights reserved. Subject to the terms at https://gsap.com/standard-license. Author: Jack Doyle, jack@greensock.com.
- React integration: `@gsap/react@2.1.2`, https://www.npmjs.com/package/@gsap/react and https://github.com/greensock/react. Actual package licence: `SEE LICENSE AT https://gsap.com/standard-license`. Bundled source notice: Copyright 2008–2025 GreenSock. All rights reserved. Subject to the terms at https://gsap.com/standard-license or, for Club GSAP members, the agreement issued with that membership. Author: Jack Doyle, jack@greensock.com.
- Both are used unmodified through their public APIs. Upstream copyright/licence notices remain in vendor packages; neither dependency is labelled MIT. No Elliott source or artwork is incorporated. Existing Motion and all other dependencies remain unchanged.
- The complete current Standard Licence page was not readable from this environment; its verification interstitial is not legal text. Exact package metadata/source notices and Webflow's official commercial-use announcement were verified. The owner explicitly instructed local website incorporation based on their licensing research. See `phase3r/LICENCE_AND_ATTRIBUTION.md` for this unresolved independent full-terms verification limit.

Earlier records below describe prior phases, not the current dependency set.

Continuation check, 17 November 2026: the same revision-pinned reference/library source was re-fetched. No external source or assets were added. The independently implemented particle engine therefore requires no incorporated Image Atomizer code notice. The research/license boundaries below remain unchanged.

Reviewed on 2026-11-16. No source code, illustration, branded asset, biography, game sprite or AI backend was copied from Bryan Elliott's portfolio. No new third-party dependency was installed for Phase 3.

## Reference portfolio

- Website: https://elliottprogrammer.com/
- Repository: https://github.com/elliottprogrammer/elliottprogrammer.com
- Reviewed revision: `5497ef04a6470c796fd006b3f01b631fad261c41`.
- Its package manifest says `UNLICENSED`. It was inspected for interaction principles and architecture only. It does not grant a license to redistribute its portfolio code or artwork.
- The workshop, Copper Atelier geometry, scroll path and Concurrency Lab are original interpretations. No coffee-search puzzle, globe/company scene, walking sprite, platform-jumping game, career claim or assistant implementation was reused.

## Image Atomizer

- Author: Bryan Elliott / [elliottprogrammer](https://github.com/elliottprogrammer).
- Repository: https://github.com/elliottprogrammer/image-atomizer-js
- Verified revision: `91e4d78c11eac397ab72457378bf3006d9084d60`, default branch `trunk`.
- The correct source filename is `image-atomizer.js`; its header declares `@license MIT` and names the author. The reviewed tree contains no standalone `LICENSE` file. The obsolete `imageAtomizer.js` repository link on the reference site returns 404.
- Copper Atelier **does not incorporate or adapt that library's source**. Its typed-array simulation, packed-pixel renderer, worker protocol and React lifecycle adapter are independently implemented in `lib/particle-engine.ts`, `lib/particle-worker.ts` and `components/portfolio/image-atomizer.tsx`. No third-party source grant is relied on for those files.
- If library source is incorporated later, re-verify the applicable full license and preserve its copyright and permission notice before distributing it.

The accompanying particle/performance articles informed general engineering choices: buffer reuse, squared-distance tests, contiguous arrays, optional off-main-thread work and not treating a reciprocal compute-time number as visible FPS. No published benchmark is asserted as this portfolio's performance.

## Project screenshots

Screenshots are from Anees's own FitPilot, Sukoon and EduVerse repositories, explicitly requested for use in this portfolio. The nine new gallery assets are resized/compressed originals, not generated UI. Their XMP metadata records origin and acquisition date. Exact origins, dimensions and public revisions are in `CONTENT_SOURCES.md` and the local source-verification artifact.

## Existing dependencies

Next.js, React, Motion, Tailwind CSS, Lucide and the existing development/tooling dependencies retain their upstream license notices in the installed packages. The approved Google Fonts continue through `next/font`. This report does not replace those licenses. No Motion+ component/source, paid package, GSAP, Lenis, Three.js or external game engine was introduced.
