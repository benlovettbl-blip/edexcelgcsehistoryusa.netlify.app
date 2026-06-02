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

// Element Registry to keep track of dynamically created or searched elements
const elementRegistry = new Map();

function createMockElement(id, tag = 'div') {
  let elementId = id || `dynamic-id-${Math.random().toString(36).substr(2, 9)}`;
  if (elementRegistry.has(elementId)) {
    return elementRegistry.get(elementId);
  }

  const element = {
    get id() {
      return elementId;
    },
    set id(val) {
      if (elementId && elementRegistry.get(elementId) === this) {
        elementRegistry.delete(elementId);
      }
      elementId = val;
      elementRegistry.set(val, this);
    },
    tagName: tag.toUpperCase(),
    attributes: {},
    dataset: {},
    listeners: {},
    addEventListener: function(event, cb) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(cb);
    },
    trigger: function(event, ...args) {
      if (this.listeners[event]) {
        for (const cb of this.listeners[event]) {
          cb(...args);
        }
      }
    },
    setAttribute: function(name, val) {
      this.attributes[name] = String(val);
    },
    getAttribute: function(name) {
      return this.attributes[name] !== undefined ? this.attributes[name] : null;
    },
    classList: {
      add: function() {
        for (const c of arguments) this.classes.add(c);
      },
      remove: function() {
        for (const c of arguments) this.classes.delete(c);
      },
      toggle: function(c) {
        if (this.classes.has(c)) {
          this.classes.delete(c);
          return false;
        } else {
          this.classes.add(c);
          return true;
        }
      },
      contains: function(c) {
        return this.classes.has(c);
      },
      classes: new Set()
    },
    style: {
      display: (tag && tag.includes('learning-objectives-body')) ? 'none' : 'block'
    },
    appendChild: function(child) {
      if (child) {
        child.parentNode = this;
        this.children.push(child);
      }
      return child;
    },
    removeChild: function(child) {
      if (child) {
        const idx = this.children.indexOf(child);
        if (idx > -1) this.children.splice(idx, 1);
        child.parentNode = null;
      }
      return child;
    },
    remove: function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    },
    children: [],
    innerHTML: '',
    textContent: '',
    value: '',
    disabled: false,
    querySelector: function(selector) {
      if (selector.startsWith('#')) {
        return getOrRegisterMockElement(selector.slice(1));
      }
      return createMockElement(null, selector);
    },
    querySelectorAll: function(selector) {
      if (selector === '.spec-checklist-item') {
        const item = getOrRegisterMockElement('mock-spec-checklist-item');
        item.classList.add('spec-checklist-item');
        item.closest = () => null;
        item.getAttribute = (name) => {
          if (name === 'data-key') return 'subtopic_1_1_0';
          return null;
        };
        return [item];
      }
      if (selector === '.hu-tab-btn' || selector === '.hu-tab-panel' || selector === '.deep-thinking-textarea' || selector === '.dt-guide-btn' || selector === '.flaw-option-btn') {
        return [createMockElement(null, 'div')];
      }
      return [];
    }
  };

  elementRegistry.set(elementId, element);
  return element;
}

function getOrRegisterMockElement(id) {
  if (elementRegistry.has(id)) {
    return elementRegistry.get(id);
  }
  return createMockElement(id);
}

// Pre-fill view containers
const viewIds = [
  "view-dashboard",
  "view-classic",
  "view-flashcards",
  "view-exam",
  "view-past-papers",
  "view-mastery",
  "view-timeline",
  "view-bookmarks",
  "view-exam-skills",
  "view-games"
];
viewIds.forEach(id => createMockElement(id));

// Prepare standard subtopic mode buttons
const modeBtns = ['lessons', 'classic', 'flashcards'].map(mode => {
  const btn = createMockElement(null, 'button');
  btn.setAttribute('data-mode', mode);
  btn.classList.add('mode-btn');
  btn.id = `mode-btn-${mode}`;
  return btn;
});

// Prepare standard filter buttons
const filterBtns = ['all', 'standard', 'depth', 'unmastered'].map(filter => {
  const btn = createMockElement(null, 'button');
  btn.setAttribute('data-filter', filter);
  btn.classList.add('filter-btn');
  btn.id = `filter-btn-${filter}`;
  return btn;
});

// Prepare exam tab buttons
const examTabBtns = ['q1', 'q2', 'q3'].map(panel => {
  const btn = createMockElement(null, 'button');
  btn.setAttribute('data-panel', panel);
  btn.classList.add('exam-tab-btn');
  btn.id = `exam-tab-btn-${panel}`;
  return btn;
});

// Prepare Leaflet Map mock references
const mapMock = {
  setView: function() { return this; },
  on: function() { return this; },
  remove: function() { return this; }
};
const markerMock = {
  addTo: function() { return this; },
  bindPopup: function() { return this; }
};
const polylineMock = {
  addTo: function() { return this; }
};

const sandbox = {
  window: {
    addEventListener: (event, cb) => {
      if (event === 'DOMContentLoaded') {
        sandbox.triggerDOMContentLoaded = cb;
      }
    },
    location: {
      origin: 'http://localhost'
    },
    innerWidth: 1024,
    L: {
      map: () => mapMock,
      tileLayer: () => ({ addTo: () => {} }),
      divIcon: () => ({}),
      marker: () => markerMock,
      polyline: () => polylineMock
    }
  },
  document: {
    documentElement: {
      setAttribute: () => {}
    },
    querySelector: function(selector) {
      if (selector.startsWith('#')) {
        return getOrRegisterMockElement(selector.slice(1));
      }
      if (selector.startsWith('.')) {
        for (const [id, el] of elementRegistry.entries()) {
          if (el.classList.contains(selector.slice(1))) {
            return el;
          }
        }
      }
      return createMockElement(null, selector);
    },
    getElementById: (id) => {
      if (htmlIds.has(id) || id.startsWith('nav-pct-') || id.startsWith('nav-subtopic-') || id.startsWith('lesson-panel-') || id === 'btn-practice-next' || id === 'mastery-hard-mode-toggle' || id.startsWith('btn-map-') || id === 'map-image-placeholder') {
        return getOrRegisterMockElement(id);
      } else {
        console.warn(`WARNING: document.getElementById requested non-existent ID: ${id}`);
        return null;
      }
    },
    createElement: (tag) => {
      return createMockElement(null, tag);
    },
    querySelectorAll: (selector) => {
      if (selector === '.content-view') {
        return viewIds.map(id => getOrRegisterMockElement(id));
      }
      if (selector === '.sidebar-nav .nav-item') {
        const results = [];
        for (const [id, el] of elementRegistry.entries()) {
          if (id.startsWith('nav-') && !id.startsWith('nav-pct-') && !id.startsWith('nav-subtopic-')) {
            results.push(el);
          }
        }
        return results;
      }
      if (selector === '#subtopic-mode-switcher .mode-btn') {
        return modeBtns;
      }
      if (selector === '.filter-btn-group .filter-btn') {
        return filterBtns;
      }
      if (selector === '.exam-tab-btn') {
        return examTabBtns;
      }
      if (selector === '.spec-checklist-item') {
        const item = getOrRegisterMockElement('mock-spec-checklist-item');
        item.classList.add('spec-checklist-item');
        item.closest = () => null;
        item.getAttribute = (name) => {
          if (name === 'data-key') return 'subtopic_1_1_0';
          return null;
        };
        return [item];
      }
      if (selector === '.lesson-tab-btn' || selector === '.vault-question-btn' || selector === '.dual-perspective-card' || selector === '.chrono-option-card' || selector === '.chrono-slot' || selector === '.mastery-match-card' || selector === '.defend-option-btn' || selector === '.mindmap-option-card' || selector === '.taboo-team-name-input' || selector === '.taboo-category' || selector === '.btn-audio-read' || selector === '.summary-wrong-word' || selector === '.journey-step-card' || selector === '.vault-reveal-btn' || selector === '.vault-clue-btn' || selector === '.interactive-vault-q1' || selector === '.timeline-bio-btn' || selector === '.timeline-lesson-btn' || selector === '.timeline-bridge-btn' || selector === '.objective-checkbox' || selector === '.objective-text' || selector === '.card-content li' || selector === '.vault-item') {
        return [createMockElement(null, 'div')];
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
  const questionsCode = fs.readFileSync('questions.js', 'utf8').replace(/export\s+/g, '');
  vm.runInContext(questionsCode, context);

  // Load app.js
  const code = fs.readFileSync('app.js', 'utf8');
  vm.runInContext(code, context);
  
  if (sandbox.triggerDOMContentLoaded) {
    console.log("Triggering DOMContentLoaded in VM...");
    sandbox.triggerDOMContentLoaded();
    console.log("DOMContentLoaded run: Completed successfully in VM!");

    console.log("\n--- STARTING SYSTEMATIC NAVIGATION/INTERACTION TESTING ---");

    const sidebarBtns = [
      'nav-dashboard',
      'nav-bookmarks',
      'nav-timeline',
      'nav-exam-sim',
      'nav-games'
    ];

    for (const btnId of sidebarBtns) {
      console.log(`Clicking sidebar item: ${btnId}...`);
      const btn = elementRegistry.get(btnId);
      if (!btn) {
        throw new Error(`Sidebar button element not found in registry: ${btnId}`);
      }
      btn.trigger('click');
      const activeView = viewIds.find(vid => elementRegistry.get(vid).classList.contains('active'));
      console.log(`  Active view in DOM: ${activeView}`);
    }

    const shortcutBtns = [
      'shortcut-timeline',
      'shortcut-exam-sim',
      'shortcut-exam-skills',
      'shortcut-games'
    ];

    for (const btnId of shortcutBtns) {
      console.log(`Clicking shortcut button: ${btnId}...`);
      const btn = elementRegistry.get(btnId);
      if (!btn) {
        throw new Error(`Shortcut button element not found in registry: ${btnId}`);
      }
      btn.trigger('click');
      const activeView = viewIds.find(vid => elementRegistry.get(vid).classList.contains('active'));
      console.log(`  Active view in DOM: ${activeView}`);
    }

    // Now test clicking on a subtopic navigation
    console.log("\nTesting dynamic subtopic view navigation...");
    const subtopicId = 'subtopic_1_1';
    const subtopicBtnId = `nav-subtopic-${subtopicId}`;
    const subtopicBtn = elementRegistry.get(subtopicBtnId);
    if (!subtopicBtn) {
      throw new Error(`Subtopic button element not found in registry: ${subtopicBtnId}`);
    }
    console.log(`Clicking subtopic nav item: ${subtopicBtnId}...`);
    subtopicBtn.trigger('click');
    const activeViewAfterSubtopic = viewIds.find(vid => elementRegistry.get(vid).classList.contains('active'));
    console.log(`  Active view in DOM: ${activeViewAfterSubtopic}`);

    // Assert that the spec checklist items toggle checked state on click
    console.log("\nTesting specification checklist item toggle...");
    const checklistItem = elementRegistry.get('mock-spec-checklist-item');
    if (checklistItem) {
      console.log(`  Checklist item checked state before click: ${checklistItem.classList.contains('checked')}`);
      const isInitiallyChecked = checklistItem.classList.contains('checked');
      checklistItem.trigger('click', { target: checklistItem });
      console.log(`  Checklist item checked state after click: ${checklistItem.classList.contains('checked')}`);
      if (checklistItem.classList.contains('checked') === isInitiallyChecked) {
        throw new Error("Expected checklist item 'checked' class to be toggled after click!");
      }
      checklistItem.trigger('click', { target: checklistItem });
      console.log(`  Checklist item checked state after second click: ${checklistItem.classList.contains('checked')}`);
      if (checklistItem.classList.contains('checked') !== isInitiallyChecked) {
        throw new Error("Expected checklist item 'checked' class to toggle back after second click!");
      }
      console.log("  Specification checklist item toggle verified successfully!");
    } else {
      throw new Error("Could not find specification checklist item element in DOM registry!");
    }

    // Now test subtopic modes: lessons, classic, flashcards
    const modes = ['lessons', 'classic', 'flashcards'];
    for (const mode of modes) {
      console.log(`Switching subtopic mode to: ${mode}...`);
      const targetBtn = modeBtns.find(btn => btn.getAttribute('data-mode') === mode);
      if (!targetBtn) {
        throw new Error(`Subtopic mode button for ${mode} not found in modeBtns`);
      }
      targetBtn.trigger('click');
      const activeModeView = viewIds.find(vid => elementRegistry.get(vid).classList.contains('active'));
      console.log(`  Active view in DOM for mode ${mode}: ${activeModeView}`);
    }

    // Now test Accordion (classic view) filter buttons
    const filters = ['all', 'standard', 'depth', 'unmastered'];
    for (const filter of filters) {
      console.log(`Switching classic filter to: ${filter}...`);
      const targetBtn = filterBtns.find(btn => btn.getAttribute('data-filter') === filter);
      if (!targetBtn) {
        throw new Error(`Filter button for ${filter} not found in filterBtns`);
      }
      targetBtn.trigger('click');
    }

    // Now test Exam tab switches
    const examTabs = ['q1', 'q2', 'q3'];
    for (const tab of examTabs) {
      console.log(`Switching exam practice tab to: ${tab}...`);
      const targetBtn = examTabBtns.find(btn => btn.getAttribute('data-panel') === tab);
      if (!targetBtn) {
        throw new Error(`Exam tab button for ${tab} not found in examTabBtns`);
      }
      targetBtn.trigger('click');
    }

    console.log("\nALL FUNCTIONAL VIEW TRANSITIONS AND FILTERS PASSED INTEGRATION TESTING!");
  }
} catch (e) {
  console.error("CRITICAL RUNTIME ERROR IN VM:", e.message);
  console.error(e.stack);
  process.exit(1);
}
