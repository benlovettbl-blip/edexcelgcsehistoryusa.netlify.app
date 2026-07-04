import { switchView, switchSubtopicMode } from './navigation.js';
import { AudioEngine } from './audio.js';
import { addXp } from './views.js';

// --- Map Data Configurations ---
export const MAP_LOCATIONS_USA = [
  {
    lat: 39.0473,
    lng: -95.6752,
    title: "Topeka: Brown v. Board of Education National Historical Park (Monroe Elementary School)",
    body: "Monroe Elementary School served as a key school in the challenged Topeka segregation system. The 1954 Supreme Court ruling unanimously declared public school segregation unconstitutional.",
    imageUrl: "assets/sources/warren-court-1954.jpg",
    scholarlyContext: "Topeka, Kansas represented a central midwestern state, deliberately chosen by the NAACP legal team to show that school segregation was not just a Southern problem but a nationwide issue. Monroe Elementary School was located in a mixed working-class neighborhood. The geographic dispersal of segregation laws across different states (some mandatory, some optional, like Kansas) made Topeka a prime battleground to challenge the nationwide constitutionality of Plessy v. Ferguson.",
    researchLinks: [
      { label: "Monroe School National Historic Site", url: "https://www.nps.gov/brvb/index.htm" },
      { label: "NAACP Legal Defense Fund Case Archives", url: "https://www.naacpldf.org/case-record/brown-v-board-of-education/" }
    ],
    subtopicId: "subtopic_1_1"
  },
  {
    lat: 32.3734,
    lng: -86.3154,
    title: "Montgomery: The Legacy Museum & National Memorial for Peace and Justice",
    body: "Built on the site of a former slave pen, this memorial and museum commemorate victims of racial terror and Jim Crow segregation in the American South.",
    imageUrl: "assets/sources/rosa-parks-bus-1956.jpg",
    scholarlyContext: "Montgomery, Alabama was a major domestic slave-trading hub before the Civil War. The Legacy Museum is built on a site where enslaved people were warehoused and forced to work. The nearby National Memorial for Peace and Justice uses hanging steel monuments to represent the counties where over 4,400 documented racial terror lynchings occurred. The geographic placement of these monuments reflects the spatial realities of Jim Crow racial violence and terror designed to enforce white supremacy.",
    researchLinks: [
      { label: "EJI Legacy Museum & National Memorial", url: "https://museumandmemorial.eji.org/" },
      { label: "The King Institute - Montgomery Bus Boycott", url: "https://kinginstitute.stanford.edu/encyclopedia/montgomery-bus-boycott" }
    ],
    subtopicId: "subtopic_1_2"
  },
  {
    lat: 34.7368,
    lng: -92.2996,
    title: "Little Rock: Central High School National Historic Site",
    body: "An active school and National Park site commemorating the 1957 integration crisis, where federal troops enforced desegregation against state resistance.",
    imageUrl: "assets/sources/airborne-little-rock-patrol.jpg",
    scholarlyContext: "Little Rock, Arkansas became the flashpoint of federal vs. state authority. The school district's integration plan was localized, but governor defiance led to a militarized zone at Central High. The spatial encirclement of the school by the Arkansas National Guard was bypassed when President Eisenhower placed the Guard under federal control and deployed the 101st Airborne, establishing military patrols around the school's physical perimeter to enforce desegregation.",
    researchLinks: [
      { label: "Little Rock Central High National Historic Site", url: "https://www.nps.gov/chsc/index.htm" },
      { label: "National Archives - Little Rock Integration Documents", url: "https://www.archives.gov/education/lessons/federal-troops-little-rock" }
    ],
    subtopicId: "subtopic_1_2"
  },
  {
    lat: 36.0726,
    lng: -79.7920,
    title: "Greensboro: International Civil Rights Center & Museum (Woolworth Building)",
    body: "Preserves the original lunch counter where four A&T students began the sit-in movement in 1960, challenging segregated commercial spaces.",
    imageUrl: "assets/sources/greensboro-sit-in-counter.jpg",
    scholarlyContext: "Greensboro, North Carolina was a college town with a significant population of young Black scholars. The F.W. Woolworth store was a commercial hub. The sit-in targeted the physical counter—a highly visible, segregated retail space. The spatial spreading of the sit-in tactic across the South followed major transit lines and college networks, illustrating the geography of nonviolent contagion and economic pressure.",
    researchLinks: [
      { label: "International Civil Rights Center & Museum", url: "https://www.sitinmovement.org/" },
      { label: "Civil Rights Greensboro Archive", url: "https://library.uncg.edu/dp/crg/" }
    ],
    subtopicId: "subtopic_2_1"
  },
  {
    lat: 33.5161,
    lng: -86.8143,
    title: "Birmingham: Birmingham Civil Rights Institute & Kelly Ingram Park",
    body: "Situated in the historic civil rights district, commemorating Project C marches and the 16th Street Baptist Church bombing of 1963.",
    imageUrl: "assets/sources/birmingham-protests-dogs-1963.jpg",
    scholarlyContext: "Birmingham, Alabama ('Bombingham') was highly segregated industrially and residentially. Project C targeted commercial districts to disrupt retail revenue. Kelly Ingram Park, adjacent to the 16th Street Baptist Church, became the spatial arena where Bull Connor deployed fire hoses and dogs. The containment of protests in this park created iconic news images that forced federal intervention and led to the Civil Rights Act.",
    researchLinks: [
      { label: "Birmingham Civil Rights Institute", url: "https://www.bcri.org/" },
      { label: "King Institute - Birmingham Campaign", url: "https://kinginstitute.stanford.edu/encyclopedia/birmingham-campaign" }
    ],
    subtopicId: "subtopic_2_2"
  },
  {
    lat: 38.8893,
    lng: -77.0502,
    title: "Washington D.C.: Lincoln Memorial & Martin Luther King, Jr. Memorial",
    body: "The symbolic national stage of the 1963 March on Washington, utilizing the National Mall's layout to demand civil rights legislation.",
    imageUrl: "assets/sources/mlk-waving-washington-1963.jpg",
    scholarlyContext: "Washington D.C.'s National Mall served as the premier symbolic site of national protest. The spatial positioning of demonstrators stretching from the Lincoln Memorial to the Washington Monument capitalized on political visibility to lobby Congress. The federal district's unique administrative status and layout allowed for massive, peaceful assembly, projecting civil rights demands globally.",
    researchLinks: [
      { label: "National Mall and Memorial Parks", url: "https://www.nps.gov/nama/index.htm" },
      { label: "National Archives - March on Washington Record", url: "https://www.archives.gov/milestone-documents/march-on-washington" }
    ],
    subtopicId: "subtopic_2_2"
  },
  {
    lat: 32.4056,
    lng: -87.0186,
    title: "Selma: National Voting Rights Museum & Edmund Pettus Bridge",
    body: "Commemorates the voting rights campaign and the historic Selma-to-Montgomery marches that crossed the Alabama River choke point.",
    imageUrl: "assets/sources/selma-troopers-bridge.jpg",
    scholarlyContext: "Selma, Alabama's Edmund Pettus Bridge spanned the Alabama River, separating the city from the rural county. This bridge served as a critical geographic choke point. Crossing the bridge was a symbolic crossing of the racial divide. The assault by state troopers on 'Bloody Sunday' occurred immediately after the marchers crossed the bridge, capturing the violence of rural segregation and leading to the Voting Rights Act of 1965.",
    researchLinks: [
      { label: "Selma to Montgomery National Historic Trail", url: "https://www.nps.gov/semo/index.htm" },
      { label: "Civil Rights Movement Archive", url: "https://www.crmvet.org/" }
    ],
    subtopicId: "subtopic_2_3"
  },
  {
    lat: 33.7554,
    lng: -84.3725,
    title: "Atlanta: Martin Luther King, Jr. National Historical Park & Ebenezer Baptist Church",
    body: "Preserves Dr. King's birthplace and Ebenezer Baptist Church, the spiritual command center for the SCLC organizational network in Georgia.",
    imageUrl: "assets/sources/mlk-boycott-speech-1955.jpg",
    scholarlyContext: "The Martin Luther King, Jr. National Historical Park in Atlanta preserves the childhood home and the Ebenezer Baptist Church where King co-pastored. Geographically, Atlanta's Sweet Auburn district served as a critical spatial sanctuary and economic engine for the Southern Civil Rights movement. The concentration of Black-owned businesses, educational institutions, and churches in this neighborhood fostered the organizational leadership, resources, and tactical strategy that launched the Southern Christian Leadership Conference (SCLC) and coordinated nationwide protest campaigns.",
    researchLinks: [
      { label: "NPS - Martin Luther King Jr. Historical Site", url: "https://www.nps.gov/malu/index.htm" },
      { label: "The King Center Archives", url: "https://thekingcenter.org/" }
    ],
    subtopicId: "subtopic_1_2"
  },
  {
    lat: 35.1344,
    lng: -90.0575,
    title: "Memphis: National Civil Rights Museum at the Lorraine Motel",
    body: "Located at the site of Dr. King's 1968 assassination, mapping the local Sanitation Strike and the broader struggle for economic justice.",
    imageUrl: "assets/sources/mourners-mlk-assassination.jpg",
    scholarlyContext: "The National Civil Rights Museum is located at the former Lorraine Motel in Memphis, Tennessee, where Dr. Martin Luther King Jr. was assassinated on April 4, 1968. The motel was a historic haven for Black travelers under segregation laws, listed in the Green Book. King's presence in Memphis was to support the Sanitation Workers' Strike, highlighting the shift of the civil rights movement toward economic justice. The preservation of the motel's physical structure as a museum serves as a spatial memorial to King's martyrdom and the systemic segregation of the urban South.",
    researchLinks: [
      { label: "National Civil Rights Museum", url: "https://www.civilrightsmuseum.org/" },
      { label: "Stanford King Institute - Memphis Strike", url: "https://kinginstitute.stanford.edu/encyclopedia/memphis-sanitation-workers-strike" }
    ],
    subtopicId: "subtopic_2_3"
  },
  {
    lat: 32.3028,
    lng: -90.1802,
    title: "Jackson: Mississippi Civil Rights Museum",
    body: "Commemorates the grassroots campaigns of the local NAACP field director Medgar Evers and the logistics of the 1964 Freedom Summer.",
    imageUrl: "assets/sources/james-meredith-walking.jpg",
    scholarlyContext: "The Mississippi Civil Rights Museum in Jackson, Mississippi, offers a granular look at the civil rights struggle within the nation's most resistance-heavy state. Unlike national narratives, Jackson and the Mississippi delta represented a geography of extreme white supremacist violence and voter suppression. The museum details the local leadership of Medgar Evers, the Mississippi Freedom Democratic Party (MFDP), and the spatial logistics of the 1964 Freedom Summer, which set up community freedom schools and voter registration centers in remote, dangerous rural towns.",
    researchLinks: [
      { label: "Mississippi Civil Rights Museum", url: "https://mcrm.mdah.ms.gov/" },
      { label: "Medgar Evers Home National Monument", url: "https://www.nps.gov/meev/index.htm" }
    ],
    subtopicId: "subtopic_2_3"
  }
];

export const MAP_LOCATIONS_VIETNAM = [
  {
    lat: 21.3860,
    lng: 103.0180,
    title: "Dien Bien Phu: Dien Bien Phu Victory Museum & A1 Hill Memorial",
    body: "Preserves the bunkers, trenches, and command center of General Giap's forces that defeated the French garrison in 1954.",
    imageUrl: "assets/sources/portraits/general_giap.jpg",
    scholarlyContext: "Dien Bien Phu is situated in a remote valley in northwestern Vietnam, surrounded by high hills. French commander Navarre chose this basin to draw the Viet Minh into a set-piece battle, assuming Viet Minh artillery could not be dragged onto the high slopes. Viet Minh forces under General Giap dismantled these hills manually, dragging heavy artillery up the sheer cliffs and encircling the French garrison, demonstrating the tactical dominance of surrounding high ground.",
    researchLinks: [
      { label: "Geneva Accords & Indochina War History", url: "https://www.history.com/topics/vietnam-war/dien-bien-phu" },
      { label: "General Vo Nguyen Giap Military Biography", url: "https://www.britannica.com/biography/Vo-Nguyen-Giap" }
    ],
    subtopicId: "subtopic_3_1"
  },
  {
    lat: 21.0368,
    lng: 105.8347,
    title: "Hanoi: Vietnam Military History Museum & Hanoi Flag Tower",
    body: "Exhibits military defense gear, captured wreckage, and military accounts of the DRV's political-strategic command center.",
    imageUrl: "assets/sources/portraits/ho_chi_minh.jpg",
    scholarlyContext: "Hanoi, situated on the Red River Delta in northern Vietnam, had fertile land and dense population. As the capital of the DRV, it was the logistical and political command center. The Red River's dyke system was a critical geographic asset; US planners debated bombing the dykes to flood agricultural lands, but held back due to international law. Hanoi was heavily protected by Soviet-supplied air defense networks.",
    researchLinks: [
      { label: "National Security Archive - Bombing of Hanoi", url: "https://nsarchive.gwu.edu/briefing-book/vietnam/2018-12-18/christmas-bombings-december-1972" },
      { label: "Red River Delta Geography & Tactics", url: "https://www.loc.gov/item/88600482/" }
    ],
    subtopicId: "subtopic_3_1"
  },
  {
    lat: 10.7795,
    lng: 106.6923,
    title: "Ho Chi Minh City: War Remnants Museum & Independence Palace",
    body: "Commemorates the end of the conflict in Saigon, exhibiting heavy armor, artillery, and records of chemical weapon impacts.",
    imageUrl: "assets/sources/saigon-embassy-evacuation.jpg",
    scholarlyContext: "Saigon, located in southern Vietnam near the Mekong Delta, was the capital of the Republic of Vietnam. Its delta geography made it vulnerable to insurgent infiltration through swamps and waterways. In April 1975, the North Vietnamese Army cut off all major highways into the city, surrounding it. The fall of Saigon culminated in a chaotic helicopter evacuation from the rooftop of the US Embassy, ending the war.",
    researchLinks: [
      { label: "Fall of Saigon Archives - Gerald R. Ford Library", url: "https://www.fordlibrarymuseum.gov/library/guides.asp" },
      { label: "Mekong Delta Military History", url: "https://www.history.com/topics/vietnam-war/fall-of-saigon" }
    ],
    subtopicId: "subtopic_3_1"
  },
  {
    lat: 16.6231,
    lng: 106.7289,
    title: "Khe Sanh: Khe Sanh Combat Base Museum & Memorial",
    body: "A former marine airstrip and base near the DMZ, now displaying military vehicles, bunkers, and shell casings from the 77-day siege of 1968.",
    imageUrl: "assets/sources/us-soldier-patrolling-swamp.jpg",
    scholarlyContext: "Khe Sanh was a combat base in a mountainous region of western Quang Tri province, near the Laotian border and the DMZ. Its proximity to the Ho Chi Minh Trail made it a strategic surveillance outpost. Surrounded by dense jungle and steep hills (Hills 881, 861), the garrison was besieged by NVA forces in 1968. The US relied heavily on air superiority, launching Operation Niagara to drop massive ordnance on the surrounding hills to break the siege.",
    researchLinks: [
      { label: "The Khe Sanh Campaign - Marine Corps History", url: "https://www.usmcu.edu/mcupress/" },
      { label: "Battle of Khe Sanh Historical Analysis", url: "https://www.history.com/topics/vietnam-war/battle-of-khe-sanh" }
    ],
    subtopicId: "subtopic_4_1"
  },
  {
    lat: 15.1764,
    lng: 108.8789,
    title: "Son My: Son My Memorial Park & Museum (My Lai Massacre Site)",
    body: "Commemorates the victims of the My Lai Massacre, preserving foundations, bullet-scarred trees, and historical photographic archives.",
    imageUrl: "assets/sources/us-troops-bogged-down.jpg",
    scholarlyContext: "My Lai was a hamlet in Son My village, located in the coastal lowlands of Quang Ngai province. This region was a stronghold of the National Liberation Front (Viet Cong). The geography of rural hamlets—characterized by dense foliage, rice paddies, and underground tunnel networks—created high paranoia among US soldiers who struggled to distinguish civilians from combatants.",
    researchLinks: [
      { label: "My Lai Courts Martial Documents - UMKC", url: "https://famous-trials.com/mylai" },
      { label: "Quang Ngai Province Combat Operations", url: "https://www.history.com/topics/vietnam-war/my-lai-massacre" }
    ],
    subtopicId: "subtopic_4_1"
  },
  {
    lat: 16.7424,
    lng: 107.1864,
    title: "Quang Tri: Quang Tri Ancient Citadel & Memorial Monument",
    body: "Commemorates the thousands of combatants who died during the intense 81-day artillery bombardment and siege of the citadel in 1972.",
    imageUrl: "assets/sources/arvn-troops-combat.jpg",
    scholarlyContext: "The Quang Tri Citadel, built in 1824, was the site of the brutal Second Battle of Quang Tri in 1972. During the Easter Offensive, the citadel was shelled with over 320,000 tons of bombs and artillery by US and South Vietnamese forces trying to recapture it from the NVA. The intense bombardment reduced the citadel to rubble, and the site is now a peaceful memorial park honoring the young soldiers from both sides who perished in the mud and debris.",
    researchLinks: [
      { label: "Quang Tri Citadel Memorial Site Info", url: "https://vietnamtourism.gov.vn/en/post/10044" },
      { label: "1972 Easter Offensive Operations", url: "https://www.history.com/topics/vietnam-war/easter-offensive" }
    ],
    subtopicId: "subtopic_4_2"
  },
  {
    lat: 11.1432,
    lng: 106.4630,
    title: "Cu Chi: Cu Chi Tunnels Memorial & Underground Network",
    body: "A massive preserved network of subterranean tunnels used by the Viet Cong for troop movements, supply lines, and combat shelters.",
    imageUrl: "assets/sources/huey-helicopter-vietnam.jpg",
    scholarlyContext: "The Cu Chi Tunnels represent a masterpiece of defensive military geography. Spanning over 250 kilometers, this multi-level underground network near Saigon contained living areas, kitchens, hospitals, and command posts. The hard clay soil allowed the Viet Cong to dig tunnels that could withstand heavy artillery and aerial bombing. The tunnels allowed fighters to vanish into the terrain, launch surprise counter-attacks, and neutralize the air and firepower superiority of US and ARVN forces.",
    researchLinks: [
      { label: "Cu Chi Tunnels Historical Site", url: "https://www.history.com/topics/vietnam-war/cu-chi-tunnels" },
      { label: "Military Geography and Insurgency", url: "https://www.armyupress.army.mil/Journals/Military-Review/English-Edition-Archives/November-December-2019/Patterson-Viet-Cong-Tunnels/" }
    ],
    subtopicId: "subtopic_3_2"
  },
  {
    lat: 16.4690,
    lng: 107.5781,
    title: "Hue: Hue Citadel War Monuments & 1968 Mass Grave Memorial",
    body: "Commemorates the heavy urban fighting for the imperial citadel during the Tet Offensive and the civilian lives lost in the subsequent purge.",
    imageUrl: "assets/sources/us-troops-bogged-down.jpg",
    scholarlyContext: "The Battle of Hue in 1968 was the longest and bloodiest urban fight of the Vietnam War. NVA and Viet Cong forces seized the historic imperial citadel, resulting in weeks of house-to-house combat with US Marines. The tight streets and stone ramparts of the citadel negated typical US air support advantages, leading to massive destruction. The site honors the military casualties and the thousands of civilians executed and buried in mass graves around the city.",
    researchLinks: [
      { label: "Battle of Hue - Marine Corps History", url: "https://www.usmcu.edu/mcupress/" },
      { label: "The Tet Offensive & Hue Massacre Research", url: "https://www.history.com/topics/vietnam-war/tet-offensive" }
    ],
    subtopicId: "subtopic_4_1"
  },
  {
    lat: 16.9583,
    lng: 106.9458,
    title: "Quang Tri: Truong Son National Military Cemetery",
    body: "The largest national war cemetery in Vietnam, honoring over 10,000 soldiers who fell while keeping open the Ho Chi Minh supply trail.",
    imageUrl: "assets/sources/ho-chi-minh-trail-bicycles.jpg",
    scholarlyContext: "Truong Son National Cemetery is the final resting place of North Vietnamese soldiers and logistics personnel who died along the Ho Chi Minh Trail. Located on a hill in Quang Tri province, its geographic location represents the central junction where paths of the trail crossed. The trail was a network of forest roads, rivers, and paths through Laos and Cambodia, serving as the main artery for northern supplies. The cemetery is a memorial to the heavy human cost of maintaining this vital logistic line.",
    researchLinks: [
      { label: "Truong Son National Cemetery History", url: "https://vietnamtourism.gov.vn/en/" },
      { label: "Ho Chi Minh Trail Logistics Studies", url: "https://www.history.com/topics/vietnam-war/ho-chi-minh-trail" }
    ],
    subtopicId: "subtopic_3_3"
  },
  {
    lat: 41.1496,
    lng: -81.3411,
    title: "Kent State (USA): Kent State May 4 Memorial & Visitor Center",
    body: "A national historic landmark on the Ohio campus, memorializing the students fired upon by the National Guard during 1970 anti-war protests.",
    imageUrl: "assets/sources/kent-state-protests-1970.jpg",
    scholarlyContext: "Kent State University is located in Kent, Ohio. The campus commons and pagoda area became a violent arena when the Ohio National Guard was deployed following the burning of the ROTC building. The spatial layout of the campus—including hills and parking lots—led to tactical confusion and tragedy when guardsmen fired into crowds of unarmed student protestors on the commons.",
    researchLinks: [
      { label: "Kent State May 4 Collection & Archives", url: "https://www.kent.edu/library/special-collections/may-4-collection" },
      { label: "President's Commission on Campus Unrest", url: "https://www.history.com/topics/vietnam-war/kent-state-shooting" }
    ],
    subtopicId: "subtopic_4_1"
  }
];

let mapUsa = null;
let mapVietnam = null;

function loadLeaflet(callback) {
  if (window.L) {
    callback();
    return;
  }

  // Dynamically load Leaflet stylesheet
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  link.crossOrigin = '';
  document.head.appendChild(link);

  // Dynamically load Leaflet script
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
  script.crossOrigin = '';
  script.onload = () => {
    callback();
  };
  script.onerror = () => {
    console.error('Failed to dynamically load Leaflet Map library.');
  };
  document.head.appendChild(script);
}

export function initMapExplorer() {
  // Bind Map Tab Switching
  const btnUsa = document.getElementById('btn-map-tab-usa');
  const btnVietnam = document.getElementById('btn-map-tab-vietnam');
  const wrapperUsa = document.getElementById('map-usa-container');
  const wrapperVietnam = document.getElementById('map-vietnam-container');

  if (!btnUsa || !btnVietnam) return;

  btnUsa.addEventListener('click', () => {
    AudioEngine.play('click');
    btnUsa.classList.add('active');
    btnVietnam.classList.remove('active');
    wrapperUsa.style.display = 'block';
    wrapperVietnam.style.display = 'none';
    
    // Invalidate size immediately on tab click
    if (mapUsa) {
      setTimeout(() => mapUsa.invalidateSize(), 50);
    }
  });

  btnVietnam.addEventListener('click', () => {
    AudioEngine.play('click');
    btnVietnam.classList.add('active');
    btnUsa.classList.remove('active');
    wrapperVietnam.style.display = 'block';
    wrapperUsa.style.display = 'none';
    
    // Invalidate size immediately on tab click
    if (mapVietnam) {
      setTimeout(() => mapVietnam.invalidateSize(), 50);
    }
  });

  // Listen for view activation event from switchView
  window.addEventListener('mapViewActivated', () => {
    // Reset tabs and containers to USA default on activation
    btnUsa.classList.add('active');
    btnVietnam.classList.remove('active');
    wrapperUsa.style.display = 'block';
    wrapperVietnam.style.display = 'none';

    // Lazy initialize Leaflet maps after dynamically loading it
    loadLeaflet(() => {
      if (!mapUsa) {
        setupMaps();
      } else {
        // Refresh sizing
        setTimeout(() => {
          if (mapUsa) mapUsa.invalidateSize();
          if (mapVietnam) mapVietnam.invalidateSize();
        }, 100);
      }
    });
  });
}

function setupMaps() {
  const wrapperUsa = document.getElementById('map-usa-container');
  const wrapperVietnam = document.getElementById('map-vietnam-container');
  
  if (!wrapperUsa || !wrapperVietnam) return;

  // 1. Setup USA Map
  mapUsa = L.map('map-usa-container', { scrollWheelZoom: false }).setView([37.8, -96.0], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(mapUsa);

  // 2. Setup Vietnam Map
  mapVietnam = L.map('map-vietnam-container', { scrollWheelZoom: false }).setView([16.0, 107.0], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(mapVietnam);

  // Create Custom Icons
  const usaIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div class="custom-map-marker-container">
        <div class="custom-map-marker-pulse usa-pulse"></div>
        <div class="custom-map-marker-pin usa-pin"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });

  const vietnamIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div class="custom-map-marker-container">
        <div class="custom-map-marker-pulse vietnam-pulse"></div>
        <div class="custom-map-marker-pin vietnam-pin"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });

  // 3. Add USA Markers
  MAP_LOCATIONS_USA.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng], { icon: usaIcon }).addTo(mapUsa);
    marker.bindPopup(`<strong>${loc.title}</strong>`);
    marker.on('click', () => {
      AudioEngine.play('ping_usa');
      showLocationDetails(loc);
    });
  });

  // 4. Add Vietnam Markers
  MAP_LOCATIONS_VIETNAM.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng], { icon: vietnamIcon }).addTo(mapVietnam);
    marker.bindPopup(`<strong>${loc.title}</strong>`);
    marker.on('click', () => {
      AudioEngine.play('ping_vietnam');
      showLocationDetails(loc);
    });
  });

  // 5. Add Historical Polylines (Routes)
  // Selma to Montgomery March Route (1965)
  const routeSelmaMontgomery = [
    [32.4074, -87.0203], // Selma
    [32.3792, -86.3077]  // Montgomery
  ];
  L.polyline(routeSelmaMontgomery, {
    color: 'var(--primary)',
    weight: 4,
    dashArray: '8, 8',
    opacity: 0.8
  }).addTo(mapUsa).bindTooltip("Selma to Montgomery March Route (1965)", { sticky: true });

  // Ho Chi Minh Supply Trail Route
  const routeHoChiMinh = [
    [21.0285, 105.8542], // Hanoi
    [18.6734, 105.6813], // Vinh
    [17.7, 105.7],        // Laos border
    [16.7, 106.2],        // Tchepone
    [14.1, 106.4],        // Siem Pang
    [11.6667, 106.6],     // Loc Ninh
    [10.8231, 106.6297]   // Saigon
  ];
  L.polyline(routeHoChiMinh, {
    color: 'var(--accent)',
    weight: 4,
    dashArray: '8, 8',
    opacity: 0.8
  }).addTo(mapVietnam).bindTooltip("Ho Chi Minh Supply Trail Route", { sticky: true });

  // Trigger size update
  setTimeout(() => {
    mapUsa.invalidateSize();
    mapVietnam.invalidateSize();
  }, 100);
}

function showLocationDetails(loc) {
  addXp(5);
  const box = document.getElementById('map-context-box');
  const title = document.getElementById('map-context-title');
  const body = document.getElementById('map-context-body');
  const actionContainer = document.getElementById('map-context-action-container');

  if (!box || !title || !body || !actionContainer) return;

  // Make sure to stop any current speaking when loading a new location details panel
  AudioEngine.stopSpeaking();

  title.innerHTML = `
    <span style="flex: 1; display: flex; align-items: center; gap: 8px;">
      <i class="fa-solid fa-location-crosshairs" style="color: var(--primary);"></i> ${loc.title}
    </span>
    <button id="btn-map-speak" class="header-icon-btn" style="padding: 6px; font-size: 0.9rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass); border-radius: 50%; color: var(--text-main); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; transition: all var(--transition-fast);" title="Speak Description">
      <i class="fa-solid fa-volume-high"></i>
    </button>
  `;

  let linksHtml = '';
  if (loc.researchLinks && loc.researchLinks.length > 0) {
    const linkItems = loc.researchLinks.map(lnk => `
      <a href="${lnk.url}" target="_blank" class="btn-secondary" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; font-size: 0.8rem; text-decoration: none; border-radius: 4px; border: 1px solid var(--border-glass); background: rgba(255,255,255,0.03); color: var(--primary); transition: all 0.2s;">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> ${lnk.label}
      </a>
    `).join('');
    linksHtml = `
      <div style="margin-top: 18px; border-top: 1px solid var(--border-glass); padding-top: 14px;">
        <h5 style="margin: 0 0 10px 0; font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">
          <i class="fa-solid fa-graduation-cap"></i> Further Research & Classroom Resources
        </h5>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${linkItems}
        </div>
      </div>
    `;
  }

  let imgHtml = '';
  if (loc.imageUrl) {
    imgHtml = `
      <div style="margin-bottom: 16px; border-radius: var(--border-radius-sm); overflow: hidden; border: 1px solid var(--border-glass); max-width: 600px;">
        <img src="${loc.imageUrl}" alt="${loc.title}" style="width: 100%; height: auto; max-height: 320px; object-fit: cover; display: block;" />
      </div>
    `;
  }

  body.innerHTML = `
    ${imgHtml}
    <div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-main); margin-bottom: 12px; font-style: italic;">
      <strong>Summary:</strong> ${loc.body}
    </div>
    <div style="font-size: 0.92rem; line-height: 1.65; color: var(--text-normal); margin-top: 10px;">
      <strong style="color: var(--primary); display: block; margin-bottom: 6px; text-transform: uppercase; font-size: 0.78rem; letter-spacing: 0.5px;">Geographical & Historical Case Study:</strong>
      ${loc.scholarlyContext || ''}
    </div>
    ${linksHtml}
  `;

  // Standard revision jump buttons are no longer needed
  actionContainer.innerHTML = '';

  let isSpeaking = false;
  const speakBtn = document.getElementById('btn-map-speak');
  speakBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isSpeaking) {
      AudioEngine.stopSpeaking();
      speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      isSpeaking = false;
    } else {
      speakBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
      isSpeaking = true;
      AudioEngine.speak(loc.scholarlyContext || loc.body, 
        () => {}, 
        () => {
          speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
          isSpeaking = false;
        },
        () => {
          speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
          isSpeaking = false;
        }
      );
    }
  });

  box.style.display = 'block';
  
  setTimeout(() => {
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

export function focusMapOnLocation(titleText) {
  let loc = MAP_LOCATIONS_USA.find(l => l.title === titleText || l.title.includes(titleText));
  let isUsa = true;
  if (!loc) {
    loc = MAP_LOCATIONS_VIETNAM.find(l => l.title === titleText || l.title.includes(titleText));
    isUsa = false;
  }
  
  if (!loc) {
    console.warn("Location not found in MAP_LOCATIONS:", titleText);
    return;
  }

  switchView('map');

  const btnUsa = document.getElementById('btn-map-tab-usa');
  const btnVietnam = document.getElementById('btn-map-tab-vietnam');
  const wrapperUsa = document.getElementById('map-usa-container');
  const wrapperVietnam = document.getElementById('map-vietnam-container');

  if (isUsa && btnUsa && wrapperUsa) {
    btnUsa.classList.add('active');
    if (btnVietnam) btnVietnam.classList.remove('active');
    wrapperUsa.style.display = 'block';
    if (wrapperVietnam) wrapperVietnam.style.display = 'none';
    if (mapUsa) {
      setTimeout(() => {
        mapUsa.invalidateSize();
        mapUsa.setView([loc.lat, loc.lng], 10);
      }, 50);
    }
  } else if (!isUsa && btnVietnam && wrapperVietnam) {
    btnVietnam.classList.add('active');
    if (btnUsa) btnUsa.classList.remove('active');
    wrapperVietnam.style.display = 'block';
    if (wrapperUsa) wrapperUsa.style.display = 'none';
    if (mapVietnam) {
      setTimeout(() => {
        mapVietnam.invalidateSize();
        mapVietnam.setView([loc.lat, loc.lng], 10);
      }, 50);
    }
  }

  showLocationDetails(loc);
}

window.focusMapOnLocation = focusMapOnLocation;
window.MAP_LOCATIONS_USA = MAP_LOCATIONS_USA;
window.MAP_LOCATIONS_VIETNAM = MAP_LOCATIONS_VIETNAM;

