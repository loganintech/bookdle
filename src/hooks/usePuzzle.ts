import { useState, useEffect } from 'react';
import type { Puzzle } from '../types';
import { getPuzzleByDate, getAllBookTitles, getFirstPuzzleDate } from '../utils/puzzleData';
import { getTodayDate } from '../utils/dateUtils';

interface UsePuzzleResult {
  puzzle: Puzzle | null;
  bookList: string[];
  firstPuzzleDate: string;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for loading puzzle data
 */
export function usePuzzle(date?: string): UsePuzzleResult {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [bookList, setBookList] = useState<string[]>([]);
  const [firstPuzzleDate, setFirstPuzzleDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const targetDate = date || getTodayDate();

        // Load puzzle for the date
        const [puzzleData, books, firstDate] = await Promise.all([
          getPuzzleByDate(targetDate),
          getAllBookTitles(),
          getFirstPuzzleDate(),
        ]);

        if (!mounted) return;

        if (!puzzleData) {
          setError(`No puzzle available for ${targetDate}`);
        } else {
          setPuzzle(puzzleData);
        }

        setBookList(books);
        setFirstPuzzleDate(firstDate);
      } catch (err) {
        if (!mounted) return;
        console.error('Error loading puzzle:', err);
        setError('Failed to load puzzle data');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [date]);

  return { puzzle, bookList, firstPuzzleDate, loading, error };
}
