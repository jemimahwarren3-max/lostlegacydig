import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, PenTool, Sparkles, MapPin, Languages, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product-card';
import { PRODUCTS_WITH_CREATORS, MOCK_CREATORS } from '@/lib/mock-data';
import { REGIONS, LANGUAGES, MARKETPLACE_CATEGORIES } from '@/lib/types';

export default function Home() {
  const trending = PRODUCTS_WITH_CREATORS.slice(0, 6);
  const totalEarned = MOCK_CREATORS.reduce((sum, c) => sum + c.earned, 0);

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
              <Sparkles className="h-3 w-3 mr-1" /> A living cultural marketplace
            </Badge>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
              Zimbabwe has always been creating history.
              <br />
              <span className="text-accent">Now we can preserve, share and build from it.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed">
              Discover stories, knowledge, art, learning resources and experiences from
              Zimbabwean creators and communities. Learn from it. Buy it. Experience it. Preserve it.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/marketplace">
                <Button size="lg" className="w-full sm:w-auto">
                  <ShoppingBag className="h-5 w-5 mr-2" /> Explore the Marketplace
                </Button>
              </Link>
              <Link href="/creators">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <PenTool className="h-5 w-5 mr-2" /> Become a Creator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Economy stats bar */}
      <section className="border-b border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="font-playfair text-2xl font-bold text-primary">{PRODUCTS_WITH_CREATORS.length}+</div>
              <div className="text-xs text-muted-foreground">Products &amp; Experiences</div>
            </div>
            <div>
              <div className="font-playfair text-2xl font-bold text-primary">{MOCK_CREATORS.length}+</div>
              <div className="text-xs text-muted-foreground">Creators Earning</div>
            </div>
            <div>
              <div className="font-playfair text-2xl font-bold text-primary">${totalEarned}+</div>
              <div className="text-xs text-muted-foreground">Paid to Creators</div>
            </div>
            <div>
              <div className="font-playfair text-2xl font-bold text-primary">{MARKETPLACE_CATEGORIES.length}+</div>
              <div className="text-xs text-muted-foreground">Categories</div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Demo figures — Lost Legacy Digital is in its first 90 days.
          </p>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold">Trending Now</h2>
              <p className="mt-2 text-muted-foreground">Digital books, art, stories, audio, workshops and experiences.</p>
            </div>
            <Link href="/marketplace" className="hidden sm:block">
              <Button variant="ghost" className="text-primary">
                Explore the marketplace <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/marketplace">
              <Button variant="outline">Explore the marketplace</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Discover Zimbabwe */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold">Discover Zimbabwe</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Explore by region, language or category — culture here isn't bound to any one place.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-sm mb-3">
                <MapPin className="h-4 w-4 text-primary" /> By region
              </h3>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((region) => (
                  <Link key={region} href={`/marketplace?region=${encodeURIComponent(region)}`}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                      {region}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 font-semibold text-sm mb-3">
                <Languages className="h-4 w-4 text-primary" /> By language
              </h3>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <Link key={lang} href={`/marketplace?language=${encodeURIComponent(lang)}`}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                      {lang}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 font-semibold text-sm mb-3">
                <Tag className="h-4 w-4 text-primary" /> By category
              </h3>
              <div className="flex flex-wrap gap-2">
                {MARKETPLACE_CATEGORIES.map((cat) => (
                  <Link key={cat} href={`/marketplace?category=${encodeURIComponent(cat)}`}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                      {cat}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
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
                  Click any location to discover stories, creators, products and experiences
                  connected to that place. From Great Zimbabwe to Victoria Falls, every marker
                  opens a world of knowledge.
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

      {/* Become a creator CTA */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
              <PenTool className="h-8 w-8" />
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold">
              Turn your knowledge and craft into income
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Artists, writers, historians, elders and craftspeople — list a product, service or
              experience, go through our verification process, and start earning from your work.
            </p>
            <div className="mt-8">
              <Link href="/creators">
                <Button size="lg">
                  Start Creating <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
