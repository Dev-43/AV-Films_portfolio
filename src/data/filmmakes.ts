export type FilmmakerWorld = 'photo' | 'video'

export interface FilmmakerContacts {
  instagram: string  // '#' = hidden
  whatsapp: string   // '#' = hidden
}

export interface Filmmaker {
  id: string
  name: string       // '' = name not yet confirmed
  role: string
  philosophy: string
  image: string
  world: FilmmakerWorld
  accentColor: string
  contacts: FilmmakerContacts
}

export const filmmakers: Filmmaker[] = [
  {
    id: 'filmmaker-1',
    name: '', // TODO: Add cinematographer name when confirmed
    role: 'Cinematographer & Photographer',
    philosophy: 'Every frame is a decision. Every decision tells a story.',
    image: '/images/filmmaker-1.svg',
    world: 'photo',
    accentColor: '#50c878',
    contacts: {
      instagram: '#', // TODO: Add personal Instagram
      whatsapp: 'https://wa.me/917517218149',
    },
  },
  {
    id: 'filmmaker-2',
    name: 'Vedant',
    role: 'Editor & Production Assistant',
    philosophy: 'The edit is where the story truly begins.',
    image: '/images/filmmaker-2.svg',
    world: 'video',
    accentColor: '#c9a84c',
    contacts: {
      instagram: '#', // TODO: Add Vedant Instagram
      whatsapp: '#',  // TODO: Add Vedant WhatsApp
    },
  },
]