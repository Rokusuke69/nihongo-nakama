/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, BookOpen, Layers, FileText, ArrowRight } from 'lucide-react';
import { VocabItem, KanjiItem, GrammarItem, ReadingMaterial, JLPTLevel } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  vocabList: VocabItem[];
  kanjiList: KanjiItem[];
  grammarList: GrammarItem[];
  readingList: ReadingMaterial[];
  onSelectResult: (level: JLPTLevel, tab: 'vocabulary' | 'kanji' | 'grammar' | 'reading') => void;
  isDarkMode: boolean;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  vocabList,
  kanjiList,
  grammarList,
  readingList,
  onSelectResult,
  isDarkMode,
}) => {
  const [query, setQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return { vocab: [], kanji: [], grammar: [], reading: [] };
    const q = query.toLowerCase().trim();

    return {
      vocab: vocabList.filter(
        v =>
          v.japanese.toLowerCase().includes(q) ||
          v.furigana.toLowerCase().includes(q) ||
          v.romaji.toLowerCase().includes(q) ||
          v.meaning.toLowerCase().includes(q)
      ).slice(0, 5),
      kanji: kanjiList.filter(
        k =>
          k.kanji.toLowerCase().includes(q) ||
          k.meaning.toLowerCase().includes(q) ||
          k.onyomi.toLowerCase().includes(q) ||
          k.kunyomi.toLowerCase().includes(q)
      ).slice(0, 5),
      grammar: grammarList.filter(
        g =>
          g.title.toLowerCase().includes(q) ||
          g.meaning.toLowerCase().includes(q) ||
          g.structure.toLowerCase().includes(q)
      ).slice(0, 5),
      reading: readingList.filter(
        r =>
          r.title.toLowerCase().includes(q) ||
          r.japaneseTitle.toLowerCase().includes(q) ||
          r.englishSummary.toLowerCase().includes(q)
      ).slice(0, 5),
    };
  }, [query, vocabList, kanjiList, grammarList, readingList]);

  if (!isOpen) return null;

  const totalResultsCount =
    results.vocab.length + results.kanji.length + results.grammar.length + results.reading.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs">
      <div className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden transition-all ${
        isDarkMode ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
      }`}>
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search across all Vocabulary, Kanji, Grammar, and Folk Tales (N5–N1)..."
            autoFocus
            className="w-full text-sm bg-transparent focus:outline-none placeholder:text-stone-400 font-sans-clean"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {!query.trim() ? (
            <div className="py-12 text-center text-stone-400">
              <p>Type any keyword (e.g. &quot;桜&quot;, &quot;friend&quot;, &quot;te-form&quot;, &quot;Momotaro&quot;) to search across all JLPT levels.</p>
            </div>
          ) : totalResultsCount === 0 ? (
            <div className="py-12 text-center text-stone-400">
              <p>No results found for &quot;{query}&quot;.</p>
            </div>
          ) : (
            <>
              {/* Vocabulary Results */}
              {results.vocab.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-[#BC002D]" />
                    <span>Vocabulary ({results.vocab.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.vocab.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectResult(item.level, 'vocabulary');
                          onClose();
                        }}
                        className="p-3 rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-800/60 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#BC002D]/10 text-[#BC002D]">
                            {item.level}
                          </span>
                          <div>
                            <span className="font-japanese font-bold text-sm text-stone-900 dark:text-white mr-2">
                              {item.japanese}
                            </span>
                            <span className="text-stone-500 font-japanese mr-2">
                              {item.furigana}
                            </span>
                            <span className="text-stone-700 dark:text-stone-300">
                              {item.meaning}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kanji Results */}
              {results.kanji.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                    <span className="font-japanese font-bold text-xs text-[#BC002D]">字</span>
                    <span>Kanji ({results.kanji.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.kanji.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectResult(item.level, 'kanji');
                          onClose();
                        }}
                        className="p-3 rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-800/60 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#BC002D]/10 text-[#BC002D]">
                            {item.level}
                          </span>
                          <span className="font-japanese font-bold text-xl text-[#BC002D]">
                            {item.kanji}
                          </span>
                          <div>
                            <span className="font-semibold text-stone-900 dark:text-white mr-2">
                              {item.meaning}
                            </span>
                            <span className="text-stone-400 text-[11px]">
                              {item.onyomi} · {item.kunyomi}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grammar Results */}
              {results.grammar.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-[#BC002D]" />
                    <span>Grammar Notes ({results.grammar.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.grammar.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectResult(item.level, 'grammar');
                          onClose();
                        }}
                        className="p-3 rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-800/60 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#BC002D]/10 text-[#BC002D]">
                            {item.level}
                          </span>
                          <div>
                            <span className="font-japanese font-bold text-stone-900 dark:text-white mr-2">
                              {item.title}
                            </span>
                            <span className="text-stone-500">{item.meaning}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reading Results */}
              {results.reading.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-[#BC002D]" />
                    <span>Reading Documents ({results.reading.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.reading.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectResult(item.level, 'reading');
                          onClose();
                        }}
                        className="p-3 rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-800/60 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#BC002D]/10 text-[#BC002D]">
                            {item.level}
                          </span>
                          <div>
                            <span className="font-japanese font-bold text-stone-900 dark:text-white mr-2">
                              {item.japaneseTitle}
                            </span>
                            <span className="text-stone-500">{item.title}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
