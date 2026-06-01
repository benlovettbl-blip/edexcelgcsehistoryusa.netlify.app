const { execSync } = require('child_process');

try {
  console.log("Listing Zip contents via powershell...");
  const cmd = `powershell -Command "[System.Reflection.Assembly]::LoadWithPartialName('System.IO.Compression.FileSystem'); $zip = [System.IO.Compression.ZipFile]::OpenRead('USA-20260530T095143Z-3-001.zip'); $zip.Entries | Select-Object -Property FullName | ConvertTo-Json"`;
  const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const startIdx = result.indexOf('[');
  const jsonStr = startIdx !== -1 ? result.substring(startIdx) : result;
  const entries = JSON.parse(jsonStr);
  console.log(`Zip contains ${entries.length} files.`);
  
  // Group by extension
  const exts = {};
  entries.forEach(e => {
    const ext = e.FullName.split('.').pop().toLowerCase();
    exts[ext] = (exts[ext] || 0) + 1;
  });
  console.log("Extensions:", exts);
  
  // Search for past paper text or docx files
  const interesting = entries.filter(e => {
    const fn = e.FullName.toLowerCase();
    return fn.includes('exam') || fn.includes('paper') || fn.includes('report') || fn.includes('scheme') || fn.includes('mark') || fn.includes('question') || fn.endsWith('.docx') || fn.endsWith('.pdf');
  });
  console.log("Interesting files in Zip:");
  interesting.slice(0, 40).forEach(e => console.log('-', e.FullName));
} catch (e) {
  console.error("Error listing zip:", e.message);
}
