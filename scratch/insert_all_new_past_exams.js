const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('questions.js', 'utf8');

// 1. Target Q1 and insert p_2022_q1 and p_2025_q1 right after p_2024_q1 (before p_2020_q1)
const q1Target = `      options: [
        "Black Americans faced constant segregation and public degradation, such as not being allowed to 'drink from the fountains marked White Only'.",
        "Racial boundaries were enforced through violence and state complicity, including threats by 'the sheriff or a white mob'.",
        "Black citizens were treated with respect on sidewalks, and did not have to 'step off into the gutter'.",
        "Racial rules were rarely enforced, and did not constitute 'a daily routine' of degradation."
      ],
      correctIndices: [0, 1]
    },
    "p_2020_q1": {`;

const q1Replacement = `      options: [
        "Black Americans faced constant segregation and public degradation, such as not being allowed to 'drink from the fountains marked White Only'.",
        "Racial boundaries were enforced through violence and state complicity, including threats by 'the sheriff or a white mob'.",
        "Black citizens were treated with respect on sidewalks, and did not have to 'step off into the gutter'.",
        "Racial rules were rarely enforced, and did not constitute 'a daily routine' of degradation."
      ],
      correctIndices: [0, 1]
    },
    "p_2022_q1": {
      id: "p_2022_q1",
      topicCode: "3.2",
      question: "Give two things you can infer from Source A about Search and Destroy missions in Vietnam.",
      sourceA: {
        provenance: "From an interview with an American soldier who fought in Vietnam. Here he is commenting on Search and Destroy missions.",
        content: "You knew the enemy was everywhere. You didn’t know if your next step would be your last because you might tread on a mine or booby trap. A lot of the time you were searching for the Vietcong’s hiding places, like tunnels and caves. If you were able to find the enemy, then you killed them. This was all a lot harder than it sounds. When we moved through a village our soldiers would burn down houses, even though they weren’t supposed to."
      },
      clue: "Look at the challenges soldiers faced while searching for the enemy and their actions in villages.",
      model: "Inference 1: I can infer that Search and Destroy missions were extremely dangerous and stressful for soldiers.\\nDetails: 'You didn’t know if your next step would be your last because you might tread on a mine or booby trap.'\\nInference 2: I can infer that soldiers often committed unauthorized destruction of property during these missions.\\nDetails: 'When we moved through a village our soldiers would burn down houses, even though they weren’t supposed to.'",
      options: [
        "Search and Destroy missions were highly dangerous and stressful, as soldiers 'might tread on a mine or booby trap'.",
        "Soldiers engaged in unauthorized actions, such as burning down houses 'even though they weren’t supposed to'.",
        "The Vietcong had clear hiding places that were easy to locate and destroy.",
        "US soldiers carefully preserved all civilian property they encountered during patrols."
      ],
      correctIndices: [0, 1]
    },
    "p_2025_q1": {
      id: "p_2025_q1",
      topicCode: "3.1",
      question: "Give two things you can infer from Source A about the Ho Chi Minh Trail during the Vietnam War.",
      sourceA: {
        provenance: "A photograph showing supplies being carried along the Ho Chi Minh Trail to the Vietcong fighting in South Vietnam.",
        content: "[A photograph showing a group of people walking in single file down a narrow, dirt path through dense jungle. Several people are pushing bicycles loaded with large packages, sacks and boxes. The route is heavily overgrown with trees and bushes.]"
      },
      clue: "Look at how the route was constructed and the way supplies were being moved.",
      model: "Inference 1: I can infer that the Ho Chi Minh Trail was a primitive, informal route rather than a developed highway.\\nDetails: The photograph shows people walking along a narrow, dirt path through dense jungle and overgrown trees.\\nInference 2: I can infer that the Vietcong relied on manual human labor and basic transport methods to move supplies.\\nDetails: The photograph shows people carrying packages on foot and pushing loaded bicycles rather than using motorized vehicles.",
      options: [
        "The Ho Chi Minh Trail was an undeveloped, narrow jungle path rather than a paved road.",
        "Supply transport relied heavily on manual human labor, such as pushing loaded bicycles.",
        "US forces successfully blocked all supply movements along the trail using heavy armor.",
        "The Vietcong moved supplies primarily using large military trucks and transport airplanes."
      ],
      correctIndices: [0, 1]
    },
    "p_2020_q1": {`;

content = content.replace(q1Target, q1Replacement);


// 2. Target Q2 and insert p_2022_q2, p_2023_q2, p_2024_q2, p_2025_q2 right after p_2020_q2 (before q3: {)
const q2Target = `mobilized entire white populations to protect their local customs from federal interference."
    }
  },
  q3: {`;

const q2Replacement = `mobilized entire white populations to protect their local customs from federal interference."
    },
    "p_2022_q2": {
      id: "p_2022_q2",
      topicCode: "3.3",
      question: "Explain why opposition in the USA to the Vietnam War increased in the years 1964–73.",
      stimulus1: "My Lai Massacre (1968)",
      stimulus2: "Kent State University (1970)",
      clue: "Structure your answer in three paragraphs: explain the moral shock of My Lai and cover-ups, the impact of Kent State on the student movement, and write a third paragraph on another factor like the draft system or media coverage.",
      knowledgeWords: [
        "My Lai",
        "Seymour Hersh",
        "Lieutenant Calley",
        "Kent State",
        "National Guard",
        "Cambodian Campaign",
        "draft system",
        "conscription",
        "media coverage",
        "credibility gap"
      ],
      connectiveWords: [
        "this meant that",
        "consequently",
        "as a direct result",
        "furthermore",
        "this led to",
        "because of"
      ],
      model: "Opposition to the war increased due to moral shock and public outrage following revelations of US atrocities and official cover-ups. In March 1968, US soldiers massacred over 500 unarmed Vietnamese civilians in the village of [[My Lai]]. When details were exposed by journalist Seymour Hersh in 1969, it shattered the moral justification of the war. Only [[Lieutenant Calley]] was convicted, receiving a lenient sentence, which led many Americans to believe the military was covering up widespread war crimes. Consequently, this moral outrage convinced many ordinary citizens that the US intervention in Vietnam was ethically indefensible.\\n\\nOpposition was also escalated by the state's violent response to domestic student protests. In May 1970, students at [[Kent State University]] protested against President Nixon's expansion of the war into Cambodia. The National Guard opened fire on the unarmed crowd, killing four students. This tragedy shocked the nation, highlighting that the war was tearing American society apart and causing division at home. As a direct result, it triggered a massive nationwide student strike of over [[4 million]] students, deeply damaging the government's ability to maintain public support for the war.\\n\\nFinally, opposition grew due to the unfairness of the [[conscription]] draft system and the impact of unedited television coverage. The draft disproportionately selected working-class men and African Americans, creating deep social resentment. Furthermore, Vietnam was the first 'television war', and daily broadcasts showed distressing footage of napalm attacks and high US casualties. This created a profound [[credibility gap]] between official government statements and the reality on the ground. Therefore, unedited media coverage and draft inequities convinced millions of Americans that the war was unwinnable and unjust, leading to widespread resistance."
    },
    "p_2023_q2": {
      id: "p_2023_q2",
      topicCode: "3.4",
      question: "Explain why the USA was involved in the peace negotiations (1972–73) about the war in Vietnam.",
      stimulus1: "President Nixon",
      stimulus2: "Ho Chi Minh Trail",
      clue: "Explain Nixon's desire to fulfill his election promise, the military deadlock due to the Ho Chi Minh Trail, and a third factor like the financial cost or changing international relations (détente).",
      knowledgeWords: [
        "Nixon",
        "Vietnamisation",
        "deadlock",
        "Ho Chi Minh Trail",
        "Rolling Thunder",
        "conscription",
        "détente",
        "rapprochement",
        "electoral promise"
      ],
      connectiveWords: [
        "as a result",
        "consequently",
        "this meant that",
        "therefore",
        "because of",
        "due to"
      ],
      model: "A key reason for US involvement in peace negotiations was President Nixon's need to fulfill his electoral promise and implement Vietnamisation. Nixon was elected in 1968 after promising to achieve 'peace with honour'. His policy of [[Vietnamisation]] aimed to withdraw US troops while training and equipping South Vietnamese forces to defend themselves, thereby ending direct US combat involvement. Consequently, Nixon was determined to negotiate a formal peace treaty that would allow a complete US withdrawal while preserving a non-communist South Vietnam, ensuring he could fulfill his political commitment to the American public.\\n\\nFurthermore, the USA entered negotiations because it realized that a military victory was impossible due to the resilience of the communist supply routes. Despite massive bombing campaigns like Operation Linebacker, the Vietcong and NVA continued to receive supplies and reinforcements along the [[Ho Chi Minh Trail]] through Cambodia and Laos. The trail's resilience meant that US military power could not force a communist surrender, resulting in a prolonged and frustrating [[deadlock]]. As a result, the failure to sever these lines of supply forced the Nixon administration to accept that a diplomatic settlement was the only realistic way to end US involvement.\\n\\nFinally, negotiations were driven by the immense financial burden of the war and the opportunity presented by changing international relations. The war cost the USA over [[$100 billion]], causing high inflation and damaging the US economy, while public opposition at home made it politically impossible to continue funding. At the same time, Nixon pursued a policy of [[détente]] with the Soviet Union and rapprochement with China, hoping to pressure North Vietnam to negotiate. This meant that the USA wanted to withdraw from Vietnam to focus on these strategic global relationships, making a negotiated peace highly desirable."
    },
    "p_2024_q2": {
      id: "p_2024_q2",
      topicCode: "3.2",
      question: "Explain why the USA was not able to win the war against the Vietcong in the years 1964–73.",
      stimulus1: "the Vietcong use of booby traps",
      stimulus2: "the US use of Agent Orange",
      clue: "Explain the effectiveness of Vietcong guerrilla tactics (booby traps, tunnels), how US chemical weapons (Agent Orange) alienated the civilian population, and a third factor like troop morale or failure to win hearts and minds.",
      knowledgeWords: [
        "Vietcong",
        "guerrilla",
        "booby traps",
        "Agent Orange",
        "chemical weapons",
        "Strategic Hamlets",
        "Search and Destroy",
        "attrition",
        "hearts and minds"
      ],
      connectiveWords: [
        "as a result",
        "consequently",
        "this led to",
        "therefore",
        "because of",
        "due to"
      ],
      model: "The USA was unable to win the war because Vietcong guerrilla tactics neutralized American military and technological superiority. The Vietcong avoided large-scale battles, using ambushes and hiding in complex underground tunnel networks. They deployed cheap, lethal [[booby traps]], such as Punji stake pits and tripwires, which caused roughly [[11%]] of US deaths. Consequently, these tactics created a constant state of fear and paranoia among US soldiers, preventing them from locating the enemy and rendering their superior weaponry and air support largely ineffective.\\n\\nFurthermore, US tactics like the use of chemical weapons actively alienated the Vietnamese peasantry, driving them to support the Vietcong. The US military sprayed millions of gallons of [[Agent Orange]] to destroy the jungle canopy and crops. However, this destroyed the livelihoods of innocent peasants and caused severe health issues. Consequently, this chemical warfare, alongside the destructive [[Search and Destroy]] raids that burned villages, completely undermined the US policy of winning the [[hearts and minds]] of the rural population. This led to local peasants providing the Vietcong with food, shelter, and vital intelligence.\\n\\nFinally, the USA failed to win due to low troop morale and the rotation system. The draft system meant that US soldiers were young, inexperienced conscripts who only served a [[one-year tour]] of duty. Just as soldiers gained combat experience, they were sent home and replaced by raw recruits. This, combined with the frustration of fighting an invisible enemy and growing anti-war protests at home, led to low morale, drug abuse, and the 'fragging' of officers. Therefore, the lack of combat continuity and low troop commitment made it impossible for the US army to defeat the highly motivated Vietcong forces."
    },
    "p_2025_q2": {
      id: "p_2025_q2",
      topicCode: "1.3",
      question: "Explain why the Montgomery Bus Boycott (1955–56) was successful.",
      stimulus1: "Montgomery Improvement Association (MIA)",
      stimulus2: "US Supreme Court",
      clue: "Explain the excellent organization and carpools by the MIA, the ultimate legal victory in the Supreme Court (Browder v Gayle), and a third factor like the unity of the Black community around Rosa Parks or the leadership of Martin Luther King.",
      knowledgeWords: [
        "MIA",
        "Rosa Parks",
        "carpools",
        "Browder v Gayle",
        "Supreme Court",
        "economic pressure",
        "non-violent",
        "SCLC",
        "WPC"
      ],
      connectiveWords: [
        "as a direct result",
        "consequently",
        "this meant that",
        "therefore",
        "because of",
        "due to"
      ],
      model: "The boycott was successful because the Montgomery Improvement Association (MIA) provided exceptional organization and alternative transport. Formed in December 1955 and led by the young minister [[Martin Luther King Jr.]], the MIA organized a highly efficient [[carpool system]] using over 300 private cars and designated pickup stations. This allowed Black citizens to avoid using the buses while still getting to work daily, sustaining the protest for [[381 days]] despite city harassment. Consequently, the MIA's logistical efficiency prevented the boycott from collapsing due to practical difficulties, maintaining economic pressure on the bus company.\\n\\nFurthermore, the boycott achieved its ultimate success through a decisive legal victory in the federal courts. In November 1956, the US Supreme Court upheld the district court ruling in [[Browder v. Gayle]], which declared that segregation on public buses was unconstitutional under the 14th Amendment. This federal intervention overrode the local Montgomery city council's refusal to integrate, legally forcing the bus company to end segregation. Therefore, the Supreme Court's ruling was the crucial factor because it provided the legal authority needed to officially end the segregation policy, giving the boycott its concrete victory.\\n\\nFinally, success was driven by the unity of the Black community and the power of their economic pressure. Black citizens made up roughly [[70%]] of Montgomery's bus riders, and their near-total participation in the boycott bankrupt the bus company and damaged downtown white businesses. This solidarity was solidified by the respect for [[Rosa Parks]], whose arrest acted as a unifying test case, and by King's inspiring, non-violent leadership. As a direct result, this economic leverage and community resolve showed that peaceful mass action could disrupt segregated systems, forcing white authorities to recognize the strength of the civil rights movement."
    }
  },
  q3: {`;

content = content.replace(q2Target, q2Replacement);


// 3. Target Q3 and insert p_2022_q3, p_2023_q3, p_2024_q3, p_2025_q3 right after p_2020_q3 (before closing of EXAM_SKILLS_DATA)
const q3Target = `The Vietcong's guerrilla warfare and North Vietnam's ability to survive Operation Rolling Thunder created the very stalemate that destroyed US troop morale."
    }
  }
};`;

const q3Replacement = `The Vietcong's guerrilla warfare and North Vietnam's ability to survive Operation Rolling Thunder created the very stalemate that destroyed US troop morale."
    },
    "p_2022_q3": {
      id: "p_2022_q3",
      topicCode: "2.3",
      question: "How useful are Sources B and C for an enquiry into the methods used by the Black Panther movement?",
      sourceB: {
        provenance: "From a television interview with Bobby Seale in 1988. Bobby Seale was one of the people who created the Black Panther Party. Here he is commenting on an event which happened just after the Black Panther Party had been started in 1966.",
        content: "During one of our armed patrols we saw the police trying to arrest someone. So we got out of our car and approached them. A crowd of 20 or 30 people were watching and they saw that we were carrying guns. We told the crowd: ‘We are a new organisation, the Black Panther Party. We’re here to observe these police in the community, and to make sure there’s not going to be any more police brutality.’ A policeman came over to us and said ‘What are you going to do with those guns?’ We said ‘Well we got them to defend ourselves and to observe you.’"
      },
      sourceC: {
        provenance: "From an article in The Black Panther, published in 1969. The Black Panther was the official newspaper of the Black Panther Party and was sold in cities across the USA.",
        content: "We created the ‘Free Breakfast for School Children’ scheme because we understand that our children need a healthy breakfast every morning to help them learn. Our people have gone hungry for too long and we say that this must stop. It is a beautiful sight to see our children eat in the mornings. Teachers in the schools say that there is a great improvement in the academic skills of the children that do get breakfast. The free breakfasts have already been started in a number of cities. But our love for the people makes us realise that we must provide free breakfasts right across the country."
      },
      interpretation1: {
        author: "From Rethinking the Black Freedom Movement by Y Williams, published in 2016.",
        content: "The Black Panther Party for Self Defence (BPP) gained national attention. It encouraged confrontation and armed self-defence. Members of the BPP were tough men from the cities who were not afraid to fight back against racism. One of their main aims was to stop police brutality. The BPP carried out armed patrols. These armed patrols followed and observed the police. There were several confrontations with police, including a shootout in 1967 when a policeman was killed."
      },
      interpretation2: {
        author: "From On the Ground: The Black Panther Party in Communities across America by J L Jeffries, published in 2010.",
        content: "The Black Panther Party aimed to improve black people’s lives. Many members of the movement worked to meet the basic needs of black communities across the country. They did this by helping the elderly, setting up health clinics and giving out free clothing. In cities where they had offices, the Black Panther Party ran far-reaching and wide-ranging community support programmes. At the same time, they taught children about black history and black pride."
      },
      questiona: "How useful are Sources B and C for an enquiry into the methods used by the Black Panther movement? (8 marks)",
      cluea: "Assess Source B (Bobby Seale interview, first-hand details of armed patrols to observe police and stop brutality, potential hindsight bias in 1988) and Source C (BPP newspaper article, free breakfast community program, potential propaganda purpose) for usefulness.",
      modela: "Source B is highly useful for understanding the militant methods and self-defence patrols of the early Black Panther Party. The content details an armed patrol monitoring the police to prevent police brutality, which aligns with my knowledge of their early tactics in Oakland. The usefulness is enhanced by its provenance; as recollections of co-founder Bobby Seale, it provides direct, first-hand access to the party's motivations and interactions with police in 1966. However, its utility is slightly limited because it was recorded in 1988, meaning Seale's hindsight or desire to present the Panthers in a defensive, legalistic light might have influenced his memory.\\n\\nSource C is also highly useful for showing the social welfare methods of the Panthers. The content details their 'Free Breakfast for School Children' scheme, which improve academic performance and fed hungry children. The provenance increases its usefulness because it is from their official newspaper published in 1969, at the height of the program. This reveals how the Panthers presented their work to the Black community and how they used media to promote community support. However, as an official publication, it acts as propaganda designed to project a positive image of 'love for the people', glossing over any violent aspects of the party.\\n\\nTogether, the sources are extremely useful: Source B documents the armed confrontational methods, while Source C reveals the extensive community survival programs. Their different perspectives provide a balanced view of the movement's dual nature.",
      questionb: "What is the main difference between Interpretation 1 and Interpretation 2? (4 marks)",
      clueb: "Identify the core disagreement: Interpretation 1 focuses on confrontational methods, armed patrols, and conflict with police. Interpretation 2 focuses on community support, social programs, and education.",
      modelb: "The main difference is that Interpretation 1 views the Black Panther movement's methods as confrontational and focused on armed self-defence, highlighting armed patrols and shootouts with the police. In contrast, Interpretation 2 views their methods as community-focused, emphasizing social welfare programs, helping the elderly, and teaching children about black history and pride.",
      questionc: "Suggest one reason why Interpretation 1 and Interpretation 2 give different views. You can use Sources B and C to help explain your answer. (4 marks)",
      cluec: "Explain how they rely on different sources (Interpretation 1 on Source B's armed patrols; Interpretation 2 on Source C's breakfast program) or focus on different aspects of BPP methods.",
      modelc: "The interpretations differ because the historians have given weight to different sources. Interpretation 1 is supported by Source B, which details how the Panthers carried weapons on patrols to confront and observe the police, supporting the view that their methods were confrontational. Conversely, Interpretation 2 is supported by Source C, which details the social benefits of the Free Breakfast Program, supporting the view that they focused on community welfare.\\n\\nAlternatively, they focus on different aspects of the movement. Interpretation 1 focuses on the high-profile, militant self-defence patrols and clashes with law enforcement that gained national attention. In contrast, Interpretation 2 focuses on the grassroots, daily survival programs set up by local branches to meet the basic needs of poor Black communities.",
      questiond: "How far do you agree with Interpretation 2 about the methods used by the Black Panther movement? (16 marks)",
      clued: "A balanced essay. Support Interpretation 2 (Free Breakfast program feeding 10,000 daily, free clinics, sickle cell screening, Ten Point Program) and evaluate against Interpretation 1 (armed patrols, shootouts with police, FBI J. Edgar Hoover declaring them a threat, confrontational rhetoric).",
      modeld: "I agree to a moderate extent with Interpretation 2 that community support programs were a major method of the Black Panther Party. The BPP's [[Ten-Point Program]] demanded decent housing and education, and they implemented this through practical 'survival programs'. They established the [[Free Breakfast for Children Program]] in 1969, which eventually fed over [[10,000]] children daily. They also set up free health clinics, offered sickle cell anemia testing, and distributed free clothing. This supports Interpretation 2's view that they worked to meet the basic needs of Black communities and promoted black pride.\\n\\nHowever, Interpretation 1 is also valid in emphasizing that armed confrontation was a defining method. The Panthers carried loaded weapons in public and conducted armed patrols to follow police cars, asserting their constitutional right to bear arms. This confrontational method led to frequent shootouts with the police, such as the [[1967 shootout]] that resulted in the death of officer John Frey and the imprisonment of [[Huey Newton]]. Their militant stance led FBI Director J. Edgar Hoover to label them the greatest threat to internal security, showing that violence and armed confrontation were central to their national identity.\\n\\nOverall, while the community welfare programs (Interpretation 2) were extensive and highly successful at the local level, the confrontational, armed methods (Interpretation 1) cannot be dismissed. It was the combination of revolutionary militancy and community care that defined the Black Panthers, but their armed stance ultimately drew the federal suppression that destroyed the movement."
    },
    "p_2023_q3": {
      id: "p_2023_q3",
      topicCode: "2.2",
      question: "How useful are Sources B and C for an enquiry into the Freedom Summer (1964)?",
      sourceB: {
        provenance: "From the recollections of Lenray Gandy, recorded for a documentary made in 2015. Gandy was a black American. He was nine years old during the Freedom Summer and attended a Freedom School. As an adult, he became active in the civil rights movement. Here he is commenting on the Freedom Summer.",
        content: "That summer was a turning point. It made a big change in our city in Mississippi. We all began to realise that we did have a right to do things. The white volunteers who came to us started something great here. We started to do things ourselves, to protest on our own and to stage a boycott. We started to try to find a way to have rights, here in this city. We call the volunteers who came here ‘freedom fighters’ and we wanted to be freedom fighters too."
      },
      sourceC: {
        provenance: "From records kept by the organisers of the Mississippi Freedom Summer, 1964. The organisers kept a list of the harassment faced by civil rights workers throughout Mississippi. Shown here are some of the 67 incidents that were recorded in different towns in Mississippi during the last two weeks of June.",
        content: "June 16: Philadelphia. Church used as a Freedom Summer School burned to ground.\\nJune 21: Brandon. Church firebombed.\\nMcComb. Homes of two civil rights workers bombed.\\nJune 22: Clarksdale. Four volunteers arrested while carrying out voter registration work. Held for 3½ hours, then released.\\nJune 23: Philadelphia. Missing car found burned; no sign of three civil rights workers.\\nJackson. Shots fired at the home of a Church minister.\\nRuleville. Magazine reporters, covering a voting rally, chased out of town.\\nJune 25: Ruleville. Church firebombed.\\nItta Bena. Two volunteers taken to bus stop by four white men who say, ‘If you make a speech in town tonight, you’ll never leave here.’"
      },
      interpretation1: {
        author: "From Rights and Protest, by M Rogers and P Clinton, published in 2015.",
        content: "The Mississippi Freedom Summer achieved a number of things. A total of 41 Freedom Schools were established. More than 3 000 black American youths attended them. The curriculum included reading, mathematics, and black American history. Leadership skills were also covered, so that the civil rights activities and campaigning could continue even after the Freedom Summer volunteers returned home. Voter registration efforts continued too. Thousands of black Americans went to classes on how to register to vote and 17 000 applied to vote."
      },
      interpretation2: {
        author: "From Causes and Consequences of the African-American Civil Rights Movement by M Weber, published in 2005.",
        content: "The Freedom Summer was a bitter experience for civil rights workers in Mississippi. Fifteen were killed. Many were beaten and hundreds arrested. Only about 1 600 black Americans were actually successfully registered to vote. The campaign caused deep divisions between black activists and white volunteers. The project had brought hundreds of white student volunteers from the North. Many black civil rights workers resented the white volunteers. They felt that the whites took over the leadership of the campaign."
      },
      questiona: "How useful are Sources B and C for an enquiry into the Freedom Summer (1964)? (8 marks)",
      cluea: "Evaluate Source B (first-hand recollections of a Black student, highlights empowerment and inspiration, potential recall bias in 2015) and Source C (contemporary log of 67 incidents of violence and intimidation, lists specific towns, reveals scale of hostility) for usefulness.",
      modela: "Source B is highly useful for understanding the local, psychological impact of the Freedom Summer on the Black population in Mississippi. The content highlights how the campaign was a 'turning point' that empowered local residents to stage boycotts and protests themselves, inspiring them to become 'freedom fighters'. The provenance adds to its usefulness because it represents the first-hand perspective of a child who attended a Freedom School, showing the long-term inspiration it provided. However, because it was recorded in 2015, over 50 years later, there is a risk of recall bias or romanticizing the past due to the author's subsequent civil rights activism.\\n\\nSource C is highly useful for documenting the extreme opposition and violence civil rights workers faced in Mississippi. The content lists specific incidents of arson, bombings, arrests, and intimidation, including the disappearance of the three civil rights workers in Philadelphia. The provenance, being a contemporary log kept by the organizers in June 1964, makes it a highly reliable record of the daily dangers encountered. It is exceptionally useful for demonstrating that white supremacists used terrorism to stop voter registration and education efforts.\\n\\nTogether, the sources are very useful: Source B reveals the positive, empowering legacy of the Freedom Schools, while Source C logs the brutal campaign of intimidation designed to crush the movement.",
      questionb: "What is the main difference between Interpretation 1 and Interpretation 2? (4 marks)",
      clueb: "Contrast Interpretation 1's positive view of achievements (schools, leadership skills, applications to vote) with Interpretation 2's focus on failure and bitter experiences (violence, low registration numbers, internal racial divisions).",
      modelb: "The main difference is that Interpretation 1 presents the Freedom Summer as a successful and positive campaign, highlighting the establishment of 41 Freedom Schools, the training of new leaders, and thousands applying to vote. In contrast, Interpretation 2 presents the campaign as a bitter failure, emphasizing the high human cost (15 killed), the low number of successfully registered voters (1,600), and the resulting divisions between Black and white activists.",
      questionc: "Suggest one reason why Interpretation 1 and Interpretation 2 give different views. You can use Sources B and C to help explain your answer. (4 marks)",
      cluec: "Show how they depend on different evidence: Interpretation 1 aligns with Source B's focus on Freedom Schools and local inspiration; Interpretation 2 aligns with Source C's evidence of bombings, arrests, and intimidation.",
      modelc: "The interpretations differ because the historians have given weight to different sources. Interpretation 1 is supported by Source B, which emphasizes the inspiring educational legacy of the volunteers and how it motivated local youth to fight for their rights, leading to a positive view of the campaign. In contrast, Interpretation 2 is supported by Source C, which documents the relentless bombings, firebombings, and arrests that made the summer a bitter and dangerous experience.\\n\\nAlternatively, they focus on different measures of success. Interpretation 1 focuses on the long-term social and educational achievements, such as setting up Freedom Schools to teach Black history and build future leadership. Interpretation 2 focuses on the short-term political results, highlighting the tiny number of actual voter registrations achieved and the immediate trauma and internal division experienced by the activists.",
      questiond: "How far do you agree with Interpretation 2 about the Freedom Summer (1964)? (16 marks)",
      clued: "A balanced essay. Support Interpretation 2 (15 deaths, Mississippi burning murders of Chaney, Goodman, Schwerner, only 1,600 registered out of 17,000, white northern volunteers leaving, SNCC/CORE disillusionment with non-violence and white liberals) and evaluate against Interpretation 1 (41 Freedom Schools, 3,000 kids, Voting Rights Act 1965, coalition COFO cooperation).",
      modeld: "I agree to a large extent with Interpretation 2 that the Freedom Summer was a bitter and divisive experience. Over [[1,000]] northern volunteers, mostly white, came to Mississippi, which provoked extreme white supremacist violence. As logged in Source C, civil rights workers faced constant terror: [[15 people]] were killed, dozens of churches were bombed, and hundreds were arrested. The murders of [[James Chaney, Andrew Goodman, and Michael Schwerner]] in Philadelphia by Klansmen, with local police complicity, highlighted the deadly risks. Furthermore, of the 17,000 Black Americans who tried to register, only about [[1,600]] were successful due to local registrar obstruction. This supports Interpretation 2's argument that the immediate political gains were minimal and the cost was devastating, leading to SNCC activists becoming disillusioned with non-violence.\\n\\nHowever, Interpretation 1 is also valid in identifying key achievements. The campaign established [[41 Freedom Schools]] which taught reading, math, and Black history to over [[3,000]] children, building long-term community pride and leadership. The campaign also brought national media attention to Mississippi, exposing the brutality of segregation to northern voters. This national pressure directly contributed to the passing of the [[Voting Rights Act of 1965]], which outlawed literacy tests and transformed southern politics. This counters Interpretation 2's focus on failure by showing the long-term legislative impact of the summer.\\n\\nOverall, Interpretation 2 is highly accurate in describing the internal trauma of the campaign. The resentment among Black activists over white northern volunteers taking leadership roles did lead to a split, accelerating the rise of [[Black Power]] and the expulsion of whites from SNCC in 1966. Yet, while the summer was a 'bitter experience', it was a crucial catalyst that forced federal intervention, meaning its long-term achievements (Interpretation 1) ultimately outweighed its immediate failures."
    },
    "p_2024_q3": {
      id: "p_2024_q3",
      topicCode: "2.2",
      question: "How useful are Sources B and C for an enquiry into the achievements of Martin Luther King in the civil rights movement?",
      sourceB: {
        provenance: "A photograph of the March on Washington DC, 28 August 1963. Here Martin Luther King is shown waving to crowds taking part in the March.",
        content: "[A photograph showing Martin Luther King standing on a balcony, waving to a massive, densely packed crowd of demonstrators that stretches far into the distance along the reflecting pool in Washington D.C. The crowd is diverse, and King is smiling, looking out over the sea of supporters.]"
      },
      sourceC: {
        provenance: "From an account by Bob Lucas, given in an interview for a television documentary series that was shown during the 1970s and 1980s. Lucas was a Black civil rights leader in Chicago. He worked closely with King in a campaign to improve living conditions for Black Americans in the city.",
        content: "Dr Martin Luther King had failed to get improved living conditions for Black Americans in Chicago. Furthermore, after he left the city, in late August 1966, we began to notice a wider split between the Black activists and White activists in the civil rights movement. The split had started around 1964 but, while Dr King was here, that division between us had been sort of kept quiet, out of respect for him. However, after he left, the split really began to show itself. Our Black activists literally asked Whites to leave meetings and even to leave the movement."
      },
      interpretation1: {
        author: "From The USA: A Divided Union? by N DeMarco, published in 2001.",
        content: "King’s commitment to non-violent direct action meant that influential white people, such as President Kennedy and President Johnson, could support the Civil Rights Movement without damaging their political positions. King’s dignified behaviour and inspiring speeches attracted international attention. He won the Nobel Peace Prize in 1964, which put more pressure on the government to end discrimination against Black Americans. King worked hard to bring about important new laws, particularly the 1964 Civil Rights Act and the 1965 Voting Rights Act."
      },
      interpretation2: {
        author: "From Civil Rights in America, 1945–89 by T Lancaster, published in 1990.",
        content: "By 1965, the progress made by the civil rights movement had raised the hopes of Black Americans enormously, yet the lives of many remained unchanged. There were also problems as the movement became more active in northern cities. In 1966, Martin Luther King started the Chicago Freedom Movement, which aimed to highlight the discrimination in housing. The city authorities agreed to try to prevent Black Americans being excluded from certain areas, but little was actually achieved. Segregation still existed all too clearly in many areas of northern life and ‘Black Power’ became an attractive idea."
      },
      questiona: "How useful are Sources B and C for an enquiry into the achievements of Martin Luther King in the civil rights movement? (8 marks)",
      cluea: "Evaluate Source B (photograph of March on Washington, shows King's massive popularity, support from federal government, potential staging bias) and Source C (Bob Lucas interview, shows failure of Chicago Freedom Movement in 1966, divisions between Black and white activists, first-hand witness perspective) for usefulness.",
      modela: "Source B is highly useful for demonstrating King's status as a charismatic leader who could mobilize massive public support. The content shows King waving to a crowd of over 250,000 demonstrators, indicating the scale and unity of the 1963 March on Washington. The provenance is useful because it is a contemporary photograph capturing the event's positive public image. This was vital in placing pressure on the Kennedy administration to pass civil rights legislation. However, as an official photograph, it focuses on the peaceful, triumphant aspect of the march, ignoring the ongoing opposition and behind-the-scenes political divisions.\\n\\nSource C is highly useful for revealing the limits of King's achievements when campaigning in the North. The content details King's failure to improve housing conditions in Chicago in 1966 and explains that his departure exposed deep divisions between Black and white activists. The provenance is useful because it comes from a contemporary Black civil rights leader in Chicago who worked closely with King. This provides a realistic, insider perspective of the campaign's limitations. However, because it was recorded in an interview years later, it may reflect subsequent disillusionment with integration.\\n\\nTogether, the sources are extremely useful: Source B highlights King's peak success in the South and national mobilization, while Source C documents the failure of his non-violent methods to address economic segregation in the North.",
      questionb: "What is the main difference between Interpretation 1 and Interpretation 2? (4 marks)",
      clueb: "Identify the core disagreement: Interpretation 1 argues King achieved major successes (federal backing, Civil Rights Act 1964, Voting Rights Act 1965, Nobel Prize). Interpretation 2 argues King's achievements were limited and failed to change daily lives, particularly in northern cities like Chicago.",
      modelb: "The main difference is that Interpretation 1 presents King as highly successful, emphasizing that his non-violent tactics won white political support, attracted international attention, and successfully secured the landmark Civil Rights Act of 1964 and Voting Rights Act of 1965. In contrast, Interpretation 2 argues that King's achievements were limited and failed to change the daily lives of Black Americans, pointing specifically to his failure in the 1966 Chicago campaign and the persistence of northern segregation.",
      questionc: "Suggest one reason why Interpretations 1 and Interpretation 2 give different views. You can use Sources B and C to help explain your answer. (4 marks)",
      cluec: "Reconcile the interpretations with the sources: Interpretation 1 is supported by Source B (the massive success and popularity of the March on Washington); Interpretation 2 is supported by Source C (the failure of the Chicago campaign and the rise of racial divisions).",
      modelc: "The interpretations differ because the historians have relied on different sources. Interpretation 1 is supported by Source B, which shows the massive, unified turnout at the March on Washington, supporting the view that King was an inspiring leader who achieved national support. Conversely, Interpretation 2 is supported by Source C, which focuses on King's failure in Chicago and the growing divisions between Black and white activists, justifying the view that his achievements had limits.\\n\\nAlternatively, they focus on different geographical areas and periods. Interpretation 1 focuses on the southern campaigns up to 1965, where King's non-violent direct action successfully targeted legal segregation, leading to major federal laws. Interpretation 2 focuses on the northern campaigns after 1965, where King tried to tackle complex economic segregation and housing discrimination, achieving very little practical improvement.",
      questiond: "How far do you agree with Interpretation 2 about the achievements of Martin Luther King in the civil rights movement? (16 marks)",
      clued: "A balanced essay. Support Interpretation 2 (Chicago housing agreement ignored by Mayor Daley, northern slums remained, legal changes didn't solve northern poverty, rise of Black Power) and evaluate against Interpretation 1 (landmark Civil Rights Act 1964, Voting Rights Act 1965, ending legal Jim Crow, mobilizing white house support).",
      modeld: "I agree to a moderate extent with Interpretation 2 that King's achievements failed to change the daily lives of many Black Americans, particularly in the North. In [[1966]], King launched the [[Chicago Freedom Movement]] to combat housing discrimination. Although Mayor Daley signed an agreement to end segregation, the city authorities ignored it once King left, and housing conditions in the ghettos remained unchanged. This failure to address economic inequality and poverty in northern cities made non-violence seem ineffective, causing younger activists to turn to [[Black Power]], supporting Interpretation 2's view that concrete gains were limited.\\n\\nHowever, Interpretation 1 is also valid in emphasizing the monumental impact of the Civil Rights Act of 1964. The [[Civil Rights Act of 1964]] legally ended segregation in hotels, restaurants, and public places, which had been the core target of the student sit-ins and Freedom Rides. Furthermore, by banning workplace discrimination and establishing the Equal Employment Opportunity Commission, the Act targeted economic barriers. This supports Interpretation 1's claim that the 1964 Act was 'the most important law passed by Congress in the 20th century'.\\n\\nOverall, while the 1964 Act was a massive victory for social desegregation, the 1965 Voting Rights Act was the ultimate achievement because it gave Black Americans the political power to defend their rights. Without the vote, the social gains of 1964 could not be legally enforced or protected at the local level."
    },
    "p_2025_q3": {
      id: "p_2025_q3",
      topicCode: "3.1",
      question: "How useful are Sources B and C for an enquiry into the escalation of US involvement in the conflict in Vietnam in the 1960s?",
      sourceB: {
        provenance: "From a top-secret US government document, 1961. It lists the actions to be taken by the US government working alongside the government of South Vietnam.",
        content: "President Kennedy has authorised government officials to inform President Diem of South Vietnam that the USA will provide the following for South Vietnam:\\n1. Increased air support to the South Vietnamese armed forces, including helicopters and transport aircraft.\\n2. Additional equipment and United States personnel for air reconnaissance and photography.\\n3. Training and equipment.\\n4. Increased economic aid.\\n5. Individual administrators and advisers for the South Vietnamese government."
      },
      sourceC: {
        provenance: "From a speech broadcast to the American people by President Johnson, July 1965.",
        content: "I asked General Westmoreland, the commanding general in Vietnam, what more he needs to resist this Vietnamese aggression. And we will meet the General’s needs. I have today ordered an additional Air Division and other forces to go to Vietnam, which will raise our fighting strength from 74,000 to 125,000 men almost immediately. Additional forces will be needed later, and they will be sent as requested. This will also make it necessary to increase the number of men called up into the army by the draft system, and therefore increase our fighting forces in Vietnam."
      },
      interpretation1: {
        author: "From America’s Longest War by G C Herring, published in 1979.",
        content: "It was the decisions made by President Kennedy in 1961 that were a key turning point in American involvement in Vietnam. The United States dramatically expanded its role. The number of American ‘advisers’ was increased from 3,205 in December 1961, to more than 9,000 by the end of 1962. American military assistance more than doubled between 1961 and 1962. Kennedy also authorised the use of chemical weapons, such as Agent Orange."
      },
      interpretation2: {
        author: "From A Short History of the Vietnam War by G Kerr, published in 2015.",
        content: "The President who was most responsible for escalating US involvement in Vietnam was President Johnson. It became an all-out fighting war. Immediately after the Gulf of Tonkin incident, Johnson decided on American retaliation, ordering bombing raids against the Vietcong in South Vietnam. A few months later, Johnson approved a secret plan that widened the conflict as it suggested bombing North Vietnam. The plan also mentioned that American soldiers would soon be fighting on Vietnamese territory. Johnson decided to send two US army divisions to South Vietnam, but this was only the beginning."
      },
      questiona: "How useful are Sources B and C for an enquiry into the escalation of US involvement in the conflict in Vietnam in the 1960s? (8 marks)",
      cluea: "Evaluate Source B (top-secret document 1961, shows Kennedy's early escalation via advisers, helicopters, and aid, highly reliable private source) and Source C (LBJ speech 1965, shows transition to ground combat forces up to 125,000 and draft increase, public speech justifying war) for usefulness.",
      modela: "Source B is highly useful for understanding the early stages of US escalation under President Kennedy. The content shows that in 1961, the US was escalating its support through military advisers, air reconnaissance, and economic aid to support President Diem's regime. The provenance increases its usefulness: as a contemporary, top-secret government document, it represents private, official policy decisions rather than public relations. This makes it highly useful for showing that the Kennedy administration was already committing the US to a deeper, covert military role to counter communism in South Vietnam.\\n\\nSource C is highly useful for analyzing the transition to direct, open combat operations under President Johnson. The content details Johnson's decision to increase US troop levels from 74,000 to 125,000 men and expand the draft system to meet General Westmoreland's demands. The provenance, being a nationally broadcast speech in July 1965, is useful for showing how the president justified this massive, overt military escalation to the American public as a defensive reaction to 'Vietnamese aggression' shortly after the Gulf of Tonkin incident.\\n\\nTogether, the sources are extremely useful: Source B documents the covert, advisory phase under Kennedy, while Source C captures the launch of the overt, full-scale ground war under Johnson.",
      questionb: "What is the main difference between Interpretation 1 and Interpretation 2? (4 marks)",
      clueb: "Identify the core disagreement: Interpretation 1 argues that President Kennedy's 1961 decisions were the key turning point in expanding the US role. Interpretation 2 argues that President Johnson was most responsible for escalating the war into an all-out fighting combat war.",
      modelb: "The main difference is that Interpretation 1 argues that President Kennedy was responsible for the key turning point in expanding US involvement in 1961, highlighting the rapid expansion of military advisers and military aid. In contrast, Interpretation 2 argues that President Johnson was most responsible for the escalation, turning the conflict into an all-out fighting war involving direct combat troops and bombing campaigns.",
      questionc: "Suggest one reason why Interpretations 1 and Interpretation 2 give different views. You can use Sources B and C to help explain your answer. (4 marks)",
      cluec: "Link the interpretations to the sources: Interpretation 1 relies on Source B (the early commitments of advisers and aid under Kennedy); Interpretation 2 relies on Source C (Johnson's direct combat troop increases and draft escalation).",
      modelc: "The interpretations differ because the historians have given weight to different sources. Interpretation 1 is supported by Source B, which shows how Kennedy committed the US to increased military aid and advisers in South Vietnam in 1961, justifying the view that this was the initial turning point. Conversely, Interpretation 2 is supported by Source C, which shows Johnson sending combat troops and using the draft to raise fighting strength to 125,000 men, supporting the view that Johnson was most responsible for the combat escalation.\\n\\nAlternatively, they focus on different aspects of escalation. Interpretation 1 focuses on the transition from a diplomatic presence to active military support, noting that under Kennedy, advisers tripled and chemical weapons were authorized. Interpretation 2 focuses on the transition to an all-out combat war, emphasizing the deployment of ground combat divisions and the bombing of North Vietnam after the Gulf of Tonkin incident.",
      questiond: "How far do you agree with Interpretation 2 about the escalation of US involvement in the conflict in Vietnam in the 1960s? (16 marks)",
      clued: "A balanced essay. Support Interpretation 2 (Gulf of Tonkin Resolution 1964, Operation Rolling Thunder 1965, sending combat troops, draft system, Westmoreland strategy) and evaluate against Interpretation 1 (Kennedy's Green Berets, 16,000 advisers by 1963, Strategic Hamlets, chemical defoliants, Diem coup involvement).",
      modeld: "I agree to a large extent with Interpretation 2 that President Johnson was the president most responsible for the combat escalation of the war. After the [[1964]] [[Gulf of Tonkin incident]], Johnson secured the Gulf of Tonkin Resolution, which gave him a blank check to wage war. In 1965, he launched [[Operation Rolling Thunder]], a massive bombing campaign against North Vietnam, and deployed the first official US ground troops to Da Nang. As shown in Source C, he escalated troop strength to [[125,000]] and eventually to over [[500,000]] men, using the draft. This transformed Vietnam from an advisory mission into an all-out combat war, supporting Interpretation 2.\\n\\nHowever, Interpretation 1 is also valid in identifying Kennedy's administration as the initial, critical turning point. Under Kennedy, the number of US military 'advisers' rose from under 1,000 to over [[16,000]] by 1963. He authorized the Green Berets to conduct covert operations, backed the creation of the oppressive [[Strategic Hamlets]] program in 1962, and approved the use of chemical defoliants like [[Agent Orange]]. Furthermore, his administration was complicit in the coup that overthrew President Diem in November 1963, locking the US into South Vietnam's defense. This supports Interpretation 1's argument that Kennedy laid the essential groundwork for the escalation.\\n\\nOverall, while Kennedy made the crucial decisions that committed the US militarily (Interpretation 1), it was Johnson who took the decisive step of initiating a direct, large-scale American ground war (Interpretation 2). Until Johnson deployed combat troops and began bombing North Vietnam, the US role was theoretically advisory. Therefore, Interpretation 2 is the stronger explanation because Johnson's policies fundamentally changed the nature of the conflict into an American war."
    }
  }
};`;

content = content.replace(q3Target, q3Replacement);


// 4. Target PAST_PAPERS_DATA array end and insert new paper definitions for 2022, 2023, 2024, 2025
const papersTarget = `Overall, while the boycott did not immediately solve the deep-rooted segregation and economic inequality in Montgomery (Interpretation 2), it was of monumental significance. It proved that mass action could force federal intervention and, most importantly, it gave Black Americans the psychological confidence and organizational structure (SCLC) that would drive the movement forward for the next two decades (Interpretation 1)."
    }
  }
];`;

const papersReplacement = `Overall, while the boycott did not immediately solve the deep-rooted segregation and economic inequality in Montgomery (Interpretation 2), it was of monumental significance. It proved that mass action could force federal intervention and, most importantly, it gave Black Americans the psychological confidence and organizational structure (SCLC) that would drive the movement forward for the next two decades (Interpretation 1)."
    }
  },
  {
    id: "2022_summer_usa",
    title: "Summer 2022 Past Paper (Option 33)",
    year: "2022",
    enquiryTopic: "Methods used by the Black Panther movement",
    sourceA: EXAM_SKILLS_DATA.q1.p_2022_q1.sourceA,
    sourceB: EXAM_SKILLS_DATA.q3.p_2022_q3.sourceB,
    sourceC: EXAM_SKILLS_DATA.q3.p_2022_q3.sourceC,
    interpretation1: EXAM_SKILLS_DATA.q3.p_2022_q3.interpretation1,
    interpretation2: EXAM_SKILLS_DATA.q3.p_2022_q3.interpretation2,
    q1: {
      id: "p_2022_q1",
      question: "Give two things you can infer from Source A about Search and Destroy missions in Vietnam. (4 marks)",
      clue: EXAM_SKILLS_DATA.q1.p_2022_q1.clue,
      model: EXAM_SKILLS_DATA.q1.p_2022_q1.model
    },
    q2: {
      id: "p_2022_q2",
      question: "Explain why opposition in the USA to the Vietnam War increased in the years 1964–73. (12 marks)",
      stimulus: ["My Lai Massacre (1968)", "Kent State University (1970)"],
      clue: EXAM_SKILLS_DATA.q2.p_2022_q2.clue,
      model: EXAM_SKILLS_DATA.q2.p_2022_q2.model
    },
    q3a: {
      id: "p_2022_q3a",
      question: "How useful are Sources B and C for an enquiry into the methods used by the Black Panther movement? (8 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2022_q3.cluea,
      model: EXAM_SKILLS_DATA.q3.p_2022_q3.modela
    },
    q3b: {
      id: "p_2022_q3b",
      question: "What is the main difference between Interpretation 1 and Interpretation 2? (4 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2022_q3.clueb,
      model: EXAM_SKILLS_DATA.q3.p_2022_q3.modelb
    },
    q3c: {
      id: "p_2022_q3c",
      question: "Suggest one reason why Interpretation 1 and Interpretation 2 give different views. You can use Sources B and C to help you. (4 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2022_q3.cluec,
      model: EXAM_SKILLS_DATA.q3.p_2022_q3.modelc
    },
    q3d: {
      id: "p_2022_q3d",
      question: "How far do you agree with Interpretation 2 about the methods used by the Black Panther movement? (16 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2022_q3.clued,
      model: EXAM_SKILLS_DATA.q3.p_2022_q3.modeld
    }
  },
  {
    id: "2023_summer_usa",
    title: "Summer 2023 Past Paper (Option 33)",
    year: "2023",
    enquiryTopic: "The Freedom Summer (1964)",
    sourceA: EXAM_SKILLS_DATA.q1.p_2023_q1.sourceA,
    sourceB: EXAM_SKILLS_DATA.q3.p_2023_q3.sourceB,
    sourceC: EXAM_SKILLS_DATA.q3.p_2023_q3.sourceC,
    interpretation1: EXAM_SKILLS_DATA.q3.p_2023_q3.interpretation1,
    interpretation2: EXAM_SKILLS_DATA.q3.p_2023_q3.interpretation2,
    q1: {
      id: "p_2023_q1",
      question: "Give two things you can infer from Source A about the Strategic Hamlet Program in Vietnam. (4 marks)",
      clue: EXAM_SKILLS_DATA.q1.p_2023_q1.clue,
      model: EXAM_SKILLS_DATA.q1.p_2023_q1.model
    },
    q2: {
      id: "p_2023_q2",
      question: "Explain why the USA was involved in the peace negotiations (1972–73) about the war in Vietnam. (12 marks)",
      stimulus: ["President Nixon", "Ho Chi Minh Trail"],
      clue: EXAM_SKILLS_DATA.q2.p_2023_q2.clue,
      model: EXAM_SKILLS_DATA.q2.p_2023_q2.model
    },
    q3a: {
      id: "p_2023_q3a",
      question: "How useful are Sources B and C for an enquiry into the Freedom Summer (1964)? (8 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2023_q3.cluea,
      model: EXAM_SKILLS_DATA.q3.p_2023_q3.modela
    },
    q3b: {
      id: "p_2023_q3b",
      question: "What is the main difference between Interpretation 1 and Interpretation 2? (4 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2023_q3.clueb,
      model: EXAM_SKILLS_DATA.q3.p_2023_q3.modelb
    },
    q3c: {
      id: "p_2023_q3c",
      question: "Suggest one reason why Interpretation 1 and Interpretation 2 give different views. You can use Sources B and C to help you. (4 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2023_q3.cluec,
      model: EXAM_SKILLS_DATA.q3.p_2023_q3.modelc
    },
    q3d: {
      id: "p_2023_q3d",
      question: "How far do you agree with Interpretation 2 about the Freedom Summer (1964)? (16 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2023_q3.clued,
      model: EXAM_SKILLS_DATA.q3.p_2023_q3.modeld
    }
  },
  {
    id: "2024_summer_usa",
    title: "Summer 2024 Past Paper (Option 33)",
    year: "2024",
    enquiryTopic: "Achievements of Martin Luther King in the civil rights movement",
    sourceA: EXAM_SKILLS_DATA.q1.p_2024_q1.sourceA,
    sourceB: EXAM_SKILLS_DATA.q3.p_2024_q3.sourceB,
    sourceC: EXAM_SKILLS_DATA.q3.p_2024_q3.sourceC,
    interpretation1: EXAM_SKILLS_DATA.q3.p_2024_q3.interpretation1,
    interpretation2: EXAM_SKILLS_DATA.q3.p_2024_q3.interpretation2,
    q1: {
      id: "p_2024_q1",
      question: "Give two things you can infer from Source A about the treatment of Black Americans in the 1950s. (4 marks)",
      clue: EXAM_SKILLS_DATA.q1.p_2024_q1.clue,
      model: EXAM_SKILLS_DATA.q1.p_2024_q1.model
    },
    q2: {
      id: "p_2024_q2",
      question: "Explain why the USA was not able to win the war against the Vietcong in the years 1964–73. (12 marks)",
      stimulus: ["the Vietcong use of booby traps", "the US use of Agent Orange"],
      clue: EXAM_SKILLS_DATA.q2.p_2024_q2.clue,
      model: EXAM_SKILLS_DATA.q2.p_2024_q2.model
    },
    q3a: {
      id: "p_2024_q3a",
      question: "How useful are Sources B and C for an enquiry into the achievements of Martin Luther King in the civil rights movement? (8 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2024_q3.cluea,
      model: EXAM_SKILLS_DATA.q3.p_2024_q3.modela
    },
    q3b: {
      id: "p_2024_q3b",
      question: "What is the main difference between Interpretation 1 and Interpretation 2? (4 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2024_q3.clueb,
      model: EXAM_SKILLS_DATA.q3.p_2024_q3.modelb
    },
    q3c: {
      id: "p_2024_q3c",
      question: "Suggest one reason why Interpretation 1 and Interpretation 2 give different views. You can use Sources B and C to help you. (4 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2024_q3.cluec,
      model: EXAM_SKILLS_DATA.q3.p_2024_q3.modelc
    },
    q3d: {
      id: "p_2024_q3d",
      question: "How far do you agree with Interpretation 2 about the achievements of Martin Luther King in the civil rights movement? (16 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2024_q3.clued,
      model: EXAM_SKILLS_DATA.q3.p_2024_q3.modeld
    }
  },
  {
    id: "2025_summer_usa",
    title: "Summer 2025 Past Paper (Option 33)",
    year: "2025",
    enquiryTopic: "Escalation of US involvement in the conflict in Vietnam in the 1960s",
    sourceA: EXAM_SKILLS_DATA.q1.p_2025_q1.sourceA,
    sourceB: EXAM_SKILLS_DATA.q3.p_2025_q3.sourceB,
    sourceC: EXAM_SKILLS_DATA.q3.p_2025_q3.sourceC,
    interpretation1: EXAM_SKILLS_DATA.q3.p_2025_q3.interpretation1,
    interpretation2: EXAM_SKILLS_DATA.q3.p_2025_q3.interpretation2,
    q1: {
      id: "p_2025_q1",
      question: "Give two things you can infer from Source A about the Ho Chi Minh Trail during the Vietnam War. (4 marks)",
      clue: EXAM_SKILLS_DATA.q1.p_2025_q1.clue,
      model: EXAM_SKILLS_DATA.q1.p_2025_q1.model
    },
    q2: {
      id: "p_2025_q2",
      question: "Explain why the Montgomery Bus Boycott (1955–56) was successful. (12 marks)",
      stimulus: ["Montgomery Improvement Association (MIA)", "US Supreme Court"],
      clue: EXAM_SKILLS_DATA.q2.p_2025_q2.clue,
      model: EXAM_SKILLS_DATA.q2.p_2025_q2.model
    },
    q3a: {
      id: "p_2025_q3a",
      question: "How useful are Sources B and C for an enquiry into the escalation of US involvement in the conflict in Vietnam in the 1960s? (8 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2025_q3.cluea,
      model: EXAM_SKILLS_DATA.q3.p_2025_q3.modela
    },
    q3b: {
      id: "p_2025_q3b",
      question: "What is the main difference between Interpretation 1 and Interpretation 2? (4 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2025_q3.clueb,
      model: EXAM_SKILLS_DATA.q3.p_2025_q3.modelb
    },
    q3c: {
      id: "p_2025_q3c",
      question: "Suggest one reason why Interpretation 1 and Interpretation 2 give different views. You can use Sources B and C to help you. (4 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2025_q3.cluec,
      model: EXAM_SKILLS_DATA.q3.p_2025_q3.modelc
    },
    q3d: {
      id: "p_2025_q3d",
      question: "How far do you agree with Interpretation 2 about the escalation of US involvement in the conflict in Vietnam in the 1960s? (16 marks)",
      clue: EXAM_SKILLS_DATA.q3.p_2025_q3.clued,
      model: EXAM_SKILLS_DATA.q3.p_2025_q3.modeld
    }
  }
];`;

content = content.replace(papersTarget, papersReplacement);

fs.writeFileSync('questions.js', content, 'utf8');
console.log("SUCCESS: questions.js has been successfully updated with 2022, 2023, 2024, and 2025 past papers!");
