import { useState, useEffect, useRef } from 'react';
import type { Puzzle, GameAction } from '../types';
import GuessInput from './GuessInput';
import HintDisplay from './HintDisplay';
import GuessHistory from './GuessHistory';
import ResultModal from './ResultModal';
import { shareGameResult } from '../utils/shareUtils';
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
  const [copied, setCopied] = useState(false);
  const hasShownResultRef = useRef(false);
  const justCompletedRef = useRef(false);

  // Reset when puzzle changes
  useEffect(() => {
    hasShownResultRef.current = false;
    justCompletedRef.current = false;
    setShowResult(false);
    setCopied(false);
  }, [puzzle.id]);

  const handleGuess = (guess: string) => {
    const wasGameOver = gameState.gameOver;
    onGuess(guess);

    // Show result modal after a slight delay if this guess wins the game
    setTimeout(() => {
      if (!wasGameOver && guess.toLowerCase() === puzzle.book.toLowerCase()) {
        justCompletedRef.current = true;
        setShowResult(true);
        hasShownResultRef.current = true;
      }
    }, 500);
  };

  // Don't need to show modal for losses - the banner is enough

  const handleShare = async () => {
    const success = await shareGameResult(
      puzzle.date,
      firstPuzzleDate,
      gameState.actionHistory.length,
      gameState.won,
      gameState.actionHistory.length
    );

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="game-board">
      {gameState.gameOver && (
        <div className={`completion-banner ${gameState.won ? 'won' : 'lost'}`}>
          <div className="completion-info">
            <div className="completion-icon">{gameState.won ? '🎉' : '📚'}</div>
            <div className="completion-text">
              {gameState.won ? (
                <>
                  <strong>Solved!</strong> You got it in {gameState.actionHistory.length} {gameState.actionHistory.length === 1 ? 'attempt' : 'attempts'}
                </>
              ) : (
                <>
                  <strong>Completed</strong> ({gameState.actionHistory.length} attempts)
                </>
              )}
            </div>
          </div>
          <button className="banner-share-button" onClick={handleShare}>
            {copied ? '✓ Copied!' : '📋 Share'}
          </button>
        </div>
      )}

      <div className="sentence-display">
        <h2 className="sentence-label">First Sentence:</h2>
        <p className="sentence-text">{puzzle.firstSentence}</p>
      </div>

      <HintDisplay
        puzzle={puzzle}
        hintsUnlocked={gameState.hintsUnlocked}
        gameOver={gameState.gameOver}
      />

      <GuessInput
        bookList={bookList}
        onGuess={handleGuess}
        disabled={gameState.gameOver}
        previousGuesses={gameState.guesses}
      />

      {!gameState.gameOver && gameState.hintsUnlocked < 4 && gameState.actionHistory.length < 5 && (
        <div className="hint-button-container">
          <button className="hint-button" onClick={onGetHint}>
            Get Hint ({Math.min(4 - gameState.hintsUnlocked, 5 - gameState.actionHistory.length)} remaining)
          </button>
        </div>
      )}

      <GuessHistory
        actionHistory={gameState.actionHistory}
        correctAnswer={puzzle.book}
        gameOver={gameState.gameOver}
        won={gameState.won}
      />

      {gameState.gameOver && showResult && (
        <ResultModal
          won={gameState.won}
          attempts={gameState.actionHistory.length}
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
