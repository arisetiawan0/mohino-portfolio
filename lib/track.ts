/*
 * Peristiwa analitik (PRD 12): mode dipilih, perintah simulator, proyek dibuka,
 * klik kontak dan CV. Dikirim ke Plausible bila dipasang (content/site.ts),
 * selain itu tidak melakukan apa-apa. Tanpa cookie dan tanpa data pribadi:
 * hanya nama peristiwa dan label pendek, tidak pernah teks yang diketik pengunjung.
 */

export type TrackEvent = "Mode dipilih" | "Perintah simulator" | "Proyek dibuka" | "Klik kontak" | "Klik CV";
type Props = Record<string, string>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export function track(event: TrackEvent, props?: Props) {
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // Analitik tidak boleh mengganggu halaman.
  }
}

const PROJECT_PATH = /^\/(?:proyek|en\/projects)\/([^/?#]+)/;

/** Klik tautan menjadi peristiwa, dibaca dari alamatnya saja. */
export function trackLink(a: HTMLAnchorElement) {
  const raw = a.getAttribute("href") ?? "";
  if (raw.startsWith("mailto:")) return track("Klik kontak", { kanal: "email" });
  if (raw.startsWith("data:text/vcard")) return track("Klik kontak", { kanal: "kartu kontak" });
  let url: URL;
  try {
    url = new URL(raw, window.location.href);
  } catch {
    return;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host === "linkedin.com") return track("Klik kontak", { kanal: "linkedin" });
  if (host === "github.com") return track("Klik kontak", { kanal: "github" });
  if (host === "wa.me") return track("Klik kontak", { kanal: "whatsapp" });
  if (url.origin !== window.location.origin) return;
  if (url.pathname === "/cv" || url.pathname.endsWith(".pdf")) return track("Klik CV");
  const project = url.pathname.match(PROJECT_PATH);
  if (project) track("Proyek dibuka", { slug: project[1], lewat: "tautan" });
}
