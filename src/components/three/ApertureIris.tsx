'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BLADE_COUNT = 6

const createBladeShape = () => {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(0.3, 0.1, 0.5, 0.8, 0.2, 1.2)
  shape.bezierCurveTo(0.0, 1.4, -0.2, 1.4, -0.2, 1.2)
  shape.bezierCurveTo(-0.5, 0.8, -0.3, 0.1, 0, 0)
  return shape
}

interface ApertureIrisProps {
  openAmount: number
  isMobile?: boolean
}

function ApertureIris({ openAmount }: ApertureIrisProps) {
  const bladeGroupRef = useRef<THREE.Group>(null)
  const bladeRefs = useRef<THREE.Mesh[]>([])
  const glowMaterialRef = useRef<THREE.MeshStandardMaterial>(null)
  const elapsed = useRef(0)
  const currentOpen = useRef(0)

  const bladeShape = useMemo(() => createBladeShape(), [])
  const bladeGeometry = useMemo(
    () => new THREE.ShapeGeometry(bladeShape),
    [bladeShape]
  )

  useEffect(() => {
    return () => {
      bladeGeometry.dispose()
    }
  }, [bladeGeometry])

  useFrame((_, delta) => {
    elapsed.current += delta

    currentOpen.current = THREE.MathUtils.lerp(
      currentOpen.current,
      openAmount,
      0.08
    )

    bladeRefs.current.forEach((blade, i) => {
      if (!blade) return
      const baseAngle = (i / BLADE_COUNT) * Math.PI * 2

      blade.rotation.z = baseAngle + currentOpen.current * 0.6

      const outward = currentOpen.current * 0.8
      blade.position.x = Math.cos(baseAngle) * outward
      blade.position.y = Math.sin(baseAngle) * outward
    })

    if (bladeGroupRef.current) {
      bladeGroupRef.current.rotation.z =
        elapsed.current * 0.05 + currentOpen.current * 0.3
    }

    if (glowMaterialRef.current) {
      glowMaterialRef.current.emissiveIntensity = currentOpen.current * 2
      glowMaterialRef.current.opacity = currentOpen.current * 0.6
    }
  })

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight
        position={[0, 0, 4]}
        intensity={3}
        color="#50c878"
        distance={10}
      />
      <pointLight
        position={[-3, 2, 2]}
        intensity={2}
        color="#fff8f0"
        distance={8}
      />
      <pointLight
        position={[3, -2, 2]}
        intensity={1.5}
        color="#c9a84c"
        distance={8}
      />

      <group ref={bladeGroupRef}>
        {Array.from({ length: BLADE_COUNT }).map((_, i) => {
          const baseAngle = (i / BLADE_COUNT) * Math.PI * 2
          return (
            <mesh
              key={i}
              ref={(el) => {
                if (el) bladeRefs.current[i] = el
              }}
              rotation={[0, 0, baseAngle]}
              position={[0, 0, i * 0.001]}
              geometry={bladeGeometry}
            >
              <meshPhysicalMaterial
                color="#0d0d0d"
                roughness={0.15}
                metalness={0.9}
                clearcoat={1}
                clearcoatRoughness={0.05}
                side={THREE.DoubleSide}
              />
            </mesh>
          )
        })}
      </group>

      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial
          ref={glowMaterialRef}
          color="#50c878"
          emissive="#50c878"
          emissiveIntensity={0}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh>
        <torusGeometry args={[1.5, 0.02, 8, 64]} />
        <meshPhysicalMaterial
          color="#50c878"
          emissive="#50c878"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      <mesh>
        <torusGeometry args={[1.65, 0.008, 8, 64]} />
        <meshPhysicalMaterial
          color="#c9a84c"
          emissive="#c9a84c"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.95}
        />
      </mesh>
    </>
  )
}

export { ApertureIris }
export type { ApertureIrisProps }
