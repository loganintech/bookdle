import './HelpModal.css';

interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content help-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className="modal-title">How to Play</h2>

        <div className="help-content">
          <p className="help-intro">
            Guess the book from its first sentence in 5 tries or fewer!
          </p>

          <div className="help-section">
            <h3>How It Works</h3>
            <ul>
              <li>Each day features a new book and its opening sentence</li>
              <li>Type your guess and select from the dropdown</li>
              <li>Get a new hint after each incorrect guess</li>
              <li>You have 5 attempts to guess correctly</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>Hints Revealed</h3>
            <ol>
              <li><strong>After 1st wrong guess:</strong> Publication year</li>
              <li><strong>After 2nd wrong guess:</strong> Genre</li>
              <li><strong>After 3rd wrong guess:</strong> Book length</li>
              <li><strong>After 4th wrong guess:</strong> Author name</li>
            </ol>
          </div>

          <div className="help-section">
            <h3>Tips</h3>
            <ul>
              <li>Use autocomplete to quickly find books</li>
              <li>Pay attention to the writing style and tone</li>
              <li>Historical and contextual clues in the sentence can help</li>
              <li>A new puzzle is released daily at midnight UTC</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
