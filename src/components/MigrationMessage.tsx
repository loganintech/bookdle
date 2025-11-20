import './MigrationMessage.css';

interface MigrationMessageProps {
  className?: string;
}

function MigrationMessage({ className }: MigrationMessageProps) {
  return (
    <div className={`migration-message ${className || ''}`}>
      <div className="migration-content">
        <h2>Thanks for playing the alpha of Bookdle!</h2>
        <p className="migration-main">
          The game has moved to a new home with exciting new features.
        </p>

        <a
          href="https://bookdle.org"
          className="migration-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Continue playing at bookdle.org
        </a>

        <div className="migration-features">
          <h3>What's new?</h3>
          <ul>
            <li>
              <strong>Login & Account System:</strong> Track your progress and statistics across all your devices
            </li>
            <li>
              <strong>Historical Guesses:</strong> Your game history is saved and accessible from anywhere
            </li>
          </ul>
        </div>

        <p className="migration-footer">
          See you at <a href="https://bookdle.org" target="_blank" rel="noopener noreferrer">bookdle.org</a>!
        </p>
      </div>
    </div>
  );
}

export default MigrationMessage;