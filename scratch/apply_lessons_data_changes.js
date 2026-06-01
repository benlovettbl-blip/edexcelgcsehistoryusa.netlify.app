const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'lessons_data.js');

// Import existing data (since Node 22+ supports ESM sync require)
const { LESSONS_DATA } = require(filePath);

// Define visual mappings for Scholarly Perspective (1 per lesson)
const SCHOLARLY_IMGS = {
  "subtopic_1_1": "assets/sources/warren-court-1954.jpg",
  "subtopic_1_2": "assets/sources/eisenhower-little-rock-speech.jpg",
  "subtopic_1_3": "assets/sources/wpc-boycott-leaflet.jpg",
  "subtopic_1_4": "assets/sources/southern-manifesto-signing.jpg",
  "subtopic_2_1": "assets/sources/freedom-riders-bus-wreckage.jpg",
  "subtopic_2_2": "assets/sources/selma-troopers-bridge.jpg",
  "subtopic_2_3": "assets/sources/malcolm-x-speaking.jpg",
  "subtopic_2_4": "assets/sources/poor-peoples-campaign-1968.jpg",
  "subtopic_3_1": "assets/sources/diem-eisenhower-meeting.jpg",
  "subtopic_3_2": "assets/sources/robert-mcnamara-briefing.jpg",
  "subtopic_3_3": "assets/sources/huey-helicopter-vietnam.jpg",
  "subtopic_3_4": "assets/sources/arvn-troops-combat.jpg",
  "subtopic_4_1": "assets/sources/vietnam-draft-lottery.jpg",
  "subtopic_4_2": "assets/sources/nixon-television-address.jpg",
  "subtopic_4_3": "assets/sources/kissinger-peace-talks.jpg",
  "subtopic_4_4": "assets/sources/general-westmoreland.jpg"
};

// Define "How Useful" question data
const HOW_USEFUL_DATA = {
  "subtopic_1_1": {
    question: "How useful are Sources D and E for an enquiry into the segregation of public facilities and the response of activists in the Southern states in the 1950s? (8 marks)",
    sourceD: {
      provenance: "A photograph of Rosa Parks being fingerprinted by police officer Alsop after her arrest during the Montgomery Bus Boycott, 22 February 1956.",
      content: "[A photograph showing civil rights activist Rosa Parks standing calm and dignified as a police officer in uniform applies ink to her fingers to take her fingerprints.]",
      image: "assets/sources/rosa-parks-fingerprint.jpg",
      caption: "Rosa Parks being fingerprinted in Montgomery, Alabama, after defying segregation laws."
    },
    sourceE: {
      provenance: "A photograph of a segregation sign over a terminal entrance, taken in the Southern United States in the early 1950s.",
      content: "[A photograph of a wooden sign reading 'COLORED WAITING ROOM' hanging above an entranceway of a public bus terminal.]",
      image: "assets/sources/colored-waiting-room-sign.jpg",
      caption: "A typical segregation sign directing Black passengers to separate facilities at a Southern bus station."
    },
    modelAnswer: "Source D is highly useful for showing the direct state persecution and criminalization of peaceful civil rights activists. It shows Rosa Parks being fingerprinted by a police officer, illustrating how local laws were used to prosecute boycott leaders. This is supported by my knowledge that MLK and other MIA leaders were also arrested under anti-conspiracy laws. Source E is highly useful for showing the daily reality of Jim Crow segregation that activists were boycotting. It illustrates that segregation was not just a social custom but was officially built into public infrastructure. Together, the sources are extremely useful: Source E shows the systemic injustice, and Source D shows the direct grassroots defiance of that injustice, capturing both the cause and the action of the movement."
  },
  "subtopic_1_2": {
    question: "How useful are Sources D and E for an enquiry into the levels of opposition to integration at Little Rock Central High School in 1957? (8 marks)",
    sourceD: {
      provenance: "From a photograph of white protestors gathered outside Central High School in September 1957.",
      content: "[A photograph showing an angry white crowd of students and adults protesting. Some are holding signs reading 'Keep Central High Clean' and yelling as Black students arrive.]",
      image: "assets/sources/little-rock-protest-1957.jpg",
      caption: "Segregationist demonstrators protesting against school integration in Little Rock."
    },
    sourceE: {
      provenance: "From a photograph showing soldiers of the 101st Airborne Division patrolling Central High School in late September 1957.",
      content: "[A photograph of armed federal troops standing in single file outside Central High School, holding bayonets. A military jeep is parked nearby, and no civilians are allowed near the entrance.]",
      image: "assets/sources/airborne-little-rock-patrol.jpg",
      caption: "Members of the 101st Airborne Division standing guard outside Central High School."
    },
    modelAnswer: "Source D is highly useful for showing the intense social opposition and public hostility towards integration among the white population. The angry expressions and segregationist signs illustrate that resistance was grassroots and highly aggressive. This aligns with my knowledge that the Little Rock Nine faced severe harassment from white mobs. Source E is highly useful for showing the scale of the state and military conflict required to override this opposition. It shows that desegregation could not be achieved by court orders alone and required armed federal intervention. This is useful because it highlights that the threat of violence was so high that military occupation of a Southern school was the only way to enforce constitutional rights."
  },
  "subtopic_1_3": {
    question: "How useful are Sources D and E for an enquiry into the organization and logistical planning of the Montgomery Bus Boycott? (8 marks)",
    sourceD: {
      provenance: "A photograph of Martin Luther King Jr. addressing boycotters in a crowded church during the Montgomery Bus Boycott, late 1955.",
      content: "[A photograph showing Martin Luther King Jr. speaking passionately from a pulpit. The church is completely packed with Black citizens sitting and standing, listening intently with expressions of unity.]",
      image: "assets/sources/mlk-boycott-speech-1955.jpg",
      caption: "Dr. King speaking at a church rally to coordinate boycott plans and maintain community morale."
    },
    sourceE: {
      provenance: "From a photograph showing a boycott carpool station in Montgomery, Alabama, early 1956.",
      content: "[A photograph showing several private station wagons lined up at a curb. Black passengers are orderly boarding a vehicle, while an organizer holding a clipboard coordinates destinations.]",
      image: "assets/sources/carpool-station-1956.jpg",
      caption: "A coordinated MIA carpool pickup station, which bypassed city bus transit."
    },
    modelAnswer: "Source D is highly useful for showing the moral and spiritual leadership that sustained the boycott. It reveals that the boycott relied heavily on local Black churches as meeting points to coordinate strategy and maintain non-violent discipline. This is supported by my knowledge that the MIA held regular mass meetings to keep the community united. Source E is highly useful for showing the logistical sophistication of the boycott. The carpool station and coordinator reveal that the MIA did not just ask people to walk; they organized a parallel transit system with over 300 private vehicles and 40 pickup stations. Together, the sources show that the boycott succeeded through a combination of inspirational leadership (Source D) and practical logistics (Source E)."
  },
  "subtopic_1_4": {
    question: "How useful are Sources D and E for an enquiry into the methods used by Southern white opposition to resist civil rights in the 1950s? (8 marks)",
    sourceD: {
      provenance: "A photograph of a billboard erected by a local White Citizens' Council in Alabama, 1956.",
      content: "[A photograph showing a large highway billboard that reads: 'Help segregation! Support the White Citizens Council. Don't buy Black-owned businesses. Keep Alabama clean.']",
      image: "assets/sources/white-citizens-council-billboard.jpg",
      caption: "A Citizens' Council billboard advocating economic boycotts against civil rights supporters."
    },
    sourceE: {
      provenance: "A photograph of a Ku Klux Klan parade marching through a Southern town, taken in 1957.",
      content: "[A photograph showing dozens of Klansmen in white robes and pointed hoods marching down a main street. Crowds of onlookers are lined up, and local police officers are standing by without intervening.]",
      image: "assets/sources/kkk-march-washington-1926.jpg",
      caption: "A KKK march demonstrating the public, unchecked presence of white supremacist groups in the South."
    },
    modelAnswer: "Source D is highly useful for showing the economic and organized methods used by 'respectable' segregationists to resist civil rights. The billboard proves that White Citizens' Councils used economic boycotts and public propaganda to maintain white supremacy. This aligns with my knowledge that they foreclosed mortgages and fired Black activists. Source E is highly useful for showing the violent and physical intimidation used by the KKK to enforce segregation. The fact that they march openly in daylight with police looking on reveals that local authorities tolerated or colluded with white supremacist terror. Together, the sources show that opposition worked on two levels: legal/economic pressure by civic groups (Source D) and physical terror by vigilante groups (Source E)."
  },
  "subtopic_2_1": {
    question: "How useful are Sources D and E for an enquiry into the tactics of direct action and the response of Southern white opposition? (8 marks)",
    sourceD: {
      provenance: "From a photograph showing student activists staging a sit-in at a Woolworth's lunch counter in Greensboro, North Carolina, February 1960.",
      content: "[A photograph showing four Black college students sitting quietly on stools at a lunch counter. A white waitress stands behind the counter refusing to serve them, while white teenagers stand behind the students, making faces and pouring sugar on them.]",
      image: "assets/sources/greensboro-sit-in-counter.jpg",
      caption: "Student activists enduring harassment during the Greensboro Woolworth's lunch counter sit-in."
    },
    sourceE: {
      provenance: "From a photograph showing James Meredith walking to class at the University of Mississippi, October 1962.",
      content: "[A photograph of James Meredith walking down a university path. He is flanked by several tall, serious US Marshals wearing helmets and armbands. In the background, soldiers are visible guarding the building.]",
      image: "assets/sources/james-meredith-walking.jpg",
      caption: "James Meredith under heavy armed escort during the integration of 'Ole Miss'."
    },
    modelAnswer: "Source D is highly useful for showing the non-violent direct action tactics used by student activists to challenge segregation in retail spaces. It illustrates their strategy of peaceful defiance (sitting quietly) in the face of physical harassment, which was designed to expose segregationist bigotry. Source E is highly useful for showing the extreme level of state resistance to university integration. The presence of armed US Marshals proves that Meredith's admission required federal military force to override Governor Ross Barnett's defiance. This aligns with my knowledge that a massive riot broke out at Ole Miss, killing two people. Together, the sources prove that direct action successfully provoked crises that forced the federal government to actively protect Black rights."
  },
  "subtopic_2_2": {
    question: "How useful are Sources D and E for an enquiry into the impact of non-violent campaigns on federal civil rights legislation in the 1960s? (8 marks)",
    sourceD: {
      provenance: "From a photograph of Martin Luther King Jr. addressing the March on Washington from the Lincoln Memorial, 28 August 1963.",
      content: "[A photograph taken from behind Dr. King, showing him looking out over a massive crowd of over 250,000 demonstrators surrounding the reflecting pool in Washington D.C. Large banners and US flags are visible.]",
      image: "assets/sources/mlk-dream-speech-1963.jpg",
      caption: "Dr. King speaking to the massive crowd at the Lincoln Memorial during the March on Washington."
    },
    sourceE: {
      provenance: "From a photograph showing President Johnson signing the Voting Rights Act into law, 6 August 1965.",
      content: "[A photograph showing President Lyndon B. Johnson sitting at a desk, handing a commemorative pen to Martin Luther King Jr. and other civil rights leaders who are gathered around him smiling.]",
      image: "assets/sources/lbj-signing-voting-rights-1965.jpg",
      caption: "President Johnson presenting a pen to Martin Luther King Jr. at the signing of the Voting Rights Act."
    },
    modelAnswer: "Source D is highly useful for showing the scale and multi-racial unity of the 1963 March on Washington. The massive crowd shows the movement's power to mobilize public opinion, which was crucial in putting pressure on Congress to pass civil rights laws. Source E is highly useful for showing the political outcome of this mobilization. The photograph of LBJ presenting MLK with the signing pen illustrates the legislative alliance between the federal presidency and civil rights leaders. This aligns with my knowledge that public pressure from Birmingham and Selma forced Johnson to champion the 1964 Civil Rights Act and the 1965 Voting Rights Act. Together, the sources show the transition from mass grassroots protest (Source D) to federal legislative success (Source E)."
  },
  "subtopic_2_3": {
    question: "How useful are Sources D and E for an enquiry into the shift from non-violence to Black nationalism and self-defense in the mid-1960s? (8 marks)",
    sourceD: {
      provenance: "A photograph of Malcolm X holding a newspaper showing a headline about self-defense, 1964.",
      content: "[A photograph of Malcolm X pointing to a newspaper headline that reads: 'Blacks Must Defend Themselves Against Klan Terror!'. He has a serious expression, emphasizing self-reliance.]",
      image: "assets/sources/malcolm-x-newspaper.jpg",
      caption: "Malcolm X advocating self-defense and Black nationalism to challenge white supremacist violence."
    },
    sourceE: {
      provenance: "From a photograph showing members of the Black Panther Party marching in uniform, Oakland, California, 1968.",
      content: "[A photograph showing a column of Black Panther members wearing black leather jackets, black berets, and sunglasses marching in formation. They are holding banners demanding community control and self-defense.]",
      image: "assets/sources/black-panthers-marching.jpg",
      caption: "The Black Panthers marching in Oakland, symbolizing disciplined militancy and Black Power."
    },
    modelAnswer: "Source D is highly useful for understanding the intellectual shift away from MLK's non-violence. Malcolm X's emphasis on self-defense against Klan terror shows that activists in Northern ghettos felt non-violence left them defenseless against white violence. Source E is highly useful for showing how these ideas were institutionalized by student groups in the late 1960s. The Black Panthers' uniforms and marching formation illustrate a shift toward Black pride, militancy, and community self-reliance. This is supported by my knowledge that the Panthers reject integration, focusing instead on armed patrols to monitor police brutality and run social programs. Together, the sources show how frustration with non-violence led to an ideology of self-determination."
  },
  "subtopic_2_4": {
    question: "How useful are Sources D and E for an enquiry into the causes and consequences of urban unrest in the late 1960s? (8 marks)",
    sourceD: {
      provenance: "A photograph showing National Guard troops patrolling a street during the Detroit Riot, July 1967.",
      content: "[A photograph showing armed National Guardsmen standing in front of burning storefronts. Thick smoke fills the sky, and military armored personnel carriers are parked on the street.]",
      image: "assets/sources/detroit-riot-guard-1967.jpg",
      caption: "National Guard troops deployed to restore order during the 1967 Detroit urban rebellion."
    },
    sourceE: {
      provenance: "From a photograph showing mourners and protesters in Washington D.C. after the assassination of Martin Luther King Jr., April 1968.",
      content: "[A photograph of a large crowd of Black citizens marching down a street in Washington D.C. carrying signs that read 'Honor King: End Racism Now'. Some buildings in the background are smoldering from recent fires.]",
      image: "assets/sources/mourners-mlk-assassination.jpg",
      caption: "Protesters and mourners in Washington D.C. expressing grief and anger following MLK's assassination."
    },
    modelAnswer: "Source D is highly useful for showing the level of violence and destruction during the Detroit Riot of 1967. The burning stores and military deployment prove that urban frustration had escalated into armed rebellion, requiring state troops to suppress it. This is useful because it confirms the Kerner Commission's finding that ghettos were destructive environments. Source E is highly useful for showing the immediate political consequence of MLK's death. The signs showing 'Honor King: End Racism Now' combined with burning buildings show that his murder triggered both grief-stricken protest and violent uprisings in over 100 cities, marking the end of the non-violent civil rights era. Together, the sources show how economic frustration (Source D) and political trauma (Source E) caused urban instability."
  },
  "subtopic_3_1": {
    question: "How useful are Sources D and E for an enquiry into the unpopularity and collapse of Ngo Dinh Diem's regime in South Vietnam? (8 marks)",
    sourceD: {
      provenance: "A photograph showing President Ngo Dinh Diem reviewing a military parade in Saigon, October 1957.",
      content: "[A photograph of Diem standing in an open-top car, reviewing rows of South Vietnamese soldiers who are carrying US-supplied weapons. US advisers are standing nearby in civilian clothes.]",
      image: "assets/sources/ngo-dinh-diem-parade.jpg",
      caption: "President Diem reviewing troops in Saigon, showing his reliance on military power and US assistance."
    },
    sourceE: {
      provenance: "A photograph of Buddhist demonstrations in Saigon against President Diem's government, June 1963.",
      content: "[A photograph showing a massive crowd of Buddhist monks and nuns sitting in a street, holding banners reading 'Stop Religious Persecution!' and blocking traffic. Police are surrounding the crowd.]",
      image: "assets/sources/buddhist-protests-1963.jpg",
      caption: "Buddhist monks protesting in Saigon during the 1963 Buddhist Crisis."
    },
    modelAnswer: "Source D is highly useful for showing Diem's dependence on military forces and US weapons to maintain power. The military parade shows how his regime projected authority, hiding its lack of genuine peasant support. Source E is highly useful for showing the internal religious opposition that eventually collapsed his regime. The Buddhist protests reveal how Diem's pro-Catholic policies alienated the 80% Buddhist majority, creating a political crisis. This is supported by my knowledge that the Buddhist Crisis led to international outrage, particularly after televised self-immolations, forcing the US to support a coup to overthrow Diem in November 1963. Together, the sources show a regime relying on military force (Source D) but undermined by internal instability (Source E)."
  },
  "subtopic_3_2": {
    question: "How useful are Sources D and E for an enquiry into the escalation of US involvement and the deployment of combat troops to Vietnam? (8 marks)",
    sourceD: {
      provenance: "From a photograph of the destroyer USS Maddox sailing in the Gulf of Tonkin, August 1964.",
      content: "[A photograph showing the US warship USS Maddox traveling through calm seas. Radar antennas are rotating, and gun turrets are aimed toward the horizon.]",
      image: "assets/sources/uss-maddox.jpg",
      caption: "The USS Maddox, the vessel involved in the Gulf of Tonkin incidents in August 1964."
    },
    sourceE: {
      provenance: "From a photograph of US Marines landing at Da Nang beach, South Vietnam, 8 March 1965.",
      content: "[A photograph of US Marines carrying heavy backpacks and rifles wading through shallow water onto a sandy beach. Local Vietnamese women are handing them flower garlands as they land.]",
      image: "assets/sources/marines-landing-danang.jpg",
      caption: "The first official US ground combat troops landing at Da Nang, March 1965."
    },
    modelAnswer: "Source D is highly useful for documenting the naval presence that triggered the Gulf of Tonkin Incident. The USS Maddox is the central vessel in the reported clashes, which gave President Johnson the political leverage to secure the Gulf of Tonkin Resolution. Source E is highly useful for showing the transition to full combat operations. The landing of the 9th Marine Expeditionary Brigade at Da Nang beach represents the first official deployment of US ground combat units, shifting the US role from advisory to active combat. This is supported by my knowledge that by the end of 1965, US troop levels rose to 184,000. Together, the sources capture the pretext for war (Source D) and the actual launch of the ground war (Source E)."
  },
  "subtopic_3_3": {
    question: "How useful are Sources D and E for an enquiry into the tactics used by the US military in the Vietnam War? (8 marks)",
    sourceD: {
      provenance: "From a photograph showing a US soldier patrolling on foot in a swampy jungle, 1967.",
      content: "[A photograph of a US soldier wading waist-deep through muddy swamp water in dense jungle. He is holding his M16 rifle high above the water and looks tense and exhausted.]",
      image: "assets/sources/us-soldier-patrolling-swamp.jpg",
      caption: "A US soldier patrolling in difficult terrain during a Search and Destroy mission."
    },
    sourceE: {
      provenance: "From a photograph showing US Air Force C-123 planes spraying defoliants over a forest, 1966.",
      content: "[A photograph showing three C-123 military transport planes flying in formation at low altitude, releasing thick white chemical trails of Agent Orange over dense green forest canopy.]",
      image: "assets/sources/agent-orange-spraying-c123.jpg",
      caption: "US C-123 aircraft spraying Agent Orange to strip jungle cover and destroy enemy crops."
    },
    modelAnswer: "Source D is highly useful for showing the physical difficulty and vulnerability of US search-and-destroy patrols. Wading through waist-deep swamps shows how the terrain favored Vietcong guerrilla ambush and booby traps. Source E is highly useful for showing the chemical warfare tactics used to counter these environmental challenges. The spraying of Agent Orange shows how the US attempted to strip jungle cover and starve the Vietcong by destroying crops. This is supported by my knowledge that Operation Ranch Hand sprayed millions of gallons of herbicides, which alienated local peasants and caused severe health issues. Together, the sources highlight the physical challenges of jungle patrol (Source D) and the destructive chemical response (Source E)."
  },
  "subtopic_3_4": {
    question: "How useful are Sources D and E for an enquiry into the effectiveness of Nixon's policy of Vietnamization? (8 marks)",
    sourceD: {
      provenance: "From a photograph of President Richard Nixon visiting US troops in South Vietnam, July 1969.",
      content: "[A photograph showing President Nixon standing in a crowd of smiling US soldiers in combat uniforms. He is shaking hands and talking with them, projecting a positive image of troop support.]",
      image: "assets/sources/nixon-visiting-troops.jpg",
      caption: "President Nixon visiting troops in Vietnam shortly after announcing the Vietnamization policy."
    },
    sourceE: {
      provenance: "A photograph showing South Vietnamese ARVN troops advancing during the invasion of Cambodia, May 1970.",
      content: "[A photograph showing several ARVN soldiers running past a burning tank on a dirt road in Cambodia. Helicopters are flying overhead, and the soldiers are carrying M16 rifles.]",
      image: "assets/sources/arvn-cambodia-invasion.jpg",
      caption: "ARVN forces invading Cambodia, demonstrating the expansion of combat operations."
    },
    modelAnswer: "Source D is highly useful for showing the public relations aspect of Vietnamization. Nixon's visit to the troops project a positive image of withdrawing US forces with honor, justifying his plans to de-escalate US involvement. Source E is highly useful for showing that Vietnamization actually expanded the war geographically. The ARVN invasion of Cambodia in 1970 shows that South Vietnamese forces, backed by US air support, were used to attack communist sanctuaries. This is useful because it reveals the contradiction in Nixon's policy: while withdrawing troops (Source D), he expanded the combat theater (Source E), which triggered massive anti-war protests at Kent State. Together, the sources capture the public de-escalation alongside military expansion."
  },
  "subtopic_4_1": {
    question: "How useful are Sources D and E for an enquiry into the anti-war movement and the response of the government? (8 marks)",
    sourceD: {
      provenance: "From a photograph showing anti-war demonstrators marching near the Pentagon in Washington D.C., October 1967.",
      content: "[A photograph showing a massive line of young demonstrators carrying peace signs, flower symbols, and banners reading 'Draft Beer, Not Boys' facing a wall of military police officers standing guard.]",
      image: "assets/sources/antiwar-pentagon-protest-1967.jpg",
      caption: "Anti-war demonstrators facing military police outside the Pentagon during a 1967 march."
    },
    sourceE: {
      provenance: "From a photograph showing student demonstrators facing the National Guard at Kent State University, May 1970.",
      content: "[A photograph showing a crowd of college students gathered on a campus lawn. In the distance, a line of National Guard soldiers in gas masks and helmets is aimed toward them, holding rifles.]",
      image: "assets/sources/kent-state-protests-1970.jpg",
      caption: "Kent State University students protesting shortly before National Guardsmen opened fire."
    },
    modelAnswer: "Source D is highly useful for showing the youthful and confrontational nature of the anti-war movement. The signs reading 'Draft Beer, Not Boys' show how the draft system was a primary target of student protest. Source E is highly useful for showing the extreme violence used by the state to suppress campus protests. The image of National Guardsmen aiming rifles at unarmed students illustrates how the political crisis over the invasion of Cambodia turned lethal. This is supported by my knowledge that the subsequent shooting of four students at Kent State triggered a strike of 4 million students nationwide. Together, the sources show how peaceful protest (Source D) led to deadly state reaction (Source E) on the home front."
  },
  "subtopic_4_2": {
    question: "How useful are Sources D and E for an enquiry into the views of the 'Silent Majority' and support for the Vietnam War? (8 marks)",
    sourceD: {
      provenance: "From a photograph of pro-war demonstrators at a rally in support of US troops, New York City, 1970.",
      content: "[A photograph of citizens holding large US flags and signs reading 'Support Our President', 'Silent Majority Speaks', and 'Victory Over Communism in Vietnam'. They look patriotic and orderly.]",
      image: "assets/sources/pro-war-rally-nyc.jpg",
      caption: "Pro-war demonstrators marching to express support for Nixon's Vietnam policies."
    },
    sourceE: {
      provenance: "A photograph showing construction workers marching during the Hard Hat Riots in New York City, May 1970.",
      content: "[A photograph showing thousands of construction workers wearing hard hats marching down a street. They are carrying American flags and banners reading 'USA All the Way' and cheering.]",
      image: "assets/sources/hard-hat-riot-1970.jpg",
      caption: "Construction workers marching in support of the government during the Hard Hat Riots."
    },
    modelAnswer: "Source D is highly useful for proving that there was significant, organized public support for Nixon's policies. The signs referring to the 'Silent Majority' show how pro-war citizens adopted his rhetoric to counter the anti-war movement. Source E is highly useful for showing the working-class basis of this pro-war support. The Hard Hat Riots show that union laborers actively opposed student anti-war protestors, whom they viewed as unpatriotic. This is supported by my knowledge that construction workers attacked student demonstrators in Wall Street, revealing deep class divisions on the home front. Together, the sources show that the pro-war movement relied on patriotism (Source D) and class resentment (Source E)."
  },
  "subtopic_4_3": {
    question: "How useful are Sources D and E for an enquiry into the peace process and the final withdrawal of the US from Vietnam? (8 marks)",
    sourceD: {
      provenance: "From a photograph showing the signing of the Paris Peace Accords, 27 January 1973.",
      content: "[A photograph showing foreign ministers and diplomats sitting around a massive circular table in a grand room in Paris. Several cameras are flashing as they sign the official treaty documents.]",
      image: "assets/sources/paris-peace-accords-signing.jpg",
      caption: "The formal signing ceremony of the Paris Peace Accords in Paris, France."
    },
    sourceE: {
      provenance: "A photograph showing the evacuation of the US embassy in Saigon, 29 April 1975.",
      content: "[A photograph showing a long line of people climbing a ladder onto the roof of a building adjacent to the US embassy to board a CIA Huey helicopter. Thick smoke rises in the distance.]",
      image: "assets/sources/saigon-embassy-evacuation.jpg",
      caption: "Evacuation of American personnel and South Vietnamese refugees from Saigon."
    },
    modelAnswer: "Source D is highly useful for showing the formal, diplomatic conclusion of US military involvement in Vietnam. The signing of the Paris Peace Accords shows how the Nixon administration secured the withdrawal of troops and return of POWs. Source E is highly useful for showing the chaotic, real-world failure of that peace treaty. The evacuation of the embassy in Saigon in 1975 proves that the ARVN could not stand alone without US support, leading to a total communist victory. This is supported by my knowledge that the Accords were a 'decent interval' strategy, allowing the US to pull out before South Vietnam collapsed. Together, the sources show the contrast between formal peace agreements (Source D) and the reality of defeat (Source E)."
  },
  "subtopic_4_4": {
    question: "How useful are Sources D and E for an enquiry into the military and political reasons for the US failure in Vietnam? (8 marks)",
    sourceD: {
      provenance: "From a photograph showing US soldiers walking through a swampy jungle patrol in Vietnam, 1968.",
      content: "[A photograph showing several soldiers wading through thick mud and reeds in a swamp. They are looking around warily, showing signs of exhaustion and carrying heavy equipment.]",
      image: "assets/sources/us-troops-bogged-down.jpg",
      caption: "US troops navigating difficult swampy terrain during a combat patrol."
    },
    sourceE: {
      provenance: "From a photograph showing members of the Vietnam Veterans Against the War (VVAW) protesting in Washington D.C., 1971.",
      content: "[A photograph showing disabled and combat veterans in uniform throwing their military medals and ribbons over a wire fence in front of the US Capitol building in protest.]",
      image: "assets/sources/vvaw-veterans-protest.jpg",
      caption: "Vietnam veterans protesting against the war by throwing away their combat medals."
    },
    modelAnswer: "Source D is highly useful for showing the tactical and military challenges that caused US failure. The difficult swamp terrain shows how US heavy armor and conventional firepower were neutralized by the environment, which favored Vietcong guerrilla tactics. Source E is highly useful for showing the political and moral collapse of the war effort at home. The protest by Vietnam Veterans throwing away their medals shows that even those who fought had lost faith in the war's justification. This is supported by my knowledge that veterans' protests severely undermined the government's credibility. Together, the sources illustrate how military challenges in the field (Source D) combined with a collapse of morale at home (Source E) to make victory impossible."
  }
};

// Define "Deep Thinking" questions data (2 per lesson)
const DEEP_THINKING_DATA = {
  "subtopic_1_1": [
    {
      id: "dt_1_1_1",
      question: "Why was the legal unanimity of the 9-0 Supreme Court decision in Brown v. Board so important politically?",
      hint: "Think about Southern resistance and potential loopholes.",
      teacherGuide: "Unanimity (9-0) was crucial because it prevented Southern segregationists from claiming the court was divided or exploiting dissenting opinions as legal loopholes. It sent an unequivocal moral and constitutional message of federal authority."
    },
    {
      id: "dt_1_1_2",
      question: "How did the Montgomery Bus Boycott demonstrate the effectiveness of economic pressure as a non-violent protest tactic?",
      hint: "Think about the percentage of riders who boycotted and bus company revenues.",
      teacherGuide: "Since Black passengers made up over 70% of transit riders, their unified boycott directly threatened the bus company with bankruptcy. This proved that moral arguments were most effective when combined with severe financial leverage."
    }
  ],
  "subtopic_1_2": [
    {
      id: "dt_1_2_1",
      question: "Why did Governor Faubus choose to defy federal law at Little Rock, and what does this show about Southern state politics?",
      hint: "Think about white voter support and upcoming elections.",
      teacherGuide: "Faubus needed segregationist votes for re-election. It shows that state governors were willing to trigger constitutional crises and defy federal authority for local political survival."
    },
    {
      id: "dt_1_2_2",
      question: "How did the deployment of the 101st Airborne shift the balance of power between state and federal authorities?",
      hint: "Think about executive power and the enforcement of the US Constitution.",
      teacherGuide: "It was the first time since Reconstruction that federal forces intervened to protect Black rights. It asserted federal supremacy over state defiance, proving the executive branch would enforce desegregation by military force if necessary."
    }
  ],
  "subtopic_1_3": [
    {
      id: "dt_1_3_1",
      question: "Why did the MIA select the young, relatively new minister Martin Luther King Jr. to lead the boycott instead of established local figures?",
      hint: "Consider local rivalries and oratorical skills.",
      teacherGuide: "King was new to Montgomery, unaligned with local factional rivalries, highly educated, and possessed extraordinary oratorical skills that could frame the protest as a moral, Christian, and patriotic duty."
    },
    {
      id: "dt_1_3_2",
      question: "In what ways did the carpool system demonstrate the deep solidarity and community coordination of Montgomery's Black residents?",
      hint: "Think about the logistics of private cars and funding.",
      teacherGuide: "It required over 100 private vehicles, coordinated schedules, raised funds for gas, and bypassed white taxi regulations to keep 15,000 citizens commuting daily, showing that the community could operate independently of municipal services."
    }
  ],
  "subtopic_1_4": [
    {
      id: "dt_1_4_1",
      question: "How did 'respectable' economic retaliation by Citizens' Councils reinforce violent terror by the KKK?",
      hint: "Think about how they worked in tandem to suppress activism.",
      teacherGuide: "Economic boycotts and job terminations quietly ruined activists' livelihoods, while KKK violence physically intimidated them, working in tandem to crush resistance by making civil rights activism economically and physically fatal."
    },
    {
      id: "dt_1_4_2",
      question: "What was the core constitutional argument in the 'Southern Manifesto', and how did it attempt to justify segregation?",
      hint: "Think about the Tenth Amendment and state sovereignty.",
      teacherGuide: "It claimed the Supreme Court overstepped its judicial bounds (encroaching on state rights) and argued that education was not mentioned in the Constitution, meaning school policy should remain a sovereign state decision under the Tenth Amendment."
    }
  ],
  "subtopic_2_1": [
    {
      id: "dt_2_1_1",
      question: "Why were student-led sit-ins so effective in exposing the social absurdity and commercial vulnerability of segregation?",
      hint: "Think about customer turnover and national retail chains.",
      teacherGuide: "Greensboro sit-ins disrupted sales and drew negative national publicity, forcing retail chains like Woolworth's to choose between segregation and corporate survival. It proved that hitting businesses financially was highly effective."
    },
    {
      id: "dt_2_1_2",
      question: "How did the Freedom Rides force the Kennedy administration to abandon its quiet behind-the-scenes diplomacy?",
      hint: "Think about international relations and Cold War pressures.",
      teacherGuide: "Brutal televised violence and firebombings in Alabama created an international scandal, forcing the administration to send US Marshals and issue federal integration mandates to maintain America's moral authority globally during the Cold War."
    }
  ],
  "subtopic_2_2": [
    {
      id: "dt_2_2_1",
      question: "Why did the SCLC choose to use children in the Birmingham protests (the 'Children's Crusade')?",
      hint: "Consider the moral impact on television viewers.",
      teacherGuide: "Children did not have jobs to lose, and televised footage of police dogs and fire hoses attacking youth generated unprecedented moral outrage globally, forcing President Kennedy to declare segregation a 'moral issue' on national TV."
    },
    {
      id: "dt_2_2_2",
      question: "How did the Selma campaign directly contribute to the passage of the Voting Rights Act of 1965?",
      hint: "Think about Bloody Sunday and the Edmund Pettus Bridge.",
      teacherGuide: "The televised brutality of 'Bloody Sunday' forced President Johnson to intervene and publicly declare the voting rights issue a national emergency, giving him the political leverage to pass the Voting Rights Act."
    }
  ],
  "subtopic_2_3": [
    {
      id: "dt_2_3_1",
      question: "How did Malcolm X's critique of integration appeal to Black Americans living in Northern urban ghettos?",
      hint: "Think about de facto segregation vs. legal rights.",
      teacherGuide: "Northern Black citizens already had legal voting rights but faced severe de facto economic segregation, slum housing, and police brutality, which integration did not solve. Malcolm's focus on economic self-reliance resonated deeply."
    },
    {
      id: "dt_2_3_2",
      question: "What did the Black Panthers' focus on armed patrols and community breakfasts reveal about their concept of 'Black Power'?",
      hint: "Consider the mixture of militancy and social welfare.",
      teacherGuide: "It combined revolutionary armed self-defense against police brutality with practical community self-reliance and socialist welfare programs, proving that 'Black Power' was about community control rather than just violent rhetoric."
    }
  ],
  "subtopic_2_4": [
    {
      id: "dt_2_4_1",
      question: "Why did the Kerner Commission conclude that America was moving toward 'two societies, one black, one white—separate and unequal'?",
      hint: "Think about systemic racism and urban poverty.",
      teacherGuide: "It identified systemic white racism, de facto housing segregation, and lack of economic opportunity as the roots of urban frustration, arguing that legal changes had not touched the deep structural inequality."
    },
    {
      id: "dt_2_4_2",
      question: "How did the assassination of MLK in 1968 mark a turning point for the civil rights movement?",
      hint: "Think about the fracture of non-violence and rise of law and order.",
      teacherGuide: "It fractured the mainstream commitment to non-violence, sparked riots in over 100 cities, and shifted the national political focus to law and order, accelerating the rise of conservative backlash and the decline of SCLC influence."
    }
  ],
  "subtopic_3_1": [
    {
      id: "dt_3_1_1",
      question: "How did the US Domino Theory justify supporting Ngo Dinh Diem despite his undemocratic policies?",
      hint: "Consider the priority of anti-communism in US foreign policy.",
      teacherGuide: "US leaders prioritized anti-communism over democratic integrity, fearing that if South Vietnam fell to communism, neighboring Laos and Cambodia would follow, thus compromising American containment strategy in Asia."
    },
    {
      id: "dt_3_1_2",
      question: "Why did Diem's favoritism toward Catholicism alienate the majority Buddhist population in South Vietnam?",
      hint: "Think about the demographics of South Vietnam.",
      teacherGuide: "Buddhists made up 80% of the population, but Diem restricted their flags, allocated lands to Catholics, and cracked down violently on Buddhist protestors, destroying his regime's legitimacy and driving peasants to aid the Vietcong."
    }
  ],
  "subtopic_3_2": [
    {
      id: "dt_3_2_1",
      question: "Why was the Gulf of Tonkin Resolution called a 'blank check' for President Johnson?",
      hint: "Consider the scope of presidential power granted by Congress.",
      teacherGuide: "It authorized the president to take 'all necessary measures' to repel attacks and prevent aggression without requiring a formal declaration of war by Congress, granting him unilateral authority to escalate military action."
    },
    {
      id: "dt_3_2_2",
      question: "How did the transition from 'advisory' status to combat deployment in March 1965 change the nature of the war?",
      hint: "Think about troop numbers and direct responsibility.",
      teacherGuide: "It turned a local civil conflict into a direct, large-scale American combat operation, shifting responsibility to US military forces and committing the US to an open-ended ground war."
    }
  ],
  "subtopic_3_3": [
    {
      id: "dt_3_3_1",
      question: "Why did the US reliance on 'body counts' as a measure of success distort the actual progress of the war?",
      hint: "Consider guerrilla tactics and political loyalty.",
      teacherGuide: "Body counts failed to measure territory controlled or political loyalty, incentivized indiscriminate killing of civilians, and ignored the enemy's willingness to absorb high casualties to achieve nationalist independence."
    },
    {
      id: "dt_3_3_2",
      question: "How did chemical defoliants like Agent Orange backfire against the US goal of winning 'hearts and minds'?",
      hint: "Think about environmental destruction and peasant livelihoods.",
      teacherGuide: "It destroyed crops, poisoned local food supplies, caused birth defects, and alienated the rural peasant population, driving them to aid the Vietcong as they saw the US as a destructive force."
    }
  ],
  "subtopic_3_4": [
    {
      id: "dt_3_4_1",
      question: "What was the core contradiction in Nixon's policy of Vietnamization?",
      hint: "Consider the geographical scope of the war.",
      teacherGuide: "Nixon claimed to be withdrawing US troops to achieve 'peace with honor', yet he expanded the war by bombing and invading neutral Cambodia and Laos to cut off Ho Chi Minh Trail supply lines."
    },
    {
      id: "dt_3_4_2",
      question: "Why did the ARVN struggle to defend South Vietnam independently despite receiving massive US equipment?",
      hint: "Think about leadership, morale, and dependency.",
      teacherGuide: "The ARVN suffered from corrupt leadership, low morale, high desertion rates, and dependency on US air support, which was steadily withdrawn, exposing their structural military weaknesses."
    }
  ],
  "subtopic_4_1": [
    {
      id: "dt_4_1_1",
      question: "How did televised media coverage of events like the My Lai Massacre affect public trust in the US military?",
      hint: "Consider the moral narrative of the war.",
      teacherGuide: "It shattered the narrative of moral superiority, revealing that US forces committed atrocities against unarmed civilians, fueling anti-war sentiment and creating a deep credibility gap between the government and public."
    },
    {
      id: "dt_4_1_2",
      question: "Why did the shooting of four students at Kent State University in 1970 trigger a nationwide student strike?",
      hint: "Think about the home front and class dynamics.",
      teacherGuide: "It brought the violence of the war home, showing that the state was willing to use lethal force against its own middle-class youth on college campuses, mobilizing 4 million students to strike in protest."
    }
  ],
  "subtopic_4_2": [
    {
      id: "dt_4_2_1",
      question: "Who did Nixon mean by the 'Silent Majority', and how did he use them to politically counter the anti-war movement?",
      hint: "Consider the political division of the home front.",
      teacherGuide: "The patriotic, law-abiding middle-class citizens who did not join protests. By claiming their quiet support, Nixon delegitimized anti-war protestors as a vocal minority, turning home front divisions into political capital."
    },
    {
      id: "dt_4_2_2",
      question: "What did the 'Hard Hat Riots' of 1970 reveal about class divisions within the American home front?",
      hint: "Think about student protestors vs. union workers.",
      teacherGuide: "Showed a deep split between working-class laborers (who supported the war out of patriotism) and middle-class college student protestors (whom they viewed as privileged and unpatriotic), revealing a cultural class war."
    }
  ],
  "subtopic_4_3": [
    {
      id: "dt_4_3_1",
      question: "Why did historians argue that the Paris Peace Accords of 1973 were designed to create a 'decent interval'?",
      hint: "Consider the long-term survival of South Vietnam.",
      teacherGuide: "It allowed the US to withdraw its forces and retrieve POWs under the guise of peace, knowing that South Vietnam would eventually fall once US support ended, avoiding the embarrassment of immediate defeat."
    },
    {
      id: "dt_4_3_2",
      question: "What did the iconic image of the helicopter evacuation of the Saigon embassy in 1975 symbolize to the world?",
      hint: "Think about US superpower status and foreign policy outcomes.",
      teacherGuide: "The total defeat and chaotic collapse of US policy in Southeast Asia, showing the limits of American military superpower status and marking the final failure of containment in Vietnam."
    }
  ],
  "subtopic_4_4": [
    {
      id: "dt_4_4_1",
      question: "Why was the US military unable to defeat an enemy that fought using asymmetric guerrilla warfare?",
      hint: "Think about military training vs. local terrain.",
      teacherGuide: "US heavy firepower and search-and-destroy tactics were useless against an enemy that blended with civilians, used tunnels, and refused conventional battle, fighting a war of attrition where they were willing to outlast the US."
    },
    {
      id: "dt_4_4_2",
      question: "How did the economic cost of the war ('Guns and Butter') weaken the US home front?",
      hint: "Think about inflation and domestic social spending.",
      teacherGuide: "Funding both the war (Guns) and Johnson's Great Society welfare programs (Butter) caused high inflation, drained resources, and damaged the domestic economy, weakening political support for the conflict."
    }
  ]
};

// Update the module LESSONS_DATA object programmatically
Object.entries(LESSONS_DATA).forEach(([topicId, topic]) => {
  // 1. Inject scholarly image
  if (SCHOLARLY_IMGS[topicId]) {
    // Add image property to the scholarlyDepth of step 1 (or step 2 if step 1 has none)
    if (topic.steps[0] && topic.steps[0].scholarlyDepth) {
      topic.steps[0].scholarlyDepth.image = SCHOLARLY_IMGS[topicId];
      topic.steps[0].scholarlyDepth.imageAlt = topic.steps[0].scholarlyDepth.title;
    }
  }

  // 2. Inject howUsefulAnalyser
  if (HOW_USEFUL_DATA[topicId]) {
    topic.howUsefulAnalyser = HOW_USEFUL_DATA[topicId];
  }

  // 3. Inject deepThinkingQuestions
  if (DEEP_THINKING_DATA[topicId]) {
    topic.deepThinkingQuestions = DEEP_THINKING_DATA[topicId];
  }
});

// Write modified LESSONS_DATA back to lessons_data.js
const newContent = `export const LESSONS_DATA = ${JSON.stringify(LESSONS_DATA, null, 2)};\n`;
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Successfully updated lessons_data.js with new visual sources, How Useful questions, and Deep Thinking questions!');
