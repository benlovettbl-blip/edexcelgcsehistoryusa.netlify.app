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
const createMockElement = (tag = 'div', id = '') => {
  const el = {
    tagName: tag,
    id: id,
    addEventListener: () => {},
    setAttribute: () => {},
    getAttribute: () => '',
    removeAttribute: () => {},
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {},
      contains: () => false
    },
    style: {},
    appendChild: (child) => child,
    innerHTML: '',
    value: '',
    querySelector: (sel) => createMockElement(),
    querySelectorAll: () => [],
    closest: () => el,
    remove: () => {}
  };
  return el;
};

// Prepare global mock object based on real IDs in index.html
const sandbox = {
  window: {
    addEventListener: (event, cb) => {
      if (event === 'DOMContentLoaded') {
        sandbox.triggerDOMContentLoaded = cb;
      }
    },
    dispatchEvent: () => {},
    location: {
      origin: 'http://localhost',
      hostname: 'localhost'
    }
  },
  navigator: {
    serviceWorker: {
      register: () => Promise.resolve()
    }
  },
  document: {
    head: createMockElement('head'),
    body: createMockElement('body'),
    addEventListener: () => {},
    documentElement: createMockElement('html'),
    getElementById: (id) => {
      if (htmlIds.has(id) || id.startsWith('chatbot-')) {
        return createMockElement('div', id);
      } else {
        // Return null exactly like a real browser would if the element is missing!
        return null;
      }
    },
    createElement: (tag) => {
      return createMockElement(tag);
    },
    querySelector: (sel) => {
      return createMockElement();
    },
    querySelectorAll: () => []
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
  CustomEvent: class CustomEvent {
    constructor(event, params) {
      this.type = event;
      this.detail = params ? params.detail : null;
    }
  },
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  Math: Math,
  JSON: JSON
};

sandbox.window.CustomEvent = sandbox.CustomEvent;

sandbox.global = sandbox;
sandbox.window.global = sandbox;

try {
  const context = vm.createContext(sandbox);

  // Load questions.js (strip export keyword for standard script VM execution)
  const questionsCode = fs.readFileSync('questions.js', 'utf8').replace(/export\s+/g, '');
  vm.runInContext(questionsCode, context);

  // Load app.js
  const code = fs.readFileSync('app.js', 'utf8');
  vm.runInContext(code, context);
  
  if (sandbox.triggerDOMContentLoaded) {
    console.log("Triggering DOMContentLoaded in VM...");
    sandbox.triggerDOMContentLoaded();
    console.log("DOMContentLoaded run: Completed successfully in VM!");
  }
} catch (e) {
  console.error("CRITICAL RUNTIME ERROR IN VM:", e.message);
  console.error(e.stack);
  process.exit(1);
}
