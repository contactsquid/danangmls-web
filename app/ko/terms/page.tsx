import type { Metadata } from 'next';
import { footerAlternates } from '@/lib/footerPages';

export const metadata: Metadata = {
  title: '이용약관',
  description: 'DanangMLS 웹사이트 이용에 관한 약관입니다.',
  alternates: footerAlternates('terms', 'ko'),
};

export default function KoTermsPage() {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">이용약관</h1>
        <p className="text-slate-400 text-sm mb-6">최종 업데이트: 2026년 6월</p>

        <p className="text-slate-600 leading-relaxed mb-4">
          danangmls.com(이하 &ldquo;사이트&rdquo;)을 이용함으로써 귀하는 본 약관에 동의하는 것으로 간주됩니다.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">매물 정보에 관하여</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS는 다낭과 호이안의 부동산 매물을 현지 중개인과 집주인으로부터 모아 제공합니다. 당사는 매물
          정보를 최신으로 유지하고자 노력하지만, 해당 부동산을 소유하고 있지 않으며 매물의 정확성, 거래 가능
          여부, 가격 또는 상태를 보증할 수 없습니다. 결정을 내리거나 대금을 지급하기 전에 반드시 중개인 또는
          소유자에게 세부 사항을 직접 확인하십시오.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">보증의 부인</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          본 사이트는 정보 제공 목적으로 &ldquo;있는 그대로&rdquo; 제공됩니다. 법률이 허용하는 범위 내에서,
          당사는 매물 정보의 오류, 누락 또는 제3자의 행위를 포함하여 본 사이트에 표시된 정보를 신뢰함으로써
          발생하는 모든 손실에 대해 책임을 지지 않습니다.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">허용되는 이용</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          사이트의 콘텐츠를 대량으로 스크래핑, 복제 또는 재게시하거나, 이를 스팸 또는 불법적인 통신을 보내는 데
          이용해서는 안 됩니다. 매물 콘텐츠와 사진의 권리는 각 소유자에게 있습니다.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">문의</h2>
        <p className="text-slate-600 leading-relaxed">
          본 약관에 관한 문의는{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>
          로 이메일을 보내 주십시오.
        </p>
      </main>
    </div>
  );
}
