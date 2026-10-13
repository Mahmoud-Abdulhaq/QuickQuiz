import { UserStats, CustomQuiz, GameSessionResult, Achievement } from '../types';

const STATS_KEY = 'quickquiz_user_stats';
const CUSTOM_QUIZZES_KEY = 'quickquiz_custom_quizzes';
const RECENT_GAMES_KEY = 'quickquiz_recent_games';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_quiz',
    title: 'First Step',
    description: 'Complete your first QuickQuiz game',
    icon: '🎯',
    isUnlocked: false,
  },
  {
    id: 'streak_3',
    title: 'On Fire',
    description: 'Reach a streak of 3 correct answers in a row',
    icon: '🔥',
    isUnlocked: false,
  },
  {
    id: 'streak_7',
    title: 'Unstoppable',
    description: 'Reach a streak of 7 correct answers in a row',
    icon: '⚡',
    isUnlocked: false,
  },
  {
    id: 'perfect_round',
    title: 'Perfectionist',
    description: 'Finish a quiz with 100% accuracy',
    icon: '🌟',
    isUnlocked: false,
  },
  {
    id: 'blitz_master',
    title: 'Speed Demon',
    description: 'Complete a Blitz mode game with at least 80% accuracy',
    icon: '⏱️',
    isUnlocked: false,
  },
  {
    id: 'trivia_scholar',
    title: 'Trivia Scholar',
    description: 'Answer 50 total questions correctly',
    icon: '🎓',
    isUnlocked: false,
  },
  {
    id: 'quiz_architect',
    title: 'Quiz Architect',
    description: 'Create your own custom quiz',
    icon: '🛠️',
    isUnlocked: false,
  },
  {
    id: 'daily_devotee',
    title: 'Daily Dedication',
    description: 'Complete 3 daily quizzes',
    icon: '📅',
    isUnlocked: false,
  },
];

const DEFAULT_STATS: UserStats = {
  gamesPlayed: 0,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  highScore: 0,
  bestStreak: 0,
  dailyStreak: 0,
  lastDailyPlayedDate: null,
  categoryStats: {},
  unlockedAchievements: [],
};

export const getStoredStats = (): UserStats => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
};

export const saveStoredStats = (stats: UserStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage quota errors
  }
};

export const getCustomQuizzes = (): CustomQuiz[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_QUIZZES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveCustomQuiz = (quiz: CustomQuiz): void => {
  try {
    const list = getCustomQuizzes();
    const existingIdx = list.findIndex(q => q.id === quiz.id);
    if (existingIdx >= 0) {
      list[existingIdx] = quiz;
    } else {
      list.unshift(quiz);
    }
    localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(list));

    // Unlock Quiz Architect achievement
    unlockAchievement('quiz_architect');
  } catch {
    // Ignore
  }
};

export const deleteCustomQuiz = (id: string): void => {
  try {
    const list = getCustomQuizzes().filter(q => q.id !== id);
    localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(list));
  } catch {
    // Ignore
  }
};

export const unlockAchievement = (id: string): boolean => {
  const stats = getStoredStats();
  if (!stats.unlockedAchievements.includes(id)) {
    stats.unlockedAchievements.push(id);
    saveStoredStats(stats);
    return true; // Newly unlocked
  }
  return false;
};

export const recordGameSession = (session: GameSessionResult): { newlyUnlocked: string[] } => {
  const stats = getStoredStats();
  const newlyUnlocked: string[] = [];

  stats.gamesPlayed += 1;
  stats.totalQuestionsAnswered += session.totalQuestions;
  stats.totalCorrectAnswers += session.correctAnswers;

  if (session.score > stats.highScore) {
    stats.highScore = session.score;
  }

  if (session.maxStreak > stats.bestStreak) {
    stats.bestStreak = session.maxStreak;
  }

  // Update category stats
  if (!stats.categoryStats[session.categoryId]) {
    stats.categoryStats[session.categoryId] = { played: 0, correct: 0 };
  }
  stats.categoryStats[session.categoryId].played += session.totalQuestions;
  stats.categoryStats[session.categoryId].correct += session.correctAnswers;

  // Handle daily streak
  if (session.mode === 'daily') {
    const today = new Date().toISOString().slice(0, 10);
    if (stats.lastDailyPlayedDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (stats.lastDailyPlayedDate === yesterday) {
        stats.dailyStreak += 1;
      } else {
        stats.dailyStreak = 1;
      }
      stats.lastDailyPlayedDate = today;

      if (stats.dailyStreak >= 3) {
        if (!stats.unlockedAchievements.includes('daily_devotee')) {
          stats.unlockedAchievements.push('daily_devotee');
          newlyUnlocked.push('daily_devotee');
        }
      }
    }
  }

  // Check achievements
  if (stats.gamesPlayed >= 1 && !stats.unlockedAchievements.includes('first_quiz')) {
    stats.unlockedAchievements.push('first_quiz');
    newlyUnlocked.push('first_quiz');
  }

  if (session.maxStreak >= 3 && !stats.unlockedAchievements.includes('streak_3')) {
    stats.unlockedAchievements.push('streak_3');
    newlyUnlocked.push('streak_3');
  }

  if (session.maxStreak >= 7 && !stats.unlockedAchievements.includes('streak_7')) {
    stats.unlockedAchievements.push('streak_7');
    newlyUnlocked.push('streak_7');
  }

  if (session.correctAnswers === session.totalQuestions && session.totalQuestions >= 5) {
    if (!stats.unlockedAchievements.includes('perfect_round')) {
      stats.unlockedAchievements.push('perfect_round');
      newlyUnlocked.push('perfect_round');
    }
  }

  if (session.mode === 'blitz' && session.correctAnswers / session.totalQuestions >= 0.8) {
    if (!stats.unlockedAchievements.includes('blitz_master')) {
      stats.unlockedAchievements.push('blitz_master');
      newlyUnlocked.push('blitz_master');
    }
  }

  if (stats.totalCorrectAnswers >= 50 && !stats.unlockedAchievements.includes('trivia_scholar')) {
    stats.unlockedAchievements.push('trivia_scholar');
    newlyUnlocked.push('trivia_scholar');
  }

  saveStoredStats(stats);

  // Save recent game session
  try {
    const raw = localStorage.getItem(RECENT_GAMES_KEY);
    const recents: GameSessionResult[] = raw ? JSON.parse(raw) : [];
    recents.unshift(session);
    localStorage.setItem(RECENT_GAMES_KEY, JSON.stringify(recents.slice(0, 20)));
  } catch {
    // Ignore
  }

  return { newlyUnlocked };
};
