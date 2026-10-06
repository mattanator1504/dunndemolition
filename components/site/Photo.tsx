import images from '@/lib/images.generated.json';

type ImageKey = keyof typeof images;

type Props = {
  name: string;
  sizes: string;
  className?: string;
  priority?: boolean; // LCP image: eager + fetchpriority=high
  eager?: boolean; // above the fold but not the LCP: eager, normal priority
  alt?: string; // override; '' marks the photo decorative
  parallax?: boolean;
  maxWidth?: number; // leave larger files out of the srcset (small slots: cards, filmstrip)
};

// Self-hosted, pre-optimized WebP with a srcset from scripts/optimize-images.mjs.
export function Photo({ name, sizes, className = '', priority = false, eager = false, alt, parallax = false, maxWidth }: Props) {
  const img = images[name as ImageKey];
  if (!img) throw new Error(`Unknown image: ${name}`);
  const widths = maxWidth ? img.widths.filter((w) => w <= maxWidth) : img.widths;
  const largest = widths.length ? widths[widths.length - 1] : img.widths[0];
  const ratio = img.height / img.width;
  const srcSet = (widths.length ? widths : [largest]).map((w) => `/images/${name}-${w}.webp ${w}w`).join(', ');
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/${name}-${largest}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      width={largest}
      height={Math.round(largest * ratio)}
      alt={alt ?? img.alt}
      className={className}
      loading={priority || eager ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      {...(parallax ? { 'data-parallax': '' } : {})}
    />
  );
}
