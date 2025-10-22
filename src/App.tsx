import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import StatsModal from './components/StatsModal';
import HelpModal from './components/HelpModal';
import { usePuzzle } from './hooks/usePuzzle';
import { useGameState } from './hooks/useGameState';

function App() {
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const { puzzle, bookList, firstPuzzleDate, loading, error } = usePuzzle();
  const { gameState, makeGuess } = useGameState(puzzle);

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
