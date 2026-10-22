/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Pure business logic and calculation utilities for Nihongo Nakama

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  feedback: string;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: 'Weak', feedback: 'Enter a password' };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const normalizedScore = Math.min(score, 4);

  const labels: Record<number, 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong'> = {
    0: 'Weak',
    1: 'Fair',
    2: 'Good',
    3: 'Strong',
    4: 'Very Strong',
  };

  const feedbackMessages: Record<number, string> = {
    0: 'Too short (min 8 characters)',
    1: 'Add capital letters, numbers, or symbols',
    2: 'Good, but add special symbols for high security',
    3: 'Strong password',
    4: 'Excellent security grade',
  };

  return {
    score: normalizedScore,
    label: labels[normalizedScore],
    feedback: feedbackMessages[normalizedScore],
  };
}

export interface SRSItem {
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: string; // ISO string
}

export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';

/**
 * SuperMemo SM-2 spaced repetition calculation
 */
export function calculateNextSRSReview(
  item: SRSItem,
  grade: ReviewGrade,
  baseDate: Date = new Date()
): SRSItem {
  let { repetitions, intervalDays, easeFactor } = item;
  let q = 3; // default good
  if (grade === 'again') q = 1;
  else if (grade === 'hard') q = 2;
  else if (grade === 'good') q = 4;
  else if (grade === 'easy') q = 5;

  if (q < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions++;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + intervalDays);

  return {
    repetitions,
    intervalDays,
    easeFactor: Math.round(easeFactor * 100) / 100,
    nextReviewDate: nextDate.toISOString(),
  };
}

export interface VocabRow {
  japanese: string;
  furigana: string;
  romaji: string;
  meaning: string;
  level: string;
  isFavorite?: boolean;
  isLearned?: boolean;
}

export function exportVocabToCSV(vocabList: VocabRow[]): string {
  const headers = ['Japanese', 'Furigana', 'Romaji', 'Meaning', 'Level', 'Favorite', 'Learned'];
  const rows = vocabList.map(v => [
    `"${(v.japanese || '').replace(/"/g, '""')}"`,
    `"${(v.furigana || '').replace(/"/g, '""')}"`,
    `"${(v.romaji || '').replace(/"/g, '""')}"`,
    `"${(v.meaning || '').replace(/"/g, '""')}"`,
    `"${(v.level || '').replace(/"/g, '""')}"`,
    v.isFavorite ? 'true' : 'false',
    v.isLearned ? 'true' : 'false',
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function parseVocabCSV(csvText: string, defaultLevel: string = 'N5'): VocabRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) return [];

  const results: VocabRow[] = [];
  // Skip header if it matches known column names
  const firstLine = lines[0].toLowerCase();
  const startIndex = firstLine.includes('japanese') || firstLine.includes('meaning') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    // Simple CSV cell splitter supporting quotes
    const regex = /(?:^|,)(\"(?:[^\"]+|\"\")*\"|[^,]*)/g;
    const cells: string[] = [];
    let match;
    while ((match = regex.exec(lines[i])) !== null) {
      let cell = match[1] || '';
      if (cell.startsWith('"') && cell.endsWith('"')) {
        cell = cell.slice(1, -1).replace(/""/g, '"');
      }
      cells.push(cell.trim());
      if (regex.lastIndex === match.index) {
        regex.lastIndex++;
      }
    }

    if (cells.length >= 2 && cells[0]) {
      results.push({
        japanese: cells[0] || '',
        furigana: cells[1] || '',
        romaji: cells[2] || '',
        meaning: cells[3] || cells[1] || '',
        level: cells[4] || defaultLevel,
        isFavorite: cells[5] === 'true',
        isLearned: cells[6] === 'true',
      });
    }
  }

  return results;
}

export function calculateLevelCompletion(
  vocabTotal: number,
  vocabLearned: number,
  kanjiTotal: number,
  kanjiLearned: number,
  grammarTotal: number,
  grammarLearned: number,
  readingTotal: number,
  readingLearned: number
): number {
  const totalItems = vocabTotal + kanjiTotal + grammarTotal + readingTotal;
  if (totalItems === 0) return 0;
  const learnedItems = vocabLearned + kanjiLearned + grammarLearned + readingLearned;
  return Math.min(100, Math.round((learnedItems / totalItems) * 100));
}

export function validateBackupJson(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    return Boolean(
      typeof data === 'object' &&
      data !== null &&
      data.version &&
      Array.isArray(data.vocabulary) &&
      Array.isArray(data.kanji) &&
      Array.isArray(data.grammar)
    );
  } catch {
    return false;
  }
}
