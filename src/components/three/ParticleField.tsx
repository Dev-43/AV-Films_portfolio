'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const elapsed = useRef(0)

  // Generate positions once using a stable seed approach
  const positions = useMemo(() => {
    const count =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches
        ? 200
        : 600

    // Use a seeded sequence so positions are stable across renders
    const arr = new Float32Array(count * 3)
    // Simple LCG pseudo-random — deterministic, no Math.random
    let seed = 12345
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff
      return (seed >>> 0) / 0xffffffff
    }
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (rand() - 0.5) * 16
      arr[i * 3 + 1] = (rand() - 0.5) * 10
      arr[i * 3 + 2] = rand() * 6 - 4
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    elapsed.current += delta
    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed.current * 0.01
      pointsRef.current.rotation.x =
        Math.sin(elapsed.current * 0.005) * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
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
