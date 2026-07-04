const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

console.log("=================================================");
console.log("RUNNING TARGETED PRINT TAB VERIFICATION TESTS");
console.log("=================================================");

const htmlContent = fs.readFileSync('index.html', 'utf8');

const dom = new JSDOM(htmlContent, {
  url: 'http://localhost:3000',
  runScripts: 'outside-only',
  resources: 'usable'
});

const { window } = dom;
const { document } = window;

// Mock audio context and other globals
window.AudioContext = function() {
  return {
    state: 'suspended',
    resume: () => Promise.resolve(),
    createOscillator: () => ({ frequency: { setValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }),
    createGain: () => ({ gain: { setValueAtTime: () => {} }, connect: () => {} }),
    destination: {}
  };
};
window.webkitAudioContext = window.AudioContext;
window.requestAnimationFrame = (callback) => setTimeout(callback, 0);

// Mock Leaflet
window.L = {
  map: () => ({ setView: function() { return this; }, invalidateSize: function() { return this; }, addTo: function() { return this; } }),
  tileLayer: () => ({ addTo: function() { return this; } }),
  layerGroup: () => ({ addTo: function() { return this; }, clearLayers: function() { return this; } }),
  divIcon: (opts) => opts,
  marker: () => ({ addTo: function() { return this; }, bindPopup: function() { return this; }, openPopup: function() { return this; }, bindTooltip: function() { return this; }, on: function() { return this; } }),
  polyline: () => ({ addTo: function() { return this; }, setStyle: function() { return this; } })
};

// Captures window.open calls to verify parameters and content written
let openedWindows = [];

window.open = (url, name) => {
  const mockWin = {
    document: {
      writtenContent: '',
      open: function() { this.writtenContent = ''; },
      write: function(html) { this.writtenContent += html; },
      close: function() {},
      opened: true
    },
    close: function() { this.document.opened = false; }
  };
  openedWindows.push({ url, name, win: mockWin });
  return mockWin;
};

// Mock window.print
let printCalledCount = 0;
window.print = () => {
  printCalledCount++;
};

// Load scripts
function loadScript(path) {
  let code = fs.readFileSync(path, 'utf8');
  if (path === 'questions.js') {
    code = code.replace(/export const /g, 'var ');
    code = code.replace(/export /g, '');
  }
  window.eval(code);
}

try {
  loadScript('questions.js');
  loadScript('app.js');
} catch (e) {
  console.error("Failed to load scripts:", e);
  process.exit(1);
}

// Helper to fire click events
function fireClick(element) {
  if (!element) throw new Error("Target element is null!");
  const clickEvent = new window.Event('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(clickEvent);
}

// Run the verification suite
(async () => {
  try {
    // 1. Dispatch DOMContentLoaded to init the app
    const domEvent = new window.Event('DOMContentLoaded');
    window.dispatchEvent(domEvent);
    console.log("✓ DOMContentLoaded triggered.");

    // Clear any windows opened during initialization
    openedWindows = [];
    printCalledCount = 0;

    // Ensure print-area div is in the document body
    let printArea = document.getElementById('print-area');
    if (!printArea) {
      printArea = document.createElement('div');
      printArea.id = 'print-area';
      document.body.appendChild(printArea);
    }

    // --- TEST 1: Lesson Worksheet Page (opens tab, writes once) ---
    console.log("\n--- TEST 1: Lesson Worksheet Page ---");
    // Switch to Topic 1.1 view to render the button
    const subNavBtn = document.getElementById('nav-subtopic-subtopic_1_1');
    fireClick(subNavBtn);
    
    const viewWorksheetPageBtn = document.querySelector('.view-worksheet-page-btn');
    if (!viewWorksheetPageBtn) {
      throw new Error("Lesson Worksheet Page button not found in Topic 1.1 view!");
    }
    
    // Reset window tracker
    openedWindows = [];
    fireClick(viewWorksheetPageBtn);
    
    if (openedWindows.length === 0) {
      throw new Error("Clicking view-worksheet-page-btn did not call window.open!");
    }
    
    const win1 = openedWindows[0];
    console.log("  - window.open called synchronously.");
    if (!win1.win.document.writtenContent.includes("GCSE History Lesson Resource -")) {
      throw new Error("Compiled worksheet content was not written to the tab!");
    }
    console.log("✓ TEST 1 PASSED: Lesson Worksheet Page opened and compiled correctly.");

    // --- TEST 2: Lesson Workbook Print (inline, calls window.print) ---
    console.log("\n--- TEST 2: Lesson Workbook Modal Print ---");
    const printWorkbookBtn = document.querySelector('.print-workbook-btn');
    if (!printWorkbookBtn) {
      throw new Error("Print Workbook button not found in Topic 1.1 view!");
    }
    
    fireClick(printWorkbookBtn);
    
    // Workbook creator modal should now be shown
    const printModalBtn = document.getElementById('btn-workbook-print');
    if (!printModalBtn) {
      throw new Error("Modal print button (#btn-workbook-print) not found!");
    }
    
    // Reset trackers
    printCalledCount = 0;
    printArea.innerHTML = '';
    
    fireClick(printModalBtn);
    
    if (printCalledCount === 0) {
      throw new Error("Clicking #btn-workbook-print did not call window.print()!");
    }
    if (!printArea.innerHTML.includes("GCSE History Lesson Resource -")) {
      throw new Error("Compiled workbook content was not written to #print-area!");
    }
    console.log("✓ TEST 2 PASSED: Lesson Workbook printed inline via print-area.");

    // --- TEST 3: Past Paper Print (inline, calls window.print) ---
    console.log("\n--- TEST 3: Past Exam Paper Print ---");
    // Switch to Exam Hub / Resource Hub
    const hubNavBtn = document.getElementById('nav-exam-hub');
    fireClick(hubNavBtn);
    
    // Switch to Papers tab panel
    const papersTabBtn = Array.from(document.querySelectorAll('.exam-tab-btn')).find(btn => btn.getAttribute('data-panel') === 'papers');
    fireClick(papersTabBtn);
    
    // Select a past paper to render the exam sheet
    const pastPaperSelect = document.getElementById('past-paper-select');
    pastPaperSelect.value = "2018_summer_usa";
    const changeEvent = new window.Event('change');
    pastPaperSelect.dispatchEvent(changeEvent);
    
    const startExamBtn = document.getElementById('btn-start-past-paper');
    fireClick(startExamBtn);
    
    const printExamBtn = document.getElementById('btn-print-exam-sheet');
    if (!printExamBtn) {
      throw new Error("Past Paper Print button (#btn-print-exam-sheet) not found!");
    }
    
    // Reset trackers
    printCalledCount = 0;
    printArea.innerHTML = '';
    
    fireClick(printExamBtn);
    
    if (printCalledCount === 0) {
      throw new Error("Clicking #btn-print-exam-sheet did not call window.print()!");
    }
    if (!printArea.innerHTML.includes("GCSE History Paper 3 Simulation")) {
      throw new Error("Compiled past paper content was not written to #print-area!");
    }
    console.log("✓ TEST 3 PASSED: Past Exam Paper printed inline via print-area.");

    // --- TEST 4: Bulk Worksheet Pack Print (renders in iframe and prints) ---
    console.log("\n--- TEST 4: Bulk Worksheet Pack Print (iframe-based) ---");
    // Switch to Educator Panel via navigation link
    const educatorNavBtn = document.getElementById('nav-worksheets');
    fireClick(educatorNavBtn);
    
    // Select the first worksheet gallery card (Course Workbook with style booklet)
    const galleryCard = Array.from(document.querySelectorAll('.worksheet-gallery-card')).find(card => card.getAttribute('data-style') === 'booklet');
    if (!galleryCard) {
      throw new Error("Worksheet gallery card with data-style='booklet' not found!");
    }
    
    // Click the card to open preview and render
    fireClick(galleryCard);
    
    const previewArea = document.getElementById('educator-hub-preview-area');
    if (previewArea.style.display === 'none') {
      throw new Error("Clicking gallery card did not reveal the preview area!");
    }
    
    const iframe = document.getElementById('worksheet-preview-iframe');
    if (!iframe) {
      throw new Error("Worksheet preview iframe (#worksheet-preview-iframe) not found!");
    }
    
    // Mock the iframe's contentWindow print function
    let iframePrintCalled = false;
    if (iframe.contentWindow) {
      iframe.contentWindow.print = () => {
        iframePrintCalled = true;
      };
    }
    
    // Get the print button in the preview toolbar
    const printPreviewBtn = document.getElementById('btn-preview-print');
    if (!printPreviewBtn) {
      throw new Error("Print button (#btn-preview-print) not found in preview toolbar!");
    }
    
    // Click the print button
    fireClick(printPreviewBtn);
    
    if (!iframePrintCalled) {
      throw new Error("Clicking #btn-preview-print did not call print() on the iframe contentWindow!");
    }
    
    // Check if the generated HTML content contains the expected text
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const iframeHtml = iframeDoc.documentElement.innerHTML;
    
    if (!iframeHtml.includes("GCSE History Lesson Resource -")) {
      throw new Error("Compiled bulk worksheets pack content was not written to the iframe!");
    }
    
    console.log("✓ TEST 4 PASSED: Bulk Worksheet Pack rendered in iframe and printed correctly.");

    console.log("\n=================================================");
    console.log("ALL TARGETED PRINT TESTS COMPLETED SUCCESSFULLY!");
    console.log("=================================================");
  } catch (err) {
    console.error("\n❌ TEST SUITE FAILURE DETECTED:");
    console.error(err);
    process.exit(1);
  }
})();
