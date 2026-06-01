const fs = require('fs');

let content = fs.readFileSync('questions.js', 'utf8');

// 1. Rename the first p_2019_q2 (Vietnam concern in 1963) to p_2019_q2_concern
// To target ONLY the first one, let's find the concern question text and rename the key and ID.
content = content.replace(
  `  "p_2019_q2": {
      id: "p_2019_q2",
      topicCode: "3.1",
      question: "Explain why the USA was concerned about the future of Vietnam in 1963."`,
  `  "p_2019_q2_concern": {
      id: "p_2019_q2_concern",
      topicCode: "3.1",
      question: "Explain why the USA was concerned about the future of Vietnam in 1963."`
);

// 2. Append the p_2020_q2 question block under q2 section
const nixonEnding = `protecting withdrawing US forces. As a result, this military shift was a key cause of changed involvement because it replaced American ground combat casualties with heavy air power and regional incursions, aiming to achieve 'peace with honor'."
    }
  },
  q3: {`;

const nixonReplacement = `protecting withdrawing US forces. As a result, this military shift was a key cause of changed involvement because it replaced American ground combat casualties with heavy air power and regional incursions, aiming to achieve 'peace with honor'."
    },
    "p_2020_q2": {
      id: "p_2020_q2",
      topicCode: "1.4",
      question: "Explain why there was opposition to the civil rights movement in the years 1954–60.",
      stimulus1: "Ku Klux Klan",
      stimulus2: "Dixiecrats",
      clue: "Aim for three paragraphs following the PEEL structure. Make sure at the end of each paragraph, the link is a judgment that answers the question explicitly.",
      knowledgeWords: ["Klan", "Dixiecrats", "Manifesto", "Citizens", "segregation", "Plessy", "Faubus", "desegregation"],
      connectiveWords: ["as a result", "consequently", "this led to", "therefore", "because of", "due to"],
      model: "Opposition was driven by deep white supremacist beliefs and enforced through vigilante violence by the Ku Klux Klan. The KKK was committed to resisting desegregation, using terror tactics like beatings, bombings, and the murder of activists to maintain racial hierarchy. The climate of fear was exemplified by the brutal murder of Emmett Till in 1955 for allegedly wolf-whistling at a white woman, showing how far white communities would go to defend segregation. Therefore, the KKK and racial terror were major causes of opposition because they created a deadly barrier to activism, ensuring segregation persisted through violence.\\n\\nPolitical opposition in Congress was organized by Southern politicians known as the 'Dixiecrats' to block federal civil rights laws. These segregationist Democrats signed the Southern Manifesto in 1956, pledging to resist the Supreme Court's school desegregation rulings by all legal means. By exploiting congressional rules like the filibuster, the Dixiecrats successfully delayed and weakened civil rights legislation, preserving Jim Crow. Consequently, parliamentary obstruction by the Dixiecrats was a key cause of opposition because it shielded Southern states from federal enforcement, keeping local segregation laws intact.\\n\\nFinally, opposition grew as a direct, organized reaction against school desegregation. White Citizens' Councils were established across the South to apply economic pressure on civil rights activists, such as firing Black workers or evicting tenants. This backlash was supported by Southern state governors like Orval Faubus, who used the National Guard to block Black students at Little Rock Central High School in 1957. As a result, organized community resistance and state defiance were decisive causes of opposition because they mobilized entire white populations to protect their local customs from federal interference."
    }
  },
  q3: {`;

content = content.replace(nixonEnding, nixonReplacement);

fs.writeFileSync('questions.js', content, 'utf8');
console.log("Successfully fixed duplicates and appended p_2020_q2!");
