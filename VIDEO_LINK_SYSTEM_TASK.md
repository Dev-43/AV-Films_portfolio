# Task: Link-based video entries (YouTube / Vimeo / Google Drive / direct file) — play in-page, no redirect

## Context
Repo: AV-Films_portfolio (Next.js 14, App Router). Read `CLAUDE.md` first for full project
conventions before touching anything.

Current behavior: `src/app/api/videos/route.ts` scans `public/videos/<category>/` for physical
video files and builds `VideoItem[]` per category. `metadata.json` in each category folder can
only *overlay* title/description/driveUrl onto a file that's already there. There is no way to
add a video by pasting a link — a physical file must be uploaded first.

Playback already happens in-page via `src/components/ui/VideoModal.tsx` (a modal with a native
`<video controls>` tag) — there is currently **no external redirect**, that part is fine.

## Goal
Let the site owner add a new video to any category by adding **one JSON entry** with a link —
no file upload, no code changes, no redeploy of components. Supported link types, all playing
**inside the modal on the same page**:

1. **YouTube** — embed via `<iframe src="https://www.youtube.com/embed/{VIDEO_ID}">`
2. **Vimeo** — embed via `<iframe src="https://player.vimeo.com/video/{VIDEO_ID}">`
3. **Google Drive** — embed via `<iframe src="https://drive.google.com/file/d/{FILE_ID}/preview">`
   (Drive does NOT support a direct `<video src>` — it must go through its own preview iframe.
   The file's sharing setting must be "Anyone with the link can view", or the iframe will show
   an access-denied screen instead of the player.)
4. **Direct file link** (e.g. a Cloudinary `.mp4` URL) — plays via native `<video src>`, no iframe

None of these should navigate the user away from the page or open a new tab — all render inside
the existing `VideoModal` left panel.

## Files to change

### 1. `src/data/videos.ts`
Add a `sourceType` and `embedUrl` field to `VideoItem`:

```ts
export type VideoSourceType = 'local' | 'youtube' | 'vimeo' | 'drive' | 'direct'

export interface VideoItem {
  id: string
  title: string
  src: string
  driveUrl: string
  description: string
  thumbnail: string
  sourceType: VideoSourceType
  embedUrl?: string // set for 'youtube' | 'vimeo' | 'drive'
}
```

### 2. `src/app/api/videos/route.ts`
- Extend the `metadata.json` schema. Each category's `metadata.json` becomes a dictionary keyed
  by any string id, where an entry can now optionally include `url` (the pasted link):

```json
{
  "pune-hills-drone": {
    "title": "Pune Hills Aerial",
    "description": "Drone footage over the hills near Pune.",
    "url": "https://www.youtube.com/watch?v=XXXXXXXXXXX"
  },
  "goa-beach-drive": {
    "title": "Goa Beach Sunset",
    "description": "Golden hour beach coverage.",
    "url": "https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view?usp=sharing"
  }
}
```

- Add a `resolveLinkVideo(url: string)` helper that detects the link type and returns the right
  `sourceType` + `embedUrl`:

```ts
function resolveLinkVideo(url: string): { sourceType: 'youtube' | 'vimeo' | 'drive' | 'direct'; src: string; embedUrl?: string } {
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/)
  if (ytMatch) {
    return { sourceType: 'youtube', src: url, embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0` }
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) {
    return { sourceType: 'vimeo', src: url, embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` }
  }

  // Google Drive share link — extract the file ID out of either
  // /file/d/{ID}/view or ?id={ID} style URLs
  const driveMatch = url.match(/drive\.google\.com\/(?:file\/d\/([\w-]+)|open\?id=([\w-]+)|uc\?id=([\w-]+))/)
  if (driveMatch) {
    const fileId = driveMatch[1] || driveMatch[2] || driveMatch[3]
    return { sourceType: 'drive', src: url, embedUrl: `https://drive.google.com/file/d/${fileId}/preview` }
  }

  // Direct file link (Cloudinary etc.) — native <video> playback
  return { sourceType: 'direct', src: url }
}
```

- In the category-scanning loop, after building `videoItems` from physical files, also build
  items from any `metadata.json` entries that have a `url` field AND whose key does not match an
  existing local file (so local-file overlays keep working exactly as before). Append these
  "link items" to `videoItems`. Give them ids like `${cat.id}_link_${idx + 1}`.

- `previewUrl` (used for the autoplay hover preview on the category card) should only ever be
  set from a `sourceType === 'local' || 'direct'` item — iframes (YouTube/Vimeo/Drive) can't be
  used as a silent looping background preview. If a category's only videos are iframe-based, the
  card just shows the static thumbnail with no autoplay preview; the video still fully plays
  once the user opens the modal.

### 3. `src/components/ui/VideoModal.tsx`
- The auto-play `useEffect` that calls `videoRef.current.load()/.play()` should only run when
  `activeVideo.sourceType === 'local' || 'direct'` (iframes handle their own autoplay via the
  embed URL).
- In the left player panel, branch on `activeVideo.sourceType`:

```tsx
{activeVideo && (activeVideo.sourceType === 'youtube' || activeVideo.sourceType === 'vimeo') ? (
  <iframe
    key={activeVideo.id}
    src={`${activeVideo.embedUrl}${activeVideo.sourceType === 'youtube' ? '&' : '?'}autoplay=1`}
    className="w-full h-full"
    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
    allowFullScreen
    title={`Playing ${activeVideo.title}`}
  />
) : activeVideo && activeVideo.sourceType === 'drive' ? (
  <iframe
    key={activeVideo.id}
    src={activeVideo.embedUrl}
    className="w-full h-full"
    allow="autoplay; fullscreen"
    allowFullScreen
    title={`Playing ${activeVideo.title}`}
  />
) : activeVideo ? (
  <video
    ref={videoRef}
    src={activeVideo.src}
    className="w-full h-full object-contain"
    controls
    autoPlay
    playsInline
    aria-label={`Playing ${activeVideo.title}`}
  />
) : (
  /* existing empty-state block stays as-is */
)}
```

- Everything else in the modal (clip playlist, drive-download button, WhatsApp CTA, etc.) is
  unchanged.

## How the site owner adds a video afterward (no code, no redeploy of components)
1. Open `public/videos/<category>/metadata.json` in that category's folder (create the file if
   it doesn't exist yet — start with `{}`).
2. Add one entry with a unique key, a `title`, a `description`, and a `url` (YouTube, Vimeo,
   Google Drive share link, or a direct `.mp4` URL).
3. If it's a Google Drive link, make sure sharing is set to "Anyone with the link can view" —
   otherwise the embedded player will show a Drive access-denied screen instead of the video.
4. Commit and push. Vercel auto-deploys. The video appears in that category's grid and plays
   in-page in the modal — no other file needs to change.

## Testing checklist for the agent
- [ ] `npx tsc --noEmit` passes
- [ ] A category with zero physical files but one YouTube `metadata.json` entry: card shows
      static thumbnail (no crash), clicking it opens the modal and the YouTube video plays
      inline via iframe.
- [ ] Same for a Vimeo entry and a Google Drive entry.
- [ ] A category with an existing local `.mp4` file continues to work exactly as before
      (no regression to local-file overlay behavior).
- [ ] Mixing a local file and a link entry in the same category folder shows both in the clip
      playlist inside the modal.
- [ ] No `window.open`, `target="_blank"`, or `location.href` navigation is introduced anywhere
      in this task — playback must stay on the same page.
