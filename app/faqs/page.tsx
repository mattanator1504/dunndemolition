import { buildMetadata, faqSchema } from '@/lib/seo';
import { faqs, type Faq } from '@/content/faqs';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/sections/PageHero';
import { FaqList } from '@/components/sections/FaqList';
import { QuoteCta } from '@/components/sections/QuoteCta';

// Primary keyword: "demolition FAQ" (provisional, see references/used-keywords.md)
export const metadata = buildMetadata({
  title: 'Demolition FAQs: Permits, Timing, Debris | Dunn Demolition',
  description:
    'Demolition FAQs answered by Dunn Demolition: permits, lead time, how long jobs take, insurance, where the debris goes, pools, oil tanks and more.',
  path: '/faqs',
});

const groups: { name: Faq['group']; title: string }[] = [
  { name: 'Jobs', title: 'What we take on' },
  { name: 'How we work', title: 'How a job runs' },
  { name: 'The company', title: 'Who you’re hiring' },
];

export default function FaqsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'FAQs', path: '/faqs' }]}
        title="Demolition FAQs"
        lede={<p>Straight answers to the demolition questions we hear most: permits, timing, insurance and where everything ends up.</p>}
      />
      <section className="bg-paper py-16 lg:py-24">
        <div className="container-x grid gap-16">
          {groups.map((g) => (
            <div key={g.name} className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
              <h2 className="h-section text-[clamp(1.75rem,3.5vw,2.75rem)]" data-reveal>
                {g.title}
              </h2>
              <FaqList items={faqs.filter((f) => f.group === g.name)} />
            </div>
          ))}
        </div>
      </section>
      <JsonLd data={faqSchema(faqs)} />
      <QuoteCta title="Question not here?" line="Give us a call. If it’s about your site, we’ll probably need to see it, and the visit and quote are free." />
    </>
  );
}
