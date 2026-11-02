"use client";

import type { Mode } from "@/content/types";
import { MODES } from "@/lib/i18n";
import { useId } from "react";
import { useMode } from "./ModeProvider";

/** Segmented control teks biasa, bukan kartu (PRD 6.3). Radio asli: keyboard jalan sendiri. */
export function ModeSwitch({ label, names }: { label: string; names: Record<Mode, string> }) {
  const { mode, setMode } = useMode();
  const id = useId();

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span id={`${id}-label`} className="text-xs text-kabut">
        {label}
      </span>
      <div role="radiogroup" aria-labelledby={`${id}-label`} className="-mx-1 flex flex-wrap">
        {MODES.map((m) => (
          <label key={m} className="relative cursor-pointer">
            <input
              type="radio"
              name={`${id}-mode`}
              value={m}
              checked={mode === m}
              onChange={() => setMode(m)}
              className="peer sr-only"
            />
            {/* Gaya aktif dari <html data-peran> (CSS), jadi benar sejak paint pertama. */}
            <span
              data-opt={m}
              className="mode-opt relative inline-flex min-h-11 items-center px-2.5 text-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-promo"
            >
              {names[m]}
              <span aria-hidden className="mode-bar absolute inset-x-2.5 bottom-1.5 h-0.5 origin-left bg-kertas" />
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
