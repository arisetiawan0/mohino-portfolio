import type { Mode } from "@/content/types";
import { MODES } from "@/lib/i18n";
import type { ReactNode } from "react";

/**
 * Teks yang berubah sesuai mode. Ketiga varian dirender di server; CSS memilih
 * yang aktif dari <html data-peran>, jadi tidak ada kedipan saat halaman dibuka
 * lewat ?peran=. Tanpa JavaScript, varian developer yang tampil.
 */
export function ModeText({ values }: { values: Record<Mode, ReactNode> }) {
  return (
    <>
      {MODES.map((m) => (
        <span key={m} data-variant={m}>
          {values[m]}
        </span>
      ))}
    </>
  );
}

/** Versi blok: tiap varian dibungkus div. */
export function ModeBlock({ render, className }: { render: (m: Mode) => ReactNode; className?: string }) {
  return (
    <>
      {MODES.map((m) => (
        <div key={m} data-variant={m} className={className}>
          {render(m)}
        </div>
      ))}
    </>
  );
}
