# Site design system

The approved redesign of unfoldingword.org, as reference designs plus the rules behind them.
The site implements it: tokens and shared classes in `src/styles/global.css`, portfolios in
`src/lib/portfolios.ts`, components in `src/components/`, and the design-system blocks
(`scrollStory`, `portfolioGrid`, `portfolioNav`, `takeaway`, `pillars`, `beforeAfter`,
`giveBand`, `logoGrid`) documented in `docs/content-guide.md`. Copy on the site comes from the
existing content files, not from these designs; the designs are canon for look only.

- **Live canvas (review and Play the scroll sections):** https://claude.ai/artifact/5VhV4aypm4vSa3Q78Zo5Rb (private; ask Jesse for access)
- **`designs/`**: one file per page design or shared part, exported from the canvas.
- **`assets/`**: new image files the designs use that the site does not have yet.

## How to read the design files

Each `designs/*.dc.html` file is the markup of one artboard. They do not run on their own
(they need the canvas runtime), so read them as annotated HTML:

- All styling is inline `style="…"`. Treat the values as the specification, then express them
  as tokens in `global.css` and Tailwind utilities in components. Pages must not carry
  one-off styling (see `CLAUDE.md`).
- `{{name}}` is a value from the `renderVals()` function at the bottom of the file.
  `<sc-for>` repeats, `<sc-if>` branches, `<dc-import name="X">` mounts `X.dc.html`.
- Image `src` values are repository paths (`/src/assets/images/…`, `/public/brand/…`,
  `/docs/design-system/assets/…`).
- Widths are designed at 1440px with a 1280px content column and 32px gutters. Layouts wrap
  with flexbox for phone widths, but **phone layouts have not been reviewed**.

| Design file | What it is | Closest thing in the site today |
|---|---|---|
| `Home.dc.html` | Home page | `src/content/pages/en/index.md` |
| `Portfolio.dc.html` | A portfolio page (Transformation) | `overview.md`, `wbwn/index.md` |
| `Project.dc.html` | A country project (Benin) | `wbwn/benin.md` |
| `Product.dc.html` | A tool or resource (translationCore) | `translationcore.md`, `bt-servant.md` |
| `Give.dc.html` | Giving page | `give/*.md`, `Giving.astro` |
| `Stories.dc.html` | Stories index and testimonial wall | `src/pages/stories/`, `StoryList.astro` |
| `Story.dc.html` | One story | `StoryTemplate.astro` |
| `Pray.dc.html` | Prayer requests | `pray.md`, `PrayerList.astro`, `PrayerTemplate.astro` |
| `People.dc.html` | Leadership, board, team | `leadership.md`, `People.astro` |
| `Article.dc.html` | Standard content page with steps, resources, FAQ | `ccbt/*.md`, `Prose`, `Steps`, `Resources`, `Faq` |
| `Header.dc.html`, `Footer.dc.html` | Site header and footer | `src/components/site/` |
| `GiveBand.dc.html` | Closing give section on most pages | `Cta.astro` / `Giving.astro` |
| `ScrollStory.dc.html` | Scroll-pinned sequence of steps (new) | none |
| `PortfolioGrid.dc.html` | The four portfolios (new) | none |
| `Foundations.dc.html` | Color, type, buttons, cards and the rules below, drawn out | `/styleguide/` |

## Foundations

**Color.** The brand palette is unchanged: Tech `#231F20`, Ocean `#014263`, Inspire `#31ADE3`,
Cultivate `#70C9CC`, Kindle `#E59D33`, plus the existing derived tokens (Deep Ocean `#012C42`,
Inspire ink `#0B6E9E` for links and small blue text on white, Mist `#F4F9FB`, line `#DCE6EB`).

**Type.** Avenir (Nunito Sans fallback). Headlines are **Avenir Black (weight 900)**, up from 800.
Body is 17px Book. Quotes from people are always PT Serif, so a person's words look different
from ours. Impact numbers are very large (up to 136px), one per moment, with a plain label.

**No eyebrows.** Do not put a small uppercase label above a headline. Small labels that carry
information inside a card (a story's region, "Before" / "Now", a step name) are fine.

**Shape.** Photos and large cards 24px corners; cards 20px; small cards and fields 12 to 16px;
buttons and chips fully rounded.

**Section grounds.** White for reading and forms; Mist for grids of cards; Ocean for number
bands and the give band; Deep Ocean for heroes. Dark panels carry a subtle grainy gradient
(`assets/grain.png` over a brand-color gradient), as the brand book specifies.

**Emphasis in headlines.** Key phrases may be set in Inspire or Kindle on Ocean grounds only
(see the footer tagline). On white they fail contrast, so headlines stay Ocean.

**Buttons.** The Give button is Kindle with Tech text everywhere. Primary is Ocean with white
text; secondary is an Ocean outline. Inside a Cultivate, Inspire or Kindle panel, buttons are
Ocean with white text.

## The four portfolios

The work is presented as four portfolios, replacing the five programs on the current site.
Strategic Language Resources and Tools and Technology both sit inside Innovation. Unrestricted
giving is called **Equipping Partners** on the public site; do not use the word "unrestricted".

| Portfolio | Color | Text on the solid color |
|---|---|---|
| Transformation | Cultivate `#70C9CC` (tint `#E2F4F5`) | Ocean or Tech |
| Innovation | Inspire `#31ADE3` (tint `#D6EFFA`) | Large white headings only; small labels use Inspire ink on white |
| Catalyzation | Ocean `#014263` (tint `#CCD9E0`) | White |
| Equipping Partners | Kindle `#E59D33` (tint `#FAEBD6`) | Tech or Ocean |

Equipping Partners is Kindle on purpose: it matches the Give button, so the default ask on
every page points to where-most-needed giving. It is the default designation on the giving form.

The portfolio color appears on a portfolio page's hero panel and number band, on its tile in
`PortfolioGrid`, and as a small label on stories, projects and product pages.

Only Transformation has a full page design. Innovation, Catalyzation and Equipping Partners
follow the same template in their own colors.

## Rules from the brand book (2026)

- **Brand mark as a supporting shape.** Large, full color, *behind* a person cut out from their
  photo (see the Home hero). It may be cut off at the bottom or sides; the curved top always
  shows. **Never place the mark, or any graphic, over a face.**
- **Angled color layers.** Brand color at 70% opacity falling from the top-left corner of a
  photo, roughly 32 to 40 degrees from vertical, in two layers (see the Project and Pray
  heroes for the exact `clip-path`). Use it only on photos where no face sits under the color.
- **Logos.** Use the official files in `assets/` (`uw-logo-color.svg` on light,
  `uw-logo-reversed.png` or `uw-logo-white.svg` on dark). Do not typeset the name as a logo.
- **Security phrase.** Stories and the footer carry: "Names, locations, and images may have
  been altered or obscured for security purposes."
- **Voice.** The church is the hero, not unfoldingWord. Lead with church and gospel impact;
  tools are the means. Urgent quotes may appear as one beat inside a hopeful story, but nothing
  is framed as an emergency and speed is not the point. Say "Your generosity equips…", not
  "Your donation funds our programs". Islands-Asia is always hyphenated.
- **Lead examples.** Featured and worked examples use Benin, South Sudan or Islands-Asia.

## New behavior to build

- **Scroll-pinned story** (`ScrollStory.dc.html`, and a bespoke copy in `Home.dc.html`): a
  section pins to the viewport while the visitor scrolls; three parts fade in turn, with a
  progress bar of part names across the top. When the page cannot scroll, or for visitors who
  prefer reduced motion, the parts must simply stack. Used on Home, portfolio and product pages.
- **Before / with toggle** on the product page.
- **Region filters** on the stories index and the project grid.
- **"I prayed for this"** toggle on prayer requests (local state only in the design).
- **FAQ accordion** on giving and article pages.

## Sample content in the designs

The designs use real copy and photos from the site wherever possible. These parts are
placeholders and must not be published as they are:

- Giving form amounts and the tax note (the Virtuous form supplies the real ones; form ids
  come from the editor or Virtuous, never from these files).
- Team names, roles and bios in brackets on the People page.
- Prayer request summaries (most titles come from `src/content/prayer/`; the summaries do not).
- Donor FAQ answers, story one-liners, and the fourth progress step on the Project page.
- Which story belongs to which portfolio, and Whole Bible | Whole Nation sitting under
  Transformation, are assumptions to confirm with Jesse.
- Shortened endorsement and field quotes: use the full quotes from the content files.

## Assets added here

| File | Use | Source |
|---|---|---|
| `assets/uw-logo-color.svg`, `uw-logo-white.svg`, `uw-logo-reversed.png` | Header and footer logos | unfoldingWord brand folder |
| `assets/cut-hero-woman-desert.png`, `cut-field-ibrahim.png`, `cut-field-birhan.png` | People cut out from existing site photos, for use in front of the mark | `src/assets/images/home/` |
| `assets/grain.png` | Grain texture for dark gradient panels | generated |
| `assets/illumiNations.jpg`, `assets/partners/*.jpg` | illumiNations alliance and partner logos | current unfoldingword.org home page |

Move the ones the site needs into `src/assets/images/` or `public/brand/` when implementing,
and write alt text from looking at each image.

## Not designed yet

Innovation, Catalyzation and Equipping Partners portfolio pages; Sweet Publishing book
gallery; contact page; search; 404; dedicated phone layouts; right-to-left locales.
