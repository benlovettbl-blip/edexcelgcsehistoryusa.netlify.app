import { state } from './state.js';
import { 
  renderDashboard, 
  renderBookmarksView, 
  renderTimelineView, 
  renderExamSkillsView, 
  renderGamesView,
  renderClassicView,
  startFlashcardSession,
  renderKeyTopicOverview
} from './views.js';
import { showExamSetup } from './exam.js';
import { renderPastPapersView } from './past_papers.js';
import { renderMasteryView } from './lessons.js';
import { updateBrandBanner } from './brand_config.js';
import { closeMobileSidebar } from './layout.js';
import { AudioEngine } from './audio.js';

// --- Navigation Controller ---
export function switchView(viewName, subtopicId = null) {
  state.currentView = viewName;

  // Remove active from all sidebar nav items
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.classList.remove('active');
  });

  const headerModeSwitcher = document.getElementById('subtopic-mode-switcher');
  
  if (viewName === 'dashboard') {
    const dashboardNav = document.getElementById('nav-dashboard');
    if (dashboardNav) dashboardNav.classList.add('active');
    if (headerModeSwitcher) headerModeSwitcher.style.display = 'none';
    const viewTitle = document.getElementById('current-view-title');
    if (viewTitle) viewTitle.textContent = "Study Dashboard";
    state.selectedSubtopicId = null;
    renderDashboard();
  } else if (viewName === 'bookmarks') {
    const bookmarksNav = document.getElementById('nav-bookmarks');
    if (bookmarksNav) bookmarksNav.classList.add('active');
    if (headerModeSwitcher) headerModeSwitcher.style.display = 'none';
    const viewTitle = document.getElementById('current-view-title');
    if (viewTitle) viewTitle.textContent = "Bookmarked Deck";
    state.selectedSubtopicId = null;
    renderBookmarksView();
  } else if (viewName === 'timeline') {
    const timelineNav = document.getElementById('nav-timeline');
    if (timelineNav) timelineNav.classList.add('active');
    if (headerModeSwitcher) headerModeSwitcher.style.display = 'none';
    const viewTitle = document.getElementById('current-view-title');
    if (viewTitle) viewTitle.textContent = "Chronology Timeline";
    state.selectedSubtopicId = null;
    renderTimelineView();
  } else if (viewName === 'exam') {
    const examNav = document.getElementById('nav-exam-sim');
    if (examNav) examNav.classList.add('active');
    if (headerModeSwitcher) headerModeSwitcher.style.display = 'none';
    const viewTitle = document.getElementById('current-view-title');
    if (viewTitle) viewTitle.textContent = "Quiz Generator";
    state.selectedSubtopicId = null;
    if (!state.examSession.isActive) {
      showExamSetup();
    }
  } else if (viewName === 'exam-skills') {
    const skillsNav = document.getElementById('nav-exam-skills');
    if (skillsNav) skillsNav.classList.add('active');
    if (headerModeSwitcher) headerModeSwitcher.style.display = 'none';
    const viewTitle = document.getElementById('current-view-title');
    if (viewTitle) viewTitle.textContent = "Exam Practice (Q1-Q3)";
    state.selectedSubtopicId = null;
    renderExamSkillsView();
  } else if (viewName === 'past-papers') {
    const papersNav = document.getElementById('nav-past-papers');
    if (papersNav) papersNav.classList.add('active');
    if (headerModeSwitcher) headerModeSwitcher.style.display = 'none';
    const viewTitle = document.getElementById('current-view-title');
    if (viewTitle) viewTitle.textContent = "Past Exam Papers";
    state.selectedSubtopicId = null;
    renderPastPapersView();
  } else if (viewName === 'games') {
    const gamesNav = document.getElementById('nav-games');
    if (gamesNav) gamesNav.classList.add('active');
    if (headerModeSwitcher) headerModeSwitcher.style.display = 'none';
    const viewTitle = document.getElementById('current-view-title');
    if (viewTitle) viewTitle.textContent = "Revision Games";
    state.selectedSubtopicId = null;
    renderGamesView();
  } else if (viewName === 'subtopic' && subtopicId) {
    state.selectedSubtopicId = subtopicId;
    state.selectedKeyTopicId = null;
    if (headerModeSwitcher) headerModeSwitcher.style.display = 'flex';
    
    // Highlight correct subtopic in sidebar
    const subNavBtn = document.getElementById(`nav-subtopic-${subtopicId}`);
    if (subNavBtn) subNavBtn.classList.add('active');
    
    const subtopic = state.allQuestions.find(q => q.subtopicId === subtopicId);
    const viewTitle = document.getElementById('current-view-title');
    if (viewTitle) {
      viewTitle.textContent = subtopic ? subtopic.subtopicTitle.replace(/^Topic \d\.\d:\s*/, "") : "Study Mode";
    }
    
    // Remove active from any topic headers
    document.querySelectorAll('.nav-section-header').forEach(hdr => hdr.classList.remove('active'));
    
    switchSubtopicMode(state.currentMode);
  } else if (viewName === 'key-topic' && subtopicId) {
    state.selectedSubtopicId = null;
    state.selectedKeyTopicId = subtopicId;
    if (headerModeSwitcher) headerModeSwitcher.style.display = 'none';
    
    // Highlight correct topic header in sidebar
    document.querySelectorAll('.nav-section-header').forEach(hdr => {
      if (hdr.getAttribute('data-topic-id') === subtopicId) {
        hdr.classList.add('active');
      } else {
        hdr.classList.remove('active');
      }
    });
    
    const viewTitle = document.getElementById('current-view-title');
    if (viewTitle) {
      // Find title from state.allQuestions or hardcode prefix
      const titles = {
        'topic_1': 'Key Topic 1 Overview',
        'topic_2': 'Key Topic 2 Overview',
        'topic_3': 'Key Topic 3 Overview',
        'topic_4': 'Key Topic 4 Overview'
      };
      viewTitle.textContent = titles[subtopicId] || "Key Topic Overview";
    }
    renderKeyTopicOverview(subtopicId);
  }

  // Remove active from topic headers if navigating to other non-key-topic views
  if (viewName !== 'key-topic' && viewName !== 'subtopic') {
    document.querySelectorAll('.nav-section-header').forEach(hdr => hdr.classList.remove('active'));
    state.selectedKeyTopicId = null;
  }

  // Toggle active CSS view containers
  const viewIdMap = {
    'dashboard': 'view-dashboard',
    'bookmarks': 'view-bookmarks',
    'timeline': 'view-timeline',
    'exam': 'view-exam',
    'classic': 'view-classic',
    'flashcards': 'view-flashcards',
    'lessons': 'view-mastery',
    'games': 'view-games',
    'exam-skills': 'view-exam-skills',
    'past-papers': 'view-past-papers',
    'key-topic': 'view-key-topic'
  };

  const targetViewId = viewName === 'subtopic' ? viewIdMap[state.currentMode] : viewIdMap[viewName];
  
  document.querySelectorAll('.content-view').forEach(view => {
    view.classList.remove('active');
  });
  
  const targetView = document.getElementById(targetViewId);
  if (targetView) targetView.classList.add('active');
  
  closeMobileSidebar();
  updateBrandBanner();
}

export function switchSubtopicMode(mode) {
  state.currentMode = mode;
  
  // Update header buttons active state
  document.querySelectorAll('#subtopic-mode-switcher .mode-btn').forEach(btn => {
    if (btn.getAttribute('data-mode') === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Switch displayed container
  document.querySelectorAll('.content-view').forEach(view => {
    view.classList.remove('active');
  });

  if (mode === 'lessons') {
    const masteryView = document.getElementById('view-mastery');
    if (masteryView) masteryView.classList.add('active');
    renderMasteryView(state.selectedSubtopicId);
  } else if (mode === 'classic') {
    const classicView = document.getElementById('view-classic');
    if (classicView) classicView.classList.add('active');
    renderClassicView();
  } else if (mode === 'flashcards') {
    const flashcardsView = document.getElementById('view-flashcards');
    if (flashcardsView) flashcardsView.classList.add('active');
    startFlashcardSession(state.selectedSubtopicId);
  }

  updateBrandBanner();
}