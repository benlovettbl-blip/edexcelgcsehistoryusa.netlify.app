# Paths
$workspaceDir = $PSScriptRoot
$indexFile = Join-Path $workspaceDir "index.html"
$cssFile = Join-Path $workspaceDir "style.css"
$questionsFile = Join-Path $workspaceDir "questions.js"
$appFile = Join-Path $workspaceDir "app.js"
$embedFile = Join-Path $workspaceDir "firefly_embed.html"

# Run app.js assembly from modular src/ directory
& (Join-Path $workspaceDir "build.ps1")

# Verify all source files exist
if (-not (Test-Path $indexFile) -or -not (Test-Path $cssFile) -or -not (Test-Path $questionsFile) -or -not (Test-Path $appFile)) {
    Write-Error "One or more source files (index.html, style.css, questions.js, app.js) are missing!"
    exit 1
}


Write-Output "Loading files..."
$indexContent = [System.IO.File]::ReadAllText($indexFile, [System.Text.Encoding]::UTF8)
$cssContent = [System.IO.File]::ReadAllText($cssFile, [System.Text.Encoding]::UTF8)
$questionsContent = [System.IO.File]::ReadAllText($questionsFile, [System.Text.Encoding]::UTF8)
$appContent = [System.IO.File]::ReadAllText($appFile, [System.Text.Encoding]::UTF8)

Write-Output "Performing replacements..."
# Replace style.css reference
$stylePattern = '(?i)<link\s+[^>]*href=["'']style\.css["''][^>]*>'
$indexContent = $indexContent -replace $stylePattern, "<style>`r`n$cssContent`r`n</style>"

# Replace questions.js reference
$questionsPattern = '(?i)<script\s+[^>]*src=["'']questions\.js["''][^>]*>\s*<\/script>'
$indexContent = $indexContent -replace $questionsPattern, "<script>`r`n$questionsContent`r`n</script>"

# Replace app.js reference
$appPattern = '(?i)<script\s+[^>]*src=["'']app\.js["''][^>]*>\s*<\/script>'
$indexContent = $indexContent -replace $appPattern, "<script>`r`n$appContent`r`n</script>"

# Write output file
[System.IO.File]::WriteAllText($embedFile, $indexContent, [System.Text.Encoding]::UTF8)
Write-Output "Generated firefly_embed.html successfully"
