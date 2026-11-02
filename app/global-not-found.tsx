import "./globals.css";
import { Barcode } from "@/components/receipt/Barcode";
import { Stamp } from "@/components/receipt/Stamp";
import en from "@/content/en";
import id from "@/content/id";
import type { Metadata } from "next";
import { fontVars } from "./fonts";

export const metadata: Metadata = {
  title: "404, struk tidak ditemukan",
  robots: { index: false },
};

/** 404 bertema struk: dua bahasa sekaligus karena URL tidak dikenal. */
export default function GlobalNotFound() {
  const rule = "-".repeat(48);
  return (
    <html lang="id" className={fontVars}>
      <body>
        <main className="wrap grid min-h-[100dvh] grid-cols-1 items-center gap-12 py-16 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-6">
            <p className="font-mono text-sm text-kabut">404</p>
            <h1 className="type-display mt-4 text-[clamp(3rem,7vw,5.5rem)] text-kertas">{id.notFound.title}</h1>
            <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-kabut">{id.notFound.body}</p>
            <p lang="en" className="mt-3 max-w-[40ch] leading-relaxed text-kabut/80">
              {en.notFound.body}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="/" className="btn bg-kertas text-tinta">
                {id.notFound.back}
              </a>
              <a href="/en" lang="en" className="btn border border-garis text-kertas">
                {en.notFound.back}
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="tepi-bawah relative mx-auto max-w-[24rem] -rotate-1 bg-kertas px-7 pb-10 pt-7 font-mono text-sm leading-[1.5] text-tinta">
              <p className="text-center font-bold">STRUK PORTOFOLIO</p>
              <p className="overflow-hidden whitespace-nowrap text-tinta/50">{rule}</p>
              <p>&gt; buka halaman-ini</p>
              <p className="overflow-hidden whitespace-nowrap text-tinta/50">{rule}</p>
              <p>STATUS .............. 404</p>
              <p>ITEM ......... TIDAK ADA</p>
              <p>TOTAL ............... 0</p>
              <p className="overflow-hidden whitespace-nowrap text-tinta/50">{rule}</p>
              <Barcode value="404" className="mt-4 w-full text-tinta" height={44} />
              <span className="pointer-events-none absolute right-6 top-[42%]">
                <Stamp size="2rem" rotate={-12}>
                  VOID
                </Stamp>
              </span>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
