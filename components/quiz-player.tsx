'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuizQuestion } from '@/lib/types';
import { cn } from '@/lib/utils';

export function QuizPlayer({ quiz, questions }: { quiz: { id: string; title: string; passing_score: number }; questions: QuizQuestion[] }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const question = questions[current];
  const isLast = current === questions.length - 1;

  const handleSelect = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    setAnswers({ ...answers, [question.id]: option });
  };

  const handleNext = () => {
    if (isLast) {
      setShowResult(true);
    } else {
      setCurrent(current + 1);
      setSelectedAnswer(null);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setAnswers({});
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (showResult) {
    const correct = questions.filter((q) => answers[q.id] === q.correct_answer).length;
    const percentage = Math.round((correct / questions.length) * 100);
    const passed = percentage >= quiz.passing_score;

    return (
      <Card className="border-border/60">
        <CardContent className="p-8 text-center">
          <div className={cn(
            'mx-auto flex h-20 w-20 items-center justify-center rounded-full mb-4',
            passed ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
          )}>
            <Trophy className="h-10 w-10" />
          </div>
          <h3 className="font-playfair text-2xl font-bold">
            {passed ? 'Well done!' : 'Keep practicing!'}
          </h3>
          <p className="mt-2 text-muted-foreground">
            You scored {correct} out of {questions.length} ({percentage}%)
          </p>
          <p className="mt-1 text-sm">
            {passed
              ? `You passed! You earned a badge: ${quiz.title} Champion`
              : `You need ${quiz.passing_score}% to pass. Try again!`}
          </p>

          <div className="mt-6 space-y-2 text-left max-h-60 overflow-y-auto">
            {questions.map((q, i) => (
              <div key={q.id} className={cn(
                'flex items-start gap-2 rounded-lg p-3 text-sm',
                answers[q.id] === q.correct_answer ? 'bg-green-50' : 'bg-red-50'
              )}>
                {answers[q.id] === q.correct_answer ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-medium">Q{i + 1}:</span> {q.question}
                  {answers[q.id] !== q.correct_answer && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Correct answer: {q.correct_answer === 'A' ? q.option_a : q.correct_answer === 'B' ? q.option_b : q.correct_answer === 'C' ? q.option_c : q.option_d}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3 justify-center">
            <Button onClick={handleRestart} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" /> Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const options = [
    { key: 'A', text: question.option_a },
    { key: 'B', text: question.option_b },
    { key: 'C', text: question.option_c },
    { key: 'D', text: question.option_d },
  ];

  return (
    <Card className="border-border/60">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary">Question {current + 1} of {questions.length}</Badge>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 w-6 rounded-full',
                  i < current ? 'bg-primary' : i === current ? 'bg-accent' : 'bg-muted'
                )}
              />
            ))}
          </div>
        </div>

        <h3 className="font-playfair text-xl font-semibold mb-6">{question.question}</h3>

        <div className="space-y-3">
          {options.map((opt) => {
            const isSelected = selectedAnswer === opt.key;
            const isCorrect = opt.key === question.correct_answer;
            const showFeedback = selectedAnswer !== null;

            return (
              <button
                key={opt.key}
                onClick={() => handleSelect(opt.key)}
                disabled={showFeedback}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left text-sm transition-all',
                  !showFeedback && 'border-border hover:border-primary/40 hover:bg-secondary/40',
                  showFeedback && isCorrect && 'border-green-500 bg-green-50',
                  showFeedback && isSelected && !isCorrect && 'border-red-500 bg-red-50',
                  showFeedback && !isCorrect && !isSelected && 'border-border opacity-60'
                )}
              >
                <span className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  !showFeedback && 'bg-muted text-muted-foreground',
                  showFeedback && isCorrect && 'bg-green-600 text-white',
                  showFeedback && isSelected && !isCorrect && 'bg-red-600 text-white',
                  showFeedback && !isCorrect && !isSelected && 'bg-muted text-muted-foreground'
                )}>
                  {opt.key}
                </span>
                <span className="flex-1">{opt.text}</span>
                {showFeedback && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                {showFeedback && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div className="mt-4 animate-fade-in">
            {question.explanation && (
              <p className="text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3 mb-4">
                {question.explanation}
              </p>
            )}
            <Button onClick={handleNext} className="w-full">
              {isLast ? 'See results' : 'Next question'} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
