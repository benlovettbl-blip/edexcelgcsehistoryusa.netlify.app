const fs = require('fs');
const path = require('path');

const years = ['2022', '2023', '2024', '2025'];
for (const yr of years) {
  const file = `scratch/${yr}_rms.txt`;
  if (!fs.existsSync(file)) {
    console.log(`Missing ${file}`);
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\n===================================`);
  console.log(`YEAR: ${yr} Q3(a) & Q3(d) CONTENT`);
  console.log(`===================================`);
  
  // Find "Question 3 (a)" or "Question 3"
  const matchesA = [...content.matchAll(/Question\s*3\s*\(a\)/gi)];
  if (matchesA.length > 0) {
    const startIdx = matchesA[0].index;
    const section = content.substring(startIdx, startIdx + 5000);
    const icIdx = section.toLowerCase().indexOf('relevant points may include');
    if (icIdx !== -1) {
      console.log("--- Q3(a) INDICATIVE CONTENT ---");
      console.log(section.substring(icIdx, icIdx + 1500));
    } else {
      console.log("--- Q3(a) START ---");
      console.log(section.substring(0, 1500));
    }
  }

  // Find "Question 3 (d)"
  const matchesD = [...content.matchAll(/Question\s*3\s*\(d\)/gi)];
  if (matchesD.length > 0) {
    const startIdx = matchesD[0].index;
    const section = content.substring(startIdx, startIdx + 6000);
    const icIdx = section.toLowerCase().indexOf('relevant points may include');
    if (icIdx !== -1) {
      console.log("--- Q3(d) INDICATIVE CONTENT ---");
      console.log(section.substring(icIdx, icIdx + 2000));
    } else {
      console.log("--- Q3(d) START ---");
      console.log(section.substring(0, 2000));
    }
  }
}
