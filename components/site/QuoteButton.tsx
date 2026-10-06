import Link from 'next/link';

export function QuoteButton({ label = 'Get a free quote', href = '/contact', className = '' }: { label?: string; href?: string; className?: string }) {
  return (
    <Link href={href} className={`btn btn-primary ${className}`}>
      {label}
    </Link>
  );
}
