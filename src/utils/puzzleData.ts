import type { Puzzle, PuzzleData, PuzzleDataWithIds } from '../types';

let cachedPuzzles: Puzzle[] | null = null;

/**
 * Calculate length label from page count
 * < 200: Short
 * 200-499: Medium
 * 500-899: Long
 * 900+: Very Long
 */
export function calculateLength(pageCount: number): string {
  if (pageCount < 200) return 'Short';
  if (pageCount < 500) return 'Medium';
  if (pageCount < 900) return 'Long';
  return 'Very Long';
}

/**
 * Load puzzle data from JSON file and add IDs based on array index
 */
export async function loadPuzzleData(): Promise<PuzzleDataWithIds> {
  if (cachedPuzzles) {
    return { puzzles: cachedPuzzles };
  }

  try {
    const response = await fetch('/bookdle/data/puzzles.json');
    if (!response.ok) {
      throw new Error('Failed to load puzzle data');
    }
    const data = await response.json() as PuzzleData;

    // Add IDs and calculate length labels based on array index (1-indexed)
    cachedPuzzles = data.puzzles.map((puzzle, index) => ({
      ...puzzle,
      id: index + 1,
      length: calculateLength(puzzle.pageCount),
    }));

    return { puzzles: cachedPuzzles };
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
  // loadPuzzleData already returns Puzzle objects with IDs
  const puzzle = data.puzzles.find(p => p.date === date);
  return puzzle || null;
}

/**
 * Get all book titles for autocomplete, merging puzzle books with additional titles
 */
export async function getAllBookTitles(): Promise<string[]> {
  // Get puzzle books (these must always be included)
  const puzzleData = await loadPuzzleData();
  const puzzleBooks = puzzleData.puzzles.map(p => p.book);

  // Try to load additional book titles
  let additionalBooks: string[] = [];
  try {
    const response = await fetch('/bookdle/data/book_titles.json');
    if (response.ok) {
      additionalBooks = await response.json() as string[];
    }
  } catch (error) {
    console.error('Error loading book titles (using puzzle books only):', error);
  }

  // Merge and deduplicate
  const allBooks = new Set([...puzzleBooks, ...additionalBooks]);
  return Array.from(allBooks).sort();
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
