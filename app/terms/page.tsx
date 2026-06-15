import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms for using the DanangMLS website.',
  alternates: { canonical: 'https://danangmls.com/terms' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-400 text-sm mb-6">Last updated: June 2026</p>

        <p className="text-slate-600 leading-relaxed mb-4">
          By using danangmls.com (the &ldquo;site&rdquo;) you agree to these terms.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">About the listings</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS aggregates real-estate listings for Da Nang and Hoi An from local agents and property
          owners. We aim to keep listings current, but we do not own the properties and cannot guarantee the
          accuracy, availability, pricing, or condition of any listing. Always confirm details directly with the
          agent or owner before making any decision or payment.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">No warranty</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          The site is provided &ldquo;as is&rdquo; for informational purposes. To the extent permitted by law,
          we disclaim liability for any loss arising from reliance on information shown here, including listing
          errors, omissions, or third-party conduct.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Acceptable use</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Do not scrape, copy, or republish the site&rsquo;s content in bulk, or use it to send spam or unlawful
          communications. Listing content and photos remain the property of their respective owners.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Contact</h2>
        <p className="text-slate-600 leading-relaxed">
          Questions about these terms? Email{' '}
          <a href="mailto:danang4homes@gmail.com" className="text-blue-600 hover:underline">danang4homes@gmail.com</a>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
