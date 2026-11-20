# Actual asset inventory

## Current Hero/About correction — 20 November 2026

The owner confirms local `photo.png` is the only supplied original photograph. `sharp` and PNG-header measurements: **1268×1240 RGB**, 1,936,933 bytes; `public/assets/profile/photo.png` is byte-identical. The earlier 402×421 brief size is not the actual asset. Hero uses this original unchanged, with a CSS ellipse matched by the canvas sampler; maximum image display is 468px. No separate treated photograph or reliable local segmentation tool is registered. No removal model/service was installed or used; the background remains intentionally visible within the ellipse.

`anees-working-illustration.png` and its public copy are **1402×1122 RGBA**, 1,264,472 bytes, with 760,856 fully transparent pixels. Visual inspection confirms one flattened scene containing character, laptop, table, books, plant, mug and notebook. It is the sole static About artwork, without duplicate portrait/captions. None of its head, hands, body, laptop, light or desk objects is independently represented. Earlier originals, contact sheet and derivatives remain preserved; no synthetic frames or identity substitutions are made.

### Separate art required before modular workspace or game work

Approve an original working-scene art direction first. Deliver a common fixed canvas/viewBox, camera, scale and anchors with separately authored transparent layers or original SVG groups: desk/rear workspace; body; rigid head; actual hand/typing poses; laptop/monitor; desk lamp and aligned light layer; at most a few meaningful objects. Supply correct foreground occlusions and neutral rest states. Eyelid/typing frames require separate owner-approved artwork and timing metadata. Do not extract fake layers or warp anatomy from either flattened PNG. A future keyboard-accessible edge-case activity must teach an engineering principle with static feedback; none is implemented here. Phase 3R-5 additionally requires the baseline-aligned game atlas specified below.

The historical inventory below predates these two assets and must not be read as claiming the public photograph is missing.

Fresh `sharp` metadata and decoded alpha inspection: `.qa/phase3r/asset-metadata.json`. Visual contact sheet: `.qa/phase3r/evidence/asset-contact-sheet.png`. All paths below are current local files. Ratios are width/height. Alpha percentages measure decoded pixels, not an artist's intent. RGBA format/hasAlpha alone does not establish clean transparency or motion readiness.

## Portrait and approved character

| Path | Format; dimensions; ratio | Transparency | Purpose / animation suitability / required change |
| --- | --- | --- | --- |
| `public/assets/character/anees-character-primary.png` | PNG; 1024×1536; 0.667 | 0% clear, 0% partial; **opaque** | Approved illustration, not public photograph. Checkerboard is baked into pixels. Preserve original; do not directly sample its background for atomizer. Clean alpha export of same artwork preferred |
| `public/assets/character/anees-character-sheet.png` | PNG; 1536×1024; 1.5 | 31.41% clear, 68.59% partial | One static contact sheet with multiple heads and poses. **Not an animated image or registered sprite atlas**. Different crops/poses are not baseline-aligned; inspect opacity before future exports |
| `public/images/character/desktop/anees-idle.webp` | WebP; 800×1200; 0.667 | 37.30% clear, 1.16% partial | Registered hero idle. Real silhouette sampling and rigid layer translation possible now. Inspect inherited light edge fringe on Graphite; no eyelid/hand movement available |
| `public/images/character/desktop/anees-workspace-idle.webp` | WebP; 480×480; 1 | 57.86% clear, 1.50% partial | Registered standing workspace crop, not full animation. Suitable studio placement/static game preview; not proof of jump/walk states |
| `public/images/character/desktop/anees-workspace-working.webp` | WebP; 480×480; 1 | 44.85% clear, **55.09% partial** | Static working pose includes laptop/mug/plant/desk. Widespread partial alpha can wash artwork out on dark fields. Light-plane storyboard only; cleaner opaque subject + true alpha surround preferred |

`lib/character-assets.ts` registers one hero idle and workspace idle/working as separate static states, revision 2. It supports optional sequences in its type, but none are registered. No separate mobile frame set is registered. A state-capable component does not mean assets contain animation. The private reference photograph, approved public photograph, resume and LinkedIn are **not available public assets**; do not search for or include the private photo in a board.

## Genuine project screenshots

All are opaque, single-frame images, suitable for sliding/revealing as a whole. They are not sprites or recreated application screens. Clean exports are not currently required; show full important content, use aspect-ratio-preserving fit and inspect legibility at actual display width. Crop only as an explicitly supplemental detail, never as a misleading product state.

| Path | Format | Dimensions | Ratio | Purpose |
| --- | --- | --- | --- | --- |
| `public/projects/fitpilot-today.jpg` | JPEG | 1080×2460 | 0.439 | FitPilot Today flagship screen |
| `public/projects/sukoon-home.jpeg` | JPEG | 702×1600 | 0.439 | Sukoon prayer home |
| `public/projects/eduverse-home.png` | PNG | 390×865 | 0.451 | EduVerse student dashboard |
| `public/projects/stories/fitpilot-log.webp` | WebP | 600×1367 | 0.439 | Log workflow |
| `public/projects/stories/fitpilot-plan.webp` | WebP | 600×1367 | 0.439 | Burn-plan workflow |
| `public/projects/stories/fitpilot-programs.webp` | WebP | 600×1367 | 0.439 | Training-program view |
| `public/projects/stories/sukoon-permissions.webp` | WebP | 600×1368 | 0.439 | Device permission boundary |
| `public/projects/stories/sukoon-qibla.webp` | WebP | 600×1368 | 0.439 | Qibla screen |
| `public/projects/stories/sukoon-tracker.webp` | WebP | 600×1368 | 0.439 | Daily prayer tracker |
| `public/projects/stories/eduverse-course.webp` | WebP | 395×869 | 0.455 | Course detail |
| `public/projects/stories/eduverse-teacher.webp` | WebP | 395×869 | 0.455 | Teacher dashboard |
| `public/projects/stories/eduverse-admin.webp` | WebP | 385×865 | 0.445 | Admin dashboard |

Their provenance is in `docs/CONTENT_SOURCES.md`, `.qa/phase3-research/asset-manifest.json` and existing image sidecars/XMP. SportLynk has **no approved real application screenshot**. Keep its current original court/product geometry explicitly conceptual until owner-supplied implementation evidence/screens are approved.

## Logos, vectors, backgrounds and frames

| Asset | Format/dimensions | Alpha / purpose / disposition |
| --- | --- | --- |
| `public/brand/monogram.svg` | SVG 64×64, ratio 1 | Rendered 2.25% clear + 2.25% partial; original MA mark with filled surface. Reuse approved mark; component `monogram.tsx` supplies native vector paths |
| `public/file.svg` | SVG 16×16, ratio 1 | 39.06% clear + 37.11% partial; preserved starter, do not use |
| `public/globe.svg` | SVG 16×16, ratio 1 | 23.44% clear + 67.19% partial; preserved starter, do not use |
| `public/next.svg` | SVG 394×80, ratio 4.925 | 64.18% clear + 5.63% partial; preserved starter, do not use |
| `public/vercel.svg` | SVG 1155×1000, ratio 1.155 | 49.88% clear + 0.26% partial; preserved starter, do not use |
| `public/window.svg` | SVG 16×16, ratio 1 | 54.69% clear + 27.34% partial; preserved starter, do not use |
| Repo-native vectors | Inline SVG/CSS in character-fallback, character-scene, atelier-study, project-artifact, trail-artifact and architecture-explorer | Original court, route, technical diagrams and geometric studio studies; no external bitmap dimensions. Suitable for independently transformed layers/path reveal, not rigged character art |
| Background bitmap set | None registered in public | Construct approved-color geometric planes in code; do not invent stock studio photos |
| Animation frames/sprite sheets | **None ready for production** | No current public raster atlas with frame metadata, no registered blinking/typing/jumping/walking sequence; sheet is a static composition |

This covers all **23 raster/SVG public assets** in the current metadata scan: 17 rasters including the two approved source originals and 15 shipping images, plus six SVGs. Contact-sheet order follows machine metadata. Existing ignored screenshot evidence is QA imagery, not new portfolio artwork; old workspace-snapshot files remain preserved and are not a reuse pool.

## Exact additional artwork requests

1. **Hero clean matte:** same approved 2:3 character, transparent PNG/WebP master at least current 800×1200 derivative size, no baked checker, no pale rim on Graphite, full head/hands retained; owner-approved crop/pixel comparison. Do not alter likeness.
2. **Studio clean pose:** same working pose on fixed 800×800 master (480×480 delivery), opaque subject/interior objects with true transparent surround. If layered motion is authorized, separate desk/laptop, torso/head as rigid art, forearm/hands and background plant/mug; supply shared canvas and origin. No added cartoon objects required.
3. **Optional typing/blink:** same aligned working canvas, 2–3 approved eyelid states and 3–4 hand states with unchanged head/body/camera. A neutral timing manifest and explicit owner approval are required. This is optional and not a blocker for the non-sprite studio.
4. **Game essential frames:** 512×512 shared master, consistent floor baseline, identical character scale/anchor, transparent surround; idle 2–4, anticipation 2, airborne 2–3, landing 2, total target 8–12 modest frames. Metadata records source rectangle, trim/source size, pivot/baseline and duration. Desktop atlas target at most 2048×2048; scaled mobile derivative at most 1024×1024. These are requested art specs, not assets that exist. Separate original geometric token/station art can be code-native.
5. **Thread:** original SVG station layers (model/course/schedule/ledger/court/notebook) and finite path geometry can be authored in Phase 3R-4; no portrait sprites, globe or buildings needed. Preserve all source labels.
6. **SportLynk authenticity:** optional owner-supplied screenshots with permission, current screen names/status and exact implementation context. Without these, the labelled conceptual court remains the correct visual.

The board copies approved **derivatives**, genuine screens and local fonts into its own review folder; it never overwrites originals. No new raster character is generated. Any later commission needs export rights/provenance before registration.
