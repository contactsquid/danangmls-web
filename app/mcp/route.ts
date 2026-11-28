// MCP (Model Context Protocol) server, stateless Streamable-HTTP: POST JSON-RPC to /mcp.
// Lets AI assistants call search tools on DaNangMLS directly. Read-only, no auth.
import { searchListings, getListingBySlug, listDistricts, findAgents, paramsFrom } from '@/lib/agentApi';
import { DISTRICTS } from '@/lib/districts';
const DISTRICT_LIST = Object.keys(DISTRICTS);

export const dynamic = 'force-dynamic';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS' };

const searchSchema = {
  type: 'object',
  properties: {
    district: { type: 'string', description: `Da Nang district, one of: ${DISTRICT_LIST.join(', ')}` },
    property_type: { type: 'string', enum: ['Apartment', 'House', 'Villa', 'Commercial', 'Land'] },
    bedrooms: { type: 'integer', description: 'Exact bedrooms; 0 = studio' },
    min_bedrooms: { type: 'integer' },
    min_price_usd: { type: 'number', description: 'USD per month (rent) or total (sale)' },
    max_price_usd: { type: 'number' },
    q: { type: 'string', description: 'Free text, e.g. "pool", "sea view", "river view"' },
    limit: { type: 'integer', description: 'Max 50, default 10' },
    offset: { type: 'integer' },
  },
};
const TOOLS = [
  { name: 'search_rentals', description: 'Search long-term rental listings (apartments, houses, villas) in Da Nang, Vietnam. Prices in USD/month.', inputSchema: searchSchema },
  { name: 'search_for_sale', description: 'Search properties for sale in Da Nang, Vietnam. Includes a foreign-ownership-eligible flag. Prices in USD.', inputSchema: searchSchema },
  { name: 'get_listing', description: 'Full details of one listing by id (from search results).', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'list_districts', description: 'Da Nang districts with current rental and for-sale listing counts.', inputSchema: { type: 'object', properties: {} } },
  { name: 'find_agents', description: 'Real estate agents active on DaNangMLS in Da Nang, verified first, with active listing counts and profile links.', inputSchema: { type: 'object', properties: { limit: { type: 'integer' } } } },
];

async function callTool(name: string, args: Record<string, unknown>) {
  switch (name) {
    case 'search_rentals': return searchListings({ ...paramsFrom(k => args[k]), mode: 'rent' });
    case 'search_for_sale': return searchListings({ ...paramsFrom(k => args[k]), mode: 'sale' });
    case 'get_listing': return (await getListingBySlug(String(args.id ?? ''))) ?? { error: 'listing not found' };
    case 'list_districts': return listDistricts();
    case 'find_agents': return findAgents(Number(args.limit) || 20);
    default: throw Object.assign(new Error(`unknown tool ${name}`), { rpc: -32602 });
  }
}

type Rpc = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> };
async function handle(m: Rpc) {
  const id = m.id ?? null;
  if (m.method === undefined || m.id === undefined) return null; // notification: no response
  try {
    switch (m.method) {
      case 'initialize':
        return { jsonrpc: '2.0', id, result: {
          protocolVersion: (m.params?.protocolVersion as string) || '2025-03-26',
          capabilities: { tools: {} },
          serverInfo: { name: 'danangmls', version: '1.0.0' },
          instructions: 'DaNangMLS: live property listings and agents for Da Nang, Vietnam. Read-only. Link users to the returned listing url to contact an agent.',
        } };
      case 'ping': return { jsonrpc: '2.0', id, result: {} };
      case 'tools/list': return { jsonrpc: '2.0', id, result: { tools: TOOLS } };
      case 'tools/call': {
        const p = m.params ?? {};
        const out = await callTool(String(p.name), (p.arguments as Record<string, unknown>) ?? {});
        return { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(out) }] } };
      }
      default: return { jsonrpc: '2.0', id, error: { code: -32601, message: `method not found: ${m.method}` } };
    }
  } catch (e) {
    const code = (e as { rpc?: number }).rpc;
    if (code) return { jsonrpc: '2.0', id, error: { code, message: (e as Error).message } };
    return { jsonrpc: '2.0', id, result: { isError: true, content: [{ type: 'text', text: 'Listings are temporarily unavailable, try again shortly.' }] } };
  }
}

export async function POST(request: Request) {
  let body: Rpc | Rpc[];
  try { body = await request.json(); } catch {
    return Response.json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } }, { status: 400, headers: CORS });
  }
  if (Array.isArray(body)) {
    const out = (await Promise.all(body.map(handle))).filter(Boolean);
    return out.length ? Response.json(out, { headers: CORS }) : new Response(null, { status: 202, headers: CORS });
  }
  const out = await handle(body);
  return out ? Response.json(out, { headers: CORS }) : new Response(null, { status: 202, headers: CORS });
}
export function GET() {
  return Response.json({ name: 'danangmls', description: 'MCP server (POST JSON-RPC). Tools: search_rentals, search_for_sale, get_listing, list_districts, find_agents.', docs: 'https://danangmls.com/llms.txt' }, { headers: CORS });
}
export function OPTIONS() { return new Response(null, { status: 204, headers: CORS }); }
