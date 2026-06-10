const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const htmlContent = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(htmlContent, {
  url: 'http://localhost:3000',
  runScripts: 'outside-only'
});

const { window } = dom;
const { document } = window;

// Remove all script tags from the HTML to prevent duplicate execution
document.querySelectorAll('script').forEach(s => s.remove());

// Mock AudioContext
window.AudioContext = function() {
  return {
    state: 'suspended',
    currentTime: 0,
    resume: async () => {},
    createGain: () => ({ connect: () => {} }),
    destination: {}
  };
};
window.webkitAudioContext = window.AudioContext;
window.requestAnimationFrame = (callback) => setTimeout(callback, 0);

// Capture DOMContentLoaded listener to prevent duplicate triggers
let domContentLoadedCallback = null;
const originalAddEventListener = window.addEventListener;
window.addEventListener = function(event, callback, options) {
  if (event === 'DOMContentLoaded') {
    domContentLoadedCallback = callback;
  }
  originalAddEventListener.call(this, event, callback, options);
};

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

// Trigger DOMContentLoaded exactly once
if (domContentLoadedCallback) {
  domContentLoadedCallback();
} else {
  const domEvent = new window.Event('DOMContentLoaded');
  window.dispatchEvent(domEvent);
}

console.log("Environment initialized.");

// Switch to subtopic 2.1 view
window.state.studyLevel = 'mastery';
window.switchView('subtopic', 'subtopic_2_1');

setTimeout(() => {
  // Check if Do Now C button exists
  const doNowContainer = document.querySelector('.do-now-card');
  console.log("Do Now card container exists:", !!doNowContainer);
  
  if (doNowContainer) {
    const btnC = doNowContainer.querySelector('.annotator-btn.btn-c');
    const displayBox = document.getElementById('clue-display-subtopic_2_1-doNow');
    
    console.log("Do Now C Button exists:", !!btnC);
    console.log("Do Now Clue Display Box exists:", !!displayBox);
    
    if (btnC && displayBox) {
      console.log("Initial clue display style:", displayBox.style.display);
      console.log("Initial clue content:", displayBox.innerHTML);
      
      console.log("Clicking Do Now C Button...");
      const clickEvent = new window.MouseEvent('click', { bubbles: true, cancelable: true });
      btnC.dispatchEvent(clickEvent);
      
      console.log("After click clue display style:", displayBox.style.display);
      console.log("After click clue content:", displayBox.innerHTML);
    }
  }
  
  // Test subtopic 2.2 height balancing
  console.log("Switching to subtopic_2_2...");
  window.switchView('subtopic', 'subtopic_2_2');
  
  setTimeout(() => {
    const cards = document.querySelectorAll('.mastery-card');
    console.log("Found mastery cards count:", cards.length);
    
    let step3Card;
    cards.forEach(card => {
      const title = card.querySelector('.mastery-card-title');
      if (title && title.textContent.includes('Step 3')) {
        step3Card = card;
      }
    });
    
    if (step3Card) {
      console.log("Step 3 card title found:", step3Card.querySelector('.mastery-card-title').textContent.trim());
      const textCol = step3Card.querySelector('.mastery-text-column');
      const mediaCol = step3Card.querySelector('.mastery-media-column');
      
      console.log("Text column exists:", !!textCol);
      console.log("Media column exists:", !!mediaCol);
      
      if (textCol && mediaCol) {
        const hasTaskInText = !!textCol.querySelector('.revision-task-box');
        const hasTaskInMedia = !!mediaCol.querySelector('.revision-task-box');
        console.log("Revision task in text column:", hasTaskInText);
        console.log("Revision task in media column:", hasTaskInMedia);
      }
    } else {
      console.log("Could not find Step 3 card!");
    }
  }, 500);
}, 500);
