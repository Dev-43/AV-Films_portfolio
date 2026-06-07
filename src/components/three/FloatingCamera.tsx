'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FloatingCameraProps {
  targetAngle: number
}

export function FloatingCamera({ targetAngle }: FloatingCameraProps) {
  const cameraRef = useRef<THREE.Group>(null)
  const elapsed = useRef(0)
  const currentTilt = useRef(0)

  useFrame((_, delta) => {
    elapsed.current += delta
    if (!cameraRef.current) return

    cameraRef.current.position.y =
      Math.sin(elapsed.current * 0.7) * 0.08

    currentTilt.current = THREE.MathUtils.lerp(
      currentTilt.current,
      targetAngle * 0.15,
      0.05
    )
    cameraRef.current.rotation.y = currentTilt.current

    cameraRef.current.rotation.x =
      Math.sin(elapsed.current * 0.4) * 0.02
  })

  return (
    <>
      <pointLight
        position={[0, 2, 3]}
        intensity={2}
        color="#fff8f0"
        distance={6}
      />
      <pointLight
        position={[-2, 0, 2]}
        intensity={1.5}
        color="#50c878"
        distance={5}
      />
      <pointLight
        position={[2, -1, 2]}
        intensity={1}
        color="#c9a84c"
        distance={5}
      />

      <group ref={cameraRef} scale={0.4}>
        <mesh>
          <boxGeometry args={[2.2, 1.4, 1.0]} />
          <meshPhysicalMaterial
            color="#0d0d0d"
            roughness={0.3}
            metalness={0.85}
            clearcoat={0.5}
          />
        </mesh>

        <mesh position={[0.4, 0.92, 0]}>
          <boxGeometry args={[0.8, 0.45, 0.88]} />
          <meshPhysicalMaterial
            color="#0d0d0d"
            roughness={0.3}
            metalness={0.85}
          />
        </mesh>

        <mesh position={[0, 0, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.52, 0.48, 1.0, 24]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        <mesh position={[0, 0, 0.72]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.035, 8, 24]} />
          <meshPhysicalMaterial
            color="#c9a84c"
            roughness={0.1}
            metalness={0.95}
            clearcoat={1}
            emissive="#c9a84c"
            emissiveIntensity={0.3}
          />
        </mesh>

        <mesh position={[0, 0, 1.38]}>
          <circleGeometry args={[0.36, 24]} />
          <meshPhysicalMaterial
            color="#050a08"
            roughness={0}
            transmission={0.6}
            thickness={0.5}
            clearcoat={1}
            ior={1.5}
            transparent
            opacity={0.85}
          />
        </mesh>

        <mesh position={[0, 0, 1.39]}>
          <torusGeometry args={[0.22, 0.025, 8, 24]} />
          <meshPhysicalMaterial
            color="#50c878"
            roughness={0.2}
            metalness={0.7}
            emissive="#50c878"
            emissiveIntensity={0.5}
          />
        </mesh>

        <mesh
          position={[0.72, 1.12, 0.28]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.07, 0.07, 0.06, 10]} />
          <meshPhysicalMaterial
            color="#c9a84c"
            roughness={0.1}
            metalness={0.95}
          />
        </mesh>
      </group>
    </>
  )
}
