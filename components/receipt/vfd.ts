export const VFD_COLS = 20;

/** Kiri rata kiri, kanan rata kanan, total 20 karakter. */
export function vfdLine(left: string, right = "") {
  const space = Math.max(1, VFD_COLS - left.length - right.length);
  return (left + " ".repeat(space) + right).slice(0, VFD_COLS).padEnd(VFD_COLS, " ");
}
