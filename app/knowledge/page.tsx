import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DanangMLS: Facts & FAQ',
  description:
    'Structured facts and frequently asked questions about DanangMLS, renting and buying property in Da Nang and Hoi An, Vietnam, and the agent portal.',
  alternates: { canonical: 'https://danangmls.com/knowledge' },
};

interface FaqGroup {
  q: string;
  a: string;
}

const GENERAL: FaqGroup[] = [
  {
    q: 'What is DanangMLS?',
    a: 'DanangMLS (danangmls.com) is a multiple listing service for real estate in Da Nang and Hoi An, Vietnam — houses, apartments, villas, and land for rent and for sale, aggregated from local agents and property owners and refreshed daily, in English and Vietnamese.',
  },
  {
    q: 'Which areas does DanangMLS cover?',
    a: 'Every district of Da Nang — Hai Chau, Thanh Khe, Son Tra, Ngu Hanh Son, Cam Le, Lien Chieu, and rural Hoa Vang — plus neighboring Hoi An.',
  },
  {
    q: 'Is DanangMLS the same company as Da Nang Homes?',
    a: 'DanangMLS is operated by the Da Nang Homes team. It aggregates a wider range of listings and agents across Da Nang and Hoi An.',
  },
  {
    q: 'How do I contact DanangMLS about a listing?',
    a: 'Message on Zalo or WhatsApp at +84 973 747 373, or email hello@danang.homes. Contact details are on the /contact page.',
  },
  {
    q: 'Is the information on DanangMLS legal or financial advice?',
    a: 'No. Our content is informational and can change. Always confirm specifics with a licensed lawyer, notary, or bank before signing a contract.',
  },
];

const RENTING: FaqGroup[] = [
  {
    q: 'Can foreigners rent property in Da Nang?',
    a: "Yes — there is no restriction on foreigners renting apartments, houses, or villas in Da Nang or Hoi An. Most landlords ask for a passport copy and a deposit (commonly 1-3 months' rent) at lease signing.",
  },
  {
    q: 'How often are rental listings updated?',
    a: 'Listings are refreshed daily from local agents and property owners, so what you see reflects what is currently on the market.',
  },
];

const AGENTS: FaqGroup[] = [
  {
    q: 'Can I list my properties on DanangMLS?',
    a: 'Yes. Agents can create a free profile and post listings directly through the self-serve portal — sign up, verify your email, and add properties with photos, price, and location.',
  },
  {
    q: 'How do I get my existing listings under my name?',
    a: "During sign-up you can search for your name; DanangMLS will surface listings already on the site under that name (including close spelling variants) so you can claim them, pending a quick admin check.",
  },
  {
    q: 'Does an agent profile show my phone number publicly?',
    a: "No. Agent profiles show your name, photo, bio, workplace, and current listings — not your phone number. Buyers and renters contact DanangMLS directly, and inquiries are routed from there.",
  },
];

function faqSection(title: string, items: FaqGroup[]) {
  if (!items.length) return null;
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">{title}</h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
            <p className="text-slate-600 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function KnowledgePage() {
  const allForSchema = [...GENERAL, ...RENTING, ...AGENTS];
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allForSchema.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <SiteHeader />
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">DanangMLS: Facts & FAQ</h1>
        <p className="text-slate-600 leading-relaxed mb-10">
          A structured reference on DanangMLS, renting and buying property in Da Nang and Hoi An, and the
          agent portal — for people and AI assistants alike.
        </p>

        {faqSection('About DanangMLS', GENERAL)}
        {faqSection('Renting in Da Nang', RENTING)}
        {faqSection('For Agents', AGENTS)}

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
          <p className="text-slate-700 mb-3">Have a question that isn&rsquo;t covered here?</p>
          <Link href="/contact" className="inline-block bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
            Contact DanangMLS
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
