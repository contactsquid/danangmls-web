import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Chính sách bảo mật của DanangMLS: dữ liệu nào được thu thập, cách sử dụng cookie và quyền của người dùng.',
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
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Chính sách bảo mật</h1>
        <p className="text-slate-400 text-sm mb-6">Cập nhật lần cuối: Tháng 6, 2026</p>

        <p className="text-slate-600 leading-relaxed mb-4">
          DanangMLS (&ldquo;chúng tôi&rdquo;) vận hành website danangmls.com. Chính sách này trình bày phạm vi dữ
          liệu hạn chế mà chúng tôi xử lý khi người dùng truy cập website.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Thông tin chúng tôi thu thập</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Người dùng không cần tạo tài khoản hay cung cấp thông tin cá nhân để xem tin đăng. Chúng tôi thu thập
          dữ liệu thống kê tổng hợp thông thường (số trang đã xem, khu vực truy cập ước tính, loại thiết bị, nguồn
          truy cập) nhằm hiểu cách website đang được sử dụng và cải thiện website. Khi người dùng liên hệ trực
          tiếp qua điện thoại, ứng dụng nhắn tin hoặc email, chúng tôi chỉ nhận những thông tin mà người dùng chủ
          động cung cấp.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Cookie</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Chúng tôi sử dụng cookie và các công nghệ tương tự để duy trì các chức năng cơ bản của website và phục
          vụ thống kê truy cập. Người dùng có thể tắt cookie trong phần cài đặt trình duyệt; khi đó website vẫn
          cho phép xem tin đăng bình thường.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Dịch vụ bên thứ ba</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Website được vận hành trên hạ tầng của Vercel và có thể sử dụng dịch vụ thống kê của bên thứ ba. Hình
          ảnh tin đăng được lưu trữ trên CDN hình ảnh của chúng tôi. Các nhà cung cấp này xử lý dữ liệu kỹ thuật
          của mỗi lượt truy cập (như địa chỉ IP) trong quá trình cung cấp website. Chúng tôi không bán thông tin
          cá nhân của người dùng.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Quyền của người dùng</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Người dùng đã liên hệ với chúng tôi và muốn xóa nội dung tin nhắn đã gửi có thể yêu cầu qua email{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>{' '}
          và chúng tôi sẽ tiến hành xóa.
        </p>

        <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-2">Liên hệ</h2>
        <p className="text-slate-600 leading-relaxed">
          Mọi câu hỏi về chính sách này, vui lòng gửi email tới{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>.
        </p>
      </main>
    </div>
  );
}
