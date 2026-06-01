$transcriptPath = "C:\Users\fives\.gemini\antigravity\brain\1844f957-6c6e-45bc-a32f-52f6a520a16c\.system_generated\logs\transcript.jsonl"
$outputPath = "C:\Users\fives\.gemini\antigravity\scratch\firefly_recall_quizzes\consequence_questions_only.txt"

$lines = Get-Content -Path $transcriptPath
$found = $false
foreach ($line in $lines) {
    if ($line -like "*Replace the old 9-item EXAM_SKILLS_DATA*") {
        $json = ConvertFrom-Json $line
        foreach ($tool_call in $json.tool_calls) {
            if ($tool_call.name -eq "replace_file_content") {
                $replacement = $tool_call.args.ReplacementContent
                $replacement | Out-File -FilePath $outputPath -Encoding utf8
                $found = $true
                Write-Output "Successfully extracted to $outputPath"
                break
            }
        }
    }
    if ($found) { break }
}
if (-not $found) {
    Write-Output "Pattern not found. Let's search for 1.1a."
    foreach ($line in $lines) {
        if ($line -like '*"1.1a":*') {
            $json = ConvertFrom-Json $line
            if ($json.tool_calls) {
                foreach ($tool_call in $json.tool_calls) {
                    if ($tool_call.args.ReplacementContent) {
                        $replacement = $tool_call.args.ReplacementContent
                        $replacement | Out-File -FilePath $outputPath -Encoding utf8
                        $found = $true
                        Write-Output "Found via 1.1a. Extracted to $outputPath"
                        break
                    }
                }
            }
        }
        if ($found) { break }
    }
}
