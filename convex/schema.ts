import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  streams: defineTable({
    videoId: v.string(),
    title: v.string(),
    thumbnail: v.string(),
    publishedAt: v.string(),
    duration: v.string(),
    isLive: v.boolean(),
    syncedAt: v.number(),
  })
    .index('by_published', ['publishedAt'])
    .index('by_video_id', ['videoId']),
});
