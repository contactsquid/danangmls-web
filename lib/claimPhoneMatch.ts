import { normalizeVnPhone } from '@/lib/agentContact';
import { normalizeAgentName } from '@/lib/agents';
import type { Listing } from '@/lib/types';

/**
 * Phone evidence for a listing-name claim. Names can differ between the account
 * and the poster, so we compare the claimant's profile phone with the number the
 * scraper pulled from each claimed listing's raw post text (Listing.agentPhone,
 * rentals only). A match is supporting evidence, not proof of ownership.
 */
export interface ClaimPhoneEvidence {
  /** Claimed listings (rentals) that have a scraped number. */
  withPhone: number;
  /** Of those, how many carry the claimant's profile phone. */
  matching: number;
  /** Other poster names whose listings carry the claimant's phone. */
  otherNames: string[];
}

export function claimPhoneEvidence(
  claimedName: string,
  profilePhone: string | null | undefined,
  listings: Listing[],
): ClaimPhoneEvidence | null {
  const phone = normalizeVnPhone(profilePhone ?? '');
  if (!phone) return null;
  const target = normalizeAgentName(claimedName);
  let withPhone = 0;
  let matching = 0;
  const others = new Set<string>();
  for (const l of listings) {
    if (!l.agentPhone) continue;
    if (normalizeAgentName(l.agent) === target) {
      withPhone++;
      if (l.agentPhone === phone) matching++;
    } else if (l.agentPhone === phone && l.agent) {
      others.add(l.agent);
    }
  }
  return { withPhone, matching, otherNames: [...others].slice(0, 5) };
}

export function describePhoneEvidence(e: ClaimPhoneEvidence | null): string {
  if (!e) return 'No phone on the profile to compare';
  if (e.withPhone === 0) return 'None of the claimed listings has a scraped phone number';
  return `Profile phone matches ${e.matching} of ${e.withPhone} claimed listings that have a number`;
}
