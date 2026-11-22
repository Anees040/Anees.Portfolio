import { ParticleEngine, type ParticleMetrics, type ParticleSource } from "./particle-engine";

export type ParticleMessage =
  | { type: "init"; canvas: OffscreenCanvas; source: ParticleSource; forming: boolean; generation: number }
  | { type: "play" | "form" | "scatter" | "pause"; sequence: number }
  | { type: "pointer"; x: number; y: number; sequence: number };
export type ParticleReply = { type: "ready" | "progress" | "settled" | "paused" | "failed"; generation: number; sequence: number; metrics?: ParticleMetrics };
const worker = self as unknown as {
  postMessage: (data: ParticleReply) => void;
  requestAnimationFrame: (callback: (time: number) => void) => number;
  cancelAnimationFrame: (id: number) => void;
  onmessage: (event: MessageEvent<ParticleMessage>) => void;
};
let engine: ParticleEngine | undefined;
let frame = 0, last = 0, sequence = 0, generation = 0;
function report(type: ParticleReply["type"]) { worker.postMessage({ type, generation, sequence, metrics: engine?.snapshot() }); }
function stop() { if (frame) worker.cancelAnimationFrame(frame); frame = 0; last = 0; }
function tick(time: number) {
  frame = 0;
  if (!engine) return;
  try {
    const done = engine.step(last ? time - last : 16.667); last = time;
    if (done) report("settled");
    else { if (engine.metrics.frames % 6 === 0) report("progress"); frame = worker.requestAnimationFrame(tick); }
  } catch { stop(); report("failed"); }
}
function start() { if (!frame) { last = 0; frame = worker.requestAnimationFrame(tick); } }
worker.onmessage = (event) => {
  try {
    const message = event.data;
    if (message.type === "init") {
      stop(); generation = message.generation; sequence = 0;
      const context = message.canvas.getContext("2d", { willReadFrequently: true });
      if (!context || typeof worker.requestAnimationFrame !== "function") throw new Error("Worker canvas unavailable");
      engine = new ParticleEngine(context, message.source);
      if (message.forming) engine.form();
      engine.draw(); report("ready");
    } else {
      sequence = message.sequence;
      if (message.type === "pause") { stop(); engine?.assemble(); report("paused"); }
      else {
        if (message.type === "form") { engine?.form(); engine?.draw(); report("progress"); }
        if (message.type === "scatter") engine?.scatter();
        if (message.type === "pointer") engine?.pointer(message.x, message.y);
        start();
      }
    }
  } catch { stop(); report("failed"); }
};
