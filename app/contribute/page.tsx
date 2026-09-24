'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PenTool, CheckCircle2, Sparkles, BadgeCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';

const CONTENT_TYPES = [
  { value: 'story', label: 'Story' },
  { value: 'oral_history', label: 'Oral History / Interview' },
  { value: 'artwork', label: 'Artwork' },
  { value: 'music', label: 'Music' },
  { value: 'craft', label: 'Craft' },
  { value: 'photo', label: 'Photograph' },
  { value: 'event', label: 'Event' },
  { value: 'tradition', label: 'Tradition / Practice' },
];

const PROVINCES = [
  'Harare', 'Bulawayo', 'Manicaland', 'Mashonaland Central', 'Mashonaland East',
  'Mashonaland West', 'Masvingo', 'Matabeleland North', 'Matabeleland South', 'Midlands',
];

export default function ContributePage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content_type: 'story',
    description: '',
    contributor_name: '',
    contributor_email: '',
    community: '',
    language: '',
    province: '',
    place_name: '',
    consent_given: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent_given) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('submissions').insert({
        title: form.title,
        content_type: form.content_type,
        description: form.description,
        contributor_name: form.contributor_name,
        contributor_email: form.contributor_email,
        community: form.community,
        language: form.language,
        province: form.province,
        place_name: form.place_name,
        consent_given: form.consent_given,
        status: 'submitted',
      });

      if (error) throw error;

      // Create initial verification record
      const { data: sub } = await supabase
        .from('submissions')
        .select('id')
        .eq('title', form.title)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sub) {
        await supabase.from('verification_records').insert({
          submission_id: sub.id,
          stage: 'submitted',
          notes: 'Submission received from community contributor.',
          status: 'completed',
        });
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="font-playfair text-3xl font-bold">Thank you for contributing!</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Your submission has been received and will go through our verification process:
          AI processing, researcher review, and community verification. You can track its
          progress in the admin dashboard.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => router.push('/admin')}>
            View in admin dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ title: '', content_type: 'story', description: '', contributor_name: '', contributor_email: '', community: '', language: '', province: '', place_name: '', consent_given: false }); }}>
            Submit another story
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <PenTool className="h-6 w-6 text-primary" />
          <Badge className="bg-accent/15 text-accent-foreground">Community Contribution</Badge>
        </div>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold">Share Your Knowledge</h1>
        <p className="mt-2 text-muted-foreground">
          Every community has stories worth preserving. Share oral histories, photographs, artwork,
          music, or traditional knowledge. Your contribution will go through a respectful verification process.
        </p>
      </div>

      {/* Workflow preview */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        {[
          { icon: PenTool, label: 'You submit', desc: 'Upload your story' },
          { icon: Sparkles, label: 'AI assists', desc: 'Transcription & categorization' },
          { icon: BadgeCheck, label: 'Community verifies', desc: 'Review & publish' },
        ].map((step, i) => {
          const Icon = step.icon;
          return (
            <Card key={i} className="border-border/60">
              <CardContent className="p-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold">{step.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Tell us about your contribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. The Sacred Baobab of Chiredzi"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="content_type">What are you contributing? *</Label>
              <Select value={form.content_type} onValueChange={(v) => setForm({ ...form, content_type: v })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the story, knowledge, or content you are sharing..."
                className="mt-1.5 min-h-[120px]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contributor_name">Your name *</Label>
                <Input
                  id="contributor_name"
                  required
                  value={form.contributor_name}
                  onChange={(e) => setForm({ ...form, contributor_name: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="contributor_email">Email (optional)</Label>
                <Input
                  id="contributor_email"
                  type="email"
                  value={form.contributor_email}
                  onChange={(e) => setForm({ ...form, contributor_email: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="community">Community</Label>
                <Input
                  id="community"
                  value={form.community}
                  onChange={(e) => setForm({ ...form, community: e.target.value })}
                  placeholder="e.g. Shona, Ndebele, Tonga"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  placeholder="e.g. chiShona, isiNdebele, English"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="province">Province</Label>
                <Select value={form.province} onValueChange={(v) => setForm({ ...form, province: v })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="place_name">Place name</Label>
                <Input
                  id="place_name"
                  value={form.place_name}
                  onChange={(e) => setForm({ ...form, place_name: e.target.value })}
                  placeholder="e.g. Chiredzi, Bikita"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="rounded-lg bg-secondary/50 p-4 space-y-3">
              <Label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={form.consent_given}
                  onCheckedChange={(c) => setForm({ ...form, consent_given: c === true })}
                />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  I confirm that I have the right to share this knowledge, and I consent to it being
                  reviewed and potentially published on the Kumbwata platform. I understand that AI
                  may assist with transcription and categorization, but that community verification
                  is required before publication.
                </span>
              </Label>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={!form.consent_given || loading}>
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>
              ) : (
                <>Submit contribution <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
