import { MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Community — Lost Legacy Digital',
  description: 'Cultural discussions, community projects and creator announcements — coming soon.',
};

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
        <MessageCircle className="h-8 w-8" />
      </div>
      <Badge variant="outline" className="mb-3">Coming soon</Badge>
      <h1 className="font-playfair text-3xl sm:text-4xl font-bold">A place to discover and contribute</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Cultural discussions, events, community projects, heritage questions and creator
        announcements — built for discovery and contribution, not endless scrolling.
      </p>
    </div>
  );
}
