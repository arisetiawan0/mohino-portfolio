"use client";

import { useMode } from "@/components/mode/ModeProvider";
import { projectsForMode } from "@/content/projects";
import type { Lang, Project } from "@/content/types";
import { dict, loc, projectHref } from "@/lib/i18n";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/**
 * Indeks proyek seperti daftar belanja (PRD 6.4).
 * Desktop: hover memanjangkan leader dan pratinjau mengikuti kursor di kanan.
 * Sentuh: ketuk baris untuk membuka ringkasan di tempat.
 */
export function ProjectList({ lang, labels }: { lang: Lang; labels: Record<string, ReactNode> }) {
  const t = dict(lang);
  const { mode } = useMode();
  const { top, rest } = useMemo(() => projectsForMode(mode), [mode]);
  const [featured, ...others] = top;

  const [touch, setTouch] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const zoneRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setTouch(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Pratinjau mengikuti kursor di kolom kanan, selalu di bawah struk unggulan.
  const place = (clientY: number) => {
    const zone = zoneRef.current;
    const preview = previewRef.current;
    if (!zone || !preview) return;
    const z = zone.getBoundingClientRect();
    const ph = preview.offsetHeight || 360;
    const minY = (featuredRef.current?.offsetHeight ?? 0) + 40;
    const y = Math.max(minY, Math.min(z.height - ph, clientY - z.top - ph / 2));
    preview.style.transform = `translate3d(0, ${y}px, 0)`;
  };
  const follow = (clientY: number) => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      place(clientY);
    });
  };

  const row = (p: Project, quiet = false) => {
    const href = projectHref(lang, p.slug);
    const open = expanded === p.slug;
    const inner = (
      <>
        <span className="flex flex-wrap items-end gap-x-3 gap-y-1">
          <span className={`type-title ${quiet ? "text-lg text-kabut group-hover:text-kertas" : "text-xl text-kertas md:text-[1.75rem]"} transition-colors duration-150`}>
            {loc(p.title, lang)}
          </span>
          <span aria-hidden className="leader hidden text-kabut sm:block" />
          <span className="basis-full font-mono text-sm text-kabut sm:ml-auto sm:basis-auto sm:shrink-0">
            {p.stack.slice(0, quiet ? 2 : 3).join(", ")}
            {quiet ? null : <span className="ml-3 hidden xl:inline">{p.tags.map((tag) => `[${tag}]`).join(" ")}</span>}
          </span>
        </span>
        <span
          className={`mt-1.5 max-w-[60ch] text-base leading-relaxed text-kabut ${quiet ? "hidden" : "block"} [@media(hover:none)]:hidden`}
        >
          {loc(p.summary, lang)}
        </span>
      </>
    );

    const base = "row-hover group block w-full border-t border-garis py-5 text-left";

    if (touch) {
      return (
        <li key={p.slug}>
          <button
            type="button"
            className={base}
            aria-expanded={open}
            aria-controls={`ringkas-${p.slug}`}
            onClick={() => setExpanded(open ? null : p.slug)}
          >
            {inner}
          </button>
          <div id={`ringkas-${p.slug}`} hidden={!open} className="pb-6">
            <p className="max-w-[60ch] leading-relaxed text-kabut">{loc(p.summary, lang)}</p>
            <a href={href} className="btn mt-4 border border-kertas text-kertas">
              {t.projects.openCase}
            </a>
          </div>
        </li>
      );
    }

    return (
      <li key={p.slug}>
        <a
          href={href}
          className={base}
          onMouseEnter={(e) => {
            // Posisi diset langsung (tanpa menunggu frame) supaya tidak muncul di atas struk unggulan.
            place(e.clientY);
            setHovered(p.slug);
          }}
          onMouseMove={(e) => follow(e.clientY)}
          onMouseLeave={() => setHovered((h) => (h === p.slug ? null : h))}
        >
          {inner}
        </a>
      </li>
    );
  };

  const hoveredProject = [...others, ...rest].find((p) => p.slug === hovered);

  return (
    <div ref={zoneRef} className="relative grid grid-cols-1 gap-x-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        {/* Unggulan: baris lebih tinggi, pratinjau di samping. */}
        {featured ? (
          <a href={projectHref(lang, featured.slug)} className="row-hover group block border-t border-kertas pb-10 pt-6">
            <span className="flex flex-wrap items-end gap-x-3 gap-y-1 sm:flex-nowrap">
              <span className="type-display text-[clamp(2.25rem,4.4vw,3.5rem)] text-kertas">{loc(featured.title, lang)}</span>
              <span aria-hidden className="leader hidden text-kabut sm:block" />
              <span className="basis-full font-mono text-sm text-kabut sm:basis-auto sm:shrink-0">
                {featured.stack.join(", ")}
                <span className="ml-3">{featured.tags.map((tag) => `[${tag}]`).join(" ")}</span>
              </span>
            </span>
            <span className="mt-4 block max-w-[52ch] text-lg leading-relaxed text-kabut">{loc(featured.summary, lang)}</span>
            <span className="mt-6 inline-flex min-h-11 items-center text-sm text-kertas underline decoration-garis underline-offset-[6px] group-hover:decoration-kertas">
              {t.projects.openCase}
            </span>
            <span className="mt-10 block lg:hidden">{featured ? labels[featured.slug] : null}</span>
          </a>
        ) : null}

        <ul>{others.map((p) => row(p))}</ul>

        {rest.length ? (
          <div className="mt-16">
            <h3 className="mb-2 text-sm text-kabut">{t.projects.others}</h3>
            <ul>{rest.map((p) => row(p, true))}</ul>
          </div>
        ) : null}
      </div>

      {/* Kolom pratinjau (desktop). */}
      <div className="relative hidden lg:col-span-4 lg:block">
        <div ref={featuredRef} className="pt-6">
          {featured ? labels[featured.slug] : null}
        </div>
        <div
          ref={previewRef}
          aria-hidden
          // Saat tersembunyi, posisi melompat tanpa transisi; saat tampil, posisi mengikuti kursor halus.
          className={`pointer-events-none absolute inset-x-0 top-0 duration-[160ms] ease-out ${
            hoveredProject ? "opacity-100 transition-[opacity,transform]" : "opacity-0 transition-opacity"
          }`}
        >
          {hoveredProject ? labels[hoveredProject.slug] : null}
        </div>
      </div>
    </div>
  );
}
