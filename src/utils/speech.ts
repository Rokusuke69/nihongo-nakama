/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Japanese Text-to-Speech synthesis utility

let japaneseVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function loadVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  japaneseVoice =
    voices.find(v => v.lang === 'ja-JP' || v.lang.startsWith('ja')) ||
    voices.find(v => v.name.toLowerCase().includes('japan') || v.name.toLowerCase().includes('kyoko')) ||
    null;
  voicesLoaded = true;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

export function speakJapanese(text: string, rate = 0.85): Promise<boolean> {
  return new Promise(resolve => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      if (!voicesLoaded) {
        loadVoices();
      }

      const cleanText = text.replace(/<[^>]*>/g, '').trim();
      if (!cleanText) {
        resolve(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ja-JP';
      utterance.rate = rate; // slightly slower for language learners
      utterance.pitch = 1.0;

      if (japaneseVoice) {
        utterance.voice = japaneseVoice;
      }

      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      resolve(false);
    }
  });
}
