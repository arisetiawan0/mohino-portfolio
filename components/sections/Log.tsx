import { log } from "@/content/log";
import type { Lang } from "@/content/types";
import { dict, loc } from "@/lib/i18n";
import { SectionHead } from "./SectionHead";

/** Riwayat bergaya git log --graph. Penomoran dipakai karena ini urutan nyata. */
export function Log({ lang }: { lang: Lang }) {
  const t = dict(lang).log;
  return (
    <section id="riwayat" aria-labelledby="riwayat-judul" className="section-y border-t border-garis">
      <div className="wrap grid grid-cols-1 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-4">
          <SectionHead id="riwayat-judul" title={t.heading} />
        </div>
        <ol className="lg:col-span-7 lg:col-start-6">
          {log.map((e, i) => {
            const n = String(log.length - i).padStart(2, "0");
            const last = i === log.length - 1;
            return (
              <li key={e.title.id} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3">
                <div aria-hidden className="relative flex flex-col items-center font-mono text-kabut">
                  <span className="relative z-[1] flex size-[1.15rem] items-center justify-center bg-teluk leading-none text-kertas">*</span>
                  {!last ? <span className="w-px flex-1 bg-garis" /> : null}
                </div>
                <div className={last ? "" : "pb-10"}>
                  <p className="font-mono text-sm text-kabut">
                    <span className="mr-3 text-kertas/70">{n}</span>
                    {loc(e.when, lang)}
                  </p>
                  <p className="type-title mt-1.5 text-xl text-kertas md:text-[1.5rem]">{loc(e.title, lang)}</p>
                  {e.line ? <p className="mt-1.5 max-w-[56ch] leading-relaxed text-kabut">{loc(e.line, lang)}</p> : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
