/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  JLPTLevel,
  VocabItem,
  KanjiItem,
  GrammarItem,
  ReadingMaterial,
  DailyStudyStat,
} from './types';
import {
  initialUser,
  initialVocab,
  initialKanji,
  initialGrammar,
  initialReading,
  initialWeeklyStats,
} from './data/seedData';
import { JapaneseFlagLanding } from './components/JapaneseFlagLanding';
import { TopNav } from './components/TopNav';
import { JLPTLevelDashboard } from './components/JLPTLevelDashboard';
import { JLPTLevelWorkspace } from './components/JLPTLevelWorkspace';
import { GlobalSearchModal } from './components/GlobalSearchModal';

const STORAGE_KEY_PREFIX = 'nihongo_nakama_';

export default function App() {
  // Check autostart param from ultra-mode verification requirement
  const isAutostart = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  // State: Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}theme`);
      if (saved) return saved === 'dark';
    }
    return false;
  });

  // State: Auth
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (isAutostart) return initialUser;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>([initialUser]);

  // State: Active View & Level
  const [activeView, setActiveView] = useState<'dashboard' | 'workspace'>(
    isAutostart ? 'dashboard' : 'dashboard'
  );
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');

  // State: Curriculum Data
  const [vocabList, setVocabList] = useState<VocabItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}vocab`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return initialVocab;
  });

  const [kanjiList, setKanjiList] = useState<KanjiItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}kanji`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return initialKanji;
  });

  const [grammarList, setGrammarList] = useState<GrammarItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}grammar`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return initialGrammar;
  });

  const [readingList, setReadingList] = useState<ReadingMaterial[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}reading`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return initialReading;
  });

  const [weeklyStats, setWeeklyStats] = useState<DailyStudyStat[]>(initialWeeklyStats);

  // Focus Study Timer State
  const [studyTimeSeconds, setStudyTimeSeconds] = useState(1440); // 24 minutes initial
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Ticking study timer
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setStudyTimeSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Persist Curriculum State to LocalStorage (Autosave)
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}vocab`, JSON.stringify(vocabList));
    } catch {}
  }, [vocabList]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}kanji`, JSON.stringify(kanjiList));
    } catch {}
  }, [kanjiList]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}grammar`, JSON.stringify(grammarList));
    } catch {}
  }, [grammarList]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}reading`, JSON.stringify(readingList));
    } catch {}
  }, [readingList]);

  // Sync Theme to HTML class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, 'light');
    }
  }, [isDarkMode]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(user));
    } catch {}
    setActiveView('dashboard');
  };

  const handleRegisterUser = (newUser: User) => {
    setRegisteredUsers(prev => [...prev, newUser]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}user`);
    } catch {}
  };

  // Level Selection Handler
  const handleSelectLevel = (level: JLPTLevel) => {
    setSelectedLevel(level);
    setActiveView('workspace');
  };

  // Vocab CRUD Handlers
  const handleAddVocab = (item: Omit<VocabItem, 'id' | 'createdAt'>) => {
    const newItem: VocabItem = {
      ...item,
      id: `v_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setVocabList(prev => [newItem, ...prev]);
  };

  const handleUpdateVocab = (id: string, updates: Partial<VocabItem>) => {
    setVocabList(prev =>
      prev.map(v => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const handleDeleteVocab = (id: string) => {
    setVocabList(prev => prev.filter(v => v.id !== id));
  };

  const handleImportVocab = (items: VocabItem[]) => {
    setVocabList(prev => [...items, ...prev]);
  };

  // Kanji CRUD Handlers
  const handleAddKanji = (item: Omit<KanjiItem, 'id' | 'createdAt'>) => {
    const newItem: KanjiItem = {
      ...item,
      id: `k_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setKanjiList(prev => [newItem, ...prev]);
  };

  const handleUpdateKanji = (id: string, updates: Partial<KanjiItem>) => {
    setKanjiList(prev =>
      prev.map(k => (k.id === id ? { ...k, ...updates } : k))
    );
  };

  const handleDeleteKanji = (id: string) => {
    setKanjiList(prev => prev.filter(k => k.id !== id));
  };

  // Grammar CRUD Handlers
  const handleAddGrammar = (item: Omit<GrammarItem, 'id' | 'createdAt'>) => {
    const newItem: GrammarItem = {
      ...item,
      id: `g_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGrammarList(prev => [newItem, ...prev]);
  };

  const handleUpdateGrammar = (id: string, updates: Partial<GrammarItem>) => {
    setGrammarList(prev =>
      prev.map(g => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  const handleDeleteGrammar = (id: string) => {
    setGrammarList(prev => prev.filter(g => g.id !== id));
  };

  // Reading CRUD Handlers
  const handleAddReading = (item: Omit<ReadingMaterial, 'id'>) => {
    const newItem: ReadingMaterial = {
      ...item,
      id: `read_${Date.now()}`,
    };
    setReadingList(prev => [newItem, ...prev]);
  };

  const handleUpdateReading = (id: string, updates: Partial<ReadingMaterial>) => {
    setReadingList(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const handleDeleteReading = (id: string) => {
    setReadingList(prev => prev.filter(r => r.id !== id));
  };

  // Backup & Restore Handlers
  const handleRestoreBackup = (data: {
    vocabulary: VocabItem[];
    kanji: KanjiItem[];
    grammar: GrammarItem[];
    reading: ReadingMaterial[];
  }) => {
    if (data.vocabulary && data.vocabulary.length) setVocabList(data.vocabulary);
    if (data.kanji && data.kanji.length) setKanjiList(data.kanji);
    if (data.grammar && data.grammar.length) setGrammarList(data.grammar);
    if (data.reading && data.reading.length) setReadingList(data.reading);
  };

  const handleResetToDefault = () => {
    setVocabList(initialVocab);
    setKanjiList(initialKanji);
    setGrammarList(initialGrammar);
    setReadingList(initialReading);
    setWeeklyStats(initialWeeklyStats);
  };

  // If user is not logged in, render Page 1 & Page 2 (The Japanese Flag with Split Red Circle & Auth)
  if (!currentUser) {
    return (
      <JapaneseFlagLanding
        onLoginSuccess={handleLoginSuccess}
        registeredUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  return (
    <div className={`min-h-screen w-full font-sans-clean transition-colors ${
      isDarkMode ? 'bg-[#121316] text-stone-100' : 'bg-[#FAF9F6] text-stone-900'
    }`}>
      {/* Universal 3-Zone Navigation Header */}
      <TopNav
        user={currentUser}
        onLogout={handleLogout}
        activeView={activeView}
        onNavigate={view => setActiveView(view)}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        selectedLevel={selectedLevel}
      />

      {/* Main App Screens */}
      {activeView === 'dashboard' ? (
        <JLPTLevelDashboard
          user={currentUser}
          onSelectLevel={handleSelectLevel}
          vocabList={vocabList}
          kanjiList={kanjiList}
          grammarList={grammarList}
          readingList={readingList}
          isDarkMode={isDarkMode}
          studyTimeSeconds={studyTimeSeconds}
          isTimerRunning={isTimerRunning}
          onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
        />
      ) : (
        <JLPTLevelWorkspace
          level={selectedLevel}
          onChangeLevel={setSelectedLevel}
          onBackToDashboard={() => setActiveView('dashboard')}
          user={currentUser}
          onUpdateUser={updates =>
            setCurrentUser(prev => (prev ? { ...prev, ...updates } : null))
          }
          vocabList={vocabList}
          onAddVocab={handleAddVocab}
          onUpdateVocab={handleUpdateVocab}
          onDeleteVocab={handleDeleteVocab}
          onImportVocab={handleImportVocab}
          kanjiList={kanjiList}
          onAddKanji={handleAddKanji}
          onUpdateKanji={handleUpdateKanji}
          onDeleteKanji={handleDeleteKanji}
          grammarList={grammarList}
          onAddGrammar={handleAddGrammar}
          onUpdateGrammar={handleUpdateGrammar}
          onDeleteGrammar={handleDeleteGrammar}
          readingList={readingList}
          onAddReading={handleAddReading}
          onUpdateReading={handleUpdateReading}
          onDeleteReading={handleDeleteReading}
          weeklyStats={weeklyStats}
          onRestoreBackup={handleRestoreBackup}
          onResetToDefault={handleResetToDefault}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        vocabList={vocabList}
        kanjiList={kanjiList}
        grammarList={grammarList}
        readingList={readingList}
        onSelectResult={(level, tab) => {
          setSelectedLevel(level);
          setActiveView('workspace');
        }}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
