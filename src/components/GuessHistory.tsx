import type { GameAction } from '../types';
import './GuessHistory.css';

interface GuessHistoryProps {
  actionHistory: GameAction[];
  correctAnswer?: string;
  gameOver: boolean;
  won: boolean;
}

export default function GuessHistory({ actionHistory, correctAnswer, gameOver, won }: GuessHistoryProps) {
  // Always show the guess history container with pre-allocated slots
  const MAX_ATTEMPTS = 5;

  // Create array of 5 slots, filled with actual actions or empty
  const slots = Array.from({ length: MAX_ATTEMPTS }, (_, idx) => {
    if (idx < actionHistory.length) {
      return actionHistory[idx];
    }
    return null;
  });

  return (
    <div className="guess-history">
      <h3 className="history-title">Your Guesses</h3>
      <div className="guesses-list">
        {slots.map((action, idx) => {
          // Empty slot
          if (!action) {
            return (
              <div key={`empty-${idx}`} className="guess-item empty">
                <span className="guess-number">{idx + 1}</span>
                <span className="guess-text empty-text">—</span>
                <span className="guess-icon"></span>
              </div>
            );
          }

          // Hint action
          if (action.type === 'hint') {
            return (
              <div key={`hint-${idx}`} className="guess-item hint-item">
                <span className="guess-number">{idx + 1}</span>
                <span className="guess-text hint-text">Used a hint</span>
                <span className="guess-icon">💡</span>
              </div>
            );
          }

          // Guess action
          const isCorrect =
            correctAnswer &&
            action.value.toLowerCase() === correctAnswer.toLowerCase();

          return (
            <div
              key={`guess-${idx}`}
              className={`guess-item ${isCorrect ? 'correct' : 'incorrect'}`}
            >
              <span className="guess-number">{idx + 1}</span>
              <span className="guess-text">{action.value}</span>
              <span className="guess-icon">{isCorrect ? '✓' : '✗'}</span>
            </div>
          );
        })}

        {gameOver && !won && correctAnswer && (
          <div className="correct-answer-reveal">
            <span className="reveal-label">The answer was:</span>
            <span className="reveal-answer">{correctAnswer}</span>
          </div>
        )}
      </div>
    </div>
  );
}
