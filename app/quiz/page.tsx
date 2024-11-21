// app/quiz/page.tsx

/**
 * Importing the Quiz component from the components directory.
 */
import Quiz from '@/components/Quiz';

/**
 * Importing the redirect function from the next/navigation module to redirect users if needed.
 */
import { redirect } from 'next/navigation';

/**
 * Importing the createClient function from the supabase/utils/server module to create a Supabase client instance.
 */
import { createClient } from '@/utils/supabase/server';

/**
 * Importing the getUser function from the supabase/utils/queries module to retrieve user data from Supabase.
 */
import { getUser } from '@/utils/supabase/queries';

/**
 * Defining an async function, QuizPage(), which represents a React page component for rendering quiz content.
 */
export default async function QuizPage() {
  /**
   * Creating a new instance of the Supabase client using the createClient function.
   */
  const supabase = createClient();

  /**
   * Retrieving user data from Supabase using the getUser function and awaiting its response to prevent asynchronous code execution.
   */
  const user = await getUser(supabase);

  /**
   * Checking if a user is not found in the retrieved user data. If true, redirecting users to the sign-in page using the redirect function.
   */
  if (!user) {
    return redirect('/signin'); // Redirect to your sign-in page if no user is found
  }

  /**
   * Returning JSX content for rendering a container with quiz title and the Quiz component.
   */
  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold text-center mb-8">Quiz</h1>
      <Quiz />
    </div>
  );
}
