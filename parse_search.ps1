$resultsPath = "C:\Users\fives\.\.gemini\antigravity\scratch\firefly_recall_quizzes\search_results.txt"
$outputPath = "C:\Users\fives\.\.gemini\antigravity\scratch\firefly_recall_quizzes\parsed_consequences.txt"

$content = Get-Content -Raw -Path $resultsPath
# Split by lines
$lines = $content -split "`r`n"
foreach ($line in $lines) {
    if ($line -like '*"step_index":662,*') {
        # Parse the JSON line
        $json = ConvertFrom-Json $line
        # Write the content to the output file
        $json.content | Out-File -FilePath $outputPath -Encoding utf8
        Write-Output "Successfully parsed step 662 content and saved to $outputPath"
        break
    }
}
