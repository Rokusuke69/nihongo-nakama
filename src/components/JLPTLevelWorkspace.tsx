/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ChevronLeft,
  BookOpen,
  Layers,
  FileText,
  TrendingUp,
  RotateCcw,
  Sliders,
  PanelRightClose,
  PanelRightOpen,
  LayoutDashboard,
  Award,
} from 'lucide-react';
import {
  JLPTLevel,
  User,
  VocabItem,
  KanjiItem,
  GrammarItem,
  ReadingMaterial,
  DailyStudyStat,
  ActiveWorkspaceTab,
} from '../types';
import { calculateLevelCompletion } from '../utils/jlptLogic';
import { VocabularySection } from './workspace/VocabularySection';
import { KanjiSection } from './workspace/KanjiSection';
import { GrammarSection } from './workspace/GrammarSection';
import { ReadingSection } from './workspace/ReadingSection';
import { ProgressSection } from './workspace/ProgressSection';
import { RevisionSection } from './workspace/RevisionSection';
import { SettingsSection } from './workspace/SettingsSection';
import { SakuraPetalsCanvas } from './SakuraPetalsCanvas';

interface JLPTLevelWorkspaceProps {
  level: JLPTLevel;
  onChangeLevel: (level: JLPTLevel) => void;
  onBackToDashboard: () => void;
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  vocabList: VocabItem[];
  onAddVocab: (item: Omit<VocabItem, 'id' | 'createdAt'>) => void;
  onUpdateVocab: (id: string, updates: Partial<VocabItem>) => void;
  onDeleteVocab: (id: string) => void;
  onImportVocab: (items: VocabItem[]) => void;
  kanjiList: KanjiItem[];
  onAddKanji: (item: Omit<KanjiItem, 'id' | 'createdAt'>) => void;
  onUpdateKanji: (id: string, updates: Partial<KanjiItem>) => void;
  onDeleteKanji: (id: string) => void;
  grammarList: GrammarItem[];
  onAddGrammar: (item: Omit<GrammarItem, 'id' | 'createdAt'>) => void;
  onUpdateGrammar: (id: string, updates: Partial<GrammarItem>) => void;
  onDeleteGrammar: (id: string) => void;
  readingList: ReadingMaterial[];
  onAddReading: (item: Omit<ReadingMaterial, 'id'>) => void;
  onUpdateReading: (id: string, updates: Partial<ReadingMaterial>) => void;
  onDeleteReading: (id: string) => void;
  weeklyStats: DailyStudyStat[];
  onRestoreBackup: (data: {
    vocabulary: VocabItem[];
    kanji: KanjiItem[];
    grammar: GrammarItem[];
    reading: ReadingMaterial[];
  }) => void;
  onResetToDefault: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const JLPTLevelWorkspace: React.FC<JLPTLevelWorkspaceProps> = ({
  level,
  onChangeLevel,
  onBackToDashboard,
  user,
  onUpdateUser,
  vocabList,
  onAddVocab,
  onUpdateVocab,
  onDeleteVocab,
  onImportVocab,
  kanjiList,
  onAddKanji,
  onUpdateKanji,
  onDeleteKanji,
  grammarList,
  onAddGrammar,
  onUpdateGrammar,
  onDeleteGrammar,
  readingList,
  onAddReading,
  onUpdateReading,
  onDeleteReading,
  weeklyStats,
  onRestoreBackup,
  onResetToDefault,
  isDarkMode,
  onToggleTheme,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveWorkspaceTab>('vocabulary');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Stats for this specific level
  const levelVocab = vocabList.filter(v => v.level === level);
  const vocabLearned = levelVocab.filter(v => v.isLearned).length;

  const levelKanji = kanjiList.filter(k => k.level === level);
  const kanjiLearned = levelKanji.filter(k => k.isLearned).length;

  const levelGrammar = grammarList.filter(g => g.level === level);
  const grammarLearned = levelGrammar.filter(g => g.isLearned).length;

  const levelReading = readingList.filter(r => r.level === level);
  const readingLearned = levelReading.filter(r => r.readingProgress >= 80).length;

  const completionPct = calculateLevelCompletion(
    levelVocab.length,
    vocabLearned,
    levelKanji.length,
    kanjiLearned,
    levelGrammar.length,
    grammarLearned,
    levelReading.length,
    readingLearned
  );

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vocabulary', label: 'Vocabulary (鳥居)', icon: BookOpen },
    { id: 'kanji', label: 'Kanji (富士山)', icon: () => <span className="font-japanese font-bold text-sm">字</span> },
    { id: 'grammar', label: 'Grammar (和食)', icon: Layers },
    { id: 'reading', label: 'Reading (昔話)', icon: FileText },
    { id: 'progress', label: 'Progress Tracker', icon: TrendingUp },
    { id: 'revision', label: 'Revision Planner', icon: RotateCcw },
    { id: 'settings', label: 'Settings & Backup', icon: Sliders },
  ];

  return (
    <div className={`relative min-h-[calc(100vh-65px)] w-full transition-colors ${
      isDarkMode ? 'bg-[#121316] text-stone-100' : 'bg-[#FAF9F6] text-stone-900'
    }`}>
      {/* Background Sakura Petals */}
      <SakuraPetalsCanvas count={18} opacity={isDarkMode ? 0.35 : 0.65} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Workspace Top Toolbar: Back button, Level Switcher, Sidebar toggle */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to All Levels</span>
            </button>

            <span className="text-stone-300 dark:text-stone-700">|</span>

            {/* Level Switcher */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-400">Level:</span>
              <div className="flex items-center gap-1">
                {(['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => onChangeLevel(lvl)}
                    className={`px-2 py-0.5 text-xs font-mono font-bold rounded-md transition-colors cursor-pointer ${
                      level === lvl
                        ? 'bg-[#BC002D] text-white'
                        : isDarkMode
                        ? 'text-stone-400 hover:text-white hover:bg-stone-800'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar toggle button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title={isSidebarOpen ? 'Hide Right Sidebar (Expand to 100% width)' : 'Show Right Sidebar'}
          >
            {isSidebarOpen ? (
              <>
                <PanelRightClose className="w-4 h-4" />
                <span className="hidden sm:inline">Collapse Sidebar</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Expand Sidebar</span>
              </>
            )}
          </button>
        </div>

        {/* Workspace Layout: Main Content (75% or 100%) + Right Sidebar (25% collapsible) */}
        <div className="mt-6 flex flex-col-reverse lg:flex-row items-start gap-8">
          {/* Main Content Area (75% width when sidebar open, 100% width when sidebar collapsed) */}
          <main className={`transition-all duration-300 w-full ${
            isSidebarOpen ? 'lg:w-[75%]' : 'lg:w-full'
          }`}>
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Level Overview Card */}
                <div className={`p-8 rounded-3xl border shadow-xs ${
                  isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#BC002D]">
                        {level} Study Sanctuary
                      </span>
                      <h2 className="text-3xl font-bold font-japanese tracking-tight mt-1">
                        {level} Study Center Overview
                      </h2>
                      <p className="text-xs text-stone-500 mt-1 max-w-lg">
                        Welcome to your dedicated {level} workspace. Navigate between Vocabulary, Kanji stroke practice, Grammar notes, and traditional Folk Tales using the menu.
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="text-3xl font-extrabold font-mono text-[#BC002D]">
                        {completionPct}%
                      </div>
                      <span className="text-[11px] text-stone-400">Total Mastery</span>
                    </div>
                  </div>

                  {/* Level Metrics Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <button
                      onClick={() => setActiveTab('vocabulary')}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all hover:border-[#BC002D]/40 ${
                        isDarkMode ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <span className="text-[11px] text-stone-500 block mb-1">Vocabulary</span>
                      <span className="text-xl font-bold font-mono text-stone-900 dark:text-white">
                        {vocabLearned} / {levelVocab.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab('kanji')}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all hover:border-[#BC002D]/40 ${
                        isDarkMode ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <span className="text-[11px] text-stone-500 block mb-1">Kanji</span>
                      <span className="text-xl font-bold font-mono text-stone-900 dark:text-white">
                        {kanjiLearned} / {levelKanji.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab('grammar')}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all hover:border-[#BC002D]/40 ${
                        isDarkMode ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <span className="text-[11px] text-stone-500 block mb-1">Grammar</span>
                      <span className="text-xl font-bold font-mono text-stone-900 dark:text-white">
                        {grammarLearned} / {levelGrammar.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab('reading')}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all hover:border-[#BC002D]/40 ${
                        isDarkMode ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <span className="text-[11px] text-stone-500 block mb-1">Folk Tales</span>
                      <span className="text-xl font-bold font-mono text-stone-900 dark:text-white">
                        {readingLearned} / {levelReading.length}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Quick Flashcard Session Launcher */}
                <div className={`p-6 rounded-3xl border flex items-center justify-between gap-4 ${
                  isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
                }`}>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">
                      Ready for Daily Retention Drill?
                    </h3>
                    <p className="text-xs text-stone-500">
                      Launch an interactive 3D flashcard session for {level} vocabulary with SM-2 spaced repetition.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('revision')}
                    className="px-5 py-2.5 bg-[#BC002D] hover:bg-[#a00026] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    Start Revision Session
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'vocabulary' && (
              <VocabularySection
                level={level}
                vocabList={vocabList}
                onAddVocab={onAddVocab}
                onUpdateVocab={onUpdateVocab}
                onDeleteVocab={onDeleteVocab}
                onImportVocab={onImportVocab}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'kanji' && (
              <KanjiSection
                level={level}
                kanjiList={kanjiList}
                onAddKanji={onAddKanji}
                onUpdateKanji={onUpdateKanji}
                onDeleteKanji={onDeleteKanji}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'grammar' && (
              <GrammarSection
                level={level}
                grammarList={grammarList}
                onAddGrammar={onAddGrammar}
                onUpdateGrammar={onUpdateGrammar}
                onDeleteGrammar={onDeleteGrammar}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'reading' && (
              <ReadingSection
                level={level}
                readingList={readingList}
                onAddReading={onAddReading}
                onUpdateReading={onUpdateReading}
                onDeleteReading={onDeleteReading}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressSection
                level={level}
                user={user}
                weeklyStats={weeklyStats}
                vocabList={vocabList}
                kanjiList={kanjiList}
                grammarList={grammarList}
                readingList={readingList}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'revision' && (
              <RevisionSection
                level={level}
                vocabList={vocabList}
                kanjiList={kanjiList}
                grammarList={grammarList}
                onUpdateVocab={onUpdateVocab}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsSection
                user={user}
                onUpdateUser={onUpdateUser}
                vocabList={vocabList}
                kanjiList={kanjiList}
                grammarList={grammarList}
                readingList={readingList}
                onRestoreBackup={onRestoreBackup}
                onResetToDefault={onResetToDefault}
                isDarkMode={isDarkMode}
                onToggleTheme={onToggleTheme}
              />
            )}
          </main>

          {/* Right Sidebar (25% on desktop, collapsible) */}
          {isSidebarOpen && (
            <aside className="w-full lg:w-[25%] shrink-0 space-y-6">
              {/* Sidebar Container */}
              <div className={`p-6 rounded-3xl border shadow-sm sticky top-20 transition-all ${
                isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
              }`}>
                {/* Header: "[Level] Study Center" */}
                <div className="pb-4 mb-4 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#BC002D]">
                      Navigation
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#BC002D]/10 text-[#BC002D]">
                      {completionPct}% Done
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-japanese text-stone-900 dark:text-white mt-1">
                    {level} Study Center
                  </h3>
                </div>

                {/* Menu List */}
                <nav className="space-y-1">
                  {menuItems.map(item => {
                    const IconComp = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as ActiveWorkspaceTab)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#BC002D] text-white shadow-xs'
                            : isDarkMode
                            ? 'text-stone-300 hover:bg-stone-800 hover:text-white'
                            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                        }`}
                      >
                        <div className="w-4 h-4 flex items-center justify-center shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Level Quick Progress Mini Widget */}
                <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-stone-400">Level Retention</span>
                    <span className="font-mono font-bold text-[#BC002D]">
                      {completionPct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-[#BC002D] rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(5, completionPct)}%` }}
                    />
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
