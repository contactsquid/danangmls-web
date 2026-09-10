'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { facetUrl } from '@/lib/facets';
import { forLang } from '@/lib/translations';

// Designed long-form "renting in Da Nang" guide for the bottom of /for-rent.
// Built to be scannable and attractive (cards, price table, steps, checklists),
// not a wall of text — while adding real, useful content + a table for SEO.

interface Guide {
  heading: string; intro: string;
  hoodsTitle: string; hoods: { icon: string; name: string; best: string; price: string; district: string }[];
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
    { icon: '🏙️', name: 'Hai Chau', best: 'Walkable city centre — cafés, restaurants, offices', price: 'Mid-range', district: 'Hai Chau' },
    { icon: '🏖️', name: 'Son Tra', best: 'Beachside living around My Khe & An Thuong', price: 'Mid–high', district: 'Son Tra' },
    { icon: '⛰️', name: 'Ngu Hanh Son', best: 'Modern beachfront condos by the Marble Mountains', price: 'Mid–high', district: 'Ngu Hanh Son' },
    { icon: '🏡', name: 'Thanh Khe', best: 'Local feel and good value for families', price: 'Budget–mid', district: 'Thanh Khe' },
    { icon: '🌿', name: 'Cam Le / Hoa Xuan', best: 'New suburban houses with room to spread out', price: 'Value', district: 'Cam Le' },
    { icon: '🏮', name: 'Hoi An', best: 'Garden houses and old-town charm, 30 min south', price: 'Varies', district: 'Hoi An' },
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
    { t: 'View in person', d: 'We arrange viewings — you can usually see three or four homes in a day.' },
    { t: 'Agree to the terms', d: 'Settle the rent, deposit (1–2 months), lease length, and what’s included.' },
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
    { icon: '🏙️', name: 'Hải Châu', best: 'Trung tâm, đi bộ tiện — quán cà phê, nhà hàng, văn phòng', price: 'Tầm trung', district: 'Hai Chau' },
    { icon: '🏖️', name: 'Sơn Trà', best: 'Sống ven biển quanh Mỹ Khê & An Thượng', price: 'Trung–cao', district: 'Son Tra' },
    { icon: '⛰️', name: 'Ngũ Hành Sơn', best: 'Căn hộ ven biển hiện đại cạnh Ngũ Hành Sơn', price: 'Trung–cao', district: 'Ngu Hanh Son' },
    { icon: '🏡', name: 'Thanh Khê', best: 'Không khí địa phương, giá tốt cho gia đình', price: 'Rẻ–trung', district: 'Thanh Khe' },
    { icon: '🌿', name: 'Cẩm Lệ / Hòa Xuân', best: 'Nhà mới ngoại ô, không gian rộng rãi', price: 'Giá tốt', district: 'Cam Le' },
    { icon: '🏮', name: 'Hội An', best: 'Nhà vườn và nét cổ kính, cách 30 phút', price: 'Đa dạng', district: 'Hoi An' },
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


const KO: Guide = {
  heading: '다낭 주택 임대 가이드',
  intro: '다낭이 처음이신가요? 다낭 임대 시장이 어떻게 돌아가는지 정리했습니다 — 어느 지역에 살지, 비용은 얼마나 드는지, 집을 보고 입주하기까지의 과정까지.',
  hoodsTitle: '어느 지역에 살까',
  hoods: [
    { icon: '🏙️', name: '하이쩌우', best: '걸어 다니기 좋은 도심 — 카페, 레스토랑, 사무실', price: '중간대', district: 'Hai Chau' },
    { icon: '🏖️', name: '썬짜', best: '미케 해변과 안트엉 일대의 해변 생활', price: '중–상', district: 'Son Tra' },
    { icon: '⛰️', name: '응우한선', best: '오행산 옆 현대식 해변 아파트', price: '중–상', district: 'Ngu Hanh Son' },
    { icon: '🏡', name: '탄케', best: '현지다운 분위기, 가족에게 좋은 가성비', price: '저–중', district: 'Thanh Khe' },
    { icon: '🌿', name: '깜레 / 호아쑤언', best: '공간이 넉넉한 신축 교외 주택', price: '가성비', district: 'Cam Le' },
    { icon: '🏮', name: '호이안', best: '정원 딸린 주택과 옛 도시의 정취, 남쪽으로 30분', price: '다양함', district: 'Hoi An' },
  ],
  priceTitle: '월세 시세',
  priceHead: ['주택 유형', '월세 (원)'],
  priceRows: [
    ['풀옵션 스튜디오', '34만 – 60만 원'],
    ['침실 1개 아파트', '47만 – 80만 원'],
    ['침실 2–3개 주택', '67만 – 161만 원'],
    ['해변가 아파트', '94만 – 201만 원'],
    ['수영장 딸린 빌라', '201만 – 536만 원 이상'],
  ],
  priceNote: '지역, 건물, 시즌에 따라 가격대가 달라집니다. 원화 금액은 대략적인 환산 기준입니다. 전기·수도 요금은 보통 기본 월세와 별도로 청구됩니다.',
  stepsTitle: '임대 절차',
  steps: [
    { t: '검색 및 후보 정리', d: '지역, 가격, 침실 수로 필터링한 뒤 마음에 드는 집을 저장하세요.' },
    { t: '직접 방문', d: '방문 일정을 잡아드립니다. 보통 하루에 서너 곳을 둘러볼 수 있습니다.' },
    { t: '조건 합의', d: '월세, 보증금(1–2개월), 임대 기간, 포함 항목을 확정합니다.' },
    { t: '계약 및 입주', d: '계약서에 서명하고 보증금과 첫 달 월세를 납부하면, 집주인이 거주 등록을 진행합니다.' },
  ],
  includedTitle: '보통 포함되는 것',
  included: ['가구 — 침대, 소파, 옷장', '현대식 주방, 냉장고 및 세탁기', '에어컨 및 온수', '빠른 와이파이 (별도 청구되는 경우도 있음)'],
  checkTitle: '계약 전 확인할 사항',
  checks: ['보증금 금액 및 반환 조건', '전기·수도·건물 관리비 부담 주체', '최소 임대 기간 및 해지 통보 기간', '오토바이 주차 공간'],
  tip: '6~12개월 장기 계약이 월 단위로는 가장 좋은 조건을 받습니다. 대부분의 집이 풀옵션으로 바로 입주할 수 있어, 며칠 안에 자리를 잡는 경우도 많습니다.',
};

const RU: Guide = {
  heading: 'Как снять жильё в Дананге',
  intro: 'Впервые в городе? Вот как устроен рынок аренды в Дананге — где жить, сколько это стоит и что происходит от просмотра объявлений до переезда.',
  hoodsTitle: 'Где жить',
  hoods: [
    { icon: '🏙️', name: 'Хайчау', best: 'Пешеходный центр — кафе, рестораны, офисы', price: 'Средние цены', district: 'Hai Chau' },
    { icon: '🏖️', name: 'Шонча', best: 'Жизнь у моря рядом с Ми Кхе и Ан Тхыонг', price: 'Средние–высокие', district: 'Son Tra' },
    { icon: '⛰️', name: 'Нгуханьшон', best: 'Современные апартаменты у Мраморных гор', price: 'Средние–высокие', district: 'Ngu Hanh Son' },
    { icon: '🏡', name: 'Тханькхе', best: 'Местный колорит и выгодные цены для семей', price: 'Бюджет–средние', district: 'Thanh Khe' },
    { icon: '🌿', name: 'Камле / Хоасуан', best: 'Новые дома в пригороде, где есть простор', price: 'Выгодно', district: 'Cam Le' },
    { icon: '🏮', name: 'Хойан', best: 'Дома с садом и атмосфера старого города, 30 минут к югу', price: 'По-разному', district: 'Hoi An' },
  ],
  priceTitle: 'Типичная аренда за месяц',
  priceHead: ['Тип жилья', 'Аренда в месяц (₽)'],
  priceRows: [
    ['Студия с мебелью', '21 000 – 38 000 ₽'],
    ['Квартира с 1 спальней', '30 000 – 51 000 ₽'],
    ['Дом с 2–3 спальнями', '43 000 – 102 000 ₽'],
    ['Квартира у моря', '60 000 – 128 000 ₽'],
    ['Вилла с бассейном', '128 000 – 340 000 ₽+'],
  ],
  priceNote: 'Цены зависят от района, дома и сезона. Суммы в рублях приведены ориентировочно. Электричество и вода обычно оплачиваются сверх базовой аренды.',
  stepsTitle: 'Как проходит аренда',
  steps: [
    { t: 'Поиск и подборка', d: 'Отфильтруйте по району, цене и числу спален, затем сохраните понравившиеся варианты.' },
    { t: 'Просмотр вживую', d: 'Мы организуем просмотры — обычно за день можно посмотреть три-четыре объекта.' },
    { t: 'Согласование условий', d: 'Договоритесь об арендной плате, депозите (1–2 месяца), сроке и о том, что входит в стоимость.' },
    { t: 'Договор и заселение', d: 'Подпишите договор, внесите депозит и оплату за первый месяц — хозяин оформит регистрацию проживания.' },
  ],
  includedTitle: 'Что обычно входит',
  included: ['Мебель — кровать, диван, шкаф', 'Современная кухня, холодильник и стиральная машина', 'Кондиционер и горячая вода', 'Быстрый интернет (иногда оплачивается отдельно)'],
  checkTitle: 'Что проверить перед подписанием',
  checks: ['Размер депозита и условия возврата', 'Кто платит за электричество, воду и обслуживание дома', 'Минимальный срок аренды и срок уведомления', 'Парковка для мотобайка'],
  tip: 'Договор на 6–12 месяцев даёт лучшую цену за месяц. А поскольку большинство квартир сдаётся с мебелью и готово к заселению, обустроиться часто удаётся за несколько дней.',
};

const CheckIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export default function RentalGuide() {
  const { lang } = useLanguage();
  const g = forLang({ en: EN, vi: VI, ko: KO, ru: RU }, lang);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{g.heading}</h2>
        <p className="mt-2 text-slate-500 max-w-3xl">{g.intro}</p>

        {/* Neighborhoods */}
        <h3 className="mt-8 mb-3 text-xs font-semibold uppercase tracking-wide text-blue-600">{g.hoodsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {g.hoods.map(h => (
            <Link key={h.name} href={facetUrl('rent', lang, { kind: 'district', value: h.district })}
              className="group block rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">{h.icon}</span>
                  <span className="font-semibold text-slate-800 group-hover:text-blue-700 group-hover:underline">{h.name}</span>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">{h.price}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500 leading-snug">{h.best}</p>
            </Link>
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
