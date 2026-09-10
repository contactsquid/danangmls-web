// TEMPORARY diagnostic: the live site renders ~58 rentals while the source sheet
// has ~4,200. Reports what the CSV fetch actually returns inside the Vercel
// runtime so we can tell truncation from filtering. Delete once resolved.
export const dynamic = 'force-dynamic';

const SPREADSHEET_ID = '14hGuwUcb308n3h1ODyby97WqHa7uRUyyYAKMHgWnyUE';
const URL_RENTALS = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=0`;

function countRows(text: string): number {
  let rows = 0, inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (inQ && text[i + 1] === '"') i++; else inQ = !inQ; }
    else if (c === '\n' && !inQ) rows++;
  }
  return rows;
}

export async function GET() {
  const out: Record<string, unknown> = {};
  for (const mode of ['force-cache', 'no-store'] as const) {
    try {
      const res = await fetch(URL_RENTALS, { cache: mode });
      const text = await res.text();
      out[mode] = {
        status: res.status,
        contentLength: res.headers.get('content-length'),
        chars: text.length,
        rows: countRows(text),
        r2Hits: (text.match(/images\.danang\.homes/g) || []).length,
        head: text.slice(0, 80),
        tail: text.slice(-80),
      };
    } catch (e) {
      out[mode] = { error: String(e).slice(0, 300) };
    }
  }
  return Response.json(out, { headers: { 'cache-control': 'no-store' } });
}
