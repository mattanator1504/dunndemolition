import { QuoteButton } from '@/components/site/QuoteButton';
import { CallButton } from '@/components/site/CallButton';
import { site } from '@/lib/site';

// Every page ends here: one statement, the two ways to reach us, one line of proof.
// pileRoom: extra space at the bottom on desktop where the home page's falling debris lands.
export function QuoteCta({ title = 'Got something that needs to come down?', line, pileRoom }: { title?: string; line?: string; pileRoom?: boolean }) {
  return (
    <section className="on-ink bg-ink text-paper" aria-labelledby="cta-title">
      <div className={`container-x grid gap-10 py-20 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:py-24 ${pileRoom ? 'lg:pb-44' : ''}`}>
        <div data-reveal>
          <h2 id="cta-title" className="h-section">
            {title}
          </h2>
          <p className="lede mt-5 text-dust">
            {line ??
              `Give us a call or send the details. We’ll walk the site, explain what needs to happen first, and give you a written quote. Free, and no pressure.`}
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-stretch" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
          <QuoteButton />
          <CallButton className="text-paper" />
          <p className="text-sm text-dust">
            {site.license}. Fully insured. Since {site.foundingYear}.
          </p>
        </div>
      </div>
    </section>
  );
}
