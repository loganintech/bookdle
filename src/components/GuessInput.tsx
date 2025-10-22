import { useState, useRef, useEffect } from 'react';
import './GuessInput.css';

interface GuessInputProps {
  bookList: string[];
  onGuess: (guess: string) => void;
  disabled: boolean;
  previousGuesses: string[];
}

export default function GuessInput({
  bookList,
  onGuess,
  disabled,
  previousGuesses,
}: GuessInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (input.trim().length > 0) {
      const filtered = bookList
        .filter(
          (book) =>
            book.toLowerCase().includes(input.toLowerCase()) &&
            !previousGuesses.includes(book)
        )
        .slice(0, 8); // Limit to 8 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [input, bookList, previousGuesses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    let guessValue = input.trim();

    // If a suggestion is selected, use it
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      guessValue = suggestions[selectedIndex];
    }

    if (guessValue) {
      onGuess(guessValue);
      setInput('');
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (book: string) => {
    setInput(book);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onGuess(book);
    setInput('');
  };

  return (
    <div className="guess-input-container">
      <form onSubmit={handleSubmit} className="guess-form">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              setShowSuggestions(suggestions.length > 0 && input.length > 0)
            }
            placeholder="Type a book title..."
            className="guess-input"
            disabled={disabled}
            autoComplete="off"
          />
          <button
            type="submit"
            className="guess-button"
            disabled={disabled || !input.trim()}
          >
            Guess
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div ref={suggestionsRef} className="suggestions">
            {suggestions.map((book, index) => (
              <div
                key={book}
                className={`suggestion ${
                  index === selectedIndex ? 'selected' : ''
                }`}
                onClick={() => handleSuggestionClick(book)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {book}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
