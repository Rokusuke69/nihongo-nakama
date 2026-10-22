/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Sparkles,
  Volume2,
  Calendar,
  Layers,
  Bell,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JLPTLevel, VocabItem, KanjiItem, GrammarItem } from '../../types';
import { calculateNextSRSReview, ReviewGrade } from '../../utils/jlptLogic';
import { speakJapanese } from '../../utils/speech';

interface RevisionSectionProps {
  level: JLPTLevel;
  vocabList: VocabItem[];
  kanjiList: KanjiItem[];
  grammarList: GrammarItem[];
  onUpdateVocab: (id: string, updates: Partial<VocabItem>) => void;
  isDarkMode: boolean;
}

interface Flashcard {
  id: string;
  type: 'vocab' | 'kanji' | 'grammar';
  front: string;
  frontSub?: string;
  back: string;
  backSub?: string;
  hint?: string;
  srsItem: VocabItem;
}

export const RevisionSection: React.FC<RevisionSectionProps> = ({
  level,
  vocabList,
  kanjiList,
  grammarList,
  onUpdateVocab,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'schedule' | 'reminders'>('flashcards');

  // Flashcard Deck State
  const flashcardDeck: Flashcard[] = useMemo(() => {
    return vocabList
      .filter(v => v.level === level)
      .map(v => ({
        id: v.id,
        type: 'vocab',
        front: v.japanese,
        frontSub: v.furigana !== v.japanese ? v.furigana : undefined,
        back: v.meaning,
        backSub: `${v.romaji} · ${v.partOfSpeech}`,
        hint: `JLPT ${v.level} Core Vocabulary`,
        srsItem: v,
      }));
  }, [vocabList, level]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  // Custom reminders
  const [customReminders, setCustomReminders] = useState<string[]>([
    'Evening Kanji Review (8:00 PM)',
    'Weekend Folk Tale Reading (Saturday 10:00 AM)',
    'Weekly JLPT Practice Mockup (Sunday 3:00 PM)',
  ]);
  const [newReminderText, setNewReminderText] = useState('');

  const currentCard = flashcardDeck[currentIndex];

  const handleGrade = (grade: ReviewGrade) => {
    if (!currentCard) return;

    // Update SRS
    const currentSRS = currentCard.srsItem.srs || {
      repetitions: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      nextReviewDate: new Date().toISOString(),
    };
    const updatedSRS = calculateNextSRSReview(currentSRS, grade);
    onUpdateVocab(currentCard.srsItem.id, {
      srs: updatedSRS,
      isLearned: grade === 'good' || grade === 'easy' ? true : currentCard.srsItem.isLearned,
    });

    setReviewedCount(prev => prev + 1);
    setIsFlipped(false);

    if (currentIndex + 1 < flashcardDeck.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback gracefully
      }
    }
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setReviewedCount(0);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderText.trim()) return;
    setCustomReminders(prev => [...prev, newReminderText.trim()]);
    setNewReminderText('');
  };

  const handleDeleteReminder = (idx: number) => {
    setCustomReminders(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#BC002D]">
              <Sparkles className="w-4 h-4" />
              <span>Spaced Repetition & Memory Retention</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight font-japanese text-stone-900 dark:text-white mt-1">
              {level} Revision Planner & Flashcards
            </h2>
          </div>

          {/* Tab Selector */}
          <div className={`flex items-center p-1 rounded-xl border ${
            isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-100 border-stone-200'
          }`}>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-white dark:bg-stone-900 text-[#BC002D] shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              SRS Flashcards
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-white dark:bg-stone-900 text-[#BC002D] shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Revision Schedule
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'reminders'
                  ? 'bg-white dark:bg-stone-900 text-[#BC002D] shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Custom Reminders
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Interactive Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-6">
          {!sessionCompleted && currentCard ? (
            <div>
              {/* Deck Progress Bar */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span>Card {currentIndex + 1} of {flashcardDeck.length}</span>
                <span className="font-mono text-[#BC002D] font-bold">
                  {Math.round(((currentIndex) / flashcardDeck.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 mb-6 overflow-hidden">
                <div
                  className="h-full bg-[#BC002D] rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / flashcardDeck.length) * 100}%` }}
                />
              </div>

              {/* The Flip Flashcard */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full min-h-[320px] rounded-3xl p-8 border shadow-xl cursor-pointer flex flex-col justify-between select-none transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-stone-900 border-stone-800 text-stone-100 hover:border-stone-700'
                    : 'bg-white border-stone-200/90 text-stone-900 hover:border-red-200'
                }`}
                style={{
                  boxShadow: '0 20px 40px -15px rgba(188, 0, 45, 0.12)',
                }}
              >
                {/* Card Top Info */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#BC002D]/10 text-[#BC002D]">
                    {level} Vocabulary
                  </span>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      speakJapanese(currentCard.front);
                    }}
                    className="p-2 text-stone-400 hover:text-[#BC002D] rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    title="Pronounce"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Main Content */}
                <div className="text-center my-6">
                  {!isFlipped ? (
                    <div>
                      <span className="text-5xl font-extrabold font-japanese text-[#BC002D] block mb-2">
                        {currentCard.front}
                      </span>
                      {currentCard.frontSub && (
                        <span className="text-sm font-japanese text-stone-500">
                          {currentCard.frontSub}
                        </span>
                      )}
                      <p className="text-[11px] text-stone-400 mt-6">
                        Click card to flip and reveal meaning
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs uppercase font-semibold text-stone-400 block mb-1">
                        English Meaning
                      </span>
                      <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white block mb-2">
                        {currentCard.back}
                      </span>
                      {currentCard.backSub && (
                        <span className="text-xs font-mono text-stone-500 block">
                          {currentCard.backSub}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Hint */}
                <div className="text-center text-[11px] text-stone-400">
                  {currentCard.hint}
                </div>
              </div>

              {/* SM-2 SRS Response Grading Buttons */}
              {isFlipped ? (
                <div className="grid grid-cols-4 gap-2 mt-6">
                  <button
                    onClick={() => handleGrade('again')}
                    className="py-2.5 px-2 text-xs font-semibold rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-200 transition-colors cursor-pointer flex flex-col items-center"
                  >
                    <span>Again</span>
                    <span className="text-[10px] opacity-75">&lt; 1 day</span>
                  </button>

                  <button
                    onClick={() => handleGrade('hard')}
                    className="py-2.5 px-2 text-xs font-semibold rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 transition-colors cursor-pointer flex flex-col items-center"
                  >
                    <span>Hard</span>
                    <span className="text-[10px] opacity-75">1 day</span>
                  </button>

                  <button
                    onClick={() => handleGrade('good')}
                    className="py-2.5 px-2 text-xs font-semibold rounded-2xl bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 transition-colors cursor-pointer flex flex-col items-center"
                  >
                    <span>Good</span>
                    <span className="text-[10px] opacity-75">6 days</span>
                  </button>

                  <button
                    onClick={() => handleGrade('easy')}
                    className="py-2.5 px-2 text-xs font-semibold rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition-colors cursor-pointer flex flex-col items-center"
                  >
                    <span>Easy</span>
                    <span className="text-[10px] opacity-75">14 days</span>
                  </button>
                </div>
              ) : (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="py-2.5 px-6 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  >
                    Flip Card (Space)
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Session Completed Screen */
            <div className={`p-8 text-center rounded-3xl border ${
              isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-lg'
            }`}>
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-japanese text-stone-900 dark:text-white">
                お疲れ様でした！ (Otsukaresama!)
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                You reviewed {reviewedCount || flashcardDeck.length} cards in this {level} revision session. Spaced repetition intervals have been updated.
              </p>

              <button
                onClick={restartSession}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#BC002D] hover:bg-[#a00026] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Review Deck Again</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Revision Schedule */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-[#BC002D]" />
              <span>Daily Revision Cycle</span>
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Recommended daily review targets according to the SuperMemo SM-2 algorithm:
            </p>

            <ul className="space-y-3 text-xs">
              <li className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span>Morning 10-Minute Vocab Drill</span>
                <span className="font-mono font-bold text-[#BC002D]">15 items</span>
              </li>
              <li className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span>Afternoon Kanji Stroke Recall</span>
                <span className="font-mono font-bold text-[#BC002D]">5 characters</span>
              </li>
              <li className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span>Evening Folk Tale Reading Immersion</span>
                <span className="font-mono font-bold text-[#BC002D]">1 chapter</span>
              </li>
            </ul>
          </div>

          <div className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-[#BC002D]" />
              <span>Weekly Retention Schedule</span>
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Weekly checkpoints to lock high-yield grammar and compounds into long-term memory:
            </p>

            <ul className="space-y-3 text-xs">
              <li className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span>Wednesday Grammar Quiz</span>
                <span className="font-mono font-bold text-stone-600 dark:text-stone-300">All N5 points</span>
              </li>
              <li className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span>Saturday Full Vocabulary Sweep</span>
                <span className="font-mono font-bold text-stone-600 dark:text-stone-300">All starred items</span>
              </li>
              <li className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span>Sunday Progress Review & Backup</span>
                <span className="font-mono font-bold text-stone-600 dark:text-stone-300">JSON Export</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Custom Reminders */}
      {activeTab === 'reminders' && (
        <div className={`p-6 rounded-3xl border max-w-xl mx-auto space-y-6 ${
          isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
        }`}>
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#BC002D]" />
              <span>Custom Study Reminders & Alerts</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Set personal practice prompts and study notifications.
            </p>
          </div>

          <form onSubmit={handleAddReminder} className="flex gap-2">
            <input
              type="text"
              value={newReminderText}
              onChange={e => setNewReminderText(e.target.value)}
              placeholder="e.g. Daily kanji review at 9:00 PM..."
              className={`flex-1 px-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
              }`}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#BC002D] hover:bg-[#a00026] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Add Reminder
            </button>
          </form>

          <div className="space-y-2">
            {customReminders.map((reminder, rIdx) => (
              <div
                key={rIdx}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isDarkMode ? 'bg-stone-800/50 border-stone-800' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#BC002D]" />
                  <span>{reminder}</span>
                </div>
                <button
                  onClick={() => handleDeleteReminder(rIdx)}
                  className="text-stone-400 hover:text-red-500 text-xs px-2 py-1"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
