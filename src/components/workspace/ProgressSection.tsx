/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Clock, Award, Target, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { JLPTLevel, User, DailyStudyStat, VocabItem, KanjiItem, GrammarItem, ReadingMaterial } from '../../types';
import { calculateLevelCompletion } from '../../utils/jlptLogic';

interface ProgressSectionProps {
  level: JLPTLevel;
  user: User;
  weeklyStats: DailyStudyStat[];
  vocabList: VocabItem[];
  kanjiList: KanjiItem[];
  grammarList: GrammarItem[];
  readingList: ReadingMaterial[];
  isDarkMode: boolean;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  level,
  user,
  weeklyStats,
  vocabList,
  kanjiList,
  grammarList,
  readingList,
  isDarkMode,
}) => {
  const levelVocab = vocabList.filter(v => v.level === level);
  const vocabLearned = levelVocab.filter(v => v.isLearned).length;

  const levelKanji = kanjiList.filter(k => k.level === level);
  const kanjiLearned = levelKanji.filter(k => k.isLearned).length;

  const levelGrammar = grammarList.filter(g => g.level === level);
  const grammarLearned = levelGrammar.filter(g => g.isLearned).length;

  const levelReading = readingList.filter(r => r.level === level);
  const readingLearned = levelReading.filter(r => r.readingProgress >= 80).length;

  const overallCompletion = calculateLevelCompletion(
    levelVocab.length,
    vocabLearned,
    levelKanji.length,
    kanjiLearned,
    levelGrammar.length,
    grammarLearned,
    levelReading.length,
    readingLearned
  );

  const maxMinutes = Math.max(...weeklyStats.map(s => s.minutes), 50);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#BC002D]">
              <TrendingUp className="w-4 h-4" />
              <span>{level} Mastery & Retention Analytics</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight font-japanese text-stone-900 dark:text-white mt-1">
              Study Progress & Streak Tracker
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>{user.streakDays}-Day Active Streak</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BC002D]/10 text-[#BC002D] border border-[#BC002D]/20 text-xs font-bold">
              <Award className="w-4 h-4 text-[#BC002D]" />
              <span>{overallCompletion}% Total {level} Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vocabulary Progress */}
        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Vocabulary Mastery</span>
            <span className="font-mono font-bold text-[#BC002D]">
              {levelVocab.length ? Math.round((vocabLearned / levelVocab.length) * 100) : 0}%
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-stone-900 dark:text-white">
            {vocabLearned}
            <span className="text-xs text-stone-400 font-normal ml-1">/ {levelVocab.length} words</span>
          </div>
          <div className="mt-3 w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
            <div
              className="h-full bg-[#BC002D] rounded-full"
              style={{
                width: `${levelVocab.length ? (vocabLearned / levelVocab.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Kanji Progress */}
        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Kanji Summit</span>
            <span className="font-mono font-bold text-[#BC002D]">
              {levelKanji.length ? Math.round((kanjiLearned / levelKanji.length) * 100) : 0}%
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-stone-900 dark:text-white">
            {kanjiLearned}
            <span className="text-xs text-stone-400 font-normal ml-1">/ {levelKanji.length} kanji</span>
          </div>
          <div className="mt-3 w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
            <div
              className="h-full bg-[#BC002D] rounded-full"
              style={{
                width: `${levelKanji.length ? (kanjiLearned / levelKanji.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Grammar Progress */}
        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Grammar Mastery</span>
            <span className="font-mono font-bold text-[#BC002D]">
              {levelGrammar.length ? Math.round((grammarLearned / levelGrammar.length) * 100) : 0}%
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-stone-900 dark:text-white">
            {grammarLearned}
            <span className="text-xs text-stone-400 font-normal ml-1">/ {levelGrammar.length} points</span>
          </div>
          <div className="mt-3 w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
            <div
              className="h-full bg-[#BC002D] rounded-full"
              style={{
                width: `${levelGrammar.length ? (grammarLearned / levelGrammar.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Reading Progress */}
        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Folk Tale Reading</span>
            <span className="font-mono font-bold text-[#BC002D]">
              {levelReading.length ? Math.round((readingLearned / levelReading.length) * 100) : 0}%
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-stone-900 dark:text-white">
            {readingLearned}
            <span className="text-xs text-stone-400 font-normal ml-1">/ {levelReading.length} stories</span>
          </div>
          <div className="mt-3 w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
            <div
              className="h-full bg-[#BC002D] rounded-full"
              style={{
                width: `${levelReading.length ? (readingLearned / levelReading.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Daily Study Time Chart (Past 7 Days Bar Chart) */}
      <div className={`p-6 rounded-3xl border ${
        isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#BC002D]" />
              <span>Daily Study Time (Past 7 Days)</span>
            </h3>
            <p className="text-xs text-stone-500">Track minutes spent in vocabulary, kanji, and reading sessions.</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Target: {user.dailyGoalMinutes} min/day</span>
          </div>
        </div>

        {/* SVG/CSS Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
          {weeklyStats.map((stat, sIdx) => {
            const heightPercent = Math.min(100, Math.round((stat.minutes / maxMinutes) * 100));
            const metGoal = stat.minutes >= user.dailyGoalMinutes;

            return (
              <div key={sIdx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-mono font-bold text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {stat.minutes}m
                </div>

                <div className="w-full max-w-[48px] bg-stone-100 dark:bg-stone-800 rounded-xl overflow-hidden flex flex-col justify-end h-full">
                  <div
                    className={`w-full rounded-xl transition-all duration-500 ${
                      metGoal ? 'bg-[#BC002D]' : 'bg-stone-300 dark:bg-stone-700'
                    } group-hover:brightness-110`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <div className="text-center">
                  <div className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    {stat.day}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {stat.itemsReviewed} items
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Goals & Learning Milestones */}
      <div className={`p-6 rounded-3xl border ${
        isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
      }`}>
        <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-[#BC002D]" />
          <span>Weekly JLPT Milestones</span>
        </h3>

        <div className="space-y-3">
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
            isDarkMode ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-stone-900 dark:text-white">
                  Learn 10 new {level} vocabulary words
                </span>
                <p className="text-[11px] text-stone-500">
                  {vocabLearned} / 10 completed this week
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600">
              {vocabLearned >= 10 ? 'Achieved' : `${10 - vocabLearned} remaining`}
            </span>
          </div>

          <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
            isDarkMode ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-stone-900 dark:text-white">
                  Practice kanji stroke order for 5 characters
                </span>
                <p className="text-[11px] text-stone-500">
                  {kanjiLearned} / 5 completed
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600">
              {kanjiLearned >= 5 ? 'Achieved' : `${5 - kanjiLearned} remaining`}
            </span>
          </div>

          <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
            isDarkMode ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-stone-900 dark:text-white">
                  Read one Japanese folk tale to 80%+
                </span>
                <p className="text-[11px] text-stone-500">
                  {readingLearned} stories completed
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600">
              {readingLearned >= 1 ? 'Achieved' : 'In Progress'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
