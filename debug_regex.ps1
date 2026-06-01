$questionsFile = "C:\Users\fives\.gemini\antigravity\scratch\firefly_recall_quizzes\questions.js"
$content = Get-Content -Raw -Path $questionsFile
# Remove single-line comments
$content = $content -replace "(?m)^\s*//.*$", ""

Write-Output "Content length: $($content.Length)"

# Test QUIZ_DATA
if ($content -match "(?s)const QUIZ_DATA\s*=\s*(\[.*?\]);\s*const EXAM_SKILLS_DATA") {
    Write-Output "QUIZ_DATA MATCHED! Length: $($Matches[1].Length)"
} else {
    Write-Output "QUIZ_DATA FAILED TO MATCH"
}

# Test EXAM_SKILLS_DATA
if ($content -match "(?s)const EXAM_SKILLS_DATA\s*=\s*(\{.*?\});\s*const CONSEQUENCE_SKILLS_DATA") {
    Write-Output "EXAM_SKILLS_DATA MATCHED! Length: $($Matches[1].Length)"
} else {
    Write-Output "EXAM_SKILLS_DATA FAILED TO MATCH"
}

# Test CONSEQUENCE_SKILLS_DATA
if ($content -match "(?s)const CONSEQUENCE_SKILLS_DATA\s*=\s*(\{.*?\});\s*const NARRATIVE_SKILLS_DATA") {
    Write-Output "CONSEQUENCE_SKILLS_DATA MATCHED! Length: $($Matches[1].Length)"
} else {
    Write-Output "CONSEQUENCE_SKILLS_DATA FAILED TO MATCH"
}

# Test NARRATIVE_SKILLS_DATA
if ($content -match "(?s)const NARRATIVE_SKILLS_DATA\s*=\s*(\{.*?\});\s*$") {
    Write-Output "NARRATIVE_SKILLS_DATA MATCHED! Length: $($Matches[1].Length)"
} else {
    Write-Output "NARRATIVE_SKILLS_DATA FAILED TO MATCH"
}
