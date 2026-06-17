const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// The markers:
// "        <!-- Study Center Quick Navigation -->\n        <div class=\"study-shortcuts-grid\">"
// "        </div>\n\n\n        <div class=\"dashboard-sections\">"
// "        </div>\n      </section>"

const shortcutsRegex = /( {8}<!-- Study Center Quick Navigation -->[\s\S]*?<div class="study-shortcuts-grid">[\s\S]*?<\/div>\n)( {8}<div class="dashboard-sections">[\s\S]*?<\/div>\n)/;
const match = content.match(shortcutsRegex);
if(match) {
    console.log("Matched!");
    const shortcuts = match[1];
    const dashboardSections = match[2];
    content = content.replace(shortcutsRegex, dashboardSections + "\n" + shortcuts);
    
    // Also change the title:
    content = content.replace('Key Topics Progress</h2>', 'Topic Mastery Tracker</h2>');
    
    fs.writeFileSync('index.html', content, 'utf8');
    console.log("Successfully swapped and renamed.");
} else {
    // If it doesn't match perfectly, let's try a split and join.
    const parts = content.split('        <!-- Study Center Quick Navigation -->\n');
    if(parts.length === 2) {
        const afterShortcutsStart = parts[1];
        const sectionsParts = afterShortcutsStart.split('        <div class="dashboard-sections">\n');
        if(sectionsParts.length === 2) {
            const shortcutsDiv = sectionsParts[0];
            const dashboardDivFull = sectionsParts[1].split('      </section>\n');
            const dashboardDiv = '        <div class="dashboard-sections">\n' + dashboardDivFull[0];
            const rest = '      </section>\n' + dashboardDivFull.slice(1).join('      </section>\n');
            
            let newContent = parts[0] + dashboardDiv + '\n        <!-- Study Center Quick Navigation -->\n' + shortcutsDiv + rest;
            
            // Rename title
            newContent = newContent.replace('Key Topics Progress</h2>', 'Topic Mastery Tracker</h2>');
            
            fs.writeFileSync('index.html', newContent, 'utf8');
            console.log("Successfully swapped using fallback method.");
        } else {
            console.log("Could not find dashboard-sections.");
        }
    } else {
        console.log("Could not find Study Center Quick Navigation marker.");
    }
}
