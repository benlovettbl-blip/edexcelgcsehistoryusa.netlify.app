function calculateHash(bytes) {
  let hash = 0;
  for (let i = 0; i < bytes.length; i++) {
    hash = (hash * 31 + bytes[i]) & 0xFFFFFFFF;
  }
  return hash;
}

function compressBytes(bytes) {
  const dict = new Map();
  const out = [];
  let phrase = [];
  let code = 256;
  
  for (let i = 0; i < bytes.length; i++) {
    const currByte = bytes[i];
    const nextPhrase = phrase.length > 0 ? [...phrase, currByte] : [currByte];
    const nextPhraseKey = nextPhrase.join(',');
    
    if (phrase.length === 0) {
      phrase = [currByte];
    } else if (dict.has(nextPhraseKey)) {
      phrase = nextPhrase;
    } else {
      const phraseKey = phrase.join(',');
      out.push(phrase.length > 1 ? dict.get(phraseKey) : phrase[0]);
      dict.set(nextPhraseKey, code);
      code++;
      phrase = [currByte];
    }
  }
  if (phrase.length > 0) {
    const phraseKey = phrase.join(',');
    out.push(phrase.length > 1 ? dict.get(phraseKey) : phrase[0]);
  }
  
  // Convert 16-bit integer array to binary string
  let binaryStr = "";
  for (let i = 0; i < out.length; i++) {
    const val = out[i];
    binaryStr += String.fromCharCode(val & 0xFF, (val >> 8) & 0xFF);
  }
  
  const b64 = btoa(binaryStr);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decompressToBytes(safeB64) {
  let b64 = safeB64.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) {
    b64 += '=';
  }
  
  const binaryStr = atob(b64);
  const codes = [];
  for (let i = 0; i < binaryStr.length; i += 2) {
    const low = binaryStr.charCodeAt(i);
    const high = binaryStr.charCodeAt(i + 1);
    codes.push(low | (high << 8));
  }
  
  if (codes.length === 0) return new Uint8Array();
  
  const dict = new Map();
  let currByte = codes[0];
  let oldPhrase = [currByte];
  const out = [currByte];
  let code = 256;
  
  for (let i = 1; i < codes.length; i++) {
    const currCode = codes[i];
    let phrase = [];
    if (currCode < 256) {
      phrase = [currCode];
    } else {
      phrase = dict.has(currCode) ? dict.get(currCode) : [...oldPhrase, currByte];
    }
    out.push(...phrase);
    currByte = phrase[0];
    dict.set(code, [...oldPhrase, currByte]);
    code++;
    oldPhrase = phrase;
  }
  return new Uint8Array(out);
}

export function generateSyncCode() {
  const data = {
    mastery: JSON.parse(localStorage.getItem('edexcel_mastery') || '{}'),
    bookmarks: JSON.parse(localStorage.getItem('edexcel_bookmarks') || '[]'),
    past_answers: JSON.parse(localStorage.getItem('edexcel_past_answers') || '{}'),
    past_completed: JSON.parse(localStorage.getItem('edexcel_past_completed') || '[]'),
    deep_thinking: JSON.parse(localStorage.getItem('edexcel_deep_thinking') || '{}'),
    how_useful: JSON.parse(localStorage.getItem('edexcel_how_useful') || '{}'),
    spec_objectives: JSON.parse(localStorage.getItem('edexcel_spec_objectives') || '{}'),
    spec_checklist: JSON.parse(localStorage.getItem('edexcel_spec_checklist') || '{}')
  };
  
  // Compact state: only store mastered IDs that are true to save space
  const masteredKeys = [];
  for (const k in data.mastery) {
    if (data.mastery[k] === true) {
      masteredKeys.push(k);
    }
  }
  data.mastery = masteredKeys;
  
  const jsonStr = JSON.stringify(data);
  const bytes = new TextEncoder().encode(jsonStr);
  const hash = calculateHash(bytes);
  const comp = compressBytes(bytes);
  return comp + '-' + Math.abs(hash).toString(36);
}

export function loadSyncCode(code) {
  const parts = code.trim().split('-');
  if (parts.length !== 2) throw new Error("Invalid sync code format.");
  
  const [comp, hashStr] = parts;
  const bytes = decompressToBytes(comp);
  const hash = calculateHash(bytes);
  if (Math.abs(hash).toString(36) !== hashStr) {
    throw new Error("Integrity check failed. Code may have been typed incorrectly.");
  }
  
  const jsonStr = new TextDecoder().decode(bytes);
  const data = JSON.parse(jsonStr);
  
  const mastery = {};
  if (Array.isArray(data.mastery)) {
    data.mastery.forEach(k => {
      mastery[k] = true;
    });
  } else if (data.mastery) {
    Object.assign(mastery, data.mastery);
  }
  
  localStorage.setItem('edexcel_mastery', JSON.stringify(mastery));
  localStorage.setItem('edexcel_bookmarks', JSON.stringify(data.bookmarks || []));
  localStorage.setItem('edexcel_past_answers', JSON.stringify(data.past_answers || {}));
  localStorage.setItem('edexcel_past_completed', JSON.stringify(data.past_completed || []));
  localStorage.setItem('edexcel_deep_thinking', JSON.stringify(data.deep_thinking || {}));
  localStorage.setItem('edexcel_how_useful', JSON.stringify(data.how_useful || {}));
  localStorage.setItem('edexcel_spec_objectives', JSON.stringify(data.spec_objectives || {}));
  localStorage.setItem('edexcel_spec_checklist', JSON.stringify(data.spec_checklist || {}));
  
  return true;
}
