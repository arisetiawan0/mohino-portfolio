"use client";

import { useMode } from "@/components/mode/ModeProvider";
import { projectBySlug } from "@/content/projects";
import { openGroups, skillGroups } from "@/content/skills";
import type { Lang, SkillGroupId } from "@/content/types";
import { loc, projectHref } from "@/lib/i18n";
import { Fragment, useEffect, useState } from "react";

/** Skill dua kolom: keahlian di kiri, bukti di kanan. Kelompok sesuai mode terbuka (PRD 6.7). */
export function SkillGroups({ lang, evidenceLabel }: { lang: Lang; evidenceLabel: string }) {
  const { mode } = useMode();
  const [open, setOpen] = useState<SkillGroupId[]>(openGroups[mode]);

  useEffect(() => {
    setOpen(openGroups[mode]);
  }, [mode]);

  return (
    <div className="border-b border-garis">
      {skillGroups.map((g) => {
        const isOpen = open.includes(g.id);
        return (
          <details
            key={g.id}
            open={isOpen}
            onToggle={(e) => {
              const now = (e.currentTarget as HTMLDetailsElement).open;
              setOpen((o) => (now ? (o.includes(g.id) ? o : [...o, g.id]) : o.filter((x) => x !== g.id)));
            }}
            className="group border-t border-garis"
          >
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
              <span className="type-title text-xl text-kertas md:text-[1.75rem]">{loc(g.label, lang)}</span>
              <span className="flex items-center gap-4 font-mono text-sm text-kabut">
                <span>{g.skills.length}</span>
                <span aria-hidden className="relative block size-3">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-px bg-current transition-transform duration-150 group-open:scale-y-0" />
                </span>
              </span>
            </summary>
            <dl className="grid grid-cols-1 pb-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              {g.skills.map((s) => (
                <Fragment key={s.name}>
                  <dt className="border-t border-dashed border-garis pt-3 text-kertas sm:pb-3">{s.name}</dt>
                  <dd className="pb-3 text-kabut sm:border-t sm:border-dashed sm:border-garis sm:pt-3">
                    <span className="sr-only">{evidenceLabel}: </span>
                    {s.bukti.map((b, i) => {
                      const sep = i < s.bukti.length - 1 ? ", " : "";
                      if (typeof b === "string") {
                        const p = projectBySlug(b);
                        if (!p) return null;
                        return (
                          <Fragment key={b}>
                            <a
                              href={projectHref(lang, b)}
                              className="text-kabut underline decoration-garis underline-offset-4 transition-colors hover:text-kertas hover:decoration-kertas"
                            >
                              {loc(p.title, lang)}
                            </a>
                            {sep}
                          </Fragment>
                        );
                      }
                      return (
                        <Fragment key={b.id}>
                          {loc(b, lang)}
                          {sep}
                        </Fragment>
                      );
                    })}
                  </dd>
                </Fragment>
              ))}
            </dl>
          </details>
        );
      })}
    </div>
  );
}
