/*
 * Data pribadi dan tautan. SEMUA nilai bertanda TODO wajib diganti Ari (PRD 15).
 * Nomor WhatsApp tidak pernah dicetak mentah di HTML: disimpan terbalik di sini
 * dan dirakit di browser saat tautan diklik.
 */
export const site = {
  name: "Ari Setiawan",
  barcode: "ARISETIAWAN",
  url: "https://mohino.web.id",
  email: "arimohino@gmail.com",
  // Nomor WA format internasional TANPA "+", ditulis TERBALIK.
  // Contoh: 6281200000000 ditulis "0000000021826".
  whatsappReversed: "6443282822826",
  linkedin: "https://www.linkedin.com/in/ari-setiawan-5b39b7254/",
  github: "https://github.com/arisetiawan0",
  // Satu CV (isi berbahasa Inggris) untuk kedua bahasa. Ganti "en" bila ada versi terpisah.
  cv: { id: "/cv/ari-setiawan-cv.pdf", en: "/cv/ari-setiawan-cv.pdf" },
  // Foto profil 4:5, sudah dipotong, dikonversi ke sRGB, dan tanpa metadata.
  // null = hanya kartu member.
  photo: {
    src: "/foto/ari-setiawan-800.webp",
    srcSet: "/foto/ari-setiawan-480.webp 480w, /foto/ari-setiawan-800.webp 800w",
    width: 800,
    height: 1000,
  } as { src: string; srcSet: string; width: number; height: number } | null,
  updatedAt: "2026-10-30",
  // Analitik tanpa cookie (PRD 12). Kosong = tidak ada skrip yang dimuat.
  // TODO: isi salah satu setelah domain final.
  analytics: {
    // Plausible: pageview + peristiwa (mode, perintah simulator, proyek, kontak, CV).
    plausibleDomain: "",
    plausibleSrc: "https://plausible.io/js/script.js",
    // Cloudflare Web Analytics: pageview saja, tidak mendukung peristiwa.
    cloudflareToken: "",
  },
};

export function whatsappHref(text?: string) {
  const n = site.whatsappReversed.split("").reverse().join("");
  if (!n) return null;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${n}${q}`;
}
