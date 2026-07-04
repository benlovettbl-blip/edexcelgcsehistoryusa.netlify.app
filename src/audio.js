import { state } from './state.js';

export const AudioEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      } catch (e) {
        console.warn("Could not initialize AudioContext:", e);
      }
    }
  },
  play(type) {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(e => console.warn("Failed to resume AudioContext:", e));
      }
      
      const now = ctx.currentTime;
      const vol = state.audioVolume !== undefined ? state.audioVolume : 0.8;
      
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
        gain.gain.setValueAtTime(0.04 * vol, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'flip') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
        gain.gain.setValueAtTime(0.06 * vol, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);       // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08);  // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16);  // G5
        gain.gain.setValueAtTime(0.05 * vol, now);
        gain.gain.setValueAtTime(0.05 * vol, now + 0.08);
        gain.gain.setValueAtTime(0.05 * vol, now + 0.16);
        gain.gain.exponentialRampToValueAtTime(0.001 * vol, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'fail') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.2);
        gain.gain.setValueAtTime(0.06 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001 * vol, now + 0.2);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'cheer') {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C major chord climb
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.04 * vol, now + idx * 0.06 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001 * vol, now + idx * 0.06 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.3);
        });
      } else if (type === 'ping_usa') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.linearRampToValueAtTime(783.99, now + 0.15); // G5
        gain.gain.setValueAtTime(0.08 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001 * vol, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'ping_vietnam') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.linearRampToValueAtTime(110, now + 0.25); // A2
        gain.gain.setValueAtTime(0.12 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001 * vol, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {
      console.warn("Audio Context synth error:", e);
    }
  },
  normalizeTextForSpeech(text) {
    if (!text) return '';
    return text.replace(/<[^>]*>/g, '').trim()
      .replace(/\b1940s\b/g, "1940's")
      .replace(/\b1950s\b/g, "1950's")
      .replace(/\b1960s\b/g, "1960's")
      .replace(/\b1970s\b/g, "1970's")
      .replace(/\bNAACP\b/g, "N.A.A.C.P.")
      .replace(/\bCORE\b/g, "C.O.R.E.");
  },
  speak(text, onStart, onEnd, onError, rate = 0.95, highlightText = null, onWordHighlight = null) {
    if (!('speechSynthesis' in window)) {
      console.warn("Speech Synthesis not supported in this browser.");
      if (onError) onError();
      return;
    }
    
    // Stop any current speaking
    window.speechSynthesis.cancel();
    
    if (!text) {
      if (onEnd) onEnd();
      return;
    }
    
    // Get normalized texts
    const spokenText = this.normalizeTextForSpeech(text);
    const spokenHighlightText = highlightText ? this.normalizeTextForSpeech(highlightText) : spokenText;
    const introStartOffset = Math.max(0, spokenText.indexOf(spokenHighlightText));
    
    try {
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.rate = rate; // Custom rate (default 0.95)
      utterance.pitch = 1.0;
      
      const vol = state.audioVolume !== undefined ? state.audioVolume : 0.8;
      utterance.volume = vol;
      
      const voices = window.speechSynthesis.getVoices();
      // Search for premium natural voice
      const premiumVoice = voices.find(v => v.lang.startsWith('en') && 
        (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Premium')));
      const enVoice = premiumVoice || 
                      voices.find(v => v.lang === 'en-GB') || 
                      voices.find(v => v.lang === 'en-US') || 
                      voices.find(v => v.lang.startsWith('en'));
      if (enVoice) {
        utterance.voice = enVoice;
      }
      
      // Calculate word offsets within the highlighted block only
      let wordOffsets = [];
      if (onWordHighlight) {
        const words = spokenHighlightText.split(/\s+/);
        let currentOffset = 0;
        words.forEach(w => {
          const pos = spokenHighlightText.indexOf(w, currentOffset);
          wordOffsets.push(pos);
          currentOffset = pos + w.length;
        });
      }
      
      utterance.onstart = () => {
        if (onStart) onStart();
      };
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = (e) => {
        console.warn("SpeechSynthesis error:", e);
        if (onError) onError();
      };
      
      if (onWordHighlight) {
        utterance.onboundary = (event) => {
          if (event.name === 'word') {
            const charIndex = event.charIndex;
            // Subtract prefix offset to get boundary index relative to the highlighted text
            const relativeCharIndex = charIndex - introStartOffset;
            
            if (relativeCharIndex >= 0) {
              let activeWordIdx = -1;
              for (let i = 0; i < wordOffsets.length; i++) {
                if (wordOffsets[i] <= relativeCharIndex) {
                  activeWordIdx = i;
                } else {
                  break;
                }
              }
              if (activeWordIdx !== -1) {
                onWordHighlight(activeWordIdx);
              }
            }
          }
        };
      }
      
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis error:", err);
      if (onError) onError();
    }
  },
  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
};