const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

const shortcutHtml = `
          <div class="shortcut-card" id="shortcut-trading" onclick="if(window.switchView) window.switchView('trading');" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='var(--border-active)';" onmouseout="this.style.transform='none'; this.style.borderColor='var(--border-glass)';">
            <div class="shortcut-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
              <i class="fa-solid fa-layer-group"></i>
            </div>
            <h3>Trading Cards</h3>
          </div>`;

if (!indexHtml.includes('id="shortcut-trading"')) {
    indexHtml = indexHtml.replace('<div class="shortcut-card" id="shortcut-bookmarks"', shortcutHtml + '\n          <div class="shortcut-card" id="shortcut-bookmarks"');
    fs.writeFileSync('index.html', indexHtml, 'utf8');
    console.log("Injected shortcut for Trading Cards.");
} else {
    console.log("Already exists.");
}
