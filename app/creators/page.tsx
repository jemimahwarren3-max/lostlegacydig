import { CreatorCard } from '@/components/creator-card';
import { supabase } from '@/lib/supabase';
import { Creator } from '@/lib/types';

export const metadata = {
  title: 'Creators — Kumbwata',
  description: 'Artists, musicians, craftspeople, and cultural practitioners of Zimbabwe.',
};

export default async function CreatorsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  let query = supabase
    .from('creators')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (searchParams.category) {
    query = query.eq('category', searchParams.category);
  }

  const { data: creators } = await query;
  const creatorList = (creators as Creator[]) || [];

  const categories = Array.from(new Set(creatorList.map((c) => c.category)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold">Creators</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          The artists, musicians, craftspeople, storytellers, and cultural practitioners who keep
          Zimbabwean culture alive — and are creating the culture of today.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <a href="/creators">
          <button className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${!searchParams.category ? 'bg-primary text-primary-foreground shadow' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
            All
          </button>
        </a>
        {categories.map((cat) => (
          <a key={cat} href={`/creators?category=${encodeURIComponent(cat)}`}>
            <button className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${searchParams.category === cat ? 'bg-primary text-primary-foreground shadow' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
              {cat}
            </button>
          </a>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {creatorList.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    </div>
  );
}
