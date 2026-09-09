// Running costs — the electricity, water and service rates a Vietnamese landlord
// states as a matter of course, and the single biggest unknown for an expat renting
// here. properly.vn puts them on every listing; we can recover them from the text.
//
// Measured 2026-09-09: 3.2% of enriched Sheet1 rows carry any of this, against
// 37.5% of RAW staging posts (n=32) — the enrichment prompt compresses each post to
// "2-4 sentences" and throws the rest away. Raising that number is a change to the
// n8n prompt, not to this file; this parser reads whatever survives.

export interface CostAmount { amount?: number; per?: string; note?: string }
export interface RunningCosts {
  electricity?: CostAmount;
  water?: CostAmount;
  service?: CostAmount;
  deposit?: { months: number };
  lease?: { months: number };
}

/** "4k" -> 4000, "3.500đ" -> 3500, "1tr" -> 1000000. Vietnamese groups with dots. */
function vnd(raw: string, unit?: string): number {
  let v = Number(String(raw).replace(/[.,]/g, ''));
  if (!Number.isFinite(v)) return NaN;
  if (unit && /^(k|nghìn|ngàn)$/i.test(unit)) v *= 1_000;
  else if (unit && /^(tr|triệu|m)$/i.test(unit)) v *= 1_000_000;
  return v;
}

const MONEY = String.raw`(\d[\d.,]*)\s*(k|nghìn|ngàn|tr|triệu|m|đ|vnd|₫)?`;

export function extractRunningCosts(text?: string | null): RunningCosts | null {
  const t = String(text || '').replace(/\s+/g, ' ');
  if (!t) return null;
  const out: RunningCosts = {};

  let m = t.match(new RegExp(String.raw`(?:điện|dien|electric(?:ity)?)\D{0,12}` + MONEY + String.raw`\s*(?:/|per|\s)\s*(kwh|số|so|unit)`, 'i'));
  if (m) out.electricity = { amount: vnd(m[1], m[2]), per: /kwh/i.test(m[3]) ? 'kWh' : 'unit' };
  else if (/điện\s*(nhà\s*nước|state)/i.test(t)) out.electricity = { note: 'state rate' };

  m = t.match(new RegExp(String.raw`(?:nước|nuoc|water)\D{0,12}` + MONEY + String.raw`\s*(?:/|per|\s)\s*(người|nguoi|person|khối|m3|month|tháng)`, 'i'));
  if (m) {
    const per = /ngườ|nguoi|person/i.test(m[3]) ? 'person' : /khối|m3/i.test(m[3]) ? 'm³' : 'month';
    out.water = { amount: vnd(m[1], m[2]), per };
  } else if (/nước\s*(theo\s*)?(đồng\s*hồ)|water[^.]{0,20}meter/i.test(t)) out.water = { note: 'metered' };

  m = t.match(new RegExp(String.raw`(?:phí\s*dịch\s*vụ|phí\s*quản\s*lý|quản\s*lý|service\s*(?:fee|charge)|management\s*fee)\D{0,12}` + MONEY, 'i'));
  if (m) out.service = { amount: vnd(m[1], m[2]), per: 'month' };

  m = t.match(/(?:đặt\s*cọc|cọc|deposit)\D{0,8}(\d+)\s*(tháng|thang|month)/i);
  if (m) out.deposit = { months: Number(m[1]) };

  m = t.match(/(?:hđ|hợp\s*đồng|contract|lease)\D{0,8}(\d+)\s*(tháng|thang|month|năm|year)/i);
  if (m) out.lease = { months: /năm|year/i.test(m[2]) ? Number(m[1]) * 12 : Number(m[1]) };

  // Reject anything that parsed to a nonsense figure rather than showing it.
  for (const k of ['electricity', 'water', 'service'] as const) {
    const c = out[k];
    if (c?.amount !== undefined && (!Number.isFinite(c.amount) || c.amount <= 0 || c.amount > 50_000_000)) delete out[k];
  }
  return Object.keys(out).length ? out : null;
}

/** "4.000 ₫" — Vietnamese grouping, which is what a tenant here expects to read. */
export function formatVnd(n: number): string {
  return `${n.toLocaleString('vi-VN')} ₫`;
}
