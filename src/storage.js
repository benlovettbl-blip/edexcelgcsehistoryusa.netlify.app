import { state } from './state.js';
import { QUIZ_DATA } from '../questions.js';
import { updateSoundBtnUI } from './layout.js';
import { updateGlobalStats, updateBookmarksUI } from './views.js';
import { AudioEngine } from './audio.js';
import { Confetti } from './confetti.js';

export function initData() {
  state.allQuestions = [];
  state.analyticalQuestions = [];
  QUIZ_DATA.forEach(topic => {
    topic.subtopics.forEach(subtopic => {
      subtopic.standard.forEach(q => {
        state.allQuestions.push({
          ...q,
          type: 'standard',
          topicId: topic.id,
          topicTitle: topic.title,
          subtopicId: subtopic.id,
          subtopicTitle: subtopic.title
        });
      });
      subtopic.depth.forEach(q => {
        state.allQuestions.push({
          ...q,
          type: 'depth',
          topicId: topic.id,
          topicTitle: topic.title,
          subtopicId: subtopic.id,
          subtopicTitle: subtopic.title
        });
      });
      if (subtopic.analytical) {
        subtopic.analytical.forEach(q => {
          state.analyticalQuestions.push({
            ...q,
            type: 'analytical',
            topicId: topic.id,
            topicTitle: topic.title,
            subtopicId: subtopic.id,
            subtopicTitle: subtopic.title
          });
        });
      }
    });
  });

  // Try to load from either edexcel_ or firefly_ namespaces
  const getStoredItem = (edexcelKey, fireflyKey) => {
    return localStorage.getItem(edexcelKey) || localStorage.getItem(fireflyKey);
  };

  try {
    const storedMasteryVal = getStoredItem('edexcel_mastery', 'firefly_mastery');
    if (storedMasteryVal) {
      try {
        const parsed = JSON.parse(storedMasteryVal);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          const migrated = {};
          const now = Date.now();
          for (const [qid, val] of Object.entries(parsed)) {
            if (val === true || val === 'secured') {
              migrated[qid] = { status: 'secured', timestamp: now, leitnerBox: 3, nextReview: now };
            } else if (val === 'mastered') {
              migrated[qid] = { status: 'mastered', timestamp: now, leitnerBox: 5, nextReview: now };
            } else if (val && typeof val === 'object') {
              migrated[qid] = {
                status: val.status || 'secured',
                timestamp: val.timestamp || now,
                leitnerBox: val.leitnerBox || (val.status === 'mastered' ? 5 : 3),
                nextReview: val.nextReview || now
              };
            } else {
              migrated[qid] = { status: 'secured', timestamp: now, leitnerBox: 1, nextReview: now };
            }
          }
          state.mastery = migrated;
        }
      } catch (e) {
        console.error("Error parsing stored mastery:", e);
      }
    }

    const storedBookmarksVal = getStoredItem('edexcel_bookmarks', 'firefly_bookmarks');
    if (storedBookmarksVal) {
      try {
        const parsed = JSON.parse(storedBookmarksVal);
        if (Array.isArray(parsed)) {
          state.bookmarks = parsed;
        }
      } catch (e) {
        console.error("Error parsing stored bookmarks:", e);
      }
    }

    const storedSoundVal = getStoredItem('edexcel_sound', 'firefly_sound');
    if (storedSoundVal) {
      try {
        const parsed = JSON.parse(storedSoundVal);
        state.soundEnabled = !!parsed;
      } catch (e) {}
    }

    const storedThemeVal = getStoredItem('edexcel_theme', 'firefly_theme');
    if (storedThemeVal) {
      state.theme = storedThemeVal;
    }

    const storedPastAnswersVal = localStorage.getItem('edexcel_past_answers');
    if (storedPastAnswersVal) {
      try {
        const parsed = JSON.parse(storedPastAnswersVal);
        if (parsed && typeof parsed === 'object') {
          state.pastPaperSession.answers = parsed;
        }
      } catch (e) {}
    }

    const storedPastCompletedVal = localStorage.getItem('edexcel_past_completed');
    if (storedPastCompletedVal) {
      try {
        const parsed = JSON.parse(storedPastCompletedVal);
        if (Array.isArray(parsed)) {
          state.pastPaperSession.completedQuestions = parsed;
        }
      } catch (e) {}
    }

    const storedDeepThinkingVal = localStorage.getItem('edexcel_deep_thinking');
    if (storedDeepThinkingVal) {
      try {
        const parsed = JSON.parse(storedDeepThinkingVal);
        if (parsed && typeof parsed === 'object') {
          state.deepThinkingAnswers = parsed;
        }
      } catch (e) {}
    }

    const storedHowUsefulVal = localStorage.getItem('edexcel_how_useful');
    if (storedHowUsefulVal) {
      try {
        const parsed = JSON.parse(storedHowUsefulVal);
        if (parsed && typeof parsed === 'object') {
          state.howUsefulAnswers = parsed;
        }
      } catch (e) {}
    }

    const storedObjectivesVal = localStorage.getItem('edexcel_spec_objectives');
    if (storedObjectivesVal) {
      try {
        const parsed = JSON.parse(storedObjectivesVal);
        if (parsed && typeof parsed === 'object') {
          state.specObjectives = parsed;
        }
      } catch (e) {}
    }
    
    const storedSpeedStudy = localStorage.getItem('edexcel_prefs_speed_study');
    if (storedSpeedStudy) {
      try {
        state.flashcardSession.speedStudyMode = JSON.parse(storedSpeedStudy) === true;
      } catch (e) {}
    }

    // Load Gamification stats
    const storedStats = localStorage.getItem('edexcel_prefs_user_stats');
    if (storedStats) {
      try {
        const parsed = JSON.parse(storedStats);
        if (parsed && typeof parsed === 'object') {
          state.userStats = { ...state.userStats, ...parsed };
        }
      } catch (e) {}
    }
    
    // Update daily study streak
    const todayStr = new Date().toDateString();
    if (state.userStats.lastLoginDate) {
      const lastLogin = new Date(state.userStats.lastLoginDate);
      const today = new Date(todayStr);
      const diffTime = today - lastLogin;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        state.userStats.streak += 1;
        state.userStats.lastLoginDate = todayStr;
      } else if (diffDays > 1) {
        state.userStats.streak = 1;
        state.userStats.lastLoginDate = todayStr;
      }
    } else {
      state.userStats.streak = 1;
      state.userStats.lastLoginDate = todayStr;
    }
    localStorage.setItem('edexcel_prefs_user_stats', JSON.stringify(state.userStats));
  } catch (e) {
    console.error("LocalStorage load error:", e);
  }
  
  document.documentElement.setAttribute('data-theme', state.theme);
  const themeSelector = document.getElementById('theme-selector');
  if (themeSelector) themeSelector.value = state.theme;
  const sidebarThemeSelector = document.getElementById('sidebar-theme-selector');
  if (sidebarThemeSelector) sidebarThemeSelector.value = state.theme;
  updateSoundBtnUI();

  // Load and apply accessibility preferences on startup
  try {
    const storedFontSize = localStorage.getItem('edexcel_prefs_fontsize');
    if (storedFontSize) {
      document.documentElement.style.fontSize = `${parseFloat(storedFontSize) * 100}%`;
      const fontBtns = document.querySelectorAll('.font-scale-btn');
      fontBtns.forEach(btn => {
        if (btn.getAttribute('data-scale') === storedFontSize) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    const storedContrast = localStorage.getItem('edexcel_prefs_contrast');
    if (storedContrast === 'high') {
      document.documentElement.setAttribute('data-contrast', 'high');
      const contrastToggle = document.getElementById('settings-contrast-toggle');
      if (contrastToggle) contrastToggle.checked = true;
    } else {
      document.documentElement.setAttribute('data-contrast', 'normal');
      const contrastToggle = document.getElementById('settings-contrast-toggle');
      if (contrastToggle) contrastToggle.checked = false;
    }
  } catch (e) {
    console.error("Accessibility preferences initialization error:", e);
  }
}

export function saveProgress() {
  try {
    localStorage.setItem('edexcel_mastery', JSON.stringify(state.mastery));
    localStorage.setItem('edexcel_bookmarks', JSON.stringify(state.bookmarks));
    localStorage.setItem('edexcel_past_answers', JSON.stringify(state.pastPaperSession.answers));
    localStorage.setItem('edexcel_past_completed', JSON.stringify(state.pastPaperSession.completedQuestions));
    localStorage.setItem('edexcel_deep_thinking', JSON.stringify(state.deepThinkingAnswers || {}));
    localStorage.setItem('edexcel_how_useful', JSON.stringify(state.howUsefulAnswers || {}));
    localStorage.setItem('edexcel_spec_objectives', JSON.stringify(state.specObjectives || {}));
    localStorage.setItem('edexcel_prefs_speed_study', JSON.stringify(state.flashcardSession.speedStudyMode));
    localStorage.setItem('edexcel_prefs_user_stats', JSON.stringify(state.userStats));
  } catch (e) {
    console.error("LocalStorage save error:", e);
  }
  updateGlobalStats();
}

export function getMasteryStatus(questionId) {
  if (!state.mastery) return null;
  const entry = state.mastery[questionId];
  if (!entry) return null;
  if (entry === true) return 'secured';
  if (typeof entry === 'string') return entry;
  return entry.status || 'secured';
}

export function setMastered(questionId, isMastered) {
  if (!state.mastery) state.mastery = {};

  let entry = state.mastery[questionId];
  if (entry && typeof entry !== 'object') {
    entry = {
      status: entry === true || entry === 'secured' ? 'secured' : 'mastered',
      timestamp: Date.now()
    };
  }

  if (!entry) {
    entry = {
      status: 'secured',
      timestamp: Date.now(),
      leitnerBox: 1,
      nextReview: 0
    };
  }

  const now = Date.now();
  let newStatus = 'secured';

  if (isMastered) {
    // Promote box by 1 (max 5)
    const currentBox = entry.leitnerBox || 1;
    const newBox = Math.min(5, currentBox + 1);
    
    // Calculate review intervals: Box 1: 4h, Box 2: 1d, Box 3: 3d, Box 4: 7d, Box 5: 14d
    const intervals = {
      1: 4 * 60 * 60 * 1000,
      2: 24 * 60 * 60 * 1000,
      3: 3 * 24 * 60 * 60 * 1000,
      4: 7 * 24 * 60 * 60 * 1000,
      5: 14 * 24 * 60 * 60 * 1000
    };
    
    entry.leitnerBox = newBox;
    entry.nextReview = now + intervals[newBox];
    newStatus = newBox === 5 ? 'mastered' : 'secured';
    entry.status = newStatus;
    entry.timestamp = now;
  } else {
    // Demote box to 1
    entry.leitnerBox = 1;
    entry.nextReview = now; // Review immediately
    newStatus = 'secured';
    entry.status = newStatus;
    entry.timestamp = now;
  }

  state.mastery[questionId] = entry;
  saveProgress();

  if (newStatus === 'mastered') {
    const question = state.allQuestions.find(q => q.id === questionId);
    if (question) {
      const subtopicQuestions = state.allQuestions.filter(q => q.subtopicId === question.subtopicId);
      const fullyMastered = subtopicQuestions.every(q => {
        const status = getMasteryStatus(q.id);
        return status === 'mastered';
      });
      
      if (fullyMastered) {
        AudioEngine.play('cheer');
        Confetti.spawn(100);
      }
    }
  }
}

export function toggleBookmark(questionId) {
  const idx = state.bookmarks.indexOf(questionId);
  if (idx > -1) {
    state.bookmarks.splice(idx, 1);
  } else {
    state.bookmarks.push(questionId);
  }
  saveProgress();
  updateBookmarksUI();
  AudioEngine.play('click');
}