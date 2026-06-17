const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Extract .hero-stats-widget
const statsRegex = /<div class="hero-stats-widget"[\s\S]*?<!-- Gamification Profile Panel -->/i;
const statsMatch = statsRegex.exec(html);

if (statsMatch) {
    let statsHtml = statsMatch[0].replace('<!-- Gamification Profile Panel -->', '').trim();
    // modify it to fit top header styling better
    statsHtml = statsHtml.replace('height: 72px;', 'height: 38px; padding: 4px 10px; background: rgba(14, 165, 233, 0.08); min-width: auto; flex: unset; border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); cursor: pointer;');
    statsHtml = statsHtml.replace('width: 52px; height: 52px;', 'width: 28px; height: 28px;');
    statsHtml = statsHtml.replace('viewBox="0 0 80 80"', 'viewBox="0 0 80 80" width="28" height="28"');
    statsHtml = statsHtml.replace('font-size: 0.85rem;', 'font-size: 0.6rem;');
    
    // Simplify text stats breakdown
    statsHtml = statsHtml.replace(/<div style="display: flex; flex-direction: column;[\s\S]*?<\/div>/, `<div style="display: flex; flex-direction: column; gap: 0px; text-align: left;">
      <span style="font-size: 0.5rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 0.5px; line-height: 1;">Mastery</span>
      <div style="font-size: 0.7rem; font-weight: 800; color: var(--text-main); line-height: 1.1; white-space: nowrap;" id="radial-fraction-text">0/240</div>
    </div>`);

    // 2. Inject into header-actions
    html = html.replace('<!-- Global Live XP Counter Badge -->', '<!-- Mastery SVG Badge -->\n          ' + statsHtml + '\n\n          <!-- Global Live XP Counter Badge -->');
    
    // 3. Remove .dashboard-hero
    const heroRegex = /<!-- Dashboard Hero Section -->[\s\S]*?<!-- Quick Actions Panel -->/i;
    html = html.replace(heroRegex, '<!-- Quick Actions Panel -->');

    // 4. Inject Guide Shortcut
    const guideHtml = `
          <div class="shortcut-card" id="shortcut-guide" onclick="if(window.switchView) window.switchView('guide');" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='var(--border-active)';" onmouseout="this.style.transform='none'; this.style.borderColor='var(--border-glass)';">
            <div class="shortcut-icon" style="background: rgba(14, 165, 233, 0.1); color: #0ea5e9;">
              <i class="fa-solid fa-circle-info"></i>
            </div>
            <div class="shortcut-info">
              <h3>User & Parent Guide</h3>
              <p>Learn how to use the study platform</p>
            </div>
          </div>`;
          
    html = html.replace('<!-- Dynamic populated bookmarks will go here -->', '<!-- Dynamic populated bookmarks will go here -->\n' + guideHtml);

    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Patched index.html.");
} else {
    console.log("Could not find hero stats widget.");
}
