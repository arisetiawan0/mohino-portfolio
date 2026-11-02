import { center, leader, wrap } from "@/components/simulator/format";
import { WIDTH } from "@/components/simulator/types";
import { modeOrder, projectBySlug, projects } from "@/content/projects";
import { site } from "@/content/site";
import type { Lang, Project } from "@/content/types";
import { code128 } from "@/lib/code128";
import { dict, loc } from "@/lib/i18n";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/*
 * Gambar Open Graph (PRD 12): potongan struk berisi nama dan peran.
 * Dirender sekali saat build (output statis), memakai font yang sama dengan web.
 */

export const ogSize = { width: 1200, height: 630 };

/** Berkas berakhiran .png supaya hosting statis mengirim content-type yang benar. */
export const ogPath = (lang: Lang, slug?: string) => `/og/${lang}${slug ? `-${slug}` : ""}.png`;

/** Semua berkas yang dicetak saat build: beranda dan tiap case study, dua bahasa. */
export const ogFiles = () =>
  (["id", "en"] as const).flatMap((lang) => [ogPath(lang), ...projects.map((p) => ogPath(lang, p.slug))]).map((p) => p.slice("/og/".length));

/** "id.png" atau "en-portal-promo.png" menjadi gambarnya. */
export function ogByFile(file: string) {
  const m = file.match(/^(id|en)(?:-(.+))?\.png$/);
  if (!m) return null;
  const lang = m[1] as Lang;
  return m[2] ? caseOg(lang, m[2]) : homeOg(lang);
}

const C = {
  teluk: "#0F3D3E",
  kertas: "#F2F3EE",
  tinta: "#1C2024",
  kabut: "#9DBFB8",
  stempel: "#D4283C",
  vfd: "#8CF5D8",
  vfdBg: "#0A1614",
  mesin: "#1F2A2B",
};

/** Courier Prime dari Google Fonts (TTF; Satori tidak membaca woff2). */
async function courier(weight: 400 | 700) {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=Courier+Prime:wght@${weight}`).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("Font Courier Prime tidak ditemukan");
  return fetch(url).then((r) => r.arrayBuffer());
}

let fontsCache: Promise<{ name: string; data: ArrayBuffer | Buffer; weight: 400 | 700 }[]> | null = null;
function fonts() {
  fontsCache ??= Promise.all([
    courier(400),
    courier(700),
    readFile(join(process.cwd(), "node_modules/dseg/fonts/DSEG14-Classic/DSEG14Classic-Regular.ttf")),
  ]).then(([regular, bold, seg]) => [
    { name: "Courier Prime", data: regular, weight: 400 as const },
    { name: "Courier Prime", data: bold, weight: 700 as const },
    { name: "DSEG14", data: seg, weight: 400 as const },
  ]);
  return fontsCache;
}

let konturCache: Promise<string> | null = null;
function kontur() {
  konturCache ??= readFile(join(process.cwd(), "public/kontur-teluk.svg"), "utf8").then(
    // Garis kontur sedikit lebih terang supaya tetap terlihat setelah gambar dikompres.
    (svg) => `data:image/svg+xml;base64,${Buffer.from(svg.replace('stroke-opacity=".14"', 'stroke-opacity=".22"')).toString("base64")}`,
  );
  return konturCache;
}

type Row = { t: string; bold?: boolean; muted?: boolean };

const rule: Row = { t: "-".repeat(WIDTH), muted: true };

function headRows(lang: Lang): Row[] {
  const s = dict(lang).sim;
  return [{ t: center(s.head), bold: true }, { t: center(s.shop) }, { t: center(s.place), muted: true }, rule];
}

/** Beranda: daftar proyek teratas seperti daftar belanja. */
function homeRows(lang: Lang): Row[] {
  const d = dict(lang);
  const top = modeOrder.dev
    .map((slug) => projectBySlug(slug))
    .filter((p): p is Project => Boolean(p))
    .slice(0, 4);
  return [
    ...headRows(lang),
    { t: d.sim.projects.title, bold: true },
    ...top.flatMap((p) =>
      (p.status ? leader(loc(p.title, lang), d.sim.statusShort[p.status]) : wrap(loc(p.title, lang))).map((t) => ({ t })),
    ),
    rule,
  ];
}

/** Case study: judul, stack, status. */
function caseRows(lang: Lang, p: Project): Row[] {
  const d = dict(lang);
  const c = d.caseStudy;
  return [
    ...headRows(lang),
    ...wrap(loc(p.title, lang).toLocaleUpperCase(lang === "id" ? "id-ID" : "en-US")).map((t) => ({ t, bold: true })),
    ...wrap(p.stack.join(", "), WIDTH, `${c.stack}: `, " ".repeat(c.stack.length + 2)).map((t) => ({ t })),
    ...(p.facts ?? []).flatMap((f) => leader(loc(f.label, lang), f.value).map((t) => ({ t }))),
    rule,
  ];
}

function Paper({ rows, stamp }: { rows: Row[]; stamp?: string }) {
  const { bars, width } = code128(site.barcode);
  const barH = 64;
  const scale = 360 / width;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        width: 460,
        padding: "28px 30px 30px",
        background: C.kertas,
        color: C.tinta,
        fontFamily: "Courier Prime",
        fontSize: 19.5,
        lineHeight: 1.35,
      }}
    >
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            whiteSpace: "pre",
            fontWeight: r.bold ? 700 : 400,
            color: r.muted ? "rgba(28,32,36,.55)" : C.tinta,
          }}
        >
          {r.t || " "}
        </div>
      ))}
      <div style={{ display: "flex", position: "relative", width: 360, height: barH, marginTop: 14, alignSelf: "center" }}>
        {bars.map((b, i) => (
          <div
            key={i}
            style={{ position: "absolute", left: b.x * scale, top: 0, width: Math.max(1, b.w * scale), height: barH, background: C.tinta }}
          />
        ))}
      </div>
      <div style={{ display: "flex", alignSelf: "center", marginTop: 6, fontSize: 14, letterSpacing: 6 }}>{site.barcode}</div>
      {stamp ? (
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 22,
            bottom: 46,
            padding: "6px 14px",
            border: `4px solid ${C.stempel}`,
            color: C.stempel,
            fontFamily: "Courier Prime",
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 2,
            transform: "rotate(-8deg)",
            opacity: 0.88,
          }}
        >
          {stamp}
        </div>
      ) : null}
    </div>
  );
}

async function render({
  kicker,
  title,
  sub,
  vfd,
  rows,
  stamp,
}: {
  kicker: string;
  title: string;
  sub: string;
  vfd: [string, string];
  rows: Row[];
  stamp?: string;
}) {
  const [f, bg] = await Promise.all([fonts(), kontur()]);
  const host = new URL(site.url).host;
  const vfdLine = (s: string) => s.toUpperCase().replace(/ /g, "!").padEnd(18, "!").slice(0, 18);
  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", background: C.teluk, fontFamily: "Courier Prime" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bg} alt="" width={1500} height={1000} style={{ position: "absolute", left: -260, top: -170 }} />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 620, padding: "64px 0 56px 72px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, color: C.kabut, fontSize: 22 }}>
              <div style={{ width: 12, height: 12, background: C.kabut }} />
              {kicker}
            </div>
            <div style={{ display: "flex", marginTop: 28, color: C.kertas, fontSize: title.length > 22 ? 58 : 72, fontWeight: 700, lineHeight: 1.02, letterSpacing: -1 }}>
              {title}
            </div>
            <div style={{ display: "flex", marginTop: 24, color: C.kabut, fontSize: 27, lineHeight: 1.4 }}>{sub}</div>
          </div>
          <div style={{ display: "flex", color: C.kabut, fontSize: 22 }}>{host}</div>
        </div>

        {/* Mesin kasir: layar pelanggan di atas slot, struk menyembul keluar bawah. */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "absolute", right: 70, top: 44, transform: "rotate(-1.5deg)" }}>
          <div style={{ display: "flex", flexDirection: "column", width: 520, padding: "18px 22px 20px", background: C.mesin, borderRadius: 6 }}>
            <div style={{ display: "flex", flexDirection: "column", padding: "12px 16px", background: C.vfdBg, color: C.vfd, fontFamily: "DSEG14", fontSize: 24, lineHeight: 1.45 }}>
              <div style={{ display: "flex", whiteSpace: "pre" }}>{vfdLine(vfd[0])}</div>
              <div style={{ display: "flex", whiteSpace: "pre" }}>{vfdLine(vfd[1])}</div>
            </div>
          </div>
          <div style={{ display: "flex", width: 500, height: 8, background: "#050a0a" }} />
          <div style={{ display: "flex", boxShadow: "0 18px 30px -12px rgba(0,0,0,.45)" }}>
            <Paper rows={rows} stamp={stamp} />
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: f.map((x) => ({ ...x, style: "normal" as const })) },
  );
}

export function homeOg(lang: Lang) {
  const d = dict(lang);
  return render({
    kicker: d.hero.status.dev,
    title: site.name,
    sub: d.og.sub,
    vfd: [`${d.sim.vfdMode} ${d.sim.vfdModes.dev}`, `${d.sim.vfdReady}`],
    rows: homeRows(lang),
  });
}

export function caseOg(lang: Lang, slug: string) {
  const d = dict(lang);
  const p = projectBySlug(slug);
  if (!p) return homeOg(lang);
  return render({
    kicker: d.og.caseKicker,
    title: loc(p.title, lang),
    sub: loc(p.summary, lang),
    vfd: [d.og.caseVfd, p.status ? d.sim.statusShort[p.status] : d.sim.vfdReady],
    rows: caseRows(lang, p),
    stamp: p.status ? d.caseStudy.stamp[p.status] : undefined,
  });
}

export const ogAlt = (lang: Lang, slug?: string) => {
  const p = slug ? projectBySlug(slug) : undefined;
  return p ? `${dict(lang).og.caseAlt} ${loc(p.title, lang)}` : dict(lang).og.alt;
};
