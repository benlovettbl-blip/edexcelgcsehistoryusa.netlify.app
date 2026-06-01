const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log("Locating questions.js in zip...");
  
  // Create a temporary script for PowerShell to extract questions.js specifically
  const psScript = `
    $zipPath = 'USA-20260530T095143Z-3-001.zip'
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
    $entry = $zip.Entries | Where-Object { $_.FullName -like '*questions.js' } | Select-Object -First 1
    if ($entry) {
        $destPath = Join-Path (Get-Location) 'scratch/questions_original.js'
        if (Test-Path $destPath) { Remove-Item $destPath }
        [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $destPath, $true)
        Write-Output "Extracted to $destPath"
    } else {
        Write-Error "questions.js not found in zip"
    }
    $zip.Dispose()
  `;
  
  fs.writeFileSync('scratch/extract_temp.ps1', psScript, 'utf8');
  const result = execSync('powershell -ExecutionPolicy Bypass -File scratch/extract_temp.ps1', { encoding: 'utf8' });
  console.log(result);
  fs.unlinkSync('scratch/extract_temp.ps1');
} catch (e) {
  console.error("Error extracting:", e.message);
}
