import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { homeHref, projectHref } from "@/lib/i18n";
import type { MetadataRoute } from "next";

// Output statis: dirender sekali saat build.
export const dynamic = "force-static";

const abs = (path: string) => new URL(path, site.url).toString();

/** Beranda dan semua case study, masing-masing dengan pasangan bahasanya (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${site.updatedAt}T00:00:00Z`);
  const pair = (id: string, en: string, priority: number): MetadataRoute.Sitemap =>
    [id, en].map((path) => ({
      url: abs(path),
      lastModified,
      priority,
      alternates: { languages: { id: abs(id), en: abs(en), "x-default": abs(id) } },
    }));

  return [
    ...pair(homeHref("id"), homeHref("en"), 1),
    ...projects.flatMap((p) => pair(projectHref("id", p.slug), projectHref("en", p.slug), 0.7)),
  ];
}
