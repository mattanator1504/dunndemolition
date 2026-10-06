import Link from 'next/link';
import { Logo } from './Logo';
import { NavLinks } from './NavLinks';
import { MobileMenu } from './MobileMenu';
import { PhoneIcon } from './CallButton';
import { site } from '@/lib/site';

export function Header() {
  return (
    <header className="on-ink sticky top-0 z-50 border-b-2 border-ink bg-ink text-paper">
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="text-paper" aria-label={`${site.name}, home`}>
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks variant="desktop" />
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={site.phone.href}
            className="num flex h-12 items-center gap-2 px-2 font-display font-bold text-paper hover:text-accent sm:px-3"
            aria-label={`Call ${site.phone.display}`}
          >
            <PhoneIcon className="h-5 w-5 text-accent" />
            <span className="hidden sm:inline">{site.phone.display}</span>
          </a>
          <Link href="/contact" className="btn btn-primary hidden min-h-12 px-4 py-2 text-sm md:inline-flex">
            Free quote
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
