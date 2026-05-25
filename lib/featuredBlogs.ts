// Featured blog posts displayed on the danangmls.com homepage. The blogs themselves
// live on danang.homes/blog/<slug> — danangmls.com doesn't host a blog, so this is
// cross-promotion. Update this list manually when new blog posts are published on
// danang.homes (or build an automated sync later — currently a 30s manual edit).

export interface FeaturedBlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
}

export const BLOG_BASE_URL = 'https://danang.homes/blog';

// Most recent 3 posts from danang-homes-web/lib/blog.ts (sorted by date desc).
// Last synced: 2026-05-25.
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
