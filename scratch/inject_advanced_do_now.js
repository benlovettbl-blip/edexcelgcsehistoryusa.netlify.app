const fs = require('fs');
const path = require('path');

const targetFilePath = 'c:/Users/fives/.gemini/antigravity/scratch/paper3_usa_recall_quizzes/src/lessons_data.js';
console.log('Reading from:', targetFilePath);

let content = fs.readFileSync(targetFilePath, 'utf8');

// Strip "export const LESSONS_DATA = " to parse it as raw JS/JSON
let cleanContent = content.replace(/export\s+const\s+LESSONS_DATA\s*=\s*/, 'global.LESSONS_DATA = ');
eval(cleanContent); // This will define global.LESSONS_DATA

const lessons = global.LESSONS_DATA;

const advancedDoNowData = {
  "subtopic_1_1": {
    "prevSubtopicId": null,
    "prevSubtopicTitle": null,
    "image": "assets/sources/colored-waiting-room-sign.jpg",
    "provenance": "A Jim Crow sign designating a segregated 'Colored Waiting Room' in a bus terminal in the Southern United States, circa 1950s.",
    "seeThinkWonder": {
      "see": "Observe the bold letters and the physical placement of the sign near public entrances.",
      "think": "Why did Southern states legislate separation down to waiting rooms, water fountains, and ticket windows?",
      "wonder": "What would be the emotional and economic cost of defying this sign as a Black traveler in the 1950s?"
    },
    "bronze": "Define 'segregation' and name the landmark 1896 Supreme Court ruling that legalized it under the 'separate but equal' doctrine.",
    "silver": "Study the source image. Identify two details indicating how segregation was legally and physically enforced in public transport spaces.",
    "gold": "Explain how this visual source demonstrates the limitations of civil liberties and constitutional rights for Black Americans in the South in the early 1950s.",
    "keywords": ["Jim Crow", "Plessy v. Ferguson", "Segregation", "14th Amendment"],
    "bronzeAnswer": "Segregation is the enforced separation of different racial groups in a country, community, or establishment. The 1896 ruling that legalized this was Plessy v. Ferguson.",
    "silverAnswer": "The source shows physical segregation through: (1) explicit signage declaring the room is for 'Colored' passengers only, and (2) the separation of public spaces (waiting rooms) inside transport terminals.",
    "goldAnswer": "This source demonstrates that civil liberties were severely limited because the state actively legalized discrimination. Black Americans were denied equal access to public accommodations and treated as second-class citizens, violating the equal protection clause of the 14th Amendment."
  },
  "subtopic_1_2": {
    "prevSubtopicId": "subtopic_1_1",
    "prevSubtopicTitle": "Topic 1.1: Segregation & Brown v. Board",
    "image": "assets/sources/rosa-parks-bus-1956.jpg",
    "provenance": "A photograph of Rosa Parks riding in the front of a Montgomery bus in December 1956, after the Supreme Court segregation ban took effect.",
    "seeThinkWonder": {
      "see": "Look at Rosa Parks' position on the bus and the white passenger sitting behind her.",
      "think": "How does her calm, dignified demeanor in the photograph serve as a powerful political statement?",
      "wonder": "Why was this photograph widely distributed to national newspapers rather than kept private?"
    },
    "bronze": "State the date and outcome of the landmark Brown v. Board of Education decision.",
    "silver": "Study the source image. Identify two details showing that Rosa Parks' protest resulted in a significant shift in bus seating rules.",
    "gold": "Connect this image of bus integration back to the segregation sign in Topic 1.1. How does this represent a direct legal and social challenge to that earlier system?",
    "keywords": ["NAACP", "Test Case", "Direct Action", "Montgomery Improvement Association"],
    "bronzeAnswer": "In May 1954, the Supreme Court ruled unanimously (9-0) that racial segregation in public schools was unconstitutional.",
    "silverAnswer": "The image shows Parks sitting in the front seats of the bus (previously reserved for whites only) and a white man sitting peacefully behind her, proving the laws had changed.",
    "goldAnswer": "This image represents the dismantling of the Jim Crow system shown in Topic 1.1. By refusing to comply with segregated seating, activists forced a Supreme Court ruling (Browder v. Gayle) that declared segregated transit unconstitutional, legally removing signs like the one in Topic 1.1."
  },
  "subtopic_1_3": {
    "prevSubtopicId": "subtopic_1_2",
    "prevSubtopicTitle": "Topic 1.2: The Montgomery Bus Boycott",
    "image": "assets/sources/little-rock-protest-1957.jpg",
    "provenance": "A protestor outside Central High School holding a sign opposing school integration, Little Rock, Arkansas, September 1957.",
    "seeThinkWonder": {
      "see": "Look at the text on the sign and the facial expressions of the protestors.",
      "think": "Who is the protestor blaming for school integration, and what does this tell us about Southern views of federal authority?",
      "wonder": "Why would local Southern parents view desegregated schools as a threat to their community?"
    },
    "bronze": "How long did the Montgomery Bus Boycott last, and what legal ruling officially ended it?",
    "silver": "Study the source image. Identify two arguments segregationists used to oppose school integration, based on the protestor's sign.",
    "gold": "How did the Southern response to Brown v. Board (Topic 1.1) directly lead to the protest and resistance shown in this Little Rock image?",
    "keywords": ["Governor Faubus", "101st Airborne", "Brown II", "Southern Manifesto"],
    "bronzeAnswer": "The Montgomery Bus Boycott lasted 381 days and was officially ended by the Supreme Court's Browder v. Gayle decision in late 1956.",
    "silverAnswer": "The sign argues that (1) integration is being forced by a 'dictator' (federal overreach), and (2) desegregation is a threat to the education and culture of white children ('stolen' school).",
    "goldAnswer": "Following the Brown ruling (Topic 1.1), Southern politicians signed the Southern Manifesto and vowed 'massive resistance'. When the Supreme Court issued Brown II ordering integration 'with all deliberate speed', Southern boards exploited this loophole to delay integration, leading to angry public protests and state defiance in Little Rock."
  },
  "subtopic_1_4": {
    "prevSubtopicId": "subtopic_1_3",
    "prevSubtopicTitle": "Topic 1.3: Little Rock Central High School",
    "image": "assets/sources/greensboro-sit-in-counter.jpg",
    "provenance": "Student activists enduring harassment during the Greensboro Woolworth's lunch counter sit-in, February 1960.",
    "seeThinkWonder": {
      "see": "Look at the students sitting at the counter and the crowd of white youths standing directly behind them.",
      "think": "Why did the activists refuse to react or retaliate when food and liquids were poured over them?",
      "wonder": "How did student-led groups like SNCC organize such highly disciplined campaigns?"
    },
    "bronze": "Why did President Eisenhower feel compelled to send the 101st Airborne Division to Little Rock in 1957, despite his personal reluctance?",
    "silver": "Study the source image. Identify two ways white segregationists are harassing the Black students at the counter.",
    "gold": "Contrast the student sit-ins with the Montgomery Bus Boycott (Topic 1.2). How did the sit-in strategy differ in its target, speed of mobilization, and direct confrontation?",
    "keywords": ["SNCC", "Woolworth's", "Direct Action", "Desegregation"],
    "bronzeAnswer": "Eisenhower sent the troops because Governor Faubus used the state National Guard to defy a federal court order, forcing the President to uphold federal authority and the Constitution.",
    "silverAnswer": "White segregationists are (1) crowding closely behind the students to intimidate them, and (2) pouring sugar, condiments, and liquids over their heads and clothes.",
    "goldAnswer": "While the Montgomery boycott (Topic 1.2) was a year-long economic withdrawal that avoided direct physical confrontation, the sit-ins were immediate, high-risk confrontations designed to occupy segregated spaces and force business owners to either integrate or call the police, drawing instant national attention."
  },
  "subtopic_2_1": {
    "prevSubtopicId": "subtopic_1_4",
    "prevSubtopicTitle": "Topic 1.4: Greensboro Sit-ins & SNCC",
    "image": "assets/sources/freedom-riders-bus-wreckage.jpg",
    "provenance": "Smoking wreckage of a Greyhound bus carrying Freedom Riders firebombed in Anniston, Alabama, 14 May 1961.",
    "seeThinkWonder": {
      "see": "Examine the completely gutted bus interior and the smoke rising from the windows.",
      "think": "What does this firebombing reveal about how far white supremacists were willing to go to stop integration?",
      "wonder": "What was the reaction of the federal government when national media broadcasted this image?"
    },
    "bronze": "What student-led civil rights organization was founded in 1960 to coordinate sit-ins and voter registration?",
    "silver": "Study the source image. Identify two visual clues suggesting that the passengers on this bus faced extreme, life-threatening danger.",
    "gold": "Why did CORE launch the Freedom Rides to test interstate transit desegregation in 1961, when segregation was already ruled illegal in Browder v. Gayle (Topic 1.2)?",
    "keywords": ["CORE", "Freedom Riders", "Interstate Commerce", "Anniston Mobs"],
    "bronzeAnswer": "The Student Nonviolent Coordinating Committee (SNCC) was founded in 1960.",
    "silverAnswer": "The bus is (1) completely gutted by fire with smoke pouring out, and (2) surrounded by debris from a violent attack, indicating the bus was trapped and burned.",
    "goldAnswer": "Although the Supreme Court had ruled segregation in interstate travel illegal (Browder v. Gayle, Topic 1.2), Southern states openly ignored the federal law and kept terminals segregated. CORE launched the Freedom Rides to force the federal government to actively enforce its own laws by provoking a crisis that the Kennedy administration could not ignore."
  },
  "subtopic_2_2": {
    "prevSubtopicId": "subtopic_2_1",
    "prevSubtopicTitle": "Topic 2.1: Freedom Riders & James Meredith",
    "image": "assets/sources/mlk-dream-speech-1963.jpg",
    "provenance": "Dr. King speaking to the massive crowd at the Lincoln Memorial during the March on Washington, 28 August 1963.",
    "seeThinkWonder": {
      "see": "Look at the sheer density of the crowd surrounding the Reflecting Pool and the Lincoln Memorial.",
      "think": "Why did civil rights leaders choose the Lincoln Memorial as the stage for this mass protest?",
      "wonder": "How did this demonstration pressure President Kennedy to introduce the Civil Rights Bill?"
    },
    "bronze": "Describe the federal intervention required to safely enroll James Meredith at the University of Mississippi ('Ole Miss') in 1962.",
    "silver": "Study the source image. Identify two details suggesting that the March on Washington represented a massive, unified coalition.",
    "gold": "How did the escalation of protests from the Greensboro Sit-ins (Topic 1.4) lead directly to the massive mobilization and legislative demands shown in this March on Washington photo?",
    "keywords": ["Lincoln Memorial", "I Have a Dream", "Civil Rights Bill", "SCLC"],
    "bronzeAnswer": "President Kennedy had to send 30,000 federal troops, marshals, and national guardsmen to secure Meredith's safety after white mobs rioted.",
    "silverAnswer": "The image shows (1) a massive crowd of over 250,000 people packed tightly together, and (2) protestors of diverse backgrounds united at a single national monument.",
    "goldAnswer": "The student sit-ins of 1960 (Topic 1.4) sparked a wave of direct action that grew into the Freedom Rides (1961) and the Birmingham Campaign (1963). This continuous escalation mobilized hundreds of thousands of people, forcing national civil rights groups to unite in a massive march to demand comprehensive federal legislation."
  },
  "subtopic_2_3": {
    "prevSubtopicId": "subtopic_2_2",
    "prevSubtopicTitle": "Topic 2.2: Birmingham & March on Washington",
    "image": "assets/sources/selma-troopers-bridge.jpg",
    "provenance": "State troopers facing civil rights marchers on the Edmund Pettus Bridge in Selma, Alabama, during 'Bloody Sunday', 7 March 1965.",
    "seeThinkWonder": {
      "see": "Compare the protective gear of the state troopers with the clothing of the marchers.",
      "think": "Why did the troopers wait at the bridge rather than stopping the march at its starting point?",
      "wonder": "How did the televised broadcast of this stand-off shift public opinion in favor of the Voting Rights Act?"
    },
    "bronze": "State the name of the Birmingham Police Chief whose brutal actions against child marchers in 1963 shocked the nation.",
    "silver": "Study the source image. Identify two details indicating the state authorities were prepared to use physical force against the marchers.",
    "gold": "Compare the federal intervention in Selma (1965) to Eisenhower's action at Little Rock in 1957 (Topic 1.3). How did media coverage force presidential action in both cases?",
    "keywords": ["Bloody Sunday", "Edmund Pettus Bridge", "Voter Registration", "Voting Rights Act"],
    "bronzeAnswer": "The Birmingham Police Chief was Eugene 'Bull' Connor.",
    "silverAnswer": "The state troopers are equipped with (1) riot helmets, gas masks, and clubs (billy clubs), and (2) are lined up in a solid wall block to physically obstruct the marchers.",
    "goldAnswer": "In both Selma and Little Rock (Topic 1.3), state governors openly defied civil rights. In both cases, shocking media coverage (television broadcasts of white mobs in Little Rock and troopers beating marchers in Selma) provoked national outrage, forcing the Presidents (Eisenhower and Johnson) to intervene with federal authority."
  },
  "subtopic_2_4": {
    "prevSubtopicId": "subtopic_2_3",
    "prevSubtopicTitle": "Topic 2.3: Selma & Voting Rights Act",
    "image": "assets/sources/malcolm-x-speaking.jpg",
    "provenance": "Malcolm X speaking at an outdoor rally, advocating self-defense and Black nationalism, circa 1964.",
    "seeThinkWonder": {
      "see": "Observe Malcolm X's posture and the microphone setup at the rally.",
      "think": "How does his focus on self-defense differ from the non-violent philosophy of Martin Luther King Jr.?",
      "wonder": "Why did his message resonate so deeply with young Black Americans living in Northern cities?"
    },
    "bronze": "What landmark piece of federal legislation was passed as a direct consequence of the Selma marches in 1965?",
    "silver": "Study the source image. Identify two details indicating Malcolm X is addressing a public grassroots crowd rather than a formal courtroom.",
    "gold": "How did the slow pace of economic progress in Northern cities after the legal victories of the Montgomery Bus Boycott (Topic 1.2) fuel the rise of Malcolm X's Black Nationalist ideology?",
    "keywords": ["Black Nationalism", "Self-Defense", "Nation of Islam", "Black Power"],
    "bronzeAnswer": "The Voting Rights Act of 1965 was passed as a direct consequence of the Selma marches.",
    "silverAnswer": "The image shows (1) Malcolm X speaking outdoors with trees in the background, and (2) multiple microphones from different media outlets and organizations set up on a simple stand.",
    "goldAnswer": "Legal victories like the Montgomery Bus Boycott (Topic 1.2) and the Civil Rights Act ended legal segregation in the South, but did not solve Northern problems of poverty, unemployment, and police brutality. Malcolm X's focus on economic self-reliance and self-defense appealed to Northern Blacks who felt non-violence had failed to improve their daily lives."
  },
  "subtopic_3_1": {
    "prevSubtopicId": "subtopic_2_4",
    "prevSubtopicTitle": "Topic 2.4: Black Power & Malcolm X",
    "image": "assets/sources/ngo-dinh-diem-parade.jpg",
    "provenance": "President Ngo Dinh Diem of South Vietnam during an official military parade in Saigon, late 1950s.",
    "seeThinkWonder": {
      "see": "Observe Diem riding in the open-top vehicle surrounded by military officers.",
      "think": "What image of stability and control is the Diem regime attempting to project here?",
      "wonder": "How did Diem's Catholicism and nepotism undermine the military strength shown in this parade?"
    },
    "bronze": "Name the revolutionary Black organization founded in Oakland in 1966 that rejected SCLC's non-violence.",
    "silver": "Study the source image. Identify two visual details that indicate Diem relied heavily on military force to maintain his regime.",
    "gold": "Connect the Buddhist Crisis of 1963 (Topic 3.1) to the SCLC's strategy of provoking police violence in Birmingham (Topic 2.2). How did both use media images of suffering to achieve political goals?",
    "keywords": ["Geneva Accords", "17th Parallel", "Ngo Dinh Diem", "Buddhist Crisis"],
    "bronzeAnswer": "The organization was the Black Panther Party (founded by Huey Newton and Bobby Seale).",
    "silverAnswer": "The image shows Diem (1) riding in a military parade, and (2) surrounded by heavily armed officers and armored transport, showing his dependence on military power.",
    "goldAnswer": "Both campaigns relied on media exposure of violence to shock public opinion. In Birmingham (Topic 2.2), SCLC knew Bull Connor's brutality would build support for civil rights. In South Vietnam, the Buddhist crisis and Thich Quang Duc's self-immolation exposed Diem's tyranny, forcing the US government to withdraw its support for his regime."
  },
  "subtopic_3_2": {
    "prevSubtopicId": "subtopic_3_1",
    "prevSubtopicTitle": "Topic 3.1: US Involvement & Diem",
    "image": "assets/sources/uss-maddox.jpg",
    "provenance": "The USS Maddox, the destroyer involved in the Gulf of Tonkin incidents in August 1964.",
    "seeThinkWonder": {
      "see": "Observe the guns and radar equipment on the USS Maddox.",
      "think": "Why was a US destroyer patrolling so close to North Vietnamese territorial waters in 1964?",
      "wonder": "How did the events involving this ship change the nature of the Vietnam War?"
    },
    "bronze": "What theory, coined by President Eisenhower, argued that if South Vietnam fell to communism, its neighbors would follow?",
    "silver": "Study the source image. Identify two details indicating the USS Maddox was equipped for conventional naval combat and surveillance.",
    "gold": "How did Diem's failure to defeat the Vietcong using the Strategic Hamlet Program (Topic 3.1) lead directly to the escalation and naval presence shown in this Gulf of Tonkin photo?",
    "keywords": ["USS Maddox", "Gulf of Tonkin Resolution", "Advisors", "Escalation"],
    "bronzeAnswer": "The Domino Theory.",
    "silverAnswer": "The USS Maddox is equipped with (1) large naval guns (turrets) for combat, and (2) advanced radar and antenna masts for electronic surveillance.",
    "goldAnswer": "Diem's failure and the collapse of the Strategic Hamlet Program (Topic 3.1) allowed the Vietcong to control large areas of South Vietnam. To prevent a total communist victory, President Johnson had to shift from sending advisory aid to directly patrolling the coast, leading to the Maddox incident and full military escalation."
  },
  "subtopic_3_3": {
    "prevSubtopicId": "subtopic_3_2",
    "prevSubtopicTitle": "Topic 3.2: Escalation & Gulf of Tonkin",
    "image": "assets/sources/agent-orange-spraying-c123.jpg",
    "provenance": "US C-123 aircraft spraying Agent Orange defoliant over South Vietnamese forests, 1966.",
    "seeThinkWonder": {
      "see": "Look at the thick chemical clouds trailing behind the aircraft.",
      "think": "How does spraying chemicals from the air reflect a change in US strategy in the face of jungle warfare?",
      "wonder": "What were the long-term health and environmental consequences for civilians and soldiers on the ground?"
    },
    "bronze": "What resolution did Congress pass in August 1964 giving President Johnson near-unlimited authority to wage war?",
    "silver": "Study the source image. Identify two visual details indicating this was a systematic, large-scale chemical operation.",
    "gold": "How did the Vietcong's strategy of gaining local peasant support (Topic 3.1) force the US to adopt destructive chemical tactics like Agent Orange to strip away their cover and crop supplies?",
    "keywords": ["Operation Rolling Thunder", "Search & Destroy", "Agent Orange", "Operation Ranch Hand"],
    "bronzeAnswer": "The Gulf of Tonkin Resolution.",
    "silverAnswer": "The image shows (1) a formation of three military transport planes flying in unison, and (2) wide, continuous chemical trails covering a vast stretch of forest canopy.",
    "goldAnswer": "Because the Vietcong relied on the local peasantry (Topic 3.1) for food and used the dense jungle for cover, US conventional forces could not find them. The US military adopted Agent Orange to destroy the jungle canopy (cover) and destroy crops to starve the guerrillas, despite alienating local civilians."
  },
  "subtopic_3_4": {
    "prevSubtopicId": "subtopic_3_3",
    "prevSubtopicTitle": "Topic 3.3: US Tactics (Rolling Thunder / Search & Destroy)",
    "image": "assets/sources/ho-chi-minh-trail-bicycles.jpg",
    "provenance": "Vietcong porters pushing heavily loaded cargo bicycles along the Ho Chi Minh Trail under jungle cover, circa 1967.",
    "seeThinkWonder": {
      "see": "Observe how the bicycles are modified with poles to carry massive loads of supplies.",
      "think": "Why did the Vietcong rely on footpaths and bicycles rather than modern trucks and paved roads?",
      "wonder": "How did this low-tech supply line survive years of intense US aerial bombardment?"
    },
    "bronze": "State two major US military tactics used to locate and destroy Vietcong forces in the jungle.",
    "silver": "Study the source image. Identify two details indicating the low-tech yet highly organized nature of Vietcong logistics.",
    "gold": "Contrast the Vietcong's logistics with the conventional US tactics studied in Topic 3.3. Why was the US bombing (Operation Rolling Thunder) ineffective against this trail?",
    "keywords": ["Guerrilla Warfare", "Ho Chi Minh Trail", "Booby Traps", "Attrition"],
    "bronzeAnswer": "The tactics were (1) Search and Destroy missions, and (2) the spraying of chemical defoliants like Agent Orange.",
    "silverAnswer": "The porters are (1) using modified bicycles to carry hundreds of pounds of gear, and (2) traveling along narrow, unpaved dirt tracks hidden under dense jungle canopy.",
    "goldAnswer": "US tactics (Topic 3.3) relied on heavy bombing of industrial targets. However, the Ho Chi Minh Trail was a decentralized, hidden network of dirt paths. When a path was bombed, Vietcong engineers repaired it immediately. Using simple bicycles and human porters meant they did not rely on fuel depots or paved roads."
  },
  "subtopic_4_1": {
    "prevSubtopicId": "subtopic_3_4",
    "prevSubtopicTitle": "Topic 3.4: Vietcong Tactics & Tet Offensive",
    "image": "assets/sources/antiwar-pentagon-protest-1967.jpg",
    "provenance": "Anti-war demonstrators facing military police outside the Pentagon, October 1967.",
    "seeThinkWonder": {
      "see": "Observe the proximity of the young protestors to the armed military police guard line.",
      "think": "Why would protestors target the Pentagon rather than local draft board offices?",
      "wonder": "How did images of armed soldiers facing young civilians affect public support for the war?"
    },
    "bronze": "In what year was the Tet Offensive launched, and how did it affect President Johnson's political career?",
    "silver": "Study the source image. Identify two details showing that this protest was a direct confrontation between young civilians and state military power.",
    "gold": "How did the introduction of the televised Selective Service Draft Lottery (Topic 4.1) escalate campus protests compared to the earlier civil rights student protests like the Greensboro Sit-ins (Topic 1.4)?",
    "keywords": ["Draft Resistance", "SDS", "Pentagon Protest", "Credibility Gap"],
    "bronzeAnswer": "The Tet Offensive was launched in 1968. It shattered public confidence in the war and forced Johnson to announce he would not run for re-election.",
    "silverAnswer": "The image shows (1) young civilian protestors standing inches away from a solid line of (2) armed military police holding rifles and wearing combat gear.",
    "goldAnswer": "Unlike the Greensboro sit-ins (Topic 1.4) which targeted local businesses to end segregation, the draft lottery directly threatened the lives of all young college-aged men. The threat of being drafted into a deadly, unpopular war mobilized a much wider and more angry student base, turning protests into national strikes."
  },
  "subtopic_4_2": {
    "prevSubtopicId": "subtopic_4_1",
    "prevSubtopicTitle": "Topic 4.1: Rise of the Anti-War Movement",
    "image": "assets/sources/nixon-visiting-troops.jpg",
    "provenance": "President Richard Nixon visiting US troops in South Vietnam, July 1969.",
    "seeThinkWonder": {
      "see": "Observe Nixon standing on a vehicle surrounded by smiling, cheering American soldiers.",
      "think": "What political message is the Nixon administration attempting to send to voters back home through this photo?",
      "wonder": "How did this visit contrast with the secret bombing campaigns Nixon was launching in Cambodia?"
    },
    "bronze": "What is a 'credibility gap,' and how did the My Lai Massacre (1968) widen it?",
    "silver": "Study the source image. Identify two details indicating the visit was carefully staged to project troop morale and support for the President.",
    "gold": "How did the anti-war movement's arguments about the draft and casualties (Topic 4.1) pressure Nixon into adopting the policy of Vietnamization?",
    "keywords": ["Vietnamization", "Cambodian Incursion", "Kent State", "Withdrawal"],
    "bronzeAnswer": "A credibility gap is the difference between government claims and the actual reality. My Lai widened it because the military attempted to cover up the slaughter of hundreds of civilians.",
    "silverAnswer": "The image shows (1) Nixon positioned high on a vehicle to be visible to the entire crowd, and (2) soldiers smiling and holding up cameras, creating a positive public relations image.",
    "goldAnswer": "The anti-war movement (Topic 4.1) had made the war politically toxic due to high casualties and the draft. To survive politically, Nixon had to show he was ending American involvement. Vietnamization allowed him to withdraw US ground troops (reducing draft calls and casualties) while claiming he was not surrendering."
  },
  "subtopic_4_3": {
    "prevSubtopicId": "subtopic_4_2",
    "prevSubtopicTitle": "Topic 4.2: Vietnamization & Cambodia",
    "image": "assets/sources/pro-war-rally-nyc.jpg",
    "provenance": "Pro-war demonstrators marching in support of Nixon's Vietnam policies, 1970.",
    "seeThinkWonder": {
      "see": "Observe the text on the banners and the American flags carried by the marchers.",
      "think": "Why did blue-collar workers feel alienated by and hostile toward student anti-war protestors?",
      "wonder": "How did Nixon capitalize on this patriotism to build his political coalition?"
    },
    "bronze": "Why did Nixon's invasion of Cambodia in April 1970 trigger a national student strike and the Kent State shootings?",
    "silver": "Study the source image. Identify two phrases indicating the marchers support Nixon's military policies and oppose anti-war activists.",
    "gold": "Connect this pro-war rally of blue-collar workers back to the Watts and Detroit urban riots (Topic 2.4). What social and class divisions in the US did both events expose?",
    "keywords": ["Silent Majority", "Hard Hat Riots", "Law and Order", "Labor Patriotism"],
    "bronzeAnswer": "The invasion expanded the war into a neutral country, which directly contradicted Nixon's promises of de-escalation, triggering mass outrage.",
    "silverAnswer": "The banners read (1) 'Support Our Men in Vietnam' (pro-troop) and (2) 'Support Our President' (pro-government policy).",
    "goldAnswer": "Both events exposed deep social divisions. The urban riots (Topic 2.4) exposed racial and economic neglect of Black Americans in inner cities. The pro-war construction worker rallies exposed a deep class divide between working-class patriots (who felt a duty to support the government) and middle-class student protestors."
  },
  "subtopic_4_4": {
    "prevSubtopicId": "subtopic_4_3",
    "prevSubtopicTitle": "Topic 4.3: Support for the War & Silent Majority",
    "image": "assets/sources/saigon-embassy-evacuation.jpg",
    "provenance": "Evacuation of American personnel and South Vietnamese refugees by helicopter from the US Embassy roof in Saigon, 29 April 1975.",
    "seeThinkWonder": {
      "see": "Look at the line of people climbing the ladder to board the single helicopter on the roof.",
      "think": "What does the desperate nature of this evacuation tell us about the speed of the South Vietnamese collapse?",
      "wonder": "Why did the US military refuse to send air support to stop the North Vietnamese offensive?"
    },
    "bronze": "Who did Nixon refer to as the 'Silent Majority', and how did he use them to counter anti-war protests?",
    "silver": "Study the source image. Identify two details indicating the final US withdrawal from Saigon was chaotic and desperate.",
    "gold": "Connect the fall of South Vietnam in 1975 to the initial advisory role in 1954 under Eisenhower (Topic 3.1). How did the failure of Diem's Catholic regime prefigure this final collapse?",
    "keywords": ["Paris Peace Accords", "Henry Kissinger", "Fall of Saigon", "Decent Interval"],
    "bronzeAnswer": "The Silent Majority were patriotic Americans who supported the war but did not protest. Nixon appealed to them to show he had popular support, isolating anti-war activists.",
    "silverAnswer": "The image shows (1) a long line of refugees desperately climbing a single, narrow ladder, and (2) an evacuation from a rooftop, showing that ground escape routes were blocked.",
    "goldAnswer": "The collapse of 1975 was prefigured by Diem's regime (Topic 3.1). Diem failed to build a democratic, popular government, creating corruption and sectarian divide. The ARVN remained corrupt and politically dependent on US money and air power. When the US withdrew, the state collapsed instantly."
  }
};

// Inject advancedDoNow into each subtopic
for (let key in advancedDoNowData) {
  if (lessons[key]) {
    lessons[key].doNowStarter = advancedDoNowData[key];
  } else {
    console.warn(`Key ${key} not found in LESSONS_DATA!`);
  }
}

// Convert global.LESSONS_DATA back to esmodule format
const outputCode = 'export const LESSONS_DATA = ' + JSON.stringify(lessons, null, 2) + ';\n';
fs.writeFileSync(targetFilePath, outputCode, 'utf8');
console.log('Successfully injected advanced doNowStarter to lessons_data.js!');
