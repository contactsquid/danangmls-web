// The For Sale enrichment AI sometimes echoed its own numbered instructions into
// the description (fixed at the source in n8n on 2026-09-28; ~109 live listings
// were already affected, in all four languages):
//   "1. Translate into English and write a better version:"   (opening label)
//   "2. At the end of the description please use our contact details:"  (before the
//      Da Nang Homes contact block, which is intended and stays)
// Stripped when the sheet is read, so the site never shows them (Blake, 2026-09-28).

// "1. <label mentioning translation>:" or "." at the very start.
const LEAD = /^\s*1\.\s*[^\n:.]*?(?:translat|dịch|번역|перевод)[^\n:.]*[:.][ \t]*\n?/iu;
// The "2. At the end of the description … contact details:" line, any language.
const CONTACT_LINE = /^[ \t]*2\.[ \t]*(?:at the end of the description|cuối (?:phần )?mô tả|설명 마지막|в конце описания)[^\n]*\n?/gimu;

// "ORIGINAL: <source-language headline>" followed by "BETTER TRANSLATION: <English headline>"
// (Blake, 2026-10-21, listing fv6qfr): drop the ORIGINAL line, keep the English after the
// label. Only when both labels are present, so a legitimate "Original" word is left alone.
const ORIGINAL_BLOCK = /^[ \t*]*original[ \t*]*:[^\n]*\n+(?=[ \t*]*(?:better|improved)?[ \t]*translation)/gimu;
const TRANSLATION_LABEL = /^([ \t*]*)(?:better|improved|english)?[ \t]*translation[ \t*]*:[ \t*]*/gimu;

export function stripPromptEcho(text: string): string {
  if (!text) return text;
  let out = text.replace(LEAD, '').replace(CONTACT_LINE, '');
  if (/^[ \t*]*original[ \t*]*:/im.test(out)) out = out.replace(ORIGINAL_BLOCK, '').replace(TRANSLATION_LABEL, '$1');
  return out === text ? text : out.trim();
}
