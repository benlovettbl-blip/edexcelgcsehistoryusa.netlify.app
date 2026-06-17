const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove nav-bookmarks
html = html.replace(/<a class="nav-item" id="nav-bookmarks"[^>]*>[\s\S]*?<\/a>/, '');

// Remove shortcut-bookmarks
html = html.replace(/<div class="shortcut-card" id="shortcut-bookmarks"[\s\S]*?<\/div>\s*<\/div>/, '');

// Remove view-bookmarks
html = html.replace(/<!-- 6\. BOOKMARKS VIEW -->[\s\S]*?<\/section>/, '');

fs.writeFileSync('index.html', html, 'utf8');
console.log("Bookmarks removed from index.html");
