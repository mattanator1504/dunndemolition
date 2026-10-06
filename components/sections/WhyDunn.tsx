import Link from 'next/link';
import { PhotoSlab } from './PhotoSlab';
import { SectionHead } from './SectionHead';
import { site } from '@/lib/site';

export function WhyDunn() {
  return (
    <section className="bg-paper py-20 lg:py-28" aria-labelledby="why-title">
      <div className="container-x">
        <SectionHead id="why-title" title="Not every demolition contractor is the same" intro="Practices vary a lot in this trade." />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <PhotoSlab name="yellow-hard-hat" sizes="(min-width: 1024px) 45vw, 100vw" shadow="accent" />
          <div data-reveal>
            <h3 className="h-card text-[1.75rem]">Insured for demolition, not just liability</h3>
            <div className="prose-dunn mt-4 text-muted">
              <p>
                We carry demolition insurance on top of general liability, workers’ comp and commercial vehicle cover. Plenty of outfits doing demolition
                don’t. Whoever you hire, ask for the declaration page of their policy.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div data-reveal className="lg:order-1">
            <h3 className="h-card text-[1.75rem]">Experienced crews, never spread thin</h3>
            <div className="prose-dunn mt-4 text-muted">
              <p>
                Our excavator operators have {site.stats.operatorYears}+ years of combined experience. We run {site.stats.crews} crews and never take on more than{' '}
                {site.stats.maxProjects} jobs at once.{' '}
                <Link href="/about" className="link-under font-semibold text-ink">
                  More about Dunn Demolition
                </Link>
                .
              </p>
            </div>
          </div>
          <PhotoSlab name="excavator-brick-rubble" sizes="(min-width: 1024px) 45vw, 100vw" className="lg:order-2" />
        </div>
      </div>
    </section>
  );
}
