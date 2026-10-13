// A hi-vis band of the trade, running sideways. MotionRoot drives each row with time plus
// scroll velocity (faster when you scroll, reversing with direction). The words are drawn
// from data-t through CSS content: decorative, out of the word count, aria-hidden.
const words = ['Demolition', 'Site clearing', 'Gut outs', 'Concrete recycling', 'Hauling', 'Tank removal'];

export function Marquee() {
  const row = words.join('  ✕  ') + '  ✕  ';
  return (
    <div aria-hidden="true" className="relative overflow-hidden border-y border-ink bg-accent py-5 text-ink lg:py-7">
      {[1, -1].map((dir) => (
        <div key={dir} data-marquee={dir} className="flex w-max whitespace-pre">
          {[0, 1, 2, 3].map((k) => (
            <span
              key={k}
              data-t={row}
              className={`text-[clamp(2.5rem,6.5vw,6.5rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] [font-stretch:125%] after:content-[attr(data-t)] ${dir < 0 ? 'text-transparent [-webkit-text-stroke:1.5px_var(--color-ink)]' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
