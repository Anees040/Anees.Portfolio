# Character asset guide

The owner approved `public/assets/character/anees-character-primary.png` and `anees-character-sheet.png` in this implementation session. Both originals are preserved unchanged. The private reference photograph is not used by the site.

## Integrated artwork

| File relative to this directory | Dimensions | Use |
| --- | --- | --- |
| `desktop/anees-idle.webp` | 800 × 1200 | Hero portrait, derived from the approved primary image |
| `desktop/anees-workspace-idle.webp` | 480 × 480 | Same standing portrait on a transparent square canvas |
| `desktop/anees-workspace-working.webp` | 480 × 480 | Whole seated/laptop pose cropped from the approved sheet |

The primary PNG contained a **baked checkerboard**, not an alpha channel. Its derivative removes neutral background regions, including the enclosed gaps between sleeves and torso. No facial pixels were generated or warped. The sheet already contained alpha; the seated scene was isolated using its existing alpha, removing disconnected neighboring pose fragments, then proportionally fitted to the workspace canvas. Fine hair-edge cleanup would benefit from the original transparent export. When replacing an asset at the same path, increment its `revision` field to refresh Next's optimized image cache.

`lib/character-assets.ts` has independent `characterAssets` (hero) and `workspaceCharacterAssets` registrations. Set either to `null` to use the architectural fallback. Missing states resolve to idle; invalid registrations or a failed image show the fallback. An image failure before hydration is checked after mounting too. When incrementing `revision`, update the exact character-image search allowlist in `next.config.ts` too; this Next version blocks unlisted image query strings.

## Available behavior

- Hero: the approved portrait remains the accessible/static representation. Phase 3 optionally assembles its real pixels on Canvas 2D and responds to pointer proximity, with keyboard replay; mobile, touch, reduced-motion, forced-colors and no-JS retain the image. Scene-level depth never distorts the face.
- Workspace: **Rest / At work** controls select supplied whole-pose illustrations. Opening a note selects working; closing it returns to idle. These are pose changes, not interpolated typing or a facial rig.
- Both scenes accept `idle`, `blink`, `head`, `greeting`, `working`, and `expression`. Only registered states have controls.
- Optional bounded sequences accept 1–12 actual frames, at least 80ms per frame and at most four seconds total. They play once, then return to idle unless `returnToIdle: false` is supplied. No ambient blink loop.
- Reduced motion keeps explicit pose selection immediate and disables sequences. Hidden/offscreen scenes cancel timers and settle to idle.

## Additional artwork to supply

No further artwork is required for the integrated static portrait and whole workspace pose. **Independent blink, head movement, greeting, alternate facial expression and animated typing remain awaiting aligned exports.** The sheet's differently posed portraits are not treated as aligned facial animation frames.

Use transparent **WebP or PNG**, sRGB, with real alpha (no checkerboard or background baked into pixels). Keep the current **800 × 1200** hero canvas or **480 × 480** workspace canvas across every state in that scene. Keep crop, head scale, anchor, baseline, proportions, lighting and camera consistent within each sequence. Aim for under 200KB per frame. Export only owner-approved original artwork.

Single hero pose filenames:

```text
desktop/anees-idle.webp
desktop/anees-blink.webp
desktop/anees-head.webp
desktop/anees-greeting.webp
desktop/anees-working.webp
desktop/anees-expression.webp
```

For real sequences use `desktop/anees-blink-01.webp`, `-02.webp`, etc.; use the same convention for greeting or typing. Workspace sequence files use `desktop/anees-workspace-working-01.webp`, etc.

An optional art-directed mobile set uses those filenames under `mobile/`. Recommended mobile canvas: **600 × 800**, consistently aligned within the set. Supply every registered state's mobile equivalent if the crop differs. `CharacterPortrait` selects it using a native `<picture>` source at 767px and below. Without that set, desktop artwork scales responsively; mobile files are not mandatory.

## Register assets

Add files and actual dimensions/accurate alt text to the relevant registration:

```ts
idle: {
  src: "/images/character/desktop/anees-idle.webp",
  width: 800, height: 1200,
  alt: "Accurate description of the approved illustration.",
  // Include only when every state has a matching mobile export:
  mobile: { src: "/images/character/mobile/anees-idle.webp", width: 600, height: 800 },
},
states: {
  blink: {
    frames: [/* actual aligned CharacterFrame objects */],
    frameDurationMs: 100,
    returnToIdle: true,
  },
},
```

Scene input: `document.dispatchEvent(new CustomEvent("atelier:character", { detail: { scene: "workspace", state: "working" } }))`. This event carries visual intent only; native notes, lamp and project links work without it or JavaScript. New assets need a build, image-load checks, desktop/mobile visual inspection and reduced-motion verification. Layered rigs, skeletal models and GIF/video decoders are outside this frame adapter.
