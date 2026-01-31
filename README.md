# Grey Oak Remodel

Website for Grey Oak Remodel, a premium home remodeling company in Colorado.

## Tech Stack

- **Astro** - Static site generator
- **Cloudflare Pages** - Hosting and edge functions
- **Cloudflare R2** - Media storage (images/videos)
- **TypeScript** - Type checking

## Design System

The site follows a **60/30/10 color rule**:

| Proportion | Color | Usage |
|------------|-------|-------|
| 60% | White (`#ffffff`) | Backgrounds, breathing room |
| 30% | Deep Blue (`#164059`) | Headers, text, primary buttons |
| 10% | Oak/Tan (`#B8976C`) | Accents, CTAs, highlights |

**Typography:**
- **Headings:** Montserrat (500-700 weight)
- **Body:** Inter (400-600 weight)
- **Accent:** Playfair Display (serif, sparingly)

## Content Collections

Content is managed through Astro content collections in `src/content/`:

- `projects/` - Project showcases with media galleries (synced from Instagram)

## Instagram Sync Integration

Project content is automatically synced from Instagram via the [greyoak-ingest](https://github.com/bryanshamilton/greyoak-ingest) worker:

1. **Make.com** monitors Instagram for new posts
2. Posts are sent to the **ingest worker** (`POST /ingest`)
3. Worker uploads media to **R2** and commits markdown to this repo
4. **Cloudflare Pages** rebuilds the site automatically

Project files follow the naming convention `ig_<post_id>.md`.

## Google Reviews

Currently using a **static reviews display** showing:
- 5.0 rating with 5 stars
- 8 reviews on Google

**Why static?** The Google Places API can't find the business due to service-area business indexing issues. The code is ready to switch to dynamic API fetching when the Place ID (`ChIJQQTkGJYDagwRAqf6m6shEFw`) becomes properly indexed.

To get a direct review link, the business owner can:
1. Log into Google Business Profile Manager
2. Find "Get more reviews" or "Ask for reviews"
3. Click "Share review form" for the direct URL

## Environment Variables

### For Cloudflare Pages (Production)

```
GOOGLE_PLACES_API_KEY=<key>  # For future dynamic reviews
R2_PUBLIC_URL=https://pub-xxx.r2.dev  # R2 public bucket URL
```

### For Local Development

Create a `.env` file:

```
PUBLIC_R2_URL=https://pub-xxx.r2.dev
```

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Deployment is automatic via Cloudflare Pages on push to `main`.

Manual deployment:

```bash
npm run build
npx wrangler pages deploy dist --project-name=greyoakremodel-site
```

## Live Site

- https://greyoakremodel.com
- https://www.greyoakremodel.com
