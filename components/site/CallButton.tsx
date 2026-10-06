import { site } from '@/lib/site';

export function CallButton({ className = '', label }: { className?: string; label?: string }) {
  return (
    <a href={site.phone.href} className={`btn btn-secondary num ${className}`}>
      <PhoneIcon />
      {label ?? `Call ${site.phone.display}`}
    </a>
  );
}

export function PhoneIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square">
      <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />
    </svg>
  );
}
