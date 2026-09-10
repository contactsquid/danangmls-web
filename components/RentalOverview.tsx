'use client';

import { useLanguage } from './LanguageProvider';
import { DISTRICT_HERO } from '@/lib/pageImages';
import { forLang } from '@/lib/translations';

// A text-heavy long-form section (like the SEO prose block) with two images
// woven in to break up the copy. Written to read well AND to carry the
// under-target POP terms (Da Nang, beach, city, area, property, apartment,
// villa, real estate) without over-using the capped ones.

interface Overview { h2: string; paras: string[]; alt1: string; alt2: string }

const IMG1 = DISTRICT_HERO['Ngu Hanh Son']; // rooftop pool + city/beach skyline
const IMG2 = DISTRICT_HERO['Hoi An'];        // furnished pool villa

const EN: Overview = {
  h2: 'Renting in Da Nang: The City, the Beaches & the Property Market',
  paras: [
    'Da Nang sits on the central coast of Vietnam, a mid-sized city wrapped around the Han River and backed by a long ribbon of beach. Over the past decade it has grown from a quiet port into one of the country’s most liveable cities — clean, easy to navigate, and never more than a few minutes from the sea. For anyone renting here, that mix of a real city and an open beach is the whole appeal: you can work from a café in the Hai Chau area in the morning and swim at My Khe Beach in the afternoon.',
    'Each part of Da Nang has its own character. The Hai Chau area is the commercial heart of the city, dense with offices, markets, and restaurants. Cross the river to Son Tra and My An and you’re in the beach district, where most newcomers settle for the short ride to the sand and the cluster of cafés around An Thuong. Further south, the Ngu Hanh Son area runs along the coast beneath the Marble Mountains, while quieter, greener pockets like Hoa Xuan offer more space inland. Thirty minutes down the coast, Hoi An trades city bustle for lantern-lit old-town charm.',
    'The Da Nang property market has a home for every kind of renter. Modern apartments fill the towers along the beach and the river — many in buildings with a pool, gym, and round-the-clock security — while landed homes and pool villas sit in the residential streets just inland. Most are offered as furnished rentals, finished and equipped so you can move in with a suitcase. Compared with the real estate on offer in Ho Chi Minh City or Hanoi, Da Nang property gives you noticeably more space and more sea for your budget.',
    'Leases here are refreshingly simple. The rental duration is flexible, from a few months to a full year, and most landlords ask for a deposit of one to two months alongside the first period up front. Longer commitments are usually rewarded with a better rate, and your host handles the temporary-residence registration with the local police — a routine step for every foreign tenant in the city.',
    'What surprises most new arrivals is the value. Da Nang remains one of the more affordable coastal cities in the region: a comfortable home near the beach costs a fraction of a similar spot in most Western cities, and everyday life — food, transport, coffee — is inexpensive. That low cost of living, paired with fast internet and a large, welcoming community, is why so many remote workers end up staying far longer than they first planned.',
    'Whatever you’re after — a high-floor apartment with a sea view, a family villa with a garden, or a simple base near the beach — the listings on this page are refreshed daily from local agents, so you’re always seeing what’s genuinely available across the Da Nang and Hoi An area. Filter by district, price, and home type above, and reach out about any property that catches your eye.',
  ],
  alt1: 'Beachfront apartments and the city skyline in the Ngu Hanh Son area of Da Nang, Vietnam',
  alt2: 'A furnished villa with a private pool for rent in the Da Nang area',
};

const VI: Overview = {
  h2: 'Thuê Nhà tại Đà Nẵng: Thành Phố, Bãi Biển & Thị Trường Bất Động Sản',
  paras: [
    'Đà Nẵng nằm ở dải bờ biển miền Trung Việt Nam, một thành phố cỡ vừa ôm quanh sông Hàn và tựa lưng vào một dải bãi biển dài. Trong một thập kỷ qua, nơi đây đã vươn mình từ một cảng biển yên tĩnh thành một trong những thành phố đáng sống nhất cả nước — sạch, dễ di chuyển, và không bao giờ cách biển quá vài phút. Với người đi thuê, chính sự kết hợp giữa một thành phố thực thụ và một bãi biển thoáng đãng là điều hấp dẫn nhất.',
    'Mỗi khu vực của Đà Nẵng có một nét riêng. Khu vực Hải Châu là trung tâm thương mại của thành phố, dày đặc văn phòng, chợ và nhà hàng. Qua sông đến Sơn Trà và Mỹ An là khu ven biển, nơi phần lớn người nước ngoài chọn ở vì gần biển và cụm quán cà phê quanh An Thượng. Xa hơn về phía nam, khu vực Ngũ Hành Sơn chạy dọc bờ biển dưới chân núi, trong khi những vùng yên tĩnh, nhiều cây xanh như Hòa Xuân có không gian rộng rãi hơn ở phía trong. Cách 30 phút dọc bờ biển, Hội An mang nét cổ kính đèn lồng thay cho nhịp sống thành phố.',
    'Thị trường bất động sản Đà Nẵng có chỗ ở cho mọi kiểu người thuê. Các căn hộ hiện đại lấp đầy những tòa tháp dọc biển và sông — nhiều tòa có hồ bơi, phòng gym và bảo vệ 24/7 — trong khi nhà đất và biệt thự có hồ bơi nằm trên những con phố dân cư phía trong. Hầu hết được cho thuê đầy đủ nội thất, hoàn thiện sẵn để bạn chỉ cần xách vali dọn vào. So với bất động sản ở TP.HCM hay Hà Nội, bất động sản Đà Nẵng cho bạn nhiều không gian và nhiều biển hơn với cùng ngân sách.',
    'Hợp đồng thuê ở đây khá đơn giản. Thời hạn thuê linh hoạt, từ vài tháng đến trọn một năm, và hầu hết chủ nhà yêu cầu đặt cọc một đến hai tháng cùng kỳ thanh toán đầu tiên. Cam kết dài hạn thường được ưu đãi giá tốt hơn, và chủ nhà lo phần đăng ký tạm trú với công an địa phương — thủ tục thường lệ cho mọi người thuê nước ngoài trong thành phố.',
    'Điều khiến nhiều người mới đến bất ngờ là giá trị nhận được. Đà Nẵng vẫn là một trong những thành phố ven biển dễ chịu về chi phí nhất khu vực: một tổ ấm thoải mái gần biển có giá chỉ bằng một phần so với nơi tương tự ở hầu hết thành phố phương Tây, và chi phí sinh hoạt hằng ngày rất phải chăng. Chính mức sống thấp đó, cùng internet nhanh và một cộng đồng đông đảo, thân thiện, khiến nhiều người làm việc từ xa ở lại lâu hơn dự định ban đầu.',
    'Dù bạn tìm gì — một căn hộ tầng cao view biển, một biệt thự gia đình có sân vườn, hay một chỗ ở đơn giản gần biển — các tin đăng trên trang này được cập nhật hàng ngày từ các đại lý địa phương, nên bạn luôn thấy những gì thực sự đang có trên khắp khu vực Đà Nẵng và Hội An. Lọc theo quận, giá và loại nhà phía trên, và liên hệ về bất kỳ bất động sản nào bạn quan tâm.',
  ],
  alt1: 'Căn hộ ven biển và toàn cảnh thành phố ở khu vực Ngũ Hành Sơn, Đà Nẵng',
  alt2: 'Biệt thự đầy đủ nội thất có hồ bơi cho thuê tại khu vực Đà Nẵng',
};


const KO: Overview = {
  h2: '다낭에서 집 구하기: 도시, 해변, 그리고 부동산 시장',
  paras: [
    '다낭은 베트남 중부 해안에 자리한 중형 도시로, 한강을 감싸 안고 긴 해변을 등지고 있습니다. 지난 10년 사이 조용한 항구 도시에서 베트남에서 가장 살기 좋은 도시 중 하나로 성장했습니다 — 깨끗하고, 이동이 편하며, 어디서든 바다까지 몇 분이면 닿습니다. 이곳에서 집을 구하는 사람에게 매력은 바로 그 조합입니다. 오전에는 하이쩌우의 카페에서 일하고, 오후에는 미케 해변에서 수영할 수 있으니까요.',
    '다낭은 지역마다 성격이 뚜렷합니다. 하이쩌우 일대는 사무실과 시장, 식당이 밀집한 도시의 상업 중심지입니다. 강을 건너 썬짜와 미안으로 가면 해변 지역이 나오는데, 모래사장까지 금방이고 안트엉 주변에 카페가 모여 있어 새로 온 사람들이 가장 많이 자리 잡는 곳입니다. 더 남쪽으로는 오행산 아래 해안을 따라 응우한선 지역이 이어지고, 호아쑤언처럼 조용하고 녹지가 많은 내륙 지역은 더 넓은 공간을 제공합니다. 해안을 따라 30분 내려가면 호이안이 도시의 분주함 대신 등불이 밝히는 옛 거리의 정취를 내어줍니다.',
    '다낭 부동산 시장에는 어떤 세입자에게도 맞는 집이 있습니다. 해변과 강변의 고층 건물에는 현대식 아파트가 들어차 있고 — 수영장, 헬스장, 24시간 보안을 갖춘 건물도 많습니다 — 조금 안쪽 주택가에는 단독주택과 수영장 딸린 빌라가 자리합니다. 대부분 풀옵션으로 임대되어 마감과 가전이 갖춰져 있으니, 여행 가방 하나만 들고 입주할 수 있습니다. 호찌민시나 하노이의 부동산과 비교하면, 같은 예산으로 훨씬 넓은 공간과 훨씬 가까운 바다를 누릴 수 있습니다.',
    '이곳의 임대차 계약은 의외로 단순합니다. 임대 기간은 몇 달부터 1년까지 유연하고, 대부분의 집주인은 1~2개월치 보증금과 첫 기간 임대료를 선불로 요구합니다. 장기 계약에는 보통 더 나은 조건이 따라오며, 거주지 임시 등록은 집주인이 관할 공안에 처리해 줍니다 — 이 도시의 모든 외국인 세입자가 거치는 일상적인 절차입니다.',
    '새로 온 사람들이 가장 놀라는 것은 가격 대비 가치입니다. 다낭은 이 지역에서 여전히 물가가 합리적인 해안 도시 중 하나입니다. 해변 근처의 편안한 집이 서구 도시의 비슷한 집에 비해 훨씬 저렴하고, 식비와 교통비, 커피 같은 일상 지출도 부담이 적습니다. 이런 낮은 생활비에 빠른 인터넷과 크고 우호적인 커뮤니티가 더해져, 원격 근무자들이 처음 계획보다 훨씬 오래 머무르게 되는 이유가 됩니다.',
    '바다가 보이는 고층 아파트든, 정원이 있는 가족용 빌라든, 해변 근처의 단출한 거처든 — 이 페이지의 매물은 현지 중개인으로부터 매일 갱신되므로, 다낭과 호이안 전역에서 실제로 나와 있는 집만 보시게 됩니다. 위에서 지역, 가격, 주택 유형으로 필터링하시고, 마음에 드는 매물이 있으면 편하게 문의해 주세요.',
  ],
  alt1: '베트남 다낭 응우한선 지역의 해변가 아파트와 도시 스카이라인',
  alt2: '다낭 지역에서 임대 중인 개인 수영장 딸린 풀옵션 빌라',
};

const RU: Overview = {
  h2: 'Аренда жилья в Дананге: город, пляжи и рынок недвижимости',
  paras: [
    'Дананг расположен на центральном побережье Вьетнама — средних размеров город, обнимающий реку Хан и опирающийся на длинную полосу пляжа. За последнее десятилетие он вырос из тихого порта в один из самых удобных для жизни городов страны: чистый, понятный, и от моря вас всегда отделяют считаные минуты. Для тех, кто снимает здесь жильё, именно это сочетание настоящего города и открытого пляжа и составляет главную привлекательность: утром можно работать из кафе в районе Хайчау, а днём плавать на пляже Ми Кхе.',
    'У каждой части Дананга свой характер. Район Хайчау — коммерческое сердце города, плотно застроенное офисами, рынками и ресторанами. Перебравшись через реку в Шончу и Ми Ан, вы попадаете в пляжный район, где селится большинство новоприбывших: до песка рукой подать, а вокруг Ан Тхыонг сосредоточены кафе. Южнее вдоль побережья под Мраморными горами тянется район Нгуханьшон, а более тихие и зелёные места вроде Хоасуана дают больше простора вглубь материка. В тридцати минутах по побережью Хойан меняет городскую суету на очарование старого города с фонарями.',
    'На рынке недвижимости Дананга найдётся жильё для любого арендатора. Современные квартиры заполняют башни вдоль пляжа и реки — во многих домах есть бассейн, спортзал и круглосуточная охрана, — а дома и виллы с бассейном стоят на жилых улицах чуть в стороне от берега. Большинство сдаётся с мебелью, полностью готовым к заселению: приехать можно с одним чемоданом. По сравнению с недвижимостью в Хошимине или Ханое Дананг даёт заметно больше пространства и больше моря за те же деньги.',
    'Договоры аренды здесь приятно простые. Срок гибкий — от нескольких месяцев до целого года, и большинство хозяев просят депозит в размере одной-двух месячных плат плюс оплату за первый период вперёд. Более длительные обязательства обычно вознаграждаются лучшей ценой, а регистрацию временного проживания в местной полиции оформляет хозяин — рутинный шаг для каждого иностранного арендатора в городе.',
    'Что удивляет большинство приезжающих — это соотношение цены и качества. Дананг остаётся одним из самых доступных прибрежных городов региона: комфортное жильё рядом с морем стоит долю того, что просят за похожее место в большинстве западных городов, а повседневная жизнь — еда, транспорт, кофе — обходится недорого. Именно низкая стоимость жизни вместе с быстрым интернетом и большим дружелюбным сообществом объясняет, почему столько удалённых сотрудников остаются здесь гораздо дольше, чем планировали.',
    'Что бы вы ни искали — квартиру на высоком этаже с видом на море, семейную виллу с садом или просто базу рядом с пляжем — объявления на этой странице обновляются ежедневно от местных агентов, так что вы всегда видите то, что действительно доступно в Дананге и Хойане. Отфильтруйте по району, цене и типу жилья выше и напишите нам о любом объекте, который вам приглянулся.',
  ],
  alt1: 'Квартиры у моря и городской горизонт в районе Нгуханьшон, Дананг, Вьетнам',
  alt2: 'Вилла с мебелью и собственным бассейном в аренду в районе Дананга',
};

export default function RentalOverview() {
  const { lang } = useLanguage();
  const o = forLang({ en: EN, vi: VI, ko: KO, ru: RU }, lang);
  const col = 'text-[15px] text-slate-600 leading-7 space-y-4 max-w-3xl mx-auto';
  const imgCls = 'my-8 w-full max-w-3xl mx-auto rounded-xl object-cover aspect-[16/9] shadow-sm border border-slate-200';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-5 max-w-3xl mx-auto">{o.h2}</h2>
        <div className={col}>
          <p>{o.paras[0]}</p>
          <p>{o.paras[1]}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG1} alt={o.alt1} loading="lazy" className={imgCls} />
        <div className={col}>
          <p>{o.paras[2]}</p>
          <p>{o.paras[3]}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG2} alt={o.alt2} loading="lazy" className={imgCls} />
        <div className={col}>
          <p>{o.paras[4]}</p>
          <p>{o.paras[5]}</p>
        </div>
      </div>
    </section>
  );
}
