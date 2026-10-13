import React from 'react';
import { X, Award, Flame, Zap, Trophy, Target, BarChart2 } from 'lucide-react';
import { UserStats } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../utils/storage';
import { CATEGORIES } from '../data/quizData';
import { sound } from '../utils/sound';

interface StatsModalProps {
  stats: UserStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose }) => {
  const overallAccuracy =
    stats.totalQuestionsAnswered > 0
      ? Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Player Statistics & Badges</h2>
              <p className="text-xs text-slate-400">Track your progress and unlocked honors</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Games Played</span>
              </div>
              <div className="text-2xl font-black text-white">{stats.gamesPlayed}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Overall Accuracy</span>
              </div>
              <div className="text-2xl font-black text-white">{overallAccuracy}%</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>High Score</span>
              </div>
              <div className="text-2xl font-black text-white">{stats.highScore}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Best Streak</span>
              </div>
              <div className="text-2xl font-black text-white">{stats.bestStreak}x</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Daily Streak</span>
              </div>
              <div className="text-2xl font-black text-white">{stats.dailyStreak} Days</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Total Answered</span>
              </div>
              <div className="text-2xl font-black text-white">{stats.totalQuestionsAnswered}</div>
            </div>
          </div>

          {/* Category Proficiency */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Category Performance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map(cat => {
                const data = stats.categoryStats[cat.id] || { played: 0, correct: 0 };
                const pct = data.played > 0 ? Math.round((data.correct / data.played) * 100) : 0;

                return (
                  <div
                    key={cat.id}
                    className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{cat.name}</span>
                      <span className="text-slate-400 font-mono">
                        {data.played > 0 ? `${pct}% (${data.correct}/${data.played})` : 'Unplayed'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements Gallery */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Achievements & Badges</span>
              <span className="text-xs text-indigo-400 font-normal">
                {stats.unlockedAchievements.length} of {INITIAL_ACHIEVEMENTS.length} Unlocked
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INITIAL_ACHIEVEMENTS.map(ach => {
                const isUnlocked = stats.unlockedAchievements.includes(ach.id);

                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                      isUnlocked
                        ? 'bg-indigo-950/30 border-indigo-500/40 text-white'
                        : 'bg-slate-800/30 border-slate-800/80 text-slate-500 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                        isUnlocked ? 'bg-indigo-500/20' : 'bg-slate-800/80 grayscale'
                      }`}
                    >
                      {ach.icon}
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          isUnlocked ? 'text-indigo-200' : 'text-slate-400'
                        }`}
                      >
                        {ach.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
