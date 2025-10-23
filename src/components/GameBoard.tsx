import { useState, useEffect, useRef } from 'react';
import type { Puzzle, GameAction } from '../types';
import GuessInput from './GuessInput';
import HintDisplay from './HintDisplay';
import GuessHistory from './GuessHistory';
import ResultModal from './ResultModal';
import './GameBoard.css';

interface GameBoardProps {
  puzzle: Puzzle;
  bookList: string[];
  firstPuzzleDate: string;
  gameState: {
    guesses: string[];
    hintsUnlocked: number;
    hintsRequested: number;
    actionHistory: GameAction[];
    won: boolean;
    gameOver: boolean;
  };
  onGuess: (guess: string) => void;
  onGetHint: () => void;
}

export default function GameBoard({
  puzzle,
  bookList,
  firstPuzzleDate,
  gameState,
  onGuess,
  onGetHint,
}: GameBoardProps) {
  const [showResult, setShowResult] = useState(false);
  const hasShownResultRef = useRef(false);

  // Reset when puzzle changes
  useEffect(() => {
    hasShownResultRef.current = false;
    setShowResult(false);
  }, [puzzle.id]);

  const handleGuess = (guess: string) => {
    onGuess(guess);

    // Show result modal after a slight delay if game is over
    setTimeout(() => {
      if (guess.toLowerCase() === puzzle.book.toLowerCase()) {
        setShowResult(true);
        hasShownResultRef.current = true;
      }
    }, 500);
  };

  // Show result modal when game ends (including when using all actions)
  useEffect(() => {
    if (gameState.gameOver && !hasShownResultRef.current) {
      const timer = setTimeout(() => {
        setShowResult(true);
        hasShownResultRef.current = true;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.gameOver]);

  return (
    <div className="game-board">
      <div className="sentence-display">
        <h2 className="sentence-label">First Sentence:</h2>
        <p className="sentence-text">{puzzle.firstSentence}</p>
      </div>

      <GuessInput
        bookList={bookList}
        onGuess={handleGuess}
        disabled={gameState.gameOver}
        previousGuesses={gameState.guesses}
      />

      <GuessHistory
        actionHistory={gameState.actionHistory}
        correctAnswer={puzzle.book}
        gameOver={gameState.gameOver}
        won={gameState.won}
      />

      <HintDisplay
        puzzle={puzzle}
        hintsUnlocked={gameState.hintsUnlocked}
        gameOver={gameState.gameOver}
      />

      {!gameState.gameOver && gameState.hintsUnlocked < 4 && gameState.actionHistory.length < 5 && (
        <div className="hint-button-container">
          <button className="hint-button" onClick={onGetHint}>
            Get Hint ({Math.min(4 - gameState.hintsUnlocked, 5 - gameState.actionHistory.length)} remaining)
          </button>
        </div>
      )}

      {gameState.gameOver && showResult && (
        <ResultModal
          won={gameState.won}
          attempts={gameState.guesses.length}
          correctAnswer={puzzle.book}
          author={puzzle.author}
          date={puzzle.date}
          firstPuzzleDate={firstPuzzleDate}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
}
