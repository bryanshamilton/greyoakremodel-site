# Grey Oak Remodel

Website for Grey Oak Remodel, a home remodeling company.

## Tech Stack

- **Astro** - Static site generator
- **Cloudflare Pages** - Hosting and edge functions
- **Cloudflare R2** - Media storage (images/videos)
- **TypeScript** - Type checking

## Content Collections

Content is managed through Astro content collections in `src/content/`:

- `projects/` - Project showcases with media galleries (synced from Instagram)

## Instagram Sync Integration

Project content is automatically synced from Instagram via the [greyoak-ingest](https://github.com/bryanshamilton/greyoak-ingest) worker:

1. Make.com monitors Instagram for new posts
2. Posts are sent to the ingest worker
3. Worker uploads media to R2 and commits markdown to this repo
4. Cloudflare Pages rebuilds the site automatically

Project files follow the naming convention `ig_<post_id>.md`.

## Development

```bash
npm install
npm run dev
```

## Deployment

```bash
npm run build
npx wrangler pages deploy dist --project-name=greyoakremodel-site
```

## Live Site

- https://greyoakremodel.com
- https://www.greyoakremodel.com
