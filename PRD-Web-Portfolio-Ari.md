# PRD: Web Portfolio Ari Setiawan

Versi 1.0 · Oktober 2026 · Format: markdown, siap diberikan ke coding agent (Claude Code / OpenCode)

---

## 1. Ringkasan

Web portfolio pribadi untuk Ari Setiawan, developer sekaligus digital marketer yang membangun sistem untuk retail (ABS Group, 26 cabang). Web ini **fleksibel**: tidak dibuat untuk satu lowongan, tetapi bisa dibuka dalam tiga "mode" (Developer, AI & Automation, Digital Marketing) lewat satu link berbeda per lamaran.

**Momen penanda (satu hal yang diingat orang):** hero berisi simulator interaktif yang mencetak jawaban sebagai **struk kasir**. Pengunjung mengetik atau mengetuk perintah (`proyek`, `skill`, `kontak`), lalu struk keluar dari slot printer, lengkap dengan stempel dan barcode. Seluruh bagian web lainnya sengaja tenang dan rapi supaya momen ini menonjol.

**Mengapa struk:** dunia kerja Ari adalah toko: kasir, void/refund, promo, member, stok, barcode. Itu sumber visual yang spesifik dan tidak dimiliki portfolio developer lain, dan menghindari tampilan "terminal gelap + aksen neon" yang kini umum.

## 2. Sasaran dan non-sasaran

**Sasaran**
1. Rekruter/klien memahami dalam 10 detik: siapa Ari, bidangnya, dan bukti terbaiknya.
2. Satu web melayani lamaran developer, AI/automation, dan digital marketing tanpa duplikasi konten.
3. Web itu sendiri menjadi bukti kemampuan (performa, aksesibilitas, detail teknis).
4. Desain terasa dibuat khusus untuk Ari, bukan template atau hasil generator.

**Non-sasaran**
- Bukan blog, bukan toko, tidak ada backend/login/database di versi 1.
- Simulator **tidak** memanggil LLM sungguhan (tanpa biaya API, tanpa risiko penyalahgunaan). Semua jawaban terskrip.

**Audiens utama:** rekruter dan hiring manager (sering membuka dari HP, waktu 1-2 menit), calon klien jasa website/ads, sesama developer.

## 3. Referensi dan batasannya

Referensi: situs "nca" (terminal AI coding agent). Dari situ **diambil polanya saja**:
- Hero yang memuat panel simulator interaktif (transcript + panel konteks) dan menyembul dari bawah layar.
- Baris status singkat di atas headline, panel konteks di samping transcript.

**Sengaja tidak ditiru:** latar hitam dengan aksen oranye, partikel bara, siluet gunung, campuran serif-sans-mono yang sama, tampilan terminal gelap. Identitas visual web Ari berasal dari dunia retail, bukan dari estetika terminal.

## 4. Konsep desain

### 4.1 Arah
- **Subjek:** sistem retail di Sulawesi Tenggara. Kosakata visual: struk termal, label harga promo, stempel LUNAS/VOID, barcode, layar pelanggan 2 baris (pole display), garis kontur Teluk Kendari.
- **Suasana:** tenang dan presisi, seperti meja kasir yang tertata. Hangat, bukan korporat.
- **Alignment:** teks rata kiri. Struk diletakkan di kolom kanan, sedikit miring (-1°), sehingga komposisi asimetris.

### 4.2 Prinsip
1. **Satu momen berani, sisanya tenang.** Struk adalah satu-satunya elemen dramatis.
2. **Struktur adalah informasi.** Garis putus-putus (dotted leader) hanya dipakai untuk daftar proyek karena itu memang idiom struk. Penomoran hanya dipakai di timeline (urutan nyata).
3. **Bukti di atas klaim.** Setiap skill menaut ke proyek yang memakainya. Tidak ada bar persentase.
4. **Gerak menjawab aksi.** Gerak otomatis hanya satu: struk mencetak saat halaman dimuat. Sisanya muncul sebagai respons klik/ketik.
5. **Teks spesifik.** Tidak ada "Hi, I'm…", tidak ada lorem, tidak ada klaim tanpa angka atau nama proyek.

### 4.3 Daftar larangan (anti-generik, wajib dicek saat review)
- Tidak ada gradien ungu/biru, glassmorphism, atau blob dekoratif.
- Tidak ada deretan 3 kartu identik berradius sama dengan bayangan abu-abu seragam.
- Tidak ada fade-and-slide-up pada setiap section, dan tidak ada hover transition di setiap kartu.
- Tidak ada label kecil ALL-CAPS di atas setiap heading, tidak ada string meta bertanda titik tengah, tidak ada panah "→" di akhir teks tombol/link.
- Tidak ada satu kata di headline yang diberi warna/italic berbeda sebagai "aksen".
- Tidak ada ilustrasi stock, ikon emoji sebagai bullet, atau mockup perangkat generik. Pakai tangkapan layar asli yang dipotong dan diberi anotasi.
- Huruf kapital hanya di dalam struk (idiom struk), tidak di UI lain.

## 5. Design tokens

### 5.1 Warna (6 warna dasar)

| Token | Hex | Peran |
|---|---|---|
| `--teluk` | `#0F3D3E` | Latar halaman (air Teluk Kendari, bukan hitam) |
| `--kertas` | `#F2F3EE` | Kertas struk, permukaan terang |
| `--tinta` | `#1C2024` | Teks pada kertas, teks utama pada permukaan terang |
| `--promo` | `#FFD23F` | Aksen utama: tombol, fokus, label harga promo |
| `--stempel` | `#D4283C` | Stempel (VOID/LUNAS), error, hanya untuk momen stempel |
| `--vfd` | `#8CF5D8` | Teks pada layar pelanggan (VFD) di atas `#0A1614` |

Tambahan: `--kabut #9DBFB8` (teks sekunder di atas `--teluk`, kontras ≥ 4.5:1), garis kontur `rgba(157,191,184,.14)`.
Aturan: `--promo` hanya satu per viewport sebagai CTA utama. `--stempel` tidak dipakai di luar stempel.

### 5.2 Tipografi
Dua keluarga, jelas berbeda peran:

| Peran | Font | Catatan |
|---|---|---|
| Display + UI + body | **Archivo** (variable, sumbu `wdth` 62-125, `wght` 100-900) | Headline memakai lebar sempit dan berat tinggi (kesan papan harga/signage), body memakai lebar normal |
| Struk + simulator + kode | **Courier Prime** | Terasa seperti cetakan termal; fallback `"Courier New", monospace` |
| Layar pelanggan (opsional) | **DSEG14 Classic** | Angka/huruf 14-segmen; fallback Courier Prime |

Skala (rem): 0.8125 / 0.9375 / 1 / 1.25 / 1.75 / 2.5 / clamp(3rem, 7vw, 6.5rem) untuk H1.
H1: Archivo `wdth 75`, `wght 800`, tracking -0.01em, leading 0.95. Body: Archivo `wdth 100`, `wght 400`, leading 1.6, lebar baris ≤ 68ch. Struk: Courier Prime 15px / leading 1.35, lebar 32 karakter.
Font di-host sendiri via `next/font` (subset latin, `display: swap`).

### 5.3 Bentuk dan kedalaman
- Radius: **0** pada struk (tepi gerigi sobekan), **2px** pada tombol dan input, **0** pada gambar proyek. Tidak ada radius seragam di semua elemen.
- Bayangan: hanya satu, di bawah struk (`0 18px 30px -12px rgba(0,0,0,.45)`). Elemen lain datar.
- Tekstur: grain halus 3% pada `--teluk` (PNG 128px, di-tile), kontur Teluk Kendari sebagai SVG statis.

### 5.4 Spasi
Basis 4px. Kontainer maks 1200px, padding horizontal 24px (mobile) / 48px (desktop). Jarak antar-section 120px (desktop) / 72px (mobile).

## 6. Layout dan halaman

### 6.1 Sitemap
```
/                 beranda (hero + simulator, proyek, tentang, skill, riwayat, kontak)
/proyek/[slug]    case study per proyek
/en, /en/...      versi bahasa Inggris (cermin struktur yang sama)
/cv               redirect ke PDF CV terbaru
404               "Struk tidak ditemukan" (halaman 404 bertema struk)
```
Query `?peran=dev|ai|marketing` menentukan mode awal. Contoh: `namakamu.dev/?peran=marketing`.

### 6.2 Navigasi
Kiri: nama "Ari Setiawan" (Archivo wdth 75). Tengah/kanan: Proyek, Tentang, Skill, Kontak. Paling kanan: pilihan bahasa `ID | EN` dan tombol **Unduh CV** (satu-satunya tombol `--promo` di navbar). Sticky, latar `--teluk` dengan garis bawah 1px. Di mobile: tombol menu penuh layar.

### 6.3 Hero (desktop 1440)
```
┌───────────────────────────────────────────────────────────────────────────┐
│ Ari Setiawan             Proyek  Tentang  Skill  Kontak   ID|EN [Unduh CV]│
│                                                                           │
│  Saya membangun sistem                      ┌──────────────────────┐      │
│  untuk toko, dari kasir                     │ MODE      DEVELOPER  │      │ <- layar pelanggan
│  sampai kampanye.                           │ DIBUKA    0 / 4      │      │    (VFD 2 baris)
│                                             └──────────────────────┘      │
│  Developer dan digital marketer di                                        │
│  Kendari. Dashboard, API, dan chatbot       ═══ slot printer ═══════      │
│  untuk retail 26 cabang.                      ┌────────────────────┐      │
│                                               │ STRUK PORTOFOLIO   │      │ <- kertas keluar
│  [Lihat proyek]  Coba simulator               │ ------------------ │      │    ke bawah,
│                                               │ > profil           │      │    miring -1°
│  Developer · AI dan automation · Marketing    │ ARI SETIAWAN       │      │
│  (pilihan mode, segmented control)            │ ...                │      │
│                                               │ > _                │      │
│                                               └~~~~~~~~~~~~~~~~~~~~┘      │
└───────────────────────────────────────────────────────────────────────────┘
```
- Kolom kiri 5/12 (headline, subteks, CTA, pilihan mode). Kolom kanan 6/12 (layar pelanggan di atas slot, struk di bawahnya). Struk menyembul melewati lipatan layar (below the fold) agar mengundang scroll.
- Pilihan mode adalah segmented control teks biasa (bukan kartu).
- Mobile: headline, CTA, lalu struk selebar layar (tinggi awal 340px) dengan chip perintah di bawahnya.

### 6.4 Proyek (indeks seperti daftar belanja)
Bukan grid kartu. Setiap proyek satu baris dengan garis putus-putus:
```
Portal Promo ............................ Next.js, TiDB          [dev]
Dashboard promosi 334 promosi, 26 cabang
Laporan Void dan Refund ................. PWA, Next.js           [dev]
...
```
- Baris pertama (unggulan) lebih tinggi dan menampilkan tangkapan layar di sampingnya.
- Hover (desktop): garis putus-putus memanjang dan tangkapan layar mengikuti kursor di sisi kanan. Tap (mobile): baris mengembang di tempat menampilkan ringkasan dan tombol **Buka case study**.
- Filter mengikuti mode aktif. Proyek di luar mode tidak disembunyikan, hanya diturunkan ke grup "Proyek lain".
- Tanpa nomor urut (daftar ini bukan urutan).

### 6.5 Halaman case study
Satu kolom 68ch di kiri, anotasi samping di kanan (desktop). Struktur: Ringkasan satu kalimat, Masalah, Peran saya, Solusi dan arsitektur (diagram SVG sederhana), Keputusan teknis, Hasil, Tantangan dan pelajaran, Tautan (Demo/GitHub). Judul halaman dicetak seperti kepala struk. Di akhir halaman: stempel kecil sesuai status proyek (LIVE, BERJALAN, DALAM PENGEMBANGAN).

### 6.6 Tentang
Foto profil kiri (rasio 4:5, crop rapi, latar netral), teks 3-4 kalimat kanan. Perlakuan foto: grayscale dengan duotone `--teluk`/`--kertas`, berubah ke warna asli saat hover/fokus. Jika foto lama berlatar merah dipakai, wajib dikonversi duotone.

### 6.7 Skill (terhubung ke bukti)
Dua kolom: nama keahlian di kiri, **bukti** di kanan.
```
Laravel / PHP ........ HRIS ABS Group (API), Kasbonku
Next.js + React ...... Portal Promo, Laporan Void dan Refund, BeautyStore
Supabase, PostgreSQL . HRIS, Chatbot AI, Pareto Pulse
FastAPI + Docker ..... Affari API, face recognition absensi
Meta Ads ............. Kampanye traffic dan chat WhatsApp Beauty Kendari
```
Dikelompokkan: Frontend, Backend dan database, Server dan DevOps, AI, Mobile, Marketing. Hanya kelompok sesuai mode yang terbuka; sisanya terlipat.

### 6.8 Riwayat (timeline = urutan nyata)
Garis vertikal bergaya `git log`: tanggal, judul, satu baris. Pendidikan, Bangkit Academy, ABS Group, bootcamp. Pengalaman logistik 2020-2025 cukup satu entri ringkas.

### 6.9 Kontak (akhir struk)
Bagian penutup tampil sebagai ujung struk:
```
------------------------------
TERIMA KASIH
Terbuka untuk kerja sama dan peluang kerja.

Email · WhatsApp · LinkedIn · GitHub
[ barcode: ARISETIAWAN ]
------------------------------
```
Tombol: **Salin email** (saat diklik, garis pindai merah menyapu barcode sekali sebagai konfirmasi, teks tombol berubah "Email disalin"), **Chat WhatsApp** (tautan `wa.me`), LinkedIn, GitHub. Nomor telepon tidak ditampilkan mentah; hanya tautan.

### 6.10 Footer
Barcode dekoratif (Code128 dari "ARISETIAWAN"), tanggal pembaruan terakhir, dan satu baris tentang stack web ini. Tanpa ikon sosial berlebihan.

## 7. Simulator "Struk"

### 7.1 Komponen
1. **Layar pelanggan** (VFD 2 baris x 20 karakter): menampilkan `MODE` dan `DIBUKA n/total`, serta status sementara (`MENCETAK...`, `SIAP`).
2. **Slot printer**: garis gelap tipis melintang; struk keluar dari sini.
3. **Struk**: gulungan kertas berisi riwayat perintah dan jawaban. Bisa di-scroll di dalam kertas (maks tinggi 440px desktop).
4. **Baris input** di dasar struk: prompt `>` dengan kursor berkedip, plus chip perintah cepat (Bantuan, Proyek, Skill, Kontak).

### 7.2 Perintah
Semua perintah juga menerima alias bahasa Inggris. Perintah tidak peka huruf besar-kecil. Perintah salah menampilkan saran ("Maksud kamu: proyek?") dengan pencocokan fuzzy (jarak Levenshtein ≤ 2).

| Perintah | Alias | Hasil |
|---|---|---|
| `bantuan` | `help`, `?` | Daftar perintah |
| `profil` | `whoami`, `tentang` | Ringkasan Ari (nama, peran, fokus, lokasi) |
| `proyek` | `projects`, `ls` | Daftar proyek sesuai mode, dengan slug |
| `buka <slug>` | `open` | Ringkasan satu proyek + tautan case study; stempel DIBUKA; menambah hitungan di layar pelanggan |
| `skill` | `stack` | Kelompok skill dan buktinya |
| `riwayat` | `log` | Timeline singkat |
| `mode <dev\|ai\|marketing>` | | Mengganti mode; layar pelanggan, daftar proyek di bawah hero ikut berubah |
| `kontak` | `contact` | Email, WhatsApp, LinkedIn, GitHub |
| `cv` | | Memulai unduhan CV |
| `bahasa <id\|en>` | `lang` | Pindah bahasa |
| `cetak` | `print` | Mengekspor struk sesi sebagai gambar PNG (bisa dibagikan) |
| `ulang` | `clear` | Struk disobek, gulungan baru dimulai |
| `void` | | Telur paskah: stempel VOID pada jawaban terakhir |
| `bayar` | `sudo hire ari` | Telur paskah: "Pembayaran diterima melalui obrolan." lalu membuka kontak |

### 7.3 Jawaban
Tiap jawaban adalah blok terstruktur (`text`, `list`, `leader-list`, `links`, `stamp`) yang dirender sebagai baris struk 32 karakter. Konten diambil dari sumber data yang sama dengan halaman (satu sumber kebenaran, lihat bagian 9).

Contoh `profil`:
```
> profil
------------------------------
ARI SETIAWAN
Developer dan digital marketer
Kendari, Sulawesi Tenggara
------------------------------
BIDANG
 - Aplikasi web (Next.js, Laravel)
 - Integrasi AI dan automation
 - Meta Ads dan analitik kampanye
S1 Informatika, IPK 3,54
------------------------------
Ketik "proyek" untuk lanjut.
```

### 7.4 Demo otomatis
Setelah halaman selesai dimuat (idle), struk mencetak demo sekali: `profil` lalu `proyek` (maks 7 detik). Berhenti seketika saat pengunjung menyentuh/mengetik. Tersedia tombol kecil "Lewati demo". Tidak berulang.

### 7.5 State
Reducer kecil tanpa library: `{ mode, lang, opened: Set<slug>, history: Block[], status }`. Riwayat disimpan di memori saja (tanpa localStorage). Maks 40 blok; blok lama dipotong dari atas.

### 7.6 Mobile dan input
- Mobile mengutamakan **chip** (ketuk) karena papan ketik menutup layar. Papan ketik hanya terbuka bila pengunjung mengetuk baris input.
- Chip kedua muncul setelah tiap jawaban sebagai saran lanjutan (contoh setelah `proyek`: tiga slug teratas).

### 7.7 Aksesibilitas simulator
- Struk memakai `role="log"` dengan `aria-live="polite"`; input punya label tersembunyi.
- Tab **tidak terjebak**: Esc atau Tab keluar dari input. Tautan "Lewati simulator" tersedia sebelum hero.
- Isi `profil` dan `proyek` dirender di server (SSR) sehingga terbaca mesin pencari, pembaca layar, dan kondisi tanpa JavaScript. Semua info di simulator juga ada di section biasa; simulator tidak pernah menjadi satu-satunya jalan ke konten.

## 8. Gerak dan 3D

### 8.1 Prinsip
Satu gerak otomatis (struk mencetak), sisanya respons terhadap aksi. Durasi pendek dan mekanis, bukan lembut. Semua gerak dihormati `prefers-reduced-motion`.

### 8.2 Spesifikasi

| Momen | Perilaku | Durasi / easing |
|---|---|---|
| Struk mencetak | Kertas maju per baris (langkah 14px), baris baru muncul tiap langkah; terasa mekanis | 60ms/baris, `steps(1)` |
| Ketikan pengguna | Karakter muncul seketika; setelah Enter, jeda 120ms lalu mencetak | 120ms |
| Stempel | Skala 1.6 → 1, rotasi -8°, sedikit getar | 180ms `cubic-bezier(.2,.9,.3,1.2)` |
| Sobekan (`ulang`/`cetak`) | Kertas bergeser ke bawah dan miring 4°, menghilang; gulungan baru keluar | 380ms ease-in |
| Layar pelanggan | Teks berganti dengan efek "scan" per karakter (kedip singkat) | 30ms/karakter |
| Hover baris proyek | Garis putus-putus memanjang, pratinjau mengikuti kursor | 160ms ease-out |
| Salin email | Garis pindai merah menyapu barcode sekali | 450ms linear |
| Pindah halaman | Potong langsung, tanpa transisi dekoratif (kecuali stempel di case study) | 0ms |

Tidak ada: animasi masuk per section, parallax scroll, kursor kustom, partikel.

### 8.3 Lapisan 3D (progressive enhancement)
- **Level A (wajib):** CSS 3D pada struk. `perspective: 1200px`, kemiringan dasar `rotateX(4deg) rotateZ(-1deg)`, mengikuti arah pointer ±2° (desktop saja), bayangan bergeser sesuai kemiringan.
- **Level B (opsional, setelah fitur inti selesai):** latar kontur Teluk Kendari berupa WebGL height-field (Three.js atau OGL), bergerak sangat lambat (rotasi ≤ 0.5°/detik). Syarat aktif: desktop, `hardwareConcurrency ≥ 4`, tidak `saveData`, tidak reduced-motion. Dimuat lazy setelah LCP. Fallback: SVG kontur statis.
- Teks struk **selalu DOM sungguhan**, tidak pernah digambar ke canvas.

## 9. Konten dan data

### 9.1 Satu sumber data
`content/projects.ts` (atau MDX per proyek) menjadi sumber untuk daftar proyek, simulator, OG image, dan halaman case study.

```ts
type Project = {
  slug: string;
  title: { id: string; en: string };
  summary: { id: string; en: string };     // 1 kalimat dampak
  tags: ("dev" | "ai" | "marketing")[];    // menentukan mode
  stack: string[];
  status: "live" | "berjalan" | "pengembangan";
  featured?: boolean;
  links?: { demo?: string; github?: string };
  caseStudy: {
    masalah: string; peran: string; solusi: string;
    keputusan: string[]; hasil: string; tantangan: string;
  };
  images: { src: string; alt: string; caption?: string }[]; // data sensitif wajib disamarkan
};
```

### 9.2 Hero dan teks inti
- H1 (ID): **Saya membangun sistem untuk toko, dari kasir sampai kampanye.**
- H1 (EN): **I build systems for retail, from the till to the campaign.**
- Subteks (ID): Developer dan digital marketer di Kendari. Dashboard, API, dan chatbot untuk retail dengan 26 cabang.
- Tentang (ID): Lulusan S1 Informatika Universitas Kristen Immanuel (IPK 3,54) yang aktif membangun aplikasi sejak 2022, dari proyek kampus dan Bangkit Academy sampai sistem yang dipakai langsung di ABS Group. Saya mengerjakan sistem dari nol: menyusun kebutuhan, mendesain database, membangun frontend dan backend, lalu men-deploy-nya sendiri. Saya juga mengintegrasikan AI ke alur kerja bisnis dan mengelola iklan berbayar untuk Beauty Kendari.
- Catatan: jangan menulis "3 tahun pengalaman kerja". Gunakan "aktif membangun aplikasi sejak 2022".

### 9.3 Proyek
Tanda **[ISI]** = angka/fakta yang hanya Ari yang tahu; **jangan dikarang**, kosongkan bila belum ada.

| Slug | Judul | Tag | Status | Ringkasan dan bukti |
|---|---|---|---|---|
| `chatbot-beauty-kendari` | Chatbot AI Beauty Kendari | ai, dev, marketing | berjalan | Chatbot web: tanya stok/harga per outlet, konsultasi kecantikan, analisis kulit dari foto wajah (vision LLM). Pencarian produk fuzzy dengan jawaban berjenjang menurut tingkat keyakinan. Foto wajah dihapus setelah 24 jam. Stack: Next.js, Supabase, Cloudflare Workers, LLM API. Hasil: [ISI] |
| `portal-promo` | Portal Promo | dev | live | Dashboard internal untuk mengelola dan memantau promosi lintas brand dan outlet: filter berlapis, workflow approval, export Excel, integrasi docs endpoint/webhook. 334 promosi tercatat (verifikasi angka terbaru). Stack: Next.js, TiDB. Hasil: [ISI waktu rekap sebelum dan sesudah]. Tantangan: kuota Request Units database habis, evaluasi migrasi |
| `laporan-void-refund` | Laporan Void dan Refund | dev | [ISI] | PWA pelaporan void/refund kasir per outlet dengan foto bukti ber-timestamp otomatis, login Outlet ID, dua role (Outlet dan Superadmin), export laporan gabungan per periode. Service worker sengaja tidak meng-cache endpoint upload. Hasil: [ISI jumlah outlet pengguna] |
| `hris-abs-group` | HRIS ABS Group | dev, ai | pengembangan | Pengganti Talenta: absensi, cuti, payroll, reimbursement. Laravel API-only, PostgreSQL, web admin TanStack Start, mobile React Native (Expo), monorepo pnpm, approval flow bertingkat yang dikonfigurasi Super Admin, face recognition server-side (InsightFace via FastAPI), foto absensi dihapus otomatis tiap bulan. Dikerjakan solo. Tulis status jujur (misal: "skema database lengkap, modul absensi sedang dibangun") |
| `beautystore` | BeautyStore | dev | live | Redesain landing page toko online (skincare, makeup, body care, parfum). Next.js, shadcn/ui, Vercel. Hasil: [ISI skor Lighthouse atau perubahan klik/chat] |
| `hermes-yeyen` | Hermes Agent "Yeyen" | ai | berjalan | Bot customer service di Telegram/WhatsApp, Docker di ZimaOS, proxy Cloudflare Worker |
| `cafe-ops-agent` | Cafe Ops Agent | ai | live (demo) | Agent pemesanan via Telegram untuk cafe, catat otomatis ke spreadsheet, ops board live. Proyek AI HackFest, data simulasi |
| `case-meta-ads` | Kampanye Meta Ads Beauty Kendari | marketing | selesai | Tujuan: traffic dan chat WhatsApp (bukan ROAS). Isi: tujuan, budget (boleh disamarkan jadi persentase), audiens, kreatif, CTR, CPC, biaya per chat, optimasi. Semua angka: [ISI] |
| `sentimen-sosmed` | Pipeline sentimen sosial media | marketing, ai | berjalan | Analisis sentimen Instagram/TikTok Beauty Kendari memakai Apify, GitHub Actions, Cloudflare Workers, Supabase |

**Proyek lain (satu baris saja, tanpa case study):** Archiver data penjualan/stok 30 outlet ke BigQuery (n8n, Cloudflare Tunnel), API Affari generik (FastAPI, Docker), PWA member Beauty Kendari, Pareto Pulse (evaluasi ±17 ribu SKU), Kasbonku, Gemarun 2026, Home Visit dashboard, Shopee Ads program supplier.

### 9.4 Aturan data sensitif
Semua proyek boleh dipublikasikan, tetapi tangkapan layar wajib menyamarkan: omzet dan angka keuangan riil, nama dan data karyawan (termasuk nama pejabat di dokumen kasbon), nomor telepon pelanggan, kunci API dan URL internal (alamat IP lokal, hostname internal). Pakai akun demo dengan data dummy bila ada demo langsung.

### 9.5 Skill dan riwayat
Skill dikelompokkan seperti di 6.7 (nama keahlian + bukti proyek). Riwayat (urut terbaru):
- Nov 2025-sekarang: Digital Marketing Staff, ABS Group (Kendari), membangun chatbot, dashboard, dan sistem internal
- Jan-Mar 2026: Bootcamp Digital Marketing Fullstack, MySkill
- Aug 2021-Sep 2025: S1 Informatika, Universitas Kristen Immanuel (asisten dosen, instruktur Programming Study Club)
- Feb-Jun 2024: Bangkit Academy (Mobile Development), capstone HerbaGuidesApp
- 2022-2023: Ketua proyek Sistem Informasi Kurir dan Aplikasi PIKI Sleman
- 2020-2025: Pengalaman operasional dan koordinasi tim di industri logistik

## 10. Mode per peran

| Mode | Proyek di atas | Skill terbuka | Layar pelanggan | CTA kontak |
|---|---|---|---|---|
| `dev` | Portal Promo, Void dan Refund, HRIS, BeautyStore | Frontend, Backend, DevOps | `MODE DEVELOPER` | "Terbuka untuk posisi developer" |
| `ai` | Chatbot AI, Hermes, Cafe Ops Agent, Sentimen | AI, Backend | `MODE AI/AUTOMATION` | "Terbuka untuk proyek AI dan automation" |
| `marketing` | Case Meta Ads, Sentimen, Chatbot AI | Marketing, Analitik | `MODE MARKETING` | "Terbuka untuk peran digital marketing" |

Mode awal: dari `?peran=` bila ada; bila tidak, `dev`. Mode tersimpan di URL (tanpa localStorage). Blok "**Dampak lintas bidang**" selalu tampil di bagian Tentang: *"Chatbot menjawab stok, data sentimen mengarahkan konten, iklan mengarahkan pelanggan ke chat itu."*

## 11. Bahasa (i18n)
Indonesia (default) dan Inggris. Routing `/` dan `/en`. Semua string di kamus (`content/id.ts`, `content/en.ts`). Perintah simulator bisa diketik dalam kedua bahasa. `hreflang` dipasang. Terjemahan Inggris ditulis natural, bukan literal.

## 12. Teknis

**Stack:** Next.js (App Router, output statis), TypeScript, Tailwind CSS dengan CSS variables untuk token, Motion (framer-motion) hanya untuk interaksi UI, CSS animation untuk pencetakan struk, MDX untuk case study. Library 3D (Level B) hanya dimuat dinamis.
**Deploy:** Cloudflare (Pages/Workers) atau Vercel, domain pribadi Ari, HTTPS, www redirect.
**Struktur:**
```
app/(id)/page.tsx            app/en/page.tsx          app/proyek/[slug]/page.tsx
components/receipt/*         (Printer, Receipt, Stamp, Barcode, CustomerDisplay)
components/simulator/*       (commands.ts, parser.ts, reducer.ts, blocks.tsx)
components/sections/*        (Hero, ProjectIndex, About, Skills, Log, Contact)
content/{projects.ts,id.ts,en.ts,skills.ts,log.ts}
public/{fonts,og,cv}
```
**Performa (target mobile, Lighthouse):** Performance ≥ 90, Accessibility/Best Practices/SEO ≥ 95. LCP < 2.0 detik (elemen LCP = H1, teks). CLS = 0 (ukuran struk dan layar pelanggan dipatok sebelum hidrasi). JS awal ≤ 120KB gzip; simulator di-hydrate saat idle; WebGL lazy. Gambar AVIF/WebP, `loading="lazy"` di bawah lipatan.
**SEO:** title dan meta description per halaman, Open Graph image (dirender dengan `next/og`, tampil seperti potongan struk berisi nama dan peran), JSON-LD `Person`, sitemap, robots.
**Analitik:** Cloudflare Web Analytics atau Plausible (tanpa cookie). Peristiwa: mode dipilih, perintah simulator dipakai, proyek dibuka, klik kontak/CV. Tidak ada pelacak iklan.
**Keamanan dan privasi:** tanpa form dan tanpa penyimpanan data pengunjung. Email dan WhatsApp hanya tautan. Nomor telepon tidak dicetak mentah di HTML.

## 13. Aksesibilitas dan kualitas
- Kontras: teks `--tinta` pada `--kertas` ≥ 12:1; teks `--kabut` pada `--teluk` ≥ 4.5:1; `--promo` hanya untuk teks besar atau tombol dengan teks `--tinta`.
- Fokus keyboard selalu terlihat (outline 2px `--promo`, offset 2px).
- Target sentuh ≥ 44px. Responsif dari 320px.
- Semua gambar punya `alt` bermakna; diagram punya deskripsi teks.
- Reduced motion: struk tampil sudah tercetak, tanpa animasi; layar pelanggan tanpa efek scan.
- Tanpa JavaScript: konten lengkap tetap terbaca, struk menampilkan hasil `profil` dan `proyek` statis.

## 14. Milestone dan kriteria selesai

| Tahap | Isi | Selesai bila |
|---|---|---|
| M1 Fondasi | Token, font, layout, section statis (hero tanpa simulator, indeks proyek, tentang, skill, riwayat, kontak), 4 case study inti, deploy ke domain | Semua section tampil benar di 320-1440px; Lighthouse sesuai target; konten tanpa placeholder **[ISI]** yang tersisa di halaman publik |
| M2 Simulator | Struk, layar pelanggan, semua perintah di 7.2, demo otomatis, chip mobile, SSR fallback | Setiap perintah menghasilkan jawaban benar di ID dan EN; tidak ada jebakan keyboard; berfungsi di iOS Safari dan Android Chrome |
| M3 Gerak dan 3D | Spesifikasi 8.2 lengkap, Level A, ekspor `cetak` (PNG), stempel, telur paskah | Semua gerak patuh reduced-motion; tidak ada frame drop berarti di HP kelas menengah |
| M4 Penyempurnaan | Versi Inggris penuh, OG image, 404 bertema struk, analitik, Level B (opsional) | Checklist larangan (4.3) lolos; tinjauan oleh satu orang non-IT: dalam 1 menit ia bisa menyebut siapa Ari dan apa yang dibuatnya |

**Uji "gelap-terang":** tutup nama dan logo; apakah halaman masih tampak khusus milik Ari (retail, struk, Kendari) dan bukan template? Jika tidak, ulangi desain bagian itu.

## 15. Input yang dibutuhkan dari Ari
1. Nama domain dan alamat email yang ditampilkan; boleh atau tidaknya menampilkan kota "Kendari".
2. Foto profil berlatar netral (foto di CV berlatar merah perlu diganti atau diberi duotone).
3. File CV PDF terbaru (Indonesia dan Inggris bila ada).
4. Tangkapan layar tiap proyek (data sensitif disamarkan) dan akun demo bila ada.
5. Semua angka bertanda **[ISI]**, terutama studi kasus Meta Ads (CTR, CPC, biaya per chat, budget dalam persentase bila rahasia).
6. Tautan GitHub proyek yang boleh publik dan LinkedIn.
7. Keputusan akhir untuk Level B (latar WebGL): dikerjakan hanya bila M1-M3 sudah mulus.

## 16. Risiko
| Risiko | Penanganan |
|---|---|
| Simulator terasa gimmick bagi rekruter yang terburu-buru | Semua konten juga tersedia sebagai section biasa; ada tautan "Lewati simulator"; demo otomatis hanya sekali |
| Struk tampil sempit di HP | Mobile memakai lebar penuh dan chip ketuk, bukan papan ketik |
| Data perusahaan bocor lewat tangkapan layar | Aturan 9.4; tinjau tiap gambar sebelum diunggah |
| Proyek berstatus "berjalan" dianggap klaim berlebihan | Status jujur ditampilkan lewat stempel; hasil tanpa angka dibiarkan kosong |
| Terlalu banyak efek | Batasi pada satu gerak otomatis; setiap gerak tambahan harus menjawab aksi pengguna |
