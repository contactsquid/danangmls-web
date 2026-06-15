import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About DanangMLS',
  description: 'DanangMLS is a multiple listing service for houses, apartments, villas, and land for rent and for sale across Da Nang and Hoi An, Vietnam — aggregated from local agents and refreshed daily.',
  alternates: { canonical: 'https://danangmls.com/about' },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">About DanangMLS</h1>
        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS is a multiple listing service for real estate in <strong>Da Nang and Hoi An, Vietnam</strong>.
          We aggregate houses, apartments, villas, and land for rent and for sale into one clean, searchable
          place, available in both English and Vietnamese.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Listings are collected from local agents and property owners and refreshed daily, so what you see
          reflects what is currently on the market. Each listing links you directly to the people handling the
          property — we make the inventory easy to browse and compare.
        </p>
        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">What we cover</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Rentals and sales across every district of Da Nang — Hai Chau, Thanh Khe, Son Tra, Ngu Hanh Son,
          Cam Le, and Lien Chieu — as well as nearby Hoi An. From beachfront apartments near My Khe and An Thuong
          to family houses, townhouses, villas, and land plots.
        </p>
        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Get in touch</h2>
        <p className="text-slate-600 leading-relaxed">
          DanangMLS is operated by the Da Nang Homes team. Reach us on{' '}
          <a href="tel:+84973747373" className="text-blue-600 hover:underline">+84 973 747 373</a> (Zalo / WhatsApp),
          by email at{' '}
          <a href="mailto:danang4homes@gmail.com" className="text-blue-600 hover:underline">danang4homes@gmail.com</a>,
          or visit{' '}
          <a href="https://danang.homes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">danang.homes</a>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
