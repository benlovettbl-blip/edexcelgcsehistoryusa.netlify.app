import { initData } from './storage.js';
import { renderSidebarNav, updateGlobalStats } from './views.js';
import { bindEvents } from './layout.js';
import { switchView } from './navigation.js';

// --- Application Entry Point ---
window.addEventListener('DOMContentLoaded', () => {
  initData();
  renderSidebarNav();
  updateGlobalStats();
  bindEvents();
  
  // Render default Dashboard view
  switchView('dashboard');
});