// app/quiz/page.tsx
import Quiz from '@/components/Quiz';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/supabase/queries';

export default async function QuizPage() {
  const supabase = createClient();
  const user = await getUser(supabase);

  if (!user) {
    return redirect('/signin'); // Redirect to your sign-in page if no user is found
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Quiz</h1>
      <Quiz />
    </div>
  );
}
