import type { Metadata } from 'next';
import { footerAlternates } from '@/lib/footerPages';

export const metadata: Metadata = {
  title: 'DanangMLS 소개',
  description: 'DanangMLS는 베트남 다낭과 호이안 전역의 임대 및 매매 주택, 아파트, 빌라, 토지를 한곳에 모은 부동산 매물 정보 서비스(MLS)입니다. 현지 중개인의 매물을 모아 매일 업데이트합니다.',
  alternates: footerAlternates('about', 'ko'),
};

export default function KoAboutPage() {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">DanangMLS 소개</h1>
        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS는 <strong>베트남 다낭과 호이안</strong>의 부동산 매물 정보 서비스(MLS)입니다.
          임대 및 매매 주택, 아파트, 빌라, 토지를 깔끔하게 검색할 수 있도록 한곳에 모았으며,
          영어, 베트남어, 한국어, 러시아어로 제공됩니다.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          매물은 현지 중개인과 집주인으로부터 수집되어 매일 업데이트되므로, 현재 시장에 나와 있는 매물을
          그대로 확인하실 수 있습니다. 각 매물은 해당 부동산을 담당하는 분과 직접 연결되며, 저희는 매물을
          쉽게 둘러보고 비교할 수 있도록 돕습니다.
        </p>
        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">서비스 지역</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          하이쩌우, 탄케, 썬짜, 응우한선, 깜레, 리엔찌에우, 그리고 농촌 지역인 호아방까지 다낭의 모든 구와
          인근 호이안의 임대 및 매매 매물을 다룹니다. 미케 해변과 안트엉 인근의 해변 아파트부터 가족용 주택,
          타운하우스, 빌라, 토지까지 포함합니다.
        </p>
        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">문의하기</h2>
        <p className="text-slate-600 leading-relaxed">
          DanangMLS는 Da Nang Homes 팀이 운영합니다.{' '}
          <a href="tel:+84973747373" className="text-blue-600 hover:underline">+84 973 747 373</a>(Zalo / WhatsApp),
          이메일{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>
          로 연락하시거나{' '}
          <a href="https://danang.homes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">danang.homes</a>
          를 방문해 주십시오.
        </p>
      </main>
    </div>
  );
}
