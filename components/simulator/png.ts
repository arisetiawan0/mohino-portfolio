import { code128 } from "@/lib/code128";
import { encode } from "uqr";
import type { Entry, Line } from "./types";
import { WIDTH } from "./types";

const KERTAS = "#F2F3EE";
const TINTA = "#1C2024";
const MUTED = "rgba(28,32,36,0.62)";
const STEMPEL = "#D4283C";

/**
 * Menggambar ulang struk sesi ke canvas lalu mengunduhnya sebagai PNG.
 * Teks di halaman tetap DOM; canvas hanya untuk berkas ekspor.
 */
export async function exportReceiptPng({
  header,
  entries,
  fontFamily,
  barcode,
  filename,
  qr,
}: {
  header: Line[];
  entries: Entry[];
  fontFamily: string;
  barcode: string;
  filename: string;
  /** QR ke situs, supaya struk yang dibagikan bisa membawa orang kembali. */
  qr: { value: string; caption: string };
}) {
  await document.fonts.ready;
  const scale = 2;
  const fs = 15;
  const lh = Math.round(fs * 1.35);
  const pad = 22;

  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = `${fs}px ${fontFamily}`;
  const cw = probe.measureText("M").width;

  const rows: { line: Line; stamp?: Entry["stamp"]; stampRow?: boolean }[] = [];
  header.forEach((l) => rows.push({ line: l }));
  rows.push({ line: { t: "" } });
  for (const e of entries) {
    const start = rows.length;
    e.lines.forEach((l) => rows.push({ line: l }));
    if (e.stamp) rows[Math.min(rows.length - 1, start + Math.floor(e.lines.length * 0.38))].stamp = e.stamp;
  }

  const bc = code128(barcode);
  const bcH = 52;
  const q = encode(qr.value, { ecc: "M", border: 0 });
  const mod = 4;
  const qrPx = q.size * mod;
  const qrBlock = 28 + qrPx + 12 + lh * 2;
  const width = Math.ceil(WIDTH * cw + pad * 2);
  const height = pad + rows.length * lh + 24 + bcH + 28 + qrBlock + pad;

  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  // Kertas dengan tepi gerigi di bawah.
  const tooth = 6;
  ctx.fillStyle = KERTAS;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width, 0);
  ctx.lineTo(width, height - tooth);
  for (let x = width; x > 0; x -= tooth * 2) {
    ctx.lineTo(x - tooth, height);
    ctx.lineTo(Math.max(0, x - tooth * 2), height - tooth);
  }
  ctx.closePath();
  ctx.fill();

  ctx.textBaseline = "top";
  let y = pad;
  const stamps: { y: number; text: string }[] = [];
  for (const r of rows) {
    const bold = r.line.tone === "strong" || r.line.tone === "cmd";
    ctx.font = `${bold ? "700 " : ""}${fs}px ${fontFamily}`;
    ctx.fillStyle = r.line.tone === "muted" ? MUTED : TINTA;
    ctx.fillText(r.line.t, pad, y);
    if (r.stamp) stamps.push({ y, text: r.stamp.text });
    y += lh;
  }

  // Barcode penutup.
  y += 24;
  const bw = width - pad * 2;
  const unit = bw / bc.width;
  ctx.fillStyle = TINTA;
  for (const b of bc.bars) ctx.fillRect(pad + b.x * unit, y, Math.max(1, b.w * unit), bcH);
  ctx.font = `${fs - 3}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.fillText(barcode.split("").join(" "), width / 2, y + bcH + 8);

  // QR ke situs + keterangan.
  y += bcH + 28 + 28;
  const qx = Math.round((width - qrPx) / 2);
  q.data.forEach((row, ry) => row.forEach((on, rx) => on && ctx.fillRect(qx + rx * mod, y + ry * mod, mod, mod)));
  y += qrPx + 12;
  ctx.font = `700 ${fs - 2}px ${fontFamily}`;
  ctx.fillText(qr.caption, width / 2, y);
  ctx.font = `${fs - 2}px ${fontFamily}`;
  ctx.fillStyle = MUTED;
  ctx.fillText(qr.value.replace(/^https?:\/\//, "").replace(/\/$/, ""), width / 2, y + lh);
  ctx.fillStyle = TINTA;
  ctx.textAlign = "left";

  // Stempel.
  for (const s of stamps) {
    ctx.save();
    ctx.font = `800 20px ${fontFamily}`;
    const tw = ctx.measureText(s.text).width;
    const bwid = tw + 24;
    const bh = 34;
    ctx.translate(width - pad - bwid / 2 - 4, s.y + bh / 2);
    ctx.rotate((-8 * Math.PI) / 180);
    ctx.globalAlpha = 0.85;
    ctx.strokeStyle = STEMPEL;
    ctx.fillStyle = STEMPEL;
    ctx.lineWidth = 3;
    ctx.strokeRect(-bwid / 2, -bh / 2, bwid, bh);
    ctx.lineWidth = 1;
    ctx.strokeRect(-bwid / 2 + 4, -bh / 2 + 4, bwid - 8, bh - 8);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(s.text, 0, 1);
    ctx.restore();
  }

  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
  if (!blob) return false;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return true;
}
