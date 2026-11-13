import { ArrowUpRight, X } from "lucide-react";
import type { ReactNode } from "react";

export function WorkspacePopover({ id, title, children, href, link }: {
  id: string; title: string; children: ReactNode; href: string; link: string;
}) {
  return <div id={id} popover="auto" className="workspace-popover" role="dialog" aria-labelledby={`${id}-heading`}>
    <button type="button" className="popover-close" popoverTarget={id} popoverTargetAction="hide" aria-label="Close note" autoFocus><X size={19} strokeWidth={1.5} aria-hidden="true" /></button>
    <h3 id={`${id}-heading`}>{title}</h3>
    <p>{children}</p>
    <a href={href} className="text-link"><span>{link}</span><ArrowUpRight size={18} aria-hidden="true" /></a>
  </div>;
}
