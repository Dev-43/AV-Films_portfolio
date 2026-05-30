export type ShootType = 'photo' | 'video' | 'both' | 'other'

export interface InquiryFormData {
  shootType: ShootType
  subtype?: string
  date?: string
  location?: string
  duration?: string
  budget?: string
  name: string
  phone: string
  email?: string
  vision?: string
  source?: string
}

export interface VideoCategory {
  id: string
  title: string
  thumbnail: string
  videoUrl: string
  count: number
}

export interface Photo {
  id: string
  src: string
  alt: string
  category: string
  year: string
}

export interface FilmMaker {
  name: string
  role: string
  image: string
  philosophy: string
  world: 'photo' | 'video'
}
