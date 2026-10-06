'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { NavLinks } from './NavLinks';
import { site } from '@/lib/site';

// A native <details> menu: works without JS. The script only closes it
// after navigation and on Escape.
export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && ref.current?.open) {
        ref.current.open = false;
        ref.current.querySelector('summary')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <details ref={ref} className="group lg:hidden">
      <summary
        aria-label="Menu"
        className="flex h-12 w-12 items-center justify-center border-2 border-paper text-paper group-open:border-accent group-open:bg-accent group-open:text-ink"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" stroke="currentColor" strokeWidth="2.5" fill="none">
          <path d="M3 7h18M3 12h18M3 17h18" className="group-open:hidden" />
          <path d="M5 5l14 14M19 5L5 19" className="hidden group-open:block" />
        </svg>
      </summary>
      <div className="on-ink fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto bg-ink px-4 pb-10 pt-6">
        <NavLinks variant="mobile" />
        <div className="mt-8 grid gap-4">
          <a href="/contact" className="btn btn-primary w-full">
            Get a free quote
          </a>
          <a href={site.phone.href} className="btn btn-secondary num w-full text-paper">
            Call {site.phone.display}
          </a>
        </div>
      </div>
    </details>
  );
}
