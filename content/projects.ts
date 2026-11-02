import type { MinorProject, Mode, Project } from "./types";

/*
 * Satu sumber data untuk daftar proyek, simulator, dan case study.
 *
 * Aturan isi (PRD 9.3):
 * - Angka/fakta bertanda [ISI] di PRD TIDAK dikarang. Field-nya dibiarkan kosong
 *   dan tidak tampil di halaman publik. Di `npm run dev` bagian kosong tampil
 *   sebagai penanda "Belum diisi" supaya mudah dilengkapi.
 * - Diagram arsitektur di bawah disusun dari stack yang tertulis di PRD.
 *   Urutan alurnya DRAF: cek dan koreksi sebelum publik.
 */

export const projects: Project[] = [
  {
    slug: "portal-promo",
    title: { id: "Portal Promo", en: "Promo Portal" },
    summary: {
      id: "Dashboard internal untuk mengelola dan memantau promosi lintas brand dan outlet.",
      en: "An internal dashboard for managing and tracking promotions across brands and outlets.",
    },
    tags: ["dev"],
    stack: ["Next.js", "TiDB"],
    status: "live",
    // Verifikasi angka terbaru sebelum publik.
    facts: [{ value: "334", label: { id: "promosi tercatat", en: "promotions on record" } }],
    caseStudy: {
      solusi: {
        id: "Dashboard dengan filter berlapis untuk brand, outlet, dan periode, workflow approval sebelum promosi berjalan, export Excel untuk rekap, serta docs endpoint dan webhook supaya sistem lain bisa membaca data promosi.",
        en: "A dashboard with layered filters for brand, outlet, and period, an approval workflow before a promotion goes live, Excel export for reporting, and documented endpoints plus webhooks so other systems can read promotion data.",
      },
      arsitektur: {
        kolom: [["Tim promosi"], ["Next.js", "Approval"], ["TiDB"], ["Export Excel", "Webhook"]],
        deskripsi: {
          id: "Tim promosi memakai dashboard Next.js. Data promosi dan status approval disimpan di TiDB, lalu keluar sebagai export Excel atau dikirim lewat webhook.",
          en: "The promotions team works in a Next.js dashboard. Promotion data and approval status live in TiDB, then leave as Excel exports or webhook calls.",
        },
      },
      keputusan: [
        {
          id: "Workflow approval di dalam dashboard, sehingga status setiap promosi tercatat di satu tempat.",
          en: "Approval runs inside the dashboard, so every promotion's status is recorded in one place.",
        },
        {
          id: "Docs endpoint dan webhook disediakan sejak awal agar integrasi tidak bergantung pada export manual.",
          en: "Documented endpoints and webhooks from the start, so integrations don't depend on manual exports.",
        },
      ],
      tantangan: {
        id: "Kuota Request Units database TiDB habis. Saat ini sedang mengevaluasi migrasi database.",
        en: "The TiDB Request Units quota ran out. A database migration is being evaluated.",
      },
    },
    images: [],
  },
  {
    slug: "laporan-void-refund",
    title: { id: "Laporan Void dan Refund", en: "Void and Refund Reports" },
    summary: {
      id: "PWA untuk kasir melaporkan void dan refund per outlet, lengkap dengan foto bukti ber-timestamp otomatis.",
      en: "A PWA for cashiers to report voids and refunds per outlet, with automatically timestamped photo evidence.",
    },
    tags: ["dev"],
    stack: ["PWA", "Next.js"],
    status: null, // [ISI] status
    caseStudy: {
      solusi: {
        id: "Login memakai Outlet ID dengan dua role: Outlet untuk melapor, Superadmin untuk memeriksa. Setiap laporan wajib menyertakan foto bukti yang diberi timestamp otomatis, dan Superadmin bisa mengekspor laporan gabungan per periode.",
        en: "Sign-in uses an Outlet ID with two roles: Outlet to report, Superadmin to review. Every report needs a photo that gets timestamped automatically, and Superadmin can export a combined report per period.",
      },
      arsitektur: {
        kolom: [["Kasir outlet"], ["PWA Next.js"], ["Service worker"], ["Endpoint upload"], ["Superadmin", "Export periode"]],
        deskripsi: {
          id: "Kasir melapor lewat PWA. Service worker menangani aset aplikasi, sedangkan unggahan foto selalu langsung ke endpoint upload. Superadmin membaca dan mengekspor laporan per periode.",
          en: "Cashiers report through the PWA. The service worker handles app assets, while photo uploads always go straight to the upload endpoint. Superadmin reviews and exports reports per period.",
        },
      },
      keputusan: [
        {
          id: "Service worker sengaja tidak meng-cache endpoint upload, supaya foto bukti tidak tertahan di cache perangkat.",
          en: "The service worker deliberately skips the upload endpoint, so photo evidence never gets stuck in a device cache.",
        },
        {
          id: "Timestamp dibubuhkan otomatis pada foto, bukan diketik kasir.",
          en: "Timestamps are stamped on the photo automatically, not typed in by the cashier.",
        },
        {
          id: "Login per outlet, bukan per orang, mengikuti cara kasir bergantian di satu mesin.",
          en: "Sign-in is per outlet, not per person, matching how cashiers take turns on one register.",
        },
      ],
    },
    images: [],
  },
  {
    slug: "hris-abs-group",
    title: { id: "HRIS ABS Group", en: "ABS Group HRIS" },
    summary: {
      id: "Sistem HR pengganti Talenta untuk ABS Group: absensi, cuti, payroll, dan reimbursement.",
      en: "An HR system replacing Talenta at ABS Group: attendance, leave, payroll, and reimbursements.",
    },
    tags: ["dev", "ai"],
    stack: ["Laravel", "PostgreSQL", "TanStack Start", "React Native", "FastAPI"],
    status: "pengembangan",
    caseStudy: {
      masalah: {
        id: "ABS Group memakai Talenta untuk urusan HR. Sistem ini dibangun sebagai penggantinya.",
        en: "ABS Group ran HR on Talenta. This system is being built to replace it.",
      },
      peran: {
        id: "Dikerjakan solo: menyusun kebutuhan, mendesain skema database, membangun API, web admin, dan aplikasi mobile.",
        en: "Built solo: gathering requirements, designing the database schema, and building the API, web admin, and mobile app.",
      },
      solusi: {
        id: "Laravel sebagai API-only dengan PostgreSQL, web admin dengan TanStack Start, dan aplikasi mobile React Native (Expo), semuanya dalam monorepo pnpm. Approval flow bertingkat dikonfigurasi Super Admin. Absensi memakai face recognition di server (InsightFace lewat FastAPI).",
        en: "Laravel as an API-only backend on PostgreSQL, a TanStack Start web admin, and a React Native (Expo) mobile app, all in a pnpm monorepo. Multi-level approval flows are configured by a Super Admin. Attendance uses server-side face recognition (InsightFace via FastAPI).",
      },
      arsitektur: {
        kolom: [["Mobile Expo", "Web admin"], ["Laravel API"], ["PostgreSQL", "FastAPI InsightFace"]],
        deskripsi: {
          id: "Aplikasi mobile dan web admin berbicara ke satu Laravel API. API menyimpan data di PostgreSQL dan meneruskan foto absensi ke layanan FastAPI untuk face recognition.",
          en: "The mobile app and web admin talk to a single Laravel API. The API stores data in PostgreSQL and forwards attendance photos to a FastAPI service for face recognition.",
        },
      },
      keputusan: [
        {
          id: "Face recognition berjalan di server, bukan di perangkat karyawan.",
          en: "Face recognition runs on the server, not on employees' phones.",
        },
        {
          id: "Foto absensi dihapus otomatis setiap bulan.",
          en: "Attendance photos are deleted automatically every month.",
        },
        {
          id: "Approval bertingkat bisa diatur Super Admin, tidak ditanam di kode.",
          en: "Approval levels are configurable by a Super Admin instead of hard-coded.",
        },
        {
          id: "Monorepo pnpm untuk API, web admin, dan mobile.",
          en: "A pnpm monorepo for the API, web admin, and mobile app.",
        },
      ],
    },
    images: [],
  },
  {
    slug: "beautystore",
    title: { id: "BeautyStore", en: "BeautyStore" },
    summary: {
      id: "Redesain landing page toko online untuk skincare, makeup, body care, dan parfum.",
      en: "A landing page redesign for an online store selling skincare, makeup, body care, and fragrance.",
    },
    tags: ["dev"],
    stack: ["Next.js", "shadcn/ui", "Vercel"],
    status: "live",
    caseStudy: {
      solusi: {
        id: "Landing page dibangun ulang dengan Next.js dan komponen shadcn/ui, lalu di-deploy di Vercel.",
        en: "The landing page was rebuilt with Next.js and shadcn/ui components, then deployed on Vercel.",
      },
    },
    images: [],
  },
  {
    slug: "chatbot-beauty-kendari",
    title: { id: "Chatbot AI Beauty Kendari", en: "Beauty Kendari AI Chatbot" },
    summary: {
      id: "Chatbot web yang menjawab stok dan harga per outlet, memberi konsultasi kecantikan, dan menganalisis kulit dari foto wajah.",
      en: "A web chatbot that answers stock and price questions per outlet, gives beauty advice, and analyzes skin from a face photo.",
    },
    tags: ["ai", "dev", "marketing"],
    stack: ["Next.js", "Supabase", "Cloudflare Workers", "LLM API"],
    status: "berjalan",
    caseStudy: {
      solusi: {
        id: "Satu chatbot web dengan tiga tugas: pertanyaan stok dan harga per outlet, konsultasi kecantikan termasuk personal color analysis, dan analisis kulit dari foto wajah memakai vision LLM. Nama produk dicari dengan pencocokan fuzzy, lalu jawaban disusun berjenjang menurut tingkat keyakinan hasil pencarian.",
        en: "One web chatbot with three jobs: stock and price questions per outlet, beauty consultations including personal color analysis, and skin analysis from a face photo using a vision LLM. Product names are matched with fuzzy search, and the answer is tiered by how confident the match is.",
      },
      arsitektur: {
        kolom: [["Pelanggan web"], ["Next.js"], ["Cloudflare Workers"], ["Supabase", "LLM API"]],
        deskripsi: {
          id: "Pelanggan mengobrol di web Next.js. Permintaan diproses di Cloudflare Workers, yang membaca data produk dari Supabase dan memanggil LLM API untuk percakapan dan analisis foto.",
          en: "Customers chat on a Next.js site. Requests are handled in Cloudflare Workers, which read product data from Supabase and call the LLM API for conversation and photo analysis.",
        },
      },
      keputusan: [
        {
          id: "Jawaban berjenjang: makin rendah keyakinan pencocokan produk, makin hati-hati jawabannya.",
          en: "Tiered answers: the lower the product-match confidence, the more careful the reply.",
        },
        {
          id: "Foto wajah dihapus otomatis setelah 24 jam.",
          en: "Face photos are deleted automatically after 24 hours.",
        },
      ],
    },
    images: [],
  },
  {
    slug: "hermes-yeyen",
    title: { id: "Hermes Agent \"Yeyen\"", en: "Hermes Agent \"Yeyen\"" },
    summary: {
      id: "Bot customer service di Telegram dan WhatsApp, berjalan di Docker pada ZimaOS.",
      en: "A customer service bot on Telegram and WhatsApp, running in Docker on ZimaOS.",
    },
    tags: ["ai"],
    stack: ["Docker", "ZimaOS", "Cloudflare Worker"],
    status: "berjalan",
    caseStudy: {
      solusi: {
        id: "Agent berjalan di Docker pada ZimaOS, dengan Cloudflare Worker sebagai proxy untuk lalu lintas Telegram dan WhatsApp.",
        en: "The agent runs in Docker on ZimaOS, with a Cloudflare Worker acting as a proxy for Telegram and WhatsApp traffic.",
      },
    },
    images: [],
  },
  {
    slug: "cafe-ops-agent",
    title: { id: "Cafe Ops Agent", en: "Cafe Ops Agent" },
    summary: {
      id: "Agent pemesanan lewat Telegram untuk cafe: pesanan tercatat otomatis ke spreadsheet dan tampil di ops board live.",
      en: "A Telegram ordering agent for cafes: orders are logged to a spreadsheet automatically and shown on a live ops board.",
    },
    tags: ["ai"],
    stack: ["Telegram", "Spreadsheet", "Ops board"],
    status: "live",
    statusNote: {
      id: "Demo untuk AI HackFest, memakai data simulasi.",
      en: "Built for AI HackFest, running on simulated data.",
    },
    caseStudy: {
      solusi: {
        id: "Pelanggan memesan lewat agent di Telegram. Pesanan tercatat otomatis ke spreadsheet dan langsung tampil di ops board live.",
        en: "Customers order through an agent on Telegram. Orders are logged to a spreadsheet automatically and show up on a live ops board.",
      },
      // DRAF: alur disusun dari deskripsi PRD, cek sebelum publik.
      arsitektur: {
        kolom: [["Pelanggan Telegram"], ["Agent pemesanan"], ["Spreadsheet"], ["Ops board live"]],
        deskripsi: {
          id: "Pesanan masuk dari Telegram ke agent, dicatat ke spreadsheet, lalu ditampilkan di ops board untuk tim cafe.",
          en: "Orders come in through Telegram to the agent, get logged in a spreadsheet, then appear on the ops board for the cafe team.",
        },
      },
    },
    images: [],
  },
  {
    slug: "case-meta-ads",
    title: { id: "Kampanye Meta Ads Beauty Kendari", en: "Beauty Kendari Meta Ads Campaign" },
    summary: {
      id: "Kampanye berbayar dengan tujuan traffic dan chat WhatsApp, bukan ROAS.",
      en: "Paid campaigns optimized for traffic and WhatsApp chats, not ROAS.",
    },
    tags: ["marketing"],
    stack: ["Meta Ads", "WhatsApp"],
    status: "selesai",
    caseStudy: {
      // [ISI] budget (boleh persentase), audiens, kreatif, CTR, CPC, biaya per chat, optimasi.
      solusi: {
        id: "Kampanye Meta Ads untuk Beauty Kendari dengan tujuan traffic dan chat WhatsApp. Ukuran keberhasilannya percakapan yang masuk, bukan ROAS.",
        en: "Meta Ads campaigns for Beauty Kendari optimized for traffic and WhatsApp chats. Success is measured in conversations started, not ROAS.",
      },
      keputusan: [
        {
          id: "Tujuan kampanye traffic dan chat WhatsApp, bukan ROAS.",
          en: "Campaign objective set to traffic and WhatsApp chats, not ROAS.",
        },
      ],
    },
    images: [],
  },
  {
    slug: "sentimen-sosmed",
    title: { id: "Pipeline Sentimen Sosial Media", en: "Social Sentiment Pipeline" },
    summary: {
      id: "Pipeline analisis sentimen Instagram dan TikTok Beauty Kendari untuk mengarahkan konten.",
      en: "A sentiment analysis pipeline for Beauty Kendari's Instagram and TikTok that informs content decisions.",
    },
    tags: ["marketing", "ai"],
    stack: ["Apify", "GitHub Actions", "Cloudflare Workers", "Supabase"],
    status: "berjalan",
    caseStudy: {
      arsitektur: {
        kolom: [["Instagram", "TikTok"], ["Apify"], ["GitHub Actions"], ["Cloudflare Workers"], ["Supabase"]],
        deskripsi: {
          id: "Data Instagram dan TikTok diambil dengan Apify, dijadwalkan lewat GitHub Actions, diproses di Cloudflare Workers, lalu disimpan di Supabase.",
          en: "Instagram and TikTok data is collected with Apify, scheduled with GitHub Actions, processed in Cloudflare Workers, and stored in Supabase.",
        },
      },
    },
    images: [],
  },
];

/** Proyek kecil: satu baris, tanpa case study. */
export const minorProjects: MinorProject[] = [
  {
    title: { id: "Archiver data penjualan dan stok", en: "Sales and stock archiver" },
    note: { id: "30 outlet ke BigQuery, n8n dan Cloudflare Tunnel", en: "30 outlets into BigQuery, n8n and Cloudflare Tunnel" },
  },
  { title: { id: "Affari API", en: "Affari API" }, note: { id: "API generik, FastAPI dan Docker", en: "General-purpose API, FastAPI and Docker" } },
  { title: { id: "Pareto Pulse", en: "Pareto Pulse" }, note: { id: "Evaluasi sekitar 17 ribu SKU", en: "Evaluating about 17,000 SKUs" } },
  { title: { id: "Kasbonku", en: "Kasbonku" }, note: { id: "Laravel", en: "Laravel" } },
  // Catatan satu baris di bawah ini menunggu isi dari Ari.
  { title: { id: "PWA member Beauty Kendari", en: "Beauty Kendari member PWA" } },
  { title: { id: "Gemarun 2026", en: "Gemarun 2026" } },
  { title: { id: "Home Visit dashboard", en: "Home Visit dashboard" } },
  { title: { id: "Shopee Ads program supplier", en: "Shopee Ads supplier program" } },
];

/** Urutan proyek "di atas" per mode (PRD 10). Sisanya turun ke grup "Proyek lain". */
export const modeOrder: Record<Mode, string[]> = {
  dev: ["portal-promo", "laporan-void-refund", "hris-abs-group", "beautystore"],
  ai: ["chatbot-beauty-kendari", "hermes-yeyen", "cafe-ops-agent", "sentimen-sosmed"],
  marketing: ["case-meta-ads", "sentimen-sosmed", "chatbot-beauty-kendari"],
};

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

export function projectsForMode(mode: Mode) {
  const top = modeOrder[mode].map((s) => projectBySlug(s)).filter((p): p is Project => Boolean(p));
  const rest = projects.filter((p) => !modeOrder[mode].includes(p.slug));
  return { top, rest };
}
