/**
 * Site configuration constants
 */

/**
 * Base URL for media assets hosted on Cloudflare R2
 * Used by Make.com sync and site rendering
 *
 * Media files are stored at: {MEDIA_BASE_URL}/projects/{filename}
 * Example: https://media.greyoakremodel.com/projects/ig_123456/1.jpg
 */
export const MEDIA_BASE_URL = 'https://media.greyoakremodel.com';

/**
 * Helper to construct full media URL from a relative path
 * Handles both relative paths and full URLs gracefully
 */
export function getMediaUrl(path: string): string {
  // If already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // If starts with /, it's a local asset - return as-is
  if (path.startsWith('/')) {
    return path;
  }
  // Otherwise, prepend the media base URL
  return `${MEDIA_BASE_URL}/${path}`;
}
