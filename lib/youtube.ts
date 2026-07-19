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
    const res = await fetch(RSS_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
      .map((m) => parseEntry(m[1]))
      .filter((v): v is YouTubeVideo => v !== null && !EXCLUDED_VIDEO_IDS.has(v.videoId));
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

async function firstEmbeddable(candidates: YouTubeVideo[]): Promise<YouTubeVideo | null> {
  for (const v of candidates) {
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
  return (await firstEmbeddable(langMatches)) ?? (await firstEmbeddable(videos));
}

// Newest video overall, regardless of language. Kept for any non-localized caller.
export async function getLatestVideo(): Promise<YouTubeVideo | null> {
  const videos = await getLatestVideos();
  return (await firstEmbeddable(videos)) ?? videos[0] ?? null;
}
