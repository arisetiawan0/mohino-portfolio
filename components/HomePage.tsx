import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Log } from "@/components/sections/Log";
import { Nav } from "@/components/sections/Nav";
import { ProjectIndex } from "@/components/sections/ProjectIndex";
import { SkillsSection } from "@/components/sections/SkillsSection";
import type { Lang } from "@/content/types";
import { personJsonLd } from "@/lib/meta";

export function HomePage({ lang }: { lang: Lang }) {
  return (
    <>
      <Nav lang={lang} />
      <main id="konten">
        <Hero lang={lang} />
        <ProjectIndex lang={lang} />
        <About lang={lang} />
        <SkillsSection lang={lang} />
        <Log lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(lang)).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
