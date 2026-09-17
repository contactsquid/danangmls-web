'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatVnPhone, zaloLink, telLink, enquiryVi } from '@/lib/agentContact';
import { forLang, type Lang } from '@/lib/translations';

export type ContactAgent = {
  name: string;
  phone: string;        // 9 local digits
  profileSlug?: string | null;
};

type Props = {
  agents: ContactAgent[];
  listing: { slug: string; bedrooms?: string; district?: string; type?: string };
  lang: Lang;
};

/**
 * Contact block for sub-floor rentals: the agent who holds the listing, not the
 * agency line.
 *
 * Heading is the SAME "Contact Information" as the premium block on purpose —
 * nothing should announce to the customer that their enquiry has been graded.
 * The agent's name sits above their own buttons and carries the attribution,
 * which also stops the block implying a single exclusive agent: a property posted
 * by several agents simply renders several named rows.
 *
 * Deliberately absent:
 *  - any link to the source Facebook post. It shows customers how the sausage is
 *    made, and once they have the post they no longer need to mention where they
 *    found it — so the site loses the credit for the introduction.
 *  - any "we can handle it instead" line. These are the enquiries DanangMLS does
 *    not want; offering to take them back defeats the entire point.
 */
export default function AgentContact({ agents, listing, lang }: Props) {
  const reachable = agents.filter(a => a.phone);
  if (reachable.length === 0) return null;

  // A Vietnamese reader phones a local business directly — that is the norm here,
  // not the exception. Every other language leads with messaging, because calling
  // an agent who speaks little English is a dead end dressed up as a channel.
  const callFirst = lang === 'vi';

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        📞 {forLang({
          en: 'Contact Information',
          vi: 'Thông tin liên hệ',
          ko: '연락처 정보',
          ru: 'Контактная информация',
        }, lang)}
      </h2>

      <div className="flex flex-col gap-4">
        {reachable.map((agent, i) => (
          <div
            key={`${agent.name}-${agent.phone}`}
            className={i > 0 ? 'pt-4 border-t border-blue-100' : undefined}
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
              {agent.profileSlug ? (
                <Link href={`/agent/${agent.profileSlug}`} className="font-semibold text-blue-700 hover:underline">
                  {agent.name}
                </Link>
              ) : (
                <span className="font-semibold text-slate-800">{agent.name}</span>
              )}
              <span className="text-xs text-slate-500">{formatVnPhone(agent.phone)}</span>
            </div>

            <div className={`flex flex-wrap gap-2 ${callFirst ? 'flex-row-reverse justify-end' : ''}`}>
              <a
                href={zaloLink(agent.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0068ff] text-white text-sm font-semibold hover:bg-[#0058d8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0068ff]"
              >
                Zalo
              </a>
              <a
                href={telLink(agent.phone)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white text-slate-700 border border-slate-200 text-sm font-semibold hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
              >
                {forLang({ en: 'Call', vi: 'Gọi', ko: '전화', ru: 'Позвонить' }, lang)}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* The language barrier, not the number, is what actually blocks a foreign
          customer — so hand them a ready message rather than a warning. Hidden on
          /vi, where the reader writes their own. */}
      {lang !== 'vi' && <CopyEnquiry text={enquiryVi(listing)} lang={lang} />}
    </div>
  );
}

function CopyEnquiry({ text, lang }: { text: string; lang: Lang }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard can be refused (insecure context, permissions). The message is
      // already on screen and selectable, so there is nothing to recover from.
      setCopied(false);
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-blue-100">
      <p className="text-xs text-slate-600 mb-2">
        {forLang({
          en: 'This agent replies in Vietnamese. Send them this:',
          vi: '',
          ko: '이 중개인은 베트남어로 응답합니다. 이 메시지를 보내세요:',
          ru: 'Этот агент отвечает по-вьетнамски. Отправьте ему это:',
        }, lang)}
      </p>
      <p className="text-sm text-slate-700 bg-white border border-blue-100 rounded-lg p-3 whitespace-pre-line break-words">
        {text}
      </p>
      <button
        type="button"
        onClick={copy}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded"
      >
        {copied
          ? forLang({ en: 'Copied', vi: 'Đã sao chép', ko: '복사됨', ru: 'Скопировано' }, lang)
          : forLang({ en: 'Copy message', vi: 'Sao chép tin nhắn', ko: '메시지 복사', ru: 'Скопировать' }, lang)}
      </button>
    </div>
  );
}
