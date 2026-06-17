export function renderTradingCardsView() {
    const container = document.getElementById('view-trading');
    const grid = document.getElementById('trading-cards-grid');
    if (!container || !grid) return;
    
    grid.innerHTML = '';
    
    const printBtn = document.getElementById('print-top-trumps-btn-html');
    if (printBtn && !printBtn.dataset.bound) {
      printBtn.addEventListener('click', () => window.print());
      printBtn.dataset.bound = 'true';
    }
  
    const forceUnlock = window.localStorage.getItem('unlock_all_cards') === 'true';
  
    TRADING_CARDS_DATA.forEach(card => {
      const isUnlocked = forceUnlock || (window.state && window.state.userStats && window.state.userStats.progress && 
window.state.userStats.progress[card.subtopicId] && window.state.userStats.progress[card.subtopicId].masteryScore >= 
100);
  
      const wrapperEl = document.createElement("div");
      wrapperEl.className = "scumbag-card-container scumbag-flippable"; 
      wrapperEl.style.height = "350px";
  
      const innerEl = document.createElement("div");
      innerEl.className = "scumbag-flip-card-inner";
  
      const frontEl = document.createElement("div");
      frontEl.className = "scumbag-flip-card-front";
      if (isUnlocked) {
        frontEl.className += " scumbag-card-unlocked";
        frontEl.style.backgroundImage = `url('${card.image}')`;
        frontEl.style.backgroundSize = "cover";
        frontEl.style.backgroundPosition = "center 15%";
        
        frontEl.innerHTML = `
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, 
rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 70%, transparent 100%); padding: 20px 5px 10px; text-align: center;">
            <h3 style="color: #facc15; font-family: 'Kalam', cursive; font-size: 1.2rem; margin: 0; text-shadow: 2px 
2px 4px rgba(0,0,0,0.8); line-height: 1.1;">
              "${card.frontPhrase || card.name}"
            </h3>
          </div>
          <div class="hologram"></div>
        `;
      } else {
        frontEl.className += " scumbag-card-locked";
        frontEl.innerHTML = `
          <div class="foil-pack-body" style="position: absolute; inset: 0; background-image: linear-gradient(rgba(10, 10, 15, 0.98), rgba(10, 10, 15, 0.98)), url('assets/mr_lovett_wrapper.png'); background-size: cover; 
background-position: center; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; 
padding: 20px; color: white; text-align: center;">
            <div style="background: rgba(0,0,0,0.8); padding: 15px; border-radius: 8px; width: 100%; border: 1px solid 
rgba(255,255,255,0.2);">
              <i class="fa-solid fa-lock" style="font-size: 2rem; margin-bottom: 10px; color: #facc15;"></i>
              <h3 style="margin-bottom: 5px;">Locked Pack</h3>
              <p style="font-size: 0.85rem;">Master Topic ${card.subtopicId || '...'} to unlock</p>
            </div>
          </div>
        `;
      }
  
      const backEl = document.createElement("div");
      backEl.className = "scumbag-flip-card-back";
      
      if (isUnlocked && card.stats) {
        backEl.innerHTML = `
          <div class="scumbag-back-content">
            <div class="scumbag-back-header">
              <h4>${card.name}</h4>
            </div>
            <div class="scumbag-bio">${card.bio}</div>
            <div class="scumbag-stats-box">
              <div class="scumbag-stat-row">
                <span class="stat-label">Audacity</span>
                <span class="scumbag-stat-value">
                  <div class="scumbag-stat-bar" style="width: ${card.stats.audacity}%"></div>
                  ${card.stats.audacity}
                </span>
              </div>
              <div class="scumbag-stat-row">
                <span class="stat-label">Sneakiness</span>
                <span class="scumbag-stat-value">
                  <div class="scumbag-stat-bar" style="width: ${card.stats.diplomaticSneakiness}%"></div>
                  ${card.stats.diplomaticSneakiness}
                </span>
              </div>
              <div class="scumbag-stat-row">
                <span class="stat-label">Military</span>
                <span class="scumbag-stat-value">
                  <div class="scumbag-stat-bar" style="width: ${card.stats.militaryMight}%"></div>
                  ${card.stats.militaryMight}
                </span>
              </div>
              <div class="scumbag-stat-row">
                <span class="stat-label">Legacy</span>
                <span class="scumbag-stat-value">
                  <div class="scumbag-stat-bar" style="width: ${card.stats.legacyScore}%"></div>
                  ${card.stats.legacyScore}
                </span>
              </div>
            </div>
          </div>
        `;
      } else {
        backEl.innerHTML = `<div class="scumbag-back-content"><i class="fa-solid fa-question" style="font-size: 3rem; 
opacity: 0.1;"></i></div>`;
      }
  
      innerEl.appendChild(frontEl);
      innerEl.appendChild(backEl);
      wrapperEl.appendChild(innerEl);
  
      if (isUnlocked) {
        wrapperEl.onclick = () => {
          if(window.AudioEngine) window.AudioEngine.play('cardFlip');
          innerEl.classList.toggle('flipped');
        };
      }
  
      grid.appendChild(wrapperEl);
    });
  }
  