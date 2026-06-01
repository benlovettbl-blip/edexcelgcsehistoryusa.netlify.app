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
  console.log(`YEAR: ${yr} Q2 CONTENT GUIDANCE`);
  console.log(`===================================`);
  
  // Find where Question 2 starts
  const matches = [...content.matchAll(/Question\s*2\s*\(a\)|Question\s*2/gi)];
  if (matches.length > 0) {
    const startIdx = matches[0].index;
    const section = content.substring(startIdx, startIdx + 8000);
    // Find where "Indicative content" or similar phrase starts
    const icIdx = section.toLowerCase().indexOf('indicative content');
    if (icIdx !== -1) {
      console.log(section.substring(icIdx, icIdx + 2000));
    } else {
      // Print from Level 4 end onwards
      const l4Idx = section.toLowerCase().indexOf('no access to level 4');
      if (l4Idx !== -1) {
        console.log(section.substring(l4Idx, l4Idx + 2000));
      } else {
        console.log(section.substring(1500, 3500));
      }
    }
  } else {
    console.log("Could not find Question 2 start");
  }
}
