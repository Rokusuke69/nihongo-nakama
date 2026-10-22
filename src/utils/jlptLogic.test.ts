/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluatePasswordStrength,
  calculateNextSRSReview,
  exportVocabToCSV,
  parseVocabCSV,
  calculateLevelCompletion,
  validateBackupJson,
} from './jlptLogic';

test('evaluatePasswordStrength properly rates passwords', () => {
  assert.equal(evaluatePasswordStrength('').score, 0);
  assert.equal(evaluatePasswordStrength('short').score, 0);
  assert.equal(evaluatePasswordStrength('weakpassword').score >= 1, true);
  
  const strong = evaluatePasswordStrength('Sakura#2026!Tokyo');
  assert.equal(strong.score >= 3, true);
  assert.equal(['Strong', 'Very Strong'].includes(strong.label), true);
});

test('calculateNextSRSReview advances intervals on good/easy reviews', () => {
  const initial = {
    repetitions: 0,
    intervalDays: 1,
    easeFactor: 2.5,
    nextReviewDate: new Date('2026-10-21').toISOString(),
  };

  const step1 = calculateNextSRSReview(initial, 'good', new Date('2026-10-21'));
  assert.equal(step1.repetitions, 1);
  assert.equal(step1.intervalDays, 1);

  const step2 = calculateNextSRSReview(step1, 'good', new Date('2026-10-22'));
  assert.equal(step2.repetitions, 2);
  assert.equal(step2.intervalDays, 6);

  const step3Again = calculateNextSRSReview(step2, 'again', new Date('2026-10-28'));
  assert.equal(step3Again.repetitions, 0);
  assert.equal(step3Again.intervalDays, 1);
});

test('exportVocabToCSV and parseVocabCSV roundtrip correctly', () => {
  const sample = [
    {
      japanese: '友達',
      furigana: 'ともだち',
      romaji: 'tomodachi',
      meaning: 'friend, companion (nakama)',
      level: 'N5',
      isFavorite: true,
      isLearned: true,
    },
    {
      japanese: '桜',
      furigana: 'さくら',
      romaji: 'sakura',
      meaning: 'cherry blossom',
      level: 'N5',
      isFavorite: false,
      isLearned: false,
    },
  ];

  const csv = exportVocabToCSV(sample);
  assert.equal(csv.includes('友達'), true);
  assert.equal(csv.includes('sakura'), true);

  const parsed = parseVocabCSV(csv, 'N5');
  assert.equal(parsed.length, 2);
  assert.equal(parsed[0].japanese, '友達');
  assert.equal(parsed[0].meaning, 'friend, companion (nakama)');
  assert.equal(parsed[0].isFavorite, true);
  assert.equal(parsed[1].japanese, '桜');
  assert.equal(parsed[1].isLearned, false);
});

test('calculateLevelCompletion calculates weighted percentage accurately', () => {
  const pct = calculateLevelCompletion(10, 5, 10, 5, 10, 5, 10, 5);
  assert.equal(pct, 50);

  const zeroPct = calculateLevelCompletion(0, 0, 0, 0, 0, 0, 0, 0);
  assert.equal(zeroPct, 0);

  const fullPct = calculateLevelCompletion(20, 20, 10, 10, 5, 5, 2, 2);
  assert.equal(fullPct, 100);
});

test('validateBackupJson identifies valid and invalid JSON structures', () => {
  assert.equal(validateBackupJson('invalid json'), false);
  assert.equal(validateBackupJson('{}'), false);
  
  const valid = JSON.stringify({
    version: '1.0',
    vocabulary: [],
    kanji: [],
    grammar: [],
  });
  assert.equal(validateBackupJson(valid), true);
});
