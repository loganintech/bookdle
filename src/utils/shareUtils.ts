import { getPuzzleNumber } from './dateUtils';

/**
 * Generate shareable text for game results
 */
export async function generateShareText(
  date: string,
  firstPuzzleDate: string,
  attempts: number,
  won: boolean,
  totalGuesses: number
): Promise<string> {
  const puzzleNumber = getPuzzleNumber(date, firstPuzzleDate);

  let scoreText: string;
  if (won) {
    scoreText = `${attempts}/5`;
  } else {
    scoreText = 'X/5';
  }

  // Generate emoji grid
  const emojis: string[] = [];
  for (let i = 0; i < totalGuesses; i++) {
    if (i === attempts - 1 && won) {
      emojis.push('📗'); // Green book for correct guess
    } else {
      emojis.push('📕'); // Red book for incorrect guess
    }
  }

  const emojiGrid = emojis.join('');

  return `Bookdle #${puzzleNumber} ${scoreText}\n\n${emojiGrid}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Generate share text and copy to clipboard
 */
export async function shareGameResult(
  date: string,
  firstPuzzleDate: string,
  attempts: number,
  won: boolean,
  totalGuesses: number
): Promise<boolean> {
  const shareText = await generateShareText(
    date,
    firstPuzzleDate,
    attempts,
    won,
    totalGuesses
  );
  return await copyToClipboard(shareText);
}
