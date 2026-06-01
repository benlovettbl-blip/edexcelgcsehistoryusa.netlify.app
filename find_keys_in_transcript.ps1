$transcriptPath = "C:\Users\fives\.gemini\antigravity\brain\1844f957-6c6e-45bc-a32f-52f6a520a16c\.system_generated\logs\transcript.jsonl"
$outputPath = "C:\Users\fives\.gemini\antigravity\scratch\firefly_recall_quizzes\keys_in_transcript.txt"

$keys = @(
    "1.1a", "1.1b", "1.2a", "1.2b", "1.3a", "1.3b",
    "2.1a", "2.1b", "2.2a", "2.2b", "2.3a", "2.3b",
    "3.1a", "3.1b", "3.2a", "3.2b", "3.3a", "3.3b"
)

$out = @()
$lines = Get-Content -Path $transcriptPath

foreach ($key in $keys) {
    $out += "=== KEY: $key ==="
    $matches = $lines | Select-String -Pattern "$key" -Context 0, 15
    if ($matches) {
        $out += "Found $($matches.Count) matches."
        # Just write the first 3 matches
        $count = [Math]::Min($matches.Count, 3)
        for ($i = 0; $i -lt $count; $i++) {
            $m = $matches[$i]
            $out += "Match at line $($m.LineNumber):"
            $out += $m.Line
            foreach ($ctx in $m.Context.PostContext) {
                $out += $ctx
            }
            $out += "------------------"
        }
    } else {
        $out += "NO MATCH FOR $key"
    }
    $out += ""
}

$out | Out-File -FilePath $outputPath -Encoding utf8
Write-Output "Done searching transcript. Saved to $outputPath"
