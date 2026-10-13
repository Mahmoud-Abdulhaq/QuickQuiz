import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { AnswerRecord } from '../types';
import { sound } from '../utils/sound';

interface ReviewModalProps {
  answers: AnswerRecord[];
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ answers, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'mistakes' | 'correct'>('all');

  const filteredAnswers = answers.filter(a => {
    if (filter === 'mistakes') return !a.isCorrect;
    if (filter === 'correct') return a.isCorrect;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Review Quiz Answers</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyze your performance and reinforce your learning
            </p>
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

        {/* Filter bar */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 mr-2">Filter:</span>
          {(['all', 'mistakes', 'correct'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                sound.playClick();
                setFilter(tab);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'all'
                ? `All (${answers.length})`
                : tab === 'mistakes'
                ? `Mistakes (${answers.filter(a => !a.isCorrect).length})`
                : `Correct (${answers.filter(a => a.isCorrect).length})`}
            </button>
          ))}
        </div>

        {/* Question List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredAnswers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No questions found for this filter.
            </div>
          ) : (
            filteredAnswers.map((item, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${
                  item.isCorrect
                    ? 'bg-slate-800/40 border-emerald-500/30'
                    : 'bg-slate-800/40 border-rose-500/30'
                } space-y-3`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {item.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <h3 className="font-bold text-white text-sm leading-snug">
                      {item.questionText}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {(item.timeSpentMs / 1000).toFixed(1)}s
                  </span>
                </div>

                {/* Option grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {item.options.map((opt, optIdx) => {
                    const isSelected = item.selectedOptionIndex === optIdx;
                    const isCorrect = item.correctOptionIndex === optIdx;

                    let style = 'bg-slate-800/50 text-slate-400 border-slate-700/50';
                    if (isCorrect) {
                      style = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-950/60 text-rose-300 border-rose-500/50 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`px-3 py-2 rounded-xl border text-xs flex items-center justify-between ${style}`}
                      >
                        <span>
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </span>
                        {isCorrect && (
                          <span className="text-[10px] font-bold text-emerald-400 uppercase">
                            Correct
                          </span>
                        )}
                        {isSelected && !isCorrect && (
                          <span className="text-[10px] font-bold text-rose-400 uppercase">
                            Your pick
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-200">Explanation: </span>
                  {item.explanation}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer transition-colors"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};
