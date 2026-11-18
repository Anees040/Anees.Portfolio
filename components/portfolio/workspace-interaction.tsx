"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function WorkspaceInteraction({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current!;
    const update = () => {
      element.dataset.atelierProject = element.querySelector<HTMLInputElement>('input[name="atelier-project"]:checked')?.value;
      element.dataset.atelierView = element.querySelector<HTMLInputElement>('input[name="atelier-view"]:checked')?.value;
    };
    element.addEventListener("change", update); update();
    return () => element.removeEventListener("change", update);
  }, []);
  return <div className="digital-atelier" ref={root} data-atelier-project="sportlynk" data-atelier-view="projects">{children}</div>;
}
