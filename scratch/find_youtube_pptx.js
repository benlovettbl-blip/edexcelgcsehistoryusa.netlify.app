const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function searchPptxForYoutube(pptxPath) {
  try {
    const tempZip = path.join('scratch', 'temp_pptx.zip');
    const tempDir = path.join('scratch', 'temp_pptx_dir');
    
    if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    
    fs.copyFileSync(pptxPath, tempZip);
    execSync(`powershell -Command "Expand-Archive -Path '${tempZip}' -DestinationPath '${tempDir}' -Force"`);
    
    // Scan all xml files recursively under tempDir
    function scanDir(dir) {
      const list = fs.readdirSync(dir);
      list.forEach(file => {
        const fp = path.join(dir, file);
        const stat = fs.statSync(fp);
        if (stat.isDirectory()) {
          scanDir(fp);
        } else if (file.endsWith('.xml') || file.endsWith('.xml.rels')) {
          const content = fs.readFileSync(fp, 'utf8');
          if (content.includes('youtube.com') || content.includes('youtu.be') || content.includes('youtube')) {
            console.log(`Found YouTube link in ${pptxPath} -> ${path.relative(tempDir, fp)}`);
            // Extract the matching URL
            const urlRegex = /(https?:\/\/[^\s"'<>]+youtube[^\s"'<>]+|https?:\/\/youtu\.be\/[^\s"'<>]+)/gi;
            let match;
            while ((match = urlRegex.exec(content)) !== null) {
              console.log('  URL:', match[0]);
            }
          }
        }
      });
    }
    
    scanDir(tempDir);
    
    if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {
    console.error(`Error searching ${pptxPath}:`, e.message);
  }
}

// Search all PPTX files
const pptxFiles = [
  'USAresources/USA/USA KT1.1 The position of Black Americans in the early 1950s/Architecture_of_Resistance.pptx',
  'USAresources/USA/USA KT1.2 Developments in education/Integrating_American_Schools.pptx',
  'USAresources/USA/USA KT1.4 Opposition to the civil rights movement/The_Architecture_of_Supremacy.pptx',
  'USAresources/USA/USA KT3.1 Reasons for US involvement in the conflict in Vietnam, 1954–63/The_Vietnam_Escalation_Trap.pptx',
  'USAresources/USA/USA_1954–75.pptx'
];

pptxFiles.forEach(f => {
  if (fs.existsSync(f)) {
    searchPptxForYoutube(f);
  } else {
    console.log(`File not found: ${f}`);
  }
});
