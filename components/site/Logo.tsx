// Wordmark built in type plus a simple yellow mark. Swap for Dunn's real logo
// file when it's supplied (README → Fill these).
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" className="shrink-0">
        <rect x="1" y="1" width="32" height="32" fill="#E7B008" stroke="currentColor" strokeWidth="2" />
        <rect x="7" y="20" width="8" height="7" fill="#0A0A0A" />
        <rect x="17" y="20" width="10" height="7" fill="#0A0A0A" />
        <rect x="7" y="11" width="11" height="7" fill="#0A0A0A" />
        <rect x="21" y="8" width="7" height="7" fill="#0A0A0A" transform="rotate(18 24.5 11.5)" />
      </svg>
      <span className="font-display text-[1.35rem] font-bold uppercase leading-none tracking-[-0.02em]">
        Dunn <span className="sr-only">Demolition</span>
        <span aria-hidden="true">Demo</span>
      </span>
    </span>
  );
}
