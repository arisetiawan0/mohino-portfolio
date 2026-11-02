import { WIDTH, type Block, type Entry, type Line, type StampVariant, type Tone } from "./types";

/** Bungkus teks per kata ke lebar tertentu, dengan indentasi gantung. */
export function wrap(text: string, width = WIDTH, first = "", rest = first): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let cur = first;
  let empty = true;
  const flush = () => {
    out.push(cur);
    cur = rest;
    empty = true;
  };

  for (let word of words) {
    // Kata lebih panjang dari baris: potong paksa.
    while (word.length > width - rest.length) {
      if (!empty) flush();
      const room = width - cur.length;
      cur += word.slice(0, room);
      empty = false;
      word = word.slice(room);
      flush();
    }
    if (!word) continue;
    if (!empty && cur.length + 1 + word.length > width) flush();
    cur += (empty ? "" : " ") + word;
    empty = false;
  }
  if (!empty || out.length === 0) out.push(cur);
  return out;
}

export function center(text: string, width = WIDTH) {
  if (text.length >= width) return text.slice(0, width);
  const pad = Math.floor((width - text.length) / 2);
  return " ".repeat(pad) + text;
}

/** "Kiri ........ kanan". Jika tidak muat, kiri dibungkus dan kanan di baris terakhir. */
export function leader(left: string, right: string, width = WIDTH): string[] {
  const minDots = 3;
  if (left.length + right.length + minDots + 2 <= width) {
    const dots = width - left.length - right.length - 2;
    return [`${left} ${".".repeat(dots)} ${right}`];
  }
  const lines = wrap(left, width);
  const last = lines[lines.length - 1];
  if (last.length + right.length + minDots + 2 <= width) {
    lines[lines.length - 1] = `${last} ${".".repeat(width - last.length - right.length - 2)} ${right}`;
    return lines;
  }
  const dots = Math.max(minDots, width - right.length - 1);
  lines.push(`${".".repeat(dots)} ${right}`.slice(-width));
  return lines;
}

const rule = () => "-".repeat(WIDTH);

/** Blok terstruktur menjadi baris struk 32 karakter. */
export function layout(blocks: Block[]): { lines: Line[]; stamp?: { text: string; variant: StampVariant } } {
  const lines: Line[] = [];
  let stamp: { text: string; variant: StampVariant } | undefined;
  const push = (t: string, tone?: Tone, extra?: Partial<Line>) => lines.push({ t, tone, ...extra });

  for (const b of blocks) {
    switch (b.kind) {
      case "rule":
        push(rule(), "muted");
        break;
      case "blank":
        push("");
        break;
      case "text":
        if (b.align === "center") wrap(b.text).forEach((l) => push(center(l), b.tone));
        else wrap(b.text).forEach((l) => push(l, b.tone));
        break;
      case "list":
        b.items.forEach((item) => wrap(item, WIDTH, " - ", "   ").forEach((l) => push(l, b.tone)));
        break;
      case "leader-list":
        for (const row of b.rows) {
          (row.right ? leader(row.left, row.right) : wrap(row.left)).forEach((l) => push(l, row.tone, row.run ? { run: row.run } : undefined));
          if (row.sub) push(`  ${row.sub}`, "muted", row.subRun ? { run: row.subRun } : undefined);
        }
        break;
      case "cols":
        for (const row of b.rows) {
          const left = row.left.padEnd(b.leftWidth);
          const indent = " ".repeat(b.leftWidth);
          wrap(row.right, WIDTH, left, indent).forEach((l) => push(l, row.tone));
        }
        break;
      case "links":
        for (const item of b.items) {
          push(`> ${item.label}`.slice(0, WIDTH), undefined, {
            href: item.href,
            external: item.external,
            download: item.download,
            run: item.run,
            action: item.action,
          });
        }
        break;
      case "stamp":
        stamp = { text: b.text, variant: b.variant };
        break;
    }
  }
  return { lines, stamp };
}

export function makeEntry(id: number, command: string | null, blocks: Block[], revealed = 0): Entry {
  const { lines, stamp } = layout(blocks);
  const all: Line[] = command ? [{ t: `> ${command}`.slice(0, WIDTH), tone: "cmd" }, ...lines] : lines;
  return { id, lines: all, stamp, revealed: revealed < 0 ? all.length : revealed };
}
