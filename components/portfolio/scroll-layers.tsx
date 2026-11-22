"use client";

import { useCallback, useId, type ReactNode } from "react";
import type { ScrollScene } from "@/lib/scroll-scene-contract";
import { normalizeProgress } from "@/lib/scroll-scene-runtime";
import { SceneBoundary } from "./scene-boundary";

export function ScrollLayers({ children, className = "" }: { children: ReactNode; className?: string }) {
  const id = useId();
  const createScene = useCallback((root: HTMLElement): Omit<ScrollScene, "id" | "root"> => {
    const stage = root.querySelector<HTMLElement>("[data-layer-stage]")!;
    return {
      stage, scroll: "flow", anchors: [], distance: () => 1,
      setup({ timeline }) {
        const layers = Array.from(stage.querySelectorAll<HTMLElement>("[data-case-layer], [data-case-node]"));
        const paths = Array.from(stage.querySelectorAll<SVGPathElement>("[data-case-draw]"));
        for (let index = 0; index < layers.length; index++) {
          const layer = layers[index];
          const node = layer.hasAttribute("data-case-node");
          const start = .08 + Math.min(index, 4) * .055;
          timeline.fromTo(layer, { x: node ? 0 : index % 2 ? -65 : 65, y: node ? 26 : index % 2 ? 70 : 130, scale: node ? 1 : .94, clipPath: node ? "inset(0 0 0 0)" : "inset(0 0 85% 0)" }, { x: 0, y: 0, scale: 1, clipPath: "inset(0 0 0 0)" }, start, .36);
          if (!node) timeline.fromTo(layer, { y: 0 }, { y: index % 2 ? -45 : -20 }, .72, .28);
        }
        return {
          progress(value) { for (let index = 0; index < paths.length; index++) paths[index].style.strokeDashoffset = String(1 - normalizeProgress((value - .12 - Math.min(index, 5) * .045) / .44)); },
          settle() { for (const path of paths) path.style.removeProperty("stroke-dashoffset"); },
        };
      },
      staticFallback() {},
    };
  }, []);
  return <SceneBoundary id={`layers-${id}`} createScene={createScene} className={className}><div data-layer-stage>{children}</div></SceneBoundary>;
}
