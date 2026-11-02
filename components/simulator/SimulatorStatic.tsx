import { CustomerDisplay } from "@/components/receipt/CustomerDisplay";
import { KeyButton, PrinterShell, SoftKeys } from "@/components/receipt/PrinterShell";
import { EntryView } from "@/components/receipt/ReceiptParts";
import { vfdLine } from "@/components/receipt/vfd";
import { modeOrder } from "@/content/projects";
import type { Lang } from "@/content/types";
import { dict } from "@/lib/i18n";
import { cmdName, fixedChips, profileBlocks, projectBlocks, projectSuggestions } from "./commands";
import { makeEntry } from "./format";

/**
 * Struk versi server: hasil "profil" dan "proyek" sudah tercetak.
 * Terbaca mesin pencari, pembaca layar, dan tanpa JavaScript (PRD 7.7).
 */
export function SimulatorStatic({ lang }: { lang: Lang }) {
  const s = dict(lang).sim;
  const entries = [
    makeEntry(1, cmdName(lang, "profile"), profileBlocks(lang), -1),
    makeEntry(2, cmdName(lang, "projects"), projectBlocks(lang, "dev"), -1),
  ];
  return (
    <PrinterShell
      lang={lang}
      display={
        <CustomerDisplay
          label={s.label}
          line1={vfdLine(s.vfdMode, s.vfdModes.dev)}
          line2={vfdLine(s.vfdOpened, `0 / ${modeOrder.dev.length}`)}
        />
      }
      keys={fixedChips(lang).map((c) => (
        <KeyButton key={c.cmd} cmd={c.cmd}>
          {c.label}
        </KeyButton>
      ))}
      softKeys={<SoftKeys cmds={projectSuggestions(lang, "dev")} />}
      entries={entries.map((e) => (
        <EntryView key={e.id} entry={e} ssr />
      ))}
      input={
        <div className="js-only mt-1 flex border-t border-dashed border-tinta/30 pt-2">
          <span aria-hidden className="ln ln-strong">
            {"> "}
          </span>
          <label htmlFor="sim-input" className="sr-only">
            {s.inputLabel}
          </label>
          <input
            id="sim-input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="send"
            maxLength={28}
            className="w-full min-w-0 bg-transparent font-mono text-[1em] leading-[1.35] text-tinta outline-none"
          />
        </div>
      }
    />
  );
}
