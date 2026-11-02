export type Lang = "id" | "en";
export type Mode = "dev" | "ai" | "marketing";
export type L = { id: string; en: string };

export type ProjectStatus = "live" | "berjalan" | "pengembangan" | "selesai";

export type Project = {
  slug: string;
  title: L;
  /** Satu kalimat dampak. */
  summary: L;
  tags: Mode[];
  stack: string[];
  /** null = belum dikonfirmasi Ari, tidak ditampilkan. */
  status: ProjectStatus | null;
  statusNote?: L;
  links?: { demo?: string; github?: string };
  /** Angka yang sudah ada. Angka bertanda [ISI] di PRD sengaja tidak dimasukkan. */
  facts?: { value: string; label: L }[];
  caseStudy: {
    masalah?: L;
    peran?: L;
    solusi?: L;
    /** Alur arsitektur, kiri ke kanan. Tiap kolom boleh berisi beberapa node. */
    arsitektur?: { kolom: string[][]; deskripsi: L };
    keputusan?: L[];
    hasil?: L;
    tantangan?: L;
  };
  /** Tangkapan layar asli, data sensitif wajib disamarkan (PRD 9.4). */
  images: { src: string; alt: L; caption?: L }[];
};

export type MinorProject = { title: L; note?: L };

export type SkillGroupId = "frontend" | "backend" | "devops" | "ai" | "mobile" | "marketing";

export type Skill = {
  name: string;
  /** Bukti: slug proyek (tertaut) atau teks bebas (tidak tertaut). */
  bukti: (string | L)[];
};

export type SkillGroup = { id: SkillGroupId; label: L; skills: Skill[] };

export type LogEntry = {
  when: L;
  /** Label pendek untuk struk, maks 9 karakter. */
  short: string;
  title: L;
  line?: L;
};
