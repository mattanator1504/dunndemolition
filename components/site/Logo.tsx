// Wordmark in type plus a hi-vis mark: a running-bond wall with its top brick knocked loose.
// Swap for Dunn's real logo file when it's supplied (README → Fill these).
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
        <rect width="32" height="32" fill="#FFB800" />
        <g fill="#121211">
          <rect x="4" y="22" width="11" height="6" />
          <rect x="17" y="22" width="11" height="6" />
          <rect x="4" y="14" width="5" height="6" />
          <rect x="11" y="14" width="11" height="6" />
          <rect x="21" y="5" width="9" height="6" transform="rotate(24 25.5 8)" />
        </g>
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.3rem] font-black uppercase tracking-[-0.03em] [font-stretch:125%]">Dunn</span>
        <span className="mt-1 font-mono text-[0.58rem] font-medium uppercase tracking-[0.28em] opacity-70">Demolition</span>
      </span>
    </span>
  );
}
