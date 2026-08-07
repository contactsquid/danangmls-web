export type Lang = 'en' | 'vi';

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
};
