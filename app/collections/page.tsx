import { CollectionCard } from '@/components/collection-card';
import { supabase } from '@/lib/supabase';
import { Collection } from '@/lib/types';

export const metadata = {
  title: 'Collections — Kumbwata',
  description: 'Curated archives of Zimbabwean stories, media, and cultural knowledge.',
};

export default async function CollectionsPage() {
  const { data: collections } = await supabase
    .from('collections')
    .select('*, collection_items(*)')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  const collectionList = (collections as Collection[]) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold">Collections</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Curated archives bringing together stories, places, people, and media around shared themes —
          from Great Zimbabwe to contemporary art.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectionList.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}
