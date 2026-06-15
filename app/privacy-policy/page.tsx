import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How DanangMLS handles data and cookies.',
  alternates: { canonical: 'https://danangmls.com/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-6">Last updated: June 2026</p>

        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS (&ldquo;we&rdquo;) operates the website danangmls.com. This policy explains what limited data
          we handle when you browse the site.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Information we collect</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          We do not require accounts and we do not ask you to submit personal information to browse listings.
          We collect standard, aggregated analytics (such as pages viewed, approximate region, device type, and
          referring site) to understand how the site is used and to improve it. If you contact us directly by
          phone, messaging app, or email, we receive whatever information you choose to share in that message.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Cookies</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          We use cookies and similar technologies for basic site functionality and analytics. You can disable
          cookies in your browser settings; the site will still work for browsing listings.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Third-party services</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          The site is served via Vercel and may use third-party analytics. Listing photos are hosted on our
          image CDN. These providers process technical request data (such as IP address) as part of delivering
          the site. We do not sell your personal information.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Your choices</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          If you have contacted us and would like us to delete the message data you sent, email{' '}
          <a href="mailto:danang4homes@gmail.com" className="text-blue-600 hover:underline">danang4homes@gmail.com</a>{' '}
          and we will remove it.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Contact</h2>
        <p className="text-slate-600 leading-relaxed">
          Questions about this policy? Email{' '}
          <a href="mailto:danang4homes@gmail.com" className="text-blue-600 hover:underline">danang4homes@gmail.com</a>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
