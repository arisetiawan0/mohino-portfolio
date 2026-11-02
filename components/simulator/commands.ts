import { log } from "@/content/log";
import { modeOrder, projectBySlug, projects, projectsForMode } from "@/content/projects";
import { site } from "@/content/site";
import { openGroups, skillGroups } from "@/content/skills";
import type { Lang, Mode, Project } from "@/content/types";
import { dict, homeHref, isMode, loc, projectHref, withMode } from "@/lib/i18n";
import { closest, parse, type CommandId } from "./parser";
import type { Block, CommandResult } from "./types";

export type Ctx = { lang: Lang; mode: Mode; opened: string[]; historyCount: number };

const upper = (s: string) => s.toLocaleUpperCase("id-ID");

/** Nama perintah kanonik dalam bahasa aktif, untuk chip dan saran. */
export const cmdName = (lang: Lang, id: CommandId) => dict(lang).sim.cmd[id];

function projectRow(p: Project, lang: Lang) {
  const d = dict(lang).sim;
  const status = p.status ? d.statusShort[p.status] : "";
  const open = `${cmdName(lang, "open")} ${p.slug}`;
  return { left: loc(p.title, lang), right: status, run: open, sub: p.slug, subRun: open };
}

export function profileBlocks(lang: Lang): Block[] {
  const d = dict(lang).sim.profile;
  return [
    { kind: "rule" },
    { kind: "text", text: upper(site.name), tone: "strong" },
    { kind: "text", text: d.role },
    { kind: "rule" },
    { kind: "text", text: d.fieldsTitle, tone: "strong" },
    { kind: "list", items: d.fields },
    { kind: "text", text: d.edu },
    { kind: "rule" },
    { kind: "text", text: d.next, tone: "muted" },
  ];
}

export function projectBlocks(lang: Lang, mode: Mode, all = false): Block[] {
  const d = dict(lang).sim;
  const { top, rest } = projectsForMode(mode);
  const list = all ? [...top, ...rest] : top;
  // Proyek tanpa status cukup judulnya saja, tanpa leader.
  const rows = list.map((p) => projectRow(p, lang));
  const blocks: Block[] = [
    { kind: "rule" },
    { kind: "text", text: all ? d.projects.all : `${d.projects.title}: ${d.vfdModes[mode]}`, tone: "strong" },
    { kind: "rule" },
    { kind: "leader-list", rows },
    { kind: "rule" },
  ];
  if (!all && rest.length) blocks.push({ kind: "text", text: d.projects.more(rest.length), tone: "muted" });
  blocks.push({ kind: "text", text: d.projects.next, tone: "muted" });
  return blocks;
}

function openBlocks(lang: Lang, mode: Mode, slug: string | undefined): CommandResult {
  const d = dict(lang).sim;
  if (!slug) {
    const examples = modeOrder[mode].slice(0, 3);
    return {
      blocks: [{ kind: "text", text: d.open.missingArg }, { kind: "list", items: examples.map((s) => `${cmdName(lang, "open")} ${s}`) }],
      effects: [],
      suggestions: examples.map((s) => `${cmdName(lang, "open")} ${s}`),
    };
  }
  const p = projectBySlug(slug);
  if (!p) {
    const near = closest(slug, projects.map((x) => x.slug)) ?? closestBySubstring(slug);
    const blocks: Block[] = [{ kind: "text", text: d.open.notFound(slug) }];
    if (near) blocks.push({ kind: "text", text: d.suggest(`${cmdName(lang, "open")} ${near}`) });
    return { blocks, effects: [], suggestions: near ? [`${cmdName(lang, "open")} ${near}`] : [cmdName(lang, "projects")] };
  }

  const blocks: Block[] = [
    { kind: "rule" },
    { kind: "text", text: upper(loc(p.title, lang)), tone: "strong" },
    { kind: "text", text: p.stack.join(", "), tone: "muted" },
    { kind: "rule" },
    { kind: "text", text: loc(p.summary, lang) },
  ];
  if (p.facts?.length) {
    blocks.push({ kind: "leader-list", rows: p.facts.map((f) => ({ left: loc(f.label, lang), right: f.value })) });
  }
  if (p.status) blocks.push({ kind: "leader-list", rows: [{ left: d.open.status, right: d.statusShort[p.status] }] });
  if (p.statusNote) blocks.push({ kind: "text", text: loc(p.statusNote, lang), tone: "muted" });
  blocks.push({ kind: "rule" });
  blocks.push({ kind: "links", items: [{ label: d.open.caseLink, href: projectHref(lang, p.slug) }] });
  blocks.push({ kind: "stamp", text: d.open.stamp, variant: "open" });

  const order = modeOrder[mode];
  const idx = order.indexOf(p.slug);
  const nextSlug = idx >= 0 ? order[(idx + 1) % order.length] : order[0];
  return {
    blocks,
    effects: [{ type: "opened", slug: p.slug }],
    suggestions: [`${cmdName(lang, "open")} ${nextSlug}`, cmdName(lang, "contact")],
  };
}

function closestBySubstring(q: string) {
  return projects.find((p) => p.slug.includes(q) || q.includes(p.slug.split("-")[0]))?.slug ?? null;
}

function skillBlocks(lang: Lang, mode: Mode, all: boolean): Block[] {
  const d = dict(lang).sim;
  const open = all ? skillGroups.map((g) => g.id) : openGroups[mode];
  const groups = skillGroups.filter((g) => open.includes(g.id));
  const closed = skillGroups.filter((g) => !open.includes(g.id));
  const blocks: Block[] = [
    { kind: "rule" },
    { kind: "text", text: all ? d.skill.title : `${d.skill.title}: ${d.vfdModes[mode]}`, tone: "strong" },
  ];
  for (const g of groups) {
    blocks.push({ kind: "rule" });
    blocks.push({ kind: "text", text: upper(loc(g.label, lang)), tone: "strong" });
    for (const s of g.skills) {
      blocks.push({ kind: "text", text: s.name });
      const proof = s.bukti.map((b) => (typeof b === "string" ? loc(projectBySlug(b)?.title ?? { id: b, en: b }, lang) : loc(b, lang)));
      blocks.push({ kind: "list", items: [proof.join(", ")], tone: "muted" });
    }
  }
  blocks.push({ kind: "rule" });
  if (closed.length) {
    blocks.push({ kind: "text", text: d.skill.others(closed.map((g) => loc(g.label, lang)).join(", ")), tone: "muted" });
    blocks.push({ kind: "text", text: d.skill.allHint, tone: "muted" });
  }
  return blocks;
}

function logBlocks(lang: Lang): Block[] {
  const d = dict(lang).sim;
  return [
    { kind: "rule" },
    { kind: "text", text: d.log.title, tone: "strong" },
    { kind: "rule" },
    { kind: "cols", leftWidth: 9, rows: log.map((e) => ({ left: e.short, right: loc(e.title, lang) })) },
  ];
}

function contactBlocks(lang: Lang, mode: Mode): Block[] {
  const d = dict(lang);
  const hasWa = Boolean(site.whatsappReversed);
  return [
    { kind: "rule" },
    { kind: "text", text: d.sim.contact.title, tone: "strong" },
    { kind: "rule" },
    {
      kind: "links",
      items: [
        { label: `${d.sim.contact.email}: ${site.email}`, href: `mailto:${site.email}` },
        hasWa ? { label: d.sim.contact.wa, action: "wa" as const } : { label: d.sim.contact.waMissing },
        { label: "LinkedIn", href: site.linkedin, external: true },
        { label: "GitHub", href: site.github, external: true },
      ],
    },
    { kind: "rule" },
    { kind: "text", text: d.contact.open[mode], tone: "muted" },
  ];
}

const MODE_INPUT: Record<string, Mode> = {
  dev: "dev",
  developer: "dev",
  ai: "ai",
  automation: "ai",
  otomasi: "ai",
  marketing: "marketing",
  mkt: "marketing",
};

/** Menjalankan satu perintah. Murni: efek samping dikembalikan sebagai daftar efek. */
export function run(raw: string, ctx: Ctx): CommandResult | null {
  const { lang, mode } = ctx;
  const d = dict(lang).sim;
  const parsed = parse(raw);
  if (!parsed) return null;

  if (!parsed.ok) {
    const blocks: Block[] = [{ kind: "text", text: d.unknown(parsed.word) }];
    const sug = parsed.suggestion ? cmdName(lang, parsed.suggestion) : null;
    blocks.push({ kind: "text", text: sug ? d.suggest(sug) : d.tryHelp, tone: "muted" });
    return { blocks, effects: [], suggestions: sug ? [sug] : [cmdName(lang, "help")] };
  }

  const { id, args } = parsed;
  const wantsAll = args[0] === "semua" || args[0] === "all" || args[0] === "-a";

  switch (id) {
    case "help":
      return {
        blocks: [
          { kind: "rule" },
          { kind: "text", text: d.help.title, tone: "strong" },
          { kind: "rule" },
          { kind: "cols", leftWidth: 16, rows: d.help.rows.map(([l, r]) => ({ left: l, right: r })) },
          { kind: "rule" },
          { kind: "text", text: d.help.foot, tone: "muted" },
        ],
        effects: [],
        suggestions: [cmdName(lang, "profile"), cmdName(lang, "projects")],
      };
    case "profile":
      return { blocks: profileBlocks(lang), effects: [], suggestions: [cmdName(lang, "projects"), cmdName(lang, "skill")] };
    case "projects":
      return { blocks: projectBlocks(lang, mode, wantsAll), effects: [], suggestions: projectSuggestions(lang, mode) };
    case "open":
      return openBlocks(lang, mode, args[0]);
    case "skill":
      return { blocks: skillBlocks(lang, mode, wantsAll), effects: [], suggestions: [cmdName(lang, "projects"), cmdName(lang, "log")] };
    case "log":
      return { blocks: logBlocks(lang), effects: [], suggestions: [cmdName(lang, "contact"), cmdName(lang, "cv")] };
    case "mode": {
      const next = args[0] ? MODE_INPUT[args[0]] : undefined;
      if (!next || !isMode(next)) {
        return {
          blocks: [{ kind: "text", text: d.mode.invalid }, { kind: "list", items: ["mode dev", "mode ai", "mode marketing"] }],
          effects: [],
          suggestions: ["mode dev", "mode ai", "mode marketing"].filter((m) => m !== `mode ${mode}`),
        };
      }
      return {
        blocks: [
          { kind: "leader-list", rows: [{ left: d.mode.changed, right: d.vfdModes[next], tone: "strong" }] },
          { kind: "text", text: d.mode.listChanged, tone: "muted" },
        ],
        effects: [{ type: "setMode", mode: next }],
        suggestions: [cmdName(lang, "projects"), cmdName(lang, "skill")],
      };
    }
    case "contact":
      return { blocks: contactBlocks(lang, mode), effects: [], suggestions: [cmdName(lang, "cv"), cmdName(lang, "print")] };
    case "cv":
      return { blocks: [{ kind: "text", text: d.cv.start }], effects: [{ type: "download", href: site.cv[lang] }], suggestions: [cmdName(lang, "contact")] };
    case "lang": {
      const target = args[0] === "en" || args[0] === "inggris" || args[0] === "english" ? "en" : args[0] === "id" || args[0] === "indonesia" ? "id" : null;
      if (!target) return { blocks: [{ kind: "text", text: d.lang.invalid }], effects: [], suggestions: ["bahasa id", "lang en"] };
      if (target === lang) return { blocks: [{ kind: "text", text: d.lang.same }], effects: [], suggestions: [] };
      return {
        blocks: [{ kind: "text", text: d.lang.switching }],
        effects: [{ type: "navigate", href: withMode(homeHref(target), mode) }],
        suggestions: [],
      };
    }
    case "print":
      return { blocks: [{ kind: "text", text: d.print.done }], effects: [{ type: "print" }], suggestions: [] };
    case "clear":
      return { blocks: [{ kind: "text", text: d.clear.tearing, tone: "muted" }], effects: [{ type: "clear" }], suggestions: [] };
    case "void":
      if (!ctx.historyCount) return { blocks: [{ kind: "text", text: d.void.empty }], effects: [], suggestions: [cmdName(lang, "help")] };
      return { blocks: [{ kind: "text", text: d.void.done }], effects: [{ type: "voidLast" }], suggestions: [cmdName(lang, "help")] };
    case "pay":
      return {
        blocks: [
          { kind: "rule" },
          { kind: "text", text: d.pay.done, tone: "strong" },
          { kind: "text", text: d.pay.opening, tone: "muted" },
          { kind: "stamp", text: d.pay.stamp, variant: "paid" },
        ],
        effects: [{ type: "scrollTo", id: "kontak" }],
        suggestions: [cmdName(lang, "contact")],
      };
  }
}

export const fixedChips = (lang: Lang) => {
  const d = dict(lang).sim;
  return [
    { label: d.chips.help, cmd: cmdName(lang, "help") },
    { label: d.chips.projects, cmd: cmdName(lang, "projects") },
    { label: d.chips.skill, cmd: cmdName(lang, "skill") },
    { label: d.chips.contact, cmd: cmdName(lang, "contact") },
  ];
};

/** Saran setelah "proyek": tiga slug teratas mode aktif. */
export const projectSuggestions = (lang: Lang, mode: Mode) =>
  modeOrder[mode].slice(0, 3).map((s) => `${cmdName(lang, "open")} ${s}`);

export const DEMO = (lang: Lang) => [cmdName(lang, "profile"), cmdName(lang, "projects")];
