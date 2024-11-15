'use client';

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
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attemptedQuestions, setAttemptedQuestions] = useState<number[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);

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

      if (error) {
        console.error('Error fetching questions:', error);
        setIsLoading(false);
        return;
      }

      setQuestions(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setIsLoading(false);
      alert('Failed to load quiz questions');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = answer;
      return newAnswers;
    });

    if (answer === null) {
      // Remove attempt if deselecting
      setAttemptedQuestions((prevAttempts) =>
        prevAttempts.filter((item) => item !== currentQuestionIndex)
      );
    } else if (!attemptedQuestions.includes(currentQuestionIndex)) {
      setAttemptedQuestions([...attemptedQuestions, currentQuestionIndex]);
    }

    setSelectedAnswer(answer);
    setIsCorrect(null);
  };

  const handleCheckAnswer = () => {
    setIsCorrect(currentQuestion.correct_answer === selectedAnswer);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(selectedAnswers[currentQuestionIndex + 1] || null); // Set saved answer for the next question
      setIsCorrect(null);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(selectedAnswers[currentQuestionIndex - 1] || null); // Set saved answer for the previous question
      setIsCorrect(null);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
    setIsCorrect(null);
    setAttemptedQuestions([]);
    setSelectedAnswers([]);
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
          Your score: {score} out of {questions.length} (
          {Math.round((score / questions.length) * 100)}%)
        </p>
        <button
          onClick={restartQuiz}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex">
      {/* Question Navigation */}
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
              className={`
                                p-2 text-sm rounded-l-lg border-r-4
                                transition-all hover:w-20
                                ${currentQuestionIndex === index ? 'bg-blue-500 border-white' : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}
                                ${index < currentQuestionIndex ? 'text-gray-400' : 'text-white'}
                                ${attemptedQuestions.includes(index) && selectedAnswers[index] ? 'bg-gray-400' : 'bg-green-700'}
                            `}
            >
              <span
                className={`${attemptedQuestions.includes(index) && selectedAnswers[index] ? 'text-black font-bold' : ''}`}
              >
                Q{index + 1}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Question and Answers */}
      <div className="max-w-2xl flex-1 p-6 bg-black rounded-lg shadow-lg">
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
              onClick={() => {
                if (selectedAnswer === choice) {
                  handleAnswerSelect(null);

                  // Remove attempt if de-selecting
                  setAttemptedQuestions((prevAttempts) =>
                    prevAttempts.filter((item) => item !== currentQuestionIndex)
                  );
                } else {
                  handleAnswerSelect(choice);
                }
              }}
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

        {/* Feedback Message */}
        {isCorrect !== null && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {isCorrect ? 'Correct!' : 'Incorrect. Try again.'}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between items-center">
          {' '}
          <span className="text-sm text-gray-500">
            Score: {score}/{currentQuestionIndex + 1}
          </span>
          <div className="flex space-x-5">
            {selectedAnswer && (
              <button
                onClick={handleCheckAnswer}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Check Answer
              </button>
            )}
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePreviousQuestion}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                {'< Back'}
              </button>
            )}
            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
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
