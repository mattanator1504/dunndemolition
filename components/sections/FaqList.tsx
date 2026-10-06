import type { Faq } from '@/content/faqs';

// Native <details> accordions: answers stay in the HTML, keyboard and screen-reader
// friendly with no script. FAQPage schema is added by the page with the same text.
export function FaqList({ items, tone = 'light' }: { items: Faq[]; tone?: 'light' | 'dark' }) {
  const border = tone === 'dark' ? 'border-paper' : 'border-ink';
  return (
    <div className={`border-t-2 ${border}`}>
      {items.map((f, i) => (
        <details key={f.id} id={f.id} className={`group border-b-2 ${border}`} data-reveal style={{ '--i': i % 6 } as React.CSSProperties}>
          <summary className="flex min-h-16 items-center justify-between gap-6 py-5">
            <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-tight sm:text-xl">{f.q}</h3>
            <span className="faq-icon relative h-5 w-5 shrink-0" aria-hidden="true" />
          </summary>
          <p className={`max-w-3xl pb-6 ${tone === 'dark' ? 'text-dust' : 'text-muted'}`}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
