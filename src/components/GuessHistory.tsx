import type { GameAction } from '../types';
import './GuessHistory.css';

interface GuessHistoryProps {
  actionHistory: GameAction[];
  correctAnswer?: string;
  gameOver: boolean;
  won: boolean;
}

export default function GuessHistory({ actionHistory, correctAnswer, gameOver, won }: GuessHistoryProps) {
  if (actionHistory.length === 0 && !gameOver) {
    return null;
  }

  return (
    <div className="guess-history">
      <h3 className="history-title">Your Guesses</h3>
      <div className="guesses-list">
        {actionHistory.map((action, idx) => {
          if (action.type === 'hint') {
            return (
              <div key={`hint-${idx}`} className="guess-item hint-item">
                <span className="guess-number">{idx + 1}</span>
                <span className="guess-text hint-text">Used a hint</span>
                <span className="guess-icon">💡</span>
              </div>
            );
          }

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
