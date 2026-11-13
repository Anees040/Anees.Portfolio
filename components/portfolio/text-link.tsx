import { ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type TextLinkProps = ComponentProps<"a"> & { children: ReactNode };
export function TextLink({ children, className = "", ...props }: TextLinkProps) {
  return <a className={`text-link ${className}`} {...props}><span>{children}</span><ArrowUpRight size={18} strokeWidth={1.6} aria-hidden="true" /></a>;
}
