import { AudioEngine } from './audio.js';

export const BRAND_CONFIG = {
  units: {
    "conflict_middle_east": {
      brandHeader: "Fareham Chimney Sweep Inc.",
      quotes: [
        "Because unblocking a chimney is tough, but untangling the Gulf of Tonkin Resolution is a whole different level of messy.",
        "Clearing out soot since 2013, because a blocked flue is bad, but forgetting the details of the Montgomery Bus Boycott is catastrophic.",
        "Sweeping away the historical fog. Keeping your chimneys clear and your knowledge on the 1968 Tet Offensive crystal clear.",
        "Because a chimney fire causes smoke, but the Gulf of Tonkin incident caused an absolute international escalation.",
        "We handle the dust, you handle the drama. Sweeping through everything from the Civil Rights Act to the fall of Saigon.",
        "Because a clogged chimney cuts off the draft, but the Vietnam draft cut off the youth of America.",
        "From the streets of Fareham to the streets of Selma: we sweep the flues so you can master the causes of the Civil Rights movement.",
        "Because cleaning a fireplace takes grit, but parsing the differing interpretations of the Tet Offensive takes a total miracle.",
        "Sweeping away the confusion. Because a blocked chimney ruins your living room, but forgetting the roles of MLK and Malcolm X ruins your 16-mark essay.",
        "We scrape out the creosote so you can scrape together top marks on the Watergate scandal and Nixon's resignation.",
        "A clogged chimney cuts off the draft, but at least our sweeps don’t get called up to the Mekong Delta by a birthday lottery.",
        "We check for structural cracks in your masonry. If only someone had checked for cracks in the Gulf of Tonkin intelligence reports before 1964.",
        "Getting sticky creosote off your hands is difficult, but it's still easier than scrubbing the reputation of the Strategic Hamlet Program.",
        "We clear out the soot so your fireplace can breathe; if only General Westmoreland had a giant brush to clear out the Vietcong's Cu Chi tunnels.",
        "We promise to leave your living room spotless. We cannot say the same for Operation Rolling Thunder’s impact on the Vietnamese jungle.",
        "We sweep the flues so you can master the news: because a blocked fireplace is a hazard, but forgetting the difference between the SCLC and SNCC is a tragedy.",
        "Our brushes are tough enough to scrape away decades of soot, but even we would struggle to sweep away the bureaucracy of the Mississippi voter registration tests.",
        "A dirty chimney causes a backdraft, which is still less volatile than the reception the Freedom Riders got in Anniston, Alabama.",
        "We deal in soot and ash, but we leave the fire-hose dynamics to Bull Connor and your Paper 3 source analysis revision.",
        "We guarantee a clean hearth, unlike the Nixon administration, which couldn't even guarantee that 18 and a half minutes of White House tapes wouldn't 'accidentally' vanish.",
        "We clean out the chimneys so secrets don't smoke out. If only Nixon had hired our sweeps to plug the leaks instead of using White House Plumbers.",
        "Unblocking a flue is a dirty job, but it is still infinitely cleaner than the political fallout of the Watergate cover-up.",
        "A chimney brush removes the thickest soot; sadly, it won’t do anything to clear up the 'credibility gap' of the early 1970s.",
        "Much like the anti-war protests, a tiny spark of soot in a chimney can rapidly escalate into a full-blown national emergency. Keep it swept."
      ]
    }
  },
  
  apply(unitId, isSilent = false) {
    const config = this.units[unitId] || this.units["conflict_middle_east"];
    
    // Update headers and titles dynamically in DOM
    const headerTitle = document.getElementById('brand-subheader-title');
    const quoteEl = document.getElementById('brand-subheader-quote');
    const banner = document.getElementById('brand-subheader-banner');
    
    if (headerTitle && quoteEl && banner) {
      headerTitle.textContent = config.brandHeader;
      
      const randomIndex = Math.floor(Math.random() * config.quotes.length);
      quoteEl.textContent = `"${config.quotes[randomIndex]}"`;
      
      banner.style.display = 'flex';
      
      if (!isSilent) {
        AudioEngine.play('success');
      }
    }
  }
};

let brandBannerTimeout = null;
let brandBannerHideTimeout = null;
let brandBannerPinned = false;
let bannerListenerInitialized = false;

function startBannerDismiss(delay) {
  if (brandBannerTimeout) clearTimeout(brandBannerTimeout);
  if (brandBannerHideTimeout) clearTimeout(brandBannerHideTimeout);
  const banner = document.getElementById('brand-subheader-banner');
  if (!banner) return;
  brandBannerTimeout = setTimeout(() => {
    banner.classList.add('fade-out');
    brandBannerHideTimeout = setTimeout(() => {
      banner.style.display = 'none';
    }, 500);
  }, delay);
}

export function updateBrandBanner() {
  const banner = document.getElementById('brand-subheader-banner');
  const quoteEl = document.getElementById('brand-subheader-quote');
  const titleEl = document.getElementById('brand-subheader-title');
  if (!banner || !quoteEl || !titleEl) return;

  brandBannerPinned = false;
  banner.style.borderLeft = '';
  banner.classList.remove('fade-out');

  if (!bannerListenerInitialized) {
    banner.style.cursor = 'pointer';
    banner.title = 'Click to pin/unpin this message';
    banner.addEventListener('click', () => {
      brandBannerPinned = !brandBannerPinned;
      AudioEngine.play('click');
      if (brandBannerPinned) {
        if (brandBannerTimeout) clearTimeout(brandBannerTimeout);
        if (brandBannerHideTimeout) clearTimeout(brandBannerHideTimeout);
        banner.classList.remove('fade-out');
        banner.style.borderLeft = '4px solid var(--accent)';
      } else {
        banner.style.borderLeft = '';
        startBannerDismiss(5000);
      }
    });
    bannerListenerInitialized = true;
  }

  const unitKey = 'conflict_middle_east';
  const config = BRAND_CONFIG.units[unitKey];
  if (config) {
    titleEl.textContent = config.brandHeader;
    const randomIndex = Math.floor(Math.random() * config.quotes.length);
    quoteEl.textContent = `"${config.quotes[randomIndex]}"`;
    banner.style.display = 'flex';
    startBannerDismiss(5000);
  } else {
    banner.style.display = 'none';
  }
}
