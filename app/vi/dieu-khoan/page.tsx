import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description: 'Điều khoản sử dụng website DanangMLS.',
  alternates: {
    canonical: 'https://danangmls.com/vi/dieu-khoan',
    languages: {
      en: 'https://danangmls.com/terms',
      vi: 'https://danangmls.com/vi/dieu-khoan',
      'x-default': 'https://danangmls.com/terms',
    },
  },
  openGraph: { locale: 'vi_VN' },
};

export default function ViTermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Điều khoản sử dụng</h1>
        <p className="text-slate-400 text-sm mb-6">Cập nhật lần cuối: Tháng 6, 2026</p>

        <p className="text-slate-600 leading-relaxed mb-4">
          Bằng việc sử dụng danangmls.com (&ldquo;trang web&rdquo;), bạn đồng ý với các điều khoản này.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Về các tin đăng</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS tổng hợp các tin đăng bất động sản tại Đà Nẵng và Hội An từ các đại lý và chủ nhà tại địa
          phương. Chúng tôi cố gắng cập nhật tin đăng, nhưng chúng tôi không sở hữu các bất động sản và không thể
          đảm bảo tính chính xác, tình trạng còn trống, giá cả hay hiện trạng của bất kỳ tin đăng nào. Hãy luôn
          xác nhận thông tin trực tiếp với đại lý hoặc chủ nhà trước khi đưa ra quyết định hoặc thanh toán.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Không bảo đảm</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Trang web được cung cấp &ldquo;nguyên trạng&rdquo; cho mục đích thông tin. Trong phạm vi pháp luật cho
          phép, chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất nào phát sinh từ việc tin tưởng vào thông tin
          hiển thị tại đây, bao gồm lỗi tin đăng, thiếu sót hoặc hành vi của bên thứ ba.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Sử dụng hợp lệ</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Không thu thập dữ liệu (scrape), sao chép hoặc đăng lại hàng loạt nội dung của trang web, và không sử
          dụng trang web để gửi thư rác hoặc các liên lạc trái pháp luật. Nội dung và hình ảnh tin đăng vẫn thuộc
          quyền sở hữu của chủ sở hữu tương ứng.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Liên hệ</h2>
        <p className="text-slate-600 leading-relaxed">
          Có câu hỏi về các điều khoản này? Gửi email tới{' '}
          <a href="mailto:danang4homes@gmail.com" className="text-blue-600 hover:underline">danang4homes@gmail.com</a>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
