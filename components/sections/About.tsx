import { ModeText } from "@/components/mode/ModeText";
import { minorProjects, projects } from "@/content/projects";
import { site } from "@/content/site";
import type { Lang } from "@/content/types";
import { dict, projectHref } from "@/lib/i18n";
import type { ReactNode } from "react";
import { SectionHead } from "./SectionHead";

export function About({ lang }: { lang: Lang }) {
  const t = dict(lang).about;
  return (
    <section id="tentang" aria-labelledby="tentang-judul" className="section-y border-t border-garis">
      <div className="wrap">
        <SectionHead id="tentang-judul" title={t.heading} />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-6">
          {/* Kartu ikut menempel saat teks kanan digulir, jadi kolom kiri tidak kosong. */}
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            {site.photo ? (
              // Foto cetak lurus; kartu plastik lebih kecil, diletakkan miring di sudut kanan bawahnya.
              <div className="max-w-[480px]">
                <Photo photo={site.photo} alt={t.member.photoAlt} />
                <div className="relative -mt-[30%] ml-auto w-[76%] sm:w-[64%]">
                  <MemberCard lang={lang} />
                </div>
              </div>
            ) : (
              <div className="max-w-[440px]">
                <MemberCard lang={lang} />
              </div>
            )}
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {/* Satu kalimat per baris: "di atas kertas" redup, kenyataannya terang. */}
            <p className="type-title text-balance text-[clamp(1.75rem,3vw,2.625rem)] leading-[1.1]">
              {t.lead.map((s, i) => (
                <span key={s} className={`block ${i === 0 ? "text-kabut" : "text-kertas"}`}>
                  {s}
                </span>
              ))}
            </p>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-kabut text-pretty md:text-xl md:leading-[1.6]">
              {t.body.map((p) => (
                <p key={p.slice(0, 24)} className="max-w-[56ch]">
                  {p}
                </p>
              ))}
            </div>

            {/* 2x2: empat kolom terlalu sempit, unit menabrak garis pemisah. */}
            <dl className="mt-14 grid grid-cols-2 border-y border-garis">
              {t.facts.map((f, i) => (
                <div
                  key={f.label}
                  className={`flex flex-col-reverse justify-end gap-3 border-garis py-6 sm:py-8 ${
                    i % 2 ? "border-l pl-4 sm:pl-8" : "pr-4 sm:pr-8"
                  } ${i >= 2 ? "border-t" : ""}`}
                >
                  <dt className="text-pretty text-sm leading-snug text-kabut sm:text-base">{f.label}</dt>
                  <dd className="flex items-baseline gap-2">
                    <span className="type-sign text-[clamp(2.75rem,6vw,4.5rem)] text-kertas">{f.value}</span>
                    {f.unit ? <span className="font-mono text-sm text-kabut">{f.unit}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Dampak lintas bidang: tiga langkah perjalanan pelanggan, masing-masing ke bukti. */}
            <div className="mt-14">
              <h3 className="font-mono text-xs text-kabut">{t.loopTitle}</h3>
              <ol className="mt-3 border-b border-garis">
                {t.loop.map((s, i) => (
                  <li key={s.slug}>
                    <a href={projectHref(lang, s.slug)} className="row-hover group block border-t border-garis py-5">
                      <span className="flex items-end gap-3 font-mono text-xs">
                        <span className="text-kabut">{String(i + 1).padStart(2, "0")}</span>
                        <span className="uppercase tracking-[0.08em] text-kertas">{s.step}</span>
                        <span aria-hidden className="leader text-kabut" />
                        <span className="text-kabut underline decoration-garis underline-offset-4 transition-colors group-hover:text-kertas group-hover:decoration-kertas">
                          {t.loopLink}
                        </span>
                      </span>
                      <span className="type-title mt-2 block text-pretty text-[1.375rem] leading-[1.15] text-kertas md:text-[1.625rem]">{s.text}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Foto 4:5, duotone teluk/kertas, warna asli saat hover atau fokus (PRD 6.6). */
function Photo({ photo, alt }: { photo: NonNullable<typeof site.photo>; alt: string }) {
  return (
    // Tanda potong cetak di sudut: foto diperlakukan seperti lembar cetakan.
    <div className="crop-marks w-[80%]">
      <figure className="duotone-wrap" tabIndex={0}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="(min-width: 540px) 384px, 80vw"
          width={photo.width}
          height={photo.height}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="duotone aspect-[4/5] w-full object-cover"
        />
      </figure>
    </div>
  );
}

/**
 * Pengganti foto selama belum ada: kartu member toko, ukuran kartu asli (85,6 x 54 mm).
 * Satu-satunya benda bersudut bulat di situs, karena ini plastik, bukan kertas struk.
 * Tier mengikuti mode lamaran; poin = jumlah proyek di portfolio, dihitung dari data.
 */
function MemberCard({ lang }: { lang: Lang }) {
  const d = dict(lang);
  const t = d.about.member;
  const points = projects.length + minorProjects.length;
  return (
    // Ukuran isi dalam cqw (lebar kartu), jadi proporsinya sama di kartu kecil maupun besar.
    <div className="group/card @container w-full py-2">
      <div className="relative aspect-[85.6/54] w-full -rotate-2 overflow-hidden rounded-[4cqw] bg-kertas text-tinta shadow-[0_0_0_1px_rgb(28_32_36/0.12),0_-6px_20px_-10px_rgb(5_25_26/0.5),0_28px_48px_-24px_rgb(5_25_26/0.85)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:-translate-y-1 group-hover/card:rotate-0">
        {/* Kontur teluk sebagai pola pengaman kartu. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-teluk [mask-image:url('/kontur-teluk.svg')] [mask-position:70%_40%] [mask-size:160%_auto]"
        />
        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between px-[6cqw] pt-[5cqw]">
            <span aria-hidden className="type-sign text-[14cqw] leading-[0.85]">
              AS
            </span>
            <span className="text-right font-mono text-[0.625rem] uppercase leading-snug tracking-[0.08em]">
              {t.card}
              <span className="block text-tinta/55">No. 0001</span>
            </span>
          </div>
          <div className="mt-auto px-[6cqw] pb-[3.5cqw]">
            <p className="type-title text-[9.5cqw]">{site.name}</p>
            <p className="mt-[1cqw] font-mono text-[0.625rem] uppercase tracking-[0.08em] text-tinta/60">
              {t.since} 2022
            </p>
          </div>
          <dl className="grid grid-cols-[1fr_auto] gap-x-[5cqw] bg-teluk px-[6cqw] py-[3.5cqw] text-kertas">
            <Field label={t.tier}>
              <ModeText values={d.modes} />
            </Field>
            <Field label={t.points} className="text-right">
              {points} {t.pointsUnit}
            </Field>
          </dl>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-kabut">{label}</dt>
      <dd className="type-title mt-0.5 truncate text-[length:max(0.8125rem,4.6cqw)]">{children}</dd>
    </div>
  );
}
