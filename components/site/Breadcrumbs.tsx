import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

type Crumb = { name: string; path: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: 'Home', path: '/' }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-dust">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-2">
              {i < all.length - 1 ? (
                <>
                  <Link href={c.path} className="underline decoration-1 underline-offset-4 hover:text-paper">
                    {c.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              ) : (
                <span aria-current="page" className="text-paper">
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all)} />
    </>
  );
}
