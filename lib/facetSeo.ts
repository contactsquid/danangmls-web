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
// Lowercase Vietnamese nouns for the generic types, used inside prose.
const VI_TYPE_NOUN: Record<string, string> = {
  Villa: 'biệt thự', Townhouse: 'nhà phố', Studio: 'căn hộ studio', Land: 'đất',
  Office: 'văn phòng', Retail: 'mặt bằng kinh doanh', Shophouse: 'shophouse',
  Commercial: 'mặt bằng kinh doanh',
};

function typeVi(value: string, mode: Mode): FacetSeoBody {
  const thueBan = mode === 'rent' ? 'cho thuê' : 'bán';
  const thueBanLc = mode === 'rent' ? 'cho thuê' : 'bán';
  const thueMua = mode === 'rent' ? 'thuê' : 'mua';

  if (value === 'House') {
    return {
      h2: mode === 'rent'
        ? `Nhà ${thueBan} Đà Nẵng — rộng rãi, riêng tư, đủ chỗ cho cả gia đình`
        : `Bán nhà Đà Nẵng — rộng rãi, riêng tư, đủ chỗ cho cả gia đình`,
      intro: [
        `So với căn hộ, **nhà ${thueBanLc} tại Đà Nẵng** cho bạn nhiều hơn hẳn: nhiều **phòng ngủ**, bếp riêng, thường có sân, sân thượng hoặc chỗ để xe, lại nằm trong những con phố yên tĩnh chỉ cách biển vài phút chạy xe. Nhà ở Đà Nẵng có đủ kiểu, từ nhà phố gọn gàng ở **Hải Châu**, nhà rộng cho gia đình ở **An Thượng** đến biệt thự sân vườn về phía **Ngũ Hành Sơn**.`,
        mode === 'rent'
          ? `Phần lớn **nhà cho thuê** ở đây có từ hai đến năm **phòng ngủ** và nhiều phòng tắm, thường cho thuê dài hạn từ ba tháng trở lên, đầy đủ nội thất cùng **bếp** hiện đại. Bạn có thể so sánh thiết kế, quận và giá thuê (USD) ở các tin đăng phía trên, rồi nhắn thẳng cho môi giới khi ưng căn nào.`
          : `**Nhà bán tại Đà Nẵng** gồm nhà phố nhiều tầng và nhà đất có diện tích sử dụng rộng. Lưu ý: người nước ngoài thường chỉ mua được **căn hộ** đủ điều kiện chứ không mua nhà gắn liền với đất, nên hãy hỏi kỹ về hình thức sở hữu của từng tin. Bạn có thể so sánh quận, diện tích đất và giá (USD) ở các tin đăng phía trên.`,
      ],
      faqHeading: `Câu hỏi thường gặp khi ${thueMua} nhà tại Đà Nẵng`,
      faq: mode === 'rent' ? [
        { q: 'Giá thuê nhà nguyên căn tại Đà Nẵng là bao nhiêu?', a: `**Nhà cho thuê** hai đến ba **phòng ngủ** tại **Đà Nẵng** thường có giá khoảng 500–1.200 USD mỗi **tháng**, tùy **khu vực**, diện tích và khoảng cách ra biển. Giá cập nhật có ở các tin đăng phía trên.` },
        { q: 'Nhà cho thuê ở Đà Nẵng có sẵn nội thất không?', a: `Nhiều **nhà cho thuê** có sẵn nội thất toàn bộ hoặc một phần, gồm **bếp**, máy lạnh và đồ dùng cơ bản. Tin đăng nào cũng ghi rõ những gì đi kèm, nhưng bạn nên hỏi lại **môi giới** trước khi ký.` },
        { q: 'Nên thuê nhà ở khu nào tại Đà Nẵng?', a: `Các gia đình thường chọn **An Thượng** và **Mỹ An** gần biển Mỹ Khê, **Hải Châu** nếu muốn ở trung tâm, hoặc **Ngũ Hành Sơn** nếu cần nhà rộng và yên tĩnh hơn.` },
      ] : [
        { q: 'Người nước ngoài có được mua nhà đất tại Đà Nẵng không?', a: `Nhìn chung là không. Người nước ngoài không được đứng tên **nhà** gắn liền với đất hay **đất** tại **Việt Nam**, vì loại tài sản này chỉ dành cho công dân Việt Nam. Thay vào đó, người nước ngoài có thể mua **căn hộ** đủ điều kiện, sở hữu theo giấy chứng nhận 50 năm và có thể gia hạn.` },
        { q: 'Giá bán nhà tại Đà Nẵng là bao nhiêu?', a: `Giá **nhà bán** tại **Đà Nẵng** chênh lệch khá lớn: nhà phố ở khu xa biển từ khoảng 150.000 USD, còn nhà rộng cho gia đình và **biệt thự** ven biển gần Mỹ Khê từ 400.000 USD trở lên. Bạn có thể so sánh các tin đăng phía trên.` },
        { q: 'Thủ tục mua nhà tại Đà Nẵng gồm những bước nào?', a: `Thông thường gồm: đặt cọc, ký hợp đồng mua bán, thanh toán theo tiến độ, rồi sang tên. Làm việc cùng **môi giới** địa phương và luật sư sẽ giúp giấy tờ rõ ràng, nhất là phần quyền sử dụng đất.` },
      ],
    };
  }

  if (value === 'Apartment') {
    return {
      h2: mode === 'rent'
        ? `Căn hộ ${thueBan} Đà Nẵng — đầy đủ tiện ích, không lo bảo trì`
        : `Bán căn hộ Đà Nẵng — đầy đủ tiện ích, không lo bảo trì`,
      intro: [
        `**Căn hộ ${thueBanLc} tại Đà Nẵng** là cách ổn định chỗ ở nhanh gọn: có sẵn nội thất, ít phải lo bảo trì, và thường nằm trong tòa nhà có hồ bơi, phòng gym, bảo vệ 24/24. Bạn có thể chọn từ **studio** nhỏ gọn đến **căn hộ ba phòng ngủ**, ở các tòa tháp ven biển **Sơn Trà** và **Mỹ An**, các tòa nhà dọc sông Hàn, hay những khu căn hộ mới tại **Hải Châu** và **Ngũ Hành Sơn**.`,
        mode === 'rent'
          ? `**Căn hộ cho thuê** hợp với người nước ngoài, người làm việc từ xa và các cặp đôi muốn dọn vào ở ngay: đa số có đủ nội thất cùng **bếp** hiện đại, ngoài ra còn có căn hộ dịch vụ cho ai ở ngắn hạn. Bạn có thể so sánh từ studio đến căn cho gia đình, từng tòa nhà và giá thuê theo tháng (USD) ở các tin đăng phía trên.`
          : `Với người nước ngoài, mua **căn hộ** là con đường chính để sở hữu nhà: trong các tòa nhà được phép bán cho người nước ngoài, bạn được sở hữu hợp pháp theo giấy chứng nhận 50 năm, có thể gia hạn (tối đa 30% số căn của mỗi tòa). Hãy xem các tin dành cho người nước ngoài, rồi so sánh tòa nhà, tầng, hướng nhìn và giá (USD) ở phía trên.`,
      ],
      faqHeading: `Câu hỏi thường gặp khi ${thueMua} căn hộ tại Đà Nẵng`,
      faq: mode === 'rent' ? [
        { q: 'Giá thuê căn hộ tại Đà Nẵng là bao nhiêu?', a: `**Căn hộ** studio hoặc một **phòng ngủ** có nội thất thường từ 300–500 USD mỗi **tháng**, còn căn hai đến ba **phòng ngủ** khoảng 500–1.200 USD, tùy tòa nhà và **khu vực**. Các tòa ven biển có hồ bơi, phòng gym thường giá cao hơn. Giá cập nhật có ở phía trên.` },
        { q: 'Căn hộ ở Đà Nẵng có hồ bơi và phòng gym không?', a: `Nhiều tòa **căn hộ** tầm trung và cao cấp ở **Đà Nẵng** có hồ bơi, phòng gym và bảo vệ 24/24, đã tính vào **giá thuê** hoặc thu qua một khoản phí quản lý nhỏ. Tiện ích của từng tòa đều ghi trong tin đăng.` },
        { q: 'Người nước ngoài có thuê căn hộ ở Đà Nẵng được không?', a: `Được. Người nước ngoài có thể **thuê căn hộ** tại **Đà Nẵng** như bình thường: chỉ cần ký hợp đồng với chủ nhà hoặc **môi giới**, bên cho thuê sẽ khai báo tạm trú cho bạn với công an địa phương. Thuê theo tháng hay dài hạn đều phổ biến.` },
      ] : [
        { q: 'Người nước ngoài có được mua căn hộ tại Đà Nẵng không?', a: `Có. Người nước ngoài được **mua** và sở hữu hợp pháp **căn hộ** tại **Đà Nẵng** trong các tòa nhà được phép, theo giấy chứng nhận sở hữu 50 năm, có thể gia hạn (tối đa 30% số căn của mỗi tòa). Xem các tin dành cho người nước ngoài để biết căn nào đủ điều kiện.` },
        { q: 'Giá mua căn hộ tại Đà Nẵng là bao nhiêu?', a: `**Căn hộ** phổ thông từ khoảng 60.000–120.000 USD, **căn hộ** tầm trung ven biển 150.000–300.000 USD, còn penthouse cao cấp thì cao hơn nhiều. Giá phụ thuộc vào tòa nhà, tầng và hướng nhìn; bạn có thể so sánh giá USD ở phía trên.` },
        { q: 'Mua căn hộ Đà Nẵng có đáng đầu tư không?', a: `Nhiều người nước ngoài mua **căn hộ** đủ điều kiện tại **Đà Nẵng** để cho thuê và chờ tăng giá dài hạn, nhờ du lịch phát triển và cộng đồng người nước ngoài ngày càng đông. Lợi nhuận còn tùy tòa nhà, vị trí và thời điểm mua.` },
      ],
    };
  }

  // Generic type (VI)
  const viType = VI_TYPE_NOUN[value] || value.toLowerCase();
  const viTypeCap = viType.charAt(0).toUpperCase() + viType.slice(1);
  return {
    h2: mode === 'rent' ? `${viTypeCap} ${thueBan} Đà Nẵng, Việt Nam` : `Bán ${viType} Đà Nẵng, Việt Nam`,
    intro: [
      `Bạn đang ${mode === 'rent' ? `tìm **${viType} ${thueBanLc} tại Đà Nẵng**` : `tìm mua **${viType} tại Đà Nẵng**`}? Các tin đăng hiện có trải khắp các **quận**, từ trung tâm **Hải Châu** đến vùng biển **Sơn Trà** và **Ngũ Hành Sơn**. Bạn có thể so sánh diện tích, vị trí, giá (USD) và liên hệ thẳng với **môi giới** khi thấy tin phù hợp.`,
      `Tin đăng mới được cập nhật mỗi ngày từ các **môi giới bất động sản** địa phương ở **Đà Nẵng** và Hội An.`,
    ],
    faqHeading: `Câu hỏi thường gặp khi ${thueMua} bất động sản tại Đà Nẵng`,
    faq: [
      { q: mode === 'rent' ? `Giá thuê ${viType} tại Đà Nẵng là bao nhiêu?` : `Giá ${viType} tại Đà Nẵng là bao nhiêu?`, a: `Giá ${viType} tại **Đà Nẵng** tùy vào **khu vực**, diện tích và hiện trạng. Bạn có thể xem giá cập nhật (USD) ở các tin đăng phía trên và so sánh giữa các quận để chọn mức giá hợp lý.` },
    ],
  };
}

function foreignVi(): FacetSeoBody {
  return {
    h2: `Bất động sản người nước ngoài được phép mua tại Đà Nẵng`,
    intro: [
      `Đây là những bất động sản tại **Đà Nẵng** mà người nước ngoài được phép **mua** hợp pháp. Theo luật Việt Nam, người nước ngoài được sở hữu **căn hộ** trong các tòa nhà được phép, tối đa 30% số căn của mỗi tòa, theo **giấy chứng nhận quyền sở hữu thời hạn 50 năm, có thể gia hạn** (sổ hồng). Riêng **nhà** gắn liền với đất và **đất** vẫn chỉ dành cho công dân Việt Nam.`,
      `Mọi tin đăng ở đây đều nằm trong tòa nhà được phép bán cho người nước ngoài. Bạn có thể so sánh tòa nhà, tầng, hướng nhìn và giá (USD) ở phía trên, đồng thời hỏi **môi giới** xem hạn mức dành cho người nước ngoài còn bao nhiêu căn và giấy chứng nhận của từng căn ra sao.`,
    ],
    faqHeading: `Câu hỏi thường gặp về việc người nước ngoài sở hữu bất động sản tại Đà Nẵng`,
    faq: [
      { q: 'Người nước ngoài có được sở hữu bất động sản tại Đà Nẵng không?', a: `Có. Người nước ngoài được sở hữu hợp pháp **căn hộ** trong các tòa nhà được phép tại **Đà Nẵng**, theo giấy chứng nhận 50 năm có thể gia hạn. Mỗi tòa nhà chỉ cho người nước ngoài sở hữu tối đa 30% số căn.` },
      { q: 'Người nước ngoài không được mua loại bất động sản nào ở Việt Nam?', a: `Nhìn chung, người nước ngoài không được đứng tên **đất** hay **nhà** gắn liền với đất, vì những tài sản này yêu cầu quốc tịch Việt Nam. Người nước ngoài chỉ được sở hữu **căn hộ** đủ điều kiện.` },
      { q: 'Người nước ngoài có được bán lại hoặc cho thuê căn hộ tại Đà Nẵng không?', a: `Được. Chủ sở hữu nước ngoài có thể **cho thuê** căn hộ để có thu nhập, cũng như bán lại, theo đúng điều khoản trên giấy chứng nhận sở hữu. Nhiều người mua **căn hộ** đủ điều kiện chính là để cho thuê và chờ tăng giá.` },
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
// Hàn", "tòa căn hộ", "xách vali vào ở". Kiểu cũ tone marks and "USD" spelled
// out after the figure, matching the rest of the site.
const BUILDING_SEO_VI: Record<string, BuildingSeoVi> = {
  'Sam Towers': {
    blurb: [
      'Sam Towers là tòa căn hộ ven sông tại quận Hải Châu, Đà Nẵng, gần sông Hàn và cầu Rồng. Tất cả tin đăng tại đây đều là căn hộ, hợp với bạn nếu muốn ở tòa nhà có thang máy, bảo vệ và chỗ để xe thay vì nhà riêng.',
      'Phần lớn là căn 2 phòng ngủ, ngoài ra có căn 1 phòng ngủ và đôi khi có căn 3 phòng ngủ. Giá thuê hiện khoảng 684–2.280 USD mỗi tháng, phổ biến quanh mức 950 USD.',
      'Tin đăng ở đây thường nhắc tới hồ bơi, phòng gym và view sông Hàn ở các tầng cao. Đa số căn cho thuê full nội thất, có sẵn bếp, máy lạnh, máy giặt và wifi, chỉ việc xách vali vào ở. Bạn có thể so sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê; tin đăng được môi giới địa phương cập nhật hằng ngày.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Sam Towers khoảng bao nhiêu?', a: 'Các tin đăng hiện có giá khoảng **684–2.280 USD** mỗi tháng, phổ biến quanh **950 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Sam Towers nằm ở đâu?', a: 'Tại **quận Hải Châu**, gần **sông Hàn** và cầu Rồng, thuận tiện đi làm ở trung tâm và cách bãi biển Mỹ Khê một quãng ngắn.' },
      { q: 'Căn hộ tại Sam Towers có mấy phòng ngủ?', a: 'Chủ yếu là **2 phòng ngủ**. Căn 1 phòng ngủ cũng khá thường gặp, thỉnh thoảng có căn 3 phòng ngủ.' },
      { q: 'Sam Towers có hồ bơi và phòng gym không?', a: 'Có. Phần lớn tin đăng đều nhắc tới **hồ bơi** và **phòng gym**, kèm thang máy, bảo vệ và chỗ để xe.' },
    ],
  },
  'Panoma': {
    blurb: [
      'Panoma nằm bên bờ sông Hàn phía Ngũ Hành Sơn, hiện là tòa có nhiều tin đăng nhất trên DanangMLS, nên bạn có nhiều lựa chọn căn trong cùng một địa chỉ.',
      'Chủ yếu là căn 1 phòng ngủ và 2 phòng ngủ, kèm khá nhiều căn studio. Giá thuê hiện khoảng 532–2.090 USD mỗi tháng, phổ biến quanh mức 950 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tin đăng ở đây thường nhắc tới hồ bơi, phòng gym và view sông. Đa số căn cho thuê full nội thất, có sẵn bếp, máy lạnh, máy giặt và wifi, chỉ việc xách vali vào ở. Bạn có thể so sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê; tin đăng được môi giới địa phương cập nhật hằng ngày.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Panoma khoảng bao nhiêu?', a: 'Các tin đăng hiện có giá khoảng **532–2.090 USD** mỗi tháng, phổ biến quanh **950 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Panoma nằm ở đâu?', a: 'Tại **quận Ngũ Hành Sơn**, Đà Nẵng. Bạn có thể xem trang của quận để thấy toàn bộ tin đăng trong khu vực.' },
      { q: 'Căn hộ tại Panoma có mấy phòng ngủ?', a: 'Chủ yếu là căn 1 phòng ngủ và 2 phòng ngủ, kèm khá nhiều căn studio.' },
      { q: 'Căn hộ tại Panoma có sẵn nội thất không?', a: 'Đa số cho thuê **full nội thất**, có sẵn bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn, tin đăng có ghi rõ.' },
    ],
  },
  'Sun Cosmo': {
    blurb: [
      'Sun Cosmo là tòa căn hộ ven sông tại Ngũ Hành Sơn, chạy xe vài phút là tới biển Mỹ Khê và khu An Thượng.',
      'Phần lớn là căn 1 phòng ngủ, bên cạnh studio và căn 2 phòng ngủ. Giá thuê hiện khoảng 551–2.090 USD mỗi tháng, phổ biến quanh mức 950 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tin đăng ở đây thường nhắc tới hồ bơi, phòng gym, ban công và view sông. Đa số căn cho thuê full nội thất, có sẵn bếp, máy lạnh, máy giặt và wifi, chỉ việc xách vali vào ở. Bạn có thể so sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê; tin đăng được môi giới địa phương cập nhật hằng ngày.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Sun Cosmo khoảng bao nhiêu?', a: 'Các tin đăng hiện có giá khoảng **551–2.090 USD** mỗi tháng, phổ biến quanh **950 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Sun Cosmo nằm ở đâu?', a: 'Tại **quận Ngũ Hành Sơn**, Đà Nẵng. Bạn có thể xem trang của quận để thấy toàn bộ tin đăng trong khu vực.' },
      { q: 'Căn hộ tại Sun Cosmo có mấy phòng ngủ?', a: 'Phần lớn là căn 1 phòng ngủ, bên cạnh studio và căn 2 phòng ngủ.' },
      { q: 'Căn hộ tại Sun Cosmo có sẵn nội thất không?', a: 'Đa số cho thuê **full nội thất**, có sẵn bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn, tin đăng có ghi rõ.' },
    ],
  },
  'The Filmore': {
    blurb: [
      'The Filmore là tòa căn hộ cao cấp ven sông Hàn tại Hải Châu. Mặt bằng giá ở đây cao hơn mặt bằng chung của thành phố.',
      'Chủ yếu là căn 2 phòng ngủ, có thêm căn 1 và 3 phòng ngủ. Giá thuê hiện khoảng 1.064–4.940 USD mỗi tháng, phổ biến quanh mức 1.520 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tin đăng ở đây thường nhắc tới hồ bơi, phòng gym và view sông Hàn. Đa số căn cho thuê full nội thất, có sẵn bếp, máy lạnh, máy giặt và wifi, chỉ việc xách vali vào ở. Bạn có thể so sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê; tin đăng được môi giới địa phương cập nhật hằng ngày.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại The Filmore khoảng bao nhiêu?', a: 'Các tin đăng hiện có giá khoảng **1.064–4.940 USD** mỗi tháng, phổ biến quanh **1.520 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'The Filmore nằm ở đâu?', a: 'Tại **quận Hải Châu**, Đà Nẵng. Bạn có thể xem trang của quận để thấy toàn bộ tin đăng trong khu vực.' },
      { q: 'Căn hộ tại The Filmore có mấy phòng ngủ?', a: 'Chủ yếu là căn 2 phòng ngủ, có thêm căn 1 và 3 phòng ngủ.' },
      { q: 'Căn hộ tại The Filmore có sẵn nội thất không?', a: 'Đa số cho thuê **full nội thất**, có sẵn bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn, tin đăng có ghi rõ.' },
    ],
  },
  'Hiyori Garden Tower': {
    blurb: [
      'Hiyori Garden Tower là tòa căn hộ do chủ đầu tư Nhật Bản phát triển tại Sơn Trà, có thể đi bộ ra biển, được nhiều khách thuê Nhật, Hàn ưa chuộng.',
      'Gần như toàn bộ là căn 2 phòng ngủ. Giá thuê hiện khoảng 646–1.064 USD mỗi tháng, phổ biến quanh mức 874 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tin đăng ở đây thường nhắc tới hồ bơi, phòng gym, ban công và vị trí gần biển. Đa số căn cho thuê full nội thất, có sẵn bếp, máy lạnh, máy giặt và wifi, chỉ việc xách vali vào ở. Bạn có thể so sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê; tin đăng được môi giới địa phương cập nhật hằng ngày.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Hiyori Garden Tower khoảng bao nhiêu?', a: 'Các tin đăng hiện có giá khoảng **646–1.064 USD** mỗi tháng, phổ biến quanh **874 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Hiyori Garden Tower nằm ở đâu?', a: 'Tại **quận Sơn Trà**, Đà Nẵng. Bạn có thể xem trang của quận để thấy toàn bộ tin đăng trong khu vực.' },
      { q: 'Căn hộ tại Hiyori Garden Tower có mấy phòng ngủ?', a: 'Gần như toàn bộ là căn 2 phòng ngủ.' },
      { q: 'Căn hộ tại Hiyori Garden Tower có sẵn nội thất không?', a: 'Đa số cho thuê **full nội thất**, có sẵn bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn, tin đăng có ghi rõ.' },
    ],
  },
  'FPT Plaza / F.Home': {
    blurb: [
      'FPT Plaza và F.Home nằm cạnh khu FPT tại Ngũ Hành Sơn, thuận tiện cho nhân viên công nghệ và sinh viên. Giá thuê ở đây cũng mềm nhất trong các tòa căn hộ trên DanangMLS.',
      'Chủ yếu là căn 2 phòng ngủ, có thêm căn 1 và 3 phòng ngủ. Giá thuê hiện khoảng 201–1.900 USD mỗi tháng, phổ biến quanh mức 532 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tin đăng ở đây thường nhắc tới hồ bơi, phòng gym và ban công. Đa số căn cho thuê full nội thất, có sẵn bếp, máy lạnh, máy giặt và wifi, chỉ việc xách vali vào ở. Bạn có thể so sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê; tin đăng được môi giới địa phương cập nhật hằng ngày.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại FPT Plaza / F.Home khoảng bao nhiêu?', a: 'Các tin đăng hiện có giá khoảng **201–1.900 USD** mỗi tháng, phổ biến quanh **532 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'FPT Plaza / F.Home nằm ở đâu?', a: 'Tại **quận Ngũ Hành Sơn**, Đà Nẵng. Bạn có thể xem trang của quận để thấy toàn bộ tin đăng trong khu vực.' },
      { q: 'Căn hộ tại FPT Plaza / F.Home có mấy phòng ngủ?', a: 'Chủ yếu là căn 2 phòng ngủ, có thêm căn 1 và 3 phòng ngủ.' },
      { q: 'Căn hộ tại FPT Plaza / F.Home có sẵn nội thất không?', a: 'Đa số cho thuê **full nội thất**, có sẵn bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn, tin đăng có ghi rõ.' },
    ],
  },
  'Monarchy': {
    blurb: [
      'Monarchy là tòa căn hộ ven sông tại Hải Châu, gần cầu Rồng và khu trung tâm.',
      'Chủ yếu là căn 2 phòng ngủ, thỉnh thoảng có studio hoặc căn 3 phòng ngủ. Giá thuê hiện khoảng 589–1.900 USD mỗi tháng, phổ biến quanh mức 798 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tin đăng ở đây thường nhắc tới hồ bơi và view sông Hàn. Đa số căn cho thuê full nội thất, có sẵn bếp, máy lạnh, máy giặt và wifi, chỉ việc xách vali vào ở. Bạn có thể so sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê; tin đăng được môi giới địa phương cập nhật hằng ngày.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Monarchy khoảng bao nhiêu?', a: 'Các tin đăng hiện có giá khoảng **589–1.900 USD** mỗi tháng, phổ biến quanh **798 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Monarchy nằm ở đâu?', a: 'Tại **quận Hải Châu**, Đà Nẵng. Bạn có thể xem trang của quận để thấy toàn bộ tin đăng trong khu vực.' },
      { q: 'Căn hộ tại Monarchy có mấy phòng ngủ?', a: 'Chủ yếu là căn 2 phòng ngủ, thỉnh thoảng có studio hoặc căn 3 phòng ngủ.' },
      { q: 'Căn hộ tại Monarchy có sẵn nội thất không?', a: 'Đa số cho thuê **full nội thất**, có sẵn bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn, tin đăng có ghi rõ.' },
    ],
  },
  'Times Square FUTA Residence': {
    blurb: [
      'Times Square FUTA Residence nằm ngay mặt biển tại Ngũ Hành Sơn. Giá thuê ở đây thuộc nhóm cao, đổi lại là view biển trực diện.',
      'Số căn 1 phòng ngủ và 2 phòng ngủ khá cân bằng. Giá thuê hiện khoảng 1.125–3.800 USD mỗi tháng, phổ biến quanh mức 2.470 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tin đăng ở đây thường nhắc tới hồ bơi, phòng gym, view biển và vị trí sát biển. Đa số căn cho thuê full nội thất, có sẵn bếp, máy lạnh, máy giặt và wifi, chỉ việc xách vali vào ở. Bạn có thể so sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê; tin đăng được môi giới địa phương cập nhật hằng ngày.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Times Square FUTA Residence khoảng bao nhiêu?', a: 'Các tin đăng hiện có giá khoảng **1.125–3.800 USD** mỗi tháng, phổ biến quanh **2.470 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Times Square FUTA Residence nằm ở đâu?', a: 'Tại **quận Ngũ Hành Sơn**, Đà Nẵng. Bạn có thể xem trang của quận để thấy toàn bộ tin đăng trong khu vực.' },
      { q: 'Căn hộ tại Times Square FUTA Residence có mấy phòng ngủ?', a: 'Số căn 1 phòng ngủ và 2 phòng ngủ khá cân bằng.' },
      { q: 'Căn hộ tại Times Square FUTA Residence có sẵn nội thất không?', a: 'Đa số cho thuê **full nội thất**, có sẵn bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn, tin đăng có ghi rõ.' },
    ],
  },
  'Blooming Tower': {
    blurb: [
      'Blooming Tower nằm ven sông phía Hải Châu, thiên về căn diện tích lớn hơn mặt bằng chung.',
      'Chủ yếu là căn 2 và 3 phòng ngủ, phù hợp cho gia đình. Giá thuê hiện khoảng 920–1.900 USD mỗi tháng, phổ biến quanh mức 920 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tin đăng ở đây thường nhắc tới hồ bơi và ban công. Đa số căn cho thuê full nội thất, có sẵn bếp, máy lạnh, máy giặt và wifi, chỉ việc xách vali vào ở. Bạn có thể so sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê; tin đăng được môi giới địa phương cập nhật hằng ngày.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Blooming Tower khoảng bao nhiêu?', a: 'Các tin đăng hiện có giá khoảng **920–1.900 USD** mỗi tháng, phổ biến quanh **920 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Blooming Tower nằm ở đâu?', a: 'Tại **quận Hải Châu**, Đà Nẵng. Bạn có thể xem trang của quận để thấy toàn bộ tin đăng trong khu vực.' },
      { q: 'Căn hộ tại Blooming Tower có mấy phòng ngủ?', a: 'Chủ yếu là căn 2 và 3 phòng ngủ, phù hợp cho gia đình.' },
      { q: 'Căn hộ tại Blooming Tower có sẵn nội thất không?', a: 'Đa số cho thuê **full nội thất**, có sẵn bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn, tin đăng có ghi rõ.' },
    ],
  },
  'Muong Thanh': {
    blurb: [
      'Mường Thanh là tổ hợp khách sạn và căn hộ tại Ngũ Hành Sơn, có thể đi bộ ra biển Mỹ Khê, giá thuê dễ chịu hơn nhiều tòa sát biển khác.',
      'Gần như toàn bộ là căn 2 phòng ngủ. Giá thuê hiện khoảng 570–1.140 USD mỗi tháng, phổ biến quanh mức 722 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tin đăng ở đây thường nhắc tới vị trí gần biển và ban công. Đa số căn cho thuê full nội thất, có sẵn bếp, máy lạnh, máy giặt và wifi, chỉ việc xách vali vào ở. Bạn có thể so sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê; tin đăng được môi giới địa phương cập nhật hằng ngày.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Muong Thanh khoảng bao nhiêu?', a: 'Các tin đăng hiện có giá khoảng **570–1.140 USD** mỗi tháng, phổ biến quanh **722 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Muong Thanh nằm ở đâu?', a: 'Tại **quận Ngũ Hành Sơn**, Đà Nẵng. Bạn có thể xem trang của quận để thấy toàn bộ tin đăng trong khu vực.' },
      { q: 'Căn hộ tại Muong Thanh có mấy phòng ngủ?', a: 'Gần như toàn bộ là căn 2 phòng ngủ.' },
      { q: 'Căn hộ tại Muong Thanh có sẵn nội thất không?', a: 'Đa số cho thuê **full nội thất**, có sẵn bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn, tin đăng có ghi rõ.' },
    ],
  },
  'Wyndham Soleil': {
    blurb: [
      'Wyndham Soleil nằm ngay mặt biển Sơn Trà, là tòa tháp cao tầng dễ nhận ra trên trục ven biển; các căn ở tầng cao có view biển rộng.',
      'Gồm căn 1 phòng ngủ và 2 phòng ngủ. Giá thuê hiện khoảng 1.064–2.090 USD mỗi tháng, phổ biến quanh mức 1.064 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tin đăng ở đây thường nhắc tới vị trí sát biển và view biển. Đa số căn cho thuê full nội thất, có sẵn bếp, máy lạnh, máy giặt và wifi, chỉ việc xách vali vào ở. Bạn có thể so sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê; tin đăng được môi giới địa phương cập nhật hằng ngày.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Wyndham Soleil khoảng bao nhiêu?', a: 'Các tin đăng hiện có giá khoảng **1.064–2.090 USD** mỗi tháng, phổ biến quanh **1.064 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Wyndham Soleil nằm ở đâu?', a: 'Tại **quận Sơn Trà**, Đà Nẵng. Bạn có thể xem trang của quận để thấy toàn bộ tin đăng trong khu vực.' },
      { q: 'Căn hộ tại Wyndham Soleil có mấy phòng ngủ?', a: 'Gồm căn 1 phòng ngủ và 2 phòng ngủ.' },
      { q: 'Căn hộ tại Wyndham Soleil có sẵn nội thất không?', a: 'Đa số cho thuê **full nội thất**, có sẵn bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn, tin đăng có ghi rõ.' },
    ],
  },
  'Azura': {
    blurb: [
      'Azura là tòa căn hộ ven sông Hàn phía Sơn Trà, dễ nhận ra nhờ mặt kính cong đặc trưng.',
      'Chủ yếu là căn 2 phòng ngủ. Giá thuê hiện khoảng 418–1.600 USD mỗi tháng, phổ biến quanh mức 1.216 USD. Tất cả tin đăng tại đây đều là căn hộ.',
      'Tin đăng ở đây thường nhắc tới hồ bơi, phòng gym và view sông. Đa số căn cho thuê full nội thất, có sẵn bếp, máy lạnh, máy giặt và wifi, chỉ việc xách vali vào ở. Bạn có thể so sánh các căn bên dưới theo số phòng ngủ, diện tích và giá thuê; tin đăng được môi giới địa phương cập nhật hằng ngày.',
    ],
    faq: [
      { q: 'Giá thuê căn hộ tại Azura khoảng bao nhiêu?', a: 'Các tin đăng hiện có giá khoảng **418–1.600 USD** mỗi tháng, phổ biến quanh **1.216 USD**, tùy diện tích và hướng nhìn.' },
      { q: 'Azura nằm ở đâu?', a: 'Tại **quận Sơn Trà**, Đà Nẵng. Bạn có thể xem trang của quận để thấy toàn bộ tin đăng trong khu vực.' },
      { q: 'Căn hộ tại Azura có mấy phòng ngủ?', a: 'Chủ yếu là căn 2 phòng ngủ.' },
      { q: 'Căn hộ tại Azura có sẵn nội thất không?', a: 'Đa số cho thuê **full nội thất**, có sẵn bếp, máy lạnh, máy giặt và wifi. Một số căn cho thuê nhà trống với giá thấp hơn, tin đăng có ghi rõ.' },
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
      `${name} là một trong những tòa căn hộ quen thuộc ở Đà Nẵng. Bên dưới là các căn đang ${thueBan} tại đây, do môi giới địa phương cập nhật hằng ngày.`,
    ],
    faqHeading: `${name} — Câu hỏi thường gặp`,
    faq: v ? v.faq : [],
  };
}
