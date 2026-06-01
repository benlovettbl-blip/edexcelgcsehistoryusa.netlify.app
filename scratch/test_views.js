const fs = require('fs');
const vm = require('vm');

// Parse real IDs from index.html
const htmlContent = fs.readFileSync('index.html', 'utf8');
const htmlIds = new Set();
const idRegex = /id=["']([^"']+)["']/g;
let match;
while ((match = idRegex.exec(htmlContent)) !== null) {
  htmlIds.add(match[1]);
}
console.log(`Parsed ${htmlIds.size} real IDs from index.html`);

// Helper to create element mock
function createMockElement(id) {
  return {
    id: id,
    addEventListener: () => {},
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {},
      contains: () => false
    },
    style: {
      display: 'block'
    },
    appendChild: () => {},
    removeChild: () => {},
    remove: function() {},
    innerHTML: '',
    textContent: '',
    value: '',
    disabled: false,
    querySelector: (selector) => {
      return createMockElement(selector);
    },
    querySelectorAll: () => []
  };
}

// Prepare global mock object based on real IDs in index.html
const sandbox = {
  window: {
    addEventListener: (event, cb) => {
      if (event === 'DOMContentLoaded') {
        sandbox.triggerDOMContentLoaded = cb;
      }
    },
    location: {
      origin: 'http://localhost'
    }
  },
  document: {
    documentElement: {
      setAttribute: () => {}
    },
    getElementById: (id) => {
      if (htmlIds.has(id) || id.startsWith('nav-pct-') || id.startsWith('nav-subtopic-') || id.startsWith('lesson-panel-') || id === 'btn-practice-next' || id === 'mastery-hard-mode-toggle' || id.startsWith('btn-map-') || id === 'map-image-placeholder') {
        return createMockElement(id);
      } else {
        console.warn(`WARNING: document.getElementById requested non-existent ID: ${id}`);
        return null;
      }
    },
    createElement: (tag) => {
      return createMockElement(tag);
    },
    querySelectorAll: (selector) => {
      if (selector === '.lesson-tab-btn' || selector === '.vault-question-btn' || selector === '.dual-perspective-card') {
        return [createMockElement('dummy-btn')];
      }
      return [];
    },
    addEventListener: () => {}
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  AudioEngine: {
    play: () => {}
  },
  Confetti: {
    spawn: () => {}
  },
  console: {
    log: console.log,
    warn: console.warn,
    error: (msg, ...args) => {
      console.error("VM CONSOLE ERROR:", msg, ...args);
      throw new Error(`Console Error logged in VM: ${msg}`);
    }
  },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame: (id) => clearTimeout(id),
  btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
  unescape: (str) => str,
  Math: Math,
  JSON: JSON,
  Node: {
    TEXT_NODE: 3
  }
};

sandbox.global = sandbox;
sandbox.window.global = sandbox;

try {
  const context = vm.createContext(sandbox);

  // Load questions.js
  const questionsCode = fs.readFileSync('questions.js', 'utf8');
  vm.runInContext(questionsCode, context);

  // Load app.js
  const code = fs.readFileSync('app.js', 'utf8');
  vm.runInContext(code, context);
  
  if (sandbox.triggerDOMContentLoaded) {
    console.log("Triggering DOMContentLoaded in VM...");
    sandbox.triggerDOMContentLoaded();
    console.log("DOMContentLoaded run: Completed successfully in VM!");

    const viewsToTest = [
      'dashboard',
      'bookmarks',
      'timeline',
      'exam',
      'exam-skills',
      'past-papers',
      'crisis-game',
      'tug-game',
      'jsw-game',
      'firefly',
      'subtopic' // subtopic views
    ];

    console.log("\nTesting all view transitions in SPA...");
    for (const view of viewsToTest) {
      if (view === 'subtopic') {
        console.log(`Transitioning to subtopic view (subtopic_1_1)...`);
        context.switchView('subtopic', 'subtopic_1_1');
      } else {
        console.log(`Transitioning to view: ${view}...`);
        context.switchView(view);
      }
    }
    console.log("\nALL VIEW TRANSITIONS PASSED SUCCESSFULLY!");
  }
} catch (e) {
  console.error("CRITICAL RUNTIME ERROR IN VM:", e.message);
  console.error(e.stack);
  process.exit(1);
}
