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
              className="label group flex items-center gap-2 px-3 py-2 text-paper/75 transition-colors hover:text-paper aria-[current=page]:text-paper"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 scale-0 bg-accent transition-transform duration-300 group-hover:scale-100 group-aria-[current=page]:scale-100" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="border-t border-line-dark">
      {nav.map((item, i) => (
        <li key={item.href} className="border-b border-line-dark">
          <Link
            href={item.href}
            aria-current={isCurrent(item.href) ? 'page' : undefined}
            className="group flex min-h-16 items-baseline gap-4 py-3 text-paper aria-[current=page]:text-accent"
          >
            <span aria-hidden="true" className="label w-6 text-dust">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-display text-[2.1rem] font-extrabold uppercase leading-none tracking-[-0.02em] [font-stretch:118%]">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
