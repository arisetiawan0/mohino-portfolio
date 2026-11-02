export type CommandId =
  | "help"
  | "profile"
  | "projects"
  | "open"
  | "skill"
  | "log"
  | "mode"
  | "contact"
  | "cv"
  | "lang"
  | "print"
  | "clear"
  | "void"
  | "pay";

/** Semua perintah menerima alias Indonesia dan Inggris (PRD 7.2). */
export const ALIASES: Record<CommandId, string[]> = {
  help: ["bantuan", "help", "?", "h"],
  profile: ["profil", "whoami", "tentang", "about", "profile"],
  projects: ["proyek", "projects", "project", "ls"],
  open: ["buka", "open"],
  skill: ["skill", "skills", "stack"],
  log: ["riwayat", "log", "history"],
  mode: ["mode"],
  contact: ["kontak", "contact"],
  cv: ["cv", "resume"],
  lang: ["bahasa", "lang", "language"],
  print: ["cetak", "print"],
  clear: ["ulang", "clear", "reset", "cls"],
  void: ["void"],
  pay: ["bayar", "pay"],
};

const LOOKUP = new Map<string, CommandId>(
  (Object.entries(ALIASES) as [CommandId, string[]][]).flatMap(([id, words]) => words.map((w) => [w, id] as const)),
);

export function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

/** Kandidat terdekat dengan jarak <= 2 (dan tidak lebih dari separuh panjang kata). */
export function closest(word: string, candidates: string[]) {
  const limit = Math.min(2, Math.floor(word.length / 2));
  let best: { value: string; d: number } | null = null;
  for (const c of candidates) {
    if (c.length < 2) continue;
    const d = levenshtein(word, c);
    if (d <= limit && (!best || d < best.d)) best = { value: c, d };
  }
  return best?.value ?? null;
}

export type Parsed =
  | { ok: true; id: CommandId; args: string[]; word: string }
  | { ok: false; word: string; suggestion: CommandId | null };

export function parse(raw: string): Parsed | null {
  const input = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!input) return null;
  if (input === "sudo hire ari" || input === "sudo hire") return { ok: true, id: "pay", args: [], word: "sudo" };

  const [word, ...args] = input.split(" ");
  const id = LOOKUP.get(word);
  if (id) return { ok: true, id, args, word };

  const near = closest(word, [...LOOKUP.keys()]);
  return { ok: false, word, suggestion: near ? (LOOKUP.get(near) ?? null) : null };
}
