const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Find start of study shortcuts
const shortcutsStart = content.indexOf('<!-- Study Center Quick Navigation -->');
const shortcutsDivStart = content.indexOf('<div class="study-shortcuts-grid">', shortcutsStart);

// Find end of study shortcuts
const dashboardSectionsStart = content.indexOf('<div class="dashboard-sections">', shortcutsDivStart);

// Extract shortcuts
const shortcutsHtml = content.substring(shortcutsStart, dashboardSectionsStart);

// Find end of dashboard sections
const dashboardSectionsEnd = content.indexOf('</section>', dashboardSectionsStart);
const dashboardHtml = content.substring(dashboardSectionsStart, dashboardSectionsEnd);

// Rearrange
const before = content.substring(0, shortcutsStart);
const after = content.substring(dashboardSectionsEnd);

let newContent = before + dashboardHtml + '\n        ' + shortcutsHtml + after;
newContent = newContent.replace('Key Topics Progress</h2>', 'Topic Mastery Tracker</h2>');
newContent = newContent.replace('Key Topics Progress', 'Topic Mastery Tracker');

fs.writeFileSync('index.html', newContent, 'utf8');
console.log("Successfully swapped sections.");
