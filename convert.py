import codecs
try:
    with codecs.open('C:\\Users\\fives\\.gemini\\antigravity\\scratch\\firefly_recall_quizzes\\consequence_dump.txt', 'r', 'utf-16le') as f:
        text = f.read()
    with open('C:\\Users\\fives\\.gemini\\antigravity\\scratch\\firefly_recall_quizzes\\consequence_dump_utf8.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Python Conversion successful. Length of text:", len(text))
except Exception as e:
    print("Error:", e)
