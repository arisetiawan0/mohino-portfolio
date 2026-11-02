"use client";

import { useEffect, useState } from "react";

/**
 * Daftar isi samping (anotasi kanan, PRD 6.5). Bagian yang sedang dibaca
 * ditandai; murni respons terhadap gulir, tanpa animasi dekoratif.
 */
export function CaseToc({ label, items }: { label: string; items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;
    // Simpan semua bagian yang sedang berada di pita atas layar; yang aktif adalah
    // yang paling awal di urutan halaman. Bila tidak ada, penanda tetap di posisi terakhir.
    const visible = new Set<string>();
    const order = items.map((i) => i.id);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const first = order.find((id) => visible.has(id));
        if (first) setActive(first);
      },
      { rootMargin: "-96px 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label={label}>
      <p className="mb-3 font-mono text-xs text-kabut">{label}</p>
      <ul className="border-l border-garis">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "location" : undefined}
              className={`-ml-px flex min-h-10 items-center border-l-2 pl-4 text-sm transition-colors duration-150 ${
                active === i.id ? "border-kertas text-kertas" : "border-transparent text-kabut hover:text-kertas"
              }`}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
