import type { Metadata } from 'next';
import { footerAlternates } from '@/lib/footerPages';

// Rewritten 2026-10-20 (Blake): the old policy said the site needs no accounts, which stopped being true when
// agent accounts launched, and it did not cover consent, cross-border storage or deletion as Nghị định
// 13/2023/NĐ-CP expects. Same text on all four MLS sites (template: ~/.openclaw/data/privacy-ko.tsx.tmpl,
// Korean version of ~/.openclaw/data/privacy-en.tsx.tmpl).

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description: 'DanangMLS의 에이전트 계정을 포함한 개인정보 수집·이용 및 보호에 관한 안내입니다.',
  alternates: footerAlternates('privacy', 'ko'),
};

const H2 = 'text-xl font-semibold text-slate-900 mt-8 mb-3';
const P = 'text-slate-700 leading-relaxed mb-3';
const UL = 'list-disc pl-6 space-y-1 text-slate-700 mb-3';

export default function KoPrivacyPolicyPage() {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">개인정보 처리방침</h1>
        <p className="text-sm text-slate-500 mb-8">최종 업데이트: 2026년 10월 20일</p>

        <p className={P}>
          DanangMLS(이하 &ldquo;당사&rdquo;)는 danangmls.com 웹사이트를 운영하며, 웹사이트 운영은 Da Nang Homes 팀이
          담당합니다. 본 개인정보 처리방침은 당사가 처리하는 개인정보의 항목과 처리 목적, 보관 장소, 그리고 이용자가
          선택할 수 있는 사항을 안내합니다.
        </p>

        <h2 className={H2}>웹사이트 이용</h2>
        <p className={P}>
          매물 정보는 계정 없이 열람하실 수 있습니다. 당사는 웹사이트 이용 현황을 파악하고 서비스를 개선하기 위하여
          쿠키를 사용하지 않는 집계형 분석 도구(조회한 페이지, 대략적인 지역, 기기 유형, 유입 경로 등)를 이용합니다.
          이러한 분석 정보로는 이용자 개인을 식별할 수 없습니다.
        </p>

        <h2 className={H2}>매물 정보의 출처</h2>
        <p className={P}>
          매물 정보는 공개 Facebook 그룹에 게시된 공개 게시물과 DanangMLS에 직접 매물을 등록하는 에이전트로부터
          수집됩니다. 매물에는 에이전트의 이름과 원 공개 게시물에 기재된 연락처가 표시될 수 있습니다. 해당 매물의
          에이전트 또는 소유자로서 매물 정보의 정정이나 삭제를 원하시는 경우 이메일로 요청해 주시면 조치하겠습니다.
        </p>

        <h2 className={H2}>에이전트 계정</h2>
        <p className={P}>에이전트 계정을 생성하는 경우 당사는 다음 정보를 수집합니다.</p>
        <ul className={UL}>
          <li>이름, 이메일 주소, 휴대전화 번호(필수 항목)</li>
          <li>사진, 자기소개, 소속, Zalo 또는 WhatsApp 등 이용자가 프로필에 직접 추가하는 정보</li>
          <li>이용자가 등록하는 매물 정보 및 사진</li>
        </ul>
        <p className={P}>수집한 정보는 다음 목적으로 이용합니다.</p>
        <ul className={UL}>
          <li>에이전트 프로필 생성 및 등록 매물 게시</li>
          <li>임차 희망자 및 매수 희망자가 매물에 관하여 에이전트에게 연락할 수 있도록 지원</li>
          <li>계정 관련 이메일 발송: 가입 확인, 비밀번호 재설정, 첫 매물 등록을 안내하는 최대 3회의 알림 이메일(모든
            알림 이메일에는 클릭 한 번으로 수신을 거부할 수 있는 링크가 포함됩니다)</li>
          <li>신규 계정 검토 및 스팸 방지</li>
        </ul>
        <p className={P}>
          당사는 이용자가 계정을 생성할 때 제공한 동의에 근거하여 위 정보를 처리하며, 동의 일시를 기록합니다. 이용자의
          이름과 프로필에 추가한 정보는 프로필 페이지에 공개되며, 휴대전화 번호는 다른 이용자가 연락할 수 있도록 매물에
          표시될 수 있습니다. 이메일 주소는 공개되지 않습니다.
        </p>

        <h2 className={H2}>당사에 보내시는 메시지</h2>
        <p className={P}>
          전화, 메신저 앱 또는 이메일로 당사에 연락하시는 경우, 당사는 이용자가 제공하기로 선택한 정보를 받게 되며 이를
          회신 목적으로만 이용합니다.
        </p>

        <h2 className={H2}>쿠키 및 브라우저 저장소</h2>
        <p className={P}>
          에이전트 계정은 로그인 상태를 유지하기 위하여 쿠키를 사용합니다. 또한 웹사이트는 이용자가 페이지를 다시
          방문하였을 때 검색 필터가 유지되도록 이를 브라우저에 저장합니다. 당사는 광고용 쿠키를 사용하지 않습니다.
          이용자는 언제든지 브라우저에서 쿠키와 사이트 데이터를 삭제할 수 있으며, 삭제하더라도 웹사이트 열람에는 지장이
          없습니다.
        </p>

        <h2 className={H2}>개인정보 처리 위탁 및 보관 장소</h2>
        <p className={P}>당사는 웹사이트 운영을 위하여 다음 업체를 이용하며, 해당 업체는 당사를 대신하여 개인정보를 처리합니다.</p>
        <ul className={UL}>
          <li>Vercel: 웹사이트 호스팅 및 분석</li>
          <li>Supabase: 에이전트 계정 및 매물 데이터베이스(싱가포르 소재 서버)</li>
          <li>Cloudflare: 매물 사진 저장 및 전송</li>
          <li>Google: 계정 관련 이메일 발송 및 매물 데이터 저장</li>
        </ul>
        <p className={P}>
          위 업체들은 베트남 외 지역에서 서버를 운영하므로, 이용자의 개인정보는 싱가포르를 비롯한 다른 국가로 국외
          이전되어 보관될 수 있습니다. 당사는 개인정보를 판매하지 않습니다.
        </p>

        <h2 className={H2}>개인정보의 보유 기간</h2>
        <p className={P}>
          당사는 이용자가 계정을 삭제할 때까지 계정 정보를 보유합니다. 계정을 삭제하면 프로필, 로그인 정보 및 알림 이메일
          발송 기록이 삭제됩니다. 이미 게시된 매물은 계정과 함께 삭제되지 않으며, 일정 기간이 지나면 자동으로
          만료됩니다(임대 매물은 60일, 매매 매물은 90일 후). 당사에 보내신 메시지는 요청 시 삭제합니다.
        </p>

        <h2 className={H2}>정보주체의 권리</h2>
        <p className={P}>
          정보주체는 베트남 개인정보보호에 관한 시행령(Decree 13/2023/ND-CP)에 따라 본인의 개인정보에 대한 열람, 정정
          또는 삭제를 요청하거나, 동의를 철회하거나, 개인정보 처리의 제한을 요청하거나 이에 반대할 수 있습니다. 프로필은
          언제든지 직접 수정할 수 있고, 계정은 프로필 페이지에서 직접 삭제할 수 있으며, 알림 이메일은 각 이메일에 포함된
          링크를 통해 수신을 거부할 수 있습니다. 그 밖의 요청은{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>로
          이메일을 보내 주시기 바랍니다.
        </p>

        <h2 className={H2}>개인정보 처리방침의 변경</h2>
        <p className={P}>
          본 개인정보 처리방침이 변경되는 경우, 당사는 이 페이지 상단의 날짜를 갱신합니다.
        </p>

        <h2 className={H2}>문의처</h2>
        <p className={P}>
          본 개인정보 처리방침에 관한 문의는{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>로
          이메일을 보내 주시기 바랍니다.
        </p>
      </main>
    </div>
  );
}
