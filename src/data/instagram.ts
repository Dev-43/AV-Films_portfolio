export interface InstagramConfig {
  handle: string
  profileUrl: string
  displayName: string
  bio: string
}

export const instagramConfig: InstagramConfig = {
  handle: '@a.v.films_',
  profileUrl: 'https://www.instagram.com/a.v.films_?igsh=ZXg3Y2N3cTZzaGxm',
  displayName: 'AV Films',
  bio: 'Photography & Videography · Pimpri, Pune',
}

// Post grid — 9 slots for the feed section
// Each links to the profile page or shows real photography clips
export interface InstagramPost {
  id: string
  thumbnail: string
  url: string
  alt: string
}

export const instagramPosts: InstagramPost[] = [
  { id: 'ig01', thumbnail: '/gallery/1 (1).webp', url: 'https://www.instagram.com/a.v.films_?igsh=ZXg3Y2N3cTZzaGxm', alt: 'AV Films on Instagram - Photography' },
  { id: 'ig02', thumbnail: '/gallery/1 (2).webp', url: 'https://www.instagram.com/a.v.films_?igsh=ZXg3Y2N3cTZzaGxm', alt: 'AV Films on Instagram - Behind the scenes' },
  { id: 'ig03', thumbnail: '/gallery/1 (3).webp', url: 'https://www.instagram.com/a.v.films_?igsh=ZXg3Y2N3cTZzaGxm', alt: 'AV Films on Instagram - Portrait work' },
  { id: 'ig04', thumbnail: '/gallery/1 (4).webp', url: 'https://www.instagram.com/a.v.films_?igsh=ZXg3Y2N3cTZzaGxm', alt: 'AV Films on Instagram - Cinematic frame' },
  { id: 'ig05', thumbnail: '/gallery/1 (5).webp', url: 'https://www.instagram.com/a.v.films_?igsh=ZXg3Y2N3cTZzaGxm', alt: 'AV Films on Instagram - Studio photography' },
  { id: 'ig06', thumbnail: '/gallery/1 (6).webp', url: 'https://www.instagram.com/a.v.films_?igsh=ZXg3Y2N3cTZzaGxm', alt: 'AV Films on Instagram - Film capture' },
  { id: 'ig07', thumbnail: '/gallery/1 (7).webp', url: 'https://www.instagram.com/a.v.films_?igsh=ZXg3Y2N3cTZzaGxm', alt: 'AV Films on Instagram - Detail shot' },
  { id: 'ig08', thumbnail: '/gallery/1 (8).webp', url: 'https://www.instagram.com/a.v.films_?igsh=ZXg3Y2N3cTZzaGxm', alt: 'AV Films on Instagram - Event capture' },
  { id: 'ig09', thumbnail: '/gallery/1 (9).webp', url: 'https://www.instagram.com/a.v.films_?igsh=ZXg3Y2N3cTZzaGxm', alt: 'AV Films on Instagram - Product showcase' },
]