const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'lessons_data.js');

// Import existing data
const { LESSONS_DATA } = require(filePath);

// Define provenance texts for Scholarly Perspective images (1 per lesson)
const PROVENANCES = {
  "subtopic_1_1": "A formal group portrait of the members of the Warren Court, the Supreme Court of the United States, taken in Washington D.C., 1954.",
  "subtopic_1_2": "A photograph of President Dwight D. Eisenhower giving a televised address from the White House, explaining his decision to send federal troops to Little Rock, Arkansas, 24 September 1957.",
  "subtopic_1_3": "A photograph of Rosa Parks riding in the front of a Montgomery city bus, taken on 21 December 1956, the day the Supreme Court's ruling outlawing segregated buses took effect.",
  "subtopic_1_4": "A photograph of Southern US Representatives and Senators signing the Declaration of Constitutional Principles (known as the 'Southern Manifesto') in Washington D.C., March 1956, to express opposition to school integration.",
  "subtopic_2_1": "A photograph of the smoking wreckage of a Greyhound bus carrying Freedom Riders, firebombed by a white segregationist mob in Anniston, Alabama, 14 May 1961.",
  "subtopic_2_2": "A photograph of Alabama state troopers wearing gas masks and armed with clubs lined up on the Edmund Pettus Bridge in Selma, Alabama, shortly before attacking voting rights marchers on 'Bloody Sunday', 7 March 1965.",
  "subtopic_2_3": "A photograph of Malcolm X speaking at a rally of the Nation of Islam, Chicago, Illinois, 1963, advocating self-reliance and Black nationalism.",
  "subtopic_2_4": "A photograph of demonstrators gathering at a tent encampment in Washington D.C. for the Poor People's Campaign, organized by the SCLC in May 1968 following the assassination of Martin Luther King Jr.",
  "subtopic_3_1": "A photograph of President Ngo Dinh Diem standing in a military vehicle during a parade in Saigon, October 1957, displaying the military forces supporting his regime.",
  "subtopic_3_2": "A photograph of Secretary of Defense Robert McNamara pointing at a map of Vietnam during a televised press briefing at the Pentagon, August 1964.",
  "subtopic_3_3": "A photograph of a US Bell UH-1D 'Huey' helicopter flying over the Mekong Delta during a combat assault mission in South Vietnam, 1967.",
  "subtopic_3_4": "A photograph of South Vietnamese ARVN troops holding positions behind a dirt mound during combat operations against Vietcong forces near Saigon, 1968.",
  "subtopic_4_1": "A photograph of Selective Service officials drawing blue capsules containing birth dates from a glass container during the first televised draft lottery in Washington D.C., 1 December 1969.",
  "subtopic_4_2": "A photograph of President Richard Nixon delivering a televised speech from the Oval Office, announcing his plan for 'Vietnamization' and the withdrawal of US troops, 3 November 1969.",
  "subtopic_4_3": "A photograph of National Security Advisor Henry Kissinger speaking with journalists in Paris, France, during negotiations for the Paris Peace Accords, January 1973.",
  "subtopic_4_4": "A formal photograph of General William Westmoreland, commander of US military operations in Vietnam from 1964 to 1968, taken in Washington D.C., 1968."
};

// Update the module LESSONS_DATA object programmatically
Object.entries(LESSONS_DATA).forEach(([topicId, topic]) => {
  if (PROVENANCES[topicId]) {
    if (topic.steps[0] && topic.steps[0].scholarlyDepth) {
      topic.steps[0].scholarlyDepth.imageProvenance = PROVENANCES[topicId];
    }
  }
});

// Write modified LESSONS_DATA back to lessons_data.js
const newContent = `export const LESSONS_DATA = ${JSON.stringify(LESSONS_DATA, null, 2)};\n`;
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Successfully injected scholarly image provenances into lessons_data.js!');
