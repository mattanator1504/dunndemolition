// Services as described on the live site. Phase 2 turns each into /services/[slug];
// until then they're sections on /services, anchored by id.

export type Service = {
  id: string;
  name: string;
  short: string; // one line for cards
  body: string; // a few sentences for /services
  includes?: string[];
  image: string;
  group: 'demolition' | 'site' | 'materials';
};

export const services: Service[] = [
  {
    id: 'commercial-demolition',
    name: 'Commercial demolition',
    short: 'Complete teardowns and interior gutting for offices, retail spaces and warehouses.',
    body: 'Offices, retail spaces and warehouses, taken down safely with the debris sorted as we go.',
    image: 'excavator-commercial-teardown',
    group: 'demolition',
  },
  {
    id: 'residential-demolition',
    name: 'Residential demolition',
    short: 'Houses, garages, sheds and pools, removed and hauled away.',
    body: 'Houses, garages and sheds removed and the site left clean. A typical house takes 2 to 4 days.',
    image: 'house-demolition-excavator',
    group: 'demolition',
  },
  {
    id: 'interior-gut-outs',
    name: 'Interior “gut outs”',
    short: 'Interior demolition down to the studs, by crews trained for it.',
    body: 'Trained crews take houses and commercial buildings back to the shell, ready for the remodel.',
    image: 'gutted-interior-room',
    group: 'demolition',
  },
  {
    id: 'industrial-dismantling',
    name: 'Industrial dismantling',
    short: 'Plants, facilities and heavy structures, taken apart in order.',
    body: 'Industrial facilities and plants, dismantled in order. Larger jobs run 2 weeks to several months.',
    image: 'excavator-old-industrial-building',
    group: 'demolition',
  },
  {
    id: 'site-clearing',
    name: 'Site clearing and concrete removal',
    short: 'Driveways, parking lots, sidewalks, curb and gutter, and construction entrances.',
    body: 'We remove driveways, parking lots, stone bases, curb and gutter, and sidewalks, and we install construction entrances for new builds.',
    image: 'skid-steer-site-clearing',
    group: 'site',
  },
  {
    id: 'tanks-and-pools',
    name: 'Tank and pool removal',
    short: 'Oil tanks and septic tanks pumped and removed. Pools taken out and backfilled.',
    body: 'Oil and septic tanks pumped and removed. Vinyl and concrete pools taken out with their decks, then backfilled and graded.',
    image: 'excavator-brick-rubble',
    group: 'site',
  },
  {
    id: 'tree-removal',
    name: 'Tree removal',
    short: 'Trees cleared so the lot is ready before construction starts.',
    body: 'Trees cleared as part of the job, so the lot is ready to build.',
    image: 'rubble-street-demolition',
    group: 'site',
  },
  {
    id: 'containers-and-hauling',
    name: 'Containers and hauling',
    short: 'Drop-off and pick-up containers, dump trucks and road tractors.',
    body: 'Drop-off and pick-up containers, plus road tractors, dump trailers and dump trucks.',
    image: 'loader-filling-dump-truck',
    group: 'site',
  },
  {
    id: 'concrete-recycling',
    name: 'Concrete recycling',
    short: '50–75% of material recycled. Clean concrete dropped off free.',
    body: 'Concrete, brick and block from demolition are crushed into recycled stone that meets or exceeds VDOT specifications and comes with an engineered proctor. Clean concrete can be dropped off free; red brick carries a $5/ton tip fee.',
    image: 'excavator-crushing-concrete',
    group: 'materials',
  },
];

// The six cards on the home page, in order.
export const homeServiceIds = [
  'commercial-demolition',
  'residential-demolition',
  'industrial-dismantling',
  'concrete-recycling',
  'containers-and-hauling',
  'site-clearing',
];

export function serviceById(id: string) {
  const s = services.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown service ${id}`);
  return s;
}
