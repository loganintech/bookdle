# Bookdle - Project Implementation Plan

## Project Overview
A daily word game where players guess a book based on its first sentence, with progressive hints revealed after each wrong guess.

## Technical Architecture

### Tech Stack
- React 18 + TypeScript
- Vite (for fast dev experience and build)
- CSS Modules or Tailwind CSS (for styling)
- No external state management (React hooks sufficient)
- GitHub Pages for hosting

### Project Structure
```
bookdle/
├── public/
│   └── data/
│       └── puzzles.json          # All puzzle data
├── src/
│   ├── components/
│   │   ├── GameBoard.tsx         # Main game container
│   │   ├── GuessInput.tsx        # Book search/input
│   │   ├── HintDisplay.tsx       # Progressive hints
│   │   ├── GuessHistory.tsx      # List of previous guesses
│   │   ├── ResultModal.tsx       # Win/loss modal with share
│   │   ├── StatsModal.tsx        # Personal stats and history
│   │   └── Header.tsx            # Title and navigation
│   ├── hooks/
│   │   ├── useGameState.ts       # Game logic hook
│   │   ├── useLocalStorage.ts    # localStorage wrapper
│   │   └── usePuzzle.ts          # Current puzzle logic
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── puzzleData.ts         # Puzzle loader
│   │   ├── dateUtils.ts          # Date calculations
│   │   ├── shareUtils.ts         # Share text generation
│   │   └── storageUtils.ts       # localStorage helpers
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## Data Structure

### Puzzle Format (puzzles.json)
```json
{
  "puzzles": [
    {
      "id": 1,
      "date": "2025-01-01",
      "firstSentence": "It was a bright cold day in April, and the clocks were striking thirteen.",
      "book": "1984",
      "author": "George Orwell",
      "year": 1949,
      "genre": "Dystopian Fiction",
      "length": "Medium (326 pages)"
    }
  ],
  "bookList": ["1984", "Pride and Prejudice", ...]
}
```

### LocalStorage Schema
```typescript
{
  // Game history by date
  "bookdle_history": {
    "2025-01-01": {
      "attempts": 3,
      "won": true,
      "guesses": ["Animal Farm", "Brave New World", "1984"],
      "hintsUnlocked": 2
    }
  },
  // Current game state (if incomplete)
  "bookdle_current": {
    "date": "2025-01-02",
    "guesses": ["The Great Gatsby"],
    "hintsUnlocked": 1
  }
}
```

## Game Flow

### Initial Load
1. Check current date
2. Load puzzle for today
3. Check localStorage for existing progress on today's puzzle
4. Restore state if game in progress, or start fresh

### Gameplay Loop
1. Display first sentence
2. Player types/searches for book title
3. Submit guess
4. If correct → Show success modal with share option
5. If incorrect:
   - Add to guess history
   - Unlock next hint (order: year → genre → length → author)
   - If 5 guesses used → Show failure modal with answer
6. Save state to localStorage after each guess

### Hint Progression
- **Guess 1 fails**: Show year
- **Guess 2 fails**: Show year + genre
- **Guess 3 fails**: Show year + genre + length
- **Guess 4 fails**: Show year + genre + length + author
- **Guess 5 fails**: Game over

## Key Features

### A. Guess Input
- Autocomplete dropdown from book list
- Fuzzy search for better UX
- Prevent duplicate guesses
- Mobile-friendly input

### B. Share Functionality
Generate copyable text like:
```
Bookdle #42 3/5

📕📕📗
```
- 📕 = incorrect guess
- 📗 = correct guess

### C. Stats Display
- Total games played
- Win percentage
- Current streak
- Guess distribution (1-5 attempts)
- History by date

### D. Download History
Export as JSON or CSV:
```csv
Date,Book,Attempts,Won
2025-01-01,1984,3,true
2025-01-02,Pride and Prejudice,5,false
```

### E. Past Puzzles
- Allow playing previous puzzles (archive mode)
- Don't count toward stats
- Different visual indicator

## UX Design Principles

### Visual Style
- Clean, minimal interface (Wordle-inspired)
- Color scheme: Muted earth tones for book theme
- Typography: Serif font for sentences, sans-serif for UI
- Responsive design (mobile-first)

### Key UI Elements
- Large, readable first sentence display
- Clear hint cards that "unlock" with animation
- Visual feedback on guess submission
- Smooth transitions and micro-interactions

## Implementation Phases

### Phase 1: Core Setup ✅
- [x] Initialize Vite + React + TypeScript
- [x] Set up project structure
- [x] Create basic routing/layout
- [x] Add .gitignore and initial configuration

### Phase 2: Data Layer ✅
- [x] Define TypeScript interfaces
- [x] Create puzzles.json with initial set of puzzles (30 days)
- [x] Build puzzle loader utility
- [x] Implement date-based puzzle selection

### Phase 3: Game Logic ✅
- [x] useGameState hook for game management
- [x] Guess validation
- [x] Hint unlocking logic
- [x] Win/loss detection

### Phase 4: UI Components ✅
- [x] GameBoard layout
- [x] GuessInput with autocomplete
- [x] HintDisplay with progressive reveal
- [x] GuessHistory list
- [x] Header component

### Phase 5: Persistence ✅
- [x] LocalStorage integration
- [x] Save/restore game state
- [x] History tracking
- [x] useLocalStorage hook

### Phase 6: Polish ✅
- [x] ResultModal with share button
- [x] StatsModal with download
- [x] Styling and animations
- [x] Mobile responsiveness
- [x] Accessibility improvements

### Phase 7: Deployment ✅
- [x] Configure GitHub Pages
- [x] Set up build process
- [x] Add GitHub Actions workflow
- [x] Create deployment documentation

## Edge Cases Handled

- [x] User plays at different times of day
- [x] Timezone considerations (use UTC for consistency)
- [x] Missing puzzles for a date
- [x] Clearing localStorage
- [x] Browser back/forward navigation
- [x] Multiple tabs open

## Future Enhancements (Optional)
- [ ] Dark mode toggle
- [ ] Settings (hard mode, etc.)
- [ ] Practice mode with random old puzzles
- [ ] Hint customization
- [ ] Social features (leaderboards if backend added later)

---

## Progress Log

### 2025-10-22 - Initial Setup
- Created comprehensive project plan
- Set up Vite + React + TypeScript project structure

### 2025-10-22 - Data Layer & Game Logic
- Defined TypeScript interfaces
- Created puzzles.json with 30 famous book first sentences
- Implemented utility functions for date handling, puzzle loading, storage, and sharing
- Built custom hooks (useGameState, usePuzzle, useLocalStorage)

### 2025-10-22 - UI Components
- Built Header component with stats and help buttons
- Created GuessInput with autocomplete functionality
- Implemented HintDisplay with progressive reveal animations
- Built GuessHistory to show previous attempts
- Created GameBoard to tie everything together

### 2025-10-22 - Modals & Polish
- Built ResultModal with share functionality
- Created StatsModal with game statistics and download history
- Added HelpModal with game instructions
- Styled all components with clean, book-themed design

### 2025-10-22 - Deployment
- Configured GitHub Actions for automatic deployment
- Set up GitHub Pages deployment workflow
- Created comprehensive README with deployment instructions
- **Project Complete!**

---

## Notes
- Keep all book data in plaintext (puzzles.json)
- Frontend-only, no backend required
- Use GitHub Pages for free hosting
- LocalStorage for all user data persistence
