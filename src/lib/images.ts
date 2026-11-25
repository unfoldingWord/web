// Resolve the image paths used in content ("stories/the-angry-imam.jpg") to
// optimizable assets under src/assets/images/.
//
// A missing image fails the build with the path that is wrong — the same
// guarantee Astro's image() schema helper gives, but with paths that are the
// same in every locale's file and easy to type.
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/**/*.{jpg,jpeg,png,webp,avif,gif,svg,JPG,JPEG,PNG}', { eager: true });

const byPath = new Map<string, ImageMetadata>();
for (const [k, v] of Object.entries(files)) byPath.set(k.replace('/src/assets/images/', ''), v.default);

export function img(path: string): ImageMetadata;
export function img(path: string | undefined): ImageMetadata | undefined;
export function img(path: string | undefined): ImageMetadata | undefined {
  if (!path) return undefined;
  const found = byPath.get(path.replace(/^\/+/, ''));
  if (!found) throw new Error(`Image not found: "${path}". Images go in src/assets/images/ and are referenced relative to it, e.g. "stories/photo.jpg".`);
  return found;
}

export function hasImage(path: string): boolean {
  return byPath.has(path.replace(/^\/+/, ''));
}
