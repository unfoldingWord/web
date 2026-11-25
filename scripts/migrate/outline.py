#!/usr/bin/env python3
"""Turn the WordPress export into one readable brief per page, for migration.

Reads .migration-cache/wp/*.json (from export-wp.mjs) and the live pages'
<head> (meta description, og:image), and writes, per item:

  .migration-cache/items/<kind>/<slug>.md   — the old page as Markdown-ish
      text in reading order: headings, paragraphs with [links](…), lists,
      ![images](…), [BUTTON …] links, [VIRTUOUS FORM data-rd=…], [IFRAME …],
      [VIDEO …]. Elementor's layout wrappers are dropped.
  .migration-cache/items/index.json        — every item with old URL, new
      URL, title, dates, description, featured image and brief path.

The briefs are what a person (or Claude) reads to rebuild each page on the
new templates. They are not published. Standard library only.

Usage: python3 scripts/migrate/outline.py
"""
import html
import json
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WP = ROOT / '.migration-cache' / 'wp'
OUT = ROOT / '.migration-cache' / 'items'
URLMAP = json.loads((ROOT / 'scripts' / 'migrate' / 'url-map.json').read_text())
UA = {'User-Agent': 'unfoldingWord-site-migration'}

SKIP_CLASSES = re.compile(r'(sharedaddy|jp-relatedposts|wpcf7|elementor-share|screen-reader-text|elementor-post-navigation|wpfront)')
BLOCK = {'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'figcaption', 'dt', 'dd', 'td', 'th', 'summary'}


def original_image(url):
    """i0.wp.com/… and -300x200 resized copies → the original upload URL."""
    url = html.unescape(url)
    url = re.sub(r'^https?://i\d\.wp\.com/', 'https://', url)
    url = url.split('?')[0]
    url = re.sub(r'-\d{2,4}x\d{2,4}(?=\.(jpe?g|png|webp|avif|gif)$)', '', url, flags=re.I)
    url = re.sub(r'-scaled(?=\.(jpe?g|png|webp|avif)$)', '', url, flags=re.I)
    return url


class Outline(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lines = []
        self.buf = ''
        self.stack = []
        self.skip_depth = 0
        self.link = None
        self.list_depth = 0
        self.cur_block = None

    def flush(self):
        text = re.sub(r'[ \t\r\n]+', ' ', self.buf).strip()
        if text:
            prefix = {'h1': '# ', 'h2': '## ', 'h3': '### ', 'h4': '#### ', 'h5': '##### ', 'h6': '###### ',
                      'li': '  ' * max(0, self.list_depth - 1) + '- ', 'blockquote': '> ', 'figcaption': '_caption:_ ',
                      'summary': '**Q:** '}.get(self.cur_block, '')
            self.lines.append(prefix + text)
        self.buf = ''

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get('class', '') or ''
        void = tag in ('img', 'br', 'hr', 'input', 'meta', 'link', 'source')
        if self.skip_depth:
            if not void:
                self.skip_depth += 1
            return
        if tag in ('style', 'noscript', 'form', 'button', 'svg', 'select') or SKIP_CLASSES.search(cls):
            if not void:
                self.skip_depth = 1
            return
        if tag == 'script':
            src = a.get('src', '') or ''
            if 'virtuous' in src:
                self.flush()
                self.lines.append(f"[VIRTUOUS FORM data-rd={a.get('data-rd')} data-organizationId={a.get('data-organizationid')} type={a.get('data-type')}]")
            self.skip_depth = 1
            return
        if tag in BLOCK:
            self.flush()
            self.cur_block = tag
        if tag in ('ul', 'ol'):
            self.flush()
            self.list_depth += 1
        if tag == 'br':
            self.buf += ' '
        if tag == 'a':
            href = a.get('href', '') or ''
            self.link = {'href': href, 'button': 'elementor-button' in cls or 'button' in cls, 'start': len(self.buf)}
        if tag == 'img':
            src = a.get('data-orig-file') or a.get('data-src') or a.get('src') or ''
            if src.startswith('data:') or not src:
                return
            alt = (a.get('alt') or '').strip()
            self.flush()
            self.lines.append(f'![{alt}]({original_image(src)})')
        if tag == 'iframe':
            self.flush()
            self.lines.append(f"[IFRAME src={a.get('src') or a.get('data-src')} title={a.get('title', '')}]")
        if tag in ('video', 'source') and a.get('src'):
            self.flush()
            self.lines.append(f"[VIDEO src={a.get('src')}]")
        if 'elementor-widget-video' in cls and a.get('data-settings'):
            m = re.search(r'(youtube_url|vimeo_url)":"([^"]+)', html.unescape(a.get('data-settings')))
            if m:
                self.flush()
                self.lines.append(f"[VIDEO {m.group(1).split('_')[0]} {m.group(2).replace(chr(92), '')}]")
        self.stack.append(tag)

    def handle_endtag(self, tag):
        if self.skip_depth:
            self.skip_depth -= 1
            return
        if tag == 'a' and self.link:
            text = self.buf[self.link['start']:].strip()
            href = self.link['href']
            if text and href and not href.startswith('#'):
                rendered = f"[BUTTON {text}]({href})" if self.link['button'] else f'[{text}]({href})'
                self.buf = self.buf[:self.link['start']] + (' ' if self.link['start'] else '') + rendered + ' '
            self.link = None
        if tag in BLOCK:
            self.flush()
            self.cur_block = None
        if tag in ('ul', 'ol'):
            self.flush()
            self.list_depth = max(0, self.list_depth - 1)
        if tag in ('div', 'section', 'span') and self.cur_block is None:
            self.flush()
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()

    def handle_data(self, data):
        if self.skip_depth:
            return
        if self.cur_block in ('strong', 'b'):
            data = f'**{data}**'
        self.buf += data


def outline(rendered):
    p = Outline()
    p.feed(rendered)
    p.flush()
    out, prev = [], None
    for line in p.lines:
        if line != prev:
            out.append(line)
        prev = line
    return '\n\n'.join(out)


def head_meta(url):
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=30) as r:
            h = r.read().decode('utf-8', 'replace')
    except Exception as e:  # noqa: BLE001
        return {'error': str(e)}
    head = h.split('</head>')[0]

    def meta(attr, name):
        m = re.search(rf'<meta[^>]+{attr}="{re.escape(name)}"[^>]+content="([^"]*)"', head) or re.search(rf'<meta[^>]+content="([^"]*)"[^>]+{attr}="{re.escape(name)}"', head)
        return html.unescape(m.group(1)) if m else None
    t = re.search(r'<title>(.*?)</title>', head, re.S)
    # Elementor theme templates (single post/page) put content outside
    # post_content; keep the live body text for those as a cross-check.
    body = h.split('</head>', 1)[-1]
    return {
        'title': html.unescape(t.group(1).strip()) if t else None,
        'description': meta('name', 'description'),
        'ogImage': meta('property', 'og:image'),
        'robots': meta('name', 'robots'),
        'liveBody': body,
    }


def main():
    media = {m['id']: m for m in json.loads((WP / 'media.json').read_text())}
    cats = {c['id']: c['slug'] for c in json.loads((WP / 'categories.json').read_text())}
    users = {u['id']: u['name'] for u in json.loads((WP / 'users.json').read_text())}
    kinds = {'pages': 'page', 'posts': 'story', 'prayer-request': 'prayer', 'sweet-publishing': 'sweet'}
    items = []
    for f, kind in kinds.items():
        for it in json.loads((WP / f'{f}.json').read_text()):
            old = re.sub(r'^https?://unfoldingword\.org', '', it['link'])
            fm = media.get(it.get('featured_media'))
            items.append({
                'kind': kind,
                'wpId': it['id'],
                'slug': it['slug'],
                'oldUrl': old,
                'newUrl': URLMAP.get(old, old),
                'title': html.unescape(it['title']['rendered']),
                'date': it['date'],
                'modified': it['modified'],
                'template': it.get('template'),
                'parent': it.get('parent'),
                'categories': [cats.get(c) for c in it.get('categories', [])],
                'author': users.get(it.get('author')),
                'excerpt': re.sub(r'<[^>]+>', '', html.unescape(it.get('excerpt', {}).get('rendered', ''))).strip(),
                'featuredImage': original_image(fm['source_url']) if fm else None,
                'featuredAlt': fm.get('alt_text') if fm else None,
                '_rendered': it['content']['rendered'],
            })
    with ThreadPoolExecutor(8) as ex:
        heads = list(ex.map(lambda i: head_meta('https://unfoldingword.org' + i['oldUrl']), items))
    OUT.mkdir(parents=True, exist_ok=True)
    for it, hd in zip(items, heads):
        rendered = it.pop('_rendered')
        live = hd.pop('liveBody', '') or ''
        it.update({k: v for k, v in hd.items() if k != 'error'})
        text = outline(rendered)
        # Posts and Sweet pages are laid out by theme templates: use the live
        # page's main content when the API content is thin.
        if len(text) < 400 and live:
            m = re.search(r'data-elementor-type="(?:single-post|single-page|single|wp-post|wp-page)".*?(?=<footer|data-elementor-type="footer")', live, re.S)
            if m:
                text = outline(m.group(0))
        brief = OUT / it['kind'] / f"{it['slug']}.md"
        brief.parent.mkdir(parents=True, exist_ok=True)
        header = {k: v for k, v in it.items()}
        brief.write_text('---\n' + json.dumps(header, indent=1, ensure_ascii=False) + '\n---\n\n' + text + '\n')
        it['brief'] = str(brief.relative_to(ROOT))
        it['briefChars'] = len(text)
    (OUT / 'index.json').write_text(json.dumps(items, indent=1, ensure_ascii=False))
    print(f'{len(items)} briefs written to {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    sys.exit(main())
