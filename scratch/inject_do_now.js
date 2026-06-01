const fs = require('fs');
const path = require('path');

const targetFilePath = 'c:/Users/fives/.gemini/antigravity/scratch/paper3_usa_recall_quizzes/src/lessons_data.js';
console.log('Reading from:', targetFilePath);

let content = fs.readFileSync(targetFilePath, 'utf8');

// Strip "export const LESSONS_DATA = " to parse it as raw JS/JSON
let cleanContent = content.replace(/export\s+const\s+LESSONS_DATA\s*=\s*/, 'global.LESSONS_DATA = ');
eval(cleanContent); // This will define global.LESSONS_DATA

const lessons = global.LESSONS_DATA;

const doNowData = {
  "subtopic_1_1": {
    "prevSubtopicId": null,
    "prevSubtopicTitle": null,
    "image": "assets/sources/colored-waiting-room-sign.jpg",
    "provenance": "A Jim Crow sign designating a segregated 'Colored Waiting Room' in a bus terminal in the Southern United States, circa 1950s.",
    "questions": [
      "What does this sign tell us about the nature of segregation under the Jim Crow laws in the South?",
      "How did the 1896 Plessy v. Ferguson ruling justify this type of public division?"
    ],
    "answers": [
      "It demonstrates strict, legal separation of public facilities based on race, where facilities for Black Americans were almost always inferior.",
      "It established the 'separate but equal' doctrine, claiming segregation was constitutional as long as facilities provided for both races were equal (which they rarely were)."
    ]
  },
  "subtopic_1_2": {
    "prevSubtopicId": "subtopic_1_1",
    "prevSubtopicTitle": "Topic 1.1: Segregation & Brown v. Board",
    "image": "assets/sources/rosa-parks-bus-1956.jpg",
    "provenance": "A photograph of Rosa Parks riding in the front of a Montgomery bus in December 1956, after the Supreme Court segregation ban took effect.",
    "questions": [
      "How did the NAACP's legal victory in Brown v. Board (1954) inspire grassroots civil rights activists in Montgomery?",
      "Why did civil rights leaders need a highly respectable figure like Rosa Parks to launch their challenge against segregated transit?"
    ],
    "answers": [
      "The legal victory showed that segregation could be successfully defeated in federal courts, proving the Supreme Court was receptive to civil rights arguments.",
      "Parks was a respected, middle-class NAACP activist. Her clean record made it impossible for segregationists to assassinate her character, making her the perfect legal test case."
    ]
  },
  "subtopic_1_3": {
    "prevSubtopicId": "subtopic_1_2",
    "prevSubtopicTitle": "Topic 1.2: The Montgomery Bus Boycott",
    "image": "assets/sources/little-rock-protest-1957.jpg",
    "provenance": "A protestor outside Central High School holding a sign opposing school integration, Little Rock, Arkansas, September 1957.",
    "questions": [
      "How did the Montgomery Bus Boycott show the power of economic and non-violent direct action?",
      "Why did the Supreme Court have to issue a second Brown decision ('Brown II'), and how did this lead to the crisis at Little Rock?"
    ],
    "answers": [
      "It showed that when Black communities organized collectively and withheld their business, they could force transport systems to integrate due to financial losses and federal rulings.",
      "Southern school boards stalled desegregation, exploiting the vague phrase 'with all deliberate speed' to delay integration. This emboldened Governor Faubus of Arkansas to block the Little Rock Nine."
    ]
  },
  "subtopic_1_4": {
    "prevSubtopicId": "subtopic_1_3",
    "prevSubtopicTitle": "Topic 1.3: Little Rock Central High School",
    "image": "assets/sources/greensboro-sit-in-counter.jpg",
    "provenance": "Student activists enduring harassment during the Greensboro Woolworth's lunch counter sit-in, February 1960.",
    "questions": [
      "Why did President Eisenhower feel compelled to send federal troops to Little Rock in 1957, despite his personal reluctance to enforce integration?",
      "What role did television play in changing public opinions during the Little Rock crisis?"
    ],
    "answers": [
      "Governor Faubus had used state National Guard troops to openly defy a federal court order, forcing Eisenhower to protect federal authority and the US Constitution.",
      "Television broadcasts showed white mobs screaming abuse at dignified Black children, shocking national and international audiences and building support for civil rights."
    ]
  },
  "subtopic_2_1": {
    "prevSubtopicId": "subtopic_1_4",
    "prevSubtopicTitle": "Topic 1.4: Greensboro Sit-ins & SNCC",
    "image": "assets/sources/freedom-riders-bus-wreckage.jpg",
    "provenance": "Smoking wreckage of a Greyhound bus carrying Freedom Riders firebombed in Anniston, Alabama, 14 May 1961.",
    "questions": [
      "How did the Greensboro sit-ins mark a shift towards student-led direct action in the civil rights movement?",
      "What was the significance of forming the Student Nonviolent Coordinating Committee (SNCC) in 1960?"
    ],
    "answers": [
      "They showed that young, student activists were willing to confront segregation directly and put themselves in danger, moving faster than older, legalistic organizations.",
      "SNCC gave students their own independent voice and organization, allowing them to focus on direct action and voter registration in the deep South."
    ]
  },
  "subtopic_2_2": {
    "prevSubtopicId": "subtopic_2_1",
    "prevSubtopicTitle": "Topic 2.1: Freedom Riders & James Meredith",
    "image": "assets/sources/mlk-dream-speech-1963.jpg",
    "provenance": "Dr. King speaking to the massive crowd at the Lincoln Memorial during the March on Washington, 28 August 1963.",
    "questions": [
      "Why did the Freedom Riders deliberately travel through Alabama and Mississippi, and what reaction did they hope to provoke?",
      "How did President Kennedy react to the state-level defiance of Mississippi Governor Ross Barnett during James Meredith's integration?"
    ],
    "answers": [
      "They wanted to test whether interstate transit facilities were actually integrated. They hoped to provoke segregationist violence to force the federal government to enforce federal law.",
      "Kennedy sent in 30,000 federal troops, marshals, and national guardsmen to secure Meredith's safety, asserting federal supremacy over state defiance."
    ]
  },
  "subtopic_2_3": {
    "prevSubtopicId": "subtopic_2_2",
    "prevSubtopicTitle": "Topic 2.2: Birmingham & March on Washington",
    "image": "assets/sources/selma-troopers-bridge.jpg",
    "provenance": "State troopers facing civil rights marchers on the Edmund Pettus Bridge in Selma, Alabama, during 'Bloody Sunday', 7 March 1965.",
    "questions": [
      "Why did Martin Luther King Jr. choose Birmingham, Alabama, for a major protest campaign in 1963?",
      "What did the massive March on Washington (1963) show about the scale and composition of the civil rights coalition?"
    ],
    "answers": [
      "Birmingham was known as the most segregated city in America, and Police Chief 'Bull' Connor was highly reactive and likely to use violence, which would attract media coverage.",
      "It showed that the movement was a massive, diverse coalition of over 250,000 people, including around 60,000 white supporters, labor unions, and religious groups."
    ]
  },
  "subtopic_2_4": {
    "prevSubtopicId": "subtopic_2_3",
    "prevSubtopicTitle": "Topic 2.3: Selma & Voting Rights Act",
    "image": "assets/sources/malcolm-x-speaking.jpg",
    "provenance": "Malcolm X speaking at an outdoor rally, advocating self-defense and Black nationalism, circa 1964.",
    "questions": [
      "How did the police violence on the Edmund Pettus Bridge during 'Bloody Sunday' (1965) help secure the Voting Rights Act?",
      "What was the main objective of the 1964 'Freedom Summer' campaign in Mississippi?"
    ],
    "answers": [
      "Television footage of state troopers beating peaceful marchers shocked the nation and forced President Johnson to deliver a televised address demanding voting rights legislation.",
      "It aimed to register as many Black voters as possible in Mississippi, which had the lowest registration rate, while exposing the violence and intimidation Black voters faced."
    ]
  },
  "subtopic_3_1": {
    "prevSubtopicId": "subtopic_2_4",
    "prevSubtopicTitle": "Topic 2.4: Black Power & Malcolm X",
    "image": "assets/sources/ngo-dinh-diem-parade.jpg",
    "provenance": "President Ngo Dinh Diem of South Vietnam during an official military parade in Saigon, late 1950s.",
    "questions": [
      "What key differences existed between the goals of Malcolm X and the goals of Martin Luther King Jr.?",
      "What factors triggered the major urban riots in Detroit, Newark, and Watts between 1965 and 1968?"
    ],
    "answers": [
      "MLK campaigned for non-violent integration and civil rights within the US legal system. Malcolm X advocated Black nationalism, self-defense, and economic self-reliance, rejecting forced integration.",
      "Widespread poverty, poor housing, police brutality, unemployment, and a sense that legal civil rights acts had not improved daily life in northern inner-city ghettos."
    ]
  },
  "subtopic_3_2": {
    "prevSubtopicId": "subtopic_3_1",
    "prevSubtopicTitle": "Topic 3.1: US Involvement & Diem",
    "image": "assets/sources/uss-maddox.jpg",
    "provenance": "The USS Maddox, the destroyer involved in the Gulf of Tonkin incidents in August 1964.",
    "questions": [
      "How did the Domino Theory justify US aid to South Vietnam under President Eisenhower?",
      "Why did Ngo Dinh Diem's Catholic-dominated government face a severe crisis and Buddhist protests in 1963?"
    ],
    "answers": [
      "The Domino Theory argued that if South Vietnam fell to communism, neighboring countries (Laos, Cambodia, Thailand) would also fall like a row of dominoes.",
      "Diem discriminated heavily against the Buddhist majority, banning their flag, arresting monks, and nepotistically giving government and military posts to his Catholic relatives."
    ]
  },
  "subtopic_3_3": {
    "prevSubtopicId": "subtopic_3_2",
    "prevSubtopicTitle": "Topic 3.2: Escalation & Gulf of Tonkin",
    "image": "assets/sources/agent-orange-spraying-c123.jpg",
    "provenance": "US C-123 aircraft spraying Agent Orange defoliant over South Vietnamese forests, 1966.",
    "questions": [
      "What authority did the Gulf of Tonkin Resolution (1964) give President Johnson, and why was it controversial?",
      "What was the significance of the US Marine landing at Da Nang in March 1965?"
    ],
    "answers": [
      "It authorized him to take 'all necessary measures' to defend US forces and prevent aggression, effectively giving him a blank check to wage war without a formal declaration by Congress.",
      "It marked the official change in the US role from advising the South Vietnamese army (ARVN) to active combat troop deployment."
    ]
  },
  "subtopic_3_4": {
    "prevSubtopicId": "subtopic_3_3",
    "prevSubtopicTitle": "Topic 3.3: US Tactics (Rolling Thunder / Search & Destroy)",
    "image": "assets/sources/ho-chi-minh-trail-bicycles.jpg",
    "provenance": "Vietcong porters pushing heavily loaded cargo bicycles along the Ho Chi Minh Trail under jungle cover, circa 1967.",
    "questions": [
      "Why did the US rely so heavily on chemical defoliants like Agent Orange and Napalm?",
      "What were the main strategic limitations of 'Search and Destroy' missions in South Vietnam?"
    ],
    "answers": [
      "To strip away the dense jungle canopy that hid Vietcong supply routes, and to destroy crops that fed Vietcong combat units.",
      "They were difficult to execute, killed civilians, failed to secure territory, alienated local peasants, and made US troops highly vulnerable to hidden booby traps and ambushes."
    ]
  },
  "subtopic_4_1": {
    "prevSubtopicId": "subtopic_3_4",
    "prevSubtopicTitle": "Topic 3.4: Vietcong Tactics & Tet Offensive",
    "image": "assets/sources/antiwar-pentagon-protest-1967.jpg",
    "provenance": "Anti-war demonstrators facing military police outside the Pentagon, October 1967.",
    "questions": [
      "Why was the Tet Offensive (1968) considered a major turning point in the war, despite being a military defeat for the Vietcong?",
      "How did the Vietcong combat their disadvantage in technology and heavy weapons against US forces?"
    ],
    "answers": [
      "It shattered the US public's belief that the US was winning the war, exposed a 'credibility gap' in government reports, and led President Johnson to seek peace talks and refuse re-election.",
      "They used guerrilla tactics: blending with civilians, building massive underground tunnel networks, using booby traps, and staying close to US lines to prevent US artillery/air strikes."
    ]
  },
  "subtopic_4_2": {
    "prevSubtopicId": "subtopic_4_1",
    "prevSubtopicTitle": "Topic 4.1: Rise of the Anti-War Movement",
    "image": "assets/sources/nixon-visiting-troops.jpg",
    "provenance": "President Richard Nixon visiting US troops in South Vietnam, July 1969.",
    "questions": [
      "Why did the Selective Service draft system provoke intense anger and resistance among student protesters?",
      "How did television coverage affect the public's perception of the Vietnam War compared to previous conflicts?"
    ],
    "answers": [
      "It forced young men to fight in an unpopular war, and the system of college deferments meant working-class and minority men were disproportionately drafted.",
      "It was the first 'television war,' bringing raw footage of casualties, burning villages, and combat directly into living rooms, fueling anti-war sentiment."
    ]
  },
  "subtopic_4_3": {
    "prevSubtopicId": "subtopic_4_2",
    "prevSubtopicTitle": "Topic 4.2: Vietnamization & Cambodia",
    "image": "assets/sources/pro-war-rally-nyc.jpg",
    "provenance": "Pro-war demonstrators marching in support of Nixon's Vietnam policies, 1970.",
    "questions": [
      "What was the goal of Nixon's 'Vietnamization' policy, and was it successful?",
      "Why did Nixon's decision to invade Cambodia in April 1970 provoke massive student protests, including the tragedy at Kent State?"
    ],
    "answers": [
      "It aimed to withdraw US troops while training and equipping South Vietnamese (ARVN) forces to defend their own country. It was largely unsuccessful due to low ARVN morale and corruption.",
      "It appeared to expand the war into a neutral country, contradicting Nixon's promise of de-escalation, which students saw as a betrayal."
    ]
  },
  "subtopic_4_4": {
    "prevSubtopicId": "subtopic_4_3",
    "prevSubtopicTitle": "Topic 4.3: Support for the War & Silent Majority",
    "image": "assets/sources/saigon-embassy-evacuation.jpg",
    "provenance": "Evacuation of American personnel and South Vietnamese refugees by helicopter from the US Embassy roof in Saigon, 29 April 1975.",
    "questions": [
      "Who did Nixon refer to as the 'Silent Majority', and how did he use them politically?",
      "What did the Hard Hat Riots of 1970 reveal about social divisions in the United States over the Vietnam War?"
    ],
    "answers": [
      "The large numbers of patriotic Americans who supported the war and government policies but did not join protests. He used them to demonstrate popular mandate and isolate anti-war activists.",
      "They showed a deep class division between blue-collar construction workers (who supported the government and felt patriotic duty) and middle-class student anti-war demonstrators."
    ]
  }
};

// Inject doNowStarter into each subtopic
for (let key in doNowData) {
  if (lessons[key]) {
    lessons[key].doNowStarter = doNowData[key];
  } else {
    console.warn(`Key ${key} not found in LESSONS_DATA!`);
  }
}

// Convert global.LESSONS_DATA back to esmodule format
const outputCode = 'export const LESSONS_DATA = ' + JSON.stringify(lessons, null, 2) + ';\n';
fs.writeFileSync(targetFilePath, outputCode, 'utf8');
console.log('Successfully injected doNowStarter to lessons_data.js!');
