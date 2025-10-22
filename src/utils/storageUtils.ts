import type { GameState, GameResult, UserStats, LocalStorageData } from '../types';

const STORAGE_KEY_HISTORY = 'bookdle_history';
const STORAGE_KEY_CURRENT = 'bookdle_current';

/**
 * Get game history from localStorage
 */
export function getGameHistory(): Record<string, GameResult> {
  try {
    const data = localStorage.getItem(STORAGE_KEY_HISTORY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading game history:', error);
    return {};
  }
}

/**
 * Save game result to history
 */
export function saveGameResult(result: GameResult): void {
  try {
    const history = getGameHistory();
    history[result.date] = result;
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving game result:', error);
  }
}

/**
 * Get current game state from localStorage
 */
export function getCurrentGameState(): GameState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CURRENT);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading current game state:', error);
    return null;
  }
}

/**
 * Save current game state to localStorage
 */
export function saveCurrentGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving current game state:', error);
  }
}

/**
 * Clear current game state
 */
export function clearCurrentGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CURRENT);
  } catch (error) {
    console.error('Error clearing current game state:', error);
  }
}

/**
 * Calculate user statistics from game history
 */
export function calculateStats(): UserStats {
  const history = getGameHistory();
  const games = Object.values(history);

  const stats: UserStats = {
    gamesPlayed: games.length,
    gamesWon: games.filter(g => g.won).length,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  };

  // Calculate guess distribution
  games.forEach(game => {
    if (game.won && game.attempts >= 1 && game.attempts <= 5) {
      stats.guessDistribution[game.attempts as keyof typeof stats.guessDistribution]++;
    }
  });

  // Calculate streaks
  const sortedDates = Object.keys(history).sort();
  let currentStreak = 0;
  let maxStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const game = history[dateStr];
    if (!game.won) {
      currentStreak = 0;
      prevDate = null;
      continue;
    }

    const currentDate = new Date(dateStr + 'T00:00:00Z');

    if (prevDate) {
      const daysDiff = Math.floor(
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    maxStreak = Math.max(maxStreak, currentStreak);
    prevDate = currentDate;
  }

  // Check if current streak extends to today
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const lastPlayedDate = prevDate;

  if (lastPlayedDate) {
    const daysSinceLastPlayed = Math.floor(
      (today.getTime() - lastPlayedDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastPlayed <= 1) {
      stats.currentStreak = currentStreak;
    }
  }

  stats.maxStreak = maxStreak;

  return stats;
}

/**
 * Export game history as JSON
 */
export function exportHistoryAsJSON(): string {
  const history = getGameHistory();
  return JSON.stringify(history, null, 2);
}

/**
 * Export game history as CSV
 */
export function exportHistoryAsCSV(): string {
  const history = getGameHistory();
  const games = Object.values(history);

  const header = 'Date,Book,Attempts,Won,Hints Unlocked\n';
  const rows = games.map(game => {
    return `${game.date},"${game.puzzleId}",${game.attempts},${game.won},${game.hintsUnlocked}`;
  });

  return header + rows.join('\n');
}

/**
 * Download data as file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
