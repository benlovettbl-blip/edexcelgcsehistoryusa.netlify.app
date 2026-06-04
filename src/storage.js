import { state } from './state.js';
import { QUIZ_DATA } from '../questions.js';
import { updateSoundBtnUI } from './layout.js';
import { updateGlobalStats, updateBookmarksUI } from './views.js';
import { AudioEngine } from './audio.js';
import { Confetti } from './confetti.js';

export function initData() {
  state.allQuestions = [];
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
    });
  });

  try {
    const storedMastery = localStorage.getItem('edexcel_mastery') || localStorage.getItem('firefly_mastery');
    const storedBookmarks = localStorage.getItem('edexcel_bookmarks') || localStorage.getItem('firefly_bookmarks');
    const storedSound = localStorage.getItem('edexcel_sound') || localStorage.getItem('firefly_sound');
    let storedTheme = localStorage.getItem('edexcel_theme') || localStorage.getItem('firefly_theme');
    const storedPastAnswers = localStorage.getItem('edexcel_past_answers');
    const storedPastCompleted = localStorage.getItem('edexcel_past_completed');
    
    if (storedMastery) state.mastery = JSON.parse(storedMastery);
    if (storedBookmarks) state.bookmarks = JSON.parse(storedBookmarks);
    if (storedSound) state.soundEnabled = JSON.parse(storedSound);
    if (storedTheme) state.theme = storedTheme;
    if (storedPastAnswers) state.pastPaperSession.answers = JSON.parse(storedPastAnswers);
    if (storedPastCompleted) state.pastPaperSession.completedQuestions = JSON.parse(storedPastCompleted);
    
    const storedDeepThinking = localStorage.getItem('edexcel_deep_thinking');
    if (storedDeepThinking) state.deepThinkingAnswers = JSON.parse(storedDeepThinking);
    
    const storedHowUseful = localStorage.getItem('edexcel_how_useful');
    if (storedHowUseful) state.howUsefulAnswers = JSON.parse(storedHowUseful);
    
    const storedObjectives = localStorage.getItem('edexcel_spec_objectives');
    if (storedObjectives) state.specObjectives = JSON.parse(storedObjectives);
  } catch (e) {
    console.error("LocalStorage load error:", e);
  }
  
  document.documentElement.setAttribute('data-theme', state.theme);
  const themeSelector = document.getElementById('theme-selector');
  if (themeSelector) themeSelector.value = state.theme;
  const sidebarThemeSelector = document.getElementById('sidebar-theme-selector');
  if (sidebarThemeSelector) sidebarThemeSelector.value = state.theme;
  updateSoundBtnUI();
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
  } catch (e) {
    console.error("LocalStorage save error:", e);
  }
  updateGlobalStats();
}

export function setMastered(questionId, isMastered) {
  const previousStatus = !!state.mastery[questionId];
  if (previousStatus === isMastered) return;
  
  state.mastery[questionId] = isMastered;
  saveProgress();

  if (isMastered) {
    const question = state.allQuestions.find(q => q.id === questionId);
    if (question) {
      const subtopicQuestions = state.allQuestions.filter(q => q.subtopicId === question.subtopicId);
      const masteredInSubtopic = subtopicQuestions.filter(q => state.mastery[q.id]);
      
      if (masteredInSubtopic.length === subtopicQuestions.length) {
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