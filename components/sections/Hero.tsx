import { HeroSceneMount } from '@/components/three/HeroSceneMount';
import { QuoteButton } from '@/components/site/QuoteButton';
import { CallButton } from '@/components/site/CallButton';
import { site } from '@/lib/site';
import poster from '@/lib/poster.generated.json';

// Home hero. The H1 and the poster render first (LCP is the headline, not the 3D).
// On capable desktops the live wall fades in over the poster and breaks apart on scroll.
export function Hero() {
  return (
    <section id="hero" className="on-ink group/hero relative isolate overflow-hidden bg-ink text-paper">
      {/* Scene box (desktop): the right half of the hero. Poster first, live wall over it. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[50%] lg:block xl:w-[52%]">
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_55%_45%,rgba(231,176,8,0.16),transparent_70%)]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-wall-poster.webp"
          alt=""
          width={poster.width}
          height={poster.height}
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 group-data-[scene=live]/hero:opacity-0"
        />
        <HeroSceneMount heroId="hero" />
      </div>

      <div className="container-x flex min-h-[calc(100svh-4.5rem)] flex-col justify-center py-16 lg:py-24">
        <div className="max-w-[44rem] lg:max-w-[48%]">
          <p className="inline-flex items-center gap-3 border-2 border-accent px-3 py-1.5 font-display text-sm font-bold uppercase tracking-wide text-accent">
            Since {site.foundingYear} · {site.license}
          </p>
          <h1 className="mt-7">
            <span className="display block text-[clamp(3.6rem,10vw,8.75rem)] lg:text-[clamp(4rem,8.2vw,8.75rem)] text-paper">
              We break it <span className="text-accent">down.</span>
            </span>
            <span className="mt-6 block max-w-xl font-display text-[clamp(1.25rem,2.2vw,1.65rem)] font-bold uppercase leading-tight tracking-[-0.01em] text-paper">
              Demolition contractor for Hampton Roads, Virginia, North Carolina and Maryland
            </span>
          </h1>
          <p className="lede mt-5 text-dust">
            Houses, commercial buildings and industrial plants, taken down with excavators, not explosives. Up to 75% of the material gets recycled.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <QuoteButton />
            <CallButton className="text-paper" />
          </div>
        </div>
        {/* Small screens: the wall as a still image under the buttons (no WebGL on phones). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-wall-poster.webp"
          alt=""
          width={poster.width}
          height={poster.height}
          loading="lazy"
          decoding="async"
          className="mt-12 h-auto w-full max-w-xl lg:hidden"
        />
      </div>
      <div className="hazard h-3" aria-hidden="true" />
    </section>
  );
}
