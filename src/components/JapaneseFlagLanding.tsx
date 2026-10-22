/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { evaluatePasswordStrength, PasswordStrength } from '../utils/jlptLogic';
import { SakuraPetalsCanvas } from './SakuraPetalsCanvas';
import { User } from '../types';

interface JapaneseFlagLandingProps {
  onLoginSuccess: (user: User) => void;
  registeredUsers: User[];
  onRegisterUser: (user: User) => void;
}

export const JapaneseFlagLanding: React.FC<JapaneseFlagLandingProps> = ({
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
}) => {
  const [activeMode, setActiveMode] = useState<'idle' | 'signup' | 'login' | 'forgot'>('idle');

  // Sign up state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('kenji.learner@nihongonakama.jp');
  const [loginPassword, setLoginPassword] = useState('Sakura#2026!');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const pwdStrength: PasswordStrength = evaluatePasswordStrength(regPassword);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regUsername.trim()) {
      setRegError('Please enter your Japanese study username');
      return;
    }
    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setRegError('Please provide a valid email address');
      return;
    }
    if (regPassword.length < 8) {
      setRegError('Password must be at least 8 characters long');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match');
      return;
    }

    const existing = registeredUsers.find(u => u.email.toLowerCase() === regEmail.toLowerCase());
    if (existing) {
      setRegError('An account with this email already exists. Please login instead.');
      return;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      username: regUsername.trim(),
      email: regEmail.trim(),
      streakDays: 1,
      dailyGoalMinutes: 30,
      minutesStudiedToday: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    onRegisterUser(newUser);
    setRegSuccess('Account created successfully! Redirecting to login...');
    setTimeout(() => {
      setLoginEmail(newUser.email);
      setActiveMode('login');
      setRegSuccess('');
    }, 1200);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError('Please enter both your email and password');
      return;
    }

    const user = registeredUsers.find(
      u => u.email.toLowerCase() === loginEmail.toLowerCase().trim()
    );

    // Accept user or demo credentials
    if (user) {
      onLoginSuccess(user);
    } else if (loginEmail.includes('@')) {
      // Create instant session for new user
      const instantUser: User = {
        id: `usr_${Date.now()}`,
        username: loginEmail.split('@')[0],
        email: loginEmail,
        streakDays: 3,
        dailyGoalMinutes: 30,
        minutesStudiedToday: 15,
        lastActiveDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };
      onRegisterUser(instantUser);
      onLoginSuccess(instantUser);
    } else {
      setLoginError('Invalid email format. Please check your credentials.');
    }
  };

  const handleDemoQuickLogin = () => {
    const demoUser = registeredUsers[0] || {
      id: 'usr_nihon_01',
      username: 'Kenji Sato',
      email: 'kenji.learner@nihongonakama.jp',
      streakDays: 7,
      dailyGoalMinutes: 30,
      minutesStudiedToday: 24,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: '2026-03-01T08:00:00.000Z',
    };
    onLoginSuccess(demoUser);
  };

  return (
    <div className="relative min-h-screen w-full bg-white text-stone-900 flex flex-col items-center justify-center overflow-hidden selection:bg-[#BC002D]/10 selection:text-[#BC002D]">
      {/* Background Sakura Petals */}
      <SakuraPetalsCanvas count={36} opacity={0.9} />

      {/* Subtle Japanese Minimalist Calligraphy Header */}
      <header className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-20 gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 font-japanese whitespace-nowrap">
            日本語の仲間
          </span>
          <span className="hidden sm:inline text-xs font-medium tracking-wide text-stone-500 uppercase whitespace-nowrap">
            Nihongo Nakama
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDemoQuickLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#BC002D] bg-[#BC002D]/5 hover:bg-[#BC002D]/10 rounded-full transition-all border border-[#BC002D]/20 shadow-xs cursor-pointer whitespace-nowrap"
            title="Instant Demo Access"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Access</span>
          </button>
        </div>
      </header>

      {/* Main Viewport: The Japanese Flag Red Circle (Split into SIGN UP / LOGIN) */}
      <main className="relative z-10 flex flex-col items-center justify-center p-4 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {activeMode === 'idle' ? (
            /* Page 1: The Split Japanese Flag Circle */
            <motion.div
              key="flag-circle"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              {/* Title & Subtext */}
              <div className="text-center mb-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#BC002D]">
                  Japanese Language Companion & JLPT N5–N1
                </span>
                <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-japanese text-stone-900">
                  日 本 語 の 仲 間
                </h1>
                <p className="mt-2 text-sm text-stone-500 max-w-md mx-auto">
                  Click the red circle to begin your journey. Select Sign Up to create your study profile, or Login to continue.
                </p>
              </div>

              {/* The Large Split Red Circle (Diameter ~340px to 420px) */}
              <div
                className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 rounded-full shadow-2xl flex items-center justify-center bg-transparent group"
                style={{
                  boxShadow: '0 25px 60px -15px rgba(188, 0, 45, 0.35), 0 0 0 1px rgba(188, 0, 45, 0.08)',
                }}
              >
                {/* Left Half: SIGN UP */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveMode('signup')}
                  className="relative w-1/2 h-full bg-[#BC002D] japan-half-left flex flex-col items-center justify-center text-white cursor-pointer overflow-hidden border-r border-white/20 hover:brightness-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-400/50"
                  aria-label="Sign Up"
                >
                  <span className="text-xs tracking-widest uppercase font-japanese text-white/90 mb-1">
                    新規登録
                  </span>
                  <span className="text-xl sm:text-2xl font-bold tracking-wider">
                    SIGN UP
                  </span>
                  <span className="mt-2 text-[11px] text-white/70 tracking-wide font-sans-clean">
                    Create Study Profile
                  </span>
                </motion.button>

                {/* Right Half: LOGIN */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveMode('login')}
                  className="relative w-1/2 h-full bg-[#BC002D] japan-half-right flex flex-col items-center justify-center text-white cursor-pointer overflow-hidden border-l border-white/20 hover:brightness-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-400/50"
                  aria-label="Login"
                >
                  <span className="text-xs tracking-widest uppercase font-japanese text-white/90 mb-1">
                    ログイン
                  </span>
                  <span className="text-xl sm:text-2xl font-bold tracking-wider">
                    LOGIN
                  </span>
                  <span className="mt-2 text-[11px] text-white/70 tracking-wide font-sans-clean">
                    Resume Learning
                  </span>
                </motion.button>

                {/* Center Japanese Crest / Subtle Divider Line */}
                <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-px bg-white/30 pointer-events-none" />
                <div className="absolute w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center pointer-events-none z-10 border border-stone-200">
                  <span className="text-sm font-bold text-[#BC002D] font-japanese">
                    和
                  </span>
                </div>
              </div>

              {/* Quick instructions */}
              <div className="mt-8 flex items-center gap-6 text-xs text-stone-500">
                <span>Torii Gates Vocabulary</span>
                <span>·</span>
                <span>Mount Fuji Kanji</span>
                <span>·</span>
                <span>Folk Tales Library</span>
              </div>
            </motion.div>
          ) : activeMode === 'signup' ? (
            /* Page 2: Registration Form inside the Japanese aesthetic container */
            <motion.div
              key="auth-signup"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-stone-200 shadow-2xl"
              style={{
                boxShadow: '0 25px 50px -12px rgba(188, 0, 45, 0.18)',
              }}
            >
              {/* Back to flag button */}
              <button
                type="button"
                onClick={() => setActiveMode('idle')}
                className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 mb-4 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Flag Circle</span>
              </button>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-japanese">
                    新規会員登録
                  </h2>
                  <p className="text-xs text-stone-500">
                    Create your Nihongo Nakama student account
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#BC002D]/10 flex items-center justify-center text-[#BC002D] font-bold">
                  友
                </div>
              </div>

              {regError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={e => setRegUsername(e.target.value)}
                    placeholder="e.g. Kenji_Learner"
                    required
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#BC002D] focus:ring-2 focus:ring-[#BC002D]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="learner@example.com"
                    required
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#BC002D] focus:ring-2 focus:ring-[#BC002D]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      className="w-full px-3.5 py-2 pr-10 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#BC002D] focus:ring-2 focus:ring-[#BC002D]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Real-time Password Strength Indicator */}
                  {regPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-500 font-medium">Strength:</span>
                        <span
                          className={`font-semibold ${
                            pwdStrength.score >= 3
                              ? 'text-emerald-600'
                              : pwdStrength.score === 2
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}
                        >
                          {pwdStrength.label}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden flex gap-0.5">
                        <div
                          className={`h-full transition-all duration-300 ${
                            pwdStrength.score >= 1 ? (pwdStrength.score >= 3 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-red-400'
                          }`}
                          style={{ width: `${Math.max(15, pwdStrength.score * 25)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-stone-500">{pwdStrength.feedback}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#BC002D] focus:ring-2 focus:ring-[#BC002D]/10"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 px-4 bg-[#BC002D] hover:bg-[#a00026] text-white text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Register Account
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-stone-500">
                Already have an account?{' '}
                <button
                  onClick={() => setActiveMode('login')}
                  className="font-semibold text-[#BC002D] hover:underline cursor-pointer"
                >
                  Log In here
                </button>
              </div>
            </motion.div>
          ) : activeMode === 'login' ? (
            /* Page 2: Login Form */
            <motion.div
              key="auth-login"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-stone-200 shadow-2xl"
              style={{
                boxShadow: '0 25px 50px -12px rgba(188, 0, 45, 0.18)',
              }}
            >
              {/* Back to flag button */}
              <button
                type="button"
                onClick={() => setActiveMode('idle')}
                className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 mb-4 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Flag Circle</span>
              </button>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-japanese">
                    ログイン
                  </h2>
                  <p className="text-xs text-stone-500">
                    Welcome back to Nihongo Nakama
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#BC002D]/10 flex items-center justify-center text-[#BC002D] font-bold">
                  門
                </div>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="learner@nihongonakama.jp"
                    required
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#BC002D] focus:ring-2 focus:ring-[#BC002D]/10"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveMode('forgot')}
                      className="text-[11px] text-[#BC002D] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full px-3.5 py-2 pr-10 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#BC002D] focus:ring-2 focus:ring-[#BC002D]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded text-[#BC002D] focus:ring-[#BC002D]"
                    />
                    <span>Remember Me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#BC002D] hover:bg-[#a00026] text-white text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Log In to Dashboard
                </button>
              </form>

              {/* Demo Quick Login Shortcut */}
              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">Need instant access?</span>
                <button
                  type="button"
                  onClick={handleDemoQuickLogin}
                  className="text-xs font-medium text-[#BC002D] hover:underline"
                >
                  Log in as Kenji Sato (Demo)
                </button>
              </div>

              <div className="mt-4 text-center text-xs text-stone-500">
                Don't have an account yet?{' '}
                <button
                  onClick={() => setActiveMode('signup')}
                  className="font-semibold text-[#BC002D] hover:underline cursor-pointer"
                >
                  Sign Up here
                </button>
              </div>
            </motion.div>
          ) : (
            /* Forgot Password view */
            <motion.div
              key="auth-forgot"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-stone-200 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setActiveMode('login')}
                className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 mb-4 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>

              <div className="mb-4">
                <div className="w-10 h-10 rounded-full bg-red-50 text-[#BC002D] flex items-center justify-center mb-2">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-stone-900 font-japanese">
                  パスワードの再設定
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Enter your email address and we'll send you instructions to reset your study account password.
                </p>
              </div>

              {forgotSent ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Reset link dispatched
                  </div>
                  <p>
                    A password recovery token has been prepared for {forgotEmail || 'your email'}. In local development mode, you can log in directly using the Demo Login.
                  </p>
                  <button
                    onClick={() => setActiveMode('login')}
                    className="mt-2 text-xs font-semibold text-[#BC002D] underline"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setForgotSent(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="learner@example.com"
                      required
                      className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#BC002D]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#BC002D] text-white text-sm font-semibold rounded-xl shadow-md hover:bg-[#a00026] transition-all"
                  >
                    Send Reset Instructions
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer copyright */}
      <footer className="absolute bottom-4 text-center text-xs text-stone-400">
        Nihongo Nakama · Japanese Language Companion (N5–N1) · Traditional & Modern Aesthetics
      </footer>
    </div>
  );
};
