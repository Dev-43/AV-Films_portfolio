'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { photos } from '@/data/photos'
import type { AspectRatio } from '@/data/photos'
// import { FloatingCamera } from './FloatingCamera'

const PHOTO_COUNT = photos.length
const ROW_COUNT = 2
const CARDS_PER_ROW = 18
const DISPLAY_CARD_COUNT = ROW_COUNT * CARDS_PER_ROW
const DESKTOP_RADIUS = 8.9
const MOBILE_RADIUS = 5.8
const DESKTOP_ROW_GAP = 2.85
const MOBILE_ROW_GAP = 2.1
const AUTO_SPEED = 0.0028
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
  sizeScale: number
  row: number
  slot: number
  angleOffset: number
}

function getPhotoDimensions(aspect: AspectRatio): [number, number] {
  if (aspect === 'portrait') return [1.62, 2.3]
  if (aspect === 'landscape') return [2.7, 1.8]
  return [2, 2]
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
  const layoutRef = useRef({
    radius: DESKTOP_RADIUS,
    rowGap: DESKTOP_ROW_GAP,
  })
  const hoveredIndex = useRef<number | null>(null)
  const onSelectRef = useRef(onSelect)
  const manualPauseFrames = useRef(0)

  const photoLayouts = useMemo<PhotoLayout[]>(
    () =>
      Array.from({ length: DISPLAY_CARD_COUNT }, (_, i) => {
        const photoIndex = i % PHOTO_COUNT
        const photo = photos[photoIndex]
        const [width, height] = getPhotoDimensions(photo.aspect)
        const row = Math.floor(i / CARDS_PER_ROW)
        const slot = i % CARDS_PER_ROW
        return {
          photoIndex,
          width,
          height,
          phase: i * 0.61,
          tilt: Math.sin(i * 1.13) * 0.08,
          row,
          slot,
          angleOffset: row * 0.16,
          sizeScale: 0.96 + Math.sin(i * 0.83) * 0.04,
        }
      }),
    []
  )

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const applyLayout = (mobile: boolean) => {
      layoutRef.current = mobile
        ? {
            radius: MOBILE_RADIUS,
            rowGap: MOBILE_ROW_GAP,
          }
        : {
            radius: DESKTOP_RADIUS,
            rowGap: DESKTOP_ROW_GAP,
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

    groupRef.current.children.forEach((child, i) => {
      if (!(child instanceof THREE.Group)) return

      const layout = photoLayouts[i]
      if (!layout) return

      const angleStep = (Math.PI * 2) / CARDS_PER_ROW
      const angle =
        (layout.slot - state.current.offset) * angleStep +
        layout.angleOffset
      const sinAngle = Math.sin(angle)
      const cosAngle = Math.cos(angle)
      const frontness = (-cosAngle + 1) / 2
      const side = sinAngle === 0 ? 0 : Math.sign(sinAngle)
      const rowCenter = layout.row - (ROW_COUNT - 1) / 2
      const depthScale = 0.72 + frontness * 0.46
      const hovered = hoveredIndex.current === i
      const currentHoverProgress =
        typeof child.userData.hoverProgress === 'number'
          ? child.userData.hoverProgress
          : 0

      const x = sinAngle * layoutConfig.radius
      const y =
        rowCenter * layoutConfig.rowGap +
        Math.sin(elapsed * 0.18 + layout.phase) * 0.05 -
        currentHoverProgress * 0.16
      const z =
        -4.6 -
        cosAngle * layoutConfig.radius * 0.62 +
        currentHoverProgress * 1.45

      child.userData.hoverProgress = THREE.MathUtils.lerp(
        currentHoverProgress,
        hovered ? 1 : 0,
        hovered ? 0.16 : 0.09
      )

      const hoverProgress = child.userData.hoverProgress as number
      child.position.set(
        x,
        y,
        z + Math.sin(elapsed * 2.2 + layout.phase) * 0.05 * hoverProgress
      )
      child.rotation.set(
        THREE.MathUtils.lerp(
          rowCenter * -0.05 + layout.tilt,
          -0.035,
          hoverProgress * 0.82
        ),
        THREE.MathUtils.lerp(
          -angle,
          -angle + side * 0.08,
          hoverProgress * 0.86
        ),
        THREE.MathUtils.lerp(
          side * 0.08,
          side * 0.045,
          hoverProgress * 0.78
        )
      )

      const baseScale =
        (0.72 + frontness * 0.28) * layout.sizeScale * depthScale
      const floatScale = Math.sin(elapsed * 0.7 + layout.phase) * 0.01
      child.scale.setScalar(baseScale + floatScale + hoverProgress * 0.36)

      child.children.forEach((cardPart) => {
        if (!(cardPart instanceof THREE.Mesh)) return
        if (!(cardPart.material instanceof THREE.MeshBasicMaterial)) return

        const opacity = Math.max(
          0.18,
          0.24 + frontness * 0.7 + hoverProgress * 0.12
        )
        const brightness =
          0.52 + frontness * 0.54 + hoverProgress * 0.24

        if (cardPart.userData.cardRole === 'image') {
          cardPart.material.opacity = opacity
          cardPart.material.color.setRGB(brightness, brightness, brightness)
        } else {
          cardPart.material.opacity = Math.max(0.38, opacity + 0.1)
          cardPart.material.color.setRGB(0.08, 0.08, 0.075)
        }
      })
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
          <group
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
            <mesh
              position={[0, 0, 0.02]}
              userData={{ cardRole: 'backing' }}
            >
              <boxGeometry args={[width + 0.16, height + 0.16, 0.08]} />
              <meshBasicMaterial
                color="#151311"
                transparent
                opacity={0.82}
                depthTest
                depthWrite
                toneMapped={false}
              />
            </mesh>
            <mesh
              position={[0, 0, -0.075]}
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

      {/* <FloatingCamera targetAngle={(selectedIndex / PHOTO_COUNT) * Math.PI * 2} /> */}
    </>
  )
}
