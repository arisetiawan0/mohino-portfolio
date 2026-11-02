"use client";


/**
 * Tautan ke mesin kasir. Klik mencetak `cmd` (daftar perintah) di struk supaya
 * pengunjung langsung melihat apa yang bisa diketik. Di desktop baris input
 * ikut difokuskan; di layar sentuh cukup menggulir tanpa membuka papan ketik.
 */
export function TrySimLink({ cmd, children }: { cmd: string; children: React.ReactNode }) {
  return (
    <a
      href="#simulator"
      onClick={(e) => {
        const input = document.getElementById("sim-input");
        const sim = document.getElementById("simulator");
        if (!input || !sim) return;
        e.preventDefault();
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const behavior = reduced ? "auto" : "smooth";
        // Tinggi log mengikuti tinggi layar, jadi mesin kasir sampai baris input muat satu layar.
        const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        const inView = sim.getBoundingClientRect().top >= pad - 8 && input.getBoundingClientRect().bottom <= window.innerHeight;
        // Tombol keypad yang sama dipakai, jadi jalurnya sama sebelum dan sesudah simulator dimuat.
        sim.querySelector<HTMLButtonElement>(`[data-cmd="${cmd}"]`)?.click();
        if (fine) input.focus({ preventScroll: true });
        // Gulir hanya bila mesin kasir atau baris input belum terlihat penuh.
        if (!inView) window.scrollTo({ top: sim.getBoundingClientRect().top + window.scrollY - pad, behavior });
      }}
      className="group inline-flex min-h-11 items-center gap-2 text-sm text-kertas underline decoration-garis decoration-1 underline-offset-[6px] transition-colors hover:decoration-kertas"
    >
      {children}
      {/* Mesin kasir di kanan pada layar lebar, di bawah pada layar sempit.
          inline-block supaya panah tidak ikut bergaris bawah dan bisa digeser. */}
      <span aria-hidden className="inline-block transition-transform group-hover:translate-y-0.5 lg:hidden">
        ↓
      </span>
      <span aria-hidden className="hidden transition-transform group-hover:translate-x-0.5 lg:inline-block">
        →
      </span>
    </a>
  );
}
