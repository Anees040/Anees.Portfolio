# Character asset slot

The owner will supply their character artwork. No photograph or generated likeness ships here.

Use a transparent, aligned illustration: waist-up, front or slight three-quarter view, facial appearance matching the owner's reference, professional contemporary clothing. Warm, restrained Copper Atelier rendering. Preserve the actual facial proportions. Avoid copying another portfolio's cartoon or desk.

Recommended export: `desktop/anees-idle.webp`, 1000–1200px high, transparent; `mobile/anees-idle.webp` only when a different crop is needed. The current image slot uses responsive next/image sizing; a separately art-directed mobile crop needs an adapter when supplied. Keep the alpha. Aim for under 200KB per frame. The private photograph must remain outside `public/`.

Register the idle frame's path, dimensions and accurate alt text in `lib/character-assets.ts`. Optional aligned `blink`, `head`, `greeting`, `working` and `expression` frames go in `states`. Every frame must share crop, pose baseline, dimensions and lighting. Only registered poses receive controls. Unavailable states resolve to idle; there is no automatic facial deformation or claim of a rig.

`CharacterAnimation` swaps actual supplied poses on explicit input; it does not synthesize in-between frames. Reduced motion retains instant pose selection. The scene moves separate geometric layers by a few pixels on desktop, never rotates or warps the face. A layered or rigged asset needs a dedicated adapter and visual verification after delivery.
