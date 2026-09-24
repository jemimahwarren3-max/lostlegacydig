import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, GraduationCap, BookOpen, Award, Target, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuizPlayer } from '@/components/quiz-player';
import { supabase } from '@/lib/supabase';
import { EducationalResource, Quiz, QuizQuestion, Story } from '@/lib/types';

export async function generateStaticParams() {
  const { data } = await supabase.from('educational_resources').select('slug');
  return (data || []).map((r) => ({ slug: r.slug }));
}

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const { data: resource } = await supabase
    .from('educational_resources')
    .select('*, story:stories(*)')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!resource) notFound();

  const res = resource as EducationalResource;

  const { data: quizData } = await supabase
    .from('quizzes')
    .select('*, quiz_questions(*)')
    .eq('resource_id', res.id)
    .maybeSingle();

  const quiz = quizData as (Quiz & { quiz_questions: QuizQuestion[] }) | null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/learn" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to lessons
      </Link>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge variant="secondary">{res.grade}</Badge>
        <Badge variant="outline">{res.subject}</Badge>
        <Badge variant="outline" className="capitalize">{res.resource_type.replace('_', ' ')}</Badge>
        <Badge variant="outline" className="capitalize">{res.difficulty}</Badge>
      </div>

      <h1 className="font-playfair text-3xl sm:text-4xl font-bold leading-tight text-balance">{res.title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{res.description}</p>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
        {res.estimated_duration && (
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {res.estimated_duration}</span>
        )}
        <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4" /> {res.grade}</span>
        {res.topic && (
          <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {res.topic}</span>
        )}
      </div>

      {res.image_url && (
        <div className="relative mt-6 aspect-[16/9] rounded-xl overflow-hidden bg-muted">
          <Image src={res.image_url} alt={res.title} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" priority />
        </div>
      )}

      {/* Learning outcomes */}
      {res.learning_outcomes && (
        <Card className="mt-8 border-border/60 bg-secondary/30">
          <CardContent className="p-5">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" /> Learning Outcomes
            </h3>
            <div className="prose-content text-sm">
              {res.learning_outcomes.split('\n').map((line, i) => (
                line.trim() && <p key={i}>{line}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {res.content && (
        <div className="mt-8 prose-content max-w-none">
          {res.content.split('\n').map((line, i) => {
            if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
            if (line.startsWith('• ')) return <li key={i}>{line.replace('• ', '')}</li>;
            if (line.trim() === '') return <div key={i} className="h-4" />;
            return <p key={i}>{line}</p>;
          })}
        </div>
      )}

      {/* Curriculum objective */}
      {res.curriculum_objective && (
        <Card className="mt-8 border-border/60">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-2">Curriculum Objective</h3>
            <p className="text-sm text-muted-foreground">{res.curriculum_objective}</p>
          </CardContent>
        </Card>
      )}

      {/* Related story */}
      {res.story && (
        <Card className="mt-8 border-border/60 bg-primary/5">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> This lesson is based on a real story
            </h3>
            <Link href={`/stories/${res.story.slug}`} className="block group">
              <p className="font-playfair text-lg font-semibold group-hover:text-primary transition-colors">{res.story.title}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{res.story.summary}</p>
              <span className="text-sm text-primary font-medium mt-2 inline-block">Read the full story →</span>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quiz */}
      {quiz && quiz.quiz_questions && quiz.quiz_questions.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-6 w-6 text-primary" />
            <h2 className="font-playfair text-2xl font-bold">Test your knowledge</h2>
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            {quiz.quiz_questions.length} questions • Pass mark: {quiz.passing_score}%
          </p>
          <QuizPlayer quiz={quiz} questions={quiz.quiz_questions.sort((a, b) => a.sort_order - b.sort_order)} />
        </div>
      )}
    </div>
  );
}
