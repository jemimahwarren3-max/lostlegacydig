import { HeritageMap } from '@/components/heritage-map';
import { supabase } from '@/lib/supabase';
import { Place, Story } from '@/lib/types';

export const metadata = {
  title: 'Heritage Map — Kumbwata',
  description: 'Explore Zimbabwe through an interactive heritage map. Discover stories, people, and places.',
};

export default async function MapPage() {
  const [{ data: places }, { data: stories }] = await Promise.all([
    supabase.from('places').select('*').order('featured', { ascending: false }),
    supabase.from('stories').select('*').eq('verification_status', 'published'),
  ]);

  const placeList = (places as Place[]) || [];
  const storyList = (stories as Story[]) || [];

  const markers = placeList.map((place) => ({
    place,
    stories: storyList.filter((s) => s.place_id === place.id),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold">Heritage Map of Zimbabwe</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Click any marker to discover stories, oral histories, people, and educational resources
          connected to that place. Filter by category to focus your exploration.
        </p>
      </div>

      <HeritageMap markers={markers} />

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {placeList.map((place) => (
          <a
            key={place.id}
            href={`/stories?place=${place.slug}`}
            className="flex items-start gap-3 rounded-lg border border-border/60 p-4 hover:border-primary/40 hover:bg-secondary/30 transition-colors"
          >
            <span className="text-2xl">
              {place.category === 'heritage' ? '🏛' : place.category === 'natural' ? '🌿' : '🏙'}
            </span>
            <div>
              <h3 className="font-semibold text-sm">{place.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{place.province}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
