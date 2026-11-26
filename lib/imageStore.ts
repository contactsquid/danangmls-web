// danangmls.com has no image-store module of its own (its upload code builds R2 keys
// inline). This holds only what the shared agent-ownership rule needs, so
// lib/agentOwnership.ts and lib/imageStore.test.ts are byte-identical across the MLS sites.
export const IMAGE_HOST = 'https://images.danang.homes';

/** Portal-upload folders of all four MLS sites. They share one bucket and one agent
 *  profile pool, and each site builds the folder name from the SIGNED-IN profile's
 *  slug server-side, so a photo under any of them proves which profile posted it.
 *  (danangmls.com predates city prefixes, hence the bare `agent-listings/`.) */
const PORTAL_UPLOAD_URLS = ['agent-listings', 'saigon-agent-listings', 'hanoi-agent-listings', 'lotus-agent-listings']
  .map(dir => `${IMAGE_HOST}/${dir}/`);

/** The profile slug that posted a listing through any MLS site's portal, or null. */
export function portalUploaderSlug(images: string[]): string | null {
  for (const url of images) {
    for (const prefix of PORTAL_UPLOAD_URLS) {
      if (!url.startsWith(prefix)) continue;
      const rest = url.slice(prefix.length);
      const slash = rest.indexOf('/');
      if (slash > 0) return rest.slice(0, slash);
    }
  }
  return null;
}
