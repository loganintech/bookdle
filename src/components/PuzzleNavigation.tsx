import { formatDateForDisplay } from '../utils/dateUtils';
import './PuzzleNavigation.css';

interface PuzzleNavigationProps {
  currentDate: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  isToday: boolean;
}

export default function PuzzleNavigation({
  currentDate,
  onPrevious,
  onNext,
  onToday,
  hasPrevious,
  hasNext,
  isToday,
}: PuzzleNavigationProps) {
  return (
    <div className="puzzle-navigation">
      <button
        className="nav-button"
        onClick={onPrevious}
        disabled={!hasPrevious}
        aria-label="Previous puzzle"
      >
        ← Previous
      </button>

      <div className="nav-date">
        <div className="date-display">{formatDateForDisplay(currentDate)}</div>
        {!isToday && (
          <button className="today-button" onClick={onToday}>
            Back to Today
          </button>
        )}
      </div>

      <button
        className="nav-button"
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next puzzle"
      >
        Next →
      </button>
    </div>
  );
}
