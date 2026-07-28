// Blog posts cross-promoted on the danangmls.com homepage. The posts themselves
// live on danang.homes/blog/<slug> — danangmls.com doesn't host a blog.
//
// The pool is fetched live from danang.homes/api/blog (see fetchBlogPool) so it
// always reflects what's actually published, and the homepage shows a random 3
// of them (reshuffled per page load) to feel dynamic. FEATURED_BLOG_POSTS below
// is only a hard-coded fallback used if that fetch ever fails.

export interface FeaturedBlogPost {
  slug: string;
  title: string;
  vi_title?: string | null;
  date: string;
  excerpt: string;
  vi_excerpt?: string | null;
  image: string;
}

export const BLOG_BASE_URL = 'https://danang.homes/blog';
export const BLOG_FEED_URL = 'https://danang.homes/api/blog';

// Fallback pool if the live feed is unreachable. A few evergreen posts.
export const FEATURED_BLOG_POSTS: FeaturedBlogPost[] = [
  {
    slug: 'understanding-your-lease-foreigners-guide-to-rental-contracts',
    title: "Understanding Your Lease: A Foreigner's Guide to Rental Contracts & Payments in Da Nang",
    date: '2026-05-25',
    excerpt: "A practical guide for foreigners on understanding lease agreements, payment terms, and tenant rights when renting property in Da Nang.",
    image: 'https://images.danang.homes/blog/understanding-your-lease-foreigners-guide-to-rental-contracts.jpg',
  },
  {
    slug: 'renting-in-da-nang-essential-checks-before-signing',
    title: 'Renting in Da Nang: Essential Checks Before You Sign',
    date: '2026-05-25',
    excerpt: 'Essential checks for foreigners renting in Da Nang to avoid common problems like mold, noise, and agent issues before signing a lease.',
    image: 'https://images.danang.homes/blog/renting-in-da-nang-essential-checks-before-signing.jpg',
  },
  {
    slug: 'renting-in-da-nang-agents-on-facebook-vs-trusted-professionals',
    title: 'Renting in Da Nang: Agents on Facebook vs. Trusted Professionals',
    date: '2026-03-24',
    excerpt: 'Navigating the Da Nang rental market can be tricky. This post breaks down the pros and cons of using casual Facebook agents versus dedicated, licensed real estate agents for your next home.',
    image: 'https://images.danang.homes/blog/renting-in-da-nang-agents-on-facebook-vs-trusted-professionals.jpg',
  },
];

// Fetch the full pool of blog posts from danang.homes. Cached for 1h via Next's
// data cache (so it doesn't hit danang.homes on every render), with a static
// fallback so the homepage never breaks if the feed is down.
export async function fetchBlogPool(): Promise<FeaturedBlogPost[]> {
  try {
    const res = await fetch(BLOG_FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return FEATURED_BLOG_POSTS;
    const data = (await res.json()) as FeaturedBlogPost[];
    if (Array.isArray(data) && data.length > 0) return data;
    return FEATURED_BLOG_POSTS;
  } catch {
    return FEATURED_BLOG_POSTS;
  }
}
