import type { Facet, Mode } from './facets';

// Facet-aware bottom-section copy (SEO prose + FAQ). Returns null to fall back
// to the generic mode-level copy in translations.ts (used for district/bedroom
// facets and the plain /for-rent, /for-sale pages).

export interface FacetSeoBody { h2: string; intro: string[]; faqHeading: string; faq: { q: string; a: string }[] }

const EN_TYPE_PLURAL: Record<string, string> = {
  House: 'Houses', Apartment: 'Apartments', Villa: 'Villas', Townhouse: 'Townhouses',
  Studio: 'Studios', Land: 'Land', Office: 'Offices', Retail: 'Retail Spaces',
  Shophouse: 'Shophouses', Commercial: 'Commercial Properties',
};

export function facetSeoBody(f: Facet, mode: Mode, lang: 'en' | 'vi'): FacetSeoBody | null {
  if (f.kind === 'type') return lang === 'vi' ? typeVi(f.value, mode) : typeEn(f.value, mode);
  if (f.kind === 'foreign') return lang === 'vi' ? foreignVi() : foreignEn();
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
