// Fetches the latest video from the @DaNangHomes43 YouTube channel via the
// public RSS feed. Zero auth required. ISR-cached for 1 hour, so when Blake
// uploads a new video the homepage picks it up within an hour.

const CHANNEL_ID = 'UCJwjJcmWodHM7VxxVds0X1w'; // @DaNangHomes43
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export interface YouTubeVideo {
  videoId: string;
  title: string;
  publishedAt: string;
  description: string;
  thumbnailUrl: string;
}

export async function getLatestVideo(): Promise<YouTubeVideo | null> {
  try {
    const res = await fetch(RSS_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const xml = await res.text();
    const entryMatch = xml.match(/<entry>([\s\S]*?)<\/entry>/);
    if (!entryMatch) return null;
    const entry = entryMatch[1];
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || '';
    const title = entry.match(/<title>([^<]+)<\/title>/)?.[1] || '';
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] || '';
    const description = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1]?.trim() || '';
    const thumbnailUrl = entry.match(/<media:thumbnail url="([^"]+)"/)?.[1] || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    if (!videoId) return null;
    return { videoId, title, publishedAt, description, thumbnailUrl };
  } catch {
    return null;
  }
}
