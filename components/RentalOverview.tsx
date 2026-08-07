'use client';

import { useLanguage } from './LanguageProvider';
import { DISTRICT_HERO } from '@/lib/pageImages';

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

export default function RentalOverview() {
  const { lang } = useLanguage();
  const o = lang === 'vi' ? VI : EN;
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
