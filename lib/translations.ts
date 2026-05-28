export type Lang = 'en' | 'vi';

export interface Translations {
  forRent: string;
  forSale: string;
  rentH1: string;
  rentSubtitle: (n: number) => string;
  rentH2: string;
  rentH2b: string;
  rentIntro: string[];
  saleH1: string;
  saleSubtitle: (n: number) => string;
  saleH2: string;
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
  description: string;
  contactInfo: string;
  rights: (year: number) => string;
  updated: string;
}

export const translations: Record<Lang, Translations> = {
  en: {
    forRent: 'For Rent',
    forSale: 'For Sale',
    rentH1: 'Apartments & Houses for Rent in Da Nang, Vietnam',
    rentSubtitle: (n) => `Browse ${n} rental properties in Da Nang and Hoi An — apartments, houses, villas, and condos. Listings updated daily from local agents and property managers.`,
    rentH2: 'Furnished Rentals in Da Nang, Vietnam | House & Apartment Listings',
    rentH2b: 'Explore Rental Properties in Da Nang & Hoi An',
    rentIntro: [
      `Da Nang is one of Vietnam's most popular destinations for expats, digital nomads, and long-term visitors, and the rental market here has something for every budget. Whether you're after a modern apartment near My Khe Beach, a spacious family house in Hai Chau, or a furnished villa with a private pool in Ngu Hanh Son, you'll find current listings updated daily below. Most properties come fully furnished with a kitchen, wifi, air conditioning, and everything you need to move in right away.`,
      `Monthly rentals are the norm in Da Nang, with flexible rental durations to suit both short stays and year-long leases. Prices range from budget studios to premium beachfront apartments, and many homes offer two- and three-bedroom layouts ideal for families or shared living. Browse the listings below to compare bedrooms, bathrooms, districts, and pricing in USD, then reach out about any property that catches your eye.`,
    ],
    saleH1: 'Houses for Sale in Da Nang, Vietnam',
    saleSubtitle: (n) => `Browse ${n} properties for sale in Da Nang and Hoi An — houses, apartments, villas, and land. Listings sourced daily from local agents and property managers.`,
    saleH2: 'Properties for Sale in Da Nang & Hoi An',
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
      `Đà Nẵng là một trong những điểm đến được yêu thích nhất Việt Nam đối với người nước ngoài, dân du mục kỹ thuật số và khách lưu trú dài hạn, và thị trường cho thuê tại đây có lựa chọn phù hợp với mọi ngân sách. Dù bạn đang tìm một căn hộ hiện đại gần biển Mỹ Khê, một ngôi nhà rộng rãi cho gia đình ở Hải Châu, hay một biệt thự đầy đủ nội thất có hồ bơi riêng ở Ngũ Hành Sơn, bạn sẽ tìm thấy các tin đăng được cập nhật hàng ngày bên dưới. Hầu hết bất động sản đều có sẵn nội thất đầy đủ với bếp, wifi, điều hòa và mọi tiện nghi để dọn vào ở ngay.`,
      `Cho thuê theo tháng là hình thức phổ biến tại Đà Nẵng, với thời hạn thuê linh hoạt phù hợp cho cả lưu trú ngắn ngày lẫn hợp đồng cả năm. Giá dao động từ studio tiết kiệm đến căn hộ cao cấp view biển, và nhiều căn có thiết kế hai đến ba phòng ngủ lý tưởng cho gia đình hoặc ở ghép. Hãy xem các tin đăng bên dưới để so sánh phòng ngủ, phòng tắm, quận và mức giá theo USD, sau đó liên hệ về bất kỳ bất động sản nào bạn quan tâm.`,
    ],
    saleH1: 'Nhà Bán tại Đà Nẵng, Việt Nam',
    saleSubtitle: (n) => `Xem ${n} bất động sản bán tại Đà Nẵng và Hội An — nhà phố, căn hộ, biệt thự và đất nền. Danh sách cập nhật hàng ngày từ các đại lý địa phương.`,
    saleH2: 'Bất Động Sản Bán tại Đà Nẵng & Hội An',
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
    description: 'Mô Tả',
    contactInfo: 'Thông Tin Liên Hệ',
    rights: (year) => `© ${year} DanangMLS. Bảo lưu mọi quyền.`,
    updated: 'Cập nhật mỗi 30 phút từ danh sách trực tiếp.',
  },
};
