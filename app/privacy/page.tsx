import { buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';
import { PageHero } from '@/components/sections/PageHero';

// [FILL] Have Dunn (or their advisor) review this before launch.
export const metadata = buildMetadata({
  title: 'Privacy Policy for Quote and Contact Forms | Dunn Demolition',
  description:
    'How Dunn Demolition handles the details you send through our quote and material request forms: what we collect, why, who processes it, and your choices.',
  path: '/privacy',
  noindex: true,
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ name: 'Privacy', path: '/privacy' }]} title="Privacy" lede={<p>What happens to the details you send us.</p>} cta="none" />
      <section className="bg-paper py-16 lg:py-24">
        <div className="container-x">
          <div className="prose-dunn grid gap-8 text-muted">
            <div>
              <h2 className="h-card text-ink">What we collect</h2>
              <p className="mt-3">
                When you request a quote, we collect what you type into the form: your name, phone number, email address, project address and project details.
              </p>
            </div>
            <div>
              <h2 className="h-card text-ink">Why</h2>
              <p className="mt-3">To answer your request, quote your job or material order, and keep in touch about that work. We don’t sell your information.</p>
            </div>
            <div>
              <h2 className="h-card text-ink">Who processes it</h2>
              <p className="mt-3">
                Material quote requests are handled by our form and customer management provider (GeniusNex, built on GoHighLevel). Requests sent from the
                contact page open your own email app and come to us by email.
              </p>
            </div>
            <div>
              <h2 className="h-card text-ink">Your choices</h2>
              <p className="mt-3">
                To see, correct or delete what we hold about you, email{' '}
                <a href={`mailto:${site.email}`} className="link-under text-ink">
                  {site.email}
                </a>{' '}
                or call{' '}
                <a href={site.phone.href} className="link-under num text-ink">
                  {site.phone.display}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
