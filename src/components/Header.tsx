import './Header.css';

interface HeaderProps {
  onShowStats: () => void;
  onShowHelp: () => void;
}

export default function Header({ onShowStats, onShowHelp }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <button
          className="header-button"
          onClick={onShowHelp}
          aria-label="How to play"
        >
          ?
        </button>
        <div className="header-title">
          <h1>Bookdle</h1>
          <p className="subtitle">Guess the book from its first sentence</p>
        </div>
        <button
          className="header-button"
          onClick={onShowStats}
          aria-label="View statistics"
        >
          📊
        </button>
      </div>
    </header>
  );
}
