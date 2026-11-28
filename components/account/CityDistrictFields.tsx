'use client';

import { useEffect, useMemo, useState } from 'react';
import CityCombobox, { type CityOption } from '@/components/CityCombobox';
import { PLACES_LIST, SCRAPED_CITIES, cityName } from '@/lib/cities';
import { inputClass, labelClass } from '@/components/account/ui';
import { SITE_CITY } from '@/lib/cityJump';
import type { Lang } from '@/lib/translations';

// City + district for an agent's listing (Blake, 2026-10-01): ANY city or town in
// Vietnam (630 places, GADM level 2), not only the 25 we scrape; the 25 rank first.
// Picking a city loads its districts (public/data/districts/<slug>.json, built by
// scripts/build-place-districts.mjs) into a required dropdown. Values are written the
// way the scrapers write districts, so agent and scraped listings filter together.
const COPY = {
  en: { city: 'City', cityHint: 'Start typing, e.g. Hoi An or Da Lat', district: 'District', pickCity: 'Choose a city first', pick: 'Choose a district', loading: 'Loading…' },
  vi: { city: 'Thành phố', cityHint: 'Gõ tên để tìm, ví dụ Hội An, Đà Lạt', district: 'Quận / Huyện', pickCity: 'Anh/chị chọn thành phố trước', pick: 'Chọn quận / huyện', loading: 'Đang tải…' },
  ko: { city: '도시', cityHint: '입력해서 찾기 (예: 호이안, 달랏)', district: '구', pickCity: '먼저 도시를 선택하세요', pick: '구 / 지역 선택', loading: '불러오는 중…' },
  ru: { city: 'Город', cityHint: 'Начните вводить, например Хойан или Далат', district: 'Район', pickCity: 'Сначала выберите город', pick: 'Выберите район', loading: 'Загрузка…' },
} as const;

// City-site version (Blake, 2026-11-28): defaults to THIS site's city, but any city in
// Vietnam can be chosen; the parent is told so it can show ward options only for the home city.
export default function CityDistrictFields({ lang, initialCity = SITE_CITY, initialDistrict = '', onChange }: { lang: Lang; initialCity?: string; initialDistrict?: string; onChange?: (city: string, district: string) => void }) {
  const t = COPY[lang as keyof typeof COPY] ?? COPY.en;
  const [city, setCity] = useState(initialCity);
  const [district, setDistrict] = useState(initialDistrict);
  const [districts, setDistricts] = useState<{ v: string; vi: string }[] | null>(null);

  useEffect(() => {
    setDistricts(null);
    if (!city) return;
    let live = true;
    fetch(`/data/districts/${city}.json`)
      .then(r => (r.ok ? r.json() : []))
      .catch(() => [])
      .then((list: { v: string; vi: string }[]) => { if (live) setDistricts(list); });
    return () => { live = false; };
  }, [city]);

  useEffect(() => { onChange?.(city, district); }, [city, district]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeCity = (slug: string) => { if (slug !== city) setDistrict(''); setCity(slug); };
  // An older listing's free-text district stays selectable until the agent changes it.
  const known = !district || !districts || districts.some(d => d.v === district);
  const options: CityOption[] = useMemo(() => PLACES_LIST.map(p => {
    const top = SCRAPED_CITIES.indexOf(p.slug);
    const label = cityName(p.slug, lang);
    const muni = p.type === 'municipality';
    return {
      slug: p.slug,
      label,
      hint: muni ? '' : (lang === 'vi' ? p.provinceVi : p.province),
      names: [p.en, p.vi, ...(p.aliases ?? []), ...(p.slug === 'saigon' ? ['Saigon', 'Sài Gòn', 'HCMC'] : [])],
      rank: top >= 0 ? 1000 - top : p.type === 'city' ? 100 : p.type === 'town' ? 50 : 0,
    };
  }), [lang]);

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className={labelClass} htmlFor="listing-city">{t.city}</label>
        <input type="hidden" name="city" value={city} />
        <CityCombobox id="listing-city" options={options} value={city} onChange={changeCity} label={t.cityHint} required max={10} />
      </div>
      <div>
        <label className={labelClass} htmlFor="listing-district">{t.district}</label>
        <select id="listing-district" name="district" required disabled={!city || !districts}
          value={district} onChange={e => setDistrict(e.target.value)}
          className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-400`}>
          <option value="">{!city ? t.pickCity : !districts ? t.loading : t.pick}</option>
          {!known && <option value={district}>{district}</option>}
          {(districts ?? []).map(d => <option key={d.v} value={d.v}>{lang === 'vi' ? d.vi : d.v}</option>)}
        </select>
      </div>
    </div>
  );
}
