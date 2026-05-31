export interface VideoCategory {
  id: string
  title: string
  thumbnail: string
  videoUrl: string  // empty string = coming soon state
  description: string
  count: number
}

export const videoCategories: VideoCategory[] = [
  {
    id: 'v01', title: 'Cinematic Film',
    thumbnail: '/images/placeholder.svg',
    videoUrl: '', // TODO: Add video URL
    description: 'Cinematic storytelling for brands and artists',
    count: 0,
  },
  {
    id: 'v02', title: 'Brand Commercial',
    thumbnail: '/images/placeholder.svg',
    videoUrl: '', // TODO: Add video URL
    description: 'High-impact brand identity films',
    count: 0,
  },
  {
    id: 'v03', title: 'Product Showcase',
    thumbnail: '/images/placeholder.svg',
    videoUrl: '', // TODO: Add video URL
    description: 'Your product in cinematic motion',
    count: 0,
  },
  {
    id: 'v04', title: 'ASMR',
    thumbnail: '/images/placeholder.svg',
    videoUrl: '', // TODO: Add video URL
    description: 'Sensory experience films',
    count: 0,
  },
  {
    id: 'v05', title: 'Hotel & Hospitality',
    thumbnail: '/images/placeholder.svg',
    videoUrl: '', // TODO: Add video URL
    description: 'Luxury space and hospitality films',
    count: 0,
  },
  {
    id: 'v06', title: 'Delivery Shoot',
    thumbnail: '/images/placeholder.svg',
    videoUrl: '', // TODO: Add video URL
    description: 'Food delivery and restaurant content',
    count: 0,
  },
  {
    id: 'v07', title: 'Locational Video',
    thumbnail: '/images/placeholder.svg',
    videoUrl: '', // TODO: Add video URL
    description: 'Place and destination storytelling',
    count: 0,
  },
  {
    id: 'v08', title: 'Voice Over Production',
    thumbnail: '/images/placeholder.svg',
    videoUrl: '', // TODO: Add video URL
    description: 'Narrated and voice-driven productions',
    count: 0,
  },
  {
    id: 'v09', title: 'Machinery & Industrial',
    thumbnail: '/images/placeholder.svg',
    videoUrl: '', // TODO: Add video URL
    description: 'Industrial and mechanical documentation',
    count: 0,
  },
]