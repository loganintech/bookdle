import { useState } from 'react';
import { shareGameResult } from '../utils/shareUtils';
import './ResultModal.css';

interface ResultModalProps {
  won: boolean;
  attempts: number;
  correctAnswer: string;
  author: string;
  date: string;
  firstPuzzleDate: string;
  onClose: () => void;
}

export default function ResultModal({
  won,
  attempts,
  correctAnswer,
  author,
  date,
  firstPuzzleDate,
  onClose,
}: ResultModalProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const success = await shareGameResult(
      date,
      firstPuzzleDate,
      attempts,
      won,
      attempts
    );

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-body">
          {won ? (
            <>
              <h2 className="modal-title success">Congratulations!</h2>
              <p className="modal-message">
                You guessed the book in {attempts} {attempts === 1 ? 'try' : 'tries'}!
              </p>
            </>
          ) : (
            <>
              <h2 className="modal-title failure">Game Over</h2>
              <p className="modal-message">
                Better luck tomorrow!
              </p>
            </>
          )}

          <div className="answer-display">
            <div className="answer-book">{correctAnswer}</div>
            <div className="answer-author">by {author}</div>
          </div>

          <button className="share-button" onClick={handleShare}>
            {copied ? '✓ Copied!' : '📋 Share Result'}
          </button>
        </div>
      </div>
    </div>
  );
}
