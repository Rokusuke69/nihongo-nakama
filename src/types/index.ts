/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SRSItem } from '../utils/jlptLogic';

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface User {
  id: string;
  username: string;
  email: string;
  streakDays: number;
  dailyGoalMinutes: number;
  minutesStudiedToday: number;
  lastActiveDate: string;
  createdAt: string;
}

export interface VocabItem {
  id: string;
  japanese: string;
  furigana: string;
  romaji: string;
  meaning: string;
  level: JLPTLevel;
  partOfSpeech: string;
  isFavorite: boolean;
  isLearned: boolean;
  srs: SRSItem;
  createdAt: string;
}

export interface KanjiExample {
  word: string;
  reading: string;
  meaning: string;
}

export interface KanjiItem {
  id: string;
  kanji: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  strokeCount: number;
  level: JLPTLevel;
  radical?: string;
  examples: KanjiExample[];
  personalNotes: string;
  isLearned: boolean;
  strokeGuide?: string[]; // instructions or stroke coordinates
  createdAt: string;
}

export interface ExampleSentence {
  japanese: string;
  furigana: string;
  english: string;
}

export interface GrammarItem {
  id: string;
  title: string; // Grammar Point e.g. 〜は〜です
  structure: string; // e.g. [Noun 1] は [Noun 2] です
  meaning: string;
  usageNotes: string;
  exampleSentences: ExampleSentence[];
  commonMistakes: string;
  level: JLPTLevel;
  isLearned: boolean;
  category?: string;
  createdAt: string;
}

export interface ReadingMaterial {
  id: string;
  title: string;
  japaneseTitle: string;
  filename: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'story';
  uploadDate: string;
  coverTheme: 'momotaro' | 'urashima' | 'kaguya' | 'crane' | 'kintaro' | 'custom';
  content: string; // Japanese text with furigana annotations or markdown
  englishSummary: string;
  bookmarks: number[];
  notes: string;
  readingProgress: number; // 0 to 100
  level: JLPTLevel;
  estimatedMinutes: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'vocab' | 'kanji' | 'grammar' | 'reading' | 'revision';
  description: string;
  durationMinutes: number;
}

export interface DailyStudyStat {
  day: string; // e.g. 'Mon', 'Tue'
  date: string;
  minutes: number;
  itemsReviewed: number;
}

export type ActiveWorkspaceTab =
  | 'dashboard'
  | 'vocabulary'
  | 'kanji'
  | 'grammar'
  | 'reading'
  | 'progress'
  | 'revision'
  | 'settings';
