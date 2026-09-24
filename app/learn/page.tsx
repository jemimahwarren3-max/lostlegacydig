import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, GraduationCap, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { EducationalResource } from '@/lib/types';

export const metadata = {
  title: 'Learn — Kumbwata',
  description: 'Curriculum-aligned lessons and educational resources about Zimbabwean heritage.',
};

const SUBJECTS = [
  'Heritage Studies', 'History', 'Geography', 'Agriculture',
  'Environmental Science', 'Social Studies', 'Languages', 'Art', 'Music', 'Entrepreneurship',
];

const GRADES = ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'];

export default async function LearnPage({
  searchParams,
}: {
  searchParams: { subject?: string; grade?: string };
}) {
  let query = supabase
    .from('educational_resources')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (searchParams.subject) {
    query = query.eq('subject', searchParams.subject);
  }
  if (searchParams.grade) {
    query = query.eq('grade', searchParams.grade);
  }

  const { data: resources } = await query;
  const resourceList = (resources as EducationalResource[]) || [];

  const subjectCounts: Record<string, number> = {};
  resourceList.forEach((r) => {
    subjectCounts[r.subject] = (subjectCounts[r.subject] || 0) + 1;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <Badge className="bg-accent/15 text-accent-foreground">For Schools & Learners</Badge>
        </div>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold">Learn Zimbabwe</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Curriculum-aligned lessons, revision notes, and quizzes — powered by the same knowledge
          that fills our heritage map. Every lesson connects to real stories from communities.
        </p>
      </div>

      {/* Subject filters */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Subjects</h3>
        <div className="flex flex-wrap gap-2">
          <Link href="/learn">
            <Button variant={!searchParams.subject ? 'default' : 'outline'} size="sm">
              All
            </Button>
          </Link>
          {SUBJECTS.filter((s) => subjectCounts[s]).map((subject) => (
            <Link key={subject} href={`/learn?subject=${encodeURIComponent(subject)}`}>
              <Button variant={searchParams.subject === subject ? 'default' : 'outline'} size="sm">
                {subject} ({subjectCounts[subject]})
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Grade filters */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Grade</h3>
        <div className="flex flex-wrap gap-2">
          <Link href="/learn">
            <Button variant={!searchParams.grade ? 'default' : 'outline'} size="sm">
              All grades
            </Button>
          </Link>
          {GRADES.map((grade) => (
            <Link key={grade} href={`/learn?grade=${encodeURIComponent(grade)}`}>
              <Button variant={searchParams.grade === grade ? 'default' : 'outline'} size="sm">
                {grade}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Resources */}
      {resourceList.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No resources found for these filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resourceList.map((res) => (
            <Link key={res.id} href={`/learn/${res.slug}`}>
              <Card className="overflow-hidden h-full border-border/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {res.image_url && (
                  <div className="relative aspect-[16/10] bg-muted">
                    <Image
                      src={res.image_url}
                      alt={res.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary/90 text-primary-foreground">{res.grade}</Badge>
                    </div>
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{res.subject}</Badge>
                    <Badge variant="secondary" className="text-xs capitalize">{res.resource_type.replace('_', ' ')}</Badge>
                  </div>
                  <h3 className="font-playfair text-lg font-semibold leading-snug">{res.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{res.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    {res.estimated_duration && (
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {res.estimated_duration}</span>
                    )}
                    <span className="flex items-center gap-1 text-primary font-medium">
                      Start <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
