import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Creator } from '@/lib/types';

export function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <Link href={`/creators/${creator.slug}`} className="group block">
      <Card className="overflow-hidden border-border/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {creator.image_url ? (
            <Image
              src={creator.image_url}
              alt={creator.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-secondary">
              <span className="font-playfair text-3xl font-bold text-muted-foreground">
                {creator.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <Badge className="mb-1.5 bg-primary/90 text-primary-foreground">
              {creator.category}
            </Badge>
            <h3 className="font-playfair text-lg font-semibold text-white leading-tight">
              {creator.name}
            </h3>
            {creator.province && (
              <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" /> {creator.province}
              </p>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{creator.bio}</p>
          {creator.skills && creator.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {creator.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
