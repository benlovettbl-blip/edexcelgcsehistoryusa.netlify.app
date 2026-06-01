# PowerShell script to update the timeline in app.js and generate_embed.ps1

$appJsPath = "C:\Users\fives\.gemini\antigravity\scratch\firefly_recall_quizzes\app.js"
$genEmbedPath = "C:\Users\fives\.gemini\antigravity\scratch\firefly_recall_quizzes\generate_embed.ps1"

# 1. Update app.js
$appJsContent = [System.IO.File]::ReadAllText($appJsPath, [System.Text.Encoding]::UTF8)

# Let's define the new JavaScript timeline block
$newJsTimeline = @'
    html += `    <div class="es-timeline-controls">\n`;
    html += `      <button class="es-timeline-btn" onclick="toggleAllTimelines('block')">Expand All Eras</button>\n`;
    html += `      <button class="es-timeline-btn" onclick="toggleAllTimelines('none')">Collapse All</button>\n`;
    html += `    </div>\n`;
    html += `    <div class="es-interactive-timeline">\n`;
    html += `      <p style="font-size: 0.85rem; color: #7c6e65; margin-bottom: 16px;">\n`;
    html += `        <em>Click on any era below to expand the timeline and review the chronological sequence of events before attempting the Narrative Account builder.</em>\n`;
    html += `      </p>\n`;
    html += `      <div class="es-timeline-event" onclick="toggleTimeline('es-te1')">\n`;
    html += `        <div class="es-timeline-date">1945–1947</div>\n`;
    html += `        <div class="es-timeline-title">The British Mandate Breaks Down</div>\n`;
    html += `        <div class="es-click-hint">Click to reveal events...</div>\n`;
    html += `        <div id="es-te1" class="es-timeline-details">\n`;
    html += `          <ul>\n`;
    html += `            <li><strong>Post-WWII Tension:</strong> Britain faces conflicting demands from Zionists (seeking a haven for Holocaust survivors) and Palestinian Arabs (demanding independence).</li>\n`;
    html += `            <li><strong>July 1946:</strong> The Jewish insurgent group Irgun bombs the British administrative headquarters at the <strong>King David Hotel</strong> in Jerusalem, killing 91 people and shattering British public morale.</li>\n`;
    html += `            <li><strong>Feb 1947:</strong> Exhausted by the insurgency and the cost of keeping 100,000 troops in Palestine, Britain hands the problem to the newly formed United Nations.</li>\n`;
    html += `            <li><strong>Nov 1947:</strong> The UN passes <strong>Resolution 181</strong> (The Partition Plan), allocating 55% of the land to a Jewish state. Jews accept it; the Arab League rejects it completely, sparking immediate civil war.</li>\n`;
    html += `          </ul>\n`;
    html += `        </div>\n`;
    html += `      </div>\n`;
    html += `      <div class="es-timeline-event" onclick="toggleTimeline('es-te2')">\n`;
    html += `        <div class="es-timeline-date">1948–1949</div>\n`;
    html += `        <div class="es-timeline-title">The First Arab-Israeli War & The Nakba</div>\n`;
    html += `        <div class="es-click-hint">Click to reveal events...</div>\n`;
    html += `        <div id="es-te2" class="es-timeline-details">\n`;
    html += `          <ul>\n`;
    html += `            <li><strong>May 1948:</strong> The British Mandate officially ends. David Ben-Gurion declares the State of Israel. The next day, armies from five Arab nations (Egypt, Syria, Jordan, Lebanon, Iraq) invade.</li>\n`;
    html += `            <li><strong>1948-49 War:</strong> Israel survives due to a unified command (creation of the <strong>Israeli Defence Forces - IDF</strong>), mandatory conscription, and importing Czech weapons during UN truces.</li>\n`;
    html += `            <li><strong>The Aftermath (1949):</strong> Armistice agreements establish the 'Green Line'. Israel expands its territory beyond the UN plan. Jordan annexes the West Bank; Egypt takes military control of Gaza.</li>\n`;
    html += `            <li><strong>The Nakba:</strong> Over 700,000 Palestinian Arabs flee or are driven from their homes, creating a massive refugee crisis. The UN sets up <strong>UNRWA</strong> to run refugee camps.</li>\n`;
    html += `          </ul>\n`;
    html += `        </div>\n`;
    html += `      </div>\n`;
    html += `      <div class="es-timeline-event" onclick="toggleTimeline('es-te3')">\n`;
    html += `        <div class="es-timeline-date">1950–1955</div>\n`;
    html += `        <div class="es-timeline-title">State Building, Border Wars & The Cold War</div>\n`;
    html += `        <div class="es-click-hint">Click to reveal events...</div>\n`;
    html += `        <div id="es-te3" class="es-timeline-details">\n`;
    html += `          <ul>\n`;
    html += `            <li><strong>1950:</strong> Israel passes the <strong>Law of Return</strong>, granting any Jew worldwide the right to Israeli citizenship, leading to a massive demographic expansion.</li>\n`;
    html += `            <li><strong>1954:</strong> Gamal Abdel Nasser officially takes power in Egypt, promoting Pan-Arabism to unite the Arab world.</li>\n`;
    html += `            <li><strong>Feb 1955:</strong> Israel launches a massive reprisal attack against Egyptian military headquarters in Gaza (killing 38) to stop cross-border 'Fedayeen' guerrilla raids.</li>\n`;
    html += `            <li><strong>Sept 1955:</strong> Humiliated by the Gaza raid, Nasser signs the massive <strong>Czech Arms Deal</strong> to bypass Western embargoes and secure advanced Soviet weapons, escalating Cold War tensions.</li>\n`;
    html += `          </ul>\n`;
    html += `        </div>\n`;
    html += `      </div>\n`;
    html += `      <div class="es-timeline-event" onclick="toggleTimeline('es-te4')">\n`;
    html += `        <div class="es-timeline-date">1956–1958</div>\n`;
    html += `        <div class="es-timeline-title">The Suez Crisis & Arab Nationalism</div>\n`;
    html += `        <div class="es-click-hint">Click to reveal events...</div>\n`;
    html += `        <div id="es-te4" class="es-timeline-details">\n`;
    html += `          <ul>\n`;
    html += `            <li><strong>July 1956:</strong> The USA and Britain withdraw funding for the Aswan High Dam. In retaliation, Nasser nationalises the <strong>Suez Canal</strong> to use its toll revenues.</li>\n`;
    html += `            <li><strong>Oct 1956:</strong> Britain, France, and Israel hold secret meetings and sign the <strong>Protocol of Sèvres</strong> to collude against Egypt.</li>\n`;
    html += `            <li><strong>Oct/Nov 1956 (Suez Crisis):</strong> Israel invades the Sinai Peninsula, destroying Fedayeen bases. Britain and France intervene but are forced to withdraw humiliatingly after immense pressure from the USA and USSR.</li>\n`;
    html += `            <li><strong>The Result:</strong> UN peacekeepers (<strong>UNEF</strong>) are stationed in the Sinai, giving Israel a decade of secure borders and reopening the Straits of Tiran for trade. Nasser emerges as a hero of the Arab world, forming the United Arab Republic (UAR) with Syria in 1958.</li>\n`;
    html += `          </ul>\n`;
    html += `        </div>\n`;
    html += `      </div>\n`;
    html += `      <div class="es-timeline-event" onclick="toggleTimeline('es-te5')">\n`;
    html += `        <div class="es-timeline-date">1964–1967 (May)</div>\n`;
    html += `        <div class="es-timeline-title">The Road to the Six Day War</div>\n`;
    html += `        <div class="es-click-hint">Click to reveal events...</div>\n`;
    html += `        <div id="es-te5" class="es-timeline-details">\n`;
    html += `          <ul>\n`;
    html += `            <li><strong>1964:</strong> The Cairo Conference officially sets up the <strong>Palestine Liberation Organisation (PLO)</strong> to unite Palestinians.</li>\n`;
    html += `            <li><strong>1965-66:</strong> Fatah (led by Yasser Arafat) begins sabotage raids into Israel. Disputes erupt over Syria's 'Headwater Diversion Plan' to cut off Israel's water from the River Jordan.</li>\n`;
    html += `            <li><strong>Nov 1966:</strong> The IDF launches a destructive reprisal raid on the West Bank village of <strong>Samu</strong>, humiliating King Hussein of Jordan. Egypt and Syria sign a mutual defence pact.</li>\n`;
    html += `            <li><strong>May 1967 (The Crisis):</strong> Soviet misinformation falsely claims Israel is massing troops on the Syrian border. Nasser reacts by moving 100,000 troops into Sinai, ordering UNEF peacekeepers out, and blockading the <strong>Straits of Tiran</strong>.</li>\n`;
    html += `          </ul>\n`;
    html += `        </div>\n`;
    html += `      </div>\n`;
    html += `      <div class="es-timeline-event" onclick="toggleTimeline('es-te6')">\n`;
    html += `        <div class="es-timeline-date">1967 (June) – 1969</div>\n`;
    html += `        <div class="es-timeline-title">The Six Day War & The Aftermath</div>\n`;
    html += `        <div class="es-click-hint">Click to reveal events...</div>\n`;
    html += `        <div id="es-te6" class="es-timeline-details">\n`;
    html += `          <ul>\n`;
    html += `            <li><strong>5 June 1967:</strong> Viewing the blockade as an act of war, Israel launches a devastating pre-emptive air strike, destroying over 300 Egyptian planes on the ground in hours.</li>\n`;
    html += `            <li><strong>The Victory:</strong> In just six days, Israel captures the Sinai Peninsula, Gaza Strip, West Bank, East Jerusalem, and the Golan Heights. Israel expands its size by 350%, gaining massive defensive buffer zones.</li>\n`;
    html += `            <li><strong>Aug 1967:</strong> The Arab League meets in Khartoum and issues the <strong>'Three Nos'</strong>: no peace, no recognition, no negotiation with Israel.</li>\n`;
    html += `            <li><strong>Nov 1967:</strong> The UN passes <strong>Resolution 242</strong>, establishing the principle of 'Land for Peace', but its ambiguous wording leads to diplomatic stalemate.</li>\n`;
    html += `            <li><strong>1968-70:</strong> Egypt initiates the 'War of Attrition', a static conflict of constant artillery shelling across the Suez Canal to wear down Israeli forces.</li>\n`;
    html += `          </ul>\n`;
    html += `        </div>\n`;
    html += `      </div>\n`;
    html += `      <div class="es-timeline-event" onclick="toggleTimeline('es-te7')">\n`;
    html += `        <div class="es-timeline-date">1970–1972</div>\n`;
    html += `        <div class="es-timeline-title">Global Terrorism & Black September</div>\n`;
    html += `        <div class="es-click-hint">Click to reveal events...</div>\n`;
    html += `        <div id="es-te7" class="es-timeline-details">\n`;
    html += `          <ul>\n`;
    html += `            <li><strong>Sept 1970:</strong> The radical Marxist group PFLP hijacks international passenger jets and blows them up at Dawson's Field in Jordan to gain global publicity for the Palestinian cause.</li>\n`;
    html += `            <li><strong>Sept 1970 (Black September):</strong> Furious at the hijackings, King Hussein's army attacks the PLO in Jordan. Thousands die, and the PLO is expelled, moving its headquarters to Lebanon.</li>\n`;
    html += `            <li><strong>Sept 1972:</strong> 'Black September' terrorists take Israeli athletes hostage at the <strong>Munich Olympics</strong>. 11 Israelis are killed after a botched German rescue attempt.</li>\n`;
    html += `            <li><strong>The Response:</strong> Israel launches 'Operation Wrath of God', a covert Mossad campaign to assassinate those responsible for Munich across Europe.</li>\n`;
    html += `          </ul>\n`;
    html += `        </div>\n`;
    html += `      </div>\n`;
    html += `      <div class="es-timeline-event" onclick="toggleTimeline('es-te8')">\n`;
    html += `        <div class="es-timeline-date">1973–1975</div>\n`;
    html += `        <div class="es-timeline-title">The Yom Kippur War & Shuttle Diplomacy</div>\n`;
    html += `        <div class="es-click-hint">Click to reveal events...</div>\n`;
    html += `        <div id="es-te8" class="es-timeline-details">\n`;
    html += `          <ul>\n`;
    html += `            <li><strong>6 Oct 1973:</strong> On the holiest Jewish holiday, Egypt and Syria launch a surprise coordinated attack. Egyptian forces use water cannons to blast through Israel's massive Bar Lev Line.</li>\n`;
    html += `            <li><strong>Superpower Intervention:</strong> The USSR arms the Arabs with advanced SAM-3 anti-aircraft missiles. The USA launches a $2.2 billion emergency airlift of tanks and jets to save Israel from defeat.</li>\n`;
    html += `            <li><strong>The Oil Crisis:</strong> In retaliation for US support of Israel, Arab OPEC nations launch a strict oil embargo, quadrupling global fuel prices and causing a worldwide economic crisis.</li>\n`;
    html += `            <li><strong>1974-75:</strong> Desperate to secure oil routes, US Secretary of State Henry Kissinger engages in <strong>'Shuttle Diplomacy'</strong>, flying between hostile capitals to secure disengagement treaties, leading to the reopening of the Suez Canal.</li>\n`;
    html += `          </ul>\n`;
    html += `        </div>\n`;
    html += `      </div>\n`;
    html += `      <div class="es-timeline-event" onclick="toggleTimeline('es-te9')">\n`;
    html += `        <div class="es-timeline-date">1977–1979</div>\n`;
    html += `        <div class="es-timeline-title">The Camp David Accords</div>\n`;
    html += `        <div class="es-click-hint">Click to reveal events...</div>\n`;
    html += `        <div id="es-te9" class="es-timeline-details">\n`;
    html += `          <ul>\n`;
    html += `            <li><strong>Nov 1977:</strong> Egyptian President Anwar Sadat makes a historic and unprecedented visit to Jerusalem, addressing the Israeli Knesset and breaking the psychological barrier of the Arab 'Three Nos'.</li>\n`;
    html += `            <li><strong>Sept 1978:</strong> US President Jimmy Carter invites Sadat and Israeli PM Menachem Begin to the secluded presidential retreat at <strong>Camp David</strong>, isolating them from the press to hammer out an agreement.</li>\n`;
    html += `            <li><strong>March 1979:</strong> The <strong>Treaty of Washington</strong> is signed. Egypt becomes the first Arab state to officially recognise Israel, and Israel agrees to withdraw from the Sinai Peninsula completely.</li>\n`;
    html += `            <li><strong>1981:</strong> Denounced as a traitor by Arab states for making peace, Anwar Sadat is assassinated by Islamic extremists within his own army.</li>\n`;
    html += `          </ul>\n`;
    html += `        </div>\n`;
    html += `      </div>\n`;
    html += `      <div class="es-timeline-event" onclick="toggleTimeline('es-te10')">\n`;
    html += `        <div class="es-timeline-date">1978–1982</div>\n`;
    html += `        <div class="es-timeline-title">The PLO in Lebanon & Full-Scale Invasion</div>\n`;
    html += `        <div class="es-click-hint">Click to reveal events...</div>\n`;
    html += `        <div id="es-te10" class="es-timeline-details">\n`;
    html += `          <ul>\n`;
    html += `            <li><strong>1970s Lebanon:</strong> Following expulsion from Jordan, the PLO establishes 'Fatahland' in southern Lebanon, launching Katyusha rockets and cross-border raids into northern Israel.</li>\n`;
    html += `            <li><strong>March 1978:</strong> After a deadly PLO bus hijacking (the Coastal Road Massacre), Israel launches <strong>Operation Litani</strong>, a limited invasion to push the PLO back. The UN establishes the UNIFIL buffer zone.</li>\n`;
    html += `            <li><strong>June 1982:</strong> Following an assassination attempt on the Israeli ambassador in London, Defence Minister Ariel Sharon launches a full-scale invasion: <strong>Operation Peace for Galilee</strong>.</li>\n`;
    html += `            <li><strong>Sept 1982:</strong> The IDF besieges Beirut, forcing Arafat and 14,000 PLO fighters to evacuate to Tunisia. Shortly after, Lebanese Christian militias carry out the horrific <strong>Sabra and Shatila massacres</strong> of Palestinian refugees while the IDF guards the perimeters.</li>\n`;
    html += `          </ul>\n`;
    html += `        </div>\n`;
    html += `      </div>\n`;
    html += `      <div class="es-timeline-event" onclick="toggleTimeline('es-te11')">\n`;
    html += `        <div class="es-timeline-date">1987–1991</div>\n`;
    html += `        <div class="es-timeline-title">The Intifada & The End of the Cold War</div>\n`;
    html += `        <div class="es-click-hint">Click to reveal events...</div>\n`;
    html += `        <div id="es-te11" class="es-timeline-details">\n`;
    html += `          <ul>\n`;
    html += `            <li><strong>Dec 1987:</strong> An Israeli army truck crashes in Gaza, sparking the <strong>First Intifada</strong> ('shaking off'). This grassroots Palestinian uprising features mass strikes, boycotts, and youths throwing stones at tanks.</li>\n`;
    html += `            <li><strong>1988:</strong> Israel's harsh 'Iron Fist' military response draws intense international condemnation. The Islamic militant group <strong>Hamas</strong> is founded.</li>\n`;
    html += `            <li><strong>Dec 1988:</strong> Yasser Arafat addresses the UN in Geneva, historically <strong>renouncing terrorism</strong> and accepting the two-state solution, prompting the USA to finally open dialogue with the PLO.</li>\n`;
    html += `            <li><strong>1991:</strong> The collapse of the USSR (End of the Cold War) strips Arab states and the PLO of their main funder. The US-led victory in the Gulf War leaves America as the undisputed global superpower, allowing them to pressure both sides to attend the <strong>Madrid Peace Conference</strong>.</li>\n`;
    html += `          </ul>\n`;
    html += `        </div>\n`;
    html += `      </div>\n`;
    html += `      <div class="es-timeline-event" onclick="toggleTimeline('es-te12')">\n`;
    html += `        <div class="es-timeline-date">1993–1995</div>\n`;
    html += `        <div class="es-timeline-title">The Oslo Accords & The Peace Process</div>\n`;
    html += `        <div class="es-click-hint">Click to reveal events...</div>\n`;
    html += `        <div id="es-te12" class="es-timeline-details">\n`;
    html += `          <ul>\n`;
    html += `            <li><strong>1993:</strong> Frustrated by public stalls, Israeli and PLO negotiators hold secret, back-channel talks in Norway.</li>\n`;
    html += `            <li><strong>Sept 1993 (Oslo I):</strong> The <strong>Oslo Accords</strong> are signed. Yasser Arafat and Israeli PM Yitzhak Rabin shake hands on the White House lawn, marking official mutual recognition. The <strong>Palestinian National Authority (PNA)</strong> is set up to provide limited self-government in Jericho and Gaza.</li>\n`;
    html += `            <li><strong>Oct 1994:</strong> Inspired by Oslo, King Hussein signs a full peace treaty between Jordan and Israel.</li>\n`;
    html += `            <li><strong>Sept 1995 (Oslo II):</strong> The West Bank is divided into Areas A, B, and C, with varying degrees of Palestinian and Israeli control.</li>\n`;
    html += `            <li><strong>Nov 1995:</strong> The peace process suffers a massive blow when Israeli PM Yitzhak Rabin is assassinated by Yigal Amir, a Jewish religious extremist opposed to giving up land.</li>\n`;
    html += `          </ul>\n`;
    html += `        </div>\n`;
    html += `      </div>\n`;
    html += `    </div>\n`;
'@

# We want to replace the segment between:
# html += `    <div class="es-interactive-timeline">\n`;
# and
# html += `    </div>\n`; (specifically, the es-te6 one which ends the timeline events)
# To be robust, let's find the indices in $appJsContent:

$startIndex = $appJsContent.IndexOf('    html += `    <div class="es-interactive-timeline">\n`;')
$endIndex = $appJsContent.IndexOf('    html += `    </div>\n`;', $startIndex) + '    html += `    </div>\n`;'.Length

if ($startIndex -ge 0 -and $endIndex -gt $startIndex) {
    $before = $appJsContent.Substring(0, $startIndex)
    $after = $appJsContent.Substring($endIndex)
    $appJsContent = $before + $newJsTimeline + $after
    [System.IO.File]::WriteAllText($appJsPath, $appJsContent, [System.Text.Encoding]::UTF8)
    Write-Host "Successfully updated app.js narrative timeline HTML!"
} else {
    Write-Error "Could not find timeline block boundaries in app.js!"
}


# 2. Update generate_embed.ps1
$genEmbedContent = [System.IO.File]::ReadAllText($genEmbedPath, [System.Text.Encoding]::UTF8)

# Let's define the new raw HTML timeline block
$newHtmlTimeline = @'
    <div class="es-timeline-controls">
      <button class="es-timeline-btn" onclick="toggleAllTimelines('block')">Expand All Eras</button>
      <button class="es-timeline-btn" onclick="toggleAllTimelines('none')">Collapse All</button>
    </div>
    <div class="es-interactive-timeline">
      <p style="font-size: 0.85rem; color: #7c6e65; margin-bottom: 16px;">
        <em>Click on any era below to expand the timeline and review the chronological sequence of events before attempting the Narrative Account builder.</em>
      </p>
      <div class="es-timeline-event" onclick="toggleTimeline('es-te1')">
        <div class="es-timeline-date">1945–1947</div>
        <div class="es-timeline-title">The British Mandate Breaks Down</div>
        <div class="es-click-hint">Click to reveal events...</div>
        <div id="es-te1" class="es-timeline-details">
          <ul>
            <li><strong>Post-WWII Tension:</strong> Britain faces conflicting demands from Zionists (seeking a haven for Holocaust survivors) and Palestinian Arabs (demanding independence).</li>
            <li><strong>July 1946:</strong> The Jewish insurgent group Irgun bombs the British administrative headquarters at the <strong>King David Hotel</strong> in Jerusalem, killing 91 people and shattering British public morale.</li>
            <li><strong>Feb 1947:</strong> Exhausted by the insurgency and the cost of keeping 100,000 troops in Palestine, Britain hands the problem to the newly formed United Nations.</li>
            <li><strong>Nov 1947:</strong> The UN passes <strong>Resolution 181</strong> (The Partition Plan), allocating 55% of the land to a Jewish state. Jews accept it; the Arab League rejects it completely, sparking immediate civil war.</li>
          </ul>
        </div>
      </div>
      <div class="es-timeline-event" onclick="toggleTimeline('es-te2')">
        <div class="es-timeline-date">1948–1949</div>
        <div class="es-timeline-title">The First Arab-Israeli War & The Nakba</div>
        <div class="es-click-hint">Click to reveal events...</div>
        <div id="es-te2" class="es-timeline-details">
          <ul>
            <li><strong>May 1948:</strong> The British Mandate officially ends. David Ben-Gurion declares the State of Israel. The next day, armies from five Arab nations (Egypt, Syria, Jordan, Lebanon, Iraq) invade.</li>
            <li><strong>1948-49 War:</strong> Israel survives due to a unified command (creation of the <strong>Israeli Defence Forces - IDF</strong>), mandatory conscription, and importing Czech weapons during UN truces.</li>
            <li><strong>The Aftermath (1949):</strong> Armistice agreements establish the 'Green Line'. Israel expands its territory beyond the UN plan. Jordan annexes the West Bank; Egypt takes military control of Gaza.</li>
            <li><strong>The Nakba:</strong> Over 700,000 Palestinian Arabs flee or are driven from their homes, creating a massive refugee crisis. The UN sets up <strong>UNRWA</strong> to run refugee camps.</li>
          </ul>
        </div>
      </div>
      <div class="es-timeline-event" onclick="toggleTimeline('es-te3')">
        <div class="es-timeline-date">1950–1955</div>
        <div class="es-timeline-title">State Building, Border Wars & The Cold War</div>
        <div class="es-click-hint">Click to reveal events...</div>
        <div id="es-te3" class="es-timeline-details">
          <ul>
            <li><strong>1950:</strong> Israel passes the <strong>Law of Return</strong>, granting any Jew worldwide the right to Israeli citizenship, leading to a massive demographic expansion.</li>
            <li><strong>1954:</strong> Gamal Abdel Nasser officially takes power in Egypt, promoting Pan-Arabism to unite the Arab world.</li>
            <li><strong>Feb 1955:</strong> Israel launches a massive reprisal attack against Egyptian military headquarters in Gaza (killing 38) to stop cross-border 'Fedayeen' guerrilla raids.</li>
            <li><strong>Sept 1955:</strong> Humiliated by the Gaza raid, Nasser signs the massive <strong>Czech Arms Deal</strong> to bypass Western embargoes and secure advanced Soviet weapons, escalating Cold War tensions.</li>
          </ul>
        </div>
      </div>
      <div class="es-timeline-event" onclick="toggleTimeline('es-te4')">
        <div class="es-timeline-date">1956–1958</div>
        <div class="es-timeline-title">The Suez Crisis & Arab Nationalism</div>
        <div class="es-click-hint">Click to reveal events...</div>
        <div id="es-te4" class="es-timeline-details">
          <ul>
            <li><strong>July 1956:</strong> The USA and Britain withdraw funding for the Aswan High Dam. In retaliation, Nasser nationalises the <strong>Suez Canal</strong> to use its toll revenues.</li>
            <li><strong>Oct 1956:</strong> Britain, France, and Israel hold secret meetings and sign the <strong>Protocol of Sèvres</strong> to collude against Egypt.</li>
            <li><strong>Oct/Nov 1956 (Suez Crisis):</strong> Israel invades the Sinai Peninsula, destroying Fedayeen bases. Britain and France intervene but are forced to withdraw humiliatingly after immense pressure from the USA and USSR.</li>
            <li><strong>The Result:</strong> UN peacekeepers (<strong>UNEF</strong>) are stationed in the Sinai, giving Israel a decade of secure borders and reopening the Straits of Tiran for trade. Nasser emerges as a hero of the Arab world, forming the United Arab Republic (UAR) with Syria in 1958.</li>
          </ul>
        </div>
      </div>
      <div class="es-timeline-event" onclick="toggleTimeline('es-te5')">
        <div class="es-timeline-date">1964–1967 (May)</div>
        <div class="es-timeline-title">The Road to the Six Day War</div>
        <div class="es-click-hint">Click to reveal events...</div>
        <div id="es-te5" class="es-timeline-details">
          <ul>
            <li><strong>1964:</strong> The Cairo Conference officially sets up the <strong>Palestine Liberation Organisation (PLO)</strong> to unite Palestinians.</li>
            <li><strong>1965-66:</strong> Fatah (led by Yasser Arafat) begins sabotage raids into Israel. Disputes erupt over Syria's 'Headwater Diversion Plan' to cut off Israel's water from the River Jordan.</li>
            <li><strong>Nov 1966:</strong> The IDF launches a destructive reprisal raid on the West Bank village of <strong>Samu</strong>, humiliating King Hussein of Jordan. Egypt and Syria sign a mutual defence pact.</li>
            <li><strong>May 1967 (The Crisis):</strong> Soviet misinformation falsely claims Israel is massing troops on the Syrian border. Nasser reacts by moving 100,000 troops into Sinai, ordering UNEF peacekeepers out, and blockading the <strong>Straits of Tiran</strong>.</li>
          </ul>
        </div>
      </div>
      <div class="es-timeline-event" onclick="toggleTimeline('es-te6')">
        <div class="es-timeline-date">1967 (June) – 1969</div>
        <div class="es-timeline-title">The Six Day War & The Aftermath</div>
        <div class="es-click-hint">Click to reveal events...</div>
        <div id="es-te6" class="es-timeline-details">
          <ul>
            <li><strong>5 June 1967:</strong> Viewing the blockade as an act of war, Israel launches a devastating pre-emptive air strike, destroying over 300 Egyptian planes on the ground in hours.</li>
            <li><strong>The Victory:</strong> In just six days, Israel captures the Sinai Peninsula, Gaza Strip, West Bank, East Jerusalem, and the Golan Heights. Israel expands its size by 350%, gaining massive defensive buffer zones.</li>
            <li><strong>Aug 1967:</strong> The Arab League meets in Khartoum and issues the <strong>'Three Nos'</strong>: no peace, no recognition, no negotiation with Israel.</li>
            <li><strong>Nov 1967:</strong> The UN passes <strong>Resolution 242</strong>, establishing the principle of 'Land for Peace', but its ambiguous wording leads to diplomatic stalemate.</li>
            <li><strong>1968-70:</strong> Egypt initiates the 'War of Attrition', a static conflict of constant artillery shelling across the Suez Canal to wear down Israeli forces.</li>
          </ul>
        </div>
      </div>
      <div class="es-timeline-event" onclick="toggleTimeline('es-te7')">
        <div class="es-timeline-date">1970–1972</div>
        <div class="es-timeline-title">Global Terrorism & Black September</div>
        <div class="es-click-hint">Click to reveal events...</div>
        <div id="es-te7" class="es-timeline-details">
          <ul>
            <li><strong>Sept 1970:</strong> The radical Marxist group PFLP hijacks international passenger jets and blows them up at Dawson's Field in Jordan to gain global publicity for the Palestinian cause.</li>
            <li><strong>Sept 1970 (Black September):</strong> Furious at the hijackings, King Hussein's army attacks the PLO in Jordan. Thousands die, and the PLO is expelled, moving its headquarters to Lebanon.</li>
            <li><strong>Sept 1972:</strong> 'Black September' terrorists take Israeli athletes hostage at the <strong>Munich Olympics</strong>. 11 Israelis are killed after a botched German rescue attempt.</li>
            <li><strong>The Response:</strong> Israel launches 'Operation Wrath of God', a covert Mossad campaign to assassinate those responsible for Munich across Europe.</li>
          </ul>
        </div>
      </div>
      <div class="es-timeline-event" onclick="toggleTimeline('es-te8')">
        <div class="es-timeline-date">1973–1975</div>
        <div class="es-timeline-title">The Yom Kippur War & Shuttle Diplomacy</div>
        <div class="es-click-hint">Click to reveal events...</div>
        <div id="es-te8" class="es-timeline-details">
          <ul>
            <li><strong>6 Oct 1973:</strong> On the holiest Jewish holiday, Egypt and Syria launch a surprise coordinated attack. Egyptian forces use water cannons to blast through Israel's massive Bar Lev Line.</li>
            <li><strong>Superpower Intervention:</strong> The USSR arms the Arabs with advanced SAM-3 anti-aircraft missiles. The USA launches a $2.2 billion emergency airlift of tanks and jets to save Israel from defeat.</li>
            <li><strong>The Oil Crisis:</strong> In retaliation for US support of Israel, Arab OPEC nations launch a strict oil embargo, quadrupling global fuel prices and causing a worldwide economic crisis.</li>
            <li><strong>1974-75:</strong> Desperate to secure oil routes, US Secretary of State Henry Kissinger engages in <strong>'Shuttle Diplomacy'</strong>, flying between hostile capitals to secure disengagement treaties, leading to the reopening of the Suez Canal.</li>
          </ul>
        </div>
      </div>
      <div class="es-timeline-event" onclick="toggleTimeline('es-te9')">
        <div class="es-timeline-date">1977–1979</div>
        <div class="es-timeline-title">The Camp David Accords</div>
        <div class="es-click-hint">Click to reveal events...</div>
        <div id="es-te9" class="es-timeline-details">
          <ul>
            <li><strong>Nov 1977:</strong> Egyptian President Anwar Sadat makes a historic and unprecedented visit to Jerusalem, addressing the Israeli Knesset and breaking the psychological barrier of the Arab 'Three Nos'.</li>
            <li><strong>Sept 1978:</strong> US President Jimmy Carter invites Sadat and Israeli PM Menachem Begin to the secluded presidential retreat at <strong>Camp David</strong>, isolating them from the press to hammer out an agreement.</li>
            <li><strong>March 1979:</strong> The <strong>Treaty of Washington</strong> is signed. Egypt becomes the first Arab state to officially recognise Israel, and Israel agrees to withdraw from the Sinai Peninsula completely.</li>
            <li><strong>1981:</strong> Denounced as a traitor by Arab states for making peace, Anwar Sadat is assassinated by Islamic extremists within his own army.</li>
          </ul>
        </div>
      </div>
      <div class="es-timeline-event" onclick="toggleTimeline('es-te10')">
        <div class="es-timeline-date">1978–1982</div>
        <div class="es-timeline-title">The PLO in Lebanon & Full-Scale Invasion</div>
        <div class="es-click-hint">Click to reveal events...</div>
        <div id="es-te10" class="es-timeline-details">
          <ul>
            <li><strong>1970s Lebanon:</strong> Following expulsion from Jordan, the PLO establishes 'Fatahland' in southern Lebanon, launching Katyusha rockets and cross-border raids into northern Israel.</li>
            <li><strong>March 1978:</strong> After a deadly PLO bus hijacking (the Coastal Road Massacre), Israel launches <strong>Operation Litani</strong>, a limited invasion to push the PLO back. The UN establishes the UNIFIL buffer zone.</li>
            <li><strong>June 1982:</strong> Following an assassination attempt on the Israeli ambassador in London, Defence Minister Ariel Sharon launches a full-scale invasion: <strong>Operation Peace for Galilee</strong>.</li>
            <li><strong>Sept 1982:</strong> The IDF besieges Beirut, forcing Arafat and 14,000 PLO fighters to evacuate to Tunisia. Shortly after, Lebanese Christian militias carry out the horrific <strong>Sabra and Shatila massacres</strong> of Palestinian refugees while the IDF guards the perimeters.</li>
          </ul>
        </div>
      </div>
      <div class="es-timeline-event" onclick="toggleTimeline('es-te11')">
        <div class="es-timeline-date">1987–1991</div>
        <div class="es-timeline-title">The Intifada & The End of the Cold War</div>
        <div class="es-click-hint">Click to reveal events...</div>
        <div id="es-te11" class="es-timeline-details">
          <ul>
            <li><strong>Dec 1987:</strong> An Israeli army truck crashes in Gaza, sparking the <strong>First Intifada</strong> ('shaking off'). This grassroots Palestinian uprising features mass strikes, boycotts, and youths throwing stones at tanks.</li>
            <li><strong>1988:</strong> Israel's harsh 'Iron Fist' military response draws intense international condemnation. The Islamic militant group <strong>Hamas</strong> is founded.</li>
            <li><strong>Dec 1988:</strong> Yasser Arafat addresses the UN in Geneva, historically <strong>renouncing terrorism</strong> and accepting the two-state solution, prompting the USA to finally open dialogue with the PLO.</li>
            <li><strong>1991:</strong> The collapse of the USSR (End of the Cold War) strips Arab states and the PLO of their main funder. The US-led victory in the Gulf War leaves America as the undisputed global superpower, allowing them to pressure both sides to attend the <strong>Madrid Peace Conference</strong>.</li>
          </ul>
        </div>
      </div>
      <div class="es-timeline-event" onclick="toggleTimeline('es-te12')">
        <div class="es-timeline-date">1993–1995</div>
        <div class="es-timeline-title">The Oslo Accords & The Peace Process</div>
        <div class="es-click-hint">Click to reveal events...</div>
        <div id="es-te12" class="es-timeline-details">
          <ul>
            <li><strong>1993:</strong> Frustrated by public stalls, Israeli and PLO negotiators hold secret, back-channel talks in Norway.</li>
            <li><strong>Sept 1993 (Oslo I):</strong> The <strong>Oslo Accords</strong> are signed. Yasser Arafat and Israeli PM Yitzhak Rabin shake hands on the White House lawn, marking official mutual recognition. The <strong>Palestinian National Authority (PNA)</strong> is set up to provide limited self-government in Jericho and Gaza.</li>
            <li><strong>Oct 1994:</strong> Inspired by Oslo, King Hussein signs a full peace treaty between Jordan and Israel.</li>
            <li><strong>Sept 1995 (Oslo II):</strong> The West Bank is divided into Areas A, B, and C, with varying degrees of Palestinian and Israeli control.</li>
            <li><strong>Nov 1995:</strong> The peace process suffers a massive blow when Israeli PM Yitzhak Rabin is assassinated by Yigal Amir, a Jewish religious extremist opposed to giving up land.</li>
          </ul>
        </div>
      </div>
    </div>
'@

# Find start and end indices in generate_embed.ps1
$startHtmlMarker = '    <div class="es-interactive-timeline">'
$endHtmlMarker = '    </div>'

# The old timeline block inside generate_embed.ps1 starts at <div class="es-interactive-timeline">
# and ends at the closing </div> (around line 582) right before:
#     <div class="es-form-group">
#       <label class="es-label">Select Narrative Topic</label>

$genEmbedContent = [System.IO.File]::ReadAllText($genEmbedPath, [System.Text.Encoding]::UTF8)

# To find the exact block, let's look for the first occurrence of $startHtmlMarker
$startHtmlIndex = $genEmbedContent.IndexOf($startHtmlMarker)
$endHtmlIndex = $genEmbedContent.IndexOf("    </div>`r`n    <div class=" + '"es-form-group"', $startHtmlIndex)

if ($startHtmlIndex -ge 0 -and $endHtmlIndex -gt $startHtmlIndex) {
    # Include the closing tag of the timeline div which is at the beginning of the match
    $actualEndIndex = $endHtmlIndex + 10 # length of '    </div>' + newline
    $beforeHtml = $genEmbedContent.Substring(0, $startHtmlIndex)
    $afterHtml = $genEmbedContent.Substring($actualEndIndex)
    
    $genEmbedContent = $beforeHtml + $newHtmlTimeline + $afterHtml
    [System.IO.File]::WriteAllText($genEmbedPath, $genEmbedContent, [System.Text.Encoding]::UTF8)
    Write-Host "Successfully updated generate_embed.ps1 narrative timeline HTML!"
} else {
    Write-Error "Could not find timeline block boundaries in generate_embed.ps1!"
}
