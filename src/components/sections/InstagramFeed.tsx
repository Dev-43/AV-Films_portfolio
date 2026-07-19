'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { instagramConfig, instagramPosts } from '@/data/instagram'
import SectionShell from '@/components/sections/SectionShell'

gsap.registerPlugin(ScrollTrigger)

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function HeartIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function CommentIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    </svg>
  )
}

export default function InstagramFeed() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const grid = gridRef.current
    if (!container || !grid) return

    const cards = grid.querySelectorAll('.instagram-card')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <SectionShell
      id="instagram"
      label="06 · Instagram"
      bgClass="bg-charcoal"
      minHeightClass="min-h-screen py-16 md:py-24"
    >
      <div
        ref={containerRef}
        className="w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col items-center gap-12 md:gap-16"
      >
        {/* Header Block */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col items-start text-left">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.35em',
              }}
              className="text-avEmerald uppercase text-[9px] md:text-[10px] mb-3"
            >
              SOCIAL FEED
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                lineHeight: 1.1,
              }}
              className="text-offwhite font-light"
            >
              Moments,{' '}
              <em style={{ fontStyle: 'italic' }} className="text-muted">
                Shared.
              </em>
            </h2>
          </div>

          <a
            href={instagramConfig.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-muted hover:text-avEmerald transition-colors duration-300 group border-b border-transparent hover:border-avEmerald/30 pb-1 self-start md:self-auto"
          >
            <InstagramIcon size={16} />
            <span
              style={{ fontFamily: 'var(--font-mono)' }}
              className="text-xs md:text-sm tracking-wider"
            >
              {instagramConfig.handle}
            </span>
          </a>
        </div>

        {/* Post Grid: 2 cols on mobile, 3 cols on desktop */}
        <div
          ref={gridRef}
          className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 lg:gap-8"
        >
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-card group relative block aspect-square w-full rounded overflow-hidden border border-avEmerald/10 bg-black"
              style={{ opacity: 0 }}
            >
              {/* Image */}
              <Image
                src={post.thumbnail}
                alt={post.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                unoptimized
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 z-10 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                <div className="text-avEmerald/90 scale-90 group-hover:scale-100 transition-transform duration-300">
                  <InstagramIcon size={24} />
                </div>
                
                {/* Mock Likes/Comments for depth */}
                <div className="flex gap-4 text-offwhite text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    <HeartIcon size={12} />
                    {Math.floor(post.id.charCodeAt(3) * 1.5)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CommentIcon size={12} />
                    {Math.floor(post.id.charCodeAt(3) / 8)}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href={instagramConfig.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 border border-avEmerald/30 text-avEmerald text-xs md:text-sm font-mono tracking-widest uppercase rounded-full hover:bg-avEmerald hover:text-charcoal transition-all duration-300 hover:border-avEmerald hover:-translate-y-0.5"
        >
          <InstagramIcon size={14} />
          Follow on Instagram
        </a>
      </div>
    </SectionShell>
  )
}
