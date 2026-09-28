// Bedrooms / bathrooms dropdowns for the agent listing forms (Blake, 2026-09-28).
// Shared by the forms (client) and lib/listingSubmit.ts (server), so no server-only
// imports here.

/** A studio is stored as "0", like scraped studios, so the site's bedroom filters
 *  keep working; the form shows it as "Studio". Top options are open-ended. */
export const BEDROOM_OPTIONS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'] as const;
export const BATHROOM_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8+'] as const;

/** Homes have rooms; land and commercial space don't, so the form hides both fields
 *  for them and doesn't require them. */
const ROOMED_TYPES = new Set(['House', 'Apartment', 'Villa', 'Townhouse', 'Studio']);
export const needsRooms = (propertyType: string) => ROOMED_TYPES.has(propertyType);
