import type { ReactNode } from "react";

/** Judul section bergaya papan lorong toko: Archivo sempit, berat. */
export function SectionHead({ id, title, aside, below }: { id: string; title: string; aside?: ReactNode; below?: ReactNode }) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 md:mb-16">
      <h2 id={id} className="type-sign text-[clamp(3.25rem,8.5vw,6rem)] text-kertas">
        {title}
      </h2>
      {aside ? <div className="pb-2 font-mono text-sm text-kabut">{aside}</div> : null}
      {below ? <p className="basis-full font-mono text-sm text-kabut">{below}</p> : null}
    </div>
  );
}
