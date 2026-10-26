// The buyer's guide + building list on the Foreign-Buyer-Eligible page (/for-sale/foreign-buyer-eligible).
// Facts come from the Da Nang Department of Construction lists (see lib/foreignEligibleBuildings.ts),
// checked 2026-10-25. Translated for en/vi/ko/ru; Vietnamese follows the vietnamese-landing-copy skill (quý khách register).
import Link from 'next/link';
import type { Lang } from '@/lib/translations';
import type { Listing } from '@/lib/types';
import { FOREIGN_APPROVED_BUILDINGS, FOREIGN_NOT_APPROVED } from '@/lib/foreignEligibleBuildings';

const T = {
  en: {
    h2: 'Buying property in Da Nang as a foreigner',
    intro: 'Foreigners can own homes in Da Nang, but only in projects the city has opened to foreign buyers, and only up to a quota in each one. Here are the rules, how a purchase works, and every project the Da Nang Department of Construction has approved.',
    rulesH: 'The rules in brief',
    rules: [
      ['Who can buy', 'Foreign individuals allowed to enter Vietnam (a passport with a valid entry stamp; people with diplomatic immunity are excluded), and foreign organizations operating in Vietnam.'],
      ['What you can own', 'Apartments, and individual houses or villas, in commercial housing projects the city has opened to foreign ownership. Not land, and nothing in national defense or security zones.'],
      ['How much', 'Foreigners together may own at most 30% of the apartments in one building. For houses and villas: at most 10% of the houses in a project, and never more than 250 in one ward.'],
      ['For how long', 'You receive an ownership certificate (the “pink book”) valid for up to 50 years from issue, extendable once. Vietnamese owners hold the same homes long term.'],
      ['Renting out and selling', 'You may rent the home out, sell it, give it away or leave it to heirs. A Vietnamese buyer of your unit gets long-term ownership; a foreign buyer takes over the rest of your term.'],
    ],
    stepsH: 'How a purchase works',
    steps: [
      'Check that the project is on the city’s list below, and ask the agent to confirm with the building’s management that foreign quota is still available.',
      'Sign a deposit agreement, then a Sale and Purchase Agreement (SPA): with the developer for a new unit, or a notarized contract with the owner for a resale.',
      'Pay in Vietnamese dong through a bank account in Vietnam, and keep the transfer records. You will need them to send sale proceeds abroad later.',
      'The developer or the seller files for the pink book in your name at the Da Nang land registration office.',
    ],
    costs: 'Typical costs: 10% VAT on new units (usually included in the price), a 2% maintenance fund on new units, a 0.5% registration fee, and 2% personal income tax on a resale (usually paid by the seller). Have a lawyer review the contract before you pay a deposit.',
    approvedH: 'Projects approved for foreign ownership/long-term lease',
    approvedNote: 'Ownership approvals were published by the Da Nang Department of Construction in seven batches, 2019 to 2026. “Long-term lease” projects sit on commercial land and sell to foreigners by lease; “Per developer” means the developer offers units to foreigners but we have not found it in the city’s batches yet. Districts use the pre-2025 names most people still use.',
    leaseLabel: 'Long-term lease',
    developerLabel: 'Per developer',
    cols: ['Project', 'District', 'Status', 'Foreign quota', 'For sale now'],
    official: 'official name',
    see: 'See',
    unlistedH: 'Marketed to foreign buyers, but not on the city’s lists',
    unlistedNote: 'Agents advertise these projects to foreigners, but they do not appear on any list the Department of Construction has published. Ask the developer for the project’s foreign-ownership approval before you pay a deposit.',
    notH: 'Not open to foreign ownership',
    leaseH: 'How a long-term lease differs',
    lease: 'Projects marked “Long-term lease” in the table sit on commercial or tourism land, so they are not housing and never appear on the city’s housing lists. Foreigners can still buy here, on a long-term lease or condotel contract (usually up to 50 years) instead of a pink book. Your rights come from the contract, so have a lawyer read it.',
    source: 'Sources: Da Nang Department of Construction announcements, batches 1 to 7 (2019 to 2026); Housing Law 2023. Last checked October 25, 2026. This is general information, not legal advice.',
  },
  vi: {
    h2: 'Người nước ngoài mua nhà tại Đà Nẵng',
    intro: 'Người nước ngoài được sở hữu nhà ở tại Đà Nẵng, nhưng chỉ ở những dự án thành phố đã cho phép và trong hạn mức quy định của từng dự án. Dưới đây là các quy định chính, trình tự mua nhà và toàn bộ dự án đã được Sở Xây dựng Đà Nẵng công bố.',
    rulesH: 'Quy định chính',
    rules: [
      ['Ai được mua', 'Cá nhân nước ngoài được phép nhập cảnh vào Việt Nam (hộ chiếu còn giá trị, có dấu nhập cảnh; không áp dụng với người được hưởng quyền ưu đãi, miễn trừ ngoại giao) và tổ chức nước ngoài đang hoạt động tại Việt Nam.'],
      ['Được sở hữu gì', 'Căn hộ chung cư, nhà ở riêng lẻ và biệt thự trong dự án nhà ở thương mại đã được phép bán cho người nước ngoài. Không được sở hữu đất và không áp dụng tại khu vực bảo đảm quốc phòng, an ninh.'],
      ['Hạn mức', 'Người nước ngoài được sở hữu tối đa 30% tổng số căn hộ của một tòa nhà. Với nhà ở riêng lẻ, biệt thự: tối đa 10% số căn của một dự án và không quá 250 căn trên địa bàn một phường.'],
      ['Thời hạn sở hữu', 'Giấy chứng nhận (sổ hồng) có thời hạn tối đa 50 năm kể từ ngày cấp và được gia hạn một lần. Chủ sở hữu là người Việt Nam được sở hữu lâu dài.'],
      ['Cho thuê, chuyển nhượng', 'Quý khách được cho thuê, bán, tặng cho hoặc để thừa kế căn nhà. Nếu bán cho người Việt Nam, người mua được sở hữu lâu dài; nếu bán cho người nước ngoài, người mua chỉ được sở hữu trong thời hạn còn lại.'],
    ],
    stepsH: 'Trình tự mua nhà',
    steps: [
      'Kiểm tra dự án có trong danh sách của thành phố ở bên dưới, đồng thời nhờ môi giới xác nhận với ban quản lý tòa nhà rằng dự án vẫn còn hạn mức cho người nước ngoài.',
      'Ký thỏa thuận đặt cọc, sau đó ký hợp đồng mua bán: với chủ đầu tư nếu mua căn mới, hoặc ký hợp đồng công chứng với chủ nhà nếu mua lại căn đã qua sử dụng.',
      'Thanh toán bằng đồng Việt Nam qua tài khoản ngân hàng tại Việt Nam và giữ lại chứng từ chuyển khoản. Quý khách sẽ cần các chứng từ này khi chuyển tiền bán nhà ra nước ngoài.',
      'Chủ đầu tư hoặc bên bán nộp hồ sơ đề nghị cấp sổ hồng đứng tên quý khách tại Văn phòng đăng ký đất đai Đà Nẵng.',
    ],
    costs: 'Các khoản chi phí thường gặp: thuế VAT 10% với căn mới (thường đã nằm trong giá bán), kinh phí bảo trì 2% với căn mới, lệ phí trước bạ 0,5%, và thuế thu nhập cá nhân 2% khi chuyển nhượng lại (thường do bên bán nộp). Quý khách nên nhờ luật sư xem hợp đồng trước khi đặt cọc.',
    approvedH: 'Dự án cho phép người nước ngoài sở hữu/thuê dài hạn',
    approvedNote: 'Danh mục dự án được phép bán cho người nước ngoài do Sở Xây dựng Đà Nẵng công bố qua bảy đợt, từ năm 2019 đến năm 2026. Dự án “Thuê dài hạn” nằm trên đất thương mại, bán cho người nước ngoài theo hình thức cho thuê; “Theo chủ đầu tư” là dự án mà chủ đầu tư cho biết có bán cho người nước ngoài nhưng chúng tôi chưa thấy trong các đợt công bố của thành phố. Tên quận theo địa giới hành chính trước năm 2025, cách gọi người dân vẫn quen dùng.',
    leaseLabel: 'Thuê dài hạn',
    developerLabel: 'Theo chủ đầu tư',
    cols: ['Dự án', 'Quận', 'Tình trạng', 'Hạn mức cho người nước ngoài', 'Đang rao bán'],
    official: 'tên pháp lý',
    see: 'Xem',
    unlistedH: 'Được rao bán cho người nước ngoài nhưng chưa có trong danh sách của thành phố',
    unlistedNote: 'Các dự án này được môi giới giới thiệu cho khách nước ngoài, nhưng không có trong bất kỳ danh sách nào Sở Xây dựng đã công bố. Quý khách nên yêu cầu chủ đầu tư cung cấp văn bản chấp thuận cho người nước ngoài sở hữu trước khi đặt cọc.',
    notH: 'Không cho người nước ngoài sở hữu',
    leaseH: 'Thuê dài hạn khác sở hữu sổ hồng như thế nào?',
    lease: 'Các dự án ghi “Thuê dài hạn” trong bảng nằm trên đất thương mại, dịch vụ hoặc đất du lịch, nên không phải nhà ở và không có trong danh sách nhà ở của thành phố. Người nước ngoài vẫn mua được theo hợp đồng thuê dài hạn hoặc hợp đồng condotel (thường tối đa 50 năm) thay vì được cấp sổ hồng. Quyền lợi của quý khách phụ thuộc vào nội dung hợp đồng, vì vậy hãy nhờ luật sư đọc kỹ trước khi ký.',
    source: 'Nguồn: các đợt công bố của Sở Xây dựng Đà Nẵng, đợt 1 đến đợt 7 (2019 đến 2026); Luật Nhà ở 2023. Cập nhật ngày 25/10/2026. Nội dung chỉ mang tính tham khảo, không phải tư vấn pháp lý.',
  },
  ko: {
    h2: '외국인의 다낭 부동산 구입 안내',
    intro: '외국인도 다낭에서 주택을 소유할 수 있지만, 다낭시가 외국인에게 개방한 프로젝트에 한해, 프로젝트별 쿼터 범위 안에서만 가능합니다. 소유 규정, 구입 절차, 그리고 다낭시 건설국이 승인한 모든 프로젝트를 정리했습니다.',
    rulesH: '핵심 규정',
    rules: [
      ['구입 가능 대상', '베트남 입국이 허용된 외국인 개인(유효한 입국 스탬프가 있는 여권 소지자이며, 외교 특권·면제 대상자는 제외)과 베트남에서 활동하는 외국 법인입니다.'],
      ['소유 가능 대상', '외국인 소유가 허용된 상업용 주택 프로젝트의 아파트와 단독주택·빌라입니다. 토지와 국방·안보 구역의 주택은 소유할 수 없습니다.'],
      ['소유 한도', '한 건물에서 외국인이 소유할 수 있는 아파트는 전체의 30%까지입니다. 단독주택·빌라는 한 프로젝트 전체의 10%까지이며, 한 개 동(phường)당 250채를 넘을 수 없습니다.'],
      ['소유 기간', '발급일로부터 최대 50년간 유효한 소유권 증서(“핑크북”)를 받으며, 1회 연장할 수 있습니다. 베트남 국민은 같은 주택을 영구적으로 소유합니다.'],
      ['임대 및 매도', '주택을 임대하거나 매도, 증여, 상속할 수 있습니다. 베트남 국민이 매수하면 영구 소유권을 갖고, 외국인이 매수하면 남은 기간만큼 소유합니다.'],
    ],
    stepsH: '구입 절차',
    steps: [
      '아래 다낭시 목록에 해당 프로젝트가 있는지 확인하고, 중개인을 통해 건물 관리사무소에 외국인 쿼터가 남아 있는지 확인하세요.',
      '계약금 계약을 맺은 뒤 매매계약(SPA)을 체결합니다. 신축은 시행사와, 재판매는 소유주와 공증 계약을 맺습니다.',
      '베트남 은행 계좌를 통해 베트남 동(VND)으로 결제하고 송금 내역을 보관하세요. 나중에 매각 대금을 해외로 송금할 때 필요합니다.',
      '시행사 또는 매도인이 다낭시 토지등록사무소에 귀하 명의의 핑크북 발급을 신청합니다.',
    ],
    costs: '일반적인 비용: 신축 10% 부가가치세(보통 분양가에 포함), 신축 2% 관리 유지비 기금, 0.5% 등록비, 재판매 시 2% 개인소득세(보통 매도인 부담). 계약금을 내기 전에 변호사에게 계약서를 검토받으시길 권장합니다.',
    approvedH: '외국인 소유·장기 임대 승인 프로젝트',
    approvedNote: '소유 승인 프로젝트는 다낭시 건설국이 2019년부터 2026년까지 7차에 걸쳐 발표했습니다. “장기 임대” 프로젝트는 상업용 부지에 있으며 외국인에게 임대 방식으로 판매됩니다. “시행사 발표”는 시행사가 외국인 분양을 안내하지만 아직 다낭시 발표 목록에서 확인하지 못한 경우입니다. 구 이름은 2025년 이전의 행정구역 명칭이며 현지에서 여전히 널리 쓰입니다.',
    leaseLabel: '장기 임대',
    developerLabel: '시행사 발표',
    cols: ['프로젝트', '구', '상태', '외국인 쿼터', '현재 매물'],
    official: '공식 명칭',
    see: '보기',
    unlistedH: '외국인에게 홍보되지만 다낭시 목록에는 없는 프로젝트',
    unlistedNote: '중개인들이 외국인에게 소개하지만 건설국이 발표한 어떤 목록에도 나타나지 않는 프로젝트입니다. 계약금을 내기 전에 시행사에 외국인 소유 승인 서류를 요청하세요.',
    notH: '외국인 소유 불가 프로젝트',
    leaseH: '장기 임대는 무엇이 다른가요?',
    lease: '표에서 “장기 임대”로 표시된 프로젝트는 상업·관광 용지에 있어 주택이 아니므로 다낭시 주택 목록에 나타나지 않습니다. 외국인은 핑크북 대신 장기 임대 또는 콘도텔 계약(보통 최대 50년)으로 구입할 수 있습니다. 권리는 계약 내용에 따라 달라지므로 서명 전에 변호사에게 꼭 검토받으세요.',
    source: '출처: 다낭시 건설국 발표 1~7차(2019~2026년), 2023년 주택법. 최종 확인일 2026년 10월 25일. 일반 정보이며 법률 자문이 아닙니다.',
  },
  ru: {
    h2: 'Покупка недвижимости в Дананге иностранцем',
    intro: 'Иностранцы могут владеть жильём в Дананге, но только в проектах, открытых городом для иностранных покупателей, и только в пределах квоты каждого проекта. Ниже: правила, порядок покупки и все проекты, одобренные Департаментом строительства Дананга.',
    rulesH: 'Правила вкратце',
    rules: [
      ['Кто может купить', 'Иностранные физические лица, которым разрешён въезд во Вьетнам (паспорт с действующей отметкой о въезде; лица с дипломатическим иммунитетом исключаются), и иностранные организации, работающие во Вьетнаме.'],
      ['Что можно приобрести', 'Квартиры, а также отдельные дома и виллы в коммерческих жилых проектах, открытых для иностранной собственности. Земля и объекты в зонах обороны и безопасности недоступны.'],
      ['Квота', 'Иностранцы в сумме могут владеть не более чем 30% квартир в одном здании. Для домов и вилл: не более 10% домов в проекте и не более 250 в одном районе-фыонге.'],
      ['Срок владения', 'Вы получаете свидетельство о праве собственности («розовая книга») сроком до 50 лет с даты выдачи, с однократным продлением. Граждане Вьетнама владеют таким жильём бессрочно.'],
      ['Аренда и продажа', 'Вы можете сдавать жильё в аренду, продавать, дарить или оставить в наследство. Вьетнамский покупатель получает бессрочное право собственности, иностранный — на оставшийся срок.'],
    ],
    stepsH: 'Как проходит покупка',
    steps: [
      'Проверьте, что проект есть в списке города ниже, и попросите агента уточнить у управляющей компании здания, осталась ли квота для иностранцев.',
      'Подпишите соглашение о задатке, затем договор купли-продажи (SPA): с застройщиком для новой квартиры или нотариально заверенный договор с владельцем при перепродаже.',
      'Платите во вьетнамских донгах через банковский счёт во Вьетнаме и сохраняйте подтверждения переводов. Они понадобятся, чтобы позже вывести деньги от продажи за границу.',
      'Застройщик или продавец подаёт заявление на выдачу «розовой книги» на ваше имя в Управление регистрации земли Дананга.',
    ],
    costs: 'Типичные расходы: НДС 10% на новые квартиры (обычно уже включён в цену), 2% в фонд содержания дома на новые квартиры, регистрационный сбор 0,5% и подоходный налог 2% при перепродаже (обычно платит продавец). Перед внесением задатка покажите договор юристу.',
    approvedH: 'Проекты, одобренные для иностранной собственности и долгосрочной аренды',
    approvedNote: 'Одобрения собственности публиковал Департамент строительства Дананга семью партиями с 2019 по 2026 год. Проекты «Долгосрочная аренда» стоят на коммерческой земле и продаются иностранцам в форме аренды; «По данным застройщика» означает, что застройщик предлагает квартиры иностранцам, но в списках города мы проект пока не нашли. Названия районов — прежние, до 2025 года, которыми до сих пор пользуется большинство.',
    leaseLabel: 'Долгосрочная аренда',
    developerLabel: 'По данным застройщика',
    cols: ['Проект', 'Район', 'Статус', 'Квота для иностранцев', 'В продаже сейчас'],
    official: 'официальное название',
    see: 'Смотреть',
    unlistedH: 'Предлагаются иностранцам, но отсутствуют в списках города',
    unlistedNote: 'Агенты предлагают эти проекты иностранцам, но их нет ни в одном списке, опубликованном Департаментом строительства. Перед внесением задатка запросите у застройщика документ об одобрении иностранной собственности.',
    notH: 'Закрыты для иностранной собственности',
    leaseH: 'Чем отличается долгосрочная аренда',
    lease: 'Проекты с пометкой «Долгосрочная аренда» расположены на коммерческой или туристической земле, поэтому это не жильё и их нет в жилых списках города. Иностранцы всё же могут купить здесь по договору долгосрочной аренды или кондотеля (обычно до 50 лет) вместо «розовой книги». Ваши права определяет договор, поэтому обязательно покажите его юристу.',
    source: 'Источники: объявления Департамента строительства Дананга, партии 1–7 (2019–2026); Закон о жилье 2023 года. Проверено 25 октября 2026 года. Это общая информация, а не юридическая консультация.',
  },
};


// Table cells that come from lib/foreignEligibleBuildings.ts in English. Project names stay in Latin script
// (as on the other ko/ru pages); districts, batches, quotas and source lines are localized here.
const DISTRICT: Record<string, Record<string, string>> = {
  vi: { 'Hai Chau': 'Hải Châu', 'Son Tra': 'Sơn Trà', 'Ngu Hanh Son': 'Ngũ Hành Sơn', 'Thanh Khe': 'Thanh Khê', 'Cam Le (Hoa Xuan)': 'Cẩm Lệ (Hòa Xuân)' },
  ko: { 'Hai Chau': '하이쩌우', 'Son Tra': '선짜', 'Ngu Hanh Son': '응우한선', 'Thanh Khe': '타인케', 'Cam Le (Hoa Xuan)': '깜레(호아쑤언)' },
  ru: {},
};
const MONTH: Record<string, Record<string, string>> = {
  vi: { Nov: '11', Feb: '2' },
  ko: { Nov: '11월', Feb: '2월' },
  ru: { Nov: 'ноя', Feb: 'фев' },
};
const OFFICIAL: Record<string, Record<string, string>> = {
  vi: {
    'Apartment buildings on lots B4-1 & B4-2, Han River tourism zone': 'Chung cư lô B4-1 và B4-2, khu du lịch sông Hàn',
    'New Town commercial & sports urban area': 'Khu đô thị thương mại và thể thao New Town',
    'Tuyên Sơn high-rise apartments (formerly The Estuary)': 'Chung cư cao tầng Tuyên Sơn (trước đây là The Estuary)',
  },
  ko: {
    'Apartment buildings on lots B4-1 & B4-2, Han River tourism zone': '한강 관광구역 B4-1·B4-2 부지 아파트 단지',
    'New Town commercial & sports urban area': '뉴타운 상업·스포츠 도시구역',
    'Tuyên Sơn high-rise apartments (formerly The Estuary)': '뚜옌선 고층 아파트(구 The Estuary)',
  },
  ru: {
    'Apartment buildings on lots B4-1 & B4-2, Han River tourism zone': 'Жилые дома на участках B4-1 и B4-2, туристическая зона реки Хан',
    'New Town commercial & sports urban area': 'Коммерческо-спортивный городской район New Town',
    'Tuyên Sơn high-rise apartments (formerly The Estuary)': 'Высотные апартаменты Tuyên Sơn (ранее The Estuary)',
  },
};
const SOURCE: Record<string, Record<string, string>> = {
  ko: { 'Department of Construction, 2021': '건설국, 2021년', 'Confirmed by DanangMLS, 2026': 'DanangMLS 확인, 2026년' },
  ru: { 'Department of Construction, 2021': 'Департамент строительства, 2021', 'Confirmed by DanangMLS, 2026': 'подтверждено DanangMLS, 2026' },
};
function localBatch(batch: string, lang: Lang): string {
  const m = batch.match(/^Batch (\d) \((?:(\w+) )?(\d{4})\)$/);
  if (!m || lang === 'en') return batch;
  const [, n, mon, yr] = m;
  const mo = mon ? MONTH[lang][mon] : '';
  if (lang === 'vi') return `Đợt ${n} (${mo ? mo + '/' : ''}${yr})`;
  if (lang === 'ko') return `${n}차 (${yr}년${mo ? ' ' + mo : ''})`;
  return `Партия ${n} (${mo ? mo + ' ' : ''}${yr})`;
}
function localUnits(u: string, lang: Lang): string {
  if (lang === 'en') return u;
  const r = {
    vi: [/ of /, ' / ', /,/g, '.', ' apartments + ', ' căn hộ + ', ' villas', ' biệt thự'],
    ko: [/ of /, ' / ', /,/g, ',', ' apartments + ', '개 아파트 + ', ' villas', '개 빌라'],
    ru: [/ of /, ' из ', /,/g, ' ', ' apartments + ', ' квартир + ', ' villas', ' вилл'],
  }[lang] as [RegExp, string, RegExp, string, string, string, string, string];
  return u.replace(r[0], r[1]).replace(r[2], r[3]).replace(r[4], r[5]).replace(r[6], r[7]);
}

export default function ForeignBuyerGuide({ lang, forSale }: { lang: Lang; forSale: Listing[] }) {
  const t = T[lang];
  const base = lang === 'vi' ? '/vi/mua-ban' : lang === 'en' ? '/for-sale' : `/${lang}/for-sale`;
  const count = (p: RegExp) => forSale.filter(l => p.test(`${l.title} ${l.text}`)).length;
  // One alphabetical table: city-approved, long-term-lease, and the developer-stated ones Blake added.
  const approved = FOREIGN_APPROVED_BUILDINGS.filter(b => b.status !== 'unlisted' || b.inTable)
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  const status = (b: (typeof FOREIGN_APPROVED_BUILDINGS)[number]) =>
    b.status === 'approved' ? localBatch(b.batch || '', lang) : b.status === 'lease' ? t.leaseLabel : t.developerLabel;
  const unlisted = FOREIGN_APPROVED_BUILDINGS.filter(b => b.status === 'unlisted' && !b.inTable);
  const seeLink = (b: (typeof FOREIGN_APPROVED_BUILDINGS)[number]) => {
    const n = count(b.pattern);
    return n > 0 ? <> · <Link href={`${base}?q=${encodeURIComponent(b.search || b.name)}`} className="font-medium text-blue-700 hover:underline">{t.see} {n} →</Link></> : null;
  };
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="max-w-4xl flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-slate-900">{t.h2}</h2>
          <p className="text-[15px] leading-relaxed text-slate-700">{t.intro}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">{t.rulesH}</h3>
          <dl className="flex flex-col gap-3 text-[15px]">
            {t.rules.map(([k, v]) => (
              <div key={k} className="sm:grid sm:grid-cols-[11rem_1fr] sm:gap-4">
                <dt className="font-semibold text-slate-900">{k}</dt>
                <dd className="text-slate-700 leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">{t.stepsH}</h3>
          <ol className="list-decimal pl-5 flex flex-col gap-2 text-[15px] text-slate-700 leading-relaxed">
            {t.steps.map(s => <li key={s}>{s}</li>)}
          </ol>
          <p className="mt-4 text-sm text-slate-600 leading-relaxed">{t.costs}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{t.approvedH}</h3>
          <p className="text-sm text-slate-600 mb-3">{t.approvedNote}</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  {t.cols.map(c => <th key={c} className="px-2 py-2.5 font-semibold whitespace-nowrap">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {approved.map(b => {
                  const n = count(b.pattern);
                  return (
                    <tr key={b.name} className="border-b border-slate-100 last:border-0 align-top">
                      <td className="px-2 py-2.5">
                        <span className="font-semibold text-slate-900">{b.name}</span>
                        {b.officialName && <span className="block text-xs text-slate-500">{t.official}: {OFFICIAL[lang]?.[b.officialName] ?? b.officialName}</span>}
                      </td>
                      <td className="px-2 py-2.5 whitespace-nowrap">{b.district && (DISTRICT[lang]?.[b.district] ?? b.district)}</td>
                      <td className="px-2 py-2.5 whitespace-nowrap">{status(b)}</td>
                      <td className="px-2 py-2.5">{(b.foreignUnits && localUnits(b.foreignUnits, lang)) || (b.status === 'lease' ? '—' : '30%')}</td>
                      <td className="px-2 py-2.5 whitespace-nowrap">
                        {n > 0 ? <Link href={`${base}?q=${encodeURIComponent(b.search || b.name)}`} className="font-medium text-blue-700 hover:underline">{t.see} {n} →</Link> : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-semibold text-slate-900 mb-1.5">{t.unlistedH}</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">{t.unlistedNote}</p>
            <ul className="text-sm text-slate-700 flex flex-col gap-1.5">
              {unlisted.map(b => (
                <li key={b.name}><span className="font-medium text-slate-900">{b.name}</span>{lang === 'en' && b.note && <span className="text-slate-600">: {b.note}</span>}{seeLink(b)}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900 mb-1.5">{t.notH}</h3>
            <ul className="text-sm text-slate-700 flex flex-col gap-1">
              {FOREIGN_NOT_APPROVED.map(b => <li key={b.name}>{b.name} <span className="text-slate-500">({lang === 'vi' ? b.sourceVi : SOURCE[lang]?.[b.source] ?? b.source})</span></li>)}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-1.5">{t.leaseH}</h3>
          <p className="text-[15px] text-slate-700 leading-relaxed">{t.lease}</p>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">{t.source}</p>
      </div>
    </section>
  );
}
