"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function WorkspaceInteraction({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const notes = root.current!.querySelectorAll<HTMLElement>("[popover]");
    const update = () => {
      const state = Array.from(notes).some(note => note.matches(":popover-open")) ? "working" : "idle";
      document.dispatchEvent(new CustomEvent("atelier:character", { detail: { state, scene: "workspace" } }));
    };
    notes.forEach(note => note.addEventListener("toggle", update));
    return () => notes.forEach(note => note.removeEventListener("toggle", update));
  }, []);
  return <div className="workspace-interaction" ref={root}>{children}</div>;
}
