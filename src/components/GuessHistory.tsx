import './GuessHistory.css';

interface GuessHistoryProps {
  guesses: string[];
  correctAnswer?: string;
}

export default function GuessHistory({ guesses, correctAnswer }: GuessHistoryProps) {
  if (guesses.length === 0) {
    return null;
  }

  return (
    <div className="guess-history">
      <h3 className="history-title">Your Guesses</h3>
      <div className="guesses-list">
        {guesses.map((guess, index) => {
          const isCorrect =
            correctAnswer &&
            guess.toLowerCase() === correctAnswer.toLowerCase();

          return (
            <div
              key={index}
              className={`guess-item ${isCorrect ? 'correct' : 'incorrect'}`}
            >
              <span className="guess-number">{index + 1}</span>
              <span className="guess-text">{guess}</span>
              <span className="guess-icon">{isCorrect ? '✓' : '✗'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
