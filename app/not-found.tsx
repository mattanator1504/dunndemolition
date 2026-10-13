import Link from 'next/link';
import { site } from '@/lib/site';
import { DemoTitle } from '@/components/fx/DemoTitle';
import { KnockDown } from '@/components/sections/KnockDown';

export const metadata = { title: 'Page not found | Dunn Demolition', robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <section className="on-ink relative bg-ink text-paper">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="container-x relative h-full">
            <div className="guides" />
          </div>
        </div>
        <div className="container-x relative py-16 lg:py-24">
          <p className="label text-accent">Error 404</p>
          <DemoTitle text="This page has been demolished" accent="demolished" className="display mt-8 max-w-[16ch] text-[clamp(2.6rem,7vw,7.5rem)]" />
          <p className="lede mt-8 text-dust">Or it never existed. Either way, here’s where to go next.</p>
          <ul className="mt-10 flex flex-wrap gap-3">
            <li>
              <Link href="/services" className="btn btn-primary">
                Demolition services
              </Link>
            </li>
            <li>
              <Link href="/buy" className="btn btn-secondary text-paper">
                Buy materials
              </Link>
            </li>
            <li>
              <a href={site.phone.href} className="btn btn-secondary num text-paper">
                Call {site.phone.display}
              </a>
            </li>
          </ul>
        </div>
      </section>
      <KnockDown title="Might as well take a swing" line="Since you’re here." id="swing-404" />
    </>
  );
}
