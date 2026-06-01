$transcriptPath = "C:\Users\fives\.gemini\antigravity\brain\1844f957-6c6e-45bc-a32f-52f6a520a16c\.system_generated\logs\transcript.jsonl"
$outputPath = "C:\Users\fives\.gemini\antigravity\scratch\firefly_recall_quizzes\search_results.txt"

$lines = Get-Content -Path $transcriptPath
$matches = @()
foreach ($line in $lines) {
    if ($line -like "*1.2b*" -or $line -like "*Law of Return*" -or $line -like "*Explain one consequence of*") {
        $matches += $line
    }
}

if ($matches.Count -gt 0) {
    $matches | Out-File -FilePath $outputPath -Encoding utf8
    Write-Output "Successfully found $($matches.Count) matches and saved to $outputPath"
} else {
    Write-Output "No matches found."
}
