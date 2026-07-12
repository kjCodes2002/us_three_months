import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

interface FloatingParticlesProps {
  count?: number
}

export function FloatingParticles({ count }: FloatingParticlesProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isMobile = useMediaQuery('(max-width: 639px)')
  const particleCount = count ?? (prefersReducedMotion ? 0 : isMobile ? 12 : 28)

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: particleCount }, (_, id) => ({
        id,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 18 + 22,
        delay: Math.random() * 6,
      })),
    [particleCount],
  )

  if (particleCount === 0) return null

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-accent/25 will-change-transform"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 8, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
