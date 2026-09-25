import Link from 'next/link';
import Image from 'next/image';
import { MapPin, BadgeCheck, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, PRODUCT_TYPE_LABELS } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/marketplace/${product.slug}`} className="group block">
      <Card className="overflow-hidden border-border/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge className="bg-black/60 text-white backdrop-blur-sm">
              {PRODUCT_TYPE_LABELS[product.type]}
            </Badge>
            {product.verification_status === 'verified' && (
              <Badge className="bg-green-600 text-white flex items-center gap-1">
                <BadgeCheck className="h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-background/80 text-foreground backdrop-blur-sm">
              Demo
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <Badge variant="secondary" className="mb-1.5">
              {product.category}
            </Badge>
            <h3 className="font-playfair text-lg font-semibold text-white leading-tight line-clamp-2">
              {product.title}
            </h3>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {product.region}
            </span>
            {product.rating && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {product.rating.toFixed(1)}
                <span className="text-xs">({product.reviewCount})</span>
              </span>
            )}
          </div>
          {product.creator && (
            <p className="mt-1 text-sm text-muted-foreground">by {product.creator.name}</p>
          )}
          <p className="mt-2 font-semibold text-primary">
            ${product.price} {product.currency}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
