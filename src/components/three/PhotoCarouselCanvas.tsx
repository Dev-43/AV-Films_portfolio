'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PhotoCarousel } from './PhotoCarousel'

interface PhotoCarouselCanvasProps {
  selectedIndex: number
  onSelect: (index: number) => void
}

export default function PhotoCarouselCanvas({
  selectedIndex,
  onSelect,
}: PhotoCarouselCanvasProps) {
  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches

  return (
    <Canvas
      camera={{ position: [0, 0.05, 7.8], fov: 58 }}
      gl={{ alpha: true, antialias: !isMobile }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0)
        scene.background = null
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 4, 8]} intensity={1.2} color="#fff8f0" />
      <directionalLight
        position={[-4, 2, 4]}
        intensity={0.5}
        color="#50c878"
      />
      <Suspense fallback={null}>
        <PhotoCarousel
          selectedIndex={selectedIndex}
          onSelect={onSelect}
        />
      </Suspense>
    </Canvas>
  )
}
