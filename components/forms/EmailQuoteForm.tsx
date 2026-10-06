'use client';

import { useState } from 'react';
import { site } from '@/lib/site';

// Fallback demolition quote form used until the GeniusNex demolition form ID is set
// in lib/site.ts (site.forms.demolition). It opens the visitor's email app with the
// details filled in, so nothing is lost and no backend is needed.
const SERVICES = [
  'Residential demolition',
  'Commercial demolition',
  'Interior gut out',
  'Industrial dismantling',
  'Site clearing / concrete removal',
  'Oil tank, septic tank or pool removal',
  'Tree removal',
  'Containers and hauling',
  'Something else',
];

export function EmailQuoteForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? '').trim();
    const body = [
      `Name: ${get('name')}`,
      `Phone: ${get('phone')}`,
      `Email: ${get('email')}`,
      `Service: ${get('service')}`,
      `Project address: ${get('address')}`,
      '',
      get('details'),
    ].join('\n');
    const subject = `Quote request: ${get('service')} (${get('name')})`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const field = 'mt-2 block w-full border-2 border-ink bg-paper px-4 py-3 text-base text-ink placeholder:text-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent';
  const label = 'font-display text-sm font-bold uppercase tracking-wide';

  return (
    <form onSubmit={onSubmit} className="slab grid gap-5 p-6 sm:grid-cols-2 sm:p-8" aria-describedby="quote-form-note">
      <div className="sm:col-span-2">
        <label htmlFor="q-name" className={label}>
          Your name
        </label>
        <input id="q-name" name="name" required autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="q-phone" className={label}>
          Phone
        </label>
        <input id="q-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" className={field} />
      </div>
      <div>
        <label htmlFor="q-email" className={label}>
          Email
        </label>
        <input id="q-email" name="email" type="email" autoComplete="email" className={field} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="q-service" className={label}>
          What needs to come down?
        </label>
        <select id="q-service" name="service" required className={field} defaultValue="">
          <option value="" disabled>
            Choose a service
          </option>
          {SERVICES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="q-address" className={label}>
          Project address or city
        </label>
        <input id="q-address" name="address" autoComplete="street-address" className={field} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="q-details" className={label}>
          Project details
        </label>
        <textarea
          id="q-details"
          name="details"
          rows={5}
          className={field}
          placeholder="What's the structure, roughly how big, and when do you need it gone?"
        />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn btn-primary">
          Send quote request
        </button>
        <p id="quote-form-note" className="text-sm text-muted">
          Opens your email app with this filled in. Prefer to talk? Call{' '}
          <a href={site.phone.href} className="link-under num font-semibold text-ink">
            {site.phone.display}
          </a>
          .
        </p>
      </div>
      {sent && (
        <p role="status" className="border-l-4 border-accent bg-concrete p-4 text-sm sm:col-span-2">
          Your email app should have opened with the request ready to send. If nothing happened, email{' '}
          <a href={`mailto:${site.email}`} className="link-under">
            {site.email}
          </a>{' '}
          or call us.
        </p>
      )}
    </form>
  );
}
