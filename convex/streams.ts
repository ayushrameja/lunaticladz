import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const upsertStream = mutation({
  args: {
    videoId: v.string(),
    title: v.string(),
    thumbnail: v.string(),
    publishedAt: v.string(),
    duration: v.string(),
    isLive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('streams')
      .withIndex('by_video_id', (q) => q.eq('videoId', args.videoId))
      .first();

    const syncedAt = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        syncedAt,
      });
      return existing._id;
    } else {
      const id = await ctx.db.insert('streams', {
        ...args,
        syncedAt,
      });
      return id;
    }
  },
});

export const upsertStreams = mutation({
  args: {
    streams: v.array(
      v.object({
        videoId: v.string(),
        title: v.string(),
        thumbnail: v.string(),
        publishedAt: v.string(),
        duration: v.string(),
        isLive: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const syncedAt = Date.now();
    const results = [];

    for (const stream of args.streams) {
      const existing = await ctx.db
        .query('streams')
        .withIndex('by_video_id', (q) => q.eq('videoId', stream.videoId))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          ...stream,
          syncedAt,
        });
        results.push(existing._id);
      } else {
        const id = await ctx.db.insert('streams', {
          ...stream,
          syncedAt,
        });
        results.push(id);
      }
    }

    return results;
  },
});

export const updateLiveStatus = mutation({
  args: {
    videoId: v.string(),
    isLive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const stream = await ctx.db
      .query('streams')
      .withIndex('by_video_id', (q) => q.eq('videoId', args.videoId))
      .first();

    if (stream) {
      await ctx.db.patch(stream._id, {
        isLive: args.isLive,
        syncedAt: Date.now(),
      });
      return stream._id;
    }

    return null;
  },
});

export const getStreams = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const streams = await ctx.db
      .query('streams')
      .withIndex('by_published')
      .order('desc')
      .take(limit);

    return streams;
  },
});

export const getStreamByVideoId = query({
  args: {
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const stream = await ctx.db
      .query('streams')
      .withIndex('by_video_id', (q) => q.eq('videoId', args.videoId))
      .first();

    return stream;
  },
});
