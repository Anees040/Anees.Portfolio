import { ParticleEngine, type ParticleSource } from "./particle-engine";

type Message = { type: "init"; canvas: OffscreenCanvas; source: ParticleSource } | { type: "pointer"; x: number; y: number } | { type: "scatter" } | { type: "pause" };
const worker = self as unknown as { postMessage: (data: unknown) => void; requestAnimationFrame: (callback: (time: number) => void) => number; cancelAnimationFrame: (id: number) => void; onmessage: (event: MessageEvent<Message>) => void };
let engine: ParticleEngine | undefined;
let frame = 0;
let last = 0;
function stop() { if (frame) worker.cancelAnimationFrame(frame); frame = 0; }
function tick(time: number) {
  frame = 0;
  if (!engine) return;
  const done = engine.step(last ? time - last : 16.667);
  last = time;
  if (done) worker.postMessage({ type: "settled", metrics: engine.metrics });
  else frame = worker.requestAnimationFrame(tick);
}
function start() { if (!frame) { last = 0; frame = worker.requestAnimationFrame(tick); } }
worker.onmessage = (event: MessageEvent<Message>) => {
  try {
    const message = event.data;
    if (message.type === "init") {
      const context = message.canvas.getContext("2d");
      if (!context || typeof worker.requestAnimationFrame !== "function") throw new Error("Worker canvas unavailable");
      engine = new ParticleEngine(context, message.source);
      engine.step(16.667);
      worker.postMessage({ type: "ready" });
      start();
    } else if (message.type === "pause") stop();
    else if (message.type === "scatter") { engine?.scatter(); start(); }
    else { engine?.pointer(message.x, message.y); start(); }
  } catch { stop(); worker.postMessage({ type: "failed" }); }
};
