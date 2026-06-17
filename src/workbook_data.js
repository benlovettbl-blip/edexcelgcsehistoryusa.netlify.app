import { LESSONS_DATA } from './lessons_data.js';

const MASTER_GLOSSARY = {
  "Jim Crow": "Laws in the Southern US enforcing racial segregation and disenfranchisement.",
  "Segregation": "The legal and social separation of people based on race.",
  "Disenfranchisement": "Being deprived of a right or privilege, especially the right to vote.",
  "NAACP": "National Association for the Advancement of Colored People, focused on legal challenges to segregation.",
  "CORE": "Congress of Racial Equality, which pioneered non-violent direct action protests.",
  "De Jure": "Segregation that is enforced by law.",
  "De Facto": "Segregation that exists in practice and custom, rather than by law.",
  "Separate but Equal": "The legal doctrine established by Plessy v. Ferguson (1896) that segregation was constitutional if facilities were equal.",
  "Litigation": "The process of taking legal action in court.",
  "Boycott": "A protest where people refuse to buy, use, or participate in something as a way of expressing disapproval.",
  "Desegregation": "The process of ending the separation of people of different races.",
  "Massive Resistance": "A campaign of laws and policies declared by Southern politicians to block school integration.",
  "Dixiecrats": "Southern Democrats who opposed federal civil rights legislation.",
  "Non-violent direct action": "Peaceful tactics (e.g. sit-ins, marches, boycotts) to achieve political or social goals.",
  "Filibuster": "A tactic in the Senate to delay or block a vote on a bill by speaking for an extended period.",
  "Black Power": "A movement calling for Black pride, self-determination, and social and economic independence.",
  "Black Nationalism": "Advocacy of political and social separation of Black people from white society.",
  "Guerilla Warfare": "Unconventional combat using mobile, surprise attacks (ambushes, sabotage) by small groups.",
  "Defoliant": "A chemical sprayed on plants to strip them of leaves, used to expose enemy hiding spots (e.g., Agent Orange).",
  "Search and Destroy": "US military strategy of seeking out Vietcong units, destroying them, and withdrawing immediately.",
  "Vietnamization": "Nixon's policy of withdrawing US troops and transferring combat responsibility to South Vietnamese forces.",
  "Silent Majority": "Nixon's term for the large, moderate group of Americans who supported the war quietly and opposed protests.",
  "Credibility Gap": "Public skepticism regarding the truth of government reports about the progress of the Vietnam War.",
  "Draft": "Compulsory recruitment for military service.",
  "Strategic Hamlets": "Fortified villages created by the US and Diem to isolate South Vietnamese peasants from the Vietcong.",
  "Peace with Honour": "Nixon's slogan describing his goal of ending the Vietnam War without appearing defeated.",
  "Nationalisation": "The transfer of major private industries or assets to state control.",
  "Napalm": "A highly flammable jellied gasoline used in bombs to clear jungle areas and inflict severe burns.",
  "Vietcong": "The communist guerrilla movement in South Vietnam that fought the US and South Vietnamese government.",
  "Ho Chi Minh Trail": "A network of paths used by North Vietnam to transport supplies and troops to the Vietcong in the South.",
  "SCLC": "Southern Christian Leadership Conference, a civil rights group led by MLK.",
  "SNCC": "Student Nonviolent Coordinating Committee, which organized civil rights sit-ins and marches.",
  "Buddhist Crisis": "A period of political and religious tension in South Vietnam characterized by Buddhist self-immolations protesting Diem's pro-Catholic policies."
};

const CURATED_TIMELINES = {
  "subtopic_1_1": [
    { "date": "1896", "desc": "Plessy v. Ferguson Supreme Court ruling establishes 'separate but equal' doctrine." },
    { "date": "1909", "desc": "NAACP is founded to fight for legal rights and challenge segregation in courts." },
    { "date": "1942", "desc": "CORE (Congress of Racial Equality) is founded, pioneering non-violent direct action." },
    { "date": "1947", "desc": "CORE organizes the 'Journey of Reconciliation' to challenge segregation on interstate buses." },
    { "date": "1950", "desc": "Sweatt v. Painter Supreme Court ruling successfully challenges segregation in law schools." },
    { "date": "1953", "desc": "Earl Warren is appointed Chief Justice of the United States Supreme Court." }
  ],
  "subtopic_1_2": [
    { "date": "May 1954", "desc": "Supreme Court rules unanimously in Brown v. Board of Education that school segregation is unconstitutional." },
    { "date": "May 1955", "desc": "Brown II ruling orders school desegregation to proceed 'with all deliberate speed'." },
    { "date": "1956", "desc": "Autherine Lucy becomes the first Black student at the University of Alabama (later expelled after riots)." },
    { "date": "Sept 1957", "desc": "Orval Faubus deploys Arkansas National Guard to block Little Rock Nine." },
    { "date": "Sept 1957", "desc": "President Eisenhower sends 101st Airborne Division to escort Little Rock Nine." },
    { "date": "Sept 1958", "desc": "Governor Faubus closes all three Little Rock public high schools (the 'Lost Year') to block integration." }
  ],
  "subtopic_1_3": [
    { "date": "Aug 1955", "desc": "Emmett Till is brutally murdered in Mississippi, galvanizing national civil rights activism." },
    { "date": "1 Dec 1955", "desc": "Rosa Parks is arrested in Montgomery for refusing to give up her seat on a segregated bus." },
    { "date": "5 Dec 1955", "desc": "Montgomery Bus Boycott begins, led by the newly formed MIA under Martin Luther King Jr." },
    { "date": "Nov 1956", "desc": "Browder v. Gayle Supreme Court ruling declares segregated buses unconstitutional." },
    { "date": "21 Dec 1956", "desc": "Montgomery buses are integrated, ending the 381-day boycott." },
    { "date": "Jan 1957", "desc": "Southern Christian Leadership Conference (SCLC) is founded by MLK to coordinate protests." }
  ],
  "subtopic_1_4": [
    { "date": "1954", "desc": "White Citizens' Councils are formed across the South to resist school integration." },
    { "date": "1956", "desc": "Southern Manifesto is signed by 101 Southern congressmen, pledging to resist school desegregation." },
    { "date": "1957", "desc": "Strom Thurmond conducts a record-breaking 24-hour filibuster to delay the Civil Rights Act." },
    { "date": "Sept 1957", "desc": "Civil Rights Act of 1957 is passed to protect voter registration (though largely symbolic)." },
    { "date": "1958", "desc": "Governor Faubus closes all Little Rock public schools for the academic year to block integration." }
  ],
  "subtopic_2_1": [
    { "date": "Feb 1960", "desc": "Greensboro Sit-ins begin when four Black students sit at a segregated Woolworth's lunch counter." },
    { "date": "April 1960", "desc": "Student Nonviolent Coordinating Committee (SNCC) is founded to organize youth-led direct action." },
    { "date": "May 1961", "desc": "Freedom Riders set off from Washington D.C. to test integration on interstate buses." },
    { "date": "May 1961", "desc": "Freedom Rider bus is firebombed in Anniston, Alabama, sparking national outrage." },
    { "date": "Nov 1961", "desc": "Interstate Commerce Commission (ICC) issues a ruling banning segregation on interstate terminals." },
    { "date": "Sept 1962", "desc": "James Meredith is escorted by federal marshals to register as the first Black student at Ole Miss." }
  ],
  "subtopic_2_2": [
    { "date": "April 1963", "desc": "Birmingham Campaign is launched; MLK writes 'Letter from Birmingham Jail' after arrest." },
    { "date": "May 1963", "desc": "Children's Crusade in Birmingham is met with police dogs and high-pressure fire hoses." },
    { "date": "Aug 1963", "desc": "March on Washington draws 250,000 demonstrators; MLK delivers his 'I Have a Dream' speech." },
    { "date": "Sept 1963", "desc": "Sixteenth Street Baptist Church is bombed in Birmingham, killing four young Black girls." },
    { "date": "July 1964", "desc": "President Johnson signs Civil Rights Act of 1964, outlawing segregation in public spaces." },
    { "date": "March 1965", "desc": "Selma to Montgomery marches culminate in 'Bloody Sunday' at Edmund Pettus Bridge." },
    { "date": "Aug 1965", "desc": "Voting Rights Act of 1965 is signed into law, outlawing discriminatory literacy tests." }
  ],
  "subtopic_2_3": [
    { "date": "Feb 1965", "desc": "Malcolm X, the prominent Black nationalist leader, is assassinated in New York." },
    { "date": "June 1966", "desc": "Stokely Carmichael popularises the term 'Black Power' during the March Against Fear." },
    { "date": "Oct 1966", "desc": "Huey P. Newton and Bobby Seale found the Black Panther Party in Oakland, California." },
    { "date": "1967", "desc": "Black Panther Party publishes its Ten-Point Program demanding employment, housing, and education." },
    { "date": "Oct 1968", "desc": "Tommie Smith and John Carlos give the Black Power salute at the Mexico City Olympics." },
    { "date": "Dec 1969", "desc": "Black Panther leader Fred Hampton is killed in a police raid in Chicago." }
  ],
  "subtopic_2_4": [
    { "date": "June 1964", "desc": "Three Freedom Summer civil rights workers are abducted and murdered by the KKK in Mississippi." },
    { "date": "Aug 1965", "desc": "Watts Riots in Los Angeles erupt after a police stop, leaving 34 dead." },
    { "date": "July 1967", "desc": "Detroit and Newark riots break out, leading to military intervention and massive damage." },
    { "date": "Feb 1968", "desc": "Kerner Commission report warns that America is dividing into 'two societies, separate and unequal'." },
    { "date": "April 1968", "desc": "MLK is assassinated in Memphis, triggering riots in over 100 US cities; Fair Housing Act is passed." },
    { "date": "June 1968", "desc": "Robert F. Kennedy, a strong supporter of civil rights, is assassinated in Los Angeles." }
  ],
  "subtopic_3_1": [
    { "date": "1954", "desc": "Dien Bien Phu falls to Vietminh; Geneva Accords temporarily divide Vietnam at the 17th parallel." },
    { "date": "1955", "desc": "Ngo Dinh Diem declares himself President of the newly formed Republic of Vietnam (South)." },
    { "date": "1959", "desc": "Ho Chi Minh Trail construction begins to transport supplies from North to South Vietnam." },
    { "date": "1962", "desc": "Strategic Hamlet Program is launched to isolate peasants from communist influence." },
    { "date": "June 1963", "desc": "Buddhist monk Thich Quang Duc self-immolates in Saigon to protest Diem's regime." },
    { "date": "Nov 1963", "desc": "President Diem is assassinated in a US-backed military coup following the Buddhist Crisis." }
  ],
  "subtopic_3_2": [
    { "date": "Aug 1964", "desc": "Gulf of Tonkin Incident: US reports attacks on USS Maddox; Congress passes Gulf of Tonkin Resolution." },
    { "date": "Nov 1964", "desc": "Lyndon B. Johnson wins the US presidential election, defeating Barry Goldwater." },
    { "date": "Feb 1965", "desc": "Vietcong attack US base at Pleiku; President Johnson orders retaliatory airstrikes." },
    { "date": "March 1965", "desc": "First US combat troops (3,500 marines) land at Da Nang." },
    { "date": "Nov 1965", "desc": "Battle of Ia Drang: The first major conventional battle between US and North Vietnamese troops." },
    { "date": "Dec 1965", "desc": "US troop levels in Vietnam reach nearly 200,000." }
  ],
  "subtopic_3_3": [
    { "date": "March 1965", "desc": "Operation Rolling Thunder begins, a massive, long-term US bombing campaign against North Vietnam." },
    { "date": "1966", "desc": "US military intensifies 'Search and Destroy' operations using helicopters to locate Vietcong." },
    { "date": "1967", "desc": "US forces drop massive amounts of defoliants (Agent Orange) and Napalm to clear jungle cover." },
    { "date": "Jan 1968", "desc": "Battle of Khe Sanh begins, drawing US military focus to the demilitarized zone." },
    { "date": "Jan 1968", "desc": "Tet Offensive: Communist forces launch coordinated surprise attacks on cities across South Vietnam." },
    { "date": "March 1968", "desc": "My Lai Massacre: US soldiers kill hundreds of unarmed Vietnamese civilians (kept secret for a year)." }
  ],
  "subtopic_3_4": [
    { "date": "Jan 1969", "desc": "President Nixon takes office, promising 'Peace with Honour' and introducing Vietnamization." },
    { "date": "June 1969", "desc": "Nixon announces the first withdrawal of 25,000 US combat troops from Vietnam." },
    { "date": "April 1970", "desc": "Nixon orders joint US-ARVN invasion of Cambodia to destroy communist sanctuaries." },
    { "date": "Dec 1970", "desc": "US Congress repeals the Gulf of Tonkin Resolution to limit Presidential war-making authority." },
    { "date": "Feb 1971", "desc": "Operation Lam Son 719: ARVN forces invade Laos with US air support but face severe defeat." },
    { "date": "March 1972", "desc": "Easter Offensive: North Vietnam launches major conventional invasion; US responds with massive airstrikes." }
  ],
  "subtopic_4_1": [
    { "date": "Oct 1969", "desc": "Moratorium to End the War in Vietnam draws millions of demonstrators across the USA." },
    { "date": "Nov 1969", "desc": "News of the March 1968 My Lai Massacre is published, shocking the American public." },
    { "date": "May 1970", "desc": "Kent State Shootings: National Guardsmen kill four students during anti-war protests in Ohio." },
    { "date": "April 1971", "desc": "Vietnam Veterans Against the War hold major protests, throwing medals on Capitol steps." },
    { "date": "June 1971", "desc": "Pentagon Papers are leaked to the press, exposing years of government deception regarding Vietnam." },
    { "date": "Dec 1972", "desc": "Nixon orders 'Christmas Bombings' (Operation Linebacker II) of Hanoi and Haiphong." }
  ],
  "subtopic_4_2": [
    { "date": "Nov 1969", "desc": "Nixon appeals to the 'Silent Majority' to support his Vietnam policies in a televised address." },
    { "date": "May 1970", "desc": "Hard Hat Riots: Construction workers attack anti-war protesters in New York City." },
    { "date": "June 1972", "desc": "Watergate break-in occurs, initiating the scandal that would eventually force Nixon's resignation." },
    { "date": "Nov 1972", "desc": "Nixon wins a landslide re-election victory, defeating anti-war candidate George McGovern." },
    { "date": "1973", "desc": "War Powers Act is passed over Nixon's veto, limiting the President's power to wage war without Congress." },
    { "date": "Aug 1974", "desc": "Richard Nixon resigns as President; Vice President Gerald Ford takes office." }
  ],
  "subtopic_4_3": [
    { "date": "Jan 1973", "desc": "Paris Peace Accords are signed, establishing a ceasefire and outlining US troop withdrawal." },
    { "date": "March 1973", "desc": "The last US combat troops leave Vietnam; North Vietnamese troops remain in the South." },
    { "date": "Aug 1974", "desc": "US Congress passes the Foreign Assistance Act, cutting military aid to South Vietnam by over 50%." },
    { "date": "Dec 1974", "desc": "North Vietnam launches a major conventional offensive, testing US resolve." },
    { "date": "April 1975", "desc": "Operation Frequent Wind: The massive helicopter evacuation of US citizens and ARVN allies from Saigon." },
    { "date": "30 Apr 1975", "desc": "Saigon falls to North Vietnamese forces, ending the war and reunifying Vietnam." }
  ],
  "subtopic_4_4": [
    { "date": "1964-73", "desc": "The Ho Chi Minh Trail's resilience prevents the US from cutting off communist supply lines." },
    { "date": "1965-68", "desc": "Guerilla tactics and local civilian support protect the Vietcong from superior US firepower." },
    { "date": "1968", "desc": "Tet Offensive destroys US domestic confidence in victory and increases anti-war sentiment." },
    { "date": "1969-73", "desc": "Low morale, drug abuse, and draft resistance weaken the combat effectiveness of US forces." },
    { "date": "1973-75", "desc": "US Congress cuts funding and assistance to South Vietnam, leaving the ARVN vulnerable." },
    { "date": "1975", "desc": "The complete military and political collapse of the South Vietnamese ARVN forces." }
  ]
};

export function getCleanStepText(bodyHtml) {
  if (!bodyHtml) return '';
  if (typeof document !== 'undefined') {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = bodyHtml;
    // Remove unwanted widgets/boxes
    const selectorsToRemove = [
      '.mind-map-task-box',
      '.revision-task-box',
      '.examiner-tip-box',
      '.lesson-image-wrapper',
      '.mastery-media-column'
    ];
    selectorsToRemove.forEach(selector => {
      tempDiv.querySelectorAll(selector).forEach(el => el.remove());
    });
    return (tempDiv.textContent || tempDiv.innerText || '').replace(/\s+/g, ' ').trim();
  } else {
    // Fallback regex
    let cleanText = bodyHtml;
    cleanText = cleanText.replace(/<div class="(?:mind-map-task-box|revision-task-box|examiner-tip-box|mastery-media-column)"[^>]*>([\s\S]*?)<\/div>/gi, '');
    cleanText = cleanText.replace(/<[^>]*>/g, ' ');
    return cleanText.replace(/\s+/g, ' ').trim();
  }
}

const CUSTOM_ACTIVE_READING_FOCUS = {
  "subtopic_1_1": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the legal strategies and rulings used to challenge Plessy v. Ferguson in the courts.",
  "subtopic_1_2": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the immediate and long-term reactions of both the federal government and segregationist governors to school desegregation.",
  "subtopic_1_3": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the political, economic, and social reasons for the success of the bus boycott.",
  "subtopic_1_4": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the local, legislative, and political methods used by Southern opponents to resist civil rights reforms.",
  "subtopic_2_1": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the ways in which non-violent direct action exposed Southern racism to the national media.",
  "subtopic_2_2": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the political pressure generated by protests that led to the passage of the Civil Rights Act of 1964 and Voting Rights Act of 1965.",
  "subtopic_2_3": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the differing goals, strategies, and criticisms that separated the Black Power movement from mainstream non-violence.",
  "subtopic_2_4": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the underlying social and economic frustrations that triggered the race riots in Northern and Western cities.",
  "subtopic_3_1": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the political and religious failures of the Diem regime that weakened South Vietnam.",
  "subtopic_3_2": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the political controversies surrounding the Gulf of Tonkin Incident and subsequent military escalation.",
  "subtopic_3_3": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the military and geographical advantages of the Vietcong's guerrilla tactics compared to US firepower.",
  "subtopic_3_4": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the military and political consequences of Nixon's invasions of Cambodia and Laos.",
  "subtopic_4_1": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the reasons why events like My Lai and the Pentagon Papers widened the credibility gap and fueled the anti-war movement.",
  "subtopic_4_2": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the ways Nixon successfully appealed to the Silent Majority to maintain support for his policies.",
  "subtopic_4_3": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the military and diplomatic factors that led to the complete collapse of South Vietnam after US withdrawal.",
  "subtopic_4_4": "Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the strategic, economic, and moral reasons why the USA failed to achieve its goals in Vietnam."
};

export const WORKBOOK_DATA = {};

for (const subtopicId in LESSONS_DATA) {

  const data = LESSONS_DATA[subtopicId];
  if (!data) continue;

  // Extract narrative paragraphs from steps
  const narrative = (data.steps || []).map((step, idx) => {
    const cleanText = step.bodyHtml;
    
    const paragraphs = [cleanText];
    if (step.scholarlyDepth && step.scholarlyDepth.body) {
      paragraphs.push(step.scholarlyDepth.body);
    }
    
    return {
      title: step.title || `Section ${idx + 1}`,
      paragraphs: paragraphs
    };
  });

  
  // Vocabulary: filter MASTER_GLOSSARY terms
  const vocabulary = [];
  const allText = (data.headerIntro + ' ' + (data.steps || []).map(s => s.bodyHtml).join(' ')).toLowerCase();
  const keywordsSet = new Set((data.keywords || []).map(k => k.toLowerCase()));
  
  for (const term in MASTER_GLOSSARY) {
    if (allText.includes(term.toLowerCase()) || keywordsSet.has(term.toLowerCase())) {
      vocabulary.push({
        term: term,
        definition: MASTER_GLOSSARY[term]
      });
    }
  }
  
  if (vocabulary.length < 3) {
    const keys = Object.keys(MASTER_GLOSSARY).slice(0, 4);
    keys.forEach(k => {
      vocabulary.push({ term: k, definition: MASTER_GLOSSARY[k] });
    });
  }
  
  // Timeline from CURATED_TIMELINES
  const timeline = CURATED_TIMELINES[subtopicId] || [
    { "date": "1954", "desc": "Period milestone event." },
    { "date": "1965", "desc": "Escalation or protest event." },
    { "date": "1973", "desc": "Treaty or accord event." }
  ];
  
  // Comprehension Check: build from deepThinkingQuestions if available, otherwise fallback to knowledgeCheck
  const comprehensionCheck = [];
  if (data.deepThinkingQuestions && data.deepThinkingQuestions.length > 0) {
    data.deepThinkingQuestions.slice(0, 3).forEach((item, idx) => {
      comprehensionCheck.push({
        title: item.question,
        scaffold: `Hint: ${item.hint || ""}`,
        stretch: `Teacher Guidance: ${item.teacherGuide || ""}`,
        answer: item.teacherGuide || ""
      });
    });
  } else {
    (data.knowledgeCheck || []).slice(0, 3).forEach((item, idx) => {
      const qText = item.q || item.question || "";
      const aText = item.a || item.answer || "";
      comprehensionCheck.push({
        title: qText,
        scaffold: `Consider: ${aText.slice(0, 50)}...`,
        stretch: `Stretch: Evaluate how this event influenced subsequent developments.`,
        answer: aText
      });
    });
  }

  
  // Causation Matrix (Simplified for 14-year-olds)
  const causationMatrix = {
    columns: ["Historical Cause / Factor", "Result / Consequence (Write matching number)"],
    factors: [],
    factBank: []
  };
  if (data.causalLinks && data.causalLinks.factors) {
    data.causalLinks.factors.forEach(f => {
      causationMatrix.factors.push(f.title);
      causationMatrix.factBank.push(f.linkageText || f.options[0]);
    });
  } else {
    causationMatrix.factors = [
      "Federal intervention in desegregation",
      "Grassroots organizing and direct action",
      "Southern political opposition"
    ];
    causationMatrix.factBank = [
      "Forced local authorities to integrate facilities and protected activists.",
      "Mobilised thousands through non-violent protests to gain national attention.",
      "Organised Citizens' Councils and signed the Southern Manifesto to block school integration."
    ];
  }
  
  // Sources: extract from howUsefulAnalyser or questionVault
  const sources = [];
  if (data.howUsefulAnalyser) {
    const hu = data.howUsefulAnalyser;
    if (hu.sourceD) {
      sources.push({
        id: "Source D",
        title: hu.sourceD.provenance || "Primary Source D",
        text: hu.sourceD.content || ""
      });
    }
    if (hu.sourceE) {
      sources.push({
        id: "Source E",
        title: hu.sourceE.provenance || "Primary Source E",
        text: hu.sourceE.content || ""
      });
    }
  }
  if (data.questionVault) {
    data.questionVault.forEach(q => {
      if (q.sourceA && sources.length < 2) {
        sources.push({
          id: "Source A",
          title: q.sourceA.split('\n')[0] || "Primary Source A",
          text: q.sourceA.split('\n').slice(1).join('\n').trim() || q.sourceA
        });
      }
    });
  }
  
  const sourceTasks = sources.map(s => {
    return {
      title: `Evaluate ${s.id}`,
      scaffold: `Assess the usefulness of ${s.id} for an enquiry into this period. Refer to content and provenance.`
    };
  });
  if (sourceTasks.length === 0) {
    sourceTasks.push({
      title: "Analyze historical evidence",
      scaffold: "Evaluate the strengths and limitations of contemporary documents from this lesson."
    });
  }
  
  // Exam Practice questions
  const examPracticeQuestions = [];
  if (data.questionVault) {
    data.questionVault.forEach(q => {
      examPracticeQuestions.push({
        title: q.question.includes('marks') ? q.question.split('(')[0].trim() : q.question,
        text: q.answer || "",
        sourceA: q.sourceA || ""
      });
    });
  }
  if (data.howUsefulAnalyser) {
    examPracticeQuestions.push({
      title: "Source usefulness task (8 marks)",
      text: data.howUsefulAnalyser.question || ""
    });
  }
  if (examPracticeQuestions.length === 0) {
    examPracticeQuestions.push({
      title: "Explain why this topic is important for the history of the USA. (8 marks)",
      text: "Write a structured response explaining two reasons."
    });
  }
  
  const examPractice = {
    wordBank: vocabulary.map(v => v.term).slice(0, 8),
    questions: examPracticeQuestions
  };
  
  // Synthesis Model
  examPractice.synthesisModel = "Although [long-term factor] created the context, it was [short-term action/event] that triggered the immediate consequence.";

  // Dynamic Cloze
  const clozeWordBank = [];
  const clozeSections = (data.steps || []).slice(0, 4).map(step => {
    let text = getCleanStepText(step.bodyHtml);
    vocabulary.forEach(v => {
      const termRegex = new RegExp(`\\b${v.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
      if (termRegex.test(text)) {
        text = text.replace(termRegex, `[[${v.term}]]`);
        if (!clozeWordBank.includes(v.term)) {
          clozeWordBank.push(v.term);
        }
      }
    });
    return {
      title: step.title,
      text: text
    };
  });
  if (clozeWordBank.length === 0) {
    vocabulary.slice(0, 4).forEach(v => {
      clozeWordBank.push(v.term);
    });
  }
  const cloze = {
    wordBank: clozeWordBank.slice(0, 12),
    sections: clozeSections
  };

  // Dynamic Cornell Notes
  const cornellCues = (data.steps || []).slice(0, 4).map((step, idx) => {
    const subCues = [
      `- What were the key events in ${step.title.split(':')[0]}?`,
      `- Why was this significant?`
    ];
    const modelNotes = getCleanStepText(step.bodyHtml);
    return {
      title: step.title.split(':')[0] || `Key Point ${idx + 1}`,
      subCues: subCues,
      modelNotes: modelNotes
    };
  });
  const cornell = {
    cues: cornellCues,
    synthesis: {
      prompt: `Synthesize the main causes and consequences of this lesson: ${data.headerTitle || "the topic"}.`,
      modelAnswer: `In summary, the developments in this topic created significant shifts, leading to subsequent legal and social changes that shaped the civil rights and Vietnam conflict.`
    }
  };

  // Dynamic Graphic Organizer
  const organizerBoxes = (data.steps || []).slice(0, 4).map((step, idx) => {
    return {
      title: step.title.split(':')[0] || `Phase ${idx + 1}`,
      modelNotes: getCleanStepText(step.bodyHtml)
    };
  });
  const rawVocab = vocabulary.slice(0, 6);
  const shuffledVocab = [...rawVocab].sort(() => Math.random() - 0.5);
  const letterMap = {};
  shuffledVocab.forEach((item, idx) => {
    letterMap[item.term] = String.fromCharCode(65 + idx);
  });
  const vocabMatch = rawVocab.map((item, idx) => {
    return {
      term: `${idx + 1}. ${item.term}`,
      match: letterMap[item.term],
      definition: item.definition
    };
  });
  const organizer = {
    boxes: organizerBoxes,
    vocabMatch: vocabMatch
  };
  
  // Peer Quiz: compile exactly 10 knowledge recall questions
  const peerQuiz = [];
  // 1. Add knowledgeCheck items
  (data.knowledgeCheck || []).forEach(item => {
    peerQuiz.push({
      q: item.q || item.question,
      a: item.a || item.answer
    });
  });
  // 2. Add vocabulary matching prompts
  vocabulary.forEach(v => {
    if (peerQuiz.length < 8) {
      peerQuiz.push({
        q: `What term refers to: "${v.definition}"`,
        a: v.term
      });
    }
  });
  // 3. Add timeline milestone prompts
  timeline.forEach(t => {
    if (peerQuiz.length < 10) {
      peerQuiz.push({
        q: `What significant event occurred in ${t.date}?`,
        a: t.desc
      });
    }
  });
  // Fallback if still under 10
  while (peerQuiz.length < 10) {
    peerQuiz.push({
      q: "Identify a key legal, political, or military factor from this lesson.",
      a: "Refer to the narrative text."
    });
  }
  
  // Mind Map
  const branches = (data.steps || []).map(s => {
    const stepText = (s.bodyHtml || '').toLowerCase();
    const stepKeywords = [];
    for (const term in MASTER_GLOSSARY) {
      if (stepText.includes(term.toLowerCase()) && stepKeywords.length < 3) {
        stepKeywords.push(term);
      }
    }
    while (stepKeywords.length < 3) {
      stepKeywords.push(["History", "USA", "Analysis"][stepKeywords.length]);
    }
    return {
      title: s.title.split(':')[0] || "Branch",
      keywords: stepKeywords
    };
  });
  const mindMap = {
    centralNode: data.headerTitle ? data.headerTitle.replace("KT ", "") : "Lesson Overview",
    branches: branches
  };
  
  WORKBOOK_DATA[subtopicId] = {
    title: data.headerTitle ? data.headerTitle.split(':').slice(1).join(':').trim() : "GCSE USA History Lesson",
    activeReadingFocus: CUSTOM_ACTIVE_READING_FOCUS[subtopicId] || `Prior to answering tasks in your exercise book, review the text to locate (1) essential dates, (2) key figures and organisations, and (3) the legal, social, or military factors guiding this period of history.`,
    narrative: narrative,
    vocabulary: vocabulary,
    timeline: timeline,
    comprehensionCheck: comprehensionCheck,
    causationMatrix: causationMatrix,
    sources: sources,
    sourceTasks: sourceTasks,
    examPractice: examPractice,
    peerQuiz: peerQuiz,
    mindMap: mindMap,
    cloze: cloze,
    cornell: cornell,
    organizer: organizer,
    causalQuestion: data.causalLinks ? (data.causalLinks.question || "") : "",
    sourcesQuestion: data.howUsefulAnalyser ? (data.howUsefulAnalyser.question || "") : "",
    paper3Suite: data.paper3Suite || null
  };
}

export const SYNTHESIS_TASKS = {
  "subtopic_1_1": { type: "The Strategy Comparison", task: "By the 1940s, different groups were fighting Jim Crow laws using different methods. Compare the strategies used by the NAACP and CORE. Explain how their methods were different (e.g., litigation vs. direct action) and provide one example from your timeline of a success or action taken by each group." },
  "subtopic_1_2": { type: "The Causal Chain", task: "The fight for school integration was a chain reaction of rulings and resistance. Write a short narrative account explaining the struggle to desegregate schools. You must link the following three events together chronologically: The Brown v. Board ruling (1954), the creation of White Citizens' Councils, and the events at Little Rock High School (1957)." },
  "subtopic_1_3": { type: "The Big Picture Summary", task: "Imagine you are writing a textbook summary on the success of the Montgomery Bus Boycott. Write a comprehensive paragraph explaining why the boycott succeeded. You MUST accurately use at least FIVE of these terms in context: MIA, Rosa Parks, Browder v. Gayle, Economic Pressure, Martin Luther King Jr., Non-violent, SCLC." },
  "subtopic_1_4": { type: "The Judgment", task: "Look back at the events of white resistance on your timeline. Which form of opposition—political/legal resistance (like the Southern Manifesto) or violent intimidation (like the KKK)—do you think was the biggest obstacle to civil rights in the 1950s? Justify your choice with evidence." },
  "subtopic_2_1": { type: "The Turning Point", task: "Look at the grassroots protests on your timeline. Which of these events do you believe was the most significant turning point for the Civil Rights Movement? Identify your chosen event, explain its impact, and compare it to at least one other event to justify why your choice was more important." },
  "subtopic_2_2": { type: "The Causal Chain", task: "The passage of the Civil Rights Act (1964) and Voting Rights Act (1965) were direct results of public pressure. Write a short narrative account explaining how protest led to legislation. You must link the following together: The events in Birmingham (1963), the national media reaction, and the passage of the Civil Rights Act (1964)." },
  "subtopic_2_3": { type: "The Strategy Comparison", task: "The Black Power movement differed significantly from MLK's approach. Compare the goals and methods of the Black Panther Party with those of mainstream groups like the SCLC. Explain what the Black Panthers were demanding and why they rejected non-violent direct action." },
  "subtopic_2_4": { type: "The Big Picture Summary", task: "Write a comprehensive paragraph explaining the causes of the race riots in the mid-1960s (such as Watts or Detroit). You MUST accurately use at least FIVE of these terms: De Facto Segregation, Kerner Commission, Police Brutality, Poverty, Two Societies, Freedom Summer, Radicalisation." },
  "subtopic_3_1": { type: "The Causal Chain", task: "The fall of President Diem was a chain reaction of his own unpopular policies. Write a short narrative account explaining why the Diem regime lost control of South Vietnam. You must link the following together: Diem's Catholic favoritism, the Buddhist Crisis (1963), and Diem's assassination." },
  "subtopic_3_2": { type: "The Judgment", task: "'The Gulf of Tonkin Incident was merely an excuse for President Johnson to escalate the war.' Based on your timeline, how far do you agree with this statement? Justify your answer by explaining the events of the incident and what the Gulf of Tonkin Resolution allowed LBJ to do." },
  "subtopic_3_3": { type: "The Big Picture Summary", task: "Write a comprehensive paragraph explaining why the Vietcong were such a difficult enemy for the US military to defeat. You MUST accurately use at least FIVE of these terms: Ho Chi Minh Trail, Guerrilla Warfare, Booby Traps, Search and Destroy, Cu Chi Tunnels, Peasant Support, Napalm." },
  "subtopic_3_4": { type: "The Turning Point", task: "Nixon expanded the war into Cambodia and Laos to cut off the Ho Chi Minh Trail. Did these invasions strengthen or weaken the overall US position? Explain your judgment by referencing both the military impact in Southeast Asia and the political reaction back home in the USA." },
  "subtopic_4_1": { type: "The Causal Chain", task: "The anti-war movement grew rapidly due to media exposure. Write a short narrative account explaining the collapse of public support for the Vietnam War. You must link the following together: The exposure of the My Lai Massacre, the widening 'Credibility Gap', and the student protests (like Kent State)." },
  "subtopic_4_2": { type: "The Strategy Comparison", task: "President Nixon faced immense pressure from anti-war protestors, but he also relied on the 'Silent Majority'. Compare how Nixon responded to the anti-war movement versus how he appealed to the Silent Majority. Provide examples of his policies or speeches that targeted each group." },
  "subtopic_4_3": { type: "The Big Picture Summary", task: "Write a comprehensive paragraph explaining the final collapse of South Vietnam after the US withdrew. You MUST accurately use at least FIVE of these terms: Vietnamization, Paris Peace Accords, US Withdrawal, Congress Funding Cuts, Fall of Saigon, Communist Victory." },
  "subtopic_4_4": { type: "The Judgment", task: "Historians debate the main reason the USA lost the Vietnam War. Was it primarily due to military failures (e.g., ineffective tactics against guerrillas) or political/social failures (e.g., loss of public support and the anti-war movement)? Justify your choice with evidence from your timeline." }
};
