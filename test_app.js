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
    addEventListener: () => {},
    documentElement: {
      setAttribute: () => {}
    },
    getElementById: (id) => {
      if (htmlIds.has(id)) {
        return {
          id: id,
          addEventListener: () => {},
          classList: {
            add: () => {},
            remove: () => {},
            toggle: () => {}
          },
          style: {},
          appendChild: () => {},
          innerHTML: '',
          value: ''
        };
      } else {
        // Return null exactly like a real browser would if the element is missing!
        return null;
      }
    },
    createElement: (tag) => {
      return {
        tagName: tag,
        addEventListener: () => {},
        classList: {
          add: () => {},
          remove: () => {},
          toggle: () => {}
        },
        style: {},
        appendChild: () => {}
      };
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
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  Math: Math,
  JSON: JSON
};

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
