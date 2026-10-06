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
  directorySections: { h: string; p: string; bullets?: string[] }[];
  faqHeading: string;
  faq: { q: string; a: string }[];
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
  // Inventory block
  forRentHeading: (n: number) => string;
  forSaleHeading: (n: number) => string;
  noneRightNow: (name: string) => string;
  browseForRent: string;
  browseForSale: string;
}

// Only en/vi today — Korean and Russian read through forLang() and fall back to
// English until this copy is translated.
export const AGENT_COPY: Record<'en' | 'vi', AgentCopy> = {
  en: {
    directoryTitle: 'Real Estate Agents in Da Nang',
    directoryIntro:
      'These agents list properties on DanangMLS across Da Nang and Hoi An — from beachfront apartments in Ngu Hanh Son and Son Tra to family houses in Hai Chau and Cam Le. Open an agent’s profile to see every property they currently have on the market.',
    directorySections: [
      {
        "h": "How to Choose a Real Estate Agent in Da Nang",
        "p": "The best **real estate agent** in Da Nang is the one who works your type of property and your part of the market every week. Start with the agent’s profile: how many *active listings* they have, whether the profile is **Verified**, and whether their properties fit your budget and area. An agent with a dozen current listings in Ngu Hanh Son, Son Tra, Hai Chau and Cam Le will usually know that market better than a generalist with one.",
        "bullets": [
          "**Active listings:** current, recent inventory shows the agent is actively working the market.",
          "**Verified badge:** DanangMLS has confirmed the agent’s listings are real.",
          "**Specialty:** some agents focus on rentals, others on sales; check which fits your goal.",
          "**Language:** many agents work in Vietnamese first, so switch the site to Vietnamese or keep your messages short and clear."
        ]
      },
      {
        "h": "Buying or Renting Da Nang Property as a Foreigner",
        "p": "Foreigners can rent property in Da Nang on a standard lease, and the *agent* is usually your first point of contact for viewings, lease terms and landlord questions. Buying is more regulated: foreign buyers can generally own apartments and houses in approved commercial housing projects for a fixed term rather than owning land outright, and the rules change, so confirm the details with a qualified lawyer before paying a deposit. A local agent can explain the process, but they are not a substitute for legal advice."
      },
      {
        "h": "Where DanangMLS Agents Work",
        "p": "Agents on DanangMLS list homes, apartments and villas for rent and for sale in Da Nang, with listings concentrated in areas such as Ngu Hanh Son, Son Tra, Hai Chau and Cam Le. Open any profile above to see that agent’s current properties, then contact them directly about a viewing."
      }
    ],
    faqHeading: "Real Estate Agents in Da Nang: Frequently Asked Questions",
    faq: [
      {
        "q": "How do I find a good real estate agent in Da Nang?",
        "a": "Browse the agent profiles on DanangMLS, then compare how many active listings each agent has, whether they are **Verified**, and whether their properties match your budget and area. Message two or three agents and compare how quickly and clearly they reply."
      },
      {
        "q": "Can foreigners buy property in Vietnam?",
        "a": "Foreigners can generally own apartments and houses in approved commercial housing projects for a fixed term, with limits on how many units they can hold. They cannot own land outright. Rules change, so check the current law with a lawyer before you commit."
      },
      {
        "q": "What does the Verified badge mean?",
        "a": "DanangMLS has confirmed that the agent’s listings are genuine. It is a good sign, but you should still view a property in person before you pay anything."
      },
      {
        "q": "How much does a real estate agent charge?",
        "a": "Fees vary by agent and by deal, and they are agreed directly with the agent. Ask up front whether the fee is paid by the landlord or seller, or by you."
      },
      {
        "q": "How do I list my properties on DanangMLS as an agent?",
        "a": "Create a free agent profile from the button below. Once your profile is live, your listings appear on it for buyers and renters searching in English and Vietnamese."
      }
    ],
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
    forRentHeading: n => `For rent (${n})`,
    forSaleHeading: n => `For sale (${n})`,
    noneRightNow: name => `${name} has no active listings on DanangMLS right now.`,
    browseForRent: 'Browse properties for rent',
    browseForSale: 'Browse properties for sale',
  },
  vi: {
    directoryTitle: 'Môi Giới Bất Động Sản tại Đà Nẵng',
    directoryIntro:
      'Các môi giới dưới đây đăng tin bất động sản trên DanangMLS tại Đà Nẵng và Hội An — từ căn hộ view biển ở Ngũ Hành Sơn và Sơn Trà đến nhà phố cho gia đình ở Hải Châu và Cẩm Lệ. Mở hồ sơ của một môi giới để xem tất cả bất động sản họ đang chào bán và cho thuê.',
    directorySections: [
      {
        "h": "Cách Chọn Môi Giới Bất Động Sản tại Đà Nẵng",
        "p": "**Môi giới bất động sản** tốt nhất tại Đà Nẵng là người thường xuyên làm đúng loại bất động sản và đúng khu vực bạn quan tâm. Hãy bắt đầu từ hồ sơ của môi giới: họ có bao nhiêu *tin đăng đang hoạt động*, hồ sơ đã được **xác minh** chưa, và bất động sản của họ có phù hợp với ngân sách và khu vực của bạn không. Một môi giới đang có hàng chục tin đăng tại Ngũ Hành Sơn, Sơn Trà, Hải Châu và Cẩm Lệ thường hiểu thị trường đó rõ hơn một người làm đại trà chỉ có một tin.",
        "bullets": [
          "**Tin đăng đang hoạt động:** nguồn hàng còn mới cho thấy môi giới đang làm việc thực sự trên thị trường.",
          "**Dấu xác minh:** DanangMLS đã xác nhận các tin đăng của môi giới là có thật.",
          "**Lĩnh vực chuyên môn:** có môi giới chuyên cho thuê, có người chuyên mua bán; hãy chọn đúng người theo mục tiêu của bạn.",
          "**Ngôn ngữ:** bạn có thể xem trang bằng tiếng Việt hoặc tiếng Anh và nhắn tin ngắn gọn, rõ ràng để trao đổi dễ hơn."
        ]
      },
      {
        "h": "Người Nước Ngoài Mua hoặc Thuê Bất Động Sản tại Đà Nẵng",
        "p": "Người nước ngoài có thể thuê bất động sản tại Đà Nẵng theo hợp đồng thuê thông thường, và *môi giới* thường là người đầu tiên bạn liên hệ để xem nhà, trao đổi điều khoản hợp đồng và các câu hỏi với chủ nhà. Việc mua được quản lý chặt chẽ hơn: người nước ngoài nhìn chung được sở hữu căn hộ và nhà ở trong các dự án nhà ở thương mại được phép, trong một thời hạn nhất định và không sở hữu đất lâu dài. Quy định có thể thay đổi, vì vậy hãy xác nhận với luật sư trước khi đặt cọc. Môi giới có thể giải thích quy trình nhưng không thay thế tư vấn pháp lý."
      },
      {
        "h": "Khu Vực Hoạt Động của Môi Giới trên DanangMLS",
        "p": "Các môi giới trên DanangMLS đăng nhà, căn hộ và biệt thự cho thuê và bán tại Đà Nẵng và Hội An, tập trung ở các khu vực như Ngũ Hành Sơn, Sơn Trà, Hải Châu và Cẩm Lệ. Mở bất kỳ hồ sơ nào ở trên để xem bất động sản hiện có của môi giới đó, sau đó liên hệ trực tiếp để hẹn xem nhà."
      }
    ],
    faqHeading: "Môi Giới Bất Động Sản tại Đà Nẵng: Câu Hỏi Thường Gặp",
    faq: [
      {
        "q": "Làm sao để tìm môi giới bất động sản tốt tại Đà Nẵng?",
        "a": "Hãy xem các hồ sơ môi giới trên DanangMLS, rồi so sánh số tin đăng đang hoạt động, hồ sơ đã được **xác minh** hay chưa và bất động sản có phù hợp ngân sách, khu vực của bạn không. Nhắn tin cho hai hoặc ba môi giới và so sánh tốc độ cũng như độ rõ ràng khi họ phản hồi."
      },
      {
        "q": "Người nước ngoài có được mua bất động sản tại Việt Nam không?",
        "a": "Nhìn chung, người nước ngoài được sở hữu căn hộ và nhà ở trong các dự án nhà ở thương mại được phép, trong một thời hạn nhất định và bị giới hạn số lượng. Họ không được sở hữu đất lâu dài. Quy định có thể thay đổi, hãy hỏi luật sư về luật hiện hành trước khi quyết định."
      },
      {
        "q": "Dấu xác minh có nghĩa là gì?",
        "a": "DanangMLS đã xác nhận các tin đăng của môi giới là có thật. Đây là dấu hiệu tốt, nhưng bạn vẫn nên xem nhà trực tiếp trước khi thanh toán bất kỳ khoản nào."
      },
      {
        "q": "Phí môi giới là bao nhiêu?",
        "a": "Phí thay đổi tùy môi giới và từng giao dịch, và được thỏa thuận trực tiếp với môi giới. Hãy hỏi rõ ngay từ đầu xem chủ nhà hoặc người bán trả phí hay bạn là người trả."
      },
      {
        "q": "Làm sao để đăng bất động sản trên DanangMLS với tư cách môi giới?",
        "a": "Hãy tạo hồ sơ môi giới miễn phí bằng nút bên dưới. Khi hồ sơ được kích hoạt, các tin đăng của bạn sẽ hiển thị trên đó cho khách mua và khách thuê tìm kiếm bằng cả tiếng Việt và tiếng Anh."
      }
    ],
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
    forRentHeading: n => `Cho thuê (${n})`,
    forSaleHeading: n => `Bán (${n})`,
    noneRightNow: name => `${name} hiện chưa có tin đăng nào trên DanangMLS.`,
    browseForRent: 'Xem nhà cho thuê',
    browseForSale: 'Xem nhà bán',
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
