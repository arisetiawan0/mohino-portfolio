import type { LogEntry } from "./types";

/**
 * Riwayat, diurutkan menurut tanggal selesai (terbaru di atas), karena nomor
 * 01–06 di halaman menandai urutan waktu. Entri yang masih berjalan paling atas.
 */
export const log: LogEntry[] = [
  {
    when: { id: "Nov 2025 – sekarang", en: "Nov 2025 – now" },
    short: "2025-",
    title: { id: "Digital Marketing Staff, ABS Group", en: "Digital Marketing Staff, ABS Group" },
    line: {
      id: "Menjalankan iklan, konten, dan SEO Beauty Kendari, sekaligus membangun chatbot, dashboard, dan sistem internal.",
      en: "Running ads, content, and SEO for Beauty Kendari, while building chatbots, dashboards, and internal systems.",
    },
  },
  {
    when: { id: "Jan – Mar 2026", en: "Jan – Mar 2026" },
    short: "2026",
    title: { id: "Bootcamp Digital Marketing Fullstack, MySkill", en: "Fullstack Digital Marketing Bootcamp, MySkill" },
  },
  {
    when: { id: "Agu 2021 – Sep 2025", en: "Aug 2021 – Sep 2025" },
    short: "2021-25",
    title: { id: "S1 Informatika, Universitas Kristen Immanuel", en: "BSc Informatics, Universitas Kristen Immanuel" },
    line: {
      id: "IPK 3,54. Asisten dosen dan instruktur Programming Study Club.",
      en: "GPA 3.54. Teaching assistant and Programming Study Club instructor.",
    },
  },
  {
    when: { id: "Nov 2020 – Mar 2025", en: "Nov 2020 – Mar 2025" },
    short: "2020-25",
    title: { id: "Operasional logistik", en: "Logistics operations" },
    line: {
      id: "Admin operasional, koordinator tim kurir, processing, dan PIC vendor di empat perusahaan logistik di Yogyakarta.",
      en: "Operations admin, courier team coordinator, processing, and vendor PIC at four logistics companies in Yogyakarta.",
    },
  },
  {
    when: { id: "Feb – Jun 2024", en: "Feb – Jun 2024" },
    short: "2024",
    title: { id: "Bangkit Academy, Mobile Development", en: "Bangkit Academy, Mobile Development" },
    line: { id: "Capstone: HerbaGuidesApp.", en: "Capstone: HerbaGuidesApp." },
  },
  {
    when: { id: "2022 – 2023", en: "2022 – 2023" },
    short: "2022-23",
    title: { id: "Sistem Informasi Kurir dan Aplikasi PIKI Sleman", en: "Courier Information System and PIKI Sleman app" },
    line: {
      id: "Ketua proyek, sekaligus programmer Sistem Informasi Kurir.",
      en: "Project lead, and programmer on the courier information system.",
    },
  },
];
