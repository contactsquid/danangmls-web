import Link from 'next/link';
import ProfileForm from '@/app/account/profile/ProfileForm';
import { signOutAction } from '@/app/account/actions';
import { ACCOUNT_COPY, accountPaths } from '@/lib/accountCopy';
import { agentPaths } from '@/lib/agentCopy';
import { LISTING_FORM_COPY } from '@/lib/listingFormCopy';
import type { Lang } from '@/lib/translations';
import type { OwnAgentProfile } from '@/lib/agents';

/** Shared body of the signed-in profile screen, rendered by both /account/profile
 *  and /vi/tai-khoan/ho-so. */
export default function ProfilePageBody({
  profile,
  lang,
}: {
  profile: OwnAgentProfile;
  lang: Lang;
}) {
  const t = ACCOUNT_COPY[lang];
  const paths = accountPaths[lang];

  return (
    <>
      {profile.status === 'suspended' && (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {t.suspendedNotice}
        </p>
      )}

      {/* Primary action for an agent who is already set up: the profile exists to
          carry listings, so posting one should not be buried. */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-sm text-slate-700 flex-1 min-w-0">{t.addListingPrompt}</p>
        <Link
          href={lang === 'vi' ? '/vi/tai-khoan/tin-dang' : '/account/listings'}
          className="text-sm text-blue-700 hover:underline whitespace-nowrap"
        >
          {LISTING_FORM_COPY[lang].myListings}
        </Link>
        <Link
          href={paths.newListing}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          {t.addListingButton}
        </Link>
      </div>

      <ProfileForm profile={profile} lang={lang} />

      <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
        {profile.is_admin ? (
          <Link href="/admin/agents" className="text-sm text-blue-600 hover:underline">
            {t.adminLink}
          </Link>
        ) : <span />}
        <form action={signOutAction}>
          <input type="hidden" name="lang" value={lang} />
          <button type="submit" className="text-sm text-slate-500 hover:text-slate-700 hover:underline">
            {t.signOut}
          </button>
        </form>
      </div>
    </>
  );
}

/** The "Public at …" subtitle, in the reader's language. */
export function ProfileSubtitle({ slug, lang }: { slug: string; lang: Lang }) {
  const t = ACCOUNT_COPY[lang];
  const href = agentPaths[lang].profile(slug);
  return (
    <>
      {t.publicAt}{' '}
      <Link href={href} className="text-blue-600 hover:underline">
        danangmls.com{href}
      </Link>
    </>
  );
}
