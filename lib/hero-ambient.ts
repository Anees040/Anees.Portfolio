export const AMBIENT_BUDGET = { stars: 160, tail: 24, width: 1280, height: 900, fps: 30 } as const;

export function ambientStars(count: number) {
  let seed = 72631;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  return Array.from({ length: count }, () => ({ x: random(), y: random(), radius: 0.65 + random() * 1.05, phase: random() * Math.PI * 2, speed: 0.35 + random() * 0.65, color: Math.floor(random() * 5) }));
}

export class HeroAmbientRenderer {
  private stars;
  private time = 0;
  private nextComet = 1.4;
  private cometStart = -10;
  readonly metrics = { frames: 0, stars: 0, comets: 0, maxDrawMs: 0, activeSeconds: 0 };

  constructor(private context: CanvasRenderingContext2D, private width: number, private height: number, private colors: readonly string[], low: boolean) {
    const count = Math.min(low ? 85 : AMBIENT_BUDGET.stars, Math.max(48, Math.round(width * height / (low ? 11000 : 8500))));
    this.stars = ambientStars(count);
    this.metrics.stars = count;
  }

  draw(deltaSeconds: number) {
    const begin = performance.now();
    this.time += Math.min(0.08, Math.max(0, deltaSeconds));
    const ctx = this.context, { width, height, time } = this;
    ctx.clearRect(0, 0, width, height);
    for (let index = 0; index < this.stars.length; index++) {
      const star = this.stars[index];
      const x = (star.x * width + time * (1.8 + star.speed * 2) * 1.18) % width;
      const y = (star.y * height + time * (0.7 + star.speed) * 1.18) % height;
      ctx.fillStyle = this.colors[star.color < 3 ? 0 : star.color === 3 ? 1 : 2];
      ctx.globalAlpha = 0.34 + 0.43 * (0.5 + 0.5 * Math.sin(star.phase + time * star.speed));
      ctx.beginPath(); ctx.arc(x, y, star.radius, 0, Math.PI * 2); ctx.fill();
    }
    if (time >= this.nextComet) {
      this.cometStart = time;
      this.nextComet = time + 9 + (this.metrics.comets % 3) * 2;
      this.metrics.comets++;
    }
    const age = time - this.cometStart;
    if (age >= 0 && age <= 1.4) {
      const fade = Math.min(1, age * 5, (1.4 - age) * 4);
      const startX = width * (this.metrics.comets % 2 ? 0.94 : 0.66), startY = height * 0.09;
      const velocityX = -Math.min(320, width * 0.34), velocityY = Math.min(140, height * 0.18);
      const x = startX + age * velocityX, y = startY + age * velocityY;
      ctx.fillStyle = this.colors[1];
      for (let index = AMBIENT_BUDGET.tail; index > 0; index--) {
        const lag = index * 0.008;
        ctx.globalAlpha = fade * (1 - index / (AMBIENT_BUDGET.tail + 1)) * 0.76;
        ctx.beginPath(); ctx.arc(x - velocityX * lag, y - velocityY * lag, 0.5 + (1 - index / AMBIENT_BUDGET.tail) * 0.7, 0, Math.PI * 2); ctx.fill();
      }
      for (let radius = 6; radius >= 2; radius -= 2) {
        ctx.globalAlpha = fade * (radius === 2 ? 0.95 : radius === 4 ? 0.16 : 0.055);
        ctx.fillStyle = this.colors[0];
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    this.metrics.frames++; this.metrics.activeSeconds = time;
    this.metrics.maxDrawMs = Math.max(this.metrics.maxDrawMs, performance.now() - begin);
  }
}
