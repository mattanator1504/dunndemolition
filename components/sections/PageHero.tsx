import { Breadcrumbs } from '@/components/site/Breadcrumbs';
import { QuoteButton } from '@/components/site/QuoteButton';
import { CallButton } from '@/components/site/CallButton';
import { Photo } from '@/components/site/Photo';

type Props = {
  crumbs: { name: string; path: string }[];
  title: React.ReactNode; // the page's H1, carries the primary keyword
  lede: React.ReactNode;
  image?: string;
  cta?: 'quote' | 'material' | 'none';
};

// Inner-page header: dark band, breadcrumbs, H1, one paragraph, CTA, optional photo slab.
export function PageHero({ crumbs, title, lede, image, cta = 'quote' }: Props) {
  return (
    <section className="on-ink relative overflow-hidden bg-ink text-paper">
      <div className="container-x grid gap-10 pb-16 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:pb-20 lg:pt-12">
        <div>
          <Breadcrumbs items={crumbs} />
          <h1 className="display mt-8 text-[clamp(2.75rem,7vw,5.75rem)]">{title}</h1>
          <div className="lede mt-6 text-dust">{lede}</div>
          {cta !== 'none' && (
            <div className="mt-8 flex flex-wrap gap-4">
              {cta === 'quote' ? <QuoteButton /> : <QuoteButton label="Request a material quote" href="#material-quote" />}
              <CallButton className="text-paper" />
            </div>
          )}
        </div>
        {image && (
          <div className="relative aspect-[16/9] overflow-hidden border-2 border-paper shadow-[8px_8px_0_0_var(--color-accent)] lg:aspect-[4/3] lg:shadow-[10px_10px_0_0_var(--color-accent)]">
            <Photo name={image} sizes="(min-width: 1024px) 40vw, 100vw" className="photo h-full w-full object-cover" eager />
          </div>
        )}
      </div>
      <div className="hazard h-2" aria-hidden="true" />
    </section>
  );
}
