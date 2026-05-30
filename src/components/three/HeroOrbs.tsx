'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useLenis } from '@/lib/lenis'

export function HeroOrbs() {
  const groupRef = useRef<THREE.Group>(null)
  const leftMeshRef = useRef<THREE.Mesh>(null)
  const rightMeshRef = useRef<THREE.Mesh>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const leftHovered = useRef(false)
  const rightHovered = useRef(false)
  const isMobile = useRef(false)
  const isTouch = useRef(false)
  const lenis = useLenis()

  const geometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32), [])

  useEffect(() => {
    isMobile.current = window.matchMedia('(max-width: 768px)').matches
    isTouch.current = window.matchMedia('(hover: none)').matches

    if (isMobile.current) {
      if (leftMeshRef.current) {
        leftMeshRef.current.position.set(0, 1.2, 0)
        leftMeshRef.current.scale.setScalar(0.6)
      }
      if (rightMeshRef.current) {
        rightMeshRef.current.position.set(0, -1.2, 0)
        rightMeshRef.current.scale.setScalar(0.6)
      }
    }

    if (isTouch.current) return

    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        mouse.current.x * 0.3,
        0.05
      )
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        mouse.current.y * 0.3,
        0.05
      )
    }

    const baseScale = isMobile.current ? 0.6 : 1.0

    if (leftMeshRef.current) {
      leftMeshRef.current.rotation.y += 0.003
      const targetScale = baseScale * (leftHovered.current ? 1.08 : 1.0)
      leftMeshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(leftMeshRef.current.scale.x, targetScale, 0.1)
      )
    }

    if (rightMeshRef.current) {
      rightMeshRef.current.rotation.y -= 0.002
      const targetScale = baseScale * (rightHovered.current ? 1.08 : 1.0)
      rightMeshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(rightMeshRef.current.scale.x, targetScale, 0.1)
      )
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight color="#50c878" intensity={3} position={[-2.2, 2, 2]} />
      <pointLight color="#c9a84c" intensity={3} position={[2.2, 2, 2]} />

      <group ref={groupRef}>
        <mesh
          ref={leftMeshRef}
          geometry={geometry}
          position={[-2.2, 0, 0]}
          onClick={() => lenis?.scrollTo('#photo-world', { duration: 1.5 })}
          onPointerOver={() => {
            leftHovered.current = true
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            leftHovered.current = false
            document.body.style.cursor = 'default'
          }}
        >
          <meshStandardMaterial
            color="#50c878"
            emissive="#50c878"
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>

        <mesh
          ref={rightMeshRef}
          geometry={geometry}
          position={[2.2, 0, 0]}
          onClick={() => lenis?.scrollTo('#video-world', { duration: 1.5 })}
          onPointerOver={() => {
            rightHovered.current = true
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            rightHovered.current = false
            document.body.style.cursor = 'default'
          }}
        >
          <meshStandardMaterial
            color="#c9a84c"
            emissive="#c9a84c"
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      </group>
    </>
  )
}
