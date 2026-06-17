import sys

with open("src/views.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove printBtn
content = content.replace("""    const printBtn = document.getElementById('print-top-trumps-btn-html');
    if (printBtn && !printBtn.dataset.bound) {
      printBtn.addEventListener('click', () => window.print());
      printBtn.dataset.bound = 'true';
    }""", "")

# 2. Update logic for unlocking and iterate with index
# Original: TRADING_CARDS_DATA.forEach(card => {
#           const isUnlocked = forceUnlock || (window.state && window.state.userStats && window.state.userStats.progress && window.state.userStats.progress[card.subtopicId] && window.state.userStats.progress[card.subtopicId].masteryScore >= 100);

new_logic = """    const totalXP = (window.state && window.state.userStats && window.state.userStats.totalXP) || 0;

    TRADING_CARDS_DATA.forEach((card, index) => {
      const requiredXP = (index + 1) * 200;
      const isUnlocked = forceUnlock || totalXP >= requiredXP;"""

old_logic = """    TRADING_CARDS_DATA.forEach(card => {
      const isUnlocked = forceUnlock || (window.state && window.state.userStats && window.state.userStats.progress && window.state.userStats.progress[card.subtopicId] && window.state.userStats.progress[card.subtopicId].masteryScore >= 100);"""

content = content.replace(old_logic, new_logic)

# 3. Update locked text
old_locked_text = """<p style="font-size: 0.85rem;">Master Topic ${card.subtopicId || '...'} to unlock</p>"""
new_locked_text = """<p style="font-size: 0.85rem;">Reach ${requiredXP} XP to unlock</p>"""

content = content.replace(old_locked_text, new_locked_text)

# 4. Make wrapper more faded
old_gradient = "linear-gradient(rgba(10, 10, 15, 0.6), rgba(10, 10, 15, 0.6))"
new_gradient = "linear-gradient(rgba(10, 10, 15, 0.85), rgba(10, 10, 15, 0.85))"

content = content.replace(old_gradient, new_gradient)

with open("src/views.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated views.js")
