'use client';

import { useLanguage } from './LanguageProvider';

// Designed long-form "renting in Da Nang" guide for the bottom of /for-rent.
// Built to be scannable and attractive (cards, price table, steps, checklists),
// not a wall of text — while adding real, useful content + a table for SEO.

interface Guide {
  heading: string; intro: string;
  hoodsTitle: string; hoods: { icon: string; name: string; best: string; price: string }[];
  priceTitle: string; priceHead: [string, string]; priceRows: [string, string][]; priceNote: string;
  stepsTitle: string; steps: { t: string; d: string }[];
  includedTitle: string; included: string[];
  checkTitle: string; checks: string[];
  tip: string;
}

const EN: Guide = {
  heading: 'Your Guide to Renting a House in Da Nang',
  intro: 'New to the city? Here’s how the Da Nang rental market works — where to live, what you’ll pay, and how it goes from browsing to moving in.',
  hoodsTitle: 'Where to live',
  hoods: [
    { icon: '🏙️', name: 'Hai Chau', best: 'Walkable city centre — cafés, restaurants, offices', price: 'Mid-range' },
    { icon: '🏖️', name: 'Son Tra', best: 'Beachside living around My Khe & An Thuong', price: 'Mid–high' },
    { icon: '⛰️', name: 'Ngu Hanh Son', best: 'Modern beachfront condos by the Marble Mountains', price: 'Mid–high' },
    { icon: '🏡', name: 'Thanh Khe', best: 'Local feel and good value for families', price: 'Budget–mid' },
    { icon: '🌿', name: 'Cam Le / Hoa Xuan', best: 'New suburban houses with room to spread out', price: 'Value' },
    { icon: '🏮', name: 'Hoi An', best: 'Garden houses and old-town charm, 30 min south', price: 'Varies' },
  ],
  priceTitle: 'Typical monthly rent',
  priceHead: ['Home type', 'Monthly rent (USD)'],
  priceRows: [
    ['Furnished studio', '$250 – $450'],
    ['1-bedroom apartment', '$350 – $600'],
    ['2–3 bedroom house', '$500 – $1,200'],
    ['Beachfront apartment', '$700 – $1,500'],
    ['Pool villa', '$1,500 – $4,000+'],
  ],
  priceNote: 'Ranges shift with district, building, and season. Electricity and water are usually billed on top of the base rent.',
  stepsTitle: 'How renting works',
  steps: [
    { t: 'Browse & shortlist', d: 'Filter by district, price, and bedrooms, then save the homes you like.' },
    { t: 'View in person', d: 'We arrange viewings — you can usually see two or three homes in a day.' },
    { t: 'Agree the terms', d: 'Settle the rent, deposit (1–2 months), lease length, and what’s included.' },
    { t: 'Sign & move in', d: 'Sign the lease, pay the deposit and first month, and your host registers your stay.' },
  ],
  includedTitle: 'What’s usually included',
  included: ['Furniture — bed, sofa, wardrobe', 'Modern kitchen, fridge & washer', 'Air conditioning & hot water', 'Fast wifi (sometimes billed separately)'],
  checkTitle: 'What to check before you sign',
  checks: ['Deposit amount & refund terms', 'Who pays electricity, water & building fees', 'Minimum lease & notice period', 'Motorbike parking'],
  tip: 'Long-term leases of six to twelve months get the best monthly rate — and because most homes come furnished and move-in ready, you can often be settled within a few days.',
};

const VI: Guide = {
  heading: 'Cẩm Nang Thuê Nhà tại Đà Nẵng',
  intro: 'Mới đến thành phố? Đây là cách thị trường thuê nhà Đà Nẵng vận hành — nên ở đâu, chi phí bao nhiêu, và quy trình từ lúc tìm đến khi dọn vào.',
  hoodsTitle: 'Nên ở khu vực nào',
  hoods: [
    { icon: '🏙️', name: 'Hải Châu', best: 'Trung tâm, đi bộ tiện — quán cà phê, nhà hàng, văn phòng', price: 'Tầm trung' },
    { icon: '🏖️', name: 'Sơn Trà', best: 'Sống ven biển quanh Mỹ Khê & An Thượng', price: 'Trung–cao' },
    { icon: '⛰️', name: 'Ngũ Hành Sơn', best: 'Căn hộ ven biển hiện đại cạnh Ngũ Hành Sơn', price: 'Trung–cao' },
    { icon: '🏡', name: 'Thanh Khê', best: 'Không khí địa phương, giá tốt cho gia đình', price: 'Rẻ–trung' },
    { icon: '🌿', name: 'Cẩm Lệ / Hòa Xuân', best: 'Nhà mới ngoại ô, không gian rộng rãi', price: 'Giá tốt' },
    { icon: '🏮', name: 'Hội An', best: 'Nhà vườn và nét cổ kính, cách 30 phút', price: 'Đa dạng' },
  ],
  priceTitle: 'Giá thuê theo tháng tham khảo',
  priceHead: ['Loại nhà', 'Giá thuê/tháng (USD)'],
  priceRows: [
    ['Studio đầy đủ nội thất', '$250 – $450'],
    ['Căn hộ 1 phòng ngủ', '$350 – $600'],
    ['Nhà 2–3 phòng ngủ', '$500 – $1,200'],
    ['Căn hộ ven biển', '$700 – $1,500'],
    ['Biệt thự có hồ bơi', '$1,500 – $4,000+'],
  ],
  priceNote: 'Mức giá thay đổi theo quận, tòa nhà và mùa. Điện nước thường được tính thêm ngoài giá thuê cơ bản.',
  stepsTitle: 'Quy trình thuê nhà',
  steps: [
    { t: 'Tìm & chọn lọc', d: 'Lọc theo quận, giá và số phòng ngủ, rồi lưu những căn bạn thích.' },
    { t: 'Xem tận nơi', d: 'Chúng tôi sắp xếp lịch xem — thường xem được hai đến ba căn trong một ngày.' },
    { t: 'Thống nhất điều khoản', d: 'Chốt giá thuê, tiền cọc (1–2 tháng), thời hạn thuê và những gì đi kèm.' },
    { t: 'Ký & dọn vào', d: 'Ký hợp đồng, đặt cọc và trả tháng đầu, chủ nhà đăng ký tạm trú cho bạn.' },
  ],
  includedTitle: 'Thường bao gồm sẵn',
  included: ['Nội thất — giường, sofa, tủ quần áo', 'Bếp hiện đại, tủ lạnh & máy giặt', 'Máy lạnh & nước nóng', 'Wifi tốc độ cao (đôi khi tính riêng)'],
  checkTitle: 'Cần kiểm tra trước khi ký',
  checks: ['Số tiền cọc & điều khoản hoàn trả', 'Ai trả điện, nước & phí quản lý', 'Thời hạn thuê tối thiểu & thời gian báo trước', 'Chỗ để xe máy'],
  tip: 'Hợp đồng dài hạn sáu đến mười hai tháng có giá theo tháng tốt nhất — và vì hầu hết các căn đều đầy đủ nội thất, sẵn sàng dọn vào, bạn thường có thể ổn định chỉ trong vài ngày.',
};

const CheckIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export default function RentalGuide() {
  const { lang } = useLanguage();
  const g = lang === 'vi' ? VI : EN;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{g.heading}</h2>
        <p className="mt-2 text-slate-500 max-w-3xl">{g.intro}</p>

        {/* Neighborhoods */}
        <h3 className="mt-8 mb-3 text-xs font-semibold uppercase tracking-wide text-blue-600">{g.hoodsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {g.hoods.map(h => (
            <div key={h.name} className="rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">{h.icon}</span>
                  <span className="font-semibold text-slate-800">{h.name}</span>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">{h.price}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500 leading-snug">{h.best}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          {/* Price table */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-600">{g.priceTitle}</h3>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500">
                    <th className="text-left font-semibold px-4 py-2.5">{g.priceHead[0]}</th>
                    <th className="text-right font-semibold px-4 py-2.5">{g.priceHead[1]}</th>
                  </tr>
                </thead>
                <tbody>
                  {g.priceRows.map((r, i) => (
                    <tr key={r[0]} className={i % 2 ? 'bg-slate-50/50' : ''}>
                      <td className="px-4 py-2.5 text-slate-700 border-t border-slate-100">{r[0]}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-slate-900 border-t border-slate-100 whitespace-nowrap">{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-400">{g.priceNote}</p>
          </div>

          {/* Steps */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-600">{g.stepsTitle}</h3>
            <ol className="space-y-3">
              {g.steps.map((s, i) => (
                <li key={s.t} className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center">{i + 1}</span>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{s.t}</p>
                    <p className="text-sm text-slate-500 leading-snug">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Included / Check */}
        <div className="grid sm:grid-cols-2 gap-6 mt-10">
          <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-5">
            <h3 className="mb-3 text-sm font-semibold text-emerald-800">{g.includedTitle}</h3>
            <ul className="space-y-2">
              {g.included.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckIcon className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">{g.checkTitle}</h3>
            <ul className="space-y-2">
              {g.checks.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckIcon className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-8 flex gap-3 rounded-xl bg-blue-50 border border-blue-100 p-4">
          <span className="text-xl leading-none">💡</span>
          <p className="text-sm text-blue-900/80">{g.tip}</p>
        </div>
      </div>
    </section>
  );
}
