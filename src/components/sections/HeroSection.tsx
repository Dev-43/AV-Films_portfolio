'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/lib/lenis'

gsap.registerPlugin(ScrollTrigger)

const ParticleCanvas = dynamic(
  () => import('@/components/three/ParticleCanvas'),
  { ssr: false }
)

export default function HeroSection() {
  const lenis = useLenis()
  const progressRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const canvasWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !canvasWrapperRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(canvasWrapperRef.current, {
        opacity: 0,
        scale: 0.95,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!lenis) return

    const onScroll = (instance: Lenis) => {
      if (progressRef.current) {
        progressRef.current.style.width = `${instance.progress * 100}%`
      }
    }

    lenis.on('scroll', onScroll)
    return () => {
      lenis.off('scroll', onScroll)
    }
  }, [lenis])

  return (
    <>
      <div
        ref={progressRef}
        className="fixed top-0 left-0 h-[1px] bg-avGold z-50 pointer-events-none"
        style={{ width: '0%', transition: 'none' }}
      />
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-charcoal"
    >
      <div
        ref={canvasWrapperRef}
        className="absolute inset-0 z-0"
        style={{ pointerEvents: 'none' }}
      >
        <ParticleCanvas />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 5,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-between px-4 py-12 md:py-16 pointer-events-none">
        <div className="flex flex-col items-center gap-3 mt-8 md:mt-12">
          <h1
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-4xl md:text-6xl lg:text-7xl text-offwhite tracking-[0.25em] md:tracking-[0.35em] font-light"
          >
            AV FILMS
          </h1>
          <div className="w-12 h-px bg-avGold opacity-40" />
          <p
            style={{ fontFamily: 'var(--font-sans)' }}
            className="text-xs md:text-sm text-muted tracking-[0.3em] font-light uppercase"
          >
            Photography & Film
          </p>
        </div>

        {/* Orb Labels */}
        <div className="flex-1 flex items-end justify-between w-full max-w-xs md:max-w-2xl px-6 md:px-16 pb-6 md:pb-8 pointer-events-none">

          {/* Photography — under left orb */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-6 bg-avEmerald opacity-30" />
            <span
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-avEmerald text-sm md:text-base italic tracking-wider"
            >
              Photography
            </span>
            <span
              style={{ fontFamily: 'var(--font-mono)' }}
              className="text-muted text-[8px] tracking-[0.25em] uppercase opacity-60"
            >
              click to enter
            </span>
          </div>

          {/* Film & Video — under right orb */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-6 bg-avGold opacity-30" />
            <span
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-avGold text-sm md:text-base italic tracking-wider"
            >
              Film & Video
            </span>
            <span
              style={{ fontFamily: 'var(--font-mono)' }}
              className="text-muted text-[8px] tracking-[0.25em] uppercase opacity-60"
            >
              click to enter
            </span>
          </div>

        </div>

        <div className="flex flex-col items-center gap-2 mb-4">
          <span
            style={{ fontFamily: 'var(--font-mono)' }}
            className="text-[9px] text-muted tracking-[0.3em] uppercase"
          >
            Scroll
          </span>
          <div className="w-px h-8 bg-muted opacity-40 scroll-hint-line" />
        </div>
      </div>

      <span
        style={{ fontFamily: 'var(--font-mono)' }}
        className="absolute top-6 left-4 md:left-8 z-20 text-[8px] text-muted tracking-[0.3em] uppercase opacity-50"
      >
        Pimpri · Pune
      </span>

      <span
        style={{ fontFamily: 'var(--font-mono)' }}
        className="absolute top-6 right-4 md:right-8 z-20 text-[8px] text-muted tracking-[0.3em] uppercase opacity-50"
      >
        01 / 09
      </span>
    </section>
    </>
  )
}
