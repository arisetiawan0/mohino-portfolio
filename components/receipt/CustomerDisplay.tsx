"use client";

import { memo, useEffect, useRef, useState } from "react";
import { VFD_COLS } from "./vfd";

// DSEG: spasi lebih sempit dari glyph lain, "!" = semua segmen mati selebar penuh.
// Titik lebarnya nol, jadi dibuang supaya kolom tetap rata.
const toSeg = (s: string) => s.toUpperCase().replace(/\./g, "").replace(/ /g, "!");
const GHOST = "~".repeat(VFD_COLS);

/**
 * Layar pelanggan VFD 2 baris x 20 karakter (PRD 7.1).
 * Saat teks berganti, karakter diperbarui satu per satu (30ms) dengan kedip singkat.
 */
export const CustomerDisplay = memo(function CustomerDisplay({
  line1,
  line2,
  label,
}: {
  line1: string;
  line2: string;
  label: string;
}) {
  const target = line1.padEnd(VFD_COLS).slice(0, VFD_COLS) + line2.padEnd(VFD_COLS).slice(0, VFD_COLS);
  const [shown, setShown] = useState(target);
  const [hot, setHot] = useState(-1);
  const shownRef = useRef(target);

  useEffect(() => {
    const from = shownRef.current;
    if (from === target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      shownRef.current = target;
      setShown(target);
      return;
    }
    const diff: number[] = [];
    for (let i = 0; i < target.length; i++) if (from[i] !== target[i]) diff.push(i);
    let step = 0;
    const id = window.setInterval(() => {
      if (step >= diff.length) {
        window.clearInterval(id);
        setHot(-1);
        return;
      }
      const k = diff[step++];
      const next = shownRef.current.slice(0, k) + target[k] + shownRef.current.slice(k + 1);
      shownRef.current = next;
      setShown(next);
      setHot(k);
    }, 30);
    return () => {
      window.clearInterval(id);
      shownRef.current = target;
    };
  }, [target]);

  const rows = [shown.slice(0, VFD_COLS), shown.slice(VFD_COLS)];

  return (
    <div className="vfd">
      <span className="sr-only">
        {label}: {line1.replace(/\s+/g, " ").trim()}, {line2.replace(/\s+/g, " ").trim()}.
      </span>
      {rows.map((row, r) => (
        <div key={r} className="vfd-text" aria-hidden>
          <span className="vfd-ghost">{GHOST}</span>
          {[...toSeg(row)].map((ch, i) => (
            <span key={i} className={hot === r * VFD_COLS + i ? "vfd-flicker" : undefined}>
              {ch}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
});
