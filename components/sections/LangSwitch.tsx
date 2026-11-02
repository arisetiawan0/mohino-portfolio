"use client";

import type { Lang } from "@/content/types";
import { useMode } from "@/components/mode/ModeProvider";
import { homeHref, withMode } from "@/lib/i18n";

/** ID | EN. Mode peran ikut terbawa saat pindah bahasa. */
export function LangSwitch({ lang, label, href }: { lang: Lang; label: string; href?: Record<Lang, string> }) {
  const { mode } = useMode();
  const target = (l: Lang) => withMode(href?.[l] ?? homeHref(l), mode);
  return (
    <div className="flex items-center font-mono text-sm" role="group" aria-label={label}>
      {(["id", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 ? (
            <span aria-hidden className="px-1 text-garis">
              |
            </span>
          ) : null}
          {l === lang ? (
            <span aria-current="true" className="inline-flex min-h-11 items-center px-1 text-kertas underline decoration-1 underline-offset-[6px]">
              {l.toUpperCase()}
            </span>
          ) : (
            <a
              href={target(l)}
              hrefLang={l}
              lang={l}
              className="inline-flex min-h-11 items-center px-1 text-kabut transition-colors duration-150 hover:text-kertas"
            >
              {l.toUpperCase()}
            </a>
          )}
        </span>
      ))}
    </div>
  );
}
