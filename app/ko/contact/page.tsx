import type { Metadata } from 'next';
import { footerAlternates } from '@/lib/footerPages';

export const metadata: Metadata = {
  title: 'DanangMLS 문의하기',
  description: '베트남 다낭과 호이안의 임대 및 매매 부동산에 대해 DanangMLS 팀에 문의하십시오. Zalo, WhatsApp 또는 이메일로 연락하실 수 있습니다.',
  alternates: footerAlternates('contact', 'ko'),
};

export default function KoContactPage() {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">문의하기</h1>
        <p className="text-slate-600 leading-relaxed mb-6">
          마음에 드는 매물을 찾으셨거나 매물 찾기에 도움이 필요하십니까? 연락 주시면 담당자와 연결해 드리고
          방문 일정을 잡아 드립니다. 영어와 베트남어로 답변해 드립니다.
        </p>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3 text-slate-700">
          <p>📱 <strong>Zalo / WhatsApp:</strong>{' '}
            <a href="tel:+84973747373" className="text-blue-600 hover:underline">+84 973 747 373</a>
          </p>
          <p>📧 <strong>이메일:</strong>{' '}
            <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>
          </p>
          <p>🌐 <strong>웹사이트:</strong>{' '}
            <a href="https://danang.homes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">danang.homes</a>
          </p>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed mt-6">
          특정 매물에 대해 문의하실 때는 매물 링크를 함께 보내 주시면 빠르게 확인해 드릴 수 있습니다.
          가장 빠르게 연락하실 수 있는 방법은 WhatsApp입니다.
        </p>
      </main>
    </div>
  );
}
