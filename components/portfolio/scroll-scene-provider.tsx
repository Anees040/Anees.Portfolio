"use client";

import { useGSAP } from "@gsap/react";
import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import type { ScrollSceneCoordinator } from "@/lib/scroll-scene-contract";
import { SceneRegistry } from "@/lib/scroll-scene-runtime";

const ScrollSceneContext = createContext<ScrollSceneCoordinator | null>(null);

export function useScrollSceneCoordinator(): ScrollSceneCoordinator {
  const coordinator = useContext(ScrollSceneContext);
  if (!coordinator) throw new Error("SceneBoundary requires the shared ScrollSceneProvider");
  return coordinator;
}

export function ScrollSceneProvider({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const [bridge] = useState(() => {
    const registry = new SceneRegistry();
    const releases = new Map<string, () => void>();
    const state: { runtime?: ScrollSceneCoordinator & { dispose(): void } } = {};
    const coordinator: ScrollSceneCoordinator = {
      register(scene) {
        const unregister = registry.register(scene);
        try { if (state.runtime) releases.set(scene.id, state.runtime.register(scene)); }
        catch (error) { unregister(); throw error; }
        let removed = false;
        return () => {
          if (removed) return;
          removed = true;
          releases.get(scene.id)?.();
          releases.delete(scene.id);
          unregister();
        };
      },
      requestRefresh: reason => state.runtime?.requestRefresh(reason),
      inspect: () => state.runtime?.inspect() ?? { scenes: [], refreshes: 0, reasons: [] },
    };
    return { state, coordinator, registry, releases };
  });

  useGSAP((_context, contextSafe) => {
    if (!contextSafe) return;
    let active = true;
    const abort = new AbortController();
    const initialize = contextSafe(async () => {
      try {
        const { createScrollSceneRuntime } = await import("@/lib/scroll-scene-runtime");
        if (!active || !scope.current) return;
        const runtime = await createScrollSceneRuntime(scope.current, abort.signal);
        if (!active) { runtime.dispose(); return; }
        bridge.state.runtime = runtime;
        for (const scene of bridge.registry.values()) bridge.releases.set(scene.id, runtime.register(scene));
      } catch {
        bridge.state.runtime?.dispose();
        bridge.state.runtime = undefined;
        if (scope.current && active) scope.current.dataset.scrollRuntime = "static";
      }
    });
    void initialize();
    return () => {
      active = false;
      abort.abort();
      bridge.state.runtime?.dispose();
      bridge.state.runtime = undefined;
      bridge.releases.clear();
    };
  }, { scope, dependencies: [bridge], revertOnUpdate: true });

  return <ScrollSceneContext.Provider value={bridge.coordinator}><div ref={scope} className="scroll-scene-provider">{children}</div></ScrollSceneContext.Provider>;
}
