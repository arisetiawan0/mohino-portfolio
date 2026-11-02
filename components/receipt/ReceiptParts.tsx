import type { Lang } from "@/content/types";
import { center } from "@/components/simulator/format";
import { WIDTH, type Entry, type Line } from "@/components/simulator/types";
import { dict } from "@/lib/i18n";
import { Stamp } from "./Stamp";

/*
 * Bagian struk yang dipakai bersama oleh versi statis (SSR, tanpa JS)
 * dan simulator interaktif. Tanpa hook supaya bisa dirender di server.
 */

export function headerLines(lang: Lang): Line[] {
  const s = dict(lang).sim;
  const no = "#0001";
  return [
    { t: center(s.head), tone: "strong" },
    { t: center(s.shop) },
    { t: center(s.place), tone: "muted" },
    { t: "-".repeat(WIDTH), tone: "muted" },
    { t: s.cashier + " ".repeat(Math.max(1, WIDTH - s.cashier.length - no.length)) + no, tone: "muted" },
  ];
}

const toneClass = (l: Line) => (l.tone === "strong" || l.tone === "cmd" ? "ln ln-strong" : l.tone === "muted" ? "ln ln-muted" : "ln");

export function LineView({
  line,
  ssr,
  onRun,
  onAction,
}: {
  line: Line;
  ssr?: boolean;
  onRun?: (cmd: string) => void;
  onAction?: (action: "wa") => void;
}) {
  const cls = `${toneClass(line)}${ssr ? " ssr-line" : ""}`;
  if (line.href) {
    return (
      <div className={cls}>
        <a
          href={line.href}
          {...(line.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...(line.download ? { download: "" } : {})}
        >
          {line.t}
        </a>
      </div>
    );
  }
  if (line.action) {
    return (
      <div className={cls}>
        <a
          href="#kontak"
          onClick={
            onAction
              ? (e) => {
                  e.preventDefault();
                  onAction(line.action!);
                }
              : undefined
          }
        >
          {line.t}
        </a>
      </div>
    );
  }
  if (line.run) {
    return (
      <div className={cls}>
        <button
          type="button"
          data-cmd={line.run}
          onClick={onRun ? () => onRun(line.run!) : undefined}
          className="cursor-pointer text-left hover:underline hover:decoration-dotted"
        >
          {line.t}
        </button>
      </div>
    );
  }
  return <div className={cls}>{line.t || " "}</div>;
}

export function EntryView({
  entry,
  ssr,
  onRun,
  onAction,
}: {
  entry: Entry;
  ssr?: boolean;
  onRun?: (cmd: string) => void;
  onAction?: (action: "wa") => void;
}) {
  const visible = ssr ? entry.lines : entry.lines.slice(0, entry.revealed);
  const done = ssr || entry.revealed >= entry.lines.length;
  return (
    <div className="relative">
      {visible.map((l, i) => (
        <LineView key={i} line={l} ssr={ssr} onRun={onRun} onAction={onAction} />
      ))}
      {entry.stamp && done ? (
        <span className="pointer-events-none absolute right-1 top-[38%]">
          <Stamp animate={!ssr} rotate={entry.stamp.variant === "void" ? -12 : -8}>
            {entry.stamp.text}
          </Stamp>
        </span>
      ) : null}
    </div>
  );
}

export function PaperHeader({ lang }: { lang: Lang }) {
  return (
    <div className="mb-2 border-b border-dashed border-tinta/30 pb-2" aria-hidden>
      {headerLines(lang).map((l, i) => (
        <LineView key={i} line={l} />
      ))}
    </div>
  );
}
