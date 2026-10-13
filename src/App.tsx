import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategorySelector } from './components/CategorySelector';
import { QuizCard } from './components/QuizCard';
import { ResultScreen } from './components/ResultScreen';
import { ReviewModal } from './components/ReviewModal';
import { StatsModal } from './components/StatsModal';
import { CustomQuizModal } from './components/CustomQuizModal';

import {
  GameMode,
  Difficulty,
  Question,
  CustomQuiz,
  GameSessionResult,
  AnswerRecord,
  UserStats,
} from './types';
import {
  CATEGORIES,
  getQuestionsForQuiz,
  getDailyQuestions,
} from './data/quizData';
import {
  getStoredStats,
  getCustomQuizzes,
  saveCustomQuiz,
  deleteCustomQuiz,
  recordGameSession,
} from './utils/storage';
import { sound } from './utils/sound';

export const App: React.FC = () => {
  // Navigation screen
  const [screen, setScreen] = useState<'home' | 'playing' | 'results'>('home');

  // Modals
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(sound.isEnabled());

  // Player stats
  const [stats, setStats] = useState<UserStats>(getStoredStats());
  const [customQuizzes, setCustomQuizzes] = useState<CustomQuiz[]>(getCustomQuizzes());

  // Configuration for next game
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');

  // Active game session state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [livesRemaining, setLivesRemaining] = useState(3);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [gameResult, setGameResult] = useState<GameSessionResult | null>(null);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<string[]>([]);

  // Lifelines state
  const [lifelines, setLifelines] = useState({
    fiftyFiftyUsed: false,
    hintUsed: false,
    skipUsed: false,
  });

  // Keep stats in sync
  const refreshStats = () => {
    setStats(getStoredStats());
    setCustomQuizzes(getCustomQuizzes());
  };

  const handleToggleSound = () => {
    const next = sound.toggleSound();
    setSoundEnabled(next);
  };

  // Start a regular quiz
  const handleStartQuiz = () => {
    let questions: Question[] = [];
    if (selectedMode === 'daily') {
      const daily = getDailyQuestions();
      questions = daily.questions;
    } else {
      const count = selectedMode === 'survival' ? 25 : 10;
      questions = getQuestionsForQuiz(
        selectedCategory,
        count,
        selectedDifficulty === 'all' ? undefined : selectedDifficulty
      );
    }

    startSession(questions, selectedCategory, selectedMode);
  };

  // Start a custom quiz
  const handlePlayCustomQuiz = (quiz: CustomQuiz) => {
    startSession(quiz.questions, quiz.category, 'classic', quiz.timePerQuestion);
  };

  const startSession = (
    questions: Question[],
    catId: string,
    mode: GameMode,
    customTimeLimit?: number
  ) => {
    setActiveQuestions(questions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setLivesRemaining(3);
    setAnswers([]);
    setLifelines({
      fiftyFiftyUsed: false,
      hintUsed: false,
      skipUsed: false,
    });
    setScreen('playing');
  };

  // Time limit per question depending on mode
  const getTimeLimitForMode = (): number => {
    if (selectedMode === 'blitz') return 15;
    if (selectedMode === 'survival') return 20;
    return 25; // Classic
  };

  // Lifeline handlers
  const handleUseFiftyFifty = () => {
    setLifelines(prev => ({ ...prev, fiftyFiftyUsed: true }));
  };

  const handleUseHint = () => {
    setLifelines(prev => ({ ...prev, hintUsed: true }));
  };

  const handleUseSkip = () => {
    setLifelines(prev => ({ ...prev, skipUsed: true }));
    advanceToNextQuestion(null, 0, false, true);
  };

  // Answer handler
  const handleAnswer = (selectedIdx: number, spentMs: number) => {
    const currentQ = activeQuestions[currentQuestionIndex];
    const isCorrect = selectedIdx === currentQ.correctAnswerIndex;

    advanceToNextQuestion(selectedIdx, spentMs, isCorrect, false);
  };

  const handleTimeExpired = () => {
    advanceToNextQuestion(null, getTimeLimitForMode() * 1000, false, false);
  };

  const advanceToNextQuestion = (
    selectedIdx: number | null,
    spentMs: number,
    isCorrect: boolean,
    isSkipped: boolean
  ) => {
    const currentQ = activeQuestions[currentQuestionIndex];

    // Record answer
    const newRecord: AnswerRecord = {
      questionId: currentQ.id,
      questionText: currentQ.question,
      options: currentQ.options,
      selectedOptionIndex: selectedIdx ?? -1,
      correctOptionIndex: currentQ.correctAnswerIndex,
      isCorrect,
      timeSpentMs: spentMs,
      explanation: currentQ.explanation,
    };
    const updatedAnswers = [...answers, newRecord];
    setAnswers(updatedAnswers);

    let nextStreak = currentStreak;
    let nextScore = score;
    let nextLives = livesRemaining;

    if (isSkipped) {
      // No streak change, no score change
    } else if (isCorrect) {
      nextStreak = currentStreak + 1;
      const speedBonus = Math.max(0, Math.floor((getTimeLimitForMode() * 1000 - spentMs) / 300));
      const comboMultiplier = nextStreak > 1 ? 1 + (nextStreak - 1) * 0.25 : 1;
      const points = Math.round((100 + speedBonus) * comboMultiplier);
      nextScore += points;
    } else {
      nextStreak = 0;
      if (selectedMode === 'survival') {
        nextLives -= 1;
      }
    }

    setCurrentStreak(nextStreak);
    setScore(nextScore);
    setLivesRemaining(nextLives);
    const newMaxStreak = Math.max(maxStreak, nextStreak);
    setMaxStreak(newMaxStreak);

    // Check if session ends:
    // 1. Survival mode with 0 lives
    // 2. Out of questions
    const isGameOver =
      (selectedMode === 'survival' && nextLives <= 0) ||
      currentQuestionIndex + 1 >= activeQuestions.length;

    if (isGameOver) {
      finishGame(updatedAnswers, nextScore, newMaxStreak);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const finishGame = (finalAnswers: AnswerRecord[], finalScore: number, finalMaxStreak: number) => {
    const correctCount = finalAnswers.filter(a => a.isCorrect).length;
    const cat = CATEGORIES.find(c => c.id === selectedCategory);

    const session: GameSessionResult = {
      categoryId: selectedCategory,
      categoryName: cat?.name || 'General Trivia',
      mode: selectedMode,
      totalQuestions: finalAnswers.length,
      correctAnswers: correctCount,
      score: finalScore,
      maxStreak: finalMaxStreak,
      answers: finalAnswers,
      completedAt: Date.now(),
    };

    setGameResult(session);
    const { newlyUnlocked } = recordGameSession(session);
    setNewlyUnlockedAchievements(newlyUnlocked);
    refreshStats();
    setScreen('results');
  };

  const handleSaveCustomQuiz = (quiz: CustomQuiz) => {
    saveCustomQuiz(quiz);
    refreshStats();
    handlePlayCustomQuiz(quiz);
  };

  const handleDeleteCustomQuiz = (id: string) => {
    deleteCustomQuiz(id);
    refreshStats();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenCreate={() => setIsCreateOpen(true)}
        onGoHome={() => setScreen('home')}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        dailyStreak={stats.dailyStreak}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {screen === 'home' && (
          <CategorySelector
            categories={CATEGORIES}
            customQuizzes={customQuizzes}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedMode={selectedMode}
            onSelectMode={setSelectedMode}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={setSelectedDifficulty}
            onStartQuiz={handleStartQuiz}
            onPlayCustomQuiz={handlePlayCustomQuiz}
            onDeleteCustomQuiz={handleDeleteCustomQuiz}
            dailyStreak={stats.dailyStreak}
            lastDailyPlayedDate={stats.lastDailyPlayedDate}
          />
        )}

        {screen === 'playing' && activeQuestions[currentQuestionIndex] && (
          <QuizCard
            question={activeQuestions[currentQuestionIndex]}
            questionIndex={currentQuestionIndex}
            totalQuestions={activeQuestions.length}
            mode={selectedMode}
            livesRemaining={livesRemaining}
            currentStreak={currentStreak}
            score={score}
            timeLimitSec={getTimeLimitForMode()}
            onAnswer={handleAnswer}
            onTimeExpired={handleTimeExpired}
            lifelines={lifelines}
            onUseFiftyFifty={handleUseFiftyFifty}
            onUseHint={handleUseHint}
            onUseSkip={handleUseSkip}
          />
        )}

        {screen === 'results' && gameResult && (
          <ResultScreen
            result={gameResult}
            onPlayAgain={handleStartQuiz}
            onGoHome={() => setScreen('home')}
            onReviewAnswers={() => setIsReviewOpen(true)}
            newAchievements={newlyUnlockedAchievements}
          />
        )}
      </main>

      {/* Review Modal */}
      {isReviewOpen && gameResult && (
        <ReviewModal
          answers={gameResult.answers}
          onClose={() => setIsReviewOpen(false)}
        />
      )}

      {/* Stats Modal */}
      {isStatsOpen && (
        <StatsModal
          stats={stats}
          onClose={() => setIsStatsOpen(false)}
        />
      )}

      {/* Custom Quiz Modal */}
      {isCreateOpen && (
        <CustomQuizModal
          onClose={() => setIsCreateOpen(false)}
          onSaveQuiz={handleSaveCustomQuiz}
        />
      )}

      {/* Subtle Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>QuickQuiz • 100+ Curated Questions across 10 Categories</p>
      </footer>
    </div>
  );
};

export default App;
