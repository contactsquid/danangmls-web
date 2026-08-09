// Renders a listing's "Listed" date as relative time ("3 hours ago", "4 days
// ago", ...) instead of an absolute date, per Blake's 2026-08-09 request.
//
// Caveat: the sheet's DATE column is date-only (e.g. "8/6/2026", no time of
// day) — see maintain-sheet.js. JS parses that as local midnight, so for a
// listing dated "today" the hour count below is measured from midnight, not
// from the listing's actual insertion time. That means today's listings will
// generally read as "N hours ago" with N trending toward how late in the day
// it is, rather than true minutes/hours since posting. Day-and-older buckets
// ("1 day ago", "4 days ago", ...) are accurate. Recommend capturing a real
// timestamp upstream if hour-level precision needs to be exact.
export function relativeTime(dateStr: string | undefined | null, lang: 'en' | 'vi'): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;

  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  // Future or clock-skew dates, and anything under a minute, collapse to "just now".
  if (diffMin < 1) return lang === 'vi' ? 'Vừa xong' : 'Just now';
  if (diffMin < 60) {
    return lang === 'vi' ? `${diffMin} phút trước` : `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  }
  if (diffHr < 24) {
    return lang === 'vi' ? `${diffHr} giờ trước` : `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
  }
  if (diffDay < 7) {
    return lang === 'vi' ? `${diffDay} ngày trước` : `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  }
  if (diffWeek < 5) {
    return lang === 'vi' ? `${diffWeek} tuần trước` : `${diffWeek} week${diffWeek === 1 ? '' : 's'} ago`;
  }
  if (diffMonth < 12) {
    return lang === 'vi' ? `${diffMonth} tháng trước` : `${diffMonth} month${diffMonth === 1 ? '' : 's'} ago`;
  }
  return lang === 'vi' ? `${diffYear} năm trước` : `${diffYear} year${diffYear === 1 ? '' : 's'} ago`;
}
