import { CaseStudy } from "@/components/CaseStudy";
import { projectBySlug, projects } from "@/content/projects";
import { site } from "@/content/site";
import type { Lang } from "@/content/types";
import { loc, projectHref } from "@/lib/i18n";
import { ogMeta } from "@/lib/meta";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const caseParams = () => projects.map((p) => ({ slug: p.slug }));

export async function caseMetadata(lang: Lang, params: Promise<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  const title = `${loc(p.title, lang)}, case study | ${site.name}`;
  return {
    metadataBase: new URL(site.url),
    title,
    description: loc(p.summary, lang),
    alternates: {
      canonical: projectHref(lang, slug),
      languages: { id: projectHref("id", slug), en: projectHref("en", slug) },
    },
    ...ogMeta(lang, title, loc(p.summary, lang), slug),
  };
}

export async function CasePage({ lang, params }: { lang: Lang; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();
  return <CaseStudy lang={lang} project={p} />;
}
