import Link from 'next/link';
import { buildMetadata, faqSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { ServiceCards } from '@/components/sections/ServiceCards';
import { SectionHead } from '@/components/sections/SectionHead';
import { WhyDunn } from '@/components/sections/WhyDunn';
import { StoneBanner } from '@/components/sections/StoneBanner';
import { Process } from '@/components/sections/Process';
import { FaqList } from '@/components/sections/FaqList';
import { QuoteCta } from '@/components/sections/QuoteCta';
import { homeServiceIds } from '@/content/services';
import { homeFaqIds, faqById } from '@/content/faqs';

// Primary keyword: "demolition contractor Hampton Roads" (provisional, see references/used-keywords.md)
export const metadata = buildMetadata({
  title: 'Demolition Contractor in Hampton Roads, VA | Dunn Demolition',
  description:
    'Demolition contractor in Hampton Roads since 1974. Houses, commercial buildings and gut outs, VA Class A, fully insured. Free quote: 757-472-4142.',
  path: '/',
});

export default function HomePage() {
  const homeFaqs = homeFaqIds.map(faqById);
  return (
    <>
      <Hero />
      <Stats />

      <section className="on-ink bg-ink py-20 text-paper lg:py-28" aria-labelledby="services-title">
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHead
              id="services-title"
              title="What we take down"
              intro="Demolition, plus the site work around it."
              className="text-paper"
            />
            <Link href="/services" className="link-under shrink-0 font-display font-bold uppercase tracking-wide text-accent" data-reveal>
              All demolition services
            </Link>
          </div>
          <div className="mt-14">
            <ServiceCards ids={homeServiceIds} />
          </div>
        </div>
      </section>

      <WhyDunn />
      <StoneBanner />
      <Process />

      <section className="bg-paper py-20 lg:py-28" aria-labelledby="faq-title">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHead id="faq-title" title="Straight answers" intro="The questions we hear most on the phone." />
            <Link href="/faqs" className="link-under mt-8 inline-block font-display font-bold uppercase tracking-wide" data-reveal>
              All 19 demolition FAQs
            </Link>
          </div>
          <FaqList items={homeFaqs} />
        </div>
      </section>
      <JsonLd data={faqSchema(homeFaqs)} />

      <QuoteCta />
    </>
  );
}
