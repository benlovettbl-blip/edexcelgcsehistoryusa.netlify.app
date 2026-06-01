$dumpPath = "C:\Users\fives\.gemini\antigravity\scratch\firefly_recall_quizzes\consequence_dump_utf8.txt"
$outputPath = "C:\Users\fives\.gemini\antigravity\scratch\firefly_recall_quizzes\keys_found.txt"

$keys = @(
    "1.1a", "1.1b", "1.2a", "1.2b", "1.3a", "1.3b",
    "2.1a", "2.1b", "2.2a", "2.2b", "2.3a", "2.3b",
    "3.1a", "3.1b", "3.2a", "3.2b", "3.3a", "3.3b"
)

$out = @()
$lines = Get-Content -Path $dumpPath

foreach ($key in $keys) {
    $out += "=== KEY: $key ==="
    # Match the key directly
    $matches = $lines | Select-String -Pattern "$key" -Context 0, 12
    if ($matches) {
        foreach ($m in $matches) {
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
Write-Output "Done searching. Saved to $outputPath"
