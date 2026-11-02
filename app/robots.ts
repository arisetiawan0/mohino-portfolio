import { site } from "@/content/site";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // /cv tidak diblokir di sini: halamannya sudah noindex, dan crawler perlu bisa membaca tag itu.
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
