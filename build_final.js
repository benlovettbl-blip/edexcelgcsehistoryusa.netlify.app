const fs = require('fs');

const topicsStr = fs.readFileSync('topics.json', 'utf8');
const topics = eval(topicsStr);

const part5Data = {
  "1.1": {
    questions: [
      "What was the system of separating Black and white people called?",
      "What test was used to stop Black citizens from voting?",
      "Name one public facility that was segregated.",
      "What threat did Black people face if they tried to vote?",
      "Which area of the USA had the strictest segregation laws?"
    ],
    answers: ["Segregation", "Literacy test", "Water fountains", "Violence", "The South"]
  },
  "1.2": {
    questions: [
      "Which 1954 Supreme Court case banned school segregation?",
      "What phrase was used by the court to describe segregated schools?",
      "In which city did nine Black students try to attend Central High School?",
      "Which president sent federal troops to protect the students?",
      "What was the policy of Southern states refusing to integrate called?"
    ],
    answers: ["Brown v. Topeka", "Unconstitutional", "Little Rock", "President Eisenhower", "Massive Resistance"]
  },
  "1.3": {
    questions: [
      "Who was arrested for refusing to give up her bus seat?",
      "In which city did the bus boycott take place?",
      "Who became the leader of the bus boycott?",
      "How long did the bus boycott last?",
      "Did the Supreme Court rule bus segregation legal or illegal?"
    ],
    answers: ["Rosa Parks", "Montgomery", "Martin Luther King", "Over a year", "Illegal"]
  },
  "1.4": {
    questions: [
      "Which groups were formed by middle-class businessmen to stop integration?",
      "Which violent racist group experienced a revival in the 1950s?",
      "Who was the young boy brutally murdered in 1955?",
      "Who found his killers not guilty?",
      "What term describes a mob killing someone without a legal trial?"
    ],
    answers: ["White Citizens Councils", "KKK", "Emmett Till", "An all-white jury", "Lynching"]
  },
  "2.1": {
    questions: [
      "What type of protest happened at Greensboro lunch counters?",
      "Who traveled on interstate buses to test desegregation laws?",
      "In which city did police chief Bull Connor attack protesters?",
      "What animals were used to attack protesters in Birmingham?",
      "What type of action did protesters use?"
    ],
    answers: ["Sit-ins", "Freedom Riders", "Birmingham", "Police dogs", "Direct, non-violent action"]
  },
  "2.2": {
    questions: [
      "Which act banned segregation in public places in 1964?",
      "Where did a famous march for voting rights take place in 1965?",
      "What was the violent attack on marchers in Alabama called?",
      "Which president signed these major civil rights laws?",
      "What did the Voting Rights Act of 1965 ban?"
    ],
    answers: ["Civil Rights Act", "Selma to Montgomery", "Bloody Sunday", "Lyndon B. Johnson", "Literacy tests"]
  },
  "2.3": {
    questions: [
      "Who was a leading figure in the Nation of Islam?",
      "What did Malcolm X believe in instead of integration?",
      "According to Malcolm X, how should Black Americans fight for their rights?",
      "What term describes poor, segregated inner-city neighborhoods?",
      "Did Malcolm X believe in Martin Luther King's peaceful approach?"
    ],
    answers: ["Malcolm X", "Black Nationalism", "By any means necessary", "Ghettos", "No"]
  },
  "2.4": {
    questions: [
      "Which leader popularized the phrase 'Black Power'?",
      "Which militant group carried guns for self-defense?",
      "Name one community survival program run by the Panthers.",
      "What event in 1968 featured a famous Black Power salute?",
      "What did the Black Panthers monitor to prevent brutality?"
    ],
    answers: ["Stokely Carmichael", "Black Panthers", "Free breakfast clubs", "The Olympics", "Police patrols"]
  },
  "3.1": {
    questions: [
      "What theory suggested that if one country fell to communism, others would follow?",
      "Which superpower was the USA fighting in the Cold War?",
      "Who was the communist leader of North Vietnam?",
      "Which half of Vietnam was anti-communist?",
      "Who did the USA send to train the South Vietnamese army initially?"
    ],
    answers: ["Domino Theory", "The Soviet Union", "Ho Chi Minh", "The South", "Military advisers"]
  },
  "3.2": {
    questions: [
      "Which US warship was reportedly fired upon in 1964?",
      "In which body of water did this incident occur?",
      "What did Congress pass to give the President power to wage war?",
      "Which President used this to send combat troops?",
      "Did Congress officially declare war on North Vietnam?"
    ],
    answers: ["USS Maddox", "Gulf of Tonkin", "Gulf of Tonkin Resolution", "Lyndon B. Johnson", "No"]
  },
  "3.3": {
    questions: [
      "What was the massive bombing campaign against North Vietnam called?",
      "What type of ground missions did US soldiers conduct?",
      "Which toxic weedkiller was used to destroy jungle cover?",
      "What flammable jelly was dropped in American bombs?",
      "What was a common result of Search and Destroy missions?"
    ],
    answers: ["Operation Rolling Thunder", "Search and Destroy", "Agent Orange", "Napalm", "Civilian casualties"]
  },
  "3.4": {
    questions: [
      "What major communist attack happened in early 1968?",
      "During which holiday did this attack take place?",
      "Which US building in Saigon was breached by a suicide squad?",
      "How did the American public watch the chaos?",
      "Did this event increase or decrease support for the war in America?"
    ],
    answers: ["The Tet Offensive", "Vietnamese New Year", "The US Embassy", "On television", "Decrease"]
  },
  "4.1": {
    questions: [
      "Which President introduced the policy of Vietnamisation?",
      "What did Vietnamisation mean for American combat troops?",
      "Whose army was supposed to take over the fighting?",
      "Which neighboring country did Nixon secretly bomb?",
      "What was Nixon's promised phrase for ending the war?"
    ],
    answers: ["Richard Nixon", "Slow withdrawal", "South Vietnamese army", "Cambodia", "Peace with Honor"]
  },
  "4.2": {
    questions: [
      "What did many young men burn to avoid joining the army?",
      "Where were protests especially common?",
      "At which university were four student protesters killed in 1970?",
      "Who fired into the crowd of students?",
      "What term describes people who oppose war because it is immoral?"
    ],
    answers: ["Draft cards", "College campuses", "Kent State University", "The National Guard", "Pacifists"]
  },
  "4.3": {
    questions: [
      "In what city was a peace treaty signed in 1973?",
      "What did the Paris Peace Accords agree to across Vietnam?",
      "How long did the USA have to remove its remaining troops?",
      "What did North Vietnam agree to release?",
      "Which city was finally captured by North Vietnam in 1975?"
    ],
    answers: ["Paris", "A ceasefire", "60 days", "American Prisoners of War", "Saigon"]
  },
  "4.4": {
    questions: [
      "What brilliant tactics did the Vietcong use?",
      "What did American troops suffer from in Vietnam?",
      "What term described soldiers murdering their own officers?",
      "What did the USA lose by destroying Vietnamese homes?",
      "Which movement in America pressured the government to pull out?"
    ],
    answers: ["Guerrilla tactics", "Low morale", "Fragging", "Hearts and Minds", "The anti-war movement"]
  }
};

topics.forEach(t => {
  if (part5Data[t.id]) {
    t.part5 = part5Data[t.id];
  }
});

const header = "const fs = require('fs');\n\nconst topics = " + JSON.stringify(topics, null, 2) + ";\n\n";

const template = fs.readFileSync('template_generator.js', 'utf8');

fs.writeFileSync('generate_foundation_pack.js', header + template);
console.log("Successfully rebuilt generate_foundation_pack.js cleanly.");
