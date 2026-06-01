const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('src/lessons_data.js', 'utf8')
  .replace('export const LESSONS_DATA =', 'global.LESSONS_DATA =');

const sandbox = { global: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const data = sandbox.global.LESSONS_DATA;

const summaries = {
  "subtopic_1_1": "By 1954, segregation in the USA was protected by the [[1896]] Plessy v. Ferguson decision. In May [[1956 -> 1954]], the Supreme Court ruled in Brown v. Board of Education that segregation in public schools was [[constitutional -> unconstitutional]]. Southern resistance was fierce. In December [[1956 -> 1955]], Rosa Parks was arrested in Montgomery, launching a [[381-day]] bus boycott led by [[Malcolm X -> Martin Luther King Jr.]] that forced bus desegregation in late [[1957 -> 1956]].",
  "subtopic_1_2": "In September [[1957]], Central High School in Little Rock, Arkansas, integrated. Governor Orval Faubus defied federal court orders, calling in the [[National Guard]] to [[protect -> block]] nine Black students. As angry white mobs gathered, President Eisenhower took action, sending in the [[101st Airborne]] Division to escort the students. This was the first time since the [[Civil War]] that federal troops were sent to the South to protect Black rights.",
  "subtopic_1_3": "The Montgomery Bus Boycott began after Rosa Parks was arrested on 1 December [[1955]]. The local community formed the Montgomery Improvement Association, led by [[Malcolm X -> Martin Luther King Jr.]]. Black citizens, who made up [[20% -> 70%]] of bus riders, boycotted the system for [[381 days]], severely hitting bus company revenues. The boycott ended in success when the Supreme Court ruled segregated buses were [[legal -> illegal]] in late 1956.",
  "subtopic_1_4": "Southern white opposition to integration grew in the late 1950s. Politicians signed the 'Southern Manifesto' in [[1956]], promising to resist integration. White Citizens' Councils used [[violence -> economic intimidation]] to stop activists, while KKK violence rose, including the murder of [[Martin Luther King -> Emmett Till]] in [[1955]]. Southern governors like Orval Faubus used state authority to [[support -> defy]] federal integration rulings.",
  "subtopic_2_1": "In February [[1960]], student-led sit-ins began at a Greensboro Woolworth's counter. In May [[1961]], CORE launched the Freedom Rides to test interstate bus desegregation, meeting violent mobs in Alabama. In [[1962]], James Meredith challenged university segregation, becoming the first Black student at the University of [[Alabama -> Mississippi]], which required federal marshals to suppress a riot that left [[two]] dead.",
  "subtopic_2_2": "The SCLC targeted Birmingham in [[1963]], where police chief Bull Connor used fire hoses on protesters, forcing President [[Eisenhower -> Kennedy]] to draft civil rights laws. In March [[1965]], marches in Selma faced brutality on 'Bloody Sunday'. These campaigns led directly to the [[Civil Rights Act of 1964]], which ended segregation in public places, and the [[Voting Rights Act of 1965]], which banned [[literacy tests]].",
  "subtopic_2_3": "Malcolm X of the Nation of Islam advocated for Black nationalism and self-defense [[non-violently -> by any means necessary]] before his assassination in [[1965]]. In [[1966]], Stokely Carmichael of SNCC popularized the phrase '[[Black Power]]'. This philosophy was institutionalized by the Black Panther Party, founded by Huey Newton and Bobby Seale in [[1966]], who organized armed patrols and [[violent riots -> community programs]].",
  "subtopic_2_4": "Urban riots erupted in Northern cities between 1965 and 1967, including in [[Chicago -> Watts]] (1965) and Detroit (1967), due to poverty and police brutality. The Kerner Commission report in [[1968]] blamed [[Black activists -> white racism]] for the unrest, stating America was moving toward 'two societies, separate and unequal'. Following MLK's assassination in [[1968]], Congress passed the Fair Housing Act, banning housing discrimination.",
  "subtopic_3_1": "US foreign policy aimed to contain communism, guided by the [[Domino Theory]] which suggested that if South Vietnam fell, neighboring Asian countries would also fall. The US backed South Vietnam's leader, Ngo Dinh Diem, in [[1954]]. However, Diem's regime was corrupt and persecuted [[Catholics -> Buddhists]], leading to the formation of the National Liberation Front (Vietcong) in [[1960]] and Diem's assassination in [[1963]].",
  "subtopic_3_2": "In August [[1964]], the Gulf of Tonkin incident occurred when the destroyer USS Maddox was reportedly attacked. In response, Congress passed the Gulf of Tonkin Resolution, giving President Johnson power to take 'all necessary measures'. This led to Operation Rolling Thunder, a massive [[peace campaign -> bombing campaign]] in early 1965, and the deployment of the first US combat troops to Da Nang in March [[1965]].",
  "subtopic_3_3": "The Vietnam War was fought with highly contrasting tactics. The USA relied on high-tech attrition tactics, including search-and-destroy missions and chemical weapons like [[Agent Orange]] and Napalm. In contrast, the Vietcong fought a [[guerrilla]] war, avoiding large battles, utilizing underground [[tunnel]] networks, and setting deadly booby traps, which severely damaged US troop morale.",
  "subtopic_3_4": "Elected in 1968, President Nixon introduced [[Vietnamization]] to withdraw US forces while training the ARVN to fight. However, to disrupt communist supply lines along the Ho Chi Minh Trail, Nixon expanded the war by ordering the secret bombing and invasion of [[North Vietnam -> Cambodia]] in [[1970]] and Laos in [[1971]], sparking massive protests back in the USA.",
  "subtopic_4_1": "Anti-war opposition in the US grew due to the draft and televised coverage. The shock of the [[1968]] Tet Offensive and the exposure of the [[1969]] My Lai Massacre, where US troops murdered over 500 civilians, fueled protests. Anti-war tension reached its peak in May [[1970]] at [[Kent State]] University, where National Guardsmen shot and killed four protesting students.",
  "subtopic_4_2": "While anti-war protests dominated the media, President Nixon appealed to the '[[Silent Majority]]'—conservative, patriotic working-class Americans who supported his war policies. Pro-war sentiment was driven by deep [[anti-communism]] and a belief that protesting during war was unpatriotic. This support helped Nixon win a landslide re-election in [[1972]].",
  "subtopic_4_3": "Following Nixon's [[1972]] Christmas bombings of Hanoi, the Paris Peace Accords were signed in January [[1973]], leading to the withdrawal of US troops. However, fighting between Vietnamese forces resumed. In April [[1975]], North Vietnamese forces launched a final offensive, capturing the capital of [[Saigon]] and reunifying Vietnam under a communist government.",
  "subtopic_4_4": "The US failed to defeat communist forces due to military, political, and social factors. Vietcong guerrilla tactics and supply lines from China and the [[USA -> USSR]] resisted US firepower. Politically, the South Vietnamese government was corrupt and lacked popular support, while North Vietnam had high resolve. Socially, the [[anti-war]] movement at home destroyed political support for the conflict."
};

for (const [key, text] of Object.entries(summaries)) {
  if (data[key]) {
    data[key].summaryCorrection = { text };
  }
}

// Format nicely as ES module
const outputCode = 'export const LESSONS_DATA = ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync('src/lessons_data.js', outputCode, 'utf8');
console.log("Successfully injected summary corrections into src/lessons_data.js");
