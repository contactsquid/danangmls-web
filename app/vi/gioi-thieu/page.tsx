import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description: 'DanangMLS tổng hợp tin cho thuê và mua bán nhà, căn hộ, biệt thự, đất nền tại Đà Nẵng và Hội An, cập nhật mỗi ngày từ môi giới địa phương.',
  alternates: {
    canonical: 'https://danangmls.com/vi/gioi-thieu',
    languages: {
      en: 'https://danangmls.com/about',
      vi: 'https://danangmls.com/vi/gioi-thieu',
      'x-default': 'https://danangmls.com/about',
    },
  },
  openGraph: { locale: 'vi_VN' },
};

export default function ViAboutPage() {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Giới thiệu về DanangMLS</h1>
        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS là trang tổng hợp tin đăng bất động sản tại <strong>Đà Nẵng và Hội An, Việt Nam</strong>.
          Nhà, căn hộ, biệt thự và đất nền cho thuê hay đang bán đều được gom về một chỗ để bạn dễ tìm, bằng cả
          tiếng Việt lẫn tiếng Anh.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Tin đăng đến từ môi giới và chủ nhà địa phương, được cập nhật mỗi ngày nên luôn sát với thị trường hiện
          tại. Mỗi tin đăng giúp bạn liên hệ thẳng với người phụ trách bất động sản đó; phần việc của chúng tôi là
          giúp bạn xem và so sánh các lựa chọn nhanh hơn.
        </p>
        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Khu vực hoạt động</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Nhà cho thuê và mua bán tại khắp các quận của Đà Nẵng (Hải Châu, Thanh Khê, Sơn Trà, Ngũ Hành Sơn, Cẩm Lệ,
          Liên Chiểu) và Hội An lân cận: từ căn hộ ven biển gần Mỹ Khê, An Thượng đến nhà phố, biệt thự và đất
          nền.
        </p>
        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Liên hệ</h2>
        <p className="text-slate-600 leading-relaxed">
          DanangMLS do đội ngũ Da Nang Homes vận hành. Bạn có thể liên hệ với chúng tôi qua số{' '}
          <a href="tel:+84973747373" className="text-blue-600 hover:underline">+84 973 747 373</a> (Zalo / WhatsApp),
          email{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>,
          hoặc truy cập{' '}
          <a href="https://danang.homes/vi" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">danang.homes/vi</a>.
        </p>
      </main>
    </div>
  );
}
