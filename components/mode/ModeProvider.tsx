"use client";

import type { Lang, Mode } from "@/content/types";
import { isMode } from "@/lib/i18n";
import { track } from "@/lib/track";
import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

type ModeCtx = { mode: Mode; setMode: (m: Mode) => void; lang: Lang; /** true setelah ?peran= terbaca. */ ready: boolean };

const Ctx = createContext<ModeCtx | null>(null);

/**
 * Mode peran disimpan di URL (?peran=), tanpa localStorage (PRD 10).
 * Halaman statis dirender dengan mode dev, lalu disesuaikan setelah hidrasi.
 */
export function ModeProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("dev");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      const p = new URLSearchParams(window.location.search).get("peran");
      setModeState(isMode(p) ? p : "dev");
      setReady(true);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    track("Mode dipilih", { mode: m });
    const url = new URL(window.location.href);
    if (m === "dev") url.searchParams.delete("peran");
    else url.searchParams.set("peran", m);
    window.history.replaceState(window.history.state, "", url);
  }, []);

  // Teks varian mode dipilih lewat CSS dari atribut ini (lihat ModeText).
  // Baru ditulis setelah URL terbaca; sebelum itu atribut dari skrip <head> yang berlaku.
  useEffect(() => {
    if (ready) document.documentElement.setAttribute("data-peran", mode);
  }, [mode, ready]);

  const value = useMemo(() => ({ mode, setMode, lang, ready }), [mode, setMode, lang, ready]);
  return <Ctx value={value}>{children}</Ctx>;
}

export function useMode() {
  const v = use(Ctx);
  if (!v) throw new Error("useMode harus di dalam ModeProvider");
  return v;
}
