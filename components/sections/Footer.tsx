import { Barcode } from "@/components/receipt/Barcode";
import { site } from "@/content/site";
import type { Lang } from "@/content/types";
import { dict } from "@/lib/i18n";

export function Footer({ lang }: { lang: Lang }) {
  const t = dict(lang).footer;
  const date = new Date(`${site.updatedAt}T00:00:00`).toLocaleDateString(lang === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <footer className="border-t border-garis">
      <div className="wrap grid grid-cols-1 items-end gap-8 py-12 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-4">
          <Barcode value={site.barcode} className="w-full max-w-[260px] text-kabut" height={40} />
        </div>
        <p className="text-sm leading-relaxed text-kabut md:col-span-5">{t.stack}</p>
        <p className="font-mono text-sm text-kabut md:col-span-3 md:text-right">
          {t.updated} <time dateTime={site.updatedAt}>{date}</time>
        </p>
      </div>
    </footer>
  );
}
