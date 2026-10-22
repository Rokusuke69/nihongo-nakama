/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  Volume2,
  Trash2,
  Edit2,
  Save,
  X,
  PenTool,
  RotateCcw,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { KanjiItem, JLPTLevel } from '../../types';
import { speakJapanese } from '../../utils/speech';

interface KanjiSectionProps {
  level: JLPTLevel;
  kanjiList: KanjiItem[];
  onAddKanji: (item: Omit<KanjiItem, 'id' | 'createdAt'>) => void;
  onUpdateKanji: (id: string, updates: Partial<KanjiItem>) => void;
  onDeleteKanji: (id: string) => void;
  isDarkMode: boolean;
}

export const KanjiSection: React.FC<KanjiSectionProps> = ({
  level,
  kanjiList,
  onAddKanji,
  onUpdateKanji,
  onDeleteKanji,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<KanjiItem>>({});

  // Add Kanji Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newKanjiChar, setNewKanjiChar] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newOnyomi, setNewOnyomi] = useState('');
  const [newKunyomi, setNewKunyomi] = useState('');
  const [newStrokeCount, setNewStrokeCount] = useState<number>(4);
  const [newNotes, setNewNotes] = useState('');
  const [newExWord, setNewExWord] = useState('');
  const [newExReading, setNewExReading] = useState('');
  const [newExMeaning, setNewExMeaning] = useState('');

  // Interactive Practice Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#BC002D');

  const levelKanji = useMemo(() => {
    return kanjiList.filter(k => k.level === level);
  }, [kanjiList, level]);

  const filteredKanji = useMemo(() => {
    if (!searchQuery.trim()) return levelKanji;
    const q = searchQuery.toLowerCase();
    return levelKanji.filter(
      k =>
        k.kanji.toLowerCase().includes(q) ||
        k.meaning.toLowerCase().includes(q) ||
        k.onyomi.toLowerCase().includes(q) ||
        k.kunyomi.toLowerCase().includes(q) ||
        k.personalNotes.toLowerCase().includes(q)
    );
  }, [levelKanji, searchQuery]);

  // Set default selected kanji for detail panel
  useEffect(() => {
    if (!selectedKanji && levelKanji.length > 0) {
      setSelectedKanji(levelKanji[0]);
    }
  }, [levelKanji, selectedKanji]);

  // Clear and setup practice canvas
  const clearPracticeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Japanese calligraphy grid lines (subtle dashed crosshair)
    ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(188, 0, 45, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.setLineDash([]);
  };

  useEffect(() => {
    clearPracticeCanvas();
  }, [selectedKanji, isDarkMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 6;
    ctx.strokeStyle = brushColor;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleStartEdit = (item: KanjiItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSaveEdit = (id: string) => {
    if (editForm) {
      onUpdateKanji(id, editForm);
    }
    setEditingId(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKanjiChar.trim() || !newMeaning.trim()) return;

    const examples = [];
    if (newExWord.trim()) {
      examples.push({
        word: newExWord.trim(),
        reading: newExReading.trim() || newExWord.trim(),
        meaning: newExMeaning.trim() || 'Example usage',
      });
    }

    onAddKanji({
      kanji: newKanjiChar.trim(),
      meaning: newMeaning.trim(),
      onyomi: newOnyomi.trim(),
      kunyomi: newKunyomi.trim(),
      strokeCount: newStrokeCount || 4,
      level,
      examples,
      personalNotes: newNotes.trim() || 'Added during study session.',
      isLearned: false,
    });

    setNewKanjiChar('');
    setNewMeaning('');
    setNewOnyomi('');
    setNewKunyomi('');
    setNewNotes('');
    setNewExWord('');
    setNewExReading('');
    setNewExMeaning('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Mount Fuji Themed Header Banner */}
      <div className={`p-6 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
        isDarkMode
          ? 'bg-gradient-to-r from-stone-900 to-stone-900/90 border-stone-800'
          : 'bg-gradient-to-r from-rose-50/60 via-stone-50 to-white border-rose-100 shadow-xs'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#BC002D] text-white flex items-center justify-center shrink-0 shadow-md">
            {/* Mount Fuji SVG silhouette */}
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3L2 21h20L12 3z" />
              <path d="M8.5 13l3.5-3 3.5 3" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#BC002D]">
              <span>富士山 Mount Fuji Theme</span>
              <span>·</span>
              <span>Stroke Order & Brush Practice</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight font-japanese text-stone-900 dark:text-white">
              {level} Kanji Summit
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Conquer the kanji peak like ascending Mount Fuji. Total: <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{levelKanji.length}</span> kanji ({levelKanji.filter(k => k.isLearned).length} mastered)
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#BC002D] hover:bg-[#a00026] rounded-xl shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Kanji (+)</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by Kanji, English meaning, Onyomi, Kunyomi..."
          className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:border-[#BC002D] ${
            isDarkMode
              ? 'bg-stone-900 border-stone-800 text-stone-100'
              : 'bg-white border-stone-200 text-stone-900'
          }`}
        />
      </div>

      {/* Main Two-Zone Layout: Left Kanji Table (60%) & Right Interactive Stroke Practice Station (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Kanji Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`overflow-x-auto rounded-2xl border shadow-xs ${
            isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
          }`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'border-stone-800 text-stone-400 bg-stone-900/90' : 'border-stone-200 text-stone-500 bg-stone-50/60'
                }`}>
                  <th className="py-3 px-3 w-10 text-center">No.</th>
                  <th className="py-3 px-3">Kanji</th>
                  <th className="py-3 px-3">Meaning</th>
                  <th className="py-3 px-3">Onyomi / Kunyomi</th>
                  <th className="py-3 px-3 w-20 text-center">Strokes</th>
                  <th className="py-3 px-3 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                {filteredKanji.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400">
                      No kanji found matching search query.
                    </td>
                  </tr>
                ) : (
                  filteredKanji.map((item, idx) => {
                    const isSelected = selectedKanji?.id === item.id;
                    const isEditing = editingId === item.id;

                    if (isEditing) {
                      return (
                        <tr key={item.id} className="bg-red-50/40 dark:bg-stone-800/60">
                          <td className="py-2 px-3 text-center font-mono text-[11px]">{idx + 1}</td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={editForm.kanji || ''}
                              onChange={e => setEditForm({ ...editForm, kanji: e.target.value })}
                              className="w-12 px-2 py-1 text-center font-japanese font-bold text-base border rounded bg-white dark:bg-stone-900"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={editForm.meaning || ''}
                              onChange={e => setEditForm({ ...editForm, meaning: e.target.value })}
                              className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-stone-900"
                            />
                          </td>
                          <td className="py-2 px-3 space-y-1">
                            <input
                              type="text"
                              value={editForm.onyomi || ''}
                              onChange={e => setEditForm({ ...editForm, onyomi: e.target.value })}
                              placeholder="Onyomi"
                              className="w-full px-2 py-0.5 text-[11px] border rounded bg-white dark:bg-stone-900"
                            />
                            <input
                              type="text"
                              value={editForm.kunyomi || ''}
                              onChange={e => setEditForm({ ...editForm, kunyomi: e.target.value })}
                              placeholder="Kunyomi"
                              className="w-full px-2 py-0.5 text-[11px] border rounded bg-white dark:bg-stone-900"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              value={editForm.strokeCount || 1}
                              onChange={e => setEditForm({ ...editForm, strokeCount: Number(e.target.value) })}
                              className="w-12 px-1 py-1 text-center border rounded bg-white dark:bg-stone-900"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleSaveEdit(item.id)}
                                className="p-1.5 text-emerald-600 rounded-lg"
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1.5 text-stone-400 rounded-lg"
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
                        onClick={() => setSelectedKanji(item)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#BC002D]/10 dark:bg-[#BC002D]/20 font-medium'
                            : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'
                        }`}
                      >
                        <td className="py-3 px-3 text-center font-mono text-stone-400 text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-japanese text-3xl font-extrabold text-[#BC002D] block">
                            {item.kanji}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-stone-900 dark:text-white">
                            {item.meaning}
                          </div>
                          {item.examples && item.examples.length > 0 && (
                            <div className="text-[11px] text-stone-500 truncate max-w-[140px] mt-0.5">
                              e.g. {item.examples[0].word} ({item.examples[0].meaning})
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-[11px] text-stone-700 dark:text-stone-300 font-japanese">
                            <span className="text-stone-400 mr-1 text-[10px]">音:</span>
                            {item.onyomi || '—'}
                          </div>
                          <div className="text-[11px] text-stone-600 dark:text-stone-400 font-japanese">
                            <span className="text-stone-400 mr-1 text-[10px]">訓:</span>
                            {item.kunyomi || '—'}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-stone-600 dark:text-stone-300">
                          {item.strokeCount}
                        </td>
                        <td className="py-3 px-3 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                              title="Edit Kanji"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteKanji(item.id)}
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                              title="Delete Kanji"
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
        </div>

        {/* Right Column: Interactive Stroke Order & Drawing Practice Station */}
        <div className="lg:col-span-5">
          {selectedKanji ? (
            <div className={`p-6 rounded-3xl border shadow-md space-y-6 sticky top-20 transition-all ${
              isDarkMode ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
            }`}>
              {/* Top Banner with Kanji & Audio */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-6xl font-extrabold font-japanese text-[#BC002D]">
                      {selectedKanji.kanji}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">
                        {selectedKanji.meaning}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                        <span>{selectedKanji.strokeCount} Strokes</span>
                        <span>·</span>
                        <button
                          onClick={() => onUpdateKanji(selectedKanji.id, { isLearned: !selectedKanji.isLearned })}
                          className={`flex items-center gap-1 font-semibold cursor-pointer ${
                            selectedKanji.isLearned ? 'text-emerald-600' : 'text-stone-400'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{selectedKanji.isLearned ? 'Mastered' : 'Mark Mastered'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => speakJapanese(`${selectedKanji.onyomi} ${selectedKanji.kunyomi}`)}
                  className="p-2 text-stone-400 hover:text-[#BC002D] rounded-full border border-stone-200 dark:border-stone-800 transition-colors"
                  title="Listen to Readings"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Readings Block */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className={`p-3 rounded-2xl border ${
                  isDarkMode ? 'bg-stone-800/60 border-stone-700' : 'bg-stone-50 border-stone-200'
                }`}>
                  <span className="text-[10px] uppercase font-semibold text-stone-400 block mb-0.5">
                    Onyomi (音読み - Chinese)
                  </span>
                  <span className="font-japanese text-sm font-bold text-stone-800 dark:text-stone-100">
                    {selectedKanji.onyomi || 'None'}
                  </span>
                </div>
                <div className={`p-3 rounded-2xl border ${
                  isDarkMode ? 'bg-stone-800/60 border-stone-700' : 'bg-stone-50 border-stone-200'
                }`}>
                  <span className="text-[10px] uppercase font-semibold text-stone-400 block mb-0.5">
                    Kunyomi (訓読み - Japanese)
                  </span>
                  <span className="font-japanese text-sm font-bold text-stone-800 dark:text-stone-100">
                    {selectedKanji.kunyomi || 'None'}
                  </span>
                </div>
              </div>

              {/* Stroke Order Step Guide */}
              {selectedKanji.strokeGuide && selectedKanji.strokeGuide.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Stroke Order Sequence
                  </h4>
                  <ol className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                    {selectedKanji.strokeGuide.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#BC002D]/10 text-[#BC002D] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Interactive Calligraphy Practice Canvas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-200">
                    <PenTool className="w-3.5 h-3.5 text-[#BC002D]" />
                    <span>Practice Drawing Canvas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBrushColor('#BC002D')}
                      className={`w-3.5 h-3.5 rounded-full bg-[#BC002D] border-2 ${
                        brushColor === '#BC002D' ? 'ring-2 ring-red-400' : ''
                      }`}
                      title="Japanese Red Ink"
                    />
                    <button
                      type="button"
                      onClick={() => setBrushColor(isDarkMode ? '#ffffff' : '#1E1F22')}
                      className={`w-3.5 h-3.5 rounded-full border-2 ${
                        isDarkMode ? 'bg-white' : 'bg-stone-900'
                      }`}
                      title="Sumi Black Ink"
                    />
                    <button
                      onClick={clearPracticeCanvas}
                      className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>

                <div className="relative flex justify-center">
                  {/* Subtle faint watermark of the target kanji to trace over */}
                  <span
                    className="absolute inset-0 flex items-center justify-center text-8xl font-extrabold font-japanese select-none pointer-events-none text-stone-200 dark:text-stone-800"
                    aria-hidden="true"
                  >
                    {selectedKanji.kanji}
                  </span>

                  <canvas
                    ref={canvasRef}
                    width={220}
                    height={220}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className={`relative z-10 w-[220px] h-[220px] rounded-2xl border cursor-crosshair ${
                      isDarkMode ? 'bg-stone-950/80 border-stone-800' : 'bg-white border-stone-300'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-center text-stone-400 mt-1.5">
                  Trace strokes directly on the canvas above using mouse or touch.
                </p>
              </div>

              {/* Vocabulary Examples */}
              {selectedKanji.examples && selectedKanji.examples.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Compound Vocabulary Examples
                  </h4>
                  <div className="space-y-2">
                    {selectedKanji.examples.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                          isDarkMode ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div>
                          <div className="font-japanese font-bold text-sm text-stone-900 dark:text-white">
                            {ex.word}{' '}
                            <span className="font-normal text-xs text-stone-500">
                              ({ex.reading})
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500">{ex.meaning}</div>
                        </div>
                        <button
                          onClick={() => speakJapanese(ex.word)}
                          className="p-1 text-stone-400 hover:text-[#BC002D]"
                          title="Listen to compound word"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Notes */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
                  Personal Study Notes
                </h4>
                <div className={`p-3 rounded-2xl border text-xs leading-relaxed ${
                  isDarkMode ? 'bg-stone-800/30 border-stone-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}>
                  {selectedKanji.personalNotes || 'No notes added yet.'}
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-12 text-center rounded-3xl border ${
              isDarkMode ? 'bg-stone-900 border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-500'
            }`}>
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Select any kanji from the table to view stroke orders, practice brush strokes, and study compound examples.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Kanji Modal */}
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
              <div className="w-10 h-10 rounded-xl bg-[#BC002D] text-white flex items-center justify-center font-bold text-lg font-japanese">
                字
              </div>
              <div>
                <h3 className="text-lg font-bold font-japanese">Add New {level} Kanji</h3>
                <p className="text-xs text-stone-500">Add character, meaning, onyomi, and kunyomi.</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Kanji Character *</label>
                  <input
                    type="text"
                    value={newKanjiChar}
                    onChange={e => setNewKanjiChar(e.target.value)}
                    placeholder="e.g. 桜"
                    required
                    maxLength={2}
                    className={`w-full px-3 py-2 text-base font-japanese text-center font-bold rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                      isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Stroke Count</label>
                  <input
                    type="number"
                    value={newStrokeCount}
                    onChange={e => setNewStrokeCount(Number(e.target.value))}
                    min={1}
                    max={40}
                    className={`w-full px-3 py-2 text-sm text-center rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                      isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">English Meaning *</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Onyomi (音)</label>
                  <input
                    type="text"
                    value={newOnyomi}
                    onChange={e => setNewOnyomi(e.target.value)}
                    placeholder="e.g. オウ"
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                      isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Kunyomi (訓)</label>
                  <input
                    type="text"
                    value={newKunyomi}
                    onChange={e => setNewKunyomi(e.target.value)}
                    placeholder="e.g. さくら"
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                      isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Example Compound Word</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newExWord}
                    onChange={e => setNewExWord(e.target.value)}
                    placeholder="Word (桜花)"
                    className={`px-2 py-1.5 text-xs rounded-xl border focus:outline-none ${
                      isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                  <input
                    type="text"
                    value={newExReading}
                    onChange={e => setNewExReading(e.target.value)}
                    placeholder="Reading (おうか)"
                    className={`px-2 py-1.5 text-xs rounded-xl border focus:outline-none ${
                      isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                  <input
                    type="text"
                    value={newExMeaning}
                    onChange={e => setNewExMeaning(e.target.value)}
                    placeholder="Meaning"
                    className={`px-2 py-1.5 text-xs rounded-xl border focus:outline-none ${
                      isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Personal Notes</label>
                <textarea
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Mnemonic or study notes..."
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
                  Save Kanji
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
