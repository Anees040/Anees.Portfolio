# Licence and attribution boundaries

## Phase 3R-2 dependency decision — 19 November 2026

The owner explicitly approved GSAP for this personal website based on supplied licensing research. Only `gsap@3.15.1` and `@gsap/react@2.1.2` were added, with exact npm versions and integrity hashes in the existing lockfile. ScrollTrigger is included in the GSAP package, not a third dependency.

Selected npm archives were inspected in memory before installation, including their actual manifests, READMEs and source notices. GSAP declares `Standard 'no charge' license: https://gsap.com/standard-license.`. **The actual React package is not MIT:** it declares `SEE LICENSE AT https://gsap.com/standard-license`; its bundled source notice says Copyright 2008–2025 GreenSock, all rights reserved, subject to the Standard Licence or a Club GSAP member agreement. GSAP/ScrollTrigger 3.15.1 notices say Copyright 2008–2026 GreenSock, all rights reserved. Preserve upstream notices in installed/bundled vendor code.

`@gsap/react` peers are `gsap: ^3.12.5` and `react: >=17`, which include selected GSAP 3.15.1 and existing React 19.3.0. GSAP is framework-agnostic, with no conflicting Next peer requirement. Installed Next 16.4.6 guides were consulted; production builds verify the scoped browser registration and server/client boundary against this actual stack.

Official sources inspected: https://registry.npmjs.org/gsap/3.15.1, https://registry.npmjs.org/@gsap%2freact/2.1.2, https://github.com/greensock/GSAP, https://github.com/greensock/react, and https://webflow.com/blog/gsap-becomes-free. The package README and Webflow announcement support no-charge website/commercial use. They are **not substitutes for the complete legal terms**.

Closeout verification on 20 November 2026: https://gsap.com/standard-license redirects to https://gsap.com/community/standard-license/ and returned HTTP 200 with readable Standard Licence terms. The current definition of Permitted Uses is implementation and/or use on websites, web applications and digital interfaces. The grant is non-exclusive and worldwide, subject to the Standard Licence's terms and restrictions. Its commercial-use FAQ explicitly confirms that commercial projects, including the previously members-only plugins, are covered at no charge. This personal portfolio is a permitted website implementation. Both GSAP and `@gsap/react` point to this same Standard Licence; neither is MIT. Preserve upstream notices and do not treat permitted implementation as an unrestricted redistribution grant. The page lists an effective date of 30 April 2025 and a last-modified date of 30 May 2025.

The earlier verification-interstitial responses were an access limitation, not legal evidence; that independent page-access limit is now resolved. No extra dependency or licence report was added.

The research evidence below remains historical and is not rewritten to erase previous decisions.

18 November 2026. Engineering guidance, not legal advice. Public availability is not a redistribution licence. Every reference is kept in ignored local research storage, not a shipping source or artwork directory. No Elliott code, character, sound, sprite, globe, building, icon or screenshot is included in the board or application.

## Inspected grants

| Material | Actual evidence | Safe use in this assignment / incorporation gate |
| --- | --- | --- |
| image-atomizer-js at 91e4d78 | JS header `@license MIT`; article says MIT; API licence null; tree has README + JS only, no complete licence grant/copyright notice | Study algorithms; independently implement. Before copying, obtain authoritative complete MIT notice/grant and preserve it plus author attribution |
| Complete portfolio at 5497ef0 | package.json explicitly `UNLICENSED`; no repository-wide licence file found; API licence null | Technical/composition study only. No copied implementation, styles, DOM structure, SVG art, fonts bundled by Elliott, images or sprite assets |
| Level Up at 5228bd8 | No licence grant/NOTICE file in inspected tree; API licence null; public README is not a grant | Study finite-state/play concept only. Source, idle/jump atlases, platform artwork and sounds need permission or an explicit valid grant before reuse |
| Ask Elliott AI at df9a683 | private package flag, no licence field or licence grant in tree; API licence null; article uses the phrase open source | Study retrieval/SSE ideas only. Do not copy its prompts, server/frontend code, career documents or deployment integration |
| Elliott asset metadata/SVGs | Atlas metadata names TexturePacker and gives dimensions; SVG names identify custom employers/globe artwork; no separate asset grant found | Metadata proves geometry/frame count, not ownership permission. All are study-only |
| Blog articles/live homepage | Published prose and examples, no separately verified grant to redistribute the site or illustrations | Link and summarize with source attribution; no wholesale article or image republication |

The standalone MIT header does not override the main portfolio's UNLICENSED status. A later similarly named file is not automatically a licensed upgrade of the standalone library. No transitive-dependency licence grants rights to a reference author's own app.

## Proposed stack

- Existing Motion, Next, React, Tailwind and Lucide remain the installed project stack; preserve their existing notices and check the installed versions/lockfile during any dependency change. This assignment adds none.
- GSAP/ScrollTrigger and @gsap/react are proposed **conditionally** for Phase 3R-2. Official React/ScrollTrigger/matchMedia documentation snapshots are in the research folder. Repository trees for greensock/GSAP and greensock/react were checked; neither provided a standalone licence file in the examined tree. The attempted standard-licence page returned a verification interstitial, **not readable legal terms**. Failed LICENSE/ LICENSE.md requests are recorded and must not be treated as grants.
- Before installing, coordinator must inspect the exact package's licence and readable official current Standard Licence, verify personal-portfolio use and any restrictions, record version/URL/full notice, and obtain owner dependency approval. Do not call GSAP MIT, assume historical pricing, or treat marketing availability as legal clearance. If the terms cannot be verified/accepted, implement the same scene contract with existing Motion/native sticky and update the architecture decision before coding.
- No Lenis is recommended. No source from any unlicensed reference is needed to realize the proposal.

## Anees assets

The owner has approved the primary illustration, character sheet and registered derivatives for this portfolio. Owner approval is the current project use authority; it does not establish unlimited sublicensing. Originals remain preserved. The private reference photograph remains unpublished and is absent from the board. All project screenshots are the already approved local source-derived assets with the existing acquisition/provenance records; retain those records and product colors. Numbers pictured in them are application content, not Anees's impact metrics.

`public/brand/monogram.svg` and repo-native diagrams are original project artwork. The preserved starter SVGs and old Aurora/button sources remain unused. No stock art or generated replacement character is proposed. Font files copied into the **local** board originate in this project's self-hosted build; existing Google Font family licences remain applicable and should accompany any later redistribution of the board. The board is an internal review artifact, not an authorization to publish.

## Reuse matrix

**Safe now:** existing owner-approved local assets/content; generic algorithm concepts; independently authored particle/scroll/state-machine code in a later authorized phase; links and original research summaries. **Study only:** all Elliott website code/art, game code/art/sounds, AI code/documents and article illustrations. **Permission/verification needed:** literal standalone Atomizer code and its complete MIT notice; any reference artwork; exact GSAP terms; newly commissioned poses and their usage/export rights; owner-confirmed first-person project contribution/chronology.

If any third-party dependency is lawfully incorporated later, add the exact attribution, licence text, version and source URL to `THIRD_PARTY_NOTICES.md`, retain bundled notices and provenance, and identify modifications where its terms require them. Attribution alone cannot cure a missing grant.
