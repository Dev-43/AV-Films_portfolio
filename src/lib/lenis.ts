'use client'

import { useLenisContext } from '@/components/ui/SmoothScroll'
import type Lenis from 'lenis'

export function useLenis(): Lenis | null {
  return useLenisContext()
}
