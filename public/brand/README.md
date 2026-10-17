# Halaxis logo kit

Served from this folder at `/brand`. PNG only. Do not add an SVG of the mark, the lockup, the favicon, the apple touch icon, or the Open Graph image.

`mark.png` is the official gold monogram (the file previously at `public/images/halaxis-monogram.png`). The header uses it. Everything else in this folder is derived from that file. Transparency is part of the artwork: do not flatten these onto a filled rectangle.

## Files

| File | Size | Use |
|---|---|---|
| `logo-full.png` | 5765×1272 | Horizontal lockup: official mark, wordmark, and tagline. For the dark theme. |
| `logo-full-white.png` | 5765×1272 | Same lockup, knocked out to white. |
| `mark.png` | 1328×1184 | Official gold monogram. Header, and the source for the icons. |
| `mark-white.png` | 1328×1184 | Same monogram in white. Alpha matches `mark.png`. |
| `favicon.ico` | 16, 32, 48 | Browser icon. |
| `favicon-32.png` | 32×32 | PNG favicon. |
| `apple-touch-icon.png` | 180×180 | Apple touch icon. |
| `icon-192.png` | 192×192 | Manifest icon. |
| `icon-512.png` | 512×512 | Manifest icon. |
| `og-image.png` | 1200×630 | Open Graph and Twitter image. Official mark, centered. |

The four master files are at least 1024px wide. Do not scale the small icons back up and treat them as masters.

## Brand colors

Taken from the theme in `src/app/globals.css` (`:root`) and the existing viewport color in `src/app/layout.tsx`. Hex values are the HSL tokens converted. The header wordmark color is the literal already used by `.brand-type`.

| Token | Hex | Where |
|---|---|---|
| background | `#140b0d` | `--background` `345 29% 6%` |
| foreground | `#f7f2e9` | `--foreground` `39 45% 94%` |
| card | `#221115` | `--card` `345 32% 10%` |
| popover | `#1e1013` | `--popover` `345 32% 9%` |
| primary | `#952d47` | `--primary` `345 54% 38%` |
| primary-foreground | `#f8f6f2` | `--primary-foreground` `40 30% 96%` |
| secondary | `#331f24` | `--secondary` `345 24% 16%` |
| secondary-foreground | `#ede8de` | `--secondary-foreground` `39 30% 90%` |
| muted | `#2b1d20` | `--muted` `345 20% 14%` |
| muted-foreground | `#bfb2a6` | `--muted-foreground` `30 16% 70%` |
| accent | `#3f2229` | `--accent` `345 30% 19%` |
| accent-foreground | `#f7f2e9` | `--accent-foreground` `39 45% 94%` |
| gold | `#debc7c` | `--gold` `39 60% 68%` |
| gold-foreground | `#1c0d11` | `--gold-foreground` `345 36% 8%` |
| border | `#4c402e` | `--border` `36 25% 24%` |
| input | `#544836` | `--input` `36 22% 27%` |
| ring | `#dab46c` | `--ring` `39 60% 64%` |
| destructive | `#d43535` | `--destructive` `0 65% 52%` |
| destructive-foreground | `#fafafa` | `--destructive-foreground` `0 0% 98%` |
| wordmark | `#fbf3df` | `.brand-type` in `globals.css` |
| theme-color | `#230b12` | `viewport.themeColor` in `layout.tsx` |

`logo-full.png` sets the wordmark and tagline in `#fbf3df`, matching the header. Use that lockup on the dark background. Use `logo-full-white.png` or `mark-white.png` when the gold mark does not have enough contrast.

## Usage

- The site header keeps the existing wordmark next to `/brand/mark.png`. Do not swap that for a different layout.
- Metadata icons, the web manifest, and the Open Graph image point at this folder. Do not add a second favicon, apple touch icon, or OG image elsewhere.
- Leave the alpha channel. Do not recolor, rotate, outline, shadow, or place the mark inside a colored tile.
- Keep the clear space already in each file. Do not crop into the mark.
- `og-image.png` is only the official mark on a transparent canvas. Do not add a headline or a background fill.
