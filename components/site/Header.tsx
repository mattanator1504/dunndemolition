import Link from 'next/link';
import { Logo } from './Logo';
import { NavLinks } from './NavLinks';
import { MobileMenu } from './MobileMenu';
import { PhoneIcon } from './CallButton';
import { site } from '@/lib/site';

export function Header() {
  return (
    <header className="on-ink sticky top-0 z-50 border-b border-line-dark bg-ink text-paper">
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="text-paper" aria-label={`${site.name}, home`}>
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks variant="desktop" />
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={site.phone.href}
            className="num flex h-12 items-center gap-2.5 px-2 font-mono text-sm text-paper transition-colors hover:text-accent"
            aria-label={`Call ${site.phone.display}`}
          >
            <PhoneIcon className="h-4 w-4 text-accent" />
            <span className="hidden sm:inline">{site.phone.display}</span>
          </a>
          <Link href="/contact" className="btn btn-primary hidden min-h-11 px-4 py-2 text-[0.8rem] md:inline-flex">
            Free quote
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
