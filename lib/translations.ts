export type Lang = 'en' | 'vi' | 'ko' | 'ru';

// Russian counts three ways: 1 объявление, 2-4 объявления, 5+ объявлений — and the
// teens are the exception that catches naive implementations (11-14 take the last
// form). A plain `${n} объявлений` reads wrong for most numbers a listings page shows.
function ruPlural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
  return many;
}

export interface Translations {
  forRent: string;
  forSale: string;
  rentH1: string;
  rentSubtitle: (n: number) => string;
  rentH2: string;
  rentH2mid: string;
  rentH2b: string;
  rentIntro: string[];
  rentFaqHeading: string;
  rentFaq: { q: string; a: string }[];
  saleH1: string;
  saleSubtitle: (n: number) => string;
  saleH2: string;
  saleH2b: string;
  saleIntro: string[];
  saleFaqHeading: string;
  saleFaq: { q: string; a: string }[];
  searchPlaceholder: string;
  allTypes: string;
  allDistricts: string;
  allNeighborhoods: string;
  anyBeds: string;
  anyPrice: string;
  clearAll: string;
  listingCount: (n: number) => string;
  noListings: string;
  clearFilters: string;
  br: string;
  under500: string;
  r500: string;
  r1000: string;
  r2000: string;
  r3000: string;
  under100k: string;
  s100k: string;
  s300k: string;
  s500k: string;
  s1m: string;
  viewListing: string;
  backToListings: string;
  district: string;
  bedrooms: string;
  agent: string;
  listed: string;
  description: string;
  contactInfo: string;
  rights: (year: number) => string;
  updated: string;
}

export const translations: Record<Lang, Translations> = {
  en: {
    forRent: 'For Rent',
    forSale: 'For Sale',
    rentH1: 'Houses for Rent in Da Nang, Vietnam — Furnished Rentals',
    rentSubtitle: (n) => `Browse ${n} rental properties in Da Nang and Hoi An — houses, apartments, villas, and condos. Listings updated daily from local agents and property managers.`,
    rentH2: 'Furnished Houses & Apartments for Rent in Da Nang, Vietnam',
    rentH2mid: 'Real Estate Property: Furnished Rentals — House/Apartment with Modern Kitchen & Multiple Bedroom Options',
    rentH2b: 'Explore Rental Properties by District Across Da Nang & Hoi An',
    rentIntro: [
      `Looking for **houses for rent in Da Nang**? You're in the right place. Da Nang is one of Vietnam's most popular cities for expats, digital nomads, and long-term visitors, and the rental market here has a house or apartment to rent for every budget. Whether you want a modern apartment located near My Khe Beach, a spacious family house in the Hai Chau area, or a furnished villa with a private pool in Ngu Hanh Son, you'll find current listings updated daily below. Most rentals come fully furnished with a kitchen, wifi, and air conditioning — ready to move into right away.`,
      `Monthly rentals are the norm across the city, with flexible rental durations for both short stays and long-term, year-long leases. Rent ranges from *cheap* budget studios to premium beachfront **houses for rent**, and many homes offer two- and three-bedroom layouts — including *3-bedroom houses for rent in Da Nang* that are ideal for families or shared living space. Compared with buying real estate, renting lets you settle into an area of Da Nang and explore each neighborhood before you commit.`,
      `Browse the houses, apartments, and villas for rent below to compare bedrooms, bathrooms, districts, and pricing in USD across Da Nang and Hoi An. New rental listings are added daily from local real estate agents and property managers, so check back often for the latest options.`,
      `You'll find furnished houses and apartments for rent in every district — from Hai Chau and Son Tra to Ngu Hanh Son and beyond — with **long-term rentals** that range from *cheap* studios to high-end beachfront houses and villas. Many are ideal for families, couples, and remote workers, and new rental listings are added daily from local real estate agents and property managers.`,
      `Rental durations are flexible. You'll find furnished **long-term rentals** on six- and twelve-month leases as well as monthly apartment rentals for shorter stays, and the minimum rental period is usually one to three months. Budget-conscious renters can still find houses and apartments under $300 a month in quieter districts, while villa rentals and beachfront homes sit at the top of the range. Utilities, a one- to two-month deposit, and any building management fee are normally arranged directly with the landlord or agent, and most furnished homes include a modern kitchen, wifi, washer, and air conditioning.`,
    ],
    rentFaqHeading: 'Frequently Asked Questions About Renting in Da Nang',
    rentFaq: [
      {
        q: 'What is the average rent for a house in Da Nang?',
        a: `Average **rent** in **Da Nang** depends on the **area** and size. A furnished studio or one-**bedroom apartment** often starts around $300–$500 a **month**, while two- and three-**bedroom houses for rent** typically range from $500 to $1,200. Beachfront **villas** and premium **properties** near My Khe run higher. Because prices move with **area** and season, browse the current **rental** listings above for live pricing.`,
      },
      {
        q: 'Can foreigners rent houses in Vietnam?',
        a: `Yes. Foreigners can freely **rent** a **house** or **apartment** in **Da Nang** and across **Vietnam**. There's no ownership restriction on renting — you simply sign a lease with the landlord or their **agent**. Your host registers your temporary residence with the local police, which is standard for every **rental** in the **city**.`,
      },
      {
        q: 'How much does it cost to rent a house in Da Nang each month?',
        a: `**Monthly rent** for a **house** in **Da Nang** is affordable compared with most Western **cities**. Budget-friendly **rentals** start well under $500 a **month**, mid-range family **houses** sit around $600–$1,000, and larger or beachfront **homes** cost more. Utilities like electricity and water are usually billed on top of the base **rent**.`,
      },
      {
        q: 'Is it expensive to live in Da Nang?',
        a: `**Da Nang** is one of the more affordable **cities** in **Vietnam** for expats. Between **cheap** long-term **rentals**, low-cost food, and inexpensive transport, many residents live comfortably on a modest budget. Your **rent** will be the biggest monthly expense, which is why comparing **houses and apartments for rent** across each **area** pays off.`,
      },
      {
        q: 'Where can I find cheap houses for rent in Da Nang?',
        a: `Budget and *cheap* **houses for rent in Da Nang** are easiest to find inland — in districts like Cam Le, Lien Chieu, and parts of Thanh Khe — where a small **house** or townhouse can start under $400 a **month**. Use the district and price filters above to sort **rentals** from lowest to highest, and check back daily as new budget listings are added.`,
      },
      {
        q: 'Are there 3-bedroom houses for rent in Da Nang?',
        a: `Yes. *3-bedroom houses for rent in Da Nang* are common and popular with families and groups of sharers, typically ranging from about $500 to $1,200 a **month** depending on the district and how new the **house** is. Filter by "3 bedrooms" above, or browse three-**bedroom** homes near My Khe Beach and the **city** centre.`,
      },
      {
        q: 'Can I rent a house in Da Nang long-term or month to month?',
        a: `Both are available. **Long-term rentals** on six- and twelve-month leases usually come with the best **monthly** rate, while month-to-month and short-term options cost a little more for the flexibility. The minimum rental period is generally one to three months, and most **long-term rentals** are fully furnished and move-in ready.`,
      },
    ],
    saleH1: 'Houses for Sale in Da Nang, Vietnam | Real Estate & Properties',
    saleSubtitle: (n) => `Browse ${n} properties for sale in Da Nang and Hoi An — houses, apartments, villas, and land. Listings sourced daily from local agents and property managers.`,
    saleH2: 'Houses, Villas & Real Estate for Sale in Da Nang, Vietnam',
    saleH2b: 'Explore Properties for Sale Across Da Nang & Hoi An — Houses, Apartments, Villas & Land',
    saleIntro: [
      `**Da Nang** is one of **Vietnam's** fastest-growing **real estate** markets, with a strong selection of houses, townhouses, villas, apartments, and land for **sale** across the city's most desirable **residential** neighborhoods. Whether you want to **buy** a modern family **home** in Hai Chau, a multi-story townhouse near the **beach** in Ngu Hanh Son, a prime frontage **property** for investment in Thanh Khe, or a beachfront villa in Hoi An, **Da Nang's real estate** market offers excellent value with several **bedrooms** and bathrooms to suit families of every size.`,
      `Many condominium **units** in foreign-eligible buildings are also open to international buyers, making **Da Nang** a popular choice for both lifestyle and investment. Browse the listings below to compare neighborhoods, **property** types, **bedrooms**, and pricing in USD, then reach out about any **homes** that catch your eye — local **agents** can help you arrange a viewing for any **property** in the **area**.`,
    ],
    saleFaqHeading: 'Frequently Asked Questions About Buying Property in Da Nang',
    saleFaq: [
      {
        q: 'Can foreigners buy property in Da Nang, Vietnam?',
        a: `Yes. Foreigners can legally **buy** and own **apartments** and condos in **Da Nang**, within buildings approved for foreign ownership (foreigners may own up to 30% of the units in a given building). Foreign buyers generally cannot own **land** or landed **houses** outright, but a **50-year, renewable ownership certificate** (pink book) is issued for eligible **apartments**. Look for our Foreign-Buyer-Eligible listings to see **properties** you can purchase.`,
      },
      {
        q: 'What is the process for buying a home in Da Nang?',
        a: `The typical **buying** process is: reserve the **unit** with a deposit, sign the sale-and-purchase agreement, pay in installments or in full, then receive the ownership certificate. Most transactions are handled in Vietnamese dong. Working with a local **agent** and a lawyer keeps the paperwork and payment schedule straightforward for international buyers.`,
      },
      {
        q: 'How much does an apartment cost in Da Nang?',
        a: `Prices vary by **area** and building. Entry-level **apartments** start around $60,000–$120,000, mid-range beachfront **units** run $150,000–$300,000, and premium **villas** or penthouses go well beyond that. Browse the current **for-sale** listings above for live USD pricing across every district.`,
      },
      {
        q: 'Is buying real estate in Da Nang a good investment?',
        a: `**Da Nang** is one of **Vietnam's** fastest-growing **real estate** markets, driven by tourism, a growing expat community, and beachfront development. Many foreign buyers purchase eligible **apartments** for rental yield and long-term appreciation. As with any **property**, returns depend on location, building quality, and timing — compare **areas** and prices in the listings above.`,
      },
    ],
    searchPlaceholder: 'Search by title, district, or keyword...',
    allTypes: 'All Types',
    allDistricts: 'All Districts',
    allNeighborhoods: 'All Neighborhoods',
    anyBeds: 'Any Beds',
    anyPrice: 'Any Price',
    clearAll: 'Clear all',
    listingCount: (n) => `${n} ${n === 1 ? 'listing' : 'listings'}`,
    noListings: 'No listings match your search',
    clearFilters: 'Clear filters',
    br: 'BR',
    under500: 'Under $500',
    r500: '$500 – $1,000',
    r1000: '$1,000 – $2,000',
    r2000: '$2,000 – $3,000',
    r3000: '$3,000+',
    under100k: 'Under $100,000',
    s100k: '$100,000 – $300,000',
    s300k: '$300,000 – $500,000',
    s500k: '$500,000 – $1,000,000',
    s1m: '$1,000,000+',
    viewListing: 'View Listing',
    backToListings: 'Back to listings',
    district: 'District',
    bedrooms: 'Bedrooms',
    agent: 'Agent',
    listed: 'Listed',
    description: 'Description',
    contactInfo: 'Contact Information',
    rights: (year) => `© ${year} DanangMLS. All rights reserved.`,
    updated: 'Updated every 30 minutes from live listings.',
  },

  vi: {
    forRent: 'Cho Thuê',
    forSale: 'Mua Bán',
    rentH1: 'Nhà Cho Thuê tại Đà Nẵng, Việt Nam — Cho Thuê Đầy Đủ Nội Thất',
    rentSubtitle: (n) => `Xem ${n} bất động sản cho thuê tại Đà Nẵng và Hội An — căn hộ, nhà phố, biệt thự và condotel. Danh sách cập nhật hàng ngày từ các đại lý địa phương.`,
    rentH2: 'Cho Thuê Đầy Đủ Nội Thất tại Đà Nẵng, Việt Nam | Nhà & Căn Hộ',
    rentH2mid: 'Bất Động Sản: Nhà/Căn Hộ Cho Thuê Đầy Đủ Nội Thất — Bếp Hiện Đại & Nhiều Lựa Chọn Phòng Ngủ',
    rentH2b: 'Khám Phá Bất Động Sản Cho Thuê tại Đà Nẵng & Hội An',
    rentIntro: [
      `Đang tìm **nhà cho thuê tại Đà Nẵng**? Bạn đã đến đúng nơi. **Đà Nẵng** là một trong những **thành phố** được yêu thích nhất **Việt Nam** đối với người nước ngoài, dân du mục kỹ thuật số và khách lưu trú dài hạn, và thị trường **cho thuê** tại đây có **nhà** hoặc **căn hộ** phù hợp với mọi ngân sách. Dù bạn đang tìm một **căn hộ** hiện đại gần biển Mỹ Khê, một **nhà** rộng rãi cho gia đình ở **khu vực** Hải Châu, hay một **biệt thự** đầy đủ nội thất có hồ bơi riêng ở Ngũ Hành Sơn, bạn sẽ tìm thấy các tin đăng cập nhật hàng ngày bên dưới. Hầu hết **nhà cho thuê** đều có sẵn nội thất với **bếp**, wifi và điều hòa — sẵn sàng dọn vào ở ngay.`,
      `**Cho thuê theo tháng** là hình thức phổ biến khắp **thành phố**, với thời hạn **thuê** linh hoạt cho cả lưu trú ngắn ngày lẫn hợp đồng dài hạn cả năm. **Giá thuê** dao động từ studio *giá rẻ* đến **nhà cho thuê** cao cấp view biển, và nhiều căn có thiết kế hai đến ba **phòng ngủ** — bao gồm cả *nhà 3 phòng ngủ cho thuê tại Đà Nẵng* lý tưởng cho gia đình hoặc ở ghép. So với mua **bất động sản**, thuê nhà giúp bạn làm quen với **khu vực** trước khi quyết định.`,
      `Xem các **nhà**, **căn hộ** và **biệt thự cho thuê** bên dưới để so sánh **phòng ngủ**, phòng tắm, quận và mức giá theo USD trên khắp **Đà Nẵng** và Hội An. Tin đăng **cho thuê** mới được thêm hàng ngày từ các **đại lý** và nhà quản lý **bất động sản** uy tín, vậy nên hãy ghé lại thường xuyên để xem các lựa chọn mới nhất.`,
      `Bạn sẽ tìm thấy **nhà và căn hộ** đầy đủ nội thất **cho thuê** ở mọi quận — từ Hải Châu và Sơn Trà đến Ngũ Hành Sơn và hơn thế nữa — với hình thức **cho thuê theo tháng** và **dài hạn**, từ studio *giá rẻ* đến **nhà** và **biệt thự** view biển. Nhiều căn có thiết kế hai đến ba **phòng ngủ** phù hợp cho gia đình, cặp đôi và người làm việc từ xa, và tin đăng **cho thuê** mới được thêm mỗi ngày từ các **đại lý** và nhà quản lý **bất động sản** uy tín.`,
      `Thời hạn thuê rất linh hoạt. Bạn có thể tìm **thuê dài hạn** đầy đủ nội thất với hợp đồng sáu hoặc mười hai tháng, hoặc thuê căn hộ theo tháng cho kỳ lưu trú ngắn, và thời gian thuê tối thiểu thường là một đến ba tháng. Người thuê tiết kiệm vẫn có thể tìm nhà và căn hộ dưới 300 USD mỗi tháng ở các quận yên tĩnh hơn, trong khi biệt thự cho thuê và nhà view biển nằm ở phân khúc cao nhất. Điện nước, tiền cọc một đến hai tháng và phí quản lý thường được thỏa thuận trực tiếp với chủ nhà hoặc **đại lý**, và hầu hết các căn đầy đủ nội thất đều có bếp hiện đại, wifi, máy giặt và điều hòa.`,
    ],
    rentFaqHeading: 'Câu Hỏi Thường Gặp Về Thuê Nhà tại Đà Nẵng',
    rentFaq: [
      {
        q: 'Giá thuê nhà trung bình tại Đà Nẵng là bao nhiêu?',
        a: `**Giá thuê** tại **Đà Nẵng** tùy thuộc vào **khu vực** và diện tích. Một **căn hộ** studio hoặc một **phòng ngủ** đầy đủ nội thất thường bắt đầu khoảng 300–500 USD mỗi **tháng**, trong khi **nhà cho thuê** hai đến ba **phòng ngủ** dao động từ 500 đến 1.200 USD. **Biệt thự** view biển và **bất động sản** cao cấp gần Mỹ Khê có giá cao hơn. Hãy xem các tin đăng **cho thuê** phía trên để biết giá cập nhật.`,
      },
      {
        q: 'Người nước ngoài có thể thuê nhà tại Việt Nam không?',
        a: `Có. Người nước ngoài được tự do **thuê nhà** hoặc **căn hộ** tại **Đà Nẵng** và khắp **Việt Nam**. Không có hạn chế nào đối với việc thuê — bạn chỉ cần ký hợp đồng với chủ nhà hoặc **đại lý**. Chủ nhà sẽ đăng ký tạm trú cho bạn với công an địa phương, đây là thủ tục tiêu chuẩn cho mọi **nhà cho thuê** trong **thành phố**.`,
      },
      {
        q: 'Chi phí thuê nhà tại Đà Nẵng mỗi tháng là bao nhiêu?',
        a: `**Giá thuê nhà theo tháng** tại **Đà Nẵng** khá phải chăng so với hầu hết **thành phố** phương Tây. **Nhà cho thuê** giá tốt bắt đầu dưới 500 USD mỗi **tháng**, **nhà** cho gia đình tầm trung khoảng 600–1.000 USD, và **nhà** lớn hơn hoặc view biển có giá cao hơn. Điện, nước thường được tính thêm ngoài **giá thuê** cơ bản.`,
      },
      {
        q: 'Sống tại Đà Nẵng có đắt đỏ không?',
        a: `**Đà Nẵng** là một trong những **thành phố** dễ chịu về chi phí nhất **Việt Nam** cho người nước ngoài. Với **nhà cho thuê** dài hạn *giá rẻ*, thực phẩm và di chuyển chi phí thấp, nhiều cư dân sống thoải mái với ngân sách vừa phải. **Giá thuê** sẽ là khoản chi lớn nhất hàng tháng, vì vậy việc so sánh **nhà và căn hộ cho thuê** theo từng **khu vực** rất đáng giá.`,
      },
      {
        q: 'Tìm nhà cho thuê giá rẻ tại Đà Nẵng ở đâu?',
        a: `**Nhà cho thuê** *giá rẻ* tại **Đà Nẵng** dễ tìm nhất ở khu vực trong nội địa — như Cẩm Lệ, Liên Chiểu và một phần Thanh Khê — nơi một căn **nhà** nhỏ hoặc nhà phố có thể bắt đầu dưới 400 USD mỗi **tháng**. Dùng bộ lọc quận và giá phía trên để sắp xếp **cho thuê** từ thấp đến cao, và ghé lại mỗi ngày để xem tin mới.`,
      },
      {
        q: 'Có nhà 3 phòng ngủ cho thuê tại Đà Nẵng không?',
        a: `Có. *Nhà 3 phòng ngủ cho thuê tại Đà Nẵng* rất phổ biến với gia đình và nhóm ở ghép, thường từ 500 đến 1.200 USD mỗi **tháng** tùy quận và độ mới của **nhà**. Lọc theo "3 phòng ngủ" phía trên, hoặc xem các căn ba **phòng ngủ** gần biển Mỹ Khê và trung tâm **thành phố**.`,
      },
      {
        q: 'Tôi có thể thuê nhà tại Đà Nẵng dài hạn hoặc theo tháng không?',
        a: `Cả hai đều có. **Thuê dài hạn** với hợp đồng sáu và mười hai tháng thường có giá theo **tháng** tốt nhất, trong khi thuê theo tháng và ngắn hạn cao hơn một chút. Thời gian thuê tối thiểu thường là một đến ba tháng, và hầu hết **nhà cho thuê** dài hạn đều đầy đủ nội thất, sẵn sàng dọn vào.`,
      },
    ],
    saleH1: 'Nhà Bán tại Đà Nẵng, Việt Nam | Bất Động Sản & Căn Hộ',
    saleSubtitle: (n) => `Xem ${n} bất động sản bán tại Đà Nẵng và Hội An — nhà phố, căn hộ, biệt thự và đất nền. Danh sách cập nhật hàng ngày từ các đại lý địa phương.`,
    saleH2: 'Nhà, Biệt Thự & Bất Động Sản Bán tại Đà Nẵng, Việt Nam',
    saleH2b: 'Khám Phá Bất Động Sản Bán tại Đà Nẵng & Hội An — Nhà, Căn Hộ, Biệt Thự & Đất Nền',
    saleIntro: [
      `Đà Nẵng là một trong những thị trường bất động sản phát triển nhanh nhất Việt Nam, với nhiều lựa chọn nhà phố, biệt thự, căn hộ và đất nền đang bán trên khắp các khu dân cư đáng sống của thành phố. Dù bạn muốn mua một căn nhà gia đình hiện đại ở Hải Châu, một nhà phố nhiều tầng gần biển ở Ngũ Hành Sơn, một bất động sản mặt tiền ở Thanh Khê để đầu tư, hay một biệt thự ven biển ở Hội An, thị trường bất động sản Đà Nẵng đều có lựa chọn phù hợp với mọi quy mô gia đình.`,
      `Nhiều căn hộ chung cư trong các tòa nhà đủ điều kiện cho người nước ngoài cũng đang mở bán cho khách quốc tế, khiến Đà Nẵng trở thành lựa chọn phổ biến cho cả nhu cầu ở thực và đầu tư. Hãy xem danh sách bên dưới để so sánh khu vực, loại bất động sản, số phòng ngủ và mức giá theo USD, sau đó liên hệ về bất kỳ căn nhà nào bạn quan tâm — các đại lý địa phương có thể giúp bạn sắp xếp xem nhà ở bất kỳ khu vực nào.`,
    ],
    saleFaqHeading: 'Câu Hỏi Thường Gặp Về Mua Bất Động Sản tại Đà Nẵng',
    saleFaq: [
      {
        q: 'Người nước ngoài có thể mua bất động sản tại Đà Nẵng không?',
        a: `Có. Người nước ngoài được phép **mua** và sở hữu **căn hộ** tại **Đà Nẵng**, trong các tòa nhà được duyệt cho sở hữu nước ngoài (người nước ngoài được sở hữu tối đa 30% số căn trong một tòa nhà). Người nước ngoài thường không được sở hữu **đất** hoặc **nhà** gắn liền với đất, nhưng **giấy chứng nhận sở hữu 50 năm, có thể gia hạn** (sổ hồng) được cấp cho **căn hộ** đủ điều kiện. Xem các tin đăng dành cho người nước ngoài để biết **bất động sản** bạn có thể mua.`,
      },
      {
        q: 'Quy trình mua nhà tại Đà Nẵng như thế nào?',
        a: `Quy trình **mua** điển hình gồm: đặt cọc giữ **căn hộ**, ký hợp đồng mua bán, thanh toán theo đợt hoặc một lần, rồi nhận giấy chứng nhận sở hữu. Hầu hết giao dịch thực hiện bằng đồng Việt Nam. Làm việc với **đại lý** địa phương và luật sư giúp thủ tục và lịch thanh toán rõ ràng cho người mua quốc tế.`,
      },
      {
        q: 'Giá một căn hộ tại Đà Nẵng là bao nhiêu?',
        a: `Giá tùy theo **khu vực** và tòa nhà. **Căn hộ** phổ thông bắt đầu khoảng 60.000–120.000 USD, **căn hộ** view biển tầm trung khoảng 150.000–300.000 USD, còn **biệt thự** hoặc penthouse cao cấp cao hơn nhiều. Xem các tin đăng **bán** phía trên để biết giá USD cập nhật ở mọi quận.`,
      },
      {
        q: 'Mua bất động sản tại Đà Nẵng có phải khoản đầu tư tốt không?',
        a: `**Đà Nẵng** là một trong những thị trường **bất động sản** phát triển nhanh nhất **Việt Nam**, nhờ du lịch, cộng đồng người nước ngoài ngày càng lớn và sự phát triển ven biển. Nhiều người nước ngoài mua **căn hộ** đủ điều kiện để cho thuê và tăng giá dài hạn. Như mọi **bất động sản**, lợi nhuận phụ thuộc vị trí, chất lượng tòa nhà và thời điểm — hãy so sánh **khu vực** và giá trong các tin đăng phía trên.`,
      },
    ],
    searchPlaceholder: 'Tìm theo tiêu đề, quận, hoặc từ khóa...',
    allTypes: 'Tất Cả Loại',
    allDistricts: 'Tất Cả Quận',
    allNeighborhoods: 'Tất Cả Phường',
    anyBeds: 'Số Phòng',
    anyPrice: 'Tất Cả Giá',
    clearAll: 'Xóa tất cả',
    listingCount: (n) => `${n} danh sách`,
    noListings: 'Không tìm thấy bất động sản phù hợp',
    clearFilters: 'Xóa bộ lọc',
    br: 'PN',
    under500: 'Dưới 13 triệu ₫',
    r500: '13 – 26 triệu ₫',
    r1000: '26 – 53 triệu ₫',
    r2000: '53 – 79 triệu ₫',
    r3000: 'Trên 79 triệu ₫',
    under100k: 'Dưới 2,6 tỷ ₫',
    s100k: '2,6 – 7,9 tỷ ₫',
    s300k: '7,9 – 13 tỷ ₫',
    s500k: '13 – 26 tỷ ₫',
    s1m: 'Trên 26 tỷ ₫',
    viewListing: 'Xem Chi Tiết',
    backToListings: 'Quay lại danh sách',
    district: 'Quận',
    bedrooms: 'Phòng Ngủ',
    agent: 'Đại Lý',
    listed: 'Ngày Đăng',
    description: 'Mô Tả',
    contactInfo: 'Thông Tin Liên Hệ',
    rights: (year) => `© ${year} DanangMLS. Bảo lưu mọi quyền.`,
    updated: 'Cập nhật mỗi 30 phút từ danh sách trực tiếp.',
  },
  ko: {
    forRent: '임대',
    forSale: '매매',
    rentH1: '베트남 다낭 임대 주택 — 가구 완비 렌탈',
    rentSubtitle: (n) => `다낭과 호이안의 임대 매물 ${n}건을 둘러보세요 — 주택, 아파트, 빌라, 콘도. 현지 중개인과 관리업체를 통해 매일 업데이트됩니다.`,
    rentH2: '베트남 다낭 가구 완비 주택 및 아파트 임대',
    rentH2mid: '부동산 매물: 가구 완비 렌탈 — 현대식 주방과 다양한 침실 옵션을 갖춘 주택/아파트',
    rentH2b: '다낭 및 호이안 전역의 지역별 임대 매물을 둘러보십시오',
    rentIntro: [
      '**다낭 임대 주택**을 찾고 계십니까? 잘 찾아오셨습니다. 다낭은 베트남에서 외국인 거주자, 디지털 노마드, 장기 방문객에게 가장 인기 있는 도시 중 하나이며, 이곳의 임대 시장에는 모든 예산에 맞는 주택이나 아파트가 있습니다. 미케 해변 근처의 현대식 아파트, 하이쩌우 지역의 넓은 가족 주택, 또는 응우한선에 위치한 개인 수영장이 있는 가구 완비 빌라를 찾으시든, 아래에서 매일 업데이트되는 최신 매물을 확인하실 수 있습니다. 대부분의 임대 매물은 주방, Wi-Fi, 에어컨이 완비되어 있어 즉시 입주 가능합니다.',
      '도시 전역에서 월세 임대가 일반적이며, 단기 숙박 및 장기(1년) 임대 모두 유연한 임대 기간을 제공합니다. 임대료는 *저렴한* 스튜디오부터 고급 해변 **임대 주택**까지 다양하며, 많은 주택들이 2침실 및 3침실 구조를 제공하며, 가족이나 셰어하우스에 이상적인 *다낭 3침실 임대 주택*도 포함됩니다. 부동산 매매와 비교하여, 임대는 다낭의 한 지역에 정착하여 계약하기 전에 각 동네를 탐색할 수 있게 해줍니다.',
      '아래에서 임대 주택, 아파트, 빌라를 둘러보시고 다낭과 호이안 전역의 침실 수, 욕실 수, 지역, USD 가격을 비교해 보십시오. 현지 부동산 중개인 및 자산 관리자로부터 새로운 임대 매물이 매일 추가되므로, 최신 옵션을 확인하려면 자주 방문해 주십시오.',
      '하이쩌우와 선짜부터 응우한선 및 그 외 지역까지 모든 지역에서 가구 완비 임대 주택과 아파트를 찾으실 수 있으며, *저렴한* 스튜디오부터 고급 해변 주택 및 빌라에 이르는 **장기 임대** 매물이 있습니다. 많은 매물들이 가족, 커플, 원격 근무자에게 이상적이며, 현지 부동산 중개인 및 자산 관리자로부터 새로운 임대 매물이 매일 추가됩니다.',
      '임대 기간은 유연합니다. 6개월 및 12개월 계약의 가구 완비 **장기 임대**뿐만 아니라 단기 숙박을 위한 월별 아파트 임대도 찾으실 수 있으며, 최소 임대 기간은 보통 1개월에서 3개월입니다. 예산에 민감한 임차인들은 조용한 지역에서 월 $300 미만의 주택과 아파트를 여전히 찾을 수 있으며, 빌라 임대 및 해변 주택은 최고가 범위에 속합니다. 공과금, 1~2개월치 보증금, 그리고 건물 관리비는 일반적으로 집주인이나 중개인과 직접 협의하며, 대부분의 가구 완비 주택에는 현대식 주방, Wi-Fi, 세탁기, 에어컨이 포함되어 있습니다.',
    ],
    rentFaqHeading: '다낭 임대에 관한 자주 묻는 질문',
    rentFaq: [
      { q: '다낭 주택의 평균 임대료는 얼마입니까?', a: '**다낭**의 평균 **임대료**는 **지역**과 크기에 따라 다릅니다. 가구 완비 스튜디오 또는 1**침실 아파트**는 보통 월 $300~$500부터 시작하며, 2침실 및 3**침실 임대 주택**은 일반적으로 $500~$1,200 범위입니다. 해변 **빌라**와 미케 근처의 고급 **매물**은 더 높습니다. **지역**과 계절에 따라 가격이 변동하므로, 실시간 가격은 위의 현재 **임대** 매물을 확인해 주십시오.' },
      { q: '외국인이 베트남에서 주택을 임대할 수 있습니까?', a: '예. 외국인은 **다낭** 및 **베트남** 전역에서 **주택** 또는 **아파트**를 자유롭게 **임대**할 수 있습니다. 임대에 대한 소유권 제한은 없으며, 집주인 또는 그들의 **중개인**과 임대 계약을 체결하시면 됩니다. 귀하의 호스트가 현지 경찰에 임시 거주를 등록하며, 이는 **도시** 내 모든 **임대**에 대한 표준 절차입니다.' },
      { q: '다낭에서 주택을 매월 임대하는 데 비용이 얼마나 듭니까?', a: '**다낭**의 **주택** **월세**는 대부분의 서구권 **도시**에 비해 저렴합니다. 예산 친화적인 **임대 매물**은 월 $500 미만부터 시작하며, 중간 가격대의 가족 **주택**은 $600~$1,000 정도이고, 더 크거나 해변에 위치한 **주택**은 더 비쌉니다. 전기 및 수도와 같은 공과금은 일반적으로 기본 **임대료** 외에 청구됩니다.' },
      { q: '다낭에서 사는 것이 비쌉니까?', a: '**다낭**은 외국인 거주자에게 **베트남**에서 비교적 저렴한 **도시** 중 하나입니다. **저렴한** 장기 **임대**, 저렴한 음식, 저렴한 교통비 덕분에 많은 거주자들이 적당한 예산으로 편안하게 생활합니다. **임대료**가 가장 큰 월별 지출이 될 것이므로, 각 **지역**의 **임대 주택 및 아파트**를 비교하는 것이 중요합니다.' },
      { q: '다낭에서 저렴한 임대 주택을 어디서 찾을 수 있습니까?', a: '예산 친화적이고 *저렴한* **다낭 임대 주택**은 깜레, 리엔찌에우, 탄케 일부 지역과 같은 내륙 지역에서 가장 쉽게 찾을 수 있으며, 이 지역에서는 작은 **주택**이나 타운하우스가 월 $400 미만부터 시작할 수 있습니다. 위의 지역 및 가격 필터를 사용하여 **임대 매물**을 최저가부터 최고가 순으로 정렬하고, 새로운 예산 매물이 추가될 때마다 매일 확인해 주십시오.' },
      { q: '다낭에 3침실 임대 주택이 있습니까?', a: '예. *다낭 3침실 임대 주택*은 가족 및 셰어하우스 그룹에게 흔하고 인기가 많으며, 일반적으로 지역과 **주택**의 신축 여부에 따라 월 약 $500~$1,200 범위입니다. 위에서 "3 bedrooms"로 필터링하거나, 미케 해변과 **도시** 중심가 근처의 3**침실** 주택을 둘러보십시오.' },
      { q: '다낭에서 주택을 장기 또는 월 단위로 임대할 수 있습니까?', a: '둘 다 가능합니다. 6개월 및 12개월 계약의 **장기 임대**는 일반적으로 가장 좋은 **월별** 요금을 제공하며, 월 단위 및 단기 옵션은 유연성 때문에 약간 더 비쌉니다. 최소 임대 기간은 일반적으로 1개월에서 3개월이며, 대부분의 **장기 임대**는 가구 완비되어 즉시 입주 가능합니다.' },
    ],
    saleH1: '베트남 다낭 매매 주택 | 부동산 및 매물',
    saleSubtitle: (n) => `다낭과 호이안의 매매 매물 ${n}건을 둘러보세요 — 주택, 아파트, 빌라, 토지. 현지 중개인과 관리업체를 통해 매일 업데이트됩니다.`,
    saleH2: '베트남 다낭 매매 주택, 빌라 및 부동산',
    saleH2b: '다낭 및 호이안 전역의 매매 매물 둘러보기 — 주택, 아파트, 빌라 및 토지',
    saleIntro: [
      '**다낭**은 **베트남**에서 가장 빠르게 성장하는 **부동산** 시장 중 하나이며, 도시의 가장 인기 있는 **주거** 지역 전역에 다양한 주택, 타운하우스, 빌라, 아파트, **매매**용 토지가 있습니다. 하이쩌우의 현대식 가족 **주택**, 응우한선 **해변** 근처의 다층 타운하우스, 탄케의 투자용 주요 전면 **매물**, 또는 호이안의 해변 빌라를 **구매**하시든, **다낭 부동산** 시장은 모든 규모의 가족에게 적합한 여러 **침실**과 욕실을 갖춘 훌륭한 가치를 제공합니다.',
      '외국인 구매 자격이 있는 건물 내 많은 콘도 **유닛** 또한 국제 구매자에게 개방되어 있어, **다낭**을 라이프스타일과 투자 모두에 인기 있는 선택지로 만듭니다. 아래 매물을 둘러보시고 동네, **매물** 유형, **침실** 수, USD 가격을 비교해 보십시오. 마음에 드는 **주택**이 있다면 문의해 주십시오. 현지 **중개인**이 해당 **지역**의 모든 **매물**에 대한 방문을 주선해 드릴 수 있습니다.',
    ],
    saleFaqHeading: '다낭 부동산 구매에 관한 자주 묻는 질문',
    saleFaq: [
      { q: '외국인이 베트남 다낭에서 부동산을 구매할 수 있습니까?', a: '예. 외국인은 외국인 소유가 승인된 건물 내에서 **다낭**의 **아파트**와 콘도를 합법적으로 **구매**하고 소유할 수 있습니다 (외국인은 특정 건물 유닛의 최대 30%까지 소유할 수 있습니다). 외국인 구매자는 일반적으로 **토지**나 토지 위에 지어진 **주택**을 직접 소유할 수 없지만, 자격이 되는 **아파트**에 대해서는 **50년 갱신 가능한 소유권 증서** (핑크북)가 발급됩니다. 구매 가능한 **매물**을 보려면 외국인 구매 자격 매물을 찾아보십시오.' },
      { q: '다낭에서 주택을 구매하는 절차는 무엇입니까?', a: '일반적인 **구매** 절차는 다음과 같습니다: 보증금으로 **유닛**을 예약하고, 매매 계약서에 서명하며, 할부 또는 전액을 지불한 후 소유권 증서를 받습니다. 대부분의 거래는 베트남 동으로 처리됩니다. 현지 **중개인** 및 변호사와 협력하면 국제 구매자에게 서류 작업과 지불 일정을 간소화할 수 있습니다.' },
      { q: '다낭에서 아파트 가격은 얼마입니까?', a: '가격은 **지역**과 건물에 따라 다릅니다. 초기 단계 **아파트**는 약 $60,000~$120,000부터 시작하며, 중간 가격대의 해변 **유닛**은 $150,000~$300,000이고, 고급 **빌라** 또는 펜트하우스는 그 이상입니다. 모든 지역의 실시간 USD 가격은 위의 현재 **매매** 매물을 확인해 주십시오.' },
      { q: '다낭에서 부동산 구매가 좋은 투자입니까?', a: '**다낭**은 관광, 증가하는 외국인 거주자 커뮤니티, 해변 개발에 힘입어 **베트남**에서 가장 빠르게 성장하는 **부동산** 시장 중 하나입니다. 많은 외국인 구매자들이 임대 수익과 장기적인 가치 상승을 위해 자격이 되는 **아파트**를 구매합니다. 모든 **매물**과 마찬가지로, 수익은 위치, 건물 품질, 시기에 따라 달라집니다. 위의 매물에서 **지역**과 가격을 비교해 보십시오.' },
    ],
    searchPlaceholder: '제목, 지역 또는 키워드로 검색...',
    allTypes: '모든 유형',
    allDistricts: '모든 지역',
    allNeighborhoods: '모든 동네',
    anyBeds: '침실 수 무관',
    anyPrice: '가격 무관',
    clearAll: '모두 지우기',
    listingCount: (n) => `매물 ${n}건`,
    noListings: '검색 결과와 일치하는 매물이 없습니다.',
    clearFilters: '필터 초기화',
    br: '침실',
    under500: '$500 미만',
    r500: '$500 – $1,000',
    r1000: '$1,000 – $2,000',
    r2000: '$2,000 – $3,000',
    r3000: '$3,000+',
    under100k: '$100,000 미만',
    s100k: '$100,000 – $300,000',
    s300k: '$300,000 – $500,000',
    s500k: '$500,000 – $1,000,000',
    s1m: '$1,000,000+',
    viewListing: '매물 보기',
    backToListings: '매물 목록으로 돌아가기',
    district: '지역',
    bedrooms: '침실 수',
    agent: '중개인',
    listed: '등록일',
    description: '설명',
    contactInfo: '연락처 정보',
    rights: (year) => `© ${year} DanangMLS. 모든 권리 보유.`,
    updated: '실시간 매물에서 30분마다 업데이트됩니다.',
  },
  ru: {
    forRent: 'В аренду',
    forSale: 'На продажу',
    rentH1: 'Дома в аренду в Дананге, Вьетнам — Меблированное жилье',
    rentSubtitle: (n) => `${n} ${ruPlural(n, 'объект', 'объекта', 'объектов')} в аренду в Дананге и Хойане — дома, квартиры, виллы и кондо. Списки обновляются ежедневно от местных агентов и управляющих компаний.`,
    rentH2: 'Меблированные дома и квартиры в аренду в Дананге, Вьетнам',
    rentH2mid: 'Недвижимость: Меблированное жилье — Дом/квартира с современной кухней и несколькими спальнями',
    rentH2b: 'Изучите объекты недвижимости в аренду по районам Дананга и Хойана',
    rentIntro: [
      'Ищете **дома в аренду в Дананге**? Вы попали по адресу. Дананг — один из самых популярных городов Вьетнама для экспатов, цифровых кочевников и долгосрочных посетителей, и на местном рынке аренды найдется дом или квартира на любой бюджет. Независимо от того, нужна ли вам современная квартира рядом с пляжем My Khe, просторный семейный дом в районе Hai Chau или меблированная вилла с частным бассейном в Ngu Hanh Son, ниже вы найдете актуальные объявления, обновляемые ежедневно. Большинство объектов сдаются полностью меблированными, с кухней, Wi-Fi и кондиционером — готовыми к немедленному заселению.',
      'Ежемесячная аренда является нормой по всему городу, с гибкими сроками аренды как для краткосрочного, так и для долгосрочного проживания (годовые договоры). Стоимость аренды варьируется от *дешевых* бюджетных студий до элитных пляжных **домов в аренду**, и многие дома предлагают планировки с двумя и тремя спальнями — включая *дома с 3 спальнями в аренду в Дананге*, которые идеально подходят для семей или совместного проживания. По сравнению с покупкой недвижимости, аренда позволяет вам освоиться в районе Дананга и изучить каждый квартал, прежде чем принимать окончательное решение.',
      'Просмотрите дома, квартиры и виллы в аренду ниже, чтобы сравнить количество спален, ванных комнат, районы и цены в USD по Данангу и Хойану. Новые объявления об аренде добавляются ежедневно от местных агентов по недвижимости и управляющих компаний, поэтому заходите чаще, чтобы увидеть последние варианты.',
      'Вы найдете меблированные дома и квартиры в аренду в каждом районе — от Hai Chau и Son Tra до Ngu Hanh Son и далее — с **долгосрочной арендой**, которая варьируется от *дешевых* студий до элитных пляжных домов и вилл. Многие идеально подходят для семей, пар и удаленных работников, а новые объявления об аренде добавляются ежедневно от местных агентов по недвижимости и управляющих компаний.',
      'Сроки аренды гибкие. Вы найдете меблированные **долгосрочные объекты** по договорам на шесть и двенадцать месяцев, а также ежемесячную аренду квартир для более короткого пребывания; минимальный срок аренды обычно составляет от одного до трех месяцев. Арендаторы с ограниченным бюджетом все еще могут найти дома и квартиры менее чем за $300 в месяц в более тихих районах, в то время как аренда вилл и пляжных домов находится в верхней части ценового диапазона. Коммунальные услуги, залог в размере одного-двух месяцев и любые сборы за управление зданием обычно оговариваются напрямую с арендодателем или агентом, и большинство меблированных домов включают современную кухню, Wi-Fi, стиральную машину и кондиционер.',
    ],
    rentFaqHeading: 'Часто задаваемые вопросы об аренде в Дананге',
    rentFaq: [
      { q: 'Какова средняя стоимость аренды дома в Дананге?', a: 'Средняя **арендная плата** в **Дананге** зависит от **района** и размера. Меблированная студия или однокомнатная **квартира** часто начинается от $300–$500 в **месяц**, в то время как двух- и трехкомнатные **дома в аренду** обычно стоят от $500 до $1,200. Пляжные **виллы** и элитные **объекты** рядом с My Khe стоят дороже. Поскольку цены меняются в зависимости от **района** и сезона, просмотрите текущие **объявления об аренде** выше для актуальных цен.' },
      { q: 'Могут ли иностранцы арендовать дома во Вьетнаме?', a: 'Да. Иностранцы могут свободно **арендовать** **дом** или **квартиру** в **Дананге** и по всему **Вьетнаму**. Ограничений на владение при аренде нет — вы просто подписываете договор аренды с арендодателем или его **агентом**. Ваш арендодатель регистрирует ваше временное проживание в местной полиции, что является стандартом для любой **аренды** в **городе**.' },
      { q: 'Сколько стоит аренда дома в Дананге в месяц?', a: '**Ежемесячная арендная плата** за **дом** в **Дананге** доступна по сравнению с большинством западных **городов**. Бюджетные **объекты** начинаются значительно ниже $500 в **месяц**, семейные **дома** среднего класса стоят около $600–$1,000, а более крупные или пляжные **дома** дороже. Коммунальные услуги, такие как электричество и вода, обычно оплачиваются сверх базовой **арендной платы**.' },
      { q: 'Дорого ли жить в Дананге?', a: '**Дананг** — один из самых доступных **городов** во **Вьетнаме** для экспатов. Благодаря **дешевой** долгосрочной **аренде**, недорогой еде и дешевому транспорту многие жители комфортно живут на скромный бюджет. Ваша **арендная плата** будет самой большой ежемесячной тратой, поэтому сравнение **домов и квартир в аренду** по каждому **району** окупается.' },
      { q: 'Где я могу найти дешевые дома в аренду в Дананге?', a: 'Бюджетные и *дешевые* **дома в аренду в Дананге** легче всего найти в глубине страны — в таких районах, как Cam Le, Lien Chieu и некоторых частях Thanh Khe — где небольшой **дом** или таунхаус может стоить менее $400 в **месяц**. Используйте фильтры по району и цене выше, чтобы отсортировать **объекты** от самых низких до самых высоких, и заходите ежедневно, так как добавляются новые бюджетные объявления.' },
      { q: 'Есть ли дома с 3 спальнями в аренду в Дананге?', a: 'Да. *Дома с 3 спальнями в аренду в Дананге* распространены и популярны среди семей и групп, проживающих совместно, обычно их стоимость варьируется от $500 до $1,200 в **месяц** в зависимости от района и новизны **дома**. Отфильтруйте по "3 спальни" выше или просмотрите трехкомнатные **дома** рядом с пляжем My Khe и центром **города**.' },
      { q: 'Могу ли я арендовать дом в Дананге на длительный срок или помесячно?', a: 'Доступны оба варианта. **Долгосрочная аренда** по договорам на шесть и двенадцать месяцев обычно предлагает лучшую **ежемесячную** ставку, в то время как помесячные и краткосрочные варианты стоят немного дороже за гибкость. Минимальный срок аренды обычно составляет от одного до трех месяцев, и большинство **долгосрочных объектов** полностью меблированы и готовы к заселению.' },
    ],
    saleH1: 'Дома на продажу в Дананге, Вьетнам | Недвижимость и объекты',
    saleSubtitle: (n) => `${n} ${ruPlural(n, 'объект', 'объекта', 'объектов')} на продажу в Дананге и Хойане — дома, квартиры, виллы и земельные участки. Списки обновляются ежедневно от местных агентов и управляющих компаний.`,
    saleH2: 'Дома, виллы и недвижимость на продажу в Дананге, Вьетнам',
    saleH2b: 'Изучите объекты недвижимости на продажу в Дананге и Хойане — Дома, квартиры, виллы и земля',
    saleIntro: [
      '**Дананг** — один из самых быстрорастущих рынков **недвижимости** **Вьетнама**, предлагающий широкий выбор домов, таунхаусов, вилл, квартир и земельных участков на **продажу** в самых желанных **жилых** районах города. Независимо от того, хотите ли вы **купить** современный семейный **дом** в Hai Chau, многоэтажный таунхаус рядом с **пляжем** в Ngu Hanh Son, элитный **объект** для инвестиций в Thanh Khe или пляжную виллу в Hoi An, рынок **недвижимости Дананга** предлагает отличную ценность с несколькими **спальнями** и ванными комнатами, подходящими для семей любого размера.',
      'Многие **квартиры** в зданиях, доступных для иностранцев, также открыты для международных покупателей, что делает **Дананг** популярным выбором как для жизни, так и для инвестиций. Просмотрите объявления ниже, чтобы сравнить районы, типы **недвижимости**, **спальни** и цены в USD, затем свяжитесь с нами по поводу любых **домов**, которые вас заинтересовали — местные **агенты** помогут вам организовать просмотр любого **объекта** в **районе**.',
    ],
    saleFaqHeading: 'Часто задаваемые вопросы о покупке недвижимости в Дананге',
    saleFaq: [
      { q: 'Могут ли иностранцы покупать недвижимость в Дананге, Вьетнам?', a: 'Да. Иностранцы могут легально **покупать** и владеть **квартирами** и кондоминиумами в **Дананге** в зданиях, одобренных для иностранного владения (иностранцы могут владеть до 30% квартир в данном здании). Иностранные покупатели, как правило, не могут владеть **землей** или отдельно стоящими **домами** напрямую, но для подходящих **квартир** выдается **возобновляемый сертификат собственности на 50 лет** («розовая книга»). Ищите наши объявления, доступные для иностранных покупателей, чтобы увидеть **объекты**, которые вы можете приобрести.' },
      { q: 'Каков процесс покупки дома в Дананге?', a: 'Типичный процесс **покупки** включает: резервирование **объекта** с внесением депозита, подписание договора купли-продажи, оплату в рассрочку или полностью, затем получение свидетельства о праве собственности. Большинство сделок проводятся во вьетнамских донгах. Работа с местным **агентом** и юристом делает оформление документов и график платежей простыми для международных покупателей.' },
      { q: 'Сколько стоит квартира в Дананге?', a: 'Цены варьируются в зависимости от **района** и здания. Квартиры начального уровня начинаются примерно от $60,000–$120,000, средний класс пляжных **квартир** стоит $150,000–$300,000, а элитные **виллы** или пентхаусы значительно дороже. Просмотрите текущие **объявления о продаже** выше для актуальных цен в USD по каждому району.' },
      { q: 'Является ли покупка недвижимости в Дананге хорошей инвестицией?', a: '**Дананг** — один из самых быстрорастущих рынков **недвижимости** **Вьетнама**, движимый туризмом, растущим сообществом экспатов и развитием пляжных зон. Многие иностранные покупатели приобретают подходящие **квартиры** для получения арендного дохода и долгосрочного роста стоимости. Как и в случае с любой **недвижимостью**, доходность зависит от местоположения, качества здания и времени — сравните **районы** и цены в объявлениях выше.' },
    ],
    searchPlaceholder: 'Поиск по названию, району или ключевому слову...',
    allTypes: 'Все типы',
    allDistricts: 'Все районы',
    allNeighborhoods: 'Все кварталы',
    anyBeds: 'Любое количество спален',
    anyPrice: 'Любая цена',
    clearAll: 'Очистить все',
    listingCount: (n) => `${n} ${ruPlural(n, 'объявление', 'объявления', 'объявлений')}`,
    noListings: 'Объявления по вашему запросу не найдены',
    clearFilters: 'Сбросить фильтры',
    br: 'СП',
    under500: 'До $500',
    r500: '$500 – $1,000',
    r1000: '$1,000 – $2,000',
    r2000: '$2,000 – $3,000',
    r3000: '$3,000+',
    under100k: 'До $100,000',
    s100k: '$100,000 – $300,000',
    s300k: '$300,000 – $500,000',
    s500k: '$500,000 – $1,000,000',
    s1m: '$1,000,000+',
    viewListing: 'Посмотреть объявление',
    backToListings: 'Вернуться к объявлениям',
    district: 'Район',
    bedrooms: 'Спальни',
    agent: 'Агент',
    listed: 'Опубликовано',
    description: 'Описание',
    contactInfo: 'Контактная информация',
    rights: (year) => `© ${year} DanangMLS. Все права защищены.`,
    updated: 'Обновляется каждые 30 минут из актуальных объявлений.',
  },
};

// Locale tables that only carry en/vi — routes, account copy, agent copy — read
// through this. Korean and Russian fall back to English rather than crashing or
// showing an empty string, which is the honest behaviour while those locales are
// being filled in: an English label beats a blank one. Delete the fallback for a
// table once every locale has an entry.
export function forLang<T extends { en: unknown }>(table: T, lang: Lang): T['en'] {
  // Generic over the table rather than its value type: these tables are declared
  // `as const`, so `en` and `vi` have different literal types and will not unify.
  return ((table as Record<string, unknown>)[lang] ?? table.en) as T['en'];
}

/** Narrows any locale to the two that have routes and copy today. Korean and
 *  Russian resolve to English URLs and English copy until their routes exist —
 *  a working English page beats a 404 in a language we cannot serve yet. */
export function viOrEn(lang: Lang): 'en' | 'vi' {
  return lang === 'vi' ? 'vi' : 'en';
}
