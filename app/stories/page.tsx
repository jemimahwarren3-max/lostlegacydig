import { StoryCard } from '@/components/story-card';
import { supabase } from '@/lib/supabase';
import { Story, Place } from '@/lib/types';
import { FilterBar } from '@/components/filter-bar';

export const metadata = {
  title: 'Stories — Kumbwata',
  description: 'Oral histories, traditions, and living culture from across Zimbabwe.',
};

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: { category?: string; place?: string };
}) {
  let query = supabase
    .from('stories')
    .select('*, place:places(*)')
    .eq('verification_status', 'published')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (searchParams.category) {
    query = query.eq('category', searchParams.category);
  }
  if (searchParams.place) {
    query = query.filter('place.slug', 'eq', searchParams.place);
  }

  const [{ data: stories }, { data: places }] = await Promise.all([
    query,
    supabase.from('places').select('*').order('name'),
  ]);

  const storyList = (stories as Story[]) || [];
  const placeList = (places as Place[]) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold">Stories</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Oral histories, traditions, contemporary culture, and the living record of Zimbabwe —
          preserved by communities, verified by people.
        </p>
      </div>

      <FilterBar
        categories={[
          { label: 'All', value: '' },
          { label: 'Heritage', value: 'heritage' },
          { label: 'Community', value: 'community' },
          { label: 'Creators', value: 'creators' },
          { label: 'Education', value: 'education' },
        ]}
        activeCategory={searchParams.category || ''}
        basePath="/stories"
      />

      {storyList.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No stories found. Try a different filter or contribute your own.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {storyList.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}
