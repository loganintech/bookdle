import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import StatsModal from './components/StatsModal';
import HelpModal from './components/HelpModal';
import PuzzleNavigation from './components/PuzzleNavigation';
import { usePuzzle } from './hooks/usePuzzle';
import { useGameState } from './hooks/useGameState';
import { getAllPuzzleDates } from './utils/puzzleData';
import { getTodayDate } from './utils/dateUtils';

function App() {
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [viewingDate, setViewingDate] = useState<string | undefined>(() => {
    // Check URL for date parameter
    const params = new URLSearchParams(window.location.search);
    const urlDate = params.get('date');

    // In production, don't allow future dates via URL
    if (urlDate && !import.meta.env.DEV) {
      const today = getTodayDate();
      if (urlDate > today) {
        return undefined; // Redirect to today
      }
    }

    return urlDate || undefined;
  });
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const { puzzle, bookList, firstPuzzleDate, loading, error } = usePuzzle(viewingDate);
  const { gameState, makeGuess, getHint } = useGameState(puzzle);

  // Load available puzzle dates
  useEffect(() => {
    getAllPuzzleDates().then(dates => setAvailableDates(dates));
  }, []);

  // Update URL when viewing date changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (viewingDate) {
      params.set('date', viewingDate);
    } else {
      params.delete('date');
    }
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [viewingDate]);

  const currentDate = viewingDate || getTodayDate();
  const todayDate = getTodayDate();
  const currentIndex = availableDates.indexOf(currentDate);
  const todayIndex = availableDates.indexOf(todayDate);

  const hasPrevious = currentIndex > 0;
  // Can only go to next if we're not at today or beyond (unless in dev mode)
  const hasNext = currentIndex < availableDates.length - 1 &&
                  currentIndex !== -1 &&
                  (import.meta.env.DEV || currentIndex < todayIndex);
  const isToday = !viewingDate || viewingDate === todayDate;

  const handlePrevious = () => {
    if (hasPrevious) {
      setViewingDate(availableDates[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setViewingDate(availableDates[currentIndex + 1]);
    }
  };

  const handleToday = () => {
    setViewingDate(undefined);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading today's puzzle...</div>
      </div>
    );
  }

  if (error || !puzzle) {
    return (
      <div className="app">
        <div className="error">
          <h2>Oops!</h2>
          <p>{error || 'No puzzle available for today.'}</p>
          <p>Please check back tomorrow!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header onShowStats={() => setShowStats(true)} onShowHelp={() => setShowHelp(true)} />

      <main className="main">
        <PuzzleNavigation
          currentDate={currentDate}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          isToday={isToday}
        />

        <GameBoard
          puzzle={puzzle}
          bookList={bookList}
          firstPuzzleDate={firstPuzzleDate}
          gameState={gameState}
          onGuess={makeGuess}
          onGetHint={getHint}
        />
      </main>

      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

export default App;
