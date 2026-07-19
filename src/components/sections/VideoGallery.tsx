'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { videoCategories } from '@/data/videos'
import type { VideoCategory } from '@/data/videos'
import SectionShell from '@/components/sections/SectionShell'

gsap.registerPlugin(ScrollTrigger)

function YouTubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

interface VideoCardProps {
  category: VideoCategory
  index: number
}

function VideoCard({ category, index }: VideoCardProps) {
  const { title, thumbnail, previewUrl, youtubeUrl, description, count } = category
  const cardRef = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const isComingSoon = !youtubeUrl
  const hasPreview = !!previewUrl

  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasPreview) return

    // Intersection observer to play and load video on viewport entry
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Lazy load video source on intersection
            if (!video.src && previewUrl) {
              video.src = previewUrl
              video.load()
            }
            video.play().catch(() => {
              // Ignore play interruption warnings
            })
            // Fade in video
            video.style.opacity = '1'
          } else {
            video.pause()
            video.style.opacity = '0'
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '100px', // trigger preload slightly before entering viewport
      }
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
    }
  }, [previewUrl, hasPreview])

  const cardContent = (
    <div
      className={`relative w-full aspect-video rounded overflow-hidden border transition-all duration-500 ease-out flex flex-col justify-end p-5 md:p-6 ${
        isComingSoon ? 'cursor-default' : 'cursor-pointer hover:scale-[1.02]'
      }`}
      style={{
        borderColor: 'rgba(201, 168, 76, 0.1)',
      }}
      onMouseEnter={(e) => {
        if (!isComingSoon) {
          e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.45)'
          const overlay = e.currentTarget.querySelector('.gradient-overlay') as HTMLElement
          if (overlay) overlay.style.opacity = '0.9'
          const badge = e.currentTarget.querySelector('.youtube-badge') as HTMLElement
          if (badge) badge.style.opacity = '1'
        }
      }}
      onMouseLeave={(e) => {
        if (!isComingSoon) {
          e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.1)'
          const overlay = e.currentTarget.querySelector('.gradient-overlay') as HTMLElement
          if (overlay) overlay.style.opacity = '0.75'
          const badge = e.currentTarget.querySelector('.youtube-badge') as HTMLElement
          if (badge) badge.style.opacity = '0.4'
        }
      }}
    >
      {/* Layer 1: Static Thumbnail */}
      <Image
        src={thumbnail}
        alt={`Thumbnail for ${title} videography`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`object-cover transition-all duration-700 ${
          isComingSoon ? 'grayscale-[60%] opacity-50' : 'group-hover:scale-105'
        }`}
        unoptimized
      />

      {/* Layer 2: Autoplay Preview Video */}
      {!isComingSoon && hasPreview && (
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover z-10 opacity-0 transition-opacity duration-700 ease-out pointer-events-none"
        />
      )}

      {/* Layer 3: Gradient scrim */}
      <div
        className="gradient-overlay absolute inset-0 z-20 transition-opacity duration-500 pointer-events-none"
        style={{
          opacity: isComingSoon ? '0.85' : '0.75',
          background: 'linear-gradient(to top, rgba(13, 12, 11, 0.95) 0%, rgba(13, 12, 11, 0.4) 50%, transparent 100%)',
        }}
      />

      {/* Layer 4: Text content */}
      <div className="relative z-30 flex flex-col gap-1.5 pointer-events-none text-left">
        <h3
          style={{ fontFamily: 'var(--font-sans)' }}
          className="text-offwhite font-medium text-[15px] md:text-[17px] tracking-wide"
        >
          {title}
        </h3>
        <p
          style={{ fontFamily: 'var(--font-mono)' }}
          className="text-avGold uppercase tracking-widest text-[9px]"
        >
          {count} {count === 1 ? 'FILM' : 'FILMS'}
        </p>
        <p className="text-muted text-[11px] md:text-[12px] leading-relaxed max-w-[90%] line-clamp-2 mt-1">
          {description}
        </p>
      </div>

      {/* Layer 5: Badges / Corner Action Buttons */}
      {isComingSoon ? (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              letterSpacing: '0.15em',
            }}
            className="px-2.5 py-1 bg-charcoal border border-avGold/30 text-avGold rounded-full font-medium"
          >
            COMING SOON
          </span>
          <a
            href="https://wa.me/917517218149"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Inquire via WhatsApp about this upcoming service"
            className="flex items-center justify-center w-7 h-7 bg-charcoal/80 border border-avGold/30 text-avGold rounded-full hover:bg-avGold hover:text-charcoal transition-all duration-300 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <WhatsAppIcon size={12} />
          </a>
        </div>
      ) : (
        <div
          className="youtube-badge absolute top-4 right-4 z-30 flex items-center justify-center w-8 h-8 rounded-full border border-avGold/40 text-avGold bg-charcoal/80 transition-all duration-500 opacity-40"
          style={{ pointerEvents: 'none' }}
        >
          <YouTubeIcon size={14} />
        </div>
      )}
    </div>
  )

  if (isComingSoon) {
    return (
      <div ref={cardRef} className="video-card w-full" style={{ opacity: 0 }}>
        {cardContent}
      </div>
    )
  }

  return (
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch ${title} on YouTube`}
      ref={cardRef}
      className="video-card block w-full"
      style={{ opacity: 0 }}
    >
      {cardContent}
    </a>
  )
}

export default function VideoGallery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const grid = gridRef.current
    if (!section || !grid) return

    const cards = grid.querySelectorAll('.video-card')

    const ctx = gsap.context(() => {
      // Staggered reveal for grid video cards
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <SectionShell
      id="video-gallery"
      label="05 · Video Gallery"
      bgClass="bg-charcoal"
      minHeightClass="min-h-screen"
    >
      <div
        ref={sectionRef}
        className="w-full max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 flex flex-col gap-12 md:gap-16"
      >
        {/* Section Header */}
        <div className="w-full flex flex-col items-start text-left">
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.35em',
            }}
            className="text-avGold uppercase text-[9px] md:text-[10px] mb-3"
          >
            VIDEOGRAPHY
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              lineHeight: 1.1,
            }}
            className="text-offwhite font-light"
          >
            Motion,{' '}
            <em style={{ fontStyle: 'italic' }} className="text-muted">
              Framed.
            </em>
          </h2>
        </div>

        {/* Video Grid */}
        <div
          ref={gridRef}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {videoCategories.map((category, index) => (
            <VideoCard
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
