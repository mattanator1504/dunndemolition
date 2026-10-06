// Single source of truth for every business fact on the site.
// Mirrors references/stats.md: change the number there first, then here.
// Components import from this file and never hard-code a phone, price or stat.

export const site = {
  name: 'Dunn Demolition',
  shortName: 'Dunn Demo',
  // [FILL] Confirm the live domain before launch (CLAUDE.md → Domain).
  url: 'https://dunndemolition.com',
  foundingYear: 1974,
  license: 'Virginia Class A Contractor',
  areaServed: ['Virginia', 'North Carolina', 'Maryland'],
  region: 'Hampton Roads',

  phone: { display: '757-472-4142', href: 'tel:+17574724142', contact: 'Marco', role: 'Demolition jobs and stone crushing' },
  recyclingPhone: { display: '757-574-1006', href: 'tel:+17575741006', contact: 'Tony', role: 'MHR Recycling' },
  email: 'dunndemo757@gmail.com',

  // Mon–Fri is confirmed. Saturday conflicts on the live site (CONFIRM in stats.md),
  // so it isn't published until Dunn confirms it.
  hours: [{ days: 'Monday–Friday', open: '07:00', close: '17:00', label: '7:00am–5:00pm' }],

  insurance: ['Demolition insurance', 'General liability', "Workers' compensation", 'Commercial vehicle insurance'],
  memberships: ['National Demolition Association'],
  payments: ['Visa', 'Mastercard', 'Discover', 'American Express'],

  stats: {
    crews: 3,
    crewSize: '3–4',
    maxProjects: 3,
    operatorYears: 45, // combined excavator operator experience, never company age
    projectsPerYear: 150, // "about 150"
    recycledRange: '50–75%',
  },

  timing: {
    leadTime: '7–14 days',
    residential: '2–4 days',
    commercial: '5–10 days',
    industrial: '2 weeks to several months',
  },

  locations: [
    {
      id: 'sykes',
      name: 'Dunn Demolition (Sykes)',
      street: '124 S. Sykes Ave',
      city: 'Virginia Beach',
      state: 'VA',
      zip: '23454',
      note: 'Past Pick-n-Pull, at the end of Sykes Ave',
    },
    {
      id: 'mac',
      name: 'Dunn Demolition (Mac)',
      street: '122 Mac St',
      city: 'Virginia Beach',
      state: 'VA',
      zip: '23462',
      note: 'Sister location',
    },
    {
      id: 'mhr',
      name: 'Military Hwy Recycling (MHR)',
      street: '5304 W. Military Hwy',
      city: 'Chesapeake',
      state: 'VA',
      zip: '', // [FILL] ZIP not on the live site
      note: 'Next to Hampton Roads Executive Airport',
    },
  ],
  // CONFIRM which yard is the main address (stats.md → Locations). Sykes is used until then.
  mainLocationId: 'sykes',

  forms: {
    material: 'xb5iVcnYUS5fS3lUUw3z',
    demolition: '', // [FILL] demolition quote form ID; until set, /contact uses the email form
  },

  sameAs: [] as string[], // [FILL] Google Business Profile and socials when supplied
} as const;

export type Location = (typeof site.locations)[number];

export const mainLocation = site.locations.find((l) => l.id === site.mainLocationId)!;

export const yearsInBusiness = new Date().getFullYear() - site.foundingYear;

export function formatAddress(l: Location) {
  return `${l.street}, ${l.city}, ${l.state}${l.zip ? ` ${l.zip}` : ''}`;
}

export function mapsUrl(l: Location) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress(l))}`;
}

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/buy', label: 'Buy materials' },
  { href: '/contact', label: 'Contact' },
] as const;
