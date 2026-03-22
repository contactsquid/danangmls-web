export type Lang = 'en' | 'vi';

export const translations = {
  en: {
    forRent: 'For Rent',
    forSale: 'For Sale',

    // Hero — rent
    rentH1: 'Houses for Rent in Da Nang, Vietnam',
    rentSubtitle: (n: number) =>
      `Browse ${n} rental properties in Da Nang and Hoi An — apartments, houses, villas, and condos. Listings updated daily from local agents and property managers.`,
    rentH2: 'Available Rental Properties in Da Nang & Hoi An',

    // Hero — sale
    saleH1: 'Houses for Sale in Da Nang, Vietnam',
    saleSubtitle: (n: number) =>
      `Browse ${n} properties for sale in Da Nang and Hoi An — houses, apartments, villas, and land. Listings sourced daily from local agents and property managers.`,
    saleH2: 'Properties for Sale in Da Nang & Hoi An',

    // Filters
    searchPlaceholder: 'Search by title, district, or keyword...',
    allTypes: 'All Types',
    allDistricts: 'All Districts',
    allNeighborhoods: 'All Neighborhoods',
    anyBeds: 'Any Beds',
    anyPrice: 'Any Price',
    clearAll: 'Clear all',
    listingCount: (n: number) => `${n} ${n === 1 ? 'listing' : 'listings'}`,
    noListings: 'No listings match your search',
    clearFilters: 'Clear filters',
    br: 'BR',

    // Price ranges — rent
    under500: 'Under $500',
    r500: '$500 – $1,000',
    r1000: '$1,000 – $2,000',
    r2000: '$2,000 – $3,000',
    r3000: '$3,000+',

    // Price ranges — sale
    under100k: 'Under $100,000',
    s100k: '$100,000 – $300,000',
    s300k: '$300,000 – $500,000',
    s500k: '$500,000 – $1,000,000',
    s1m: '$1,000,000+',

    // Card
    viewListing: 'View Listing',

    // Detail page
    backToListings: 'Back to listings',
    district: 'District',
    bedrooms: 'Bedrooms',
    agent: 'Agent',
    description: 'Description',
    contactInfo: 'Contact Information',

    // Footer
    rights: (year: number) => `© ${year} DanangMLS. All rights reserved.`,
    updated: 'Updated every 30 minutes from live listings.',
  },

  vi: {
    forRent: 'Cho Thuê',
    forSale: 'Mua Bán',

    // Hero — rent
    rentH1: 'Nhà Cho Thuê tại Đà Nẵng, Việt Nam',
    rentSubtitle: (n: number) =>
      `Xem ${n} bất động sản cho thuê tại Đà Nẵng và Hội An — căn hộ, nhà phố, biệt thự và condotel. Danh sách cập nhật hàng ngày từ các đại lý địa phương.`,
    rentH2: 'Bất Động Sản Cho Thuê tại Đà Nẵng & Hội An',

    // Hero — sale
    saleH1: 'Nhà Bán tại Đà Nẵng, Việt Nam',
    saleSubtitle: (n: number) =>
      `Xem ${n} bất động sản bán tại Đà Nẵng và Hội An — nhà phố, căn hộ, biệt thự và đất nền. Danh sách cập nhật hàng ngày từ các đại lý địa phương.`,
    saleH2: 'Bất Động Sản Bán tại Đà Nẵng & Hội An',

    // Filters
    searchPlaceholder: 'Tìm theo tiêu đề, quận, hoặc từ khóa...',
    allTypes: 'Tất Cả Loại',
    allDistricts: 'Tất Cả Quận',
    allNeighborhoods: 'Tất Cả Phường',
    anyBeds: 'Số Phòng',
    anyPrice: 'Tất Cả Giá',
    clearAll: 'Xóa tất cả',
    listingCount: (n: number) => `${n} danh sách`,
    noListings: 'Không tìm thấy bất động sản phù hợp',
    clearFilters: 'Xóa bộ lọc',
    br: 'PN',

    // Price ranges — rent
    under500: 'Dưới $500',
    r500: '$500 – $1.000',
    r1000: '$1.000 – $2.000',
    r2000: '$2.000 – $3.000',
    r3000: 'Trên $3.000',

    // Price ranges — sale
    under100k: 'Dưới $100.000',
    s100k: '$100.000 – $300.000',
    s300k: '$300.000 – $500.000',
    s500k: '$500.000 – $1.000.000',
    s1m: 'Trên $1.000.000',

    // Card
    viewListing: 'Xem Chi Tiết',

    // Detail page
    backToListings: 'Quay lại danh sách',
    district: 'Quận',
    bedrooms: 'Phòng Ngủ',
    agent: 'Đại Lý',
    description: 'Mô Tả',
    contactInfo: 'Thông Tin Liên Hệ',

    // Footer
    rights: (year: number) => `© ${year} DanangMLS. Bảo lưu mọi quyền.`,
    updated: 'Cập nhật mỗi 30 phút từ danh sách trực tiếp.',
  },
} as const;

export type Translations = typeof translations.en;
