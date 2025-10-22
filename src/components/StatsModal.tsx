import { useMemo } from 'react';
import { calculateStats, downloadFile, exportHistoryAsJSON, exportHistoryAsCSV } from '../utils/storageUtils';
import './StatsModal.css';

interface StatsModalProps {
  onClose: () => void;
}

export default function StatsModal({ onClose }: StatsModalProps) {
  const stats = useMemo(() => calculateStats(), []);

  const winPercentage = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  const maxDistribution = Math.max(...Object.values(stats.guessDistribution), 1);

  const handleDownloadJSON = () => {
    const json = exportHistoryAsJSON();
    downloadFile(json, 'bookdle-history.json', 'application/json');
  };

  const handleDownloadCSV = () => {
    const csv = exportHistoryAsCSV();
    downloadFile(csv, 'bookdle-history.csv', 'text/csv');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content stats-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className="modal-title">Statistics</h2>

        <div className="stats-summary">
          <div className="stat-item">
            <div className="stat-value">{stats.gamesPlayed}</div>
            <div className="stat-label">Played</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{winPercentage}%</div>
            <div className="stat-label">Win %</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.maxStreak}</div>
            <div className="stat-label">Max Streak</div>
          </div>
        </div>

        <div className="guess-distribution">
          <h3 className="distribution-title">Guess Distribution</h3>
          <div className="distribution-chart">
            {Object.entries(stats.guessDistribution).map(([guesses, count]) => (
              <div key={guesses} className="distribution-row">
                <div className="distribution-label">{guesses}</div>
                <div className="distribution-bar-container">
                  <div
                    className="distribution-bar"
                    style={{
                      width: `${count > 0 ? Math.max((count / maxDistribution) * 100, 10) : 0}%`,
                    }}
                  >
                    <span className="distribution-count">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="download-section">
          <h3 className="download-title">Download History</h3>
          <div className="download-buttons">
            <button className="download-button" onClick={handleDownloadJSON}>
              Download JSON
            </button>
            <button className="download-button" onClick={handleDownloadCSV}>
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
