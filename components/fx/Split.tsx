import { Fragment } from 'react';

// Splits a heading into letters, each in its own span, words kept unbreakable.
// The heading itself should carry aria-label={text}: the letter spans are aria-hidden.
// CSS (globals.css, .ch) lays the letters in like a course of bricks when the nearest
// [data-reveal] comes into view; DemoTitle drives them directly.
export function Split({ text, accent }: { text: string; accent?: string }) {
  let ci = 0;
  const words = text.split(' ');
  return (
    <>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span aria-hidden="true" className={`inline-block whitespace-nowrap ${accent && w.replace(/[.,]/g, '') === accent ? 'text-accent' : ''}`}>
            {[...w].map((ch) => {
              const i = ci++;
              return (
                <span key={i} data-ch className="ch inline-block" style={{ '--ci': i, '--r': `${((i * 37) % 13) - 6}deg` } as React.CSSProperties}>
                  {ch}
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  );
}
