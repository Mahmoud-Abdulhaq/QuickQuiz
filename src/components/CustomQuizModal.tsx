import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Download, Upload, Check } from 'lucide-react';
import { CustomQuiz, Question, Difficulty } from '../types';
import { CATEGORIES } from '../data/quizData';
import { sound } from '../utils/sound';

interface CustomQuizModalProps {
  onClose: () => void;
  onSaveQuiz: (quiz: CustomQuiz) => void;
}

export const CustomQuizModal: React.FC<CustomQuizModalProps> = ({
  onClose,
  onSaveQuiz,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timePerQuestion, setTimePerQuestion] = useState(20);
  const [questions, setQuestions] = useState<
    Array<{
      question: string;
      options: [string, string, string, string];
      correctIndex: number;
      explanation: string;
      hint: string;
    }>
  >([
    {
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
      hint: '',
    },
  ]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddQuestion = () => {
    sound.playClick();
    setQuestions(prev => [
      ...prev,
      {
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: '',
        hint: '',
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    sound.playClick();
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], question: text };
      return copy;
    });
  };

  const handleOptionChange = (qIdx: number, optIdx: number, text: string) => {
    setQuestions(prev => {
      const copy = [...prev];
      const newOptions = [...copy[qIdx].options] as [string, string, string, string];
      newOptions[optIdx] = text;
      copy[qIdx] = { ...copy[qIdx], options: newOptions };
      return copy;
    });
  };

  const handleCorrectIndexChange = (qIdx: number, correctIdx: number) => {
    sound.playClick();
    setQuestions(prev => {
      const copy = [...prev];
      copy[qIdx] = { ...copy[qIdx], correctIndex: correctIdx };
      return copy;
    });
  };

  const handleExplanationChange = (qIdx: number, text: string) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[qIdx] = { ...copy[qIdx], explanation: text };
      return copy;
    });
  };

  const handleSave = () => {
    setErrorMsg(null);
    if (!title.trim()) {
      setErrorMsg('Please enter a quiz title.');
      return;
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setErrorMsg(`Question #${i + 1} is missing the question prompt.`);
        return;
      }
      for (let j = 0; j < 4; j++) {
        if (!q.options[j].trim()) {
          setErrorMsg(`Question #${i + 1} has an empty Option ${String.fromCharCode(65 + j)}.`);
          return;
        }
      }
    }

    const compiledQuestions: Question[] = questions.map((q, idx) => ({
      id: `custom_${Date.now()}_${idx}`,
      category,
      difficulty,
      question: q.question.trim(),
      options: q.options.map(o => o.trim()),
      correctAnswerIndex: q.correctIndex,
      explanation: q.explanation.trim() || 'No explanation provided.',
      hint: q.hint.trim() || undefined,
    }));

    const newQuiz: CustomQuiz = {
      id: `quiz_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Custom user created quiz',
      category,
      difficulty,
      timePerQuestion,
      questions: compiledQuestions,
      createdAt: Date.now(),
    };

    sound.playVictory();
    onSaveQuiz(newQuiz);
    onClose();
  };

  // Import JSON helper
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.title && Array.isArray(json.questions)) {
          setTitle(json.title);
          if (json.description) setDescription(json.description);
          if (json.difficulty) setDifficulty(json.difficulty);
          if (json.timePerQuestion) setTimePerQuestion(json.timePerQuestion);
          setQuestions(
            json.questions.map((q: any) => ({
              question: q.question || '',
              options: [
                q.options?.[0] || '',
                q.options?.[1] || '',
                q.options?.[2] || '',
                q.options?.[3] || '',
              ],
              correctIndex: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0,
              explanation: q.explanation || '',
              hint: q.hint || '',
            }))
          );
          sound.playCorrect();
        }
      } catch {
        setErrorMsg('Invalid JSON format for custom quiz.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Create Custom Quiz</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Design your own questions or import from JSON
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

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Basic metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Quiz Title *
              </label>
              <input
                type="text"
                placeholder="e.g. 90s Cartoon Nostalgia"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Description
              </label>
              <input
                type="text"
                placeholder="A fun test of Saturday morning cartoon knowledge..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Timer per Question
              </label>
              <select
                value={timePerQuestion}
                onChange={e => setTimePerQuestion(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value={10}>10 Seconds (Ultra-Fast)</option>
                <option value={15}>15 Seconds (Blitz)</option>
                <option value={20}>20 Seconds (Standard)</option>
                <option value={30}>30 Seconds (Relaxed)</option>
              </select>
            </div>
          </div>

          {/* Questions Header */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Questions ({questions.length})
            </h3>
            <button
              onClick={handleAddQuestion}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow transition-all hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          {/* Questions list */}
          <div className="space-y-6">
            {questions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400">
                    Question #{qIdx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                      title="Remove question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Enter question prompt..."
                    value={q.question}
                    onChange={e => handleQuestionTextChange(qIdx, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* 4 Options */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Options (Select the radio button for the correct answer):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2 p-2 rounded-xl border ${
                          q.correctIndex === optIdx
                            ? 'bg-emerald-950/30 border-emerald-500/50'
                            : 'bg-slate-900 border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct_${qIdx}`}
                          checked={q.correctIndex === optIdx}
                          onChange={() => handleCorrectIndexChange(qIdx, optIdx)}
                          className="accent-emerald-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-400">
                          {String.fromCharCode(65 + optIdx)}:
                        </span>
                        <input
                          type="text"
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          value={opt}
                          onChange={e => handleOptionChange(qIdx, optIdx, e.target.value)}
                          className="w-full bg-transparent text-white text-xs focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Explanation (shown after answering)..."
                    value={q.explanation}
                    onChange={e => handleExplanationChange(qIdx, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-700 transition-colors">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer transition-all hover:scale-105"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Play</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
