import 'server-only';

import { getListings, getForSaleListings } from './sheets';
import { normalizeAgentName } from './agents';

/**
 * Finds the names an agent's listings are actually posted under, so claiming can
 * be "search, look at three of your properties, confirm" instead of "type a
 * string exactly and hope".
 *
 * The agent cannot be expected to know the exact spelling: these names come from
 * scraped Facebook posts and carry emoji, inconsistent casing and stray spacing.
 * So we group by the normalised form and hand back the most common raw spelling
 * as the label.
 */

export interface ListingPreview {
  slug: string;
  title: string;
  price: string;
  district: string;
  image: string | null;
  forSale: boolean;
}

export interface NameCandidate {
  /** The raw spelling to store on the profile — the most common variant. */
  name: string;
  /** Every listing under this name, counting all spelling variants. */
  count: number;
  /** Up to three, newest first, for the agent to eyeball. */
  samples: ListingPreview[];
}

const MAX_CANDIDATES = 5;
const SAMPLES = 3;

export async function searchAgentNames(query: string): Promise<NameCandidate[]> {
  const q = normalizeAgentName(query);
  if (q.length < 2) return [];

  const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);
  const all = [...rentals, ...forSale];

  // normalised name -> its listings, plus a tally of raw spellings so the label
  // we show is the one the agent will recognise.
  const groups = new Map<string, { spellings: Map<string, number>; listings: typeof all }>();

  for (const listing of all) {
    const key = normalizeAgentName(listing.agent);
    if (!key || !key.includes(q)) continue;

    let group = groups.get(key);
    if (!group) {
      group = { spellings: new Map(), listings: [] };
      groups.set(key, group);
    }
    const raw = (listing.agent ?? '').trim();
    group.spellings.set(raw, (group.spellings.get(raw) ?? 0) + 1);
    group.listings.push(listing);
  }

  return [...groups.values()]
    .sort((a, b) => b.listings.length - a.listings.length)
    .slice(0, MAX_CANDIDATES)
    .map(group => {
      const name = [...group.spellings.entries()].sort((a, b) => b[1] - a[1])[0][0];
      const samples = [...group.listings]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        // A card with no photo tells the agent nothing, so prefer ones that have
        // an image when choosing what to show.
        .sort((a, b) => (b.images.length ? 1 : 0) - (a.images.length ? 1 : 0))
        .slice(0, SAMPLES)
        .map(l => ({
          slug: l.slug,
          title: l.title,
          price: l.price,
          district: l.district,
          image: l.images[0] ?? null,
          forSale: l.forSale,
        }));

      return { name, count: group.listings.length, samples };
    });
}
