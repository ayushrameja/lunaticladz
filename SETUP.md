# Setup Instructions - Completed ✅

## Current Status

Your local development environment is fully configured and running! The implementation includes:

- ✅ Convex database with streams caching
- ✅ Hourly cron job for syncing YouTube data
- ✅ PubSubHubbub webhooks for real-time updates
- ✅ API routes reading from Convex (zero YouTube quota on reads)

## Local Environment Variables

Your `.env.local` is configured with:

```env
YOUTUBE_API_KEY=AIzaSyC-sCOha78JgWEeny8hxWnGQKjx6yVnovM
CONVEX_DEPLOYMENT=dev:kindhearted-cod-702
NEXT_PUBLIC_CONVEX_URL=https://kindhearted-cod-702.convex.cloud
CRON_SECRET=3a806cead273bd566f23e5327bf9f48ce4d32ece2189651bf5a913b7b0c7a1c6
NEXT_PUBLIC_WEBHOOK_URL=https://your-domain.vercel.app/api/webhooks/youtube
```

## Testing Locally

The system is working! You can test:

1. **View streams**: http://localhost:3000/streams
2. **API endpoint**: http://localhost:3000/api/youtube/streams?maxResults=6
3. **Manual sync**:
   ```bash
   curl -X GET "http://localhost:3000/api/cron/sync-streams" \
     -H "Authorization: Bearer 3a806cead273bd566f23e5327bf9f48ce4d32ece2189651bf5a913b7b0c7a1c6"
   ```

## Deploying to Vercel

### Step 1: Update Webhook URL

After deploying, update your Vercel environment variable:

```
NEXT_PUBLIC_WEBHOOK_URL=https://your-actual-domain.vercel.app/api/webhooks/youtube
```

### Step 2: Add All Environment Variables to Vercel

In Vercel project settings → Environment Variables, add:

- `YOUTUBE_API_KEY`: `AIzaSyC-sCOha78JgWEeny8hxWnGQKjx6yVnovM`
- `NEXT_PUBLIC_CONVEX_URL`: `https://kindhearted-cod-702.convex.cloud`
- `CONVEX_DEPLOYMENT`: `dev:kindhearted-cod-702`
- `CRON_SECRET`: `3a806cead273bd566f23e5327bf9f48ce4d32ece2189651bf5a913b7b0c7a1c6`
- `NEXT_PUBLIC_WEBHOOK_URL`: (your Vercel URL + `/api/webhooks/youtube`)

### Step 3: Deploy

```bash
git add .
git commit -m "Add Convex caching with webhooks and cron"
git push
vercel deploy --prod
```

### Step 4: Initial Sync (After Deployment)

```bash
curl -X GET "https://your-domain.vercel.app/api/cron/sync-streams" \
  -H "Authorization: Bearer 3a806cead273bd566f23e5327bf9f48ce4d32ece2189651bf5a913b7b0c7a1c6"
```

## How It Works

1. **Hourly Cron Job**: Vercel automatically runs `/api/cron/sync-streams` every hour via `vercel.json`
2. **Real-time Webhooks**: YouTube sends instant notifications when you go live or upload
3. **Zero-Quota Reads**: All user page loads read from Convex (no YouTube API calls)

## Quota Usage

- **Before**: 100+ units per page load (10,000+ units/day, quota exhausted daily)
- **After**:
  - Hourly sync: 24 syncs/day × 100 units = 2,400 units/day
  - Webhooks: 1-2 triggers/day × 10 units = 20 units/day
  - **Total: ~2,420 units/day (76% reduction, plenty of headroom)**

## Webhooks Note

Webhooks won't work in local development (YouTube needs public HTTPS URL). They'll work automatically after Vercel deployment. The hourly cron ensures data stays fresh even without webhooks.
