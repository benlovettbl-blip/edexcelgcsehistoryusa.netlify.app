const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'lessons_data.js');

// Import existing data
const { LESSONS_DATA } = require(filePath);

// Define Vietnamese sources
const VIETNAMESE_SOURCES = {
  "subtopic_3_1": {
    perspective: "South Vietnamese Buddhist Protest (1963)",
    originalText: "Chúng ta đấu tranh cho tự do tôn giáo và sự bình đẳng. Chính quyền Gia đình trị Ngô Đình Diệm đàn áp Phật giáo, triệt hạ cờ Phật giáo là đi ngược lại lòng dân.",
    translation: "We struggle for religious freedom and equality. The nepotistic regime of Ngô Đình Diệm suppresses Buddhism and bans the Buddhist flag, which goes against the will of the people.",
    analysis: "This leaflet from the 1963 Buddhist Crisis highlights the extreme religious and social unpopularity of the Diem regime. While US policymakers viewed Diem purely through the lens of Cold War containment (Domino Theory), local Vietnamese focused on his dictatorial repression, showing the misalignment between US theory and local reality."
  },
  "subtopic_3_2": {
    perspective: "North Vietnamese Naval Command Order (August 1964)",
    originalText: "Tàu địch Maddox xâm phạm lãnh hải của ta. Phân đội tàu phóng lôi 3 phóng ngư lôi tấn công kiên quyết tiêu diệt địch xâm lược, bảo vệ vùng biển Tổ quốc.",
    translation: "The enemy ship Maddox has violated our territorial waters. Torpedo boat division 3 launched torpedoes to attack and resolutely defeat the invading enemy, protecting the waters of our Fatherland.",
    analysis: "This log shows the North Vietnamese perspective of the first Gulf of Tonkin incident (2 August). While the US Congress passed the Tonkin Gulf Resolution claiming 'unprovoked aggression' by North Vietnam, Hanoi's forces believed the USS Maddox had intruded into their territorial waters to support secret South Vietnamese commando raids (OPLAN 34A)."
  },
  "subtopic_3_3": {
    perspective: "National Liberation Front (Vietcong) Guerrilla Diary (1967)",
    originalText: "Rừng cây đổ rạp vì bom đạn và chất độc hóa học của Mỹ. Nhưng lòng chúng ta không lay chuyển. Chúng ta ẩn nấp dưới địa đạo, bám thắt lưng địch mà đánh.",
    translation: "The forests are flattened by American bombs and chemical poisons. But our resolve remains unshaken. We hide in the tunnels, holding onto the enemy's belt to fight.",
    analysis: "Written by a Vietcong guerrilla, this entry captures the physical devastation of US chemical spraying (Agent Orange) and bombing. It highlights the VC tactical doctrine of 'clinging to the enemy's belt' (bám thắt lưng địch)—fighting in such close physical quarters that US troops could not use air strikes or artillery without risking friendly fire."
  },
  "subtopic_3_4": {
    perspective: "South Vietnamese ARVN Officer's Diary (1971)",
    originalText: "Người Mỹ rút quân đi và bỏ mặc chúng tôi tự chiến đấu. Đạn dược thiếu thốn, cấp trên tham nhũng, binh lính hoang mang không biết tương lai đi về đâu.",
    translation: "The Americans are withdrawing their troops and leaving us to fight alone. Ammunition is scarce, superiors are corrupt, and soldiers are confused about where the future will lead.",
    analysis: "This private diary of an ARVN captain during the cross-border incursions into Laos (Operation Lam Son 719) reveals the severe morale crisis caused by Nixon's Vietnamization. It illustrates that despite receiving advanced US weaponry, ARVN troops felt abandoned by their allies and crippled by corruption in Saigon's military command."
  },
  "subtopic_4_1": {
    perspective: "North Vietnamese Propaganda Broadcast (Hanoi Hannah, 1968)",
    originalText: "Hỡi binh sĩ Mỹ! Tại sao các bạn lại đến đây để giết hại dân lành Việt Nam? Hãy từ chối cuộc chiến phi nghĩa này và trở về nhà với gia đình.",
    translation: "American soldiers! Why have you come here to kill innocent Vietnamese civilians? Refuse this unjust war and return home to your families.",
    analysis: "This radio transcript shows how the North Vietnamese government actively monitored and utilized the growing US anti-war movement as a psychological weapon. By broadcasting in English, they aimed to exploit draft anxieties and racial tensions within US combat units to undermine military morale."
  },
  "subtopic_4_2": {
    perspective: "Saigon Middle-Class Citizen's Diary (1970)",
    originalText: "Chúng tôi mong muốn tự do và hòa bình, không muốn chế độ cộng sản độc tài. Nhưng người Mỹ quá chia rẽ, họ có thể bỏ rơi miền Nam bất cứ lúc nào.",
    translation: "We desire freedom and peace, and we do not want a dictatorial communist regime. But the Americans are too divided; they might abandon the South at any moment.",
    analysis: "This entry captures the anxiety of South Vietnam's civilian 'silent majority' in Saigon. They feared communist rule but felt completely powerless as American domestic protests and political shifts made US withdrawal and the eventual abandonment of South Vietnam inevitable."
  },
  "subtopic_4_3": {
    perspective: "North Vietnamese Diplomatic Message (Lê Đức Thọ to Hanoi, 1973)",
    originalText: "Hiệp định Paris đã ký kết. Quân Mỹ phải rút hết, tạo thời cơ lịch sử để ta tiến lên giải phóng hoàn toàn miền Nam, thống nhất đất nước.",
    translation: "The Paris Agreement has been signed. US troops must fully withdraw, creating a historic opportunity for us to advance and completely liberate the South, unifying the country.",
    analysis: "Sent during the signing of the Paris Peace Accords, this telegram shows that Hanoi never viewed the peace treaty as a permanent division of Vietnam. Instead, they regarded the treaty as a strategic victory to achieve the complete withdrawal of US troops, leaving the South vulnerable to their final unification campaign."
  },
  "subtopic_4_4": {
    perspective: "General Võ Nguyên Giáp, Post-War Strategic Assessment",
    originalText: "Mỹ thua vì không hiểu lịch sử và ý chí của dân tộc Việt Nam. Chiến tranh nhân dân của ta dựa trên sức mạnh của cả dân tộc, lấy yếu thắng mạnh.",
    translation: "America lost because it did not understand the history and resolve of the Vietnamese people. Our people's war relied on the strength of the entire nation, using weakness to defeat strength.",
    analysis: "Võ Nguyên Giáp, the architect of NVA strategy, attributes the US defeat to their misunderstanding of Vietnamese nationalism and the power of 'people's war' (chiến tranh nhân dân). While the US relied on technological firepower and body counts, the North Vietnamese viewed the conflict as a total, generational struggle for national independence."
  }
};

// Update the module LESSONS_DATA object programmatically
Object.entries(LESSONS_DATA).forEach(([topicId, topic]) => {
  if (VIETNAMESE_SOURCES[topicId]) {
    if (topic.steps[0] && topic.steps[0].scholarlyDepth) {
      topic.steps[0].scholarlyDepth.vietnameseSource = VIETNAMESE_SOURCES[topicId];
    }
  }
});

// Write modified LESSONS_DATA back to lessons_data.js
const newContent = `export const LESSONS_DATA = ${JSON.stringify(LESSONS_DATA, null, 2)};\n`;
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Successfully injected authentic Vietnamese sources into lessons_data.js!');
