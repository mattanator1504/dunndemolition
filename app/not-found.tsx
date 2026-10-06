import Link from 'next/link';
import { site } from '@/lib/site';

export const metadata = { title: 'Page not found | Dunn Demolition', robots: { index: false } };

export default function NotFound() {
  return (
    <section className="on-ink bg-ink text-paper">
      <div className="container-x flex min-h-[70svh] flex-col justify-center py-20">
        <p className="display text-[clamp(5rem,18vw,12rem)] text-accent">404</p>
        <h1 className="h-section mt-4">This page has been demolished</h1>
        <p className="lede mt-6 text-dust">Or it never existed. Either way, here’s where to go next.</p>
        <ul className="mt-10 flex flex-wrap gap-4">
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
            <Link href="/contact" className="btn btn-secondary text-paper">
              Contact us
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
  );
}
