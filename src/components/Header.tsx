import React from 'react';
import { Coffee, Volume2, VolumeX, BarChart3, PlusCircle, Flame } from 'lucide-react';
import { sound } from '../utils/sound';

interface HeaderProps {
  onOpenStats: () => void;
  onOpenCreate: () => void;
  onGoHome: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  dailyStreak: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenStats,
  onOpenCreate,
  onGoHome,
  soundEnabled,
  onToggleSound,
  dailyStreak,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <button
          onClick={() => {
            sound.playClick();
            onGoHome();
          }}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-900/40 group-hover:scale-105 transition-transform">
            <Coffee className="w-5 h-5 text-slate-50" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-xl tracking-tight text-slate-100">
                Cozy Quiz<span className="text-indigo-400">*</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Warm trivia, at your own pace</p>
          </div>
        </button>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily streak indicator */}
          {dailyStreak > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold"
              title={`${dailyStreak} day streak!`}
            >
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{dailyStreak}d</span>
            </div>
          )}

          {/* Create Quiz Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCreate();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Create Quiz</span>
          </button>

          {/* Stats Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenStats();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
            title="View Statistics & Badges"
          >
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Stats</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute audio' : 'Unmute audio'}
            className="p-2 rounded-lg text-slate-300 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 transition-colors cursor-pointer"
            title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
