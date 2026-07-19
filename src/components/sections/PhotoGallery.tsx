'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { photos as defaultPhotos } from '@/data/photos'
import type { Photo } from '@/data/photos'

const PhotoCarouselCanvas = dynamic(
  () => import('@/components/three/PhotoCarouselCanvas'),
  { ssr: false }
)

const FILM_GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`

export default function PhotoGallery() {
  const [photosList, setPhotosList] = useState<Photo[]>(
    defaultPhotos.filter((p) => p.aspect === 'landscape')
  )
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    fetch('/api/photos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const landscapeOnly = (data as Photo[]).filter((p) => p.aspect === 'landscape')
          if (landscapeOnly.length > 0) setPhotosList(landscapeOnly)
        }
      })
      .catch((err) => console.error('Error fetching gallery photos:', err))
  }, [])

  const PHOTO_COUNT = photosList.length

  function normalizeIndex(index: number): number {
    if (!Number.isFinite(index) || PHOTO_COUNT === 0) return 0
    return ((Math.round(index) % PHOTO_COUNT) + PHOTO_COUNT) % PHOTO_COUNT
  }

  const safeIndex = normalizeIndex(selectedIndex)
  const currentPhoto = photosList[safeIndex]

  const handleSelect = (index: number) => {
    setSelectedIndex(normalizeIndex(index))
  }

  return (
    <section
      id="photo-gallery"
      className="relative w-full bg-charcoal overflow-hidden"
      style={{ height: '100vh', minHeight: '600px' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 5,
          backgroundImage: FILM_GRAIN_BG,
          opacity: 0.025,
        }}
      />

      <div
        className="absolute inset-0 bg-charcoal"
        style={{ zIndex: 1 }}
      >
        <PhotoCarouselCanvas
          selectedIndex={safeIndex}
          onSelect={handleSelect}
          photos={photosList}
        />
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.3em',
          color: '#a89f96',
        }}
      >
        {String(safeIndex + 1).padStart(2, '0')}
        &nbsp;/&nbsp;
        {String(PHOTO_COUNT).padStart(2, '0')}
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: '#50c878',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          Product Photography
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 2vw, 1.4rem)',
            color: '#f5f0e8',
            fontWeight: 300,
            fontStyle: 'italic',
          }}
        >
          {currentPhoto?.year ?? ''}
        </div>
      </div>
    </section>
  )
}

