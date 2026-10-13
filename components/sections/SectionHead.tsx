import { Split } from '@/components/fx/Split';

// Section heading: a statement in wide caps, laid in letter by letter (Split), with an
// optional short paragraph.
export function SectionHead({ title, intro, id, className = '' }: { title: string; intro?: React.ReactNode; id?: string; className?: string }) {
  return (
    <div className={`max-w-4xl ${className}`} data-reveal>
      <h2 id={id} className="h-section" aria-label={title}>
        <Split text={title} />
      </h2>
      {intro && <p className="lede mt-6 opacity-80">{intro}</p>}
    </div>
  );
}
