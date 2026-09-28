// Sale descriptions came through enrichment with the scraped agent's own phone/Zalo
// still in them ("Please contact via Zalo 0763 670 375…"), next to the Da Nang Homes
// contact block. Blake (2026-09-28): remove the agent numbers. We drop the whole
// sentence (or line) carrying one — deleting just the digits leaves "contact via
// Zalo for more details." The Da Nang Homes number is always kept.

const KEEP = new Set(['0973747373']);   // Da Nang Homes: +84 973 747 373

// Vietnamese numbers only: mobiles 03/05/07/08/09 + 8 digits, landlines 02 + 9 digits,
// optionally written +84…; digits may be split by spaces, dots or dashes.
const PHONE = /(?<![\d.,])(?:\+?84[\s.\-]?|0)(?:[\s.\-]?\d){8,10}(?![\d,])/g;

function agentNumbers(s: string): boolean {
  for (const m of s.matchAll(PHONE)) {
    const d = m[0].replace(/\D/g, '').replace(/^84/, '0');
    const real = /^0[35789]\d{8}$/.test(d) || /^02\d{9}$/.test(d);
    if (real && !KEEP.has(d)) return true;
  }
  return false;
}

// Sentences end at . ! ? followed by space, or start at a contact emoji. Decimals
// ("2.55 billion") have no space after the dot, so they don't split.
const SENTENCE = /(?<=[.!?])\s+|\s+(?=[☎📞📱📲✆📜☏])/u;

// A bare person's name: up to 4 capitalised words (titles allowed), no digits.
const isName = (s: string) => {
  const t = s.replace(/\u0000/g, ' ').trim();
  return !/\d/.test(t) && /^(?:(?:Mr|Mrs|Ms|Dr)\.?\s+)?(?:\p{Lu}[\p{L}'’]*\s*){1,4}$/u.test(t);
};

// Pieces inside one sentence: " - ", " – ", " | ", "; ".
const PIECE = /\s+[-–|]\s+|;\s*/;

export function stripAgentPhones(text: string): string {
  if (!text || !agentNumbers(text)) return text;
  return text
    .split('\n')
    .map(line => {
      if (!agentNumbers(line)) return line;
      // "Mrs. Tram Anh" is one sentence: shield titles from the splitter.
      const shielded = line.replace(/\b(Mr|Mrs|Ms|Dr)\.\s+/g, '$1.\u0000');
      const kept = shielded.split(SENTENCE)
        .map(sentence => {
          if (!agentNumbers(sentence)) return sentence;
          // Some agents write the whole listing as one "a - b - c" line: drop only
          // the piece with the number, not the whole thing.
          const parts = sentence.split(PIECE);
          if (parts.length === 1) return '';
          const phone = parts.map(agentNumbers);
          // …and the agent's name beside the number ("0935 1010 61 – Mrs. Tram Anh").
          return parts.filter((p, i) => !phone[i] && !(isName(p) && (phone[i - 1] || phone[i + 1]))).join(' - ');
        })
        .filter(Boolean)
        .join(' ').replace(/\u0000/g, ' ').trim();
      return kept || null;                        // null = a line we emptied: drop it
    })
    .filter((line): line is string => line !== null)
    .join('\n')
    .trim();
}
