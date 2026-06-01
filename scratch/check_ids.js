const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const idRegex = /id=["']([^"']+)["']/g;
const htmlIds = new Set();
let match;
while ((match = idRegex.exec(htmlContent)) !== null) {
  htmlIds.add(match[1]);
}
console.log(`Found ${htmlIds.size} unique IDs in index.html`);

const srcDir = path.join(__dirname, '..', 'src');
const jsFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.js'));

const missingIds = {};

jsFiles.forEach(file => {
  const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
  
  // getElementById
  const getElementRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
  while ((match = getElementRegex.exec(content)) !== null) {
    const id = match[1];
    if (!htmlIds.has(id)) {
      if (!missingIds[id]) missingIds[id] = [];
      missingIds[id].push(`${file} (getElementById)`);
    }
  }

  // querySelector('#...')
  const querySelectorRegex = /querySelector(?:All)?\(['"]#([^'"]+)['"]\)/g;
  while ((match = querySelectorRegex.exec(content)) !== null) {
    const id = match[1];
    // Remove class names/sub-selectors
    const baseId = id.split(/[ .[>+~:]/)[0];
    if (baseId && !htmlIds.has(baseId)) {
      if (!missingIds[baseId]) missingIds[baseId] = [];
      missingIds[baseId].push(`${file} (querySelector)`);
    }
  }
});

const missingCount = Object.keys(missingIds).length;
if (missingCount > 0) {
  console.log(`\n--- WARNING: ${missingCount} IDs are queried in JS but missing in index.html ---`);
  for (const [id, sources] of Object.entries(missingIds)) {
    console.log(`- '${id}' (referenced in: ${sources.join(', ')})`);
  }
} else {
  console.log('\nSuccess! All IDs queried in JS exist in index.html.');
}
