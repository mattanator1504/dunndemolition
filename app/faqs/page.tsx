import { buildMetadata, faqSchema } from '@/lib/seo';
import { faqs, type Faq } from '@/content/faqs';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/sections/PageHero';
import { FaqList } from '@/components/sections/FaqList';
import { QuoteCta } from '@/components/sections/QuoteCta';
import { Photo } from '@/components/site/Photo';
import { Split } from '@/components/fx/Split';

// Primary keyword: "demolition FAQ" (provisional, see references/used-keywords.md)
export const metadata = buildMetadata({
  title: 'Demolition FAQs: Permits, Timing, Debris | Dunn Demolition',
  description:
    'Demolition FAQs answered by Dunn Demolition: permits, lead time, how long jobs take, insurance, where the debris goes, pools, oil tanks and more.',
  path: '/faqs',
});

const groups: { name: Faq['group']; title: string; image: string }[] = [
  { name: 'Jobs', title: 'What we take on', image: 'house-demolition-excavator' },
  { name: 'How we work', title: 'How a job runs', image: 'excavator-loading-dump-truck' },
  { name: 'The company', title: 'Who you’re hiring', image: 'yellow-hard-hat' },
];

export default function FaqsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'FAQs', path: '/faqs' }]}
        title="Demolition FAQs"
        lede={<p>Straight answers to the demolition questions we hear most: permits, timing, insurance and where everything ends up.</p>}
        image="excavator-dismantling-industrial-building"
      />
      <section className="bg-paper py-20 lg:py-28">
        <div className="container-x grid gap-24 lg:gap-32">
          {groups.map((g) => (
            <div key={g.name} className="grid gap-10 lg:grid-cols-12 lg:gap-10">
              <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
                <h2 className="h-section text-[clamp(2rem,3.6vw,3.25rem)]" data-reveal aria-label={g.title}>
                  <Split text={g.title} />
                </h2>
                <div className="relative mt-8 hidden aspect-[4/5] overflow-hidden lg:block" data-reveal="blocks">
                  <Photo name={g.image} sizes="30vw" className="photo absolute inset-0 h-full w-full scale-[1.14] object-cover" parallax />
                </div>
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <FaqList items={faqs.filter((f) => f.group === g.name)} />
              </div>
            </div>
          ))}
        </div>
      </section>
      <JsonLd data={faqSchema(faqs)} />
      <QuoteCta title="Question not here?" line="Give us a call. If it’s about your site, we’ll probably need to see it, and the visit and quote are free." />
    </>
  );
}
