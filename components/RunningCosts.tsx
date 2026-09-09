'use client';

import { useLanguage } from './LanguageProvider';
import { extractRunningCosts, formatVnd, type RunningCosts as Costs } from '@/lib/runningCosts';

// Rent is only half of what a tenant pays here — electricity and water are metered
// and billed on top, and not knowing the rate is the most common thing an expat
// gets caught by. Landlords state it in the original post; we surface it.
//
// Deliberately labelled as coming FROM THE LISTING, not verified by us. We do not
// inspect properties, and implying we do would be the wrong kind of trust signal.

export default function RunningCosts({ text }: { text?: string | null }) {
  const { lang } = useLanguage();
  const isVi = lang === 'vi';
  const c: Costs | null = extractRunningCosts(text);
  if (!c) return null;

  const rows: Array<{ label: string; value: string }> = [];
  const per = (p?: string) =>
    !p ? '' : p === 'kWh' ? (isVi ? '/kWh' : ' per kWh')
      : p === 'person' ? (isVi ? '/người' : ' per person')
      : p === 'm³' ? (isVi ? '/m³' : ' per m³')
      : p === 'month' ? (isVi ? '/tháng' : ' per month')
      : ` ${p}`;

  if (c.electricity) rows.push({
    label: isVi ? 'Điện' : 'Electricity',
    value: c.electricity.amount ? formatVnd(c.electricity.amount) + per(c.electricity.per)
      : (isVi ? 'Giá nhà nước' : 'State rate'),
  });
  if (c.water) rows.push({
    label: isVi ? 'Nước' : 'Water',
    value: c.water.amount ? formatVnd(c.water.amount) + per(c.water.per)
      : (isVi ? 'Theo đồng hồ' : 'Metered'),
  });
  if (c.service?.amount) rows.push({
    label: isVi ? 'Phí dịch vụ' : 'Service fee',
    value: formatVnd(c.service.amount) + per('month'),
  });
  if (c.deposit) rows.push({
    label: isVi ? 'Đặt cọc' : 'Deposit',
    value: isVi ? `${c.deposit.months} tháng` : `${c.deposit.months} month${c.deposit.months === 1 ? '' : 's'}`,
  });
  if (c.lease) rows.push({
    label: isVi ? 'Thời hạn hợp đồng' : 'Lease length',
    value: isVi ? `${c.lease.months} tháng` : `${c.lease.months} month${c.lease.months === 1 ? '' : 's'}`,
  });
  if (!rows.length) return null;

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">
        {isVi ? 'Chi phí hàng tháng' : 'Monthly running costs'}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {isVi
          ? 'Ngoài tiền thuê. Theo thông tin trong tin đăng gốc — quý khách vui lòng xác nhận lại với chủ nhà.'
          : 'On top of the rent. As stated in the original listing — confirm with the landlord before signing.'}
      </p>
      <dl className="mt-4 divide-y divide-slate-100">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-sm text-slate-600">{r.label}</dt>
            <dd className="text-sm font-semibold text-slate-900 text-right">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
