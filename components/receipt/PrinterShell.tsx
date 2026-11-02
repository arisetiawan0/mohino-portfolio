import type { Lang } from "@/content/types";
import { dict } from "@/lib/i18n";
import type { ReactNode, Ref } from "react";
import { PaperHeader } from "./ReceiptParts";

/**
 * Kerangka mesin kasir: badan (LED, layar pelanggan, keypad, saran), slot, kertas.
 * Dipakai versi statis dan interaktif supaya geometri identik (CLS = 0).
 */
export function PrinterShell({
  lang,
  aside,
  busy,
  display,
  keys,
  softKeys,
  feedClass = "",
  paperKey,
  tiltRef,
  shadowRef,
  logRef,
  entries,
  input,
}: {
  lang: Lang;
  /** Sisi kanan baris atas badan mesin (mis. tombol lewati demo). */
  aside?: ReactNode;
  busy?: boolean;
  display: ReactNode;
  keys: ReactNode;
  softKeys: ReactNode;
  feedClass?: string;
  paperKey?: number;
  tiltRef?: Ref<HTMLDivElement>;
  shadowRef?: Ref<HTMLDivElement>;
  logRef?: Ref<HTMLDivElement>;
  entries: ReactNode;
  input: ReactNode;
}) {
  const s = dict(lang).sim;
  return (
    <div className="printer" id="simulator">
      <div className="pos">
        <div className="mb-2.5 flex min-h-7 items-center justify-between gap-4 px-0.5 text-xs text-kabut">
          <span className="flex items-center gap-2.5">
            <span aria-hidden className="pos-led" data-on={busy ? "true" : "false"} />
            {s.hint}
          </span>
          {aside}
        </div>
        {display}
        <div className="mt-3 grid grid-cols-4 gap-1.5" role="group" aria-label={s.chipsLabel}>
          {keys}
        </div>
        <div className="softkeys mt-1" role="group" aria-label={s.suggestLabel}>
          {softKeys}
        </div>
        <div className="slot" aria-hidden />
      </div>
      <div className="paper-stage">
        <div key={paperKey} className={feedClass}>
          <div className="paper-tilt" ref={tiltRef}>
            <div className="paper-shadow" ref={shadowRef} aria-hidden />
            <div className="paper tepi-bawah">
              <PaperHeader lang={lang} />
              <div
                ref={logRef}
                className="paper-log"
                role="log"
                aria-label={s.logLabel}
                aria-busy={busy || undefined}
                tabIndex={0}
              >
                {entries}
              </div>
              {input}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Baris saran. Bila semua saran berawalan sama (mis. "buka"), awalan ditulis
 * sekali sebagai label dan tombol cukup berisi slug, supaya muat satu baris.
 */
export function SoftKeys({ cmds, onRun }: { cmds: string[]; onRun?: (cmd: string) => void }) {
  const first = cmds[0]?.split(" ")[0];
  const shared = cmds.length > 1 && cmds.every((c) => c.includes(" ") && c.split(" ")[0] === first) ? first : null;
  return (
    <>
      {shared ? (
        <span aria-hidden className="flex-none pr-1 font-mono text-xs text-kabut/80">
          {shared}
        </span>
      ) : null}
      {cmds.map((c) => (
        <KeyButton key={c} cmd={c} onRun={onRun} soft label={shared ? c : undefined}>
          {shared ? c.slice(shared.length + 1) : c}
        </KeyButton>
      ))}
    </>
  );
}

/** Tombol keypad (perintah tetap) atau softkey (saran lanjutan). */
export function KeyButton({
  children,
  cmd,
  onRun,
  soft,
  label,
}: {
  children: ReactNode;
  cmd: string;
  onRun?: (cmd: string) => void;
  soft?: boolean;
  /** Nama aksesibel lengkap bila teks tombol dipendekkan. */
  label?: string;
}) {
  return (
    <button
      type="button"
      data-cmd={cmd}
      aria-label={label}
      onClick={onRun ? () => onRun(cmd) : undefined}
      className={soft ? "softkey" : "key"}
    >
      {children}
    </button>
  );
}
