'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatVnPhone, zaloLink, smsLink, whatsappLink, agencyWebsite, enquiryFor } from '@/lib/agentContact';
import { forLang, type Lang } from '@/lib/translations';

export type ContactAgent = {
  name: string;
  phone: string;                 // 9 local digits
  profileSlug?: string | null;
  /** Only true where the agent's OWN post text named WhatsApp, or where this is
   *  the agency line. Never assumed — wa.me to an unregistered number fails
   *  silently, which would rebuild the dead end this block exists to remove. */
  hasWhatsApp?: boolean;
  /** Approved agents (Blake's own people) also get a website button. */
  showWebsite?: boolean;
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

  const message = enquiryFor(listing, lang);

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

            {/* Fixed order: WhatsApp, Zalo, Message, Website. WhatsApp only where
                we know the number is on it; Website only for approved agents. */}
            <div className="flex flex-wrap gap-2">
              {agent.hasWhatsApp && (
                <a
                  href={whatsappLink(agent.phone, message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#25d366] text-white text-sm font-semibold hover:bg-[#1eb455] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25d366]"
                >
                  WhatsApp
                </a>
              )}
              <a
                href={zaloLink(agent.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0068ff] text-white text-sm font-semibold hover:bg-[#0058d8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0068ff]"
              >
                Zalo
              </a>
              {/* Replaced Call: an agent would rather receive a text from a new
                  customer than a cold call, and the enquiry rides along prefilled. */}
              <a
                href={smsLink(agent.phone, message)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white text-slate-700 border border-slate-200 text-sm font-semibold hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
              >
                {forLang({ en: 'Message', vi: 'Nhắn tin', ko: '문자', ru: 'Написать' }, lang)}
              </a>
              {agent.showWebsite && (
                <a
                  href={agencyWebsite(lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white text-slate-700 border border-slate-200 text-sm font-semibold hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
                >
                  {forLang({ en: 'Website', vi: 'Website', ko: '웹사이트', ru: 'Сайт' }, lang)}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* A ready message in the customer's OWN language: they will continue the
          conversation in it anyway, so opening in Vietnamese would buy one fluent
          line and then an unreadable reply. Shown on every locale, including /vi —
          the DanangMLS link inside it is what earns the site credit for the
          introduction, and Vietnamese customers are the bulk of the market. */}
      <CopyEnquiry text={message} lang={lang} />
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
      <p className="text-xs font-semibold text-slate-600 mb-2">
        {forLang({
          en: 'Message to Agent:',
          vi: 'Tin nhắn cho môi giới:',
          ko: '중개인에게 보낼 메시지:',
          ru: 'Сообщение агенту:',
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
