import { useState } from 'react';
import type { Puzzle } from '../types';
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
    won: boolean;
    gameOver: boolean;
  };
  onGuess: (guess: string) => void;
}

export default function GameBoard({
  puzzle,
  bookList,
  firstPuzzleDate,
  gameState,
  onGuess,
}: GameBoardProps) {
  const [showResult, setShowResult] = useState(false);

  const handleGuess = (guess: string) => {
    onGuess(guess);

    // Show result modal after a slight delay if game is over
    setTimeout(() => {
      if (
        (guess.toLowerCase() === puzzle.book.toLowerCase()) ||
        (gameState.guesses.length + 1 >= 5)
      ) {
        setShowResult(true);
      }
    }, 500);
  };

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
        guesses={gameState.guesses}
        correctAnswer={gameState.won ? puzzle.book : undefined}
      />

      {gameState.guesses.length > 0 && (
        <HintDisplay puzzle={puzzle} hintsUnlocked={gameState.hintsUnlocked} />
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
