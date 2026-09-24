import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Volume2, BadgeCheck, Users, BookOpen, ArrowLeft, Clock, Tag, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Story, Place, Person, EducationalResource, Creator } from '@/lib/types';
import { CONTENT_TYPES, CATEGORIES } from '@/lib/types';

export async function generateStaticParams() {
  const { data } = await supabase.from('stories').select('slug');
  return (data || []).map((s) => ({ slug: s.slug }));
}

export default async function StoryDetailPage({ params }: { params: { slug: string } }) {
  const { data: story } = await supabase
    .from('stories')
    .select('*, place:places(*), person:people(*)')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!story) notFound();

  const storyData = story as Story;

  // Fetch related educational resources
  const { data: resources } = await supabase
    .from('educational_resources')
    .select('*')
    .eq('story_id', storyData.id);

  // Fetch related creators
  const { data: creators } = await supabase
    .from('creators')
    .select('*')
    .eq('story_id', storyData.id);

  // Fetch related stories (same place or same category)
  const { data: relatedStories } = await supabase
    .from('stories')
    .select('*, place:places(*)')
    .eq('verification_status', 'published')
    .neq('id', storyData.id)
    .or(`place_id.eq.${storyData.place_id},category.eq.${storyData.category}`)
    .limit(3);

  const resourceList = (resources as EducationalResource[]) || [];
  const creatorList = (creators as Creator[]) || [];
  const relatedList = (relatedStories as Story[]) || [];

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/stories" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to stories
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge variant="secondary">{CATEGORIES[storyData.category] || storyData.category}</Badge>
        <Badge variant="outline">{CONTENT_TYPES[storyData.content_type] || storyData.content_type}</Badge>
        {storyData.verification_status === 'published' && (
          <Badge className="bg-green-600 text-white flex items-center gap-1">
            <BadgeCheck className="h-3 w-3" /> Community Verified
          </Badge>
        )}
      </div>

      <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
        {storyData.title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{storyData.summary}</p>

      {/* Meta */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
        {storyData.place && (
          <Link href={`/map?place=${storyData.place.slug}`} className="flex items-center gap-1.5 hover:text-foreground">
            <MapPin className="h-4 w-4" /> {storyData.place.name}
          </Link>
        )}
        {storyData.community && (
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {storyData.community}</span>
        )}
        <span className="flex items-center gap-1.5"><Tag className="h-4 w-4" /> {storyData.language}</span>
        {storyData.historical_period && (
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {storyData.historical_period}</span>
        )}
      </div>

      {/* Hero image */}
      {storyData.image_url && (
        <div className="relative mt-8 aspect-[16/9] rounded-xl overflow-hidden bg-muted">
          <Image
            src={storyData.image_url}
            alt={storyData.title}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Audio player placeholder */}
      {storyData.audio_url && (
        <div className="mt-6 flex items-center gap-3 rounded-lg bg-secondary p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Volume2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Audio recording available</p>
            <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-0 bg-primary" />
            </div>
          </div>
          <Button size="sm">Play</Button>
        </div>
      )}

      {/* Content */}
      {storyData.content && (
        <div className="mt-8 prose-content max-w-none">
          {storyData.content.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return <h2 key={i}>{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('• ')) {
              return <li key={i}>{line.replace('• ', '')}</li>;
            }
            if (line.trim() === '') {
              return <div key={i} className="h-4" />;
            }
            return <p key={i}>{line}</p>;
          })}
        </div>
      )}

      {/* Interview info */}
      {(storyData.interviewee || storyData.interviewer) && (
        <Card className="mt-8 border-border/60 bg-secondary/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-3">Interview Details</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {storyData.interviewee && (
                <div>
                  <span className="text-xs text-muted-foreground">Interviewee</span>
                  <p className="font-medium">{storyData.interviewee}</p>
                </div>
              )}
              {storyData.interviewer && (
                <div>
                  <span className="text-xs text-muted-foreground">Interviewer</span>
                  <p className="font-medium">{storyData.interviewer}</p>
                </div>
              )}
              {storyData.interview_date && (
                <div>
                  <span className="text-xs text-muted-foreground">Date</span>
                  <p className="font-medium">{new Date(storyData.interview_date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Topics */}
      {storyData.topics && storyData.topics.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {storyData.topics.map((topic) => (
            <Link key={topic} href={`/search?q=${encodeURIComponent(topic)}`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                {topic}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Sources */}
      {storyData.sources && (
        <div className="mt-6 text-sm text-muted-foreground border-t border-border pt-4">
          <span className="font-semibold">Sources: </span>{storyData.sources}
        </div>
      )}

      {/* Educational resources */}
      {resourceList.length > 0 && (
        <div className="mt-12">
          <h2 className="font-playfair text-2xl font-bold flex items-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6 text-primary" /> Learn from this story
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {resourceList.map((res) => (
              <Link key={res.id} href={`/learn/${res.slug}`}>
                <Card className="border-border/60 transition-all hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">{res.grade}</Badge>
                      <Badge variant="outline" className="text-xs">{res.subject}</Badge>
                      <Badge variant="outline" className="text-xs capitalize">{res.resource_type.replace('_', ' ')}</Badge>
                    </div>
                    <h3 className="font-semibold text-sm">{res.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{res.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related creators */}
      {creatorList.length > 0 && (
        <div className="mt-12">
          <h2 className="font-playfair text-2xl font-bold flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-primary" /> Related creators
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {creatorList.map((creator) => (
              <Link key={creator.id} href={`/creators/${creator.slug}`}>
                <Card className="border-border/60 transition-all hover:shadow-md">
                  <CardContent className="p-4 flex items-center gap-3">
                    {creator.image_url && (
                      <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted shrink-0">
                        <Image src={creator.image_url} alt={creator.name} fill sizes="48px" className="object-cover" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-sm">{creator.name}</h3>
                      <p className="text-xs text-muted-foreground">{creator.category}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related stories */}
      {relatedList.length > 0 && (
        <div className="mt-12">
          <h2 className="font-playfair text-2xl font-bold flex items-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-primary" /> Related stories
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {relatedList.map((rel) => (
              <Link key={rel.id} href={`/stories/${rel.slug}`}>
                <Card className="overflow-hidden border-border/60 transition-all hover:shadow-md hover:-translate-y-0.5 h-full">
                  {rel.image_url && (
                    <div className="relative aspect-[16/10] bg-muted">
                      <Image src={rel.image_url} alt={rel.title} fill sizes="300px" className="object-cover" />
                    </div>
                  )}
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-1">{rel.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{rel.summary}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
