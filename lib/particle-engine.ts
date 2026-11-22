export type ParticleMetrics = {
  frames: number; particles: number; updateMs: number; drawMs: number; maxFrameMs: number;
  maxDisplacement: number; meanDisplacement: number; peakDisplacement: number; reassembled: boolean;
  settled: boolean; forming: boolean; formationMs: number; initialMeanDisplacement: number;
  intervalCount: number; intervalTotalMs: number; intervalMaxMs: number; intervalBuckets: number[]; bufferBytes: number; intervalP95Ms: number;
  interactionRadius: number; affectedParticles: number;
};
export type ParticleSource = { width: number; height: number; pixels: Uint8ClampedArray; gap: number; portraitWidth?: number; footprint?: number; formationDuration?: number; radiusRatio?: number; forceRatio?: number; tangentialRatio?: number; response?: number; maxDisplacementRatio?: number };
export const PARTICLE_BUDGET = { count: 32000, bytes: 8 * 1024 * 1024, surfacePixels: 480 * 700 } as const;

function sampleOffset(column: number, row: number, cellWidth: number, cellHeight: number, width: number) {
  let hash = (Math.imul(column + 1, 73856093) ^ Math.imul(row + 1, 19349663)) >>> 0;
  hash = Math.imul(hash ^ hash >>> 16, 0x7feb352d);
  hash = Math.imul(hash ^ hash >>> 15, 0x846ca68b);
  hash = (hash ^ hash >>> 16) >>> 0;
  const x = column + Math.min(cellWidth - 1, Math.floor((hash & 65535) / 65536 * cellWidth));
  const y = row + Math.min(cellHeight - 1, Math.floor((hash >>> 16) / 65536 * cellHeight));
  return y * width + x;
}

export function countParticleSamples(pixels: Uint8ClampedArray, width: number, height: number, gap: number) {
  let count = 0;
  for (let cellY = 0; cellY < height; cellY += gap) for (let cellX = 0; cellX < width; cellX += gap) {
    const column = Math.floor(cellX), row = Math.floor(cellY);
    const cellWidth = Math.min(width, Math.floor(cellX + gap)) - column;
    const cellHeight = Math.min(height, Math.floor(cellY + gap)) - row;
    if (pixels[sampleOffset(column, row, cellWidth, cellHeight, width) * 4 + 3]) count++;
  }
  return count;
}

export function chooseParticleGap(pixels: Uint8ClampedArray, width: number, height: number, limit: number = PARTICLE_BUDGET.count) {
  let visible = 0;
  for (let offset = 3; offset < pixels.length; offset += 4) if (pixels[offset]) visible++;
  let gap = Math.max(1, Math.sqrt(visible / limit) * 1.02);
  while (countParticleSamples(pixels, width, height, gap) > limit) gap *= 1.025;
  return gap;
}

const littleEndian = new Uint8Array(new Uint32Array([0x01020304]).buffer)[0] === 4;

export class ParticleEngine {
  private x: Float32Array;
  private y: Float32Array;
  private tx: Float32Array;
  private ty: Float32Array;
  private vx: Float32Array;
  private vy: Float32Array;
  private colors: Uint32Array;
  private cellStarts: Uint32Array;
  private cellSizes: Uint32Array;
  private stamps: Uint32Array;
  private sourcePacked: Uint32Array;
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
    if (!Number.isFinite(gap) || gap < 1 || !Number.isInteger(width) || !Number.isInteger(height) || pixels.length !== width * height * 4) throw new Error("Invalid portrait sampling surface");
    if (width * height > PARTICLE_BUDGET.surfacePixels) throw new Error("Portrait surface exceeds pixel budget");
    const capacity = countParticleSamples(pixels, width, height, gap);
    const footprint = Math.min(2, Math.floor(gap), Math.max(1, source.footprint ?? 1));
    const stampSize = Math.ceil(footprint);
    const bytes = capacity * (36 + 4 * stampSize * stampSize) + width * height * 4 + 180 * 4;
    if (capacity > PARTICLE_BUDGET.count || bytes > PARTICLE_BUDGET.bytes) throw new Error("Portrait exceeds particle memory budget");
    this.x = new Float32Array(capacity); this.y = new Float32Array(capacity);
    this.tx = new Float32Array(capacity); this.ty = new Float32Array(capacity);
    this.vx = new Float32Array(capacity); this.vy = new Float32Array(capacity);
    this.colors = new Uint32Array(capacity);
    this.cellStarts = new Uint32Array(capacity); this.cellSizes = new Uint32Array(capacity);
    this.footprint = stampSize;
    const area = stampSize * stampSize;
    this.stamps = new Uint32Array(capacity * area);
    this.buffer = context.createImageData(width, height);
    this.packed = new Uint32Array(this.buffer.data.buffer);
    this.sourcePacked = new Uint32Array(pixels.buffer, pixels.byteOffset, pixels.byteLength / 4);
    const center = (stampSize - 1) / 2;
    for (let cellY = 0; cellY < height; cellY += gap) for (let cellX = 0; cellX < width; cellX += gap) {
      const column = Math.floor(cellX), row = Math.floor(cellY);
      const cellWidth = Math.min(width, Math.floor(cellX + gap)) - column;
      const cellHeight = Math.min(height, Math.floor(cellY + gap)) - row;
      const offset = sampleOffset(column, row, cellWidth, cellHeight, width), sourceAlpha = pixels[offset * 4 + 3];
      const sampleX = offset % width, sampleY = Math.floor(offset / width);
      if (!sourceAlpha) continue;
      const index = this.count++;
      this.cellStarts[index] = row * width + column;
      this.cellSizes[index] = cellWidth << 16 | cellHeight;
      this.tx[index] = sampleX; this.ty[index] = sampleY; this.colors[index] = this.sourcePacked[offset];
      for (let localRow = 0; localRow < stampSize; localRow++) for (let localColumn = 0; localColumn < stampSize; localColumn++) {
        const horizontal = localColumn - center, vertical = localRow - center;
        const coverage = Math.min(1, Math.max(0, footprint / 2 + .5 - Math.sqrt(horizontal * horizontal + vertical * vertical)));
        const alpha = Math.round(sourceAlpha * coverage);
        this.stamps[index * area + localRow * stampSize + localColumn] = littleEndian ? (this.colors[index] & 0x00ffffff) | (alpha << 24) : (this.colors[index] & 0xffffff00) | alpha;
      }
    }
    if (!this.count) throw new Error("Portrait has no visible source pixels");
    this.metrics = { frames: 0, particles: this.count, updateMs: 0, drawMs: 0, maxFrameMs: 0, maxDisplacement: 0, meanDisplacement: 0, peakDisplacement: 0, reassembled: true, settled: true, forming: false, formationMs: 0, initialMeanDisplacement: 0, intervalCount: 0, intervalTotalMs: 0, intervalMaxMs: 0, intervalBuckets: [0, 0, 0, 0, 0, 0], bufferBytes: bytes, intervalP95Ms: 0, interactionRadius: (source.portraitWidth ?? width) * (source.radiusRatio ?? .44), affectedParticles: 0 };
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

  pointer(horizontal: number, vertical: number) {
    this.pointerX = horizontal; this.pointerY = vertical;
    this.quiet = 0; this.metrics.settled = false;
  }

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
    this.metrics.affectedParticles = 0;
  }

  draw() {
    const begin = performance.now();
    const { width, height } = this.source;
    const area = this.footprint * this.footprint, center = (this.footprint - 1) / 2;
    if (this.forming) this.packed.fill(0);
    else this.packed.set(this.sourcePacked);
    // Each fine particle owns a sampling cell. Release that cell as its particle
    // travels, rather than keeping a ghost photograph under the moving field.
    // Outside displaced cells the exact source buffer remains untouched.
    if (!this.forming && !this.metrics.reassembled) for (let index = 0; index < this.count; index++) {
      const dx = this.x[index] - this.tx[index], dy = this.y[index] - this.ty[index];
      if (dx * dx + dy * dy <= .36) continue;
      const start = this.cellStarts[index], cellWidth = this.cellSizes[index] >>> 16, cellHeight = this.cellSizes[index] & 65535;
      const release = Math.min(1, Math.sqrt(dx * dx + dy * dy) / (this.source.gap * 2));
      if (release === 1) {
        for (let row = 0; row < cellHeight; row++) for (let column = 0; column < cellWidth; column++) this.packed[start + row * width + column] = 0;
        continue;
      }
      for (let row = 0; row < cellHeight; row++) for (let column = 0; column < cellWidth; column++) {
        const offset = start + row * width + column, color = this.sourcePacked[offset];
        const alpha = Math.round((littleEndian ? color >>> 24 : color & 255) * (1 - release));
        this.packed[offset] = littleEndian ? (color & 0x00ffffff) | alpha << 24 : (color & 0xffffff00) | alpha;
      }
    }
    if (!this.metrics.reassembled) for (let index = 0; index < this.count; index++) {
      const dx = this.x[index] - this.tx[index], dy = this.y[index] - this.ty[index];
      if (!this.forming && dx * dx + dy * dy <= .36) continue;
      const column = Math.round(this.x[index] - center), row = Math.round(this.y[index] - center), start = index * area;
      const exposure = this.forming ? 1 : Math.min(1, Math.sqrt(dx * dx + dy * dy) / (this.source.gap * 2));
      if (this.footprint === 1) {
        if (column >= 0 && column < width && row >= 0 && row < height) {
          const color = this.colors[index];
          const alpha = Math.round((littleEndian ? color >>> 24 : color & 255) * exposure);
          this.packed[row * width + column] = littleEndian ? (color & 0x00ffffff) | alpha << 24 : (color & 0xffffff00) | alpha;
        }
        continue;
      }
      for (let localRow = 0; localRow < this.footprint; localRow++) {
        const targetRow = row + localRow;
        if (targetRow < 0 || targetRow >= height) continue;
        for (let localColumn = 0; localColumn < this.footprint; localColumn++) {
          const targetColumn = column + localColumn;
          if (targetColumn < 0 || targetColumn >= width) continue;
          const color = this.stamps[start + localRow * this.footprint + localColumn];
          const alpha = Math.round((littleEndian ? color >>> 24 : color & 255) * exposure);
          if (!alpha) continue;
          const offset = targetRow * width + targetColumn, previous = this.packed[offset];
          const previousAlpha = littleEndian ? previous >>> 24 : previous & 255;
          if (!previousAlpha || alpha === 255) {
            this.packed[offset] = littleEndian ? (color & 0x00ffffff) | (alpha << 24) : (color & 0xffffff00) | alpha;
          } else {
            const remainder = previousAlpha * (1 - alpha / 255), resultAlpha = alpha + remainder;
            const red = Math.round(((littleEndian ? color & 255 : color >>> 24) * alpha + (littleEndian ? previous & 255 : previous >>> 24) * remainder) / resultAlpha);
            const green = Math.round(((littleEndian ? color >>> 8 & 255 : color >>> 16 & 255) * alpha + (littleEndian ? previous >>> 8 & 255 : previous >>> 16 & 255) * remainder) / resultAlpha);
            const blue = Math.round(((littleEndian ? color >>> 16 & 255 : color >>> 8 & 255) * alpha + (littleEndian ? previous >>> 16 & 255 : previous >>> 8 & 255) * remainder) / resultAlpha);
            this.packed[offset] = littleEndian ? red | green << 8 | blue << 16 | Math.round(resultAlpha) << 24 : red << 24 | green << 16 | blue << 8 | Math.round(resultAlpha);
          }
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
    const omega = this.forming ? 20 * 600 / (this.source.formationDuration ?? 600) : (this.source.response ?? 17), decay = Math.exp(-omega * seconds);
    const radius = this.metrics.interactionRadius, radius2 = radius * radius;
    const portraitWidth = this.source.portraitWidth ?? this.source.width;
    const softening2 = (radius * .38) ** 2;
    const maximum = portraitWidth * (this.source.maxDisplacementRatio ?? .24);
    let speed2 = 0, displacement2 = 0, total = 0, affected = 0;
    for (let index = 0; index < this.count; index++) {
      let goalX = this.tx[index], goalY = this.ty[index];
      if (interacting) {
        const distanceX = goalX - this.pointerX, distanceY = goalY - this.pointerY, distance2 = distanceX * distanceX + distanceY * distanceY;
        if (distance2 < radius2) {
          affected++;
          const distance = Math.sqrt(distance2), falloff = 1 - distance / radius;
          const envelope = falloff * falloff * (3 - 2 * falloff);
          // Softened inverse-square repulsion in our spring's pixel units.
          // Unlike distance-scaled dilation, the strongest response is central.
          const variation = .86 + index % 17 / 60;
          const force = Math.min(maximum, portraitWidth * (this.source.forceRatio ?? .22) * variation * softening2 / (softening2 + distance2) * envelope);
          // Source-anchored field targets let the analytic spring settle without
          // a perpetual orbit. Momentum follows pointer changes; deterministic
          // per-particle variation breaks up a perfectly uniform ring.
          const angle = distance < .5 ? index * 2.399963229728653 : 0;
          const horizontal = distance < .5 ? Math.cos(angle) : distanceX / distance;
          const vertical = distance < .5 ? Math.sin(angle) : distanceY / distance;
          const tangent = force * (this.source.tangentialRatio ?? .12) * (.75 + index % 7 / 14);
          goalX += horizontal * force - vertical * tangent;
          goalY += vertical * force + horizontal * tangent;
          const offsetX = goalX - this.tx[index], offsetY = goalY - this.ty[index];
          const bound = Math.min(1, maximum / Math.max(1, Math.sqrt(offsetX * offsetX + offsetY * offsetY)));
          goalX = this.tx[index] + offsetX * bound; goalY = this.ty[index] + offsetY * bound;
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
    this.metrics.affectedParticles = affected;
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
