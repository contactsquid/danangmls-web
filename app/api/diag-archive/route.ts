import { getArchivedListing } from '@/lib/archive';
import { getListings, getForSaleListings } from '@/lib/sheets';
import { relativeTime } from '@/lib/relativeTime';
import { getDistrict, districtCopy } from '@/lib/districts';

// TEMPORARY: archived listing pages 500 in production but render locally.
// Runs the page's own steps one at a time and reports which throws.
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get('slug') || '';
  const steps: Record<string, unknown> = {};
  const step = async (name: string, fn: () => unknown) => {
    try { steps[name] = { ok: true, value: JSON.stringify(await fn())?.slice(0, 160) }; }
    catch (e) { steps[name] = { ok: false, error: String(e).slice(0, 400) }; }
  };

  let listing: Awaited<ReturnType<typeof getArchivedListing>> = null;
  await step('rawFetch', async () => {
    const r = await fetch(`https://images.danang.homes/archive/${slug}.json`, { cache: 'no-store' });
    return { status: r.status, ct: r.headers.get('content-type'), len: (await r.text()).length };
  });
  await step('getArchivedListing', async () => { listing = await getArchivedListing(slug); return listing?.slug ?? null; });
  await step('relativeTime', () => listing && relativeTime(listing.date, 'en'));
  await step('districtCopy', () => {
    const d = listing && getDistrict(listing.district);
    return d ? districtCopy(d, 'en').name : null;
  });
  await step('getAllListings', async () => {
    const [a, b] = await Promise.allSettled([getListings(), getForSaleListings()]);
    return { rent: a.status === 'fulfilled' ? a.value.length : a.status,
             sale: b.status === 'fulfilled' ? b.value.length : b.status };
  });
  await step('listingShape', () => listing && Object.keys(listing));

  return Response.json({ slug, steps }, { headers: { 'cache-control': 'no-store' } });
}
