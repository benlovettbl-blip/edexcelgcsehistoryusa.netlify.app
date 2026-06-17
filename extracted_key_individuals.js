export function renderKeyIndividualsView() {
    const container = document.getElementById("key-individuals-grid");
    if (!container) return;
    container.innerHTML = "";
    activeFigures.forEach((item) => {
      const figure = KEY_FIGURES_BIO[item.key];
      if (!figure) return;
      const cleanName = figure.name.replace(/Jr\.|Chief Justice|General|Dr\./gi, "").trim();
      const nameParts = cleanName.split(/\s+/).filter((p) => p.length > 0);
      let initials = "";
      if (nameParts.length >= 3) {
        initials = (nameParts[0][0] + nameParts[1][0] + nameParts[2][0]).toUpperCase();
      } else if (nameParts.length === 2) {
        initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      } else if (nameParts.length === 1) {
        initials = nameParts[0].substring(0, 2).toUpperCase();
      }
      initials = initials.substring(0, 3);
      const cardContainer = document.createElement("div");
      cardContainer.className = "individual-card-container";
      cardContainer.style.cssText = "perspective: 1000px; height: 380px;";
      const quoteHtml = item.quote ? `
      <blockquote style="margin: 8px 0 12px 0; font-style: italic; font-size: 0.85rem; color: var(--text-main); line-height: 1.4; font-family: Georgia, serif; margin: 0 0 10px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; border-left: 3px solid var(--accent); padding-left: 8px; text-align: left;">
        "${item.quote}"
      </blockquote>
    ` : '<p style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0 10px 0;">GCSE Key Individual</p>';
      cardContainer.innerHTML = `
      <div class="individual-card" style="position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;">
        <!-- FRONT OF CARD -->
        <div class="individual-card-face front" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: var(--border-radius-md); border: 2px solid var(--border-glass); background: var(--bg-card); display: flex; flex-direction: column; overflow: hidden; padding: 20px; box-sizing: border-box; justify-content: space-between;">
          <!-- Top header -->
          <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
            <span style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: var(--accent); letter-spacing: 0.5px;">${figure.role}</span>
            <h3 style="margin: 4px 0 0 0; font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--text-main);">${figure.name}</h3>
          </div>
          
          <!-- Portrait Image -->
          <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; margin: 10px 0;">
            <div style="width: 130px; height: 130px; border-radius: 50%; border: 3px solid var(--accent); overflow: hidden; display: flex; align-items: center; justify-content: center; background: var(--gradient-primary); box-shadow: var(--shadow-sm); position: relative; transition: transform 0.3s ease;">
              ${figure.image ? `
                <img src="${figure.image}" alt="${figure.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <span style="display: none; font-size: 2.2rem; font-weight: 800; color: #fff; font-family: var(--font-heading); text-shadow: 0 1px 3px rgba(0,0,0,0.3);">${initials}</span>
              ` : `
                <span style="font-size: 2.2rem; font-weight: 800; color: #fff; font-family: var(--font-heading); text-shadow: 0 1px 3px rgba(0,0,0,0.3);">${initials}</span>
              `}
            </div>
          </div>
          
          <!-- Bottom info -->
          <div style="text-align: center;">
            ${quoteHtml}
            <span style="font-size: 0.72rem; color: var(--primary); font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 4px;">
              <i class="fa-solid fa-rotate"></i> Click Card to Flip
            </span>
          </div>
        </div>
        
        <!-- BACK OF CARD -->
        <div class="individual-card-face back" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: var(--border-radius-md); border: 2px solid var(--accent); background: var(--bg-sidebar); display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; justify-content: space-between; transform: rotateY(180deg);">
          <div style="text-align: left; display: flex; flex-direction: column; gap: 10px; height: 100%; overflow-y: auto; padding-right: 4px;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--border-glass); padding-bottom: 6px;">
              <h4 style="margin: 0; font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--text-main);">${figure.name}</h4>
              <span style="font-size: 0.65rem; text-transform: uppercase; color: var(--accent); font-weight: 700; letter-spacing: 0.5px;">GCSE Bio</span>
            </div>
            
            <!-- Biography -->
            <p style="font-size: 0.82rem; line-height: 1.45; color: var(--text-muted); margin: 0;">
              ${figure.bio}
            </p>
            
            <!-- GCSE Practice Challenge -->
            <div style="background: rgba(37, 99, 235, 0.05); border: 1px dashed var(--primary); border-radius: var(--border-radius-sm); padding: 10px 12px; margin-top: auto; box-sizing: border-box;">
              <strong style="font-size: 0.72rem; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">
                \u{1F4A1} Quick Recall Question:
              </strong>
              <p style="font-size: 0.8rem; line-height: 1.35; color: var(--text-main); font-weight: 600; margin: 0 0 8px 0;">
                ${item.question}
              </p>
              <div class="answer-box-container">
                <button class="btn-reveal-answer" style="background: var(--primary); border: none; color: #fff; padding: 5px 10px; font-size: 0.7rem; font-weight: 700; border-radius: var(--border-radius-sm); cursor: pointer; transition: background 0.2s;">
                  Reveal Answer
                </button>
              </div>
            </div>
          </div>
          
          <!-- Flip back helper -->
          <div style="text-align: center; margin-top: 6px; border-top: 1px dashed var(--border-glass); padding-top: 6px;">
            <span style="font-size: 0.72rem; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 4px;">
              <i class="fa-solid fa-rotate"></i> Click to Flip Back
            </span>
          </div>
        </div>
      </div>
    `;
      const cardInner = cardContainer.querySelector(".individual-card");
      cardInner.addEventListener("click", (e) => {
        if (e.target.closest(".btn-reveal-answer") || e.target.closest(".reveal-answer-text")) return;
        cardInner.classList.toggle("flipped");
        AudioEngine.play("flip");
      });
      const revealBtn = cardContainer.querySelector(".btn-reveal-answer");
      revealBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        AudioEngine.play("success");
        const containerBox = revealBtn.parentElement;
        containerBox.innerHTML = `
        <div class="reveal-answer-text" style="font-size: 0.8rem; font-weight: 700; color: var(--success); padding: 4px 0; animation: fadeIn 0.3s ease;">
          <i class="fa-solid fa-circle-check"></i> Answer: ${item.answer}
        </div>
      `;
      });
      container.appendChild(cardContainer);
    });
  }

  
