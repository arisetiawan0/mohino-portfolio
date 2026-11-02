import { site } from "@/content/site";

/** URL absolut untuk QR (dipindai dari HP, jadi harus domain publik, bukan localhost). */
export const absUrl = (path: string) => new URL(path, site.url).toString();

/** Tautan profil dianggap terisi bila bukan sekadar alamat dasar platformnya. */
const isFilled = (url: string) => !/^https:\/\/(www\.)?(linkedin\.com\/in|github\.com)\/?$/.test(url);

/**
 * Kartu kontak vCard 3.0 untuk QR dan tombol "Simpan kontak". Dibuat ringkas
 * supaya QR-nya tidak terlalu padat dipindai dari layar.
 * Nomor telepon sengaja tidak dimasukkan (PRD: nomor tidak dicetak mentah).
 */
export function vcard() {
  const [first, ...rest] = site.name.split(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${rest.join(" ")};${first};;;`,
    `FN:${site.name}`,
    `EMAIL:${site.email}`,
    `URL:${site.url}`,
  ];
  if (isFilled(site.linkedin)) lines.push(`URL:${site.linkedin}`);
  if (isFilled(site.github)) lines.push(`URL:${site.github}`);
  lines.push("END:VCARD");
  return lines.join("\r\n");
}
