// Registry mapping local image filenames to stable online historical archives (e.g. Library of Congress, National Archives, Wikimedia, etc.)
export const IMAGE_WEB_LINKS = {
  "agent-orange-spraying-c123.jpg": "https://catalog.archives.gov/id/12005971",
  "airborne-little-rock-patrol.jpg": "https://catalog.archives.gov/id/16913988",
  "antiwar-pentagon-protest-1967.jpg": "https://catalog.archives.gov/id/596071",
  "arvn-troops-combat.jpg": "https://commons.wikimedia.org/wiki/File:ARVN_troops_in_action_1968.jpg",
  "birmingham-protests-dogs-1963.jpg": "https://www.loc.gov/item/2012649195/",
  "black-panthers-marching.jpg": "https://commons.wikimedia.org/wiki/File:Black_Panthers_at_Free_Huey_rally.jpg",
  "buddhist-protests-1963.jpg": "https://commons.wikimedia.org/wiki/File:Thich_Quang_Duc_self-immolation.jpg",
  "colored-waiting-room-sign.jpg": "https://www.loc.gov/item/2020635235/",
  "detroit-riot-guard-1967.jpg": "https://commons.wikimedia.org/wiki/File:Detroit_riot_1967_guardsman.jpg",
  "eisenhower-little-rock-speech.jpg": "https://www.eisenhowerlibrary.gov/research/online-documents/integration-little-rock-central-high-school",
  "freedom-riders-bus-1961.jpg": "https://catalog.archives.gov/id/2641505",
  "freedom-riders-bus-wreckage.jpg": "https://www.loc.gov/item/2001697368/",
  "general-westmoreland.jpg": "https://catalog.archives.gov/id/6410427",
  "greensboro-sit-in-counter.jpg": "https://americanhistory.si.edu/collections/search/object/nmah_1350486",
  "hard-hat-riot-1970.jpg": "https://commons.wikimedia.org/wiki/File:Hard_Hat_Riot.jpg",
  "ho-chi-minh-trail-bicycles.jpg": "https://commons.wikimedia.org/wiki/File:Viet_Cong_on_Ho_Chi_Minh_Trail.jpg",
  "huey-helicopter-vietnam.jpg": "https://catalog.archives.gov/id/530616",
  "james-meredith-walking.jpg": "https://www.loc.gov/item/2011661339/",
  "kent-state-protests-1970.jpg": "https://commons.wikimedia.org/wiki/File:Kent_State_massacre_1970.jpg",
  "kissinger-peace-talks.jpg": "https://commons.wikimedia.org/wiki/File:Kissinger_peace_talks_1972.jpg",
  "kkk-march-washington-1926.jpg": "https://www.loc.gov/item/90707736/",
  "lbj-mlk-signing-1964.jpg": "https://catalog.archives.gov/id/194244",
  "lbj-signing-voting-rights-1965.jpg": "https://www.lbjlibrary.org/news-and-press/press-kits/voting-rights-act-of-1965",
  "little-rock-nine-1957.jpg": "https://catalog.archives.gov/id/23871158",
  "little-rock-protest-1957.jpg": "https://www.loc.gov/item/2003654385/",
  "malcolm-x-newspaper.jpg": "https://www.loc.gov/item/2003688134/",
  "malcolm-x-speaking.jpg": "https://commons.wikimedia.org/wiki/File:Malcolm_X_NYWTS_2.jpg",
  "march-on-washington-crowd.jpg": "https://catalog.archives.gov/id/542015",
  "marines-landing-danang.jpg": "https://commons.wikimedia.org/wiki/File:US_Marines_landing_at_Da_Nang_1965.jpg",
  "mlk-boycott-speech-1955.jpg": "https://commons.wikimedia.org/wiki/File:Martin_Luther_King_Jr_at_boycott_meeting_1955.jpg",
  "mlk-dream-speech-1963.jpg": "https://www.loc.gov/item/2013648056/",
  "mlk-waving-washington-1963.jpg": "https://www.loc.gov/item/2013648056/",
  "mourners-mlk-assassination.jpg": "https://www.loc.gov/item/2018649807/",
  "ngo-dinh-diem-parade.jpg": "https://commons.wikimedia.org/wiki/File:Ngo_Dinh_Diem_and_Eisenhower_1957.jpg",
  "nixon-television-address.jpg": "https://commons.wikimedia.org/wiki/File:Richard_Nixon_television_address_1969.jpg",
  "nixon-visiting-troops.jpg": "https://commons.wikimedia.org/wiki/File:Richard_Nixon_with_US_troops_in_Vietnam_1969.jpg",
  "olympics-black-power-1968.jpg": "https://commons.wikimedia.org/wiki/File:1968_Olympics_Black_Power_salute.jpg",
  "paris-peace-accords-signing.jpg": "https://commons.wikimedia.org/wiki/File:Signing_of_the_Paris_Peace_Accords_1973.jpg",
  "poor-peoples-campaign-1968.jpg": "https://www.loc.gov/item/2018649495/",
  "pro-war-rally-nyc.jpg": "https://commons.wikimedia.org/wiki/File:Pro-war_demonstration_in_New_York_City,_1967.jpg",
  "robert-mcnamara-briefing.jpg": "https://commons.wikimedia.org/wiki/File:Robert_McNamara_briefing_1965.jpg",
  "rosa-parks-bus-1956.jpg": "https://www.loc.gov/item/2015647576/",
  "rosa-parks-fingerprint.jpg": "https://catalog.archives.gov/id/596390",
  "saigon-embassy-evacuation.jpg": "https://catalog.archives.gov/id/530869",
  "selma-troopers-bridge.jpg": "https://www.loc.gov/item/2012649206/",
  "southern-manifesto-signing.jpg": "https://www.senate.gov/artandhistory/history/common/generic/CivilRights_SouthernManifesto.htm",
  "us-soldier-patrolling-swamp.jpg": "https://catalog.archives.gov/id/531454",
  "us-troops-bogged-down.jpg": "https://catalog.archives.gov/id/531452",
  "uss-maddox.jpg": "https://catalog.archives.gov/id/595874",
  "vietnam-draft-lottery.jpg": "https://commons.wikimedia.org/wiki/File:1969_draft_lottery_wheel.jpg",
  "vvaw-veterans-protest.jpg": "https://commons.wikimedia.org/wiki/File:VVAW_demonstration,_Washington,_D.C.,_1971.jpg",
  "warren-court-1954.jpg": "https://commons.wikimedia.org/wiki/File:Warren_court.jpg"
};

/**
 * Returns the web archive URL for a given local image path.
 * If the image is not mapped, returns a Google Images search URL.
 * @param {string} src - The local path to the image (e.g. "assets/sources/rosa-parks-fingerprint.jpg")
 * @param {string} [altText] - Optional alt text to refine the search query in fallback
 * @returns {string} The public internet URL for the image
 */
export function getImageWebLink(src, altText = "") {
  if (!src) return "https://www.google.com/imghp";
  
  // Extract filename
  const filename = src.split('/').pop().toLowerCase();
  
  // Check mapping
  if (IMAGE_WEB_LINKS[filename]) {
    return IMAGE_WEB_LINKS[filename];
  }
  
  // Fallback to Wikipedia / Wikimedia Commons search if it's a portrait, or Google images search
  const query = altText || filename.replace(/-|_/g, ' ').replace(/\.[a-z0-9]+$/i, '');
  return `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(query)}`;
}
