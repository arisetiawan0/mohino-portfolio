import { site } from "@/content/site";
import type { Lang } from "@/content/types";
import { dict } from "@/lib/i18n";
import { ogAlt, ogPath, ogSize } from "@/lib/og";
import type { Metadata, Viewport } from "next";

/** Gambar pratinjau bergaya struk (lib/og.tsx), dicetak saat build ke /og/*.png. */
export function ogMeta(lang: Lang, title: string, description: string, slug?: string) {
  const image = { url: ogPath(lang, slug), ...ogSize, alt: ogAlt(lang, slug), type: "image/png" };
  return {
    openGraph: {
      title,
      description,
      locale: lang === "id" ? "id_ID" : "en_US",
      alternateLocale: lang === "id" ? "en_US" : "id_ID",
      siteName: site.name,
      type: slug ? "article" : "website",
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  } satisfies Metadata;
}

export const viewport: Viewport = {
  themeColor: "#0F3D3E",
  colorScheme: "dark",
};

export function homeMetadata(lang: Lang): Metadata {
  const t = dict(lang).meta;
  return {
    metadataBase: new URL(site.url),
    title: t.title,
    description: t.description,
    alternates: {
      canonical: lang === "id" ? "/" : "/en",
      languages: { id: "/", en: "/en", "x-default": "/" },
    },
    ...ogMeta(lang, t.title, t.description),
  };
}

export function personJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: lang === "id" ? "Developer dan digital marketer" : "Developer and digital marketer",
    alumniOf: "Universitas Kristen Immanuel",
    url: site.url,
    ...(site.photo ? { image: new URL(site.photo.src, site.url).toString() } : {}),
    sameAs: [site.linkedin, site.github],
  };
}
