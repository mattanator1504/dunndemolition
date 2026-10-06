// The 19 questions from the live /faqs page. Answers keep the live site's facts,
// lightly edited for voice and typos. Numbers come from lib/site.ts.
import { site } from '@/lib/site';

export type Faq = { id: string; q: string; a: string; group: 'Jobs' | 'How we work' | 'The company' };

const t = site.timing;
const s = site.stats;

export const faqs: Faq[] = [
  {
    id: 'what-structures',
    group: 'Jobs',
    q: 'What types of structures do you demolish?',
    a: 'Everything from large industrial plants to single sheds. We demolish residential, commercial and industrial structures of all types.',
  },
  {
    id: 'gut-outs',
    group: 'Jobs',
    q: 'Do you do interior demolition, or “gut outs”?',
    a: 'Yes. We have crews trained specifically for interior demolition and gut outs of houses and commercial buildings.',
  },
  {
    id: 'driveways',
    group: 'Jobs',
    q: 'Do you remove driveways?',
    a: 'Yes. We remove driveways, parking lots, stone bases, curb and gutter, and sidewalks. We also install construction entrances for new construction.',
  },
  {
    id: 'oil-tanks',
    group: 'Jobs',
    q: 'Do you remove above or below ground oil tanks?',
    a: 'Yes. We pump out and properly dispose of any remaining product, then remove the tank. Septic tanks are professionally pumped and removed too.',
  },
  {
    id: 'trees',
    group: 'Jobs',
    q: 'Do you remove trees?',
    a: 'Yes, we do. A lot of clients are surprised we offer it, but clearing the trees means the lot is ready for the next phase in one go.',
  },
  {
    id: 'pools',
    group: 'Jobs',
    q: 'Do you take out swimming pools?',
    a: 'Yes. We remove vinyl and concrete pools, along with the surrounding aprons and decks. Then we backfill and grade the area.',
  },
  {
    id: 'how',
    group: 'How we work',
    q: 'How do you perform the demolition?',
    a: 'With equipment. Dunn Demolition does not use explosives. Our excavators have hydraulic thumbs, which give the operator precise control over how each part of the structure comes down.',
  },
  {
    id: 'equipment',
    group: 'How we work',
    q: 'What type of equipment do you use?',
    a: 'Caterpillar and JCB excavators with hydraulic thumbs attached. The thumbs give precise control as the structure comes down and make sorting and loading debris faster. We also run a range of other Caterpillar equipment for smaller jobs, plus the trucks, trailers and support equipment every job needs.',
  },
  {
    id: 'containers',
    group: 'How we work',
    q: 'Do you use containers?',
    a: 'Yes, and we offer drop-off and pick-up container service for your own disposal needs. Our fleet includes road tractors with steel dump trailers and dump trucks for smaller loads. Debris is loaded and hauled off as the demolition goes, so the site stays cleaner.',
  },
  {
    id: 'debris',
    group: 'How we work',
    q: 'Where do you take the debris?',
    a: `Everything recyclable goes to the right recycling facility. We recycle ${s.recycledRange} of all removed material. Anything that can't be recycled goes to environmentally approved landfills.`,
  },
  {
    id: 'permits',
    group: 'How we work',
    q: 'Who secures, or “pulls,” the permit?',
    a: 'We can help pull the demolition permit, unless the owner already has one. Most cities have several steps now, and our office knows the utility disconnect and municipal procedures, which takes a big job off your plate.',
  },
  {
    id: 'lead-time',
    group: 'How we work',
    q: 'How much lead time do you need?',
    a: `Typically ${t.leadTime} before we can start a project.`,
  },
  {
    id: 'duration',
    group: 'How we work',
    q: 'How long will the job take?',
    a: `It depends on the size. A typical residential demolition takes ${t.residential}. Commercial projects usually run ${t.commercial}. Larger industrial projects range from ${t.industrial}.`,
  },
  {
    id: 'contractors-same',
    group: 'The company',
    q: 'Aren’t all demolition contractors about the same?',
    a: 'No. That’s a common misconception. Practices vary a lot. We employ skilled people, run the right equipment and follow proper procedures. We carry demolition insurance, which plenty of companies doing demolition don’t. And we recycle whenever we can.',
  },
  {
    id: 'insured',
    group: 'The company',
    q: 'Is Dunn Demolition licensed and insured?',
    a: `Yes. We’re a ${site.license}, fully insured with general liability, workers’ compensation and commercial vehicle insurance. Whoever you hire, ask for the declaration page of their policy, which states what they’re insured to do. Clients are often surprised how many demolition jobs are done by landscapers instead of demolition companies.`,
  },
  {
    id: 'references',
    group: 'The company',
    q: 'Can you provide references?',
    a: `Of course. With about ${s.projectsPerYear} demolition projects a year, we can give you a long list of clients and associates to call.`,
  },
  {
    id: 'how-long-in-business',
    group: 'The company',
    q: 'How long have you been in business?',
    a: `Since ${site.foundingYear}.`,
  },
  {
    id: 'crews',
    group: 'The company',
    q: 'How many crews do you have?',
    a: `${s.crews} crews, with ${s.crewSize} people on each. We never run more than ${s.maxProjects} projects at once, which lets us manage every part of every job properly.`,
  },
  {
    id: 'experience',
    group: 'The company',
    q: 'How experienced is your crew?',
    a: `Our field crews are some of the most experienced in the business. Our excavator operators have more than ${s.operatorYears} years of combined field experience. It’s an organized, close-knit team, which means a quick, professional, turn-key job for you.`,
  },
];

export const homeFaqIds = ['what-structures', 'how', 'lead-time', 'duration'];

export function faqById(id: string) {
  const f = faqs.find((x) => x.id === id);
  if (!f) throw new Error(`Unknown FAQ ${id}`);
  return f;
}
