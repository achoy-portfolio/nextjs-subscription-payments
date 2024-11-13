// components/Quiz.tsx
'use client';

// components/Quiz.tsx
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { QuizQuestion } from '@/types/quiz';

const Quiz = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('created_at');

      if (error) throw error;

      setQuestions(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Consider displaying an error message to the user in the UI
      alert('Failed to load quiz questions');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      // Consider displaying an error message in the UI
      alert('Please select an answer');
      return;
    }

    // Check if answer is correct
    if (selectedAnswer === questions[currentQuestionIndex].correct_answer) {
      setScore(score + 1);
      // Optionally provide feedback in the UI (e.g., change button color)
    } else {
      // Optionally provide feedback in the UI
    }

    // Move to next question or end quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-center">No questions available</div>;
  }

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-black rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl mb-4">
          Your score: {score} out of {questions.length}(
          {Math.round((score / questions.length) * 100)}%)
        </p>
        <button
          onClick={restartQuiz}
          className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-black rounded-lg shadow-lg">
      <div className="mb-4">
        <span className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-blue-500 rounded"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
            }}
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">
        {currentQuestion.question_text}
      </h2>

      <div className="space-y-3">
        {['A', 'B', 'C', 'D'].map((choice) => (
          <button
            key={choice}
            onClick={() => handleAnswerSelect(choice)}
            className={`w-full p-4 text-left rounded-lg border ${
              selectedAnswer === choice
                ? 'bg-blue-500 border-white-500'
                : 'hover:bg-blue-500'
            }`}
          >
            <span className="font-bold mr-2">{choice}.</span>
            {
              currentQuestion[
                `choice_${choice.toLowerCase()}` as keyof QuizQuestion
              ]
            }
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <span className="text-sm text-gray-500">
          Score: {score}/{currentQuestionIndex}
        </span>
        <button
          onClick={handleNextQuestion}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
