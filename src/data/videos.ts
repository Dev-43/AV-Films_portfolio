export interface VideoCategory {
  id: string
  title: string
  thumbnail: string
  previewUrl: string   // empty string = no autoplay preview, show static thumbnail only
  youtubeUrl: string   // empty string = coming soon state
  description: string
  count: number
}

export const videoCategories: VideoCategory[] = [
  {
    id: 'v01',
    title: 'Cinematic Film',
    thumbnail: '/images/placeholder.svg',
    // TODO: Add preview clip URL (Cloudinary)
    previewUrl: '',
    // TODO: Add YouTube URL
    youtubeUrl: '',
    description: 'Cinematic storytelling for brands and artists',
    count: 12,
  },
  {
    id: 'v02',
    title: 'Brand Commercial',
    thumbnail: '/images/placeholder.svg',
    // TODO: Add preview clip URL (Cloudinary)
    previewUrl: '',
    // TODO: Add YouTube URL
    youtubeUrl: '',
    description: 'High-impact brand identity films',
    count: 8,
  },
  {
    id: 'v03',
    title: 'Product Showcase',
    thumbnail: '/images/placeholder.svg',
    // TODO: Add preview clip URL (Cloudinary)
    previewUrl: '',
    // TODO: Add YouTube URL
    youtubeUrl: '',
    description: 'Your product in cinematic motion',
    count: 15,
  },
  {
    id: 'v04',
    title: 'ASMR',
    thumbnail: '/images/placeholder.svg',
    // TODO: Add preview clip URL (Cloudinary)
    previewUrl: '',
    // TODO: Add YouTube URL
    youtubeUrl: '',
    description: 'Sensory experience films',
    count: 6,
  },
  {
    id: 'v05',
    title: 'Hotel & Hospitality',
    thumbnail: '/images/placeholder.svg',
    // TODO: Add preview clip URL (Cloudinary)
    previewUrl: '',
    // TODO: Add YouTube URL
    youtubeUrl: '',
    description: 'Luxury space and hospitality films',
    count: 5,
  },
  {
    id: 'v06',
    title: 'Delivery Shoot',
    thumbnail: '/images/placeholder.svg',
    // TODO: Add preview clip URL (Cloudinary)
    previewUrl: '',
    // TODO: Add YouTube URL
    youtubeUrl: '',
    description: 'Food delivery and restaurant content',
    count: 10,
  },
  {
    id: 'v07',
    title: 'Locational Video',
    thumbnail: '/images/placeholder.svg',
    // TODO: Add preview clip URL (Cloudinary)
    previewUrl: '',
    // TODO: Add YouTube URL
    youtubeUrl: '',
    description: 'Place and destination storytelling',
    count: 7,
  },
  {
    id: 'v08',
    title: 'Voice Over Production',
    thumbnail: '/images/placeholder.svg',
    // TODO: Add preview clip URL (Cloudinary)
    previewUrl: '',
    // TODO: Add YouTube URL
    youtubeUrl: '',
    description: 'Narrated and voice-driven productions',
    count: 4,
  },
  {
    id: 'v09',
    title: 'Machinery & Industrial',
    thumbnail: '/images/placeholder.svg',
    // TODO: Add preview clip URL (Cloudinary)
    previewUrl: '',
    // TODO: Add YouTube URL
    youtubeUrl: '',
    description: 'Industrial and mechanical documentation',
    count: 9,
  },
]