"use client";

import { trackLink } from "@/lib/track";
import { useEffect } from "react";

/** Satu pendengar klik untuk semua tautan (kontak, CV, case study), termasuk tautan di struk. */
export function LinkTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (a instanceof HTMLAnchorElement) trackLink(a);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
