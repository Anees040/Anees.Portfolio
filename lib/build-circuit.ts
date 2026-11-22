export type CircuitDirection = 0 | 1 | 2 | 3;
export type CircuitTile = "straight" | "corner" | "tee";
export const CIRCUIT_SIZE = 4;
export const CIRCUIT_START = 0;
export const CIRCUIT_END = 15;
export const circuitTiles: readonly CircuitTile[] = ["straight", "corner", "tee", "corner", "corner", "corner", "corner", "corner", "corner", "straight", "corner", "straight", "straight", "tee", "corner", "corner"];
export const initialCircuitTurns = [0, 1, 3, 2, 0, 2, 0, 1, 2, 0, 1, 1, 0, 3, 1, 3] as const;
export const circuitCheckpoints = [
  { tile: 5, label: "Local", project: "FitPilot", lesson: "A change becomes a local record before it is synchronized.", href: "/work/fitpilot#architecture" },
  { tile: 10, label: "Contract", project: "Sukoon", lesson: "Flutter and Android need to agree on a versioned schedule contract.", href: "/work/sukoon#architecture" },
  { tile: 11, label: "Record", project: "EduVerse", lesson: "A shared course identity connects learning and assessment records.", href: "/work/eduverse#architecture" },
] as const;
const basePorts: Record<CircuitTile, readonly CircuitDirection[]> = { straight: [0, 2], corner: [0, 1], tee: [0, 1, 2] };
export const directionNames = ["north", "east", "south", "west"] as const;

export function circuitPorts(tile: CircuitTile, turns: number): CircuitDirection[] {
  return basePorts[tile].map(port => ((port + turns % 4 + 4) % 4) as CircuitDirection);
}

export function traceCircuit(turns: readonly number[]): { powered: number[]; route: number[]; complete: boolean } {
  if (turns.length !== circuitTiles.length || turns.some(turn => !Number.isInteger(turn))) return { powered: [], route: [], complete: false };
  const ports = circuitTiles.map((tile, index) => circuitPorts(tile, turns[index]));
  if (!ports[CIRCUIT_START].includes(3)) return { powered: [], route: [], complete: false };
  const queue = [CIRCUIT_START], parents = new Map<number, number>([[CIRCUIT_START, -1]]);
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const tile = queue[cursor];
    for (const direction of ports[tile]) {
      const row = Math.floor(tile / CIRCUIT_SIZE), column = tile % CIRCUIT_SIZE;
      const nextRow = row + (direction === 0 ? -1 : direction === 2 ? 1 : 0);
      const nextColumn = column + (direction === 1 ? 1 : direction === 3 ? -1 : 0);
      if (nextRow < 0 || nextRow >= CIRCUIT_SIZE || nextColumn < 0 || nextColumn >= CIRCUIT_SIZE) continue;
      const next = nextRow * CIRCUIT_SIZE + nextColumn;
      if (!parents.has(next) && ports[next].includes(((direction + 2) % 4) as CircuitDirection)) { parents.set(next, tile); queue.push(next); }
    }
  }
  const complete = parents.has(CIRCUIT_END) && ports[CIRCUIT_END].includes(1);
  const route: number[] = [];
  if (complete) for (let tile = CIRCUIT_END; tile !== -1; tile = parents.get(tile)!) route.unshift(tile);
  return { powered: queue, route, complete };
}

export function circuitRoutePath(route: readonly number[]): string {
  if (!route.length) return "";
  const points = [{ x: -12, y: 50 }, ...route.map(tile => ({ x: (tile % 4) * 100 + 50, y: Math.floor(tile / 4) * 100 + 50 })), { x: 412, y: 350 }];
  let path = `M${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length - 1; index++) {
    const before = points[index - 1], point = points[index], after = points[index + 1];
    const dx = Math.sign(point.x - before.x), dy = Math.sign(point.y - before.y);
    const nextDx = Math.sign(after.x - point.x), nextDy = Math.sign(after.y - point.y);
    if (dx === nextDx && dy === nextDy) path += `L${point.x} ${point.y}`;
    else path += `L${point.x - dx * 20} ${point.y - dy * 20}Q${point.x} ${point.y} ${point.x + nextDx * 20} ${point.y + nextDy * 20}`;
  }
  const last = points[points.length - 1];
  return path + `L${last.x} ${last.y}`;
}
