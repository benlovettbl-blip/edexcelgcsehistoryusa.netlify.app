const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldHtml = `<div style="display: flex; flex-direction: column; gap: 0px; text-align: left;">
      <span style="font-size: 0.5rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 0.5px; line-height: 1;">Mastery</span>
      <div style="font-size: 0.7rem; font-weight: 800; color: var(--text-main); line-height: 1.1; white-space: nowrap;" id="radial-fraction-text">0/240</div>
    </div>
                
                <!-- Color Pills -->
                <div style="display: flex; gap: 4px; margin-top: 2px;">
                  <span class="badge badge-standard" id="radial-badge-mastered" style="font-size: 0.55rem; padding: 0px 4px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.2); color: #eab308; line-height: 1.2;">0 Mastered</span>
                  <span class="badge badge-standard" id="radial-badge-bookmarks" style="font-size: 0.55rem; padding: 0px 4px; background: rgba(250, 204, 21, 0.1); border: 1px solid rgba(250, 204, 21, 0.2); color: #facc15; line-height: 1.2;">0 Saved</span>
                </div>
              </div>`;

const newHtml = `<div style="display: flex; flex-direction: column; gap: 0px; text-align: left;">
      <span style="font-size: 0.5rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 0.5px; line-height: 1;">Mastery</span>
      <div style="font-size: 0.7rem; font-weight: 800; color: var(--text-main); line-height: 1.1; white-space: nowrap;" id="radial-fraction-text">0/240</div>
      
      <!-- Color Pills -->
      <div style="display: flex; gap: 4px; margin-top: 2px;">
        <span class="badge badge-standard" id="radial-badge-mastered" style="font-size: 0.55rem; padding: 0px 4px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.2); color: #eab308; line-height: 1.2;">0 Mastered</span>
        <span class="badge badge-standard" id="radial-badge-bookmarks" style="font-size: 0.55rem; padding: 0px 4px; background: rgba(250, 204, 21, 0.1); border: 1px solid rgba(250, 204, 21, 0.2); color: #facc15; line-height: 1.2;">0 Saved</span>
      </div>
    </div>`;

if (html.includes(oldHtml)) {
    html = html.replace(oldHtml, newHtml);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Fixed HTML nesting error.");
} else {
    console.log("Not found exactly like that.");
}
