/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Moon, Search, LogOut, Flame } from 'lucide-react';
import { User } from '../types';

interface TopNavProps {
  user: User;
  onLogout: () => void;
  activeView: 'dashboard' | 'workspace';
  onNavigate: (view: 'dashboard' | 'workspace') => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  selectedLevel?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  user,
  onLogout,
  activeView,
  onNavigate,
  onOpenSearch,
  isDarkMode,
  onToggleTheme,
  selectedLevel = 'N5',
}) => {
  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors ${
      isDarkMode
        ? 'bg-[#121316]/90 border-stone-800 text-stone-100'
        : 'bg-white/90 border-stone-200 text-stone-900'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand wordmark (single element) */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-[#BC002D] flex items-center justify-center text-white font-bold text-sm shadow-xs">
            和
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight font-japanese">
              Nihongo Nakama
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeView === 'dashboard'
                ? 'text-[#BC002D] font-semibold'
                : isDarkMode ? 'text-stone-300 hover:text-white' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            JLPT Levels
          </button>

          <button
            onClick={() => onNavigate('workspace')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeView === 'workspace'
                ? 'text-[#BC002D] font-semibold'
                : isDarkMode ? 'text-stone-300 hover:text-white' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            {selectedLevel} Study Center
          </button>

          <button
            onClick={onOpenSearch}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              isDarkMode ? 'text-stone-300 hover:text-white' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
            <kbd className={`ml-1 text-[10px] px-1.5 py-0.5 rounded border ${
              isDarkMode ? 'bg-stone-800 border-stone-700 text-stone-400' : 'bg-stone-100 border-stone-200 text-stone-500'
            }`}>
              ⌘K
            </kbd>
          </button>
        </nav>

        {/* Zone 3: 1 primary action area */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Study streak counter */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${
              isDarkMode
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
            title={`${user.streakDays}-day active learning streak`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{user.streakDays}d Streak</span>
          </div>

          {/* Dark / Light mode toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDarkMode
                ? 'text-stone-300 hover:text-white hover:bg-stone-800'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
            aria-label="Toggle theme"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-800">
            <span className="hidden sm:inline text-xs font-medium truncate max-w-[120px]">
              {user.username}
            </span>
            <button
              onClick={onLogout}
              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
