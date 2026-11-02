import { ModeBlock } from "@/components/mode/ModeText";
import { projectsForMode } from "@/content/projects";
import type { Lang, Mode } from "@/content/types";
import { dict, loc, projectHref } from "@/lib/i18n";

/**
 * Satu bukti konkret di hero: proyek unggulan mode aktif, ditulis seperti satu
 * baris item struk. Angka tampil bergaya label harga; tanpa angka, statusnya.
 */
export function FeaturedProof({ lang, label }: { lang: Lang; label: string }) {
  return <ModeBlock render={(m) => <Item lang={lang} label={label} mode={m} />} />;
}

function Item({ lang, label, mode }: { lang: Lang; label: string; mode: Mode }) {
  const t = dict(lang);
  const p = projectsForMode(mode).top[0];
  if (!p) return null;
  const fact = p.facts?.[0];
  return (
    <a href={projectHref(lang, p.slug)} className="row-hover group block max-w-[30rem]">
      <span className="block font-mono text-xs text-kabut">{label}</span>
      <span className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="type-title shrink-0 text-xl text-kertas underline decoration-transparent decoration-1 underline-offset-[5px] transition-colors group-hover:decoration-kertas">
          {loc(p.title, lang)}
        </span>
        <span aria-hidden className="leader text-kabut" />
        {fact ? (
          <span className="ml-auto flex shrink-0 items-baseline gap-1.5">
            <span className="type-sign text-[2.25rem] leading-none text-kertas">{fact.value}</span>
            <span className="font-mono text-xs text-kabut">{loc(fact.label, lang)}</span>
          </span>
        ) : (
          <span className="ml-auto shrink-0 font-mono text-sm text-kertas">{p.status ? t.status[p.status] : p.stack[0]}</span>
        )}
      </span>
    </a>
  );
}
