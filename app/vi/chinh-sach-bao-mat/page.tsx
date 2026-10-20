import type { Metadata } from 'next';
import { footerAlternates } from '@/lib/footerPages';

// Rewritten 2026-10-20 (Blake): the old policy said the site needs no accounts, which stopped being true when
// agent accounts launched, and it did not cover consent, cross-border storage or deletion as Nghị định
// 13/2023/NĐ-CP expects. Same text on all four MLS sites (template: ~/.openclaw/data/privacy-vi.tsx.tmpl,
// Vietnamese version of ~/.openclaw/data/privacy-en.tsx.tmpl).

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Cách DanangMLS thu thập, sử dụng và bảo vệ dữ liệu cá nhân, bao gồm dữ liệu tài khoản môi giới.',
  alternates: footerAlternates('privacy', 'vi'),
};

const H2 = 'text-xl font-semibold text-slate-900 mt-8 mb-3';
const P = 'text-slate-700 leading-relaxed mb-3';
const UL = 'list-disc pl-6 space-y-1 text-slate-700 mb-3';

export default function ViPrivacyPolicyPage() {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Chính sách bảo mật</h1>
        <p className="text-sm text-slate-500 mb-8">Cập nhật lần cuối: 20/10/2026</p>

        <p className={P}>
          DanangMLS (&ldquo;chúng tôi&rdquo;) vận hành website danangmls.com và do đội ngũ Da Nang Homes quản lý. Chính sách
          này nêu rõ những dữ liệu cá nhân chúng tôi xử lý, mục đích xử lý, nơi lưu trữ và các lựa chọn của người dùng.
        </p>

        <h2 className={H2}>Khi truy cập website</h2>
        <p className={P}>
          Người dùng không cần tạo tài khoản để xem tin đăng. Chúng tôi sử dụng công cụ thống kê tổng hợp, không dùng
          cookie (ví dụ: trang đã xem, khu vực tương đối, loại thiết bị và trang giới thiệu) để nắm được cách website được
          sử dụng và cải thiện website. Dữ liệu thống kê này không cho phép nhận diện cá nhân người dùng.
        </p>

        <h2 className={H2}>Nguồn gốc tin đăng</h2>
        <p className={P}>
          Tin đăng được tổng hợp từ các bài viết công khai trong các nhóm Facebook công khai và từ môi giới đăng tin trực
          tiếp trên DanangMLS. Tin đăng có thể hiển thị tên môi giới và thông tin liên hệ có trong bài viết công khai ban
          đầu. Môi giới hoặc chủ nhà muốn chỉnh sửa hay gỡ tin đăng có thể gửi email cho chúng tôi để được xử lý.
        </p>

        <h2 className={H2}>Tài khoản môi giới</h2>
        <p className={P}>Khi môi giới tạo tài khoản, chúng tôi thu thập:</p>
        <ul className={UL}>
          <li>họ và tên, địa chỉ email và số điện thoại di động (bắt buộc);</li>
          <li>các thông tin môi giới tự bổ sung vào hồ sơ, như ảnh đại diện, giới thiệu bản thân, nơi làm việc, Zalo hoặc WhatsApp;</li>
          <li>tin đăng và hình ảnh môi giới đăng tải.</li>
        </ul>
        <p className={P}>Chúng tôi sử dụng các thông tin này để:</p>
        <ul className={UL}>
          <li>tạo hồ sơ môi giới và đăng tải tin của môi giới;</li>
          <li>giúp người thuê và người mua liên hệ với môi giới về tin đăng;</li>
          <li>gửi email liên quan đến tài khoản: xác nhận đăng ký, đặt lại mật khẩu và tối đa ba email nhắc đăng tin đầu
            tiên (mỗi email nhắc đều có liên kết hủy đăng ký chỉ với một lần nhấp);</li>
          <li>xét duyệt tài khoản mới và ngăn chặn thư rác trên website.</li>
        </ul>
        <p className={P}>
          Chúng tôi xử lý dữ liệu này trên cơ sở sự đồng ý mà môi giới đưa ra khi tạo tài khoản, và có ghi nhận thời điểm
          đồng ý. Tên và các thông tin hồ sơ do môi giới bổ sung được hiển thị công khai trên trang hồ sơ; số điện thoại có
          thể hiển thị trên tin đăng để khách hàng liên hệ. Địa chỉ email không bao giờ được hiển thị công khai.
        </p>

        <h2 className={H2}>Thông tin người dùng gửi cho chúng tôi</h2>
        <p className={P}>
          Khi người dùng liên hệ qua điện thoại, ứng dụng nhắn tin hoặc email, chúng tôi nhận những thông tin người dùng tự
          chọn cung cấp và chỉ sử dụng thông tin đó để phản hồi.
        </p>

        <h2 className={H2}>Cookie và bộ nhớ trình duyệt</h2>
        <p className={P}>
          Tài khoản môi giới sử dụng cookie để duy trì trạng thái đăng nhập. Website cũng lưu bộ lọc tìm kiếm trong trình
          duyệt để bộ lọc vẫn còn khi người dùng quay lại trang. Chúng tôi không sử dụng cookie quảng cáo. Người dùng có thể
          xóa cookie và dữ liệu website trong trình duyệt bất cứ lúc nào mà vẫn xem website bình thường.
        </p>

        <h2 className={H2}>Nhà cung cấp dịch vụ và nơi lưu trữ dữ liệu</h2>
        <p className={P}>Chúng tôi sử dụng các nhà cung cấp sau để vận hành website; các bên này xử lý dữ liệu thay mặt chúng tôi:</p>
        <ul className={UL}>
          <li>Vercel: lưu trữ website và thống kê truy cập;</li>
          <li>Supabase: tài khoản môi giới và cơ sở dữ liệu tin đăng, trên máy chủ đặt tại Singapore;</li>
          <li>Cloudflare: lưu trữ và phân phối hình ảnh tin đăng;</li>
          <li>Google: gửi email tài khoản và lưu trữ dữ liệu tin đăng.</li>
        </ul>
        <p className={P}>
          Do các nhà cung cấp này vận hành máy chủ ngoài lãnh thổ Việt Nam, dữ liệu cá nhân có thể được chuyển ra và lưu trữ
          tại nước ngoài, trong đó có Singapore. Chúng tôi không bán thông tin cá nhân.
        </p>

        <h2 className={H2}>Thời hạn lưu trữ dữ liệu</h2>
        <p className={P}>
          Dữ liệu tài khoản được lưu trữ cho đến khi môi giới xóa tài khoản. Khi xóa tài khoản, hồ sơ, thông tin đăng nhập
          và dữ liệu email nhắc của môi giới sẽ bị xóa. Tin đã đăng không bị xóa cùng tài khoản mà tự động hết hạn (tin cho
          thuê sau 60 ngày, tin rao bán sau 90 ngày). Thông tin người dùng gửi cho chúng tôi sẽ được xóa khi có yêu cầu.
        </p>

        <h2 className={H2}>Quyền của chủ thể dữ liệu</h2>
        <p className={P}>
          Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, chủ thể dữ liệu có quyền yêu cầu truy cập, chỉnh sửa hoặc
          xóa dữ liệu cá nhân, rút lại sự đồng ý, hạn chế hoặc phản đối việc xử lý dữ liệu. Môi giới có thể chỉnh sửa hồ sơ
          bất cứ lúc nào, tự xóa tài khoản trên trang hồ sơ và hủy nhận email nhắc qua liên kết trong mỗi email. Mọi yêu cầu
          khác xin gửi về{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>.
        </p>

        <h2 className={H2}>Thay đổi chính sách</h2>
        <p className={P}>
          Khi thay đổi chính sách này, chúng tôi sẽ cập nhật ngày ở đầu trang.
        </p>

        <h2 className={H2}>Liên hệ</h2>
        <p className={P}>
          Mọi thắc mắc về chính sách này xin gửi email về{' '}
          <a href="mailto:hello@danang.homes" className="text-blue-600 hover:underline">hello@danang.homes</a>.
        </p>
      </main>
    </div>
  );
}
