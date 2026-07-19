@AGENTS.md
# AV Films — Portfolio Website
>
> ## Project Overview
> A professional photographer & videographer portfolio site for AV Films, a studio based in Pimpri, Pune, India. Built as a single-page storytelling experience with two parallel narrative worlds — Photography (emerald) and Videography (gold) — connected by a shared hero and a filmmakers section.
>
> ## Tech Stack
> - **Framework:** Next.js 14, App Router, TypeScript
> - **Styling:** Tailwind CSS (custom tokens defined in tailwind.config.ts)
> - **3D:** Three.js, @react-three/fiber, @react-three/drei
> - **Animation:** GSAP + ScrollTrigger, Framer Motion, Lenis (smooth scroll)
> - **Forms:** React Hook Form + Zod
> - **Email:** Resend (API route in src/app/api/inquiry/route.ts)
> - **Media:** Cloudinary for all images and videos
> - **CMS:** Sanity (optional, add later)
> - **Deployment:** Vercel
>
> ## Brand Identity
> - **Studio name:** AV Films
> - **Location:** Pimpri, Pune, Maharashtra, India
> - **Contact:** +91 75172 18149 and +91 75172 18150
> - **Instagram:** (to be confirmed)
> - **WhatsApp inquiry link:** https://wa.me/917517218149
>
> ## Color Tokens (tailwind.config.ts)
> Never use Tailwind's built-in color names for brand colors — they conflict.
> | Token | Hex | Usage |
> |---|---|---|
> | `charcoal` | `#0d0c0b` | Global background — used on ALL sections |
> | `avEmerald` | `#50c878` | Photo world accent color |
> | `avGold` | `#c9a84c` | Video world accent color |
> | `offwhite` | `#f5f0e8` | Wordmark, primary headings |
> | `muted` | `#a89f96` | Body text, labels, secondary |
>
> ## Typography
> - **Display / Headings:** Cormorant Garamond — loaded via `next/font/google`, weights 300, 400, 600, CSS variable `--font-display`
> - **Body / UI:** DM Sans — loaded via `next/font/google`, weights 200, 300, 400, 500, CSS variable `--font-sans`
> - **Labels / Code / Mono accents:** JetBrains Mono — loaded via `next/font/google`, weights 300, 400, CSS variable `--font-mono`
> - All three fonts declared in `src/app/layout.tsx` and applied to `<html>` element
>
> ## Page Architecture (Single Page — No Routing)
> All sections live on `src/app/page.tsx` in this order:
> 1. `<HeroSection />` — dual 3D orb entry point
> 2. `<PhotoWorldIntro />` — emerald world opener with 3D camera scroll
> 3. `<PhotoGallery />` — horizontal 3-slide coverflow (center + two neighbors), see "Photo Gallery — Plan Change" below
> 4. `<Filmmakers />` — bridge section, owner portraits
> 5. `<VideoGallery />` — card grid, autoplay preview clips + YouTube links, see "Video Gallery — Plan Change" below
> 6. `<InstagramFeed />` — live social feed
> 7. `<InquiryForm />` — multi-step smart form
> 8. `<Footer />` — minimal strip with filmstrip detail
>
> `<VideoWorldIntro />` is REMOVED from the page — do not render it.
> Filmmakers scrolls directly into VideoGallery now.
>
> ## Section IDs (used for scroll targeting)
> - Hero: `#hero`
> - Photo world: `#photo-world`
> - Photo gallery: `#photo-gallery`
> - Filmmakers: `#filmmakers`
> - Video gallery: `#video-gallery`
> - Instagram: `#instagram`
> - Inquiry: `#inquiry`
> - Footer: `#footer`
>
> ## 'use client' Rules
> - `layout.tsx` — NEVER add 'use client'
> - Any component using: hooks, R3F canvas, GSAP, Lenis, Framer Motion, event handlers — MUST have 'use client'
> - R3F canvas components (HeroOrbs, CameraScene, etc.) — MUST be dynamically imported with `ssr: false` in their parent section component
>
> ## Dynamic Import Pattern (mandatory for all 3D components)
> ```ts
> const HeroOrbs = dynamic(() => import('@/components/three/HeroOrbs'), { ssr: false })
> ```
> Always use this pattern — never import Three.js/R3F components directly in section files.
>
> ## GSAP ScrollTrigger — Always Register
> Every file that uses ScrollTrigger must include at the top:
> ```ts
> import { gsap } from 'gsap'
> import { ScrollTrigger } from 'gsap/ScrollTrigger'
> gsap.registerPlugin(ScrollTrigger)
> ```
> Never assume it was registered elsewhere.
>
> ## Tailwind Rules
> - Never use arbitrary color values like `bg-[#50c878]` — always use the defined tokens: `bg-avEmerald`, `text-avGold`, etc.
> - Never use Tailwind's built-in `emerald` or `gold` scales — they are intentionally excluded
> - Canvas elements: position via inline styles only (`style={{ position: 'absolute', inset: 0 }}`)
> - All HTML overlays above a canvas must have at minimum `z-10`
>
> ## Canvas Rules (R3F)
> - Always set `gl={{ alpha: true }}` — background color comes from the section CSS, not the canvas
> - Canvas wrapper div: `style={{ pointerEvents: 'none' }}` — re-enable only on interactive meshes via R3F event props
> - Mouse position for parallax: always `useRef<{x:number,y:number}>`, never `useState`
> - Detect touch/mobile before mount: `window.matchMedia('(hover: none)')` for parallax, `window.matchMedia('(max-width: 768px)')` for particle count
> - Never use useState for isMobile or isTouch detection
>   Always use useRef + useEffect + MediaQueryList pattern
> - Use MediaQueryList.addEventListener('change') to handle
>   viewport changes (desktop mode toggle in mobile browsers)
> - Extract position/scale logic into applyMobileLayout() 
>   function — call from both initial useEffect and change listener
> - 3D canvas components are always hidden on mobile via
>   "hidden md:block" wrapper div — never show Three.js canvas
>   on mobile unless explicitly specified for that section
>
> ## Mobile Breakpoints
> - Mobile: < 768px — reduced particles (200 max), no mouse parallax, stacked layouts, smaller 3D elements
> - Tablet: 768px–1024px — moderate particles (400), mouse parallax enabled, adjusted layouts
> - Desktop: > 1024px — full experience, 600+ particles, full parallax
>
> ## File Structure
> ```
> src/
> ├── app/
> │   ├── layout.tsx          # Fonts, SmoothScroll provider, global metadata
> │   ├── page.tsx            # All section components in order
> │   ├── globals.css         # Base styles, CSS variables
> │   └── api/
> │       └── inquiry/
> │           └── route.ts    # Resend email API route
> ├── components/
> │   ├── sections/           # One file per page section
> │   ├── three/              # All R3F / Three.js components
> │   └── ui/                 # Shared UI: SmoothScroll, Cursor, etc.
> ├── lib/
> │   └── lenis.ts            # useLenis hook export
> └── types/
>     └── index.ts            # Shared TypeScript types
> ```
>
> ## Lenis Smooth Scroll
> - Instance lives in `src/components/ui/SmoothScroll.tsx` as a context provider
> - Config: `duration: 1.2`, `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`, `smoothWheel: true`
> - GSAP ticker: `gsap.ticker.add((time) => lenis.raf(time * 1000))` + `gsap.ticker.lagSmoothing(0)`
> - Access in any component via `useLenis()` hook from `@/lib/lenis`
>
> ## What Makes This Site Feel Genuine (not AI-generated)
> - Slightly asymmetric layouts — avoid perfect centering everywhere
> - Film grain overlay on every section (CSS, not image)
> - Typography breaks the grid occasionally — large italic display text bleeds
> - Scroll behavior feels physical, not just fade-in
> - Real content only — no placeholder text, no lorem ipsum, ever
> - The filmstrip divider detail appears in the footer (brand signature)
> - Each section has a JetBrains Mono eyebrow label with letter-spacing
>
> ## Do Not
> - Do not install new npm packages without confirming with the user first
> - Do not create new pages — everything is single-page on `src/app/page.tsx`
> - Do not use lorem ipsum or placeholder text anywhere
> - Do not use `any` type in TypeScript
> - Do not add 'use client' to layout.tsx
> - Do not import Three.js or R3F directly in section components — always dynamic import
> - Do not use Tailwind's built-in emerald/gold color scales
> ```

---
## Mobile-First Rules (apply to every section, no exceptions)

### Layout
- Every section must work on 375px width minimum (iPhone SE)
- Use mobile-first Tailwind — base styles are mobile, scale up with md: and lg:
- No horizontal overflow on any section — test with overflow-x: hidden on body
- All flex/grid layouts stack vertically on mobile unless specified otherwise

### Typography Scale
- Display headings (Cormorant Garamond): clamp(2rem, 5vw, 4rem)
- Section headings: clamp(1.5rem, 3.5vw, 2.5rem)
- Body text: 14px mobile, 16px desktop
- Mono labels: 9px mobile, 10px desktop
- Never use fixed px values for headings — always clamp()

### Touch & Interaction
- All clickable elements minimum 44x44px tap target
- No hover-only interactions on mobile — all hover states need a touch equivalent
- Mouse parallax: always disabled on touch devices via window.matchMedia('(hover: none)')
- Cursor effects: disabled on touch devices

### 3D & Animation Performance
- Three.js scenes: always check isMobile before mount
  - Mobile: reduce geometry segments by 50%
  - Mobile: reduce particle count to 200 max
  - Mobile: disable mouse parallax
  - Mobile: simplify or replace complex scroll-scrubbed 3D animations with CSS alternatives
- GSAP ScrollTrigger pin: never use on mobile — pinning breaks mobile scroll momentum
  Replace with standard vertical scroll reveal instead
- Film grain: use CSS only (SVG filter), never a canvas element — canvas grain kills mobile performance

### Section-Specific Mobile Behavior
| Section | Desktop | Mobile |
|---|---|---|
| Hero | Two orbs side by side | Orbs stacked vertically, 60% size |
| PhotoWorldIntro | 3D camera full scroll rig | Simplified CSS animation, camera still visible but no scroll-scrub |
| PhotoGallery | 3-slide coverflow, drag to move, auto-advances | Same coverflow, drag/swipe on canvas, smaller spacing (see Plan Change below) |
| Filmmakers | Side by side portrait cards | Stacked vertically, full width |
| VideoGallery | 3-4 column masonry grid, preview clip autoplays (muted) when card enters viewport | 1 column mobile / 2 column tablet, same muted-autoplay-on-visible behavior |
| InstagramFeed | 3 column grid | 2 column grid |
| InquirySection | Full multi-step form | Same form, full width, larger tap targets |
| Footer | Horizontal layout | Stacked vertical |

### Images & Media
- Always use next/image with proper width and height props
- Never autoplay video WITH SOUND on mobile — require user interaction
  before any audio plays
- Exception: VideoGallery card preview clips are always muted and short
  (silent loop), so they're allowed to autoplay on scroll-into-view on both
  desktop and mobile — this is standard muted-preview UX, not the sound-video
  case the "no autoplay" rule is protecting against. See "Video Gallery —
  Plan Change" below.
- Provide loading="lazy" on all images below the fold

### Testing Breakpoints
Always verify at these widths before marking a section complete:
- 375px (iPhone SE — minimum)
- 390px (iPhone 14)
- 768px (iPad — transition point)
- 1280px (desktop standard)

## Known Dev Warnings (do not attempt to fix)
- THREE.Clock deprecation warning — comes from Three.js/R3F 
  internals, not our code. Will be resolved when three/r3f 
  packages update. Ignore it.
- 304 HMR errors on network IP — Turbopack dev-only issue 
  when accessing via local network IP. Does not affect 
  production build.
- "module.register() deprecated" — Node.js internal warning,
  ignore it
- tailwind.config.ts module type warning — fixed by adding
  "type": "module" to package.json

---

 ```
 ## Placeholder Rules — Media & Links

 All media content and external links will be filled in later.
 During development, use these exact placeholders consistently:

 ### Images
 - Placeholder src: `"/images/placeholder.svg"`
 - Always include proper alt text describing what the image will be
 - Always include width and height props on next/image
 - Example:
   ```tsx
   <Image
     src="/images/placeholder.svg"
     alt="Portrait photograph by AV Films"
     width={800}
     height={600}
     unoptimized
   />
   ```

 ### Videos (VideoGallery cards — two separate fields, don't confuse them)
 - `previewUrl` (short muted loop, plays inline in the card on scroll-into-view)
   - Placeholder: `""` (empty string)
   - Placeholder thumbnail: `"/images/placeholder.svg"`
   - Add a comment above: {/* TODO: Add preview clip URL (Cloudinary) */}
   - If empty, card shows the static thumbnail only — never autoplay a
     missing/broken src
 - `youtubeUrl` (the real published video the card links out to)
   - Placeholder: `""` (empty string)
   - Add comment: {/* TODO: Add YouTube URL */}
   - Never use a real YouTube URL as placeholder
   - Card is not clickable / shows "Coming Soon" if this is empty, even if
     `previewUrl` is already filled in
 - Example:
   ```tsx
   {/* TODO: Add preview clip URL (Cloudinary) */}
   {/* TODO: Add YouTube URL */}
   <video src="" poster="/images/placeholder.svg" muted loop playsInline />
   ```

 ### Instagram Handle
 - Placeholder: `"@avfilms"` (to be confirmed)

 ### Owner Photos (Filmmakers section)
 - Placeholder src: `"/images/filmmaker-1.svg"` and `"/images/filmmaker-2.svg"`
 - These will be replaced with real portrait photos

 ### Photo Gallery Images
 - Use `/images/placeholder.svg` for all gallery items
 - Keep the category labels and metadata real — only the image src is placeholder

 ### External Links
 - WhatsApp: `"https://wa.me/917517218149"` — this is real, keep it
 - Instagram profile: `"https://instagram.com/avfilms"` — placeholder, to be confirmed
 - All other external links: `"#"` with a comment {/* TODO: Add URL */}



 ### Never
 - Never use external URLs like unsplash.com or picsum.photos as placeholders
 - Never use real client photos without confirmation
 - Never leave an image src completely undefined — always use the placeholder path
 ```


## Data Layer — Source of Truth

All content lives in `src/data/`. 
Components never hardcode content — always import from data files.
When a value is unknown, use the placeholder conventions below.
When data is confirmed later, only the data file changes — 
no component changes needed.

### Data Files
| File | Purpose |
|---|---|
| `src/data/photos.ts` | Product photography portfolio |
| `src/data/videos.ts` | Video gallery cards — each has a muted `previewUrl` clip + a `youtubeUrl` link, see "Video Gallery — Plan Change" below |
| `src/data/filmmakers.ts` | Owner/team profile data |
| `src/data/instagram.ts` | Studio Instagram config |

### Placeholder Conventions in Data Files
- Unknown name: `''` with comment `// TODO: Add name`
- Unknown URL: `'#'` with comment `// TODO: Add URL`
- Unknown video link: `''` (empty string) with comment `// TODO: Add video URL`
- Unknown Instagram: `'@avfilms'` with comment `// TODO: Confirm handle`
- Images: always `'/images/placeholder.svg'` with `unoptimized` prop

### Photo Aspect Ratios
Each photo has an `aspect` field: `'square' | 'portrait' | 'landscape'`
- `landscape` → wider than tall, hero/feature images
- `square` → equal dimensions, standard product shot
- `portrait` → taller than wide, vertical product shot
This field controls each card's aspect/size in the coverflow
(desktop and mobile both use the same 3-slide layout, just
smaller spacing on mobile) — never hardcode sizes in components.

### Video URL Handling (updated — see "Video Gallery — Plan Change" below)
- If `previewUrl` is `''`: card shows the static thumbnail, no autoplay
  attempt, no broken `<video>` src.
- If `youtubeUrl` is `''`: card is not clickable (no external link), shows a
  "Coming Soon" badge, and always shows the WhatsApp CTA in that state.
- If both are filled: card autoplays the muted preview on scroll-into-view
  and is a clickable link out to `youtubeUrl` (opens YouTube in a new tab —
  no in-site modal player anymore, see below).

### Filmmaker Contact Links
Each filmmaker has `contacts.instagram` and `contacts.whatsapp`
If value is `'#'` — hide the button entirely, do not show a dead link

## Content — AV Films Studio

### Team
- **Cinematographer & Photographer**: Name TBC
  World: Photo (emerald accent)
- **Vedant**: Editor & Production Assistant  
  World: Video (gold accent)

### Studio Contact
- WhatsApp: `https://wa.me/917517218149`
- WhatsApp 2: `https://wa.me/917517218150`
- Instagram: `'#'` // TODO: Confirm handle
- Location: Pimpri, Pune, Maharashtra

### Philosophy Lines (placeholder — confirm with client)
- Cinematographer: "Every frame is a decision. Every decision tells a story."
- Vedant: "The edit is where the story truly begins."

## Photo Gallery — Plan Change (supersedes old cylinder layout)

The original `PhotoGallery` implementation (`src/components/three/PhotoCarousel.tsx` +
`PhotoCarouselCanvas.tsx`) arranges cards on a **2-row, 18-slot cylinder** using
`angle = sin/cos` positioning. This is being replaced with a **flat horizontal
coverflow**: one row, center slide + two visible neighbors, sliding left/right.
Screenshot of the old cylinder result is on file — do not rebuild that shape.

### What changes
- **Layout math:** replace angle-based `sin(angle) * radius` positioning with
  linear `x = dist * spacing`, where `dist` is the *shortest wrapped distance*
  from the current scroll offset to a given photo index (handles the infinite
  loop without duplicating cards — see optimization below).
  ```
  wrappedDistance(i, offset):
    raw = i - offset
    half = PHOTO_COUNT / 2
    return ((raw + half) % PHOTO_COUNT + PHOTO_COUNT) % PHOTO_COUNT - half
  ```
- **Visible cards:** center slide (dist ≈ 0) full scale/opacity; immediate
  neighbors (dist ≈ ±1) scaled down (~0.6–0.8x) and slightly faded; anything
  beyond `CULL_DISTANCE` (~2.4 slide-widths) gets `visible = false` and skips
  its per-frame math entirely — don't compute transforms for off-screen cards.
- **Depth/scale falloff:** `frontness = clamp(1 - |dist| / CULL_DISTANCE, 0, 1)`
  drives scale, opacity, and brightness the same way `frontness` did in the
  old cylinder code — reuse that falloff pattern, just driven by linear
  distance instead of the cosine angle term.
- **Spacing constants:** `DESKTOP_SPACING ≈ 3.4`, `MOBILE_SPACING ≈ 2.15`
  (existing mobile matchMedia pattern in the file already does this switch —
  keep it, just repoint at spacing instead of radius/rowGap).
- **Camera:** move closer / narrower FOV since there's no more depth ring to
  read — `position: [0, 0.05, 6.2], fov: 50` (down from `[0,0.05,7.8], fov 58`)
  in `PhotoCarouselCanvas.tsx`.
- **Interaction:** keep drag-to-scrub, click-to-select, auto-advance, and
  manual-select pause exactly as-is — only the position/scale math changes,
  not the input handling.

### Optimization (do this as part of the same rebuild)
- Old layout duplicated `ROW_COUNT * CARDS_PER_ROW` = 36 card-groups across
  2 rows even though there are only 28 photos. The wrapped-distance approach
  makes duplication unnecessary — render exactly one card-group per photo
  (28 total, not 36). Fewer meshes/materials updated per frame.
- Since off-screen cards are culled (`visible = false` + early return before
  computing position/rotation/scale/material updates), the per-frame loop
  only does real work for ~5 cards (center + 2 neighbors each side) instead
  of all 28–36 every frame.

## Video Gallery — Plan Change (VideoWorldIntro is cancelled)

Two changes here, build them together:

### 1. Remove VideoWorldIntro entirely
- Delete it from the page flow (`src/app/page.tsx`) — Filmmakers scrolls
  straight into VideoGallery, no gold-world opener, no 3D film reel section.
- No `#video-world` section ID anymore.
- Any 3D film-reel component built for VideoWorldIntro is unused going
  forward — don't wire it into VideoGallery either, this section is not 3D.
- `avGold` (`#c9a84c`) is still the video accent color — just applied
  directly inside VideoGallery's own styling (eyebrow labels, hover states,
  borders, etc.) instead of a separate world section.

### 2. VideoGallery cards: preview-on-scroll + real YouTube link
Each card in `src/data/videos.ts` needs two URL fields instead of one:
- `previewUrl` — a short, silent, looping clip (Cloudinary-hosted per the
  existing media stack) that plays inline in the card itself
- `youtubeUrl` — the actual published video on YouTube

Behavior:
- **On scroll into view:** the card's `previewUrl` clip autoplays, muted,
  looped, `playsInline`. Use an `IntersectionObserver` per card (or one
  observer watching all cards) — play when the card crosses into the
  viewport, pause (don't just hide) when it scrolls out, so only visible
  cards are decoding video at once. This mirrors the existing mobile-detect
  pattern already used elsewhere in the app (`useRef` + `useEffect`, no
  `useState` for this kind of runtime/viewport state).
- **Muted is mandatory** — this is what makes autoplay allowed under the
  "no autoplay" mobile rule (see updated Images & Media rule above). Never
  unmute automatically; if a tap-to-unmute control is wanted later that's a
  separate feature, not part of this change.
- **On click/tap:** if `youtubeUrl` is set, the card is a link (`<a
  target="_blank" rel="noopener noreferrer">`) that opens the real video on
  YouTube. No in-site modal, no embedded YouTube iframe player — just an
  outbound link. This replaces the old "film burn CSS transition modal"
  decision.
- **If `youtubeUrl` is empty:** card is not a link, shows a "Coming Soon"
  badge, and shows the WhatsApp CTA (existing pattern) — same as before,
  just no modal involved.
- **If `previewUrl` is empty but `youtubeUrl` is set:** card shows the
  static thumbnail (no video element mounted) but is still a working link
  to YouTube.

### Optimization
- Cap simultaneous playing `<video>` elements — even with IntersectionObserver
  pausing off-screen clips, don't let more play at once than are actually
  visible in the viewport (typically 2–4 depending on grid columns). Don't
  preload video data for cards far below the fold; use `preload="none"` or
  `"metadata"` and only swap to the real `previewUrl` src when the card is
  about to enter view.
- Removing VideoWorldIntro also removes an entire 3D scene (film reel model,
  its own scroll-triggered GSAP timeline, its own R3F canvas) from the page
  — one less `dynamic(..., { ssr: false })` canvas mounted, which is a
  straightforward perf win on top of the video-preview work above.

### 3. Visual & Interaction Design
This section is now a plain DOM/CSS section (no 3D canvas), so it should
feel considered on its own terms rather than a stripped-down leftover of
the old 3D concept. Build it with this level of intent — same bar as the
PhotoGallery coverflow spec above.

**Section numbering** — since VideoWorldIntro is gone, the eyebrow label
numbers shift: `SectionShell label` goes from `"06 · Video Gallery"` to
`"05 · Video Gallery"`. Check every section after this one in `page.tsx`
(InstagramFeed, InquiryForm, Footer) and renumber their labels too.

**Section header (above the grid):**
- Eyebrow, mono font, `avGold`, uppercase, letter-spacing — matches the
  `avEmerald` eyebrow treatment already used in PhotoGallery, just gold.
  Use `"VIDEOGRAPHY"` as the working copy.
  {/* TODO: Confirm eyebrow wording with client — "VIDEOGRAPHY" is a
  placeholder, not final copy */}
- Display heading, Cormorant Garamond, italic, large. Use *"Motion,
  Framed."* as the working copy — this is the section's one moment of
  typographic flourish per the "typography breaks the grid occasionally"
  brand rule.
  {/* TODO: Confirm display heading with client — "Motion, Framed." is a
  placeholder, not final copy */}
- Both are real, renderable strings (not empty/lorem) so the layout can
  actually be tested — swap the text later, don't leave these blank in the
  meantime. Same convention as the Philosophy Lines placeholders above.
- Keep both left-aligned above the grid, not centered — asymmetry per the
  "avoid perfect centering everywhere" brand rule.

**Grid layout:**
- Desktop (≥1024px): 3–4 column masonry, `avGold`-tinted 1px hairline
  border between cards, generous gap (not edge-to-edge tiles)
- Tablet (768–1024px): 2 columns
- Mobile (<768px): 1 column, full width
- Every card keeps a consistent `aspect-video` (16:9) crop for both the
  static thumbnail and the preview clip, regardless of the category —
  unlike PhotoGallery's variable aspect ratios, video thumbnails should
  read as a uniform grid

**Card anatomy (bottom to top, in code — stacking order):**
1. Base layer: static thumbnail (`next/image`, from `thumbnail` field),
   always rendered so there's never a blank card while video loads
2. Preview layer: `<video>` using `previewUrl`, muted/loop/playsInline,
   `preload="metadata"`, fades in over the thumbnail (opacity transition,
   not a hard swap) once it starts playing after IntersectionObserver
   triggers
3. Gradient overlay: dark-to-transparent gradient anchored to the bottom
   ~40% of the card, so text stays legible over any preview content —
   same purpose as the gradient scrims already implicit in the emerald
   gallery's card backing plane, just CSS instead of a 3D mesh
4. Text block (sits on the gradient): category `title` (DM Sans, medium
   weight, offwhite), then a mono sub-line combining `count` + category —
   e.g. `"12 FILMS"` — then `description` truncated to ~2 lines, muted color
5. Small YouTube glyph badge, top-right corner of the card, `avGold`,
   low-opacity until hover/tap — signals "this opens on YouTube" without
   needing to say so in words

**Hover / focus state (desktop):**
- Card scales to ~1.02, gradient overlay opacity increases slightly for
  better text contrast, YouTube badge opacity goes to full, `avGold`
  hairline border brightens — cursor becomes pointer
- If the preview clip was paused (scrolled-past-but-cached), hovering does
  NOT restart it from scratch — only the IntersectionObserver controls
  play/pause, hover is purely a visual affordance, not a playback trigger
- Do not add a sound toggle or expand-to-fullscreen affordance here — the
  card's job is to preview and hand off to YouTube, not to become a player

**Touch state (mobile):** no hover, so the gradient/title/badge are simply
always at the "hovered" visual weight (per the Mobile-First Rules — "no
hover-only interactions on mobile, all hover states need a touch
equivalent")

**Coming Soon state (`youtubeUrl` empty):**
- Thumbnail rendered desaturated (CSS `grayscale` filter, ~60%), gradient
  overlay slightly darker
- No preview clip attempted even if `previewUrl` happens to be filled in —
  a card without a real destination shouldn't autoplay, that's confusing
- Mono badge, `avGold`, reading `"COMING SOON"` in place of the YouTube
  glyph
- Card itself is not a link / has no href / `cursor: default`
- WhatsApp icon sits in its own small tap target in the card's corner,
  always clickable independent of the card's disabled state (`e.stopPropagation()`
  on its own click handler) — same "hide if '#', but here always show since
  WhatsApp link is real" pattern as Filmmaker Contact Links

**Scroll-in reveal:** since this section is no longer 3D, use a standard
GSAP ScrollTrigger fade/stagger reveal for the grid (cards fade + translate
up slightly, staggered ~40–60ms per card) — same technique on desktop and
mobile since there's no pin/canvas-performance concern here, just don't pin
the section itself (per the existing "never pin on mobile" rule, which
doesn't apply here anyway since this section was never pinned to begin
with).

**Accessibility:**
- `<video>` elements: `muted`, no visible controls, `aria-hidden="true"`
  (the video is decorative preview, not the primary content)
- The outbound link itself needs a real accessible name, e.g.
  `aria-label={`Watch ${title} on YouTube`}` — don't rely on the YouTube
  glyph alone to convey that

## Completed Sections
Do not rebuild these. Do not modify unless fixing a bug.

- ✅ Skeleton — 8 section shells (was 9 before VideoWorldIntro was cut), all IDs correct — renumber eyebrow labels per "Video Gallery — Plan Change" above
- ✅ SmoothScroll — Lenis + GSAP ticker wired
- ✅ Hero Part 1 — Wordmark, tagline, layout shell
- ✅ Hero Part 2 — Lenis scroll progress bar (gold)
- ✅ Hero Part 3 — R3F canvas + ParticleField
- ✅ Hero Part 4 — HeroOrbs, parallax, click-to-scroll
- ✅ Hero Fixes — Hydration, mobile orbs, desktop mode toggle
- ✅ Hero Material — MeshPhysicalMaterial, Environment preset
- ✅ Data Layer — src/data/ (photos, videos, filmmakers, instagram)
- ✅ PhotoWorldIntro Part 1 — Story beats, GSAP scroll reveal
- ✅ PhotoWorldIntro Part 2 — Camera model (to be replaced
  with aperture iris)
- ⏳ PhotoWorldIntro Part 2b — Aperture iris (next)
- ⏳ PhotoWorldIntro Part 3 — Scroll-driven movement
- ✅ PhotoGallery — Dynamic WebP/PNG scanning from public/gallery/, flat horizontal coverflow, Next.js image optimization, landscape-only filter
- ⏳ Filmmakers
- ❌ VideoWorldIntro (retro projector) — CANCELLED, section removed from
  page entirely, do not build
- ⏳ VideoGallery
- ⏳ InstagramFeed
- ⏳ InquiryForm
- ⏳ Footer

## Design Decisions Locked
These are final — do not revisit without user confirmation.

- Theme: Emerald (#50c878) for photo, Gold (#c9a84c) for video
- Background: Warm charcoal #0d0c0b across ALL sections
- Photo World 3D: Aperture iris (NOT a camera model)
- VideoWorldIntro: REMOVED — no gold world opener, no film reel 3D, no
  standalone video-world section. Video section is VideoGallery only.
- Photo gallery: 3-slide horizontal coverflow (center + two neighbors), NOT the old two-row cylinder — see "Photo Gallery — Plan Change" below
- Photo gallery lightbox: Swipe navigation on mobile
- Filmmakers transition: Dark fade → portraits emerge from black
- Filmmaker contacts: Hide button if value is '#'
- Video gallery: cards autoplay a muted preview clip when scrolled into
  view; clicking/tapping a card opens the real video on YouTube in a new
  tab; no in-site modal player — see "Video Gallery — Plan Change" below
- Inquiry form: WhatsApp primary + Resend email backup
- Instagram: Static grid placeholder until handle confirmed