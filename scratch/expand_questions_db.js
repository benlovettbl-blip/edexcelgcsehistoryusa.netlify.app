const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, '..', 'questions.js');
let filecontent = fs.readFileSync(filepath, 'utf8');

// Define expanded QUIZ_DATA
const expandedQuizData = [
  {
    id: "topic_1",
    title: "Key Topic 1: The development of the civil rights movement, 1954–60",
    subtopics: [
      {
        id: "subtopic_1_1",
        embedVideo: "videos/subtopic_1_1.mp4",
        title: "Topic 1.1: The position of Black Americans in the early 1950s",
        standard: [
          {
            id: "q_1_1_s1",
            question: "Which laws enforced racial segregation and discrimination in the Southern states in the 1950s?",
            answer: "Jim Crow laws",
            explanation: "Jim Crow laws legalised segregation in public transport, schools, restaurants, and other public facilities across the South.",
            year: 1950
          },
          {
            id: "q_1_1_s2",
            question: "What does the abbreviation NAACP stand for?",
            answer: "National Association for the Advancement of Colored People",
            explanation: "Founded in 1909, the NAACP focused on challenging segregation and discrimination through legal action and the courts.",
            year: 1909
          },
          {
            id: "q_1_1_s3",
            question: "Which civil rights organisation was founded in Chicago in 1942 to champion non-violent direct action?",
            answer: "CORE (Congress of Racial Equality)",
            explanation: "CORE pioneered non-violent tactics, including early sit-ins, and later co-organised the Freedom Rides.",
            year: 1942
          },
          {
            id: "q_1_1_s4",
            question: "In what year was the landmark school segregation case Brown v. Board of Education decided?",
            answer: "1954",
            explanation: "In May 1954, the Supreme Court ruled unanimously that racial segregation in public schools violated the 14th Amendment.",
            year: 1954
          },
          {
            id: "q_1_1_s5",
            question: "What 1896 doctrine of segregation was overturned by the Brown v. Board decision?",
            answer: "Separate but equal",
            explanation: "Plessy v. Ferguson (1896) had ruled that segregation was legal as long as facilities were equal, which the 1954 court rejected.",
            year: 1896
          },
          {
            id: "q_1_1_s6",
            question: "In what year did the Plessy v. Ferguson Supreme Court case occur?",
            answer: "1896",
            explanation: "Plessy established the 'separate but equal' doctrine that legally underpinned Jim Crow segregation for over half a century.",
            year: 1896
          },
          {
            id: "q_1_1_s7",
            question: "How many Southern states required school segregation by law before the 1954 Brown ruling?",
            answer: "17 states",
            explanation: "Segregation in education was legally mandatory across 17 Southern and border states, and optional in several others.",
            year: 1954
          },
          {
            id: "q_1_1_s8",
            question: "Which activist's arrest on 1 December 1955 sparked the Montgomery Bus Boycott?",
            answer: "Rosa Parks",
            explanation: "Parks refused to give up her seat to a white passenger, providing a respectable test case for the movement.",
            year: 1955
          },
          {
            id: "q_1_1_s9",
            question: "Who was the young minister chosen to lead the Montgomery Improvement Association (MIA) during the boycott?",
            answer: "Martin Luther King Jr.",
            explanation: "King's powerful rhetoric and commitment to non-violence brought him to national prominence during the boycott.",
            year: 1955
          },
          {
            id: "q_1_1_s10",
            question: "What civil rights organisation was led by Martin Luther King Jr. starting in 1957?",
            answer: "SCLC (Southern Christian Leadership Conference)",
            explanation: "SCLC was formed to coordinate non-violent protests through Southern churches and local activist groups.",
            year: 1957
          }
        ],
        depth: [
          {
            id: "q_1_1_d1",
            question: "What term describes the local taxes citizens had to pay in order to vote, used to disenfranchise Black voters?",
            answer: "Poll taxes",
            explanation: "Poll taxes disproportionately affected poor Black Americans, preventing them from registering to vote in Southern states.",
            year: 1950
          },
          {
            id: "q_1_1_d2",
            question: "What tests were designed to prevent Black citizens from registering to vote by asking complex questions?",
            answer: "Literacy tests",
            explanation: "Literacy tests were applied corruptly: Black applicants faced impossible legal questions, while whites were exempted.",
            year: 1950
          },
          {
            id: "q_1_1_d3",
            question: "In what year was the NAACP originally founded?",
            answer: "1909",
            explanation: "The NAACP was founded in 1909 by a group of Black and white activists, including W.E.B. Du Bois, in response to racial violence.",
            year: 1909
          },
          {
            id: "q_1_1_d4",
            question: "Which landmark Supreme Court case struck down the Texas 'white primary' voting restriction in 1944?",
            answer: "Smith v. Allwright",
            explanation: "The ruling declared that primary elections could not exclude Black voters, a major early legal victory for the NAACP.",
            year: 1944
          },
          {
            id: "q_1_1_d5",
            question: "What does the abbreviation MIA stand for in the context of the Montgomery Bus Boycott?",
            answer: "Montgomery Improvement Association",
            explanation: "The MIA was formed in December 1955 to oversee the bus boycott and coordinate transport alternatives.",
            year: 1955
          }
        ]
      },
      {
        id: "subtopic_1_2",
        embedVideo: "videos/subtopic_1_2.mp4",
        title: "Topic 1.2: Developments in education",
        standard: [
          {
            id: "q_1_2_s1",
            question: "Which 1954 Supreme Court case declared segregation in public schools unconstitutional?",
            answer: "Brown v. Board of Education of Topeka",
            explanation: "The ruling overturned the 1896 'separate but equal' doctrine established by Plessy v. Ferguson, declaring school segregation unlawful.",
            year: 1954
          },
          {
            id: "q_1_2_s2",
            question: "What was the name given to the group of Black students who integrated Central High School in Arkansas in 1957?",
            answer: "The Little Rock Nine",
            explanation: "President Eisenhower had to send federal troops from the 101st Airborne Division to protect the nine students from violent mobs.",
            year: 1957
          },
          {
            id: "q_1_2_s3",
            question: "Who was the chief justice of the Supreme Court during the Brown v. Board ruling?",
            answer: "Earl Warren",
            explanation: "Earl Warren wrote the unanimous opinion, declaring that separate educational facilities are inherently unequal.",
            year: 1954
          },
          {
            id: "q_1_2_s4",
            question: "Who was the Governor of Arkansas who defied federal court orders and blocked school integration in 1957?",
            answer: "Orval Faubus",
            explanation: "Faubus used the state's National Guard to block the Black students from entering Central High School.",
            year: 1957
          },
          {
            id: "q_1_2_s5",
            question: "Which elite military division was deployed by President Eisenhower to protect the Little Rock Nine?",
            answer: "101st Airborne Division",
            explanation: "Soldiers guarded the students inside corridors and escorted them to school, asserting federal supremacy over state defiance.",
            year: 1957
          },
          {
            id: "q_1_2_s6",
            question: "Who was the lead NAACP lawyer who successfully argued the Brown case before the Supreme Court?",
            answer: "Thurgood Marshall",
            explanation: "Marshall led the NAACP Legal Defense Fund, using social and legal arguments to dismantle 'separate but equal'.",
            year: 1954
          },
          {
            id: "q_1_2_s7",
            question: "In what year did the integration crisis at Little Rock Central High School occur?",
            answer: "1957",
            explanation: "The crisis lasted throughout September 1957, drawing international media attention to Southern white resistance.",
            year: 1957
          },
          {
            id: "q_1_2_s8",
            question: "What was the full name of the high school integrated in Little Rock?",
            answer: "Central High School",
            explanation: "Central High School was a prestigious, previously all-white school chosen by the local school board for gradual integration.",
            year: 1957
          },
          {
            id: "q_1_2_s9",
            question: "What action did Governor Faubus take in 1958 to prevent further school integration?",
            answer: "Closed all Little Rock high schools",
            explanation: "Rather than integrate, Faubus shut down the city's high schools for the 1958-59 academic year, known as 'The Lost Year'.",
            year: 1958
          },
          {
            id: "q_1_2_s10",
            question: "Who was the first Black student to graduate from Little Rock Central High School?",
            answer: "Ernest Green",
            explanation: "Green graduated in May 1958. Martin Luther King Jr. attended his graduation ceremony to mark the milestone.",
            year: 1958
          }
        ],
        depth: [
          {
            id: "q_1_2_d1",
            question: "What was the name of the 1955 Supreme Court order requiring school desegregation 'with all deliberate speed'?",
            answer: "Brown II",
            explanation: "Because Southern states resisted, the Court issued Brown II to enforce implementation, but the wording allowed delays.",
            year: 1955
          },
          {
            id: "q_1_2_d2",
            question: "Which 1950 Supreme Court case ruled that Texas must admit a Black student to its state law school?",
            answer: "Sweatt v. Painter",
            explanation: "The court ruled the separate law school set up for Black students was physically and academically unequal, paving the way for Brown.",
            year: 1950
          },
          {
            id: "q_1_2_d3",
            question: "Who was the first Black child to integrate an all-white elementary school in the South, in New Orleans in 1960?",
            answer: "Ruby Bridges",
            explanation: "Bridges had to be escorted to school by federal marshals every day due to fierce white protests and boycotts.",
            year: 1960
          },
          {
            id: "q_1_2_d4",
            question: "Who was the local leader of the Arkansas NAACP who guided and supported the Little Rock Nine during the crisis?",
            answer: "Daisy Bates",
            explanation: "Bates' home served as a meeting place and media headquarters for the students, making her a target for white backlash.",
            year: 1957
          },
          {
            id: "q_1_2_d5",
            question: "Which Supreme Court case in 1954 declared segregation in public schools unconstitutional?",
            answer: "Brown v. Board of Education of Topeka",
            explanation: "It was a class-action suit combining cases from Kansas, South Carolina, Virginia, Delaware, and Washington D.C.",
            year: 1954
          }
        ]
      },
      {
        id: "subtopic_1_3",
        embedVideo: "videos/subtopic_1_3.mp4",
        title: "Topic 1.3: The Montgomery Bus Boycott and its impact, 1955–60",
        standard: [
          {
            id: "q_1_3_s1",
            question: "Whose arrest on 1 December 1955 sparked the Montgomery Bus Boycott?",
            answer: "Rosa Parks",
            explanation: "Parks refused to give up her seat on a Montgomery bus to a white passenger, triggering the 381-day protest.",
            year: 1955
          },
          {
            id: "q_1_3_s2",
            question: "Which young minister was chosen to lead the Montgomery Improvement Association (MIA) during the boycott?",
            answer: "Martin Luther King Jr.",
            explanation: "The bus boycott brought Martin Luther King Jr. to national prominence as a primary leader of the civil rights movement.",
            year: 1955
          },
          {
            id: "q_1_3_s3",
            question: "What does the abbreviation SCLC stand for?",
            answer: "Southern Christian Leadership Conference",
            explanation: "SCLC was formed in 1957, led by MLK, to coordinate civil rights protests using non-violent resistance through Southern churches.",
            year: 1957
          },
          {
            id: "q_1_3_s4",
            question: "How many days did the Montgomery Bus Boycott last?",
            answer: "381 days",
            explanation: "The boycott began on 5 December 1955 and ended on 21 December 1956 when desegregation was officially enforced.",
            year: 1956
          },
          {
            id: "q_1_3_s5",
            question: "Who was the Mayor of Montgomery who strongly opposed the boycott and joined the White Citizens' Council?",
            answer: "W. A. Gayle",
            explanation: "Mayor Gayle took a hardline stance, refusing to compromise with the MIA and launching a legal crackdown on carpools.",
            year: 1956
          },
          {
            id: "q_1_3_s6",
            question: "What logistics system did the MIA set up to allow boycotters to travel without using buses?",
            answer: "Carpool system",
            explanation: "The carpool involved over 300 private vehicles and designated pickup stations, running with military-like efficiency.",
            year: 1955
          },
          {
            id: "q_1_3_s7",
            question: "Which 1956 Supreme Court case declared bus segregation unconstitutional?",
            answer: "Browder v. Gayle",
            explanation: "The court ruled that segregated public transit violated the 14th Amendment, forcing Montgomery to desegregate.",
            year: 1956
          },
          {
            id: "q_1_3_s8",
            question: "What percentage of Montgomery's daily bus passengers were Black before the boycott?",
            answer: "70%",
            explanation: "Because Black residents made up the vast majority of riders, their boycott devastated the bus company's finances.",
            year: 1955
          },
          {
            id: "q_1_3_s9",
            question: "Who was the local NAACP president in Montgomery who bailed Rosa Parks out and helped organize the boycott?",
            answer: "E.D. Nixon",
            explanation: "Nixon was a union leader who recognized the potential of Parks' arrest to challenge transit segregation laws.",
            year: 1955
          },
          {
            id: "q_1_3_s10",
            question: "What non-violent strategy did the MIA use to force the bus company to desegregate?",
            answer: "Economic boycott",
            explanation: "By depriving the private bus company of fare revenue, the MIA applied financial pressure that eventually forced change.",
            year: 1955
          }
        ],
        depth: [
          {
            id: "q_1_3_d1",
            question: "What was the exact date the Supreme Court's desegregation order was served on Montgomery city authorities?",
            answer: "20 December 1956",
            explanation: "The desegregation order arrived on Dec 20, and MLK and other leaders rode integrated buses the next morning.",
            year: 1956
          },
          {
            id: "q_1_3_d2",
            question: "Who was the 15-year-old Black girl arrested in Montgomery for refusing to yield her seat 9 months before Rosa Parks?",
            answer: "Claudette Colvin",
            explanation: "Colvin was arrested in March 1955, but NAACP leaders chose not to use her case due to her pregnancy and youth.",
            year: 1955
          },
          {
            id: "q_1_3_d3",
            question: "Which constitutional amendment's Equal Protection Clause was used to challenge bus segregation in Browder v. Gayle?",
            answer: "14th Amendment",
            explanation: "The 14th Amendment prohibits states from denying any person equal protection of the laws, which segregation violated.",
            year: 1956
          },
          {
            id: "q_1_3_d4",
            question: "Who was the president of the Women's Political Council (WPC) who mimeographed 52,000 leaflets calling for a boycott?",
            answer: "Jo Ann Robinson",
            explanation: "Robinson and the WPC organized the initial call for the boycott within hours of Rosa Parks' arrest.",
            year: 1955
          },
          {
            id: "q_1_3_d5",
            question: "What was the name of the women's political activist group led by Jo Ann Robinson in Montgomery?",
            answer: "Women's Political Council (WPC)",
            explanation: "The WPC was a civic group of professional Black women that had complained about bus treatment for years.",
            year: 1955
          }
        ]
      },
      {
        id: "subtopic_1_4",
        embedVideo: "videos/subtopic_1_4.mp4",
        title: "Topic 1.4: Opposition to the civil rights movement",
        standard: [
          {
            id: "q_1_4_s1",
            question: "What document signed by over 100 Southern congressmen in 1956 urged defiance of school integration?",
            answer: "The Southern Manifesto",
            explanation: "The Manifesto declared the Brown ruling a clear abuse of judicial power and encouraged states to resist it.",
            year: 1956
          },
          {
            id: "q_1_4_s2",
            question: "Which segregationist group formed in Mississippi in 1954 to apply economic intimidation against civil rights?",
            answer: "White Citizens' Councils",
            explanation: "Councils used economic pressure (e.g. firing Black workers, evicting tenants) to prevent challenges to segregation.",
            year: 1954
          },
          {
            id: "q_1_4_s3",
            question: "Which white supremacist organization saw a major resurgence in the mid-1950s, using violence and bombings?",
            answer: "Ku Klux Klan",
            explanation: "The KKK terrorized civil rights workers and Black families with bombings, beatings, and cross-burnings.",
            year: 1955
          },
          {
            id: "q_1_4_s4",
            question: "Which Southern Senator conducted a record-breaking 24-hour filibuster against the 1957 Civil Rights Act?",
            answer: "Strom Thurmond",
            explanation: "Thurmond spoke for over 24 hours to block the bill, representing the deep political opposition in Congress.",
            year: 1957
          },
          {
            id: "q_1_4_s5",
            question: "In what year was the Southern Manifesto signed and published by Southern politicians?",
            answer: "1956",
            explanation: "Signed by 19 Senators and 82 Representatives, it united Southern political resistance under the banner of states' rights.",
            year: 1956
          },
          {
            id: "q_1_4_s6",
            question: "Which US president signed the Civil Rights Act of 1957 into law?",
            answer: "Dwight D. Eisenhower",
            explanation: "It was the first civil rights legislation passed since Reconstruction, though it was heavily weakened by Southern amendments.",
            year: 1957
          },
          {
            id: "q_1_4_s7",
            question: "What parliamentary delaying tactic did Southern senators (Dixiecrats) use to block civil rights bills?",
            answer: "Filibuster",
            explanation: "Senators would speak indefinitely to prevent a vote on civil rights bills, requiring a supermajority to stop them.",
            year: 1957
          },
          {
            id: "q_1_4_s8",
            question: "What was the primary focus of the Civil Rights Act of 1957?",
            answer: "Voting rights",
            explanation: "The act created the Civil Rights Commission and allowed the Justice Department to seek injunctions against voter discrimination.",
            year: 1957
          },
          {
            id: "q_1_4_s9",
            question: "What was the main purpose of the Civil Rights Act of 1960?",
            answer: "Federal inspection of local voter registration records",
            explanation: "The act introduced federal penalties for obstructing voter registration and allowed federal judges to appoint voter referees.",
            year: 1960
          },
          {
            id: "q_1_4_s10",
            question: "How many Southern congressmen signed the Southern Manifesto in 1956?",
            answer: "101 congressmen",
            explanation: "A total of 101 senators and representatives signed the document, showing the unity of the segregationist political bloc.",
            year: 1956
          }
        ],
        depth: [
          {
            id: "q_1_4_d1",
            question: "What was the exact length of Strom Thurmond's record-breaking solo filibuster against the 1957 Civil Rights Act?",
            answer: "24 hours and 18 minutes",
            explanation: "Thurmond read election laws, Washington's farewell address, and recipe books to sustain his record-setting speech.",
            year: 1957
          },
          {
            id: "q_1_4_d2",
            question: "Who was the segregationist Governor of Mississippi who attempted to block James Meredith from enrolling at university?",
            answer: "Ross Barnett",
            explanation: "Governor Barnett physically blocked Meredith at the university doors, defying federal integration mandates.",
            year: 1962
          },
          {
            id: "q_1_4_d3",
            question: "What term describes the conservative Southern Democrats who organized congressional resistance to civil rights?",
            answer: "Dixiecrats",
            explanation: "Dixiecrats controlled key committee chairmanships in Congress, allowing them to pigeonhole or weaken civil rights bills.",
            year: 1957
          },
          {
            id: "q_1_4_d4",
            question: "What economic warfare method did the White Citizens' Councils use to punish civil rights activists?",
            answer: "Job dismissals and mortgage foreclosures",
            explanation: "By firing activists, denying bank loans, and cancelling insurance policies, the Councils financially ruined integrationists.",
            year: 1954
          },
          {
            id: "q_1_4_d5",
            question: "Who was the 14-year-old Black boy from Chicago brutally lynched in Mississippi in August 1955 for allegedly whistling at a white woman?",
            answer: "Emmett Till",
            explanation: "Till's mother held an open-casket funeral in Chicago, exposing the extreme brutality of Southern racism to the world.",
            year: 1955
          }
        ]
      }
    ]
  },
  {
    id: "topic_2",
    title: "Key Topic 2: Protest, progress and radicalism, 1960–75",
    subtopics: [
      {
        id: "subtopic_2_1",
        embedVideo: "videos/subtopic_2_1.mp4",
        title: "Topic 2.1: Progress and Developments, 1960–62",
        standard: [
          {
            id: "q_2_1_s1",
            question: "In which city did the famous 1960 lunch counter sit-ins begin?",
            answer: "Greensboro, North Carolina",
            explanation: "Four Black college students sat at a Woolworth's lunch counter, launching a wave of sit-ins across the South.",
            year: 1960
          },
          {
            id: "q_2_1_s2",
            question: "What does the abbreviation SNCC stand for?",
            answer: "Student Nonviolent Coordinating Committee",
            explanation: "Formed in 1960, SNCC allowed younger student activists to organize sit-ins and voter registration drives.",
            year: 1960
          },
          {
            id: "q_2_1_s3",
            question: "Which tactic was used by activists in 1961 to test the desegregation of interstate bus terminals?",
            answer: "Freedom Rides",
            explanation: "Freedom Riders rode buses into the Deep South, encountering severe violence that forced federal intervention.",
            year: 1961
          },
          {
            id: "q_2_1_s4",
            question: "In what year did the CORE-led Freedom Rides begin?",
            answer: "1961",
            explanation: "Starting in Washington D.C. in May 1961, the riders aimed to test the Supreme Court's ruling on terminal integration.",
            year: 1961
          },
          {
            id: "q_2_1_s5",
            question: "Which civil rights organization organized the first Freedom Rides in 1961?",
            answer: "CORE (Congress of Racial Equality)",
            explanation: "CORE planned the original route under director James Farmer, though SNCC students later resumed the rides.",
            year: 1961
          },
          {
            id: "q_2_1_s6",
            question: "Who was the first Black student to register and enroll at the University of Mississippi in 1962?",
            answer: "James Meredith",
            explanation: "Meredith's enrollment led to violent riots that required 30,000 federal troops to secure his safety.",
            year: 1962
          },
          {
            id: "q_2_1_s7",
            question: "Who was the president of the United States during the Freedom Rides and the James Meredith crisis?",
            answer: "John F. Kennedy",
            explanation: "Kennedy was forced to send federal marshals and troops to protect activists and enforce court integration orders.",
            year: 1961
          },
          {
            id: "q_2_1_s8",
            question: "Who was the Attorney General who sent federal marshals to protect James Meredith in Mississippi?",
            answer: "Robert Kennedy",
            explanation: "Robert Kennedy managed the federal response, ordering marshals and military police to secure the campus.",
            year: 1962
          },
          {
            id: "q_2_1_s9",
            question: "In which Alabama city was a Freedom Riders bus firebombed by a white mob in May 1961?",
            answer: "Anniston",
            explanation: "A mob slashed the bus tires, chased it out of town, firebombed the vehicle, and attacked the escaping passengers.",
            year: 1961
          },
          {
            id: "q_2_1_s10",
            question: "Which Georgia city was the target of SNCC's first major, though unsuccessful, desegregation campaign in 1961-62?",
            answer: "Albany",
            explanation: "The Albany Movement failed because Police Chief Pritchett used non-violent arrests and avoided media-sensational violence.",
            year: 1961
          }
        ],
        depth: [
          {
            id: "q_2_1_d1",
            question: "What term describes the integrated groups of white and Black activists who rode interstate buses together in 1961?",
            answer: "Freedom Riders",
            explanation: "Freedom Riders challenged the non-enforcement of the Supreme Court's Boynton v. Virginia ruling.",
            year: 1961
          },
          {
            id: "q_2_1_d2",
            question: "Who was the National Director of CORE who designed and launched the first Freedom Rides?",
            answer: "James Farmer",
            explanation: "Farmer organized the rides to provoke federal enforcement of Supreme Court desegregation rulings.",
            year: 1961
          },
          {
            id: "q_2_1_d3",
            question: "Who was the SCLC leader who joined the Albany Movement in Georgia, only to be arrested and fail to desegregate the city?",
            answer: "Martin Luther King Jr.",
            explanation: "King was arrested in Albany but police chief Pritchett paid his bail quietly, neutralizing King's media impact.",
            year: 1961
          },
          {
            id: "q_2_1_d4",
            question: "What was the popular nickname of the University of Mississippi integrated by James Meredith?",
            answer: "Ole Miss",
            explanation: "Ole Miss was a symbol of Southern white heritage. Meredith's registration triggered a riot that killed two people.",
            year: 1962
          },
          {
            id: "q_2_1_d5",
            question: "Which prominent civil rights adviser and SCLC executive secretary helped student activists organize SNCC in April 1960?",
            answer: "Ella Baker",
            explanation: "Baker encouraged students to form their own independent organization rather than join MLK's SCLC.",
            year: 1960
          }
        ]
      },
      {
        id: "subtopic_2_2",
        embedVideo: "videos/subtopic_2_2.mp4",
        title: "Topic 2.2: Peaceful protests and their impact, 1963–65",
        standard: [
          {
            id: "q_2_2_s1",
            question: "Which Alabama city was the site of the 1963 civil rights campaign where police used dogs and fire hoses against children?",
            answer: "Birmingham, Alabama",
            explanation: "The campaign was organized by SCLC to provoke national outrage, leading directly to Kennedy drafting the Civil Rights Bill.",
            year: 1963
          },
          {
            id: "q_2_2_s2",
            question: "Who was the segregationist Police Commissioner of Birmingham who ordered the brutal response to protesters?",
            answer: "Eugene 'Bull' Connor",
            explanation: "Connor's use of attack dogs and high-pressure fire hoses on television screens shocked the American public.",
            year: 1963
          },
          {
            id: "q_2_2_s3",
            question: "What was the name of the famous document written by Martin Luther King Jr. while imprisoned in Alabama in 1963?",
            answer: "Letter from Birmingham Jail",
            explanation: "Written on scraps of paper, the letter defended non-violent direct action against moderate white clergy who urged patience.",
            year: 1963
          },
          {
            id: "q_2_2_s4",
            question: "In what month and year did the historic March on Washington take place?",
            answer: "August 1963",
            explanation: "Over 250,000 people gathered at the Lincoln Memorial to demand 'Jobs and Freedom' and support the Civil Rights Bill.",
            year: 1963
          },
          {
            id: "q_2_2_s5",
            question: "What was the title of Martin Luther King Jr.'s famous speech delivered at the March on Washington?",
            answer: "I Have a Dream",
            explanation: "King departed from his written text to deliver a powerful vision of racial integration and equality.",
            year: 1963
          },
          {
            id: "q_2_2_s6",
            question: "Which US president originally proposed the Civil Rights Bill in June 1963 before his assassination?",
            answer: "John F. Kennedy",
            explanation: "Kennedy proposed the bill on national television, declaring civil rights a moral issue that required federal action.",
            year: 1963
          },
          {
            id: "q_2_2_s7",
            question: "Which US president signed the historic Civil Rights Act of 1964 into law?",
            answer: "Lyndon B. Johnson",
            explanation: "Johnson used his political skill and the memory of Kennedy to guide the bill through a lengthy Southern filibuster.",
            year: 1964
          },
          {
            id: "q_2_2_s8",
            question: "Which Alabama city was the starting point for the 1965 marches where protesters were beaten on 'Bloody Sunday'?",
            answer: "Selma, Alabama",
            explanation: "The march from Selma to Montgomery aimed to demand federal voting rights protection for Black citizens.",
            year: 1965
          },
          {
            id: "q_2_2_s9",
            question: "What landmark voting law was passed in 1965 in response to the Selma campaign?",
            answer: "Voting Rights Act of 1965",
            explanation: "The act outlawed literacy tests and sent federal registrars to Southern states, drastically increasing voter turnout.",
            year: 1965
          },
          {
            id: "q_2_2_s10",
            question: "How many demonstrators participated in the March on Washington in August 1963?",
            answer: "Over 250,000",
            explanation: "It was one of the largest political rallies in US history, bringing immense moral pressure to bear on Congress.",
            year: 1963
          }
        ],
        depth: [
          {
            id: "q_2_2_d1",
            question: "What was the name of the bridge in Selma where state troopers brutally attacked marching protesters on 7 March 1965?",
            answer: "Edmund Pettus Bridge",
            explanation: "Troopers used tear gas and clubs on the peaceful marchers in an event known as 'Bloody Sunday'.",
            year: 1965
          },
          {
            id: "q_2_2_d2",
            question: "In what year did the SCLC-led Birmingham campaign take place?",
            answer: "1963",
            explanation: "The campaign ran throughout April and May 1963, forcing local business leaders to agree to desegregate downtown stores.",
            year: 1963
          },
          {
            id: "q_2_2_d3",
            question: "In what year did the Selma voting rights march campaign occur?",
            answer: "1965",
            explanation: "The Selma campaign began in January 1965 and culminated in the march to Montgomery in late March.",
            year: 1965
          },
          {
            id: "q_2_2_d4",
            question: "Which student leader and SNCC chairman was severely beaten on the Edmund Pettus Bridge on Bloody Sunday?",
            answer: "John Lewis",
            explanation: "Lewis co-led the march with SCLC's Hosea Williams. Images of his fractured skull shocked the nation.",
            year: 1965
          },
          {
            id: "q_2_2_d5",
            question: "What project code name did the SCLC assign to the Birmingham desegregation campaign in 1963?",
            answer: "Project C",
            explanation: "The 'C' stood for 'confrontation', outlining a strategy of non-violent pressure to provoke public arrests.",
            year: 1963
          }
        ]
      },
      {
        id: "subtopic_2_3",
        embedVideo: "videos/subtopic_2_3.mp4",
        title: "Topic 2.3: Malcolm X and Black Power, 1963–70",
        standard: [
          {
            id: "q_2_3_s1",
            question: "Who was the prominent Nation of Islam spokesperson who criticized non-violence and advocated self-defense?",
            answer: "Malcolm X",
            explanation: "Malcolm X offered a militant alternative to MLK, urging Black Americans to defend themselves 'by any means necessary'.",
            year: 1964
          },
          {
            id: "q_2_3_s2",
            question: "Which radical civil rights slogan was popularized by Stokely Carmichael during a 1966 march in Mississippi?",
            answer: "Black Power",
            explanation: "The slogan marked a shift toward self-reliance, racial pride, and rejection of white integrationist control.",
            year: 1966
          },
          {
            id: "q_2_3_s3",
            question: "Who were the two co-founders of the Black Panther Party for Self-Defense, created in Oakland in 1966?",
            answer: "Huey Newton and Bobby Seale",
            explanation: "They founded the party in October 1966, adopting a 10-Point Program and carrying loaded weapons to monitor police.",
            year: 1966
          },
          {
            id: "q_2_3_s4",
            question: "Who was the leader of the Nation of Islam whom Malcolm X clashed with before leaving the group?",
            answer: "Elijah Muhammad",
            explanation: "Malcolm left the Nation of Islam in 1964 due to Elijah Muhammad's personal scandals and political passivity.",
            year: 1964
          },
          {
            id: "q_2_3_s5",
            question: "In what year was Malcolm X assassinated while giving a speech in New York City?",
            answer: "1965",
            explanation: "Malcolm X was shot on 21 February 1965 by members of the Nation of Islam at the Audubon Ballroom.",
            year: 1965
          },
          {
            id: "q_2_3_s6",
            question: "In what year was the Black Panther Party for Self-Defense founded?",
            answer: "1966",
            explanation: "Created in October 1966, the party quickly expanded to cities across the nation, becoming icons of revolutionary nationalism.",
            year: 1966
          },
          {
            id: "q_2_3_s7",
            question: "Which two US athletes raised black-gloved fists during the medal ceremony at the 1968 Olympics?",
            answer: "Tommie Smith and John Carlos",
            explanation: "Their silent protest on the podium in Mexico City drew international attention to racial inequality in the US.",
            year: 1968
          },
          {
            id: "q_2_3_s8",
            question: "In which California city was the Black Panther Party originally founded?",
            answer: "Oakland",
            explanation: "Oakland had a large Black population that faced severe police brutality, which the Panthers formed to monitor.",
            year: 1966
          },
          {
            id: "q_2_3_s9",
            question: "Which student organization officially rejected non-violence and adopted Black Power under Stokely Carmichael in 1966?",
            answer: "SNCC",
            explanation: "Under Carmichael, SNCC expelled its white members and focused on militant community organizing.",
            year: 1966
          },
          {
            id: "q_2_3_s10",
            question: "What secular activist organization did Malcolm X found after leaving the Nation of Islam in 1964?",
            answer: "OAAU (Organization of Afro-American Unity)",
            explanation: "The OAAU aimed to unite African Americans and link their struggle to African human rights movements.",
            year: 1964
          }
        ],
        depth: [
          {
            id: "q_2_3_d1",
            question: "What was the birth name of Malcolm X before he replaced it with an 'X' to symbolize his lost African heritage?",
            answer: "Malcolm Little",
            explanation: "He rejected 'Little' as a slave name given to his ancestors by white masters, adopting 'X' instead.",
            year: 1952
          },
          {
            id: "q_2_3_d2",
            question: "What famous book detailing Malcolm X's life was published shortly after his death in 1965?",
            answer: "The Autobiography of Malcolm X",
            explanation: "Co-authored with Alex Haley, the book sold millions and deeply influenced the nascent Black Power movement.",
            year: 1965
          },
          {
            id: "q_2_3_d3",
            question: "What was the name of the popular community service program created by the Black Panthers to feed school children?",
            answer: "Free Breakfast for Children Program",
            explanation: "The breakfast program fed thousands of children daily, earning the party deep respect in local communities.",
            year: 1969
          },
          {
            id: "q_2_3_d4",
            question: "What term was popularized by Stokely Carmichael to describe systemic discrimination embedded in social institutions?",
            answer: "Institutional racism",
            explanation: "Carmichael argued that racism was not just individual prejudice but built into housing, education, and employment.",
            year: 1967
          },
          {
            id: "q_2_3_d5",
            question: "Which voting rights campaign did Malcolm X visit and support in early 1965 shortly before his death?",
            answer: "Selma campaign",
            explanation: "Malcolm spoke in Selma in February 1965 to support the campaign, offering a militant warning to white authorities.",
            year: 1965
          }
        ]
      },
      {
        id: "subtopic_2_4",
        embedVideo: "videos/subtopic_2_4.mp4",
        title: "Topic 2.4: The civil rights movement, 1965–75",
        standard: [
          {
            id: "q_2_4_s1",
            question: "Which district of Los Angeles was the site of massive, destructive race riots in August 1965?",
            answer: "Watts",
            explanation: "Triggered by a police arrest, the Watts Riots lasted for 6 days, resulting in 34 deaths and massive property destruction.",
            year: 1965
          },
          {
            id: "q_2_4_s2",
            question: "What was the name of the federal commission appointed by Johnson that blamed white racism for the 1960s riots?",
            answer: "Kerner Commission",
            explanation: "The 1968 report warned that America was moving toward two separate and unequal societies: one Black, one white.",
            year: 1968
          },
          {
            id: "q_2_4_s3",
            question: "On what date was Martin Luther King Jr. assassinated in Memphis?",
            answer: "4 April 1968",
            explanation: "King was shot by a sniper on the balcony of the Lorraine Motel, triggering national riots.",
            year: 1968
          },
          {
            id: "q_2_4_s4",
            question: "In which Southern city was Martin Luther King Jr. assassinated in 1968?",
            answer: "Memphis, Tennessee",
            explanation: "King had travelled to Memphis to support a strike of municipal Black sanitation workers.",
            year: 1968
          },
          {
            id: "q_2_4_s5",
            question: "What was the name of the 1966 campaign where MLK moved into a slum to highlight poor housing in the North?",
            answer: "Chicago Freedom Movement",
            explanation: "It was MLK's first major campaign in a Northern city, encountering violent white opposition during marches.",
            year: 1966
          },
          {
            id: "q_2_4_s6",
            question: "Who was convicted of the assassination of Martin Luther King Jr.?",
            answer: "James Earl Ray",
            explanation: "Ray pleaded guilty in 1969 to avoid the death penalty, though he later spent years retracting his confession.",
            year: 1968
          },
          {
            id: "q_2_4_s7",
            question: "Which federal law passed in April 1968 banned racial discrimination in the sale or rental of housing?",
            answer: "Civil Rights Act of 1968 (Fair Housing Act)",
            explanation: "The act was passed quickly during the national mourning period following MLK's assassination.",
            year: 1968
          },
          {
            id: "q_2_4_s8",
            question: "What SCLC campaign launched in 1968 aimed to bring thousands of poor Americans to camp out in Washington?",
            answer: "Poor People's Campaign",
            explanation: "Planned by MLK before his death, the campaign went ahead under Ralph Abernathy, setting up 'Resurrection City'.",
            year: 1968
          },
          {
            id: "q_2_4_s9",
            question: "Who took over the leadership of the SCLC immediately after Martin Luther King Jr.'s assassination?",
            answer: "Ralph Abernathy",
            explanation: "Abernathy was King's closest friend and co-founder of SCLC, but the organization struggled to maintain influence.",
            year: 1968
          },
          {
            id: "q_2_4_s10",
            question: "In how many US cities did major race riots break out in the week following Martin Luther King Jr.'s assassination?",
            answer: "Over 100 cities",
            explanation: "The riots led to 46 deaths, 20,000 arrests, and required the deployment of 50,000 national guard and federal troops.",
            year: 1968
          }
        ],
        depth: [
          {
            id: "q_2_4_d1",
            question: "In what year was the Kerner Commission report published?",
            answer: "1968",
            explanation: "The report warned that segregation and poverty had created an explosive ghetto environment in cities.",
            year: 1968
          },
          {
            id: "q_2_4_d2",
            question: "What famous conclusion did the Kerner Commission draw about the future division of American society?",
            answer: "Moving toward two societies, one Black, one white - separate and unequal",
            explanation: "The report warned that unless massive federal aid was directed to urban ghettos, the division would become permanent.",
            year: 1968
          },
          {
            id: "q_2_4_d3",
            question: "Which Chicago suburb saw MLK's housing march met by thousands of white residents throwing bricks and bottles?",
            answer: "Cicero",
            explanation: "King remarked that he had never seen mobs as hostile or hateful as those in Chicago, even in Mississippi or Alabama.",
            year: 1966
          },
          {
            id: "q_2_4_d4",
            question: "What municipal labor strike was Martin Luther King Jr. supporting when he was shot in Memphis?",
            answer: "Sanitation workers' strike",
            explanation: "King marched with the workers who were striking for safety, union recognition, and equal wages.",
            year: 1968
          },
          {
            id: "q_2_4_d5",
            question: "In what year did the destructive Watts Riots occur in Los Angeles?",
            answer: "1965",
            explanation: "The riots occurred in August 1965, just days after the Voting Rights Act was signed, showing the limits of legislative civil rights.",
            year: 1965
          }
        ]
      }
    ]
  },
  {
    id: "topic_3",
    title: "Key Topic 3: US involvement in the Vietnam War, 1954–75",
    subtopics: [
      {
        id: "subtopic_3_1",
        embedVideo: "videos/subtopic_3_1.mp4",
        title: "Topic 3.1: Reasons for US involvement in the conflict in Vietnam, 1954–63",
        standard: [
          {
            id: "q_3_1_s1",
            question: "Who was the leader of the communist forces and President of North Vietnam?",
            answer: "Ho Chi Minh",
            explanation: "Ho Chi Minh led the Vietminh against the French and later directed the struggle to unify Vietnam under communism.",
            year: 1954
          },
          {
            id: "q_3_1_s2",
            question: "Which 1954 battle saw the decisive defeat of the French army, ending French colonial rule in Indochina?",
            answer: "Dien Bien Phu",
            explanation: "Vietminh forces under General Giap besieged and captured the French base, forcing France to withdraw.",
            year: 1954
          },
          {
            id: "q_3_1_s3",
            question: "Which parallel divided Vietnam into North and South according to the 1954 Geneva Accords?",
            answer: "17th Parallel",
            explanation: "The division was intended to be temporary until national elections could be held in 1956.",
            year: 1954
          },
          {
            id: "q_3_1_s4",
            question: "What theory did President Eisenhower use in 1954 to justify U.S. intervention in Southeast Asia?",
            answer: "The Domino Theory",
            explanation: "The theory argued that if one nation fell to communism, neighboring nations would collapse like dominoes.",
            year: 1954
          },
          {
            id: "q_3_1_s5",
            question: "Who was the first US president to send military advisors to South Vietnam?",
            answer: "Dwight D. Eisenhower",
            explanation: "Eisenhower backed the South Vietnamese regime with money and hundreds of military advisors starting in 1954.",
            year: 1954
          },
          {
            id: "q_3_1_s6",
            question: "Which US president increased the number of military advisors in Vietnam to over 16,000 by late 1963?",
            answer: "John F. Kennedy",
            explanation: "Kennedy resisted sending combat troops but heavily expanded advisors and Green Beret special forces.",
            year: 1961
          },
          {
            id: "q_3_1_s7",
            question: "What was the capital city of South Vietnam?",
            answer: "Saigon",
            explanation: "Saigon was the seat of the anti-communist South Vietnamese government backed by the United States.",
            year: 1954
          },
          {
            id: "q_3_1_s8",
            question: "What was the capital city of North Vietnam?",
            answer: "Hanoi",
            explanation: "Hanoi was the capital of the communist Democratic Republic of Vietnam led by Ho Chi Minh.",
            year: 1954
          },
          {
            id: "q_3_1_s9",
            question: "Which South Vietnamese president was overthrown and assassinated in a coup in November 1963?",
            answer: "Ngo Dinh Diem",
            explanation: "Diem's Catholic-centered discrimination and corruption led the US to tacitly support his overthrow by his generals.",
            year: 1963
          },
          {
            id: "q_3_1_s10",
            question: "What was the name of the program that built fortified villages to separate peasants from Vietcong influence?",
            answer: "Strategic Hamlet Program",
            explanation: "Launched in 1962, the program alienated peasants by forcing them off ancestral lands, driving many to support the Vietcong.",
            year: 1962
          }
        ],
        depth: [
          {
            id: "q_3_1_d1",
            question: "What was the name of the communist-led nationalist coalition that fought the French for independence?",
            answer: "Vietminh",
            explanation: "Founded by Ho Chi Minh in 1941, the Vietminh fought Japanese occupiers and then French colonial forces.",
            year: 1941
          },
          {
            id: "q_3_1_d2",
            question: "Which major religious group faced severe discrimination under Ngo Dinh Diem's Catholic-dominated government?",
            answer: "Buddhists",
            explanation: "Diem's ban on Buddhist flags led to mass protests, self-immolations by monks, and a major political crisis in 1963.",
            year: 1963
          },
          {
            id: "q_3_1_d3",
            question: "In what month and year was Ngo Dinh Diem assassinated?",
            answer: "November 1963",
            explanation: "Diem was shot on 2 November 1963, just three weeks before President Kennedy was assassinated in Dallas.",
            year: 1963
          },
          {
            id: "q_3_1_d4",
            question: "What term was commonly used by US troops to refer to the communist insurgent fighters in South Vietnam?",
            answer: "Vietcong",
            explanation: "Vietcong was short for Vietnamese Communists. The fighters were also referred to as VC or 'Victor Charlie'.",
            year: 1960
          },
          {
            id: "q_3_1_d5",
            question: "What was the official name of the political and military organization commonly known as the Vietcong?",
            answer: "National Liberation Front (NLF)",
            explanation: "The NLF was established in December 1960 to unite all opponents of Diem's US-backed regime in the South.",
            year: 1960
          }
        ]
      },
      {
        id: "subtopic_3_2",
        embedVideo: "videos/subtopic_3_2.mp4",
        title: "Topic 3.2: Escalation of the conflict under Johnson",
        standard: [
          {
            id: "q_3_2_s1",
            question: "Which US destroyer was reportedly attacked by North Vietnamese torpedo boats in August 1964?",
            answer: "USS Maddox",
            explanation: "The clash in the Gulf of Tonkin provided the justification Johnson needed to seek congressional war powers.",
            year: 1964
          },
          {
            id: "q_3_2_s2",
            question: "Which congressional resolution in August 1964 gave President Johnson war powers to defend South Vietnam?",
            answer: "Gulf of Tonkin Resolution",
            explanation: "The resolution allowed Johnson to take 'all necessary measures' to repel attacks, acting as a blank check.",
            year: 1964
          },
          {
            id: "q_3_2_s3",
            question: "In what year did Congress pass the Gulf of Tonkin Resolution?",
            answer: "1964",
            explanation: "It was passed nearly unanimously in August 1964, following reported clashes off the coast of North Vietnam.",
            year: 1964
          },
          {
            id: "q_3_2_s4",
            question: "What was the code name of the sustained US bombing campaign of North Vietnam started in early 1965?",
            answer: "Operation Rolling Thunder",
            explanation: "The campaign aimed to destroy North Vietnamese infrastructure and disrupt supply lines to the South.",
            year: 1965
          },
          {
            id: "q_3_2_s5",
            question: "In what year did Operation Rolling Thunder begin?",
            answer: "1965",
            explanation: "It began in March 1965 and ran almost continuously until November 1968, dropping over 600,000 tons of bombs.",
            year: 1965
          },
          {
            id: "q_3_2_s6",
            question: "Who was the commander of US forces in Vietnam during the period of escalation (1964-68)?",
            answer: "General William Westmoreland",
            explanation: "Westmoreland advocated a strategy of attrition, aiming to kill communist forces faster than they could be replaced.",
            year: 1964
          },
          {
            id: "q_3_2_s7",
            question: "In what year were the first US combat troops officially deployed to South Vietnam?",
            answer: "1965",
            explanation: "The first ground combat troops (3,500 Marines) landed at Da Nang in March 1965 to protect the US air base.",
            year: 1965
          },
          {
            id: "q_3_2_s8",
            question: "Which US military base in South Vietnam was attacked in February 1965, prompting Johnson to launch Rolling Thunder?",
            answer: "Pleiku",
            explanation: "A Vietcong mortar attack killed 8 US soldiers at Pleiku, triggering retaliatory air strikes and the bombing campaign.",
            year: 1965
          },
          {
            id: "q_3_2_s9",
            question: "What was the peak troop level of US servicemen in Vietnam under President Johnson's administration?",
            answer: "Over 500,000",
            explanation: "By late 1968, US forces in Vietnam exceeded 536,000, representing a massive escalation from advisors.",
            year: 1968
          },
          {
            id: "q_3_2_s10",
            question: "Who was the Secretary of Defense who served under Kennedy and Johnson, overseeing the escalation of the war?",
            answer: "Robert McNamara",
            explanation: "McNamara applied statistical systems to the war, but later grew disillusioned with prospects of US military victory.",
            year: 1964
          }
        ],
        depth: [
          {
            id: "q_3_2_d1",
            question: "In what month and year did the Gulf of Tonkin incident occur?",
            answer: "August 1964",
            explanation: "The USS Maddox reported attacks on August 2 and August 4, though the second attack was later shown to be non-existent.",
            year: 1964
          },
          {
            id: "q_3_2_d2",
            question: "Which South Vietnamese air base was the landing site for the first official US ground combat troops in March 1965?",
            answer: "Da Nang",
            explanation: "The landing of the 9th Marine Expeditionary Brigade marked the formal commitment of US ground combat forces.",
            year: 1965
          },
          {
            id: "q_3_2_d3",
            question: "Which major battle in November 1965 was the first large-scale clash between the US Army and conventional NVA forces?",
            answer: "Battle of Ia Drang",
            explanation: "US airmobile troops used helicopters to engage NVA units in the highlands. Both sides suffered heavy casualties and claimed victory.",
            year: 1965
          },
          {
            id: "q_3_2_d4",
            question: "How many members of Congress voted against the Gulf of Tonkin Resolution in August 1964?",
            answer: "Two",
            explanation: "The resolution passed 416-0 in the House and 88-2 in the Senate, with only Senators Morse and Gruening voting against.",
            year: 1964
          },
          {
            id: "q_3_2_d5",
            question: "Who was the military commander of the North Vietnamese Army (NVA) who planned the strategy against the French and Americans?",
            answer: "Vo Nguyen Giap",
            explanation: "Giap was the Minister of Defense who planned the victories at Dien Bien Phu and directed the Tet Offensive.",
            year: 1965
          }
        ]
      },
      {
        id: "subtopic_3_3",
        embedVideo: "videos/subtopic_3_3.mp4",
        title: "Topic 3.3: The nature of the conflict in Vietnam, 1964–68",
        standard: [
          {
            id: "q_3_3_s1",
            question: "What Vietcong military tactic involved hit-and-run ambushes, traps, and avoiding conventional pitched battles?",
            answer: "Guerrilla warfare",
            explanation: "Guerrilla warfare aimed to wear down US troop morale and resources without offering a fixed target for airpower.",
            year: 1965
          },
          {
            id: "q_3_3_s2",
            question: "What US military tactic involved patrolling the jungle to locate enemy units and calling in artillery and air strikes?",
            answer: "Search and Destroy",
            explanation: "Also known as seek-and-destroy, it relied on helicopter mobility to deploy infantry, but often alienated local populations.",
            year: 1965
          },
          {
            id: "q_3_3_s3",
            question: "What highly flammable, sticky gasoline gel was used by the US military in bombs to burn jungle foliage and enemy positions?",
            answer: "Napalm",
            explanation: "Napalm clung to surfaces and skin, causing horrific burns and sucking oxygen out of shelters.",
            year: 1965
          },
          {
            id: "q_3_3_s4",
            question: "What chemical herbicide was sprayed by US aircraft to defoliate forests and destroy enemy food crops?",
            answer: "Agent Orange",
            explanation: "Agent Orange destroyed millions of acres of forest. It was later linked to severe health issues and birth defects.",
            year: 1965
          },
          {
            id: "q_3_3_s5",
            question: "What was the name of the complex supply route running from North to South Vietnam through Laos and Cambodia?",
            answer: "Ho Chi Minh Trail",
            explanation: "The trail kept communist forces in the South supplied with weapons and reinforcements despite constant US bombing.",
            year: 1965
          },
          {
            id: "q_3_3_s6",
            question: "What underground structures did the Vietcong construct to hide, store supplies, and launch surprise attacks?",
            answer: "Tunnel systems",
            explanation: "Tunnels (like those at Cu Chi) contained barracks, hospitals, and command centers, protecting fighters from bombing.",
            year: 1965
          },
          {
            id: "q_3_3_s7",
            question: "What simple Vietcong traps used sharpened bamboo stakes hidden in pits and smeared with excrement?",
            answer: "Punji traps",
            explanation: "Punji traps were designed to wound rather than kill, slowing down patrols and causing severe infections.",
            year: 1965
          },
          {
            id: "q_3_3_s8",
            question: "What metric did U.S. commanders use as the primary measure of progress in the war of attrition?",
            answer: "Body count",
            explanation: "Commanders focused on the number of enemy dead. This system led to inflated statistics and civilian casualties being counted as combatants.",
            year: 1965
          },
          {
            id: "q_3_3_s9",
            question: "What helicopter model was widely used by the US for troop transport, medical evacuation, and gunship support?",
            answer: "UH-1 Huey",
            explanation: "The Huey became the symbol of the Vietnam War, defining the airmobile tactics of the conflict.",
            year: 1965
          },
          {
            id: "q_3_3_s10",
            question: "Which major North Vietnamese and Vietcong offensive in January 1968 marked the turning point of the war?",
            answer: "Tet Offensive",
            explanation: "Although a military failure for the communists, Tet shattered the US public's belief that victory was near.",
            year: 1968
          }
        ],
        depth: [
          {
            id: "q_3_3_d1",
            question: "In what month and year did the Tet Offensive begin?",
            answer: "January 1968",
            explanation: "Launched on 30-31 January 1968 during the Tet holiday, it involved attacks on over 100 cities in South Vietnam.",
            year: 1968
          },
          {
            id: "q_3_3_d2",
            question: "Which historic South Vietnamese city saw the longest and bloodiest urban battle of the Tet Offensive?",
            answer: "Hue",
            explanation: "NVA forces captured the city and held it for nearly a month. The battle left the ancient citadel in ruins.",
            year: 1968
          },
          {
            id: "q_3_3_d3",
            question: "Which US Marine base in northern South Vietnam was besieged by NVA forces for 77 days in early 1968?",
            answer: "Khe Sanh",
            explanation: "The siege began just before the Tet Offensive. Johnson ordered heavy air support to prevent another Dien Bien Phu.",
            year: 1968
          },
          {
            id: "q_3_3_d4",
            question: "Which high-profile building in Saigon was attacked by a Vietcong commando squad during the Tet Offensive?",
            answer: "US Embassy",
            explanation: "Although the attackers were killed, images of combat inside the embassy compound shocked the US public.",
            year: 1968
          },
          {
            id: "q_3_3_d5",
            question: "What slang term was used by US soldiers for search-and-destroy missions that ended in burning down peasant huts?",
            answer: "Zippo missions",
            explanation: "Named after the popular Zippo lighter, soldiers used them to burn thatched roofs of suspected Vietcong villages.",
            year: 1965
          }
        ]
      },
      {
        id: "subtopic_3_4",
        embedVideo: "videos/subtopic_3_4.mp4",
        title: "Topic 3.4: Changes under Nixon, 1969–73",
        standard: [
          {
            id: "q_3_4_s1",
            question: "What policy under President Nixon aimed to withdraw US troops and hand over combat duties to the South Vietnamese army?",
            answer: "Vietnamisation",
            explanation: "Vietnamisation aimed to reduce US ground casualties and shift the military burden to the ARVN forces.",
            year: 1969
          },
          {
            id: "q_3_4_s2",
            question: "What was the name of the foreign policy doctrine declaring that US allies must provide their own ground troops?",
            answer: "Nixon Doctrine",
            explanation: "The doctrine stated that while the US would offer economic and air support, it would not fight ground wars for allies.",
            year: 1969
          },
          {
            id: "q_3_4_s3",
            question: "What slogan did Richard Nixon use to describe his goal of achieving a negotiated exit from the war?",
            answer: "Peace with Honor",
            explanation: "Nixon sought an exit that did not look like a defeat, preserving US credibility and South Vietnam's independence.",
            year: 1969
          },
          {
            id: "q_3_4_s4",
            question: "Which neutral country neighboring Vietnam did Nixon order a secret bombing campaign and ground invasion of in 1969-70?",
            answer: "Cambodia",
            explanation: "The invasion aimed to destroy Vietcong sanctuaries and supply depots, but caused massive protests in the US.",
            year: 1970
          },
          {
            id: "q_3_4_s5",
            question: "Which country neighboring Vietnam was invaded by ARVN forces with US air support in 1971?",
            answer: "Laos",
            explanation: "The invasion (Lam Son 719) aimed to cut the Ho Chi Minh Trail but ended in a disastrous ARVN retreat.",
            year: 1971
          },
          {
            id: "q_3_4_s6",
            question: "Which North Vietnamese capital city was hit by heavy U.S. B-52 bomber raids during the 1972 Christmas Bombings?",
            answer: "Hanoi",
            explanation: "The bombings aimed to force North Vietnam back to the negotiating table to finalize the peace treaty.",
            year: 1972
          },
          {
            id: "q_3_4_s7",
            question: "What was the official code name of the December 1972 Christmas Bombing campaign?",
            answer: "Operation Linebacker II",
            explanation: "It was the largest campaign of heavy bomber attacks launched by the US Air Force since World War II.",
            year: 1972
          },
          {
            id: "q_3_4_s8",
            question: "In what year did all remaining US combat troops withdraw from Vietnam following the peace agreement?",
            answer: "1973",
            explanation: "The last US combat troops left in March 1973, leaving only embassy guards and advisors.",
            year: 1973
          },
          {
            id: "q_3_4_s9",
            question: "Who was Nixon's National Security Advisor and lead negotiator at the Paris peace talks?",
            answer: "Henry Kissinger",
            explanation: "Kissinger conducted years of secret negotiations with North Vietnam, earning the Nobel Peace Prize in 1973.",
            year: 1972
          },
          {
            id: "q_3_4_s10",
            question: "Who was the chief negotiator for North Vietnam who negotiated the peace accords with Henry Kissinger?",
            answer: "Le Duc Tho",
            explanation: "Le Duc Tho declined the Nobel Peace Prize, stating that true peace had not yet been achieved in Vietnam.",
            year: 1973
          }
        ],
        depth: [
          {
            id: "q_3_4_d1",
            question: "In what month and year were the Paris Peace Accords officially signed, ending direct US military involvement?",
            answer: "January 1973",
            explanation: "The accords were signed on 27 January 1973, establishing a ceasefire and outlining US troop withdrawal.",
            year: 1973
          },
          {
            id: "q_3_4_d2",
            question: "What was the term for Nixon's secret strategy to make North Vietnam think he was volatile and willing to use nuclear weapons?",
            answer: "Madman Theory",
            explanation: "Nixon wanted the communists to believe he was irrational enough to do anything, forcing them to negotiate.",
            year: 1969
          },
          {
            id: "q_3_4_d3",
            question: "In what year did the joint US-ARVN ground invasion of Cambodia take place, triggering protests at Kent State?",
            answer: "1970",
            explanation: "The invasion began in April 1970, widening the war's geographic scope and provoking intense domestic outrage.",
            year: 1970
          },
          {
            id: "q_3_4_d4",
            question: "What was the code name of the disastrous 1971 ARVN invasion of Laos that ended in panic and retreat?",
            answer: "Operation Lam Son 719",
            explanation: "The operation showed that without US ground commanders, the ARVN was unable to defeat NVA forces.",
            year: 1971
          },
          {
            id: "q_3_4_d5",
            question: "What major conventional offensive did North Vietnam launch in spring 1972 to test the progress of Vietnamisation?",
            answer: "Easter Offensive",
            explanation: "The NVA attacked on three fronts, but Nixon responded with heavy air support (Operation Linebacker) to halt the invasion.",
            year: 1972
          }
        ]
      }
    ]
  },
  {
    id: "topic_4",
    title: "Key Topic 4: Reactions to, and the end of, US involvement in Vietnam, 1964–75",
    subtopics: [
      {
        id: "subtopic_4_1",
        embedVideo: "videos/subtopic_4_1.mp4",
        title: "Topic 4.1: Opposition to the war",
        standard: [
          {
            id: "q_4_1_s1",
            question: "What was the name of the system used to select young men for compulsory military service in Vietnam?",
            answer: "The Draft",
            explanation: "The draft was highly controversial, particularly because college students could obtain deferments, favoring wealthier whites.",
            year: 1965
          },
          {
            id: "q_4_1_s2",
            question: "At which university did National Guardsmen shoot and kill four student protesters in May 1970?",
            answer: "Kent State University",
            explanation: "The shootings occurred during protests against the invasion of Cambodia, triggering a national student strike.",
            year: 1970
          },
          {
            id: "q_4_1_s3",
            question: "Which student organization was at the forefront of the early anti-war protest movement?",
            answer: "Students for a Democratic Society (SDS)",
            explanation: "SDS organized the first major national anti-war march in Washington in April 1965, drawing 20,000.",
            year: 1965
          },
          {
            id: "q_4_1_s4",
            question: "What symbolic protest method involved young men burning their official government service notices?",
            answer: "Draft card burning",
            explanation: "Burning draft cards became a federal crime in 1965, but remained a popular act of civil disobedience.",
            year: 1965
          },
          {
            id: "q_4_1_s5",
            question: "Which heavyweight boxing champion famously refused to be drafted in 1967, citing religious beliefs?",
            answer: "Muhammad Ali",
            explanation: "Ali was stripped of his title and banned from boxing, declaring: 'I ain't got no quarrel with them Viet Cong.'",
            year: 1967
          },
          {
            id: "q_4_1_s6",
            question: "What popular chant was directed at President Johnson by protesters during anti-war rallies?",
            answer: "Hey, hey, LBJ, how many kids did you kill today?",
            explanation: "The chant highlighted Johnson's personal responsibility for the mounting casualties and civilian deaths.",
            year: 1967
          },
          {
            id: "q_4_1_s7",
            question: "Which folk-rock singer-songwriter wrote anti-war anthems like 'Blowin' in the Wind' and 'The Times They Are A-Changin'?",
            answer: "Bob Dylan",
            explanation: "Dylan's songs became the soundtrack of the 1960s protest culture and the student movement.",
            year: 1963
          },
          {
            id: "q_4_1_s8",
            question: "What organization of returning soldiers protested by throwing their combat medals onto the steps of the Capitol in 1971?",
            answer: "Vietnam Veterans Against the War (VVAW)",
            explanation: "VVAW's protests showed that even those who fought in the war believed it was unjust and unwinnable.",
            year: 1971
          },
          {
            id: "q_4_1_s9",
            question: "In which city did violent clashes break out between anti-war protesters and police during the 1968 Democratic National Convention?",
            answer: "Chicago",
            explanation: "Mayor Daley ordered a brutal crackdown, leading to a police riot on national television that deepened divisions.",
            year: 1968
          },
          {
            id: "q_4_1_s10",
            question: "Which 1973 Act of Congress limited the president's power to commit troops to foreign conflicts without approval?",
            answer: "War Powers Act",
            explanation: "Passed over Nixon's veto, the act required congressional approval within 60 days of deploying troops.",
            year: 1973
          }
        ],
        depth: [
          {
            id: "q_4_1_d1",
            question: "What justification did Muhammad Ali give for refusing to fight in the Vietnam War?",
            answer: "His religious beliefs and opposition to fighting other people of color",
            explanation: "Ali cited his faith as a Muslim and argued that Black Americans should not fight for a country that denied them civil rights at home.",
            year: 1967
          },
          {
            id: "q_4_1_d2",
            question: "What was the exact date of the Kent State shootings in Ohio?",
            answer: "4 May 1970",
            explanation: "Guardsmen fired 67 rounds into the crowd, killing 4 students and wounding 9 others, including one who was paralyzed.",
            year: 1970
          },
          {
            id: "q_4_1_d3",
            question: "At which historically Black university in Mississippi did state police shoot and kill two students on 15 May 1970?",
            answer: "Jackson State University",
            explanation: "Police fired on a dormitory during racial and anti-war tensions, killing two students and injuring 12.",
            year: 1970
          },
          {
            id: "q_4_1_d4",
            question: "What was the name of the Catholic activist group that raided a Maryland draft board and destroyed files with homemade napalm in 1968?",
            answer: "Catonsville Nine",
            explanation: "Led by Daniel and Philip Berrigan, they used their trial to deliver powerful anti-war statements.",
            year: 1968
          },
          {
            id: "q_4_1_d5",
            question: "Which massive anti-war protest in Washington in November 1969 drew a record turnout of over 250,000 peaceful marchers?",
            answer: "March on Washington for Peace",
            explanation: "Also known as the Mobilization, it was the largest single anti-war demonstration in American history.",
            year: 1969
          }
        ]
      },
      {
        id: "subtopic_4_2",
        embedVideo: "videos/subtopic_4_2.mp4",
        title: "Topic 4.2: Media coverage of Vietnam, credibility gap, My Lai massacre",
        standard: [
          {
            id: "q_4_2_s1",
            question: "What term describes the difference between what the government reported about the war and what journalists showed on TV?",
            answer: "Credibility gap",
            explanation: "The credibility gap eroded public trust in the presidency, especially after the Tet Offensive showed the war was not won.",
            year: 1968
          },
          {
            id: "q_4_2_s2",
            question: "In which South Vietnamese village did US troops massacre over 500 unarmed civilians in March 1968?",
            answer: "My Lai",
            explanation: "The massacre of women, children, and old men was covered up by the military until journalist Seymour Hersh broke the story.",
            year: 1968
          },
          {
            id: "q_4_2_s3",
            question: "Who was the US Army lieutenant court-martialed and convicted of murder for ordering the My Lai massacre?",
            answer: "William Calley",
            explanation: "Calley was sentenced to life in prison, but Nixon reduced his sentence, and he ultimately served only three years of house arrest.",
            year: 1971
          },
          {
            id: "q_4_2_s4",
            question: "What was the name of the top-secret government history of the war leaked to the press in 1971?",
            answer: "The Pentagon Papers",
            explanation: "The papers revealed that the government had systematically lied to Congress and the public about the scope of the war.",
            year: 1971
          },
          {
            id: "q_4_2_s5",
            question: "Who was the military analyst who leaked the Pentagon Papers to newspapers in 1971?",
            answer: "Daniel Ellsberg",
            explanation: "Ellsberg was a former defense analyst who copied the documents to expose the deception of the war.",
            year: 1971
          },
          {
            id: "q_4_2_s6",
            question: "Which newspaper first began publishing the leaked Pentagon Papers in June 1971?",
            answer: "The New York Times",
            explanation: "The Times published the first installments, leading to a major legal battle over freedom of the press.",
            year: 1971
          },
          {
            id: "q_4_2_s7",
            question: "In what year was the My Lai massacre story finally exposed to the American public?",
            answer: "1969",
            explanation: "Although the massacre occurred in March 1968, it was kept secret until Hersh's reports and soldier photos emerged in late 1969.",
            year: 1969
          },
          {
            id: "q_4_2_s8",
            question: "Which trusted CBS news anchor declared in 1968 that the war was mired in a stalemate?",
            answer: "Walter Cronkite",
            explanation: "Cronkite's report after visiting Vietnam deeply influenced public opinion. Johnson remarked: 'If I've lost Cronkite, I've lost Middle America.'",
            year: 1968
          },
          {
            id: "q_4_2_s9",
            question: "Which media technology brought graphic, uncensored color images of combat directly into American living rooms?",
            answer: "Television (TV)",
            explanation: "Television allowed families to see the reality of war and casualties every night, turning many against the conflict.",
            year: 1965
          },
          {
            id: "q_4_2_s10",
            question: "What was the name of the US helicopter pilot who landed his aircraft to protect My Lai civilians from his own troops?",
            answer: "Hugh Thompson",
            explanation: "Thompson threatened to fire on US soldiers if they continued killing, and evacuated several children to safety.",
            year: 1968
          }
        ],
        depth: [
          {
            id: "q_4_2_d1",
            question: "What was the exact month and year the My Lai massacre took place?",
            answer: "March 1968",
            explanation: "The massacre occurred on 16 March 1968 during a search-and-destroy operation in the Son My area.",
            year: 1968
          },
          {
            id: "q_4_2_d2",
            question: "Who was the independent investigative journalist who broke the My Lai massacre story in November 1969?",
            answer: "Seymour Hersh",
            explanation: "Hersh traced Calley's court-martial charges, interviewed soldiers, and won the Pulitzer Prize for his reporting.",
            year: 1969
          },
          {
            id: "q_4_2_d3",
            question: "Which Supreme Court case in 1971 ruled that the government could not block publication of the Pentagon Papers?",
            answer: "New York Times Co. v. United States",
            explanation: "The court ruled 6-3 that the government had not met the heavy burden needed to justify prior restraint of the press.",
            year: 1971
          },
          {
            id: "q_4_2_d4",
            question: "In what year did Daniel Ellsberg leak the Pentagon Papers to the press?",
            answer: "1971",
            explanation: "Ellsberg photocopied the 7,000-page report while working at the RAND Corporation, delivering it to the NYT.",
            year: 1971
          },
          {
            id: "q_4_2_d5",
            question: "What popular historical term describes the Vietnam War due to the lack of military censorship and nightly news coverage?",
            answer: "The first television war",
            explanation: "Unlike WWII, reporters had free access, and TV networks broadcasted battles and body bags into homes daily.",
            year: 1965
          }
        ]
      },
      {
        id: "subtopic_4_3",
        embedVideo: "videos/subtopic_4_3.mp4",
        title: "Topic 4.3: Support for the war",
        standard: [
          {
            id: "q_4_3_s1",
            question: "What term did Nixon use in November 1969 to describe the patriotic Americans who supported his war policy?",
            answer: "The Silent Majority",
            explanation: "Nixon argued that the loud anti-war protesters were a minority, and most Americans supported his efforts.",
            year: 1969
          },
          {
            id: "q_4_3_s2",
            question: "What was the primary political motivation for pro-war supporters in the US, fearing the global spread of communism?",
            answer: "Anti-communism",
            explanation: "Supporters believed that stopping communism in Vietnam was essential to protect American security and democracy.",
            year: 1965
          },
          {
            id: "q_4_3_s3",
            question: "What violent event occurred in New York City in May 1970 where construction workers attacked anti-war students?",
            answer: "Hard Hat Riots",
            explanation: "Mobilized by union leaders, construction workers beat student protesters, demonstrating the working-class support for the war.",
            year: 1970
          },
          {
            id: "q_4_3_s4",
            question: "What informal term was used to describe politicians and citizens who supported the escalation of the war?",
            answer: "Hawks",
            explanation: "Hawks favored military pressure, believing that the US should use all necessary force to win in Vietnam.",
            year: 1965
          },
          {
            id: "q_4_3_s5",
            question: "What informal term was used to describe politicians and citizens who favored a peaceful exit from the war?",
            answer: "Doves",
            explanation: "Doves argued that the war was a civil conflict that could not be won militarily and urged immediate negotiations.",
            year: 1965
          },
          {
            id: "q_4_3_s6",
            question: "What popular pro-war slogan expressed the view that citizens who criticized the war should emigrate?",
            answer: "America: Love It or Leave It",
            explanation: "The slogan reflected the intense patriotism and hostility toward anti-war protesters among supporters.",
            year: 1969
          },
          {
            id: "q_4_3_s7",
            question: "Which US president made the famous 'Silent Majority' speech on television in November 1969?",
            answer: "Richard Nixon",
            explanation: "The speech was highly successful, rallying conservative and working-class support to his administration.",
            year: 1969
          },
          {
            id: "q_4_3_s8",
            question: "Which major national labor union coalition supported Nixon's war policy and helped organize the Hard Hat Riots?",
            answer: "AFL-CIO",
            explanation: "Led by George Meany, the union leadership was strongly anti-communist and patriotic, aligning with Nixon.",
            year: 1970
          },
          {
            id: "q_4_3_s9",
            question: "In what month and year did President Nixon deliver his famous 'Silent Majority' address?",
            answer: "November 1969",
            explanation: "Delivered on 3 November 1969, the speech sought to buy time for his Vietnamisation policy.",
            year: 1969
          },
          {
            id: "q_4_3_s10",
            question: "What pro-war student organization was formed to counter the radical anti-war Student Mobilization Committee?",
            answer: "Young Americans for Freedom (YAF)",
            explanation: "YAF was a conservative youth organization that organized pro-war rallies and supported the draft.",
            year: 1969
          }
        ],
        depth: [
          {
            id: "q_4_3_d1",
            question: "How many construction workers marched in support of Nixon in New York City in the days following the Hard Hat Riots?",
            answer: "Over 20,000",
            explanation: "The workers marched to City Hall carrying American flags, showing the depth of working-class support for the troops.",
            year: 1970
          },
          {
            id: "q_4_3_d2",
            question: "What concept of national duty and pride did working-class supporters frequently cite when criticizing student protesters?",
            answer: "Patriotism",
            explanation: "Supporters felt that refusing the draft and burning flags was a betrayal of those who had served in previous wars.",
            year: 1969
          },
          {
            id: "q_4_3_d3",
            question: "Which New York Governor supported the construction workers and was later appointed Vice President by Gerald Ford?",
            answer: "Nelson Rockefeller",
            explanation: "Rockefeller took a moderate-conservative stance, supporting labor unions and Nixon's national security policies.",
            year: 1970
          },
          {
            id: "q_4_3_d4",
            question: "What demographic groups formed the primary social base for Nixon's Silent Majority?",
            answer: "Working-class, suburban, and older conservative Americans",
            explanation: "Often called 'Middle America', they were alienated by the counterculture, student riots, and radical civil rights.",
            year: 1969
          },
          {
            id: "q_4_3_d5",
            question: "What did pro-war advocates fear would happen to US allies if the United States withdrew from Vietnam in defeat?",
            answer: "Loss of US global credibility and containment failure",
            explanation: "They feared a communist takeover of the region and that allies would no longer trust US security commitments.",
            year: 1965
          }
        ]
      },
      {
        id: "subtopic_4_4",
        embedVideo: "videos/subtopic_4_4.mp4",
        title: "Topic 4.4: Reasons for the failure of the USA in Vietnam",
        standard: [
          {
            id: "q_4_4_s1",
            question: "In what year did Saigon fall to the North Vietnamese, marking the end of the Vietnam War?",
            answer: "1975",
            explanation: "Saigon fell on 30 April 1975, when NVA tanks crashed through the gates of the Presidential Palace.",
            year: 1975
          },
          {
            id: "q_4_4_s2",
            question: "What was the name of the final North Vietnamese conventional offensive that captured Saigon in 1975?",
            answer: "The Ho Chi Minh Campaign",
            explanation: "The offensive quickly overran South Vietnamese defense lines following the withdrawal of US aid.",
            year: 1975
          },
          {
            id: "q_4_4_s3",
            question: "What was the name of the US helicopter evacuation of Saigon in April 1975?",
            answer: "Operation Frequent Wind",
            explanation: "Helicopters evacuated over 1,000 Americans and 5,000 South Vietnamese refugees from the embassy and airport.",
            year: 1975
          },
          {
            id: "q_4_4_s4",
            question: "Who was the South Vietnamese President who surrendered Saigon to North Vietnamese forces?",
            answer: "Duong Van Minh",
            explanation: "Minh surrendered on 30 April, telling the NVA: 'I am waiting to hand over the power to you to avoid bloodshed.'",
            year: 1975
          },
          {
            id: "q_4_4_s5",
            question: "What is the estimated total cost of the Vietnam War to the United States economy?",
            answer: "Over $100 billion",
            explanation: "The enormous cost of the war drained federal funds, causing high inflation and economic problems in the 1970s.",
            year: 1975
          },
          {
            id: "q_4_4_s6",
            question: "How many US servicemen were killed in action during the course of the Vietnam War?",
            answer: "58,220",
            explanation: "The high casualty rate eroded public support for the war over its decade-long combat duration.",
            year: 1975
          },
          {
            id: "q_4_4_s7",
            question: "In what year did Congress pass the War Powers Act over Nixon's veto?",
            answer: "1973",
            explanation: "Passed in November 1973, it represented congressional assertion of authority to prevent future executive wars.",
            year: 1973
          },
          {
            id: "q_4_4_s8",
            question: "What was the primary economic consequence of the war's high military expenditure on the US homefront?",
            answer: "High inflation and deficits",
            explanation: "Johnson's attempt to fund both the war and his Great Society programs without raising taxes caused stagflation.",
            year: 1975
          },
          {
            id: "q_4_4_s9",
            question: "Which constitutional amendment lowered the US voting age to 18 in 1971, prompted by the draft?",
            answer: "26th Amendment",
            explanation: "The slogan 'old enough to fight, old enough to vote' led to the rapid ratification of the amendment.",
            year: 1971
          },
          {
            id: "q_4_4_s10",
            question: "What term describes the psychological reluctance of US politicians and public to intervene militarily abroad after Vietnam?",
            answer: "Vietnam Syndrome",
            explanation: "The syndrome dominated US foreign policy for decades, making leaders reluctant to engage in ground wars.",
            year: 1975
          }
        ],
        depth: [
          {
            id: "q_4_4_d1",
            question: "What was the exact date of the Fall of Saigon, marking the official end of South Vietnam?",
            answer: "30 April 1975",
            explanation: "Tanks entered the city, raised the Vietcong flag on the palace, and South Vietnam surrendered unconditionally.",
            year: 1975
          },
          {
            id: "q_4_4_d2",
            question: "What prominent building in Saigon became the iconic site of helicopter evacuations during Operation Frequent Wind?",
            answer: "US Embassy roof",
            explanation: "Images of refugees scaling embassy walls and boarding helicopters became symbols of the US defeat in Vietnam.",
            year: 1975
          },
          {
            id: "q_4_4_d3",
            question: "Under the War Powers Act of 1973, within how many hours must a president notify Congress of troop deployment?",
            answer: "48 hours",
            explanation: "The president must explain the reasons for the deployment and withdraw forces within 60 days unless Congress approves.",
            year: 1973
          },
          {
            id: "q_4_4_d4",
            question: "Which communist superpower provided North Vietnam with advanced anti-aircraft missiles and heavy artillery?",
            answer: "Soviet Union",
            explanation: "Soviet SAM missiles and technical advisors shot down hundreds of US planes, helping North Vietnam survive Rolling Thunder.",
            year: 1972
          },
          {
            id: "q_4_4_d5",
            question: "What strategic military miscalculation by General Westmoreland underestimated the motivation of the communist forces?",
            answer: "Strategy of attrition",
            explanation: "Westmoreland believed there was a 'crossover point' where casualties would break the enemy, but the communists replaced losses indefinitely.",
            year: 1968
          }
        ]
      }
    ]
  }
];

// Perform search and replace in questions.js file
const startIndex = filecontent.indexOf('export const QUIZ_DATA =');
const endIndex = filecontent.indexOf('export const EXAM_SKILLS_DATA =');

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find slice boundaries in questions.js!');
  process.exit(1);
}

const beforePart = filecontent.substring(0, startIndex);
const afterPart = filecontent.substring(endIndex);
const newQuizPart = 'export const QUIZ_DATA = ' + JSON.stringify(expandedQuizData, null, 2) + ';\n\n';

const updatedContent = beforePart + newQuizPart + afterPart;
fs.writeFileSync(filepath, updatedContent, 'utf8');
console.log('Successfully expanded QUIZ_DATA in questions.js to exactly 15 questions per subtopic!');
