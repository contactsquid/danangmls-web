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
  /**
   * 'exact' = the typed text appears in this name after normalising case/
   * spacing/emoji. 'similar' = it didn't, but the two names are made of the
   * same words — the case that sent us here: an agent typed "Cuong Phan
   * Viet" (English order, no diacritics) while the sheet has "Phan Việt
   * Cường" (Vietnamese order, with diacritics). Same three words, different
   * order and script, so plain substring matching finds nothing.
   */
  matchType: 'exact' | 'similar';
}

const MAX_CANDIDATES = 5;
const MAX_SIMILAR = 3;
const SAMPLES = 3;

/** Strips Vietnamese diacritics so "Việt" and "Viet" compare equal.
 *  đ/Đ don't decompose under NFD (they're their own base letter, not a
 *  letter+combining-mark), so they need a manual pass first. */
function stripDiacritics(s: string): string {
  return s
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** A word-order- and script-independent fingerprint: normalise, drop
 *  diacritics, split into words, sort them. Vietnamese names commonly get
 *  re-ordered when written "the English way" (given name first instead of
 *  family name first) — sorting the words absorbs that along with the
 *  diacritics difference, so "Cuong Phan Viet" and "Phan Việt Cường" (or
 *  "Cường Phan Việt") all collapse to the same signature. */
function nameSignature(name: string): string {
  return stripDiacritics(normalizeAgentName(name))
    .split(' ')
    .filter(Boolean)
    .sort()
    .join(' ');
}

/** Jaccard similarity of the two names' word sets — used when the sorted
 *  signatures don't match outright but still share most of their words
 *  (e.g. a dropped middle name). */
function wordOverlap(a: string, b: string): number {
  const wordsA = new Set(a.split(' ').filter(Boolean));
  const wordsB = new Set(b.split(' ').filter(Boolean));
  if (!wordsA.size || !wordsB.size) return 0;
  let shared = 0;
  for (const w of wordsA) if (wordsB.has(w)) shared++;
  return shared / new Set([...wordsA, ...wordsB]).size;
}

const SIMILAR_THRESHOLD = 0.5;

export async function searchAgentNames(query: string): Promise<NameCandidate[]> {
  const q = normalizeAgentName(query);
  if (q.length < 2) return [];
  const qSignature = nameSignature(query);

  const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);
  const all = [...rentals, ...forSale];

  // normalised name -> its listings, plus a tally of raw spellings so the label
  // we show is the one the agent will recognise.
  const groups = new Map<string, { spellings: Map<string, number>; listings: typeof all }>();

  for (const listing of all) {
    const key = normalizeAgentName(listing.agent);
    if (!key) continue;

    let group = groups.get(key);
    if (!group) {
      group = { spellings: new Map(), listings: [] };
      groups.set(key, group);
    }
    const raw = (listing.agent ?? '').trim();
    group.spellings.set(raw, (group.spellings.get(raw) ?? 0) + 1);
    group.listings.push(listing);
  }

  const toCandidate = (key: string, group: { spellings: Map<string, number>; listings: typeof all }, matchType: NameCandidate['matchType']): NameCandidate => {
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

    return { name, count: group.listings.length, samples, matchType };
  };

  const exact: NameCandidate[] = [];
  const similar: { candidate: NameCandidate; overlap: number }[] = [];

  for (const [key, group] of groups) {
    if (key.includes(q)) {
      exact.push(toCandidate(key, group, 'exact'));
      continue;
    }

    const signature = nameSignature(key);
    const overlap = signature === qSignature ? 1 : wordOverlap(signature, qSignature);
    if (overlap >= SIMILAR_THRESHOLD) {
      similar.push({ candidate: toCandidate(key, group, 'similar'), overlap });
    }
  }

  exact.sort((a, b) => b.count - a.count);
  similar.sort((a, b) => b.overlap - a.overlap || b.candidate.count - a.candidate.count);

  return [
    ...exact.slice(0, MAX_CANDIDATES),
    ...similar.slice(0, MAX_SIMILAR).map(s => s.candidate),
  ];
}
