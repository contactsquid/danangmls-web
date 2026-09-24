import { normalizeVnPhone, formatVnPhone, zaloLink, smsLink, whatsappLink } from '@/lib/agentContact';
import { forLang, type Lang } from '@/lib/translations';

/**
 * Contact buttons on an agent's public profile.
 *
 * Separate from AgentContact (the listing block) on purpose: that component is
 * bound to a listing — it builds a prefilled enquiry from the bedrooms/district
 * and reports a per-listing stat. A profile has neither, so this renders the
 * same buttons in the same fixed order without inventing a listing to hang them
 * on. The message here is deliberately unprefilled: the visitor is contacting
 * the agent, not asking about one specific property.
 *
 * A saved number publishes Zalo and Message. Blake, 2026-09-24: "This is Vietnam
 * and every agent wants to be contacted" — Zalo is effectively universal on a
 * Vietnamese mobile and every number takes SMS, so there is nothing to opt into.
 * That also makes a profile behave like the sub-floor listing block, which has
 * always published a scraped agent's Zalo and Message without asking.
 *
 * WhatsApp is the exception and stays behind `has_whatsapp`: it is NOT universal
 * in Vietnam, so showing it unasked would send foreign tenants to an app the
 * agent may not run. Listings infer it from the text of a scraped Facebook post
 * (agentChannels.ts); on a profile the agent ticks it themselves.
 */
export default function AgentProfileContact({
  profile,
  lang,
}: {
  profile: { display_name: string; phone: string | null; has_whatsapp: boolean; has_zalo: boolean };
  lang: Lang;
}) {
  const phone = normalizeVnPhone(profile.phone);
  if (!phone) return null;

  const btn = 'inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold '
    + 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        📞 {forLang({
          en: 'Contact Information',
          vi: 'Thông tin liên hệ',
          ko: '연락처 정보',
          ru: 'Контактная информация',
        }, lang)}
      </h2>

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
        <span className="font-semibold text-slate-800">{profile.display_name}</span>
        <span className="text-xs text-slate-500">{formatVnPhone(phone)}</span>
      </div>

      {/* Same fixed order as the listing block: WhatsApp, Zalo, Message. */}
      <div className="flex flex-wrap gap-2">
        {profile.has_whatsapp && (
          <a
            href={whatsappLink(phone)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btn} bg-[#25d366] text-white hover:bg-[#1eb455] focus-visible:outline-[#25d366]`}
          >
            WhatsApp
          </a>
        )}
        <a
          href={zaloLink(phone)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} bg-[#0068ff] text-white hover:bg-[#0058d8] focus-visible:outline-[#0068ff]`}
        >
          Zalo
        </a>
        <a
          href={smsLink(phone)}
          className={`${btn} bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus-visible:outline-slate-400`}
        >
          {forLang({ en: 'Message', vi: 'Nhắn tin', ko: '문자', ru: 'Написать' }, lang)}
        </a>
      </div>
    </div>
  );
}
