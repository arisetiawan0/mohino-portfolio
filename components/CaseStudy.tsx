import { CaseToc } from "@/components/CaseToc";
import { Barcode } from "@/components/receipt/Barcode";
import { QrCode } from "@/components/receipt/QrCode";
import { absUrl } from "@/lib/links";
import { Stamp } from "@/components/receipt/Stamp";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";
import { projects } from "@/content/projects";
import type { L, Lang, Project } from "@/content/types";
import { dict, homeHref, loc, projectHref } from "@/lib/i18n";
import type { ReactNode } from "react";

const DEV = process.env.NODE_ENV === "development";
const RULE = "-".repeat(60);

type SectionId = "masalah" | "peran" | "solusi" | "keputusan" | "hasil" | "tantangan" | "tautan";

/**
 * Case study (PRD 6.5). Layar pertama langsung menjawab "apa ini, statusnya apa":
 * kepala struk di kiri, ringkasan dan angka di kanan. Di bawahnya satu kolom 68ch
 * dengan daftar isi sebagai anotasi samping. Bagian tanpa isi disembunyikan di
 * versi publik dan tampil sebagai penanda "Belum diisi" saat development.
 */
export function CaseStudy({ lang, project: p }: { lang: Lang; project: Project }) {
  const t = dict(lang);
  const c = t.caseStudy;
  const cs = p.caseStudy;
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];
  const other: Lang = lang === "id" ? "en" : "id";
  const up = (s: string) => s.toLocaleUpperCase("id-ID");
  const [firstImage, ...moreImages] = p.images;
  const hasLinks = Boolean(p.links?.demo || p.links?.github);

  // Bagian yang tampil, dipakai juga untuk daftar isi.
  const shown: Record<SectionId, boolean> = {
    masalah: Boolean(cs.masalah) || DEV,
    peran: Boolean(cs.peran) || DEV,
    solusi: Boolean(cs.solusi || cs.arsitektur) || DEV,
    keputusan: Boolean(cs.keputusan?.length) || DEV,
    hasil: Boolean(cs.hasil) || DEV,
    tantangan: Boolean(cs.tantangan) || DEV,
    tautan: hasLinks,
  };
  const toc = (Object.keys(shown) as SectionId[])
    .filter((id) => shown[id])
    .map((id) => ({ id, label: c.sections[id] }));

  return (
    <>
      <Nav
        lang={lang}
        onHome={false}
        langHref={{ [lang]: projectHref(lang, p.slug), [other]: projectHref(other, p.slug) } as Record<Lang, string>}
      />
      <main id="konten" className="pb-[var(--section)]">
        <div className="wrap pt-8 md:pt-12">
          <a
            href={`${homeHref(lang)}#proyek`}
            className="inline-flex min-h-11 items-center font-mono text-sm text-kabut underline decoration-garis underline-offset-[6px] hover:text-kertas"
          >
            {c.back}
          </a>
        </div>

        {/* Layar pertama: kepala struk + ringkasan. */}
        <header className="wrap mt-6 grid grid-cols-1 items-start gap-12 lg:mt-8 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-5">
            <div className="tepi-bawah w-full max-w-[25rem] -rotate-1 bg-kertas px-6 pb-9 pt-6 font-mono text-sm leading-[1.45] text-tinta sm:px-7">
              <p aria-hidden className="text-center font-bold">
                {c.receiptHead}
              </p>
              <p aria-hidden className="my-2 overflow-hidden whitespace-nowrap text-tinta/40">
                {RULE}
              </p>
              <h1 className="type-sign mt-3 text-[clamp(2.5rem,5vw,3.5rem)] uppercase text-balance">{loc(p.title, lang)}</h1>
              <dl className="mt-5 space-y-1">
                <Row k={up(c.stack)} v={p.stack.join(", ")} />
                {p.status ? <Row k={up(c.statusLabel)} v={up(t.status[p.status])} /> : null}
                <Row k={up(c.tags)} v={p.tags.map((x) => t.modes[x]).join(", ")} />
              </dl>
              <p aria-hidden className="my-3 overflow-hidden whitespace-nowrap text-tinta/40">
                {RULE}
              </p>
              {/* Desktop: QR ke halaman ini untuk lanjut membaca di HP. HP: barcode slug. */}
              <div className="hidden items-center gap-4 md:flex">
                <QrCode value={absUrl(projectHref(lang, p.slug))} label={c.qrLabel} className="size-24 shrink-0 text-tinta" />
                <div>
                  <p className="font-bold leading-snug">{c.scanToOpen}</p>
                  <p className="mt-1 text-xs text-tinta/60">{p.slug}</p>
                </div>
              </div>
              <Barcode value={p.slug} className="w-full max-w-[16rem] text-tinta md:hidden" height={40} />
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            <p className="font-mono text-xs text-kabut">{c.sections.ringkasan}</p>
            <p className="type-title mt-3 text-[1.75rem] text-balance text-kertas md:text-[2.25rem]">{loc(p.summary, lang)}</p>
            {p.statusNote ? <p className="mt-4 max-w-[52ch] leading-relaxed text-kabut">{loc(p.statusNote, lang)}</p> : null}

            {p.facts?.length ? (
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-garis pt-6">
                {p.facts.map((f) => (
                  <div key={f.value} className="flex flex-col-reverse gap-1">
                    <dt className="text-sm text-kabut">{loc(f.label, lang)}</dt>
                    <dd className="type-sign text-[clamp(2.75rem,5vw,3.75rem)] text-kertas">{f.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {hasLinks ? <Links p={p} c={c} className="mt-8" /> : null}

            {toc.length ? (
              <a
                href={`#${toc[0].id}`}
                className="mt-8 inline-flex min-h-11 items-center text-sm text-kertas underline decoration-garis underline-offset-[6px] hover:decoration-kertas"
              >
                {c.readOn}
              </a>
            ) : null}
          </div>
        </header>

        <div className="wrap mt-20 grid grid-cols-1 gap-12 md:mt-28 lg:grid-cols-12 lg:gap-x-6">
          <article className="measure lg:col-span-7">
            {firstImage ? (
              <Shot img={firstImage} lang={lang} />
            ) : DEV ? (
              <div className="mb-14">
                <Pending label={c.noScreenshot} />
              </div>
            ) : null}

            {shown.masalah ? <Text id="masalah" title={c.sections.masalah} value={cs.masalah} lang={lang} pending={c.pending} /> : null}
            {shown.peran ? <Text id="peran" title={c.sections.peran} value={cs.peran} lang={lang} pending={c.pending} /> : null}

            {shown.solusi ? (
              <Block id="solusi" title={c.sections.solusi}>
                {cs.solusi ? <p>{loc(cs.solusi, lang)}</p> : <Pending label={c.pending} />}
                {cs.arsitektur ? <Diagram kolom={cs.arsitektur.kolom} desc={cs.arsitektur.deskripsi} lang={lang} label={c.diagram} /> : null}
                {moreImages.map((img) => (
                  <div key={img.src} className="mt-8">
                    <Shot img={img} lang={lang} />
                  </div>
                ))}
              </Block>
            ) : null}

            {shown.keputusan ? (
              <Block id="keputusan" title={c.sections.keputusan}>
                {cs.keputusan?.length ? (
                  <ul className="space-y-3">
                    {cs.keputusan.map((k) => (
                      <li key={k.id} className="grid grid-cols-[1.25rem_minmax(0,1fr)]">
                        <span aria-hidden className="font-mono text-kabut">
                          -
                        </span>
                        <span>{loc(k, lang)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Pending label={c.pending} />
                )}
              </Block>
            ) : null}

            {shown.hasil ? <Text id="hasil" title={c.sections.hasil} value={cs.hasil} lang={lang} pending={c.pending} /> : null}
            {shown.tantangan ? <Text id="tantangan" title={c.sections.tantangan} value={cs.tantangan} lang={lang} pending={c.pending} /> : null}

            {shown.tautan ? (
              <Block id="tautan" title={c.sections.tautan}>
                <Links p={p} c={c} />
              </Block>
            ) : null}

            {p.status ? (
              <div className="mt-16 pl-2">
                <Stamp size="clamp(1.5rem, 4vw, 2.25rem)" rotate={-6} onDark>
                  {c.stamp[p.status]}
                </Stamp>
              </div>
            ) : null}
          </article>

          {/* Anotasi samping: daftar isi yang ikut saat digulir. */}
          {toc.length > 1 ? (
            <aside className="hidden lg:col-span-3 lg:col-start-10 lg:block">
              <div className="lg:sticky lg:top-28">
                <CaseToc label={c.toc} items={toc} />
              </div>
            </aside>
          ) : null}
        </div>

        <nav className="wrap mt-24" aria-label={c.next}>
          <a href={projectHref(lang, next.slug)} className="row-hover group flex items-end gap-4 border-y border-garis py-8">
            <span className="shrink-0">
              <span className="block text-sm text-kabut">{c.next}</span>
              <span className="type-display mt-1 block text-[clamp(2rem,5vw,3.5rem)] text-kertas">{loc(next.title, lang)}</span>
            </span>
            <span aria-hidden className="leader mb-3 hidden text-kabut sm:block" />
            <span className="mb-2 hidden shrink-0 font-mono text-sm text-kabut sm:block">{next.stack.slice(0, 2).join(", ")}</span>
          </a>
        </nav>
      </main>
      <Footer lang={lang} />
    </>
  );
}

type CaseDict = ReturnType<typeof dict>["caseStudy"];

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-2">
      <dt className="text-tinta/60">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

function Links({ p, c, className = "" }: { p: Project; c: CaseDict; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {p.links?.demo ? (
        <li>
          <a href={p.links.demo} target="_blank" rel="noopener noreferrer" className="btn border border-kertas text-kertas">
            {c.demo}
          </a>
        </li>
      ) : null}
      {p.links?.github ? (
        <li>
          <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="btn border border-kertas text-kertas">
            {c.github}
          </a>
        </li>
      ) : null}
    </ul>
  );
}

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-judul`} className="mb-14 scroll-mt-28">
      <h2 id={`${id}-judul`} className="type-title mb-4 text-xl text-kertas md:text-[1.5rem]">
        {title}
      </h2>
      <div className="text-lg leading-[1.7] text-kertas/90">{children}</div>
    </section>
  );
}

function Text({ id, title, value, lang, pending }: { id: string; title: string; value?: L; lang: Lang; pending: string }) {
  return (
    <Block id={id} title={title}>
      {value ? <p>{loc(value, lang)}</p> : <Pending label={pending} />}
    </Block>
  );
}

/** Tangkapan layar asli, radius 0, dengan keterangan (data sensitif wajib disamarkan, PRD 9.4). */
function Shot({ img, lang }: { img: Project["images"][number]; lang: Lang }) {
  return (
    <figure className="mb-14">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.src} alt={loc(img.alt, lang)} loading="lazy" decoding="async" className="w-full border border-garis" />
      {img.caption ? <figcaption className="mt-3 font-mono text-xs leading-relaxed text-kabut">{loc(img.caption, lang)}</figcaption> : null}
    </figure>
  );
}

/** Hanya tampil saat development: penanda bagian yang perlu diisi Ari. */
function Pending({ label }: { label: string }) {
  return <p className="border border-dashed border-promo/60 px-4 py-3 font-mono text-sm text-promo">{label}</p>;
}

/** Diagram alur sederhana. HTML, bukan gambar: responsif dan terbaca pembaca layar. */
function Diagram({ kolom, desc, lang, label }: { kolom: string[][]; desc: L; lang: Lang; label: string }) {
  return (
    <figure className="mt-8">
      <div aria-hidden className="flex flex-col items-stretch gap-0 border border-garis p-4 sm:flex-row sm:items-center sm:p-6">
        {kolom.map((col, i) => (
          <div key={i} className="flex flex-col items-stretch sm:flex-1 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2 sm:flex-1">
              {col.map((node) => (
                <span
                  key={node}
                  className="border border-kabut/60 bg-teluk-dalam px-2.5 py-2 text-center font-mono text-xs leading-tight text-kertas"
                >
                  {node}
                </span>
              ))}
            </div>
            {i < kolom.length - 1 ? (
              <svg viewBox="0 0 24 24" className="mx-auto my-1 size-5 shrink-0 rotate-90 text-kabut sm:mx-1 sm:my-0 sm:rotate-0" fill="none">
                <path d="M3 12h16m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : null}
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-kabut">
        <span className="font-mono text-xs">{label}. </span>
        {loc(desc, lang)}
      </figcaption>
    </figure>
  );
}
