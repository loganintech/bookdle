// Core puzzle data structure
export interface Puzzle {
  id: number;
  date: string; // YYYY-MM-DD format
  firstSentence: string;
  book: string;
  author: string;
  year: number;
  genre: string;
  length: string; // e.g., "Medium (326 pages)"
}

// Data structure for puzzles.json
export interface PuzzleData {
  puzzles: Puzzle[];
}

// Action in the game (either a guess or hint request)
export type GameAction =
  | { type: 'guess'; value: string }
  | { type: 'hint' };

// Game state for a single play session
export interface GameState {
  puzzleId: number;
  date: string;
  guesses: string[];
  hintsUnlocked: number; // 0-4 (year, genre, length, author)
  hintsRequested: number; // How many times user clicked "Get Hint"
  actionHistory: GameAction[]; // Ordered list of all actions (guesses and hints)
  won: boolean;
  gameOver: boolean;
}

// Historical game result stored in localStorage
export interface GameResult {
  date: string;
  puzzleId: number;
  attempts: number;
  won: boolean;
  guesses: string[];
  hintsUnlocked: number;
  hintsRequested: number;
  actionHistory?: GameAction[]; // Optional for backward compatibility
}

// User statistics
export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// localStorage structure
export interface LocalStorageData {
  history: Record<string, GameResult>; // keyed by date (YYYY-MM-DD)
  currentGame?: GameState; // incomplete game in progress
}
