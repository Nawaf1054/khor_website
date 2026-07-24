# خور · Khor

One-page Arabic (RTL) landing site for Khor café. Static Astro build, no backend.

Ported from the Claude Design handoff `Khor.dc.html`
(project `fdd1fa60-6705-4787-83a6-6c1e2f734085`), which remains the visual source of truth.

## Before launch

1. **Set `site` in `astro.config.mjs`** to Khor's real domain. Until it is set, the
   canonical link and absolute `og:url` / `og:image` are omitted rather than guessed.

2. **Consider compressing `public/khor-video.mp4`.** It is 3.11 MB — 576×1024 portrait,
   17.1s, H.264 — against ~180 KB for the entire rest of the page, so it is ~95% of the
   payload and roughly 2.7× the PRD's whole 1.2 MB budget. Shipping it as-is is a
   deliberate choice, not an oversight. If it is ever revisited, the easy wins are
   stripping the unused AAC audio track (the element is muted) and trimming to a ~10s
   loop; the design's `blur(2px)` means a lower bitrate would not be visible.

   Note the source is **portrait**, so on desktop `object-fit: cover` crops it to a
   horizontal band and upscales ~2.5×. It is sharpest on phones.

## Structure

All copy and pricing lives in config — no strings are hardcoded in components.

```text
src/
├── config/
│   ├── brand.json      name, tagline, phone, WhatsApp, Instagram, map link, hours
│   └── menu.json       3 categories, 21 items, single or dual pricing
├── components/         Header, Hero, Menu, Locations, Contact, Socials, Footer
│                       + shared Card, SectionHeading, IconTile, Icon
├── layouts/Layout.astro   <html dir="rtl" lang="ar">, meta/OG, JSON-LD
├── pages/index.astro
└── styles/global.css   font imports, @theme tokens, card + base styles
```

`Layout.astro` builds the JSON-LD `CafeOrCoffeeShop` schema — including the full menu —
from those same two JSON files, so the structured data cannot drift from the page.

## Conventions

- **RTL**: logical properties only (`ms-`/`me-`/`ps-`/`pe-`, `start-`/`end-`). No
  `left`/`right` anywhere.
- **Numerals**: phone numbers and Latin runs carry `dir="ltr"`. Menu prices are
  deliberately *not* wrapped — the price and its `SR` suffix already resolve LTR as a
  unit, and isolating the pair would flip their visual order.
- **Fonts**: self-hosted via Fontsource (Reem Kufi, Tajawal, Jost, Cormorant Garamond),
  only the weights the design actually uses. No Google Fonts request.
- **JS**: one ~10-line inline script for the header scroll state. Nothing else.

## Commands

Run from the project root.

| Command             | Action                                    |
| :------------------ | :---------------------------------------- |
| `npm install`       | Install dependencies                      |
| `npm run dev`       | Dev server at `localhost:4321`            |
| `npm run build`     | Build to `./dist/`                        |
| `npm run preview`   | Preview the production build              |

Per `AGENTS.md`, prefer `astro dev --background`, managed with `astro dev stop`,
`astro dev status`, and `astro dev logs`.
