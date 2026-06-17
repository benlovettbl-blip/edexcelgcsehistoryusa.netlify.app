const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

const shortcutHtml = `
          <div class="shortcut-card" id="shortcut-individuals" onclick="if(window.switchView) window.switchView('individuals');" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='var(--border-active)';" onmouseout="this.style.transform='none'; this.style.borderColor='var(--border-glass)';">
            <div class="shortcut-icon" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">
              <i class="fa-solid fa-users"></i>
            </div>
            <h3>Key Individuals</h3>
          </div>`;

if (!indexHtml.includes('id="shortcut-individuals"')) {
    indexHtml = indexHtml.replace('<div class="shortcut-card" id="shortcut-bookmarks"', shortcutHtml + '\n          <div class="shortcut-card" id="shortcut-bookmarks"');
    fs.writeFileSync('index.html', indexHtml, 'utf8');
    console.log("Successfully injected shortcut for Key Individuals.");
} else {
    console.log("Already exists.");
}
