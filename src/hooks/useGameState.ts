import { useState, useEffect, useCallback } from 'react';
import type { GameState, Puzzle, GameResult } from '../types';
import {
  getCurrentGameState,
  saveCurrentGameState,
  clearCurrentGameState,
  saveGameResult,
  getGameHistory,
} from '../utils/storageUtils';
import { getTodayDate } from '../utils/dateUtils';

const MAX_GUESSES = 5;

interface UseGameStateResult {
  gameState: GameState;
  makeGuess: (guess: string) => boolean;
  getHint: () => void;
  hasPlayedToday: boolean;
  todayResult: GameResult | null;
}

/**
 * Custom hook for managing game state
 */
export function useGameState(puzzle: Puzzle | null): UseGameStateResult {
  const [gameState, setGameState] = useState<GameState>(() => {
    if (!puzzle) {
      return createInitialState(0, getTodayDate());
    }

    // Use the puzzle's date, not today's date
    const puzzleDate = puzzle.date;
    const history = getGameHistory();
    const savedResult = history[puzzleDate];

    if (savedResult) {
      // Game already completed for this date
      return {
        puzzleId: puzzle.id,
        date: puzzleDate,
        guesses: savedResult.guesses,
        hintsUnlocked: savedResult.hintsUnlocked,
        hintsRequested: savedResult.hintsRequested || 0,
        actionHistory: savedResult.actionHistory || [],
        won: savedResult.won,
        gameOver: true,
      };
    }

    // Check for existing game state for this specific date
    const saved = getCurrentGameState(puzzleDate);
    if (saved && saved.puzzleId === puzzle.id) {
      return saved;
    }

    // Start new game
    return createInitialState(puzzle.id, puzzleDate);
  });

  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [todayResult, setTodayResult] = useState<GameResult | null>(null);

  // Check if user has already played today
  useEffect(() => {
    if (!puzzle) return;

    const history = getGameHistory();
    const todayDate = getTodayDate();
    const result = history[todayDate];

    if (result) {
      setHasPlayedToday(true);
      setTodayResult(result);
    } else {
      setHasPlayedToday(false);
      setTodayResult(null);
    }
  }, [puzzle]);

  // Save state to localStorage whenever it changes (unless game is over)
  useEffect(() => {
    if (!gameState.gameOver && gameState.puzzleId > 0) {
      saveCurrentGameState(gameState);
    }
  }, [gameState]);

  // Reset game state if puzzle changes (different date or puzzle)
  useEffect(() => {
    if (!puzzle) return;

    const puzzleDate = puzzle.date;

    // If the puzzle has changed, update the game state
    if (gameState.date !== puzzleDate || gameState.puzzleId !== puzzle.id) {
      const history = getGameHistory();
      const savedResult = history[puzzleDate];

      if (savedResult) {
        setGameState({
          puzzleId: puzzle.id,
          date: puzzleDate,
          guesses: savedResult.guesses,
          hintsUnlocked: savedResult.hintsUnlocked,
          hintsRequested: savedResult.hintsRequested || 0,
          actionHistory: savedResult.actionHistory || [],
          won: savedResult.won,
          gameOver: true,
        });
      } else {
        // Check for in-progress game for this specific date
        const saved = getCurrentGameState(puzzleDate);
        if (saved && saved.puzzleId === puzzle.id) {
          setGameState(saved);
        } else {
          setGameState(createInitialState(puzzle.id, puzzleDate));
        }
      }
    }
  }, [puzzle, gameState.date, gameState.puzzleId]);

  /**
   * Make a guess
   */
  const makeGuess = useCallback(
    (guess: string): boolean => {
      if (!puzzle) return false;
      if (gameState.gameOver) return false;
      if (gameState.actionHistory.length >= MAX_GUESSES) return false;

      const trimmedGuess = guess.trim();
      if (!trimmedGuess) return false;

      // Check if guess was already made
      if (gameState.guesses.includes(trimmedGuess)) {
        return false;
      }

      const isCorrect = trimmedGuess.toLowerCase() === puzzle.book.toLowerCase();
      const newGuesses = [...gameState.guesses, trimmedGuess];
      const newHintsUnlocked = isCorrect ? gameState.hintsUnlocked : gameState.hintsUnlocked + 1;
      const newActionHistory = [...gameState.actionHistory, { type: 'guess' as const, value: trimmedGuess }];
      const isGameOver = isCorrect || newActionHistory.length >= MAX_GUESSES;

      const newState: GameState = {
        ...gameState,
        guesses: newGuesses,
        hintsUnlocked: newHintsUnlocked,
        actionHistory: newActionHistory,
        won: isCorrect,
        gameOver: isGameOver,
      };

      setGameState(newState);

      // If game is over, save result and clear current state
      if (isGameOver) {
        const result: GameResult = {
          date: gameState.date,
          puzzleId: gameState.puzzleId,
          attempts: newActionHistory.length, // Count all actions (guesses + hints)
          won: isCorrect,
          guesses: newGuesses,
          hintsUnlocked: newHintsUnlocked,
          hintsRequested: gameState.hintsRequested,
          actionHistory: newActionHistory,
        };
        saveGameResult(result);
        clearCurrentGameState(gameState.date);
        setHasPlayedToday(true);
        setTodayResult(result);
      }

      return true;
    },
    [puzzle, gameState]
  );

  /**
   * Get a hint (unlock the next hint without making a guess)
   */
  const getHint = useCallback(() => {
    if (gameState.gameOver) return;
    if (gameState.hintsUnlocked >= 4) return; // All hints already unlocked
    if (gameState.actionHistory.length >= MAX_GUESSES) return; // No actions left

    const newActionHistory = [...gameState.actionHistory, { type: 'hint' as const }];
    const isGameOver = newActionHistory.length >= MAX_GUESSES;

    const newState: GameState = {
      ...gameState,
      hintsUnlocked: gameState.hintsUnlocked + 1,
      hintsRequested: gameState.hintsRequested + 1,
      actionHistory: newActionHistory,
      gameOver: isGameOver,
    };

    setGameState(newState);

    // If using the hint ends the game (used all 5 actions), save result
    if (isGameOver) {
      const result: GameResult = {
        date: gameState.date,
        puzzleId: gameState.puzzleId,
        attempts: newActionHistory.length,
        won: false, // Can't win by using hints
        guesses: gameState.guesses,
        hintsUnlocked: gameState.hintsUnlocked + 1,
        hintsRequested: gameState.hintsRequested + 1,
        actionHistory: newActionHistory,
      };
      saveGameResult(result);
      clearCurrentGameState(gameState.date);
      setHasPlayedToday(true);
      setTodayResult(result);
    }
  }, [gameState]);

  return {
    gameState,
    makeGuess,
    getHint,
    hasPlayedToday,
    todayResult,
  };
}

/**
 * Create initial game state
 */
function createInitialState(puzzleId: number, date: string): GameState {
  return {
    puzzleId,
    date,
    guesses: [],
    hintsUnlocked: 0,
    hintsRequested: 0,
    actionHistory: [],
    won: false,
    gameOver: false,
  };
}
