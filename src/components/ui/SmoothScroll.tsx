'use client'

import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)

export function useLenisContext() {
  return useContext(LenisContext)
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  const lenisRef = useRef<Lenis | null>(null)
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) =>
        Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = instance
    queueMicrotask(() => setLenis(instance))

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && typeof value === 'number') {
          instance.scrollTo(value, { immediate: true })
        }
        return instance.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
    })

    const onScroll = () => ScrollTrigger.update()
    instance.on('scroll', onScroll)

    const onRefresh = () => instance.resize()
    ScrollTrigger.addEventListener('refresh', onRefresh)

    const onTick = (time: number) => {
      instance.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      instance.off('scroll', onScroll)
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      ScrollTrigger.scrollerProxy(document.documentElement, {})
      gsap.ticker.remove(onTick)
      instance.destroy()
      lenisRef.current = null
      queueMicrotask(() => setLenis(null))
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}
