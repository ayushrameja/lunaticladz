import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hubChallenge = searchParams.get('hub.challenge');
  const hubMode = searchParams.get('hub.mode');
  const hubTopic = searchParams.get('hub.topic');

  console.log('YouTube webhook verification:', { hubMode, hubTopic });

  if (hubChallenge && hubMode === 'subscribe') {
    return new Response(hubChallenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return new Response('Invalid request', { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const xmlData = parser.parse(body);

    const entry = xmlData?.feed?.entry;
    if (!entry) {
      console.log('No entry found in webhook payload');
      return NextResponse.json({ success: true });
    }

    const videoId = entry['yt:videoId'];
    const title = entry.title;
    const published = entry.published;

    if (!videoId) {
      console.log('No videoId in webhook payload');
      return NextResponse.json({ success: true });
    }

    console.log('YouTube webhook received:', { videoId, title });

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.error('YouTube API key not configured');
      return NextResponse.json({ success: false, error: 'API key missing' });
    }

    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,liveStreamingDetails&id=${videoId}&key=${apiKey}`
    );

    if (!videoResponse.ok) {
      console.error(
        'Failed to fetch video details:',
        await videoResponse.text()
      );
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch video details',
      });
    }

    const videoData = await videoResponse.json();
    const video = videoData.items?.[0];

    if (!video) {
      console.log('Video not found:', videoId);
      return NextResponse.json({ success: true });
    }

    const isLive = video.snippet.liveBroadcastContent === 'live';
    const thumbnail =
      video.snippet.thumbnails.high?.url ||
      video.snippet.thumbnails.medium?.url ||
      video.snippet.thumbnails.default?.url;

    await convex.mutation(api.streams.upsertStream, {
      videoId: videoId,
      title: video.snippet.title,
      thumbnail: thumbnail,
      publishedAt: video.snippet.publishedAt || published,
      duration: video.contentDetails?.duration || '',
      isLive: isLive,
    });

    console.log('Stream upserted to Convex:', videoId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing YouTube webhook:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
