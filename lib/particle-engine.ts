export type ParticleMetrics = { frames: number; particles: number; updateMs: number; drawMs: number; maxFrameMs: number; maxDisplacement: number; meanDisplacement: number; peakDisplacement: number; reassembled: boolean };
export type ParticleSource = { width: number; height: number; pixels: Uint8ClampedArray; gap: number };

export class ParticleEngine {
  private x: Float32Array;
  private y: Float32Array;
  private tx: Float32Array;
  private ty: Float32Array;
  private vx: Float32Array;
  private vy: Float32Array;
  private colors: Uint32Array;
  private stamps: Uint32Array;
  private buffer: ImageData;
  private packed: Uint32Array;
  private count = 0;
  private pointerX = -1000;
  private pointerY = -1000;
  private quiet = 0;
  readonly metrics: ParticleMetrics;

  constructor(private context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, private source: ParticleSource) {
    const { width, height, pixels, gap } = source;
    const max = Math.ceil(width / gap) * Math.ceil(height / gap);
    this.x = new Float32Array(max); this.y = new Float32Array(max);
    this.tx = new Float32Array(max); this.ty = new Float32Array(max);
    this.vx = new Float32Array(max); this.vy = new Float32Array(max);
    this.colors = new Uint32Array(max);
    this.stamps = new Uint32Array(max * gap * gap);
    this.buffer = context.createImageData(width, height);
    this.packed = new Uint32Array(this.buffer.data.buffer);
    const sourcePacked = new Uint32Array(pixels.buffer, pixels.byteOffset, pixels.byteLength / 4);
    for (let row = 0; row < height; row += gap) for (let column = 0; column < width; column += gap) {
      const offset = row * width + column;
      if (pixels[offset * 4 + 3] < 36) continue;
      const index = this.count++;
      this.tx[index] = column; this.ty[index] = row; this.colors[index] = sourcePacked[offset];
      const center = (gap - 1) / 2;
      for (let localRow = 0; localRow < gap; localRow++) for (let localColumn = 0; localColumn < gap; localColumn++) {
        const coverage = Math.min(1, Math.max(0, gap * 0.47 + 0.5 - Math.hypot(localColumn - center, localRow - center)));
        const alpha = Math.round((this.colors[index] >>> 24) * coverage);
        this.stamps[index * gap * gap + localRow * gap + localColumn] = (this.colors[index] & 0x00ffffff) | (alpha << 24);
      }
    }
    this.metrics = { frames: 0, particles: this.count, updateMs: 0, drawMs: 0, maxFrameMs: 0, maxDisplacement: 0, meanDisplacement: 0, peakDisplacement: 0, reassembled: true };
    this.x.set(this.tx); this.y.set(this.ty);
  }

  scatter() {
    this.pointerX = -1000; this.pointerY = -1000; this.quiet = 0;
    for (let index = 0; index < this.count; index++) {
      this.vx[index] = (Math.random() - 0.5) * 12;
      this.vy[index] = (Math.random() - 0.5) * 12;
    }
  }

  pointer(horizontal: number, vertical: number) { this.pointerX = horizontal; this.pointerY = vertical; this.quiet = 0; }

  step(delta: number) {
    const begin = performance.now();
    const stepSize = Math.min(1.5, Math.max(0.25, delta / 16.667));
    const damping = Math.pow(0.74, stepSize);
    const radius = this.source.width * 0.15;
    const radius2 = radius * radius;
    let maxSpeed = 0, maxDisplacement = 0, totalDisplacement = 0;
    const interacting = this.pointerX >= 0 && this.pointerY >= 0;
    for (let index = 0; index < this.count; index++) {
      let accelerationX = (this.tx[index] - this.x[index]) * 0.042;
      let accelerationY = (this.ty[index] - this.y[index]) * 0.042;
      const distanceX = this.x[index] - this.pointerX, distanceY = this.y[index] - this.pointerY;
      const distance2 = distanceX * distanceX + distanceY * distanceY;
      if (interacting && distance2 < radius2) {
        const distance = Math.sqrt(Math.max(0.01, distance2));
        const force = (1 - distance / radius) * 2.5;
        accelerationX += (distance2 < 0.01 ? Math.cos(index) : distanceX / distance) * force;
        accelerationY += (distance2 < 0.01 ? Math.sin(index) : distanceY / distance) * force;
      }
      this.vx[index] = (this.vx[index] + accelerationX * stepSize) * damping;
      this.vy[index] = (this.vy[index] + accelerationY * stepSize) * damping;
      this.x[index] += this.vx[index] * stepSize; this.y[index] += this.vy[index] * stepSize;
      maxSpeed = Math.max(maxSpeed, Math.abs(this.vx[index]), Math.abs(this.vy[index]));
      const displacement = Math.hypot(this.x[index] - this.tx[index], this.y[index] - this.ty[index]);
      maxDisplacement = Math.max(maxDisplacement, displacement); totalDisplacement += displacement;
    }
    this.quiet = maxSpeed < 0.035 && (interacting || maxDisplacement < 0.25) ? this.quiet + 1 : 0;
    const settled = this.quiet >= 10;
    if (settled && !interacting) {
      this.x.set(this.tx); this.y.set(this.ty); this.vx.fill(0); this.vy.fill(0);
      maxDisplacement = 0; totalDisplacement = 0;
    }
    const drawStart = performance.now();
    this.packed.fill(0);
    const { width, height, gap } = this.source;
    for (let index = 0; index < this.count; index++) {
      const column = Math.round(this.x[index]), row = Math.round(this.y[index]);
      for (let localRow = 0; localRow < gap; localRow++) {
        if (row + localRow < 0 || row + localRow >= height) continue;
        for (let localColumn = 0; localColumn < gap; localColumn++) {
          if (column + localColumn < 0 || column + localColumn >= width) continue;
          this.packed[(row + localRow) * width + column + localColumn] = this.stamps[index * gap * gap + localRow * gap + localColumn];
        }
      }
    }
    this.context.putImageData(this.buffer, 0, 0);
    const end = performance.now();
    this.metrics.frames++;
    this.metrics.updateMs += drawStart - begin;
    this.metrics.drawMs += end - drawStart;
    this.metrics.maxFrameMs = Math.max(this.metrics.maxFrameMs, end - begin);
    this.metrics.maxDisplacement = maxDisplacement;
    this.metrics.meanDisplacement = totalDisplacement / Math.max(1, this.count);
    this.metrics.peakDisplacement = Math.max(this.metrics.peakDisplacement, maxDisplacement);
    this.metrics.reassembled = !interacting && maxDisplacement === 0;
    return settled;
  }
}
