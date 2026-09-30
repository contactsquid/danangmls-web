import React from 'react';

// Rent / Terms summary lines appended by the rentals enrichment (and their
// vi/ko/ru equivalents). Bold the label so they stand out for quick scanning.
const LABEL = /^(Rent|Terms|Giá thuê|Điều khoản|월세|조건|Аренда|Условия):/;

export function renderDescription(text: string): React.ReactNode[] {
  return text.split('\n').flatMap((line, i, all) => {
    const m = line.match(LABEL);
    const nl = i < all.length - 1 ? '\n' : '';
    if (!m) return [line + nl];
    return [<strong key={i} className="font-semibold text-slate-900">{m[0]}</strong>, line.slice(m[0].length) + nl];
  });
}
