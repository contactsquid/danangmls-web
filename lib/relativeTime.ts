// Renders a listing's "Listed" date as relative time ("30 mins ago", "3 hours
// ago", "4 days ago", ...) instead of an absolute date, per Blake's 2026-08-09
// request.
//
// As of 2026-08-11 the pipeline stamps a real ISO timestamp (n8n `$now`, the
// moment the listing is actually appended to the live sheet) instead of a
// date-only string — see maintain-sheet.js's `today()`/`parseDate()` and the
// n8n enrichment workflows' "Append row in sheet" Date field. So the minute-
// and hour-level buckets below are now measuring real elapsed time, not time
// since local midnight. Older rows written before this change still have a
// date-only value, which parses fine (just less precise — same as before).
//
// Display rounding (Blake's 2026-08-11 spec):
//   - under 1 hour: minutes, rounded to the nearest 15 (15 / 30 / 45 mins ago)
//   - 1+ hour (under a day): solid hours, rounded to the nearest hour
//   - 1+ day: unchanged (days / weeks / months / years, floored)
export function relativeTime(dateStr: string | undefined | null, lang: 'en' | 'vi'): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;

  const diffMs = Date.now() - d.getTime();
  const diffMin = diffMs / 60000;
  const diffHr = diffMs / 3600000;

  // Future or clock-skew dates, and anything under a minute, collapse to "just now".
  if (diffMin < 1) return lang === 'vi' ? 'Vừa xong' : 'Just now';

  // Under an hour: round to the nearest 15 minutes. Anything that rounds up
  // to a full 60 falls through as "1 hour ago".
  if (diffHr < 1) {
    const mins = Math.max(15, Math.round(diffMin / 15) * 15);
    if (mins < 60) {
      return lang === 'vi' ? `${mins} phút trước` : `${mins} minutes ago`;
    }
    return lang === 'vi' ? '1 giờ trước' : '1 hour ago';
  }

  // Under a day: solid hours, rounded to the nearest hour.
  if (diffHr < 24) {
    const hrs = Math.max(1, Math.round(diffHr));
    if (hrs >= 24) {
      return lang === 'vi' ? '1 ngày trước' : '1 day ago';
    }
    return lang === 'vi' ? `${hrs} giờ trước` : `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  }

  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

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
