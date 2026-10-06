// Recycled stone and material prices, from references/stats.md.
// Captured from the live site on 6 Oct 2026. CONFIRM current prices before launch.

export const pricesUpdated = '2026-10-06';

export type PriceLine = { label: string; price: number; unit: 'ton' | 'delivery' };

export type Material = {
  id: string;
  name: string;
  description: string;
  use: string;
  lines: PriceLine[];
  freight?: { price: number; note: string };
  recycled: boolean;
};

export const materials: Material[] = [
  {
    id: '21a',
    name: 'Crusher run 21A',
    description: 'Crushed concrete, 1½" minus',
    use: 'Driveway and pad base, under slabs, backfill',
    lines: [
      { label: 'Pickup', price: 20, unit: 'ton' },
      { label: 'Local delivery', price: 30, unit: 'ton' },
    ],
    recycled: true,
  },
  {
    id: '3-stone',
    name: '#3 stone',
    description: '2–3" crushed concrete',
    use: 'Construction entrances',
    lines: [
      { label: 'Pickup', price: 20, unit: 'ton' },
      { label: 'Local delivery', price: 30, unit: 'ton' },
    ],
    recycled: true,
  },
  {
    id: '57-stone',
    name: '#57 stone',
    description: 'Granite, grey or recycled',
    use: 'Drainage, gravel driveways, concrete mix',
    lines: [
      { label: 'Granite', price: 55, unit: 'ton' },
      { label: 'Grey', price: 55, unit: 'ton' },
      { label: 'Recycled', price: 39, unit: 'ton' },
    ],
    freight: { price: 200, note: 'per delivery, up to 22 tons locally' },
    recycled: false,
  },
  {
    id: 'concrete-rip-rap',
    name: 'Concrete rip rap',
    description: 'Broken concrete',
    use: 'Shoreline and slope protection, erosion control',
    lines: [{ label: 'Per ton', price: 13.33, unit: 'ton' }],
    recycled: true,
  },
  {
    id: 'granite-rip-rap',
    name: 'Granite rip rap',
    description: 'A1, Class 1 and Class 2',
    use: 'Shorelines, ditches and outfalls',
    lines: [
      { label: 'A1', price: 100, unit: 'ton' },
      { label: 'Class 1', price: 105, unit: 'ton' },
      { label: 'Class 2', price: 110, unit: 'ton' },
    ],
    freight: { price: 300, note: 'per local delivery' },
    recycled: false,
  },
];

export const tipFees = [
  { material: 'Clean concrete', fee: 'Free' },
  { material: 'Red brick', fee: '$5/ton' },
];

export function money(n: number) {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}
