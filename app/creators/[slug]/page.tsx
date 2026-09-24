import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Users, BookOpen, Mail, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Creator, Story } from '@/lib/types';

export async function generateStaticParams() {
  const { data } = await supabase.from('creators').select('slug');
  return (data || []).map((c) => ({ slug: c.slug }));
}

export default async function CreatorDetailPage({ params }: { params: { slug: string } }) {
  const { data: creator } = await supabase
    .from('creators')
    .select('*, story:stories(*)')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!creator) notFound();
  const c = creator as Creator;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/creators" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> All creators
      </Link>

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="sm:col-span-1">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
            {c.image_url ? (
              <Image src={c.image_url} alt={c.name} fill sizes="300px" className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <span className="font-playfair text-5xl font-bold text-muted-foreground">{c.name.charAt(0)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="sm:col-span-2">
          <Badge className="mb-2 bg-primary/10 text-primary">{c.category}</Badge>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold">{c.name}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {c.province && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {c.province}</span>}
            {c.community && <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {c.community}</span>}
          </div>
          <p className="mt-4 text-muted-foreground leading-relaxed">{c.bio}</p>

          {c.skills && c.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {c.skills.map((skill) => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button>
              <Mail className="h-4 w-4 mr-2" /> Commission work
            </Button>
            <Button variant="outline">Follow</Button>
          </div>
        </div>
      </div>

      {/* Portfolio */}
      {c.portfolio_images && c.portfolio_images.length > 0 && (
        <div className="mt-12">
          <h2 className="font-playfair text-2xl font-bold mb-4">Portfolio</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {c.portfolio_images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image src={img} alt={`${c.name} portfolio ${i + 1}`} fill sizes="300px" className="object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related story */}
      {c.story && (
        <div className="mt-12">
          <h2 className="font-playfair text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Featured in
          </h2>
          <Link href={`/stories/${c.story.slug}`}>
            <Card className="border-border/60 transition-all hover:shadow-md">
              <CardContent className="p-5 flex items-center gap-4">
                {c.story.image_url && (
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image src={c.story.image_url} alt={c.story.title} fill sizes="64px" className="object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{c.story.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{c.story.summary}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
}
