import type { Puzzle, PuzzleData } from '../types';

let cachedPuzzleData: PuzzleData | null = null;

/**
 * Load puzzle data from JSON file
 */
export async function loadPuzzleData(): Promise<PuzzleData> {
  if (cachedPuzzleData) {
    return cachedPuzzleData;
  }

  try {
    const response = await fetch('/bookdle/data/puzzles.json');
    if (!response.ok) {
      throw new Error('Failed to load puzzle data');
    }
    cachedPuzzleData = await response.json();
    return cachedPuzzleData as PuzzleData;
  } catch (error) {
    console.error('Error loading puzzle data:', error);
    throw error;
  }
}

/**
 * Get puzzle for a specific date
 */
export async function getPuzzleByDate(date: string): Promise<Puzzle | null> {
  const data = await loadPuzzleData();
  const puzzle = data.puzzles.find(p => p.date === date);
  return puzzle || null;
}

/**
 * Get all book titles for autocomplete
 */
export async function getAllBookTitles(): Promise<string[]> {
  const data = await loadPuzzleData();
  return data.puzzles.map(p => p.book).sort();
}

/**
 * Get the first puzzle date
 */
export async function getFirstPuzzleDate(): Promise<string> {
  const data = await loadPuzzleData();
  if (data.puzzles.length === 0) {
    throw new Error('No puzzles available');
  }

  const dates = data.puzzles.map(p => p.date).sort();
  return dates[0];
}

/**
 * Check if a puzzle exists for a given date
 */
export async function hasPuzzleForDate(date: string): Promise<boolean> {
  const puzzle = await getPuzzleByDate(date);
  return puzzle !== null;
}

/**
 * Get all available puzzle dates sorted chronologically
 */
export async function getAllPuzzleDates(): Promise<string[]> {
  const data = await loadPuzzleData();
  return data.puzzles.map(p => p.date).sort();
}
