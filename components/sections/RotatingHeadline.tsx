"use client";

import { useMode } from "@/components/mode/ModeProvider";
import type { Mode } from "@/content/types";
import { MODES } from "@/lib/i18n";
import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/** Jeda sebelum pergantian pertama (struk sedang mencetak demo) dan antar-pergantian. */
const FIRST_HOLD = 4200;
const HOLD = 3600;

type Rotation = {
  active: Mode | null;
  prev: Mode | null;
  paused: boolean;
  /** false saat reduced motion atau sebelum hidrasi: judul diam. */
  enabled: boolean;
  toggle: () => void;
};

const Ctx = createContext<Rotation | null>(null);

/**
 * Status rotasi judul hero. Urutan dev, ai, marketing berputar mulai dari mode aktif;
 * memilih mode lain langsung melompat ke peran itu dan memulai hitungan ulang.
 */
export function RotationProvider({ children }: { children: ReactNode }) {
  const { mode, ready } = useMode();
  const [active, setActive] = useState<Mode | null>(null);
  const [prev, setPrev] = useState<Mode | null>(null);
  const [paused, setPaused] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [nudge, setNudge] = useState(0);
  const activeRef = useRef<Mode | null>(null);

  const go = useCallback((next: Mode) => {
    const cur = activeRef.current;
    if (cur === next) return;
    activeRef.current = next;
    setPrev(cur);
    setActive(next);
  }, []);

  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Ikuti mode: pertama kali tanpa animasi, selanjutnya animasi ke peran yang dipilih.
  useEffect(() => {
    if (!ready) return;
    if (activeRef.current === null) {
      activeRef.current = mode;
      setActive(mode);
    } else {
      go(mode);
    }
  }, [mode, ready, go]);

  useEffect(() => {
    if (!active || paused || !enabled) return;
    const id = window.setTimeout(
      () => {
        // Tab tersembunyi: tunda, jangan berputar tanpa ada yang melihat.
        if (document.hidden) return setNudge((n) => n + 1);
        go(MODES[(MODES.indexOf(active) + 1) % MODES.length]);
      },
      prev === null ? FIRST_HOLD : HOLD,
    );
    return () => window.clearTimeout(id);
  }, [active, prev, paused, enabled, go, nudge]);

  const toggle = useCallback(() => setPaused((p) => !p), []);
  const value = useMemo(() => ({ active, prev, paused, enabled, toggle }), [active, prev, paused, enabled, toggle]);
  return <Ctx value={value}>{children}</Ctx>;
}

function useRotation() {
  const v = use(Ctx);
  if (!v) throw new Error("useRotation harus di dalam RotationProvider");
  return v;
}

/**
 * Tiga baris judul yang bergantian. Ketiga varian ditumpuk di sel grid yang sama,
 * jadi ruangnya selalu seukuran varian terpanjang: tidak ada pergeseran tata letak.
 * Sebelum hidrasi, varian dipilih CSS dari <html data-peran>.
 */
export function RotatingLines({ lines, lead }: { lines: Record<Mode, string[]>; lead: string }) {
  const { mode } = useMode();
  const { active, prev } = useRotation();
  const count = Math.max(...MODES.map((m) => lines[m].length));

  const state = (m: Mode) => {
    if (!active) return "";
    if (m === active) return prev === null ? "is-still" : "is-in";
    if (m === prev) return "is-out";
    return "";
  };

  return (
    <>
      {/* Pembaca layar mendapat kalimat utuh peran yang dipilih, tanpa ikut berputar. */}
      <span className="sr-only">
        {lead} {lines[mode].join(" ")}
      </span>
      <span aria-hidden className="rot block" data-live={active ? "" : undefined}>
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="rot-slot">
            {MODES.map((m) => (
              <span
                key={m}
                data-rot={m}
                className={`rot-item ${state(m)}`}
                style={{ "--i": i } as React.CSSProperties}
              >
                {lines[m][i] ?? ""}
              </span>
            ))}
          </span>
        ))}
      </span>
    </>
  );
}

/** Tombol jeda: wajib untuk konten bergerak lebih dari 5 detik (WCAG 2.2.2). */
export function RotationControl({
  pause,
  play,
  pauseLabel,
  playLabel,
}: {
  pause: string;
  play: string;
  pauseLabel: string;
  playLabel: string;
}) {
  const { active, paused, enabled, toggle } = useRotation();
  if (!enabled || !active) return null;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      aria-label={paused ? playLabel : pauseLabel}
      className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2.5 font-mono text-xs text-kabut transition-colors hover:text-kertas"
    >
      <span aria-hidden className="flex gap-1">
        {MODES.map((m) => (
          <span
            key={m}
            className={`h-[3px] w-4 transition-colors duration-300 ${m === active ? "bg-kertas" : "bg-garis"}`}
          />
        ))}
      </span>
      <span aria-hidden>{paused ? play : pause}</span>
    </button>
  );
}
