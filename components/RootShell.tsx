import "@/app/globals.css";
import { fontVars } from "@/app/fonts";
import { LinkTracker } from "@/components/LinkTracker";
import { ModeProvider } from "@/components/mode/ModeProvider";
import { site } from "@/content/site";
import type { Lang } from "@/content/types";
import type { ReactNode } from "react";

const { plausibleDomain, plausibleSrc, cloudflareToken } = site.analytics;
// Antrean Plausible: peristiwa sebelum skripnya selesai dimuat tetap terkirim.
const PLAUSIBLE_QUEUE = `window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`;

const HEAD_SCRIPT = `(function(d){d.classList.add('js');try{var p=new URLSearchParams(location.search).get('peran');if(p==='dev'||p==='ai'||p==='marketing')d.setAttribute('data-peran',p)}catch(e){}})(document.documentElement)`;

/** Kerangka <html> bersama untuk root layout ID dan EN. */
export function RootShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} className={fontVars} suppressHydrationWarning>
      <head>
        {/* Sebelum paint: tandai JS aktif (struk statis menunggu simulator) dan mode ?peran=,
            supaya teks yang mengikuti mode langsung benar tanpa kedipan. */}
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
        {plausibleDomain ? (
          <>
            <script defer data-domain={plausibleDomain} src={plausibleSrc} />
            <script dangerouslySetInnerHTML={{ __html: PLAUSIBLE_QUEUE }} />
          </>
        ) : null}
        {cloudflareToken ? (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: cloudflareToken })}
          />
        ) : null}
      </head>
      <body>
        <ModeProvider lang={lang}>{children}</ModeProvider>
        {plausibleDomain ? <LinkTracker /> : null}
      </body>
    </html>
  );
}
