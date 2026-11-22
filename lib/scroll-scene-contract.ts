export type SceneMode = "pending" | "static" | "pinned" | "scrolling" | "failed";

export interface SceneMeasurements {
  viewportWidth: number;
  viewportHeight: number;
  headerHeight: number;
  clearance: number;
  availableHeight: number;
  rootTextSize: number;
  stageWidth: number;
  stageHeight: number;
  contentWidth: number;
  contentHeight: number;
  navigationHeight: number;
  ctaHeight: number;
  imageHeight: number;
  imageWidth: number;
  finePointer: boolean;
  touch: boolean;
  reducedMotion: boolean;
}

export interface SceneFitRequirements {
  minimumWidth?: number;
  minimumHeightRem?: number;
  minimumStageWidthRem?: number;
}

export type SceneProperties = Partial<Record<"x" | "y" | "xPercent" | "yPercent" | "scale" | "rotation" | "opacity", number>> & { clipPath?: string };

export interface SceneTimeline {
  fromTo(target: HTMLElement, from: SceneProperties, to: SceneProperties, start: number, duration: number): void;
}

export interface ScenePlayback {
  progress?(absoluteProgress: number): void;
  visibility?(visible: boolean): void;
  settle?(): void;
  dispose?(): void;
}

export interface ScrollScene {
  id: string;
  root: HTMLElement;
  stage: HTMLElement;
  scroll?: "flow" | "adaptive";
  content?: readonly HTMLElement[];
  navigation?: HTMLElement;
  cta?: HTMLElement;
  ready?(signal: AbortSignal): Promise<unknown>;
  fits?(measurements: Readonly<SceneMeasurements>): boolean;
  distance(measurements: Readonly<SceneMeasurements>): number;
  anchors: readonly { id: string; progress: number }[];
  setup(context: { scope: HTMLElement; measurements: Readonly<SceneMeasurements>; timeline: SceneTimeline; pinned: boolean }): ScenePlayback | void;
  staticFallback(): void;
}

export interface SceneSnapshot {
  id: string;
  mode: SceneMode;
  progress: number;
  visible: boolean;
  triggers: number;
  readinessFailures: number;
}

export interface ScrollSceneCoordinator {
  register(scene: ScrollScene): () => void;
  requestRefresh(reason: string): void;
  inspect(): { scenes: readonly SceneSnapshot[]; refreshes: number; reasons: readonly string[] };
}
