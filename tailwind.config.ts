import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#0d0c0b',
        avEmerald: '#50c878',
        avGold: '#c9a84c',
        offwhite: '#f5f0e8',
        muted: '#a89f96',
        photoWorld: '#0f1a13',
        filmmakersBg: '#0a110d',
        videoWorld: '#110e08',
      },
    },
  },
}

export default config
