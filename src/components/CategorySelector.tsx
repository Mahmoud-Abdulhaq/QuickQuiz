import React from 'react';
import {
  Sparkles,
  Code,
  Atom,
  Landmark,
  Globe,
  Film,
  Gamepad2,
  BookOpen,
  Trophy,
  Brain,
  Timer,
  Heart,
  Calendar,
  Flame,
  ArrowRight,
  Play,
  Trash2,
  HelpCircle,
} from 'lucide-react';
import { QuizCategory, GameMode, Difficulty, CustomQuiz } from '../types';
import { sound } from '../utils/sound';

interface CategorySelectorProps {
  categories: QuizCategory[];
  customQuizzes: CustomQuiz[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  selectedDifficulty: Difficulty | 'all';
  onSelectDifficulty: (difficulty: Difficulty | 'all') => void;
  onStartQuiz: () => void;
  onPlayCustomQuiz: (quiz: CustomQuiz) => void;
  onDeleteCustomQuiz: (id: string) => void;
  dailyStreak: number;
  lastDailyPlayedDate: string | null;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Code,
  Atom,
  Landmark,
  Globe,
  Film,
  Gamepad2,
  BookOpen,
  Trophy,
  Brain,
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  customQuizzes,
  selectedCategory,
  onSelectCategory,
  selectedMode,
  onSelectMode,
  selectedDifficulty,
  onSelectDifficulty,
  onStartQuiz,
  onPlayCustomQuiz,
  onDeleteCustomQuiz,
  dailyStreak,
  lastDailyPlayedDate,
}) => {
  const isDailyCompletedToday =
    lastDailyPlayedDate === new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 p-8 sm:p-10 border border-indigo-500/20 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for the ultimate brain test?</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Think Fast. <br />
            <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">
              Score Big.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Jump into real-time blitz questions, conquer survival mode, or test your trivia prowess across 10 meticulously crafted categories.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onStartQuiz();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Selected Quiz</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectMode('daily');
                onStartQuiz();
              }}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all cursor-pointer ${
                isDailyCompletedToday
                  ? 'bg-slate-800/80 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>
                {isDailyCompletedToday ? 'Daily Completed (Replay)' : 'Play Today\'s Daily Challenge'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Timer className="w-5 h-5 text-indigo-400" />
            <span>Select Game Mode</span>
          </h2>
          <span className="text-xs text-slate-400">Choose your challenge style</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Classic Mode */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('classic');
            }}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedMode === 'classic'
                ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-950/50'
                : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <Play className="w-5 h-5 fill-indigo-400" />
              </div>
              <h3 className="font-bold text-white text-base">Classic 10</h3>
              <p className="text-xs text-slate-400 mt-1">
                10 questions with generous time and educational explanations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
              <span>Standard pacing</span>
              <span className="font-semibold text-indigo-400">10 Qs</span>
            </div>
          </button>

          {/* Blitz Mode */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('blitz');
            }}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedMode === 'blitz'
                ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-950/50'
                : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <Flame className="w-5 h-5 fill-amber-400" />
              </div>
              <h3 className="font-bold text-white text-base">Speed Blitz</h3>
              <p className="text-xs text-slate-400 mt-1">
                15 seconds per question! Consecutive fast answers multiply your score.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
              <span>Timed Rush</span>
              <span className="font-semibold text-amber-400">15s Clock</span>
            </div>
          </button>

          {/* Survival Mode */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('survival');
            }}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedMode === 'survival'
                ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/40 shadow-lg shadow-rose-950/50'
                : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 fill-rose-400" />
              </div>
              <h3 className="font-bold text-white text-base">Endless Survival</h3>
              <p className="text-xs text-slate-400 mt-1">
                Start with 3 lives. The quiz keeps rolling until all 3 strikes are used!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
              <span>High Stakes</span>
              <span className="font-semibold text-rose-400">3 Lives</span>
            </div>
          </button>

          {/* Daily Challenge */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('daily');
            }}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedMode === 'daily'
                ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/50'
                : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Daily Challenge</h3>
                {dailyStreak > 0 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold">
                    {dailyStreak}d 🔥
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Fresh curated set refreshed each day. Keep your daily streak alive!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
              <span>Daily Global</span>
              <span className="font-semibold text-emerald-400">
                {isDailyCompletedToday ? 'Done Today' : 'Ready'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Difficulty & Category Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <span>Select Trivia Category</span>
          </h2>

          {/* Difficulty pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700">
            {(['all', 'easy', 'medium', 'hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => {
                  sound.playClick();
                  onSelectDifficulty(diff);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff === 'all' ? 'All Difficulties' : diff}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(cat => {
            const Icon = ICON_MAP[cat.icon] || HelpCircle;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  onSelectCategory(cat.id);
                }}
                className={`group relative p-4 rounded-2xl border text-left transition-all cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/50 shadow-xl'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                {/* Gradient top accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.color} ${
                    isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'
                  }`}
                />

                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${cat.color} text-white shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-full">
                    {cat.questionCount} Qs
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                {isSelected && (
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-indigo-400">
                    <span>Selected</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Quizzes Section */}
      {customQuizzes.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Your Custom Quizzes ({customQuizzes.length})</span>
            </h2>
            <span className="text-xs text-slate-400">Created by you</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {customQuizzes.map(quiz => (
              <div
                key={quiz.id}
                className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between hover:border-slate-600 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white text-base">{quiz.title}</h3>
                    <button
                      onClick={() => onDeleteCustomQuiz(quiz.id)}
                      className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                      title="Delete quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{quiz.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {quiz.questions.length} Questions • {quiz.difficulty}
                  </span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onPlayCustomQuiz(quiz);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow transition-all hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Play</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
