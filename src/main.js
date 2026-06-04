import { initData } from './storage.js';
import { renderSidebarNav, updateGlobalStats } from './views.js';
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
  
  // Render default Dashboard view
  switchView('dashboard');
});