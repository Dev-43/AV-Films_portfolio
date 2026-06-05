'use client'

import { Canvas } from '@react-three/fiber'
import { ApertureIris } from './ApertureIris'

interface ApertureCanvasProps {
  openAmount: number
  isMobile?: boolean
}

export default function ApertureCanvas({
  openAmount,
  isMobile = false,
}: ApertureCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ alpha: true, antialias: !isMobile }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0)
        scene.background = null
      }}
    >
      <ApertureIris openAmount={openAmount} isMobile={isMobile} />
    </Canvas>
  )
}
