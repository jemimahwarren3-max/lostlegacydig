import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Story } from '@/lib/types';
import { CONTENT_TYPES, CATEGORIES } from '@/lib/types';

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/stories/${story.slug}`} className="group block">
      <Card className="overflow-hidden border-border/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {story.image_url && (
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            <Image
              src={story.image_url}
              alt={story.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className="bg-background/90 backdrop-blur text-foreground shadow-sm">
                {CONTENT_TYPES[story.content_type] || story.content_type}
              </Badge>
            </div>
            {story.verification_status === 'published' && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-600/90 text-white shadow-sm flex items-center gap-1">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </Badge>
              </div>
            )}
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Badge variant="secondary" className="text-xs">
              {CATEGORIES[story.category] || story.category}
            </Badge>
            {story.community && <span>{story.community}</span>}
          </div>
          <h3 className="font-playfair text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
            {story.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {story.summary}
          </p>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            {story.place && (
              <>
                <MapPin className="h-3 w-3" />
                {story.place.name}
              </>
            )}
          </span>
          {story.topics && story.topics.length > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {story.topics.slice(0, 2).join(', ')}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
