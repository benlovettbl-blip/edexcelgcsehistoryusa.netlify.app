const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function extractDocx(docxPath, txtOutPath) {
  try {
    const tempZip = path.join('scratch', 'temp_extract.zip');
    const tempDir = path.join('scratch', 'temp_extract_dir_' + path.basename(txtOutPath, '.txt'));
    
    // Clean up temp
    if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    
    // Copy to zip
    fs.copyFileSync(docxPath, tempZip);
    
    // Unzip via powershell
    execSync(`powershell -Command "Expand-Archive -Path '${tempZip}' -DestinationPath '${tempDir}' -Force"`);
    
    // Read document.xml
    const docXmlPath = path.join(tempDir, 'word', 'document.xml');
    if (!fs.existsSync(docXmlPath)) {
      console.log(`No word/document.xml in ${docxPath}`);
      return;
    }
    
    const xml = fs.readFileSync(docXmlPath, 'utf8');
    // Strip XML tags
    const cleanText = xml
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .trim();
      
    fs.writeFileSync(txtOutPath, cleanText, 'utf8');
    console.log(`Extracted ${cleanText.length} chars from ${docxPath} to ${txtOutPath}`);
    
    // Clean up
    if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {
    console.error(`Error extracting ${docxPath}:`, e.message);
  }
}

// Extract both files
extractDocx('USAresources/USA/USA 2.1-2.2 civil rights 60-75 revision guide.docx', 'scratch/revision_guide_text.txt');
extractDocx('USAresources/USA/USA Revision Cornell Notes.docx', 'scratch/cornell_notes_text.txt');
