export interface VideoItem {
  id: string
  title: string
  src: string
  driveUrl: string
  description: string
  thumbnail: string
}

export interface VideoCategory {
  id: string
  title: string
  folderName: string
  description: string
  count: number
  videos: VideoItem[]
  thumbnail: string
  previewUrl: string // URL of first video for autoplay preview
}

export interface CategoryDefinition {
  id: string
  title: string
  folderName: string
  description: string
}

export const categoryDefinitions: CategoryDefinition[] = [
  {
    id: 'v01',
    title: 'Cinematic',
    folderName: 'cinematic',
    description: 'Premium cinematic films and creative storytelling.',
  },
  {
    id: 'v02',
    title: 'Clipbased',
    folderName: 'clipbased',
    description: 'Fast-paced, dynamic, and engaging clip reels.',
  },
  {
    id: 'v03',
    title: 'DelivaryShots',
    folderName: 'delivary_shots',
    description: 'Cinematic restaurant and delivery service coverage.',
  },
  {
    id: 'v04',
    title: 'Exterior',
    folderName: 'exterior',
    description: 'Outdoor cinematography, scenic landscapes, and drone shots.',
  },
  {
    id: 'v05',
    title: 'Hotel',
    folderName: 'hotel',
    description: 'Luxury hotel, resort, and interior architecture tours.',
  },
  {
    id: 'v06',
    title: 'Locational video',
    folderName: 'locational_video',
    description: 'Destination showcases and local atmosphere captures.',
  },
  {
    id: 'v07',
    title: 'Machinary',
    folderName: 'machinary',
    description: 'Industrial documentation and machinery in motion.',
  },
  {
    id: 'v08',
    title: 'Makeup',
    folderName: 'makeup',
    description: 'High-detail makeup art and cosmetic showcase videos.',
  },
  {
    id: 'v09',
    title: 'Object Focused',
    folderName: 'object_focused',
    description: 'Macro details, object showcases, and product focuses.',
  },
  {
    id: 'v10',
    title: 'Real estate',
    folderName: 'real_estate',
    description: 'Architectural walkthroughs and home tour films.',
  },
  {
    id: 'v11',
    title: 'Voice over',
    folderName: 'voice_over',
    description: 'Narrated commercial spots and voice-driven content.',
  },
  {
    id: 'v12',
    title: 'Our Premium Work',
    folderName: 'premium_work',
    description: 'The absolute pinnacle of our production quality.',
  },
]