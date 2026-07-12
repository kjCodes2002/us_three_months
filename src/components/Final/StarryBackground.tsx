import { useMemo } from 'react'

export function StarryBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, (_, id) => ({
        id,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.8 + 0.4,
        opacity: Math.random() * 0.45 + 0.25,
      })),
    [],
  )

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
