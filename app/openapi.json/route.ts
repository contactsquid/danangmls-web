export const dynamic = 'force-static';
const params = ['mode:rent|sale', 'district', 'property_type', 'bedrooms', 'min_bedrooms', 'min_price_usd', 'max_price_usd', 'q', 'limit', 'offset', 'id']
  .map(s => { const [name, en] = s.split(':'); return { name, in: 'query', required: false, schema: en ? { type: 'string', enum: en.split('|') } : { type: 'string' } }; });
export function GET() {
  return Response.json({
    openapi: '3.1.0',
    info: { title: 'DaNangMLS listings API', version: '1.0.0', description: 'Read-only property listings and agents for Da Nang, Vietnam.' },
    servers: [{ url: 'https://danangmls.com' }],
    paths: {
      '/api/v1/listings': { get: { summary: 'Search rentals/for-sale, or fetch one listing with ?id=', parameters: params, responses: { '200': { description: 'JSON results' } } } },
      '/api/v1/agents': { get: { summary: 'Agents active in Da Nang', parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { '200': { description: 'JSON agents' } } } },
    },
  }, { headers: { 'Access-Control-Allow-Origin': '*' } });
}
