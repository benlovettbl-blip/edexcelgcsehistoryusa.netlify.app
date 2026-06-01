# check_ids.ps1
# This script extracts all IDs defined in index.html and matches them against references in JS files.

$htmlFile = "C:\Users\fives\.gemini\antigravity\scratch\firefly_recall_quizzes\index.html"
$jsDir = "C:\Users\fives\.gemini\antigravity\scratch\firefly_recall_quizzes\src"

# Extract IDs from HTML using regex
$htmlContent = Get-Content $htmlFile -Raw
$htmlIds = [regex]::Matches($htmlContent, 'id=["'']([^"'']+)["'']') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

Write-Host "Found $($htmlIds.Count) unique IDs defined in index.html"

# Extract DOM queries from JS files
# Match patterns like:
# document.getElementById('id')
# document.getElementById("id")
# $('#id')
# querySelector('#id')
# querySelectorAll('#id')
$jsFiles = Get-ChildItem -Path $jsDir -Filter *.js -Recurse

$jsIds = @()
foreach ($file in $jsFiles) {
    $jsContent = Get-Content $file.FullName -Raw
    
    # Matches document.getElementById('...')
    $matchesGetId = [regex]::Matches($jsContent, 'getElementById\([''"]([^''"]+)[''"]\)')
    foreach ($m in $matchesGetId) {
        $jsIds += [PSCustomObject]@{ Id = $m.Groups[1].Value; Source = "$($file.Name) (getElementById)" }
    }
    
    # Matches querySelector('#...')
    $matchesQuery = [regex]::Matches($jsContent, 'querySelector(?:All)?\([''"]#([^''" .>#+~]+)[''"]\)')
    foreach ($m in $matchesQuery) {
        $jsIds += [PSCustomObject]@{ Id = $m.Groups[1].Value; Source = "$($file.Name) (querySelector)" }
    }
}

# Unique JS IDs
$uniqueJsIds = $jsIds | Select-Object -Property Id -Unique | Sort-Object -Property Id

Write-Host "Found $($uniqueJsIds.Count) unique DOM ID queries in JS files"

# 1. Check for JS IDs missing from HTML (Critical bugs)
Write-Host "`n--- CRITICAL: IDs requested in JS but missing in HTML ---"
$missingCount = 0
foreach ($jsIdObj in $uniqueJsIds) {
    $id = $jsIdObj.Id
    if ($id -notin $htmlIds) {
        # Find sources for this ID
        $sources = ($jsIds | Where-Object { $_.Id -eq $id } | ForEach-Object { $_.Source }) -join ", "
        Write-Host "WARNING: ID '$id' is queried in JS ($sources) but does NOT exist in index.html!"
        $missingCount++
    }
}
if ($missingCount -eq 0) {
    Write-Host "None! All IDs queried in JS exist in index.html."
}

# 2. Check for IDs in HTML that are not queried in JS (Potential dead links / static tags)
Write-Host "`n--- INFO: IDs in HTML but not queried in JS ---"
$unreferencedCount = 0
foreach ($id in $htmlIds) {
    # Skip programmatically created navigation items or structural view containers
    if ($id -like "nav-subtopic-*" -or $id -like "nav-pct-*" -or $id -like "accordion-*" -or $id -like "results-*" -or $id -like "past-*" -or $id -like "feedback-*" -or $id -like "pw-*") {
        continue
    }
    if ($id -notin ($uniqueJsIds | ForEach-Object { $_.Id })) {
        Write-Host "INFO: ID '$id' is defined in HTML but not explicitly queried in JS."
        $unreferencedCount++
    }
}
Write-Host "Found $unreferencedCount static/unreferenced IDs in HTML."
