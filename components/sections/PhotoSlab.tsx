import { Photo } from '@/components/site/Photo';

// A photo that opens like a shutter going up, and drifts (parallax) inside its frame.
// `shadow` is kept for older call sites; the new design has no offset shadows.
export function PhotoSlab({ name, sizes, className = '', aspect = 'aspect-[4/3]' }: { name: string; sizes: string; className?: string; shadow?: 'ink' | 'accent'; aspect?: string }) {
  return (
    <div className={`relative overflow-hidden ${aspect} ${className}`} data-reveal="blocks">
      <Photo name={name} sizes={sizes} className="photo absolute inset-0 h-full w-full scale-[1.14] object-cover" parallax />
    </div>
  );
}
