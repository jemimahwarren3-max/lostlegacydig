import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, BookOpen, PenTool, GraduationCap, Users, Library, Compass, Volume2, BadgeCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StoryCard } from '@/components/story-card';
import { CreatorCard } from '@/components/creator-card';
import { CollectionCard } from '@/components/collection-card';
import { supabase } from '@/lib/supabase';
import { Story, Creator, Collection, Place } from '@/lib/types';

async function getHomeData() {
  const [featuredStories, featuredCreators, featuredCollections, places] = await Promise.all([
    supabase
      .from('stories')
      .select('*, place:places(*)')
      .eq('featured', true)
      .eq('verification_status', 'published')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('creators')
      .select('*')
      .eq('featured', true)
      .limit(4),
    supabase
      .from('collections')
      .select('*, collection_items(*)')
      .eq('featured', true)
      .limit(4),
    supabase
      .from('places')
      .select('*')
      .order('featured', { ascending: false })
      .limit(8),
  ]);

  return {
    stories: (featuredStories.data as Story[]) || [],
    creators: (featuredCreators.data as Creator[]) || [],
    collections: (featuredCollections.data as Collection[]) || [],
    places: (places.data as Place[]) || [],
  };
}

export default async function Home() {
  const { stories, creators, collections, places } = await getHomeData();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/35560986/pexels-photo-35560986.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Zimbabwean savanna at sunrise"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl animate-slide-up">
            <Badge className="mb-4 bg-primary/90 text-primary-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 mr-1" /> A living cultural platform
            </Badge>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
              Zimbabwe's living story,
              <br />
              <span className="text-accent">preserved by its people.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed">
              Explore the stories, people, places, knowledge and creativity that shape Zimbabwe —
              from ancient civilizations to the culture being created today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/map">
                <Button size="lg" className="w-full sm:w-auto">
                  <MapPin className="h-5 w-5 mr-2" /> Explore the Map
                </Button>
              </Link>
              <Link href="/learn">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <GraduationCap className="h-5 w-5 mr-2" /> Start Learning
                </Button>
              </Link>
              <Link href="/contribute">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white">
                  <PenTool className="h-5 w-5 mr-2" /> Share a Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="font-playfair text-2xl font-bold text-primary">{stories.length}+</div>
              <div className="text-xs text-muted-foreground">Featured Stories</div>
            </div>
            <div>
              <div className="font-playfair text-2xl font-bold text-primary">{places.length}+</div>
              <div className="text-xs text-muted-foreground">Heritage Places</div>
            </div>
            <div>
              <div className="font-playfair text-2xl font-bold text-primary">{creators.length}+</div>
              <div className="text-xs text-muted-foreground">Creators</div>
            </div>
            <div>
              <div className="font-playfair text-2xl font-bold text-primary">{collections.length}+</div>
              <div className="text-xs text-muted-foreground">Collections</div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Zimbabwe */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold">Explore Zimbabwe</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              From the stone walls of Great Zimbabwe to the streets of Harare — discover the places that tell our story.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {places.slice(0, 8).map((place) => (
              <Link key={place.id} href={`/map?place=${place.slug}`}>
                <Card className="overflow-hidden border-border/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {place.image_url ? (
                      <Image
                        src={place.image_url}
                        alt={place.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-secondary">
                        <MapPin className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <Badge className="mb-1 text-xs bg-accent/90 text-accent-foreground">
                        {place.category}
                      </Badge>
                      <h3 className="font-playfair text-base font-semibold text-white leading-tight">
                        {place.name}
                      </h3>
                      {place.province && (
                        <p className="text-xs text-white/70 mt-0.5">{place.province}</p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold">Featured Stories</h2>
              <p className="mt-2 text-muted-foreground">Oral histories, traditions, and living culture from across Zimbabwe.</p>
            </div>
            <Link href="/stories" className="hidden sm:block">
              <Button variant="ghost" className="text-primary">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.slice(0, 6).map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/stories">
              <Button variant="outline">View all stories</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Map CTA */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="relative grid lg:grid-cols-2">
              <div className="relative min-h-[300px] lg:min-h-[400px]">
                <Image
                  src="https://images.pexels.com/photos/3073315/pexels-photo-3073315.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Zimbabwe landscape"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <Badge className="self-start mb-4 bg-primary/10 text-primary">
                  <MapPin className="h-3 w-3 mr-1" /> Interactive Map
                </Badge>
                <h2 className="font-playfair text-3xl font-bold leading-tight">
                  Explore Zimbabwe through an interactive heritage map
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Click any location to discover stories, people, oral histories, educational
                  resources, and creators connected to that place. From Great Zimbabwe to Victoria
                  Falls, every marker opens a world of knowledge.
                </p>
                <div className="mt-6">
                  <Link href="/map">
                    <Button size="lg">
                      Open the Map <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Learn section */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-accent/15 text-accent-foreground">
              <GraduationCap className="h-3 w-3 mr-1" /> For Schools & Learners
            </Badge>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold">Learn Zimbabwe</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Curriculum-aligned lessons, quizzes, and resources — from Grade 4 to Grade 7 —
              powered by the same knowledge that fills our heritage map.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { subject: 'Heritage Studies', grade: 'Grade 6', topic: 'Great Zimbabwe', icon: BookOpen, href: '/learn?subject=Heritage+Studies' },
              { subject: 'Agriculture', grade: 'Grade 5', topic: 'Traditional Farming', icon: Compass, href: '/learn?subject=Agriculture' },
              { subject: 'Music', grade: 'Grade 6', topic: 'The Mbira', icon: Volume2, href: '/learn?subject=Music' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.subject} href={item.href}>
                  <Card className="h-full border-border/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="mb-2">{item.grade}</Badge>
                      <h3 className="font-playfair text-xl font-semibold">{item.subject}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.topic}</p>
                      <div className="mt-4 flex items-center text-sm font-medium text-primary">
                        Start lesson <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link href="/learn">
              <Button variant="outline" size="lg">
                Browse all subjects <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Meet Creators */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold">Meet the Creators</h2>
              <p className="mt-2 text-muted-foreground">Artists, musicians, craftspeople, and cultural practitioners keeping Zimbabwe alive.</p>
            </div>
            <Link href="/creators" className="hidden sm:block">
              <Button variant="ghost" className="text-primary">
                All creators <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {creators.slice(0, 4).map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold">Collections</h2>
              <p className="mt-2 text-muted-foreground">Curated archives of stories, media, and knowledge.</p>
            </div>
            <Link href="/collections" className="hidden sm:block">
              <Button variant="ghost" className="text-primary">
                All collections <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {collections.slice(0, 4).map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      {/* For Schools CTA */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-ochre text-primary-foreground shadow-xl">
            <div className="p-8 lg:p-16 text-center">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold leading-tight">
                For Schools
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/85 max-w-2xl mx-auto leading-relaxed">
                Bring Zimbabwe's living heritage into the classroom. Curriculum-aligned lessons,
                offline-ready content, teacher dashboards, and learner progress tracking —
                designed for Zimbabwean schools with unreliable internet.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/schools">
                  <Button size="lg" variant="secondary">
                    Learn about school plans <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    Browse lessons
                  </Button>
                </Link>
                </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Contribute CTA */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
              <PenTool className="h-8 w-8" />
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold">
              Contribute Your Knowledge
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Every community has stories worth preserving. Share oral histories, photographs,
              artwork, music, or traditional knowledge. Your contribution goes through a respectful
              verification process before joining Zimbabwe's living record.
            </p>
            <div className="mt-8">
              <Link href="/contribute">
                <Button size="lg">
                  Share a Story <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {[
                { icon: PenTool, title: 'Submit', desc: 'Upload your story, photo, or recording with details about people, place, and language.' },
                { icon: Sparkles, title: 'AI Processing', desc: 'Our system helps with transcription, translation, and categorization — but never decides cultural truth.' },
                { icon: BadgeCheck, title: 'Community Verification', desc: 'Researchers and community members review each contribution before it is published.' },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <Card key={i} className="border-border/60">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">Step {i + 1}</span>
                      </div>
                      <h4 className="font-semibold text-sm">{step.title}</h4>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
