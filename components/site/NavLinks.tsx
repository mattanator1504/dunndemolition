'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nav } from '@/lib/site';

export function NavLinks({ variant }: { variant: 'desktop' | 'mobile' }) {
  const pathname = usePathname();
  const isCurrent = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  if (variant === 'desktop') {
    return (
      <ul className="flex items-center gap-1">
        {nav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isCurrent(item.href) ? 'page' : undefined}
              className="relative block px-3 py-2 font-display text-[0.95rem] font-bold uppercase tracking-tight text-paper after:absolute after:inset-x-3 after:bottom-0.5 after:h-[3px] after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="divide-y divide-line-dark border-y border-line-dark">
      {nav.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-current={isCurrent(item.href) ? 'page' : undefined}
            className="flex min-h-14 items-center justify-between font-display text-2xl font-bold uppercase text-paper aria-[current=page]:text-accent"
          >
            {item.label}
            <span aria-hidden="true" className="text-accent">
              ›
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
