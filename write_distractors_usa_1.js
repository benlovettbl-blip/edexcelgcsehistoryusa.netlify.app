const fs = require('fs');
const path = require('path');

const distractorsPart1 = {
  "q_1_1_s1": [
    "Black Codes",
    "Grandfather clauses",
    "De jure segregation acts"
  ],
  "q_1_1_s2": [
    "National Association for the Advancement of Civil Rights",
    "National Alliance for the Advocacy of Colored People",
    "National Coalition for the Advancement of Colored Persons"
  ],
  "q_1_1_s3": [
    "SCLC (Southern Christian Leadership Conference)",
    "SNCC (Student Nonviolent Coordinating Committee)",
    "NAACP (National Association for the Advancement of Colored People)"
  ],
  "q_1_1_s4": [
    "Non-violent direct action and marches",
    "Armed self-defense and street patrols",
    "Economic boycotts of white businesses"
  ],
  "q_1_1_s5": [
    "Due to federal voting laws, state bans, and Supreme Court rulings",
    "Due to strict residency requirements, property ownership tests, and language barriers",
    "Due to age restrictions, citizenship requirements, and grandfather clauses"
  ],
  "q_1_1_s6": [
    "Equal protection under the law",
    "Integration with all deliberate speed",
    "Freedom of association"
  ],
  "q_1_1_s7": [
    "To build political coalitions with Southern Democrats and lobby Congress",
    "To protect Black communities from white violence and police brutality",
    "To raise funds for legal defense fees in landmark Supreme Court cases"
  ],
  "q_1_1_s8": [
    "Charles Hamilton Houston",
    "W. E. B. Du Bois",
    "A. Philip Randolph"
  ],
  "q_1_1_s9": [
    "Franklin D. Roosevelt",
    "Dwight D. Eisenhower",
    "John F. Kennedy"
  ],
  "q_1_1_s10": [
    "13th Amendment",
    "15th Amendment",
    "24th Amendment"
  ],
  "q_1_1_d1": [
    "Property taxes",
    "Residency fees",
    "Registration tariffs"
  ],
  "q_1_1_d2": [
    "Character tests",
    "Loyalty tests",
    "Residency tests"
  ],
  "q_1_1_d3": [
    "1896",
    "1919",
    "1925"
  ],
  "q_1_1_d4": [
    "Sweatt v. Painter",
    "Plessy v. Ferguson",
    "Brown v. Board of Education"
  ],
  "q_1_1_d5": [
    "Because state police forces would arrest them on false vagrancy charges",
    "Because local registrars would publish their names in newspapers to invite violence",
    "Because federal marshals would refuse to protect them at registration offices"
  ],
  "q_1_2_s1": [
    "Plessy v. Ferguson of New Orleans",
    "Sweatt v. Painter of Austin",
    "McLaurin v. Oklahoma State Regents"
  ],
  "q_1_2_s2": [
    "The Greensboro Four",
    "The Montgomery Boycotters",
    "The Freedom Riders"
  ],
  "q_1_2_s3": [
    "Fred M. Vinson",
    "Hugo Black",
    "William O. Douglas"
  ],
  "q_1_2_s4": [
    "George Wallace",
    "Ross Barnett",
    "Allan Shivers"
  ],
  "q_1_2_s5": [
    "82nd Airborne Division",
    "1st Infantry Division",
    "2nd Armored Division"
  ],
  "q_1_2_s6": [
    "Charles Hamilton Houston",
    "Archibald Cox",
    "James Nabrit"
  ],
  "q_1_2_s7": [
    "1954",
    "1955",
    "1960"
  ],
  "q_1_2_s8": [
    "Little Rock High School",
    "Arkansas State Academy",
    "Southern Consolidated High"
  ],
  "q_1_2_d1": [
    "Decreed that Southern states must desegregate all public transport immediately",
    "Ruled that school districts must create separate school systems for Black students",
    "Ordered the immediate arrest of Southern governors who blocked school doors"
  ],
  "q_1_2_d2": [
    "Plessy v. Ferguson",
    "Brown v. Board of Education",
    "Smith v. Allwright"
  ],
  "q_1_2_d3": [
    "Claudette Colvin",
    "Linda Brown",
    "Daisy Bates"
  ],
  "q_1_2_d4": [
    "Jo Ann Robinson",
    "Ella Baker",
    "Septima Clark"
  ],
  "q_1_2_d5": [
    "Because the President refused to support the Supreme Court decision in public",
    "Because the NAACP lacked the financial resources to bring lawsuits to local courts",
    "Because the majority of Black parents in the South preferred segregated schools"
  ],
  "q_1_3_s1": [
    "Claudette Colvin",
    "Jo Ann Robinson",
    "Daisy Bates"
  ],
  "q_1_3_s2": [
    "Ralph Abernathy",
    "Fred Shuttlesworth",
    "Roy Wilkins"
  ],
  "q_1_3_s3": [
    "Student Campaign for Liberation and Equality",
    "Southern Coalition of Liberated Churches",
    "State Committee for Law and Civil Rights"
  ],
  "q_1_3_s4": [
    "100 days",
    "250 days",
    "500 days"
  ],
  "q_1_3_s5": [
    "Bull Connor",
    "George Wallace",
    "Laurie Pritchett"
  ],
  "q_1_3_s6": [
    "Bicycle relay system",
    "Free taxi service",
    "Shuttle train system"
  ],
  "q_1_3_s7": [
    "Brown v. Board of Education",
    "Plessy v. Ferguson",
    "Sweatt v. Painter"
  ],
  "q_1_3_s8": [
    "40%",
    "55%",
    "90%"
  ],
  "q_1_3_s9": [
    "Fred Shuttlesworth",
    "Ralph Abernathy",
    "James Farmer"
  ],
  "q_1_3_s10": [
    "Legal petitioning",
    "Armed resistance",
    "Political lobbying"
  ],
  "q_1_3_d1": [
    "1 December 1955",
    "5 December 1955",
    "13 November 1956"
  ],
  "q_1_3_d2": [
    "Mary Louise Smith",
    "Aurelia Browder",
    "Susie McDonald"
  ],
  "q_1_3_d3": [
    "13th Amendment",
    "15th Amendment",
    "19th Amendment"
  ],
  "q_1_3_d4": [
    "Daisy Bates",
    "Rosa Parks",
    "Ella Baker"
  ],
  "q_1_3_d5": [
    "National Council of Negro Women (NCNW)",
    "Southern Christian Leadership Conference (SCLC)",
    "Student Nonviolent Coordinating Committee (SNCC)"
  ],
  "q_1_4_s1": [
    "The Declaration of Constitutional Defiance",
    "The Southern Segregation Accord",
    "The Dixiecrats Manifesto"
  ],
  "q_1_4_s2": [
    "Southern Rights Associations",
    "Patriots for Segregation Guilds",
    "Anti-Integration Leagues"
  ],
  "q_1_4_s3": [
    "The White League",
    "The Knights of the White Camelia",
    "The Southern Knights Guard"
  ],
  "q_1_4_s4": [
    "Richard Russell",
    "James Eastland",
    "Harry F. Byrd"
  ],
  "q_1_4_s5": [
    "1954",
    "1955",
    "1957"
  ],
  "q_1_4_s6": [
    "Harry S. Truman",
    "John F. Kennedy",
    "Lyndon B. Johnson"
  ],
  "q_1_4_s7": [
    "Gerrymandering",
    "Cloture petition",
    "Pork barreling"
  ],
  "q_1_4_s8": [
    "School integration",
    "Employment discrimination",
    "Public transport segregation"
  ],
  "q_1_4_s9": [
    "Federal funding for integrated schools in the South",
    "The total desegregation of all public transport facilities",
    "Protection of civil rights activists against white bombings"
  ],
  "q_1_4_s10": [
    "50 congressmen",
    "75 congressmen",
    "120 congressmen"
  ],
  "q_1_4_d1": [
    "12 hours and 30 minutes",
    "18 hours and 45 minutes",
    "30 hours and 12 minutes"
  ],
  "q_1_4_d2": [
    "Because it forced the state government to arrest the killers immediately",
    "Because it led to an immediate federal investigation into Southern lynching",
    "Because it convinced Southern politicians to support the Civil Rights Bill"
  ],
  "q_1_4_d3": [
    "Whigs",
    "Populists",
    "Redeemers"
  ],
  "q_1_4_d4": [
    "Voter registration purge and literacy re-testing",
    "Physical assaults and house burnings of active organizers",
    "State prosecutions and false tax evasion charges"
  ],
  "q_1_4_d5": [
    "Medgar Evers",
    "Jimmie Lee Jackson",
    "James Chaney"
  ],
  "q_2_1_s1": [
    "Nashville, Tennessee",
    "Atlanta, Georgia",
    "Birmingham, Alabama"
  ],
  "q_2_1_s2": [
    "Student Nonviolent Coalition Committee",
    "Southern Negro Youth Congress",
    "State Network for Civil Reform"
  ],
  "q_2_1_s3": [
    "Sit-ins",
    "Freedom Summer",
    "Selma Marches"
  ],
  "q_2_1_s4": [
    "1960",
    "1962",
    "1963"
  ],
  "q_2_1_s5": [
    "SCLC (Southern Christian Leadership Conference)",
    "SNCC (Student Nonviolent Coordinating Committee)",
    "NAACP (National Association for the Advancement of Colored People)"
  ],
  "q_2_1_s6": [
    "James Hood",
    "Harvey Gantt",
    "Hamilton Holmes"
  ],
  "q_2_1_s7": [
    "Dwight D. Eisenhower",
    "Lyndon B. Johnson",
    "Richard Nixon"
  ],
  "q_2_1_s8": [
    "Nicholas Katzenbach",
    "Archibald Cox",
    "J. Edgar Hoover"
  ],
  "q_2_1_s9": [
    "Birmingham",
    "Montgomery",
    "Jackson"
  ],
  "q_2_1_s10": [
    "Savannah",
    "Augusta",
    "Macon"
  ],
  "q_2_1_d1": [
    "Freedom Riders",
    "Interstate Desegregationists",
    "CORE Volunteers"
  ],
  "q_2_1_d2": [
    "James Farmer",
    "Bayard Rustin",
    "John Lewis"
  ],
  "q_2_1_d3": [
    "Because the local Black community refused to support the protests",
    "Because the federal government refused to send marshals to assist",
    "Because the organizers ran out of funds to support arrested activists"
  ],
  "q_2_1_d4": [
    "George Wallace",
    "Orval Faubus",
    "Paul B. Johnson Jr."
  ],
  "q_2_1_d5": [
    "Septima Clark",
    "Jo Ann Robinson",
    "Daisy Bates"
  ],
  "q_2_2_s1": [
    "Montgomery, Alabama",
    "Selma, Alabama",
    "Jackson, Mississippi"
  ],
  "q_2_2_s2": [
    "Laurie Pritchett",
    "Jim Clark",
    "W. A. Gayle"
  ],
  "q_2_2_s3": [
    "Letter from Birmingham Jail",
    "The Montgomery Manifesto",
    "The Nonviolent Direct Action Guide"
  ],
  "q_2_2_s4": [
    "June 1963",
    "July 1963",
    "September 1963"
  ],
  "q_2_2_s5": [
    "I Have a Dream",
    "Let Freedom Ring",
    "Normalcy No More"
  ],
  "q_2_2_s6": [
    "Dwight D. Eisenhower",
    "Lyndon B. Johnson",
    "Richard Nixon"
  ],
  "q_2_2_s7": [
    "John F. Kennedy",
    "Richard Nixon",
    "Gerald Ford"
  ],
  "q_2_2_s8": [
    "Birmingham, Alabama",
    "Montgomery, Alabama",
    "Tuskegee, Alabama"
  ],
  "q_2_2_s9": [
    "Civil Rights Act of 1964",
    "Equal Opportunity Act of 1964",
    "Fair Housing Act of 1968"
  ],
  "q_2_2_s10": [
    "Over 100,000",
    "Over 150,000",
    "Over 500,000"
  ],
  "q_2_2_d1": [
    "George Washington Bridge",
    "Jefferson Davis Bridge",
    "Alabama River Bridge"
  ],
  "q_2_2_d2": [
    "Because the city had a highly active local NAACP chapter ready to march",
    "Because the city was the birthplace of the SCLC and King's first parish",
    "Because the city government had indicated it was willing to desegregate"
  ],
  "q_2_2_d3": [
    "To protest against the recent assassination of Malcolm X in New York",
    "To demand the desegregation of all public facilities in the capital city",
    "To support the campaign of moderate Democrats running for local offices"
  ],
  "q_2_2_d4": [
    "Stokely Carmichael",
    "Bob Moses",
    "James Bevel"
  ],
  "q_2_2_d5": [
    "Medgar Evers, Jimmie Lee Jackson, and Viola Liuzzo",
    "John Daniels, Jonathan Daniels, and Willie Brewster",
    "Lemuel Penn, Virgil Ware, and Johnny Robinson"
  ],
  "q_2_3_s1": [
    "Elijah Muhammad",
    "Stokely Carmichael",
    "Bobby Seale"
  ],
  "q_2_3_s2": [
    "Black Nationalism",
    "By Any Means Necessary",
    "Self-Defense Now"
  ],
  "q_2_3_s3": [
    "Stokely Carmichael and H. Rap Brown",
    "Fred Hampton and Mark Clark",
    "Malcolm X and Elijah Muhammad"
  ],
  "q_2_3_s4": [
    "Louis Farrakhan",
    "Wallace Fard Muhammad",
    "Warith Deen Mohammed"
  ],
  "q_2_3_s5": [
    "1963",
    "1964",
    "1966"
  ],
  "q_2_3_s6": [
    "1964",
    "1965",
    "1968"
  ],
  "q_2_3_s7": [
    "Jesse Owens and Ralph Metcalfe",
    "Bob Beamon and Wyomia Tyus",
    "Lee Evans and Tommie Smith"
  ],
  "q_2_3_s8": [
    "Los Angeles",
    "San Francisco",
    "Chicago"
  ],
  "q_2_3_s9": [
    "CORE",
    "SCLC",
    "NAACP"
  ],
  "q_2_3_s10": [
    "Muslim Mosque, Inc. (MMI)",
    "Nation of Islam (NOI)",
    "Black Panther Party (BPP)"
  ],
  "q_2_3_d1": [
    "Because of the active recruitment efforts of the Nation of Islam in colleges",
    "Because moderate civil rights leaders urged urban youth to form self-defense militias",
    "Because the federal government withdrew all funding from Northern inner-city programs"
  ],
  "q_2_3_d2": [
    "The Fire Next Time",
    "Soul on Ice",
    "Where Do We Go from Here: Chaos or Community?"
  ],
  "q_2_3_d3": [
    "Community Medical Clinics Program",
    "Interstate Bus Desegregation Escort Patrol",
    "Legal Aid for Incarcerated Youth Campaign"
  ],
  "q_2_3_d4": [
    "Systemic prejudice",
    "De facto segregation",
    "Structural bias"
  ],
  "q_2_3_d5": [
    "Freedom Summer campaign",
    "March on Washington",
    "Greensboro sit-ins"
  ],
  "q_2_4_s1": [
    "Compton",
    "East Los Angeles",
    "Inglewood"
  ],
  "q_2_4_s2": [
    "Warren Commission",
    "McCone Commission",
    "Eisenhower Commission"
  ],
  "q_2_4_s3": [
    "21 February 1965",
    "22 November 1963",
    "5 June 1968"
  ],
  "q_2_4_s4": [
    "Atlanta, Georgia",
    "Birmingham, Alabama",
    "Jackson, Mississippi"
  ],
  "q_2_4_s5": [
    "Poor People's Campaign",
    "Birmingham Campaign",
    "Mississippi Freedom Project"
  ],
  "q_2_4_s6": [
    "Lee Harvey Oswald",
    "Sirhan Sirhan",
    "Byron De La Beckwith"
  ],
  "q_2_4_s7": [
    "Voting Rights Act of 1965",
    "Equal Opportunity Act of 1964",
    "Civil Rights Act of 1964"
  ],
  "q_2_4_s8": [
    "March on Washington for Jobs and Freedom",
    "Resurrection City Project",
    "Coalition of the Poor League"
  ],
  "q_2_4_s9": [
    "Jesse Jackson",
    "Fred Shuttlesworth",
    "Andrew Young"
  ],
  "q_2_4_s10": [
    "Over 20 cities",
    "Over 50 cities",
    "Over 200 cities"
  ],
  "q_2_4_d1": [
    "To support the Democratic mayoral candidate running for city office",
    "To test the enforcement of the recently passed Voting Rights Act of 1965",
    "To organize the first Northern branch of the Black Panther Party"
  ],
  "q_2_4_d2": [
    "Leading toward a classless society, unified in economic progress - equal and free",
    "Remaining divided into separate regional factions based on political party lines",
    "Rapidly integrating public spaces but remaining segregated in political power"
  ],
  "q_2_4_d3": [
    "Evanston",
    "Oak Park",
    "Skokie"
  ],
  "q_2_4_d4": [
    "Transit workers' strike",
    "Postal employees' strike",
    "Steel mills walkout"
  ],
  "q_2_4_d5": [
    "1964",
    "1967",
    "1968"
  ]
};

fs.writeFileSync(path.join(__dirname, 'scratch_distractors_part1.json'), JSON.stringify(distractorsPart1, null, 2), 'utf8');
console.log("Successfully wrote scratch_distractors_part1.json");
