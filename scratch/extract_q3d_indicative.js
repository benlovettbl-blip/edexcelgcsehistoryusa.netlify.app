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
  console.log(`YEAR: ${yr} Q3(d) INDICATIVE CONTENT`);
  console.log(`===================================`);
  
  // Find "Question 3 (d)"
  const matchesD = [...content.matchAll(/Question\s*3\s*\(d\)/gi)];
  if (matchesD.length > 0) {
    const startIdx = matchesD[0].index;
    const section = content.substring(startIdx, startIdx + 8000);
    // Find "indicative content" inside this section
    const icIdx = section.toLowerCase().indexOf('indicative content');
    if (icIdx !== -1) {
      const remainingSection = section.substring(icIdx);
      // Find "Relevant points may include"
      const rpIdx = remainingSection.toLowerCase().indexOf('relevant points may include');
      if (rpIdx !== -1) {
        console.log(remainingSection.substring(rpIdx, rpIdx + 3000));
      } else {
        console.log(remainingSection.substring(0, 3000));
      }
    } else {
      console.log(section.substring(2000, 5000));
    }
  }
}
