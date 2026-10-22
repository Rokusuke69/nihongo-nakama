/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Volume2,
  Trash2,
  Edit2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Utensils,
} from 'lucide-react';
import { GrammarItem, JLPTLevel, ExampleSentence } from '../../types';
import { speakJapanese } from '../../utils/speech';

interface GrammarSectionProps {
  level: JLPTLevel;
  grammarList: GrammarItem[];
  onAddGrammar: (item: Omit<GrammarItem, 'id' | 'createdAt'>) => void;
  onUpdateGrammar: (id: string, updates: Partial<GrammarItem>) => void;
  onDeleteGrammar: (id: string) => void;
  isDarkMode: boolean;
}

export const GrammarSection: React.FC<GrammarSectionProps> = ({
  level,
  grammarList,
  onAddGrammar,
  onUpdateGrammar,
  onDeleteGrammar,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<GrammarItem>>({});

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStructure, setNewStructure] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newUsageNotes, setNewUsageNotes] = useState('');
  const [newCommonMistakes, setNewCommonMistakes] = useState('');
  const [newCategory, setNewCategory] = useState('Sentence Pattern');
  const [newExJap, setNewExJap] = useState('');
  const [newExFuri, setNewExFuri] = useState('');
  const [newExEng, setNewExEng] = useState('');

  const levelGrammar = useMemo(() => {
    return grammarList.filter(g => g.level === level);
  }, [grammarList, level]);

  const filteredGrammar = useMemo(() => {
    if (!searchQuery.trim()) return levelGrammar;
    const q = searchQuery.toLowerCase();
    return levelGrammar.filter(
      g =>
        g.title.toLowerCase().includes(q) ||
        g.meaning.toLowerCase().includes(q) ||
        g.structure.toLowerCase().includes(q) ||
        g.usageNotes.toLowerCase().includes(q)
    );
  }, [levelGrammar, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleStartEdit = (item: GrammarItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSaveEdit = (id: string) => {
    if (editForm) {
      onUpdateGrammar(id, editForm);
    }
    setEditingId(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMeaning.trim()) return;

    const examples: ExampleSentence[] = [];
    if (newExJap.trim()) {
      examples.push({
        japanese: newExJap.trim(),
        furigana: newExFuri.trim() || newExJap.trim(),
        english: newExEng.trim() || 'English translation',
      });
    }

    onAddGrammar({
      title: newTitle.trim(),
      structure: newStructure.trim(),
      meaning: newMeaning.trim(),
      usageNotes: newUsageNotes.trim(),
      commonMistakes: newCommonMistakes.trim(),
      category: newCategory.trim(),
      level,
      isLearned: false,
      exampleSentences: examples,
    });

    setNewTitle('');
    setNewStructure('');
    setNewMeaning('');
    setNewUsageNotes('');
    setNewCommonMistakes('');
    setNewExJap('');
    setNewExFuri('');
    setNewExEng('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="w-[95%] mx-auto space-y-6">
      {/* Japanese Food Culture Themed Header Banner */}
      <div className={`p-6 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
        isDarkMode
          ? 'bg-gradient-to-r from-stone-900 to-stone-900/90 border-stone-800'
          : 'bg-gradient-to-r from-amber-50/60 via-stone-50 to-white border-amber-100 shadow-xs'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#BC002D] text-white flex items-center justify-center shrink-0 shadow-md">
            <Utensils className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#BC002D]">
              <span>和食 Japanese Culinary Theme</span>
              <span>·</span>
              <span>Rich Expandable Recipe Cards</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight font-japanese text-stone-900 dark:text-white">
              {level} Grammar Kitchen
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Assemble sentences with precision, like crafting fine sushi and matcha. Total: <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{levelGrammar.length}</span> patterns ({levelGrammar.filter(g => g.isLearned).length} mastered)
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#BC002D] hover:bg-[#a00026] rounded-xl shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Grammar Entry (+)</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search grammar points, structures, meanings..."
          className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:border-[#BC002D] ${
            isDarkMode
              ? 'bg-stone-900 border-stone-800 text-stone-100'
              : 'bg-white border-stone-200 text-stone-900'
          }`}
        />
      </div>

      {/* Expandable Note Cards (Width: 95%) */}
      <div className="space-y-4">
        {filteredGrammar.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border ${
            isDarkMode ? 'bg-stone-900 border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-500'
          }`}>
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No grammar notes found. Click &quot;Add Grammar Entry&quot; to create one.</p>
          </div>
        ) : (
          filteredGrammar.map(item => {
            const isExpanded = expandedId === item.id;
            const isEditing = editingId === item.id;

            if (isEditing) {
              return (
                <div
                  key={item.id}
                  className={`p-6 rounded-3xl border shadow-lg space-y-4 transition-all ${
                    isDarkMode ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#BC002D]">Edit Grammar Entry</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-xl shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Grammar Point</label>
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Structure</label>
                      <input
                        type="text"
                        value={editForm.structure || ''}
                        onChange={e => setEditForm({ ...editForm, structure: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Meaning</label>
                    <input
                      type="text"
                      value={editForm.meaning || ''}
                      onChange={e => setEditForm({ ...editForm, meaning: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Usage Notes</label>
                    <textarea
                      value={editForm.usageNotes || ''}
                      onChange={e => setEditForm({ ...editForm, usageNotes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Common Mistakes</label>
                    <textarea
                      value={editForm.commonMistakes || ''}
                      onChange={e => setEditForm({ ...editForm, commonMistakes: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className={`rounded-3xl border transition-all ${
                  isDarkMode
                    ? 'bg-stone-900 border-stone-800 hover:border-stone-700 shadow-xs'
                    : 'bg-white border-stone-200/90 hover:border-amber-200 shadow-xs'
                }`}
              >
                {/* Accordion Card Header */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-japanese text-lg font-bold text-stone-900 dark:text-white">
                        {item.title}
                      </span>
                      <span className="text-xs font-sans-clean font-semibold px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {item.structure}
                      </span>
                      {item.category && (
                        <span className="text-[11px] text-stone-400">
                          · {item.category}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">
                      {item.meaning}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onUpdateGrammar(item.id, { isLearned: !item.isLearned });
                      }}
                      className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                        item.isLearned
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{item.isLearned ? 'Mastered' : 'Mark Done'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleStartEdit(item);
                      }}
                      className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
                      title="Edit Entry"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteGrammar(item.id);
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
                      aria-label={isExpanded ? 'Collapse card' : 'Expand card'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Card Details (95% width) */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-stone-100 dark:border-stone-800 space-y-5 text-xs">
                    {/* Structure Callout */}
                    <div>
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                        Grammar Formula & Structure
                      </h4>
                      <div className={`p-3 rounded-2xl border font-sans-clean text-xs font-semibold ${
                        isDarkMode ? 'bg-stone-800/50 border-stone-700 text-[#BC002D]' : 'bg-red-50/50 border-red-100 text-[#BC002D]'
                      }`}>
                        {item.structure}
                      </div>
                    </div>

                    {/* Usage Notes */}
                    <div>
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                        Usage & Nuance Notes
                      </h4>
                      <p className="leading-relaxed text-stone-700 dark:text-stone-300">
                        {item.usageNotes}
                      </p>
                    </div>

                    {/* Example Sentences */}
                    {item.exampleSentences && item.exampleSentences.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2">
                          Example Sentences (例文)
                        </h4>
                        <div className="space-y-2">
                          {item.exampleSentences.map((sent, sIdx) => (
                            <div
                              key={sIdx}
                              className={`p-3 rounded-2xl border flex items-center justify-between gap-4 ${
                                isDarkMode ? 'bg-stone-800/30 border-stone-800' : 'bg-stone-50 border-stone-200'
                              }`}
                            >
                              <div>
                                <div className="font-japanese font-semibold text-sm text-stone-900 dark:text-white">
                                  {sent.japanese}
                                </div>
                                <div className="text-[11px] text-stone-500 font-japanese mt-0.5">
                                  {sent.furigana}
                                </div>
                                <div className="text-[11px] text-stone-700 dark:text-stone-300 mt-0.5">
                                  {sent.english}
                                </div>
                              </div>

                              <button
                                onClick={() => speakJapanese(sent.japanese)}
                                className="p-2 text-stone-400 hover:text-[#BC002D] rounded-full border border-stone-200 dark:border-stone-700 transition-colors shrink-0"
                                title="Listen to example sentence"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Common Mistakes Warning */}
                    {item.commonMistakes && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-[11px] uppercase tracking-wider">
                            Common Learner Pitfall
                          </div>
                          <div className="text-xs mt-0.5 leading-relaxed">
                            {item.commonMistakes}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Grammar Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`relative w-full max-w-lg rounded-3xl p-6 border shadow-2xl transition-all max-h-[90vh] overflow-y-auto ${
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
                文
              </div>
              <div>
                <h3 className="text-lg font-bold font-japanese">Add New {level} Grammar Note</h3>
                <p className="text-xs text-stone-500">Document structure, nuance, and common mistakes.</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1">Grammar Point *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. 〜たことがある (Past Experience)"
                  required
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Structure Formula *</label>
                <input
                  type="text"
                  value={newStructure}
                  onChange={e => setNewStructure(e.target.value)}
                  placeholder="e.g. [Verb た-form] + ことがある"
                  required
                  className={`w-full px-3 py-2 text-xs font-mono rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">English Meaning *</label>
                <input
                  type="text"
                  value={newMeaning}
                  onChange={e => setNewMeaning(e.target.value)}
                  placeholder="e.g. Have ever done [verb]"
                  required
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Usage Notes</label>
                <textarea
                  value={newUsageNotes}
                  onChange={e => setNewUsageNotes(e.target.value)}
                  placeholder="Explain grammatical conditions, formality, nuance..."
                  rows={2}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Example Sentence</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newExJap}
                    onChange={e => setNewExJap(e.target.value)}
                    placeholder="Japanese (富士山に登ったことがあります)"
                    className={`w-full px-3 py-1.5 text-xs rounded-xl border ${
                      isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                  <input
                    type="text"
                    value={newExFuri}
                    onChange={e => setNewExFuri(e.target.value)}
                    placeholder="Furigana (ふじさんに のぼった ことが あります)"
                    className={`w-full px-3 py-1.5 text-xs rounded-xl border ${
                      isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                  <input
                    type="text"
                    value={newExEng}
                    onChange={e => setNewExEng(e.target.value)}
                    placeholder="English translation (I have climbed Mount Fuji before)"
                    className={`w-full px-3 py-1.5 text-xs rounded-xl border ${
                      isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Common Mistakes</label>
                <textarea
                  value={newCommonMistakes}
                  onChange={e => setNewCommonMistakes(e.target.value)}
                  placeholder="Frequent learner traps to watch out for..."
                  rows={2}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
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
                  Save Grammar Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
