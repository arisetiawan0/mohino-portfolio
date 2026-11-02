// Membuat public/kontur-teluk.svg: garis kontur bergaya Teluk Kendari.
// Teluk memanjang barat-timur, mulut sempit ke timur, pulau kecil di mulut teluk.
// Jalankan: node scripts/kontur.mjs
import { writeFileSync } from "node:fs";

const W = 1200, H = 800, STEP = 6;
const cols = Math.ceil(W / STEP) + 1, rows = Math.ceil(H / STEP) + 1;

// Value noise deterministik.
let seed = 1337;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const G = 64, grid = Array.from({ length: G * G }, rand);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
function noise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const g = (i, j) => grid[((j % G + G) % G) * G + ((i % G + G) % G)];
  return lerp(lerp(g(xi, yi), g(xi + 1, yi), smooth(xf)), lerp(g(xi, yi + 1), g(xi + 1, yi + 1), smooth(xf)), smooth(yf));
}
const fbm = (x, y) => noise(x, y) * 0.55 + noise(x * 2.1, y * 2.1) * 0.28 + noise(x * 4.3, y * 4.3) * 0.17;

// Jarak bertanda ke elips (pendekatan).
const ell = (x, y, cx, cy, rx, ry) => (Math.hypot((x - cx) / rx, (y - cy) / ry) - 1) * Math.min(rx, ry);
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };

function field(x, y) {
  // Air: negatif. Darat: positif.
  let d = ell(x, y, 470, 430, 330, 150);           // cekungan utama teluk
  d = smin(d, ell(x, y, 300, 470, 170, 110), 90);  // lengan barat daya
  d = smin(d, ell(x, y, 830, 478, 170, 44), 50);   // alur mulut
  d = smin(d, 1120 - x + (y - 520) * 0.08, 140);   // laut di timur
  const island = -ell(x, y, 930, 560, 70, 34);     // pulau di mulut teluk
  d = Math.max(d, island);
  return d + (fbm(x / 150, y / 150) - 0.5) * 70;
}

const vals = new Float32Array(cols * rows);
for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) vals[j * cols + i] = field(i * STEP, j * STEP);

function contour(level) {
  const segs = [];
  const v = (i, j) => vals[j * cols + i] - level;
  const interp = (x1, y1, a, x2, y2, b) => { const t = a / (a - b); return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]; };
  for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
    const a = v(i, j), b = v(i + 1, j), c = v(i + 1, j + 1), d = v(i, j + 1);
    const x = i * STEP, y = j * STEP, s = STEP;
    const pts = [];
    if ((a < 0) !== (b < 0)) pts.push(interp(x, y, a, x + s, y, b));
    if ((b < 0) !== (c < 0)) pts.push(interp(x + s, y, b, x + s, y + s, c));
    if ((c < 0) !== (d < 0)) pts.push(interp(x + s, y + s, c, x, y + s, d));
    if ((d < 0) !== (a < 0)) pts.push(interp(x, y + s, d, x, y, a));
    if (pts.length === 2) segs.push(pts);
    else if (pts.length === 4) { segs.push([pts[0], pts[1]]); segs.push([pts[2], pts[3]]); }
  }
  // Sambungkan segmen jadi polyline.
  const key = (p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  const map = new Map();
  segs.forEach((sg, idx) => sg.forEach((p) => { const k = key(p); (map.get(k) ?? map.set(k, []).get(k)).push(idx); }));
  const used = new Uint8Array(segs.length), lines = [];
  for (let s0 = 0; s0 < segs.length; s0++) {
    if (used[s0]) continue;
    used[s0] = 1;
    const line = [segs[s0][0], segs[s0][1]];
    for (const dir of [1, -1]) {
      for (;;) {
        const end = dir === 1 ? line[line.length - 1] : line[0];
        const next = (map.get(key(end)) ?? []).find((k) => !used[k]);
        if (next === undefined) break;
        used[next] = 1;
        const [p, q] = segs[next];
        const other = key(p) === key(end) ? q : p;
        dir === 1 ? line.push(other) : line.unshift(other);
      }
    }
    if (line.length > 6) lines.push(line);
  }
  return lines;
}

// Penyederhanaan Ramer-Douglas-Peucker.
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let max = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const num = Math.abs((b[1] - a[1]) * p[0] - (b[0] - a[0]) * p[1] + b[0] * a[1] - b[1] * a[0]);
    const den = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    if (num / den > max) { max = num / den; idx = i; }
  }
  if (max > eps) return [...rdp(pts.slice(0, idx + 1), eps).slice(0, -1), ...rdp(pts.slice(idx), eps)];
  return [a, b];
}

const paths = [];
for (let level = -150; level <= 260; level += 22) {
  for (const line of contour(level)) {
    const s = rdp(line, 0.9);
    const d = s.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
    // Garis pantai (level 0) sedikit lebih tegas.
    paths.push(`<path d="${d}"${Math.abs(level) < 11 ? ' stroke-opacity=".3"' : ""}/>`);
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" stroke="rgb(157,191,184)" stroke-opacity=".14" stroke-width="1" stroke-linejoin="round">${paths.join("")}</svg>`;
writeFileSync(new URL("../public/kontur-teluk.svg", import.meta.url), svg);
console.log(`paths: ${paths.length}, bytes: ${svg.length}`);
