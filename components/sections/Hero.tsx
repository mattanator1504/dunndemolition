import { HeroSceneMount } from '@/components/three/HeroSceneMount';
import { DemoTitle } from '@/components/fx/DemoTitle';
import { QuoteButton } from '@/components/site/QuoteButton';
import { CallButton } from '@/components/site/CallButton';
import { site } from '@/lib/site';
import poster from '@/lib/poster.generated.json';

// The site log: one line per demolition beat, shown while the live scene runs.
// HeroSceneMount sets data-beat and --p on #hero as you scroll; CSS picks the line.
const beats = [
  'Three-story frame. Ready to come down.',
  'Excavator takes the top corner off first.',
  'Floors come down in order. No explosives.',
  `Dust settles. Up to 75% of it gets recycled.`,
];
const beatShow = ['group-data-[beat=0]/hero:block', 'group-data-[beat=1]/hero:block', 'group-data-[beat=2]/hero:block', 'group-data-[beat=3]/hero:block'];

// Home hero. The H1 and the poster render first (LCP is the headline, not the 3D).
// On capable desktops (html.js-pin, set before first paint) the hero is a tall track with a
// sticky stage: the live building comes down as you scroll it, then the rest of the page
// slides up over the rubble (app/page.tsx pulls it up by one stage height under js-pin).
export function Hero() {
  return (
    <section id="hero" data-beat="0" className="on-ink group/hero relative isolate bg-ink text-paper [.js-pin_&]:h-[360svh]">
      <div className="relative isolate flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden [.js-pin_&]:sticky [.js-pin_&]:top-[4.5rem] [.js-pin_&]:h-[calc(100svh-4.5rem)]">
        <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden="true">
          <div className="container-x relative h-full">
            <div className="guides" />
          </div>
        </div>

        {/* Scene box (desktop): the right half of the stage. Poster first, live building over it. */}
        <div className="pointer-events-none absolute bottom-[14%] right-0 top-[10%] -z-10 hidden w-[48%] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(55%_50%_at_55%_55%,rgba(255,184,0,0.14),transparent_70%)]" />
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

        <div className="container-x flex flex-1 flex-col py-8 lg:py-10">
          <ul className="label flex flex-wrap gap-x-8 gap-y-2 text-dust">
            <li>
              <span className="text-accent">●</span> Est. {site.foundingYear}
            </li>
            <li>{site.license}</li>
            <li>Virginia · North Carolina · Maryland</li>
          </ul>

          <h1 className="mt-10 lg:mt-auto" aria-label="We break it down. Demolition contractor for Hampton Roads, Virginia, North Carolina and Maryland">
            <DemoTitle
              as="span"
              text="We break it down."
              accent="down"
              crumble={false}
              className="display block max-w-[8.6ch] text-[clamp(3.4rem,13vw,6rem)] lg:text-[clamp(4.25rem,7.4vw,9.5rem)]"
            />
            <span className="mt-7 block max-w-[30rem] text-[clamp(1.05rem,1.4vw,1.25rem)] font-medium leading-snug text-dust">
              Demolition contractor for Hampton Roads, Virginia, North Carolina and Maryland
            </span>
          </h1>

          <div className="mt-8 flex flex-col gap-10 lg:mt-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <QuoteButton />
              <CallButton className="text-paper" />
            </div>

            {/* Site log: only while the live scene runs (desktop, motion allowed). */}
            <div className="hidden w-[min(24rem,40%)] group-data-[scene=live]/hero:block" aria-hidden="true">
              <div className="label flex items-center justify-between text-dust">
                <span>Site log</span>
                <span className="num text-paper" data-hero-pct>
                  0%
                </span>
              </div>
              <div className="mt-2 h-px bg-line-dark">
                <div className="h-full origin-left bg-accent" style={{ transform: 'scaleX(var(--p, 0))' }} />
              </div>
              <ol className="mt-3 min-h-[3rem] font-mono text-[0.82rem] leading-snug text-paper">
                {/* Lines come from data-t via CSS content: decorative, so they stay out of the word count. */}
                {beats.map((b, i) => (
                  <li key={b} data-t={b} className={`hidden before:text-accent before:content-['▸_'] after:content-[attr(data-t)] ${beatShow[i]}`} />
                ))}
              </ol>
            </div>
          </div>

          {/* Small screens: the building as a still image under the buttons (no WebGL on phones). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-wall-poster.webp"
            alt=""
            width={poster.width}
            height={poster.height}
            loading="lazy"
            decoding="async"
            className="mx-auto mt-12 h-auto w-full max-w-md lg:hidden"
          />
        </div>
        <div className="hazard h-4 shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}
