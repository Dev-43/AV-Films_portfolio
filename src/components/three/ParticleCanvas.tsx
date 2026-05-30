'use client'

import { Canvas } from '@react-three/fiber'
import { HeroOrbs } from './HeroOrbs'
import { ParticleField } from './ParticleField'

export default function ParticleCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ alpha: true, antialias: false }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}
    >
      <ParticleField />
      <HeroOrbs />
    </Canvas>
  )
}
