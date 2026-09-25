import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Experiences — Lost Legacy Digital',
  description: 'Cultural tours, workshops and experiences from Zimbabwean creators — coming soon.',
};

export default function ExperiencesPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
        <Sparkles className="h-8 w-8" />
      </div>
      <Badge variant="outline" className="mb-3">Coming soon</Badge>
      <h1 className="font-playfair text-3xl sm:text-4xl font-bold">Book cultural experiences</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Cultural tours, workshops, traditional cooking, pottery, dance and storytelling sessions
        from Zimbabwean creators — bookable directly here. A few sample experiences are already
        listed in the <a href="/marketplace?type=experience" className="text-primary underline">Marketplace</a>.
      </p>
    </div>
  );
}
