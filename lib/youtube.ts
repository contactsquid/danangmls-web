// Fetches recent videos from the @DaNangHomes43 YouTube channel via the public
// RSS feed. Zero auth required. ISR-cached for 1 hour, so when Blake uploads a
// new video the homepage picks it up within an hour.
//
// The channel publishes each property as a bilingual pair (an English video and
// a Vietnamese video). The homepage is language-routed (/vi = Vietnamese, else
// English), so each locale should surface the newest video IN ITS OWN LANGUAGE
// rather than whichever was uploaded most recently. getLatestVideoByLang() does
// that; it falls back to the newest overall video if no match exists for a
// language (the surrounding UI text stays localized either way).

const CHANNEL_ID = 'UCJwjJcmWodHM7VxxVds0X1w'; // @DaNangHomes43
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const SHEET_ID = '14hGuwUcb308n3h1ODyby97WqHa7uRUyyYAKMHgWnyUE';

// Vertical Shorts (9:16) look bad letterboxed in the homepage's 16:9 embed, so we
// exclude them. The /publish pipeline tags every upload horizontal/vertical in the
// YT_Queue tab — the deterministic source of truth (better than scraping YouTube from
// a datacenter IP). Read via the public gviz endpoint (this project has no service
// account — it reads all sheet data this way). Cols are positional: G=format, J=id.
// Cached 10 min in module scope so we don't hit the sheet on every render.
let _verticalCache: { ids: Set<string>; at: number } | null = null;
async function verticalVideoIds(): Promise<Set<string>> {
  if (_verticalCache && Date.now() - _verticalCache.at < 10 * 60 * 1000) return _verticalCache.ids;
  try {
    const res = await fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=YT_Queue`,
      { next: { revalidate: 600 } }
    );
    const text = await res.text();
    const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
    const rows: Array<{ c: Array<{ v: unknown } | null> }> = json?.table?.rows || [];
    const ids = new Set<string>();
    for (const row of rows) {
      const cells = row.c || [];
      const fmt = String(cells[6]?.v ?? '').toLowerCase(); // col G = format
      const vid = String(cells[9]?.v ?? '').trim(); // col J = youtube_video_id
      if (fmt === 'vertical' && vid) ids.add(vid);
    }
    _verticalCache = { ids, at: Date.now() };
    return ids;
  } catch {
    return _verticalCache?.ids || new Set();
  }
}

// Internal test/validation uploads that ended up public and would otherwise win
// the "newest video" homepage slot — they're pipeline proofs-of-concept, not
// listing content Blake wants featured. Add a video ID here to keep it out of
// rotation without having to touch its YouTube privacy setting.
const EXCLUDED_VIDEO_IDS = new Set(['rmA-sDzzkaE']);

export type VideoLang = 'en' | 'vi';

export interface YouTubeVideo {
  videoId: string;
  title: string;
  publishedAt: string;
  description: string;
  thumbnailUrl: string;
  lang: VideoLang;
}

// Vietnamese-specific letters plus every tone-marked vowel. English titles never
// contain these — except for the occasional Vietnamese place name (e.g. an
// English video titled "…For Sale: Lão Phú, Hòa Tiến Lake View"). So we can't
// treat "contains a diacritic" as Vietnamese; we measure DENSITY instead.
const VI_CHARS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

// A title counts as Vietnamese when a large share of its words carry Vietnamese
// diacritics. Real data: fully-Vietnamese titles score ~0.79; English titles
// score 0 (or ~0.29 when they include a couple of Vietnamese place names). 0.4
// sits comfortably between the two clusters.
const VI_WORD_RATIO_THRESHOLD = 0.4;

export function detectVideoLang(title: string): VideoLang {
  const words = title.split(/[\s|,.:;()\-–—/]+/).filter(Boolean);
  if (words.length === 0) return 'en';
  const viWords = words.filter((w) => VI_CHARS.test(w)).length;
  return viWords / words.length >= VI_WORD_RATIO_THRESHOLD ? 'vi' : 'en';
}

function parseEntry(entry: string): YouTubeVideo | null {
  const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || '';
  if (!videoId) return null;
  const title = entry.match(/<title>([^<]+)<\/title>/)?.[1] || '';
  const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] || '';
  const description = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1]?.trim() || '';
  const thumbnailUrl =
    entry.match(/<media:thumbnail url="([^"]+)"/)?.[1] || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  return { videoId, title, publishedAt, description, thumbnailUrl, lang: detectVideoLang(title) };
}

// All recent videos, newest first (the order the RSS feed returns them in).
export async function getLatestVideos(): Promise<YouTubeVideo[]> {
  try {
    const [res, verticals] = await Promise.all([
      fetch(RSS_URL, { next: { revalidate: 3600 } }),
      verticalVideoIds(),
    ]);
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
      .map((m) => parseEntry(m[1]))
      .filter(
        (v): v is YouTubeVideo =>
          v !== null && !EXCLUDED_VIDEO_IDS.has(v.videoId) && !verticals.has(v.videoId)
      );
  } catch {
    return [];
  }
}

// Some uploads (e.g. API-uploaded test/draft videos) end up with embedding
// disabled on YouTube's side, which silently blanks the homepage <iframe>.
// oEmbed 401s for those — checking it needs no API key/auth, so we can filter
// them out before picking what to feature.
async function isEmbeddable(videoId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`,
      { next: { revalidate: 3600 } }
    );
    return res.ok;
  } catch {
    return true; // don't hide a video just because the embeddability check itself failed
  }
}

// A real YouTube Short stays on /shorts/<id> (HTTP 200); a landscape video
// 3xx-redirects to /watch. Shorts are vertical (9:16) and look bad letterboxed
// in the homepage's 16:9 embed, so we keep them out of the featured rotation.
async function isShort(videoId: string): Promise<boolean> {
  try {
    // Plain fetch (no Next cache) — `next:{revalidate}` + `redirect:'manual'` don't
    // compose and can throw, defeating the check. Secondary net; YT_Queue is primary.
    const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
      method: 'HEAD',
      redirect: 'manual',
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store',
    });
    return res.status === 200;
  } catch {
    return false; // if the check itself fails, don't wrongly hide a video
  }
}

// Eligible to feature = landscape (not a Short) AND embeddable.
async function firstEligible(candidates: YouTubeVideo[]): Promise<YouTubeVideo | null> {
  for (const v of candidates) {
    if (await isShort(v.videoId)) continue;
    if (await isEmbeddable(v.videoId)) return v;
  }
  return null;
}

// Newest video in the requested language, falling back to the newest overall
// video when the channel has no video in that language yet. Skips any video
// that has embedding disabled.
export async function getLatestVideoByLang(lang: VideoLang): Promise<YouTubeVideo | null> {
  const videos = await getLatestVideos();
  if (videos.length === 0) return null;
  const langMatches = videos.filter((v) => v.lang === lang);
  return (await firstEligible(langMatches)) ?? (await firstEligible(videos));
}

// Newest video overall, regardless of language. Kept for any non-localized caller.
export async function getLatestVideo(): Promise<YouTubeVideo | null> {
  const videos = await getLatestVideos();
  return (await firstEligible(videos)) ?? videos[0] ?? null;
}
