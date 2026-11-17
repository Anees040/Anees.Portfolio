export type ParticleMetrics = { frames: number; particles: number; updateMs: number; drawMs: number; maxFrameMs: number };
export type ParticleSource = { width: number; height: number; pixels: Uint8ClampedArray; gap: number };

export class ParticleEngine {
  private x: Float32Array;
  private y: Float32Array;
  private tx: Float32Array;
  private ty: Float32Array;
  private vx: Float32Array;
  private vy: Float32Array;
  private colors: Uint32Array;
  private buffer: ImageData;
  private packed: Uint32Array;
  private count = 0;
  private pointerX = -1000;
  private pointerY = -1000;
  private quiet = 0;
  private elapsed = 0;
  readonly metrics: ParticleMetrics;

  constructor(private context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, private source: ParticleSource) {
    const { width, height, pixels, gap } = source;
    const max = Math.ceil(width / gap) * Math.ceil(height / gap);
    this.x = new Float32Array(max); this.y = new Float32Array(max);
    this.tx = new Float32Array(max); this.ty = new Float32Array(max);
    this.vx = new Float32Array(max); this.vy = new Float32Array(max);
    this.colors = new Uint32Array(max);
    this.buffer = context.createImageData(width, height);
    this.packed = new Uint32Array(this.buffer.data.buffer);
    const sourcePacked = new Uint32Array(pixels.buffer, pixels.byteOffset, pixels.byteLength / 4);
    for (let y = 0; y < height; y += gap) for (let x = 0; x < width; x += gap) {
      const offset = y * width + x;
      if (pixels[offset * 4 + 3] < 36) continue;
      const i = this.count++;
      this.tx[i] = x; this.ty[i] = y; this.colors[i] = sourcePacked[offset];
    }
    this.metrics = { frames: 0, particles: this.count, updateMs: 0, drawMs: 0, maxFrameMs: 0 };
    this.scatter();
  }

  scatter() {
    this.quiet = 0; this.elapsed = 0;
    for (let i = 0; i < this.count; i++) {
      this.x[i] = this.tx[i] + (Math.random() - 0.5) * this.source.width * 1.3;
      this.y[i] = this.ty[i] + (Math.random() - 0.5) * this.source.height * 0.8;
      this.vx[i] = 0; this.vy[i] = 0;
    }
  }

  pointer(x: number, y: number) { this.pointerX = x; this.pointerY = y; this.quiet = 0; this.elapsed = 0; }

  step(delta: number) {
    const begin = performance.now();
    const dt = Math.min(2, Math.max(0.4, delta / 16.667));
    const damping = Math.pow(0.77, dt);
    const radius = this.source.width * 0.15;
    const radius2 = radius * radius;
    let energy = 0;
    this.elapsed += delta;
    for (let i = 0; i < this.count; i++) {
      let ax = (this.tx[i] - this.x[i]) * 0.034;
      let ay = (this.ty[i] - this.y[i]) * 0.034;
      const dx = this.x[i] - this.pointerX, dy = this.y[i] - this.pointerY;
      const distance2 = dx * dx + dy * dy;
      if (distance2 < radius2 && distance2 > 0.1) {
        const force = (1 - distance2 / radius2) * 2.4 / Math.sqrt(distance2);
        ax += dx * force; ay += dy * force;
      }
      this.vx[i] = (this.vx[i] + ax * dt) * damping;
      this.vy[i] = (this.vy[i] + ay * dt) * damping;
      this.x[i] += this.vx[i] * dt; this.y[i] += this.vy[i] * dt;
      energy += Math.abs(this.vx[i]) + Math.abs(this.vy[i]);
    }
    const drawStart = performance.now();
    this.packed.fill(0);
    const { width, height, gap } = this.source;
    for (let i = 0; i < this.count; i++) {
      const x = Math.round(this.x[i]), y = Math.round(this.y[i]);
      if (x < 0 || y < 0 || x >= width - gap || y >= height - gap) continue;
      const color = this.colors[i];
      for (let yy = 0; yy < gap; yy++) {
        const offset = (y + yy) * width + x;
        for (let xx = 0; xx < gap; xx++) this.packed[offset + xx] = color;
      }
    }
    this.context.putImageData(this.buffer, 0, 0);
    const end = performance.now();
    this.metrics.frames++;
    this.metrics.updateMs += drawStart - begin;
    this.metrics.drawMs += end - drawStart;
    this.metrics.maxFrameMs = Math.max(this.metrics.maxFrameMs, end - begin);
    this.quiet = energy / Math.max(1, this.count) < 0.03 ? this.quiet + 1 : 0;
    return this.quiet > 7 || this.elapsed > 4500;
  }
}
