import { buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';
import { PageHero } from '@/components/sections/PageHero';
import { SectionHead } from '@/components/sections/SectionHead';
import { Locations } from '@/components/sections/Locations';
import { GeniusNexForm } from '@/components/forms/GeniusNexForm';
import { EmailQuoteForm } from '@/components/forms/EmailQuoteForm';

// Primary keyword: "free demolition quote" (provisional, see references/used-keywords.md)
export const metadata = buildMetadata({
  title: 'Free Demolition Quote, Virginia Beach VA | Dunn Demolition',
  description:
    'Get a free demolition quote from Dunn Demolition. Call 757-472-4142 or send your project details. Serving Virginia, North Carolina and Maryland.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Contact', path: '/contact' }]}
        title="Get a free demolition quote"
        lede={<p>Request a free demolition quote, ask a question or book a site visit. Call us, or send the details below and we’ll get back to you.</p>}
        image="excavator-loading-dump-truck"
        cta="none"
      />

      <section className="bg-paper py-20 lg:py-28" aria-labelledby="form-title">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHead id="form-title" title="Talk to us" />
            <dl className="mt-10 grid gap-8" data-reveal>
              <div>
                <dt className="font-display text-sm font-bold uppercase tracking-wide text-muted">Demolition jobs and stone crushing</dt>
                <dd>
                  <a href={site.phone.href} className="num font-display text-3xl font-bold hover:underline">
                    {site.phone.display}
                  </a>
                  <span className="block text-muted">Ask for {site.phone.contact}</span>
                </dd>
              </div>
              <div>
                <dt className="font-display text-sm font-bold uppercase tracking-wide text-muted">MHR Recycling</dt>
                <dd>
                  <a href={site.recyclingPhone.href} className="num font-display text-3xl font-bold hover:underline">
                    {site.recyclingPhone.display}
                  </a>
                  <span className="block text-muted">Ask for {site.recyclingPhone.contact}</span>
                </dd>
              </div>
              <div>
                <dt className="font-display text-sm font-bold uppercase tracking-wide text-muted">Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="link-under break-all text-lg">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-display text-sm font-bold uppercase tracking-wide text-muted">Hours</dt>
                <dd className="text-lg">
                  {site.hours[0].days}, {site.hours[0].label}
                </dd>
              </div>
              <div>
                <dt className="font-display text-sm font-bold uppercase tracking-wide text-muted">Service area</dt>
                <dd className="text-lg">Virginia, North Carolina and Maryland</dd>
              </div>
            </dl>
          </div>
          <div>
            <h2 className="sr-only">Quote request form</h2>
            {site.forms.demolition ? <GeniusNexForm formId={site.forms.demolition} title="Demolition quote request" /> : <EmailQuoteForm />}
          </div>
        </div>
      </section>

      <section className="bg-concrete py-20 lg:py-24" aria-labelledby="yards-title">
        <div className="container-x">
          <SectionHead id="yards-title" title="Our yards" />
          <div className="mt-10">
            <Locations />
          </div>
        </div>
      </section>
    </>
  );
}
