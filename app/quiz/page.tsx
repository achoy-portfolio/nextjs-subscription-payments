// app/quiz/page.tsx
import Quiz from '@/components/Quiz';

export default function QuizPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Quiz</h1>
      <Quiz />
    </div>
  );
}
