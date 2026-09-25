import { Building2, Handshake, Landmark, BadgeCheck, GraduationCap, Compass } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'For Organisations — Lost Legacy Digital',
  description: 'Commission creators, digitise heritage, sponsor preservation projects and license verified cultural content.',
};

const SERVICES = [
  { icon: Handshake, title: 'Commission', desc: 'Hire creators for cultural or creative work.' },
  { icon: Landmark, title: 'Preserve', desc: 'Digitise heritage material and archives.' },
  { icon: BadgeCheck, title: 'Sponsor', desc: 'Fund preservation projects across Zimbabwe.' },
  { icon: Compass, title: 'License', desc: 'Access verified cultural content for your use case.' },
  { icon: GraduationCap, title: 'Educate', desc: 'Deploy school and community learning resources.' },
  { icon: Building2, title: 'Discover', desc: 'Find creators and cultural experts to work with.' },
];

export default function OrganisationsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-3">For businesses, NGOs, universities &amp; institutions</Badge>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-balance">
          Bring your organisation closer to Zimbabwe's cultural economy
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Commission creators, digitise heritage, sponsor preservation projects, license verified
          content, or deploy educational resources — all through one platform.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.title} className="border-border/60">
              <CardContent className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm">{service.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{service.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button size="lg" disabled>
          Start an Organisation Project — coming soon
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Project requests aren't open yet. In the meantime, email hello@lostlegacydigital.com.
        </p>
      </div>
    </div>
  );
}
