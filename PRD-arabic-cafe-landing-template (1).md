# PRD — Arabic One-Page Template for Cafés & Restaurants

**v2 · 24 July 2026**
Productized template · Arabic RTL only · Static, no backend

---

## 1. What it is

One scrolling Arabic page, sold repeatedly. Same codebase every time; only config files change. The page makes a fast brand impression, then pushes the visitor to one of four actions: **menu · WhatsApp · directions · socials.**

No ordering, no reservations, no CMS, no login. Content edits are done by me and redeployed.

**Constraints that drive every decision below:** deploy a new client in ≤2 hours · $0 hosting · zero code edits per client · visitor is on a phone, on mobile data, deciding in seconds.

---

## 2. Success criteria

| | Target |
|---|---|
| New client deploy | ≤ 2 hours |
| Lighthouse mobile perf | ≥ 95 |
| LCP on 4G | < 1.5s |
| Page weight | < 1.2 MB |
| Content-edit turnaround | < 24h |

---

## 3. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro** | Ships zero JS by default; islands only where needed. Builds to static HTML. |
| Styling | **Tailwind** + logical properties | `ms-/me-/ps-/pe-` mirror automatically. Never `left`/`right`. |
| Images | Astro `<Image>` → WebP/AVIF | Resizes and converts at build time. No manual export step. |
| Host | **Cloudflare Pages** | Free, global CDN, git push to deploy, free SSL. |
| Analytics | **Cloudflare Web Analytics** | Free, no cookie banner, ~0 KB. |
| Font | **Tajawal** or **Almarai**, self-hosted, Arabic subset | A system default font is the fastest way to look cheap. |
| Icons | **Lucide**, inline SVG | No icon-font request. |

Total client-side JS budget: **< 15 KB**. Three islands only — menu tabs, gallery lightbox, hours badge.

---

## 4. How it works

```
src/
├── config/
│   ├── brand.json      ← name, tagline, about, phone, WhatsApp, socials, address, coords
│   ├── menu.json       ← categories → items
│   ├── hours.json      ← weekly shifts + exceptions
│   ├── reviews.json    ← curated quotes
│   └── theme.json      ← colors, font, radius, brand-moment
├── components/         ← Hero, Menu, Gallery, Reviews, Location, StickyBar…
├── pages/index.astro   ← imports configs, passes to components
└── public/images/      ← logo, hero, gallery, item photos
```

**The flow:** `index.astro` imports the five JSON files and passes them as props. Components render from data — no hardcoded strings anywhere. `theme.json` values are injected as CSS custom properties on `<html>`, so colors and radius cascade without a Tailwind rebuild.

```js
// index.astro
const style = `--c-primary:${theme.primary}; --c-accent:${theme.accent}; --radius:${theme.radius}`
```

**New client checklist (the 2 hours):**
1. `git clone` template → new repo
2. Drop photos in `/public/images/`
3. Fill the five JSON files
4. Set colors + font in `theme.json`
5. Push → Cloudflare Pages auto-deploys
6. Point client's domain, generate QR code

If you ever edit a component for a client, that thing belongs in config and isn't there yet.

---

## 5. Page sections

| # | Section | Contents |
|---|---|---|
| 1 | Sticky header | Logo (right), hours badge, anchors: القائمة · عننا · الموقع · تواصل |
| 2 | Hero | Full-viewport image/muted loop · brand name · tagline · **اطلب عبر واتساب** + **الاتجاهات** |
| 3 | About | 2–4 sentences + 3–4 icon features (مقهى عائلي، تحميص يومي، جلسات خارجية) |
| 4 | **Menu** | Category tabs, items with price + badges, optional photos, optional طبق اليوم |
| 5 | Gallery | 6–12 photos, lazy, blur-up, swipeable lightbox |
| 6 | Reviews | 3–5 curated quotes + **شاهد كل التقييمات على Google** |
| 7 | Location | Deferred map, address, Google/Apple Maps buttons, weekly hours (today highlighted) |
| 8 | Contact | WhatsApp, phone, Instagram, TikTok, Snapchat — only what's in config renders |
| 9 | Footer | Copyright + your credit link |
| — | **Sticky mobile bar** | Fixed bottom, mobile only: واتساب · الاتجاهات · القائمة |

The sticky bar is the highest-value element on the page — it removes the need to scroll back to act.

The menu is the main differentiator: **real HTML, not a JPG.** Selectable, indexed by Google, readable by screen readers, instant. Competitors upload images. The gap is visible in a demo.

---

## 6. The four signature features

### 6.1 Live open/closed badge
Reads `hours.json`, computes state client-side in Asia/Riyadh — never device timezone.

```json
{
  "timezone": "Asia/Riyadh",
  "week": {
    "sun": [["07:00","12:00"], ["16:00","23:30"]],
    "fri": [["13:30","23:30"]]
  },
  "exceptions": { "2026-03-20": [] }
}
```

States: `مفتوح الآن` (green, soft pulse) · `يغلق قريبًا` (amber, <60 min to close) · `مغلق · يفتح ٧:٠٠ ص` (grey). Handles split shifts, past-midnight closing, and date overrides for Ramadan and holidays.

~40 lines of JS. Highest perceived intelligence per line on the whole site.

### 6.2 WhatsApp deep link
```
https://wa.me/9665XXXXXXXX?text={encodeURIComponent(brand.whatsappGreeting)}
```
Opens WhatsApp with the message pre-typed. Feels like a contact system; is a formatted string.

### 6.3 Menu as data
```json
{ "name": "لاتيه", "desc": "حليب مبخّر وإسبريسو", "price": 18,
  "badges": ["الأكثر مبيعًا"], "image": "latte.webp" }
```
Layout must hold up with photos, without photos, or mixed — different clients supply different things.

### 6.4 One brand moment
Exactly one memorable animation, selected in `theme.json`: `steam` · `unfold` · `kenburns` · `none`. **One.** Five animations make a site feel cheap and slow. Disabled automatically under `prefers-reduced-motion`.

---

## 7. RTL specifics

- `<html dir="rtl" lang="ar">`
- Layout mirroring via logical properties only — no `left`/`right` anywhere
- Directional icons (arrows, chevrons) flipped
- **Numbers stay LTR inside RTL text.** Prices, phone numbers, and Latin brand names need isolation or they render scrambled:
  ```html
  <span dir="ltr">18</span> ر.س
  ```
- Font subset to Arabic + Latin digits, `font-display: swap`, self-hosted (no Google Fonts request)

---

## 8. SEO

**JSON-LD `Restaurant` schema**, generated from the same configs that render the page — so it can never drift out of sync:

```js
{
  "@type": "Restaurant",
  "name": brand.name,
  "address": brand.address,
  "geo": brand.coords,
  "telephone": brand.phone,
  "priceRange": "$$",
  "openingHoursSpecification": hoursToSchema(hours),
  "hasMenu": "#menu"
}
```

This is what feeds the Google Business listing and Maps card — a concrete, sellable benefit.

Plus: Arabic `<title>`/description per client, Open Graph image so WhatsApp and Instagram link previews look right, `sitemap.xml`, canonical URL.

---

## 9. Performance rules

- Hero image `preload`; everything below the fold `loading="lazy"` with blur-up placeholder
- **Map iframe deferred** — render a static map image, load the real iframe on tap. A Google Maps embed is heavy and will otherwise wreck LCP
- All images WebP/AVIF, sized at build
- No framework runtime shipped to the client

---

## 10. Decisions already made

| Question | Decision | Reason |
|---|---|---|
| Live Google reviews | **No** — curated quotes + profile link | API returns only 5 uncontrollable reviews, needs a Worker to hide the key, adds a breakable dependency to every deploy. Sell as add-on if asked. |
| Google Sheet as CMS | **No** | Adds a fetch, loading state, cache layer, and failure mode to solve a problem the owner doesn't have. |
| Owner-editable menu | **No** | Owner lives in WhatsApp and won't learn a dashboard. <24h turnaround *is* the product. |
| English version | **No** | Removes the entire i18n layer. Paid add-on only. |
| Ordering / reservations | **No** | WhatsApp covers both in this market. |

---

## 11. Deliverables per client

Live site on their domain · one revision round · OG link-preview image · QR code (SVG + PNG) for tables · setup instructions for Instagram bio and Google Business · retainer terms **stated in the proposal, not raised after the third free edit.**

---

## 12. Build order

1. **Core** — RTL foundation, all sections, config-driven rendering, hours badge, sticky bar
2. **Polish** — perf pass, JSON-LD, lightbox, theme variants, a11y audit
3. **First real client** — time the deploy; anything slower than expected becomes a config option
4. **Productize** — demo site with fictional brand for sales, intake form, deploy checklist, pricing tiers

---

## 13. Still open

- **Photography** — yours or theirs? Bad photos sink a good template, and it's the one thing outside your control. Strong candidate for a paid add-on.
- **Domain** — client-owned is cleaner; you avoid holding their asset.
- **Pricing** — flat, or tiered (basic / + photography / + live reviews)?
- **Ramadan hours toggle** — every café needs the same edit at the same time each year. Predictable annual billing.
