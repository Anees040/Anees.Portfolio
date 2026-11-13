export type CharacterState = "idle" | "blink" | "head" | "greeting" | "working" | "expression";
export type CharacterFrame = {
  src: string;
  width: number;
  height: number;
  alt: string;
};
export type CharacterAssets = {
  idle: CharacterFrame;
  states?: Partial<Record<Exclude<CharacterState, "idle">, CharacterFrame>>;
};

// Populate only with owner-supplied, approved illustration frames. The private photo is not an asset.
export const characterAssets: CharacterAssets | null = null;

export function resolveCharacterFrame(assets: CharacterAssets, state: CharacterState) {
  return state === "idle" ? assets.idle : assets.states?.[state] ?? assets.idle;
}
