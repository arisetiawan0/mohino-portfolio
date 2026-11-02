import type { Mode, SkillGroup, SkillGroupId } from "./types";

/*
 * Skill selalu menaut ke bukti (PRD 4.2 poin 3). Bukti berupa slug proyek
 * akan tertaut ke case study; teks bebas untuk proyek tanpa case study.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: { id: "Frontend", en: "Frontend" },
    skills: [
      { name: "Next.js + React", bukti: ["portal-promo", "laporan-void-refund", "beautystore", "chatbot-beauty-kendari"] },
      { name: "TanStack Start", bukti: ["hris-abs-group"] },
      { name: "shadcn/ui", bukti: ["beautystore"] },
      {
        name: "PWA, service worker",
        bukti: ["laporan-void-refund", { id: "PWA member Beauty Kendari", en: "Beauty Kendari member PWA" }],
      },
    ],
  },
  {
    id: "backend",
    label: { id: "Backend dan database", en: "Backend and databases" },
    skills: [
      { name: "Laravel / PHP", bukti: ["hris-abs-group", { id: "Kasbonku", en: "Kasbonku" }] },
      { name: "Supabase, PostgreSQL", bukti: ["hris-abs-group", "chatbot-beauty-kendari", "sentimen-sosmed", { id: "Pareto Pulse", en: "Pareto Pulse" }] },
      { name: "FastAPI", bukti: [{ id: "Affari API", en: "Affari API" }, { id: "Face recognition absensi", en: "Attendance face recognition" }] },
      { name: "TiDB", bukti: ["portal-promo"] },
    ],
  },
  {
    id: "devops",
    label: { id: "Server dan DevOps", en: "Servers and DevOps" },
    skills: [
      { name: "Docker", bukti: ["hermes-yeyen", { id: "Affari API", en: "Affari API" }] },
      { name: "Cloudflare Workers, Tunnel", bukti: ["chatbot-beauty-kendari", "hermes-yeyen", "sentimen-sosmed", { id: "Archiver BigQuery", en: "BigQuery archiver" }] },
      { name: "GitHub Actions", bukti: ["sentimen-sosmed"] },
      { name: "Monorepo pnpm", bukti: ["hris-abs-group"] },
      { name: "Vercel", bukti: ["beautystore"] },
    ],
  },
  {
    id: "ai",
    label: { id: "AI dan automation", en: "AI and automation" },
    skills: [
      { name: "LLM API, vision", bukti: ["chatbot-beauty-kendari"] },
      { name: "Agent Telegram/WhatsApp", bukti: ["hermes-yeyen", "cafe-ops-agent"] },
      { name: "Face recognition (InsightFace)", bukti: ["hris-abs-group"] },
      { name: "n8n", bukti: [{ id: "Archiver data penjualan dan stok", en: "Sales and stock archiver" }] },
    ],
  },
  {
    id: "mobile",
    label: { id: "Mobile", en: "Mobile" },
    skills: [
      { name: "React Native (Expo)", bukti: ["hris-abs-group"] },
      { name: "Android (Kotlin)", bukti: [{ id: "HerbaGuidesApp, Bangkit Academy", en: "HerbaGuidesApp, Bangkit Academy" }] },
    ],
  },
  {
    id: "marketing",
    label: { id: "Marketing dan analitik", en: "Marketing and analytics" },
    skills: [
      { name: "Meta Ads", bukti: ["case-meta-ads"] },
      { name: "Analisis sentimen", bukti: ["sentimen-sosmed"] },
      { name: "Shopee Ads", bukti: [{ id: "Program supplier", en: "Supplier program" }] },
      // Dari CV: iklan, SEO, dan konten untuk Beauty Kendari di ABS Group.
      { name: "Google Ads", bukti: [{ id: "Iklan Beauty Kendari", en: "Beauty Kendari ads" }] },
      { name: "SEO", bukti: [{ id: "Website dan marketplace Beauty Kendari", en: "Beauty Kendari website and marketplaces" }] },
      { name: "Instagram, TikTok", bukti: [{ id: "Konten dan jadwal posting Beauty Kendari", en: "Beauty Kendari content and posting schedule" }] },
      { name: "BigQuery", bukti: [{ id: "Archiver 30 outlet", en: "30-outlet archiver" }] },
      { name: "Analisis Pareto SKU", bukti: [{ id: "Pareto Pulse, sekitar 17 ribu SKU", en: "Pareto Pulse, about 17,000 SKUs" }] },
    ],
  },
];

/** Kelompok yang terbuka per mode (PRD 10). */
export const openGroups: Record<Mode, SkillGroupId[]> = {
  dev: ["frontend", "backend", "devops"],
  ai: ["ai", "backend"],
  marketing: ["marketing"],
};
