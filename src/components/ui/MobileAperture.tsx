'use client'

const BLADE_COUNT = 6

interface MobileApertureProps {
  openAmount: number
  visible?: boolean
}

export default function MobileAperture({
  openAmount,
  visible = true,
}: MobileApertureProps) {
  const bladeRotate = openAmount * 38
  const bladeOut = openAmount * 32
  const glowOpacity = 0.2 + openAmount * 0.8
  const groupRotate = openAmount * 24

  return (
    <div
      className="mobile-aperture-wrap"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <div className="mobile-aperture-ambient" />

      <div
        className="mobile-aperture"
        style={{ transform: `rotate(${groupRotate}deg)` }}
      >
        {Array.from({ length: BLADE_COUNT }).map((_, i) => {
          const angle = (i / BLADE_COUNT) * 360
          return (
            <div
              key={i}
              className="mobile-aperture-blade"
              style={{
                transform: `rotate(${angle}deg) translateY(${-bladeOut}px) rotate(${bladeRotate}deg)`,
              }}
            />
          )
        })}

        <div
          className="mobile-aperture-glow"
          style={{ opacity: glowOpacity }}
        />
        <div className="mobile-aperture-ring-emerald" />
        <div className="mobile-aperture-ring-gold" />
      </div>
    </div>
  )
}