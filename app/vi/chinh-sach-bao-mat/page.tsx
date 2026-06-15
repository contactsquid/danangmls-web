import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Cách DanangMLS xử lý dữ liệu và cookie.',
  alternates: {
    canonical: 'https://danangmls.com/vi/chinh-sach-bao-mat',
    languages: {
      en: 'https://danangmls.com/privacy-policy',
      vi: 'https://danangmls.com/vi/chinh-sach-bao-mat',
      'x-default': 'https://danangmls.com/privacy-policy',
    },
  },
  openGraph: { locale: 'vi_VN' },
};

export default function ViPrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Chính sách bảo mật</h1>
        <p className="text-slate-400 text-sm mb-6">Cập nhật lần cuối: Tháng 6, 2026</p>

        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS (&ldquo;chúng tôi&rdquo;) vận hành website danangmls.com. Chính sách này giải thích những dữ
          liệu hạn chế mà chúng tôi xử lý khi bạn truy cập trang web.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Thông tin chúng tôi thu thập</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Chúng tôi không yêu cầu tạo tài khoản và không yêu cầu bạn cung cấp thông tin cá nhân để xem tin đăng.
          Chúng tôi thu thập dữ liệu phân tích tổng hợp tiêu chuẩn (như số trang đã xem, khu vực gần đúng, loại
          thiết bị và nguồn truy cập) để hiểu cách trang web được sử dụng và cải thiện nó. Nếu bạn liên hệ trực
          tiếp qua điện thoại, ứng dụng nhắn tin hoặc email, chúng tôi nhận được thông tin bạn chủ động chia sẻ.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Cookie</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Chúng tôi sử dụng cookie và các công nghệ tương tự cho chức năng cơ bản của trang web và phân tích. Bạn
          có thể tắt cookie trong cài đặt trình duyệt; trang web vẫn hoạt động để duyệt tin đăng.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Dịch vụ bên thứ ba</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Trang web được phục vụ qua Vercel và có thể sử dụng dịch vụ phân tích của bên thứ ba. Hình ảnh tin đăng
          được lưu trữ trên CDN hình ảnh của chúng tôi. Các nhà cung cấp này xử lý dữ liệu kỹ thuật của yêu cầu
          (như địa chỉ IP) như một phần của việc phục vụ trang web. Chúng tôi không bán thông tin cá nhân của bạn.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Lựa chọn của bạn</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Nếu bạn đã liên hệ với chúng tôi và muốn chúng tôi xóa dữ liệu tin nhắn bạn đã gửi, hãy gửi email tới{' '}
          <a href="mailto:danang4homes@gmail.com" className="text-blue-600 hover:underline">danang4homes@gmail.com</a>{' '}
          và chúng tôi sẽ xóa.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Liên hệ</h2>
        <p className="text-slate-600 leading-relaxed">
          Có câu hỏi về chính sách này? Gửi email tới{' '}
          <a href="mailto:danang4homes@gmail.com" className="text-blue-600 hover:underline">danang4homes@gmail.com</a>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
