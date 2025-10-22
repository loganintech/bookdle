import type { Puzzle } from '../types';
import './HintDisplay.css';

interface HintDisplayProps {
  puzzle: Puzzle;
  hintsUnlocked: number;
}

export default function HintDisplay({ puzzle, hintsUnlocked }: HintDisplayProps) {
  const hints = [
    { label: 'Year', value: puzzle.year, unlockAt: 1 },
    { label: 'Genre', value: puzzle.genre, unlockAt: 2 },
    { label: 'Length', value: puzzle.length, unlockAt: 3 },
    { label: 'Author', value: puzzle.author, unlockAt: 4 },
  ];

  return (
    <div className="hint-display">
      <h3 className="hint-title">Hints</h3>
      <div className="hints-grid">
        {hints.map((hint) => (
          <div
            key={hint.label}
            className={`hint-card ${
              hintsUnlocked >= hint.unlockAt ? 'unlocked' : 'locked'
            }`}
          >
            <div className="hint-label">{hint.label}</div>
            <div className="hint-value">
              {hintsUnlocked >= hint.unlockAt ? hint.value : '???'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
