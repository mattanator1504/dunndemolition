import { QuoteButton } from '@/components/site/QuoteButton';
import { CallButton } from '@/components/site/CallButton';
import { site } from '@/lib/site';
import { Split } from '@/components/fx/Split';

// Every page ends on a hi-vis field: one statement set huge, the phone number as the
// biggest link on the page, and the two ways in.
// pileRoom: extra space at the bottom on desktop where the home page's falling debris lands.
export function QuoteCta({ title = 'Got something that needs to come down?', line, pileRoom }: { title?: string; line?: string; pileRoom?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-accent text-ink" aria-labelledby="cta-title">
      <div className={`container-x pb-16 pt-20 lg:pt-28 ${pileRoom ? 'lg:pb-40' : 'lg:pb-24'}`}>
        <h2 id="cta-title" className="display max-w-[16ch] text-[clamp(2.8rem,8.4vw,9.5rem)]" data-reveal aria-label={title}>
          <Split text={title} />
        </h2>
        <div className="mt-14 grid gap-10 border-t border-ink pt-8 lg:mt-20 lg:grid-cols-12 lg:items-end">
          <p className="lede lg:col-span-5" data-reveal>
            {line ?? `Give us a call or send the details. We’ll walk the site, explain what needs to happen first, and give you a written quote. Free, and no pressure.`}
          </p>
          <div className="lg:col-span-7 lg:text-right" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            <a
              href={site.phone.href}
              className="num block font-display text-[clamp(2.4rem,5.6vw,5.5rem)] font-black leading-none tracking-[-0.03em] [font-stretch:125%] hover:underline hover:decoration-2 hover:underline-offset-8"
            >
              {site.phone.display}
            </a>
            <div className="mt-6 flex flex-wrap gap-3 lg:justify-end">
              <QuoteButton variant="ink" />
              <CallButton label={`Ask for ${site.phone.contact}`} />
            </div>
            <p className="label mt-6 text-ink/70">
              Fully insured · Since {site.foundingYear}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
