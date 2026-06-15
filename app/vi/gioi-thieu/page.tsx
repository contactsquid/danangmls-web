import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới thiệu về DanangMLS',
  description: 'DanangMLS là dịch vụ tổng hợp tin đăng nhà, căn hộ, biệt thự và đất nền cho thuê và bán tại Đà Nẵng và Hội An — cập nhật hàng ngày từ các đại lý địa phương.',
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Giới thiệu về DanangMLS</h1>
        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS là dịch vụ tổng hợp tin đăng bất động sản tại <strong>Đà Nẵng và Hội An, Việt Nam</strong>.
          Chúng tôi tập hợp nhà, căn hộ, biệt thự và đất nền cho thuê và bán vào một nơi duy nhất, dễ tìm kiếm,
          hỗ trợ cả tiếng Việt và tiếng Anh.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Tin đăng được thu thập từ các đại lý và chủ nhà tại địa phương, cập nhật hàng ngày, vì vậy những gì bạn
          thấy phản ánh đúng thị trường hiện tại. Mỗi tin đăng kết nối bạn trực tiếp với người phụ trách bất động
          sản đó — chúng tôi giúp việc duyệt và so sánh nguồn hàng trở nên dễ dàng.
        </p>
        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Khu vực hoạt động</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Cho thuê và mua bán trên khắp các quận của Đà Nẵng — Hải Châu, Thanh Khê, Sơn Trà, Ngũ Hành Sơn, Cẩm Lệ
          và Liên Chiểu — cùng với Hội An lân cận. Từ căn hộ ven biển gần Mỹ Khê và An Thượng đến nhà phố, biệt thự
          và đất nền.
        </p>
        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Liên hệ</h2>
        <p className="text-slate-600 leading-relaxed">
          DanangMLS được vận hành bởi đội ngũ Da Nang Homes. Liên hệ với chúng tôi qua{' '}
          <a href="tel:+84973747373" className="text-blue-600 hover:underline">+84 973 747 373</a> (Zalo / WhatsApp),
          email{' '}
          <a href="mailto:danang4homes@gmail.com" className="text-blue-600 hover:underline">danang4homes@gmail.com</a>,
          hoặc truy cập{' '}
          <a href="https://danang.homes/vi" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">danang.homes/vi</a>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
