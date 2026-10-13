import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Flame,
  HelpCircle,
  Lightbulb,
  SkipForward,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Question, GameMode } from '../types';
import { sound } from '../utils/sound';

interface QuizCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  mode: GameMode;
  livesRemaining: number;
  currentStreak: number;
  score: number;
  timeLimitSec: number;
  onAnswer: (selectedOptionIndex: number, timeSpentMs: number) => void;
  onTimeExpired: () => void;
  lifelines: {
    fiftyFiftyUsed: boolean;
    hintUsed: boolean;
    skipUsed: boolean;
  };
  onUseFiftyFifty: () => void;
  onUseHint: () => void;
  onUseSkip: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  mode,
  livesRemaining,
  currentStreak,
  score,
  timeLimitSec,
  onAnswer,
  onTimeExpired,
  lifelines,
  onUseFiftyFifty,
  onUseHint,
  onUseSkip,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimitSec);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when new question appears
  useEffect(() => {
    setSelectedOption(null);
    setEliminatedOptions([]);
    setShowHint(false);
    setTimeLeft(timeLimitSec);
    startTimeRef.current = Date.now();

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          sound.playIncorrect();
          onTimeExpired();
          return 0;
        }
        if (prev <= 4) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question.id, timeLimitSec]);

  // Handle keyboard shortcuts (1-4, A-D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedOption !== null) return;

      const key = e.key.toLowerCase();
      let index = -1;
      if (key === '1' || key === 'a') index = 0;
      if (key === '2' || key === 'b') index = 1;
      if (key === '3' || key === 'c') index = 2;
      if (key === '4' || key === 'd') index = 3;

      if (index >= 0 && index < question.options.length) {
        if (!eliminatedOptions.includes(index)) {
          handleSelectOption(index);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, eliminatedOptions, question.options.length]);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // Prevent multiple answers
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(idx);
    const spentMs = Date.now() - startTimeRef.current;

    const isCorrect = idx === question.correctAnswerIndex;
    if (isCorrect) {
      if (currentStreak >= 2) {
        sound.playStreak();
      } else {
        sound.playCorrect();
      }
    } else {
      sound.playIncorrect();
    }
  };

  const handleContinue = () => {
    if (selectedOption === null) return;
    const spentMs = Date.now() - startTimeRef.current;
    onAnswer(selectedOption, spentMs);
  };

  const handleFiftyFiftyClick = () => {
    if (lifelines.fiftyFiftyUsed || selectedOption !== null) return;
    sound.playClick();
    onUseFiftyFifty();

    // Pick 2 wrong answers to eliminate
    const wrongIndices = question.options
      .map((_, i) => i)
      .filter(i => i !== question.correctAnswerIndex);
    const shuffledWrong = wrongIndices.sort(() => 0.5 - Math.random());
    setEliminatedOptions(shuffledWrong.slice(0, 2));
  };

  const handleHintClick = () => {
    if (lifelines.hintUsed || selectedOption !== null) return;
    sound.playClick();
    onUseHint();
    setShowHint(true);
  };

  const handleSkipClick = () => {
    if (lifelines.skipUsed || selectedOption !== null) return;
    sound.playClick();
    if (timerRef.current) clearInterval(timerRef.current);
    onUseSkip();
  };

  // Timer bar percentage
  const timerPercentage = Math.max(0, Math.min(100, (timeLeft / timeLimitSec) * 100));
  const isTimeCritical = timeLeft <= 5;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Quiz Header Info Bar */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700/80 mb-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {mode === 'survival'
                ? `Question ${questionIndex + 1}`
                : `Question ${questionIndex + 1} of ${totalQuestions}`}
            </span>

            {/* Streak Counter */}
            {currentStreak > 1 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                {currentStreak}x Combo!
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Lives (Survival Mode) */}
            {mode === 'survival' && (
              <div className="flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 transition-colors ${
                      i < livesRemaining
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-slate-600 fill-slate-700'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Score */}
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block leading-none">Score</span>
              <span className="text-base font-extrabold text-white">{score}</span>
            </div>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className={`w-3.5 h-3.5 ${isTimeCritical ? 'text-rose-400 animate-pulse' : ''}`} />
              <span className={isTimeCritical ? 'font-bold text-rose-400' : ''}>
                {timeLeft}s remaining
              </span>
            </span>
            <span className="text-[11px] text-slate-400 capitalize">
              {question.difficulty} difficulty
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-700/60 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                timeLeft <= 5
                  ? 'bg-rose-500'
                  : timeLeft <= 10
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
        {/* Lifelines Buttons */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <span className="text-xs font-semibold text-slate-400">Lifelines:</span>
          <div className="flex items-center gap-2">
            {/* 50/50 */}
            <button
              onClick={handleFiftyFiftyClick}
              disabled={lifelines.fiftyFiftyUsed || selectedOption !== null}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                lifelines.fiftyFiftyUsed
                  ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
                  : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}
              title="Remove 2 incorrect options"
            >
              50:50
            </button>

            {/* Hint */}
            <button
              onClick={handleHintClick}
              disabled={lifelines.hintUsed || selectedOption !== null || !question.hint}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                lifelines.hintUsed || !question.hint
                  ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
              title="Reveal a hint"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hint</span>
            </button>

            {/* Skip */}
            <button
              onClick={handleSkipClick}
              disabled={lifelines.skipUsed || selectedOption !== null}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                lifelines.skipUsed
                  ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
                  : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30'
              }`}
              title="Skip this question (no penalty)"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Skip</span>
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {question.question}
          </h2>

          {question.codeSnippet && (
            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-700/60 font-mono text-xs text-indigo-300 overflow-x-auto">
              {question.codeSnippet}
            </pre>
          )}

          {/* Hint Card */}
          {showHint && question.hint && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2 animate-fadeIn">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>{question.hint}</span>
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {question.options.map((opt, idx) => {
            const isEliminated = eliminatedOptions.includes(idx);
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctAnswerIndex;
            const hasAnswered = selectedOption !== null;

            let buttonStyle =
              'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-700/80 hover:border-slate-500 hover:text-white';
            let badgeStyle = 'bg-slate-700/60 text-slate-300';

            if (isEliminated) {
              buttonStyle = 'opacity-25 bg-slate-800/20 border-slate-800 text-slate-600 line-through cursor-not-allowed';
            } else if (hasAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40';
                badgeStyle = 'bg-emerald-600 text-white';
              } else if (isSelected) {
                buttonStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/40';
                badgeStyle = 'bg-rose-600 text-white';
              } else {
                buttonStyle = 'opacity-40 bg-slate-800/40 border-slate-800 text-slate-500';
              }
            }

            const letter = String.fromCharCode(65 + idx);

            return (
              <button
                key={idx}
                disabled={isEliminated || hasAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`relative p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-200 cursor-pointer ${buttonStyle}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${badgeStyle}`}
                >
                  {letter}
                </span>
                <span className="text-sm font-semibold pt-0.5 leading-snug flex-1">{opt}</span>

                {hasAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {hasAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Post-Answer Explanation and Continue Button */}
        {selectedOption !== null && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-4 animate-fadeIn">
            <div className="flex items-start gap-3">
              {selectedOption === question.correctAnswerIndex ? (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              )}
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">
                  {selectedOption === question.correctAnswerIndex
                    ? 'Spot on! Correct answer.'
                    : `Incorrect. The correct answer is: ${question.options[question.correctAnswerIndex]}`}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  sound.playClick();
                  handleContinue();
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
              >
                <span>
                  {questionIndex + 1 >= totalQuestions && mode !== 'survival'
                    ? 'See Results'
                    : 'Next Question'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
