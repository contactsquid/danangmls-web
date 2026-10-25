// The buyer's guide + building list on the Foreign-Buyer-Eligible page (/for-sale/foreign-buyer-eligible).
// Facts come from the Da Nang Department of Construction lists (see lib/foreignEligibleBuildings.ts),
// checked 2026-10-25. Korean and Russian pages show the English guide until it is translated.
import Link from 'next/link';
import type { Lang } from '@/lib/translations';
import type { Listing } from '@/lib/types';
import { FOREIGN_APPROVED_BUILDINGS, FOREIGN_NOT_APPROVED } from '@/lib/foreignEligibleBuildings';

const T = {
  en: {
    h2: 'Buying property in Da Nang as a foreigner',
    intro: 'Foreigners can own homes in Da Nang, but only in projects the city has opened to foreign buyers, and only up to a quota in each one. Here are the rules, how a purchase works, and every project the Da Nang Department of Construction has approved.',
    rulesH: 'The rules in brief',
    rules: [
      ['Who can buy', 'Foreign individuals allowed to enter Vietnam (a passport with a valid entry stamp; people with diplomatic immunity are excluded), and foreign organizations operating in Vietnam.'],
      ['What you can own', 'Apartments, and individual houses or villas, in commercial housing projects the city has opened to foreign ownership. Not land, and nothing in national defense or security zones.'],
      ['How much', 'Foreigners together may own at most 30% of the apartments in one building. For houses and villas: at most 10% of the houses in a project, and never more than 250 in one ward.'],
      ['For how long', 'You receive an ownership certificate (the “pink book”) valid for up to 50 years from issue, extendable once. Vietnamese owners hold the same homes long term.'],
      ['Renting out and selling', 'You may rent the home out, sell it, give it away or leave it to heirs. A Vietnamese buyer of your unit gets long-term ownership; a foreign buyer takes over the rest of your term.'],
    ],
    stepsH: 'How a purchase works',
    steps: [
      'Check that the project is on the city’s list below, and ask the agent to confirm with the building’s management that foreign quota is still available.',
      'Sign a deposit agreement, then a Sale and Purchase Agreement (SPA): with the developer for a new unit, or a notarized contract with the owner for a resale.',
      'Pay in Vietnamese dong through a bank account in Vietnam, and keep the transfer records. You will need them to send sale proceeds abroad later.',
      'The developer or the seller files for the pink book in your name at the Da Nang land registration office.',
    ],
    costs: 'Typical costs: 10% VAT on new units (usually included in the price), a 2% maintenance fund on new units, a 0.5% registration fee, and 2% personal income tax on a resale (usually paid by the seller). Have a lawyer review the contract before you pay a deposit.',
    approvedH: 'Projects approved for foreign ownership',
    approvedNote: 'Published by the Da Nang Department of Construction in seven batches, 2019 to 2026. Districts use the pre-2025 names most people still use.',
    cols: ['Project', 'District', 'Approved', 'Foreign quota', 'For sale now'],
    official: 'official name',
    see: 'See',
    unlistedH: 'Marketed to foreign buyers, but not on the city’s lists',
    unlistedNote: 'Agents advertise these projects to foreigners, but they do not appear on any list the Department of Construction has published. Ask the developer for the project’s foreign-ownership approval before you pay a deposit.',
    notH: 'Not open to foreign ownership',
    leaseH: 'Long-term leases are not ownership',
    lease: 'Some resort villas, branded residences and condotels on tourism or commercial land are sold to foreigners on long-term leases (often up to 50 years) instead of with a pink book. Your rights then come from the contract, not from a residential ownership certificate, so read it closely.',
    source: 'Sources: Da Nang Department of Construction announcements, batches 1 to 7 (2019 to 2026); Housing Law 2023. Last checked October 25, 2026. This is general information, not legal advice.',
  },
  vi: {
    h2: 'Người nước ngoài mua nhà tại Đà Nẵng',
    intro: 'Người nước ngoài được sở hữu nhà ở tại Đà Nẵng, nhưng chỉ trong các dự án thành phố đã cho phép và trong giới hạn số lượng của từng dự án. Dưới đây là quy định, trình tự mua và toàn bộ dự án Sở Xây dựng Đà Nẵng đã công bố.',
    rulesH: 'Quy định chính',
    rules: [
      ['Đối tượng', 'Cá nhân nước ngoài được phép nhập cảnh vào Việt Nam (hộ chiếu có dấu nhập cảnh hợp lệ, trừ người được hưởng quyền ưu đãi, miễn trừ ngoại giao) và tổ chức nước ngoài hoạt động tại Việt Nam.'],
      ['Loại nhà ở', 'Căn hộ chung cư và nhà ở riêng lẻ, biệt thự trong dự án nhà ở thương mại đã được cho phép người nước ngoài sở hữu. Không bao gồm đất và khu vực bảo đảm quốc phòng, an ninh.'],
      ['Số lượng', 'Tối đa 30% số căn hộ của một tòa nhà. Với nhà ở riêng lẻ, biệt thự: tối đa 10% số căn trong một dự án và không quá 250 căn trên địa bàn một phường.'],
      ['Thời hạn', 'Giấy chứng nhận (sổ hồng) có thời hạn tối đa 50 năm kể từ ngày cấp, được gia hạn một lần. Người Việt Nam sở hữu lâu dài.'],
      ['Cho thuê và chuyển nhượng', 'Chủ sở hữu được cho thuê, bán, tặng cho hoặc để thừa kế. Người mua là người Việt Nam được sở hữu lâu dài; người mua là người nước ngoài được sở hữu trong thời hạn còn lại.'],
    ],
    stepsH: 'Trình tự mua',
    steps: [
      'Kiểm tra dự án có trong danh sách của thành phố bên dưới và đề nghị môi giới xác nhận với ban quản lý tòa nhà rằng dự án vẫn còn hạn mức cho người nước ngoài.',
      'Ký thỏa thuận đặt cọc, sau đó ký hợp đồng mua bán: với chủ đầu tư nếu mua mới, hoặc hợp đồng công chứng với chủ nhà nếu mua lại.',
      'Thanh toán bằng đồng Việt Nam qua tài khoản ngân hàng tại Việt Nam và lưu giữ chứng từ chuyển khoản để chuyển tiền bán nhà ra nước ngoài sau này.',
      'Chủ đầu tư hoặc bên bán nộp hồ sơ cấp sổ hồng đứng tên người mua tại Văn phòng đăng ký đất đai Đà Nẵng.',
    ],
    costs: 'Chi phí thường gặp: 10% VAT với nhà mới (thường đã gồm trong giá), 2% phí bảo trì với nhà mới, 0,5% lệ phí trước bạ và 2% thuế thu nhập cá nhân khi bán lại (thường do bên bán nộp). Nên nhờ luật sư xem hợp đồng trước khi đặt cọc.',
    approvedH: 'Dự án được phép bán cho người nước ngoài',
    approvedNote: 'Do Sở Xây dựng Đà Nẵng công bố qua bảy đợt, từ năm 2019 đến năm 2026. Tên quận theo địa giới trước năm 2025.',
    cols: ['Dự án', 'Quận', 'Đợt công bố', 'Hạn mức', 'Đang bán'],
    official: 'tên pháp lý',
    see: 'Xem',
    unlistedH: 'Được quảng cáo cho người nước ngoài nhưng chưa có trong danh sách',
    unlistedNote: 'Các dự án này được môi giới chào bán cho người nước ngoài nhưng chưa có trong danh sách Sở Xây dựng đã công bố. Hãy đề nghị chủ đầu tư cung cấp văn bản cho phép người nước ngoài sở hữu trước khi đặt cọc.',
    notH: 'Không cho phép người nước ngoài sở hữu',
    leaseH: 'Thuê dài hạn không phải là sở hữu',
    lease: 'Một số biệt thự nghỉ dưỡng, căn hộ thương hiệu và condotel trên đất du lịch, thương mại được bán cho người nước ngoài theo hình thức thuê dài hạn (thường đến 50 năm) thay vì cấp sổ hồng. Quyền lợi khi đó theo hợp đồng, không theo giấy chứng nhận quyền sở hữu nhà ở, vì vậy cần đọc kỹ hợp đồng.',
    source: 'Nguồn: các đợt công bố của Sở Xây dựng Đà Nẵng, đợt 1 đến đợt 7 (2019 đến 2026); Luật Nhà ở 2023. Cập nhật ngày 25/10/2026. Thông tin tham khảo, không phải tư vấn pháp lý.',
  },
};

export default function ForeignBuyerGuide({ lang, forSale }: { lang: Lang; forSale: Listing[] }) {
  const t = lang === 'vi' ? T.vi : T.en;
  const base = lang === 'vi' ? '/vi/mua-ban' : lang === 'en' ? '/for-sale' : `/${lang}/for-sale`;
  const count = (p: RegExp) => forSale.filter(l => p.test(`${l.title} ${l.text}`)).length;
  const approved = FOREIGN_APPROVED_BUILDINGS.filter(b => b.status === 'approved');
  const unlisted = FOREIGN_APPROVED_BUILDINGS.filter(b => b.status === 'unlisted');
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="max-w-4xl flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-slate-900">{t.h2}</h2>
          <p className="text-[15px] leading-relaxed text-slate-700">{t.intro}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">{t.rulesH}</h3>
          <dl className="flex flex-col gap-3 text-[15px]">
            {t.rules.map(([k, v]) => (
              <div key={k} className="sm:grid sm:grid-cols-[11rem_1fr] sm:gap-4">
                <dt className="font-semibold text-slate-900">{k}</dt>
                <dd className="text-slate-700 leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">{t.stepsH}</h3>
          <ol className="list-decimal pl-5 flex flex-col gap-2 text-[15px] text-slate-700 leading-relaxed">
            {t.steps.map(s => <li key={s}>{s}</li>)}
          </ol>
          <p className="mt-4 text-sm text-slate-600 leading-relaxed">{t.costs}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{t.approvedH}</h3>
          <p className="text-sm text-slate-600 mb-3">{t.approvedNote}</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  {t.cols.map(c => <th key={c} className="px-2 py-2.5 font-semibold whitespace-nowrap">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {approved.map(b => {
                  const n = count(b.pattern);
                  return (
                    <tr key={b.name} className="border-b border-slate-100 last:border-0 align-top">
                      <td className="px-2 py-2.5">
                        <span className="font-semibold text-slate-900">{b.name}</span>
                        {b.officialName && <span className="block text-xs text-slate-500">{t.official}: {b.officialName}</span>}
                      </td>
                      <td className="px-2 py-2.5 whitespace-nowrap">{b.district}</td>
                      <td className="px-2 py-2.5 whitespace-nowrap">{b.batch}</td>
                      <td className="px-2 py-2.5">{b.foreignUnits || '30%'}</td>
                      <td className="px-2 py-2.5 whitespace-nowrap">
                        {n > 0 ? <Link href={`${base}?q=${encodeURIComponent(b.search || b.name)}`} className="font-medium text-blue-700 hover:underline">{t.see} {n} →</Link> : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-semibold text-slate-900 mb-1.5">{t.unlistedH}</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">{t.unlistedNote}</p>
            <p className="text-sm font-medium text-slate-900">{unlisted.map(b => b.name).join(' · ')}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900 mb-1.5">{t.notH}</h3>
            <ul className="text-sm text-slate-700 flex flex-col gap-1">
              {FOREIGN_NOT_APPROVED.map(b => <li key={b.name}>{b.name} <span className="text-slate-500">({lang === 'vi' ? b.sourceVi : b.source})</span></li>)}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-slate-900">{t.leaseH}</h3>
          <p className="text-[15px] text-slate-700 leading-relaxed">{t.lease}</p>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">{t.source}</p>
      </div>
    </section>
  );
}
