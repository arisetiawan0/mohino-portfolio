import type { Mode } from "@/content/types";

export const WIDTH = 32;

export type Tone = "strong" | "muted" | "cmd";

/** Satu baris struk, maks 32 karakter. */
export type Line = {
  t: string;
  tone?: Tone;
  href?: string;
  external?: boolean;
  download?: boolean;
  /** Perintah yang dijalankan saat baris diketuk. */
  run?: string;
  /** Aksi khusus (dirakit di browser, mis. tautan WhatsApp). */
  action?: "wa";
};

export type Block =
  | { kind: "text"; text: string; tone?: Tone; align?: "left" | "center" }
  | { kind: "rule" }
  | { kind: "blank" }
  | { kind: "list"; items: string[]; tone?: Tone }
  | { kind: "leader-list"; rows: { left: string; right: string; run?: string; tone?: Tone; sub?: string; subRun?: string }[] }
  | { kind: "cols"; rows: { left: string; right: string; tone?: Tone }[]; leftWidth: number }
  | { kind: "links"; items: { label: string; href?: string; external?: boolean; download?: boolean; run?: string; action?: "wa" }[] }
  | { kind: "stamp"; text: string; variant: StampVariant };

export type StampVariant = "open" | "void" | "paid";

export type Entry = {
  id: number;
  lines: Line[];
  stamp?: { text: string; variant: StampVariant };
  /** Jumlah baris yang sudah tercetak. */
  revealed: number;
};

export type Effect =
  | { type: "setMode"; mode: Mode }
  | { type: "navigate"; href: string }
  | { type: "download"; href: string }
  | { type: "print" }
  | { type: "clear" }
  | { type: "voidLast" }
  | { type: "scrollTo"; id: string }
  | { type: "opened"; slug: string };

export type CommandResult = {
  blocks: Block[];
  effects: Effect[];
  suggestions: string[];
};
