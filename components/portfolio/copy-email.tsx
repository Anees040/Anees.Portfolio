"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, Copy } from "lucide-react";

const subscribe = () => () => {};

export function CopyEmail({ email }: { email: string }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [state, setState] = useState<"ready" | "copying" | "copied" | "error">("ready");
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; clearTimeout(timeout.current); }; }, []);
  const copy = async () => {
    clearTimeout(timeout.current); setState("copying");
    try {
      await navigator.clipboard.writeText(email);
      if (!mounted.current) return;
      setState("copied"); timeout.current = setTimeout(() => setState("ready"), 5000);
    } catch { if (mounted.current) setState("error"); }
  };
  return <div className="contact-copy-control">{hydrated && <button type="button" className="contact-copy" onClick={copy} disabled={state === "copying"} aria-describedby="email-copy-status">{state === "copied" ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}{state === "copied" ? "Email copied" : state === "copying" ? "Copying…" : "Copy email"}</button>}<p id="email-copy-status" className="contact-copy-status" role="status">{state === "copied" ? "Copied. Ready for your email app." : state === "error" ? "Copy unavailable. Select the address above, or use Write to Anees." : ""}</p></div>;
}
