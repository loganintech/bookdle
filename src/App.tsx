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
  const [viewingDate, setViewingDate] = useState<string | undefined>(undefined);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const { puzzle, bookList, firstPuzzleDate, loading, error } = usePuzzle(viewingDate);
  const { gameState, makeGuess } = useGameState(puzzle);

  // Load available puzzle dates
  useEffect(() => {
    getAllPuzzleDates().then(dates => setAvailableDates(dates));
  }, []);

  const currentDate = viewingDate || getTodayDate();
  const currentIndex = availableDates.indexOf(currentDate);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < availableDates.length - 1 && currentIndex !== -1;
  const isToday = !viewingDate || viewingDate === getTodayDate();

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
        {import.meta.env.DEV && (
          <PuzzleNavigation
            currentDate={currentDate}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToday={handleToday}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            isToday={isToday}
          />
        )}

        <GameBoard
          puzzle={puzzle}
          bookList={bookList}
          firstPuzzleDate={firstPuzzleDate}
          gameState={gameState}
          onGuess={makeGuess}
        />
      </main>

      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

export default App;
