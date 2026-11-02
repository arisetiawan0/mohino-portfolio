import type { Lang } from "@/content/types";
import { dict } from "@/lib/i18n";
import { SectionHead } from "./SectionHead";
import { SkillGroups } from "./Skills";

export function SkillsSection({ lang }: { lang: Lang }) {
  const t = dict(lang).skills;
  return (
    <section id="skill" aria-labelledby="skill-judul" className="section-y border-t border-garis">
      <div className="wrap grid grid-cols-1 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-4">
          <SectionHead id="skill-judul" title={t.heading} />
          <p className="-mt-6 mb-12 max-w-[34ch] leading-relaxed text-kabut md:-mt-8">{t.intro}</p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <SkillGroups lang={lang} evidenceLabel={t.evidence} />
        </div>
      </div>
    </section>
  );
}
