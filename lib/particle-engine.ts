export type ParticleMetrics = {
  frames: number; particles: number; updateMs: number; drawMs: number; maxFrameMs: number;
  maxDisplacement: number; meanDisplacement: number; peakDisplacement: number; reassembled: boolean;
  settled: boolean; forming: boolean; formationMs: number; initialMeanDisplacement: number;
  intervalCount: number; intervalTotalMs: number; intervalMaxMs: number; intervalBuckets: number[]; bufferBytes: number; intervalP95Ms: number;
};
export type ParticleSource = { width: number; height: number; pixels: Uint8ClampedArray; gap: number; portraitWidth?: number; footprint?: number; formationDuration?: number };
const littleEndian = new Uint8Array(new Uint32Array([0x01020304]).buffer)[0] === 4;

export class ParticleEngine {
  private x: Float32Array;
  private y: Float32Array;
  private tx: Float32Array;
  private ty: Float32Array;
  private vx: Float32Array;
  private vy: Float32Array;
  private colors: Uint32Array;
  private stamps: Uint32Array;
  private tiles: Uint32Array;
  private weights: Float32Array;
  private buffer: ImageData;
  private packed: Uint32Array;
  private count = 0;
  private pointerX = -1000;
  private pointerY = -1000;
  private quiet = 0;
  private forming = false;
  private intervals = new Float32Array(180);
  private footprint: number;
  readonly metrics: ParticleMetrics;

  constructor(private context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, private source: ParticleSource) {
    const { width, height, pixels, gap } = source;
    if (gap < 1 || !Number.isInteger(gap) || pixels.length !== width * height * 4) throw new Error("Invalid portrait sampling surface");
    const capacity = Math.ceil(width / gap) * Math.ceil(height / gap);
    this.x = new Float32Array(capacity); this.y = new Float32Array(capacity);
    this.tx = new Float32Array(capacity); this.ty = new Float32Array(capacity);
    this.vx = new Float32Array(capacity); this.vy = new Float32Array(capacity);
    this.colors = new Uint32Array(capacity);
    this.footprint = source.footprint ?? 3;
    const area = this.footprint * this.footprint;
    this.stamps = new Uint32Array(capacity * area);
    this.tiles = new Uint32Array(capacity * gap * gap); this.weights = new Float32Array(capacity);
    this.buffer = context.createImageData(width, height);
    this.packed = new Uint32Array(this.buffer.data.buffer);
    const sourcePacked = new Uint32Array(pixels.buffer, pixels.byteOffset, pixels.byteLength / 4);
    const center = (this.footprint - 1) / 2;
    for (let row = 0; row < height; row += gap) for (let column = 0; column < width; column += gap) {
      const offset = row * width + column, sourceAlpha = pixels[offset * 4 + 3];
      if (sourceAlpha === 0) continue;
      const index = this.count++;
      this.tx[index] = column; this.ty[index] = row; this.colors[index] = sourcePacked[offset];
      this.weights[index] = 0.32 + 0.68 * ((Math.imul(index + 1, 1597334677) >>> 0) / 4294967296);
      for (let tileRow = 0; tileRow < gap; tileRow++) for (let tileColumn = 0; tileColumn < gap; tileColumn++) {
        if (row + tileRow < height && column + tileColumn < width) this.tiles[index * gap * gap + tileRow * gap + tileColumn] = sourcePacked[(row + tileRow) * width + column + tileColumn];
      }
      for (let localRow = 0; localRow < this.footprint; localRow++) for (let localColumn = 0; localColumn < this.footprint; localColumn++) {
        const horizontal = localColumn - center, vertical = localRow - center;
        const coverage = Math.min(1, Math.max(0, this.footprint / 2 + 0.25 - Math.sqrt(horizontal * horizontal + vertical * vertical)));
        const alpha = Math.round(sourceAlpha * coverage);
        this.stamps[index * area + localRow * this.footprint + localColumn] = littleEndian ? (this.colors[index] & 0x00ffffff) | (alpha << 24) : (this.colors[index] & 0xffffff00) | alpha;
      }
    }
    if (!this.count) throw new Error("Portrait has no visible source pixels");
    this.metrics = { frames: 0, particles: this.count, updateMs: 0, drawMs: 0, maxFrameMs: 0, maxDisplacement: 0, meanDisplacement: 0, peakDisplacement: 0, reassembled: true, settled: true, forming: false, formationMs: 0, initialMeanDisplacement: 0, intervalCount: 0, intervalTotalMs: 0, intervalMaxMs: 0, intervalBuckets: [0, 0, 0, 0, 0, 0], bufferBytes: this.x.byteLength * 6 + this.colors.byteLength + this.stamps.byteLength + this.tiles.byteLength + this.weights.byteLength + this.buffer.data.byteLength + this.intervals.byteLength, intervalP95Ms: 0 };
    this.x.set(this.tx); this.y.set(this.ty);
  }

  form(seed = 314159) {
    this.pointer(-1000, -1000); this.forming = true;
    const portraitWidth = this.source.portraitWidth ?? this.source.width * 0.78;
    let randomState = seed >>> 0;
    const random = () => { randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0; return randomState / 4294967296; };
    let total = 0, maximum = 0;
    for (let index = 0; index < this.count; index++) {
      const angle = random() * Math.PI * 2, radius = 0.72 + random() * 0.28;
      const radialX = Math.cos(angle) * this.source.width * 0.36 * radius, radialY = Math.sin(angle) * this.source.height * 0.31 * radius;
      const centerX = this.source.width / 2, centerY = this.source.height / 2;
      let horizontal = (centerX - this.tx[index]) * 0.84 + radialX;
      let vertical = (centerY - this.ty[index]) * 0.8 + radialY;
      if (horizontal * horizontal + vertical * vertical < (portraitWidth * 0.35) ** 2) {
        horizontal = (centerX - this.tx[index]) * 0.84 - radialX;
        vertical = (centerY - this.ty[index]) * 0.8 - radialY;
      }
      const magnitude = Math.sqrt(horizontal * horizontal + vertical * vertical);
      const bound = Math.min(1, portraitWidth * 0.7 / Math.max(1, magnitude));
      this.x[index] = this.tx[index] + horizontal * bound;
      this.y[index] = this.ty[index] + vertical * bound;
      this.vx[index] = 0; this.vy[index] = 0;
      const distanceX = this.x[index] - this.tx[index], distanceY = this.y[index] - this.ty[index];
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      maximum = Math.max(maximum, distance); total += distance;
    }
    this.metrics.forming = true; this.metrics.formationMs = 0; this.metrics.reassembled = false; this.metrics.settled = false;
    this.metrics.initialMeanDisplacement = total / this.count; this.metrics.meanDisplacement = total / this.count;
    this.metrics.maxDisplacement = maximum; this.metrics.peakDisplacement = Math.max(this.metrics.peakDisplacement, maximum);
  }

  scatter(seed = 271828) {
    this.pointer(-1000, -1000); this.forming = false;
    let randomState = seed >>> 0;
    for (let index = 0; index < this.count; index++) {
      randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
      this.vx[index] = (randomState / 4294967296 - 0.5) * 900;
      randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
      this.vy[index] = (randomState / 4294967296 - 0.5) * 900;
    }
    this.metrics.reassembled = false; this.metrics.settled = false;
  }

  pointer(horizontal: number, vertical: number) { this.pointerX = horizontal; this.pointerY = vertical; this.quiet = 0; this.metrics.settled = false; }

  snapshot() {
    const samples = Array.from(this.intervals.subarray(0, Math.min(this.metrics.intervalCount, this.intervals.length))).sort((first, second) => first - second);
    this.metrics.intervalP95Ms = samples[Math.max(0, Math.ceil(samples.length * 0.95) - 1)] ?? 0;
    return this.metrics;
  }

  assemble() {
    this.pointerX = -1000; this.pointerY = -1000; this.forming = false; this.quiet = 0;
    this.x.set(this.tx); this.y.set(this.ty); this.vx.fill(0); this.vy.fill(0);
    this.metrics.maxDisplacement = 0; this.metrics.meanDisplacement = 0;
    this.metrics.reassembled = true; this.metrics.settled = true; this.metrics.forming = false;
  }

  draw() {
    const begin = performance.now(); this.packed.fill(0);
    const { width, height, gap } = this.source;
    const area = this.footprint * this.footprint, center = (this.footprint - 1) / 2;
    for (let index = 0; index < this.count; index++) {
      const horizontal = this.x[index] - this.tx[index], vertical = this.y[index] - this.ty[index];
      if (!this.forming && horizontal * horizontal + vertical * vertical < 0.04) {
        const column = this.tx[index], row = this.ty[index], tileStart = index * gap * gap;
        for (let tileRow = 0; tileRow < gap && row + tileRow < height; tileRow++) for (let tileColumn = 0; tileColumn < gap && column + tileColumn < width; tileColumn++) {
          this.packed[(row + tileRow) * width + column + tileColumn] = this.tiles[tileStart + tileRow * gap + tileColumn];
        }
        continue;
      }
      const column = Math.round(this.x[index] - center), row = Math.round(this.y[index] - center), start = index * area;
      for (let localRow = 0; localRow < this.footprint; localRow++) {
        const targetRow = row + localRow;
        if (targetRow < 0 || targetRow >= height) continue;
        for (let localColumn = 0; localColumn < this.footprint; localColumn++) {
          const targetColumn = column + localColumn;
          if (targetColumn < 0 || targetColumn >= width) continue;
          const color = this.stamps[start + localRow * this.footprint + localColumn];
          if (littleEndian ? color >>> 24 : color & 255) this.packed[targetRow * width + targetColumn] = color;
        }
      }
    }
    this.context.putImageData(this.buffer, 0, 0);
    const duration = performance.now() - begin;
    this.metrics.frames++; this.metrics.drawMs += duration; this.metrics.maxFrameMs = Math.max(this.metrics.maxFrameMs, duration);
  }

  step(delta: number) {
    const begin = performance.now(), elapsed = Math.min(32, Math.max(1, delta)), seconds = elapsed / 1000;
    const interacting = !this.forming && this.pointerX >= 0 && this.pointerY >= 0;
    const omega = this.forming ? 20 * 600 / (this.source.formationDuration ?? 600) : 24, decay = Math.exp(-omega * seconds);
    const radius = (this.source.portraitWidth ?? this.source.width * 0.78) * 0.13, radius2 = radius * radius;
    let speed2 = 0, displacement2 = 0, total = 0;
    for (let index = 0; index < this.count; index++) {
      let goalX = this.tx[index], goalY = this.ty[index];
      if (interacting) {
        const distanceX = goalX - this.pointerX, distanceY = goalY - this.pointerY, distance2 = distanceX * distanceX + distanceY * distanceY;
        if (distance2 < radius2) {
          const distance = Math.sqrt(Math.max(0.01, distance2)), force = (1 - distance / radius) ** 2 * radius * 0.8 * this.weights[index];
          goalX += (distance2 < 0.01 ? (index % 2 ? 1 : -1) : distanceX / distance) * force;
          goalY += (distance2 < 0.01 ? 0 : distanceY / distance) * force;
        }
      }
      const offsetX = this.x[index] - goalX, offsetY = this.y[index] - goalY;
      const springX = this.vx[index] + omega * offsetX, springY = this.vy[index] + omega * offsetY;
      this.x[index] = goalX + (offsetX + springX * seconds) * decay; this.y[index] = goalY + (offsetY + springY * seconds) * decay;
      this.vx[index] = (this.vx[index] - omega * springX * seconds) * decay; this.vy[index] = (this.vy[index] - omega * springY * seconds) * decay;
      speed2 = Math.max(speed2, this.vx[index] * this.vx[index] + this.vy[index] * this.vy[index]);
      const distanceX = this.x[index] - this.tx[index], distanceY = this.y[index] - this.ty[index], distance2 = distanceX * distanceX + distanceY * distanceY;
      displacement2 = Math.max(displacement2, distance2); total += Math.sqrt(distance2);
    }
    this.quiet = speed2 < 1 && (interacting || displacement2 < 0.04) ? this.quiet + 1 : 0;
    const settled = this.quiet >= 2;
    this.metrics.maxDisplacement = Math.sqrt(displacement2); this.metrics.meanDisplacement = total / this.count;
    this.metrics.peakDisplacement = Math.max(this.metrics.peakDisplacement, this.metrics.maxDisplacement);
    this.metrics.reassembled = false; this.metrics.settled = settled;
    if (this.forming) this.metrics.formationMs += elapsed;
    if (settled && !interacting) this.assemble();
    this.metrics.updateMs += performance.now() - begin; this.draw();
    this.metrics.maxFrameMs = Math.max(this.metrics.maxFrameMs, performance.now() - begin);
    this.intervals[this.metrics.intervalCount % this.intervals.length] = delta;
    this.metrics.intervalCount++; this.metrics.intervalTotalMs += delta; this.metrics.intervalMaxMs = Math.max(this.metrics.intervalMaxMs, delta);
    this.metrics.intervalBuckets[delta <= 12 ? 0 : delta <= 18 ? 1 : delta <= 25 ? 2 : delta <= 34 ? 3 : delta <= 50 ? 4 : 5]++;
    return settled;
  }
}
