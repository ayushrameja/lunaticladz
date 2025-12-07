import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const CHANNEL_ID = 'UCSjBRgqGSQIoacyVOAYJtUQ';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    console.error('Unauthorized cron request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error('YouTube API key not configured');
    return NextResponse.json({ error: 'API key missing' }, { status: 500 });
  }

  try {
    const streams = [];

    try {
      const liveResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&eventType=live&key=${apiKey}`
      );

      if (liveResponse.ok) {
        const liveData = await liveResponse.json();
        if (liveData.items) {
          for (const item of liveData.items) {
            streams.push({
              videoId: item.id.videoId,
              title: item.snippet.title,
              thumbnail:
                item.snippet.thumbnails.high?.url ||
                item.snippet.thumbnails.medium?.url,
              publishedAt: item.snippet.publishedAt,
              duration: '',
              isLive: true,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching live streams:', error);
    }

    try {
      const completedResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&eventType=completed&maxResults=50&key=${apiKey}`
      );

      if (completedResponse.ok) {
        const completedData = await completedResponse.json();
        if (completedData.items) {
          for (const item of completedData.items) {
            streams.push({
              videoId: item.id.videoId,
              title: item.snippet.title,
              thumbnail:
                item.snippet.thumbnails.high?.url ||
                item.snippet.thumbnails.medium?.url,
              publishedAt: item.snippet.publishedAt,
              duration: '',
              isLive: false,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching completed streams:', error);
    }

    if (streams.length > 0) {
      await convex.mutation(api.streams.upsertStreams, { streams });
      console.log(`Synced ${streams.length} streams to Convex`);
    }

    await subscribeToWebhook();

    return NextResponse.json({
      success: true,
      synced: streams.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in cron sync:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    );
  }
}

async function subscribeToWebhook() {
  try {
    const callbackUrl =
      process.env.NEXT_PUBLIC_WEBHOOK_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/api/webhooks/youtube`
        : 'https://your-domain.vercel.app/api/webhooks/youtube';

    const topicUrl = `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

    const formData = new URLSearchParams({
      'hub.callback': callbackUrl,
      'hub.topic': topicUrl,
      'hub.mode': 'subscribe',
      'hub.verify': 'async',
    });

    const response = await fetch('https://pubsubhubbub.appspot.com/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (response.ok) {
      console.log('Successfully subscribed to YouTube webhook');
    } else {
      console.error('Failed to subscribe to webhook:', await response.text());
    }
  } catch (error) {
    console.error('Error subscribing to webhook:', error);
  }
}
