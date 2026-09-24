import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, BookOpen, MapPin, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StoryCard } from '@/components/story-card';
import { supabase } from '@/lib/supabase';
import { Collection, Story, Place, Person } from '@/lib/types';

export async function generateStaticParams() {
  const { data } = await supabase.from('collections').select('slug');
  return (data || []).map((c) => ({ slug: c.slug }));
}

export default async function CollectionDetailPage({ params }: { params: { slug: string } }) {
  const { data: collection } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!collection) notFound();
  const col = collection as Collection;

  const { data: items } = await supabase
    .from('collection_items')
    .select('*, story:stories(*), place:places(*), person:people(*)')
    .eq('collection_id', col.id)
    .order('sort_order', { ascending: true });

  const itemList = items || [];
  const stories = itemList.filter((i) => i.story).map((i) => i.story as Story);
  const places = itemList.filter((i) => i.place).map((i) => i.place as Place);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/collections" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> All collections
      </Link>

      {col.image_url && (
        <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden bg-muted mb-6">
          <Image src={col.image_url} alt={col.name} fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge className="mb-2 bg-accent/90 text-accent-foreground">{col.category}</Badge>
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white">{col.name}</h1>
          </div>
        </div>
      )}

      {!col.image_url && (
        <div className="mb-6">
          <Badge className="mb-2 bg-accent/90 text-accent-foreground">{col.category}</Badge>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold">{col.name}</h1>
        </div>
      )}

      <p className="text-lg text-muted-foreground max-w-3xl">{col.description}</p>

      {stories.length > 0 && (
        <div className="mt-12">
          <h2 className="font-playfair text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Stories ({stories.length})
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      )}

      {places.length > 0 && (
        <div className="mt-12">
          <h2 className="font-playfair text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" /> Places ({places.length})
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {places.map((place) => (
              <Link key={place.id} href={`/map?place=${place.slug}`}>
                <Card className="overflow-hidden border-border/60 transition-all hover:shadow-md hover:-translate-y-0.5 group">
                  <div className="relative aspect-square bg-muted">
                    {place.image_url && (
                      <Image src={place.image_url} alt={place.name} fill sizes="200px" className="object-cover group-hover:scale-105 transition-transform" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-playfair text-sm font-semibold text-white">{place.name}</h3>
                      <p className="text-xs text-white/70">{place.province}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 border-t border-border pt-8">
        <Link href="/contribute">
          <Button variant="outline">
            Contribute to this collection <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
