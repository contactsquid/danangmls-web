import type { Metadata } from 'next';
import { footerAlternates } from '@/lib/footerPages';

// Rewritten 2026-10-20 (Blake): the old policy said the site needs no accounts, which stopped being true when
// agent accounts launched, and it did not cover consent, cross-border storage or deletion as Nghị định
// 13/2023/NĐ-CP expects. Same text on all four MLS sites (template: ~/.openclaw/data/privacy-en.tsx.tmpl).

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How DanangMLS collects, uses and protects personal data, including agent accounts.',
  alternates: footerAlternates('privacy', 'en'),
};

const H2 = 'text-xl font-semibold text-slate-900 mt-8 mb-3';
const P = 'text-slate-700 leading-relaxed mb-3';
const UL = 'list-disc pl-6 space-y-1 text-slate-700 mb-3';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: October 20, 2026</p>

        <p className={P}>
          DanangMLS (&ldquo;we&rdquo;) operates the website danangmls.com and is run by the Da Nang Homes team. This policy
          explains what personal data we handle, why, where it is stored and the choices you have.
        </p>

        <h2 className={H2}>Browsing the site</h2>
        <p className={P}>
          You do not need an account to browse listings. We use cookieless, aggregated analytics (such as pages viewed,
          approximate region, device type and referring site) to understand how the site is used and to improve it.
          These analytics do not identify you personally.
        </p>

        <h2 className={H2}>Where listings come from</h2>
        <p className={P}>
          Listings are gathered from public posts in public Facebook groups and from agents who post on DanangMLS
          directly. A listing may show the agent&rsquo;s name and the contact details that appeared in the original
          public post. If you are the agent or owner and want a listing corrected or removed, email us and we will act on it.
        </p>

        <h2 className={H2}>Agent accounts</h2>
        <p className={P}>When you create an agent account, we collect:</p>
        <ul className={UL}>
          <li>your name, email address and mobile phone number (required);</li>
          <li>anything you choose to add to your profile, such as a photo, bio, workplace, Zalo or WhatsApp;</li>
          <li>the listings and photos you post.</li>
        </ul>
        <p className={P}>We use this information to:</p>
        <ul className={UL}>
          <li>create your agent profile and publish your listings;</li>
          <li>let renters and buyers contact you about your listings;</li>
          <li>send account emails: sign-up confirmation, password resets, and up to three reminders to post your first
            listing (every reminder has a one-click unsubscribe link);</li>
          <li>review new accounts and keep the site free of spam.</li>
        </ul>
        <p className={P}>
          We process this data on the basis of the consent you give when you create your account, and we record when you
          gave it. Your name and the profile details you add are shown publicly on your profile page, and your phone
          number may be shown on your listings so people can reach you. Your email address is never shown publicly.
        </p>

        <h2 className={H2}>Messages you send us</h2>
        <p className={P}>
          If you contact us by phone, messaging app or email, we receive whatever information you choose to share and use
          it only to reply to you.
        </p>

        <h2 className={H2}>Cookies and browser storage</h2>
        <p className={P}>
          Agent accounts use cookies to keep you signed in. The site also stores your search filters in your browser so
          they are still there when you come back to a page. We do not use advertising cookies. You can clear cookies and
          site data in your browser at any time; browsing will still work.
        </p>

        <h2 className={H2}>Service providers and where data is stored</h2>
        <p className={P}>We use these providers to run the site, and they process data on our behalf:</p>
        <ul className={UL}>
          <li>Vercel: website hosting and analytics;</li>
          <li>Supabase: agent accounts and the listings database, on servers in Singapore;</li>
          <li>Cloudflare: storage and delivery of listing photos;</li>
          <li>Google: sending account emails and storing listing data.</li>
        </ul>
        <p className={P}>
          Because these providers operate servers outside Vietnam, your data may be transferred to and stored in other
          countries, including Singapore. We do not sell personal information.
        </p>

        <h2 className={H2}>How long we keep data</h2>
        <p className={P}>
          We keep your account data until you delete your account. Deleting it removes your profile, your sign-in and our
          reminder-email record. Listings you have already published are not deleted with the account; they expire
          automatically (rentals after 60 days, properties for sale after 90 days). We delete messages you sent us on request.
        </p>

        <h2 className={H2}>Your rights</h2>
        <p className={P}>
          Under Vietnam&rsquo;s Decree 13/2023/ND-CP on personal data protection, you can ask to access, correct or delete
          your personal data, withdraw your consent, or restrict or object to how we process it. You can edit your profile
          at any time, delete your account yourself from your profile page, and unsubscribe from reminder emails with the
          link in each email. For anything else, email{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>.
        </p>

        <h2 className={H2}>Changes to this policy</h2>
        <p className={P}>
          If we change this policy, we will update the date at the top of this page.
        </p>

        <h2 className={H2}>Contact</h2>
        <p className={P}>
          Questions about this policy? Email{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>.
        </p>
      </main>
    </div>
  );
}
