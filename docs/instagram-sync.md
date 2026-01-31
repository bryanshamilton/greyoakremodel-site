# Instagram Sync Integration

This document describes the expected format for project markdown files synced from Instagram via Make.com.

## Overview

The Make.com automation syncs Instagram posts to this repository by:
1. Fetching posts from the Instagram Graph API
2. Downloading media (images/videos) and uploading to Cloudflare R2
3. Creating/updating markdown files in `src/content/projects/`
4. Committing changes to trigger a site rebuild

## Media Storage

All media files are stored in Cloudflare R2 at:
```
https://media.greyoakremodel.com/projects/{post_id}/{index}.{ext}
```

Example:
- `https://media.greyoakremodel.com/projects/ig_18234567890/1.jpg`
- `https://media.greyoakremodel.com/projects/ig_18234567890/2.mp4`
- `https://media.greyoakremodel.com/projects/ig_18234567890/2_poster.jpg`

## Project File Format

### File Location
```
src/content/projects/ig_{MEDIA_ID}.md
```

### Frontmatter Schema

```yaml
---
title: string          # Required - derived from first line of caption or "Project Update"
date: string           # Required - ISO 8601 format (YYYY-MM-DD)
tags: string[]         # Required - array of tags (bathroom, kitchen, tile, full-home, remodel)
location: string       # Optional - location if available
media:                 # Required - array of media items
  - type: image | video
    url: string        # Full URL or path relative to MEDIA_BASE_URL
    poster: string     # Optional - poster image URL for videos
permalink: string      # Optional - original Instagram post URL
featured: boolean      # Optional - defaults to false
---
```

### Body Content
The body should contain the cleaned Instagram caption (hashtags can be stripped or kept).

## Tag Mapping

Map Instagram content to tags using keyword detection:

| Keywords in Caption | Tag |
|---------------------|-----|
| bath, bathroom, shower, tub, vanity | `bathroom` |
| kitchen, cabinet, countertop | `kitchen` |
| tile, grout, floor, backsplash | `tile` |
| whole home, full home, renovation | `full-home` |
| (default) | `remodel` |

Multiple tags can be applied if multiple keywords match.

## Media Type Detection

| Instagram Media Type | Site Media Type |
|----------------------|-----------------|
| `IMAGE` | `image` |
| `VIDEO` | `video` |
| `CAROUSEL_ALBUM` child `IMAGE` | `image` |
| `CAROUSEL_ALBUM` child `VIDEO` | `video` |

For videos:
- Generate a poster image (first frame) and upload alongside the video
- Use poster URL in the `poster` field

## Example Workflow

### Input: Instagram Carousel Post
- Post ID: `18234567890123456`
- Caption: "Master bath transformation. Custom tile work with heated floors..."
- Media: [image1.jpg, video.mp4, image2.jpg]

### Output: Markdown File

File: `src/content/projects/ig_18234567890123456.md`

```markdown
---
title: "Master bath transformation"
date: "2024-01-15"
tags: ["bathroom", "tile"]
media:
  - type: image
    url: "https://media.greyoakremodel.com/projects/ig_18234567890123456/1.jpg"
  - type: video
    url: "https://media.greyoakremodel.com/projects/ig_18234567890123456/2.mp4"
    poster: "https://media.greyoakremodel.com/projects/ig_18234567890123456/2_poster.jpg"
  - type: image
    url: "https://media.greyoakremodel.com/projects/ig_18234567890123456/3.jpg"
permalink: "https://www.instagram.com/p/ABC123/"
featured: false
---

Master bath transformation. Custom tile work with heated floors and a frameless glass enclosure. Another one in the books.
```

## Cursor Tracking

To avoid re-syncing old posts, maintain a cursor file:

File: `src/content/ig_cursor.json`
```json
{
  "last_timestamp": "2024-01-15T12:00:00Z"
}
```

Update this file after each successful sync run.

## Build Trigger

After committing new/updated project files:
1. GitHub webhook notifies Cloudflare Pages
2. Pages runs `npm run build`
3. New projects appear on the site within ~2 minutes
