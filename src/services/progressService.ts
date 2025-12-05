// Progress Tracking Service
// Saves and loads learning progress from localStorage

export interface LetterProgress {
  letter: string;
  timesViewed: number;
  timesCorrect: number;
  lastViewed: string;
  mastered: boolean;
}

export interface NumberProgress {
  number: string;
  timesViewed: number;
  timesCorrect: number;
  lastViewed: string;
  mastered: boolean;
}

export interface GameScore {
  date: string;
  game: string;
  score: number;
  maxScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserProgress {
  totalStars: number;
  badges: string[];
  streak: number;
  lastPlayDate: string;
  letters: Record<string, LetterProgress>;
  numbers: Record<string, NumberProgress>;
  gameScores: GameScore[];
  gamesPlayed: number;
  totalPlayTime: number; // in minutes
}

const STORAGE_KEY = 'alphabetKids_progress';

const defaultProgress: UserProgress = {
  totalStars: 0,
  badges: [],
  streak: 0,
  lastPlayDate: '',
  letters: {},
  numbers: {},
  gameScores: [],
  gamesPlayed: 0,
  totalPlayTime: 0
};

// Load progress from localStorage
export const loadProgress = (): UserProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultProgress, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load progress', e);
  }
  return { ...defaultProgress };
};

// Save progress to localStorage
export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save progress', e);
  }
};

// Track letter viewed
export const trackLetterViewed = (letter: string): void => {
  const progress = loadProgress();
  const now = new Date().toISOString();
  
  if (!progress.letters[letter]) {
    progress.letters[letter] = {
      letter,
      timesViewed: 0,
      timesCorrect: 0,
      lastViewed: now,
      mastered: false
    };
  }
  
  progress.letters[letter].timesViewed++;
  progress.letters[letter].lastViewed = now;
  
  // Check if mastered (viewed 5+ times)
  if (progress.letters[letter].timesViewed >= 5) {
    progress.letters[letter].mastered = true;
  }
  
  saveProgress(progress);
};

// Track letter correct answer in game
export const trackLetterCorrect = (letter: string): void => {
  const progress = loadProgress();
  const now = new Date().toISOString();
  
  if (!progress.letters[letter]) {
    progress.letters[letter] = {
      letter,
      timesViewed: 0,
      timesCorrect: 0,
      lastViewed: now,
      mastered: false
    };
  }
  
  progress.letters[letter].timesCorrect++;
  progress.letters[letter].lastViewed = now;
  
  // Check if mastered (3+ correct answers)
  if (progress.letters[letter].timesCorrect >= 3) {
    progress.letters[letter].mastered = true;
  }
  
  saveProgress(progress);
};

// Track number viewed
export const trackNumberViewed = (number: string): void => {
  const progress = loadProgress();
  const now = new Date().toISOString();
  
  if (!progress.numbers[number]) {
    progress.numbers[number] = {
      number,
      timesViewed: 0,
      timesCorrect: 0,
      lastViewed: now,
      mastered: false
    };
  }
  
  progress.numbers[number].timesViewed++;
  progress.numbers[number].lastViewed = now;
  
  if (progress.numbers[number].timesViewed >= 5) {
    progress.numbers[number].mastered = true;
  }
  
  saveProgress(progress);
};

// Track number correct answer in game
export const trackNumberCorrect = (number: string): void => {
  const progress = loadProgress();
  const now = new Date().toISOString();
  
  if (!progress.numbers[number]) {
    progress.numbers[number] = {
      number,
      timesViewed: 0,
      timesCorrect: 0,
      lastViewed: now,
      mastered: false
    };
  }
  
  progress.numbers[number].timesCorrect++;
  progress.numbers[number].lastViewed = now;
  
  if (progress.numbers[number].timesCorrect >= 3) {
    progress.numbers[number].mastered = true;
  }
  
  saveProgress(progress);
};

// Add game score
export const addGameScore = (
  game: string, 
  score: number, 
  maxScore: number, 
  difficulty: 'easy' | 'medium' | 'hard' = 'easy'
): void => {
  const progress = loadProgress();
  
  progress.gameScores.push({
    date: new Date().toISOString(),
    game,
    score,
    maxScore,
    difficulty
  });
  
  // Keep only last 50 scores
  if (progress.gameScores.length > 50) {
    progress.gameScores = progress.gameScores.slice(-50);
  }
  
  progress.gamesPlayed++;
  
  saveProgress(progress);
};

// Add stars
export const addStars = (count: number): void => {
  const progress = loadProgress();
  progress.totalStars += count;
  saveProgress(progress);
};

// Update streak
export const updateStreak = (): void => {
  const progress = loadProgress();
  const today = new Date().toDateString();
  const lastPlay = progress.lastPlayDate ? new Date(progress.lastPlayDate).toDateString() : '';
  
  if (lastPlay === today) {
    // Already played today, don't update streak
    return;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (lastPlay === yesterday.toDateString()) {
    // Played yesterday, increment streak
    progress.streak++;
  } else if (lastPlay !== today) {
    // Missed a day, reset streak
    progress.streak = 1;
  }
  
  progress.lastPlayDate = new Date().toISOString();
  saveProgress(progress);
};

// Unlock badge
export const unlockBadge = (badgeId: string): boolean => {
  const progress = loadProgress();
  
  if (!progress.badges.includes(badgeId)) {
    progress.badges.push(badgeId);
    saveProgress(progress);
    return true; // New badge unlocked
  }
  
  return false; // Already had this badge
};

// Check for new badges based on progress
export const checkForNewBadges = (): string[] => {
  const progress = loadProgress();
  const newBadges: string[] = [];
  
  // First Letter badge
  if (Object.keys(progress.letters).length >= 1 && !progress.badges.includes('first_letter')) {
    if (unlockBadge('first_letter')) newBadges.push('first_letter');
  }
  
  // Alphabet Explorer (10 letters)
  if (Object.keys(progress.letters).length >= 10 && !progress.badges.includes('alphabet_explorer')) {
    if (unlockBadge('alphabet_explorer')) newBadges.push('alphabet_explorer');
  }
  
  // Alphabet Master (26 letters)
  const masteredLetters = Object.values(progress.letters).filter(l => l.mastered).length;
  if (masteredLetters >= 26 && !progress.badges.includes('alphabet_master')) {
    if (unlockBadge('alphabet_master')) newBadges.push('alphabet_master');
  }
  
  // Number Starter (5 numbers)
  if (Object.keys(progress.numbers).length >= 5 && !progress.badges.includes('number_starter')) {
    if (unlockBadge('number_starter')) newBadges.push('number_starter');
  }
  
  // Counter (10 numbers mastered)
  const masteredNumbers = Object.values(progress.numbers).filter(n => n.mastered).length;
  if (masteredNumbers >= 10 && !progress.badges.includes('counter')) {
    if (unlockBadge('counter')) newBadges.push('counter');
  }
  
  // Game Player (5 games)
  if (progress.gamesPlayed >= 5 && !progress.badges.includes('game_player')) {
    if (unlockBadge('game_player')) newBadges.push('game_player');
  }
  
  // Game Champion (25 games)
  if (progress.gamesPlayed >= 25 && !progress.badges.includes('game_champion')) {
    if (unlockBadge('game_champion')) newBadges.push('game_champion');
  }
  
  // Star Collector (50 stars)
  if (progress.totalStars >= 50 && !progress.badges.includes('star_collector')) {
    if (unlockBadge('star_collector')) newBadges.push('star_collector');
  }
  
  // Super Star (200 stars)
  if (progress.totalStars >= 200 && !progress.badges.includes('super_star')) {
    if (unlockBadge('super_star')) newBadges.push('super_star');
  }
  
  // Streak badges
  if (progress.streak >= 3 && !progress.badges.includes('streak_3')) {
    if (unlockBadge('streak_3')) newBadges.push('streak_3');
  }
  if (progress.streak >= 7 && !progress.badges.includes('streak_7')) {
    if (unlockBadge('streak_7')) newBadges.push('streak_7');
  }
  
  return newBadges;
};

// Get statistics
export const getStats = () => {
  const progress = loadProgress();
  
  const totalLetters = Object.keys(progress.letters).length;
  const masteredLetters = Object.values(progress.letters).filter(l => l.mastered).length;
  const totalNumbers = Object.keys(progress.numbers).length;
  const masteredNumbers = Object.values(progress.numbers).filter(n => n.mastered).length;
  
  const recentScores = progress.gameScores.slice(-10);
  const avgScore = recentScores.length > 0
    ? recentScores.reduce((sum, s) => sum + (s.score / s.maxScore), 0) / recentScores.length * 100
    : 0;
  
  return {
    totalStars: progress.totalStars,
    badges: progress.badges,
    streak: progress.streak,
    totalLetters,
    masteredLetters,
    totalNumbers,
    masteredNumbers,
    gamesPlayed: progress.gamesPlayed,
    avgScore: Math.round(avgScore),
    letterProgress: Math.round((masteredLetters / 26) * 100),
    numberProgress: Math.round((masteredNumbers / 20) * 100)
  };
};

// Reset all progress (for testing)
export const resetProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

