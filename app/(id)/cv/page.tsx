import { site } from "@/content/site";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "CV", robots: { index: false } };

/** /cv mengarah ke PDF CV terbaru (PRD 6.1). Output statis: pakai meta refresh. */
export default function Page() {
  return (
    <main className="wrap py-24">
      <meta httpEquiv="refresh" content={`0; url=${site.cv.id}`} />
      <a href={site.cv.id} className="font-mono text-kertas underline underline-offset-4">
        {site.cv.id}
      </a>
    </main>
  );
}
