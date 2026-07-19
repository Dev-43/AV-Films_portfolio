import type { ReactNode } from 'react'

type SectionShellProps = {
  id: string
  label?: string
  bgClass: string
  minHeightClass?: string
  children?: ReactNode
}

export default function SectionShell({
  id,
  label,
  bgClass,
  minHeightClass = 'min-h-screen',
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`w-full max-w-full min-w-0 overflow-x-hidden flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 ${minHeightClass} ${bgClass}`}
    >
      {children}
    </section>
  )
}
