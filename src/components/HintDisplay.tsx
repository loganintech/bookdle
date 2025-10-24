import type { Puzzle } from '../types';
import './HintDisplay.css';

interface HintDisplayProps {
  puzzle: Puzzle;
  hintsUnlocked: number;
  gameOver?: boolean;
}

export default function HintDisplay({ puzzle, hintsUnlocked, gameOver = false }: HintDisplayProps) {
  const hints = [
    { label: 'Year', value: puzzle.year, unlockAt: 1 },
    { label: 'Genre', value: puzzle.genre, unlockAt: 2 },
    { label: 'Length', value: `${puzzle.length} (${puzzle.pageCount} pages)`, unlockAt: 3 },
    { label: 'Author', value: puzzle.author, unlockAt: 4 },
  ];

  return (
    <div className="hint-display">
      <h3 className="hint-title">Hints</h3>
      <div className="hints-grid">
        {hints.map((hint) => {
          const isUnlocked = gameOver || hintsUnlocked >= hint.unlockAt;
          return (
            <div
              key={hint.label}
              className={`hint-card ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="hint-label">{hint.label}</div>
              <div className="hint-value">
                {isUnlocked ? hint.value : '???'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
