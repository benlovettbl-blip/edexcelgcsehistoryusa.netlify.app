export const DECISIONS_DATA = [
  {
    id: "game_1",
    title: "The Federal Showdown",
    series: "Presidential Hotline",
    topic: "Key Topic 1: Civil Rights Movement",
    role: "President Dwight D. Eisenhower (September 1957)",
    icon: "fa-solid fa-building-columns",
    crisis: "Governor Faubus of Arkansas is using state National Guard troops to block the 'Little Rock Nine' from entering high school, defying the Brown v. Topeka ruling. A hostile mob of white protesters has gathered, threatening violence.",
    phase1: {
      choiceA: {
        text: "Invite Governor Faubus to a summit to negotiate a peaceful withdrawal.",
        fallout: "Governor Faubus withdraws the National Guard under federal pressure, but leaves the Little Rock Nine completely exposed to the violent mob. No protection is left for the students.",
        choice1: {
          text: "Abandon desegregation to prevent a full-scale riot.",
          verdict: "Total collapse of federal authority. Desegregation stalls for a decade, and you look weak on the national stage, emboldening segregationists across the South.",
          isHistorical: false
        },
        choice2: {
          text: "Send in federal troops late to restore order.",
          verdict: "Troops arrive, but the media narrative is of a hesitant, weak President. The Civil Rights movement loses faith in your administration's commitment.",
          isHistorical: false
        }
      },
      choiceB: {
        text: "Federalise the National Guard and send in the 101st Airborne Division.",
        fallout: "The army secures the school and escorts the students. However, Governor Faubus retaliates the next year by closing all public high schools in Little Rock to block integration.",
        choice1: {
          text: "Force the schools open via federal courts.",
          verdict: "The legal battle takes years (Cooper v. Aaron). The Supreme Court rules that states cannot nullify federal court orders. The schools eventually reopen integrated, legally cementing federal supremacy.",
          isHistorical: true
        },
        choice2: {
          text: "Step back and let the state handle the shutdown ('Lost Year').",
          verdict: "Faubus shuts the schools. White students go to private academies; Black students get no education. A tragic stalemate that damages your legacy.",
          isHistorical: false
        }
      }
    }
  },
  {
    id: "game_2",
    title: "The Television Tipping Point",
    series: "Presidential Hotline",
    topic: "Key Topic 2: Protest & Progress",
    role: "President John F. Kennedy (May 1963)",
    icon: "fa-solid fa-tv",
    crisis: "Police Chief 'Bull' Connor is using police attack dogs and high-pressure fire hoses on peaceful Black student protesters in Birmingham. The horrific images are broadcasting globally, causing international outrage.",
    phase1: {
      choiceA: {
        text: "Send Department of Justice lawyers to quietly negotiate a local truce.",
        fallout: "The local truce is weak and segregationists refuse to honor it. Protests continue, and Martin Luther King Jr. begins to lose control of the angry crowds.",
        choice1: {
          text: "Step in with massive federal force to crush the rising riots.",
          verdict: "Birmingham burns. You look like a tyrant to the Left and weak to the Right. The Civil Rights movement splinters permanently.",
          isHistorical: false
        },
        choice2: {
          text: "Let local police handle the escalating violence.",
          verdict: "'Bull' Connor violently crushes the protests completely. Martin Luther King Jr. remains in jail indefinitely. The movement loses its national platform.",
          isHistorical: false
        }
      },
      choiceB: {
        text: "Address the nation on live TV and commit to passing a sweeping Civil Rights Act.",
        fallout: "Your televised speech gives the movement huge momentum leading to the March on Washington, but triggers a severe, violent backlash from the KKK in the South.",
        choice1: {
          text: "Water down your Civil Rights Bill to appease Southern Democrats.",
          verdict: "The bill passes easily but lacks teeth. Protesters feel betrayed, accelerating the rise of militant groups like the Black Panthers.",
          isHistorical: false
        },
        choice2: {
          text: "Push it through unchanged and risk your political career.",
          verdict: "You face a massive Southern filibuster in Congress and the bill stalls. Following your tragic assassination, President Lyndon B. Johnson uses the national grief and his aggressive political skills to force through the landmark Civil Rights Act of 1964.",
          isHistorical: true
        }
      }
    }
  },
  {
    id: "game_3",
    title: "The Escalation Trap",
    series: "Presidential Hotline",
    topic: "Key Topic 3: US Involvement in Vietnam",
    role: "President Lyndon B. Johnson (August 1964)",
    icon: "fa-solid fa-triangle-exclamation",
    crisis: "Reports indicate North Vietnamese torpedo boats have fired upon a US destroyer in the Gulf of Tonkin. You must decide how to respond.",
    phase1: {
      choiceA: {
        text: "Launch a limited, one-off retaliatory airstrike to show strength.",
        fallout: "The South Vietnamese military government continues to lose ground to the Vietcong anyway. The media labels you as 'soft on Communism'.",
        choice1: {
          text: "Send in ground troops to save the South without congressional approval.",
          verdict: "You enter a massive war illegally. The anti-war movement erupts immediately, and Congress moves to impeach you for violating the Constitution.",
          isHistorical: false
        },
        choice2: {
          text: "Withdraw completely from Vietnam and let the country fall.",
          verdict: "South Vietnam falls in 1965. The US faces global humiliation, but you save 58,000 American lives, allowing your 'Great Society' domestic reforms to succeed.",
          isHistorical: false
        }
      },
      choiceB: {
        text: "Demand the 'Gulf of Tonkin Resolution' from Congress for a blank cheque to wage war.",
        fallout: "Congress passes it, giving you complete war powers. You launch 'Operation Rolling Thunder', but the massive bombing fails to break Vietcong supply lines or morale.",
        choice1: {
          text: "Admit the bombing failed and seek immediate peace talks.",
          verdict: "North Vietnam refuses to negotiate while US aircraft are present. You look weak and are crushed in the 1968 election.",
          isHistorical: false
        },
        choice2: {
          text: "Escalate the conflict by drafting hundreds of thousands of ground troops.",
          verdict: "You commit over 500,000 troops. The war becomes a bloody quagmire based on 'Search and Destroy' tactics. The 1968 Tet Offensive shatters the American public's illusion of victory, destroying your presidency and forcing you not to run for re-election.",
          isHistorical: true
        }
      }
    }
  },
  {
    id: "game_4",
    title: "Peace with Honor?",
    series: "Presidential Hotline",
    topic: "Key Topic 4: Reactions and End of War",
    role: "President Richard Nixon (April 1970)",
    icon: "fa-solid fa-dove",
    crisis: "Your strategy of 'Vietnamisation' is failing because the Vietcong are resupplying via the Ho Chi Minh Trail through neutral Cambodia.",
    phase1: {
      choiceA: {
        text: "Secretly order the invasion and carpet-bombing of Cambodia.",
        fallout: "The secret campaign leaks to the press. Massive anti-war protests erupt. At Kent State University, the National Guard fires into a crowd of student protesters.",
        choice1: {
          text: "Double down and attack the protesters to appeal to your 'Silent Majority'.",
          verdict: "Four students are killed at Kent State. The nation violently divides. Two million students go on strike, shutting down 400 universities. Congress eventually passes the War Powers Act (1973) to permanently strip the President's ability to wage secret wars.",
          isHistorical: true
        },
        choice2: {
          text: "Publicly apologise and immediately halt the Cambodian bombing.",
          verdict: "You look incredibly weak to the North Vietnamese. They stall at the Paris Peace Accords, dragging the war out for three more bloody, unsuccessful years.",
          isHistorical: false
        }
      },
      choiceB: {
        text: "Refuse to expand the war and order an immediate, total withdrawal of troops.",
        fallout: "Saigon collapses to communist forces within months of your announcement. The United States loses its first foreign war.",
        choice1: {
          text: "Blame Congress for cutting military funding.",
          verdict: "A toxic political 'stab-in-the-back' myth dominates US politics for decades. Congress becomes permanently gridlocked and bitter.",
          isHistorical: false
        },
        choice2: {
          text: "Blame the anti-war movement for breaking military morale.",
          verdict: "Violent clashes erupt at home between returning veterans and anti-war activists. America turns completely isolationist and paranoid for a generation.",
          isHistorical: false
        }
      }
    }
  },
  {
    id: "game_5",
    title: "The Tactical Dilemma",
    series: "Perspectives & Tactics",
    topic: "Key Topic 3: US Involvement in Vietnam",
    role: "US Infantry Commander (1967, Cu Chi)",
    icon: "fa-solid fa-person-rifle",
    crisis: "Your platoon is searching for a weapons cache. You suspect a local village is hiding a tunnel entrance, but the peasants deny it.",
    phase1: {
      choiceA: {
        text: "Order a 'Zippo Raid' to burn the huts and force a confession.",
        fallout: "You uncover a cache, but completely alienate the survivors. A week later, local villagers guide the Vietcong to launch a devastating ambush on your patrol.",
        choice1: {
          text: "Call in Napalm air support directly on your own overrun position.",
          verdict: "'Broken Arrow.' You survive, but take horrific friendly fire casualties. Your surviving men despise you and attempt to assassinate you with a grenade ('fragging').",
          isHistorical: false
        },
        choice2: {
          text: "Try to fight your way out using standard M16 rifles.",
          verdict: "You are overrun by superior jungle guerrilla tactics. You and your men become grim statistics in the weekly body count report.",
          isHistorical: false
        }
      },
      choiceB: {
        text: "Conduct a restrained search and hand out medical supplies to win loyalty.",
        fallout: "The villagers are VC sympathisers. As soon as you let your guard down, they pull hidden AK-47s from spider holes and ambush you using the Cu Chi tunnel network.",
        choice1: {
          text: "Order your 'Tunnel Rats' into the dark, booby-trapped tunnels to hunt them.",
          verdict: "Soldiers armed only with pistols and flashlights engage in gruelling, terrifying hand-to-hand combat in pitch-black, booby-trapped tunnels. You clear the sector, but the psychological toll on your men is devastating.",
          isHistorical: true
        },
        choice2: {
          text: "Pump tear gas down the tunnel holes and retreat.",
          verdict: "You save your men today, but the VC clear the gas and reoccupy the tunnels tomorrow. The entire mission was a pointless circle.",
          isHistorical: false
        }
      }
    }
  },
  {
    id: "game_6",
    title: "The Shadow War",
    series: "Perspectives & Tactics",
    topic: "Key Topic 3: US Involvement in Vietnam",
    role: "Vietcong Regional Commander (November 1965, Ia Drang)",
    icon: "fa-solid fa-users-viewfinder",
    crisis: "The Americans have deployed Air Cavalry (helicopters) and possess overwhelming artillery and air support in the Ia Drang Valley.",
    phase1: {
      choiceA: {
        text: "Meet the Americans head-on in a large, conventional pitched battle.",
        fallout: "A catastrophic defeat. B-52 bombers and artillery obliterate your forces in the open, showing conventional tactics are suicidal.",
        choice1: {
          text: "Surrender the Ia Drang region to the Americans.",
          verdict: "The Ho Chi Minh trail in your sector is permanently severed. The communist rebellion in the South collapses within a year.",
          isHistorical: false
        },
        choice2: {
          text: "Force local villagers into your depleted ranks under threat of death.",
          verdict: "The terrified locals turn on you and give your coordinates to the CIA. You are wiped out in a targeted US airstrike.",
          isHistorical: false
        }
      },
      choiceB: {
        text: "Retreat into the dense jungle and fight on your own terms.",
        fallout: "The Americans begin slow search-and-destroy patrols in the jungle, searching for your bases.",
        choice1: {
          text: "Rely purely on passive booby traps (Punji sticks).",
          verdict: "You inflict steady casualties, but US morale holds just enough to keep hunting you with overwhelming firepower.",
          isHistorical: false
        },
        choice2: {
          text: "Order your men to 'hang onto American belts' (extreme close-quarters combat).",
          verdict: "A brutal, bloody stalemate. By staying within 50 yards of the enemy during ambushes, you neutralize their air and artillery support (fear of friendly fire). You wage a successful war of attrition that eventually outlasts the political will of the American public.",
          isHistorical: true
        }
      }
    }
  },
  {
    id: "game_7",
    title: "The Living Room War",
    series: "Perspectives & Tactics",
    topic: "Key Topic 4: Reactions and End of War",
    role: "TV News Editor (Late 1969, CBS News)",
    icon: "fa-solid fa-newspaper",
    crisis: "You receive photos proving a US platoon murdered 347 unarmed civilians at My Lai, which the military is covering up as a glorious victory.",
    phase1: {
      choiceA: {
        text: "Bury the story to protect home-front morale while troops are deployed.",
        fallout: "Independent journalist Seymour Hersh breaks the story anyway. Your network is publicly accused of a government cover-up.",
        choice1: {
          text: "Resign in disgrace.",
          verdict: "You become a forgotten footnote. Journalism is revolutionized by underground, anti-establishment papers instead of mainstream TV.",
          isHistorical: false
        },
        choice2: {
          text: "Pivot to aggressively attacking the Nixon administration to win back credibility.",
          verdict: "A bitter media war. You eventually help uncover the Watergate scandal to save your reputation, but the American public permanently loses trust in TV news.",
          isHistorical: false
        }
      },
      choiceB: {
        text: "Broadcast the graphic photographs and expose the cover-up on national television.",
        fallout: "The My Lai images air, sparking massive protests. However, the Nixon administration attacks your press network as unpatriotic.",
        choice1: {
          text: "Dig deeper and send reporters to find more military scandals.",
          verdict: "The 'Credibility Gap' becomes a chasm. The press exposes the 'Pentagon Papers', proving the government had been lying about the war's progress for years. The US military loses all moral high ground, and support for the war collapses entirely.",
          isHistorical: true
        },
        choice2: {
          text: "Back off critical coverage to avoid losing your broadcasting license.",
          verdict: "The Nixon administration successfully intimidates the network. Critical coverage of the war drops, extending the conflict for two more years.",
          isHistorical: false
        }
      }
    }
  },
  {
    id: "game_8",
    title: "The Chemical Escalation",
    series: "Perspectives & Tactics",
    topic: "Key Topic 3: US Involvement in Vietnam",
    role: "Secretary of Defense (1965)",
    icon: "fa-solid fa-flask",
    crisis: "Pilots cannot locate Vietcong bases through the thick, triple-canopy jungle of South Vietnam. Generals demand chemical defoliants.",
    phase1: {
      choiceA: {
        text: "Authorise widespread use of Agent Orange and Napalm to strip the canopy bare.",
        fallout: "The jungle canopy is stripped, but chemical spray causes horrific civilian burns and destroys crop fields.",
        choice1: {
          text: "Try to censor the media from showing images of civilian chemical burns.",
          verdict: "The photos are smuggled out anyway. The UN condemns the US for chemical warfare, and the domestic anti-war movement turns violent much earlier.",
          isHistorical: false
        },
        choice2: {
          text: "Publicly claim the chemicals are completely harmless to humans.",
          verdict: "You win the immediate PR battle, and the military uses 82 million litres of Agent Orange. However, the legacy is catastrophic: crops are destroyed causing famine, and decades later, thousands of Vietnamese civilians and US veterans develop severe cancers and birth defects, leaving a dark permanent stain on the war effort.",
          isHistorical: true
        }
      },
      choiceB: {
        text: "Refuse chemicals. Institute a massive draft to send young men to fight on the ground.",
        fallout: "US body counts skyrocket against superior guerrilla tactics. The expanded draft sparks widespread card-burnings and protests.",
        choice1: {
          text: "Lower military intelligence standards to draft more men (Project 100,000).",
          verdict: "You draft men entirely unfit for combat. Casualties soar, unit discipline collapses completely, and drug use in the military skyrockets.",
          isHistorical: false
        },
        choice2: {
          text: "Institute a 'Draft Lottery' to make the draft selection random.",
          verdict: "The draft feels fairer, but middle-class college kids are no longer safe. University protests explode in size, bringing America to a standstill.",
          isHistorical: false
        }
      }
    }
  }
];
