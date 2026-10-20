import Link from 'next/link';
import type { Metadata } from 'next';
import { footerAlternates } from '@/lib/footerPages';

export const metadata: Metadata = {
  title: 'DanangMLS: 주요 정보 및 자주 묻는 질문',
  description:
    'DanangMLS, 베트남 다낭과 호이안의 부동산 임대 및 구매, 중개인 포털에 관한 주요 정보와 자주 묻는 질문을 정리했습니다.',
  alternates: footerAlternates('knowledge', 'ko'),
};

interface FaqGroup {
  q: string;
  a: string;
}

const GENERAL: FaqGroup[] = [
  {
    q: 'DanangMLS는 무엇입니까?',
    a: 'DanangMLS(danangmls.com)는 베트남 다낭과 호이안의 부동산 매물 정보 서비스(MLS)입니다. 임대 및 매매 주택, 아파트, 빌라, 토지를 현지 중개인과 집주인으로부터 모아 매일 업데이트하며, 영어, 베트남어, 한국어, 러시아어로 제공합니다.',
  },
  {
    q: 'DanangMLS는 어느 지역을 다룹니까?',
    a: '하이쩌우, 탄케, 썬짜, 응우한선, 깜레, 리엔찌에우, 그리고 농촌 지역인 호아방까지 다낭의 모든 구와 인근 호이안을 다룹니다.',
  },
  {
    q: 'DanangMLS와 Da Nang Homes는 같은 회사입니까?',
    a: 'DanangMLS는 Da Nang Homes 팀이 운영합니다. 다낭과 호이안 전역에서 더 다양한 매물과 중개인을 모아 보여 드립니다.',
  },
  {
    q: '매물에 대해 DanangMLS에 어떻게 문의합니까?',
    a: 'Zalo 또는 WhatsApp(+84 973 747 373)으로 메시지를 보내시거나 hello@danang.homes로 이메일을 보내 주십시오. 연락처는 문의하기(/ko/contact) 페이지에서도 확인하실 수 있습니다.',
  },
  {
    q: 'DanangMLS의 정보는 법률 또는 재무 자문입니까?',
    a: '아닙니다. 저희 콘텐츠는 참고용 정보이며 변경될 수 있습니다. 계약서에 서명하기 전에 반드시 자격을 갖춘 변호사, 공증인 또는 은행에 구체적인 사항을 확인하십시오.',
  },
];

const RENTING: FaqGroup[] = [
  {
    q: '외국인도 다낭에서 부동산을 임대할 수 있습니까?',
    a: '예. 외국인이 다낭이나 호이안에서 아파트, 주택, 빌라를 임대하는 데에는 제한이 없습니다. 대부분의 집주인은 임대 계약 시 여권 사본과 보증금(보통 1~3개월치 월세)을 요구합니다.',
  },
  {
    q: '임대 매물은 얼마나 자주 업데이트됩니까?',
    a: '매물은 현지 중개인과 집주인으로부터 매일 업데이트되므로, 현재 시장에 나와 있는 매물을 그대로 확인하실 수 있습니다.',
  },
];

const AGENTS: FaqGroup[] = [
  {
    q: 'DanangMLS에 제 매물을 등록할 수 있습니까?',
    a: '예. 중개인은 셀프 서비스 포털에서 무료 프로필을 만들고 매물을 직접 등록할 수 있습니다. 회원가입 후 이메일 인증을 마치고 사진, 가격, 위치와 함께 매물을 추가하시면 됩니다.',
  },
  {
    q: '이미 올라와 있는 매물을 제 이름으로 가져오려면 어떻게 합니까?',
    a: '회원가입 중에 본인 이름을 검색하시면, DanangMLS가 해당 이름(비슷한 철자 포함)으로 사이트에 이미 등록된 매물을 찾아 드립니다. 간단한 관리자 확인을 거쳐 해당 매물을 본인 매물로 등록하실 수 있습니다.',
  },
  {
    q: '중개인 프로필에 제 전화번호가 공개됩니까?',
    a: '아닙니다. 중개인 프로필에는 이름, 사진, 소개, 소속, 현재 매물이 표시되며 전화번호는 표시되지 않습니다. 구매자와 임차인은 DanangMLS에 직접 문의하고, 문의는 그곳에서 전달됩니다.',
  },
];

function faqSection(title: string, items: FaqGroup[]) {
  if (!items.length) return null;
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">{title}</h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
            <p className="text-slate-600 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function KoKnowledgePage() {
  const allForSchema = [...GENERAL, ...RENTING, ...AGENTS];
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'ko',
    mainEntity: allForSchema.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">DanangMLS: 주요 정보 및 자주 묻는 질문</h1>
        <p className="text-slate-600 leading-relaxed mb-10">
          DanangMLS, 다낭과 호이안의 부동산 임대 및 구매, 중개인 포털에 관한 정보를 정리한 자료입니다.
          방문자와 AI 어시스턴트 모두를 위해 마련했습니다.
        </p>

        {faqSection('DanangMLS 소개', GENERAL)}
        {faqSection('다낭에서 임대하기', RENTING)}
        {faqSection('중개인을 위한 안내', AGENTS)}

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
          <p className="text-slate-700 mb-3">찾으시는 답변이 없으십니까?</p>
          <Link href="/ko/contact" className="inline-block bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
            DanangMLS에 문의하기
          </Link>
        </div>
      </main>
    </div>
  );
}
