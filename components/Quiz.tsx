'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { QuizQuestion } from '@/types/quiz';

// Main Quiz component that handles the quiz logic and UI
const Quiz = () => {
  // State Management
  const [questions, setQuestions] = useState<QuizQuestion[]>([]); // Stores all quiz questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Tracks current question
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); // Currently selected answer
  const [score, setScore] = useState(0); // User's current score
  const [isLoading, setIsLoading] = useState(true); // Loading state for data fetching
  const [showResults, setShowResults] = useState(false); // Controls results screen visibility
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Tracks if current answer is correct
  const [attemptedQuestions, setAttemptedQuestions] = useState<number[]>([]); // Keeps track of attempted questions
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]); // Stores all selected answers
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]); // Tracks flagged questions for review

  // Initialize Supabase client
  const supabase = createClient();

  // Fetch questions when component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Function to fetch and randomize questions from Supabase
  const fetchQuestions = async () => {
    try {
      // Fetch questions from the database
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('created_at');

      if (error) {
        console.error('Error fetching questions:', error);
        setIsLoading(false);
        return;
      }

      if (data) {
        // Randomize answer choices for each question
        const randomizedQuestions = data.map((question) => {
          const choices = [
            question.choice_a,
            question.choice_b,
            question.choice_c,
            question.choice_d
          ];

          // Fisher-Yates shuffle algorithm for randomizing answer choices
          for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
          }

          return {
            ...question,
            choice_a: choices[0],
            choice_b: choices[1],
            choice_c: choices[2],
            choice_d: choices[3],
            // Track correct answer's new position after shuffling
            correct_answer_index: choices.findIndex(
              (choice) => choice === question.correct_answer
            )
          };
        });

        setQuestions(randomizedQuestions);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setIsLoading(false);
      alert('Failed to load quiz questions');
    }
  };

  // Handle answer selection and tracking
  const handleAnswerSelect = (answer: string) => {
    // Update selected answers array
    setSelectedAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = answer;
      return newAnswers;
    });

    // Update attempted questions tracking
    if (answer === null) {
      // Remove from attempted if deselecting
      setAttemptedQuestions((prevAttempts) =>
        prevAttempts.filter((item) => item !== currentQuestionIndex)
      );
    } else if (!attemptedQuestions.includes(currentQuestionIndex)) {
      setAttemptedQuestions([...attemptedQuestions, currentQuestionIndex]);
    }

    setSelectedAnswer(answer);
    setIsCorrect(null); // Reset correct/incorrect feedback
  };

  // Verify if selected answer is correct
  const handleCheckAnswer = () => {
    const correctAnswerChoice = ['A', 'B', 'C', 'D'][
      currentQuestion.correct_answer_index
    ];
    setIsCorrect(correctAnswerChoice === selectedAnswer);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  // Navigate to next question or show results
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Load previously selected answer if it exists
      setSelectedAnswer(selectedAnswers[currentQuestionIndex + 1] || null);
      setIsCorrect(null);
    } else {
      setShowResults(true); // Show final results if all questions completed
    }
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Load previously selected answer if it exists
      setSelectedAnswer(selectedAnswers[currentQuestionIndex - 1] || null);
      setIsCorrect(null);
    }
  };

  // Toggle flag status for review later
  const handleFlagQuestion = (index: number) => {
    setFlaggedQuestions((prevFlags) => {
      if (prevFlags.includes(index)) {
        return prevFlags.filter((item) => item !== index);
      } else {
        return [...prevFlags, index];
      }
    });
  };

  // Reset quiz state for restart
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
    setIsCorrect(null);
    setAttemptedQuestions([]);
    setSelectedAnswers([]);
    setFlaggedQuestions([]);
  };

  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  // No questions available UI
  if (questions.length === 0) {
    return <div className="text-center">No questions available</div>;
  }

  // Results screen UI
  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl mb-4">
          Your score: {score} out of {questions.length} (
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

  // Main quiz UI
  return (
    <div className="flex">
      {/* Question Navigation Sidebar */}
      <div className="w-24 mr-4">
        <div className="flex flex-col space-y-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentQuestionIndex(index);
                setSelectedAnswer(selectedAnswers[index] || null);
                setIsCorrect(null);
              }}
              className={`p-2 text-sm rounded-l-lg transition-all hover:scale-110 hover:bg-blue-200 ${
                // Dynamic classes based on question state
                currentQuestionIndex === index ? 'bg-blue-500' : ''
              } ${
                index < currentQuestionIndex
                  ? 'text-white font-bold'
                  : 'text-white font-bold'
              } ${
                currentQuestionIndex !== index &&
                attemptedQuestions.includes(index) &&
                selectedAnswers[index]
                  ? 'bg-gray-400'
                  : ''
              } ${
                currentQuestionIndex !== index &&
                !attemptedQuestions.includes(index)
                  ? 'bg-green-700'
                  : ''
              } ${flaggedQuestions.includes(index) ? 'bg-red-500' : ''}`}
            >
              <span
                className={`${
                  attemptedQuestions.includes(index) && selectedAnswers[index]
                    ? 'text-white font-bold'
                    : ''
                }`}
              >
                Q{index + 1}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Question and Answer Area */}
      <div className="max-w-2xl flex-1 p-6 bg-white rounded-lg shadow-lg">
        {/* Progress Bar */}
        <div className="mb-4">
          <span className="text-sm text-zinc-600">
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

        {/* Question Text */}
        <h2 className="text-xl text-black font-bold mb-4">
          {currentQuestion.question_text}
        </h2>

        {/* Answer Choices */}
        <div className="space-y-3">
          {['A', 'B', 'C', 'D'].map((choice) => (
            <button
              key={choice}
              onClick={() => {
                if (selectedAnswer === choice) {
                  handleAnswerSelect(null);
                  setAttemptedQuestions((prevAttempts) =>
                    prevAttempts.filter((item) => item !== currentQuestionIndex)
                  );
                } else {
                  handleAnswerSelect(choice);
                }
              }}
              className={`w-full p-4 text-left rounded-lg border ${
                selectedAnswer === choice
                  ? 'bg-yellow-500 border-white-500'
                  : 'hover:border-yellow-500 border-8'
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

        {/* Answer Feedback */}
        {isCorrect !== null && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {isCorrect ? 'Correct!' : 'Incorrect. Try again.'}
          </div>
        )}

        {/* Navigation and Control Buttons */}
        <div className="mt-6 flex justify-between items-center">
          <span className="text-sm text-white">
            Score: {score}/{currentQuestionIndex + 1}
          </span>
          <div className="flex space-x-5">
            {selectedAnswer && (
              <button
                onClick={handleCheckAnswer}
                className="bg-yellow-500 text-white font-bold px-4 py-2 rounded hover:bg-yellow-600"
              >
                Check Answer
              </button>
            )}
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePreviousQuestion}
                className="bg-green-600 text-white font-bold px-4 py-2 rounded hover:bg-green-800"
              >
                {'< Back'}
              </button>
            )}
            <button
              onClick={() => handleFlagQuestion(currentQuestionIndex)}
              className={`bg-red-600 text-white font-bold px-4 py-2 rounded hover:bg-red-800 ${
                flaggedQuestions.includes(currentQuestionIndex)
                  ? 'bg-gray-600'
                  : ''
              }`}
            >
              {flaggedQuestions.includes(currentQuestionIndex)
                ? 'Flagged'
                : 'Flag'}
            </button>
            <button
              onClick={handleNextQuestion}
              className="bg-green-600 text-white font-bold px-4 py-2 rounded hover:bg-green-800"
            >
              {currentQuestionIndex === questions.length - 1
                ? 'Finish'
                : 'Next >'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
