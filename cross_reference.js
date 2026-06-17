const fs = require('fs');

const specFile = fs.readFileSync('./src/spec_checklist_data.js', 'utf8');
const lessonsFile = fs.readFileSync('./src/lessons_data.js', 'utf8');

// Parse subtopics from spec file
const specMatches = [...specFile.matchAll(/"subtopic_(\d_\d)":\s*\[(.*?)\]/gs)];
const specData = {};

for (const match of specMatches) {
  const subtopic = match[1];
  const pointsContent = match[2];
  const pointMatches = [...pointsContent.matchAll(/"point":\s*"(.*?)"/g)];
  specData[subtopic] = pointMatches.map(m => m[1]);
}

// Parse subtopics from lessons file
const lessonsMatches = [...lessonsFile.matchAll(/"subtopic_(\d_\d)":\s*\{(.*?)(?="subtopic_\d_\d":|\}$)/gs)];
const lessonsData = {};

for (const match of lessonsMatches) {
  const subtopic = match[1];
  const content = match[2];
  
  // Extract step titles
  const stepTitleMatches = [...content.matchAll(/"title":\s*"(Step \d+:[^"]+)"/g)];
  // Also extract bodyHtml to see if we can get a quick summary
  const bodyHtmlMatches = [...content.matchAll(/"bodyHtml":\s*"(.*?)"/g)];
  
  const steps = stepTitleMatches.map((m, i) => {
      let bodyText = "";
      if (bodyHtmlMatches[i]) {
          bodyText = bodyHtmlMatches[i][1].replace(/<[^>]+>/g, '').replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 150) + "...";
      }
      return { title: m[1], preview: bodyText };
  });
  
  lessonsData[subtopic] = steps;
}

let mdOutput = `# Narrative vs Specification Cross-Reference Analysis\n\n`;
mdOutput += `Here is a breakdown of the specification points for each subtopic alongside the narrative steps provided in the lessons.\n\n`;

for (let i = 1; i <= 4; i++) {
  for (let j = 1; j <= 4; j++) {
    const subtopic = `${i}_${j}`;
    if (!specData[subtopic] && !lessonsData[subtopic]) continue;

    mdOutput += `## Topic ${i}.${j}\n\n`;
    
    mdOutput += `**Specification Bullet Points:**\n`;
    const specs = specData[subtopic] || [];
    if (specs.length === 0) {
       mdOutput += `- *None found*\n`;
    } else {
       specs.forEach(s => mdOutput += `- ${s}\n`);
    }
    
    mdOutput += `\n**Narrative Content (Steps):**\n`;
    const steps = lessonsData[subtopic] || [];
    if (steps.length === 0) {
       mdOutput += `- *No narrative steps found*\n`;
    } else {
       steps.forEach(s => {
           mdOutput += `- **${s.title}**\n  > ${s.preview}\n`;
       });
    }
    mdOutput += `\n---\n\n`;
  }
}

fs.writeFileSync('../../brain/07e535bd-2074-42b3-8d27-247b657ff98e/analysis_results.md', mdOutput);
console.log('Artifact generated.');
