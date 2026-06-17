const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<div class="header-actions">[\s\S]*?<!-- Sound Toggle Button -->/i;

const replacement = `<div class="header-actions">
          <!-- Gamification Hub -->
          <div style="display: flex; gap: 8px; align-items: center;">
            <!-- Mastery SVG Badge -->
            <div id="mastery-header-badge" style="display: flex; align-items: center; gap: 8px; padding: 4px 10px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-glass); background: rgba(14, 165, 233, 0.08); cursor: pointer;" title="Mastery Progress">
              <!-- SVG Progress Circle -->
              <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="28" height="28" viewBox="0 0 80 80" style="transform: rotate(-90deg);">
                  <!-- Track Circle -->
                  <circle cx="40" cy="40" r="34" stroke="var(--border-glass)" stroke-width="8" fill="transparent" />
                  <!-- Progress Circle -->
                  <circle id="radial-progress-fill" cx="40" cy="40" r="34" stroke="var(--primary)" stroke-width="8" fill="transparent" stroke-dasharray="213.63" stroke-dashoffset="213.63" stroke-linecap="round" style="transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);" />
                </svg>
                <!-- Center Text -->
                <div id="radial-progress-percent" style="position: absolute; font-family: var(--font-heading); font-size: 0.6rem; font-weight: 800; color: var(--text-main);">0%</div>
              </div>
              <!-- Text Stats Breakdown -->
              <div style="display: flex; flex-direction: column; gap: 0px; text-align: left;">
                <span style="font-size: 0.5rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 0.5px; line-height: 1;">Mastery</span>
                <div style="font-size: 0.7rem; font-weight: 800; color: var(--text-main); line-height: 1.1; white-space: nowrap;" id="radial-fraction-text">0/240</div>
              </div>
            </div>

            <!-- Global Live XP Counter Badge -->
            <div id="live-xp-counter-badge" style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-glass); background: rgba(59, 130, 246, 0.08); color: var(--primary); font-family: var(--font-heading); font-size: 0.85rem; font-weight: 800; cursor: pointer; transition: all var(--transition-fast) ease;" title="Your Factual Mastery XP (Click to view Leaderboard)" onclick="switchView('leaderboard')">
              <i class="fa-solid fa-star" style="color: #facc15;"></i>
              <span id="header-xp-value">0</span>
              <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 500; margin-left: 2px;">XP</span>
            </div>
          </div>

          <!-- Sound Toggle Button -->`;

if (regex.test(html)) {
    html = html.replace(regex, replacement);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Successfully fixed header-actions block!");
} else {
    console.log("Regex did not match.");
}
