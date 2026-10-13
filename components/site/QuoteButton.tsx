import Link from 'next/link';

export function QuoteButton({
  label = 'Get a free quote',
  href = '/contact',
  className = '',
  variant = 'primary',
}: {
  label?: string;
  href?: string;
  className?: string;
  variant?: 'primary' | 'ink';
}) {
  return (
    <Link href={href} className={`btn ${variant === 'ink' ? 'btn-ink' : 'btn-primary'} ${className}`}>
      {label}
    </Link>
  );
}
