/**
 * test_all_features.js
 * Comprehensive integration tests for the GCSE History USA app.
 * Runs in Node.js using JSDOM to simulate user interaction, routing, state changes, and games.
 */

const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

console.log("=================================================");
console.log("STARTING COMPREHENSIVE INTEGRATION TEST SUITE");
console.log("=================================================");

// 1. Prepare HTML and JSDOM Environment
const htmlContent = fs.readFileSync('index.html', 'utf8');
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on('error', (...args) => console.error('[JSDOM Page Error]:', ...args));
virtualConsole.on('warn', (...args) => console.warn('[JSDOM Page Warning]:', ...args));
virtualConsole.on('log', (...args) => console.log('[JSDOM Page Log]:', ...args));

const dom = new JSDOM(htmlContent, {
  url: 'http://localhost:3000',
  runScripts: 'outside-only',
  resources: 'usable',
  virtualConsole
});

const { window } = dom;
const { document } = window;

// 2. Mock missing Web/Browser APIs in JSDOM
window.AudioContext = function() {
  return {
    state: 'suspended',
    currentTime: 0,
    resume: async () => {},
    createOscillator: () => ({
      frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
      connect: () => {},
      start: () => {},
      stop: () => {}
    }),
    createGain: () => ({
      gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
      connect: () => {}
    }),
    createBiquadFilter: () => ({
      frequency: { setValueAtTime: () => {} },
      connect: () => {}
    }),
    destination: {}
  };
};

window.webkitAudioContext = window.AudioContext;
window.requestAnimationFrame = (callback) => setTimeout(callback, 0);
window.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock HTMLCanvasElement context
window.HTMLCanvasElement.prototype.getContext = function(type) {
  if (type === '2d') {
    const gradientMock = { addColorStop: () => {} };
    return {
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      clearRect: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      fill: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      rotate: () => {},
      scale: () => {},
      ellipse: () => {},
      arcTo: () => {},
      quadraticCurveTo: () => {},
      bezierCurveTo: () => {},
      drawImage: () => {},
      createLinearGradient: () => gradientMock,
      createRadialGradient: () => gradientMock,
      arc: () => {},
      rect: () => {},
      roundRect: () => {},
      clip: () => {},
      getContextAttributes: () => ({}),
      isPointInPath: () => false,
      measureText: () => ({ width: 10 })
    };
  }
  return null;
};

// Silence alerts and confirmations
window.alert = (msg) => console.log(`[Browser Alert]: ${msg}`);
window.confirm = (msg) => {
  console.log(`[Browser Confirm]: ${msg}`);
  return true;
};

// Mock URL create/revoke and Blob for past papers & workbook downloads
window.URL.createObjectURL = () => 'blob:mock-url';
window.URL.revokeObjectURL = () => {};
window.Blob = function(content, options) {
  return { content, options };
};

// Mock window.open for isolated print/worksheets
window.open = () => {
  return {
    document: {
      open: () => {},
      write: (html) => {},
      close: () => {}
    },
    focus: () => {},
    print: () => {}
  };
};
window.print = () => {};

// Mock localStorage
const storage = {};
window.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

// Mock Leaflet (L) for Map Explorer
window.L = {
  map: () => ({
    setView: function() { return this; },
    invalidateSize: function() { return this; },
    addTo: function() { return this; }
  }),
  tileLayer: () => ({
    addTo: function() { return this; }
  }),
  layerGroup: () => ({
    addTo: function() { return this; },
    clearLayers: function() { return this; }
  }),
  divIcon: (opts) => opts,
  marker: () => ({
    addTo: function() { return this; },
    bindPopup: function() { return this; },
    openPopup: function() { return this; },
    bindTooltip: function() { return this; },
    on: function() { return this; }
  }),
  polyline: () => ({
    addTo: function() { return this; },
    setStyle: function() { return this; }
  })
};

// Capture DOMContentLoaded listener
let domContentLoadedCallback = null;
const originalAddEventListener = window.addEventListener;
window.addEventListener = function(event, callback, options) {
  if (event === 'DOMContentLoaded') {
    domContentLoadedCallback = callback;
  }
  originalAddEventListener.call(this, event, callback, options);
};

// 3. Load script files into the window context
function loadScript(path) {
  let code = fs.readFileSync(path, 'utf8');
  if (path === 'questions.js') {
    code = code.replace(/export const /g, 'var ');
    code = code.replace(/export /g, '');
  }
  window.eval(code);
}

try {
  console.log("Loading questions.js into VM context...");
  loadScript('questions.js');
  console.log("Loaded questions.js successfully!");

  console.log("Loading app.js (bundled script) into VM context...");
  loadScript('app.js');
  console.log("Loaded app.js successfully!");
} catch (e) {
  console.error("Failed to load scripts:", e);
  process.exit(1);
}

// Helper to fire event
function fireClick(element) {
  if (!element) throw new Error("Target element for click is null!");
  const clickEvent = new window.MouseEvent('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(clickEvent);
}

// 4. Run tests
(async () => {
try {
  // Trigger DOMContentLoaded
  if (domContentLoadedCallback) {
    console.log("Calling captured DOMContentLoaded callback...");
    domContentLoadedCallback();
  } else {
    console.log("Dispatching standard DOMContentLoaded event...");
    const domEvent = new window.Event('DOMContentLoaded');
    window.dispatchEvent(domEvent);
  }
  console.log("✓ DOMContentLoaded triggered.");
  console.log("  - window.switchView is:", typeof window.switchView);
  console.log("  - window.AudioEngine is:", typeof window.AudioEngine);

  // Test 1: Navigation Toggles
  console.log("\n--- TEST 1: Navigation Sidebar Toggles ---");
  const views = [
    { navId: 'nav-dashboard', viewId: 'view-dashboard', name: 'Dashboard' },
    { navId: 'nav-timeline', viewId: 'view-timeline', name: 'Timeline' },
    { navId: 'nav-map', viewId: 'view-map', name: 'Map Explorer' },
    { navId: 'nav-exam-sim', viewId: 'view-exam', name: 'Quiz Generator' },
    { navId: 'nav-worksheets', viewId: 'view-exam-hub', name: 'Educator Worksheets' },
    { navId: 'nav-exam-hub', viewId: 'view-exam-hub', name: 'Exam Hub' },
    { navId: 'nav-games', viewId: 'view-games', name: 'Games Hub' },
    { navId: 'nav-leaderboard', viewId: 'view-leaderboard', name: 'Leaderboard' }
  ];

  views.forEach(v => {
    const navBtn = document.getElementById(v.navId);
    if (!navBtn) throw new Error(`Sidebar nav item ${v.navId} not found in DOM!`);
    fireClick(navBtn);
    
    const viewContainer = document.getElementById(v.viewId);
    if (!viewContainer.classList.contains('active')) {
      throw new Error(`View container ${v.viewId} is not active after clicking sidebar link!`);
    }
    console.log(`  - Navigated to: ${v.name}`);
  });
  console.log("✓ Sidebar navigation tests passed.");

  // Test 2: Dashboard stats check
  console.log("\n--- TEST 2: Dashboard Statistics Display ---");
  fireClick(document.getElementById('nav-dashboard'));
  const overallProgText = document.getElementById('stat-overall-progress').textContent;
  console.log(`  - Header Overall Progress Displayed: ${overallProgText}`);
  if (!overallProgText.includes('%')) {
    throw new Error("Header progress percentage is not formatted correctly!");
  }
  console.log("✓ Dashboard statistics test passed.");

  // Test 3: Subtopic Study (Lessons, Accordions, Flashcards, level toggle, and Do Now)
  console.log("\n--- TEST 3: Subtopic Study View & Modes ---");
  // Select first subtopic in sidebar
  const subtopicNavBtn = document.getElementById('nav-subtopic-subtopic_1_1');
  if (!subtopicNavBtn) throw new Error("Subtopic Topic 1.1 sidebar button not found!");
  fireClick(subtopicNavBtn);
  
  // Verify header mode switcher is visible
  const modeSwitcher = document.getElementById('subtopic-mode-switcher');
  if (modeSwitcher.style.display === 'none') {
    throw new Error("Subtopic mode switcher should be displayed when in subtopic view!");
  }
  console.log("  - Subtopic mode switcher visible.");

  // 3a. Core Lesson / Mastery Switcher and Toggling studyLevel
  console.log("  - Testing Core vs Mastery Toggle:");
  const levelBtns = document.querySelectorAll('.level-toggle-btn');
  if (levelBtns.length > 0) {
    // Toggling core mode
    const coreBtn = Array.from(levelBtns).find(btn => btn.getAttribute('data-level') === 'core');
    if (coreBtn) {
      fireClick(coreBtn);
      if (dom.window.state.studyLevel !== 'core') {
        throw new Error("studyLevel state did not update to 'core' when clicking core toggle!");
      }
      console.log("    * Switch to Core Lesson mode verified.");
      
      // Verify 5 Key Comprehension Questions layout (in Core mode)
      const scaffoldCard = document.querySelector('.core-scaffold-questions-card');
      if (scaffoldCard) {
        const textareas = scaffoldCard.querySelectorAll('textarea');
        const saveBtn = scaffoldCard.querySelector('.btn-core-save-scaffold-answers');
        if (textareas.length > 0 || saveBtn) {
          throw new Error("Comprehension questions should be condensed without textareas or save button!");
        }
        console.log("    * Condensed Comprehension Questions verified (no textareas/save buttons).");
      }
    }
    
    // Toggling mastery mode
    // Query live document to find the new mastery button
    const liveBtns = document.querySelectorAll('.level-toggle-btn');
    const masteryBtn = Array.from(liveBtns).find(btn => btn.getAttribute('data-level') === 'mastery');
    if (masteryBtn) {
      fireClick(masteryBtn);
      if (dom.window.state.studyLevel !== 'mastery') {
        throw new Error("studyLevel state did not update to 'mastery' when clicking mastery toggle!");
      }
      console.log("    * Switch back to Mastery mode verified.");
    }
  }

  // Collapsible Map Verification
  const mapHeader = document.querySelector('.lesson-map-toggle-header');
  if (mapHeader) {
    const mapBody = document.querySelector('.lesson-map-body');
    if (!mapBody || mapBody.style.display !== 'none') {
      throw new Error("Lesson map body should be hidden/collapsed by default!");
    }
    fireClick(mapHeader);
    if (mapBody.style.display !== 'block') {
      throw new Error("Lesson map body did not expand when toggle header clicked!");
    }
    console.log("    * Collapsible Lesson Map verified.");
  }

  // 3b. Collapsible Do Now Task Header
  console.log("  - Testing Collapsible Do Now task header:");
  const doNowHeader = document.querySelector('.do-now-toggle-header');
  if (doNowHeader) {
    const contentWrapper = document.querySelector('.do-now-content-wrapper');
    if (contentWrapper.style.display !== 'none') {
      throw new Error("Do Now content should be hidden by default!");
    }
    fireClick(doNowHeader);
    if (contentWrapper.style.display !== 'block') {
      throw new Error("Do Now content did not expand on clicking toggle header!");
    }
    console.log("    * Do Now expand/collapse verified.");
  }

  // Spec points ticking
  const specItems = document.querySelectorAll('.spec-checklist-item');
  if (specItems.length > 0) {
    console.log(`    * Found ${specItems.length} spec checklist items. Ticking the first one...`);
    fireClick(specItems[0]);
    if (!specItems[0].classList.contains('checked')) {
      throw new Error("Spec checklist item was not checked off after clicking!");
    }
    console.log("    * Checked off successfully.");
  }

  // Toggling Hard Mode
  const hardModeToggle = document.getElementById('mastery-hard-mode-toggle');
  if (hardModeToggle) {
    hardModeToggle.checked = true;
    const changeEvent = new window.Event('change');
    hardModeToggle.dispatchEvent(changeEvent);
    console.log("    * Toggled Hard Mode successfully.");
  }

  // Mark Mastery button click
  const markMasteryBtn = document.getElementById('btn-mark-mastery-mastered');
  if (markMasteryBtn) {
    fireClick(markMasteryBtn);
    console.log("    * Marked subtopic as mastered.");
  }

  // 3c. Accordions Mode
  console.log("  - Testing Classic Accordion View:");
  const btnClassic = modeSwitcher.querySelector('[data-mode="classic"]');
  fireClick(btnClassic);
  const accordions = document.querySelectorAll('.quiz-card-details');
  if (accordions.length === 0) {
    throw new Error("Accordions view loaded but no quiz accordion cards were rendered!");
  }
  console.log(`    * Rendered ${accordions.length} questions in subtopic accordion list.`);
  
  // Test filters
  const filterBtns = document.querySelectorAll('.classic-filters .filter-btn');
  if (filterBtns.length > 0) {
    fireClick(filterBtns[1]); // Easy
    console.log("    * Filtered easy questions.");
  }

  // Test toggling mastery inside accordion summary
  const checkboxContainer = accordions[0].querySelector('.mastery-checkbox-container');
  if (checkboxContainer) {
    const isInitiallyMastered = checkboxContainer.classList.contains('mastered-secured') || checkboxContainer.classList.contains('mastered-gold');
    fireClick(checkboxContainer);
    const isMasteredAfter = checkboxContainer.classList.contains('mastered-secured') || checkboxContainer.classList.contains('mastered-gold');
    if (isMasteredAfter === isInitiallyMastered) {
      throw new Error("Mastery checkmark did not toggle state!");
    }
    console.log("    * Toggled question mastery checkmark successfully.");
  }

  // 3d. Flashcards Mode
  console.log("  - Testing Flashcard Study Session:");
  const btnFC = modeSwitcher.querySelector('[data-mode="flashcards"]');
  fireClick(btnFC);
  await new Promise(resolve => setTimeout(resolve, 150));

  // Handle Narrative Framing Screen if present
  const startRetrievalBtn = document.getElementById('btn-start-active-retrieval');
  if (startRetrievalBtn) {
    console.log("    * Narrative framing screen detected. Clicking 'Start Active Retrieval Loop'...");
    fireClick(startRetrievalBtn);
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  
  // Enable Whiz mode (speed study mode) to bypass rubric requirements
  const speedStudyToggle = document.getElementById('flashcard-speed-study-toggle');
  if (speedStudyToggle) {
    speedStudyToggle.checked = true;
    const changeEvent = new window.Event('change');
    speedStudyToggle.dispatchEvent(changeEvent);
  }
  
  const flashcardCounterTextEl = document.getElementById('flashcard-counter-text');
  if (!flashcardCounterTextEl) {
    throw new Error("flashcard-counter-text element not found in DOM!");
  }
  const flashcardCounter = flashcardCounterTextEl.textContent;
  if (!flashcardCounter.includes('Card 1')) {
    throw new Error("Flashcards view did not initialize with Card 1!");
  }
  console.log(`    * Session started: ${flashcardCounter}`);

  // Reveal Answer (Flip Card)
  const flipBtn = document.getElementById('btn-flashcard-reveal');
  fireClick(flipBtn);
  const cardEl = document.getElementById('flashcard-card');
  if (!cardEl || !cardEl.classList.contains('flipped')) {
    throw new Error("Flashcard did not flip after clicking Reveal!");
  }
  console.log("    * Flipped card face to reveal answer.");

  // Correct grade
  const correctBtn = document.getElementById('btn-flashcard-correct');
  if (correctBtn) {
    fireClick(correctBtn);
    console.log("    * Marked card as correct.");
  }

  console.log("✓ Subtopic study view tests passed.");

  // Test 4: Quiz Generator (Recall Challenge)
  console.log("\n--- TEST 4: Quiz Generator & Recall Challenge ---");
  fireClick(document.getElementById('nav-exam-sim'));
  
  // Set options and start
  const startChallengeBtn = document.getElementById('btn-exam-start');
  if (!startChallengeBtn) throw new Error("Quiz start button not found!");
  fireClick(startChallengeBtn);
  
  const runnerPanel = document.getElementById('exam-runner-panel');
  if (runnerPanel.style.display === 'none') {
    throw new Error("Active Quiz runner did not show up on start!");
  }
  console.log("  - Active quiz simulator started.");

  // Answer quiz question
  const mcqOption = document.querySelector('#exam-mcq-options-container .mcq-choice-btn');
  if (mcqOption) {
    fireClick(mcqOption);
    console.log("  - Selection submitted.");
    
    const reviewSection = document.getElementById('exam-review-section');
    if (reviewSection.style.display === 'none') {
      throw new Error("Quiz did not enter self-grading/review state after answer selection!");
    }
    
    // Proceed to next question
    const nextQBtn = document.getElementById('btn-exam-next');
    fireClick(nextQBtn);
    console.log("  - Advanced to next question.");
  }

  // Quit challenge
  const quitQBtn = document.getElementById('btn-exam-quit');
  fireClick(quitQBtn);
  const setupPanel = document.getElementById('exam-setup-panel');
  if (setupPanel.style.display === 'none') {
    throw new Error("Quiz did not return to setup panel after quitting!");
  }
  console.log("  - Quit recall test and returned to setup successfully.");
  console.log("✓ Quiz generator test passed.");

  // Test 5: Exam Hub & Past Papers
  console.log("\n--- TEST 5: Exam Hub Panels & Past Paper Selector ---");
  fireClick(document.getElementById('nav-exam-hub'));
  
  // Click Papers tab
  const papersTabBtn = Array.from(document.querySelectorAll('.exam-tab-btn')).find(btn => btn.getAttribute('data-panel') === 'papers');
  if (papersTabBtn) {
    fireClick(papersTabBtn);
    const papersPanel = document.getElementById('panel-papers');
    if (papersPanel.style.display === 'none') {
      throw new Error("Papers & Mocks panel did not display on clicking tab!");
    }
    console.log("  - Switched to Papers & Mocks panel.");
  }

  const pastPaperSelect = document.getElementById('past-paper-select');
  if (pastPaperSelect) {
    pastPaperSelect.value = "2018_summer_usa";
    const changeEvent = new window.Event('change');
    pastPaperSelect.dispatchEvent(changeEvent);
    
    const openBtn = document.getElementById('btn-start-past-paper');
    fireClick(openBtn);
    
    const sheetContainer = document.getElementById('past-paper-sheet-container');
    if (sheetContainer.style.display === 'none') {
      throw new Error("Past exam paper sheet was not revealed on click!");
    }
    console.log("  - Opened Summer 2018 Past Paper.");

    // Simulate clicking the print/Word buttons to verify there are no runtime ReferenceErrors
    const printBtn = document.getElementById('btn-print-exam-sheet');
    const wordBtn = document.getElementById('btn-word-exam-sheet');
    
    if (printBtn) {
      console.log("  - Testing Past Paper Print/PDF Click...");
      fireClick(printBtn);
    } else {
      throw new Error("Print button not found in loaded exam sheet!");
    }
    
    if (wordBtn) {
      console.log("  - Testing Past Paper Word Export Click...");
      fireClick(wordBtn);
    } else {
      throw new Error("Word Export button not found in loaded exam sheet!");
    }
  }
  console.log("✓ Exam Hub / Past Papers test passed.");

  // Test 6: Revision Games Hub Tabs
  console.log("\n--- TEST 6: Revision Games Hub & Subtopic Filtering ---");
  fireClick(document.getElementById('nav-games'));

  const gameTabs = [
    { btnId: 'btn-tab-game-causal', containerId: 'game-causal-container', name: 'Causal Link Builder' },
    { btnId: 'btn-tab-game-chronology', containerId: 'game-chronology-container', name: 'Chronology Challenge' },
    { btnId: 'btn-tab-game-mastery', containerId: 'game-mastery-container', name: 'Mastery Match' },
    { btnId: 'btn-tab-game-decisions', containerId: 'game-decisions-container', name: 'Decision Simulator' },
    { btnId: 'btn-tab-game-mindmap', containerId: 'game-mindmap-container', name: 'Concept Connector' },
    { btnId: 'btn-tab-game-taboo', containerId: 'game-taboo-container', name: 'Taboo Cards' },
    { btnId: 'btn-tab-game-adventure', containerId: 'game-adventure-container', name: 'Civil Rights Adventure' },
    { btnId: 'btn-tab-game-vietnam-adventure', containerId: 'game-vietnam-adventure-container', name: 'Vietnam Campaign' },
    { btnId: 'btn-tab-game-civilian-adventure', containerId: 'game-civilian-adventure-container', name: 'South Vietnam Experience' },
    { btnId: 'btn-tab-game-north-vietnam-adventure', containerId: 'game-north-vietnam-adventure-container', name: 'North Vietnam Adventure' },
    { btnId: 'btn-tab-game-echoes-adventure', containerId: 'game-echoes-adventure-container', name: 'Echoes of Conflict' }
  ];

  for (const g of gameTabs) {
    const tabBtn = document.getElementById(g.btnId);
    if (!tabBtn) throw new Error(`Game tab button ${g.btnId} not found!`);
    fireClick(tabBtn);
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const pane = document.getElementById(g.containerId);
    if (pane.style.display === 'none') {
      throw new Error(`Game pane ${g.containerId} is not visible after selecting tab!`);
    }
    console.log(`  - Loaded Game: ${g.name}`);
  }
  console.log("✓ Revision Games Hub tabs verified.");

  // Test 7: Adventure Games Engines & State Transitions
  console.log("\n--- TEST 7: Adventure Games Engines & Echoes Parser ---");
  
  // 7a. US Civil Rights Adventure Engine
  console.log("  - Verifying US Civil Rights Adventure:");
  dom.window.initAdventureGame();
  const optionsStack = document.getElementById('options-container');
  if (optionsStack.children.length === 0) {
    throw new Error("Civil Rights Adventure options-container is empty after initialization!");
  }
  console.log(`    * Score starts at: ${document.getElementById('adv-score').textContent}`);
  
  // 7b. Vietnam Campaign Adventure Engine
  console.log("  - Verifying Vietnam Campaign Adventure:");
  dom.window.initVietnamAdventureGame();
  const vOptionsStack = document.getElementById('v-options-container');
  if (vOptionsStack.children.length === 0) {
    throw new Error("Vietnam Campaign options-container is empty after initialization!");
  }
  console.log(`    * Score starts at: ${document.getElementById('v-score').textContent}`);

  // 7c. South Vietnam Experience (Civilian) Adventure Engine
  console.log("  - Verifying South Vietnam Experience:");
  dom.window.initCivilianAdventureGame();
  const cOptionsStack = document.getElementById('c-options-container');
  if (cOptionsStack.children.length === 0) {
    throw new Error("Civilian options-container is empty after initialization!");
  }
  console.log(`    * Score starts at: ${document.getElementById('c-score').textContent}`);

  // 7d. North Vietnam Adventure Engine
  console.log("  - Verifying North Vietnam Adventure:");
  dom.window.initNorthVietnamAdventureGame();
  const nOptionsStack = document.getElementById('n-options-container');
  if (nOptionsStack.children.length === 0) {
    throw new Error("North Vietnam options-container is empty after initialization!");
  }
  console.log(`    * Score starts at: ${document.getElementById('n-score').textContent}`);

  // 7e. Echoes of Conflict Parser Engine
  console.log("  - Verifying Echoes of Conflict: Home & Abroad:");
  dom.window.initEchoesAdventureGame();
  const logStream = document.getElementById('log-stream');
  if (!logStream || logStream.children.length === 0) {
    throw new Error("Echoes of Conflict log stream is empty after initialization!");
  }
  console.log("    * Initialized successfully. Simulating Act 1 actions...");

  const runCommand = (commandString) => {
    const parseInput = document.getElementById('parse-input');
    if (!parseInput) throw new Error("parse-input terminal field not found!");
    parseInput.value = commandString;
    dom.window.handleParseSubmit({ key: 'Enter' });
  };

  // Act 1: Get megaphone and notes, then use megaphone on podium
  runCommand('take megaphone');
  runCommand('take speech notes');
  runCommand('use megaphone on podium');
  
  // Answer Act 1 quiz question (Brown v. Board justification)
  // Correct answer is "a"
  runCommand('a');

  // Verify transition to Act 2
  const hudActTitle = document.getElementById('hud-act-title');
  if (!hudActTitle || !hudActTitle.textContent.includes('ACT 2')) {
    console.log("----- DEBUG: Echoes Log Stream -----");
    console.log(logStream ? logStream.textContent : "logStream not found");
    console.log("----- DEBUG: HUD ACT TITLE -----");
    console.log("hudActTitle exists:", !!hudActTitle);
    if (hudActTitle) {
      console.log("hudActTitle textContent:", hudActTitle.textContent);
      console.log("hudActTitle outerHTML:", hudActTitle.outerHTML);
    }
    console.log("-------------------------------------");
    throw new Error("Echoes game did not transition to ACT 2 after correct answer!");
  }
  console.log("    * Act 1 complete! Transitioned to Act 2.");

  // Act 2: Swap character to Activist, grab flyer, swap back to Soldier, use flyer on radio
  runCommand('swap');
  runCommand('take flyer');
  runCommand('swap');
  runCommand('use flyer on radio');

  // Answer Act 2 quiz question (Lunar New Year surprise offensive)
  // Correct answer is "b"
  runCommand('b');

  // Verify transition to Act 3
  if (!hudActTitle || !hudActTitle.textContent.includes('ACT 3')) {
    throw new Error("Echoes game did not transition to ACT 3 after correct answer!");
  }
  console.log("    * Act 2 complete! Transitioned to Act 3.");

  // Act 3: Look at negotiation table, answer quiz question (Nixon exit strategy)
  // Correct answer is "a"
  runCommand('look table');
  runCommand('a');

  // Look at television, answer final quiz question (South Vietnam collapse reason)
  // Correct answer is "a"
  runCommand('look television');
  runCommand('a');

  // Verify game complete win state
  if (!logStream.innerHTML.includes('🎉 Revision Master Certificate!')) {
    console.log("----- DEBUG: Echoes Act 3 Log Stream -----");
    console.log(logStream ? logStream.textContent : "logStream not found");
    console.log("------------------------------------------");
    throw new Error("Game completion certificate not rendered in log-stream!");
  }
  console.log("    * Echoes of Conflict completed successfully!");
  console.log("✓ Adventure engines and echoes parser verified.");

  // Test 8: Workbook HTML Generation for All 16 Lessons & Styles
  console.log("\n--- TEST 8: Workbook HTML Generation for All 16 Lessons & Styles ---");
  const subtopicIds = [
    'subtopic_1_1', 'subtopic_1_2', 'subtopic_1_3', 'subtopic_1_4',
    'subtopic_2_1', 'subtopic_2_2', 'subtopic_2_3', 'subtopic_2_4',
    'subtopic_3_1', 'subtopic_3_2', 'subtopic_3_3', 'subtopic_3_4',
    'subtopic_4_1', 'subtopic_4_2', 'subtopic_4_3', 'subtopic_4_4'
  ];
  const styles = ['booklet', 'cloze', 'cornell', 'organizer', 'exam'];
  
  for (const subId of subtopicIds) {
    for (const style of styles) {
      const selectedIndices = [0, 1];
      const resultHtml = await dom.window.generateWorkbookHtml(subId, style, 'standard', false, selectedIndices);
      if (!resultHtml || typeof resultHtml !== 'string') {
        throw new Error(`Workbook HTML is not a string for ${subId} and style ${style}`);
      }
      if (resultHtml.includes('undefined')) {
        throw new Error(`Workbook HTML for ${subId} and style ${style} contains "undefined"!`);
      }
      if (resultHtml.length < 100) {
        throw new Error(`Workbook HTML is too short for ${subId} and style ${style}`);
      }
    }
  }
  console.log("✓ All 16 subtopics and styles run and verified successfully without ReferenceError or 'undefined' markers.");

  // Test 9: Bulk Workbook HTML Generation for All Styles
  console.log("\n--- TEST 9: Course-Wide Bulk Workbook HTML Generation ---");
  const bulkStyles = ['booklet', 'cloze', 'cornell', 'organizer', 'exam'];
  for (const style of bulkStyles) {
    const resultHtml = await dom.window.generateBulkWorkbookHtml(style, 'standard', false);
    if (!resultHtml || typeof resultHtml !== 'string') {
      throw new Error(`Bulk Workbook HTML is not a string for style ${style}`);
    }
    if (resultHtml.includes('undefined')) {
      throw new Error(`Bulk Workbook HTML for style ${style} contains "undefined"!`);
    }
    if (resultHtml.length < 5000) {
      throw new Error(`Bulk Workbook HTML is too short for style ${style} (${resultHtml.length} chars)`);
    }
    console.log(`  - Style ${style}: Generated ${resultHtml.length} characters.`);
  }
  console.log("✓ Bulk workbook generations run and verified successfully without ReferenceError or 'undefined' markers.");

  // Test 10: Standalone Falling Blocks Game Page JSDOM Instance
  console.log("\n--- TEST 10: Standalone Falling Blocks Game Page Testing ---");
  const fbHtmlContent = fs.readFileSync('falling_blocks.html', 'utf8');
  const fbVirtualConsole = new jsdom.VirtualConsole();
  const fbDom = new JSDOM(fbHtmlContent, {
    url: 'http://localhost:3000/falling_blocks.html',
    runScripts: 'dangerously',
    resources: 'usable',
    virtualConsole: fbVirtualConsole
  });

  const fbWindow = fbDom.window;
  const fbDocument = fbWindow.document;

  // Share canvas mock from main window to fbWindow
  fbWindow.HTMLCanvasElement.prototype.getContext = window.HTMLCanvasElement.prototype.getContext;
  
  // Share AudioContext mock from main window to fbWindow
  fbWindow.AudioContext = window.AudioContext;
  fbWindow.webkitAudioContext = window.webkitAudioContext;

  // Share requestAnimationFrame/cancelAnimationFrame mocks from main window to fbWindow
  fbWindow.requestAnimationFrame = window.requestAnimationFrame;
  fbWindow.cancelAnimationFrame = window.cancelAnimationFrame;

  // Manually mock QUIZ_DATA and trigger game initialization for JSDOM
  fbWindow.QUIZ_DATA = window.QUIZ_DATA || {};
  if (typeof fbWindow.runGameInit === 'function') {
    fbWindow.runGameInit();
  } else {
    const loadEvent = new fbWindow.Event('load');
    fbWindow.dispatchEvent(loadEvent);
    const quizEvent = new fbWindow.CustomEvent('quizDataLoaded');
    fbWindow.dispatchEvent(quizEvent);
  }

  // Wait a small timeout to let JSDOM initialize scripts
  await new Promise(resolve => setTimeout(resolve, 100));

  console.log("  - Verification of initials validation triggers:");
  const testGame = fbWindow.gameInstance;
  if (!testGame) {
    throw new Error("FallingBlocksGame instance (gameInstance) not found on window object!");
  }

  // 10a. Validate valid initials
  const validCheck = testGame.validateInitials("JHB");
  if (!validCheck.valid) {
    throw new Error("Valid initials JHB rejected by validator!");
  }
  console.log("    * Valid initials JHB accepted.");

  // 10b. Validate length error
  const lengthCheck = testGame.validateInitials("JH");
  if (lengthCheck.valid) {
    throw new Error("Too short initials JH accepted by validator!");
  }
  console.log("    * Too short initials JH correctly rejected.");

  // 10c. Validate profanity list check
  const profanityCheck = testGame.validateInitials("ASS");
  if (profanityCheck.valid) {
    throw new Error("Profane initials ASS accepted by validator!");
  }
  console.log("    * Profane initials ASS correctly rejected.");

  console.log("✓ Standalone Falling Blocks page verification passed.");

  // --- TEST 11: User & Parent Guide Page & Toolkit ---
  console.log("\n--- TEST 11: User & Parent Guide Page & Toolkit ---");
  // Navigate back to dashboard first to start from main screen
  window.switchView('dashboard');

  // Verify header guide button click triggers guide view
  const headerGuideBtn = document.getElementById('nav-guide-header');
  if (!headerGuideBtn) throw new Error("Header nav-guide-header button not found!");
  fireClick(headerGuideBtn);
  
  const guideView = document.getElementById('view-guide');
  if (!guideView || !guideView.classList.contains('active')) {
    throw new Error("User & Parent Guide view was not activated after clicking header guide button!");
  }
  console.log("    * Header guide button click navigation verified.");
  
  console.log("✓ User & Parent Guide view verification passed.");

  console.log("\n=================================================");
  console.log("ALL FEATURES VERIFIED AND CONFIRMED FUNCTIONAL!");
  console.log("=================================================");
  process.exit(0);

} catch (e) {
  console.error("\n❌ TEST FAILURE DETECTED:");
  console.error(e.message);
  console.error(e.stack);
  process.exit(1);
}
})();
