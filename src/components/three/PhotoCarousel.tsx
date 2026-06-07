'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { photos } from '@/data/photos'
import type { AspectRatio } from '@/data/photos'
// import { FloatingCamera } from './FloatingCamera'

const PHOTO_COUNT = photos.length
const DISPLAY_CARD_COUNT = Math.max(PHOTO_COUNT * 4, 112)
const DESKTOP_SPREAD = 0.38
const MOBILE_SPREAD = 0.32
const AUTO_SPEED = 0.011
const MANUAL_SELECT_PAUSE_FRAMES = 90

interface CarouselState {
  offset: number
  targetOffset: number
}

interface PhotoCarouselProps {
  selectedIndex: number
  onSelect: (index: number) => void
}

interface PhotoLayout {
  photoIndex: number
  width: number
  height: number
  phase: number
  tilt: number
  lane: number
  depthShift: number
  sizeScale: number
}

function getPhotoDimensions(aspect: AspectRatio): [number, number] {
  if (aspect === 'portrait') return [1.72, 2.42]
  if (aspect === 'landscape') return [2.78, 1.86]
  return [2.08, 2.08]
}

function normalizeIndex(index: number): number {
  if (!Number.isFinite(index) || PHOTO_COUNT === 0) return 0
  return ((Math.round(index) % PHOTO_COUNT) + PHOTO_COUNT) % PHOTO_COUNT
}

function wrapSlot(value: number, count: number): number {
  return THREE.MathUtils.euclideanModulo(value + count / 2, count) - count / 2
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

function usePhotoTextures(): THREE.Texture[] {
  return useMemo(() => {
    const placeholder = createPlaceholderTexture()
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')

    return photos.map((photo) => {
      if (photo.src.endsWith('.svg')) return placeholder

      const texture = loader.load(photo.src)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.anisotropy = 8
      return texture
    })
  }, [])
}

export function PhotoCarousel({ selectedIndex, onSelect }: PhotoCarouselProps) {
  const textureArray = usePhotoTextures()
  const state = useRef<CarouselState>({
    offset: selectedIndex,
    targetOffset: selectedIndex,
  })
  const groupRef = useRef<THREE.Group>(null)
  const isDragging = useRef(false)
  const dragStart = useRef(0)
  const offsetOnDragStart = useRef(0)
  const lastReportedIndex = useRef(selectedIndex)
  const spreadRef = useRef(DESKTOP_SPREAD)
  const hoveredIndex = useRef<number | null>(null)
  const onSelectRef = useRef(onSelect)
  const manualPauseFrames = useRef(0)

  const photoLayouts = useMemo<PhotoLayout[]>(
    () =>
      Array.from({ length: DISPLAY_CARD_COUNT }, (_, i) => {
        const photoIndex = i % PHOTO_COUNT
        const photo = photos[photoIndex]
        const [width, height] = getPhotoDimensions(photo.aspect)
        const lanePattern = [-2, 1, -1, 2, 0, -2, 2, -1, 1]
        return {
          photoIndex,
          width,
          height,
          phase: i * 0.61,
          tilt: Math.sin(i * 1.13) * 0.08,
          lane: lanePattern[i % lanePattern.length],
          depthShift: Math.sin(i * 1.47) * 0.72,
          sizeScale: 0.92 + Math.sin(i * 0.83) * 0.1,
        }
      }),
    []
  )

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const applySpread = (mobile: boolean) => {
      spreadRef.current = mobile ? MOBILE_SPREAD : DESKTOP_SPREAD
    }
    applySpread(mq.matches)
    const onChange = (e: MediaQueryListEvent) => applySpread(e.matches)
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
    const safeIndex = normalizeIndex(index)
    state.current.targetOffset = safeIndex
    lastReportedIndex.current = safeIndex
    manualPauseFrames.current = MANUAL_SELECT_PAUSE_FRAMES
    onSelectRef.current(safeIndex)
  }

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    if (manualPauseFrames.current > 0) {
      manualPauseFrames.current -= 1
    }

    if (!isDragging.current && manualPauseFrames.current === 0) {
      state.current.targetOffset += AUTO_SPEED
    }

    state.current.offset = THREE.MathUtils.lerp(
      state.current.offset,
      state.current.targetOffset,
      0.055
    )

    const elapsed = clock.getElapsedTime()
    const spread = spreadRef.current
    const half = DISPLAY_CARD_COUNT / 2

    groupRef.current.children.forEach((child, i) => {
      if (!(child instanceof THREE.Mesh)) return

      const layout = photoLayouts[i]
      if (!layout) return

      const slot = wrapSlot(i - state.current.offset, DISPLAY_CARD_COUNT)
      const absSlot = Math.abs(slot)
      const side = slot === 0 ? 0 : Math.sign(slot)
      const visibleFalloff = Math.max(0, 1 - absSlot / half)
      const edgeLift = Math.min(absSlot / 17, 1)
      const spiral = Math.sin((slot + state.current.offset) * 0.58 + layout.phase)
      const hovered = hoveredIndex.current === i

      const x = slot * spread
      const y =
        layout.lane * 0.88 +
        Math.sin(slot * 0.36 + state.current.offset * 0.16 + layout.phase) * 0.34 +
        spiral * 0.22
      const z =
        -7.8 +
        edgeLift * 5.9 +
        spiral * 0.9 +
        layout.depthShift +
        child.userData.hoverProgress * 1.05

      child.position.set(x, y, z)
      child.userData.hoverProgress = THREE.MathUtils.lerp(
        child.userData.hoverProgress ?? 0,
        hovered ? 1 : 0,
        0.12
      )

      const hoverProgress = child.userData.hoverProgress as number
      child.rotation.set(
        THREE.MathUtils.lerp(
          layout.tilt + spiral * 0.025,
          0,
          hoverProgress * 0.75
        ),
        THREE.MathUtils.lerp(
          -slot * 0.145 + side * edgeLift * 0.22,
          0,
          hoverProgress * 0.82
        ),
        THREE.MathUtils.lerp(-slot * 0.018, 0, hoverProgress * 0.7)
      )

      const baseScale =
        (0.74 + edgeLift * 0.32 + visibleFalloff * 0.08) * layout.sizeScale
      const floatScale = Math.sin(elapsed * 0.7 + layout.phase) * 0.015
      child.scale.setScalar(baseScale + floatScale + hoverProgress * 0.28)

      if (child.material instanceof THREE.MeshBasicMaterial) {
        child.material.opacity = Math.max(
          0.22,
          0.4 + visibleFalloff * 0.56 + hoverProgress * 0.18
        )
        const brightness =
          0.56 + visibleFalloff * 0.5 + hoverProgress * 0.32
        child.material.color.setRGB(brightness, brightness, brightness)
      }
    })

    const activeIndex = normalizeIndex(state.current.offset)
    if (activeIndex !== lastReportedIndex.current) {
      lastReportedIndex.current = activeIndex
      onSelectRef.current(activeIndex)
    }
  })

  return (
    <>
      <group ref={groupRef}>
        {photoLayouts.map(({ photoIndex, width, height }, displayIndex) => (
          <mesh
            key={`${photos[photoIndex].id}-${displayIndex}`}
            onClick={(e) => {
              e.stopPropagation()
              selectPhoto(photoIndex)
            }}
            onPointerOver={() => {
              hoveredIndex.current = displayIndex
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              hoveredIndex.current = null
              document.body.style.cursor = 'default'
            }}
          >
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial
              map={textureArray[photoIndex]}
              transparent
              opacity={0.85}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* <FloatingCamera targetAngle={(selectedIndex / PHOTO_COUNT) * Math.PI * 2} /> */}
    </>
  )
}
