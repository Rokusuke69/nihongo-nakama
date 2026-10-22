/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Layers, FileText, ArrowRight, Play, Pause, Award } from 'lucide-react';
import { JLPTLevel, User, VocabItem, KanjiItem, GrammarItem, ReadingMaterial } from '../types';
import { calculateLevelCompletion } from '../utils/jlptLogic';
import { SakuraPetalsCanvas } from './SakuraPetalsCanvas';

interface JLPTLevelDashboardProps {
  user: User;
  onSelectLevel: (level: JLPTLevel) => void;
  vocabList: VocabItem[];
  kanjiList: KanjiItem[];
  grammarList: GrammarItem[];
  readingList: ReadingMaterial[];
  isDarkMode: boolean;
  studyTimeSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
}

interface LevelMeta {
  level: JLPTLevel;
  kanjiTitle: string;
  subTitle: string;
  description: string;
  colorHex: string;
  badge: string;
}

const JLPT_LEVELS: LevelMeta[] = [
  {
    level: 'N5',
    kanjiTitle: '初級前半',
    subTitle: 'Beginner / Foundation',
    description: 'Basic Japanese, hiragana/katakana mastery, essential daily conversation, and foundation kanji.',
    colorHex: '#BC002D',
    badge: 'Fundamental',
  },
  {
    level: 'N4',
    kanjiTitle: '初級後半',
    subTitle: 'Elementary / Basic',
    description: 'Everyday topics, basic compound sentences, common survival phrases, and 300+ core kanji.',
    colorHex: '#C5221F',
    badge: 'Elementary',
  },
  {
    level: 'N3',
    kanjiTitle: '中級',
    subTitle: 'Intermediate / Bridge',
    description: 'The critical bridge to fluency: newspaper headlines, natural pace conversations, and 650+ kanji.',
    colorHex: '#B31412',
    badge: 'Intermediate',
  },
  {
    level: 'N2',
    kanjiTitle: '上級前半',
    subTitle: 'Upper-Intermediate / Business',
    description: 'Business meetings, Japanese media, nuanced expressions, academic papers, and 1,000+ kanji.',
    colorHex: '#900C09',
    badge: 'Advanced Prep',
  },
  {
    level: 'N1',
    kanjiTitle: '上級',
    subTitle: 'Advanced / Native Fluency',
    description: 'Mastery of nuanced prose, complex editorial essays, abstract debates, and 2,000+ kanji.',
    colorHex: '#730502',
    badge: 'Mastery',
  },
];

export const JLPTLevelDashboard: React.FC<JLPTLevelDashboardProps> = ({
  user,
  onSelectLevel,
  vocabList,
  kanjiList,
  grammarList,
  readingList,
  isDarkMode,
  studyTimeSeconds,
  isTimerRunning,
  onToggleTimer,
}) => {
  // Global aggregate metrics
  const totalVocabLearned = vocabList.filter(v => v.isLearned).length;
  const totalKanjiLearned = kanjiList.filter(k => k.isLearned).length;
  const totalGrammarLearned = grammarList.filter(g => g.isLearned).length;
  const totalReadingCompleted = readingList.filter(r => r.readingProgress >= 80).length;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative min-h-[calc(100vh-65px)] w-full transition-colors ${
      isDarkMode ? 'bg-[#121316] text-stone-100' : 'bg-[#FAF9F6] text-stone-900'
    }`}>
      {/* Background Sakura Petals */}
      <SakuraPetalsCanvas count={24} opacity={isDarkMode ? 0.45 : 0.75} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#BC002D]">
              <span>桜 Sakura Study Sanctuary</span>
              <span>·</span>
              <span>Welcome, {user.username}</span>
            </div>
            <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight font-japanese">
              JLPT Level Dashboard
            </h1>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400 max-w-xl">
              Choose your target Japanese Language Proficiency Test level below to access dedicated vocabulary, kanji, grammar, and reading materials.
            </p>
          </div>

          {/* Daily Study Session Timer widget */}
          <div className={`flex items-center gap-4 px-4 py-2.5 rounded-2xl border shadow-xs ${
            isDarkMode ? 'bg-stone-900/80 border-stone-800' : 'bg-white border-stone-200'
          }`}>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                Today's Focus Session
              </div>
              <div className="text-xl font-mono font-bold tracking-tight text-[#BC002D]">
                {formatTimer(studyTimeSeconds)}
              </div>
            </div>

            <button
              onClick={onToggleTimer}
              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                isTimerRunning
                  ? 'bg-amber-500 text-white shadow-md hover:bg-amber-600'
                  : 'bg-[#BC002D] text-white shadow-md hover:bg-[#a00026]'
              }`}
              title={isTimerRunning ? 'Pause Study Session' : 'Start Focus Timer'}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          <div className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <div className="flex items-center gap-2 text-stone-400 mb-1 text-xs">
              <BookOpen className="w-4 h-4 text-[#BC002D]" />
              <span>Vocabulary Learned</span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-stone-900 dark:text-white">
              {totalVocabLearned}
              <span className="text-xs font-normal text-stone-400 ml-1">/ {vocabList.length}</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <div className="flex items-center gap-2 text-stone-400 mb-1 text-xs">
              <span className="font-japanese font-bold text-sm text-[#BC002D]">字</span>
              <span>Kanji Mastered</span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-stone-900 dark:text-white">
              {totalKanjiLearned}
              <span className="text-xs font-normal text-stone-400 ml-1">/ {kanjiList.length}</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <div className="flex items-center gap-2 text-stone-400 mb-1 text-xs">
              <Layers className="w-4 h-4 text-[#BC002D]" />
              <span>Grammar Points</span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-stone-900 dark:text-white">
              {totalGrammarLearned}
              <span className="text-xs font-normal text-stone-400 ml-1">/ {grammarList.length}</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <div className="flex items-center gap-2 text-stone-400 mb-1 text-xs">
              <FileText className="w-4 h-4 text-[#BC002D]" />
              <span>Reading Stories</span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-stone-900 dark:text-white">
              {totalReadingCompleted}
              <span className="text-xs font-normal text-stone-400 ml-1">/ {readingList.length}</span>
            </div>
          </div>
        </div>

        {/* Five Large Cards: JLPT N5, N4, N3, N2, N1 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-stone-900 dark:text-white">
              Select Your JLPT Study Level
            </h2>
            <span className="text-xs text-stone-500">
              Click any card to enter its dedicated workspace
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {JLPT_LEVELS.map(item => {
              const levelVocab = vocabList.filter(v => v.level === item.level);
              const levelVocabLearned = levelVocab.filter(v => v.isLearned).length;

              const levelKanji = kanjiList.filter(k => k.level === item.level);
              const levelKanjiLearned = levelKanji.filter(k => k.isLearned).length;

              const levelGrammar = grammarList.filter(g => g.level === item.level);
              const levelGrammarLearned = levelGrammar.filter(g => g.isLearned).length;

              const levelReading = readingList.filter(r => r.level === item.level);
              const levelReadingLearned = levelReading.filter(r => r.readingProgress >= 80).length;

              const completionPct = calculateLevelCompletion(
                levelVocab.length,
                levelVocabLearned,
                levelKanji.length,
                levelKanjiLearned,
                levelGrammar.length,
                levelGrammarLearned,
                levelReading.length,
                levelReadingLearned
              );

              return (
                <motion.button
                  key={item.level}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSelectLevel(item.level)}
                  className={`text-left rounded-3xl p-6 border transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                    isDarkMode
                      ? 'bg-stone-900/90 border-stone-800 hover:border-[#BC002D]/50 hover:shadow-xl hover:shadow-[#BC002D]/5'
                      : 'bg-white border-stone-200/90 hover:border-[#BC002D]/40 shadow-sm hover:shadow-xl'
                  }`}
                >
                  {/* Top Level indicator & Progress Badge */}
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#BC002D]">
                            {item.level}
                          </span>
                          <span className="text-base font-japanese font-semibold text-stone-500 dark:text-stone-400">
                            {item.kanjiTitle}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mt-1">
                          {item.subTitle}
                        </h3>
                      </div>

                      {/* Completion Percentage Badge */}
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#BC002D]/10 text-[#BC002D]">
                          <Award className="w-3.5 h-3.5" />
                          <span>{completionPct}%</span>
                        </div>
                        <span className="text-[10px] text-stone-400 mt-1">Completion</span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                      <div
                        className="h-full bg-[#BC002D] transition-all duration-500 rounded-full"
                        style={{ width: `${Math.max(5, completionPct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Counts Breakdown Grid */}
                  <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/80">
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                      <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                        <span>Vocabulary</span>
                        <span className="font-mono font-semibold text-stone-900 dark:text-white">
                          {levelVocab.length} words
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                        <span>Kanji</span>
                        <span className="font-mono font-semibold text-stone-900 dark:text-white">
                          {levelKanji.length} kanji
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                        <span>Grammar</span>
                        <span className="font-mono font-semibold text-stone-900 dark:text-white">
                          {levelGrammar.length} points
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                        <span>Reading</span>
                        <span className="font-mono font-semibold text-stone-900 dark:text-white">
                          {levelReading.length} stories
                        </span>
                      </div>
                    </div>

                    {/* Card Footer action button */}
                    <div className="mt-5 flex items-center justify-between text-xs font-semibold text-[#BC002D] group-hover:translate-x-0.5 transition-transform">
                      <span>Open {item.level} Study Center</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
