import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collection } from '@/lib/types';

export function CollectionCard({ collection }: { collection: Collection }) {
  const itemCount = collection.collection_items?.length || 0;

  return (
    <Link href={`/collections/${collection.slug}`} className="group block">
      <Card className="overflow-hidden border-border/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          {collection.image_url ? (
            <Image
              src={collection.image_url}
              alt={collection.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-secondary">
              <span className="font-playfair text-2xl text-muted-foreground">
                {collection.name}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge className="mb-2 bg-accent/90 text-accent-foreground">
              {collection.category}
            </Badge>
            <h3 className="font-playfair text-xl font-bold text-white leading-tight">
              {collection.name}
            </h3>
            {itemCount > 0 && (
              <p className="text-xs text-white/80 mt-1">{itemCount} items</p>
            )}
          </div>
        </div>
        {collection.description && (
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {collection.description}
            </p>
            <div className="mt-3 flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Explore collection <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
