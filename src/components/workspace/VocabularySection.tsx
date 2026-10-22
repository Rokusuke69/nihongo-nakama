/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Volume2,
  Star,
  CheckCircle2,
  Trash2,
  Edit2,
  Save,
  X,
  Upload,
  Download,
  Filter,
} from 'lucide-react';
import { VocabItem, JLPTLevel } from '../../types';
import { exportVocabToCSV, parseVocabCSV } from '../../utils/jlptLogic';
import { speakJapanese } from '../../utils/speech';

interface VocabularySectionProps {
  level: JLPTLevel;
  vocabList: VocabItem[];
  onAddVocab: (item: Omit<VocabItem, 'id' | 'createdAt'>) => void;
  onUpdateVocab: (id: string, updates: Partial<VocabItem>) => void;
  onDeleteVocab: (id: string) => void;
  onImportVocab: (items: VocabItem[]) => void;
  isDarkMode: boolean;
}

export const VocabularySection: React.FC<VocabularySectionProps> = ({
  level,
  vocabList,
  onAddVocab,
  onUpdateVocab,
  onDeleteVocab,
  onImportVocab,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'favorites' | 'learned' | 'unlearned'>('all');
  const [sortField, setSortField] = useState<'japanese' | 'meaning' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<VocabItem>>({});

  // Add Row Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newJapanese, setNewJapanese] = useState('');
  const [newFurigana, setNewFurigana] = useState('');
  const [newRomaji, setNewRomaji] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newPartOfSpeech, setNewPartOfSpeech] = useState('Noun');

  // CSV file input ref
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const levelVocab = useMemo(() => {
    return vocabList.filter(v => v.level === level);
  }, [vocabList, level]);

  const filteredVocab = useMemo(() => {
    return levelVocab
      .filter(item => {
        if (filterMode === 'favorites' && !item.isFavorite) return false;
        if (filterMode === 'learned' && !item.isLearned) return false;
        if (filterMode === 'unlearned' && item.isLearned) return false;

        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          item.japanese.toLowerCase().includes(q) ||
          item.furigana.toLowerCase().includes(q) ||
          item.romaji.toLowerCase().includes(q) ||
          item.meaning.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortField === 'japanese') {
          return sortDirection === 'asc'
            ? a.japanese.localeCompare(b.japanese, 'ja')
            : b.japanese.localeCompare(a.japanese, 'ja');
        }
        if (sortField === 'meaning') {
          return sortDirection === 'asc'
            ? a.meaning.localeCompare(b.meaning)
            : b.meaning.localeCompare(a.meaning);
        }
        return sortDirection === 'asc'
          ? a.createdAt.localeCompare(b.createdAt)
          : b.createdAt.localeCompare(a.createdAt);
      });
  }, [levelVocab, filterMode, searchQuery, sortField, sortDirection]);

  const handleStartEdit = (item: VocabItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSaveEdit = (id: string) => {
    if (editForm) {
      onUpdateVocab(id, editForm);
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJapanese.trim() || !newMeaning.trim()) return;

    onAddVocab({
      japanese: newJapanese.trim(),
      furigana: newFurigana.trim() || newJapanese.trim(),
      romaji: newRomaji.trim(),
      meaning: newMeaning.trim(),
      level,
      partOfSpeech: newPartOfSpeech,
      isFavorite: false,
      isLearned: false,
      srs: { repetitions: 0, intervalDays: 1, easeFactor: 2.5, nextReviewDate: new Date().toISOString() },
    });

    setNewJapanese('');
    setNewFurigana('');
    setNewRomaji('');
    setNewMeaning('');
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    const csvContent = exportVocabToCSV(levelVocab);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nihongo_nakama_${level}_vocabulary.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      if (text) {
        const rows = parseVocabCSV(text, level);
        const newItems: VocabItem[] = rows.map((r, i) => ({
          id: `v_${Date.now()}_${i}`,
          japanese: r.japanese,
          furigana: r.furigana,
          romaji: r.romaji,
          meaning: r.meaning,
          level: (r.level as JLPTLevel) || level,
          partOfSpeech: 'Imported',
          isFavorite: r.isFavorite || false,
          isLearned: r.isLearned || false,
          srs: { repetitions: 0, intervalDays: 1, easeFactor: 2.5, nextReviewDate: new Date().toISOString() },
          createdAt: new Date().toISOString(),
        }));
        onImportVocab(newItems);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Torii Gate Themed Header Banner */}
      <div className={`p-6 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
        isDarkMode
          ? 'bg-gradient-to-r from-stone-900 to-stone-900/90 border-stone-800'
          : 'bg-gradient-to-r from-red-50/70 via-stone-50 to-white border-red-100 shadow-xs'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#BC002D] text-white flex items-center justify-center shrink-0 shadow-md">
            {/* Torii Gate SVG Icon */}
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 5h20" />
              <path d="M4 8h16" />
              <path d="M6 5v14" />
              <path d="M18 5v14" />
              <path d="M6 12h12" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#BC002D]">
              <span>鳥居 Torii Gate Theme</span>
              <span>·</span>
              <span>Autosave Active</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight font-japanese text-stone-900 dark:text-white">
              {level} Vocabulary Sanctuary
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Pass through the sacred Torii gate. Total items: <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{levelVocab.length}</span> ({levelVocab.filter(v => v.isLearned).length} learned)
            </p>
          </div>
        </div>

        {/* Action Buttons: Add Row, CSV Import, CSV Export */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#BC002D] hover:bg-[#a00026] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Row (+)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-stone-800 border-stone-700 text-stone-200 hover:bg-stone-700'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
            title="Download CSV file of this JLPT level"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <label className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
            isDarkMode
              ? 'bg-stone-800 border-stone-700 text-stone-200 hover:bg-stone-700'
              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}>
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Search, Filter Tabs & Sort Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Japanese, furigana, romaji, meaning..."
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:border-[#BC002D] ${
              isDarkMode
                ? 'bg-stone-900 border-stone-800 text-stone-100'
                : 'bg-white border-stone-200 text-stone-900'
            }`}
          />
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center p-1 rounded-xl border ${
            isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-stone-100/80 border-stone-200'
          }`}>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-stone-800 text-[#BC002D] shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              All ({levelVocab.length})
            </button>
            <button
              onClick={() => setFilterMode('favorites')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterMode === 'favorites'
                  ? 'bg-white dark:bg-stone-800 text-[#BC002D] shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Favorites ({levelVocab.filter(v => v.isFavorite).length})
            </button>
            <button
              onClick={() => setFilterMode('learned')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterMode === 'learned'
                  ? 'bg-white dark:bg-stone-800 text-[#BC002D] shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Learned ({levelVocab.filter(v => v.isLearned).length})
            </button>
            <button
              onClick={() => setFilterMode('unlearned')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterMode === 'unlearned'
                  ? 'bg-white dark:bg-stone-800 text-[#BC002D] shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              To Study ({levelVocab.filter(v => !v.isLearned).length})
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={sortField}
              onChange={e => setSortField(e.target.value as any)}
              className={`px-2.5 py-1.5 text-xs rounded-xl border focus:outline-none ${
                isDarkMode ? 'bg-stone-900 border-stone-800 text-stone-200' : 'bg-white border-stone-200 text-stone-700'
              }`}
            >
              <option value="date">Sort by Date</option>
              <option value="japanese">Sort by Japanese</option>
              <option value="meaning">Sort by Meaning</option>
            </select>
            <button
              onClick={() => setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))}
              className={`p-1.5 rounded-lg border text-[10px] font-mono font-bold ${
                isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
              }`}
            >
              {sortDirection.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* Vocabulary Table (Japanese, Furigana, Romaji, Meaning, Actions) */}
      <div className={`overflow-x-auto rounded-2xl border shadow-xs ${
        isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
      }`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${
              isDarkMode ? 'border-stone-800 text-stone-400 bg-stone-900/90' : 'border-stone-200 text-stone-500 bg-stone-50/60'
            }`}>
              <th className="py-3 px-4 w-12 text-center">★</th>
              <th className="py-3 px-4">Japanese (漢字/かな)</th>
              <th className="py-3 px-4">Furigana (ふりがな)</th>
              <th className="py-3 px-4">Romaji</th>
              <th className="py-3 px-4">Meaning (英語)</th>
              <th className="py-3 px-4 w-28 text-center">Status</th>
              <th className="py-3 px-4 w-28 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
            {filteredVocab.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-stone-400">
                  No vocabulary words found matching this search or filter.
                </td>
              </tr>
            ) : (
              filteredVocab.map(item => {
                const isEditing = editingId === item.id;

                if (isEditing) {
                  return (
                    <tr key={item.id} className="bg-red-50/40 dark:bg-stone-800/60">
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setEditForm({ ...editForm, isFavorite: !editForm.isFavorite })}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              editForm.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={editForm.japanese || ''}
                          onChange={e => setEditForm({ ...editForm, japanese: e.target.value })}
                          className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={editForm.furigana || ''}
                          onChange={e => setEditForm({ ...editForm, furigana: e.target.value })}
                          className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={editForm.romaji || ''}
                          onChange={e => setEditForm({ ...editForm, romaji: e.target.value })}
                          className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={editForm.meaning || ''}
                          onChange={e => setEditForm({ ...editForm, meaning: e.target.value })}
                          className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <label className="flex items-center justify-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editForm.isLearned)}
                            onChange={e => setEditForm({ ...editForm, isLearned: e.target.checked })}
                          />
                          <span className="text-[10px]">Learned</span>
                        </label>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg"
                            title="Save Row"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors group"
                  >
                    {/* Favorite Star */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onUpdateVocab(item.id, { isFavorite: !item.isFavorite })}
                        className="cursor-pointer"
                        title={item.isFavorite ? 'Remove Favorite' : 'Mark as Favorite'}
                      >
                        <Star
                          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                            item.isFavorite
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300 dark:text-stone-600 hover:text-amber-400'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Japanese Column with Audio Speaker */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-japanese text-base font-semibold text-stone-900 dark:text-white">
                          {item.japanese}
                        </span>
                        <button
                          onClick={() => speakJapanese(item.japanese)}
                          className="p-1 text-stone-400 hover:text-[#BC002D] rounded-full transition-colors cursor-pointer"
                          title="Listen to Japanese pronunciation"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Furigana */}
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-300 font-japanese">
                      {item.furigana}
                    </td>

                    {/* Romaji */}
                    <td className="py-3 px-4 text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                      {item.romaji}
                    </td>

                    {/* English Meaning */}
                    <td className="py-3 px-4 font-medium text-stone-800 dark:text-stone-200">
                      {item.meaning}
                    </td>

                    {/* Status Toggle Badge */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onUpdateVocab(item.id, { isLearned: !item.isLearned })}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${
                          item.isLearned
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                            : 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{item.isLearned ? 'Learned' : 'Study'}</span>
                      </button>
                    </td>

                    {/* Action Buttons: Edit, Delete */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                          title="Edit Row"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteVocab(item.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Delete Row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Row Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`relative w-full max-w-md rounded-3xl p-6 border shadow-2xl transition-all ${
            isDarkMode ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-900'
          }`}>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#BC002D] text-white flex items-center justify-center font-bold">
                詞
              </div>
              <div>
                <h3 className="text-lg font-bold font-japanese">Add New {level} Vocabulary</h3>
                <p className="text-xs text-stone-500">Add words with furigana, romaji, and meaning.</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Japanese (Kanji or Kana) *
                </label>
                <input
                  type="text"
                  value={newJapanese}
                  onChange={e => setNewJapanese(e.target.value)}
                  placeholder="e.g. 桜 or 食べる"
                  required
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Furigana Reading (Hiragana)
                </label>
                <input
                  type="text"
                  value={newFurigana}
                  onChange={e => setNewFurigana(e.target.value)}
                  placeholder="e.g. さくら or たべる"
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Romaji
                </label>
                <input
                  type="text"
                  value={newRomaji}
                  onChange={e => setNewRomaji(e.target.value)}
                  placeholder="e.g. sakura or taberu"
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  English Meaning *
                </label>
                <input
                  type="text"
                  value={newMeaning}
                  onChange={e => setNewMeaning(e.target.value)}
                  placeholder="e.g. Cherry blossom"
                  required
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Part of Speech
                </label>
                <select
                  value={newPartOfSpeech}
                  onChange={e => setNewPartOfSpeech(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                >
                  <option value="Noun">Noun (名詞)</option>
                  <option value="Ichidan Verb">Ichidan Verb (一段動詞)</option>
                  <option value="Godan Verb">Godan Verb (五段動詞)</option>
                  <option value="Suru Verb">Suru Verb (サ変動詞)</option>
                  <option value="I-Adjective">I-Adjective (い形容詞)</option>
                  <option value="Na-Adjective">Na-Adjective (な形容詞)</option>
                  <option value="Adverb">Adverb (副詞)</option>
                  <option value="Expression">Expression (表現)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#BC002D] hover:bg-[#a00026] rounded-xl shadow-xs"
                >
                  Save Vocabulary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
