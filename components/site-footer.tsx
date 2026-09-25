import Link from 'next/link';
import { Mail, Heart } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-bold">L</span>
              </div>
              <span className="font-playfair text-lg font-bold">Lost Legacy Digital</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Zimbabwe's cultural knowledge, creativity and stories, brought to life. Discover it, learn from it, buy it, preserve it.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Discover</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link></li>
              <li><Link href="/map" className="hover:text-foreground transition-colors">Heritage Map</Link></li>
              <li><Link href="/experiences" className="hover:text-foreground transition-colors">Experiences</Link></li>
              <li><Link href="/creators" className="hover:text-foreground transition-colors">Creators</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Learn</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/learn" className="hover:text-foreground transition-colors">Subjects</Link></li>
              <li><Link href="/community" className="hover:text-foreground transition-colors">Community</Link></li>
              <li><Link href="/contribute" className="hover:text-foreground transition-colors">Contribute a Story</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/organisations" className="hover:text-foreground transition-colors">For Organisations</Link></li>
              <li><Link href="/creators" className="hover:text-foreground transition-colors">Start Creating</Link></li>
              <li><span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> hello@lostlegacydigital.com</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Lost Legacy Digital. A living marketplace for Zimbabwean culture.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-primary" /> for Zimbabwean creators and communities
          </p>
        </div>
      </div>
    </footer>
  );
}
