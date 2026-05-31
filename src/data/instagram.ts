export interface InstagramConfig {
  handle: string
  profileUrl: string
  displayName: string
  bio: string
}

export const instagramConfig: InstagramConfig = {
  handle: '@avfilms', // TODO: Confirm actual handle
  profileUrl: '#',    // TODO: Confirm actual URL
  displayName: 'AV Films',
  bio: 'Photography & Videography · Pimpri, Pune',
}

// Placeholder post grid — 9 slots for the feed section
// Replace with real embed or API when handle is confirmed
export interface InstagramPost {
  id: string
  thumbnail: string
  url: string
  alt: string
}

export const instagramPosts: InstagramPost[] = [
  { id: 'ig01', thumbnail: '/images/placeholder.svg',
    url: '#', alt: 'AV Films on Instagram' },
  { id: 'ig02', thumbnail: '/images/placeholder.svg',
    url: '#', alt: 'AV Films on Instagram' },
  { id: 'ig03', thumbnail: '/images/placeholder.svg',
    url: '#', alt: 'AV Films on Instagram' },
  { id: 'ig04', thumbnail: '/images/placeholder.svg',
    url: '#', alt: 'AV Films on Instagram' },
  { id: 'ig05', thumbnail: '/images/placeholder.svg',
    url: '#', alt: 'AV Films on Instagram' },
  { id: 'ig06', thumbnail: '/images/placeholder.svg',
    url: '#', alt: 'AV Films on Instagram' },
  { id: 'ig07', thumbnail: '/images/placeholder.svg',
    url: '#', alt: 'AV Films on Instagram' },
  { id: 'ig08', thumbnail: '/images/placeholder.svg',
    url: '#', alt: 'AV Films on Instagram' },
  { id: 'ig09', thumbnail: '/images/placeholder.svg',
    url: '#', alt: 'AV Films on Instagram' },
]