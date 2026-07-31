export type Lang = 'en' | 'vi';

export interface Translations {
  forRent: string;
  forSale: string;
  rentH1: string;
  rentSubtitle: (n: number) => string;
  rentH2: string;
  rentH2b: string;
  rentIntro: string[];
  rentBullets: string[];
  rentFaqHeading: string;
  rentFaq: { q: string; a: string }[];
  saleH1: string;
  saleSubtitle: (n: number) => string;
  saleH2: string;
  saleH2b: string;
  saleIntro: string[];
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
    rentH1: 'Houses & Apartments for Rent in Da Nang, Vietnam',
    rentSubtitle: (n) => `Browse ${n} rental properties in Da Nang and Hoi An — houses, apartments, villas, and condos. Listings updated daily from local agents and property managers.`,
    rentH2: 'Furnished Houses & Apartments for Rent in Da Nang, Vietnam',
    rentH2b: 'Explore Rental Properties by District Across Da Nang & Hoi An',
    rentIntro: [
      `Looking for **houses for rent in Da Nang**? You're in the right place. **Da Nang** is one of **Vietnam's** most popular **cities** for expats, digital nomads, and long-term visitors, and the **rental** market here has a **house** or **apartment** to **rent** for every budget. Whether you want a modern **apartment** near My Khe Beach, a spacious family **house** in the Hai Chau **area**, or a furnished **villa** with a private pool in Ngu Hanh Son, you'll find current listings updated daily below. Most **rentals** come fully furnished with a **kitchen**, wifi, and air conditioning — ready to move into right away.`,
      `**Monthly rentals** are the norm across the **city**, with flexible **rental** durations for both short stays and long-term, year-long leases. **Rent** ranges from *cheap* budget studios to premium beachfront **houses for rent**, and many **homes** offer two- and three-**bedroom** layouts — including *3-bedroom houses for rent in Da Nang* that are ideal for families or shared living. Compared with buying **real estate**, renting lets you settle into an **area** and get to know each neighborhood before you commit.`,
      `Browse the **houses**, **apartments**, and **villas for rent** below to compare **bedrooms**, bathrooms, districts, and pricing in USD across **Da Nang** and Hoi An. New **rental** listings are added daily from trusted local **agents** and **property** managers, so check back often for the latest options.`,
    ],
    rentBullets: [
      `**Furnished houses and apartments** for **rent** in every district — Hai Chau, Son Tra, Ngu Hanh Son, and more`,
      `**Monthly** and **long-term rentals**, from *cheap* studios to beachfront **houses** and **villas**`,
      `Two- and three-**bedroom** layouts for families, couples, and remote workers`,
      `New **rental** listings added daily from trusted local **agents** and **property** managers`,
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
    ],
    saleH1: 'Houses for Sale in Da Nang, Vietnam | Real Estate & Properties',
    saleSubtitle: (n) => `Browse ${n} properties for sale in Da Nang and Hoi An — houses, apartments, villas, and land. Listings sourced daily from local agents and property managers.`,
    saleH2: 'Houses, Villas & Real Estate for Sale in Da Nang, Vietnam',
    saleH2b: 'Explore Properties for Sale Across Da Nang & Hoi An — Houses, Apartments, Villas & Land',
    saleIntro: [
      `**Da Nang** is one of **Vietnam's** fastest-growing **real estate** markets, with a strong selection of houses, townhouses, villas, apartments, and land for **sale** across the city's most desirable **residential** neighborhoods. Whether you want to **buy** a modern family **home** in Hai Chau, a multi-story townhouse near the **beach** in Ngu Hanh Son, a prime frontage **property** for investment in Thanh Khe, or a beachfront villa in Hoi An, **Da Nang's real estate** market offers excellent value with several **bedrooms** and bathrooms to suit families of every size.`,
      `Many condominium **units** in foreign-eligible buildings are also open to international buyers, making **Da Nang** a popular choice for both lifestyle and investment. Browse the listings below to compare neighborhoods, **property** types, **bedrooms**, and pricing in USD, then reach out about any **homes** that catch your eye — local **agents** can help you arrange a viewing for any **property** in the **area**.`,
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
    rentH1: 'Căn Hộ & Nhà Cho Thuê tại Đà Nẵng, Việt Nam',
    rentSubtitle: (n) => `Xem ${n} bất động sản cho thuê tại Đà Nẵng và Hội An — căn hộ, nhà phố, biệt thự và condotel. Danh sách cập nhật hàng ngày từ các đại lý địa phương.`,
    rentH2: 'Cho Thuê Đầy Đủ Nội Thất tại Đà Nẵng, Việt Nam | Nhà & Căn Hộ',
    rentH2b: 'Khám Phá Bất Động Sản Cho Thuê tại Đà Nẵng & Hội An',
    rentIntro: [
      `Đang tìm **nhà cho thuê tại Đà Nẵng**? Bạn đã đến đúng nơi. **Đà Nẵng** là một trong những **thành phố** được yêu thích nhất **Việt Nam** đối với người nước ngoài, dân du mục kỹ thuật số và khách lưu trú dài hạn, và thị trường **cho thuê** tại đây có **nhà** hoặc **căn hộ** phù hợp với mọi ngân sách. Dù bạn đang tìm một **căn hộ** hiện đại gần biển Mỹ Khê, một **nhà** rộng rãi cho gia đình ở **khu vực** Hải Châu, hay một **biệt thự** đầy đủ nội thất có hồ bơi riêng ở Ngũ Hành Sơn, bạn sẽ tìm thấy các tin đăng cập nhật hàng ngày bên dưới. Hầu hết **nhà cho thuê** đều có sẵn nội thất với **bếp**, wifi và điều hòa — sẵn sàng dọn vào ở ngay.`,
      `**Cho thuê theo tháng** là hình thức phổ biến khắp **thành phố**, với thời hạn **thuê** linh hoạt cho cả lưu trú ngắn ngày lẫn hợp đồng dài hạn cả năm. **Giá thuê** dao động từ studio *giá rẻ* đến **nhà cho thuê** cao cấp view biển, và nhiều căn có thiết kế hai đến ba **phòng ngủ** — bao gồm cả *nhà 3 phòng ngủ cho thuê tại Đà Nẵng* lý tưởng cho gia đình hoặc ở ghép. So với mua **bất động sản**, thuê nhà giúp bạn làm quen với **khu vực** trước khi quyết định.`,
      `Xem các **nhà**, **căn hộ** và **biệt thự cho thuê** bên dưới để so sánh **phòng ngủ**, phòng tắm, quận và mức giá theo USD trên khắp **Đà Nẵng** và Hội An. Tin đăng **cho thuê** mới được thêm hàng ngày từ các **đại lý** và nhà quản lý **bất động sản** uy tín, vậy nên hãy ghé lại thường xuyên để xem các lựa chọn mới nhất.`,
    ],
    rentBullets: [
      `**Nhà và căn hộ** đầy đủ nội thất **cho thuê** ở mọi quận — Hải Châu, Sơn Trà, Ngũ Hành Sơn và hơn thế nữa`,
      `**Cho thuê theo tháng** và **dài hạn**, từ studio *giá rẻ* đến **nhà** và **biệt thự** view biển`,
      `Thiết kế hai và ba **phòng ngủ** cho gia đình, cặp đôi và người làm việc từ xa`,
      `Tin đăng **cho thuê** mới mỗi ngày từ các **đại lý** và nhà quản lý **bất động sản** uy tín`,
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
    ],
    saleH1: 'Nhà Bán tại Đà Nẵng, Việt Nam | Bất Động Sản & Căn Hộ',
    saleSubtitle: (n) => `Xem ${n} bất động sản bán tại Đà Nẵng và Hội An — nhà phố, căn hộ, biệt thự và đất nền. Danh sách cập nhật hàng ngày từ các đại lý địa phương.`,
    saleH2: 'Nhà, Biệt Thự & Bất Động Sản Bán tại Đà Nẵng, Việt Nam',
    saleH2b: 'Khám Phá Bất Động Sản Bán tại Đà Nẵng & Hội An — Nhà, Căn Hộ, Biệt Thự & Đất Nền',
    saleIntro: [
      `Đà Nẵng là một trong những thị trường bất động sản phát triển nhanh nhất Việt Nam, với nhiều lựa chọn nhà phố, biệt thự, căn hộ và đất nền đang bán trên khắp các khu dân cư đáng sống của thành phố. Dù bạn muốn mua một căn nhà gia đình hiện đại ở Hải Châu, một nhà phố nhiều tầng gần biển ở Ngũ Hành Sơn, một bất động sản mặt tiền ở Thanh Khê để đầu tư, hay một biệt thự ven biển ở Hội An, thị trường bất động sản Đà Nẵng đều có lựa chọn phù hợp với mọi quy mô gia đình.`,
      `Nhiều căn hộ chung cư trong các tòa nhà đủ điều kiện cho người nước ngoài cũng đang mở bán cho khách quốc tế, khiến Đà Nẵng trở thành lựa chọn phổ biến cho cả nhu cầu ở thực và đầu tư. Hãy xem danh sách bên dưới để so sánh khu vực, loại bất động sản, số phòng ngủ và mức giá theo USD, sau đó liên hệ về bất kỳ căn nhà nào bạn quan tâm — các đại lý địa phương có thể giúp bạn sắp xếp xem nhà ở bất kỳ khu vực nào.`,
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
