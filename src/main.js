import { initData } from './storage.js';
import { renderSidebarNav, updateGlobalStats, closeVideoModal } from './views.js';
import { bindEvents } from './layout.js';
import { switchView } from './navigation.js';
import { initChatbot } from './chatbot.js';

// --- Application Entry Point ---
window.addEventListener('DOMContentLoaded', () => {
  window.switchView = switchView;
  
  initData();
  renderSidebarNav();
  updateGlobalStats();
  bindEvents();
  initChatbot();

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