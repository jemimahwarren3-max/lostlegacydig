'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Compass, ShoppingBag, GraduationCap, Landmark, Sparkles, Users, MessageCircle, Building2, Search, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Discover', icon: Compass },
  { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { href: '/learn', label: 'Learn', icon: GraduationCap },
  { href: '/map', label: 'Heritage', icon: Landmark },
  { href: '/experiences', label: 'Experiences', icon: Sparkles },
  { href: '/creators', label: 'Creators', icon: Users },
  { href: '/community', label: 'Community', icon: MessageCircle },
  { href: '/organisations', label: 'For Organisations', icon: Building2 },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-playfair text-lg font-bold">L</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-playfair text-lg font-bold tracking-tight">Lost Legacy Digital</span>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                  active
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" aria-label="Search" className="hidden sm:inline-flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart" className="hidden sm:inline-flex relative">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Profile" className="hidden sm:inline-flex">
            <User className="h-5 w-5" />
          </Button>
          <Link href="/creators" className="hidden sm:block">
            <Button size="sm">Start Creating</Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="xl:hidden border-t border-border bg-background animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="flex gap-2 pt-3">
              <Button variant="outline" size="sm" className="flex-1">
                <Search className="h-4 w-4 mr-1.5" /> Search
              </Button>
              <Link href="/creators" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button size="sm" className="w-full">Start Creating</Button>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
