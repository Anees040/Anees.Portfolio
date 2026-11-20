"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useScrollSceneCoordinator } from "./scroll-scene-provider";

export function WorkspaceInteraction({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const coordinator = useScrollSceneCoordinator();

  useEffect(() => {
    const element = root.current!;
    const update = () => {
      element.dataset.workPerspective = element.querySelector<HTMLInputElement>('input[name="work-perspective"]:checked')?.value;
      coordinator.requestRefresh("work-perspective");
    };
    const navigate = (event: KeyboardEvent) => {
      if (!(event.target instanceof HTMLAnchorElement) || !event.target.closest('[data-work-project-navigation]')) return;
      const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('[data-work-project-navigation] a'));
      const index = links.indexOf(event.target);
      const next = event.key === "ArrowRight" ? Math.min(links.length - 1, index + 1) : event.key === "ArrowLeft" ? Math.max(0, index - 1) : event.key === "Home" ? 0 : event.key === "End" ? links.length - 1 : -1;
      if (next < 0) return;
      event.preventDefault();
      links[next].focus({ preventScroll: true });
    };
    element.addEventListener("change", update);
    element.addEventListener("keydown", navigate);
    update();
    return () => {
      element.removeEventListener("change", update);
      element.removeEventListener("keydown", navigate);
    };
  }, [coordinator]);

  return <div ref={root} data-work-inspector>{children}</div>;
}
