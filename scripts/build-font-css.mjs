// Generate self-hosted webfont CSS into public/fonts/ (adapted from
// openbiblestories.org).
//
// No fonts.googleapis.com: it is a render-blocking third-party round trip,
// discloses visitors' IPs, and is slow or blocked in parts of the world this
// site serves. Instead:
//   public/fonts/base.css    — Nunito Sans (variable) + PT Serif, latin and
//                              latin-ext, linked on every page
//   public/fonts/{script}.css — one pack per non-Latin script, linked only on
//                              that locale's pages (fontHrefFor() in
//                              src/i18n/index.ts)
//
// Avenir is deliberately NOT here: it is a licensed commercial font and this
// repository is public. Apple devices have it installed; everyone else gets
// Nunito Sans, the brand guide's named fallback.
//
// Run before every dev/build (npm pre-scripts). Output is gitignored.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, 'public/fonts');
const FILES_OUT = join(OUT, 'files');

const PACKS = {
  base: [
    { pkg: '@fontsource-variable/nunito-sans', files: ['index.css'] },
    { pkg: '@fontsource/pt-serif', files: ['latin-400.css', 'latin-ext-400.css', 'latin-700.css', 'latin-400-italic.css'] },
  ],
  arabic: [{ pkg: '@fontsource/noto-sans-arabic', files: ['400.css', '700.css'] }],
  nastaliq: [{ pkg: '@fontsource/noto-nastaliq-urdu', files: ['400.css', '700.css'] }],
  devanagari: [{ pkg: '@fontsource/noto-sans-devanagari', files: ['400.css', '700.css'] }],
  bengali: [{ pkg: '@fontsource/noto-sans-bengali', files: ['400.css', '700.css'] }],
  myanmar: [{ pkg: '@fontsource/noto-sans-myanmar', files: ['400.css', '700.css'] }],
  han: [{ pkg: '@fontsource/noto-sans-sc', files: ['400.css', '700.css'] }],
  // Nunito Sans's variable package covers cyrillic too; its index.css
  // declares that range, so Russian needs no extra pack.
  cyrillic: [],
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(FILES_OUT, { recursive: true });

const summary = [];
for (const [pack, parts] of Object.entries(PACKS)) {
  let css = '';
  const referenced = new Map();
  for (const { pkg, files } of parts) {
    const pkgDir = join(ROOT, 'node_modules', pkg);
    for (const file of files) {
      const p = join(pkgDir, file);
      if (!existsSync(p)) {
        console.warn(`font pack ${pack}: missing ${pkg}/${file}`);
        continue;
      }
      css += readFileSync(p, 'utf8').replace(/url\(\.\/files\/([^)]+)\)/g, (_, f) => {
        referenced.set(f, join(pkgDir, 'files', f));
        return `url(/fonts/files/${f})`;
      }) + '\n';
    }
  }
  // woff2 only: every browser this site supports reads it, and the woff
  // fallbacks would double the files shipped.
  css = css.replace(/,\s*url\([^)]+\.woff\)\s*format\('woff'\)/g, '');
  for (const [f, src] of referenced) if (f.endsWith('.woff2') && existsSync(src)) copyFileSync(src, join(FILES_OUT, f));
  css = css.replace(/font-display:\s*\w+/g, 'font-display: swap');
  writeFileSync(join(OUT, `${pack}.css`), css);
  summary.push(`${pack}: ${[...referenced.keys()].filter((f) => f.endsWith('.woff2')).length}`);
}
console.log('font packs built —', summary.join(', '));
