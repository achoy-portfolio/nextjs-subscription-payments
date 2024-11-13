// types/quiz.ts
export type QuizQuestion = {
  id: string;
  question_text: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
};
