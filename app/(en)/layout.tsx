import { RootShell } from "@/components/RootShell";
import { site } from "@/content/site";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export { viewport } from "@/lib/meta";

// Dasar URL absolut untuk semua halaman di bawahnya (termasuk /cv dan 404).
export const metadata: Metadata = { metadataBase: new URL(site.url) };

export default function Layout({ children }: { children: ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
