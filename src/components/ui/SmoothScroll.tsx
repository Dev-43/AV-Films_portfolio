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

    const onTick = (time: number) => {
      instance.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
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
