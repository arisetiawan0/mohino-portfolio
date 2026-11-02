import { ModeSwitch } from "@/components/mode/ModeSwitch";
import { SimulatorLoader } from "@/components/simulator/SimulatorLoader";
import { SimulatorStatic } from "@/components/simulator/SimulatorStatic";
import { projects } from "@/content/projects";
import type { Lang } from "@/content/types";
import { dict } from "@/lib/i18n";
import { ModeBlock, ModeText } from "@/components/mode/ModeText";
import { FeaturedProof } from "./FeaturedProof";
import { TrySimLink } from "./HeroExtras";
import { RotatingLines, RotationControl, RotationProvider } from "./RotatingHeadline";

export function Hero({ lang }: { lang: Lang }) {
  const t = dict(lang);
  return (
    <section aria-labelledby="judul" className="relative overflow-x-clip">
      {/* Kontur Teluk Kendari, statis. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/kontur-teluk.svg')] bg-[length:1500px_auto] bg-[position:58%_30%] bg-no-repeat md:bg-[length:1700px_auto] md:bg-[position:62%_20%]"
      />
      <a href="#proyek" className="sr-only-focusable absolute left-4 top-4 z-30 bg-kertas px-3 py-2 text-sm text-tinta">
        {t.nav.skipSim}
      </a>
      <div className="wrap relative grid grid-cols-1 gap-y-14 pb-[var(--section)] pt-10 md:pt-14 lg:pt-12 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-7">
          <RotationProvider>
            {/* Tinggi baris status disamakan dengan baris atas mesin kasir, supaya kedua kolom sejajar. */}
            <div className="mb-6 flex min-h-[2.375rem] items-center justify-between gap-4">
              <p className="flex items-center gap-3 font-mono text-xs text-kabut">
                <span aria-hidden className="inline-block size-2 shrink-0 bg-kabut" />
                <ModeText values={t.hero.status} />
              </p>
              <RotationControl
                pause={t.hero.rotatePause}
                play={t.hero.rotatePlay}
                pauseLabel={t.hero.rotatePauseLabel}
                playLabel={t.hero.rotatePlayLabel}
              />
            </div>
            <h1
              id="judul"
              className="type-display hero-title text-[clamp(2.5rem,10.6vw,5.25rem)] text-kertas lg:text-[clamp(3.5rem,4.6vw,4.75rem)]"
            >
              <span aria-hidden className="block">
                {t.hero.lead}
              </span>
              <RotatingLines lead={t.hero.lead} lines={t.hero.rotate} />
            </h1>
          </RotationProvider>
          <ModeBlock
            className="mt-6 max-w-[50ch] text-lg leading-[1.55] text-kabut text-pretty md:text-[1.3125rem] lg:text-[1.25rem]"
            render={(m) => (
              <>
                <span className="block text-balance text-kertas">{t.hero.subLead[m]}</span> {t.hero.sub[m]}
              </>
            )}
          />
          <div className="mt-6">
            <FeaturedProof lang={lang} label={t.hero.featured} />
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="#proyek" className="btn bg-kertas text-tinta hover:bg-white">
              {t.hero.ctaProjects(projects.length)}
            </a>
            <TrySimLink cmd={t.sim.cmd.help}>{t.hero.ctaSim}</TrySimLink>
          </div>
          <div className="mt-8 border-t border-garis pt-3">
            <ModeSwitch label={t.hero.modeLabel} names={t.modes} />
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:col-start-8 lg:justify-end">
          <SimulatorLoader lang={lang}>
            <SimulatorStatic lang={lang} />
          </SimulatorLoader>
        </div>
      </div>
    </section>
  );
}
