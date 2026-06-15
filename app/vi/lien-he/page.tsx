import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên hệ DanangMLS',
  description: 'Liên hệ đội ngũ DanangMLS về bất kỳ bất động sản cho thuê hoặc đang bán nào tại Đà Nẵng và Hội An. Hỗ trợ qua Zalo, WhatsApp hoặc email.',
  alternates: {
    canonical: 'https://danangmls.com/vi/lien-he',
    languages: {
      en: 'https://danangmls.com/contact',
      vi: 'https://danangmls.com/vi/lien-he',
      'x-default': 'https://danangmls.com/contact',
    },
  },
  openGraph: { locale: 'vi_VN' },
};

export default function ViContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Liên hệ</h1>
        <p className="text-slate-600 leading-relaxed mb-6">
          Bạn đã tìm thấy bất động sản ưng ý, hoặc cần hỗ trợ tìm nhà? Hãy liên hệ với chúng tôi — chúng tôi sẽ
          kết nối bạn với người phụ trách và sắp xếp lịch xem nhà. Chúng tôi hỗ trợ cả tiếng Việt và tiếng Anh.
        </p>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3 text-slate-700">
          <p>📱 <strong>Zalo / WhatsApp:</strong>{' '}
            <a href="tel:+84973747373" className="text-blue-600 hover:underline">+84 973 747 373</a>
          </p>
          <p>📧 <strong>Email:</strong>{' '}
            <a href="mailto:danang4homes@gmail.com" className="text-blue-600 hover:underline">danang4homes@gmail.com</a>
          </p>
          <p>🌐 <strong>Website:</strong>{' '}
            <a href="https://danang.homes/vi" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">danang.homes/vi</a>
          </p>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed mt-6">
          Khi nhắn tin về một tin đăng cụ thể, vui lòng gửi kèm đường dẫn của tin đăng để chúng tôi tra cứu nhanh
          thông tin. Cách liên hệ nhanh nhất là qua WhatsApp.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
