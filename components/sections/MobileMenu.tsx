"use client";

import { site } from "@/content/site";
import type { Lang } from "@/content/types";
import { dict } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";
import { LangSwitch } from "./LangSwitch";

/** Menu penuh layar untuk mobile (PRD 6.2). */
export function MobileMenu({
  lang,
  links,
  langHref,
}: {
  lang: Lang;
  links: { href: string; label: string }[];
  langHref?: Record<Lang, string>;
}) {
  const t = dict(lang).nav;
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls="menu-mobile"
        onClick={() => setOpen((o) => !o)}
        className="relative z-50 inline-flex min-h-11 items-center gap-2 px-1 text-sm text-kertas"
      >
        <span aria-hidden className="flex w-5 flex-col gap-[5px]">
          <span className={`h-0.5 bg-current transition-transform duration-150 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-0.5 bg-current transition-transform duration-150 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </span>
        {open ? t.close : t.menu}
      </button>
      <div
        id="menu-mobile"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-teluk"
      >
        <div className="wrap flex min-h-full flex-col pb-10 pt-6">
          <ul className="border-t border-garis">
            {links.map((l) => (
              <li key={l.href} className="border-b border-garis">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="type-sign flex min-h-16 items-center text-[2.75rem] text-kertas"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between gap-4 pt-10">
            <LangSwitch lang={lang} label={t.langLabel} href={langHref} />
            <a href={site.cv[lang]} download className="btn bg-promo text-tinta">
              {t.cv}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
