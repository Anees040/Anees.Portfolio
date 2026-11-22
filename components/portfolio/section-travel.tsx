"use client";

import { useCallback, type ReactNode } from "react";
import type { ScrollScene } from "@/lib/scroll-scene-contract";
import { SceneBoundary } from "./scene-boundary";
import { SectionLettering } from "./section-lettering";
import styles from "./section-travel.module.css";

export function SectionTravel({ id, title, variant, children, embedded = false }: {
  id: string; title: string; variant: "about" | "work" | "engineering" | "journey" | "building" | "evidence" | "contact"; children: ReactNode; embedded?: boolean;
}) {
  const createScene = useCallback((root: HTMLElement): Omit<ScrollScene, "id" | "root"> => {
    const stage = root.querySelector<HTMLElement>("[data-travel-stage]")!;
    const lettering = Array.from(root.querySelectorAll<HTMLElement>("[data-travel-title]"));
    return {
      stage, scroll: "flow", anchors: [], distance: () => 1,
      fits: measurements => measurements.finePointer && measurements.viewportWidth >= measurements.rootTextSize * 48,
      setup({ measurements }) {
        // Arrive before the section heading reaches the header, then hold for
        // reading. Absolute scene progress gives the same path on reverse scroll.
        const arrival = Math.max(.01, (measurements.viewportHeight * .8 - measurements.headerHeight) / (stage.offsetHeight + measurements.viewportHeight));
        return {
          progress(value) { for (const title of lettering) title.style.setProperty("--wordmark-progress", String(Math.min(1, Math.max(0, value / arrival)))); },
          settle() { for (const title of lettering) title.style.removeProperty("--wordmark-progress"); },
        };
      },
      staticFallback() {},
    };
  }, []);
  return <SceneBoundary id={`title-${id}`} createScene={createScene} className={`${styles.boundary} ${styles[variant]}`}>
    <div className={styles.stage} data-travel-stage>
      {!embedded && <SectionLettering title={title} />}
      {children}
    </div>
  </SceneBoundary>;
}
