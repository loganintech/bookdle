# Bookdle

A daily word game where you guess the book from its first sentence. Like Wordle, but for book lovers!

## Features

- **Daily Puzzle**: A new book to guess every day
- **Progressive Hints**: Get hints (year, genre, length, author) after each wrong guess
- **5 Attempts**: You have 5 tries to guess correctly
- **Share Results**: Share your results with friends
- **Statistics**: Track your game history and stats
- **Local Storage**: Your game history is saved in your browser
- **Export Data**: Download your game history as JSON or CSV

## How to Play

1. Read the first sentence of the book
2. Type your guess and select from the autocomplete suggestions
3. After each wrong guess, you'll unlock a new hint
4. Try to guess the book in 5 attempts or fewer!

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bookdle.git
   cd bookdle
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173/bookdle/](http://localhost:5173/bookdle/) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup Instructions

1. Go to your GitHub repository settings
2. Navigate to **Pages** under the **Code and automation** section
3. Under **Build and deployment**:
   - Set **Source** to "GitHub Actions"
4. Push to the `main` branch, and the site will automatically deploy

### Manual Deployment

If you prefer to deploy manually:

```bash
npm run build
# Then upload the contents of the `dist` folder to your hosting provider
```

## Project Structure

```
bookdle/
├── public/
│   └── data/
│       └── puzzles.json          # All puzzle data
├── src/
│   ├── components/               # React components
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Entry point
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions deployment
└── package.json
```

## Adding New Puzzles

To add new puzzles, edit `public/data/puzzles.json`:

```json
{
  "puzzles": [
    {
      "id": 1,
      "date": "2025-10-22",
      "firstSentence": "It was a bright cold day in April, and the clocks were striking thirteen.",
      "book": "1984",
      "author": "George Orwell",
      "year": 1949,
      "genre": "Dystopian Fiction",
      "length": "Medium (328 pages)"
    }
  ]
}
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **GitHub Pages** - Hosting
- **GitHub Actions** - CI/CD

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
