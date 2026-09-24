'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FilterOption {
  label: string;
  value: string;
}

export function FilterBar({
  categories,
  activeCategory,
  basePath,
}: {
  categories: FilterOption[];
  activeCategory: string;
  basePath: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.value}
          href={cat.value ? `${basePath}?category=${cat.value}` : basePath}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
            activeCategory === cat.value
              ? 'bg-primary text-primary-foreground shadow'
              : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
