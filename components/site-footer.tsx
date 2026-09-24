import Link from 'next/link';
import { MapPin, Mail, Heart } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-bold">K</span>
              </div>
              <span className="font-playfair text-lg font-bold">Kumbwata</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Zimbabwe's living story, preserved by its people. A platform for heritage, education, and community knowledge.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/map" className="hover:text-foreground transition-colors">Heritage Map</Link></li>
              <li><Link href="/stories" className="hover:text-foreground transition-colors">Stories</Link></li>
              <li><Link href="/collections" className="hover:text-foreground transition-colors">Collections</Link></li>
              <li><Link href="/creators" className="hover:text-foreground transition-colors">Creators</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Learn</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/learn" className="hover:text-foreground transition-colors">Subjects</Link></li>
              <li><Link href="/learn" className="hover:text-foreground transition-colors">Lessons</Link></li>
              <li><Link href="/schools" className="hover:text-foreground transition-colors">For Schools</Link></li>
              <li><Link href="/contribute" className="hover:text-foreground transition-colors">Contribute</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/admin" className="hover:text-foreground transition-colors">Admin Dashboard</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">My Dashboard</Link></li>
              <li><Link href="/search" className="hover:text-foreground transition-colors">Search</Link></li>
              <li><span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> hello@kumbwata.zw</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Kumbwata. A living record of Zimbabwe.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-primary" /> for Zimbabwean communities
          </p>
        </div>
      </div>
    </footer>
  );
}
