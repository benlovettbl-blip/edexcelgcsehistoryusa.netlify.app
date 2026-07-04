import { state } from './state.js';
import { QUIZ_DATA } from '../questions.js';
import { LESSONS_DATA } from './lessons_data.js';
import { AudioEngine } from './audio.js';
import { Confetti } from './confetti.js';
import { addXp, updateGlobalStats } from './views.js';

export const SOURCE_GAME_DATA = {
  "subtopic_1_4": {
    "title": "Opposition to Civil Rights in the 1950s",
    "enquiry": "the opposition to the civil rights movement in the 1950s",
    "sourceB": {
      "name": "Source B",
      "provenance": "From a speech by Southern Senator Strom Thurmond to Congress, 1956.",
      "content": "The Southern Manifesto is a declaration of our constitutional right to defend our communities against federal encroachment. The Supreme Court's ruling is an abuse of power that tears up our laws and customs. We will resist integration using every legal means at our disposal. It is our duty to protect the sovereignty of our states from this unwarranted judicial overreach.",
      "sentences": [
        "The Southern Manifesto is a declaration of our constitutional right to defend our communities against federal encroachment.",
        "The Supreme Court's ruling is an abuse of power that tears up our laws and customs.",
        "We will resist integration using every legal means at our disposal.",
        "It is our duty to protect the sovereignty of our states from this unwarranted judicial overreach."
      ],
      "correctSentenceIndex": 0,
      "nature": 1,
      "natureOptions": ["Official government statistics report", "Political speech to Congress", "Private diary entry", "Newspaper advertisement"],
      "natureExpl": "Source B is a public political speech delivered by a US Senator on the floor of Congress.",
      "origin": 2,
      "originOptions": ["An NAACP activist in Birmingham", "A federal court judge in Washington", "A segregationist Southern US Senator in 1956", "A journalist reporting on Little Rock"],
      "originExpl": "Source B was written by Senator Strom Thurmond of South Carolina in 1956, a prominent leader of Southern political resistance.",
      "purpose": 2,
      "purposeOptions": [
        "To campaign for civil rights legislation in the North",
        "To record official Senate debate transcripts for historical archives",
        "To rally Southern political resistance against school integration by framing it as a constitutional states' rights issue",
        "To condemn violent acts committed by the Ku Klux Klan"
      ],
      "purposeExpl": "Thurmond's purpose was to encourage Southern politicians to sign the Southern Manifesto and defy federal desegregation rulings."
    },
    "sourceC": {
      "name": "Source C",
      "provenance": "From an NAACP report on violent incidents in Alabama, 1957.",
      "content": "The KKK is acting with complete impunity. Black churches have been bombed, and civil rights workers are dragged from their homes and beaten. The local sheriff's department refuse to make any arrests and actively assist the Klan in identifying NAACP members.",
      "sentences": [
        "The KKK is acting with complete impunity.",
        "Black churches have been bombed, and civil rights workers are dragged from their homes and beaten.",
        "The local sheriff's department refuse to make any arrests and actively assist the Klan in identifying NAACP members."
      ],
      "correctSentenceIndex": 1,
      "nature": 0,
      "natureOptions": ["Official activist organization report", "Public protest rally speech", "Personal letter to a relative", "Judicial transcript of a trial"],
      "natureExpl": "Source C is an official report prepared by the NAACP to document local civil rights violations.",
      "origin": 1,
      "originOptions": ["Local Alabama police officers", "NAACP civil rights investigators in Alabama, 1957", "Vigilante members of the White Citizens' Councils", "Federal marshals deployed by Eisenhower"],
      "originExpl": "Source C was created by NAACP field workers in Alabama in 1957, who witnessed local white backlash firsthand.",
      "purpose": 1,
      "purposeOptions": [
        "To promote local tourism and business growth in Alabama",
        "To document KKK terror and police collusion in order to lobby the federal government for protection and legal action",
        "To warn activists to stop organizing voter campaigns",
        "To publish a regular newsletter for school students"
      ],
      "purposeExpl": "The report aimed to expose local police complicity with vigilante terror and pressure the federal government to intervene in the South."
    },
    "interpretation1": {
      "author": "Historian Keith M. Finley (2008)",
      "summary": "Argues that the primary and most effective obstacle to civil rights was sophisticated political obstruction (states' rights arguments, filibusters) by Southern congressmen."
    },
    "interpretation2": {
      "author": "Historian Adam Fairclough (1995)",
      "summary": "Argues that segregation was primarily enforced through raw grassroots terror (KKK bombings, beatings) and economic intimidation by Citizens' Councils."
    },
    "corroboration": {
      "matchB": 1, // Source B supports Interpretation 1
      "matchC": 2, // Source C supports Interpretation 2
      "explanation": "<strong>Corroboration Analysis:</strong> You highlighted: <em>\"The Southern Manifesto is a declaration of our constitutional right to defend our communities against federal encroachment.\"</em> in Source B, which supports Keith M. Finley's view that opposition was framed around constitutional 'states' rights'. You highlighted: <em>\"Black churches have been bombed, and civil rights workers are dragged from their homes and beaten.\"</em> in Source C, which corroborates Adam Fairclough's view that raw, unchecked violence was the real mechanism of segregation."
    }
  },
  "subtopic_2_4": {
    "title": "Causes of the 1960s Urban Riots",
    "enquiry": "the causes of the 1960s urban riots",
    "sourceB": {
      "name": "Source B",
      "provenance": "From a statement by a Detroit resident participating in the 1967 riot.",
      "content": "This isn't a race riot. We are hitting the stores that overcharge us, the landlords who lease us rat-infested rooms, and the police who treat us like dirt. We have no jobs, no future. We are just telling the white man we've had enough.",
      "sentences": [
        "This isn't a race riot.",
        "We are hitting the stores that overcharge us, the landlords who lease us rat-infested rooms, and the police who treat us like dirt.",
        "We have no jobs, no future.",
        "We are just telling the white man we've had enough."
      ],
      "correctSentenceIndex": 1,
      "nature": 3,
      "natureOptions": ["Government census document", "A newspaper article from a white journalist", "Official police report", "Firsthand statement by a riot participant"],
      "natureExpl": "Source B is a personal firsthand statement / interview from an active participant in the 1967 Detroit riots.",
      "origin": 1,
      "originOptions": ["A white store owner in Detroit", "A Black Detroit resident participating in the 1967 unrest", "The Mayor of Detroit", "A federal government investigator"],
      "originExpl": "Source B represents the voice of a marginalized inner-city resident directly involved in the events of 1967.",
      "purpose": 2,
      "purposeOptions": [
        "To advocate for strict policing in Northern neighborhoods",
        "To encourage out-of-town agitators to join the looting",
        "To explain that the rioting was a direct reaction to systemic housing exploitation, economic pricing issues, and police brutality",
        "To plead with the National Guard for protection"
      ],
      "purposeExpl": "The resident's purpose was to express their deep socio-economic frustrations and clarify that the unrest was a political cry against injustice, not simple racial hatred."
    },
    "sourceC": {
      "name": "Source C",
      "provenance": "From a speech by California Governor Ronald Reagan, 1967.",
      "content": "A rioter is not a civil rights protestor. He is a criminal who steals and burns. We will not tolerate lawlessness. We must restore law and order, support our police, and show that crime does not pay.",
      "sentences": [
        "A rioter is not a civil rights protestor.",
        "He is a criminal who steals and burns.",
        "We will not tolerate lawlessness.",
        "We must restore law and order, support our police, and show that crime does not pay."
      ],
      "correctSentenceIndex": 1,
      "nature": 1,
      "natureOptions": ["Secret military briefing", "Public political speech", "Autobiographical chapter", "Court testimony"],
      "natureExpl": "Source C is a public political speech delivered by a state governor during a time of widespread national concern over urban unrest.",
      "origin": 2,
      "originOptions": ["An active member of the Black Panthers", "A federal civil rights commissioner", "California Governor Ronald Reagan in 1967", "A local Detroit merchant"],
      "originExpl": "Source C was created by conservative governor Ronald Reagan in 1967, expressing the views of the state executive authority.",
      "purpose": 0,
      "purposeOptions": [
        "To condemn rioters as simple criminals, advocate for restoring law and order, and reject socio-economic justifications for the violence",
        "To propose new housing and welfare funding for inner cities",
        "To praise the peaceful methods of the Black Power movement",
        "To announce his candidacy for the presidency"
      ],
      "purposeExpl": "Reagan's purpose was to reassure voters, outline a hardline law-and-order response, and frame the rioting as criminal anarchy rather than a valid political protest."
    },
    "interpretation1": {
      "author": "Historian Gerald Horne (1995)",
      "summary": "Argues that the riots were a political rebellion against economic despair, ghettoization, housing discrimination, and systemic police brutality."
    },
    "interpretation2": {
      "author": "Political Scientist Edward Banfield (1970)",
      "summary": "Argues that the riots were not political protests but class-based looting sprees, driven by opportunism, greed, and a breakdown of authority."
    },
    "corroboration": {
      "matchB": 1,
      "matchC": 2,
      "explanation": "<strong>Corroboration Analysis:</strong> You selected: <em>\"We are hitting the stores that overcharge us, the landlords who lease us rat-infested rooms, and the police who treat us like dirt.\"</em>, proving the economic despair of Interpretation 1. You highlighted: <em>\"He is a criminal who steals and burns.\"</em> from Governor Reagan, matching Edward Banfield's claim of opportunistic greed."
    }
  },
  "subtopic_3_4": {
    "title": "Growth of the Anti-War Movement",
    "enquiry": "the reasons for the growth of the anti-war movement in the USA",
    "sourceB": {
      "name": "Source B",
      "provenance": "From a statement by the Students for a Democratic Society (SDS) at an anti-war rally in Washington D.C., 1965.",
      "content": "The war in Vietnam is an immoral and unjustifiable intervention in a civil conflict. We are drafting young men from poor communities to fight and die for a corrupt regime in Saigon, while defense contractors in America rake in billions. We demand an immediate withdrawal of all US troops and an end to this senseless slaughter. It is our democratic duty to resist the draft and protest until the war machine is stopped.",
      "sentences": [
        "The war in Vietnam is an immoral and unjustifiable intervention in a civil conflict.",
        "We are drafting young men from poor communities to fight and die for a corrupt regime in Saigon, while defense contractors in America rake in billions.",
        "We demand an immediate withdrawal of all US troops and an end to this senseless slaughter.",
        "It is our democratic duty to resist the draft and protest until the war machine is stopped."
      ],
      "correctSentenceIndex": 3,
      "nature": 0,
      "natureOptions": ["Activist organization protest statement", "Official White House press release", "A military draft notice", "A television news report"],
      "natureExpl": "Source B is an activist protest statement delivered publicly at an organized anti-war demonstration.",
      "origin": 1,
      "originOptions": ["A military general in Vietnam", "Students for a Democratic Society (SDS) in 1965", "A television news reporter", "A South Vietnamese diplomat"],
      "originExpl": "Source B was created by the leading student activist group SDS in 1965, during the initial phase of US combat escalation.",
      "purpose": 3,
      "purposeOptions": [
        "To support President Johnson's Great Society funding programs",
        "To recruit volunteers for the South Vietnamese army",
        "To explain the military strategy of the draft lottery",
        "To condemn the war as immoral, oppose the draft system, and mobilize youth to resist the war machine"
      ],
      "purposeExpl": "The statement's purpose was to raise public awareness of the war's injustice, encourage draft resistance, and organize student opposition."
    },
    "sourceC": {
      "name": "Source C",
      "provenance": "From a broadcast by CBS Evening News anchor Walter Cronkite, following his visit to Vietnam during the Tet Offensive, February 1968.",
      "content": "To say that we are closer to victory today is to believe, in the face of the evidence, the optimists who have been wrong in the past. To suggest we are on the edge of defeat is to yield to unreasonable pessimism. To say that we are mired in stalemate seems the only realistic, yet unsatisfactory, conclusion.",
      "sentences": [
        "To say that we are closer to victory today is to believe, in the face of the evidence, the optimists who have been wrong in the past.",
        "To suggest we are on the edge of defeat is to yield to unreasonable pessimism.",
        "To say that we are mired in stalemate seems the only realistic, yet unsatisfactory, conclusion."
      ],
      "correctSentenceIndex": 2,
      "nature": 2,
      "natureOptions": ["A private letter to the President", "An official Pentagon report", "Television news broadcast / editorial comment", "A movie review script"],
      "natureExpl": "Source C is a television news broadcast containing editorial comment, broadcast to millions of American households.",
      "origin": 0,
      "originOptions": ["CBS News Anchor Walter Cronkite, 1968", "General William Westmoreland", "President Lyndon B. Johnson", "An anti-war student protester"],
      "originExpl": "Source C was created by Walter Cronkite, one of America's most trusted news anchors, in February 1968 after the Tet Offensive.",
      "purpose": 2,
      "purposeOptions": [
        "To report that the US had won a decisive victory at Tet",
        "To call for immediate nuclear strikes on Hanoi",
        "To share a realistic assessment of the war as a stalemate and advocate for a negotiated exit",
        "To announce his resignation from CBS News"
      ],
      "purposeExpl": "Cronkite's purpose was to inform the public that government optimistic assessments were wrong, and that the only rational path forward was negotiations."
    },
    "interpretation1": {
      "author": "Historian Charles DeBenedetti (1990)",
      "summary": "Argues that the anti-war movement grew due to a moral and political awakening among youth, driven by the draft and the injustice of the conflict."
    },
    "interpretation2": {
      "author": "Media Historian Daniel Hallin (1986)",
      "summary": "Argues that the anti-war movement grew because uncensored television and media coverage brought the brutal stalemate and credibility gap into living rooms."
    },
    "corroboration": {
      "matchB": 1,
      "matchC": 2,
      "explanation": "<strong>Corroboration Analysis:</strong> You matched: <em>\"It is our democratic duty to resist the draft and protest...\"</em>, confirming Charles DeBenedetti's focus on youth draft resistance. You selected Cronkite's television verdict: <em>\"To say that we are mired in stalemate seems the only realistic... conclusion.\"</em>, supporting Daniel Hallin's view on media-driven war opposition."
    }
  },
  "subtopic_4_4": {
    "title": "Reasons for US Failure in Vietnam",
    "enquiry": "the reasons for US failure in the Vietnam War",
    "sourceB": {
      "name": "Source B",
      "provenance": "From a speech by US General William Westmoreland, 1976.",
      "content": "On the battlefield, our soldiers were outstanding. We won every major battle. The defeat was not military. The war was lost by politicians who restricted our targets and by a media that turned the American public against a noble cause.",
      "sentences": [
        "On the battlefield, our soldiers were outstanding.",
        "We won every major battle.",
        "The defeat was not military.",
        "The war was lost by politicians who restricted our targets and by a media that turned the American public against a noble cause."
      ],
      "correctSentenceIndex": 3,
      "nature": 1,
      "natureOptions": ["A battlefield order diary", "Retrospective public speech / military defense statement", "A confidential treaty draft", "A secret congressional testimony"],
      "natureExpl": "Source B is a retrospective public speech / military defense statement delivered after the conclusion of the war.",
      "origin": 3,
      "originOptions": ["North Vietnamese General Vo Nguyen Giap", "A young American soldier in a jungle patrol", "US President Richard Nixon", "US General William Westmoreland in 1976"],
      "originExpl": "Source B was created by General Westmoreland, the overall commander of US forces in Vietnam from 1964 to 1968, speaking in 1976.",
      "purpose": 1,
      "purposeOptions": [
        "To announce plans for a new invasion of North Vietnam",
        "To defend the military's record by blaming politicians and the media for restricting operations and undermining public support",
        "To apologize to the American public for tactical military mistakes",
        "To support congressional cuts to the defense budget"
      ],
      "purposeExpl": "Westmoreland's purpose was to shift the blame for the defeat away from his military strategies (like attrition) and onto Washington politicians and anti-war media coverage."
    },
    "sourceC": {
      "name": "Source C",
      "provenance": "From a North Vietnamese volunteer worker on the Ho Chi Minh Trail, 1974.",
      "content": "They bombed us day and night, but we rebuilt the road immediately. We were fighting for our country's independence. We were willing to die for our land. Firepower cannot defeat national spirit.",
      "sentences": [
        "They bombed us day and night, but we rebuilt the road immediately.",
        "We were fighting for our country's independence.",
        "We were willing to die for our land.",
        "Firepower cannot defeat national spirit."
      ],
      "correctSentenceIndex": 3,
      "nature": 2,
      "natureOptions": ["An official military dispatch", "A public propaganda poster", "Firsthand oral history / veteran recollection", "A legal contract for road workers"],
      "natureExpl": "Source C is a firsthand oral history / veteran recollection of a former trail volunteer.",
      "origin": 0,
      "originOptions": ["A North Vietnamese volunteer worker on the Ho Chi Minh Trail", "A US Air Force pilot bombing the trail", "A Chinese logistics officer in Hanoi", "A South Vietnamese ARVN soldier"],
      "originExpl": "Source C was created by a North Vietnamese trail worker in 1974, recounting their experiences during the heavy US bombings.",
      "purpose": 3,
      "purposeOptions": [
        "To describe the construction methods of modern bridges",
        "To plead for medical aid from international organizations",
        "To express regret for supporting the North Vietnamese government",
        "To describe the absolute determination and nationalist spirit of the volunteers to rebuild the trail and drive out foreign forces"
      ],
      "purposeExpl": "The volunteer's purpose was to explain that their deep patriotic commitment to independence made them willing to endure and rebuild, rendering US air supremacy ineffective."
    },
    "interpretation1": {
      "author": "Historian Lewis Sorley (1999)",
      "summary": "Argues that the failure was political, as the US military had secured the country, but Congress cut funding and banned air support, leaving ARVN defenseless."
    },
    "interpretation2": {
      "author": "Historian Stanley Karnow (1983)",
      "summary": "Argues that the US failure was inevitable because they fought a deeply rooted nationalist movement willing to accept any human cost to win."
    },
    "corroboration": {
      "matchB": 1,
      "matchC": 2,
      "explanation": "<strong>Corroboration Analysis:</strong> You highlighted: <em>\"The war was lost by politicians who restricted our targets...\"</em> in Source B, corroborating Lewis Sorley's political failure argument. You selected: <em>\"Firepower cannot defeat national spirit.\"</em> in Source C, supporting Stanley Karnow's view that defeat was inevitable against a nationalist struggle."
    }
  }
};

export function initSourceDetectiveGame() {
  const container = document.getElementById('game-source-detective-container');
  if (!container) return;

  // Render initial layout
  container.innerHTML = `
    <div class="dashboard-panel" style="padding: 24px; margin-bottom: 24px; border: 1px solid var(--border-glass); background: rgba(0, 0, 0, 0.15); border-radius: var(--border-radius-md);">
      <h3 style="font-family: var(--font-heading); color: var(--primary); margin-top: 0; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-magnifying-glass-chart"></i> Paper 3 Source Detective Inquiry
      </h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.45; margin: 0 0 16px 0;">
        GCSE Paper 3 relies heavily on analyzing primary sources and historical interpretations (Section B). Select a past enquiry below to deconstruct its NOP (Nature, Origin, Purpose) and highlight the exact text evidence that supports the historical interpretations.
      </p>
      
      <div class="form-group" style="display: flex; flex-direction: column; gap: 8px;">
        <label class="form-label" style="font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted);">Select Enquiry Topic</label>
        <select class="select-input" id="source-game-enquiry-select" style="width: 100%; padding: 12px 16px; background: rgba(0, 0, 0, 0.25); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); color: var(--text-main); font-size: 0.95rem; outline: none; cursor: pointer;">
          <option value="" disabled selected>-- Select an Enquiry --</option>
          <option value="subtopic_1_4">Opposition to the Civil Rights Movement (1950s)</option>
          <option value="subtopic_2_4">Causes of the 1960s Urban Riots</option>
          <option value="subtopic_3_4">Reasons for the Growth of the Anti-War Movement</option>
          <option value="subtopic_4_4">Reasons for US Failure in the Vietnam War</option>
        </select>
      </div>
    </div>
    
    <div id="source-game-play-area">
      <div class="empty-state" style="text-align: center; padding: 40px 20px; background: rgba(255, 255, 255, 0.02); border: 1px dashed var(--border-glass); border-radius: var(--border-radius-md);">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 12px;"></i>
        <h3 style="color: var(--text-main); font-family: var(--font-heading); margin-bottom: 8px;">Inquiry Closed</h3>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin: 0;">Select an enquiry topic from the dropdown menu above to begin your source analysis workout.</p>
      </div>
    </div>
  `;

  document.getElementById('source-game-enquiry-select').addEventListener('change', (e) => {
    AudioEngine.play('click');
    startInquiry(e.target.value);
  });
}

function startInquiry(subtopicId) {
  const data = SOURCE_GAME_DATA[subtopicId];
  if (!data) return;

  const playArea = document.getElementById('source-game-play-area');
  if (!playArea) return;

  // Active state for NOP deconstruction
  let gameState = {
    subtopicId,
    activeSource: 'sourceB', // 'sourceB' | 'sourceC'
    resolved: {
      sourceB: { nature: null, origin: null, purpose: null },
      sourceC: { nature: null, origin: null, purpose: null }
    },
    phase: 1, // 1: NOP Deconstruction, 2: Interpretation Matching via Text Highlighting
    matchB: null, // selected sentence index for Source B
    matchC: null, // selected sentence index for Source C
    matchedB: false, // is B correctly aligned
    matchedC: false  // is C correctly aligned
  };

  function renderInquiryStage() {
    if (gameState.phase === 1) {
      renderPhase1();
    } else {
      renderPhase2();
    }
  }

  function renderPhase1() {
    const srcData = data[gameState.activeSource];
    const isB = gameState.activeSource === 'sourceB';
    
    const answers = gameState.resolved[gameState.activeSource];
    const isSourceDone = answers.nature !== null && answers.origin !== null && answers.purpose !== null;

    playArea.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Enquiry Header Info -->
        <div style="background: rgba(59, 130, 246, 0.05); border-left: 4px solid var(--primary); padding: 14px 16px; border-radius: 4px;">
          <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--primary); letter-spacing: 0.5px; line-height: 1;">Enquiry Focus</div>
          <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-top: 4px;">Enquiry into ${data.enquiry}</div>
        </div>

        <!-- Source Selector Tabs -->
        <div style="display: flex; gap: 10px; border-bottom: 1px solid var(--border-glass); padding-bottom: 8px;">
          <button class="tab-btn ${isB ? 'active' : ''}" id="btn-tab-srcB" style="flex: 1; padding: 10px; font-weight: 600; font-size: 0.85rem; border-radius: var(--border-radius-sm); border: 1px solid ${isB ? 'var(--primary)' : 'var(--border-glass)'}; background: ${isB ? 'rgba(59, 130, 246, 0.1)' : 'transparent'}; color: ${isB ? 'var(--primary)' : 'var(--text-muted)'}; cursor: pointer;">
            Source B ${gameState.resolved.sourceB.nature !== null && gameState.resolved.sourceB.origin !== null && gameState.resolved.sourceB.purpose !== null ? '✅' : ''}
          </button>
          <button class="tab-btn ${!isB ? 'active' : ''}" id="btn-tab-srcC" style="flex: 1; padding: 10px; font-weight: 600; font-size: 0.85rem; border-radius: var(--border-radius-sm); border: 1px solid ${!isB ? 'var(--primary)' : 'var(--border-glass)'}; background: ${!isB ? 'rgba(59, 130, 246, 0.1)' : 'transparent'}; color: ${!isB ? 'var(--primary)' : 'var(--text-muted)'}; cursor: pointer;">
            Source C ${gameState.resolved.sourceC.nature !== null && gameState.resolved.sourceC.origin !== null && gameState.resolved.sourceC.purpose !== null ? '✅' : ''}
          </button>
        </div>

        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          
          <!-- Left: Source Panel -->
          <div class="dashboard-panel" style="flex: 1.2; min-width: 320px; padding: 20px; display: flex; flex-direction: column; gap: 14px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass);">
            <h4 style="margin: 0; font-family: var(--font-heading); color: var(--accent); font-size: 1.1rem; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-file-lines"></i> ${gameState.activeSource === 'sourceB' ? 'Source B' : 'Source C'}
            </h4>
            <div class="source-provenance-box" style="font-size: 0.8rem; font-style: italic; color: var(--text-muted); background: rgba(0,0,0,0.15); padding: 10px; border-radius: 4px; border-left: 2px solid var(--text-muted);">
              <strong>Provenance:</strong> ${srcData.provenance}
            </div>
            <div class="source-content-box" style="font-size: 0.88rem; line-height: 1.5; color: var(--text-main); font-family: Georgia, serif; background: rgba(255, 255, 255, 0.01); padding: 12px; border-radius: 4px; border: 1px dashed rgba(255,255,255,0.05); max-height: 220px; overflow-y: auto;">
              "${srcData.content}"
            </div>
          </div>

          <!-- Right: NOP Questionnaire -->
          <div class="dashboard-panel" style="flex: 1; min-width: 280px; padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            <h4 style="margin: 0; font-family: var(--font-heading); color: var(--primary); font-size: 1.1rem; text-align: center;">
              Brief NOP Analysis
            </h4>
            
            <!-- Nature Selector -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="font-size: 0.72rem; font-weight: bold; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">1. Nature (What is it?)</label>
              ${renderNOPButtons('nature', srcData.natureOptions, srcData.nature, answers.nature, srcData.natureExpl)}
            </div>

            <!-- Origin Selector -->
            <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px dashed var(--border-glass); padding-top: 14px;">
              <label style="font-size: 0.72rem; font-weight: bold; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">2. Origin (Who and when?)</label>
              ${renderNOPButtons('origin', srcData.originOptions, srcData.origin, answers.origin, srcData.originExpl)}
            </div>

            <!-- Purpose Selector -->
            <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px dashed var(--border-glass); padding-top: 14px;">
              <label style="font-size: 0.72rem; font-weight: bold; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">3. Purpose (Why was it made?)</label>
              ${renderNOPButtons('purpose', srcData.purposeOptions, srcData.purpose, answers.purpose, srcData.purposeExpl)}
            </div>
          </div>

        </div>

        <!-- Next Step Button Panel -->
        ${renderPhase1Footer()}

      </div>
    `;

    bindNOPListeners();
  }

  function renderNOPButtons(type, options, correctIdx, currentSelected, explanation) {
    if (currentSelected !== null) {
      const isCorrect = currentSelected === correctIdx;
      return `
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div style="padding: 10px; background: ${isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'}; border: 1px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}; border-radius: 4px; font-size: 0.78rem; color: var(--text-main); display: flex; align-items: flex-start; gap: 8px;">
            <i class="fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-circle-xmark'}" style="color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}; margin-top: 2px;"></i>
            <div>
              <strong>${isCorrect ? 'Correct!' : 'Incorrect Choice'}</strong>
              <div style="margin-top: 3px; font-weight: 500;">${options[currentSelected]}</div>
            </div>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); padding-left: 20px; line-height: 1.35;">
            💡 <strong>Why:</strong> ${explanation}
          </div>
        </div>
      `;
    }

    return options.map((opt, idx) => `
      <button class="nop-choice-btn" data-type="${type}" data-index="${idx}" style="width: 100%; text-align: left; padding: 8px 12px; font-size: 0.76rem; border-radius: 4px; border: 1px solid var(--border-glass); background: rgba(255,255,255,0.03); color: var(--text-main); cursor: pointer; transition: all var(--transition-fast); line-height: 1.3;">
        ${opt}
      </button>
    `).join('');
  }

  function renderPhase1Footer() {
    const isDoneB = gameState.resolved.sourceB.nature !== null && gameState.resolved.sourceB.origin !== null && gameState.resolved.sourceB.purpose !== null;
    const isDoneC = gameState.resolved.sourceC.nature !== null && gameState.resolved.sourceC.origin !== null && gameState.resolved.sourceC.purpose !== null;

    if (isDoneB && isDoneC) {
      return `
        <div class="dashboard-panel" style="padding: 16px; background: rgba(16, 185, 129, 0.05); border: 1px solid var(--success); border-radius: var(--border-radius-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div>
            <h4 style="margin: 0; color: var(--success); font-family: var(--font-heading); display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-circle-check"></i> Provenance Analysis Complete!</h4>
            <p style="margin: 3px 0 0 0; font-size: 0.8rem; color: var(--text-muted);">You successfully deconstructed both sources. Next, perform active text highlighting to connect evidence to the interpretations.</p>
          </div>
          <button class="btn-primary" id="btn-source-game-phase2" style="padding: 10px 20px; font-weight: 700; border-radius: var(--border-radius-sm); display: flex; align-items: center; gap: 6px; cursor: pointer;">
            Evidence Highlighter <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      `;
    }

    const currentSourceText = gameState.activeSource === 'sourceB' ? 'Source B' : 'Source C';
    const isCurrentDone = gameState.activeSource === 'sourceB' ? isDoneB : isDoneC;
    
    if (isCurrentDone) {
      const nextSource = gameState.activeSource === 'sourceB' ? 'sourceC' : 'sourceB';
      return `
        <div class="dashboard-panel" style="padding: 16px; background: rgba(59, 130, 246, 0.05); border: 1px solid var(--primary); border-radius: var(--border-radius-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div>
            <h4 style="margin: 0; color: var(--primary); font-family: var(--font-heading);"><i class="fa-solid fa-arrow-right-long"></i> Deconstructed ${currentSourceText}!</h4>
            <p style="margin: 3px 0 0 0; font-size: 0.8rem; color: var(--text-muted);">Analyze the other source to unlock the corroboration matcher.</p>
          </div>
          <button class="btn-primary" id="btn-source-game-switch" data-target="${nextSource}" style="padding: 10px 20px; font-weight: 700; border-radius: var(--border-radius-sm); cursor: pointer;">
            Deconstruct ${nextSource === 'sourceB' ? 'Source B' : 'Source C'}
          </button>
        </div>
      `;
    }

    return '';
  }

  function bindNOPListeners() {
    const btnB = document.getElementById('btn-tab-srcB');
    if (btnB) {
      btnB.addEventListener('click', () => {
        AudioEngine.play('click');
        gameState.activeSource = 'sourceB';
        renderPhase1();
      });
    }

    const btnC = document.getElementById('btn-tab-srcC');
    if (btnC) {
      btnC.addEventListener('click', () => {
        AudioEngine.play('click');
        gameState.activeSource = 'sourceC';
        renderPhase1();
      });
    }

    document.querySelectorAll('.nop-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        const idx = parseInt(btn.getAttribute('data-index'));
        const srcData = data[gameState.activeSource];
        
        const isCorrect = idx === srcData[type];
        if (isCorrect) {
          AudioEngine.play('success');
          addXp(2);
        } else {
          AudioEngine.play('fail');
        }

        gameState.resolved[gameState.activeSource][type] = idx;
        renderPhase1();
      });
    });

    const switchBtn = document.getElementById('btn-source-game-switch');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => {
        AudioEngine.play('click');
        gameState.activeSource = switchBtn.getAttribute('data-target');
        renderPhase1();
      });
    }

    const phase2Btn = document.getElementById('btn-source-game-phase2');
    if (phase2Btn) {
      phase2Btn.addEventListener('click', () => {
        AudioEngine.play('success');
        gameState.phase = 2;
        renderPhase2();
      });
    }
  }

  function renderPhase2() {
    const isDone = gameState.matchedB && gameState.matchedC;
    
    playArea.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Phase Header -->
        <div style="background: rgba(14, 165, 233, 0.05); border-left: 4px solid var(--accent); padding: 14px 16px; border-radius: 4px;">
          <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--accent); letter-spacing: 0.5px; line-height: 1;">Phase 2: Textual Evidence Highlighter</div>
          <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-top: 4px;">Select the sentence that directly corroborates the historian's argument.</div>
        </div>

        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          
          <!-- Left: Interpretations -->
          <div style="flex: 1; min-width: 320px; display: flex; flex-direction: column; gap: 14px;">
            <h4 style="margin: 0; font-family: var(--font-heading); color: var(--primary); font-size: 1.1rem; text-align: center;">
              📜 Historians' Claims
            </h4>
            
            <!-- Interpretation 1 Panel -->
            <div class="dashboard-panel" style="padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
              <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: var(--primary); padding: 3px 8px; border-radius: 3px; font-size: 0.65rem; font-weight: bold; text-transform: uppercase;">Interpretation 1</span>
              <h5 style="margin: 10px 0 6px 0; font-size: 0.85rem; color: var(--text-main);">${data.interpretation1.author}</h5>
              <p style="margin: 0; font-size: 0.82rem; line-height: 1.45; color: var(--text-muted);">${data.interpretation1.summary}</p>
              ${gameState.matchedB ? `
                <div style="position: absolute; top: 12px; right: 12px; color: var(--success); font-weight: bold; font-size: 0.72rem; display: flex; align-items: center; gap: 4px;">
                  <i class="fa-solid fa-circle-check"></i> Evidence Matched (Source B)
                </div>
              ` : ''}
            </div>

            <!-- Interpretation 2 Panel -->
            <div class="dashboard-panel" style="padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: var(--border-radius-sm); position: relative;">
              <span class="badge" style="background: rgba(236, 72, 153, 0.15); color: #ec4899; padding: 3px 8px; border-radius: 3px; font-size: 0.65rem; font-weight: bold; text-transform: uppercase;">Interpretation 2</span>
              <h5 style="margin: 10px 0 6px 0; font-size: 0.85rem; color: var(--text-main);">${data.interpretation2.author}</h5>
              <p style="margin: 0; font-size: 0.82rem; line-height: 1.45; color: var(--text-muted);">${data.interpretation2.summary}</p>
              ${gameState.matchedC ? `
                <div style="position: absolute; top: 12px; right: 12px; color: var(--success); font-weight: bold; font-size: 0.72rem; display: flex; align-items: center; gap: 4px;">
                  <i class="fa-solid fa-circle-check"></i> Evidence Matched (Source C)
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Right: Interactive Highlighter Board -->
          <div class="dashboard-panel" style="flex: 1.2; min-width: 320px; padding: 20px; display: flex; flex-direction: column; gap: 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass);">
            
            ${!gameState.matchedB ? `
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="font-size: 0.75rem; font-weight: bold; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px;">Task 1: Corroborate Interpretation 1</div>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0; line-height: 1.4;">
                  Click/highlight the sentence in **Source B** below that directly supports the view of <strong>${data.interpretation1.author}</strong>.
                </p>
                <div style="font-size: 0.78rem; font-style: italic; color: var(--text-muted); background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px;">
                  Provenance: ${data.sourceB.provenance}
                </div>
                <div class="evidence-interactive-block" style="display: flex; flex-direction: column; gap: 8px; line-height: 1.5; font-family: Georgia, serif; font-size: 0.9rem;">
                  ${renderClickableSentences('sourceB', data.sourceB.sentences)}
                </div>
              </div>
            ` : (!gameState.matchedC ? `
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="font-size: 0.75rem; font-weight: bold; color: #ec4899; text-transform: uppercase; letter-spacing: 0.5px;">Task 2: Corroborate Interpretation 2</div>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0; line-height: 1.4;">
                  Now click/highlight the sentence in **Source C** below that supports the view of <strong>${data.interpretation2.author}</strong>.
                </p>
                <div style="font-size: 0.78rem; font-style: italic; color: var(--text-muted); background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px;">
                  Provenance: ${data.sourceC.provenance}
                </div>
                <div class="evidence-interactive-block" style="display: flex; flex-direction: column; gap: 8px; line-height: 1.5; font-family: Georgia, serif; font-size: 0.9rem;">
                  ${renderClickableSentences('sourceC', data.sourceC.sentences)}
                </div>
              </div>
            ` : `
              <div style="text-align: center; padding: 30px 10px;">
                <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(16, 185, 129, 0.1); color: var(--success); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 16px;">
                  <i class="fa-solid fa-circle-check"></i>
                </div>
                <h4 style="margin: 0 0 8px 0; color: var(--text-main); font-family: var(--font-heading); font-size: 1.2rem;">All Evidence Corroborated!</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.45; margin: 0;">
                  You successfully extracted the direct textual quotes required for Section B questions.
                </p>
              </div>
            `)}

          </div>

        </div>

        <!-- Corroboration Feedback Sheet -->
        ${renderPhase2Footer()}

      </div>
    `;

    bindMatchListeners();
  }

  function renderClickableSentences(sourceKey, sentences) {
    const correctIdx = data[sourceKey].correctSentenceIndex;
    const currentSelection = gameState[sourceKey === 'sourceB' ? 'matchB' : 'matchC'];

    return sentences.map((sent, idx) => {
      let extraStyle = '';
      let badge = '';
      if (currentSelection !== null && idx === currentSelected(sourceKey)) {
        const isCorrect = idx === correctIdx;
        extraStyle = isCorrect ? 'border: 1px solid var(--success); background: rgba(16, 185, 129, 0.08); color: var(--text-main);' : 'border: 1px solid var(--danger); background: rgba(239, 68, 68, 0.08); color: var(--text-main);';
        badge = isCorrect ? ' <i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 0.72rem; margin-left: 4px;"></i>' : ' <i class="fa-solid fa-circle-xmark" style="color: var(--danger); font-size: 0.72rem; margin-left: 4px;"></i>';
      }

      return `
        <span class="source-evidence-sentence" data-idx="${idx}" style="cursor: pointer; padding: 6px 10px; border-radius: 4px; border: 1px dashed transparent; transition: all var(--transition-fast); display: block; hover-background: rgba(255,255,255,0.03); ${extraStyle}">
          "${sent}"${badge}
        </span>
      `;
    }).join('');
  }

  function currentSelected(sourceKey) {
    return sourceKey === 'sourceB' ? gameState.matchB : gameState.matchC;
  }

  function renderPhase2Footer() {
    if (!gameState.matchedB || !gameState.matchedC) return '';

    const corroboration = data.corroboration;
    return `
      <div class="dashboard-panel" style="padding: 20px; border: 1px solid var(--success); background: rgba(16, 185, 129, 0.05); border-radius: var(--border-radius-md); display: flex; flex-direction: column; gap: 14px;">
        <div>
          <h4 style="margin: 0; color: var(--success); font-family: var(--font-heading); font-size: 1.15rem; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-trophy"></i> Enquiry Complete! +15 XP Awarded
          </h4>
          <p style="margin: 6px 0 10px 0; font-size: 0.85rem; line-height: 1.45; color: var(--text-main);">
            ${corroboration.explanation}
          </p>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 4px;">
          <button class="btn-secondary" id="btn-source-game-reset" style="padding: 10px 18px; font-weight: 700; border-radius: var(--border-radius-sm); cursor: pointer; font-size: 0.82rem;">Reset Enquiry</button>
          <button class="btn-primary" id="btn-source-game-finished" style="padding: 10px 18px; font-weight: 700; border-radius: var(--border-radius-sm); cursor: pointer; font-size: 0.82rem;">Finished</button>
        </div>
      </div>
    `;
  }

  function bindMatchListeners() {
    document.querySelectorAll('.source-evidence-sentence').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-idx'));
        const sourceKey = !gameState.matchedB ? 'sourceB' : 'sourceC';
        const correctIdx = data[sourceKey].correctSentenceIndex;

        if (sourceKey === 'sourceB') {
          gameState.matchB = idx;
          if (idx === correctIdx) {
            AudioEngine.play('success');
            gameState.matchedB = true;
            addXp(5);
          } else {
            AudioEngine.play('fail');
          }
        } else {
          gameState.matchC = idx;
          if (idx === correctIdx) {
            AudioEngine.play('cheer');
            Confetti.spawn(100);
            gameState.matchedC = true;
            addXp(10);
            updateGlobalStats();
          } else {
            AudioEngine.play('fail');
          }
        }

        renderPhase2();
      });
    });

    const resetBtn = document.getElementById('btn-source-game-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        AudioEngine.play('click');
        startInquiry(subtopicId);
      });
    }

    const finishedBtn = document.getElementById('btn-source-game-finished');
    if (finishedBtn) {
      finishedBtn.addEventListener('click', () => {
        AudioEngine.play('click');
        initSourceDetectiveGame();
      });
    }
  }

  renderInquiryStage();
}
