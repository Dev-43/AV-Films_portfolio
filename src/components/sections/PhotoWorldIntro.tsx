'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/lib/lenis'

gsap.registerPlugin(ScrollTrigger)

const FILM_GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`

/** Desktop: viewport heights to pin while beats scrub (4 beats × ~1vh scroll each) */
const DESKTOP_PIN_SCROLL_VH = 300

const beatContent = [
  {
    eyebrow: 'Still Frame',
    heading: 'The Art of<br /><em>Freezing Time</em>',
    body: 'Every photograph is a decision made in a fraction of a second. Light, composition, emotion — captured before the moment disappears.',
  },
  {
    eyebrow: 'Through the Lens',
    heading: 'Light.<br /><em>Composition.</em><br />Story.',
    body: 'The camera sees what the eye overlooks. We train it to find beauty in the unnoticed, the fleeting, the real.',
  },
  {
    eyebrow: 'The Detail',
    heading: 'Every frame<br />is <em>intentional</em>',
    body: 'From aperture to composition — each choice shapes how your story will be remembered.',
  },
  {
    eyebrow: 'AV Films · Photography',
    heading: 'Your moment,<br />our <em>creativity</em>',
    body: 'Scroll to explore our product photography — or continue the journey below.',
  },
]

export default function PhotoWorldIntro() {
  const lenis = useLenis()
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const beat1Ref = useRef<HTMLDivElement>(null)
  const beat2Ref = useRef<HTMLDivElement>(null)
  const beat3Ref = useRef<HTMLDivElement>(null)
  const beat4Ref = useRef<HTMLDivElement>(null)
  const mobileBeat1Ref = useRef<HTMLDivElement>(null)
  const mobileBeat2Ref = useRef<HTMLDivElement>(null)
  const mobileBeat3Ref = useRef<HTMLDivElement>(null)
  const mobileBeat4Ref = useRef<HTMLDivElement>(null)
  const mobileBeatsRefs = useMemo(
    () => [mobileBeat1Ref, mobileBeat2Ref, mobileBeat3Ref, mobileBeat4Ref],
    []
  )
  const isMobileRef = useRef(false)

  const [inView, setInView] = useState(false)
  const [layoutKey, setLayoutKey] = useState(0)

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
    const mq = window.matchMedia('(max-width: 768px)')
    isMobileRef.current = mq.matches

    const handleMqChange = (e: MediaQueryListEvent) => {
      isMobileRef.current = e.matches
      setLayoutKey((k) => k + 1)
    }

    mq.addEventListener('change', handleMqChange)
    return () => mq.removeEventListener('change', handleMqChange)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !lenis) return

    const ctx = gsap.context(() => {
      if (isMobileRef.current) {
        mobileBeatsRefs.forEach((ref) => {
          if (!ref.current) return
          gsap.fromTo(
            ref.current,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              scrollTrigger: {
                trigger: ref.current,
                start: 'top 75%',
                end: 'top 35%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        })
      } else {
        const pin = pinRef.current
        const b1 = beat1Ref.current
        const b2 = beat2Ref.current
        const b3 = beat3Ref.current
        const b4 = beat4Ref.current
        if (!pin || !b1 || !b2 || !b3 || !b4) return

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

        tl.fromTo(b1, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
          .to(b1, { opacity: 0, duration: 0.15 }, 0.22)
          .fromTo(b2, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.25)
          .to(b2, { opacity: 0, duration: 0.15 }, 0.47)
          .fromTo(b3, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.5)
          .to(b3, { opacity: 0, duration: 0.15 }, 0.72)
          .fromTo(b4, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.75)
          .to(b4, { opacity: 0, duration: 0.15 }, 0.92)
      }

      ScrollTrigger.refresh()
    }, section)

    return () => ctx.revert()
  }, [lenis, layoutKey, mobileBeatsRefs])

  return (
    <section
      id="photo-world"
      ref={sectionRef}
      className="relative w-full bg-charcoal overflow-hidden"
      style={{ minHeight: '400vh' }}
    >
      {/* Mobile layout — natural document flow */}
      <div className="block md:hidden">
        {beatContent.map((beat, i) => (
          <div
            key={i}
            ref={mobileBeatsRefs[i]}
            className="min-h-screen flex items-center px-6 py-16"
          >
            <div>
              <div className="story-eyebrow">{beat.eyebrow}</div>
              <h2
                className="story-heading"
                dangerouslySetInnerHTML={{ __html: beat.heading }}
              />
              <p className="story-body">{beat.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop layout — pinned scroll scrub */}
      <div
        ref={pinRef}
        className="hidden md:block relative w-full min-h-screen h-screen pointer-events-none"
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
            className="absolute inset-0 z-10 flex items-center justify-start px-6 lg:px-16 xl:px-24"
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
            className="absolute inset-0 z-20 flex items-center justify-end px-6 text-right lg:px-16 xl:px-24"
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
            className="absolute inset-0 z-30 flex items-center justify-center px-6 text-center"
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
            className="absolute inset-0 z-40 flex items-center justify-center px-6 text-center"
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
