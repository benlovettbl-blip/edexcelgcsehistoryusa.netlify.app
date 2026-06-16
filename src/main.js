
import { initData } from './storage.js';
import { renderSidebarNav, updateGlobalStats, closeVideoModal, showToast, initStreakLeaderboardListeners } from './views.js';
import { bindEvents } from './layout.js';
import { switchView } from './navigation.js';
import { initEssayPlanner } from './essay_planner.js';
import { initMapExplorer } from './map_explorer.js';
import { state } from './state.js';

// --- Application Entry Point ---
window.addEventListener('DOMContentLoaded', () => {
  window.switchView = switchView;
  window.state = state;
  
  initData();
  renderSidebarNav();
  updateGlobalStats();
  bindEvents();
  initEssayPlanner();
  initMapExplorer();
  initStreakLeaderboardListeners();

  // Bind video modal close events
  const closeBtn = document.getElementById('video-modal-close-btn');
  if (closeBtn) {
    const handleClose = (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeVideoModal();
    };
    closeBtn.addEventListener('click', handleClose);
    closeBtn.addEventListener('touchend', handleClose);
  }
  const modalOverlay = document.getElementById('video-modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        e.preventDefault();
        e.stopPropagation();
        closeVideoModal();
      }
    });
    modalOverlay.addEventListener('touchend', (e) => {
      if (e.target === modalOverlay) {
        e.preventDefault();
        e.stopPropagation();
        closeVideoModal();
      }
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.style.display === 'flex') {
      closeVideoModal();
    }
  });
  
  // Render default Dashboard view
  switchView('dashboard');
});

// --- Service Worker Registration and Update Detection ---
if ('serviceWorker' in navigator && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      // Check for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showToast(
              'A new version of the app is available!',
              'info',
              'Reload Now',
              () => {
                newWorker.postMessage({ action: 'skipWaiting' });
              }
            );
          }
        });
      });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        window.location.reload();
        refreshing = true;
      }
    });
  });
}