// Text-to-Speech synthesis helper for Guna AI Tutor with rate controls and pause/resume

let currentUtterance: SpeechSynthesisUtterance | null = null;

export const speakText = (text: string, rate: number = 0.95, onEnd?: () => void) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported in this browser.');
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown formatting for cleaner speech
  const cleanText = text
    .replace(/```[\s\S]*?```/g, 'Code block omitted.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_#~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();

  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = rate; // 0.75, 0.95, 1.25
  utterance.pitch = 1.0;

  // Try to pick an English voice with good pronunciation
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  currentUtterance = utterance;

  const handleFinish = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onend = handleFinish;
  utterance.onerror = handleFinish;

  window.speechSynthesis.speak(utterance);
  return true;
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const pauseSpeech = () => {
  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
};

export const resumeSpeech = () => {
  if ('speechSynthesis' in window && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
};

export const isSpeaking = (): boolean => {
  if (!('speechSynthesis' in window)) return false;
  return window.speechSynthesis.speaking && !window.speechSynthesis.paused;
};

