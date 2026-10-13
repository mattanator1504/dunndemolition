import type { Faq } from '@/content/faqs';

// Native <details> rows: answers stay in the HTML, keyboard and screen-reader
// friendly with no script. FAQPage schema is added by the page with the same text.
export function FaqList({ items, tone = 'light' }: { items: Faq[]; tone?: 'light' | 'dark' }) {
  const border = tone === 'dark' ? 'border-line-dark' : 'border-ink';
  return (
    <div className={`border-t ${border}`}>
      {items.map((f, i) => (
        <details key={f.id} id={f.id} className={`group border-b ${tone === 'dark' ? 'border-line-dark' : 'border-line'}`} data-reveal style={{ '--i': i % 6 } as React.CSSProperties}>
          <summary className="grid min-h-16 grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-6 transition-[padding] duration-300 hover:pl-2">
            <span className={`label num ${tone === 'dark' ? 'text-dust' : 'text-muted'}`}>{String(i + 1).padStart(2, '0')}</span>
            <h3 className="text-[clamp(1.15rem,1.7vw,1.45rem)] font-bold uppercase leading-tight tracking-[-0.01em] [font-stretch:110%]">{f.q}</h3>
            <span className="faq-icon relative h-4 w-4 shrink-0 self-center" aria-hidden="true" />
          </summary>
          <p className={`max-w-3xl pb-8 pl-[3.5rem] ${tone === 'dark' ? 'text-dust' : 'text-muted'}`}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
