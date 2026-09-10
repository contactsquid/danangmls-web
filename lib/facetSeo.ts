import { type Lang, viOrEn } from './translations';
import type { Facet, Mode } from './facets';
import { facetSeoKoRu } from './facetSeoKoRu';

// Facet-aware bottom-section copy (SEO prose + FAQ). Returns null to fall back
// to the generic mode-level copy in translations.ts (used for district/bedroom
// facets and the plain /for-rent, /for-sale pages).

export interface FacetSeoBody { h2: string; intro: string[]; faqHeading: string; faq: { q: string; a: string }[] }

const EN_TYPE_PLURAL: Record<string, string> = {
  House: 'Houses', Apartment: 'Apartments', Villa: 'Villas', Townhouse: 'Townhouses',
  Studio: 'Studios', Land: 'Land', Office: 'Offices', Retail: 'Retail Spaces',
  Shophouse: 'Shophouses', Commercial: 'Commercial Properties',
};

export function facetSeoBody(f: Facet, mode: Mode, langIn: Lang): FacetSeoBody | null {
  // ko/ru have their own bodies; they return null for building facets so those
  // fall back to the generic translated mode copy rather than English.
  if (langIn === 'ko' || langIn === 'ru') return facetSeoKoRu(f, mode, langIn);
  const lang = viOrEn(langIn);
  if (f.kind === 'type') return lang === 'vi' ? typeVi(f.value, mode) : typeEn(f.value, mode);
  if (f.kind === 'foreign') return lang === 'vi' ? foreignVi() : foreignEn();
  if (f.kind === 'building') return lang === 'vi' ? buildingVi(f.value, mode) : buildingEn(f.value, mode);
  return null; // district / bedrooms → default mode copy
}

// ─── English ────────────────────────────────────────────────────────────────
function typeEn(value: string, mode: Mode): FacetSeoBody {
  const forX = mode === 'rent' ? 'for Rent' : 'for Sale';
  const rentSale = mode === 'rent' ? 'for rent' : 'for sale';
  const rentingBuying = mode === 'rent' ? 'Renting' : 'Buying';
  const rentBuy = mode === 'rent' ? 'rent' : 'buy';

  if (value === 'House') {
    return {
      h2: mode === 'rent' ? `House for Rent in Da Nang — Space, Privacy & Room to Grow` : `Houses for Sale in Da Nang — Space, Privacy & Room to Grow`,
      intro: [
        `A **house ${rentSale} in Da Nang** gives you what an apartment can't: multiple bedrooms, a private kitchen, often a yard, rooftop terrace, or garage, and quiet residential streets a short ride from the beach. Da Nang's houses run from compact townhouses in **Hai Chau** to spacious family homes in **An Thuong** and garden villas out toward **Ngu Hanh Son** and the Marble Mountains — room for families, sharers, and anyone who wants space to spread out.`,
        mode === 'rent'
          ? `Most **houses for rent** here have two to five bedrooms and several bathrooms, and long-term leases from three months are standard — often fully furnished with a modern kitchen. Compare layouts, districts, and monthly pricing in USD in the listings above, and message the agent directly about any home you like.`
          : `Da Nang's **houses for sale** include multi-storey townhouses and landed family homes with generous floor space. Note that foreign buyers generally purchase eligible **apartments** rather than landed houses, so ask about ownership options for any listing. Compare districts, plot sizes, and USD pricing above.`,
      ],
      faqHeading: `Frequently Asked Questions About ${rentingBuying} a House in Da Nang`,
      faq: mode === 'rent' ? [
        { q: 'How much does it cost to rent a house in Da Nang?', a: `A two- to three-**bedroom house for rent** in **Da Nang** typically runs $500–$1,200 a **month**, depending on the **district**, size, and how close it is to the **beach**. Larger family **houses** and beachfront homes cost more, while townhouses inland are cheaper. Browse the listings above for live pricing.` },
        { q: 'Are houses in Da Nang furnished?', a: `Many **houses for rent** come fully or partly furnished with a **kitchen**, air conditioning, and basic furniture, though some landlords offer unfurnished homes at a lower **rent**. Each listing notes what's included — ask the **agent** to confirm before you sign.` },
        { q: 'Which areas are best for renting a house in Da Nang?', a: `Families often choose **An Thuong** and **My An** near My Khe Beach, **Hai Chau** for the city centre, and **Ngu Hanh Son** for quieter, more spacious homes. Each **area** has a different feel and price point — compare houses across districts above.` },
      ] : [
        { q: 'Can a foreigner buy a house in Da Nang?', a: `Foreigners generally cannot own landed **houses** or **land** outright in **Vietnam** — those are reserved for Vietnamese nationals. Foreign buyers instead purchase eligible **apartments** and condos on a 50-year renewable ownership certificate. For a house-style home, a long-term lease or purchase through a Vietnamese spouse are the usual routes.` },
        { q: 'How much does a house cost in Da Nang?', a: `**Houses for sale** in **Da Nang** range widely: inland townhouses start around $150,000, while larger family homes and beachfront **villas** near My Khe run from $400,000 into the millions. Location, plot size, and build quality drive the price — compare listings above.` },
        { q: 'What is the process for buying a house in Da Nang?', a: `The typical flow is: reserve with a deposit, sign the sale-and-purchase agreement, pay per the schedule, then transfer the title. Working with a local **agent** and a lawyer keeps the paperwork clear, especially around land-use rights and ownership eligibility.` },
      ],
    };
  }

  if (value === 'Apartment') {
    return {
      h2: `Apartments ${forX} in Da Nang — Low-Maintenance Living with Building Amenities`,
      intro: [
        `An **apartment ${rentSale} in Da Nang** is the easy way to settle in: furnished, low-maintenance, and often in a building with a pool, gym, and 24-hour security. Options run from compact **studios** to **three-bedroom** units, in the beachfront towers of **Son Tra** and **My An**, the riverside buildings along the Han, and newer complexes in **Hai Chau** and **Ngu Hanh Son**.`,
        mode === 'rent'
          ? `**Apartments for rent** suit expats, remote workers, and couples who want a turnkey home — most are fully furnished with a modern **kitchen**, and serviced options are available for shorter stays. Compare studios to family-sized units, buildings, and monthly USD pricing in the listings above.`
          : `**Apartments for sale** are the main route for foreign buyers: within approved buildings, foreigners can legally own a unit on a 50-year renewable certificate (up to 30% of a building). Look for the Foreign-Buyer-Eligible listings, and compare buildings, floors, views, and USD pricing above.`,
      ],
      faqHeading: `Frequently Asked Questions About ${rentingBuying} an Apartment in Da Nang`,
      faq: mode === 'rent' ? [
        { q: 'How much is an apartment for rent in Da Nang?', a: `A furnished **studio** or one-**bedroom apartment** often starts around $300–$500 a **month**, while two- and three-**bedroom** units run $500–$1,200 depending on the building and **area**. Beachfront towers with pools and gyms sit at the higher end. See live pricing above.` },
        { q: 'Do Da Nang apartments come with a pool and gym?', a: `Many mid- and high-end **apartment** buildings in **Da Nang** include a shared pool, gym, and 24-hour security in the **rent** or a small management fee. Each listing notes the building's amenities — filter and compare above.` },
        { q: 'Can foreigners rent an apartment in Da Nang?', a: `Yes. Foreigners can freely **rent** an **apartment** in **Da Nang** — you simply sign a lease with the owner or their **agent**, who registers your temporary residence with the local police. Monthly and long-term leases are both common.` },
      ] : [
        { q: 'Can foreigners buy an apartment in Da Nang?', a: `Yes. Foreigners can legally **buy** and own **apartments** in **Da Nang** within approved buildings, on a 50-year renewable ownership certificate (foreigners may own up to 30% of a building's units). Look for our Foreign-Buyer-Eligible listings to see eligible **apartments**.` },
        { q: 'How much does an apartment cost in Da Nang?', a: `Entry-level **apartments** start around $60,000–$120,000, mid-range beachfront **units** run $150,000–$300,000, and premium penthouses go well beyond that. Building, floor, and view drive the price — compare USD listings above.` },
        { q: 'Is a Da Nang apartment a good investment?', a: `Many foreign buyers purchase eligible **apartments** in **Da Nang** for rental yield and long-term appreciation, driven by tourism and a growing expat community. Returns depend on the building, location, and timing — compare **areas** and prices above.` },
      ],
    };
  }

  // Generic type (Villa, Townhouse, Studio, Land, etc.)
  const plural = EN_TYPE_PLURAL[value] || `${value}s`;
  const lc = plural.toLowerCase();
  return {
    h2: `${plural} ${forX} in Da Nang, Vietnam`,
    intro: [
      `Looking for **${lc} ${rentSale} in Da Nang**? Browse current listings across every **district**, from the city centre in **Hai Chau** to the beaches of **Son Tra** and **Ngu Hanh Son**. Compare sizes, locations, and pricing in USD, and reach the **agent** directly about any that catch your eye.`,
      `New **${lc}** listings are added daily from local **real estate** agents and **property** managers across **Da Nang** and Hoi An, so check back often for the latest options.`,
    ],
    faqHeading: `Frequently Asked Questions About ${rentingBuying} in Da Nang`,
    faq: [
      { q: `How much do ${lc} ${rentSale} cost in Da Nang?`, a: `Pricing for **${lc}** in **Da Nang** varies by **area**, size, and condition. Browse the listings above for live USD pricing, and compare across districts to find the best value.` },
      { q: `Can foreigners ${rentBuy} ${lc} in Da Nang?`, a: mode === 'rent' ? `Yes — foreigners can freely **rent** across **Da Nang** by signing a lease with the owner or their **agent**, who registers your temporary residence locally.` : `Foreign ownership in **Vietnam** is limited to eligible **apartments** on a 50-year renewable certificate; landed **property** and **land** are generally reserved for Vietnamese nationals. Ask the **agent** about eligibility for any listing.` },
    ],
  };
}

function foreignEn(): FacetSeoBody {
  return {
    h2: `Foreign-Buyer-Eligible Homes for Sale in Da Nang`,
    intro: [
      `These are the **Da Nang** homes foreigners can legally **buy**. Under Vietnamese law, foreign buyers can own **apartments** and condos within approved buildings — up to 30% of a building's units — on a **50-year, renewable ownership certificate** (pink book). Landed **houses** and **land** remain reserved for Vietnamese nationals.`,
      `Every listing here sits in a foreign-ownership-approved building, so international buyers can purchase with confidence. Compare buildings, floors, views, and USD pricing above, and ask the **agent** about the remaining foreign quota and the ownership certificate for any unit.`,
    ],
    faqHeading: `Frequently Asked Questions About Foreign Property Ownership in Da Nang`,
    faq: [
      { q: 'Can foreigners own property in Da Nang, Vietnam?', a: `Yes — foreigners can legally own **apartments** and condos in approved buildings in **Da Nang**, on a 50-year renewable ownership certificate. Foreigners may own up to 30% of the units in any one building.` },
      { q: 'What can foreigners not buy in Vietnam?', a: `Foreigners generally cannot own **land** or landed **houses** outright — those require Vietnamese nationality. Foreign ownership is limited to eligible **apartments** and condominium **units**.` },
      { q: 'Can foreigners resell or rent out their Da Nang apartment?', a: `Yes. Foreign owners can **rent** out their **apartment** for income and resell it, subject to the terms of the ownership certificate. Many buyers purchase eligible **units** specifically for rental yield and appreciation.` },
    ],
  };
}

// ─── Vietnamese ──────────────────────────────────────────────────────────────
function typeVi(value: string, mode: Mode): FacetSeoBody {
  const thueBan = mode === 'rent' ? 'Cho Thuê' : 'Bán';
  const thueBanLc = mode === 'rent' ? 'cho thuê' : 'bán';

  if (value === 'House') {
    return {
      h2: `Nhà ${thueBan} tại Đà Nẵng — Không Gian Rộng Rãi & Riêng Tư`,
      intro: [
        `**Nhà ${thueBanLc} tại Đà Nẵng** mang lại điều mà căn hộ khó có: nhiều **phòng ngủ**, bếp riêng, thường có sân, sân thượng hoặc chỗ để xe, và những con phố yên tĩnh chỉ cách biển vài phút. Nhà tại Đà Nẵng trải dài từ nhà phố ở **Hải Châu** đến nhà gia đình rộng rãi ở **An Thượng** và biệt thự sân vườn hướng **Ngũ Hành Sơn**.`,
        mode === 'rent'
          ? `Hầu hết **nhà cho thuê** có hai đến năm **phòng ngủ** và nhiều phòng tắm, cho thuê dài hạn từ ba tháng, thường đầy đủ nội thất với **bếp** hiện đại. So sánh thiết kế, quận và giá theo USD ở danh sách phía trên.`
          : `**Nhà bán tại Đà Nẵng** gồm nhà phố nhiều tầng và nhà gắn liền với đất rộng rãi. Lưu ý người nước ngoài thường mua **căn hộ** đủ điều kiện thay vì nhà gắn liền với đất — hãy hỏi về hình thức sở hữu cho mỗi tin. So sánh quận, diện tích đất và giá USD phía trên.`,
      ],
      faqHeading: `Câu Hỏi Thường Gặp Về ${mode === 'rent' ? 'Thuê' : 'Mua'} Nhà tại Đà Nẵng`,
      faq: mode === 'rent' ? [
        { q: 'Giá thuê một căn nhà tại Đà Nẵng là bao nhiêu?', a: `**Nhà cho thuê** hai đến ba **phòng ngủ** tại **Đà Nẵng** thường khoảng 500–1.200 USD mỗi **tháng**, tùy **khu vực**, diện tích và khoảng cách tới biển. Xem giá cập nhật ở danh sách phía trên.` },
        { q: 'Nhà cho thuê tại Đà Nẵng có sẵn nội thất không?', a: `Nhiều **nhà cho thuê** có đầy đủ hoặc một phần nội thất gồm **bếp**, máy lạnh và đồ cơ bản. Mỗi tin đăng ghi rõ những gì đi kèm — hãy hỏi **đại lý** để xác nhận.` },
        { q: 'Khu vực nào tốt để thuê nhà tại Đà Nẵng?', a: `Gia đình thường chọn **An Thượng** và **Mỹ An** gần biển Mỹ Khê, **Hải Châu** ở trung tâm, và **Ngũ Hành Sơn** để có nhà rộng và yên tĩnh hơn.` },
      ] : [
        { q: 'Người nước ngoài có mua được nhà đất tại Đà Nẵng không?', a: `Người nước ngoài thường không được sở hữu **nhà** gắn liền với đất hoặc **đất** tại **Việt Nam** — những loại này dành cho công dân Việt Nam. Người nước ngoài mua **căn hộ** đủ điều kiện với giấy chứng nhận sở hữu 50 năm có thể gia hạn.` },
        { q: 'Giá một căn nhà tại Đà Nẵng là bao nhiêu?', a: `**Nhà bán** tại **Đà Nẵng** dao động rộng: nhà phố trong nội thành từ khoảng 150.000 USD, còn nhà gia đình lớn và **biệt thự** ven biển gần Mỹ Khê từ 400.000 USD trở lên. So sánh danh sách phía trên.` },
        { q: 'Quy trình mua nhà tại Đà Nẵng như thế nào?', a: `Quy trình thường là: đặt cọc, ký hợp đồng mua bán, thanh toán theo đợt, rồi sang tên. Làm việc với **đại lý** địa phương và luật sư giúp thủ tục rõ ràng, nhất là về quyền sử dụng đất.` },
      ],
    };
  }

  if (value === 'Apartment') {
    return {
      h2: `Căn Hộ ${thueBan} tại Đà Nẵng — Tiện Nghi & Dễ Quản Lý`,
      intro: [
        `**Căn hộ ${thueBanLc} tại Đà Nẵng** là cách dễ nhất để an cư: đầy đủ nội thất, ít phải bảo trì, và thường nằm trong tòa nhà có hồ bơi, phòng gym và bảo vệ 24 giờ. Lựa chọn từ **studio** nhỏ gọn đến **căn hộ ba phòng ngủ**, ở các tòa tháp ven biển **Sơn Trà** và **Mỹ An**, các tòa nhà ven sông Hàn, và khu căn hộ mới tại **Hải Châu** và **Ngũ Hành Sơn**.`,
        mode === 'rent'
          ? `**Căn hộ cho thuê** phù hợp cho người nước ngoài, người làm việc từ xa và các cặp đôi muốn một tổ ấm sẵn sàng dọn vào — hầu hết đầy đủ nội thất với **bếp** hiện đại, và có cả căn hộ dịch vụ cho kỳ lưu trú ngắn. So sánh ở danh sách phía trên.`
          : `**Căn hộ bán** là hướng đi chính cho người nước ngoài: trong các tòa nhà được duyệt, người nước ngoài được sở hữu hợp pháp với giấy chứng nhận 50 năm có thể gia hạn (tối đa 30% số căn). Xem các tin dành cho người nước ngoài và so sánh tòa nhà, tầng, hướng và giá USD phía trên.`,
      ],
      faqHeading: `Câu Hỏi Thường Gặp Về ${mode === 'rent' ? 'Thuê' : 'Mua'} Căn Hộ tại Đà Nẵng`,
      faq: mode === 'rent' ? [
        { q: 'Giá thuê căn hộ tại Đà Nẵng là bao nhiêu?', a: `**Căn hộ** studio hoặc một **phòng ngủ** đầy đủ nội thất thường từ 300–500 USD mỗi **tháng**, trong khi căn hai đến ba **phòng ngủ** khoảng 500–1.200 USD tùy tòa nhà và **khu vực**. Xem giá cập nhật phía trên.` },
        { q: 'Căn hộ tại Đà Nẵng có hồ bơi và phòng gym không?', a: `Nhiều tòa **căn hộ** tầm trung và cao cấp tại **Đà Nẵng** có hồ bơi, phòng gym và bảo vệ 24 giờ, tính trong **giá thuê** hoặc phí quản lý nhỏ. Mỗi tin ghi rõ tiện ích tòa nhà.` },
        { q: 'Người nước ngoài có thuê được căn hộ tại Đà Nẵng không?', a: `Có. Người nước ngoài được tự do **thuê căn hộ** tại **Đà Nẵng** — chỉ cần ký hợp đồng với chủ nhà hoặc **đại lý**, người sẽ đăng ký tạm trú cho bạn.` },
      ] : [
        { q: 'Người nước ngoài có mua được căn hộ tại Đà Nẵng không?', a: `Có. Người nước ngoài được **mua** và sở hữu hợp pháp **căn hộ** tại **Đà Nẵng** trong các tòa nhà được duyệt, với giấy chứng nhận sở hữu 50 năm có thể gia hạn (tối đa 30% số căn trong tòa nhà). Xem các tin dành cho người nước ngoài.` },
        { q: 'Giá một căn hộ tại Đà Nẵng là bao nhiêu?', a: `**Căn hộ** phổ thông từ khoảng 60.000–120.000 USD, **căn hộ** view biển tầm trung 150.000–300.000 USD, penthouse cao cấp cao hơn nhiều. So sánh giá USD phía trên.` },
        { q: 'Mua căn hộ tại Đà Nẵng có phải khoản đầu tư tốt không?', a: `Nhiều người nước ngoài mua **căn hộ** đủ điều kiện tại **Đà Nẵng** để cho thuê và tăng giá dài hạn, nhờ du lịch và cộng đồng người nước ngoài ngày càng lớn. Lợi nhuận phụ thuộc tòa nhà, vị trí và thời điểm.` },
      ],
    };
  }

  // Generic type (VI)
  const viType = value; // localizeType would need lang; keep canonical inside prose via generic phrasing
  return {
    h2: `${viType} ${thueBan} tại Đà Nẵng, Việt Nam`,
    intro: [
      `Đang tìm **${viType.toLowerCase()} ${thueBanLc} tại Đà Nẵng**? Xem các tin đăng hiện có trên khắp các **quận**, từ trung tâm **Hải Châu** đến biển **Sơn Trà** và **Ngũ Hành Sơn**. So sánh diện tích, vị trí và giá theo USD, và liên hệ **đại lý** về bất kỳ tin nào bạn quan tâm.`,
      `Tin đăng mới được thêm hàng ngày từ các **đại lý bất động sản** địa phương trên khắp **Đà Nẵng** và Hội An.`,
    ],
    faqHeading: `Câu Hỏi Thường Gặp Về ${mode === 'rent' ? 'Thuê' : 'Mua'} Bất Động Sản tại Đà Nẵng`,
    faq: [
      { q: `Giá ${thueBanLc} tại Đà Nẵng là bao nhiêu?`, a: `Giá tại **Đà Nẵng** thay đổi theo **khu vực**, diện tích và tình trạng. Xem danh sách phía trên để biết giá USD cập nhật.` },
    ],
  };
}

function foreignVi(): FacetSeoBody {
  return {
    h2: `Nhà Bán Cho Người Nước Ngoài Sở Hữu tại Đà Nẵng`,
    intro: [
      `Đây là những bất động sản tại **Đà Nẵng** mà người nước ngoài được **mua** hợp pháp. Theo luật Việt Nam, người nước ngoài được sở hữu **căn hộ** trong các tòa nhà được duyệt — tối đa 30% số căn — với **giấy chứng nhận sở hữu 50 năm, có thể gia hạn** (sổ hồng). **Nhà** gắn liền với đất và **đất** vẫn dành cho công dân Việt Nam.`,
      `Mọi tin đăng ở đây đều thuộc tòa nhà được duyệt cho sở hữu nước ngoài. So sánh tòa nhà, tầng, hướng và giá USD phía trên, và hỏi **đại lý** về hạn mức nước ngoài còn lại cùng giấy chứng nhận sở hữu cho mỗi căn.`,
    ],
    faqHeading: `Câu Hỏi Thường Gặp Về Sở Hữu Bất Động Sản Của Người Nước Ngoài tại Đà Nẵng`,
    faq: [
      { q: 'Người nước ngoài có được sở hữu bất động sản tại Đà Nẵng không?', a: `Có — người nước ngoài được sở hữu hợp pháp **căn hộ** trong các tòa nhà được duyệt tại **Đà Nẵng**, với giấy chứng nhận 50 năm có thể gia hạn, tối đa 30% số căn trong một tòa nhà.` },
      { q: 'Người nước ngoài không được mua gì tại Việt Nam?', a: `Người nước ngoài thường không được sở hữu **đất** hoặc **nhà** gắn liền với đất — những loại này cần quốc tịch Việt Nam. Sở hữu nước ngoài giới hạn ở **căn hộ** đủ điều kiện.` },
      { q: 'Người nước ngoài có được bán lại hoặc cho thuê căn hộ tại Đà Nẵng không?', a: `Có. Chủ sở hữu nước ngoài được **cho thuê** căn hộ để tạo thu nhập và bán lại, theo điều khoản của giấy chứng nhận sở hữu. Nhiều người mua **căn hộ** đủ điều kiện để cho thuê và tăng giá.` },
    ],
  };
}

// ─── Buildings ──────────────────────────────────────────────────────────────
// Per-building copy. Facts here are taken from the live listing set, not
// invented: Sam Towers' numbers were measured across its 42 rentals on
// 2026-09-07 (all apartments, 22 of 23 with a district in Hai Chau, 31 two-bed
// and 9 one-bed, $684-$2,280/mo with a $950 median, a pool named in 29 listings,
// a gym in 24 and a Han River view in 14).
//
// PENDING: to be tuned against a PageOptimizer Pro report for
// "apartment for rent at sam towers". Per the POP playbook the score comes from
// each SECTION's term range and over-optimizing is penalised, so do not pad
// keyword counts by hand — wait for the report.
interface BuildingSeo { district: string; blurb: string[]; faq: { q: string; a: string }[] }
interface BuildingSeoVi { blurb: string[]; faq: { q: string; a: string }[] }

// Vietnamese written natively for a Vietnamese renter — NOT a translation of the
// English above. Uses the phrasing real agents use: "full nội thất", "view sông
// Hàn", "tòa căn hộ", "vào ở được ngay". Kiểu cũ tone marks and "USD" spelled
// out after the figure, matching the rest of the site.
const BUILDING_SEO_VI: Record<string, BuildingSeoVi> = {
  'Sam Towers': {
    blurb: [
      'Sam Towers là tòa căn hộ ven sông tại quận Hải Châu, Đà Nẵng, gần sông Hàn và cầu Rồng. Tất cả tin đăng tại đây đều là căn hộ, phù hợp khi cần một tòa nhà có thang máy, an ninh và chỗ để xe thay vì nhà riêng.',
      'Phần lớn là căn 2 phòng ngủ, bên cạnh các căn 1 phòng ngủ và đôi khi có căn 3 phòng ngủ. Giá thuê hiện dao động khoảng 684–2.280 USD mỗi tháng, phổ biến quanh mức 950 USD.',
      'Tiện ích được nhắc tới nhiều gồm hồ bơi, phòng gym và view sông Hàn ở các tầng cao. Đa số căn được bàn giao full nội thất, có bếp, máy lạnh, máy giặt và wifi, vào ở được ngay. So sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê — danh sách cập nhật hằng ngày từ môi giới địa phương.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Sam Towers khoảng bao nhiêu?', a: 'Các tin đăng hiện tại dao động khoảng **684–2.280 USD** mỗi tháng, phổ biến quanh **950 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Sam Towers nằm ở đâu?', a: 'Tại **quận Hải Châu**, gần **sông Hàn** và cầu Rồng, thuận tiện đi làm ở trung tâm và cách bãi biển Mỹ Khê một quãng ngắn.' },
      { q: 'Căn hộ tại Sam Towers có mấy phòng ngủ?', a: 'Chủ yếu là **2 phòng ngủ**. Căn 1 phòng ngủ thường xuyên có, và thỉnh thoảng có căn 3 phòng ngủ.' },
      { q: 'Sam Towers có hồ bơi và phòng gym không?', a: 'Có — **hồ bơi** và **phòng gym** được nhắc tới trong phần lớn tin đăng, cùng thang máy, an ninh và chỗ để xe.' },
    ],
  },
  'Panoma': {
    blurb: [
      'Panoma nằm bên bờ sông Hàn phía Ngũ Hành Sơn, hiện là tòa có nhiều tin đăng nhất trên DanangMLS — dễ chọn vì cùng một địa chỉ mà có nhiều loại căn.',
      'Chủ yếu là căn 1 phòng ngủ và 2 phòng ngủ, kèm khá nhiều căn studio. Giá thuê hiện dao động khoảng 532–2.090 USD mỗi tháng, phổ biến quanh mức 950 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tiện ích được nhắc tới nhiều gồm hồ bơi, phòng gym và view sông. Đa số căn được bàn giao full nội thất, có bếp, máy lạnh, máy giặt và wifi, vào ở được ngay. So sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê — danh sách cập nhật hằng ngày từ môi giới địa phương.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Panoma khoảng bao nhiêu?', a: 'Các tin đăng hiện tại dao động khoảng **532–2.090 USD** mỗi tháng, phổ biến quanh **950 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Panoma nằm ở đâu?', a: 'Tại **quận Ngũ Hành Sơn**, Đà Nẵng. Xem trang khu vực để biết toàn bộ tin đăng trong quận.' },
      { q: 'Căn hộ tại Panoma có mấy phòng ngủ?', a: 'Chủ yếu là căn 1 phòng ngủ và 2 phòng ngủ, kèm khá nhiều căn studio.' },
      { q: 'Căn hộ tại Panoma có sẵn nội thất không?', a: 'Đa số được bàn giao **full nội thất**, gồm bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn — tin đăng có ghi rõ.' },
    ],
  },
  'Sun Cosmo': {
    blurb: [
      'Sun Cosmo là tòa căn hộ ven sông tại Ngũ Hành Sơn, chạy xe vài phút là tới biển Mỹ Khê và khu An Thượng.',
      'Phần lớn là căn 1 phòng ngủ, bên cạnh studio và căn 2 phòng ngủ. Giá thuê hiện dao động khoảng 551–2.090 USD mỗi tháng, phổ biến quanh mức 950 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tiện ích được nhắc tới nhiều gồm hồ bơi, phòng gym, ban công và view sông. Đa số căn được bàn giao full nội thất, có bếp, máy lạnh, máy giặt và wifi, vào ở được ngay. So sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê — danh sách cập nhật hằng ngày từ môi giới địa phương.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Sun Cosmo khoảng bao nhiêu?', a: 'Các tin đăng hiện tại dao động khoảng **551–2.090 USD** mỗi tháng, phổ biến quanh **950 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Sun Cosmo nằm ở đâu?', a: 'Tại **quận Ngũ Hành Sơn**, Đà Nẵng. Xem trang khu vực để biết toàn bộ tin đăng trong quận.' },
      { q: 'Căn hộ tại Sun Cosmo có mấy phòng ngủ?', a: 'Phần lớn là căn 1 phòng ngủ, bên cạnh studio và căn 2 phòng ngủ.' },
      { q: 'Căn hộ tại Sun Cosmo có sẵn nội thất không?', a: 'Đa số được bàn giao **full nội thất**, gồm bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn — tin đăng có ghi rõ.' },
    ],
  },
  'The Filmore': {
    blurb: [
      'The Filmore là tòa căn hộ cao cấp ven sông Hàn tại Hải Châu. Mặt bằng giá ở đây cao hơn mặt bằng chung của thành phố.',
      'Chủ yếu là căn 2 phòng ngủ, có thêm căn 1 và 3 phòng ngủ. Giá thuê hiện dao động khoảng 1.064–4.940 USD mỗi tháng, phổ biến quanh mức 1.520 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tiện ích được nhắc tới nhiều gồm hồ bơi, phòng gym và view sông Hàn. Đa số căn được bàn giao full nội thất, có bếp, máy lạnh, máy giặt và wifi, vào ở được ngay. So sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê — danh sách cập nhật hằng ngày từ môi giới địa phương.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại The Filmore khoảng bao nhiêu?', a: 'Các tin đăng hiện tại dao động khoảng **1.064–4.940 USD** mỗi tháng, phổ biến quanh **1.520 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'The Filmore nằm ở đâu?', a: 'Tại **quận Hải Châu**, Đà Nẵng. Xem trang khu vực để biết toàn bộ tin đăng trong quận.' },
      { q: 'Căn hộ tại The Filmore có mấy phòng ngủ?', a: 'Chủ yếu là căn 2 phòng ngủ, có thêm căn 1 và 3 phòng ngủ.' },
      { q: 'Căn hộ tại The Filmore có sẵn nội thất không?', a: 'Đa số được bàn giao **full nội thất**, gồm bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn — tin đăng có ghi rõ.' },
    ],
  },
  'Hiyori Garden Tower': {
    blurb: [
      'Hiyori Garden Tower do chủ đầu tư Nhật phát triển, nằm tại Sơn Trà, đi bộ ra biển và được khách Nhật, Hàn ưa chuộng.',
      'Gần như toàn bộ là căn 2 phòng ngủ. Giá thuê hiện dao động khoảng 646–1.064 USD mỗi tháng, phổ biến quanh mức 874 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tiện ích được nhắc tới nhiều gồm hồ bơi, phòng gym, ban công và gần biển. Đa số căn được bàn giao full nội thất, có bếp, máy lạnh, máy giặt và wifi, vào ở được ngay. So sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê — danh sách cập nhật hằng ngày từ môi giới địa phương.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Hiyori Garden Tower khoảng bao nhiêu?', a: 'Các tin đăng hiện tại dao động khoảng **646–1.064 USD** mỗi tháng, phổ biến quanh **874 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Hiyori Garden Tower nằm ở đâu?', a: 'Tại **quận Sơn Trà**, Đà Nẵng. Xem trang khu vực để biết toàn bộ tin đăng trong quận.' },
      { q: 'Căn hộ tại Hiyori Garden Tower có mấy phòng ngủ?', a: 'Gần như toàn bộ là căn 2 phòng ngủ.' },
      { q: 'Căn hộ tại Hiyori Garden Tower có sẵn nội thất không?', a: 'Đa số được bàn giao **full nội thất**, gồm bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn — tin đăng có ghi rõ.' },
    ],
  },
  'FPT Plaza / F.Home': {
    blurb: [
      'FPT Plaza và F.Home nằm cạnh khu FPT tại Ngũ Hành Sơn, thuận tiện cho nhân viên công nghệ và sinh viên. Đây cũng là mức giá mềm nhất trong nhóm các tòa căn hộ trên trang.',
      'Chủ yếu là căn 2 phòng ngủ, có thêm căn 1 và 3 phòng ngủ. Giá thuê hiện dao động khoảng 201–1.900 USD mỗi tháng, phổ biến quanh mức 532 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tiện ích được nhắc tới nhiều gồm hồ bơi, phòng gym và ban công. Đa số căn được bàn giao full nội thất, có bếp, máy lạnh, máy giặt và wifi, vào ở được ngay. So sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê — danh sách cập nhật hằng ngày từ môi giới địa phương.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại FPT Plaza / F.Home khoảng bao nhiêu?', a: 'Các tin đăng hiện tại dao động khoảng **201–1.900 USD** mỗi tháng, phổ biến quanh **532 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'FPT Plaza / F.Home nằm ở đâu?', a: 'Tại **quận Ngũ Hành Sơn**, Đà Nẵng. Xem trang khu vực để biết toàn bộ tin đăng trong quận.' },
      { q: 'Căn hộ tại FPT Plaza / F.Home có mấy phòng ngủ?', a: 'Chủ yếu là căn 2 phòng ngủ, có thêm căn 1 và 3 phòng ngủ.' },
      { q: 'Căn hộ tại FPT Plaza / F.Home có sẵn nội thất không?', a: 'Đa số được bàn giao **full nội thất**, gồm bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn — tin đăng có ghi rõ.' },
    ],
  },
  'Monarchy': {
    blurb: [
      'Monarchy là tòa căn hộ ven sông tại Hải Châu, gần cầu Rồng và khu trung tâm.',
      'Chủ yếu là căn 2 phòng ngủ, thỉnh thoảng có studio hoặc căn 3 phòng ngủ. Giá thuê hiện dao động khoảng 589–1.900 USD mỗi tháng, phổ biến quanh mức 798 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tiện ích được nhắc tới nhiều gồm hồ bơi và view sông Hàn. Đa số căn được bàn giao full nội thất, có bếp, máy lạnh, máy giặt và wifi, vào ở được ngay. So sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê — danh sách cập nhật hằng ngày từ môi giới địa phương.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Monarchy khoảng bao nhiêu?', a: 'Các tin đăng hiện tại dao động khoảng **589–1.900 USD** mỗi tháng, phổ biến quanh **798 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Monarchy nằm ở đâu?', a: 'Tại **quận Hải Châu**, Đà Nẵng. Xem trang khu vực để biết toàn bộ tin đăng trong quận.' },
      { q: 'Căn hộ tại Monarchy có mấy phòng ngủ?', a: 'Chủ yếu là căn 2 phòng ngủ, thỉnh thoảng có studio hoặc căn 3 phòng ngủ.' },
      { q: 'Căn hộ tại Monarchy có sẵn nội thất không?', a: 'Đa số được bàn giao **full nội thất**, gồm bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn — tin đăng có ghi rõ.' },
    ],
  },
  'Times Square FUTA Residence': {
    blurb: [
      'Times Square FUTA Residence nằm ngay mặt biển tại Ngũ Hành Sơn. Giá thuê ở đây thuộc nhóm cao, đổi lại là view biển trực diện.',
      'Số căn 1 phòng ngủ và 2 phòng ngủ khá cân bằng. Giá thuê hiện dao động khoảng 1.125–3.800 USD mỗi tháng, phổ biến quanh mức 2.470 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tiện ích được nhắc tới nhiều gồm hồ bơi, phòng gym, view biển và gần biển. Đa số căn được bàn giao full nội thất, có bếp, máy lạnh, máy giặt và wifi, vào ở được ngay. So sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê — danh sách cập nhật hằng ngày từ môi giới địa phương.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Times Square FUTA Residence khoảng bao nhiêu?', a: 'Các tin đăng hiện tại dao động khoảng **1.125–3.800 USD** mỗi tháng, phổ biến quanh **2.470 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Times Square FUTA Residence nằm ở đâu?', a: 'Tại **quận Ngũ Hành Sơn**, Đà Nẵng. Xem trang khu vực để biết toàn bộ tin đăng trong quận.' },
      { q: 'Căn hộ tại Times Square FUTA Residence có mấy phòng ngủ?', a: 'Số căn 1 phòng ngủ và 2 phòng ngủ khá cân bằng.' },
      { q: 'Căn hộ tại Times Square FUTA Residence có sẵn nội thất không?', a: 'Đa số được bàn giao **full nội thất**, gồm bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn — tin đăng có ghi rõ.' },
    ],
  },
  'Blooming Tower': {
    blurb: [
      'Blooming Tower nằm ven sông phía Hải Châu, thiên về các căn diện tích lớn hơn mặt bằng chung.',
      'Chủ yếu là căn 2 và 3 phòng ngủ, phù hợp cho gia đình. Giá thuê hiện dao động khoảng 920–1.900 USD mỗi tháng, phổ biến quanh mức 920 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tiện ích được nhắc tới nhiều gồm hồ bơi và ban công. Đa số căn được bàn giao full nội thất, có bếp, máy lạnh, máy giặt và wifi, vào ở được ngay. So sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê — danh sách cập nhật hằng ngày từ môi giới địa phương.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Blooming Tower khoảng bao nhiêu?', a: 'Các tin đăng hiện tại dao động khoảng **920–1.900 USD** mỗi tháng, phổ biến quanh **920 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Blooming Tower nằm ở đâu?', a: 'Tại **quận Hải Châu**, Đà Nẵng. Xem trang khu vực để biết toàn bộ tin đăng trong quận.' },
      { q: 'Căn hộ tại Blooming Tower có mấy phòng ngủ?', a: 'Chủ yếu là căn 2 và 3 phòng ngủ, phù hợp cho gia đình.' },
      { q: 'Căn hộ tại Blooming Tower có sẵn nội thất không?', a: 'Đa số được bàn giao **full nội thất**, gồm bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn — tin đăng có ghi rõ.' },
    ],
  },
  'Muong Thanh': {
    blurb: [
      'Mường Thanh là tổ hợp khách sạn và căn hộ tại Ngũ Hành Sơn, đi bộ ra biển Mỹ Khê, mức giá dễ chịu so với các tòa sát biển khác.',
      'Gần như toàn bộ là căn 2 phòng ngủ. Giá thuê hiện dao động khoảng 570–1.140 USD mỗi tháng, phổ biến quanh mức 722 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tiện ích được nhắc tới nhiều gồm gần biển và ban công. Đa số căn được bàn giao full nội thất, có bếp, máy lạnh, máy giặt và wifi, vào ở được ngay. So sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê — danh sách cập nhật hằng ngày từ môi giới địa phương.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Muong Thanh khoảng bao nhiêu?', a: 'Các tin đăng hiện tại dao động khoảng **570–1.140 USD** mỗi tháng, phổ biến quanh **722 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Muong Thanh nằm ở đâu?', a: 'Tại **quận Ngũ Hành Sơn**, Đà Nẵng. Xem trang khu vực để biết toàn bộ tin đăng trong quận.' },
      { q: 'Căn hộ tại Muong Thanh có mấy phòng ngủ?', a: 'Gần như toàn bộ là căn 2 phòng ngủ.' },
      { q: 'Căn hộ tại Muong Thanh có sẵn nội thất không?', a: 'Đa số được bàn giao **full nội thất**, gồm bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn — tin đăng có ghi rõ.' },
    ],
  },
  'Wyndham Soleil': {
    blurb: [
      'Wyndham Soleil nằm mặt biển Sơn Trà, là tòa tháp cao tầng dễ nhận ra trên trục ven biển; các căn ở tầng cao có view biển rộng.',
      'Gồm căn 1 phòng ngủ và 2 phòng ngủ. Giá thuê hiện dao động khoảng 1.064–2.090 USD mỗi tháng, phổ biến quanh mức 1.064 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tiện ích được nhắc tới nhiều gồm gần biển và view biển. Đa số căn được bàn giao full nội thất, có bếp, máy lạnh, máy giặt và wifi, vào ở được ngay. So sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê — danh sách cập nhật hằng ngày từ môi giới địa phương.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Wyndham Soleil khoảng bao nhiêu?', a: 'Các tin đăng hiện tại dao động khoảng **1.064–2.090 USD** mỗi tháng, phổ biến quanh **1.064 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Wyndham Soleil nằm ở đâu?', a: 'Tại **quận Sơn Trà**, Đà Nẵng. Xem trang khu vực để biết toàn bộ tin đăng trong quận.' },
      { q: 'Căn hộ tại Wyndham Soleil có mấy phòng ngủ?', a: 'Gồm căn 1 phòng ngủ và 2 phòng ngủ.' },
      { q: 'Căn hộ tại Wyndham Soleil có sẵn nội thất không?', a: 'Đa số được bàn giao **full nội thất**, gồm bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn — tin đăng có ghi rõ.' },
    ],
  },
  'Azura': {
    blurb: [
      'Azura là tòa căn hộ ven sông Hàn phía Sơn Trà, dễ nhận ra nhờ mặt kính cong đặc trưng.',
      'Chủ yếu là căn 2 phòng ngủ. Giá thuê hiện dao động khoảng 418–1.600 USD mỗi tháng, phổ biến quanh mức 1.216 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tiện ích được nhắc tới nhiều gồm hồ bơi, phòng gym và view sông. Đa số căn được bàn giao full nội thất, có bếp, máy lạnh, máy giặt và wifi, vào ở được ngay. So sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê — danh sách cập nhật hằng ngày từ môi giới địa phương.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Azura khoảng bao nhiêu?', a: 'Các tin đăng hiện tại dao động khoảng **418–1.600 USD** mỗi tháng, phổ biến quanh **1.216 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Azura nằm ở đâu?', a: 'Tại **quận Sơn Trà**, Đà Nẵng. Xem trang khu vực để biết toàn bộ tin đăng trong quận.' },
      { q: 'Căn hộ tại Azura có mấy phòng ngủ?', a: 'Chủ yếu là căn 2 phòng ngủ.' },
      { q: 'Căn hộ tại Azura có sẵn nội thất không?', a: 'Đa số được bàn giao **full nội thất**, gồm bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn — tin đăng có ghi rõ.' },
    ],
  },
};

const BUILDING_SEO: Record<string, BuildingSeo> = {
  'Panoma': {
    district: 'Ngu Hanh Son',
    blurb: [
      'Panoma sits on the Ngu Hanh Son side of the Han River, and it is the busiest building on this site — usually the widest choice of units in one address.',
      'Current listings are one- and two-bedroom units, with a good supply of studios. Rents run from around $532 to $2,090 a month, with the typical unit near $950 — every unit listed here is an apartment rather than a house or villa.',
      'Listings mention a pool, a gym and river outlooks, and most are let fully furnished with kitchen appliances, air conditioning, a washing machine and wifi already in place. Compare the current apartments below by bedrooms, size and monthly price; a single building turns over a limited number of units, so it is worth checking back.',
    ],
    faq: [
      { q: 'How much is an apartment for rent at Panoma?', a: 'Current listings run from about **$532** to **$2,090** per month, with the typical unit around **$950**. Smaller layouts sit at the lower end.' },
      { q: 'Where is Panoma in Da Nang?', a: 'In **Ngu Hanh Son**. See the Ngu Hanh Son page for everything currently available across that district.' },
      { q: 'How many bedrooms do Panoma apartments have?', a: 'Listings are one- and two-bedroom units, with a good supply of studios. Every unit listed at Panoma is an apartment.' },
      { q: 'Are Panoma apartments furnished?', a: 'Generally yes — most are let **fully furnished** with kitchen appliances, air conditioning, a washing machine and wifi. The listing states which.' },
    ],
  },
  'Sun Cosmo': {
    district: 'Ngu Hanh Son',
    blurb: [
      'Sun Cosmo is a riverside development in Ngu Hanh Son, a short ride from My Khe Beach and the An Thuong expat pocket.',
      'Current listings are mostly one-bedroom apartments, with studios and two-bedroom units alongside. Rents run from around $551 to $2,090 a month, with the typical unit near $950 — every unit listed here is an apartment rather than a house or villa.',
      'Listings mention a pool, a gym, balconies and river views, and most are let fully furnished with kitchen appliances, air conditioning, a washing machine and wifi already in place. Compare the current apartments below by bedrooms, size and monthly price; a single building turns over a limited number of units, so it is worth checking back.',
    ],
    faq: [
      { q: 'How much is an apartment for rent at Sun Cosmo?', a: 'Current listings run from about **$551** to **$2,090** per month, with the typical unit around **$950**. Smaller layouts sit at the lower end.' },
      { q: 'Where is Sun Cosmo in Da Nang?', a: 'In **Ngu Hanh Son**. See the Ngu Hanh Son page for everything currently available across that district.' },
      { q: 'How many bedrooms do Sun Cosmo apartments have?', a: 'Listings are mostly one-bedroom apartments, with studios and two-bedroom units alongside. Every unit listed at Sun Cosmo is an apartment.' },
      { q: 'Are Sun Cosmo apartments furnished?', a: 'Generally yes — most are let **fully furnished** with kitchen appliances, air conditioning, a washing machine and wifi. The listing states which.' },
    ],
  },
  'The Filmore': {
    district: 'Hai Chau',
    blurb: [
      'The Filmore is one of the more premium riverfront towers in Hai Chau, and its rents sit well above the city average — this is the top of the Da Nang apartment market rather than the middle.',
      'Current listings are two-bedroom apartments, with one- and three-bedroom options. Rents run from around $1,064 to $4,940 a month, with the typical unit near $1,520 — every unit listed here is an apartment rather than a house or villa.',
      'Listings mention a pool, a gym and Han River views, and most are let fully furnished with kitchen appliances, air conditioning, a washing machine and wifi already in place. Compare the current apartments below by bedrooms, size and monthly price; a single building turns over a limited number of units, so it is worth checking back.',
    ],
    faq: [
      { q: 'How much is an apartment for rent at The Filmore?', a: 'Current listings run from about **$1,064** to **$4,940** per month, with the typical unit around **$1,520**. Smaller layouts sit at the lower end.' },
      { q: 'Where is The Filmore in Da Nang?', a: 'In **Hai Chau**. See the Hai Chau page for everything currently available across that district.' },
      { q: 'How many bedrooms do The Filmore apartments have?', a: 'Listings are two-bedroom apartments, with one- and three-bedroom options. Every unit listed at The Filmore is an apartment.' },
      { q: 'Are The Filmore apartments furnished?', a: 'Generally yes — most are let **fully furnished** with kitchen appliances, air conditioning, a washing machine and wifi. The listing states which.' },
    ],
  },
  'Hiyori Garden Tower': {
    district: 'Son Tra',
    blurb: [
      'Hiyori Garden Tower is a Japanese-developed tower in Son Tra, walkable to the beach and popular with Japanese and Korean tenants.',
      'Current listings are almost entirely two-bedroom apartments. Rents run from around $646 to $1,064 a month, with the typical unit near $874 — every unit listed here is an apartment rather than a house or villa.',
      'Listings mention a pool, a gym, balconies and beach access, and most are let fully furnished with kitchen appliances, air conditioning, a washing machine and wifi already in place. Compare the current apartments below by bedrooms, size and monthly price; a single building turns over a limited number of units, so it is worth checking back.',
    ],
    faq: [
      { q: 'How much is an apartment for rent at Hiyori Garden Tower?', a: 'Current listings run from about **$646** to **$1,064** per month, with the typical unit around **$874**. Smaller layouts sit at the lower end.' },
      { q: 'Where is Hiyori Garden Tower in Da Nang?', a: 'In **Son Tra**. See the Son Tra page for everything currently available across that district.' },
      { q: 'How many bedrooms do Hiyori Garden Tower apartments have?', a: 'Listings are almost entirely two-bedroom apartments. Every unit listed at Hiyori Garden Tower is an apartment.' },
      { q: 'Are Hiyori Garden Tower apartments furnished?', a: 'Generally yes — most are let **fully furnished** with kitchen appliances, air conditioning, a washing machine and wifi. The listing states which.' },
    ],
  },
  'FPT Plaza / F.Home': {
    district: 'Ngu Hanh Son',
    blurb: [
      'FPT Plaza and F.Home sit beside the FPT campus in Ngu Hanh Son, which makes them the default choice for tech staff and students — and the cheapest entry point of any building here.',
      'Current listings are two-bedroom apartments, with one- and three-bedroom units. Rents run from around $201 to $1,900 a month, with the typical unit near $532 — every unit listed here is an apartment rather than a house or villa.',
      'Listings mention a pool, a gym and balconies, and most are let fully furnished with kitchen appliances, air conditioning, a washing machine and wifi already in place. Compare the current apartments below by bedrooms, size and monthly price; a single building turns over a limited number of units, so it is worth checking back.',
    ],
    faq: [
      { q: 'How much is an apartment for rent at FPT Plaza / F.Home?', a: 'Current listings run from about **$201** to **$1,900** per month, with the typical unit around **$532**. Smaller layouts sit at the lower end.' },
      { q: 'Where is FPT Plaza / F.Home in Da Nang?', a: 'In **Ngu Hanh Son**. See the Ngu Hanh Son page for everything currently available across that district.' },
      { q: 'How many bedrooms do FPT Plaza / F.Home apartments have?', a: 'Listings are two-bedroom apartments, with one- and three-bedroom units. Every unit listed at FPT Plaza / F.Home is an apartment.' },
      { q: 'Are FPT Plaza / F.Home apartments furnished?', a: 'Generally yes — most are let **fully furnished** with kitchen appliances, air conditioning, a washing machine and wifi. The listing states which.' },
    ],
  },
  'Monarchy': {
    district: 'Hai Chau',
    blurb: [
      'Monarchy is a riverfront block in Hai Chau, close to the Dragon Bridge and the central business area.',
      'Current listings are two-bedroom apartments, with the occasional studio or three-bedroom. Rents run from around $589 to $1,900 a month, with the typical unit near $798 — every unit listed here is an apartment rather than a house or villa.',
      'Listings mention a pool and Han River views, and most are let fully furnished with kitchen appliances, air conditioning, a washing machine and wifi already in place. Compare the current apartments below by bedrooms, size and monthly price; a single building turns over a limited number of units, so it is worth checking back.',
    ],
    faq: [
      { q: 'How much is an apartment for rent at Monarchy?', a: 'Current listings run from about **$589** to **$1,900** per month, with the typical unit around **$798**. Smaller layouts sit at the lower end.' },
      { q: 'Where is Monarchy in Da Nang?', a: 'In **Hai Chau**. See the Hai Chau page for everything currently available across that district.' },
      { q: 'How many bedrooms do Monarchy apartments have?', a: 'Listings are two-bedroom apartments, with the occasional studio or three-bedroom. Every unit listed at Monarchy is an apartment.' },
      { q: 'Are Monarchy apartments furnished?', a: 'Generally yes — most are let **fully furnished** with kitchen appliances, air conditioning, a washing machine and wifi. The listing states which.' },
    ],
  },
  'Times Square FUTA Residence': {
    district: 'Ngu Hanh Son',
    blurb: [
      'Times Square FUTA Residence sits directly on the beachfront in Ngu Hanh Son. It is the most expensive building on this site by median rent, and the sea views are the reason.',
      'Current listings are an even split of one- and two-bedroom apartments. Rents run from around $1,125 to $3,800 a month, with the typical unit near $2,470 — every unit listed here is an apartment rather than a house or villa.',
      'Listings mention a pool, a gym, sea views and beach access, and most are let fully furnished with kitchen appliances, air conditioning, a washing machine and wifi already in place. Compare the current apartments below by bedrooms, size and monthly price; a single building turns over a limited number of units, so it is worth checking back.',
    ],
    faq: [
      { q: 'How much is an apartment for rent at Times Square FUTA Residence?', a: 'Current listings run from about **$1,125** to **$3,800** per month, with the typical unit around **$2,470**. Smaller layouts sit at the lower end.' },
      { q: 'Where is Times Square FUTA Residence in Da Nang?', a: 'In **Ngu Hanh Son**. See the Ngu Hanh Son page for everything currently available across that district.' },
      { q: 'How many bedrooms do Times Square FUTA Residence apartments have?', a: 'Listings are an even split of one- and two-bedroom apartments. Every unit listed at Times Square FUTA Residence is an apartment.' },
      { q: 'Are Times Square FUTA Residence apartments furnished?', a: 'Generally yes — most are let **fully furnished** with kitchen appliances, air conditioning, a washing machine and wifi. The listing states which.' },
    ],
  },
  'Blooming Tower': {
    district: 'Hai Chau',
    blurb: [
      'Blooming Tower is a riverside building on the Hai Chau bank, and it skews to family-sized units rather than studios.',
      'Current listings are two- and three-bedroom apartments — larger layouts than most towers here. Rents run from around $920 to $1,900 a month, with the typical unit near $920 — every unit listed here is an apartment rather than a house or villa.',
      'Listings mention a pool and balconies, and most are let fully furnished with kitchen appliances, air conditioning, a washing machine and wifi already in place. Compare the current apartments below by bedrooms, size and monthly price; a single building turns over a limited number of units, so it is worth checking back.',
    ],
    faq: [
      { q: 'How much is an apartment for rent at Blooming Tower?', a: 'Current listings run from about **$920** to **$1,900** per month, with the typical unit around **$920**. Smaller layouts sit at the lower end.' },
      { q: 'Where is Blooming Tower in Da Nang?', a: 'In **Hai Chau**. See the Hai Chau page for everything currently available across that district.' },
      { q: 'How many bedrooms do Blooming Tower apartments have?', a: 'Listings are two- and three-bedroom apartments — larger layouts than most towers here. Every unit listed at Blooming Tower is an apartment.' },
      { q: 'Are Blooming Tower apartments furnished?', a: 'Generally yes — most are let **fully furnished** with kitchen appliances, air conditioning, a washing machine and wifi. The listing states which.' },
    ],
  },
  'Muong Thanh': {
    district: 'Ngu Hanh Son',
    blurb: [
      'Muong Thanh is a large hotel-and-apartment complex in Ngu Hanh Son, a short walk from My Khe Beach, and one of the more affordable beachside addresses.',
      'Current listings are almost all two-bedroom apartments. Rents run from around $570 to $1,140 a month, with the typical unit near $722 — every unit listed here is an apartment rather than a house or villa.',
      'Listings mention beach access and balconies, and most are let fully furnished with kitchen appliances, air conditioning, a washing machine and wifi already in place. Compare the current apartments below by bedrooms, size and monthly price; a single building turns over a limited number of units, so it is worth checking back.',
    ],
    faq: [
      { q: 'How much is an apartment for rent at Muong Thanh?', a: 'Current listings run from about **$570** to **$1,140** per month, with the typical unit around **$722**. Smaller layouts sit at the lower end.' },
      { q: 'Where is Muong Thanh in Da Nang?', a: 'In **Ngu Hanh Son**. See the Ngu Hanh Son page for everything currently available across that district.' },
      { q: 'How many bedrooms do Muong Thanh apartments have?', a: 'Listings are almost all two-bedroom apartments. Every unit listed at Muong Thanh is an apartment.' },
      { q: 'Are Muong Thanh apartments furnished?', a: 'Generally yes — most are let **fully furnished** with kitchen appliances, air conditioning, a washing machine and wifi. The listing states which.' },
    ],
  },
  'Wyndham Soleil': {
    district: 'Son Tra',
    blurb: [
      'Wyndham Soleil is a high-rise landmark on the Son Tra beachfront, and the upper floors come with the wide sea views that implies.',
      'Current listings are one- and two-bedroom apartments. Rents run from around $1,064 to $2,090 a month, with the typical unit near $1,064 — every unit listed here is an apartment rather than a house or villa.',
      'Listings mention beach access and sea views, and most are let fully furnished with kitchen appliances, air conditioning, a washing machine and wifi already in place. Compare the current apartments below by bedrooms, size and monthly price; a single building turns over a limited number of units, so it is worth checking back.',
    ],
    faq: [
      { q: 'How much is an apartment for rent at Wyndham Soleil?', a: 'Current listings run from about **$1,064** to **$2,090** per month, with the typical unit around **$1,064**. Smaller layouts sit at the lower end.' },
      { q: 'Where is Wyndham Soleil in Da Nang?', a: 'In **Son Tra**. See the Son Tra page for everything currently available across that district.' },
      { q: 'How many bedrooms do Wyndham Soleil apartments have?', a: 'Listings are one- and two-bedroom apartments. Every unit listed at Wyndham Soleil is an apartment.' },
      { q: 'Are Wyndham Soleil apartments furnished?', a: 'Generally yes — most are let **fully furnished** with kitchen appliances, air conditioning, a washing machine and wifi. The listing states which.' },
    ],
  },
  'Azura': {
    district: 'Son Tra',
    blurb: [
      'Azura is a landmark riverfront tower on the Son Tra bank of the Han River, recognisable by its curved glass facade.',
      'Current listings are mostly two-bedroom apartments. Rents run from around $418 to $1,600 a month, with the typical unit near $1,216 — every unit listed here is an apartment rather than a house or villa.',
      'Listings mention a pool, a gym and river views, and most are let fully furnished with kitchen appliances, air conditioning, a washing machine and wifi already in place. Compare the current apartments below by bedrooms, size and monthly price; a single building turns over a limited number of units, so it is worth checking back.',
    ],
    faq: [
      { q: 'How much is an apartment for rent at Azura?', a: 'Current listings run from about **$418** to **$1,600** per month, with the typical unit around **$1,216**. Smaller layouts sit at the lower end.' },
      { q: 'Where is Azura in Da Nang?', a: 'In **Son Tra**. See the Son Tra page for everything currently available across that district.' },
      { q: 'How many bedrooms do Azura apartments have?', a: 'Listings are mostly two-bedroom apartments. Every unit listed at Azura is an apartment.' },
      { q: 'Are Azura apartments furnished?', a: 'Generally yes — most are let **fully furnished** with kitchen appliances, air conditioning, a washing machine and wifi. The listing states which.' },
    ],
  },
  'Sam Towers': {
    district: 'Hai Chau',
    blurb: [
      `Sam Towers is a riverside apartment complex in Hai Chau, Da Nang's central district, a short walk from the Han River and the Dragon Bridge. Every listing here is an apartment for rent at Sam Towers rather than a house or villa, which makes it a straightforward choice if you want a serviced building with a lift, security and on-site parking instead of a standalone property.`,
      `Most apartments for rent at Sam Towers are two-bedroom layouts, with a steady supply of one-bedroom units and the occasional three-bedroom. Rents currently run from around $684 to $2,280 a month, with the typical unit near $950 — higher than an equivalent apartment in Cam Le or Lien Chieu, and priced for the central location and the river views many of the upper floors have.`,
      `The building's shared facilities are the draw: a swimming pool and a gym appear in most listings, alongside balconies and Han River outlooks. Apartments are generally rented fully furnished, with kitchen appliances, air conditioning, a washing machine and wifi already in place, so a Sam Towers apartment is usually ready to move into rather than something you fit out.`,
      `Compare the current Sam Towers apartments below by bedrooms, size and monthly price. Listings are updated daily from local agents and property managers, and because a single building turns over a limited number of units, it is worth checking back rather than waiting for a long shortlist to build up.`,
    ],
    faq: [
      { q: 'How much is an apartment for rent at Sam Towers?', a: 'Current listings run from about **$684** to **$2,280** per month, with the typical unit around **$950**. One-bedroom apartments sit at the lower end and larger two- and three-bedroom units with river views at the top.' },
      { q: 'How many bedrooms do Sam Towers apartments have?', a: 'Mostly **two bedrooms**. One-bedroom units are regularly available and three-bedroom layouts appear occasionally. Every unit listed at Sam Towers is an apartment — there are no houses or villas in the building.' },
      { q: 'Where is Sam Towers in Da Nang?', a: 'In **Hai Chau**, the central district, close to the **Han River** and Dragon Bridge. It is walking distance to central offices, cafes and restaurants, and a short drive from My Khe Beach.' },
      { q: 'Does Sam Towers have a pool and gym?', a: 'Yes — a **swimming pool** and **gym** are named in most current listings, along with a lift, security and parking. Confirm which facilities are included in your rent with the agent before signing.' },
      { q: 'Are Sam Towers apartments furnished?', a: 'Generally yes. Most are let **fully furnished** with kitchen appliances, air conditioning, a washing machine and wifi. A small number are let unfurnished at a lower rent — the listing states which.' },
    ],
  },
};

function buildingEn(name: string, mode: Mode): FacetSeoBody {
  const rentSale = mode === 'rent' ? 'for rent' : 'for sale';
  // Sale-mode matches are mostly listings that mention the building as a nearby
  // landmark (a 'House' in Son Tra matching /monarchy/), so bespoke copy is rent-only.
  const b = mode === 'rent' ? BUILDING_SEO[name] : undefined;
  if (!b) {
    // Generic fallback for buildings without bespoke copy yet.
    return {
      h2: `Apartments ${rentSale} at ${name}, Da Nang`,
      intro: [
        `${name} is one of Da Nang's better-known apartment buildings. The listings below are the units currently available ${rentSale} there, updated daily from local agents and property managers.`,
        `Compare them by bedrooms, size and monthly price. Because a single building turns over a limited number of units, it is worth checking back rather than waiting for a long shortlist to build up.`,
      ],
      faqHeading: `${name} — Frequently Asked Questions`,
      faq: [
        { q: `How many apartments are ${rentSale} at ${name}?`, a: `The count above reflects what is currently listed. It changes daily as agents add and remove units.` },
      ],
    };
  }
  return {
    h2: mode === 'rent'
      ? `Apartment for Rent at ${name} — ${b.district}, Da Nang`
      : `Apartments for Sale at ${name} — ${b.district}, Da Nang`,
    intro: b.blurb,
    faqHeading: `${name} — Frequently Asked Questions`,
    faq: b.faq,
  };
}

function buildingVi(name: string, mode: Mode): FacetSeoBody {
  const thueBan = mode === 'rent' ? 'cho thuê' : 'bán';
  const v = mode === 'rent' ? BUILDING_SEO_VI[name] : undefined;
  return {
    h2: `Căn hộ ${thueBan} tại ${name}, Đà Nẵng`,
    intro: v ? v.blurb : [
      `${name} là một trong những tòa căn hộ được biết đến tại Đà Nẵng. Danh sách bên dưới là các căn hiện đang ${thueBan}, cập nhật hằng ngày từ môi giới địa phương.`,
    ],
    faqHeading: `${name} — Câu hỏi thường gặp`,
    faq: v ? v.faq : [],
  };
}
