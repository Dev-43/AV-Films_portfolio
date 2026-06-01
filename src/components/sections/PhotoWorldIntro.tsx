'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/lib/lenis'

gsap.registerPlugin(ScrollTrigger)

const FILM_GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`

/** Desktop: viewport heights to pin while beats scrub (4 beats × ~1vh scroll each) */
const DESKTOP_PIN_SCROLL_VH = 300

export default function PhotoWorldIntro() {
  const lenis = useLenis()
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const beat1Ref = useRef<HTMLDivElement>(null)
  const beat2Ref = useRef<HTMLDivElement>(null)
  const beat3Ref = useRef<HTMLDivElement>(null)
  const beat4Ref = useRef<HTMLDivElement>(null)

  const [inView, setInView] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    if (!section || !pin || !lenis) return

    const beats = [
      beat1Ref.current,
      beat2Ref.current,
      beat3Ref.current,
      beat4Ref.current,
    ].filter((el): el is HTMLDivElement => el !== null)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(max-width: 768px)', () => {
        beats.forEach((el) => gsap.set(el, { opacity: 0 }))

        beats.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'top 55%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        })
      })

      mm.add('(min-width: 769px)', () => {
        const [b1, b2, b3, b4] = beats
        if (!b1 || !b2 || !b3 || !b4) return

        gsap.set([b1, b2, b3, b4], { opacity: 0 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin,
            start: 'top top',
            end: `+=${DESKTOP_PIN_SCROLL_VH}%`,
            scrub: 1.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // Four beats across pinned scroll — each fades in, then out (incl. beat 4)
        tl.fromTo(b1, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
          .to(b1, { opacity: 0, duration: 0.15 }, 0.22)
          .fromTo(b2, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.25)
          .to(b2, { opacity: 0, duration: 0.15 }, 0.47)
          .fromTo(b3, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.5)
          .to(b3, { opacity: 0, duration: 0.15 }, 0.72)
          .fromTo(b4, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.75)
          .to(b4, { opacity: 0, duration: 0.15 }, 0.92)
      })

      ScrollTrigger.refresh()
    }, section)

    return () => ctx.revert()
  }, [lenis])

  return (
    <section
      id="photo-world"
      ref={sectionRef}
      className="relative w-full bg-charcoal overflow-hidden"
    >
      <div
        ref={pinRef}
        className="relative w-full min-h-screen h-screen pointer-events-none"
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-5%',
            left: '-15%',
            width: '70%',
            height: '50%',
            background:
              'radial-gradient(ellipse, rgba(80,200,120,0.05) 0%, transparent 70%)',
            zIndex: 0,
          }}
        />

        {/* PhotoWorldCamera 3D scene — Part 2 */}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 5,
            backgroundImage: FILM_GRAIN_BG,
            opacity: 0.025,
          }}
        />

        <div className="absolute inset-0 z-10 pointer-events-none">
          <div
            ref={beat1Ref}
            className="
              relative w-full min-h-screen flex items-center justify-start px-6 py-24
              md:absolute md:inset-0 md:min-h-0 md:py-0 md:z-10
              lg:px-16 xl:px-24
            "
          >
            <div style={{ maxWidth: '480px' }}>
              <div className="story-eyebrow">Still Frame</div>
              <h2 className="story-heading">
                The Art of
                <br />
                <em>Freezing Time</em>
              </h2>
              <p className="story-body">
                Every photograph is a decision made in a fraction of a second.
                Light, composition, emotion — captured before the moment
                disappears.
              </p>
            </div>
          </div>

          <div
            ref={beat2Ref}
            className="
              relative w-full min-h-screen flex items-center justify-end px-6 py-24 text-right
              md:absolute md:inset-0 md:min-h-0 md:py-0 md:z-20
              lg:px-16 xl:px-24
            "
          >
            <div style={{ maxWidth: '480px' }}>
              <div
                className="story-eyebrow"
                style={{ justifyContent: 'flex-end' }}
              >
                Through the Lens
              </div>
              <h2 className="story-heading">
                Light.
                <br />
                <em>Composition.</em>
                <br />
                Story.
              </h2>
              <p className="story-body" style={{ marginLeft: 'auto' }}>
                The camera sees what the eye overlooks. We train it to find
                beauty in the unnoticed, the fleeting, the real.
              </p>
            </div>
          </div>

          <div
            ref={beat3Ref}
            className="
              relative w-full min-h-screen flex items-center justify-center px-6 py-24 text-center
              md:absolute md:inset-0 md:min-h-0 md:py-0 md:z-30
            "
          >
            <div style={{ maxWidth: '540px' }}>
              <div
                className="story-eyebrow"
                style={{ justifyContent: 'center' }}
              >
                The Detail
              </div>
              <h2 className="story-heading">
                Every frame
                <br />
                is <em>intentional</em>
              </h2>
              <p className="story-body" style={{ margin: '0 auto' }}>
                From aperture to composition — each choice shapes how your story
                will be remembered.
              </p>
            </div>
          </div>

          <div
            ref={beat4Ref}
            className="
              relative w-full min-h-screen flex items-center justify-center px-6 py-24 text-center
              md:absolute md:inset-0 md:min-h-0 md:py-0 md:z-40
            "
          >
            <div style={{ maxWidth: '540px' }}>
              <div
                className="story-eyebrow"
                style={{ justifyContent: 'center' }}
              >
                AV Films · Photography
              </div>
              <h2 className="story-heading">
                Your moment,
                <br />
                our <em>creativity</em>
              </h2>
              <p className="story-body" style={{ margin: '0 auto' }}>
                Scroll to explore our product photography — or continue the
                journey below.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed top-6 left-4 md:left-8 pointer-events-none transition-opacity duration-500 font-mono uppercase tracking-[0.3em] text-[8px] text-avEmerald"
        style={{
          zIndex: 20,
          opacity: inView ? 0.7 : 0,
        }}
      >
        02 · Photo World
      </div>
    </section>
  )
}
