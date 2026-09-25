import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, BadgeCheck, MapPin, Tag, Globe2, Star, Heart, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/product-card';
import { MOCK_PRODUCTS, getProductBySlug, getRelatedProducts } from '@/lib/mock-data';
import { PRODUCT_TYPE_LABELS } from '@/lib/types';

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <article className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/marketplace" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to marketplace
      </Link>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary">{product.category}</Badge>
            <Badge variant="outline">{PRODUCT_TYPE_LABELS[product.type]}</Badge>
            <Badge variant="outline" className="border-dashed">Demo product</Badge>
          </div>

          <h1 className="font-playfair text-2xl sm:text-3xl font-bold leading-tight text-balance">
            {product.title}
          </h1>

          {product.creator && (
            <Link href={`/creators/${product.creator.slug}`} className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              by <span className="font-medium">{product.creator.name}</span>
            </Link>
          )}

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {product.region}</span>
            <span className="flex items-center gap-1.5"><Globe2 className="h-4 w-4" /> {product.language}</span>
            {product.rating && (
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-accent text-accent" /> {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            )}
          </div>

          <p className="mt-4 font-playfair text-3xl font-bold text-primary">
            ${product.price} <span className="text-base font-normal text-muted-foreground">{product.currency}</span>
          </p>

          <div className="mt-5 flex gap-2">
            <Button size="lg" className="flex-1">Buy — checkout coming soon</Button>
            <Button size="lg" variant="outline" aria-label="Save">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" aria-label="Share">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Card className="mt-6 border-border/60 bg-secondary/30">
            <CardContent className="p-4">
              {product.verification_status === 'verified' ? (
                <div className="flex items-start gap-2.5">
                  <BadgeCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Verified Heritage Asset</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Creator verified, source documented, and reviewed by the community before publication.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <Tag className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Not yet verified</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This listing has not completed community verification yet.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-10 max-w-3xl">
        <h2 className="font-playfair text-xl font-bold mb-2">Description</h2>
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>

        <h2 className="font-playfair text-xl font-bold mt-6 mb-2">Cultural context</h2>
        <p className="text-muted-foreground leading-relaxed">{product.culturalContext}</p>

        {product.creator && (
          <>
            <h2 className="font-playfair text-xl font-bold mt-6 mb-2">About the creator</h2>
            <Card className="border-border/60">
              <CardContent className="p-4 flex items-start gap-4">
                {product.creator.image_url && (
                  <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted shrink-0">
                    <Image src={product.creator.image_url} alt={product.creator.name} fill sizes="56px" className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm">{product.creator.name}</p>
                  <p className="text-xs text-muted-foreground">{product.creator.tagline}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{product.creator.bio}</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="font-playfair text-2xl font-bold mb-4">Related products</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
