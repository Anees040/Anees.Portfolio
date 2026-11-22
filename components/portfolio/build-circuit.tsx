"use client";

import Link from "next/link";
import { ArrowUpRight, RotateCcw, Send } from "lucide-react";
import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { circuitCheckpoints, circuitPorts, circuitRoutePath, circuitTiles, directionNames, initialCircuitTurns, traceCircuit, type CircuitTile } from "@/lib/build-circuit";
import styles from "./build-circuit.module.css";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
const tilePaths: Record<CircuitTile, string> = { straight: "M50 0V100", corner: "M50 0V30Q50 50 70 50H100", tee: "M50 0V100M50 50H100" };

export function BuildCircuit() {
  const [turns, setTurns] = useState<number[]>(() => [...initialCircuitTurns]);
  const [signal, setSignal] = useState(0);
  const [instant, setInstant] = useState(false);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const result = traceCircuit(turns);
  const route = circuitRoutePath(result.route);
  const rotate = (index: number, keyboard: boolean) => {
    setInstant(keyboard);
    setTurns(current => current.map((turn, position) => position === index ? turn + 1 : turn));
  };
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const row = Math.floor(index / 4), column = index % 4;
    const next = event.key === "ArrowRight" ? row * 4 + Math.min(3, column + 1)
      : event.key === "ArrowLeft" ? row * 4 + Math.max(0, column - 1)
      : event.key === "ArrowDown" ? Math.min(3, row + 1) * 4 + column
      : event.key === "ArrowUp" ? Math.max(0, row - 1) * 4 + column
      : event.key === "Home" ? row * 4 : event.key === "End" ? row * 4 + 3 : undefined;
    if (next !== undefined) { event.preventDefault(); buttons.current[next]?.focus(); }
  };
  const reset = () => { setInstant(true); setTurns([...initialCircuitTurns]); setSignal(0); };
  return <div className={styles.experiment} data-build-circuit data-circuit-complete={result.complete}>
    <div className={styles.introduction}>
      <h3 id="circuit-heading">Build Circuit<em>.</em></h3>
      <p id="circuit-instructions">Rotate the tiles to carry a signal from <strong>START</strong> to <strong>END</strong>. Every shared edge needs matching connections.</p>
      <p className={styles.controlsHint}>Click or tap to turn a tile clockwise. Use Tab or arrow keys to move between tiles, then Enter or Space to rotate.</p>
      <div className={styles.status} role="status" aria-live="polite" aria-atomic="true">
        <strong>{result.complete ? "Circuit connected." : result.powered.length ? "Follow the copper path." : "Start with the incoming signal."}</strong>
        <span>{result.complete ? "The signal has a continuous route to END. Send it again, or replay the puzzle." : result.powered.length ? `${result.powered.length} ${result.powered.length === 1 ? "tile carries" : "tiles carry"} the signal. Align the next pair of ports.` : "Turn the top-left tile to accept the signal from the left."}</span>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={reset} disabled={!ready}><RotateCcw size={17} aria-hidden="true" />{result.complete ? "Replay puzzle" : "Reset board"}</button>
        {result.complete && <button type="button" onClick={() => setSignal(current => current + 1)}><Send size={17} aria-hidden="true" />Send signal again</button>}
      </div>
      <noscript><p className={styles.staticNote}>The interactive board needs JavaScript. The lesson: a connection works only when both sides agree. A visible line on one tile cannot power an incompatible neighbour.</p></noscript>
    </div>
    <div className={styles.boardFolio}>
      <div className={styles.boardLabels} aria-hidden="true"><span>START <span className={styles.startPoint} /></span><span>Rotate. Connect. Send.</span></div>
      <div className={styles.boardFrame}>
        <div className={styles.board} role="group" aria-label="Build Circuit: four rows and four columns" aria-describedby="circuit-instructions" data-instant={instant}>
          {circuitTiles.map((tile, index) => {
            const checkpoint = circuitCheckpoints.find(point => point.tile === index);
            const powered = result.powered.includes(index);
            const ports = circuitPorts(tile, turns[index]).map(port => directionNames[port]).join(" and ");
            return <button key={index} ref={element => { buttons.current[index] = element; }} type="button" className={styles.tile} data-circuit-tile={index} data-powered={powered} disabled={!ready}
              aria-label={`Row ${Math.floor(index / 4) + 1}, column ${index % 4 + 1}. ${tile} tile${checkpoint ? `, ${checkpoint.label} checkpoint` : ""}. Connections ${ports}. Rotate clockwise.`}
              onKeyDown={event => navigate(event, index)} onClick={event => rotate(index, event.detail === 0)}>
              <svg viewBox="0 0 100 100" fill="none" aria-hidden="true"><g style={{ transform: `rotate(${turns[index] * 90}deg)` }}><path d={tilePaths[tile]} /><circle cx="50" cy="0" r="2.5" />{tile !== "straight" && <circle cx="100" cy="50" r="2.5" />}{tile !== "corner" && <circle cx="50" cy="100" r="2.5" />}</g></svg>
              {checkpoint && <span className={styles.checkpoint} aria-hidden="true"><span className={styles.checkpointFull}>{checkpoint.label}</span><span className={styles.checkpointCompact}>{checkpoint.label[0]}</span></span>}
              <span className={styles.tileCoordinate} aria-hidden="true">{String.fromCharCode(65 + Math.floor(index / 4))}{index % 4 + 1}</span>
            </button>;
          })}
        </div>
        {result.complete && <svg key={signal} className={styles.route} viewBox="0 0 400 400" fill="none" aria-hidden="true"><path d={route} className={styles.completeRoute} /><path d={route} pathLength="1" className={styles.signal} /></svg>}
      </div>
      <div className={styles.boardLabels} aria-hidden="true"><span>One continuous route</span><span><span className={styles.endPoint} /> END</span></div>
    </div>
    <div className={styles.lessons}>
      <h4>Why the connections matter</h4>
      <p>The board is a routing puzzle. Its three labelled tiles point to real ideas from my projects; it does not simulate their internals.</p>
      <div>{circuitCheckpoints.map(checkpoint => <Link href={checkpoint.href} key={checkpoint.tile} data-connected={result.powered.includes(checkpoint.tile)}><span>{checkpoint.project}<ArrowUpRight size={15} aria-hidden="true" /></span><strong>{checkpoint.label}</strong><p>{checkpoint.lesson}</p></Link>)}</div>
    </div>
  </div>;
}
