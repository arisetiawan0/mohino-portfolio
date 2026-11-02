import en from "@/content/en";
import id, { type Dict } from "@/content/id";
import type { L, Lang, Mode } from "@/content/types";

export const dicts: Record<Lang, Dict> = { id, en };
export const dict = (lang: Lang) => dicts[lang];
export const loc = (value: L, lang: Lang) => value[lang];

export const MODES: Mode[] = ["dev", "ai", "marketing"];
export const isMode = (v: unknown): v is Mode => typeof v === "string" && (MODES as string[]).includes(v);

export const homeHref = (lang: Lang) => (lang === "id" ? "/" : "/en");
export const projectHref = (lang: Lang, slug: string) =>
  lang === "id" ? `/proyek/${slug}` : `/en/projects/${slug}`;
export const sectionHref = (lang: Lang, hash: string) => `${homeHref(lang)}#${hash}`;

/** Mempertahankan ?peran= saat pindah bahasa. */
export const withMode = (href: string, mode: Mode | null) => {
  if (!mode || mode === "dev") return href;
  const [path, hash] = href.split("#");
  return `${path}?peran=${mode}${hash ? `#${hash}` : ""}`;
};
