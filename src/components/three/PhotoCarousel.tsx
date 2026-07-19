'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Photo, AspectRatio } from '@/data/photos'

interface PhotoCarouselProps {
  selectedIndex: number
  onSelect: (index: number) => void
  photosList: Photo[]
}

interface PhotoLayout {
  photoIndex: number
  width: number
  height: number
  phase: number
  tilt: number
  sizeScale: number
  slot: number
}

const AUTO_SPEED = 0.0014
const MANUAL_SELECT_PAUSE_FRAMES = 90

function getPhotoDimensions(aspect: AspectRatio): [number, number] {
  if (aspect === 'portrait') return [1.62, 2.3]
  if (aspect === 'landscape') return [2.7, 1.8]
  return [2, 2]
}

function normalizeIndex(index: number, count: number): number {
  if (!Number.isFinite(index) || count === 0) return 0
  return ((Math.round(index) % count) + count) % count
}

function wrappedDistance(i: number, offset: number, count: number): number {
  const raw = i - offset
  const half = count / 2
  return ((raw + half) % count + count) % count - half
}

function createPlaceholderTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 600
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#252321'
    ctx.fillRect(0, 0, 800, 600)
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

function usePhotoTextures(photosList: Photo[]): THREE.Texture[] {
  return useMemo(() => {
    const placeholder = createPlaceholderTexture()
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')

    return photosList.map((photo) => {
      if (photo.src.endsWith('.svg')) return placeholder

      // Use Next.js Image Optimization API to convert PNG/JPEG to WebP/AVIF and scale it down
      const optimizedSrc = `/_next/image?url=${encodeURIComponent(photo.src)}&w=1080&q=75`
      const texture = loader.load(optimizedSrc)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.anisotropy = 8
      return texture
    })
  }, [photosList])
}

export function PhotoCarousel({ selectedIndex, onSelect, photosList }: PhotoCarouselProps) {
  const PHOTO_COUNT = photosList.length
  const textureArray = usePhotoTextures(photosList)
  
  const state = useRef({
    offset: selectedIndex,
    targetOffset: selectedIndex,
  })
  
  const groupRef = useRef<THREE.Group>(null)
  const isDragging = useRef(false)
  const dragStart = useRef(0)
  const offsetOnDragStart = useRef(0)
  const lastReportedIndex = useRef(selectedIndex)
  const layoutRef = useRef({
    spacing: 3.4,
  })
  const hoveredIndex = useRef<number | null>(null)
  const onSelectRef = useRef(onSelect)
  const manualPauseFrames = useRef(0)

  const photoLayouts = useMemo<PhotoLayout[]>(
    () =>
      photosList.map((photo, i) => {
        const [width, height] = getPhotoDimensions(photo.aspect)
        return {
          photoIndex: i,
          width,
          height,
          phase: i * 0.61,
          tilt: Math.sin(i * 1.13) * 0.06,
          slot: i,
          sizeScale: 0.98 + Math.sin(i * 0.83) * 0.02,
        }
      }),
    [photosList]
  )

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const applyLayout = (mobile: boolean) => {
      layoutRef.current = {
        spacing: mobile ? 2.15 : 3.4,
      }
    }
    applyLayout(mq.matches)
    const onChange = (e: MediaQueryListEvent) => applyLayout(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    let canvas: HTMLCanvasElement | null = null
    let retryId: ReturnType<typeof setTimeout> | undefined

    const onMouseDown = (e: Event) => {
      const mouseEvent = e as MouseEvent
      isDragging.current = true
      dragStart.current = mouseEvent.clientX
      offsetOnDragStart.current = state.current.targetOffset
    }

    const onMouseMove = (e: Event) => {
      if (!isDragging.current) return
      const mouseEvent = e as MouseEvent
      state.current.targetOffset =
        offsetOnDragStart.current - (mouseEvent.clientX - dragStart.current) / 140
    }

    const onMouseUp = () => {
      isDragging.current = false
    }

    const onTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent
      isDragging.current = true
      dragStart.current = touchEvent.touches[0].clientX
      offsetOnDragStart.current = state.current.targetOffset
    }

    const onTouchMove = (e: Event) => {
      if (!isDragging.current) return
      const touchEvent = e as TouchEvent
      state.current.targetOffset =
        offsetOnDragStart.current - (touchEvent.touches[0].clientX - dragStart.current) / 110
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
    const safeIndex = normalizeIndex(index, PHOTO_COUNT)
    state.current.targetOffset = index // Keep the offset running (don't force clamp targetOffset to keep wrap feel)
    // Adjust targetOffset so it snaps to the nearest equivalent of index
    const currentOffset = state.current.offset
    const diff = wrappedDistance(index, currentOffset, PHOTO_COUNT)
    state.current.targetOffset = currentOffset + diff
    
    lastReportedIndex.current = safeIndex
    manualPauseFrames.current = MANUAL_SELECT_PAUSE_FRAMES
    onSelectRef.current(safeIndex)
  }

  useFrame(({ clock }) => {
    if (!groupRef.current || PHOTO_COUNT === 0) return

    if (manualPauseFrames.current > 0) {
      manualPauseFrames.current -= 1
    }

    if (
      hoveredIndex.current === null &&
      !isDragging.current &&
      manualPauseFrames.current === 0
    ) {
      state.current.targetOffset += AUTO_SPEED
    }

    state.current.offset = THREE.MathUtils.lerp(
      state.current.offset,
      state.current.targetOffset,
      0.055
    )

    const elapsed = clock.getElapsedTime()
    const layoutConfig = layoutRef.current
    const spacing = layoutConfig.spacing
    const CULL_DISTANCE = 2.4

    groupRef.current.children.forEach((child, i) => {
      if (!(child instanceof THREE.Group)) return

      const layout = photoLayouts[i]
      if (!layout) return

      // Compute wrapped distance for looped layout
      const dist = wrappedDistance(i, state.current.offset, PHOTO_COUNT)

      // Cull off-screen slides
      if (Math.abs(dist) > CULL_DISTANCE) {
        child.visible = false
        return
      }

      child.visible = true

      // Math falloffs
      const frontness = Math.max(0, Math.min(1, 1 - Math.abs(dist) / CULL_DISTANCE))
      const hovered = hoveredIndex.current === i
      const currentHoverProgress =
        typeof child.userData.hoverProgress === 'number'
          ? child.userData.hoverProgress
          : 0

      child.userData.hoverProgress = THREE.MathUtils.lerp(
        currentHoverProgress,
        hovered ? 1 : 0,
        hovered ? 0.16 : 0.09
      )

      const hoverProgress = child.userData.hoverProgress as number

      // Positions
      const x = dist * spacing
      const y =
        Math.sin(elapsed * 0.18 + layout.phase) * 0.05 -
        hoverProgress * 0.16
      const z =
        -Math.abs(dist) * 1.5 +
        hoverProgress * 1.45

      child.position.set(
        x,
        y,
        z + Math.sin(elapsed * 2.2 + layout.phase) * 0.05 * hoverProgress
      )

      // Rotations: face camera mostly, tilt slightly towards center if not hovered
      const tiltX = layout.tilt
      const rotY = -dist * 0.22
      const rotZ = -dist * 0.03

      child.rotation.set(
        THREE.MathUtils.lerp(tiltX, 0, hoverProgress),
        THREE.MathUtils.lerp(rotY, 0, hoverProgress),
        THREE.MathUtils.lerp(rotZ, 0, hoverProgress)
      )

      // Scaling
      const baseScale = (0.68 + frontness * 0.32) * layout.sizeScale
      const floatScale = Math.sin(elapsed * 0.7 + layout.phase) * 0.01
      child.scale.setScalar(baseScale + floatScale + hoverProgress * 0.32)

      // Material opacities & colors
      child.children.forEach((cardPart) => {
        if (!(cardPart instanceof THREE.Mesh)) return
        if (!(cardPart.material instanceof THREE.MeshBasicMaterial)) return

        const opacity = Math.max(
          0.12,
          0.2 + frontness * 0.75 + hoverProgress * 0.05
        )
        const brightness = 0.48 + frontness * 0.52 + hoverProgress * 0.2

        if (cardPart.userData.cardRole === 'image') {
          cardPart.material.opacity = opacity
          cardPart.material.color.setRGB(brightness, brightness, brightness)
        } else {
          cardPart.material.opacity = Math.max(0.38, opacity + 0.1)
          cardPart.material.color.setRGB(0.08, 0.08, 0.075)
        }
      })
    })

    const activeIndex = normalizeIndex(state.current.offset, PHOTO_COUNT)
    if (activeIndex !== lastReportedIndex.current) {
      lastReportedIndex.current = activeIndex
      onSelectRef.current(activeIndex)
    }
  })

  return (
    <group ref={groupRef}>
      {photoLayouts.map(({ photoIndex, width, height }) => (
        <group
          key={photosList[photoIndex].id}
          onClick={(e) => {
            e.stopPropagation()
            selectPhoto(photoIndex)
          }}
          onPointerOver={() => {
            hoveredIndex.current = photoIndex
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            hoveredIndex.current = null
            document.body.style.cursor = 'default'
          }}
        >
          {/* Front Image Mesh */}
          <mesh
            position={[0, 0, 0]}
            userData={{ cardRole: 'image' }}
          >
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial
              map={textureArray[photoIndex]}
              transparent
              opacity={0.92}
              alphaTest={0.02}
              depthTest
              depthWrite
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
