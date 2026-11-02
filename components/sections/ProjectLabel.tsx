import { Barcode } from "@/components/receipt/Barcode";
import { Stamp } from "@/components/receipt/Stamp";
import type { Lang, Project } from "@/content/types";
import { dict, loc } from "@/lib/i18n";

const up = (s: string) => s.toLocaleUpperCase("id-ID");
const RULE = "-".repeat(60);

/**
 * Pratinjau proyek di samping daftar. Bila ada tangkapan layar asli, tampilkan itu.
 * Bila belum, tampil sebagai struk proyek mini: tidak mengulang judul (judul sudah
 * ada di baris daftar), melainkan stack, status, peran, angka, dan barcode slug.
 */
export function ProjectLabel({ project, lang }: { project: Project; lang: Lang }) {
  const img = project.images[0];
  if (img) {
    return (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.src}
          alt={loc(img.alt, lang)}
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] w-full object-cover object-top"
        />
        {img.caption ? <figcaption className="mt-2 font-mono text-xs text-kabut">{loc(img.caption, lang)}</figcaption> : null}
      </figure>
    );
  }

  const t = dict(lang);
  const c = t.caseStudy;
  const fact = project.facts?.[0];

  return (
    <div aria-hidden className="relative ml-auto w-full max-w-[21rem] -rotate-1">
      <div className="tepi-bawah bg-kertas px-5 pb-8 pt-5 font-mono text-[0.8125rem] leading-[1.45] text-tinta">
        <p className="text-center font-bold">{c.receiptHead}</p>
        <p className="my-2 overflow-hidden whitespace-nowrap text-tinta/40">{RULE}</p>
        <dl className="space-y-1">
          <Row k={up(c.stack)} v={project.stack.join(", ")} />
          {project.status ? <Row k={up(c.statusLabel)} v={t.sim.statusShort[project.status]} /> : null}
          <Row k={up(c.tags)} v={project.tags.map((x) => t.modes[x]).join(", ")} />
        </dl>
        <p className="my-2 overflow-hidden whitespace-nowrap text-tinta/40">{RULE}</p>
        {fact ? (
          <>
            {/* Angka tampil sebagai baris TOTAL struk. */}
            <p className="flex items-end justify-between gap-4 font-bold">
              <span className="max-w-[12ch] leading-tight">{up(loc(fact.label, lang))}</span>
              <span className="type-sign text-[2.75rem] leading-[0.85]">{fact.value}</span>
            </p>
            <p className="my-2 overflow-hidden whitespace-nowrap text-tinta/40">{RULE}</p>
          </>
        ) : null}
        <Barcode value={project.slug} className="mt-3 w-full text-tinta" height={34} />
      </div>
      {project.status ? (
        <span className="pointer-events-none absolute right-5 top-[4.75rem]">
          <Stamp rotate={-10} size="0.95rem">
            {t.sim.statusShort[project.status]}
          </Stamp>
        </span>
      ) : null}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2">
      <dt className="text-tinta/60">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
