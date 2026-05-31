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
> 3. `<PhotoGallery />` — horizontal scroll pinned gallery
> 4. `<Filmmakers />` — bridge section, owner portraits
> 5. `<VideoWorldIntro />` — gold world opener with 3D film reel
> 6. `<VideoGallery />` — category grid + modal player
> 7. `<InstagramFeed />` — live social feed
> 8. `<InquiryForm />` — multi-step smart form
> 9. `<Footer />` — minimal strip with filmstrip detail
>
> ## Section IDs (used for scroll targeting)
> - Hero: `#hero`
> - Photo world: `#photo-world`
> - Photo gallery: `#photo-gallery`
> - Filmmakers: `#filmmakers`
> - Video world: `#video-world`
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
| PhotoGallery | Pinned horizontal scroll | Native horizontal swipe with overflow-x: auto, snap-x mandatory |
| Filmmakers | Side by side portrait cards | Stacked vertically, full width |
| VideoWorldIntro | 3D film reel scroll rig | Simplified, static 3D with idle rotation only |
| VideoGallery | 3-4 column masonry grid | Single column, full width cards |
| InstagramFeed | 3 column grid | 2 column grid |
| InquirySection | Full multi-step form | Same form, full width, larger tap targets |
| Footer | Horizontal layout | Stacked vertical |

### Images & Media
- Always use next/image with proper width and height props
- Never autoplay video on mobile — require user interaction
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

 ### Videos
 - Placeholder src: `""`  (empty string)
 - Placeholder thumbnail: `"/images/placeholder.svg"`
 - Add a comment above: {/* TODO: Add video URL */}
 - Example:
   ```tsx
   {/* TODO: Add video URL */}
   <video src="" poster="/images/placeholder.svg" />
   ```

 ### YouTube / Google Drive Embeds
 - Placeholder: `""` (empty string for the URL)
 - Add comment: {/* TODO: Add embed URL */}
 - Never use a real YouTube URL as placeholder

 ### Instagram Handle
 - Placeholder: `"@avfilms"` (to be confirmed)

 ### Owner Photos (Filmmakers section)
 - Placeholder src: `"/images/filmmaker-1.jpg"` and `"/images/filmmaker-2.jpg"`
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

---
