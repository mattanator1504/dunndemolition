// Section heading: a statement in caps, with an optional short paragraph.
export function SectionHead({ title, intro, id, className = '' }: { title: React.ReactNode; intro?: React.ReactNode; id?: string; className?: string }) {
  return (
    <div className={`max-w-3xl ${className}`} data-reveal>
      <h2 id={id} className="h-section">
        {title}
      </h2>
      {intro && <p className="lede mt-5 opacity-90">{intro}</p>}
    </div>
  );
}
