'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const elapsed = useRef(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 768px)').matches)
  }, [])

  const geometry = useMemo(() => {
    const count = isMobile ? 200 : 600
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = Math.random() * 6 - 4
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [isMobile])

  useFrame((_, delta) => {
    elapsed.current += delta
    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed.current * 0.01
      pointsRef.current.rotation.x =
        Math.sin(elapsed.current * 0.005) * 0.05
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#f5f0e8"
        size={0.015}
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  )
}
