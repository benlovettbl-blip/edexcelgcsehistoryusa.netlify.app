const fs = require('fs');

let navJs = fs.readFileSync('src/navigation.js', 'utf8');

// Add to viewMap
if (!navJs.includes("'trading': 'view-trading'")) {
    navJs = navJs.replace("'map': 'view-map',", "'map': 'view-map',\n    'trading': 'view-trading',");
}

// Add to if/else blocks
if (!navJs.includes("viewName === 'trading'")) {
    const block = `
  } else if (viewName === 'trading') {
    const viewTitle = document.getElementById('current-view-title');
    if (viewTitle) viewTitle.textContent = "Trading Cards";
    state.selectedSubtopicId = null;
    if (window.renderTradingCardsView) window.renderTradingCardsView();`;

    navJs = navJs.replace("} else if (viewName === 'map') {", block.trim() + "\n  } else if (viewName === 'map') {");
}

fs.writeFileSync('src/navigation.js', navJs, 'utf8');
console.log("Injected trading cards into navigation.");
