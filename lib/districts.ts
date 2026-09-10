export interface DistrictInfo {
  name:          string;
  viName:        string;
  description:   string;
  viDescription: string;
  // Filled in below from KO_COPY / RU_COPY rather than inline, so each entry's
  // geo data stays readable. Optional so a new district cannot break the build.
  koName?:        string;
  koDescription?: string;
  ruName?:        string;
  ruDescription?: string;
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
      `Hai Chau is the beating heart of Da Nang — the city's central business and cultural district. Home to the iconic Dragon Bridge, Lotte Mart, Han Market, and the bustling riverfront promenade, it puts residents within walking distance of banks, restaurants, hospitals, and international schools. Properties here offer the ultimate urban lifestyle in central Da Nang.`,
    viDescription:
      `Hải Châu là trung tâm sầm uất của Đà Nẵng — quận kinh doanh và văn hóa trọng điểm của thành phố. Với cầu Rồng biểu tượng, Lotte Mart, chợ Hàn và bờ sông tấp nập, cư dân tại đây có thể đi bộ đến ngân hàng, nhà hàng, bệnh viện và trường quốc tế. Bất động sản tại Hải Châu mang đến lối sống đô thị hiện đại bậc nhất Đà Nẵng.`,
    bbox: [108.188, 16.040, 108.225, 16.075],
    lat:  16.0544,
    lng:  108.2022,
  },
  'Son Tra': {
    name:   'Son Tra',
    viName: 'Sơn Trà',
    description:
      `Son Tra District occupies the scenic peninsula northeast of central Da Nang, flanked by pristine beaches and the Son Tra Nature Reserve. The northern stretch of My Khe Beach, Hiyori Garden Mall, and a growing restaurant and café scene make it a favourite among expats and professionals. Expect ocean views, sea breezes, and a relaxed coastal atmosphere minutes from the city.`,
    viDescription:
      `Quận Sơn Trà nằm trên bán đảo thơ mộng ở đông bắc trung tâm Đà Nẵng, được bao quanh bởi những bãi biển trong xanh và Khu Bảo tồn Thiên nhiên Sơn Trà. Phía bắc bãi biển Mỹ Khê, trung tâm thương mại Hiyori Garden, cùng khu ẩm thực và cà phê sôi động khiến nơi đây trở thành lựa chọn yêu thích của người nước ngoài. Quận Sơn Trà mang đến tầm nhìn biển, gió mát và không khí ven biển thư thái chỉ vài phút từ trung tâm.`,
    bbox: [108.215, 16.055, 108.285, 16.125],
    lat:  16.0900,
    lng:  108.2500,
  },
  'Ngu Hanh Son': {
    name:   'Ngu Hanh Son',
    viName: 'Ngũ Hành Sơn',
    description:
      `Ngu Hanh Son — commonly known as the Marble Mountains district — sits along the southern stretch of My Khe Beach and is one of Da Nang's fastest-growing residential areas. Neighbourhoods like My An, Hoa Hai, An Thuong, and the upscale FPT City development attract international residents seeking a blend of beach access, modern amenities, and quieter streets. FPT University and several international schools add to its appeal for families.`,
    viDescription:
      `Quận Ngũ Hành Sơn — thường được gọi là quận Núi Ngũ Hành Sơn — nằm dọc theo phía nam bãi biển Mỹ Khê và là một trong những khu dân cư phát triển nhanh nhất Đà Nẵng. Các khu vực như Mỹ An, Hòa Hải, An Thượng và khu đô thị FPT City hiện đại thu hút cư dân quốc tế tìm kiếm sự kết hợp giữa bãi biển, tiện ích hiện đại và đường phố yên tĩnh hơn. Trường Đại học FPT và nhiều trường quốc tế cũng làm tăng sức hút cho khu vực này với các gia đình.`,
    bbox: [108.215, 15.965, 108.285, 16.030],
    lat:  16.0000,
    lng:  108.2520,
  },
  'Thanh Khe': {
    name:   'Thanh Khe',
    viName: 'Thanh Khê',
    description:
      `Thanh Khe is a densely populated residential district immediately west of Hai Chau, running along Da Nang's western bay. Known for its authentic local markets, affordable housing, and easy access to the city centre, it attracts families and long-term residents who want to live like a local. The district borders Da Nang International Airport and offers strong transport links across the city.`,
    viDescription:
      `Thanh Khê là quận dân cư đông đúc nằm ngay phía tây Hải Châu, chạy dọc theo vịnh phía tây Đà Nẵng. Nổi tiếng với các chợ địa phương sôi động, nhà ở giá cả phải chăng và khả năng tiếp cận dễ dàng với trung tâm thành phố, quận Thanh Khê thu hút các gia đình và cư dân lâu dài muốn sống theo phong cách địa phương. Quận giáp ranh Sân bay Quốc tế Đà Nẵng và có hệ thống giao thông thuận tiện khắp thành phố.`,
    bbox: [108.160, 16.042, 108.200, 16.082],
    lat:  16.0620,
    lng:  108.1780,
  },
  'Lien Chieu': {
    name:   'Lien Chieu',
    viName: 'Liên Chiểu',
    description:
      `Lien Chieu is Da Nang's northwestern industrial and university district, situated between the mountains and the sea. It is home to the Da Nang University of Technology, large industrial parks, and an emerging residential scene along the coast. Property prices are among the most affordable in the city, making it popular with students, young professionals, and buyers seeking value close to nature.`,
    viDescription:
      `Liên Chiểu là quận công nghiệp và đại học phía tây bắc Đà Nẵng, nằm giữa núi và biển. Nơi đây có Trường Đại học Bách khoa Đà Nẵng, các khu công nghiệp lớn và khu dân cư đang nổi lên dọc bờ biển. Giá bất động sản tại Liên Chiểu thuộc hàng phải chăng nhất thành phố, thu hút sinh viên, người trẻ đi làm và người mua muốn tìm kiếm giá trị gần thiên nhiên.`,
    bbox: [108.095, 16.062, 108.175, 16.145],
    lat:  16.1000,
    lng:  108.1380,
  },
  'Cam Le': {
    name:   'Cam Le',
    viName: 'Cẩm Lệ',
    description:
      `Cam Le is a southern mainland district connecting Da Nang's urban core to the surrounding countryside. The Hoa Xuan riverside township has attracted significant investment and offers spacious villas and townhouses at competitive prices. Its location along the Han River provides scenic views and easy access to the city centre, Ngu Hanh Son, and the Marble Mountains tourist area.`,
    viDescription:
      `Cẩm Lệ là quận đất liền phía nam kết nối trung tâm đô thị Đà Nẵng với vùng ngoại ô. Khu đô thị ven sông Hòa Xuân đã thu hút đầu tư đáng kể và cung cấp biệt thự, nhà phố rộng rãi với giá cạnh tranh. Vị trí dọc sông Hàn mang lại tầm nhìn đẹp và khả năng tiếp cận dễ dàng với trung tâm thành phố, Ngũ Hành Sơn và khu du lịch Núi Ngũ Hành Sơn.`,
    bbox: [108.170, 15.965, 108.230, 16.025],
    lat:  15.9950,
    lng:  108.1980,
  },
  'Hoi An': {
    name:   'Hoi An',
    viName: 'Hội An',
    description:
      `Hoi An is a UNESCO World Heritage city 30 kilometres south of Da Nang, celebrated for its beautifully preserved Ancient Town, lantern-lit streets, and thriving expat community. The surrounding areas — from An Bang and Cua Dai beaches to the rice paddies of the countryside — offer a diverse range of properties, from boutique villas to modern apartments. Hoi An's combination of history, charm, and international amenities makes it one of Vietnam's most sought-after addresses.`,
    viDescription:
      `Hội An là thành phố Di sản Thế giới UNESCO cách Đà Nẵng 30 km về phía nam, nổi tiếng với phố cổ được bảo tồn tuyệt đẹp, những con phố đèn lồng rực rỡ và cộng đồng người nước ngoài sôi động. Các khu vực xung quanh — từ bãi biển An Bàng, Cửa Đại đến những cánh đồng lúa thơ mộng — cung cấp đa dạng loại hình bất động sản, từ biệt thự boutique đến căn hộ hiện đại. Sự kết hợp giữa lịch sử, vẻ quyến rũ và tiện ích quốc tế khiến Hội An trở thành một trong những địa chỉ được săn đón nhất Việt Nam.`,
    bbox: [108.295, 15.855, 108.375, 15.915],
    lat:  15.8801,
    lng:  108.3380,
  },
  'Hoa Vang': {
    name:   'Hoa Vang',
    viName: 'Hòa Vang',
    description:
      `Hoa Vang is Da Nang's largest district by area — a rural, mountainous stretch to the west of the city, home to Ba Na Hills, the Nui Than Tai hot springs, and wide expanses of farmland. It appeals to buyers hunting for larger land plots, weekend retreats, and resort-style properties away from the coastal crowds, while staying a scenic 30–45 minute drive from central Da Nang.`,
    viDescription:
      `Hòa Vang là huyện có diện tích lớn nhất Đà Nẵng — một vùng nông thôn, đồi núi ở phía tây thành phố, nơi có Bà Nà Hills, suối khoáng nóng Núi Thần Tài và những cánh đồng rộng lớn. Khu vực này thu hút người mua tìm kiếm lô đất rộng, nhà nghỉ dưỡng cuối tuần và bất động sản phong cách resort tránh xa sự đông đúc ven biển, trong khi vẫn chỉ cách trung tâm Đà Nẵng khoảng 30–45 phút lái xe.`,
    bbox: [107.8185, 15.9180, 108.2249, 16.2154],
    lat:  16.0667,
    lng:  107.9738,
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

// Korean and Russian district copy. Kept as a side table rather than four more
// fields per entry so the geo data (bbox/lat/lng) stays readable, then merged
// onto each DistrictInfo below.
const KO_COPY: Record<string, { name: string; description: string }> = {
  'Hai Chau': { name: '하이쩌우', description: `하이쩌우는 다낭의 심장부로, 도시의 중심 상업·문화 지구입니다. 상징적인 용다리, 롯데마트, 한 시장, 활기찬 강변 산책로가 있어 은행, 레스토랑, 병원, 국제학교까지 걸어서 갈 수 있습니다. 이곳의 부동산은 다낭 도심의 도시적인 생활을 그대로 누릴 수 있게 해 줍니다.` },
  'Son Tra': { name: '썬짜', description: `썬짜는 다낭 도심 북동쪽의 경치 좋은 반도에 자리하며, 깨끗한 해변과 썬짜 자연보호구역으로 둘러싸여 있습니다. 미케 해변 북쪽 구간, 히요리 가든 몰, 그리고 늘어나는 레스토랑과 카페가 외국인과 전문직 종사자들에게 인기를 끌고 있습니다. 도심에서 몇 분 거리에서 바다 전망과 해풍, 여유로운 해안 분위기를 누릴 수 있습니다.` },
  'Ngu Hanh Son': { name: '응우한선', description: `응우한선은 오행산(마블 마운틴) 지역으로 잘 알려져 있으며, 미케 해변 남쪽을 따라 자리한 다낭에서 가장 빠르게 성장하는 주거 지역 중 하나입니다. 미안, 호아하이, 안트엉, 그리고 고급 FPT 시티 개발지는 해변 접근성과 현대적인 편의시설, 조용한 거리를 함께 원하는 외국인 거주자들에게 인기가 높습니다. FPT 대학교와 여러 국제학교가 있어 가족 단위 거주에도 적합합니다.` },
  'Thanh Khe': { name: '탄케', description: `탄케는 하이쩌우 바로 서쪽에 있는 인구 밀집 주거 지역으로, 다낭 서쪽 만을 따라 이어집니다. 현지 시장, 합리적인 주거비, 도심까지의 편리한 접근성 덕분에 현지인처럼 생활하고 싶은 가족과 장기 거주자들이 많이 찾습니다. 다낭 국제공항과 인접해 있어 시내 어디로든 이동이 편리합니다.` },
  'Lien Chieu': { name: '리엔찌에우', description: `리엔찌에우는 산과 바다 사이에 자리한 다낭 북서쪽의 산업·대학 지역입니다. 다낭 공과대학교와 대규모 산업단지가 있으며, 해안을 따라 새로운 주거지가 형성되고 있습니다. 시내에서 가장 합리적인 가격대에 속해 학생, 사회 초년생, 자연과 가까운 가성비 매물을 찾는 사람들에게 인기가 있습니다.` },
  'Cam Le': { name: '깜레', description: `깜레는 다낭 도심과 주변 시골 지역을 잇는 남쪽 내륙 지역입니다. 한강변의 호아쑤언 신도시는 상당한 투자가 이루어져 넓은 빌라와 타운하우스를 경쟁력 있는 가격에 제공합니다. 한강을 따라 자리해 경치가 좋고, 도심과 응우한선, 오행산 관광지로 이동하기도 편리합니다.` },
  'Hoi An': { name: '호이안', description: `호이안은 다낭에서 남쪽으로 30km 떨어진 유네스코 세계문화유산 도시로, 잘 보존된 구시가지와 등불이 밝혀진 거리, 활발한 외국인 커뮤니티로 유명합니다. 안방 해변과 끄어다이 해변부터 시골의 논밭까지, 주변 지역에는 부티크 빌라부터 현대식 아파트까지 다양한 매물이 있습니다. 역사와 정취, 국제적인 편의시설이 어우러져 베트남에서 가장 인기 있는 주거지 중 하나로 꼽힙니다.` },
  'Hoa Vang': { name: '호아방', description: `호아방은 면적 기준 다낭에서 가장 큰 지역으로, 도시 서쪽의 농촌·산악 지대이며 바나힐과 눈 탄 타이 온천, 넓은 농지가 자리합니다. 해안의 번잡함에서 벗어나 넓은 토지와 주말 별장, 리조트형 부동산을 찾는 사람들에게 적합하며, 다낭 도심에서 경치 좋은 길로 30~45분 거리입니다.` },
};

const RU_COPY: Record<string, { name: string; description: string }> = {
  'Hai Chau': { name: 'Хайчау', description: `Хайчау — сердце Дананга, центральный деловой и культурный район города. Здесь находятся знаменитый Мост Дракона, Lotte Mart, рынок Хан и оживлённая набережная, а до банков, ресторанов, больниц и международных школ можно дойти пешком. Недвижимость здесь даёт максимально городской образ жизни в центре Дананга.` },
  'Son Tra': { name: 'Шонча', description: `Район Шонча занимает живописный полуостров к северо-востоку от центра Дананга, между чистыми пляжами и заповедником Шонча. Северная часть пляжа Ми Кхе, торговый центр Hiyori Garden и растущее число ресторанов и кафе сделали его любимым местом иностранцев и специалистов. Здесь вас ждут вид на океан, морской бриз и спокойная прибрежная атмосфера в нескольких минутах от города.` },
  'Ngu Hanh Son': { name: 'Нгуханьшон', description: `Нгуханьшон, более известный как район Мраморных гор, тянется вдоль южной части пляжа Ми Кхе и является одним из самых быстрорастущих жилых районов Дананга. Кварталы Ми Ан, Хоахай, Ан Тхыонг и престижный район FPT City привлекают иностранцев, которым нужны и близость к морю, и современная инфраструктура, и тихие улицы. Университет FPT и несколько международных школ делают район удобным для семей.` },
  'Thanh Khe': { name: 'Тханькхе', description: `Тханькхе — плотно застроенный жилой район сразу к западу от Хайчау, вытянутый вдоль западной бухты Дананга. Его выбирают семьи и те, кто живёт здесь подолгу: местные рынки, доступное жильё и лёгкий доступ в центр позволяют жить как местные. Район граничит с международным аэропортом Дананга и хорошо связан с остальным городом.` },
  'Lien Chieu': { name: 'Лиенчиеу', description: `Лиенчиеу — северо-западный промышленный и университетский район Дананга, расположенный между горами и морем. Здесь находятся Данангский технический университет, крупные промышленные парки и формирующаяся жилая застройка вдоль побережья. Цены на недвижимость одни из самых доступных в городе, что привлекает студентов, молодых специалистов и тех, кто ищет выгодные варианты рядом с природой.` },
  'Cam Le': { name: 'Камле', description: `Камле — южный материковый район, связывающий городское ядро Дананга с окрестными сельскими районами. Прибрежный микрорайон Хоасуан получил значительные инвестиции и предлагает просторные виллы и таунхаусы по конкурентным ценам. Расположение вдоль реки Хан даёт хорошие виды и удобный доступ в центр города, к Нгуханьшону и Мраморным горам.` },
  'Hoi An': { name: 'Хойан', description: `Хойан — город из списка Всемирного наследия ЮНЕСКО в 30 километрах к югу от Дананга, известный прекрасно сохранившимся Старым городом, улицами в фонарях и большой общиной иностранцев. Окрестности — от пляжей Ан Банг и Куа Дай до рисовых полей — предлагают самое разное жильё, от бутик-вилл до современных квартир. Сочетание истории, атмосферы и международной инфраструктуры делает Хойан одним из самых востребованных адресов во Вьетнаме.` },
  'Hoa Vang': { name: 'Хоаванг', description: `Хоаванг — самый большой по площади район Дананга: сельская гористая местность к западу от города, где находятся Ба На Хиллс, горячие источники Нуи Тхан Тай и обширные сельхозугодья. Он подходит тем, кто ищет большие участки, дома для выходных и недвижимость курортного типа вдали от прибрежной суеты, оставаясь в 30–45 минутах живописной дороги от центра Дананга.` },
};

for (const [key, info] of Object.entries(DISTRICTS)) {
  const ko = KO_COPY[key];
  const ru = RU_COPY[key];
  if (ko) { info.koName = ko.name; info.koDescription = ko.description; }
  if (ru) { info.ruName = ru.name; info.ruDescription = ru.description; }
}

/** District name + blurb in the page language, falling back to English. */
export function districtCopy(info: DistrictInfo, lang: string): { name: string; description: string } {
  if (lang === 'vi') return { name: info.viName, description: info.viDescription };
  if (lang === 'ko' && info.koName) return { name: info.koName, description: info.koDescription! };
  if (lang === 'ru' && info.ruName) return { name: info.ruName, description: info.ruDescription! };
  return { name: info.name, description: info.description };
}
