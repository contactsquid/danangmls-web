import Link from 'next/link';
import { footerAlternates } from '@/lib/footerPages';
import type { Metadata } from 'next';

// Vietnamese twin of app/knowledge/page.tsx — same sections and facts, written natively in
// Vietnamese. One register on the whole page: "bạn" (kiểu cũ tone marks, e.g. Hòa Vang).
export const metadata: Metadata = {
  title: 'DanangMLS: Thông tin & hỏi đáp',
  description:
    'Thông tin và câu hỏi thường gặp về DanangMLS, về thuê, mua bất động sản tại Đà Nẵng, Hội An và cổng đăng tin dành cho môi giới.',
  alternates: footerAlternates('knowledge', 'vi'),
  openGraph: { locale: 'vi_VN' },
};

interface FaqGroup {
  q: string;
  a: string;
  links?: { href: string; label: string }[];
}

const GENERAL: FaqGroup[] = [
  {
    q: 'DanangMLS là gì?',
    a: 'DanangMLS (danangmls.com) là hệ thống niêm yết bất động sản chung (MLS) tại Đà Nẵng và Hội An. Tại đây có nhà phố, căn hộ, biệt thự và đất cho thuê, cần bán, được tổng hợp từ môi giới và chủ nhà địa phương, cập nhật hằng ngày bằng tiếng Việt, tiếng Anh, tiếng Hàn và tiếng Nga.',
    links: [
      { href: '/vi/thue', label: 'Xem nhà cho thuê' },
      { href: '/vi/mua-ban', label: 'Xem nhà đất cần bán' },
    ],
  },
  {
    q: 'DanangMLS có tin đăng ở những khu vực nào?',
    a: 'Tất cả các quận, huyện của Đà Nẵng: Hải Châu, Thanh Khê, Sơn Trà, Ngũ Hành Sơn, Cẩm Lệ, Liên Chiểu và huyện Hòa Vang, cùng với Hội An ngay bên cạnh.',
  },
  {
    q: 'DanangMLS và Da Nang Homes có phải là một không?',
    a: 'DanangMLS do đội ngũ Da Nang Homes vận hành, nhưng tổng hợp nhiều tin đăng và nhiều môi giới hơn trên khắp Đà Nẵng và Hội An.',
  },
  {
    q: 'Muốn hỏi về một tin đăng thì liên hệ DanangMLS bằng cách nào?',
    a: 'Bạn nhắn Zalo hoặc WhatsApp qua số +84 973 747 373, hoặc gửi email đến hello@danang.homes. Thông tin liên hệ đầy đủ có tại trang Liên hệ.',
    links: [{ href: '/vi/lien-he', label: 'Trang Liên hệ' }],
  },
  {
    q: 'Thông tin trên DanangMLS có phải là tư vấn pháp lý hay tài chính không?',
    a: 'Không. Nội dung trên trang chỉ để tham khảo và có thể thay đổi. Trước khi ký hợp đồng, bạn nên xác nhận lại từng chi tiết với luật sư, công chứng viên hoặc ngân hàng.',
  },
];

const RENTING: FaqGroup[] = [
  {
    q: 'Người nước ngoài có được thuê nhà ở Đà Nẵng không?',
    a: 'Được. Không có quy định nào hạn chế người nước ngoài thuê căn hộ, nhà phố hay biệt thự tại Đà Nẵng và Hội An. Khi ký hợp đồng, phần lớn chủ nhà sẽ yêu cầu bản sao hộ chiếu và tiền cọc, thường từ 1 đến 3 tháng tiền thuê.',
  },
  {
    q: 'Tin cho thuê được cập nhật bao lâu một lần?',
    a: 'Tin đăng được làm mới hằng ngày từ môi giới và chủ nhà địa phương, nên những căn bạn đang xem là những căn đang thực sự có trên thị trường.',
    links: [{ href: '/vi/thue', label: 'Xem tin cho thuê mới nhất' }],
  },
];

const AGENTS: FaqGroup[] = [
  {
    q: 'Tôi có thể đăng tin bất động sản lên DanangMLS không?',
    a: 'Được. Môi giới có thể tạo hồ sơ miễn phí và tự đăng tin qua cổng dành cho môi giới: đăng ký, xác nhận email, rồi thêm bất động sản kèm hình ảnh, giá và vị trí.',
    links: [{ href: '/vi/tai-khoan/dang-ky', label: 'Đăng ký tài khoản môi giới' }],
  },
  {
    q: 'Làm sao để những tin đã có trên trang đứng tên tôi?',
    a: 'Khi đăng ký, bạn tìm theo tên của mình. DanangMLS sẽ hiện các tin đang có trên trang dưới tên đó, kể cả các cách viết gần giống, để bạn nhận về hồ sơ của mình sau một bước kiểm tra nhanh của quản trị viên.',
  },
  {
    q: 'Hồ sơ môi giới có công khai số điện thoại của tôi không?',
    a: 'Không. Hồ sơ môi giới hiển thị tên, ảnh, phần giới thiệu, nơi làm việc và các tin bạn đang đăng, không hiển thị số điện thoại. Người mua và người thuê liên hệ trực tiếp với DanangMLS, rồi yêu cầu sẽ được chuyển tiếp từ đó.',
    links: [{ href: '/vi/moi-gioi', label: 'Xem danh sách môi giới' }],
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
            {item.links && (
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {item.links.map(l => (
                  <Link key={l.href} href={l.href} className="text-blue-600 hover:underline">{l.label} &rarr;</Link>
                ))}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ViFaqPage() {
  const allForSchema = [...GENERAL, ...RENTING, ...AGENTS];
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'vi',
    mainEntity: allForSchema.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">DanangMLS: Thông tin &amp; hỏi đáp</h1>
        <p className="text-slate-600 leading-relaxed mb-10">
          Tổng hợp thông tin về DanangMLS, về việc thuê và mua bất động sản tại Đà Nẵng, Hội An và cổng đăng tin
          dành cho môi giới, viết cho cả người đọc lẫn các trợ lý AI.
        </p>

        {faqSection('Về DanangMLS', GENERAL)}
        {faqSection('Thuê nhà tại Đà Nẵng', RENTING)}
        {faqSection('Dành cho môi giới', AGENTS)}

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
          <p className="text-slate-700 mb-3">Bạn có câu hỏi chưa được giải đáp ở đây?</p>
          <Link href="/vi/lien-he" className="inline-block bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
            Liên hệ DanangMLS
          </Link>
        </div>
      </main>
    </div>
  );
}
