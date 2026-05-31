export type AspectRatio = 'square' | 'portrait' | 'landscape'

export interface Photo {
  id: string
  src: string
  alt: string
  year: string
  aspect: AspectRatio
}

export const photos: Photo[] = [
  { id: 'p01', src: '/images/placeholder.svg',
    alt: 'AV Films — Product Photography',
    year: '2024', aspect: 'landscape' },
  { id: 'p02', src: '/images/placeholder.svg',
    alt: 'AV Films — Product Photography',
    year: '2024', aspect: 'square' },
  { id: 'p03', src: '/images/placeholder.svg',
    alt: 'AV Films — Product Photography',
    year: '2024', aspect: 'portrait' },
  { id: 'p04', src: '/images/placeholder.svg',
    alt: 'AV Films — Product Photography',
    year: '2024', aspect: 'square' },
  { id: 'p05', src: '/images/placeholder.svg',
    alt: 'AV Films — Product Photography',
    year: '2024', aspect: 'landscape' },
  { id: 'p06', src: '/images/placeholder.svg',
    alt: 'AV Films — Product Photography',
    year: '2024', aspect: 'portrait' },
  { id: 'p07', src: '/images/placeholder.svg',
    alt: 'AV Films — Product Photography',
    year: '2024', aspect: 'square' },
  { id: 'p08', src: '/images/placeholder.svg',
    alt: 'AV Films — Product Photography',
    year: '2024', aspect: 'square' },
  { id: 'p09', src: '/images/placeholder.svg',
    alt: 'AV Films — Product Photography',
    year: '2024', aspect: 'portrait' },
  { id: 'p10', src: '/images/placeholder.svg',
    alt: 'AV Films — Product Photography',
    year: '2024', aspect: 'landscape' },
  { id: 'p11', src: '/images/placeholder.svg',
    alt: 'AV Films — Product Photography',
    year: '2024', aspect: 'square' },
  { id: 'p12', src: '/images/placeholder.svg',
    alt: 'AV Films — Product Photography',
    year: '2024', aspect: 'portrait' },
]