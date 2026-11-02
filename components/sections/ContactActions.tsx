"use client";

import { Barcode } from "@/components/receipt/Barcode";
import { site, whatsappHref } from "@/content/site";
import type { Lang } from "@/content/types";
import { dict } from "@/lib/i18n";
import { track } from "@/lib/track";
import { useRef, useState, type ReactNode } from "react";

/**
 * Tombol kontak di ujung struk. Salin email: garis pindai merah menyapu barcode
 * sekali sebagai konfirmasi (PRD 6.9). Nomor WhatsApp dirakit saat diklik.
 * Desktop: QR kartu kontak untuk dipindai HP. HP: tombol unduh kartu kontak (.vcf).
 */
export function ContactActions({ lang, qr, vcf }: { lang: Lang; qr: ReactNode; vcf: string }) {
  const t = dict(lang).contact;
  const [copied, setCopied] = useState<null | "ok" | "fail">(null);
  const scanRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const timer = useRef(0);

  const scan = () => {
    const el = scanRef.current;
    const box = boxRef.current;
    if (!el || !box) return;
    el.style.setProperty("--scan-w", `${box.offsetWidth - 2}px`);
    el.classList.remove("scanline-run");
    void el.offsetWidth; // restart animasi
    el.classList.add("scanline-run");
  };

  const copy = async () => {
    window.clearTimeout(timer.current);
    track("Klik kontak", { kanal: "salin email" });
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied("ok");
      scan();
    } catch {
      setCopied("fail");
      window.location.href = `mailto:${site.email}`;
    }
    timer.current = window.setTimeout(() => setCopied(null), 2400);
  };

  const hasWa = Boolean(site.whatsappReversed);
  const btn =
    "btn border border-tinta/80 text-tinta transition-[background-color,color,transform] duration-100 hover:bg-tinta hover:text-kertas";

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button type="button" onClick={copy} className="btn bg-tinta text-kertas transition-[background-color,transform] duration-100 hover:bg-[#2b3036]" aria-live="polite">
          {copied === "ok" ? t.copied : copied === "fail" ? t.copyFail : t.copyEmail}
        </button>
        {hasWa ? (
          <a
            href="#kontak"
            onClick={(e) => {
              // Dirakit saat klik supaya nomor tidak pernah ada di HTML statis.
              e.preventDefault();
              track("Klik kontak", { kanal: "whatsapp" });
              const href = whatsappHref(t.waText);
              if (href) window.open(href, "_blank", "noopener,noreferrer");
            }}
            className={btn}
          >
            {t.chatWa}
          </a>
        ) : null}
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={btn}>
          {t.linkedin}
        </a>
        <a href={site.github} target="_blank" rel="noopener noreferrer" className={btn}>
          {t.github}
        </a>
        <a
          href={`data:text/vcard;charset=utf-8,${encodeURIComponent(vcf)}`}
          download="ari-setiawan.vcf"
          className={`${btn} md:hidden`}
        >
          {t.saveContact}
        </a>
      </div>
      <p className="mt-3 font-mono text-xs text-tinta/60">{site.email}</p>

      <div className="mt-8 hidden items-center gap-5 border-t border-dashed border-tinta/30 pt-6 md:flex">
        {qr}
        <div className="font-mono text-sm">
          <p className="font-bold leading-snug">{t.scanToSave}</p>
          <p className="mt-2 max-w-[30ch] text-xs leading-relaxed text-tinta/65">{t.scanHint}</p>
        </div>
      </div>

      <div ref={boxRef} className="relative mt-8">
        <Barcode value={site.barcode} className="w-full text-tinta" height={64} />
        <span ref={scanRef} aria-hidden className="scanline" />
      </div>
    </>
  );
}
