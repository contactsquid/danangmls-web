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
    directoryTitle: 'Môi giới bất động sản tại Đà Nẵng',
    directoryIntro:
      'Đây là các môi giới đang đăng tin trên DanangMLS tại Đà Nẵng và Hội An — từ căn hộ view biển ở Ngũ Hành Sơn, Sơn Trà đến nhà phố cho gia đình ở Hải Châu, Cẩm Lệ. Mở hồ sơ từng môi giới để xem toàn bộ nhà họ đang cho thuê và rao bán.',
    directorySections: [
      {
        "h": "Cách chọn môi giới bất động sản tại Đà Nẵng",
        "p": "Một **môi giới bất động sản** đáng tin ở Đà Nẵng là người làm đúng loại nhà và đúng khu vực bạn cần, và làm đều đặn hằng tuần. Hãy bắt đầu từ hồ sơ: môi giới có bao nhiêu *tin đăng đang hoạt động*, hồ sơ đã **xác minh** chưa, nhà họ đang rao có hợp ngân sách và khu vực của bạn không. Một người đang có cả chục tin ở Ngũ Hành Sơn, Sơn Trà, Hải Châu và Cẩm Lệ thường nắm thị trường rõ hơn người làm đủ thứ mà chỉ có một tin.",
        "bullets": [
          "**Tin đăng đang hoạt động:** có nhiều tin mới, còn hàng thật nghĩa là môi giới đang bám thị trường.",
          "**Dấu xác minh:** DanangMLS đã xác nhận tin đăng của môi giới là có thật.",
          "**Chuyên môn:** có người chuyên cho thuê, có người chuyên mua bán; chọn người phù hợp với nhu cầu của bạn.",
          "**Ngôn ngữ:** bạn có thể xem trang bằng tiếng Việt hoặc tiếng Anh; nhắn tin ngắn gọn, rõ ràng sẽ dễ trao đổi hơn."
        ]
      },
      {
        "h": "Người nước ngoài mua hoặc thuê bất động sản tại Đà Nẵng",
        "p": "Người nước ngoài có thể thuê nhà tại Đà Nẵng theo hợp đồng thuê thông thường. *Môi giới* thường là người bạn liên hệ đầu tiên để hẹn xem nhà, trao đổi điều khoản hợp đồng và làm việc với chủ nhà. Mua nhà thì chặt chẽ hơn: nhìn chung, người nước ngoài được sở hữu căn hộ và nhà ở trong các dự án nhà ở thương mại được phép, có thời hạn, và không được sở hữu đất. Quy định có thể thay đổi, nên hãy hỏi luật sư trước khi đặt cọc. Môi giới có thể giải thích quy trình nhưng không thay được tư vấn pháp lý."
      },
      {
        "h": "Khu vực môi giới DanangMLS đang hoạt động",
        "p": "Môi giới trên DanangMLS đăng nhà, căn hộ và biệt thự cho thuê và mua bán tại Đà Nẵng và Hội An, tập trung ở Ngũ Hành Sơn, Sơn Trà, Hải Châu và Cẩm Lệ. Mở một hồ sơ bất kỳ ở trên để xem nhà môi giới đó đang có, rồi liên hệ trực tiếp để hẹn xem nhà."
      }
    ],
    faqHeading: "Môi giới bất động sản tại Đà Nẵng: Câu hỏi thường gặp",
    faq: [
      {
        "q": "Làm sao để tìm môi giới bất động sản uy tín tại Đà Nẵng?",
        "a": "Xem các hồ sơ môi giới trên DanangMLS, rồi so sánh số tin đăng đang hoạt động, hồ sơ đã **xác minh** hay chưa, và nhà của họ có hợp ngân sách, khu vực của bạn không. Nhắn cho hai, ba môi giới và xem ai trả lời nhanh, rõ ràng hơn."
      },
      {
        "q": "Người nước ngoài có được mua bất động sản tại Việt Nam không?",
        "a": "Nhìn chung, người nước ngoài được sở hữu căn hộ và nhà ở trong các dự án nhà ở thương mại được phép, có thời hạn và có giới hạn số lượng. Người nước ngoài không được sở hữu đất. Quy định có thể thay đổi, vì vậy hãy hỏi luật sư về quy định hiện hành trước khi quyết định."
      },
      {
        "q": "Dấu xác minh có nghĩa là gì?",
        "a": "DanangMLS đã xác nhận tin đăng của môi giới này là có thật. Đó là dấu hiệu tốt, nhưng bạn vẫn nên xem nhà tận nơi trước khi trả bất kỳ khoản tiền nào."
      },
      {
        "q": "Phí môi giới là bao nhiêu?",
        "a": "Phí tùy từng môi giới và từng giao dịch, do hai bên thỏa thuận trực tiếp. Bạn nên hỏi rõ ngay từ đầu: chủ nhà, người bán hay bạn là người trả phí."
      },
      {
        "q": "Môi giới đăng tin bất động sản lên DanangMLS như thế nào?",
        "a": "Tạo hồ sơ môi giới miễn phí bằng nút bên dưới. Khi hồ sơ đã hoạt động, tin đăng của bạn sẽ hiện trên hồ sơ để khách thuê và khách mua tìm thấy, cả bằng tiếng Việt lẫn tiếng Anh."
      }
    ],
    emptyState: 'Chưa có hồ sơ môi giới nào.',
    createFirst: 'Tạo hồ sơ môi giới đầu tiên',
    ctaHeading: 'Bạn là môi giới tại Đà Nẵng?',
    ctaBody:
      'Tạo hồ sơ miễn phí để giới thiệu nhà của bạn tới khách thuê và khách mua đang tìm trên DanangMLS, bằng cả tiếng Việt lẫn tiếng Anh.',
    ctaButton: 'Tạo hồ sơ môi giới',
    roleLabel: 'Môi giới bất động sản',
    independent: 'Tự do',
    verified: 'Đã xác minh',
    verifiedTooltip: 'DanangMLS đã xác minh tin đăng của môi giới này',
    joined: 'Tham gia từ',
    enquire: 'Hỏi về các căn này',
    browseRentals: 'Xem tất cả nhà cho thuê',
    breadcrumbHome: 'Trang chủ',
    breadcrumbAgents: 'Môi giới',
    notFound: 'Không tìm thấy môi giới',
    listingCount: n => (n > 0 ? `${n} tin đăng đang hoạt động` : 'Chưa có tin đăng'),
    propertiesBy: name => `Nhà do ${name} đăng`,
    noListingsFrom: name => `Tin đăng của ${name}`,
    forRentHeading: n => `Cho thuê (${n})`,
    forSaleHeading: n => `Cần bán (${n})`,
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
