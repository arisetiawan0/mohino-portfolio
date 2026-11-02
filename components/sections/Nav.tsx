import { site } from "@/content/site";
import type { Lang } from "@/content/types";
import { dict, homeHref, sectionHref } from "@/lib/i18n";
import { LangSwitch } from "./LangSwitch";
import { MobileMenu } from "./MobileMenu";

export function Nav({ lang, onHome = true, langHref }: { lang: Lang; onHome?: boolean; langHref?: Record<Lang, string> }) {
  const t = dict(lang).nav;
  const links = [
    { href: "proyek", label: t.projects },
    { href: "tentang", label: t.about },
    { href: "skill", label: t.skills },
    { href: "kontak", label: t.contact },
  ].map((l) => ({ ...l, href: onHome ? `#${l.href}` : sectionHref(lang, l.href) }));

  return (
    <header className="sticky top-0 z-40 border-b border-garis bg-teluk">
      <a href="#konten" className="sr-only-focusable absolute left-4 top-3 z-50 bg-kertas px-3 py-2 text-sm text-tinta">
        {t.skipMain}
      </a>
      <nav className="wrap flex h-16 items-center gap-6" aria-label="Utama">
        <a href={homeHref(lang)} className="type-title mr-auto text-lg text-kertas" style={{ fontStretch: "75%" }}>
          {site.name}
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="inline-flex min-h-11 items-center px-3 text-sm text-kabut transition-colors duration-150 hover:text-kertas"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-4 md:flex">
          <LangSwitch lang={lang} label={t.langLabel} href={langHref} />
          <a href={site.cv[lang]} download className="btn bg-promo text-tinta hover:bg-[#ffdc66]">
            {t.cv}
          </a>
        </div>
        <MobileMenu lang={lang} links={links} langHref={langHref} />
      </nav>
    </header>
  );
}
