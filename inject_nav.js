const fs = require('fs');

let navJs = fs.readFileSync('src/navigation.js', 'utf8');

// Add to viewMap
if (!navJs.includes("'individuals': 'view-individuals'")) {
    navJs = navJs.replace("'map': 'view-map',", "'map': 'view-map',\n    'individuals': 'view-individuals',");
}

// Add to if/else blocks
if (!navJs.includes("viewName === 'individuals'")) {
    const block = `
  } else if (viewName === 'individuals') {
    const individualsNav = document.getElementById('nav-individuals');
    if (individualsNav) individualsNav.classList.add('active');
    if (headerModeSwitcher) headerModeSwitcher.style.display = 'none';
    const viewTitle = document.getElementById('current-view-title');
    if (viewTitle) viewTitle.textContent = "Key Individuals";
    state.selectedSubtopicId = null;
    if (window.renderKeyIndividualsView) window.renderKeyIndividualsView();`;

    navJs = navJs.replace("} else if (viewName === 'map') {", block.trim() + "\n  } else if (viewName === 'map') {");
}

fs.writeFileSync('src/navigation.js', navJs, 'utf8');
console.log("Injected navigation logic.");
