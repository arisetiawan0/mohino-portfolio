"use client";

import type { Lang } from "@/content/types";
import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import type { SimulatorProps } from "./Simulator";

type Intent = { focus?: boolean; cmd?: string };

/**
 * Simulator di-hydrate saat idle (PRD 12): sebelum itu yang tampil adalah
 * struk statis dari server. Interaksi pertama (fokus, ketuk chip) langsung
 * memuat simulator dan meneruskan niat pengunjung.
 */
export function SimulatorLoader({ lang, children }: { lang: Lang; children: ReactNode }) {
  const [Sim, setSim] = useState<ComponentType<SimulatorProps> | null>(null);
  const intent = useRef<Intent | null>(null);
  const loading = useRef(false);

  const load = useCallback((why?: Intent) => {
    if (why) intent.current = { ...intent.current, ...why };
    if (loading.current) return;
    loading.current = true;
    import("./Simulator").then((m) => setSim(() => m.Simulator));
  }, []);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => load(), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => load(), 900);
    return () => window.clearTimeout(id);
  }, [load]);

  if (Sim) {
    const i = intent.current;
    return <Sim lang={lang} demo={!i} focus={i?.focus} pending={i?.cmd} />;
  }

  return (
    <div
      className="contents"
      onPointerDown={() => load({})}
      onFocusCapture={(e) => {
        if (e.target instanceof HTMLInputElement) load({ focus: true });
      }}
      onClickCapture={(e) => {
        const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-cmd]");
        if (btn?.dataset.cmd) {
          e.preventDefault();
          load({ cmd: btn.dataset.cmd });
        }
      }}
    >
      {children}
    </div>
  );
}
