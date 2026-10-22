/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Database,
} from 'lucide-react';
import { User, VocabItem, KanjiItem, GrammarItem, ReadingMaterial } from '../../types';
import { validateBackupJson } from '../../utils/jlptLogic';

interface SettingsSectionProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  vocabList: VocabItem[];
  kanjiList: KanjiItem[];
  grammarList: GrammarItem[];
  readingList: ReadingMaterial[];
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

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  user,
  onUpdateUser,
  vocabList,
  kanjiList,
  grammarList,
  readingList,
  onRestoreBackup,
  onResetToDefault,
  isDarkMode,
  onToggleTheme,
}) => {
  const [dailyGoal, setDailyGoal] = useState<number>(user.dailyGoalMinutes);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleGoalSave = () => {
    onUpdateUser({ dailyGoalMinutes: dailyGoal });
    setStatusMessage({ type: 'success', text: `Daily study goal saved to ${dailyGoal} minutes.` });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user,
      vocabulary: vocabList,
      kanji: kanjiList,
      grammar: grammarList,
      reading: readingList,
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nihongo_nakama_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatusMessage({ type: 'success', text: 'Backup downloaded successfully as JSON.' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      if (text && validateBackupJson(text)) {
        try {
          const parsed = JSON.parse(text);
          onRestoreBackup({
            vocabulary: parsed.vocabulary || [],
            kanji: parsed.kanji || [],
            grammar: parsed.grammar || [],
            reading: parsed.reading || [],
          });
          if (parsed.user) {
            onUpdateUser(parsed.user);
          }
          setStatusMessage({ type: 'success', text: 'Backup restored successfully!' });
        } catch {
          setStatusMessage({ type: 'error', text: 'Failed to parse JSON file.' });
        }
      } else {
        setStatusMessage({ type: 'error', text: 'Invalid Nihongo Nakama backup file format.' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Settings Header */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#BC002D] text-white flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-japanese text-stone-900 dark:text-white">
              Study Preferences & Backup
            </h2>
            <p className="text-xs text-stone-500">
              Customize daily targets and safeguard your notes with full JSON export and restore.
            </p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-2xl border flex items-center gap-2 text-xs ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border-red-200 text-red-800 dark:text-red-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* Daily Study Goal */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white">
              Daily Study Target
            </h3>
            <p className="text-xs text-stone-500">Set your planned daily focus duration.</p>
          </div>
          <span className="font-mono text-base font-bold text-[#BC002D]">
            {dailyGoal} minutes
          </span>
        </div>

        <input
          type="range"
          min={10}
          max={120}
          step={5}
          value={dailyGoal}
          onChange={e => setDailyGoal(Number(e.target.value))}
          className="w-full accent-[#BC002D]"
        />

        <div className="flex justify-end">
          <button
            onClick={handleGoalSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#BC002D] hover:bg-[#a00026] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Target
          </button>
        </div>
      </div>

      {/* Theme Selection */}
      <div className={`p-6 rounded-3xl border flex items-center justify-between ${
        isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
      }`}>
        <div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-white">
            Appearance & Aesthetic Theme
          </h3>
          <p className="text-xs text-stone-500">
            Current mode: {isDarkMode ? 'Sumi Black Dark Mode' : 'Washi Paper Light Mode'}
          </p>
        </div>

        <button
          onClick={onToggleTheme}
          className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
        </button>
      </div>

      {/* Backup & Restore (JSON) */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#BC002D]" />
          <h3 className="text-sm font-bold text-stone-900 dark:text-white">
            Data Backup & Restore
          </h3>
        </div>
        <p className="text-xs text-stone-500">
          Export your entire learning database (vocabulary, kanji, grammar notes, reading stories, and progress) as a portable JSON file, or restore from an existing backup.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All Notes (JSON)</span>
          </button>

          <label className="flex items-center gap-1.5 px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import Backup (JSON)</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Reset to Default Curriculum */}
      <div className={`p-6 rounded-3xl border border-red-200/60 dark:border-red-950/40 bg-red-50/20 dark:bg-red-950/10 flex items-center justify-between`}>
        <div>
          <h3 className="text-sm font-bold text-red-900 dark:text-red-300">
            Restore Default Curriculum
          </h3>
          <p className="text-xs text-stone-500">
            Reset all sample vocabulary, kanji, grammar, and folk tales back to initial state.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset back to initial preloaded curriculum?')) {
              onResetToDefault();
              setStatusMessage({ type: 'success', text: 'Curriculum reset to defaults.' });
            }
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
