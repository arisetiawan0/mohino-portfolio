import { ModeText } from "@/components/mode/ModeText";
import type { Lang } from "@/content/types";
import { dict } from "@/lib/i18n";
import { QrCode } from "@/components/receipt/QrCode";
import { vcard } from "@/lib/links";
import { ContactActions } from "./ContactActions";
import { SectionHead } from "./SectionHead";

/** Penutup halaman sebagai ujung struk (PRD 6.9). */
export function Contact({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const c = t.contact;

  return (
    <section id="kontak" aria-labelledby="kontak-judul" className="section-y border-t border-garis">
      <div className="wrap grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-5">
          <SectionHead id="kontak-judul" title={t.nav.contact} />
          <p className="type-title -mt-4 max-w-[18ch] text-[1.75rem] text-kertas md:text-[2.25rem]">
            <ModeText values={c.open} />
          </p>
          <p className="mt-4 max-w-[40ch] text-kabut">{c.general}</p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="tepi-atas bg-kertas px-6 pb-8 pt-10 text-tinta sm:px-8">
            <div className="font-mono text-sm leading-[1.5]" aria-hidden>
              <p className="overflow-hidden whitespace-nowrap text-tinta/50">{"-".repeat(64)}</p>
            </div>
            <p className="type-sign mt-4 text-[clamp(2.75rem,6vw,4rem)] uppercase">{c.heading}</p>
            <p className="mt-2 font-mono text-sm">
              <ModeText values={c.open} />
            </p>
            {/* Titik mengisi sisa lebar, jadi nilai TOTAL tidak terpotong di layar sempit. */}
            <p className="mt-6 flex items-baseline gap-2 font-mono text-sm font-bold">
              <span className="shrink-0">{c.total}</span>
              <span aria-hidden className="min-w-4 flex-1 overflow-hidden whitespace-nowrap">
                {".".repeat(80)}
              </span>
              <span className="shrink-0">{c.totalValue}</span>
            </p>
            <ContactActions
              lang={lang}
              vcf={vcard()}
              qr={<QrCode value={vcard()} ecc="L" label={c.qrLabel} className="size-40 shrink-0 text-tinta" />}
            />
            <p className="mt-6 overflow-hidden whitespace-nowrap font-mono text-sm text-tinta/50" aria-hidden>
              {"-".repeat(64)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
