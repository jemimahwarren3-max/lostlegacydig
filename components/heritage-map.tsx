'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, X, ArrowRight, BadgeCheck, BookOpen, Users, Volume2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Place, Story } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MapMarker {
  place: Place;
  stories: Story[];
}

const categoryColors: Record<string, string> = {
  heritage: 'bg-primary',
  natural: 'bg-green-600',
  urban: 'bg-blue-600',
};

const categoryIcons: Record<string, typeof MapPin> = {
  heritage: BadgeCheck,
  natural: MapPin,
  urban: BookOpen,
};

export function HeritageMap({ markers }: { markers: MapMarker[] }) {
  const [selected, setSelected] = useState<MapMarker | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return markers;
    return markers.filter((m) => m.place.category === filter);
  }, [markers, filter]);

  // Zimbabwe bounds approximately: lat -15.6 to -22.4, lng 25.2 to 33.1
  // We'll map these to SVG coordinates (0-100 x, 0-100 y, inverted y)
  const toX = (lng: number) => ((lng - 25.2) / (33.1 - 25.2)) * 100;
  const toY = (lat: number) => ((-lat - 15.6) / (22.4 - 15.6)) * 100;

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] rounded-xl overflow-hidden border border-border bg-gradient-to-br from-savanna/40 to-secondary/60">
      {/* Background SVG outline of Zimbabwe */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Simplified Zimbabwe outline */}
        <defs>
          <pattern id="dots" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.3" fill="hsl(var(--muted-foreground) / 0.15)" />
          </pattern>
        </defs>
        <path
          d="M 5,8 L 25,5 L 50,3 L 75,5 L 92,10 L 95,25 L 90,40 L 85,55 L 80,70 L 70,82 L 55,88 L 40,85 L 25,78 L 15,65 L 8,45 L 3,25 Z"
          fill="url(#dots)"
          stroke="hsl(var(--earth))"
          strokeWidth="0.4"
          className="opacity-60"
        />
        {/* Province labels */}
        <text x="35" y="35" fontSize="2.5" fill="hsl(var(--muted-foreground) / 0.4)" className="font-sans">Mashonaland</text>
        <text x="60" y="55" fontSize="2.5" fill="hsl(var(--muted-foreground) / 0.4)" className="font-sans">Matabeleland</text>
        <text x="45" y="70" fontSize="2.5" fill="hsl(var(--muted-foreground) / 0.4)" className="font-sans">Masvingo</text>
        <text x="70" y="25" fontSize="2.5" fill="hsl(var(--muted-foreground) / 0.4)" className="font-sans">Manicaland</text>
      </svg>

      {/* Markers */}
      {filtered.map(({ place, stories }) => {
        const x = toX(place.longitude);
        const y = toY(place.latitude);
        const isSelected = selected?.place.id === place.id;
        return (
          <button
            key={place.id}
            onClick={() => setSelected({ place, stories })}
            className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-label={place.name}
          >
            <span
              className={cn(
                'block rounded-full border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-150',
                categoryColors[place.category] || 'bg-primary',
                isSelected && 'scale-150 ring-4 ring-accent/40'
              )}
              style={{ width: '14px', height: '14px' }}
            />
            {place.featured && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent ring-1 ring-white" />
            )}
            <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
              {place.name}
            </span>
          </button>
        );
      })}

      {/* Filter bar */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-20">
        {['all', 'heritage', 'natural', 'urban'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-all backdrop-blur',
              filter === cat
                ? 'bg-primary text-primary-foreground shadow'
                : 'bg-background/80 text-muted-foreground hover:text-foreground'
            )}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 bg-background/80 backdrop-blur rounded-lg p-3 z-20">
        <div className="text-xs font-semibold text-muted-foreground mb-1">Legend</div>
        {Object.entries(categoryColors).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-2 text-xs">
            <span className={cn('h-3 w-3 rounded-full border border-white', color)} />
            <span className="capitalize">{cat}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs mt-1">
          <span className="h-2 w-2 rounded-full bg-accent ring-1 ring-white" />
          <span>Featured</span>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background/95 backdrop-blur-md border-l border-border z-30 animate-slide-up overflow-y-auto">
          <div className="relative">
            {selected.place.image_url && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={selected.place.image_url}
                  alt={selected.place.name}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-3 right-3">
                  <Badge className={cn('mb-1.5', categoryColors[selected.place.category], 'text-white')}>
                    {selected.place.category}
                  </Badge>
                  <h3 className="font-playfair text-2xl font-bold text-white leading-tight">
                    {selected.place.name}
                  </h3>
                  {selected.place.province && (
                    <p className="text-sm text-white/80 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {selected.place.province}
                      {selected.place.district && `, ${selected.place.district}`}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selected.place.description}
            </p>

            {selected.place.historical_period && (
              <div>
                <span className="text-xs font-semibold text-muted-foreground">Historical Period</span>
                <p className="text-sm">{selected.place.historical_period}</p>
              </div>
            )}

            {selected.stories.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" /> Stories ({selected.stories.length})
                </h4>
                <div className="space-y-2">
                  {selected.stories.slice(0, 4).map((story) => (
                    <Link
                      key={story.id}
                      href={`/stories/${story.slug}`}
                      className="block rounded-lg border border-border/60 p-3 hover:border-primary/40 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        {story.content_type === 'oral_history' && <Volume2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />}
                        {story.content_type === 'music' && <Volume2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />}
                        {story.content_type === 'artwork' && <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />}
                        <div className="min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{story.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{story.summary}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link href={`/stories?place=${selected.place.slug}`}>
              <Button className="w-full" variant="outline">
                View all content for {selected.place.name} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Empty state hint */}
      {filtered.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-muted-foreground text-sm">No places in this category yet.</p>
        </div>
      )}
    </div>
  );
}
