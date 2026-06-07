'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { photos } from '@/data/photos'
import type { AspectRatio } from '@/data/photos'
import { useLenis } from '@/lib/lenis'
import { FloatingCamera } from './FloatingCamera'

const PHOTO_COUNT = photos.length
const DESKTOP_RADIUS = 4.5
const MOBILE_RADIUS = 3.2

interface CarouselState {
  rotation: number
  targetRotation: number
  selectedIndex: number
}

interface PhotoCarouselProps {
  selectedIndex: number
  onSelect: (index: number) => void
}

function getPhotoDimensions(aspect: AspectRatio): [number, number] {
  if (aspect === 'portrait') return [1.4, 2.2]
  if (aspect === 'landscape') return [2.4, 1.5]
  return [1.8, 1.8]
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function normalizeIndex(index: number): number {
  if (!Number.isFinite(index) || PHOTO_COUNT === 0) return 0
  return ((Math.round(index) % PHOTO_COUNT) + PHOTO_COUNT) % PHOTO_COUNT
}

function createPlaceholderTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 600
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#2a2826'
    ctx.fillRect(0, 0, 800, 600)
    ctx.strokeStyle = '#50c878'
    ctx.lineWidth = 4
    ctx.strokeRect(40, 40, 720, 520)
    ctx.fillStyle = '#f5f0e8'
    ctx.font = 'bold 32px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('AV Films', 400, 300)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

function usePhotoTextures(): THREE.Texture[] {
  return useMemo(() => {
    const placeholder = createPlaceholderTexture()
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')

    return photos.map((photo) => {
      // SVG cannot be uploaded to WebGL textures (security error).
      // Raster URLs load asynchronously; placeholder shows until ready.
      if (photo.src.endsWith('.svg')) return placeholder

      const texture = loader.load(photo.src)
      texture.colorSpace = THREE.SRGBColorSpace
      return texture
    })
  }, [])
}

export function PhotoCarousel({ selectedIndex, onSelect }: PhotoCarouselProps) {
  const textureArray = usePhotoTextures()
  const lenis = useLenis()

  const state = useRef<CarouselState>({
    rotation: 0,
    targetRotation: 0,
    selectedIndex: 0,
  })
  const groupRef = useRef<THREE.Group>(null)
  const isDragging = useRef(false)
  const dragStart = useRef(0)
  const rotationOnDragStart = useRef(0)
  const lastReportedIndex = useRef(0)
  const radiusRef = useRef(DESKTOP_RADIUS)
  const onSelectRef = useRef(onSelect)

  const photoLayouts = useMemo(
    () =>
      photos.map((photo, i) => {
        const angle = (i / PHOTO_COUNT) * Math.PI * 2
        const [width, height] = getPhotoDimensions(photo.aspect)
        return { photo, angle, width, height }
      }),
    []
  )

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const applyRadius = (mobile: boolean) => {
      radiusRef.current = mobile ? MOBILE_RADIUS : DESKTOP_RADIUS
    }
    applyRadius(mq.matches)
    const onChange = (e: MediaQueryListEvent) => applyRadius(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    state.current.selectedIndex = selectedIndex
    state.current.targetRotation =
      -(selectedIndex / PHOTO_COUNT) * Math.PI * 2
    lastReportedIndex.current = selectedIndex
  }, [selectedIndex])

  useEffect(() => {
    if (!lenis) return

    const handleScroll = () => {
      if (isDragging.current) return

      const section = document.getElementById('photo-gallery')
      if (!section) return

      const rect = section.getBoundingClientRect()
      const scrollRange = rect.height - window.innerHeight
      const progress =
        scrollRange <= 0
          ? 0
          : clamp(-rect.top / scrollRange, 0, 1)
      state.current.targetRotation = progress * Math.PI * 2

      const nearest = normalizeIndex(Math.round(progress * PHOTO_COUNT))
      if (nearest !== lastReportedIndex.current) {
        lastReportedIndex.current = nearest
        state.current.selectedIndex = nearest
        onSelectRef.current(nearest)
      }
    }

    handleScroll()
    lenis.on('scroll', handleScroll)
    return () => {
      lenis.off('scroll', handleScroll)
    }
  }, [lenis])

  useEffect(() => {
    let canvas: HTMLCanvasElement | null = null
    let retryId: ReturnType<typeof setTimeout> | undefined

    const onMouseDown = (e: Event) => {
      const mouseEvent = e as MouseEvent
      isDragging.current = true
      dragStart.current = mouseEvent.clientX
      rotationOnDragStart.current = state.current.targetRotation
    }

    const onMouseMove = (e: Event) => {
      if (!isDragging.current) return
      const mouseEvent = e as MouseEvent
      const delta = (mouseEvent.clientX - dragStart.current) / 200
      state.current.targetRotation = rotationOnDragStart.current - delta
    }

    const onMouseUp = () => {
      isDragging.current = false
    }

    const onTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent
      isDragging.current = true
      dragStart.current = touchEvent.touches[0].clientX
      rotationOnDragStart.current = state.current.targetRotation
    }

    const onTouchMove = (e: Event) => {
      if (!isDragging.current) return
      const touchEvent = e as TouchEvent
      const delta =
        (touchEvent.touches[0].clientX - dragStart.current) / 150
      state.current.targetRotation = rotationOnDragStart.current - delta
    }

    const onTouchEnd = () => {
      isDragging.current = false
    }

    const attachListeners = () => {
      canvas = document.querySelector('#photo-gallery canvas')
      if (!canvas) {
        retryId = setTimeout(attachListeners, 100)
        return
      }

      canvas.addEventListener('mousedown', onMouseDown)
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
      canvas.addEventListener('touchstart', onTouchStart, { passive: true })
      canvas.addEventListener('touchmove', onTouchMove, { passive: true })
      canvas.addEventListener('touchend', onTouchEnd)
    }

    attachListeners()

    return () => {
      if (retryId) clearTimeout(retryId)
      if (!canvas) return
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [])

  const selectPhoto = (index: number) => {
    const safeIndex = normalizeIndex(index)
    state.current.selectedIndex = safeIndex
    state.current.targetRotation = -(safeIndex / PHOTO_COUNT) * Math.PI * 2
    lastReportedIndex.current = safeIndex
    onSelectRef.current(safeIndex)
  }

  useFrame(() => {
    if (!groupRef.current) return

    state.current.rotation = THREE.MathUtils.lerp(
      state.current.rotation,
      state.current.targetRotation,
      0.06
    )
    groupRef.current.rotation.y = state.current.rotation

    const radius = radiusRef.current
    groupRef.current.children.forEach((child, i) => {
      if (!(child instanceof THREE.Mesh)) return

      const photoAngle = (i / PHOTO_COUNT) * Math.PI * 2
      const currentAngle = photoAngle + state.current.rotation
      const normalizedAngle =
        ((currentAngle + Math.PI) % (Math.PI * 2)) - Math.PI
      const distFromFront = Math.abs(normalizedAngle)
      const proximity = 1 - distFromFront / Math.PI

      const x = Math.sin(photoAngle) * radius
      const z = Math.cos(photoAngle) * radius
      child.position.set(x, 0, z)
      child.rotation.set(0, photoAngle + Math.PI, 0)
      child.scale.setScalar(0.7 + proximity * 0.4)

      if (child.material instanceof THREE.MeshBasicMaterial) {
        child.material.opacity = 0.35 + proximity * 0.65
        const brightness = 0.55 + proximity * 0.45
        child.material.color.setRGB(brightness, brightness, brightness)
      }
    })
  })

  return (
    <>
      <group ref={groupRef}>
        {photoLayouts.map(({ photo, angle, width, height }, i) => {
          const x = Math.sin(angle) * DESKTOP_RADIUS
          const z = Math.cos(angle) * DESKTOP_RADIUS

          return (
            <mesh
              key={photo.id}
              position={[x, 0, z]}
              rotation={[0, angle + Math.PI, 0]}
              onClick={(e) => {
                e.stopPropagation()
                selectPhoto(i)
              }}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'default'
              }}
            >
              <planeGeometry args={[width, height]} />
              <meshBasicMaterial
                map={textureArray[i]}
                transparent
                opacity={0.85}
                toneMapped={false}
              />
            </mesh>
          )
        })}
      </group>

      <FloatingCamera
        targetAngle={(selectedIndex / PHOTO_COUNT) * Math.PI * 2}
      />
    </>
  )
}
