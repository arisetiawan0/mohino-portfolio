import { encode } from "uqr";

/**
 * QR code sebagai SVG statis (dibuat saat build, tanpa JavaScript di browser).
 * Modul gelap digabung per baris supaya path-nya ringkas; warnanya currentColor.
 */
export function QrCode({
  value,
  label,
  className,
  ecc = "M",
}: {
  value: string;
  label: string;
  className?: string;
  /** L untuk data panjang (vCard) supaya modul tidak terlalu kecil. */
  ecc?: "L" | "M";
}) {
  const { data, size } = encode(value, { ecc, border: 0 });
  let d = "";
  data.forEach((row, y) => {
    let x = 0;
    while (x < size) {
      if (!row[x]) {
        x++;
        continue;
      }
      const start = x;
      while (x < size && row[x]) x++;
      d += `M${start} ${y}h${x - start}v1h${start - x}z`;
    }
  });
  // Zona sepi 2 modul; latar kertas di sekitarnya menambah ruang.
  return (
    <svg
      viewBox={`-2 -2 ${size + 4} ${size + 4}`}
      className={className}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      <path d={d} fill="currentColor" />
    </svg>
  );
}
