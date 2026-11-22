export type CharacterState = "idle" | "blink" | "head" | "greeting" | "working" | "expression";
export type CharacterFrame = {
  src: string;
  width: number;
  height: number;
  alt: string;
  unoptimized?: boolean;
  revision?: string;
  mobile?: { src: string; width: number; height: number };
};
export type CharacterSequence = {
  frames: readonly [CharacterFrame, ...CharacterFrame[]];
  frameDurationMs: number;
  returnToIdle?: boolean;
};
export type CharacterAssets = {
  idle: CharacterFrame;
  states?: Partial<Record<Exclude<CharacterState, "idle">, CharacterFrame | CharacterSequence>>;
};

// Owner-approved artwork. Originals remain untouched in public/assets/character.
// Set a scene's registration to null to use the architectural fallback.
export const characterAssets: CharacterAssets | null = {
  idle: {
    src: "/images/character/desktop/anees-idle.webp", width: 800, height: 1200, revision: "2",
    alt: "Illustration of Muhammad Anees wearing a black hoodie, with his hands in his pockets.",
  },
};

export const workspaceCharacterAssets: CharacterAssets | null = {
  idle: {
    src: "/images/character/desktop/anees-workspace-idle.webp", width: 480, height: 480, revision: "2",
    alt: "Illustration of Anees standing in a black hoodie.",
  },
  states: {
    working: {
      src: "/images/character/desktop/anees-workspace-working.webp", width: 480, height: 480, revision: "2",
      alt: "Illustration of Anees working at a laptop.",
    },
  },
};

export const aboutCharacterAssets: CharacterAssets | null = {
  idle: {
    src: "/assets/character/anees-working-illustration.png", width: 1402, height: 1122,
    alt: "Illustration of Muhammad Anees in a black hoodie, working at a laptop.",
    unoptimized: true,
  },
};

export function characterFrames(assets: CharacterAssets, state: CharacterState): readonly CharacterFrame[] {
  const value = state === "idle" ? assets.idle : assets.states?.[state] ?? assets.idle;
  return "frames" in value ? value.frames : [value];
}

export function resolveCharacterFrame(assets: CharacterAssets, state: CharacterState, index = 0) {
  return characterFrames(assets, state)[index] ?? assets.idle;
}

export function characterAssetErrors(assets: CharacterAssets): string[] {
  const errors: string[] = [];
  for (const [state, value] of Object.entries({ idle: assets.idle, ...assets.states })) {
    if ("frames" in value && (!value.frames.length || value.frames.length > 12 || !Number.isFinite(value.frameDurationMs) || value.frameDurationMs < 80 || value.frameDurationMs * value.frames.length > 4000)) errors.push(`${state}: use 1–12 frames, at least 80ms each, at most 4 seconds total`);
    const frames = "frames" in value ? value.frames : [value];
    for (const frame of frames) {
      if (!/^\/(images|assets)\/character\/.+\.(png|webp)$/i.test(frame.src) || !frame.alt.trim()) errors.push(`${state}: expected local production PNG/WebP and alt text`);
      if (frame.width !== assets.idle.width || frame.height !== assets.idle.height || !Number.isInteger(frame.width) || !Number.isInteger(frame.height) || frame.width <= 0 || frame.height <= 0) errors.push(`${state}: desktop canvas must match idle`);
      if (Boolean(frame.mobile) !== Boolean(assets.idle.mobile) || (frame.mobile && (frame.mobile.width !== assets.idle.mobile?.width || frame.mobile.height !== assets.idle.mobile?.height))) errors.push(`${state}: mobile canvas must match mobile idle`);
      if (frame.mobile && (!/^\/images\/character\/.+\.(png|webp)$/i.test(frame.mobile.src) || !Number.isInteger(frame.mobile.width) || !Number.isInteger(frame.mobile.height) || frame.mobile.width <= 0 || frame.mobile.height <= 0)) errors.push(`${state}: expected a local mobile PNG/WebP with positive dimensions`);
    }
  }
  return errors;
}
