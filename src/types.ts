export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameMode = 'classic' | 'blitz' | 'survival' | 'daily';

export interface Question {
  id: string;
  category: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint?: string;
  codeSnippet?: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  questionCount: number;
}

export interface CustomQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  timePerQuestion: number;
  questions: Question[];
  createdAt: number;
}

export interface AnswerRecord {
  questionId: string;
  questionText: string;
  options: string[];
  selectedOptionIndex: number;
  correctOptionIndex: number;
  isCorrect: boolean;
  timeSpentMs: number;
  explanation: string;
}

export interface GameSessionResult {
  categoryId: string;
  categoryName: string;
  mode: GameMode;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  maxStreak: number;
  answers: AnswerRecord[];
  completedAt: number;
}

export interface UserStats {
  gamesPlayed: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  highScore: number;
  bestStreak: number;
  dailyStreak: number;
  lastDailyPlayedDate: string | null;
  categoryStats: Record<string, { played: number; correct: number }>;
  unlockedAchievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress?: { current: number; max: number };
}
