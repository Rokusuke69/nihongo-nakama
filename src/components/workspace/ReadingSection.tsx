/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  BookOpen,
  Bookmark,
  ZoomIn,
  ZoomOut,
  Volume2,
  Trash2,
  X,
  Clock,
  Sparkles,
  Scroll,
} from 'lucide-react';
import { ReadingMaterial, JLPTLevel } from '../../types';
import { speakJapanese } from '../../utils/speech';

interface ReadingSectionProps {
  level: JLPTLevel;
  readingList: ReadingMaterial[];
  onAddReading: (item: Omit<ReadingMaterial, 'id'>) => void;
  onUpdateReading: (id: string, updates: Partial<ReadingMaterial>) => void;
  onDeleteReading: (id: string) => void;
  isDarkMode: boolean;
}

export const ReadingSection: React.FC<ReadingSectionProps> = ({
  level,
  readingList,
  onAddReading,
  onUpdateReading,
  onDeleteReading,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReaderItem, setActiveReaderItem] = useState<ReadingMaterial | null>(null);

  // Reader state
  const [fontSize, setFontSize] = useState<number>(16); // px
  const [activeTab, setActiveTab] = useState<'text' | 'notes'>('text');
  const [tempNotes, setTempNotes] = useState('');

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadJapaneseTitle, setUploadJapaneseTitle] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadContent, setUploadContent] = useState('');
  const [uploadSummary, setUploadSummary] = useState('');
  const [uploadTheme, setUploadTheme] = useState<'momotaro' | 'urashima' | 'kaguya' | 'crane' | 'kintaro' | 'custom'>('custom');

  const levelReading = useMemo(() => {
    return readingList.filter(r => r.level === level);
  }, [readingList, level]);

  const filteredReading = useMemo(() => {
    if (!searchQuery.trim()) return levelReading;
    const q = searchQuery.toLowerCase();
    return levelReading.filter(
      r =>
        r.title.toLowerCase().includes(q) ||
        r.japaneseTitle.toLowerCase().includes(q) ||
        r.englishSummary.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q)
    );
  }, [levelReading, searchQuery]);

  const openReader = (item: ReadingMaterial) => {
    setActiveReaderItem(item);
    setTempNotes(item.notes || '');
    setActiveTab('text');
  };

  const closeReader = () => {
    if (activeReaderItem && tempNotes !== activeReaderItem.notes) {
      onUpdateReading(activeReaderItem.id, { notes: tempNotes });
    }
    setActiveReaderItem(null);
  };

  const handleToggleBookmark = (chapterIdx: number) => {
    if (!activeReaderItem) return;
    const currentBookmarks = activeReaderItem.bookmarks || [];
    const updated = currentBookmarks.includes(chapterIdx)
      ? currentBookmarks.filter(b => b !== chapterIdx)
      : [...currentBookmarks, chapterIdx];

    onUpdateReading(activeReaderItem.id, { bookmarks: updated });
    setActiveReaderItem({ ...activeReaderItem, bookmarks: updated });
  };

  const handleUpdateProgress = (newProgress: number) => {
    if (!activeReaderItem) return;
    const bounded = Math.min(100, Math.max(0, newProgress));
    onUpdateReading(activeReaderItem.id, { readingProgress: bounded });
    setActiveReaderItem({ ...activeReaderItem, readingProgress: bounded });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    if (!uploadTitle) {
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      if (text) {
        setUploadContent(text);
      }
    };
    reader.readAsText(file);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadContent.trim()) return;

    onAddReading({
      title: uploadTitle.trim(),
      japaneseTitle: uploadJapaneseTitle.trim() || uploadTitle.trim(),
      filename: uploadFileName.trim() || `${uploadTitle.trim().toLowerCase().replace(/\s+/g, '_')}.txt`,
      fileType: uploadFileName.endsWith('.pdf') ? 'pdf' : uploadFileName.endsWith('.docx') ? 'docx' : 'story',
      uploadDate: new Date().toISOString().split('T')[0],
      coverTheme: uploadTheme,
      content: uploadContent.trim(),
      englishSummary: uploadSummary.trim() || 'Japanese reading practice document.',
      bookmarks: [],
      notes: '',
      readingProgress: 0,
      level,
      estimatedMinutes: Math.max(3, Math.round(uploadContent.length / 300)),
    });

    setUploadTitle('');
    setUploadJapaneseTitle('');
    setUploadFileName('');
    setUploadContent('');
    setUploadSummary('');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Japanese Folk Tales Themed Header Banner */}
      <div className={`p-6 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
        isDarkMode
          ? 'bg-gradient-to-r from-stone-900 to-stone-900/90 border-stone-800'
          : 'bg-gradient-to-r from-emerald-50/60 via-stone-50 to-white border-emerald-100 shadow-xs'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#BC002D] text-white flex items-center justify-center shrink-0 shadow-md">
            <Scroll className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#BC002D]">
              <span>昔話 Japanese Folk Tale Theme</span>
              <span>·</span>
              <span>Momotaro, Urashima, Kaguya-hime</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight font-japanese text-stone-900 dark:text-white">
              {level} Folk Tale Library & Document Reader
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Immerse yourself in legendary Japanese narratives. Total: <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{levelReading.length}</span> documents ({levelReading.filter(r => r.readingProgress >= 80).length} completed)
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#BC002D] hover:bg-[#a00026] rounded-xl shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reading Material (+)</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search folk tales, titles, vocabulary notes..."
          className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:border-[#BC002D] ${
            isDarkMode
              ? 'bg-stone-900 border-stone-800 text-stone-100'
              : 'bg-white border-stone-200 text-stone-900'
          }`}
        />
      </div>

      {/* Document Library Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Default Card 1: ➕ Add Reading Material */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer min-h-[260px] group ${
            isDarkMode
              ? 'border-stone-800 hover:border-[#BC002D] bg-stone-900/40 hover:bg-stone-900/80'
              : 'border-stone-300 hover:border-[#BC002D] bg-white/60 hover:bg-red-50/20 shadow-xs'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#BC002D]/10 text-[#BC002D] flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
            <Plus className="w-8 h-8" />
          </div>
          <span className="text-base font-bold font-japanese text-stone-900 dark:text-white">
            Add Reading Material
          </span>
          <span className="text-xs text-stone-500 mt-1 text-center max-w-[200px]">
            Upload PDF, DOCX, TXT or paste your own Japanese prose
          </span>
        </button>

        {/* Generated Reading Cards */}
        {filteredReading.map(item => {
          return (
            <div
              key={item.id}
              onClick={() => openReader(item)}
              className={`rounded-3xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-xl ${
                isDarkMode
                  ? 'bg-stone-900 border-stone-800 hover:border-stone-700'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Document Cover Header */}
              <div className="relative h-36 bg-gradient-to-br from-stone-800 via-stone-900 to-black p-4 flex flex-col justify-between overflow-hidden">
                {/* Decorative Japanese Calligraphy Crest Watermark */}
                <span className="absolute -right-4 -bottom-6 text-7xl font-japanese font-extrabold text-white/5 select-none pointer-events-none">
                  物語
                </span>

                <div className="relative z-10 flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white backdrop-blur-xs">
                    {item.level} · {item.fileType.toUpperCase()}
                  </span>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteReading(item.id);
                    }}
                    className="p-1 text-white/60 hover:text-red-400 rounded-lg transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative z-10">
                  <span className="text-xs font-japanese font-semibold text-rose-300 block">
                    {item.japaneseTitle}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight truncate">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Card Meta & Progress */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-stone-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.estimatedMinutes} min read</span>
                    </span>
                    <span>·</span>
                    <span>{item.uploadDate}</span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {item.englishSummary}
                  </p>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 mb-1">
                    <span>Reading Progress</span>
                    <span className="font-mono text-[#BC002D]">{item.readingProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-[#BC002D] rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(5, item.readingProgress)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Document Reader Modal */}
      {activeReaderItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/70 backdrop-blur-sm">
          <div className={`relative w-full max-w-4xl h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
            isDarkMode ? 'bg-[#121316] border-stone-800 text-stone-100' : 'bg-[#FAF9F6] border-stone-200 text-stone-900'
          }`}>
            {/* Reader Header Toolbar */}
            <div className={`px-6 py-4 border-b flex items-center justify-between gap-4 shrink-0 ${
              isDarkMode ? 'bg-stone-900/90 border-stone-800' : 'bg-white/90 border-stone-200'
            }`}>
              <div className="flex items-center gap-3 truncate">
                <div className="w-9 h-9 rounded-xl bg-[#BC002D] text-white flex items-center justify-center font-bold shrink-0">
                  読
                </div>
                <div className="truncate">
                  <h3 className="text-base font-bold font-japanese tracking-tight truncate">
                    {activeReaderItem.japaneseTitle}
                  </h3>
                  <p className="text-xs text-stone-500 truncate">
                    {activeReaderItem.title} · {activeReaderItem.filename}
                  </p>
                </div>
              </div>

              {/* Reader Action Affordances: Zoom, Audio, Tabs, Close */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Font Zoom Controls */}
                <div className="flex items-center border rounded-xl overflow-hidden border-stone-200 dark:border-stone-700">
                  <button
                    onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                    className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-xs font-mono font-semibold text-stone-600 dark:text-stone-300">
                    {fontSize}px
                  </span>
                  <button
                    onClick={() => setFontSize(prev => Math.min(28, prev + 2))}
                    className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Audio Narration */}
                <button
                  onClick={() => speakJapanese(activeReaderItem.content.slice(0, 300))}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#BC002D]/10 text-[#BC002D] hover:bg-[#BC002D]/20 transition-colors"
                  title="Listen to Japanese Narration"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Read Aloud</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={closeReader}
                  className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl"
                  title="Close Reader"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reader Tab Navigation (Text view vs Personal Notes) */}
            <div className={`px-6 py-2 border-b flex items-center justify-between text-xs ${
              isDarkMode ? 'bg-stone-900/40 border-stone-800' : 'bg-stone-100/60 border-stone-200'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeTab === 'text'
                      ? 'bg-[#BC002D] text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  Japanese Manuscript
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeTab === 'notes'
                      ? 'bg-[#BC002D] text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  Study Notes & Bookmarks
                </button>
              </div>

              {/* Progress Slider */}
              <div className="flex items-center gap-2">
                <span className="text-stone-400">Progress:</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={activeReaderItem.readingProgress}
                  onChange={e => handleUpdateProgress(Number(e.target.value))}
                  className="w-24 accent-[#BC002D]"
                />
                <span className="font-mono font-bold text-[#BC002D]">
                  {activeReaderItem.readingProgress}%
                </span>
              </div>
            </div>

            {/* Reader Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 font-japanese">
              {activeTab === 'text' ? (
                <div
                  className="max-w-2xl mx-auto leading-loose whitespace-pre-line tracking-wide selection:bg-[#BC002D]/15 selection:text-[#BC002D]"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {activeReaderItem.content}
                </div>
              ) : (
                <div className="max-w-2xl mx-auto space-y-6 font-sans-clean">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-2 flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-[#BC002D]" />
                      <span>Chapter Bookmarks</span>
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {[1, 2, 3, 4].map(ch => {
                        const isBookmarked = activeReaderItem.bookmarks?.includes(ch);
                        return (
                          <button
                            key={ch}
                            onClick={() => handleToggleBookmark(ch)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              isBookmarked
                                ? 'bg-[#BC002D] text-white border-[#BC002D]'
                                : 'bg-stone-50 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'
                            }`}
                          >
                            Chapter {ch} {isBookmarked ? '★' : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-2">
                      Vocabulary & Cultural Notes
                    </h4>
                    <textarea
                      value={tempNotes}
                      onChange={e => setTempNotes(e.target.value)}
                      placeholder="Type your translation notes, kanji observations, or grammar questions..."
                      rows={8}
                      className={`w-full p-4 rounded-2xl border text-xs focus:outline-none focus:border-[#BC002D] ${
                        isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-300'
                      }`}
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Notes are saved automatically when closing the reader.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Reader Footer Controls */}
            <div className={`px-6 py-3 border-t flex items-center justify-between text-xs ${
              isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
            }`}>
              <div className="text-stone-500">
                {activeReaderItem.englishSummary}
              </div>
              <button
                onClick={() => handleUpdateProgress(100)}
                className="px-3 py-1.5 bg-[#BC002D] text-white font-semibold rounded-xl hover:bg-[#a00026] transition-colors"
              >
                Mark Finished (100%)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reading Material Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`relative w-full max-w-lg rounded-3xl p-6 border shadow-2xl transition-all max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-900'
          }`}>
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#BC002D] text-white flex items-center justify-center font-bold">
                草
              </div>
              <div>
                <h3 className="text-lg font-bold font-japanese">Add Reading Material</h3>
                <p className="text-xs text-stone-500">Upload PDF, DOCX, TXT or paste Japanese text.</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              {/* File Upload Affordance */}
              <div className={`p-4 rounded-2xl border-2 border-dashed text-center ${
                isDarkMode ? 'border-stone-700 bg-stone-800/40' : 'border-stone-300 bg-stone-50'
              }`}>
                <input
                  type="file"
                  accept=".txt,.pdf,.docx,.doc"
                  onChange={handleFileUpload}
                  id="reading-file-input"
                  className="hidden"
                />
                <label
                  htmlFor="reading-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <BookOpen className="w-6 h-6 text-[#BC002D] mb-1" />
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                    {uploadFileName ? uploadFileName : 'Choose file (PDF, DOCX, TXT)'}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    Click to browse local files
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Story / Document Title *</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="e.g. The Grateful Crane"
                  required
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Japanese Title (漢字/かな)</label>
                <input
                  type="text"
                  value={uploadJapaneseTitle}
                  onChange={e => setUploadJapaneseTitle(e.target.value)}
                  placeholder="e.g. 鶴の恩返し（つるのおんがえし）"
                  className={`w-full px-3 py-2 text-sm font-japanese rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">English Summary</label>
                <input
                  type="text"
                  value={uploadSummary}
                  onChange={e => setUploadSummary(e.target.value)}
                  placeholder="Brief synopsis for quick study review..."
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Japanese Text Content *
                </label>
                <textarea
                  value={uploadContent}
                  onChange={e => setUploadContent(e.target.value)}
                  placeholder="Paste or edit the full Japanese text here..."
                  rows={6}
                  required
                  className={`w-full p-3 text-xs font-japanese rounded-xl border focus:outline-none focus:border-[#BC002D] ${
                    isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#BC002D] hover:bg-[#a00026] rounded-xl shadow-xs"
                >
                  Create Reading Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
