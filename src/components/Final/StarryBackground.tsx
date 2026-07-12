import { useMemo } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export function StarryBackground() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isMobile = useMediaQuery('(max-width: 639px)')
  const starCount = prefersReducedMotion ? 0 : isMobile ? 45 : 90

  const stars = useMemo(
    () =>
      Array.from({ length: starCount }, (_, id) => ({
        id,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.8 + 0.4,
        opacity: Math.random() * 0.45 + 0.25,
      })),
    [starCount],
  )

  if (starCount === 0) return <div aria-hidden className="pointer-events-none fixed inset-0 bg-[#050508]" />

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 bg-[#050508]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.04)_0%,transparent_60%)]" />
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  )
}
