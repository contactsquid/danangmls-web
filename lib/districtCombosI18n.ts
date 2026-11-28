// Vietnamese / Korean / Russian copy for the district x type|bedrooms landing pages
// (lib/districtCombos.ts is the English original). Templated, data-driven: counts and
// price ranges come from the listings, nothing is invented.
import type { Mode } from './facets';
import type { Lang } from './translations';
import type { Listing } from './types';
import { localizeDistrict } from './price';
import { stats, usd, SITE_BRAND, type Combo } from './districtCombos';

type L = Exclude<Lang, 'en'>;

// Plural / collective noun for each property type, lower-case, as it sits mid-sentence.
const TYPE_NOUN: Record<L, Record<string, string>> = {
  vi: { House: 'nhà phố', Apartment: 'căn hộ', Villa: 'biệt thự', Land: 'đất', Commercial: 'bất động sản thương mại' },
  ko: { House: '주택', Apartment: '아파트', Villa: '빌라', Land: '토지', Commercial: '상업용 부동산' },
  ru: { House: 'дома', Apartment: 'квартиры', Villa: 'виллы', Land: 'земельные участки', Commercial: 'коммерческая недвижимость' },
};
const CITY: Record<L, string> = { vi: 'Đà Nẵng', ko: '다낭', ru: 'Дананг' };
const FX = 'about 26,300 VND';

function noun(lang: L, c: Combo): string {
  const { sub } = c;
  if (sub.kind === 'type') return TYPE_NOUN[lang][sub.value] ?? sub.value.toLowerCase();
  if (sub.value === 'studio') return { vi: 'căn hộ studio', ko: '스튜디오', ru: 'студии' }[lang];
  const n = sub.value;
  return {
    vi: `nhà và căn hộ ${n} phòng ngủ`,
    ko: `침실 ${n}개 주택·아파트`,
    ru: `жильё с ${n} ${+n === 1 ? 'спальней' : 'спальнями'}`,
  }[lang];
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const verbOf = (lang: L, mode: Mode) => ({
  vi: mode === 'rent' ? 'cho thuê' : 'bán',
  ko: mode === 'rent' ? '임대' : '매매',
  ru: mode === 'rent' ? 'в аренду' : 'на продажу',
}[lang]);

function head(lang: L, mode: Mode, c: Combo) {
  const n = noun(lang, c), v = verbOf(lang, mode), d = localizeDistrict(c.district, lang), city = CITY[lang];
  // Where the verb sits differs by language.
  const phrase = {
    vi: `${cap(n)} ${v} tại ${d}, ${city}`,
    ko: `${city} ${d} ${n} ${v}`,
    ru: `${cap(n)} ${v}: ${d}, ${city}`,
  }[lang];
  return { n, v, d, city, phrase };
}

export function comboContentL(lang: L, mode: Mode, c: Combo, matches: Listing[]) {
  const { n, v, d, city, phrase } = head(lang, mode, c);
  const st = stats(matches);
  const rent = mode === 'rent';
  const per = rent ? { vi: '/tháng', ko: '/월', ru: '/мес.' }[lang] : '';
  const price = st ? {
    vi: ` Từ ${usd(st.min)}${per}, phổ biến khoảng ${usd(st.median)}${per}.`,
    ko: ` ${usd(st.min)}${per}부터, 일반적으로 ${usd(st.median)}${per} 안팎.`,
    ru: ` От ${usd(st.min)}${per}, обычно около ${usd(st.median)}${per}.`,
  }[lang] : '';
  const k = matches.length;
  return {
    h1: phrase, title: phrase,
    subtitle: {
      vi: `${k} tin ${n} ${v} tại ${d}, ${city}, do môi giới địa phương cập nhật mỗi ngày.`,
      ko: `${city} ${d}의 ${n} ${v} 매물 ${k}건, 현지 중개인이 매일 업데이트합니다.`,
      ru: `${k} объявлений: ${n} ${v}, ${d}, ${city}. Обновляется ежедневно местными агентами.`,
    }[lang],
    description: {
      vi: `${k} tin ${n} ${v} tại ${d}, ${city}.${price} Có ảnh, giá và liên hệ môi giới, cập nhật mỗi ngày trên ${SITE_BRAND}.`,
      ko: `${city} ${d} ${n} ${v} ${k}건.${price} 사진, 가격, 중개인 연락처를 ${SITE_BRAND}에서 매일 업데이트합니다.`,
      ru: `${k} объявлений: ${n} ${v}, ${d}, ${city}.${price} Фото, цены и контакты агента, обновление ежедневно на ${SITE_BRAND}.`,
    }[lang],
  };
}

export function comboSeoBodyL(lang: L, mode: Mode, c: Combo, matches: Listing[]) {
  const { n, v, d, city, phrase } = head(lang, mode, c);
  const st = stats(matches);
  const rent = mode === 'rent';
  const k = matches.length;
  const per = rent ? { vi: ' mỗi tháng', ko: ' (월)', ru: ' в месяц' }[lang] : '';
  const range = st ? {
    vi: ` Giá chào từ **${usd(st.min)}** đến **${usd(st.p90)}**${per}, mức phổ biến khoảng **${usd(st.median)}**${per} (USD; VND hiển thị trên từng tin).`,
    ko: ` 호가는 **${usd(st.min)}**에서 **${usd(st.p90)}**${per}까지이며, 일반적으로 **${usd(st.median)}**${per} 수준입니다(USD, 매물별로 VND 표시).`,
    ru: ` Цены от **${usd(st.min)}** до **${usd(st.p90)}**${per}, типичная около **${usd(st.median)}**${per} (USD; VND указан в каждом объявлении).`,
  }[lang] : '';
  const rule = {
    vi: rent
      ? `Người nước ngoài có thể thuê nhà tại Việt Nam bằng hộ chiếu và visa; tiền cọc thường từ một đến hai tháng tiền thuê. Mở tin để xem thông tin liên hệ môi giới và biểu mẫu liên hệ.`
      : `Người nước ngoài được sở hữu căn hộ trong các dự án đã được phê duyệt tối đa 50 năm, không quá 30% số căn trong một tòa nhà, và thường không được sở hữu đất. Mở tin để xem thông tin liên hệ môi giới.`,
    ko: rent
      ? `외국인도 여권과 비자만 있으면 베트남에서 임대할 수 있으며, 보증금은 보통 1~2개월치 월세입니다. 매물을 열어 중개인 연락처와 문의 양식을 확인하세요.`
      : `외국인은 승인된 프로젝트의 아파트를 최대 50년간 소유할 수 있고(건물당 최대 30%), 토지는 일반적으로 소유할 수 없습니다. 매물을 열어 중개인 연락처를 확인하세요.`,
    ru: rent
      ? `Иностранцы могут арендовать жильё во Вьетнаме по паспорту и визе; залог обычно составляет один-два месяца аренды. Откройте объявление, чтобы увидеть контакты агента и форму запроса.`
      : `Иностранцы могут владеть квартирами в одобренных проектах до 50 лет (не более 30% квартир в здании) и, как правило, не могут владеть землёй. Откройте объявление, чтобы увидеть контакты агента.`,
  }[lang];
  const intro = [{
    vi: `${SITE_BRAND} hiện có **${k} tin ${n} ${v} tại ${d}, ${city}**, thu thập từ môi giới và chủ nhà địa phương, cập nhật mỗi ngày.${range}`,
    ko: `${SITE_BRAND}에는 현재 **${city} ${d} ${n} ${v} ${k}건**이 있으며, 현지 중개인과 집주인으로부터 수집해 매일 업데이트합니다.${range}`,
    ru: `На ${SITE_BRAND} сейчас **${k} объявлений: ${n} ${v}, ${d}, ${city}**, собранных у местных агентов и владельцев и обновляемых ежедневно.${range}`,
  }[lang], rule];
  const faq = [
    { q: { vi: `Hiện có bao nhiêu tin ${n} ${v} tại ${d}?`, ko: `${d}에 현재 ${n} ${v} 매물은 몇 건인가요?`, ru: `Сколько сейчас объявлений: ${n} ${v}, ${d}?` }[lang],
      a: { vi: `Hiện có ${k} tin, cập nhật mỗi ngày.`, ko: `현재 ${k}건이며 매일 업데이트됩니다.`, ru: `Сейчас ${k}, обновляется ежедневно.` }[lang] },
    ...(st ? [{ q: { vi: `Giá ${n} ${v} tại ${d} là bao nhiêu?`, ko: `${d} ${n} ${v} 가격은 어느 정도인가요?`, ru: `Сколько стоят ${n} (${v}), ${d}?` }[lang],
      a: { vi: `Giá chào từ ${usd(st.min)} đến ${usd(st.p90)}${per} (đa số tin), phổ biến khoảng ${usd(st.median)}${per}. Giá quy đổi USD theo tỷ giá khoảng 26.300 VND/USD.`,
           ko: `호가는 ${usd(st.min)}에서 ${usd(st.p90)}${per}(대부분의 매물)이며 일반적으로 ${usd(st.median)}${per} 안팎입니다. USD는 ${FX}/달러 기준입니다.`,
           ru: `Цены от ${usd(st.min)} до ${usd(st.p90)}${per} (большинство объявлений), типично около ${usd(st.median)}${per}. Пересчёт в USD по курсу около 26 300 VND за доллар.` }[lang] }] : []),
    { q: { vi: rent ? `Người nước ngoài có thể thuê ${n} tại ${d} không?` : `Người nước ngoài có thể mua ${n} tại ${d} không?`,
           ko: rent ? `외국인도 ${d}에서 ${n}을(를) 임대할 수 있나요?` : `외국인도 ${d}에서 ${n}을(를) 살 수 있나요?`,
           ru: rent ? `Могут ли иностранцы арендовать: ${n}, ${d}?` : `Могут ли иностранцы купить: ${n}, ${d}?` }[lang],
      a: rule },
  ];
  return { h2: phrase, intro, faqHeading: { vi: `${phrase}: câu hỏi thường gặp`, ko: `${phrase}: 자주 묻는 질문`, ru: `${phrase}: частые вопросы` }[lang], faq };
}
