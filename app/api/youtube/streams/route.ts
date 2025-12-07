import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export const dynamic = 'force-dynamic';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  videoId: string;
  duration: string;
  isLive: boolean;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const maxResultsParam = searchParams.get('maxResults') || '6';
  const maxResults = parseInt(maxResultsParam, 10);

  try {
    const streams = await convex.query(api.streams.getStreams, {
      limit: Math.min(maxResults, 50),
    });

    const videos: YouTubeVideo[] = streams.map((stream) => ({
      id: stream.videoId,
      videoId: stream.videoId,
      title: stream.title,
      thumbnail: stream.thumbnail,
      publishedAt: stream.publishedAt,
      duration: stream.duration,
      isLive: stream.isLive,
    }));

    const lastSynced = streams.length > 0 ? streams[0].syncedAt : null;

    return NextResponse.json({
      videos,
      lastSynced: lastSynced ? new Date(lastSynced).toISOString() : null,
    });
  } catch (error) {
    console.error('Error fetching streams from Convex:', error);
    return NextResponse.json(
      { error: 'Error fetching streams', videos: [] },
      { status: 500 }
    );
  }
}
