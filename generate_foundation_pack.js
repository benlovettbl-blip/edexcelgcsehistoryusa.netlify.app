const fs = require('fs');

const topics = [
  {
    "id": "1.1",
    "title": "1.1: Segregation and Voting Rights in the South (1950s)",
    "part1": {
      "text": "In the 1950s, Black Americans in the South faced strict laws that kept them separated from white people. This system was called **[ 1 ]**. Black people had to use different public facilities, such as **[ 2 ]** fountains, and sit at the back of buses. To stop Black citizens from voting, many Southern states forced them to take incredibly difficult **[ 3 ]** tests. Even if they passed the test, many faced the threat of **[ 4 ]** or losing their jobs if they actually tried to register to vote.",
      "words": [
        "Water",
        "Segregation",
        "Literacy",
        "Violence"
      ]
    },
    "part2": [
      {
        "term": "Segregation",
        "def": "A reading and writing exam used to stop Black people from voting."
      },
      {
        "term": "Literacy Test",
        "def": "Using fear or threats to stop someone from doing something."
      },
      {
        "term": "Discrimination",
        "def": "Keeping people of different races separated from each other by law."
      },
      {
        "term": "Intimidation",
        "def": "Treating someone worse because of their race."
      }
    ],
    "part3": [
      {
        "text": "Black and white citizens were treated equally in the South during the 1950s.",
        "ans": "True / False"
      },
      {
        "text": "Literacy tests were made much harder for Black citizens than for white citizens.",
        "ans": "True / False"
      },
      {
        "text": "White mobs and local police sometimes used violence to enforce racial rules.",
        "ans": "True / False"
      },
      {
        "text": "It was very easy for a Black citizen to register to vote in states like Mississippi.",
        "ans": "True / False"
      }
    ],
    "part4": "In the 1950s, it was very difficult for Black Americans to vote because...",
    "part5": {
      "questions": [
        "What was the system of separating Black and white people called?",
        "What test was used to stop Black citizens from voting?",
        "Name one public facility that was segregated.",
        "What threat did Black people face if they tried to vote?",
        "Which area of the USA had the strictest segregation laws?"
      ],
      "answers": [
        "Segregation",
        "Literacy test",
        "Water fountains",
        "Violence",
        "The South"
      ]
    }
  },
  {
    "id": "1.2",
    "title": "1.2: Progress in Education (1954–1960)",
    "part1": {
      "text": "In 1954, the Supreme Court made a historic ruling in the case of Brown v. **[ 1 ]**. The court decided that segregated schools were unconstitutional because they could never be truly **[ 2 ]**. However, many Southern states resisted this change. In 1957, nine Black students tried to attend Central High School in **[ 3 ]**, Arkansas. The local governor used the National Guard to block them, so President **[ 4 ]** had to send in federal troops to protect the students.",
      "words": [
        "Little Rock",
        "Topeka",
        "Equal",
        "Eisenhower"
      ]
    },
    "part2": [
      {
        "term": "Supreme Court",
        "def": "A policy where local governments completely refused to integrate schools."
      },
      {
        "term": "Unconstitutional",
        "def": "The highest court in the USA that decides if laws are legal."
      },
      {
        "term": "Massive Resistance",
        "def": "Going against the rules written in the US Constitution."
      },
      {
        "term": "Integration",
        "def": "Bringing people of different races together in the same schools."
      }
    ],
    "part3": [
      {
        "text": "The Brown v. Topeka ruling immediately ended segregation in all Southern schools.",
        "ans": "True / False"
      },
      {
        "text": "The NAACP provided lawyers to help Linda Brown's family in court.",
        "ans": "True / False"
      },
      {
        "text": "The Little Rock Nine were welcomed by white crowds when they arrived at school.",
        "ans": "True / False"
      },
      {
        "text": "President Eisenhower used the US military to enforce the law at Little Rock.",
        "ans": "True / False"
      }
    ],
    "part4": "The events at Little Rock High School showed that...",
    "part5": {
      "questions": [
        "Which 1954 Supreme Court case banned school segregation?",
        "What phrase was used by the court to describe segregated schools?",
        "In which city did nine Black students try to attend Central High School?",
        "Which president sent federal troops to protect the students?",
        "What was the policy of Southern states refusing to integrate called?"
      ],
      "answers": [
        "Brown v. Topeka",
        "Unconstitutional",
        "Little Rock",
        "President Eisenhower",
        "Massive Resistance"
      ]
    }
  },
  {
    "id": "1.3",
    "title": "1.3: The Montgomery Bus Boycott (1955–1956)",
    "part1": {
      "text": "In 1955, **[ 1 ]** was arrested in Montgomery, Alabama, for refusing to give up her bus seat to a white man. In response, the local Black community organized a **[ 2 ]**, refusing to ride the buses for over a year. A young minister named Martin Luther **[ 3 ]** became the leader of the movement. The protest caused massive financial losses for the bus company and eventually led the Supreme Court to rule that bus segregation was **[ 4 ]**.",
      "words": [
        "King",
        "Rosa Parks",
        "Illegal",
        "Boycott"
      ]
    },
    "part2": [
      {
        "term": "Boycott",
        "def": "An activist who sparked the Montgomery bus protests."
      },
      {
        "term": "Rosa Parks",
        "def": "A church leader who believed in non-violent protest."
      },
      {
        "term": "MIA",
        "def": "Refusing to use a service or buy a product as a form of protest."
      },
      {
        "term": "Martin Luther King",
        "def": "The organization set up to run the bus boycott."
      }
    ],
    "part3": [
      {
        "text": "The Montgomery Bus Boycott lasted for only a few weeks.",
        "ans": "True / False"
      },
      {
        "text": "Black people in Montgomery walked or shared cars instead of taking the bus.",
        "ans": "True / False"
      },
      {
        "text": "The bus company made more money during the boycott.",
        "ans": "True / False"
      },
      {
        "text": "The boycott was completely peaceful and non-violent.",
        "ans": "True / False"
      }
    ],
    "part4": "The Montgomery Bus Boycott was successful because...",
    "part5": {
      "questions": [
        "Who was arrested for refusing to give up her bus seat?",
        "In which city did the bus boycott take place?",
        "Who became the leader of the bus boycott?",
        "How long did the bus boycott last?",
        "Did the Supreme Court rule bus segregation legal or illegal?"
      ],
      "answers": [
        "Rosa Parks",
        "Montgomery",
        "Martin Luther King",
        "Over a year",
        "Illegal"
      ]
    }
  },
  {
    "id": "1.4",
    "title": "1.4: Opposition to the Civil Rights Movement (1950s)",
    "part1": {
      "text": "During the 1950s, many white Southerners strongly opposed the civil rights movement. Groups like the White **[ 1 ]** Councils were formed by middle-class businessmen to politically and economically fight against integration. A more violent group, the **[ 2 ]**, experienced a revival and used terror tactics such as bombings and murders. In 1955, the brutal murder of a young boy named Emmett **[ 3 ]** shocked the nation. His killers were found not guilty by an all-white **[ 4 ]**, showing the deep racism in the Southern justice system.",
      "words": [
        "Till",
        "KKK",
        "Jury",
        "Citizens"
      ]
    },
    "part2": [
      {
        "term": "KKK",
        "def": "A group of ordinary people who decide if someone is guilty in court."
      },
      {
        "term": "White Citizens Council",
        "def": "Killing someone without a legal trial, often by a mob."
      },
      {
        "term": "Lynching",
        "def": "A violent racist group that wore white hoods and burned crosses."
      },
      {
        "term": "Jury",
        "def": "A group of middle-class white men who used economic pressure to stop civil rights."
      }
    ],
    "part3": [
      {
        "text": "The Ku Klux Klan was a peaceful political organization.",
        "ans": "True / False"
      },
      {
        "text": "Emmett Till's mother held an open-casket funeral so the world could see what happened.",
        "ans": "True / False"
      },
      {
        "text": "Southern police forces always protected civil rights activists from mobs.",
        "ans": "True / False"
      },
      {
        "text": "White Citizens Councils would fire Black employees who tried to register to vote.",
        "ans": "True / False"
      }
    ],
    "part4": "Many Southern politicians opposed civil rights laws because...",
    "part5": {
      "questions": [
        "Which groups were formed by middle-class businessmen to stop integration?",
        "Which violent racist group experienced a revival in the 1950s?",
        "Who was the young boy brutally murdered in 1955?",
        "Who found his killers not guilty?",
        "What term describes a mob killing someone without a legal trial?"
      ],
      "answers": [
        "White Citizens Councils",
        "KKK",
        "Emmett Till",
        "An all-white jury",
        "Lynching"
      ]
    }
  },
  {
    "id": "2.1",
    "title": "2.1: Peaceful Protests (Early 1960s)",
    "part1": {
      "text": "In the early 1960s, the civil rights movement used direct, non-violent action. In 1960, students held **[ 1 ]** at segregated lunch counters in Greensboro, waiting to be served. The following year, activists known as the Freedom **[ 2 ]** traveled on interstate buses to test new desegregation laws, facing extreme violence from white mobs. In 1963, Martin Luther King organized a massive protest in **[ 3 ]**, where police chief Bull Connor shocked the world by attacking protesters with police **[ 4 ]** and fire hoses.",
      "words": [
        "Dogs",
        "Riders",
        "Sit-ins",
        "Birmingham"
      ]
    },
    "part2": [
      {
        "term": "Sit-in",
        "def": "Using physical but peaceful protests, like marching or sitting down."
      },
      {
        "term": "Freedom Rides",
        "def": "A protest where people sit in a segregated place and refuse to leave."
      },
      {
        "term": "Direct Action",
        "def": "Police chief in Birmingham who used violent tactics against protesters."
      },
      {
        "term": "Bull Connor",
        "def": "Bus journeys across state lines to test desegregation laws."
      }
    ],
    "part3": [
      {
        "text": "The Greensboro sit-ins were started by four Black college students.",
        "ans": "True / False"
      },
      {
        "text": "Freedom Riders were never attacked by the KKK.",
        "ans": "True / False"
      },
      {
        "text": "The violence in Birmingham was broadcast on television across America.",
        "ans": "True / False"
      },
      {
        "text": "Martin Luther King's 'I Have a Dream' speech was given during the March on Washington.",
        "ans": "True / False"
      }
    ],
    "part4": "The protests in Birmingham were significant because...",
    "part5": {
      "questions": [
        "What type of protest happened at Greensboro lunch counters?",
        "Who traveled on interstate buses to test desegregation laws?",
        "In which city did police chief Bull Connor attack protesters?",
        "What animals were used to attack protesters in Birmingham?",
        "What type of action did protesters use?"
      ],
      "answers": [
        "Sit-ins",
        "Freedom Riders",
        "Birmingham",
        "Police dogs",
        "Direct, non-violent action"
      ]
    }
  },
  {
    "id": "2.2",
    "title": "2.2: Federal Legislation (1964–1965)",
    "part1": {
      "text": "Due to pressure from peaceful protests, the US government finally passed strong new laws. The Civil Rights Act of **[ 1 ]** banned segregation in public places and made employment discrimination illegal. To push for better voting rights, activists organized a famous march from **[ 2 ]** to Montgomery in 1965, which was met with brutal police violence on 'Bloody Sunday'. This prompted President Lyndon B. **[ 3 ]** to sign the Voting Rights Act of **[ 4 ]**, which banned literacy tests and sent federal officials to help Black people register to vote.",
      "words": [
        "Johnson",
        "Selma",
        "1964",
        "1965"
      ]
    },
    "part2": [
      {
        "term": "Civil Rights Act",
        "def": "The US President who signed the major civil rights laws."
      },
      {
        "term": "Voting Rights Act",
        "def": "A violent attack by police on peaceful marchers in Alabama."
      },
      {
        "term": "Bloody Sunday",
        "def": "The law that finally banned segregation in public places."
      },
      {
        "term": "Lyndon B. Johnson",
        "def": "The law that banned literacy tests and protected voters."
      }
    ],
    "part3": [
      {
        "text": "The 1964 Civil Rights Act completely solved all problems faced by Black Americans.",
        "ans": "True / False"
      },
      {
        "text": "The Selma march was organized to demand fair voting rights.",
        "ans": "True / False"
      },
      {
        "text": "The Voting Rights Act of 1965 resulted in a huge increase in Black voters.",
        "ans": "True / False"
      },
      {
        "text": "President Johnson refused to support the civil rights movement.",
        "ans": "True / False"
      }
    ],
    "part4": "The Voting Rights Act of 1965 was important because...",
    "part5": {
      "questions": [
        "Which act banned segregation in public places in 1964?",
        "Where did a famous march for voting rights take place in 1965?",
        "What was the violent attack on marchers in Alabama called?",
        "Which president signed these major civil rights laws?",
        "What did the Voting Rights Act of 1965 ban?"
      ],
      "answers": [
        "Civil Rights Act",
        "Selma to Montgomery",
        "Bloody Sunday",
        "Lyndon B. Johnson",
        "Literacy tests"
      ]
    }
  },
  {
    "id": "2.3",
    "title": "2.3: Malcolm X and Black Nationalism",
    "part1": {
      "text": "Not all Black Americans agreed with Martin Luther King's peaceful approach. Malcolm **[ 1 ]** was a powerful speaker who believed in Black nationalism. He was a leading figure in the Nation of **[ 2 ]**, a religious group that argued white people were 'devils' and that Black people should separate themselves entirely to build their own communities. Malcolm famously said that Black Americans should fight for their rights 'by any means **[ 3 ]**'. He appealed strongly to young Black people living in poor, Northern inner-city **[ 4 ]**.",
      "words": [
        "Necessary",
        "X",
        "Islam",
        "Ghettos"
      ]
    },
    "part2": [
      {
        "term": "Malcolm X",
        "def": "A religious group that wanted Black separatism."
      },
      {
        "term": "Nation of Islam",
        "def": "A brilliant speaker who rejected non-violent protest."
      },
      {
        "term": "Black Nationalism",
        "def": "Poor, segregated inner-city neighborhoods."
      },
      {
        "term": "Ghetto",
        "def": "The belief that Black people should control their own communities and economy."
      }
    ],
    "part3": [
      {
        "text": "Malcolm X believed that non-violent protest was the best way to achieve equality.",
        "ans": "True / False"
      },
      {
        "text": "The Nation of Islam wanted Black and white people to be completely integrated.",
        "ans": "True / False"
      },
      {
        "text": "Malcolm X was assassinated in 1965.",
        "ans": "True / False"
      },
      {
        "text": "Many young Black people in Northern cities felt that King's methods were too slow.",
        "ans": "True / False"
      }
    ],
    "part4": "Malcolm X disagreed with Martin Luther King because...",
    "part5": {
      "questions": [
        "Who was a leading figure in the Nation of Islam?",
        "What did Malcolm X believe in instead of integration?",
        "According to Malcolm X, how should Black Americans fight for their rights?",
        "What term describes poor, segregated inner-city neighborhoods?",
        "Did Malcolm X believe in Martin Luther King's peaceful approach?"
      ],
      "answers": [
        "Malcolm X",
        "Black Nationalism",
        "By any means necessary",
        "Ghettos",
        "No"
      ]
    }
  },
  {
    "id": "2.4",
    "title": "2.4: The Black Power Movement",
    "part1": {
      "text": "Inspired by Malcolm X, the Black **[ 1 ]** movement grew in the late 1960s. Leaders like Stokely Carmichael argued that Black Americans should take pride in their heritage and defend themselves against police brutality. The most famous group was the Black **[ 2 ]** Party, founded in 1966. They carried guns for self-defense and monitored police patrols. However, they also ran community survival programs, such as free **[ 3 ]** clubs for school children. The movement was very visible at the 1968 **[ 4 ]**, where two athletes gave the Black Power salute.",
      "words": [
        "Olympics",
        "Panther",
        "Power",
        "Breakfast"
      ]
    },
    "part2": [
      {
        "term": "Black Power",
        "def": "A militant group that carried guns and ran community programs."
      },
      {
        "term": "Stokely Carmichael",
        "def": "A civil rights leader who popularized the phrase 'Black Power'."
      },
      {
        "term": "Black Panthers",
        "def": "Taking pride in Black culture, history, and independence."
      },
      {
        "term": "Self-Defense",
        "def": "Protecting oneself from physical attack or police violence."
      }
    ],
    "part3": [
      {
        "text": "The Black Panthers only focused on violence and did not help their communities.",
        "ans": "True / False"
      },
      {
        "text": "The Black Power movement encouraged Black Americans to take pride in their African roots.",
        "ans": "True / False"
      },
      {
        "text": "The FBI strongly supported the Black Panthers and helped fund them.",
        "ans": "True / False"
      },
      {
        "text": "The Black Power salute at the 1968 Olympics shocked white America.",
        "ans": "True / False"
      }
    ],
    "part4": "The Black Panthers were popular in inner cities because...",
    "part5": {
      "questions": [
        "Which leader popularized the phrase 'Black Power'?",
        "Which militant group carried guns for self-defense?",
        "Name one community survival program run by the Panthers.",
        "What event in 1968 featured a famous Black Power salute?",
        "What did the Black Panthers monitor to prevent brutality?"
      ],
      "answers": [
        "Stokely Carmichael",
        "Black Panthers",
        "Free breakfast clubs",
        "The Olympics",
        "Police patrols"
      ]
    }
  },
  {
    "id": "3.1",
    "title": "3.1: The Domino Theory and US Involvement",
    "part1": {
      "text": "After World War II, the USA was locked in a Cold War against the Soviet Union and feared the spread of **[ 1 ]**. President Eisenhower believed in the **[ 2 ]** Theory: if one country in Asia fell to communism, its neighbors would also fall, one after another. Vietnam was split in two: the North was communist, led by Ho Chi **[ 3 ]**, while the South was anti-communist but very corrupt. To stop the communists taking over the South, the USA started sending money, weapons, and military **[ 4 ]** to help the South Vietnamese army.",
      "words": [
        "Minh",
        "Communism",
        "Domino",
        "Advisers"
      ]
    },
    "part2": [
      {
        "term": "Communism",
        "def": "The communist leader of North Vietnam."
      },
      {
        "term": "Domino Theory",
        "def": "A political system where the government owns all property and businesses."
      },
      {
        "term": "Ho Chi Minh",
        "def": "American soldiers sent to train the South Vietnamese army."
      },
      {
        "term": "Military Advisers",
        "def": "The belief that if one country falls to communism, others will follow."
      }
    ],
    "part3": [
      {
        "text": "The USA wanted Vietnam to be completely communist.",
        "ans": "True / False"
      },
      {
        "text": "The Domino Theory made the USA fear that communism would spread across Asia.",
        "ans": "True / False"
      },
      {
        "text": "North Vietnam was supported by the USA.",
        "ans": "True / False"
      },
      {
        "text": "President Kennedy sent thousands of military advisers to Vietnam.",
        "ans": "True / False"
      }
    ],
    "part4": "The USA first got involved in Vietnam because...",
    "part5": {
      "questions": [
        "What theory suggested that if one country fell to communism, others would follow?",
        "Which superpower was the USA fighting in the Cold War?",
        "Who was the communist leader of North Vietnam?",
        "Which half of Vietnam was anti-communist?",
        "Who did the USA send to train the South Vietnamese army initially?"
      ],
      "answers": [
        "Domino Theory",
        "The Soviet Union",
        "Ho Chi Minh",
        "The South",
        "Military advisers"
      ]
    }
  },
  {
    "id": "3.2",
    "title": "3.2: The Gulf of Tonkin Incident (1964)",
    "part1": {
      "text": "In August 1964, an incident occurred that drastically changed the war. A US warship, the USS **[ 1 ]**, reported that it had been fired upon by North Vietnamese torpedo boats in the Gulf of **[ 2 ]**. In response, the US Congress passed the Gulf of Tonkin **[ 3 ]**. This gave President Lyndon B. Johnson the power to take 'all necessary measures' to defend US forces. This was a turning point because it allowed Johnson to send hundreds of thousands of combat **[ 4 ]** to fight directly in Vietnam without officially declaring war.",
      "words": [
        "Resolution",
        "Troops",
        "Maddox",
        "Tonkin"
      ]
    },
    "part2": [
      {
        "term": "USS Maddox",
        "def": "The US President who escalated the war by sending combat troops."
      },
      {
        "term": "Gulf of Tonkin",
        "def": "A law giving the President power to wage war without Congress."
      },
      {
        "term": "Resolution",
        "def": "The American warship involved in the 1964 incident."
      },
      {
        "term": "Lyndon B. Johnson",
        "def": "The body of water where the supposed attack took place."
      }
    ],
    "part3": [
      {
        "text": "The Gulf of Tonkin incident led to a massive increase in US troops in Vietnam.",
        "ans": "True / False"
      },
      {
        "text": "The US Congress refused to give President Johnson power to fight in Vietnam.",
        "ans": "True / False"
      },
      {
        "text": "By 1965, American soldiers were directly fighting against the Vietcong.",
        "ans": "True / False"
      },
      {
        "text": "The Vietcong were fighting to keep South Vietnam capitalist.",
        "ans": "True / False"
      }
    ],
    "part4": "The Gulf of Tonkin Resolution was important because...",
    "part5": {
      "questions": [
        "Which US warship was reportedly fired upon in 1964?",
        "In which body of water did this incident occur?",
        "What did Congress pass to give the President power to wage war?",
        "Which President used this to send combat troops?",
        "Did Congress officially declare war on North Vietnam?"
      ],
      "answers": [
        "USS Maddox",
        "Gulf of Tonkin",
        "Gulf of Tonkin Resolution",
        "Lyndon B. Johnson",
        "No"
      ]
    }
  },
  {
    "id": "3.3",
    "title": "3.3: US Military Tactics in Vietnam",
    "part1": {
      "text": "The US military used its massive firepower and high-tech weapons to fight the Vietcong. They launched Operation Rolling **[ 1 ]**, a massive bombing campaign against North Vietnam. On the ground, US soldiers conducted 'Search and **[ 2 ]**' missions, flying into villages on helicopters to hunt for communist fighters. Because the Vietcong hid in the dense jungle, the USA sprayed toxic chemical weedkillers like Agent **[ 3 ]** to strip the leaves off trees. They also dropped **[ 4 ]**, a highly flammable jelly that burned everything it touched.",
      "words": [
        "Orange",
        "Napalm",
        "Thunder",
        "Destroy"
      ]
    },
    "part2": [
      {
        "term": "Rolling Thunder",
        "def": "Missions where US troops hunted for Vietcong in villages."
      },
      {
        "term": "Search and Destroy",
        "def": "A chemical weedkiller used to destroy jungle cover."
      },
      {
        "term": "Agent Orange",
        "def": "A sticky, burning jelly used in American bombs."
      },
      {
        "term": "Napalm",
        "def": "The massive American bombing campaign against North Vietnam."
      }
    ],
    "part3": [
      {
        "text": "Operation Rolling Thunder quickly forced North Vietnam to surrender.",
        "ans": "True / False"
      },
      {
        "text": "Search and Destroy missions often resulted in innocent civilians being killed.",
        "ans": "True / False"
      },
      {
        "text": "Agent Orange caused severe health problems and birth defects.",
        "ans": "True / False"
      },
      {
        "text": "The US military had much better technology and weapons than the Vietcong.",
        "ans": "True / False"
      }
    ],
    "part4": "American military tactics were heavily criticized because...",
    "part5": {
      "questions": [
        "What was the massive bombing campaign against North Vietnam called?",
        "What type of ground missions did US soldiers conduct?",
        "Which toxic weedkiller was used to destroy jungle cover?",
        "What flammable jelly was dropped in American bombs?",
        "What was a common result of Search and Destroy missions?"
      ],
      "answers": [
        "Operation Rolling Thunder",
        "Search and Destroy",
        "Agent Orange",
        "Napalm",
        "Civilian casualties"
      ]
    }
  },
  {
    "id": "3.4",
    "title": "3.4: The Tet Offensive (1968)",
    "part1": {
      "text": "In early 1968, during a Vietnamese public holiday, communist forces launched a massive surprise attack on over 100 cities in South Vietnam. This was called the **[ 1 ]** Offensive. A suicide squad even managed to break into the US **[ 2 ]** in Saigon. Although the US army fought back and killed thousands of Vietcong fighters, it was a massive psychological disaster. The American public watched the chaos on **[ 3 ]** and realized the government had been lying when it said the war was almost **[ 4 ]**.",
      "words": [
        "Television",
        "Won",
        "Tet",
        "Embassy"
      ]
    },
    "part2": [
      {
        "term": "Tet",
        "def": "The location of a major Vietcong attack in the capital city."
      },
      {
        "term": "The Vietcong",
        "def": "The Vietnamese New Year holiday."
      },
      {
        "term": "US Embassy",
        "def": "A psychological victory that turned Americans against the war."
      },
      {
        "term": "Turning Point",
        "def": "The communist fighters who launched the surprise attacks."
      }
    ],
    "part3": [
      {
        "text": "The Tet Offensive was a massive military victory for the Vietcong.",
        "ans": "True / False"
      },
      {
        "text": "The US Embassy in Saigon was heavily attacked during the offensive.",
        "ans": "True / False"
      },
      {
        "text": "The American media reported that the USA was definitely winning the war after Tet.",
        "ans": "True / False"
      },
      {
        "text": "The Tet Offensive made President Johnson very unpopular.",
        "ans": "True / False"
      }
    ],
    "part4": "The Tet Offensive was a turning point in the war because...",
    "part5": {
      "questions": [
        "What major communist attack happened in early 1968?",
        "During which holiday did this attack take place?",
        "Which US building in Saigon was breached by a suicide squad?",
        "How did the American public watch the chaos?",
        "Did this event increase or decrease support for the war in America?"
      ],
      "answers": [
        "The Tet Offensive",
        "Vietnamese New Year",
        "The US Embassy",
        "On television",
        "Decrease"
      ]
    }
  },
  {
    "id": "4.1",
    "title": "4.1: Nixon and Vietnamisation",
    "part1": {
      "text": "When Richard **[ 1 ]** became President in 1969, he promised to get the USA out of the war with 'Peace with Honor'. He introduced a policy called **[ 2 ]**. This meant slowly withdrawing American combat troops and handing over the fighting to the **[ 3 ]** Vietnamese army. To give them time to prepare, Nixon secretly ordered the heavy bombing of neighboring countries like **[ 4 ]** to destroy communist supply routes, which proved highly controversial.",
      "words": [
        "South",
        "Cambodia",
        "Nixon",
        "Vietnamisation"
      ]
    },
    "part2": [
      {
        "term": "Richard Nixon",
        "def": "The policy of training South Vietnam to fight its own war."
      },
      {
        "term": "Vietnamisation",
        "def": "The US President who withdrew troops from Vietnam."
      },
      {
        "term": "Withdrawal",
        "def": "A neighboring country secretly bombed by the USA."
      },
      {
        "term": "Cambodia",
        "def": "The process of removing American troops from the warzone."
      }
    ],
    "part3": [
      {
        "text": "Nixon's plan was to send 100,000 more American troops to Vietnam.",
        "ans": "True / False"
      },
      {
        "text": "Vietnamisation meant training the South Vietnamese army to fight the Vietcong.",
        "ans": "True / False"
      },
      {
        "text": "Nixon secretly expanded the bombing into Cambodia and Laos.",
        "ans": "True / False"
      },
      {
        "text": "The South Vietnamese army was strong enough to defeat the communists on their own.",
        "ans": "True / False"
      }
    ],
    "part4": "President Nixon introduced Vietnamisation because...",
    "part5": {
      "questions": [
        "Which President introduced the policy of Vietnamisation?",
        "What did Vietnamisation mean for American combat troops?",
        "Whose army was supposed to take over the fighting?",
        "Which neighboring country did Nixon secretly bomb?",
        "What was Nixon's promised phrase for ending the war?"
      ],
      "answers": [
        "Richard Nixon",
        "Slow withdrawal",
        "South Vietnamese army",
        "Cambodia",
        "Peace with Honor"
      ]
    }
  },
  {
    "id": "4.2",
    "title": "4.2: The Anti-War Movement in the USA",
    "part1": {
      "text": "As the war dragged on and casualties increased, the anti-war movement grew rapidly across America. Many young men burned their **[ 1 ]** cards because they did not want to be forced to join the army. Protests were especially common on college **[ 2 ]**. In 1970, a tragic event occurred at **[ 3 ]** State University in Ohio, when National Guardsmen fired into a crowd of unarmed student protesters, killing **[ 4 ]** people. This shocked the nation and led to even more strikes and protests.",
      "words": [
        "Four",
        "Kent",
        "Draft",
        "Campuses"
      ]
    },
    "part2": [
      {
        "term": "Draft Card",
        "def": "The university where four protesting students were shot."
      },
      {
        "term": "Protest",
        "def": "A document forcing a young man to join the military."
      },
      {
        "term": "Kent State",
        "def": "People who opposed the war because they believed it was immoral."
      },
      {
        "term": "Pacifists",
        "def": "A public demonstration to show disagreement with the government."
      }
    ],
    "part3": [
      {
        "text": "The draft was a system where young men volunteered to join the army.",
        "ans": "True / False"
      },
      {
        "text": "Many university students strongly opposed the Vietnam War.",
        "ans": "True / False"
      },
      {
        "text": "Four students were killed by the National Guard at Kent State University.",
        "ans": "True / False"
      },
      {
        "text": "The events at Kent State made the anti-war movement stop completely.",
        "ans": "True / False"
      }
    ],
    "part4": "Many young Americans opposed the Vietnam War because...",
    "part5": {
      "questions": [
        "What did many young men burn to avoid joining the army?",
        "Where were protests especially common?",
        "At which university were four student protesters killed in 1970?",
        "Who fired into the crowd of students?",
        "What term describes people who oppose war because it is immoral?"
      ],
      "answers": [
        "Draft cards",
        "College campuses",
        "Kent State University",
        "The National Guard",
        "Pacifists"
      ]
    }
  },
  {
    "id": "4.3",
    "title": "4.3: The Paris Peace Accords (1973)",
    "part1": {
      "text": "After years of fighting and secret negotiations, all sides finally signed a peace treaty in **[ 1 ]** in January 1973. The Paris Peace Accords agreed to a **[ 2 ]** across Vietnam. The USA promised to remove all its remaining troops within 60 days, and North Vietnam agreed to release all American Prisoners of **[ 3 ]**. However, the peace did not last long. Once the American military was gone, North Vietnam invaded the South again and finally captured the capital city, **[ 4 ]**, in 1975.",
      "words": [
        "Saigon",
        "Ceasefire",
        "Paris",
        "War"
      ]
    },
    "part2": [
      {
        "term": "Paris Peace Accords",
        "def": "An agreement to stop all fighting."
      },
      {
        "term": "Ceasefire",
        "def": "The treaty that ended US military involvement in Vietnam."
      },
      {
        "term": "POWs",
        "def": "The capital city of South Vietnam that fell to the communists."
      },
      {
        "term": "Saigon",
        "def": "Prisoners of War; soldiers captured by the enemy."
      }
    ],
    "part3": [
      {
        "text": "The Paris Peace Accords were signed in 1973.",
        "ans": "True / False"
      },
      {
        "text": "The peace agreement meant that North and South Vietnam would be peaceful forever.",
        "ans": "True / False"
      },
      {
        "text": "The USA successfully rescued all its soldiers from Vietnam.",
        "ans": "True / False"
      },
      {
        "text": "South Vietnam fell entirely to communism in 1975.",
        "ans": "True / False"
      }
    ],
    "part4": "The Paris Peace Accords did not solve the conflict because...",
    "part5": {
      "questions": [
        "In what city was a peace treaty signed in 1973?",
        "What did the Paris Peace Accords agree to across Vietnam?",
        "How long did the USA have to remove its remaining troops?",
        "What did North Vietnam agree to release?",
        "Which city was finally captured by North Vietnam in 1975?"
      ],
      "answers": [
        "Paris",
        "A ceasefire",
        "60 days",
        "American Prisoners of War",
        "Saigon"
      ]
    }
  },
  {
    "id": "4.4",
    "title": "4.4: Reasons for US Defeat in Vietnam",
    "part1": {
      "text": "The USA failed to win the war for several reasons. The Vietcong used brilliant **[ 1 ]** tactics, hiding in complex tunnel systems and launching deadly ambushes in the jungle. In contrast, American troops suffered from low **[ 2 ]**, with many soldiers using drugs or 'fragging' their own officers. Furthermore, the USA lost the 'hearts and **[ 3 ]**' of the Vietnamese peasants because American bombing destroyed their homes and villages. Finally, back home in America, the huge **[ 4 ]** movement pressured the government to pull out of the unwinnable war.",
      "words": [
        "Anti-war",
        "Minds",
        "Guerrilla",
        "Morale"
      ]
    },
    "part2": [
      {
        "term": "Guerrilla Tactics",
        "def": "The confidence and enthusiasm of the soldiers."
      },
      {
        "term": "Morale",
        "def": "Winning the support and loyalty of the local people."
      },
      {
        "term": "Hearts and Minds",
        "def": "Soldiers murdering their own commanding officers."
      },
      {
        "term": "Fragging",
        "def": "Sneak attacks, booby traps, and hiding in the jungle."
      }
    ],
    "part3": [
      {
        "text": "The Vietcong used complex tunnel systems to hide from American bombs.",
        "ans": "True / False"
      },
      {
        "text": "American troops in Vietnam always had high morale and discipline.",
        "ans": "True / False"
      },
      {
        "text": "US bombing campaigns made the Vietnamese peasants love the Americans.",
        "ans": "True / False"
      },
      {
        "text": "The anti-war movement played a role in forcing the USA to leave Vietnam.",
        "ans": "True / False"
      }
    ],
    "part4": "The most important reason the USA lost the Vietnam War was...",
    "part5": {
      "questions": [
        "What brilliant tactics did the Vietcong use?",
        "What did American troops suffer from in Vietnam?",
        "What term described soldiers murdering their own officers?",
        "What did the USA lose by destroying Vietnamese homes?",
        "Which movement in America pressured the government to pull out?"
      ],
      "answers": [
        "Guerrilla tactics",
        "Low morale",
        "Fragging",
        "Hearts and Minds",
        "The anti-war movement"
      ]
    }
  }
];

function generateChecklist() {
  return topics.map(t => `
    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 6px; font-size: 13.5px; line-height: 1.3;">
        <div class="check-box" style="width: 20px; height: 20px; border: 2px solid var(--text); border-radius: 4px; flex-shrink: 0;"></div>
        <div><strong>Key Topic ${t.title}</strong></div>
    </div>`).join('\n');
}

function generatePages() {
  return topics.map(topic => `
<div class="page">
    <header style="margin-bottom: 20px; text-align: center; padding-bottom: 15px;">
        <h1 style="font-size: 24px; color: var(--primary); margin: 0; font-weight: bold; text-decoration: underline; text-underline-offset: 4px;">Key Topic ${topic.title}</h1>
    </header>

    <div class="activity-section" style="display: flex; flex-direction: column; flex-grow: 1;">
        
        <!-- PART 1 -->
        <div style="margin-bottom: 35px;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 10px;">Part 1: The Core Story (Fill in the blanks)</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 15px;">Read the paragraph below and use the words in the Word Bank to fill in the missing gaps.</div>
            <div style="font-size: 16px; line-height: 2.0; margin-bottom: 20px;">
                ${topic.part1.text.replace(/\[ \d \]/g, match => `<span style="display: inline-block; width: 120px; border-bottom: 1px solid #000; text-align: center;">&nbsp;</span>`)}
            </div>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; border: 1px dashed #cbd5e1; text-align: center;">
                <strong style="font-size: 15px; color: var(--primary-dark);">Word Bank:</strong><br><br>
                <span style="font-size: 16px; letter-spacing: 1px; font-weight: bold;">[ ${topic.part1.words.join(' ] &nbsp;&nbsp;&nbsp;&nbsp; [ ')} ]</span>
            </div>
        </div>

        <!-- PART 2 -->
        <div style="margin-bottom: 35px;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 10px;">Part 2: Key Vocabulary (Matching)</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 15px;">Draw a line to connect each key term on the left with its correct meaning on the right.</div>
            
            <div style="display: flex; justify-content: space-between; font-size: 16px;">
                <div style="width: 40%; display: flex; flex-direction: column; gap: 25px; padding-top: 5px;">
                    ${topic.part2.map((item, idx) => `<div><strong>${idx + 1}. ${item.term}</strong></div>`).join('')}
                </div>
                <div style="width: 55%; display: flex; flex-direction: column; gap: 25px; padding-top: 5px;">
                    ${topic.part2.map((item, idx) => `<div><em>${String.fromCharCode(65 + idx)}. ${item.def}</em></div>`).join('')}
                </div>
            </div>
        </div>

        <!-- PART 3 -->
        <div style="margin-bottom: 20px; flex-grow: 1;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 10px;">Part 3: Fact Check (True or False)</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 15px;">Read each statement carefully. Circle 'True' if it is a fact, or 'False' if it is incorrect.</div>
            
            <div style="display: flex; flex-direction: column; gap: 20px; font-size: 16px;">
                ${topic.part3.map((item, idx) => `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
                    <div style="width: 80%;">${idx + 1}. ${item.text}</div>
                    <div style="width: 15%; text-align: right; font-weight: bold;">True / False</div>
                </div>`).join('')}
            </div>
        </div>

    </div>
</div>

<div class="page">
    <header style="margin-bottom: 25px; text-align: center; padding-bottom: 10px; border-bottom: 2px solid var(--border);">
        <h1 style="font-size: 24px; color: var(--primary); margin: 0; font-weight: bold;">${topic.title} (Continued)</h1>
    </header>

    <div class="activity-section" style="display: flex; flex-direction: column; flex-grow: 1;">

        <!-- PART 4 -->
        <div style="margin-bottom: 25px;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 8px;">Part 4: The 'One Sentence' Challenge</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 15px;">Finish the sentence below using one piece of knowledge you have learned about this topic.</div>
            
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">"${topic.part4}"</div>
            
            <div style="border-bottom: 2px dotted #94a3b8; width: 100%; margin-bottom: 25px;"></div>
            <div style="border-bottom: 2px dotted #94a3b8; width: 100%; margin-bottom: 25px;"></div>
            <div style="border-bottom: 2px dotted #94a3b8; width: 100%;"></div>
        </div>

        <!-- PART 5 -->
        <div style="margin-bottom: 15px; flex-grow: 1;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 8px;">Part 5: Core Recall</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 15px;">Answer the five core questions below. Choose the correct answers from the Answer Bank at the bottom of the page.</div>
            
            <div style="display: flex; flex-direction: column; gap: 20px; font-size: 16px;">
                ${topic.part5.questions.map((q, idx) => `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div><strong>${idx + 1}.</strong> ${q}</div>
                    <div style="border-bottom: 2px solid #000; width: 100%; height: 20px;"></div>
                </div>`).join('')}
            </div>
        </div>

        <!-- ANSWER BANK -->
        <div style="margin-top: auto; padding-top: 15px; page-break-inside: avoid; break-inside: avoid;">
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 2px solid var(--border); text-align: center;">
                <strong style="font-size: 16px; color: var(--primary-dark);">Answer Bank:</strong><br><br>
                <div style="font-size: 16px; font-weight: bold; display: flex; flex-wrap: wrap; justify-content: center; gap: 15px;">
                    ${[...topic.part5.answers].sort(() => Math.random() - 0.5).map(ans => `<span style="background: #e2e8f0; padding: 5px 15px; border-radius: 20px; border: 1px solid #cbd5e1;">${ans}</span>`).join('')}
                </div>
            </div>
        </div>

    </div>
</div>
`).join('\n');
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Foundation Quiz Pack</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        :root {
            --primary: #2563eb;
            --primary-dark: #1e40af;
            --border: #cbd5e1;
            --bg-light: #f8fafc;
            --text: #0f172a;
        }

        body {
            font-family: 'Inter', sans-serif;
            color: var(--text);
            line-height: 1.5;
            margin: 0;
            padding: 0;
            background: #e2e8f0;
        }

        @page {
            size: A4;
            margin: 15mm;
        }

        .page {
            background: white;
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            padding: 20mm;
            box-sizing: border-box;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .cover-page {
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 40mm 20mm;
        }

        @media print {
            body { background: none; }
            .page { 
                margin: 0; padding: 0; border: none; box-shadow: none; 
                width: 100%; min-height: 100%;
                page-break-after: always;
            }
        }
    </style>
</head>
<body>

<!-- Cover Page -->
<div class="page cover-page">
    <div class="cover-title" style="font-size: 42px; font-weight: 800; color: var(--primary-dark); margin-bottom: 10px; line-height: 1.2;">Foundation Quiz Pack</div>
    <div class="cover-subtitle" style="font-size: 18px; color: #475569; margin-bottom: 15px;">The USA, 1954–75: conflict at home and abroad</div>
    
    <div class="cover-name-box" style="border: 2px dashed var(--border); padding: 12px; width: 85%; text-align: left; font-size: 15px; margin-bottom: 15px;">
        <strong>Name:</strong> _________________________________________<br><br>
        <strong>Class:</strong> _________________________________________
    </div>

    <div class="checklist" style="text-align: left; width: 85%; background: var(--bg-light); padding: 12px 20px; border-radius: 8px; border: 1px solid var(--border);">
        <h3 style="margin-top: 0; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 12px; font-size: 1.1rem;">Key Topics Checklist</h3>
        ${generateChecklist()}
    </div>
</div>

${generatePages()}

</body>
</html>`;

fs.writeFileSync('public/foundation_quiz_pack.html', htmlContent);
console.log('Foundation Quiz Pack generated successfully at public/foundation_quiz_pack.html');
