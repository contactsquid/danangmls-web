import type { Lang } from './translations';

/**
 * Copy for the agent-facing surface, in both languages.
 *
 * Kept out of lib/translations.ts on purpose: that file is dominated by tuned
 * SEO body copy for the listing pages (see the POP notes), and mixing UI labels
 * for a different feature into it makes both harder to edit safely.
 *
 * Vietnamese matters here more than anywhere else on the site — near enough all
 * Da Nang agents are Vietnamese with very little English, so an English-only
 * portal is an adoption barrier, not just an SEO gap (Blake, 2026-08-13).
 *
 * Note Vietnamese has no plural inflection, so the count helpers below take a
 * number purely so English can pluralise; the Vietnamese branch ignores it.
 */

export interface AgentCopy {
  // Directory
  directoryTitle: string;
  directoryIntro: string;
  emptyState: string;
  createFirst: string;
  ctaHeading: string;
  ctaBody: string;
  ctaButton: string;
  // Profile
  roleLabel: string;
  independent: string;
  verified: string;
  verifiedTooltip: string;
  joined: string;
  enquire: string;
  browseRentals: string;
  breadcrumbHome: string;
  breadcrumbAgents: string;
  notFound: string;
  listingCount: (n: number) => string;
  propertiesBy: (name: string) => string;
  noListingsFrom: (name: string) => string;
}

export const AGENT_COPY: Record<Lang, AgentCopy> = {
  en: {
    directoryTitle: 'Real Estate Agents in Da Nang',
    directoryIntro:
      'These agents list properties on DanangMLS across Da Nang and Hoi An — from beachfront apartments in Ngu Hanh Son and Son Tra to family houses in Hai Chau and Cam Le. Open an agent’s profile to see every property they currently have on the market.',
    emptyState: 'No agent profiles yet.',
    createFirst: 'Create the first agent profile',
    ctaHeading: 'Are you an agent in Da Nang?',
    ctaBody:
      'Create a free profile to showcase your properties to buyers and renters searching DanangMLS in English and Vietnamese.',
    ctaButton: 'Create your agent profile',
    roleLabel: 'Real estate agent',
    independent: 'Independent',
    verified: 'Verified',
    verifiedTooltip: "DanangMLS has confirmed this agent's listings",
    joined: 'Joined',
    enquire: 'Enquire about these properties',
    browseRentals: 'Browse all rentals',
    breadcrumbHome: 'Home',
    breadcrumbAgents: 'Agents',
    notFound: 'Agent not found',
    listingCount: n => (n > 0 ? `${n} active ${n === 1 ? 'listing' : 'listings'}` : 'No active listings'),
    propertiesBy: name => `Properties listed by ${name}`,
    noListingsFrom: name => `Listings from ${name}`,
  },
  vi: {
    directoryTitle: 'Môi Giới Bất Động Sản tại Đà Nẵng',
    directoryIntro:
      'Các môi giới dưới đây đăng tin bất động sản trên DanangMLS tại Đà Nẵng và Hội An — từ căn hộ view biển ở Ngũ Hành Sơn và Sơn Trà đến nhà phố cho gia đình ở Hải Châu và Cẩm Lệ. Mở hồ sơ của một môi giới để xem tất cả bất động sản họ đang chào bán và cho thuê.',
    emptyState: 'Chưa có hồ sơ môi giới nào.',
    createFirst: 'Tạo hồ sơ môi giới đầu tiên',
    ctaHeading: 'Bạn là môi giới tại Đà Nẵng?',
    ctaBody:
      'Tạo hồ sơ miễn phí để giới thiệu bất động sản của bạn đến khách thuê và khách mua đang tìm kiếm trên DanangMLS bằng cả tiếng Việt và tiếng Anh.',
    ctaButton: 'Tạo hồ sơ môi giới',
    roleLabel: 'Môi giới bất động sản',
    independent: 'Độc lập',
    verified: 'Đã xác minh',
    verifiedTooltip: 'DanangMLS đã xác minh các tin đăng của môi giới này',
    joined: 'Tham gia',
    enquire: 'Liên hệ về các bất động sản này',
    browseRentals: 'Xem tất cả nhà cho thuê',
    breadcrumbHome: 'Trang chủ',
    breadcrumbAgents: 'Môi giới',
    notFound: 'Không tìm thấy môi giới',
    listingCount: n => (n > 0 ? `${n} tin đăng đang hoạt động` : 'Chưa có tin đăng'),
    propertiesBy: name => `Bất động sản đăng bởi ${name}`,
    noListingsFrom: name => `Tin đăng của ${name}`,
  },
};

/** Canonical paths per language. The Vietnamese side nests the profile under the
 *  directory (/vi/moi-gioi/<slug>) rather than mirroring English's split
 *  /agents + /agent/<slug>; hreflang pairs URLs, it does not require identical
 *  path shapes. */
export const agentPaths = {
  en: { directory: '/agents', profile: (slug: string) => `/agent/${slug}` },
  vi: { directory: '/vi/moi-gioi', profile: (slug: string) => `/vi/moi-gioi/${slug}` },
} as const;

const BASE = 'https://danangmls.com';

/** hreflang alternates. Both languages must point at the same pair, or Google
 *  treats them as unrelated pages and they compete instead of consolidating. */
export function agentAlternates(kind: 'directory' | 'profile', slug = '') {
  const en = kind === 'directory' ? agentPaths.en.directory : agentPaths.en.profile(slug);
  const vi = kind === 'directory' ? agentPaths.vi.directory : agentPaths.vi.profile(slug);
  return {
    languages: {
      'en-US': `${BASE}${en}`,
      'vi-VN': `${BASE}${vi}`,
      'x-default': `${BASE}${en}`,
    },
  };
}
