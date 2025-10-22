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

    // Check if there's already a completed game for today
    const history = getGameHistory();
    const todayDate = getTodayDate();
    const todayResult = history[todayDate];

    if (todayResult) {
      // Game already completed today
      return {
        puzzleId: puzzle.id,
        date: todayDate,
        guesses: todayResult.guesses,
        hintsUnlocked: todayResult.hintsUnlocked,
        won: todayResult.won,
        gameOver: true,
      };
    }

    // Check for existing game state
    const saved = getCurrentGameState();
    if (saved && saved.date === todayDate && saved.puzzleId === puzzle.id) {
      return saved;
    }

    // Start new game
    return createInitialState(puzzle.id, todayDate);
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

  // Reset game state if puzzle changes (new day)
  useEffect(() => {
    if (!puzzle) return;

    const todayDate = getTodayDate();

    // If the date has changed, reset the game
    if (gameState.date !== todayDate) {
      const history = getGameHistory();
      const todayResult = history[todayDate];

      if (todayResult) {
        setGameState({
          puzzleId: puzzle.id,
          date: todayDate,
          guesses: todayResult.guesses,
          hintsUnlocked: todayResult.hintsUnlocked,
          won: todayResult.won,
          gameOver: true,
        });
      } else {
        setGameState(createInitialState(puzzle.id, todayDate));
      }
    }
  }, [puzzle, gameState.date]);

  /**
   * Make a guess
   */
  const makeGuess = useCallback(
    (guess: string): boolean => {
      if (!puzzle) return false;
      if (gameState.gameOver) return false;
      if (gameState.guesses.length >= MAX_GUESSES) return false;

      const trimmedGuess = guess.trim();
      if (!trimmedGuess) return false;

      // Check if guess was already made
      if (gameState.guesses.includes(trimmedGuess)) {
        return false;
      }

      const isCorrect = trimmedGuess.toLowerCase() === puzzle.book.toLowerCase();
      const newGuesses = [...gameState.guesses, trimmedGuess];
      const newHintsUnlocked = isCorrect ? gameState.hintsUnlocked : gameState.hintsUnlocked + 1;
      const isGameOver = isCorrect || newGuesses.length >= MAX_GUESSES;

      const newState: GameState = {
        ...gameState,
        guesses: newGuesses,
        hintsUnlocked: newHintsUnlocked,
        won: isCorrect,
        gameOver: isGameOver,
      };

      setGameState(newState);

      // If game is over, save result and clear current state
      if (isGameOver) {
        const result: GameResult = {
          date: gameState.date,
          puzzleId: gameState.puzzleId,
          attempts: newGuesses.length,
          won: isCorrect,
          guesses: newGuesses,
          hintsUnlocked: newHintsUnlocked,
        };
        saveGameResult(result);
        clearCurrentGameState();
        setHasPlayedToday(true);
        setTodayResult(result);
      }

      return true;
    },
    [puzzle, gameState]
  );

  return {
    gameState,
    makeGuess,
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
    won: false,
    gameOver: false,
  };
}
