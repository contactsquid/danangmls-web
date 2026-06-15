import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact DanangMLS',
  description: 'Contact the DanangMLS team about any rental or for-sale property in Da Nang and Hoi An, Vietnam. Reach us on Zalo, WhatsApp, or email.',
  alternates: { canonical: 'https://danangmls.com/contact' },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Contact Us</h1>
        <p className="text-slate-600 leading-relaxed mb-6">
          Found a property you like, or want help finding one? Get in touch and we&rsquo;ll connect you with the
          right person and arrange a viewing. We respond in English and Vietnamese.
        </p>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3 text-slate-700">
          <p>📱 <strong>Zalo / WhatsApp:</strong>{' '}
            <a href="tel:+84973747373" className="text-blue-600 hover:underline">+84 973 747 373</a>
          </p>
          <p>📧 <strong>Email:</strong>{' '}
            <a href="mailto:danang4homes@gmail.com" className="text-blue-600 hover:underline">danang4homes@gmail.com</a>
          </p>
          <p>🌐 <strong>Website:</strong>{' '}
            <a href="https://danang.homes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">danang.homes</a>
          </p>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed mt-6">
          When messaging about a specific listing, include the listing link so we can pull up the details quickly.
          The fastest way to reach us is on WhatsApp.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
