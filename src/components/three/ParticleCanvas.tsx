'use client'

import { Canvas } from '@react-three/fiber'
import { HeroOrbs } from './HeroOrbs'
import { ParticleField } from './ParticleField'

export default function ParticleCanvas() {
  const camZ =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches
      ? 8
      : 6

  return (
    <Canvas
      camera={{ position: [0, 0, camZ], fov: 45 }}
      gl={{ alpha: true, antialias: false }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}
    >
      <ParticleField />
      <HeroOrbs />
    </Canvas>
  )
}
