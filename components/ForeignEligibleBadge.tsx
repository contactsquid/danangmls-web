'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

interface Props {
  buildingName?: string;
  size?: 'sm' | 'md';
  // When set, the badge becomes a link to the foreign-buyer-eligible facet page.
  href?: string;
}

/**
 * Badge rendered on listings that are in a known foreign-approved building.
 * Two sizes: 'sm' for ListingCard (compact), 'md' for ListingDetail (prominent).
 */
export default function ForeignEligibleBadge({ buildingName, size = 'sm', href }: Props) {
  const { lang } = useLanguage();
  const isVi = lang === 'vi';

  const label = isVi ? 'Người nước ngoài mua được' : 'Foreign Buyer Eligible';
  const tooltip = buildingName
    ? (isVi
        ? `Tòa nhà ${buildingName} cho phép người nước ngoài sở hữu căn hộ.`
        : `${buildingName} is approved for foreign ownership.`)
    : (isVi
        ? 'Tòa nhà này cho phép người nước ngoài sở hữu căn hộ.'
        : 'This building is approved for foreign ownership.');

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const cls = `inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-medium whitespace-nowrap ${padding}`;
  const inner = (
    <>
      <svg className={iconSize} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      {label}
    </>
  );

  return href ? (
    <Link href={href} title={tooltip} className={`${cls} hover:bg-emerald-100 hover:underline transition-colors`}>
      {inner}
    </Link>
  ) : (
    <span className={cls} title={tooltip}>{inner}</span>
  );
}
