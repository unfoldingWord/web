// Sweet Publishing illustrations live in R2, not in this repository (~6,000
// images, ~9 GB of originals). Bucket layout (see scripts/sweet/):
//   sweet/jpg/{NN}/{name}.jpg     original, as published by Sweet Publishing
//   sweet/web/{NN}/{name}.webp    1280 px wide, for viewing
//   sweet/thumb/{NN}/{name}.webp  480 px wide, for the gallery grid
// {NN} is the book number that starts every file name ("01_Ge_01_01_RG" → 01),
// the same folders the images had on filedn.com.
import { SITE } from './site';

export type SweetSize = 'jpg' | 'web' | 'thumb';

export function sweetImageUrl(name: string, size: SweetSize = 'web'): string {
  const folder = name.slice(0, 2);
  const ext = size === 'jpg' ? 'jpg' : 'webp';
  return `${SITE.mediaBase}/sweet/${size}/${folder}/${name}.${ext}`;
}

/** "01_Ge_01_02_RG" → { chapter: "1", frame: "2" } for captions. */
export function sweetParts(name: string): { chapter: string; frame: string } {
  const m = name.match(/^\d+_[A-Za-z0-9]+_(\d+)_([0-9a-z]+)/);
  return { chapter: m ? String(Number(m[1])) : '', frame: m ? m[2].replace(/^0+(?=\d)/, '') : '' };
}
