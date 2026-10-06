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
};

// Self-hosted, pre-optimized WebP with a srcset from scripts/optimize-images.mjs.
export function Photo({ name, sizes, className = '', priority = false, eager = false, alt, parallax = false }: Props) {
  const img = images[name as ImageKey];
  if (!img) throw new Error(`Unknown image: ${name}`);
  const largest = img.widths[img.widths.length - 1];
  const ratio = img.height / img.width;
  const srcSet = img.widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(', ');
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
