const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const htmlContent = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(htmlContent, {
  url: 'http://localhost:3000',
  runScripts: 'outside-only',
  resources: 'usable'
});

const { window } = dom;
const { document } = window;

// Mock AudioContext
window.AudioContext = function() {
  return {
    state: 'suspended',
    currentTime: 0,
    resume: async () => {},
    createOscillator: () => ({
      connect: () => {},
      start: () => {},
      stop: () => {}
    }),
    createGain: () => ({ connect: () => {} }),
    destination: {}
  };
};
window.webkitAudioContext = window.AudioContext;
window.requestAnimationFrame = (callback) => setTimeout(callback, 0);

// Mock localStorage
const storage = {};
window.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => {}
};

// Evaluate scripts
const questionsCode = fs.readFileSync('questions.js', 'utf8')
  .replace(/export const /g, 'var ')
  .replace(/export /g, '');
window.eval(questionsCode);

const appCode = fs.readFileSync('app.js', 'utf8');
window.eval(appCode);

// Trigger DOMContentLoaded
const domEvent = new window.Event('DOMContentLoaded');
window.dispatchEvent(domEvent);

console.log("Environment initialized.");

// Switch to subtopic 4.4 view
console.log("Setting studyLevel to mastery...");
window.state.studyLevel = 'mastery';
console.log("Switching to subtopic_4_4...");
window.switchView('subtopic', 'subtopic_4_4');

setTimeout(() => {
  const checkBtn = document.getElementById('past-btn-check-2020_summer_usa_q3_suite');
  const answerBox = document.getElementById('past-answer-box-2020_summer_usa_q3_suite');
  
  console.log("Check Button exists:", !!checkBtn);
  console.log("Answer Box exists:", !!answerBox);
  
  if (checkBtn && answerBox) {
    console.log("Initial display style:", answerBox.style.display);
    
    // Simulate click
    console.log("Clicking Check Button...");
    const clickEvent = new window.MouseEvent('click', { bubbles: true, cancelable: true });
    checkBtn.dispatchEvent(clickEvent);
    
    console.log("After click display style:", answerBox.style.display);
  } else {
    console.log("Could not find checkBtn or answerBox!");
  }
}, 500);
