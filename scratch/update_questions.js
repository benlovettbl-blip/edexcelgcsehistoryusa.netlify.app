const fs = require('fs');

const content = fs.readFileSync('questions.js', 'utf8');

const replacements3C = {
  "q3_1": [
    ['\\"monumental and highly effective breakthroughs\\"', '[1[monumental and highly effective breakthroughs]1]'],
    ['\\"the reality for Black Americans remained bleak and unchanged\\"', '[1[the reality for Black Americans remained bleak and unchanged]1]']
  ],
  "q3_2": [
    ['\\"remarkable success\\"', '[1[remarkable success]1]'],
    ['\\"failed to achieve true equality\\"', '[1[failed to achieve true equality]1]']
  ],
  "p_2019_q3": [
    ['\\"the most important law passed by Congress\\"', '[1[the most important law passed by Congress]1]'],
    ['\\"the greatest achievement of the Civil Rights Movement\\"', '[1[the greatest achievement of the Civil Rights Movement]1]']
  ],
  "p_2020_q3": [
    ['\\"bombing was failing to defeat the enemy\\"', '[1[bombing was failing to defeat the enemy]1]'],
    ['\\"low morale was shown by the fact that American troops used drugs\\"', '[1[low morale was shown by the fact that American troops used drugs]1]']
  ],
  "p_2022_q3": [
    ['\\"confrontation and armed self-defence\\"', '[1[confrontation and armed self-defence]1]'],
    ['\\"community support programmes\\"', '[1[community support programmes]1]']
  ],
  "p_2023_q3": [
    ['\\"achieved a number of things\\"', '[1[achieved a number of things]1]'],
    ['\\"bitter experience\\"', '[1[bitter experience]1]']
  ],
  "p_2024_q3": [
    ['\\"commitment to non-violent direct action\\"', '[1[commitment to non-violent direct action]1]'],
    ['\\"lives of many remained unchanged\\"', '[1[lives of many remained unchanged]1]']
  ],
  "p_2025_q3": [
    ['\\"key turning point\\"', '[1[key turning point]1]'],
    ['\\"most responsible for escalating\\"', '[1[most responsible for escalating]1]']
  ],
  "mock_exam_1": [
    ['\\"disastrous miscalculation\\"', '[1[disastrous miscalculation]1]'],
    ['\\"crucial foundational success\\"', '[1[crucial foundational success]1]']
  ],
  "mock_exam_2": [
    ['\\"fatal, decisive blow\\"', '[1[fatal, decisive blow]1]'],
    ['\\"hardened the resolve of conservative America\\"', '[1[hardened the resolve of conservative America]1]']
  ],
  "mock_exam_3": [
    ['\\"watershed moment\\"', '[1[watershed moment]1]'],
    ['\\"actual impact has been exaggerated\\"', '[1[actual impact has been exaggerated]1]']
  ],
  "mock_exam_4": [
    ['\\"huge victory for the civil rights movement\\"', '[1[huge victory for the civil rights movement]1]'],
    ['\\"severe limitations of federal intervention\\"', '[1[severe limitations of federal intervention]1]']
  ],
  "mock_exam_5": [
    ['\\"self-defeating\\"', '[1[self-defeating]1]'],
    ['\\"militarily necessary\\"', '[1[militarily necessary]1]']
  ],
  "mock_exam_6": [
    ['\\"highly successful policy\\"', '[1[highly successful policy]1]'],
    ['\\"political cover for American withdrawal\\"', '[1[political cover for American withdrawal]1]']
  ],
  "mock_exam_7": [
    ['\\"superior motivation and guerrilla tactics\\"', '[1[superior motivation and guerrilla tactics]1]'],
    ['\\"collapse of support for the war back home\\"', '[1[collapse of support for the war back home]1]']
  ]
};

console.log("=== DRY RUN VERIFICATION ===");
let allOk = true;

for (const key of Object.keys(replacements3C)) {
  let regex;
  if (key.startsWith('mock_')) {
    regex = new RegExp('(EXAM_SKILLS_DATA\\.q3\\["' + key + '"\\]\\s*=\\s*\\{[\\s\\S]*?modelc:\\s*")((?:[^"\\\\]|\\\\.)*)"');
  } else {
    regex = new RegExp('("' + key + '"\\s*:\\s*\\{[\\s\\S]*?modelc:\\s*")((?:[^"\\\\]|\\\\.)*)"');
  }
  
  const match = content.match(regex);
  if (!match) {
    console.error(`ERROR: Could not match block for key: ${key}`);
    allOk = false;
    continue;
  }
  
  const modelcText = match[2];
  console.log(`Key: ${key}`);
  console.log(`Matched modelc: ${modelcText.substring(0, 60)}...`);
  
  // Verify targets are found
  for (const [target] of replacements3C[key]) {
    if (!modelcText.includes(target)) {
      console.error(`  ERROR: Target [${target}] NOT found in modelc!`);
      allOk = false;
    } else {
      console.log(`  OK: Found target [${target}]`);
    }
  }
}

if (allOk) {
  console.log("\nAll dry run checks PASSED. Proceeding to update...");
  
  let updatedContent = content;
  
  // 1. Update modeld
  const initialModeldCount = (updatedContent.match(/\[2\[/g) || []).length;
  updatedContent = updatedContent.replace(/\[2\[/g, '[1[').replace(/\]2\]/g, ']1]');
  console.log(`Updated modeld: replaced ${initialModeldCount} instances of [2[ and ]2].`);
  
  // 2. Update modelc
  for (const key of Object.keys(replacements3C)) {
    const repls = replacements3C[key];
    let regex;
    if (key.startsWith('mock_')) {
      regex = new RegExp('(EXAM_SKILLS_DATA\\.q3\\["' + key + '"\\]\\s*=\\s*\\{[\\s\\S]*?modelc:\\s*")((?:[^"\\\\]|\\\\.)*)(")');
    } else {
      regex = new RegExp('("' + key + '"\\s*:\\s*\\{[\\s\\S]*?modelc:\\s*")((?:[^"\\\\]|\\\\.)*)(")');
    }
    
    const match = updatedContent.match(regex);
    let modelcText = match[2];
    for (const [target, replacement] of repls) {
      modelcText = modelcText.split(target).join(replacement);
    }
    
    // Replace in content
    updatedContent = updatedContent.replace(regex, (m, p1, p2, p3) => {
      return p1 + modelcText + p3;
    });
  }
  
  fs.writeFileSync('questions.js', updatedContent, 'utf8');
  console.log("Successfully wrote changes to questions.js");
} else {
  console.error("\nDry run failed. Aborting write operation.");
}
