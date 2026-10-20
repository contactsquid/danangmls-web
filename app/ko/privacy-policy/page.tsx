import type { Metadata } from 'next';
import { footerAlternates } from '@/lib/footerPages';

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description: 'DanangMLS의 데이터 및 쿠키 처리 방식에 대한 안내입니다.',
  alternates: footerAlternates('privacy', 'ko'),
};

export default function KoPrivacyPolicyPage() {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">개인정보 처리방침</h1>
        <p className="text-slate-400 text-sm mb-6">최종 업데이트: 2026년 6월</p>

        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS(이하 &ldquo;당사&rdquo;)는 danangmls.com 웹사이트를 운영합니다. 본 방침은 이용자가 사이트를
          둘러볼 때 당사가 처리하는 제한적인 데이터에 대해 설명합니다.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">수집하는 정보</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          당사는 매물을 둘러보는 데 계정을 요구하지 않으며, 개인정보 제출을 요청하지 않습니다. 사이트 이용
          현황을 파악하고 개선하기 위해 표준적인 집계형 분석 정보(조회한 페이지, 대략적인 지역, 기기 유형,
          유입 경로 사이트 등)를 수집합니다. 이용자가 전화, 메신저 앱 또는 이메일로 당사에 직접 연락하는 경우,
          당사는 해당 메시지에서 이용자가 공유하기로 선택한 정보를 받게 됩니다.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">쿠키</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          당사는 사이트의 기본 기능 및 분석을 위해 쿠키 및 이와 유사한 기술을 사용합니다. 이용자는 브라우저
          설정에서 쿠키를 비활성화할 수 있으며, 이 경우에도 매물 열람은 정상적으로 가능합니다.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">제3자 서비스</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          본 사이트는 Vercel을 통해 제공되며 제3자 분석 서비스를 이용할 수 있습니다. 매물 사진은 당사의 이미지
          CDN에 호스팅됩니다. 이러한 제공업체는 사이트 제공 과정에서 기술적 요청 데이터(IP 주소 등)를
          처리합니다. 당사는 이용자의 개인정보를 판매하지 않습니다.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">이용자의 선택권</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          당사에 연락하신 적이 있고 보내신 메시지 데이터의 삭제를 원하시는 경우,{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>
          로 이메일을 보내 주시면 해당 데이터를 삭제해 드립니다.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">문의</h2>
        <p className="text-slate-600 leading-relaxed">
          본 방침에 관한 문의는{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>
          로 이메일을 보내 주십시오.
        </p>
      </main>
    </div>
  );
}
