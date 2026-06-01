# Build script using esbuild
$workspaceDir = $PSScriptRoot
Write-Output "Bundling src/main.js to app.js using esbuild..."
npx esbuild "$workspaceDir\src\main.js" --bundle "--outfile=$workspaceDir\app.js"
Write-Output "Bundle complete!"
