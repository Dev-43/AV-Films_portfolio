'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { filmmakers } from '@/data/filmmakes'

gsap.registerPlugin(ScrollTrigger)

const FILM_GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export default function Filmmakers() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    const card1 = card1Ref.current
    const card2 = card2Ref.current
    if (!section || !heading || !card1 || !card2) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        card1,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 68%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        card2,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 68%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const cardRefs = [card1Ref, card2Ref]

  return (
    <section
      id="filmmakers"
      ref={sectionRef}
      className="relative w-full bg-charcoal overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 5, backgroundImage: FILM_GRAIN_BG, opacity: 0.025 }}
        aria-hidden="true"
      />

      {/* Top dark fade */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '25%',
          background: 'linear-gradient(to bottom, #000 0%, transparent 100%)',
          zIndex: 4,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen w-full max-w-5xl mx-auto px-6 md:px-10 py-24">

        {/* Heading block */}
        <div ref={headingRef} className="mb-12 md:mb-16 w-full text-left" style={{ opacity: 0 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: 300,
              color: '#f5f0e8',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}
          >
            The{' '}
            <em style={{ fontStyle: 'italic', color: '#a89f96' }}>people</em>
            {' '}behind<br />the lens
          </h2>
        </div>

        {/* Cards — 2 cols on md+, stacked on mobile. Centered and capped max-width */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {filmmakers.map((filmmaker, i) => {
            const accent = filmmaker.accentColor
            const isPhoto = filmmaker.world === 'photo'
            const hasWhatsApp = filmmaker.contacts.whatsapp && filmmaker.contacts.whatsapp !== '#'
            const hasInstagram = filmmaker.contacts.instagram && filmmaker.contacts.instagram !== '#'

            return (
              <div
                key={filmmaker.id}
                ref={cardRefs[i]}
                className="group flex flex-col w-full mx-auto rounded-2xl border transition-all duration-500 ease-out p-6 md:p-8"
                style={{
                  opacity: 0,
                  backgroundColor: isPhoto ? 'rgba(15, 26, 19, 0.35)' : 'rgba(22, 18, 12, 0.35)',
                  borderColor: `${accent}15`,
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${accent}40`
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = `0 20px 40px -20px ${accent}15`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${accent}15`
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 10px 30px -15px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* ── Square portrait image ── */}
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: '1 / 1',
                    borderRadius: '10px',
                    background: '#0a0c0b',
                  }}
                >
                  {/* Accent stripe — left edge of image */}
                  <div
                    className="absolute top-0 left-0 bottom-0 pointer-events-none"
                    style={{
                      width: '3px',
                      background: `linear-gradient(to bottom, ${accent}, ${accent}33)`,
                      zIndex: 3,
                    }}
                    aria-hidden="true"
                  />

                  {/* World label — top-left */}
                  <div
                    className="absolute top-4 left-5 pointer-events-none"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '8px',
                      letterSpacing: '0.3em',
                      color: accent,
                      textTransform: 'uppercase',
                      zIndex: 4,
                      opacity: 0.95,
                    }}
                    aria-hidden="true"
                  >
                    {isPhoto ? 'Photography' : 'Videography'}
                  </div>

                  <Image
                    src={filmmaker.image}
                    alt={
                      filmmaker.name
                        ? `Portrait of ${filmmaker.name}, ${filmmaker.role} at AV Films`
                        : `Portrait of ${filmmaker.role} at AV Films`
                    }
                    width={500}
                    height={500}
                    unoptimized
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Subtle dark vignette on image borders */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
                      zIndex: 2,
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* ── Info block — below the image ── */}
                <div className="flex flex-col flex-grow justify-between gap-6 pt-6">
                  <div className="flex flex-col gap-3">
                    {/* Name / role */}
                    <div>
                      {filmmaker.name ? (
                        <>
                          <h3
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                              fontWeight: 400,
                              color: '#f5f0e8',
                              lineHeight: 1.2,
                              marginBottom: '2px',
                            }}
                          >
                            {filmmaker.name}
                          </h3>
                          <p
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '9px',
                              letterSpacing: '0.22em',
                              color: accent,
                              textTransform: 'uppercase',
                            }}
                          >
                            {filmmaker.role}
                          </p>
                        </>
                      ) : (
                        <h3
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                            fontWeight: 300,
                            fontStyle: 'italic',
                            color: '#a89f96',
                            lineHeight: 1.2,
                          }}
                        >
                          {filmmaker.role}
                        </h3>
                      )}
                    </div>

                    {/* Philosophy quote */}
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(0.95rem, 1.6vw, 1.05rem)',
                        fontWeight: 300,
                        fontStyle: 'italic',
                        color: '#a89f96',
                        lineHeight: 1.6,
                      }}
                    >
                      &ldquo;{filmmaker.philosophy}&rdquo;
                    </p>
                  </div>

                  {/* ── Contact row — WhatsApp icon button + Instagram ── */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 mt-auto">
                    {hasWhatsApp && (
                      <a
                        href={filmmaker.contacts.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Chat with ${filmmaker.name || filmmaker.role} on WhatsApp`}
                        className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 min-h-[40px]"
                        style={{
                          background: `${accent}12`,
                          border: `1px solid ${accent}30`,
                          color: accent,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${accent}22`
                          e.currentTarget.style.borderColor = accent
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `${accent}12`
                          e.currentTarget.style.borderColor = `${accent}30`
                        }}
                      >
                        <WhatsAppIcon size={14} />
                        WhatsApp
                      </a>
                    )}

                    {hasInstagram && (
                      <a
                        href={filmmaker.contacts.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${filmmaker.name || filmmaker.role} on Instagram`}
                        className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 min-h-[40px]"
                        style={{
                          background: `${accent}12`,
                          border: `1px solid ${accent}30`,
                          color: accent,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${accent}22`
                          e.currentTarget.style.borderColor = accent
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `${accent}12`
                          e.currentTarget.style.borderColor = `${accent}30`
                        }}
                      >
                        <InstagramIcon size={14} />
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
