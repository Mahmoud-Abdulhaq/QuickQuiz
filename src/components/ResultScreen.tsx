import React, { useEffect } from 'react';
import {
  Trophy,
  RotateCcw,
  BookOpen,
  Home,
  CheckCircle,
  XCircle,
  Flame,
  Zap,
  Award,
} from 'lucide-react';
import { GameSessionResult } from '../types';
import { sound } from '../utils/sound';

interface ResultScreenProps {
  result: GameSessionResult;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onReviewAnswers: () => void;
  newAchievements: string[];
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onPlayAgain,
  onGoHome,
  onReviewAnswers,
  newAchievements,
}) => {
  const accuracy =
    result.totalQuestions > 0
      ? Math.round((result.correctAnswers / result.totalQuestions) * 100)
      : 0;

  // Rank badge — warm, encouraging copy (per spec: "Nice one!", never "CORRECT!")
  let grade = 'C';
  let gradeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  if (accuracy >= 95) {
    grade = 'S';
    gradeColor = 'text-amber-300 bg-amber-400/20 border-amber-400/40';
  } else if (accuracy >= 80) {
    grade = 'A';
    gradeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  } else if (accuracy >= 60) {
    grade = 'B';
    gradeColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
  } else {
    grade = 'Keep Going';
    gradeColor = 'text-red-400 bg-red-500/10 border-red-500/20';
  }

  // Warm headline depending on performance — no confetti, gentle sound only
  let headline = 'Thanks for playing!';
  if (accuracy >= 80) headline = 'Nice one!';
  else if (accuracy >= 50) headline = 'Well played!';

  useEffect(() => {
    sound.playVictory();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-cozy-fade">
      {/* Title Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-amber-500 shadow-xl shadow-indigo-900/40 mb-2">
          <Trophy className="w-10 h-10 text-slate-50" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
          {headline}
        </h1>
        <p className="text-sm text-slate-400">
          Category: <span className="text-slate-100 font-semibold">{result.categoryName}</span> • Mode:{' '}
          <span className="text-indigo-400 font-semibold capitalize">{result.mode}</span>
        </p>
      </div>

      {/* Main Score Card */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-700/60">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Final Score
            </span>
            <div className="text-4xl sm:text-5xl font-bold text-slate-100 mt-1">
              {result.score} <span className="text-sm font-semibold text-slate-400">PTS</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-2xl border text-center ${gradeColor}`}>
            <span className="text-[10px] uppercase font-extrabold tracking-wider block">Rank</span>
            <span className="text-2xl font-bold">{grade}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Correct</span>
            </div>
            <div className="text-lg font-bold text-slate-100">
              {result.correctAnswers} / {result.totalQuestions}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Accuracy</span>
            </div>
            <div className="text-lg font-bold text-slate-100">{accuracy}%</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Best Streak</span>
            </div>
            <div className="text-lg font-bold text-slate-100">{result.maxStreak}x</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <XCircle className="w-3.5 h-3.5 text-red-400" />
              <span>Mistakes</span>
            </div>
            <div className="text-lg font-bold text-slate-100">
              {result.totalQuestions - result.correctAnswers}
            </div>
          </div>
        </div>

        {/* New Achievements alert */}
        {newAchievements.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Achievement Unlocked!
              </h4>
              <p className="text-xs text-slate-200 mt-0.5">
                You earned {newAchievements.length} new badge(s) for your shelf!
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-slate-50 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onReviewAnswers();
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-slate-100 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-600 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Review Answers</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="w-full sm:w-auto p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 border border-slate-700 transition-all cursor-pointer flex items-center justify-center"
            title="Return to Home"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
