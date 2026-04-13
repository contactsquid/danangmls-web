export interface DistrictInfo {
  name:          string;
  viName:        string;
  description:   string;
  viDescription: string;
  // OpenStreetMap embed bbox: west, south, east, north
  bbox: [number, number, number, number];
  lat:  number;
  lng:  number;
}

export const DISTRICTS: Record<string, DistrictInfo> = {
  'Hai Chau': {
    name:   'Hai Chau',
    viName: 'Hải Châu',
    description:
      'Hai Chau is the beating heart of Da Nang — the city's central business and cultural district. Home to the iconic Dragon Bridge, Lotte Mart, Han Market, and the bustling riverfront promenade, it puts residents within walking distance of banks, restaurants, hospitals, and international schools. Properties here offer the ultimate urban lifestyle in central Da Nang.',
    viDescription:
      'Hải Châu là trung tâm sầm uất của Đà Nẵng — quận kinh doanh và văn hóa trọng điểm của thành phố. Với cầu Rồng biểu tượng, Lotte Mart, chợ Hàn và bờ sông tấp nập, cư dân tại đây có thể đi bộ đến ngân hàng, nhà hàng, bệnh viện và trường quốc tế. Bất động sản tại Hải Châu mang đến lối sống đô thị hiện đại bậc nhất Đà Nẵng.',
    bbox: [108.188, 16.040, 108.225, 16.075],
    lat:  16.0544,
    lng:  108.2022,
  },
  'Son Tra': {
    name:   'Son Tra',
    viName: 'Sơn Trà',
    description:
      'Son Tra District occupies the scenic peninsula northeast of central Da Nang, flanked by pristine beaches and the Son Tra Nature Reserve. The northern stretch of My Khe Beach, Hiyori Garden Mall, and a growing restaurant and café scene make it a favourite among expats and professionals. Expect ocean views, sea breezes, and a relaxed coastal atmosphere minutes from the city.',
    viDescription:
      'Quận Sơn Trà nằm trên bán đảo thơ mộng ở đông bắc trung tâm Đà Nẵng, được bao quanh bởi những bãi biển trong xanh và Khu Bảo tồn Thiên nhiên Sơn Trà. Phía bắc bãi biển Mỹ Khê, trung tâm thương mại Hiyori Garden, cùng khu ẩm thực và cà phê sôi động khiến nơi đây trở thành lựa chọn yêu thích của người nước ngoài. Quận Sơn Trà mang đến tầm nhìn biển, gió mát và không khí ven biển thư thái chỉ vài phút từ trung tâm.',
    bbox: [108.215, 16.055, 108.285, 16.125],
    lat:  16.0900,
    lng:  108.2500,
  },
  'Ngu Hanh Son': {
    name:   'Ngu Hanh Son',
    viName: 'Ngũ Hành Sơn',
    description:
      'Ngu Hanh Son — commonly known as the Marble Mountains district — sits along the southern stretch of My Khe Beach and is one of Da Nang's fastest-growing residential areas. Neighbourhoods like My An, Hoa Hai, An Thuong, and the upscale FPT City development attract international residents seeking a blend of beach access, modern amenities, and quieter streets. FPT University and several international schools add to its appeal for families.',
    viDescription:
      'Quận Ngũ Hành Sơn — thường được gọi là quận Núi Ngũ Hành Sơn — nằm dọc theo phía nam bãi biển Mỹ Khê và là một trong những khu dân cư phát triển nhanh nhất Đà Nẵng. Các khu vực như Mỹ An, Hòa Hải, An Thượng và khu đô thị FPT City hiện đại thu hút cư dân quốc tế tìm kiếm sự kết hợp giữa bãi biển, tiện ích hiện đại và đường phố yên tĩnh hơn. Trường Đại học FPT và nhiều trường quốc tế cũng làm tăng sức hút cho khu vực này với các gia đình.',
    bbox: [108.215, 15.965, 108.285, 16.030],
    lat:  16.0000,
    lng:  108.2520,
  },
  'Thanh Khe': {
    name:   'Thanh Khe',
    viName: 'Thanh Khê',
    description:
      'Thanh Khe is a densely populated residential district immediately west of Hai Chau, running along Da Nang's western bay. Known for its authentic local markets, affordable housing, and easy access to the city centre, it attracts families and long-term residents who want to live like a local. The district borders Da Nang International Airport and offers strong transport links across the city.',
    viDescription:
      'Thanh Khê là quận dân cư đông đúc nằm ngay phía tây Hải Châu, chạy dọc theo vịnh phía tây Đà Nẵng. Nổi tiếng với các chợ địa phương sôi động, nhà ở giá cả phải chăng và khả năng tiếp cận dễ dàng với trung tâm thành phố, quận Thanh Khê thu hút các gia đình và cư dân lâu dài muốn sống theo phong cách địa phương. Quận giáp ranh Sân bay Quốc tế Đà Nẵng và có hệ thống giao thông thuận tiện khắp thành phố.',
    bbox: [108.160, 16.042, 108.200, 16.082],
    lat:  16.0620,
    lng:  108.1780,
  },
  'Lien Chieu': {
    name:   'Lien Chieu',
    viName: 'Liên Chiểu',
    description:
      'Lien Chieu is Da Nang's northwestern industrial and university district, situated between the mountains and the sea. It is home to the Da Nang University of Technology, large industrial parks, and an emerging residential scene along the coast. Property prices are among the most affordable in the city, making it popular with students, young professionals, and buyers seeking value close to nature.',
    viDescription:
      'Liên Chiểu là quận công nghiệp và đại học phía tây bắc Đà Nẵng, nằm giữa núi và biển. Nơi đây có Trường Đại học Bách khoa Đà Nẵng, các khu công nghiệp lớn và khu dân cư đang nổi lên dọc bờ biển. Giá bất động sản tại Liên Chiểu thuộc hàng phải chăng nhất thành phố, thu hút sinh viên, người trẻ đi làm và người mua muốn tìm kiếm giá trị gần thiên nhiên.',
    bbox: [108.095, 16.062, 108.175, 16.145],
    lat:  16.1000,
    lng:  108.1380,
  },
  'Cam Le': {
    name:   'Cam Le',
    viName: 'Cẩm Lệ',
    description:
      'Cam Le is a southern mainland district connecting Da Nang's urban core to the surrounding countryside. The Hoa Xuan riverside township has attracted significant investment and offers spacious villas and townhouses at competitive prices. Its location along the Han River provides scenic views and easy access to the city centre, Ngu Hanh Son, and the Marble Mountains tourist area.',
    viDescription:
      'Cẩm Lệ là quận đất liền phía nam kết nối trung tâm đô thị Đà Nẵng với vùng ngoại ô. Khu đô thị ven sông Hòa Xuân đã thu hút đầu tư đáng kể và cung cấp biệt thự, nhà phố rộng rãi với giá cạnh tranh. Vị trí dọc sông Hàn mang lại tầm nhìn đẹp và khả năng tiếp cận dễ dàng với trung tâm thành phố, Ngũ Hành Sơn và khu du lịch Núi Ngũ Hành Sơn.',
    bbox: [108.170, 15.965, 108.230, 16.025],
    lat:  15.9950,
    lng:  108.1980,
  },
  'Hoi An': {
    name:   'Hoi An',
    viName: 'Hội An',
    description:
      'Hoi An is a UNESCO World Heritage city 30 kilometres south of Da Nang, celebrated for its beautifully preserved Ancient Town, lantern-lit streets, and thriving expat community. The surrounding areas — from An Bang and Cua Dai beaches to the rice paddies of the countryside — offer a diverse range of properties, from boutique villas to modern apartments. Hoi An's combination of history, charm, and international amenities makes it one of Vietnam's most sought-after addresses.',
    viDescription:
      'Hội An là thành phố Di sản Thế giới UNESCO cách Đà Nẵng 30 km về phía nam, nổi tiếng với phố cổ được bảo tồn tuyệt đẹp, những con phố đèn lồng rực rỡ và cộng đồng người nước ngoài sôi động. Các khu vực xung quanh — từ bãi biển An Bàng, Cửa Đại đến những cánh đồng lúa thơ mộng — cung cấp đa dạng loại hình bất động sản, từ biệt thự boutique đến căn hộ hiện đại. Sự kết hợp giữa lịch sử, vẻ quyến rũ và tiện ích quốc tế khiến Hội An trở thành một trong những địa chỉ được săn đón nhất Việt Nam.',
    bbox: [108.295, 15.855, 108.375, 15.915],
    lat:  15.8801,
    lng:  108.3380,
  },
};

export function getDistrict(name: string): DistrictInfo | null {
  if (!name) return null;
  // Exact match first
  if (DISTRICTS[name]) return DISTRICTS[name];
  // Case-insensitive fallback
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(DISTRICTS)) {
    if (key.toLowerCase() === lower) return val;
  }
  return null;
}
