'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '@/lib/site';

// GeniusNex (GoHighLevel) form behind a facade (technical-seo.md §3): the iframe and
// its embed script load only when the visitor clicks, or when the form scrolls near.
export function GeniusNexForm({ formId, title, height = 760 }: { formId: string; title: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (load || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setLoad(true);
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [load]);

  useEffect(() => {
    if (!load || document.querySelector('script[data-geniusnex]')) return;
    const s = document.createElement('script');
    s.src = 'https://link.geniusnex.com/js/form_embed.js';
    s.async = true;
    s.dataset.geniusnex = '';
    document.body.appendChild(s);
  }, [load]);

  return (
    <div ref={ref} className="slab relative" style={{ minHeight: height }}>
      {load ? (
        <iframe
          src={`https://link.geniusnex.com/widget/form/${formId}`}
          id={`inline-${formId}`}
          title={title}
          className="block w-full border-0"
          style={{ height }}
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-activation-type="alwaysActivated"
          data-form-id={formId}
          data-height={height}
          loading="lazy"
        />
      ) : (
        <div className="flex h-full flex-col items-start justify-center gap-5 p-8" style={{ minHeight: height }}>
          <p className="h-card">{title}</p>
          <p className="max-w-sm text-muted">The form loads here. If it doesn’t, call {site.phone.display} and we’ll take your order over the phone.</p>
          <button type="button" className="btn btn-primary" onClick={() => setLoad(true)}>
            Start your request
          </button>
        </div>
      )}
    </div>
  );
}
