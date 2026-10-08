import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Liên hệ DanangMLS khi cần hỏi về nhà cho thuê hoặc bất động sản đang bán tại Đà Nẵng và Hội An. Hỗ trợ qua Zalo, WhatsApp hoặc email.',
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
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Liên hệ</h1>
        <p className="text-slate-600 leading-relaxed mb-6">
          Bạn đã chọn được căn ưng ý hay cần người hỗ trợ tìm nhà? Hãy liên hệ với chúng tôi để được kết nối với
          người phụ trách và hẹn lịch xem nhà. Chúng tôi hỗ trợ bằng cả tiếng Việt và tiếng Anh.
        </p>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3 text-slate-700">
          <p>📱 <strong>Zalo / WhatsApp:</strong>{' '}
            <a href="tel:+84973747373" className="text-blue-600 hover:underline">+84 973 747 373</a>
          </p>
          <p>📧 <strong>Email:</strong>{' '}
            <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>
          </p>
          <p>🌐 <strong>Website:</strong>{' '}
            <a href="https://danang.homes/vi" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">danang.homes/vi</a>
          </p>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed mt-6">
          Khi hỏi về một tin đăng cụ thể, bạn vui lòng gửi kèm đường link tin đăng để chúng tôi tra cứu nhanh hơn.
          Nhắn qua WhatsApp để được phản hồi sớm hơn.
        </p>
      </main>
    </div>
  );
}
