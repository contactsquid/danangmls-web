import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description: 'Điều khoản sử dụng website DanangMLS: phạm vi thông tin tin đăng, giới hạn trách nhiệm và quy định sử dụng nội dung.',
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
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Điều khoản sử dụng</h1>
        <p className="text-slate-400 text-sm mb-6">Cập nhật lần cuối: Tháng 6, 2026</p>

        <p className="text-slate-600 leading-relaxed mb-4">
          Khi sử dụng danangmls.com (&ldquo;website&rdquo;), người dùng đồng ý với các điều khoản dưới đây.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Thông tin tin đăng</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS tổng hợp tin đăng bất động sản tại Đà Nẵng và Hội An từ các môi giới và chủ nhà địa phương.
          Chúng tôi cố gắng cập nhật tin đăng thường xuyên, nhưng không sở hữu các bất động sản này nên không thể
          bảo đảm độ chính xác, tình trạng còn trống, giá hay hiện trạng của bất kỳ tin đăng nào. Người dùng cần
          xác minh thông tin trực tiếp với môi giới hoặc chủ nhà trước khi quyết định hay thanh toán.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Không bảo đảm</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Website được cung cấp theo &ldquo;nguyên trạng&rdquo; và chỉ nhằm mục đích tham khảo. Trong phạm vi
          pháp luật cho phép, chúng tôi không chịu trách nhiệm đối với bất kỳ tổn thất nào phát sinh do dựa vào
          thông tin hiển thị trên website, kể cả sai sót, thiếu sót trong tin đăng hoặc hành vi của bên thứ ba.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Quy định sử dụng</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Người dùng không được thu thập tự động (scrape), sao chép hoặc đăng lại hàng loạt nội dung của website,
          và không được dùng website để gửi thư rác hay thực hiện liên lạc trái pháp luật. Nội dung và hình ảnh
          tin đăng thuộc quyền sở hữu của chủ sở hữu tương ứng.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Liên hệ</h2>
        <p className="text-slate-600 leading-relaxed">
          Mọi câu hỏi về các điều khoản này, vui lòng gửi email tới{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>.
        </p>
      </main>
    </div>
  );
}
