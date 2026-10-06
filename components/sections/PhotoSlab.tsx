import { Photo } from '@/components/site/Photo';

// A photo set in a heavy frame with a hard offset shadow. The image drifts (parallax) inside it.
export function PhotoSlab({ name, sizes, className = '', shadow = 'ink', aspect = 'aspect-[4/3]' }: { name: string; sizes: string; className?: string; shadow?: 'ink' | 'accent'; aspect?: string }) {
  return (
    <div
      className={`relative overflow-hidden border-2 border-ink ${aspect} ${shadow === 'accent' ? 'shadow-[10px_10px_0_0_var(--color-accent)]' : 'shadow-[10px_10px_0_0_var(--color-ink)]'} ${className}`}
      data-reveal
    >
      <Photo name={name} sizes={sizes} className="photo absolute inset-0 h-full w-full scale-[1.14] object-cover" parallax />
    </div>
  );
}
