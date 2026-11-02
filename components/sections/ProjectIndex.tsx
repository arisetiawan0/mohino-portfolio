import { ModeText } from "@/components/mode/ModeText";
import { minorProjects, projects } from "@/content/projects";
import type { Lang } from "@/content/types";
import { dict, loc } from "@/lib/i18n";
import { ProjectLabel } from "./ProjectLabel";
import { ProjectList } from "./ProjectList";
import { SectionHead } from "./SectionHead";

export function ProjectIndex({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const labels = Object.fromEntries(
    projects.map((p) => [p.slug, <ProjectLabel key={p.slug} project={p} lang={lang} />]),
  );

  return (
    <section id="proyek" aria-labelledby="proyek-judul" className="section-y">
      <div className="wrap">
        <SectionHead id="proyek-judul" title={t.projects.heading} below={<ModeText values={t.modeCaption} />} />
        <ProjectList lang={lang} labels={labels} />

        <div className="mt-16 lg:w-2/3">
          <h3 className="mb-4 text-sm text-kabut">{t.projects.minor}</h3>
          <ul className="grid grid-cols-1 gap-x-8 border-t border-garis sm:grid-cols-2">
            {minorProjects.map((m) => (
              <li key={m.title.id} className="border-b border-garis py-3">
                <span className="block text-kertas">{loc(m.title, lang)}</span>
                {m.note ? <span className="block font-mono text-xs text-kabut">{loc(m.note, lang)}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
